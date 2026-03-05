import React, { useEffect, useRef } from 'react';
import { MotionValue, useMotionValueEvent } from 'framer-motion';
import { worldPopulationData } from './worldPopulation';
import { isMobileDevice } from '../../../hooks/useIsMobile';
import './globe.css';

interface GlobeWrapperProps {
  scrollYProgress: MotionValue<number>;
}

const heatmapColorFn = (t: number) => {
  if (t == null || isNaN(t)) return 'rgba(0,0,0,0)';
  const safeT = Math.max(0, Math.min(1, t));
  const colors = [
    [0, 0, 0, 0],
    [0.1, 0, 0.3, 0.3],
    [0.3, 0, 0.6, 0.5],
    [0.5, 0.1, 0.8, 0.7],
    [0.75, 0.3, 1, 0.85],
    [1, 0.5, 1, 1],
  ] as number[][];
  const idx = Math.floor(safeT * (colors.length - 1));
  const nextIdx = Math.min(idx + 1, colors.length - 1);
  const blend = safeT * (colors.length - 1) - idx;
  const color = colors[idx].map((c, i) => c + (colors[nextIdx][i] - c) * blend);
  return `rgba(${Math.round(color[0] * 255)}, ${Math.round(color[1] * 255)}, ${Math.round(color[2] * 255)}, ${color[3]})`;
};

const CITIES = worldPopulationData.slice(0, 20);

const ARC_START = 0.15;

function getArcThreshold(progress: number): number {
  if (progress < ARC_START) return 0;
  return Math.min(Math.floor(((progress - ARC_START) / (1 - ARC_START)) * CITIES.length), CITIES.length - 1);
}

const buildArcs = (() => {
  const cache = new Map<number, object[]>();
  return (progress: number) => {
    const threshold = getArcThreshold(progress);
    if (threshold === 0) return [];
    if (cache.has(threshold)) return cache.get(threshold)!;
    const arcs: object[] = [];
    for (let i = 0; i < threshold; i++) {
      arcs.push({
        startLat: CITIES[i].lat,
        startLng: CITIES[i].lng,
        endLat: CITIES[(i + 3) % CITIES.length].lat,
        endLng: CITIES[(i + 3) % CITIES.length].lng,
        color: ['rgba(168,85,247,0.9)', 'rgba(192,132,252,0.6)'],
      });
      if (progress > 0.5 && i < threshold - 1) {
        arcs.push({
          startLat: CITIES[i].lat,
          startLng: CITIES[i].lng,
          endLat: CITIES[(i + 5) % CITIES.length].lat,
          endLng: CITIES[(i + 5) % CITIES.length].lng,
          color: ['rgba(139,92,246,0.7)', 'rgba(167,139,250,0.4)'],
        });
      }
    }
    cache.set(threshold, arcs);
    return arcs;
  };
})();

export function GlobeWrapper({ scrollYProgress }: GlobeWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);
  const pendingProgressRef = useRef<number | null>(null);
  const lastArcThresholdRef = useRef<number>(-1);
  const lastAltitudeRef = useRef<number>(2.2);

  useEffect(() => {
    if (!containerRef.current) return;

    const mobile = isMobileDevice();

    const init = async () => {
      const GlobeModule = await import('globe.gl');
      const Globe = GlobeModule.default;

      const globe = Globe({ animateIn: false })(containerRef.current!);
      globeRef.current = globe;

      const w = containerRef.current!.clientWidth || 800;
      const h = containerRef.current!.clientHeight || 800;

      globe
        .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg')
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(true)
        .atmosphereColor('rgba(120,60,220,0.5)')
        .atmosphereAltitude(mobile ? 0.1 : 0.15)
        .width(w)
        .height(h);

      if (!mobile) {
        globe
          .heatmapPointLat('lat')
          .heatmapPointLng('lng')
          .heatmapPointWeight('pop')
          .heatmapBandwidth(0.9)
          .heatmapColorSaturation(2.8)
          .heatmapsData([worldPopulationData])
          .arcColor('color')
          .arcDashLength(0.4)
          .arcDashGap(0.2)
          .arcDashAnimateTime(1500)
          .arcStroke(1.2);
      }

      globe.arcsData([]);

      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = mobile ? 0.3 : 0.4;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableRotate = false;

      globe.pointOfView({ lat: 5, lng: 20, altitude: 2.2 });

      if (mobile) {
        const renderer = globe.renderer?.();
        if (renderer) renderer.setPixelRatio(1);
      }
    };

    init();

    const handleResize = () => {
      if (globeRef.current && containerRef.current) {
        globeRef.current
          .width(containerRef.current.clientWidth)
          .height(containerRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (globeRef.current) {
        globeRef.current._destructor?.();
        globeRef.current = null;
      }
    };
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    pendingProgressRef.current = progress;
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const p = pendingProgressRef.current;
      if (p === null || !globeRef.current) return;

      const mobile = isMobileDevice();
      const globe = globeRef.current;
      const newAltitude = Math.max(1.2, 2.2 - p * 0.8);

      if (Math.abs(newAltitude - lastAltitudeRef.current) > 0.01) {
        lastAltitudeRef.current = newAltitude;
        globe.pointOfView({ lat: 5, lng: 20, altitude: newAltitude }, 300);
        if (!mobile) {
          globe.atmosphereAltitude(0.15 + p * 0.35);
        }
        const controls = globe.controls();
        if (controls) controls.autoRotateSpeed = (mobile ? 0.3 : 0.4) + p * (mobile ? 0.6 : 1.2);
      }

      if (!mobile) {
        const newThreshold = getArcThreshold(p);
        if (newThreshold !== lastArcThresholdRef.current) {
          lastArcThresholdRef.current = newThreshold;
          globe.arcsData(buildArcs(p));
        }
      }
    });
  });

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'transparent', willChange: 'transform' }}
    />
  );
}
