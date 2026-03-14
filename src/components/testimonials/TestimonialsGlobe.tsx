import { useEffect, useRef } from 'react';
import { worldPopulationData } from '../HeroStory/Globe/worldPopulation';
import { isMobileDevice } from '../../hooks/useIsMobile';

const CITIES = worldPopulationData;
const ARC_COLORS = [
  ['rgba(192,132,252,1)', 'rgba(168,85,247,0.85)'],
  ['rgba(139,92,246,0.95)', 'rgba(167,139,250,0.8)'],
  ['rgba(216,180,254,1)', 'rgba(192,132,252,0.85)'],
];
const EMPTY_ARCS: object[] = [];
const EMPTY_POINTS: object[] = [];

const ARC_START_DELAY = 2200;
const ARC_BUILD_INTERVAL = 220;

function buildArcs(threshold: number, tier: 'a' | 'ab' | 'abc'): object[] {
  const len = CITIES.length;
  const arcsA: object[] = [];
  const arcsB: object[] = [];
  const arcsC: object[] = [];
  for (let i = 0; i < threshold; i++) {
    arcsA.push({
      startLat: CITIES[i].lat, startLng: CITIES[i].lng,
      endLat: CITIES[(i + 2) % len].lat, endLng: CITIES[(i + 2) % len].lng,
      color: ARC_COLORS[0],
    });
    arcsB.push({
      startLat: CITIES[i].lat, startLng: CITIES[i].lng,
      endLat: CITIES[(i + 4) % len].lat, endLng: CITIES[(i + 4) % len].lng,
      color: ARC_COLORS[1],
    });
    if (i % 2 === 0) {
      arcsC.push({
        startLat: CITIES[i].lat, startLng: CITIES[i].lng,
        endLat: CITIES[(i + 7) % len].lat, endLng: CITIES[(i + 7) % len].lng,
        color: ARC_COLORS[2],
      });
    }
  }
  if (tier === 'a') return arcsA;
  if (tier === 'ab') return [...arcsA, ...arcsB];
  return [...arcsA, ...arcsB, ...arcsC];
}

const POINTS = CITIES.map((c) => ({
  lat: c.lat, lng: c.lng, size: 0.6, color: 'rgba(216,180,254,0.95)',
}));

function disposeThreeScene(globe: any) {
  try {
    const renderer = globe.renderer?.();
    if (renderer) {
      renderer.setAnimationLoop(null);
      renderer.dispose();
      renderer.forceContextLoss();
      const canvas = renderer.domElement;
      if (canvas?.parentNode) canvas.parentNode.removeChild(canvas);
    }
    const scene = globe.scene?.();
    if (scene) {
      scene.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m: any) => { m.map?.dispose(); m.dispose(); });
          else { obj.material.map?.dispose(); obj.material.dispose(); }
        }
      });
      scene.clear();
    }
    globe._destructor?.();
  } catch (_) {}
}

export function TestimonialsGlobe({ isVisible }: { isVisible: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const destroyedRef = useRef(false);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const arcTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Pause/resume globe when visibility changes
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    const controls = globe.controls?.();
    if (controls) controls.autoRotate = isVisible;
    const renderer = globe.renderer?.();
    if (!renderer) return;
    if (isVisible) {
      renderer.setAnimationLoop(() => globe.renderer().render(globe.scene(), globe.camera()));
    } else {
      renderer.setAnimationLoop(null);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!containerRef.current) return;
    destroyedRef.current = false;
    const mobile = isMobileDevice();

    import('globe.gl').then((GlobeModule) => {
      if (destroyedRef.current || !containerRef.current) return;
      const Globe = GlobeModule.default;
      const globe = Globe({ animateIn: false })(containerRef.current!);
      globeRef.current = globe;

      const w = containerRef.current!.clientWidth || 300;
      const h = containerRef.current!.clientHeight || 300;

      globe
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(true)
        .atmosphereColor('rgba(140,80,230,0.7)')
        .atmosphereAltitude(0.18)
        .width(w)
        .height(h);

      globe
        .heatmapPointLat('lat')
        .heatmapPointLng('lng')
        .heatmapPointWeight('pop')
        .heatmapBandwidth(1.0)
        .heatmapColorSaturation(3.2)
        .heatmapsData([CITIES])
        .arcColor('color')
        .arcDashLength(0.5)
        .arcDashGap(0.1)
        .arcDashAnimateTime(1400)
        .arcStroke(mobile ? 1.5 : 2.0)
        .arcsTransitionDuration(400)
        .arcsData(EMPTY_ARCS);

      globe
        .pointLat('lat')
        .pointLng('lng')
        .pointColor('color')
        .pointAltitude(0.01)
        .pointRadius('size')
        .pointsMerge(true)
        .pointsData(EMPTY_POINTS);

      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableRotate = false;

      globe.pointOfView({ lat: 0, lng: 20, altitude: 1.6 });

      const renderer = globe.renderer?.();
      if (renderer) {
        renderer.setPixelRatio(mobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
      }

      globe.globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg');

      const maxThreshold = CITIES.length;
      const timers: ReturnType<typeof setTimeout>[] = [];

      const t0 = setTimeout(() => {
        if (destroyedRef.current || !globeRef.current) return;
        globeRef.current.pointsData(POINTS);
      }, ARC_START_DELAY - 200);
      timers.push(t0);

      for (let threshold = 1; threshold <= maxThreshold; threshold++) {
        const delay = ARC_START_DELAY + (threshold - 1) * ARC_BUILD_INTERVAL;
        const snap = threshold;
        const t = setTimeout(() => {
          if (destroyedRef.current || !globeRef.current) return;
          const tier: 'a' | 'ab' | 'abc' =
            snap > maxThreshold * 0.6 ? 'abc' :
            snap > maxThreshold * 0.3 ? 'ab' : 'a';
          globeRef.current.arcsData(buildArcs(snap, tier));
        }, delay);
        timers.push(t);
      }

      arcTimersRef.current = timers;
    });

    return () => {
      destroyedRef.current = true;
      arcTimersRef.current.forEach(clearTimeout);
      arcTimersRef.current = [];
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      if (globeRef.current) {
        disposeThreeScene(globeRef.current);
        globeRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => {
        if (globeRef.current && containerRef.current) {
          globeRef.current
            .width(containerRef.current.clientWidth)
            .height(containerRef.current.clientHeight);
        }
      }, 300);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'transparent', contain: 'strict' }}
    />
  );
}
