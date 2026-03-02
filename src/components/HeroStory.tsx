import { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import ThreeGlobe from 'three-globe';

const AFRICA_CITY_POINTS = [
  { lat: 30.04,  lng: 31.24,  pop: 21000 },
  { lat: -33.92, lng: 18.42,  pop: 14000 },
  { lat: 6.37,   lng: 3.55,   pop: 15000 },
  { lat: -26.20, lng: 28.04,  pop: 16000 },
  { lat: -1.28,  lng: 36.82,  pop: 10000 },
  { lat: 14.69,  lng: -17.44, pop: 13000 },
  { lat: 5.56,   lng: -0.20,  pop: 11000 },
  { lat: 12.36,  lng: -1.53,  pop: 9000  },
  { lat: 9.05,   lng: 7.49,   pop: 8000  },
  { lat: 33.89,  lng: 9.54,   pop: 7000  },
  { lat: -4.32,  lng: 15.32,  pop: 8000  },
  { lat: -18.91, lng: 47.54,  pop: 7000  },
  { lat: 15.55,  lng: 32.53,  pop: 9000  },
  { lat: 3.86,   lng: 11.52,  pop: 7000  },
  { lat: 4.36,   lng: 18.56,  pop: 5000  },
  { lat: 6.13,   lng: 1.22,   pop: 5000  },
  { lat: -15.42, lng: 28.28,  pop: 6000  },
  { lat: 34.01,  lng: -6.83,  pop: 8000  },
  { lat: 36.81,  lng: 3.06,   pop: 9000  },
  { lat: -17.73, lng: 31.05,  pop: 6000  },
  { lat: 0.39,   lng: 9.45,   pop: 5000  },
  { lat: 12.10,  lng: 15.04,  pop: 5000  },
  { lat: -11.70, lng: 27.47,  pop: 4000  },
  { lat: 2.05,   lng: 45.34,  pop: 4500  },
  { lat: 5.35,   lng: -4.00,  pop: 7000  },
  { lat: -25.97, lng: 32.57,  pop: 5000  },
  { lat: 13.51,  lng: 2.12,   pop: 4000  },
  { lat: -8.84,  lng: 13.23,  pop: 6000  },
  { lat: 32.89,  lng: 13.18,  pop: 6000  },
  { lat: -20.16, lng: 57.50,  pop: 4500  },
  { lat: 18.07,  lng: -15.97, pop: 4000  },
  { lat: 6.36,   lng: 2.42,   pop: 4000  },
  { lat: -13.96, lng: 33.79,  pop: 3500  },
  { lat: 11.86,  lng: 15.35,  pop: 3000  },
  { lat: -22.90, lng: 43.16,  pop: 3000  },
  { lat: 4.85,   lng: 31.60,  pop: 3000  },
  { lat: -6.17,  lng: 35.74,  pop: 2500  },
  { lat: 1.74,   lng: 10.44,  pop: 2500  },
];

const sortedByPop = [...AFRICA_CITY_POINTS].sort((a, b) => b.pop - a.pop);

function getVisiblePoints(progress: number) {
  const minCount = 8;
  const count = Math.max(minCount, Math.ceil(sortedByPop.length * Math.min(progress * 1.6, 1)));
  return sortedByPop.slice(0, count);
}

function getPointColor(progress: number): string {
  if (progress < 0.75) {
    const t = progress / 0.75;
    const r = Math.round(140 + (192 - 140) * t);
    const g = Math.round(60 + (132 - 60) * t);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}fc`;
  } else {
    const t = (progress - 0.75) / 0.25;
    const r = Math.round(192 + (240 - 192) * t);
    const g = Math.round(132 + (180 - 132) * t);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}ff`;
  }
}

function getAtmosphereColor(progress: number): string {
  if (progress > 0.75) {
    const t = (progress - 0.75) / 0.25;
    return `rgba(192, 108, 255, ${0.25 + t * 0.75})`;
  }
  const t = progress / 0.75;
  return `rgba(${Math.round(60 + t * 80)}, ${Math.round(40 + t * 40)}, ${Math.round(120 + t * 60)}, ${0.08 + t * 0.18})`;
}

interface GlobeSceneProps {
  progress: number;
}

function GlobeScene({ progress }: GlobeSceneProps) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const { scene, camera } = useThree();

  useEffect(() => {
    const globe = new ThreeGlobe()
      .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg')
      .pointLat('lat')
      .pointLng('lng')
      .pointColor(() => getPointColor(0))
      .pointAltitude(0.01)
      .pointRadius(0.22)
      .pointsMerge(true)
      .atmosphereColor('rgba(60,40,120,0.08)')
      .atmosphereAltitude(0.08)
      .showGraticules(false);

    globe.pointsData(getVisiblePoints(0));
    scene.add(globe);
    globeRef.current = globe;

    const ambientLight = new THREE.AmbientLight(0xcccccc, Math.PI);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI);
    dirLight.position.set(1, 1, 1);
    scene.add(ambientLight, dirLight);

    camera.position.set(0, 0, 300);

    return () => {
      scene.remove(globe);
      scene.remove(ambientLight);
      scene.remove(dirLight);
    };
  }, [scene, camera]);

  useEffect(() => {
    if (!globeRef.current) return;
    const g = globeRef.current;

    g.pointsData(getVisiblePoints(progress))
      .pointColor(() => getPointColor(progress))
      .pointAltitude(0.01 + progress * 0.07)
      .pointRadius(0.22 + progress * 0.7)
      .pointsMerge(true)
      .atmosphereColor(getAtmosphereColor(progress))
      .atmosphereAltitude(progress > 0.75
        ? 0.12 + ((progress - 0.75) / 0.25) * 0.28
        : 0.08 + (progress / 0.75) * 0.06
      );
  }, [progress]);

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.05;
      globeRef.current.tick?.();
    }
  });

  return null;
}

const eras = [
  {
    subtitle: 'AFRICA AT NIGHT',
    title: 'View of Africa at Night',
    body: 'Current urban footprints illuminated — where light marks life, commerce, and connection.',
    rangeStart: 0,
    rangeEnd: 0.25,
  },
  {
    subtitle: 'THE DIGITAL ERA',
    title: 'The Digital Era (c. 2010s)',
    body: 'Data networks connect fiber cables and satellite links. Cities begin to glow as digital infrastructure reaches the continent.',
    rangeStart: 0.25,
    rangeEnd: 0.5,
  },
  {
    subtitle: 'THE AI ERA',
    title: 'The AI Era (c. 2020s–Present)',
    body: 'Artificial intelligence transforms industries and connectivity. New nodes light up as automation reshapes how Africa connects.',
    rangeStart: 0.5,
    rangeEnd: 0.75,
  },
  {
    subtitle: 'THE H2H DIFFERENCE',
    title: 'Full Illumination',
    body: 'When Human Collaboration meets Digital & AI foundations — a united, illuminated continent. This is H2H.',
    rangeStart: 0.75,
    rangeEnd: 1,
  },
];

function EraText({
  subtitle, title, body, rangeStart, rangeEnd, scrollYProgress,
}: {
  subtitle: string;
  title: string;
  body: string;
  rangeStart: number;
  rangeEnd: number;
  scrollYProgress: MotionValue<number>;
}) {
  const fadeIn = rangeStart + (rangeEnd - rangeStart) * 0.15;
  const fadeOut = rangeEnd - (rangeEnd - rangeStart) * 0.15;

  const opacity = useTransform(scrollYProgress, [rangeStart, fadeIn, fadeOut, rangeEnd], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [rangeStart, fadeIn, fadeOut, rangeEnd], [32, 0, 0, -32]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center pl-10 md:pl-16 lg:pl-24 pr-6"
      style={{ opacity, y, pointerEvents: 'none' }}
    >
      <p
        className="text-xs uppercase tracking-[0.22em] font-semibold mb-3"
        style={{ color: 'rgba(192,132,252,0.85)' }}
      >
        {subtitle}
      </p>
      <h2
        className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-5 text-white"
        style={{ textShadow: '0 0 40px rgba(168,85,247,0.5)' }}
      >
        {title}
      </h2>
      <p
        className="text-base md:text-lg leading-relaxed max-w-sm"
        style={{ color: 'rgba(209,213,219,0.85)' }}
      >
        {body}
      </p>
    </motion.div>
  );
}

export function HeroStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 0.75, 1], [0, 0.15, 0.4, 0.88]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 0.75, 1], [0.55, 0.82, 1.1, 1.65]);
  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const stars = useMemo(() =>
    Array.from({ length: 90 }).map((_, i) => ({
      key: i,
      size: Math.random() * 1.8 + 0.4,
      top: `${(i * 97.3 + 43) % 100}%`,
      left: `${(i * 137.5 + 17) % 100}%`,
      opacity: 0.15 + (i % 7) * 0.06,
      duration: 2 + (i % 5) * 0.8,
      delay: (i % 9) * 0.35,
    })),
  []);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setProgress(latest);
  });

  return (
    <section ref={sectionRef} className="relative" style={{ height: '500vh' }}>
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #06030f 0%, #0e0820 30%, #080318 70%, #030108 100%)',
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
          {stars.map((s) => (
            <div
              key={s.key}
              className="absolute rounded-full bg-white"
              style={{
                width: s.size,
                height: s.size,
                top: s.top,
                left: s.left,
                opacity: s.opacity,
                animation: `twinkle ${s.duration}s ease-in-out infinite ${s.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 h-full flex">
          <div className="w-full md:w-1/2 relative">
            {eras.map((era, i) => (
              <EraText
                key={i}
                subtitle={era.subtitle}
                title={era.title}
                body={era.body}
                rangeStart={era.rangeStart}
                rangeEnd={era.rangeEnd}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>

          <div className="hidden md:flex w-1/2 items-center justify-center relative">
            <div className="relative w-full h-full">
              <Canvas
                camera={{ position: [0, 0, 300], fov: 50, near: 0.1, far: 10000 }}
                style={{ background: 'transparent' }}
                gl={{ alpha: true, antialias: true }}
              >
                <GlobeScene progress={progress} />
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  enableRotate={false}
                  autoRotate={false}
                />
              </Canvas>

              <motion.div
                className="absolute pointer-events-none"
                style={{
                  opacity: glowOpacity,
                  scale: glowScale,
                  top: '15%',
                  left: '10%',
                  width: '60%',
                  height: '65%',
                  background:
                    'radial-gradient(circle, rgba(168,85,247,0.65) 0%, rgba(147,51,234,0.22) 35%, transparent 65%)',
                  filter: 'blur(22px)',
                  borderRadius: '50%',
                }}
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-10 md:left-16 lg:left-24 z-20 flex flex-col gap-2">
          <div className="w-52 h-px relative" style={{ background: 'rgba(88,28,135,0.25)' }}>
            <motion.div
              className="absolute inset-y-0 left-0 h-px"
              style={{
                width: progressBarWidth,
                background: 'linear-gradient(to right, rgba(147,51,234,0.9), rgba(192,132,252,0.55))',
              }}
            />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <motion.div
              className="w-px h-5"
              style={{ background: 'rgba(192,132,252,0.3)' }}
              animate={{ scaleY: [1, 1.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span
              className="text-xs uppercase tracking-[0.2em]"
              style={{ color: 'rgba(192,132,252,0.38)' }}
            >
              scroll to explore
            </span>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(3,1,8,0.5) 0%, transparent 100%)',
            zIndex: 20,
          }}
        />
      </div>
    </section>
  );
}

export function AboutStory() {
  return <HeroStory />;
}
