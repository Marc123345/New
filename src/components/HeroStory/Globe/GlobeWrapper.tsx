import { useEffect, useRef, useCallback } from 'react';
import { MotionValue, useMotionValueEvent } from 'motion/react';
import { worldPopulationData } from './worldPopulation';
import { isMobileDevice } from '../../../hooks/useIsMobile';

interface GlobeWrapperProps {
  scrollYProgress: MotionValue<number>;
  isVisible?: boolean;
  hideArcs?: boolean;
}

const TOP_CITIES = worldPopulationData.slice(0, 18);
const TOP_CITIES_MOBILE = worldPopulationData.slice(0, 10);
const HEATMAP_CITIES = worldPopulationData.slice(0, 30);
const HEATMAP_CITIES_MOBILE = worldPopulationData.slice(0, 14);
const ARC_START = 0.08;
const SCROLL_THRESHOLD = 0.02;

function getArcThreshold(progress: number, mobile: boolean): number {
  if (progress < ARC_START) return 0;
  const cities = mobile ? TOP_CITIES_MOBILE : TOP_CITIES;
  return Math.min(
    Math.floor(((progress - ARC_START) / (1 - ARC_START)) * cities.length),
    cities.length - 1
  );
}

const ARC_COLORS = [
  ['rgba(192,132,252,1)', 'rgba(168,85,247,0.85)'],
  ['rgba(139,92,246,0.95)', 'rgba(167,139,250,0.8)'],
  ['rgba(216,180,254,1)', 'rgba(192,132,252,0.85)'],
];
const EMPTY_ARCS: object[] = [];

const precomputedArcs = new Map<string, object[]>();
function initArcsForSet(cities: typeof TOP_CITIES, prefix: string) {
  const len = cities.length;
  for (let threshold = 1; threshold <= len; threshold++) {
    const arcsA: object[] = [];
    const arcsB: object[] = [];
    const arcsC: object[] = [];
    for (let i = 0; i < threshold; i++) {
      arcsA.push({
        startLat: cities[i].lat,
        startLng: cities[i].lng,
        endLat: cities[(i + 2) % len].lat,
        endLng: cities[(i + 2) % len].lng,
        color: ARC_COLORS[0],
      });
      arcsB.push({
        startLat: cities[i].lat,
        startLng: cities[i].lng,
        endLat: cities[(i + 4) % len].lat,
        endLng: cities[(i + 4) % len].lng,
        color: ARC_COLORS[1],
      });
      if (i % 2 === 0) {
        arcsC.push({
          startLat: cities[i].lat,
          startLng: cities[i].lng,
          endLat: cities[(i + 7) % len].lat,
          endLng: cities[(i + 7) % len].lng,
          color: ARC_COLORS[2],
        });
      }
    }
    precomputedArcs.set(`${prefix}${threshold}-a`, arcsA);
    precomputedArcs.set(`${prefix}${threshold}-ab`, [...arcsA, ...arcsB]);
    precomputedArcs.set(`${prefix}${threshold}-abc`, [...arcsA, ...arcsB, ...arcsC]);
  }
}
initArcsForSet(TOP_CITIES, 'd-');
initArcsForSet(TOP_CITIES_MOBILE, 'm-');

function getArcs(progress: number, mobile: boolean): object[] {
  const threshold = getArcThreshold(progress, mobile);
  if (threshold === 0) return EMPTY_ARCS;
  const prefix = mobile ? 'm-' : 'd-';
  let suffix: string;
  if (progress > 0.6) suffix = 'abc';
  else if (progress > 0.3) suffix = 'ab';
  else suffix = 'a';
  return precomputedArcs.get(`${prefix}${threshold}-${suffix}`) || EMPTY_ARCS;
}

function buildPointData(cities: typeof TOP_CITIES, count: number) {
  return cities.slice(0, count).map((c) => ({
    lat: c.lat,
    lng: c.lng,
    size: 0.6,
    color: 'rgba(216,180,254,0.95)',
  }));
}

const POINT_DATA_DESKTOP = buildPointData(TOP_CITIES, 18);
const POINT_DATA_MOBILE = buildPointData(TOP_CITIES_MOBILE, 10);
const EMPTY_POINTS: object[] = [];

function disposeThreeScene(globe: any) {
  try {
    const renderer = globe.renderer?.();
    if (renderer) {
      renderer.setAnimationLoop(null);
      renderer.dispose();
      renderer.forceContextLoss();
      const canvas = renderer.domElement;
      if (canvas?.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }

    const scene = globe.scene?.();
    if (scene) {
      scene.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m: any) => {
              m.map?.dispose();
              m.dispose();
            });
          } else {
            obj.material.map?.dispose();
            obj.material.dispose();
          }
        }
      });
      scene.clear();
    }

    globe._destructor?.();
  } catch (_) {}
}

export function GlobeWrapper({ scrollYProgress, isVisible = true, hideArcs = false }: GlobeWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const rafRef = useRef<number>(0);
  const lastArcThresholdRef = useRef<number>(-1);
  const lastArcTierRef = useRef<string>('');
  const lastProgressRef = useRef<number>(0);
  const mobileRef = useRef(isMobileDevice());
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const destroyedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    destroyedRef.current = false;

    const mobile = mobileRef.current;

    import('globe.gl').then((GlobeModule) => {
      if (destroyedRef.current || !containerRef.current) return;
      const Globe = GlobeModule.default;

      const globe = Globe({ animateIn: false })(containerRef.current!);
      globeRef.current = globe;

      const w = containerRef.current!.clientWidth || 800;
      const h = containerRef.current!.clientHeight || 800;

      globe
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(true)
        .atmosphereColor('rgba(140,80,230,0.6)')
        .atmosphereAltitude(mobile ? 0.12 : 0.18)
        .width(w)
        .height(h);

      globe
        .heatmapPointLat('lat')
        .heatmapPointLng('lng')
        .heatmapPointWeight('pop')
        .heatmapBandwidth(mobile ? 0.8 : 1.1)
        .heatmapColorSaturation(mobile ? 2.8 : 3.5)
        .heatmapsData([mobile ? HEATMAP_CITIES_MOBILE : HEATMAP_CITIES])
        .arcColor('color')
        .arcDashLength(mobile ? 0.6 : 0.5)
        .arcDashGap(mobile ? 0.15 : 0.1)
        .arcDashAnimateTime(mobile ? 1800 : 1200)
        .arcStroke(mobile ? 1.5 : 2.2)
        .arcsTransitionDuration(400);

      globe
        .pointLat('lat')
        .pointLng('lng')
        .pointColor('color')
        .pointAltitude(0.01)
        .pointRadius('size')
        .pointsMerge(true)
        .pointsData(EMPTY_POINTS);

      globe.arcsData(EMPTY_ARCS);

      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = mobile ? 0.3 : 0.4;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableRotate = false;

      globe.pointOfView({ lat: 5, lng: 20, altitude: mobile ? 2.8 : 2.2 });

      const renderer = globe.renderer?.();
      if (renderer) {
        renderer.setPixelRatio(mobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
      }

      globe.globeImageUrl(
        '//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg'
      );
    });

    return () => {
      destroyedRef.current = true;
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (globeRef.current) {
        disposeThreeScene(globeRef.current);
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
  }, [isVisible]);

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (!isVisible || !globeRef.current) return;
    if (Math.abs(progress - lastProgressRef.current) < SCROLL_THRESHOLD) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      if (!globeRef.current) return;

      lastProgressRef.current = progress;
      const mobile = mobileRef.current;
      const globe = globeRef.current;

      const startAlt = mobile ? 2.8 : 2.2;
      const zoomRange = mobile ? 0.5 : 0.8;
      const minAlt = mobile ? 1.8 : 1.2;
      const newAltitude = Math.max(minAlt, startAlt - progress * zoomRange);
      globe.pointOfView({ lat: 5, lng: 20, altitude: newAltitude }, 400);

      globe.atmosphereAltitude(
        mobile ? 0.12 + progress * 0.25 : 0.18 + progress * 0.4
      );

      const controls = globe.controls();
      if (controls) {
        controls.autoRotateSpeed = (mobile ? 0.3 : 0.4) + progress * (mobile ? 0.6 : 1.2);
      }

      if (progress > ARC_START && !hideArcs) {
        const pointData = mobile ? POINT_DATA_MOBILE : POINT_DATA_DESKTOP;
        globe.pointsData(pointData);
      } else {
        globe.pointsData(EMPTY_POINTS);
      }

      if (!hideArcs) {
        const newThreshold = getArcThreshold(progress, mobile);
        let tier: string;
        if (progress > 0.6) tier = 'abc';
        else if (progress > 0.3) tier = 'ab';
        else tier = 'a';
        if (newThreshold !== lastArcThresholdRef.current || tier !== lastArcTierRef.current) {
          lastArcThresholdRef.current = newThreshold;
          lastArcTierRef.current = tier;
          globe.arcsData(getArcs(progress, mobile));
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
