import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MotionValue, useMotionValueEvent } from 'framer-motion';
import * as THREE from 'three';

const TEXTURE_URL = 'https://ik.imagekit.io/qcvroy8xpd/dark-s_nx.jpg';

function BackgroundPlane() {
  const { viewport } = useThree();
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(TEXTURE_URL);
  }, []);

  return (
    <mesh position={[0, 0, -8]} renderOrder={-1}>
      <planeGeometry args={[viewport.width * 2.5, viewport.height * 2.5]} />
      <meshBasicMaterial map={texture} depthWrite={false} />
    </mesh>
  );
}

function DarkOverlay() {
  const { viewport } = useThree();
  return (
    <mesh position={[0, 0, -7.9]} renderOrder={0}>
      <planeGeometry args={[viewport.width * 2.5, viewport.height * 2.5]} />
      <meshBasicMaterial color="#000000" transparent opacity={0.55} depthWrite={false} />
    </mesh>
  );
}

interface FigureProps {
  position: [number, number, number];
  speed: number;
  phaseOffset: number;
  scale: number;
}

function WalkingFigure({ position, speed, phaseOffset, scale }: FigureProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const startX = useRef(position[0]);

  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a2e',
    roughness: 0.8,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85,
  }), []);

  const glowMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#4a90d9',
    emissive: '#2a5fa0',
    emissiveIntensity: 0.6,
    roughness: 0.4,
    metalness: 0.3,
    transparent: true,
    opacity: 0.9,
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phaseOffset;
    const walkCycle = Math.sin(t * 2);
    const stride = 0.45;
    const armSwing = 0.35;
    const bodyBob = Math.abs(Math.sin(t * 2)) * 0.04;

    if (leftLegRef.current) leftLegRef.current.rotation.x = walkCycle * stride;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -walkCycle * stride;
    if (leftArmRef.current) leftArmRef.current.rotation.x = -walkCycle * armSwing;
    if (rightArmRef.current) rightArmRef.current.rotation.x = walkCycle * armSwing;
    if (bodyRef.current) bodyRef.current.position.y = bodyBob;

    if (groupRef.current) {
      groupRef.current.position.x += speed * 0.008;
      if (groupRef.current.position.x > 12) {
        groupRef.current.position.x = startX.current - 24;
      }
    }
  });

  const headR = 0.12 * scale;
  const torsoH = 0.38 * scale;
  const torsoW = 0.12 * scale;
  const legH = 0.36 * scale;
  const legW = 0.065 * scale;
  const armH = 0.3 * scale;
  const armW = 0.055 * scale;
  const hipW = 0.08 * scale;

  return (
    <group ref={groupRef} position={position}>
      <group ref={bodyRef}>
        <mesh position={[0, (torsoH / 2 + legH + headR) * 1.0, 0]} material={glowMat}>
          <sphereGeometry args={[headR, 8, 8]} />
        </mesh>

        <mesh position={[0, torsoH / 2 + legH, 0]} material={mat}>
          <boxGeometry args={[torsoW * 1.8, torsoH, torsoW]} />
        </mesh>

        <group ref={leftArmRef} position={[-torsoW * 1.1, torsoH + legH - armH * 0.1, 0]}>
          <mesh position={[0, -armH / 2, 0]} material={mat}>
            <boxGeometry args={[armW, armH, armW]} />
          </mesh>
        </group>

        <group ref={rightArmRef} position={[torsoW * 1.1, torsoH + legH - armH * 0.1, 0]}>
          <mesh position={[0, -armH / 2, 0]} material={mat}>
            <boxGeometry args={[armW, armH, armW]} />
          </mesh>
        </group>

        <group ref={leftLegRef} position={[-hipW, legH, 0]}>
          <mesh position={[0, -legH / 2, 0]} material={mat}>
            <boxGeometry args={[legW, legH, legW]} />
          </mesh>
        </group>

        <group ref={rightLegRef} position={[hipW, legH, 0]}>
          <mesh position={[0, -legH / 2, 0]} material={mat}>
            <boxGeometry args={[legW, legH, legW]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function GroundLine() {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const points = [new THREE.Vector3(-15, 0, 0), new THREE.Vector3(15, 0, 0)];
    geo.setFromPoints(points);
    return geo;
  }, []);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#4a90d9" transparent opacity={0.25} linewidth={1} />
    </line>
  );
}

function FloatingParticles() {
  const count = 120;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 5;
    }
    return pos;
  }, []);

  const geoRef = useRef<THREE.BufferGeometry>(null);

  useFrame(({ clock }) => {
    if (!geoRef.current) return;
    const pos = geoRef.current.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += 0.003;
      if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -5;
      pos[i * 3] += Math.sin(t * 0.3 + i) * 0.001;
    }
    geoRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#6ab0e8" size={0.03} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

const FIGURES: FigureProps[] = [
  { position: [-10, 0, -1], speed: 0.7, phaseOffset: 0, scale: 1 },
  { position: [-6, 0, -1.5], speed: 0.85, phaseOffset: 1.2, scale: 0.85 },
  { position: [-2, 0, -0.5], speed: 0.65, phaseOffset: 2.4, scale: 1.1 },
  { position: [2, 0, -2], speed: 0.9, phaseOffset: 0.7, scale: 0.75 },
  { position: [6, 0, -1], speed: 0.75, phaseOffset: 1.9, scale: 0.95 },
  { position: [10, 0, -1.8], speed: 0.8, phaseOffset: 3.1, scale: 0.9 },
  { position: [-8, 0, -3], speed: 0.6, phaseOffset: 0.5, scale: 0.7 },
  { position: [4, 0, -2.5], speed: 0.95, phaseOffset: 2.0, scale: 0.65 },
];

function Scene({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const cameraRef = useThree((s) => s.camera);

  useFrame(() => {
    const p = scrollProgress.current;
    (cameraRef as THREE.PerspectiveCamera).position.z = 5 - p * 1.5;
    (cameraRef as THREE.PerspectiveCamera).position.y = 2 + p * 0.5;
    (cameraRef as THREE.PerspectiveCamera).lookAt(0, 0.5, 0);
  });

  return (
    <>
      <BackgroundPlane />
      <DarkOverlay />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 3]} intensity={0.8} color="#c8d8f0" />
      <pointLight position={[-4, 3, 2]} intensity={1.2} color="#4a90d9" distance={12} />
      <pointLight position={[4, 2, 1]} intensity={0.6} color="#90c8ff" distance={8} />
      <FloatingParticles />
      <GroundLine />
      {FIGURES.map((fig, i) => (
        <WalkingFigure key={i} {...fig} />
      ))}
    </>
  );
}

interface HeroSceneProps {
  scrollYProgress: MotionValue<number>;
}

export function HeroScene({ scrollYProgress }: HeroSceneProps) {
  const scrollProgress = useRef(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    scrollProgress.current = v;
  });

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 55, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: 'transparent' }}
      >
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
