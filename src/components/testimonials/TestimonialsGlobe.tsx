import { useEffect, useRef } from 'react';
import { worldPopulationData } from '../HeroStory/Globe/worldPopulation';
import { isMobileDevice } from '../../hooks/useIsMobile';

const CITIES = worldPopulationData;
const ARC_COLORS = [
  ['rgba(192,132,252,1)', 'rgba(168,85,247,0.85)'],
  ['rgba(139,92,246,0.95)', 'rgba(167,139,250,0.8)'],
  ['rgba(216,180,254,1)', 'rgba(192,132,252,0.85)'],
];

const ARCS = CITIES.flatMap((city, i) => {
  const len = CITIES.length;
  return [
    {
      startLat: city.lat,
      startLng: city.lng,
      endLat: CITIES[(i + 2) % len].lat,
      endLng: CITIES[(i + 2) % len].lng,
      color: ARC_COLORS[0],
    },
    {
      startLat: city.lat,
      startLng: city.lng,
      endLat: CITIES[(i + 5) % len].lat,
      endLng: CITIES[(i + 5) % len].lng,
      color: ARC_COLORS[1],
    },
    ...(i % 2 === 0 ? [{
      startLat: city.lat,
      startLng: city.lng,
      endLat: CITIES[(i + 9) % len].lat,
      endLng: CITIES[(i + 9) % len].lng,
      color: ARC_COLORS[2],
    }] : []),
  ];
});

const POINTS = CITIES.map((c) => ({
  lat: c.lat,
  lng: c.lng,
  size: 0.6,
  color: 'rgba(216,180,254,0.95)',
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

export function TestimonialsGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const destroyedRef = useRef(false);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

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
        .atmosphereAltitude(0.25)
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
        .arcsTransitionDuration(1200)
        .arcsData(ARCS);

      globe
        .pointLat('lat')
        .pointLng('lng')
        .pointColor('color')
        .pointAltitude(0.01)
        .pointRadius('size')
        .pointsMerge(true)
        .pointsData(POINTS);

      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableRotate = false;

      globe.pointOfView({ lat: 0, lng: 20, altitude: 1.6 });

      const renderer = globe.renderer?.();
      if (renderer) {
        renderer.setPixelRatio(mobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
      }

      globe.globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg');
    });

    return () => {
      destroyedRef.current = true;
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
