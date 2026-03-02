import React, { useEffect, useRef } from 'react';
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

const buildArcs = (progress: number) => {
  if (progress < 0.3) return [];
  const threshold = Math.floor(((progress - 0.3) / 0.7) * 30);
  const cities = worldPopulationData.slice(0, 30);
  return Array.from({ length: Math.min(threshold, cities.length - 1) }, (_, i) => ({
    startLat: cities[i].lat,
    startLng: cities[i].lng,
    endLat: cities[(i + 3) % cities.length].lat,
    endLng: cities[(i + 3) % cities.length].lng,
    color: ['rgba(168,85,247,0.6)', 'rgba(192,132,252,0.3)'],
  }));
};

export function GlobeWrapper({ scrollYProgress }: GlobeWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);

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
        .heatmapColorFn(heatmapColorFn)
        .heatmapsData([worldPopulationData])
        .arcsData([])
        .arcColor('color')
        .arcDashLength(0.4)
        .arcDashGap(0.2)
        .arcDashAnimateTime(1500)
        .arcStroke(0.4);

      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.4;
      globe.controls().enableZoom = false;
      globe.controls().enablePan = false;
      globe.controls().enableRotate = false;

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

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (globeRef.current) {
        globeRef.current._destructor?.();
        globeRef.current = null;
      }
    };
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (!globeRef.current) return;
    const globe = globeRef.current;

    globe.pointOfView({ lat: 5, lng: 20, altitude: Math.max(1.4, 2.2 - progress * 0.6) }, 300);
    globe.arcsData(buildArcs(progress));
    globe.atmosphereAltitude(0.15 + progress * 0.25);
    if (globe.controls()) {
      globe.controls().autoRotateSpeed = 0.4 + progress * 0.8;
    }
  });

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
}
