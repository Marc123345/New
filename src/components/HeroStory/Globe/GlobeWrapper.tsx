import { useEffect, useRef, useCallback } from 'react';
import { MotionValue, useMotionValueEvent } from 'motion/react';
import { worldPopulationData } from './worldPopulation';
import { isMobileDevice } from '../../../hooks/useIsMobile';

interface GlobeWrapperProps {
  scrollYProgress: MotionValue<number>;
  isVisible?: boolean;
  hideArcs?: boolean;
}

const TOP_CITIES = worldPopulationData.slice(0, 12);
const TOP_CITIES_MOBILE = worldPopulationData.slice(0, 6);
const HEATMAP_CITIES = worldPopulationData.slice(0, 20);
const HEATMAP_CITIES_MOBILE = worldPopulationData.slice(0, 10);
const ARC_START = 0.15;
const SCROLL_THRESHOLD = 0.03;

function getArcThreshold(progress: number, mobile: boolean): number {
  if (progress < ARC_START) return 0;
  const cities = mobile ? TOP_CITIES_MOBILE : TOP_CITIES;
  return Math.min(
    Math.floor(((progress - ARC_START) / (1 - ARC_START)) * cities.length),
    cities.length - 1
  );
}

const ARC_COLOR_PRIMARY = ['rgba(168,85,247,0.9)', 'rgba(192,132,252,0.6)'];
const ARC_COLOR_SECONDARY = ['rgba(139,92,246,0.7)', 'rgba(167,139,250,0.4)'];
const EMPTY_ARCS: object[] = [];

const precomputedArcs = new Map<string, object[]>();
function initArcsForSet(cities: typeof TOP_CITIES, prefix: string) {
  const len = cities.length;
  for (let threshold = 1; threshold <= len; threshold++) {
    const arcsA: object[] = [];
    const arcsB: object[] = [];
    for (let i = 0; i < threshold; i++) {
      arcsA.push({
        startLat: cities[i].lat,
        startLng: cities[i].lng,
        endLat: cities[(i + 3) % len].lat,
        endLng: cities[(i + 3) % len].lng,
        color: ARC_COLOR_PRIMARY,
      });
      if (i < threshold - 1) {
        arcsB.push({
          startLat: cities[i].lat,
          startLng: cities[i].lng,
          endLat: cities[(i + 5) % len].lat,
          endLng: cities[(i + 5) % len].lng,
          color: ARC_COLOR_SECONDARY,
        });
      }
    }
    precomputedArcs.set(`${prefix}${threshold}-a`, arcsA);
    precomputedArcs.set(`${prefix}${threshold}-ab`, [...arcsA, ...arcsB]);
  }
}
initArcsForSet(TOP_CITIES, 'd-');
initArcsForSet(TOP_CITIES_MOBILE, 'm-');

function getArcs(progress: number, mobile: boolean): object[] {
  const threshold = getArcThreshold(progress, mobile);
  if (threshold === 0) return EMPTY_ARCS;
  const prefix = mobile ? 'm-' : 'd-';
  const key = progress > 0.5 ? `${prefix}${threshold}-ab` : `${prefix}${threshold}-a`;
  return precomputedArcs.get(key) || EMPTY_ARCS;
}

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
  const lastHalfRef = useRef<boolean>(false);
  const lastProgressRef = useRef<number>(0);
  const mobileRef = useRef(isMobileDevice());
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isBackgroundRef = useRef(false);
  const destroyedRef = useRef(false);
  const idleCallbackRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    destroyedRef.current = false;

    const mobile = mobileRef.current;

    const idleInit = () => {
      if (destroyedRef.current || !containerRef.current) return;
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
          .atmosphereColor('rgba(120,60,220,0.5)')
          .atmosphereAltitude(mobile ? 0.1 : 0.15)
          .width(w)
          .height(h);

        globe
          .heatmapPointLat('lat')
          .heatmapPointLng('lng')
          .heatmapPointWeight('pop')
          .heatmapBandwidth(mobile ? 0.7 : 0.9)
          .heatmapColorSaturation(mobile ? 2.2 : 2.8)
          .heatmapsData([mobile ? HEATMAP_CITIES_MOBILE : HEATMAP_CITIES])
          .arcColor('color')
          .arcDashLength(mobile ? 0.5 : 0.4)
          .arcDashGap(mobile ? 0.3 : 0.2)
          .arcDashAnimateTime(mobile ? 2000 : 1500)
          .arcStroke(mobile ? 0.8 : 1.2);

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

        if ('requestIdleCallback' in window) {
          idleCallbackRef.current = (window as any).requestIdleCallback(() => {
            if (destroyedRef.current || !globeRef.current) return;
            globeRef.current.globeImageUrl(
              '//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg'
            );
          });
        } else {
          setTimeout(() => {
            if (destroyedRef.current || !globeRef.current) return;
            globeRef.current.globeImageUrl(
              '//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg'
            );
          }, 50);
        }
      });
    };

    if ('requestIdleCallback' in window) {
      idleCallbackRef.current = (window as any).requestIdleCallback(idleInit, { timeout: 200 });
    } else {
      setTimeout(idleInit, 50);
    }

    const handleVisibility = () => {
      isBackgroundRef.current = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      destroyedRef.current = true;
      document.removeEventListener('visibilitychange', handleVisibility);
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (idleCallbackRef.current && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(idleCallbackRef.current);
      }
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

    const renderer = globeRef.current.renderer?.();
    if (renderer) {
      if (!isVisible) {
        renderer.setAnimationLoop(null);
      } else {
        const scene = globeRef.current.scene?.();
        const camera = globeRef.current.camera?.();
        if (scene && camera) {
          let frameCount = 0;
          const renderLoop = () => {
            frameCount++;
            if (isBackgroundRef.current && frameCount % 2 !== 0) return;
            renderer.render(scene, camera);
          };
          renderer.setAnimationLoop(renderLoop);
        }
      }
    }
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
        mobile ? 0.1 + progress * 0.2 : 0.15 + progress * 0.35
      );

      const controls = globe.controls();
      if (controls) {
        controls.autoRotateSpeed = (mobile ? 0.3 : 0.4) + progress * (mobile ? 0.6 : 1.2);
      }

      if (!hideArcs) {
        const newThreshold = getArcThreshold(progress, mobile);
        const newHalf = progress > 0.5;
        if (newThreshold !== lastArcThresholdRef.current || newHalf !== lastHalfRef.current) {
          lastArcThresholdRef.current = newThreshold;
          lastHalfRef.current = newHalf;
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
