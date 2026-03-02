import React, { useEffect, useRef, useCallback } from 'react';
import { MotionValue, useMotionValueEvent } from 'framer-motion';
import { worldPopulationData } from './worldPopulation';
import './globe.css';

interface GlobeWrapperProps {
  scrollYProgress: MotionValue<number>;
}

const heatmapColorFn = (t: number) => {
  const colors = [
    [0, 0, 0, 0],
    [0.1, 0, 0.3, 0.3],
    [0.3, 0, 0.6, 0.5],
    [0.5, 0.1, 0.8, 0.7],
    [0.75, 0.3, 1, 0.85],
    [1, 0.5, 1, 1],
  ];
  const idx = Math.floor(t * (colors.length - 1));
  const nextIdx = Math.min(idx + 1, colors.length - 1);
  const blend = t * (colors.length - 1) - idx;
  const color = colors[idx].map((c, i) => c + (colors[nextIdx][i] - c) * blend);
  return `rgba(${Math.round(color[0] * 255)}, ${Math.round(color[1] * 255)}, ${Math.round(color[2] * 255)}, ${color[3]})`;
};

const CITIES = worldPopulationData.slice(0, 30);

const buildArcs = (threshold: number) => {
  return Array.from({ length: Math.min(threshold, CITIES.length - 1) }, (_, i) => ({
    startLat: CITIES[i].lat,
    startLng: CITIES[i].lng,
    endLat: CITIES[(i + 3) % CITIES.length].lat,
    endLng: CITIES[(i + 3) % CITIES.length].lng,
    color: ['rgba(168,85,247,0.9)', 'rgba(192,132,252,0.6)'],
  }));
};

export function GlobeWrapper({ scrollYProgress }: GlobeWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const lastThresholdRef = useRef<number>(-1);
  const rafRef = useRef<number | null>(null);
  const pendingProgressRef = useRef<number | null>(null);

  const applyProgress = useCallback((progress: number) => {
    const globe = globeRef.current;
    if (!globe) return;

    globe.pointOfView({ lat: 5, lng: 20, altitude: Math.max(1.4, 2.2 - progress * 0.6) }, 300);
    globe.atmosphereAltitude(0.15 + progress * 0.25);
    if (globe.controls()) {
      globe.controls().autoRotateSpeed = 0.4 + progress * 0.8;
    }

    if (progress >= 0.3) {
      const threshold = Math.floor(((progress - 0.3) / 0.7) * 30);
      if (threshold !== lastThresholdRef.current) {
        lastThresholdRef.current = threshold;
        globe.arcsData(buildArcs(threshold));
      }
    } else if (lastThresholdRef.current !== 0) {
      lastThresholdRef.current = 0;
      globe.arcsData([]);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    const init = async () => {
      const GlobeModule = await import('globe.gl');
      if (cancelled) return;

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
        .heatmapColorFn(heatmapColorFn)
        .heatmapsData([worldPopulationData])
        .arcsData([])
        .arcColor('color')
        .arcDashLength(0.4)
        .arcDashGap(0.2)
        .arcDashAnimateTime(1500)
        .arcStroke(1.2);

      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.4;
      globe.controls().enableZoom = false;
      globe.controls().enablePan = false;
      globe.controls().enableRotate = false;

      globe.pointOfView({ lat: 5, lng: 20, altitude: 2.2 });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!globeRef.current) return;
          if (entry.isIntersecting) {
            globeRef.current.resumeAnimation?.();
          } else {
            globeRef.current.pauseAnimation?.();
          }
        },
        { threshold: 0.05 }
      );
      if (containerRef.current) observer.observe(containerRef.current);

      const handleResize = () => {
        if (globeRef.current && containerRef.current) {
          globeRef.current
            .width(containerRef.current.clientWidth)
            .height(containerRef.current.clientHeight);
        }
      };
      window.addEventListener('resize', handleResize);

      return () => {
        observer.disconnect();
        window.removeEventListener('resize', handleResize);
      };
    };

    const cleanup = init();

    return () => {
      cancelled = true;
      cleanup.then((fn) => fn?.());
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
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
      if (pendingProgressRef.current !== null) {
        applyProgress(pendingProgressRef.current);
        pendingProgressRef.current = null;
      }
    });
  });

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
}
