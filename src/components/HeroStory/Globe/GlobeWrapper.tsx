import { useEffect, useRef, useCallback } from 'react';
import { MotionValue, useMotionValueEvent } from 'framer-motion';
import { worldPopulationData } from './worldPopulation';
import { isMobileDevice } from '../../../hooks/useIsMobile';

interface GlobeWrapperProps {
  scrollYProgress: MotionValue<number>;
  isVisible?: boolean;
}

const CITIES = worldPopulationData.slice(0, 15);
const ARC_START = 0.15;
const SCROLL_THRESHOLD = 0.02;

function getArcThreshold(progress: number): number {
  if (progress < ARC_START) return 0;
  return Math.min(Math.floor(((progress - ARC_START) / (1 - ARC_START)) * CITIES.length), CITIES.length - 1);
}

const arcCache = new Map<number, object[]>();
function buildArcs(progress: number): object[] {
  const threshold = getArcThreshold(progress);
  if (threshold === 0) return [];
  if (arcCache.has(threshold)) return arcCache.get(threshold)!;
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
  arcCache.set(threshold, arcs);
  return arcs;
}

export function GlobeWrapper({ scrollYProgress, isVisible = true }: GlobeWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);
  const pendingProgressRef = useRef<number | null>(null);
  const lastArcThresholdRef = useRef<number>(-1);
  const lastProgressRef = useRef<number>(0);
  const mobileRef = useRef(isMobileDevice());
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animLoopRef = useRef<((t: number) => void) | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const mobile = mobileRef.current;
    let destroyed = false;

    const init = async () => {
      const GlobeModule = await import('globe.gl');
      if (destroyed) return;
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
          .heatmapsData([worldPopulationData.slice(0, 30)])
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

      const renderer = globe.renderer?.();
      if (renderer) {
        if (mobile) renderer.setPixelRatio(1);
        else renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        animLoopRef.current = renderer.setAnimationLoop
          ? renderer.setAnimationLoop.bind(renderer)
          : null;
      }
    };

    init();

    return () => {
      destroyed = true;
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (globeRef.current) {
        const renderer = globeRef.current.renderer?.();
        if (renderer) {
          renderer.setAnimationLoop(null);
          renderer.dispose();
          renderer.forceContextLoss();
        }
        globeRef.current._destructor?.();
        globeRef.current = null;
      }
    };
  }, []);

  const handleResize = useCallback(() => {
    if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
    resizeTimerRef.current = setTimeout(() => {
      if (globeRef.current && containerRef.current) {
        globeRef.current
          .width(containerRef.current.clientWidth)
          .height(containerRef.current.clientHeight);
      }
    }, 300);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    if (controls) controls.autoRotate = isVisible;

    const renderer = globeRef.current.renderer?.();
    if (renderer) {
      if (!isVisible) {
        renderer.setAnimationLoop(null);
      } else {
        const scene = globeRef.current.scene?.();
        const camera = globeRef.current.camera?.();
        if (scene && camera) {
          renderer.setAnimationLoop(() => renderer.render(scene, camera));
        }
      }
    }
  }, [isVisible]);

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (!isVisible) return;
    if (Math.abs(progress - lastProgressRef.current) < SCROLL_THRESHOLD) return;

    pendingProgressRef.current = progress;
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const p = pendingProgressRef.current;
      if (p === null || !globeRef.current) return;

      lastProgressRef.current = p;
      const mobile = mobileRef.current;
      const globe = globeRef.current;
      const newAltitude = Math.max(1.2, 2.2 - p * 0.8);

      globe.pointOfView({ lat: 5, lng: 20, altitude: newAltitude }, 400);
      if (!mobile) {
        globe.atmosphereAltitude(0.15 + p * 0.35);
      }
      const controls = globe.controls();
      if (controls) controls.autoRotateSpeed = (mobile ? 0.3 : 0.4) + p * (mobile ? 0.6 : 1.2);

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
      style={{ background: 'transparent', contain: 'strict' }}
    />
  );
}
