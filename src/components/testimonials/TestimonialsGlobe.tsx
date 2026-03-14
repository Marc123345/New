import { useEffect, useRef } from 'react';
import { isMobileDevice } from '../../hooks/useIsMobile';

// The 5 testimonial cities + key African hubs for the network
const TESTIMONIAL_CITIES = [
  { lat: 6.5244,   lng: 3.3792,   name: 'Lagos' },
  { lat: 5.6037,   lng: -0.1870,  name: 'Accra' },
  { lat: -1.2921,  lng: 36.8219,  name: 'Nairobi' },
  { lat: -26.2041, lng: 28.0473,  name: 'Johannesburg' },
  { lat: 14.7167,  lng: -17.4677, name: 'Dakar' },
];

const HUB_CITIES = [
  { lat: 30.0444,  lng: 31.2357,  name: 'Cairo' },
  { lat: -4.4419,  lng: 15.2663,  name: 'Kinshasa' },
  { lat: -33.9249, lng: 18.4241,  name: 'Cape Town' },
  { lat: 9.0320,   lng: 38.7469,  name: 'Addis Ababa' },
  { lat: 33.5731,  lng: -7.5898,  name: 'Casablanca' },
  { lat: 5.3484,   lng: -4.0232,  name: 'Abidjan' },
  { lat: -6.7924,  lng: 39.2083,  name: 'Dar es Salaam' },
  { lat: 12.3714,  lng: -1.5197,  name: 'Ouagadougou' },
];

const ALL_CITIES = [...TESTIMONIAL_CITIES, ...HUB_CITIES];

const ARC_COLORS = {
  testimonial: ['rgba(216,180,254,1)', 'rgba(192,132,252,0.9)'],   // bright purple — hero connections
  hub:         ['rgba(139,92,246,0.85)', 'rgba(167,139,250,0.7)'], // mid purple
  secondary:   ['rgba(192,132,252,0.6)', 'rgba(139,92,246,0.4)'],  // soft purple
};

// Explicit arcs: testimonial cities connected to each other + nearby hubs
const ARC_DEFINITIONS = [
  // Testimonial ↔ Testimonial (cross-continent hero arcs)
  { from: 'Lagos',        to: 'Accra',         color: ARC_COLORS.testimonial },
  { from: 'Lagos',        to: 'Nairobi',        color: ARC_COLORS.testimonial },
  { from: 'Lagos',        to: 'Johannesburg',   color: ARC_COLORS.testimonial },
  { from: 'Dakar',        to: 'Lagos',          color: ARC_COLORS.testimonial },
  { from: 'Dakar',        to: 'Accra',          color: ARC_COLORS.testimonial },
  { from: 'Nairobi',      to: 'Johannesburg',   color: ARC_COLORS.testimonial },
  { from: 'Accra',        to: 'Nairobi',        color: ARC_COLORS.testimonial },
  { from: 'Dakar',        to: 'Nairobi',        color: ARC_COLORS.testimonial },
  { from: 'Johannesburg', to: 'Dakar',          color: ARC_COLORS.testimonial },

  // Testimonial → Hubs (regional network arcs)
  { from: 'Lagos',        to: 'Abidjan',        color: ARC_COLORS.hub },
  { from: 'Lagos',        to: 'Kinshasa',       color: ARC_COLORS.hub },
  { from: 'Lagos',        to: 'Cairo',          color: ARC_COLORS.hub },
  { from: 'Accra',        to: 'Abidjan',        color: ARC_COLORS.hub },
  { from: 'Dakar',        to: 'Casablanca',     color: ARC_COLORS.hub },
  { from: 'Dakar',        to: 'Abidjan',        color: ARC_COLORS.hub },
  { from: 'Nairobi',      to: 'Addis Ababa',    color: ARC_COLORS.hub },
  { from: 'Nairobi',      to: 'Dar es Salaam',  color: ARC_COLORS.hub },
  { from: 'Nairobi',      to: 'Cairo',          color: ARC_COLORS.hub },
  { from: 'Johannesburg', to: 'Cape Town',      color: ARC_COLORS.hub },
  { from: 'Johannesburg', to: 'Kinshasa',       color: ARC_COLORS.hub },
  { from: 'Johannesburg', to: 'Dar es Salaam',  color: ARC_COLORS.hub },

  // Hub ↔ Hub (continent backbone)
  { from: 'Cairo',        to: 'Casablanca',     color: ARC_COLORS.secondary },
  { from: 'Cairo',        to: 'Addis Ababa',    color: ARC_COLORS.secondary },
  { from: 'Kinshasa',     to: 'Dar es Salaam',  color: ARC_COLORS.secondary },
  { from: 'Cape Town',    to: 'Dar es Salaam',  color: ARC_COLORS.secondary },
  { from: 'Casablanca',   to: 'Abidjan',        color: ARC_COLORS.secondary },
  { from: 'Ouagadougou',  to: 'Lagos',          color: ARC_COLORS.secondary },
  { from: 'Ouagadougou',  to: 'Dakar',          color: ARC_COLORS.secondary },
];

function buildArcData() {
  const cityMap = new Map(ALL_CITIES.map((c) => [c.name, c]));
  return ARC_DEFINITIONS.map((arc) => {
    const from = cityMap.get(arc.from)!;
    const to = cityMap.get(arc.to)!;
    return {
      startLat: from.lat, startLng: from.lng,
      endLat: to.lat, endLng: to.lng,
      color: arc.color,
    };
  });
}

const ALL_ARCS = buildArcData();

const POINTS = ALL_CITIES.map((c, i) => ({
  lat: c.lat, lng: c.lng,
  size: i < TESTIMONIAL_CITIES.length ? 0.9 : 0.55,
  color: i < TESTIMONIAL_CITIES.length ? 'rgba(216,180,254,1)' : 'rgba(192,132,252,0.7)',
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
        .arcColor('color')
        .arcDashLength(0.45)
        .arcDashGap(0.08)
        .arcDashAnimateTime(1600)
        .arcStroke(mobile ? 1.2 : 1.8)
        .arcAltitude(0.25)
        .arcsTransitionDuration(600)
        .arcsData([]);

      globe
        .pointLat('lat')
        .pointLng('lng')
        .pointColor('color')
        .pointAltitude(0.012)
        .pointRadius('size')
        .pointsMerge(false)
        .pointsData([]);

      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableRotate = false;

      // Center on Africa
      globe.pointOfView({ lat: 5, lng: 20, altitude: 1.8 });

      const renderer = globe.renderer?.();
      if (renderer) {
        renderer.setPixelRatio(mobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
      }

      globe.globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg');

      const timers: ReturnType<typeof setTimeout>[] = [];

      // Show points quickly
      const t0 = setTimeout(() => {
        if (destroyedRef.current || !globeRef.current) return;
        globeRef.current.pointsData(POINTS);
      }, 800);
      timers.push(t0);

      // Reveal arcs in 3 waves: testimonial arcs first, then hubs, then backbone
      const testimonialArcs = ALL_ARCS.slice(0, 9);
      const hubArcs = ALL_ARCS.slice(0, 22);
      const allArcs = ALL_ARCS;

      const t1 = setTimeout(() => {
        if (destroyedRef.current || !globeRef.current) return;
        globeRef.current.arcsData(testimonialArcs);
      }, 1200);
      timers.push(t1);

      const t2 = setTimeout(() => {
        if (destroyedRef.current || !globeRef.current) return;
        globeRef.current.arcsData(hubArcs);
      }, 2400);
      timers.push(t2);

      const t3 = setTimeout(() => {
        if (destroyedRef.current || !globeRef.current) return;
        globeRef.current.arcsData(allArcs);
      }, 3600);
      timers.push(t3);

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
