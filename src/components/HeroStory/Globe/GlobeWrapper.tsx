import { useEffect, useRef, useCallback } from 'react';
import { MotionValue, useMotionValueEvent } from 'framer-motion';
import { isMobileDevice } from '../../../hooks/useIsMobile';

interface GlobeWrapperProps {
  scrollYProgress: MotionValue<number>;
  isVisible?: boolean;
}

const ARC_COLORS = ['#00d4ff', '#ffffff', '#0ea5e9', '#38bdf8', '#7dd3fc', '#06b6d4'];

function generateArcs(count: number) {
  return Array.from({ length: count }, () => {
    const c1 = ARC_COLORS[Math.floor(Math.random() * ARC_COLORS.length)];
    const c2 = ARC_COLORS[Math.floor(Math.random() * ARC_COLORS.length)];
    return {
      startLat: (Math.random() - 0.5) * 180,
      startLng: (Math.random() - 0.5) * 360,
      endLat: (Math.random() - 0.5) * 180,
      endLng: (Math.random() - 0.5) * 360,
      color: [c1, c2],
      dashLength: Math.random() * 0.6 + 0.2,
      dashGap: Math.random() * 0.4 + 0.1,
      animateTime: Math.random() * 4000 + 500,
    };
  });
}

const SCROLL_THRESHOLD = 0.05;
const POV_TRANSITION_MS = 600;

export function GlobeWrapper({ scrollYProgress, isVisible = true }: GlobeWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const lastProgressRef = useRef<number>(0);
  const mobileRef = useRef(isMobileDevice());
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const povTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const mobile = mobileRef.current;
    let destroyed = false;

    const idleInit = () => {
      if (destroyed) return;
      import('globe.gl').then((GlobeModule) => {
        if (destroyed || !containerRef.current) return;
        const Globe = GlobeModule.default;

        const globe = Globe({ animateIn: false })(containerRef.current!);
        globeRef.current = globe;

        const w = containerRef.current!.clientWidth || 800;
        const h = containerRef.current!.clientHeight || 800;

        globe
          .backgroundColor('rgba(0,0,0,0)')
          .showAtmosphere(true)
          .atmosphereColor('rgba(0,180,255,0.25)')
          .atmosphereAltitude(mobile ? 0.1 : 0.15)
          .width(w)
          .height(h);

        const arcCount = mobile ? 12 : 20;
        const arcsData = generateArcs(arcCount);

        globe
          .arcsData(arcsData)
          .arcColor('color')
          .arcDashLength((d: any) => d.dashLength)
          .arcDashGap((d: any) => d.dashGap)
          .arcDashAnimateTime((d: any) => d.animateTime)
          .arcStroke(mobile ? 0.6 : 0.8);

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

        requestIdleCallback(() => {
          if (destroyed || !globeRef.current) return;
          globeRef.current.globeImageUrl(
            '//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg'
          );
        });
      });
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(idleInit, { timeout: 200 });
    } else {
      setTimeout(idleInit, 50);
    }

    return () => {
      destroyed = true;
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
      if (povTimerRef.current) clearTimeout(povTimerRef.current);
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
          renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
          });
        }
      }
    }
  }, [isVisible]);

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (!isVisible || !globeRef.current) return;
    if (Math.abs(progress - lastProgressRef.current) < SCROLL_THRESHOLD) return;

    if (scrollRafRef.current !== null) cancelAnimationFrame(scrollRafRef.current);

    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      if (!globeRef.current) return;

      lastProgressRef.current = progress;
      const mobile = mobileRef.current;
      const globe = globeRef.current;

      if (povTimerRef.current) clearTimeout(povTimerRef.current);
      povTimerRef.current = setTimeout(() => {
        if (!globeRef.current) return;
        const startAlt = mobile ? 2.8 : 2.2;
        const zoomRange = mobile ? 0.5 : 0.8;
        const minAlt = mobile ? 1.8 : 1.2;
        const newAltitude = Math.max(minAlt, startAlt - progress * zoomRange);
        globe.pointOfView({ lat: 5, lng: 20, altitude: newAltitude }, POV_TRANSITION_MS);
      }, 50);

      globe.atmosphereAltitude(
        mobile ? 0.1 + progress * 0.2 : 0.15 + progress * 0.35
      );

      const controls = globe.controls();
      if (controls) {
        controls.autoRotateSpeed = (mobile ? 0.3 : 0.4) + progress * (mobile ? 0.6 : 1.2);
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
