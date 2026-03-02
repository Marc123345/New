import React, { useRef, useMemo, Suspense } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, useTexture, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

interface GlobeProps {
  scrollYProgress: MotionValue<number>;
}

const AfricaGlobe = ({ scrollYProgress }: GlobeProps) => {
  const planetTexture = useTexture('https://ik.imagekit.io/qcvroy8xpd/Planet.png');
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.SpotLight>(null);
  const fillLightRef = useRef<THREE.PointLight>(null);
  const rimLightRef = useRef<THREE.PointLight>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const nodeCount = 60;
  const nodePositions = useMemo(() => {
    const pos: THREE.Vector3[] = [];
    const africaCenter = new THREE.Vector3(0.3, -0.2, 1).normalize();
    for (let i = 0; i < nodeCount * 3; i++) {
      const phi = Math.random() * Math.PI;
      const theta = Math.random() * Math.PI * 2;
      const x = 2.08 * Math.sin(phi) * Math.cos(theta);
      const y = 2.08 * Math.sin(phi) * Math.sin(theta);
      const z = 2.08 * Math.cos(phi);
      const v = new THREE.Vector3(x, y, z).normalize();
      const dot = v.dot(africaCenter);
      if (dot > 0.2 && z > -0.5) {
        pos.push(new THREE.Vector3(x, y, z));
      }
      if (pos.length >= nodeCount) break;
    }
    return pos;
  }, []);

  const lineGeometry = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 1.2) {
          positions.push(
            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
          );
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [nodePositions]);

  useFrame((state) => {
    const progress = scrollYProgress.get();
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = -0.4 + t * 0.03;
    }

    if (lightRef.current) {
      const base = 4;
      const mid1 = 25;
      const mid2 = 60;
      const max = 200;
      let intensity = base;
      if (progress < 0.25) {
        intensity = base;
      } else if (progress < 0.5) {
        intensity = THREE.MathUtils.lerp(base, mid1, (progress - 0.25) / 0.25);
      } else if (progress < 0.75) {
        intensity = THREE.MathUtils.lerp(mid1, mid2, (progress - 0.5) / 0.25);
      } else {
        intensity = THREE.MathUtils.lerp(mid2, max, (progress - 0.75) / 0.25);
      }
      lightRef.current.intensity = intensity;
    }

    if (fillLightRef.current) {
      fillLightRef.current.intensity = THREE.MathUtils.lerp(0, 15, Math.max(0, (progress - 0.75) / 0.25));
      fillLightRef.current.color.setHex(0x9333ea);
    }

    if (rimLightRef.current) {
      rimLightRef.current.intensity = THREE.MathUtils.lerp(2, 30, progress);
    }

    if (nodesRef.current && nodesRef.current.material) {
      const mat = nodesRef.current.material as THREE.MeshStandardMaterial;
      if (progress < 0.2) {
        mat.opacity = 0;
        mat.emissiveIntensity = 0;
      } else if (progress < 0.5) {
        const p = (progress - 0.2) / 0.3;
        mat.opacity = THREE.MathUtils.lerp(0, 0.7, p);
        mat.emissiveIntensity = THREE.MathUtils.lerp(0, 3, p);
      } else if (progress < 0.75) {
        const p = (progress - 0.5) / 0.25;
        mat.opacity = THREE.MathUtils.lerp(0.7, 1, p);
        mat.emissiveIntensity = THREE.MathUtils.lerp(3, 7, p);
      } else {
        const p = (progress - 0.75) / 0.25;
        mat.opacity = 1;
        mat.emissiveIntensity = THREE.MathUtils.lerp(7, 14, p);
      }
      mat.needsUpdate = true;

      nodePositions.forEach((pos, i) => {
        dummy.position.copy(pos);
        const pulse = 1 + 0.05 * Math.sin(t * 2 + i * 0.5);
        dummy.scale.setScalar(pulse);
        dummy.updateMatrix();
        nodesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      nodesRef.current.instanceMatrix.needsUpdate = true;
    }

    if (linesRef.current && linesRef.current.material) {
      const mat = linesRef.current.material as THREE.LineBasicMaterial;
      if (progress < 0.25) {
        mat.opacity = 0;
      } else if (progress < 0.6) {
        mat.opacity = THREE.MathUtils.lerp(0, 0.5, (progress - 0.25) / 0.35);
      } else {
        mat.opacity = THREE.MathUtils.lerp(0.5, 0.9, (progress - 0.6) / 0.4);
      }
    }
  });

  return (
    <group ref={groupRef} rotation={[0.15, -0.4, 0]}>
      <Sphere args={[2, 96, 96]}>
        <meshStandardMaterial
          map={planetTexture}
          roughness={0.7}
          metalness={0.25}
        />
      </Sphere>

      <instancedMesh ref={nodesRef} args={[undefined, undefined, nodePositions.length]}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshStandardMaterial
          color="#c084fc"
          emissive="#a855f7"
          transparent
          opacity={0}
          emissiveIntensity={0}
          depthWrite={false}
        />
      </instancedMesh>

      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#9333ea" transparent opacity={0} depthWrite={false} />
      </lineSegments>

      <spotLight
        ref={lightRef}
        position={[3, 1, 5]}
        angle={0.6}
        penumbra={0.8}
        color="#b060ff"
        distance={30}
        intensity={4}
        target-position={[0, 0, 0]}
      />
      <pointLight
        ref={fillLightRef}
        position={[0, -1, 4]}
        color="#9333ea"
        intensity={0}
        distance={20}
      />
      <pointLight
        ref={rimLightRef}
        position={[-4, 0, -2]}
        color="#7c3aed"
        intensity={2}
        distance={15}
      />
      <ambientLight intensity={0.06} color="#1a0030" />
    </group>
  );
};

const phases = [
  {
    subtitle: 'AFRICA AT NIGHT (Present)',
    title: 'VIEW OF AFRICA AT NIGHT (Current)',
    description: 'Current urban footprints illuminated by purple light.',
    range: [0, 0.1, 0.22, 0.28] as [number, number, number, number],
  },
  {
    subtitle: 'THE DIGITAL ERA',
    title: 'The Digital Era (c. 2010s)',
    description: 'Data networks connect fiber cable and satellite links. Businesses started moving online, but real connection remained scarce.',
    range: [0.22, 0.32, 0.45, 0.52] as [number, number, number, number],
  },
  {
    subtitle: 'THE AI ERA',
    title: 'The AI Era (c. 2020s-Present)',
    description: 'Artificial intelligence transforms industries and connectivity. New nodes light up as automation takes over, but humanity gets lost in the noise.',
    range: [0.48, 0.56, 0.68, 0.76] as [number, number, number, number],
  },
  {
    subtitle: 'THE H2H DIFFERENCE: FULL ILLUMINATION',
    title: 'The H2H Difference',
    description: 'When Human Collaboration meets the Digital & AI Foundations. A United, Illuminated Continent. Purple Represents Progress, Unity, and Connection.',
    range: [0.72, 0.8, 1, 1] as [number, number, number, number],
  },
];

const PhaseText = ({
  subtitle,
  title,
  description,
  progressRange,
  scrollYProgress,
}: {
  subtitle: string;
  title: string;
  description: string;
  progressRange: [number, number, number, number];
  scrollYProgress: MotionValue<number>;
}) => {
  const opacity = useTransform(scrollYProgress, progressRange, [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, progressRange, [30, 0, 0, -30]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center"
      style={{ opacity, y, pointerEvents: 'none' }}
    >
      <p
        className="text-xs uppercase tracking-[0.22em] font-semibold mb-3"
        style={{ color: 'rgba(192,132,252,0.9)' }}
      >
        {subtitle}
      </p>
      <h2
        className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-5 text-white"
        style={{
          fontFamily: 'var(--font-stack-heading)',
          textShadow: '0 0 40px rgba(168,85,247,0.5)',
        }}
      >
        {title}
      </h2>
      <p className="text-base md:text-lg leading-relaxed max-w-xs" style={{ color: 'rgba(209,213,219,0.88)' }}>
        {description}
      </p>
    </motion.div>
  );
};

export function HeroStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: '500vh' }}
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 60% 50%, #0d0520 0%, #060110 40%, #020008 100%)' }}
      >
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ antialias: true }}>
            <Stars radius={120} depth={60} count={2500} factor={4} saturation={0} fade speed={0.4} />
            <Suspense fallback={null}>
              <AfricaGlobe scrollYProgress={scrollYProgress} />
            </Suspense>
            <EffectComposer>
              <Bloom luminanceThreshold={0.1} mipmapBlur intensity={2.2} levels={8} />
            </EffectComposer>
          </Canvas>
        </div>

        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to right, rgba(2,0,8,0.75) 0%, rgba(2,0,8,0.4) 35%, transparent 60%)',
        }} />

        <div className="relative z-10 h-full flex items-center">
          <div className="w-full max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
            <div className="w-full md:w-2/5 relative" style={{ minHeight: 240 }}>
              {phases.map((phase, i) => (
                <PhaseText
                  key={i}
                  subtitle={phase.subtitle}
                  title={phase.title}
                  description={phase.description}
                  progressRange={phase.range}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 md:left-14 lg:left-20 right-8 z-20 flex flex-col gap-2">
          <div className="w-64 h-px relative" style={{ background: 'rgba(168,85,247,0.2)' }}>
            <motion.div
              className="absolute inset-y-0 left-0"
              style={{
                width: progressBarWidth,
                background: 'linear-gradient(to right, rgba(168,85,247,0.9), rgba(192,132,252,0.5))',
              }}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                left: progressBarWidth,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#c084fc',
                boxShadow: '0 0 8px rgba(192,132,252,0.8)',
                translateX: '-50%',
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
              <path d="M0 4H12M12 4L8 1M12 4L8 7" stroke="rgba(192,132,252,0.5)" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <span className="text-xs uppercase tracking-[0.2em]" style={{ color: 'rgba(192,132,252,0.45)', fontFamily: 'var(--font-stack-heading)' }}>
              scroll to explore
            </span>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(2,0,8,0.6) 0%, transparent 100%)' }}
        />
      </div>
    </div>
  );
}

export function AboutStory() {
  return <HeroStory />;
}
