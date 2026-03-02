'use client'; // Required if you are using Next.js App Router

import React, { useRef, useMemo, Suspense } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, useTexture, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// --- Types ---
interface SceneProps {
  scrollYProgress: MotionValue<number>;
}

// --- 3D Globe Component ---
const Globe = ({ scrollYProgress }: SceneProps) => {
  const planetTexture = useTexture('https://ik.imagekit.io/qcvroy8xpd/Planet.png');
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const lightRef = useRef<THREE.SpotLight>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);

  // Generate random node positions on the front-facing hemisphere (Africa side roughly)
  const nodeCount = 30;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const nodePositions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < nodeCount; i++) {
      // Math to place points roughly on the front hemisphere
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const x = 2.05 * Math.cos(theta) * Math.sin(phi); // 2.05 is slightly larger than sphere radius 2
      const y = 2.05 * Math.sin(theta) * Math.sin(phi);
      const z = 2.05 * Math.cos(phi);
      // Only keep nodes facing the camera (z > 0)
      if (z > 0.5) pos.push(new THREE.Vector3(x, y, z));
    }
    return pos;
  }, []);

  useFrame(() => {
    const progress = scrollYProgress.get(); // 0 to 1

    // Phase 1 (0-0.33): Faint spotlight
    // Phase 2 (0.33-0.66): Spotlight intensifies
    // Phase 3 (0.66-1.0): Max illumination
    
    // Animate Spotlight Intensity
    if (lightRef.current) {
      const baseIntensity = 5;
      const midIntensity = 20;
      const maxIntensity = 100;
      
      let currentIntensity = baseIntensity;
      if (progress > 0.33 && progress <= 0.66) {
        // Interpolate between Phase 1 and 2
        const localP = (progress - 0.33) / 0.33;
        currentIntensity = THREE.MathUtils.lerp(baseIntensity, midIntensity, localP);
      } else if (progress > 0.66) {
        // Interpolate between Phase 2 and 3
        const localP = (progress - 0.66) / 0.34;
        currentIntensity = THREE.MathUtils.lerp(midIntensity, maxIntensity, localP);
      }
      lightRef.current.intensity = currentIntensity;
    }

    // Animate Nodes (Opacity and Emissive intensity)
    if (nodesRef.current && nodesRef.current.material) {
      const mat = nodesRef.current.material as THREE.MeshStandardMaterial;
      if (progress < 0.33) {
        mat.opacity = 0;
        mat.emissiveIntensity = 0;
      } else if (progress >= 0.33 && progress < 0.66) {
        const localP = (progress - 0.33) / 0.33;
        mat.opacity = THREE.MathUtils.lerp(0, 1, localP);
        mat.emissiveIntensity = THREE.MathUtils.lerp(0, 2, localP);
      } else {
        const localP = (progress - 0.66) / 0.34;
        mat.opacity = 1;
        mat.emissiveIntensity = THREE.MathUtils.lerp(2, 8, localP); // Huge bloom trigger
      }
    }
  });

  return (
    <group rotation={[0.2, -0.5, 0]}> {/* Adjusted to put Africa in view */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        {/* The Planet */}
        <Sphere args={[2, 64, 64]}>
          <meshStandardMaterial 
            ref={materialRef}
            map={planetTexture}
            roughness={0.8}
            metalness={0.2}
          />
        </Sphere>

        {/* The Glowing Nodes (Instanced for performance) */}
        <instancedMesh ref={nodesRef} args={[undefined, undefined, nodePositions.length]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial 
            color="#A46CFC" 
            emissive="#A46CFC" 
            transparent 
            opacity={0}
            emissiveIntensity={0}
          />
          {nodePositions.map((pos, i) => {
            dummy.position.copy(pos);
            dummy.updateMatrix();
            nodesRef.current?.setMatrixAt(i, dummy.matrix);
            return null;
          })}
        </instancedMesh>
      </Float>

      {/* Targetting Spotlight for Africa */}
      <spotLight 
        ref={lightRef}
        position={[5, 2, 5]} 
        angle={0.5} 
        penumbra={1} 
        color="#A46CFC" 
        distance={20}
      />
      <ambientLight intensity={0.1} />
    </group>
  );
};

// --- UI Overlay Component ---
const StoryText = ({ 
  title, 
  subtitle, 
  description, 
  progressRange, 
  scrollYProgress 
}: { 
  title: string, 
  subtitle: string, 
  description: string, 
  progressRange: [number, number, number, number], 
  scrollYProgress: MotionValue<number> 
}) => {
  // Fade in and out based on the specific scroll range
  const opacity = useTransform(scrollYProgress, progressRange, [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, progressRange, [40, 0, 0, -40]);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col justify-center px-8 md:px-16"
      style={{ opacity, y, pointerEvents: 'none' }}
    >
      <h3 className="text-purple-500 text-sm md:text-md uppercase tracking-widest mb-2 font-bold">
        {subtitle}
      </h3>
      <motion.div className="h-px w-16 bg-purple-500/50 mb-6" />
      <h2 className="text-4xl md:text-6xl text-white uppercase font-black leading-tight mb-6" style={{ fontFamily: 'var(--font-stack-heading)' }}>
        {title}
      </h2>
      <p className="text-gray-300 text-lg md:text-xl max-w-lg leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

// --- Main Layout Component ---
export function AboutStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div 
      ref={containerRef} 
      className="relative w-full"
      style={{ 
        height: '300vh', 
        background: 'linear-gradient(160deg, #06030f 0%, #0e0820 50%, #030108 100%)' 
      }}
    >
      <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Column: UI overlay */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full z-10 flex items-center">
          <StoryText 
            subtitle="View of Africa at Night (Current)"
            title="The Digital Era (c. 2010s)"
            description="Data networks connect fiber cable and satellite links. Businesses started moving online, but real connection remained scarce."
            progressRange={[0, 0.1, 0.25, 0.33]}
            scrollYProgress={scrollYProgress}
          />
          <StoryText 
            subtitle="The Next Evolution"
            title="The AI Era (c. 2020s-Present)"
            description="Artificial intelligence transforms industries and connectivity. New nodes light up as automation takes over, but humanity gets lost in the noise."
            progressRange={[0.33, 0.4, 0.55, 0.66]}
            scrollYProgress={scrollYProgress}
          />
          <StoryText 
            subtitle="Full Illumination"
            title="The H2H Difference"
            description="When Human Collaboration meets Digital & AI Foundations. A United, Illuminated Continent. We bring the human energy back."
            progressRange={[0.66, 0.75, 1, 1]}
            scrollYProgress={scrollYProgress}
          />
        </div>

        {/* Right Column: 3D Canvas */}
        <div className="absolute inset-0 md:relative md:w-1/2 h-full z-0 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            {/* The Suspense Boundary catches the component while the texture loads */}
            <Suspense fallback={null}>
              <Globe scrollYProgress={scrollYProgress} />
            </Suspense>
            
            {/* Post Processing for the Neon glow */}
            <EffectComposer>
              <Bloom 
                luminanceThreshold={0.2} 
                mipmapBlur 
                intensity={1.5} 
              />
            </EffectComposer>
          </Canvas>
        </div>

      </div>
    </div>
  );
}