import React, { useEffect, useRef } from 'react';
import { MotionValue, useMotionValueEvent } from 'framer-motion';
import { worldPopulationData } from './worldPopulation';
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

const buildArcs = (() => {
  const cache = new Map<number, object[]>();
  return (progress: number) => {
    if (progress < 0.3) return [];
    const threshold = Math.min(Math.floor(((progress - 0.3) / 0.7) * 15), CITIES.length - 1);
    if (cache.has(threshold)) return cache.get(threshold)!;
    const arcs = Array.from({ length: threshold }, (_, i) => ({
      startLat: CITIES[i].lat,
      startLng: CITIES[i].lng,
      endLat: CITIES[(i + 3) % CITIES.length].lat,
      endLng: CITIES[(i + 3) % CITIES.length].lng,
      color: ['rgba(168,85,247,0.9)', 'rgba(192,132,252,0.6)'],
    }));
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

    const init = async () => {
      const GlobeModule = await import('globe.gl');
      const Globe = GlobeModule.default;

      const globe = Globe({ animateIn: false })(containerRef.current!);
      globeRef.current = globe;

      globe
        .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg')
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(true)
        .atmosphereColor('rgba(120,60,220,0.5)')
        .atmosphereAltitude(0.15)
        .width(containerRef.current!.clientWidth || 800)
        .height(containerRef.current!.clientHeight || 800)
        .heatmapPointLat('lat')
        .heatmapPointLng('lng')
        .heatmapPointWeight('pop')
        .heatmapBandwidth(0.9)
        .heatmapColorSaturation(2.8)
        .heatmapsData([worldPopulationData])
        .arcsData([])
        .arcColor('color')
        .arcDashLength(0.4)
        .arcDashGap(0.2)
        .arcDashAnimateTime(1500)
        .arcStroke(1.2);

      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableRotate = false;

      globe.pointOfView({ lat: 5, lng: 20, altitude: 2.2 });
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

      const globe = globeRef.current;
      const newAltitude = Math.max(1.4, 2.2 - p * 0.6);

      if (Math.abs(newAltitude - lastAltitudeRef.current) > 0.01) {
        lastAltitudeRef.current = newAltitude;
        globe.pointOfView({ lat: 5, lng: 20, altitude: newAltitude }, 300);
        globe.atmosphereAltitude(0.15 + p * 0.25);
        const controls = globe.controls();
        if (controls) controls.autoRotateSpeed = 0.4 + p * 0.8;
      }

      const newThreshold = p < 0.3 ? 0 : Math.min(Math.floor(((p - 0.3) / 0.7) * 15), CITIES.length - 1);
      if (newThreshold !== lastArcThresholdRef.current) {
        lastArcThresholdRef.current = newThreshold;
        globe.arcsData(buildArcs(p));
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
