import React, { useEffect, useRef, useCallback } from 'react';
import { MotionValue, useMotionValueEvent } from 'framer-motion';
import { worldPopulationData } from './worldPopulation';
import './globe.css';
import './index.css';

interface GlobeWrapperProps {
  scrollYProgress: MotionValue<number>;
}

export function GlobeWrapper({ scrollYProgress }: GlobeWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const animFrameRef = useRef<number>(0);
  const progressRef = useRef(0);

  const buildArcs = useCallback((progress: number) => {
    if (progress < 0.3) return [];
    const threshold = Math.floor((progress - 0.3) / 0.7 * 30);
    const arcs = [];
    const cities = worldPopulationData.slice(0, 30);
    for (let i = 0; i < Math.min(threshold, cities.length - 1); i++) {
      arcs.push({
        startLat: cities[i].lat,
        startLng: cities[i].lng,
        endLat: cities[(i + 3) % cities.length].lat,
        endLng: cities[(i + 3) % cities.length].lng,
        color: ['rgba(168,85,247,0.6)', 'rgba(192,132,252,0.3)'],
      });
    }
    return arcs;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    let globe: any;

    const init = async () => {
      const GlobeModule = await import('globe.gl');
      const Globe = GlobeModule.default;

      globe = Globe({ animateIn: false })(containerRef.current!);
      globeRef.current = globe;

      globe
        .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
        .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(true)
        .atmosphereColor('rgba(100,50,200,0.4)')
        .atmosphereAltitude(0.15)
        .width(containerRef.current!.clientWidth || 800)
        .height(containerRef.current!.clientHeight || 800)
        .pointsData(worldPopulationData)
        .pointLat('lat')
        .pointLng('lng')
        .pointColor(() => 'rgba(192,132,252,0.85)')
        .pointAltitude(d => (d as any).pop / 40000000 * 0.06)
        .pointRadius(d => Math.sqrt((d as any).pop) / 3200)
        .pointsMerge(false)
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
      cancelAnimationFrame(animFrameRef.current);
      if (globeRef.current) {
        globeRef.current._destructor?.();
        globeRef.current = null;
      }
    };
  }, [buildArcs]);

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    progressRef.current = progress;
    if (!globeRef.current) return;

    const globe = globeRef.current;

    const altitude = 2.2 - progress * 0.6;
    globe.pointOfView({ lat: 5, lng: 20, altitude: Math.max(1.4, altitude) }, 300);

    const arcs = buildArcs(progress);
    globe.arcsData(arcs);

    const atmoIntensity = 0.15 + progress * 0.25;
    globe.atmosphereAltitude(atmoIntensity);

    const speed = 0.4 + progress * 0.8;
    if (globe.controls()) {
      globe.controls().autoRotateSpeed = speed;
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
