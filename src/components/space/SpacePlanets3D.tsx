import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Ring } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetProps {
  position: [number, number, number];
  radius: number;
  color: string;
  emissive: string;
  emissiveIntensity: number;
  rotationSpeed: [number, number, number];
  hasRings?: boolean;
  ringColor?: string;
  atmosphereColor?: string;
  cloudOpacity?: number;
}

function Planet({
  position,
  radius,
  color,
  emissive,
  emissiveIntensity,
  rotationSpeed,
  hasRings = false,
  ringColor,
  atmosphereColor,
}: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  const noise = useMemo(() => {
    const size = 256;
    const data = new Uint8Array(size * size * 3);
    for (let i = 0; i < size * size; i++) {
      const v = Math.floor(Math.random() * 60 + 180);
      data[i * 3] = v;
      data[i * 3 + 1] = v;
      data[i * 3 + 2] = v;
    }
    const tex = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed[0] * delta;
      meshRef.current.rotation.y += rotationSpeed[1] * delta;
      meshRef.current.rotation.z += rotationSpeed[2] * delta;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += rotationSpeed[1] * delta * 0.5;
    }
  });

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[radius, 48, 48]}>
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.75}
          metalness={0.1}
          bumpMap={noise}
          bumpScale={0.04}
        />
      </Sphere>

      {atmosphereColor && (
        <Sphere ref={atmosphereRef} args={[radius * 1.08, 32, 32]}>
          <meshStandardMaterial
            color={atmosphereColor}
            transparent
            opacity={0.12}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </Sphere>
      )}

      {hasRings && (
        <Ring args={[radius * 1.4, radius * 2.1, 64]} rotation={[Math.PI / 3, 0.2, 0]}>
          <meshStandardMaterial
            color={ringColor || '#c8a87a'}
            side={THREE.DoubleSide}
            transparent
            opacity={0.45}
            roughness={1}
          />
        </Ring>
      )}
    </group>
  );
}

function FloatingAsteroid({ position, size }: { position: [number, number, number]; size: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const speed = useMemo(() => ({
    x: (Math.random() - 0.5) * 0.3,
    y: (Math.random() - 0.5) * 0.4,
    z: (Math.random() - 0.5) * 0.2,
  }), []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += speed.x * delta;
      ref.current.rotation.y += speed.y * delta;
      ref.current.rotation.z += speed.z * delta;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <dodecahedronGeometry args={[size, 0]} />
      <meshStandardMaterial color="#555566" roughness={0.95} metalness={0.1} />
    </mesh>
  );
}

function AmbientStars({ count = 200 }: { count?: number }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return pos;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export type PlanetPreset = 'hero' | 'ecosystem' | 'about';

interface SpacePlanets3DProps {
  preset?: PlanetPreset;
  className?: string;
  style?: React.CSSProperties;
}

const HERO_PLANETS: PlanetProps[] = [
  {
    position: [-12, 3, -18],
    radius: 2.8,
    color: '#1a3a6e',
    emissive: '#0d2550',
    emissiveIntensity: 0.3,
    rotationSpeed: [0.02, 0.08, 0.01],
    atmosphereColor: '#3a7bd5',
  },
  {
    position: [14, -5, -22],
    radius: 1.6,
    color: '#6e2a1a',
    emissive: '#501808',
    emissiveIntensity: 0.25,
    rotationSpeed: [0.01, 0.12, 0.02],
    atmosphereColor: '#d5603a',
  },
  {
    position: [5, 8, -30],
    radius: 4.2,
    color: '#3d2a60',
    emissive: '#1e1030',
    emissiveIntensity: 0.2,
    rotationSpeed: [0.005, 0.04, 0.01],
    hasRings: true,
    ringColor: '#8870cc',
    atmosphereColor: '#7b5ea7',
  },
  {
    position: [-18, -8, -25],
    radius: 1.1,
    color: '#2a5e40',
    emissive: '#0e2e1c',
    emissiveIntensity: 0.3,
    rotationSpeed: [0.03, 0.15, 0.02],
    atmosphereColor: '#4aaa70',
  },
];

const ECOSYSTEM_PLANETS: PlanetProps[] = [
  {
    position: [16, 6, -20],
    radius: 3.2,
    color: '#2a1a5e',
    emissive: '#120830',
    emissiveIntensity: 0.35,
    rotationSpeed: [0.01, 0.06, 0.01],
    hasRings: true,
    ringColor: '#a47cfc',
    atmosphereColor: '#6040cc',
  },
  {
    position: [-14, -4, -18],
    radius: 1.8,
    color: '#1a2a4a',
    emissive: '#0a1428',
    emissiveIntensity: 0.3,
    rotationSpeed: [0.02, 0.1, 0.015],
    atmosphereColor: '#4a7acc',
  },
  {
    position: [-6, 10, -26],
    radius: 2.4,
    color: '#4a1a30',
    emissive: '#200810',
    emissiveIntensity: 0.2,
    rotationSpeed: [0.015, 0.07, 0.02],
    atmosphereColor: '#cc4a80',
  },
  {
    position: [18, -9, -30],
    radius: 5.0,
    color: '#0e1e38',
    emissive: '#060e1e',
    emissiveIntensity: 0.15,
    rotationSpeed: [0.003, 0.025, 0.005],
    hasRings: true,
    ringColor: '#5080cc',
    atmosphereColor: '#2060b0',
  },
];

const ABOUT_PLANETS: PlanetProps[] = [
  {
    position: [13, 5, -20],
    radius: 2.0,
    color: '#1e1240',
    emissive: '#0c0820',
    emissiveIntensity: 0.4,
    rotationSpeed: [0.01, 0.09, 0.01],
    atmosphereColor: '#7050cc',
  },
  {
    position: [-16, -6, -24],
    radius: 3.6,
    color: '#301a60',
    emissive: '#180c30',
    emissiveIntensity: 0.3,
    rotationSpeed: [0.005, 0.04, 0.008],
    hasRings: true,
    ringColor: '#9870e0',
    atmosphereColor: '#8060d0',
  },
  {
    position: [7, -10, -28],
    radius: 1.4,
    color: '#1a301e',
    emissive: '#0c180e',
    emissiveIntensity: 0.25,
    rotationSpeed: [0.02, 0.13, 0.02],
    atmosphereColor: '#50b070',
  },
  {
    position: [-8, 12, -32],
    radius: 4.8,
    color: '#0e1828',
    emissive: '#060c14',
    emissiveIntensity: 0.15,
    rotationSpeed: [0.003, 0.02, 0.004],
    hasRings: true,
    ringColor: '#607090',
    atmosphereColor: '#304868',
  },
];

const ASTEROID_CONFIGS: { position: [number, number, number]; size: number }[] = [
  { position: [-20, 2, -15], size: 0.18 },
  { position: [10, 12, -18], size: 0.12 },
  { position: [20, -3, -20], size: 0.22 },
  { position: [-5, -14, -22], size: 0.15 },
  { position: [0, 15, -25], size: 0.1 },
];

function SceneContent({ preset }: { preset: PlanetPreset }) {
  const planets = preset === 'hero' ? HERO_PLANETS : preset === 'ecosystem' ? ECOSYSTEM_PLANETS : ABOUT_PLANETS;

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[20, 20, 10]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-15, -10, 5]} intensity={0.5} color="#4466cc" />
      <pointLight position={[0, 0, 15]} intensity={0.3} color="#cc8844" />

      <AmbientStars count={250} />

      {planets.map((p, i) => (
        <Planet key={i} {...p} />
      ))}

      {ASTEROID_CONFIGS.map((a, i) => (
        <FloatingAsteroid key={i} position={a.position} size={a.size} />
      ))}
    </>
  );
}

export function SpacePlanets3D({ preset = 'hero', className = '', style }: SpacePlanets3DProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ ...style, zIndex: 0 }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <SceneContent preset={preset} />
      </Canvas>
    </div>
  );
}
