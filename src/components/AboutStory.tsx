import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { MotionValue } from 'motion/react';

// --- SHADERS FOR THE NEBULA ---
const vertexShader = `
  uniform float uTime;
  uniform float uScroll;
  attribute vec3 aSpiralPosition;
  attribute float aRandom;
  varying float vAlpha;

  void main() {
    // Phase 1 to Phase 2: Interpolate from random scattered (position) to organized spiral (aSpiralPosition)
    vec3 targetPos = mix(position, aSpiralPosition, uScroll);
    
    // Add subtle curl/wave noise based on time
    targetPos.x += sin(uTime * 0.5 + aRandom * 10.0) * 0.2 * (1.0 - uScroll);
    targetPos.y += cos(uTime * 0.3 + aRandom * 10.0) * 0.2 * (1.0 - uScroll);
    targetPos.z += sin(uTime * 0.4 + aRandom * 10.0) * 0.2;

    vec4 mvPosition = modelViewMatrix * vec4(targetPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation & twinkle
    gl_PointSize = (2.0 + aRandom * 3.0) * (1.0 / -mvPosition.z);
    
    // Fade out slightly during entropy, glow during convergence
    vAlpha = 0.3 + (sin(uTime * 2.0 + aRandom * 100.0) * 0.2) + (uScroll * 0.5);
  }
`;

const fragmentShader = `
  varying float vAlpha;
  uniform vec3 uColor;

  void main() {
    // Make points circular
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    if (distanceToCenter > 0.5) discard;
    
    // Soft glowing edges
    float alpha = smoothstep(0.5, 0.1, distanceToCenter) * vAlpha;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

// --- BACKGROUND NEBULA DUST ---
function NebulaDust({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const particleCount = 4000;

  const [positions, spiralPositions, randoms] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const spiral = new Float32Array(particleCount * 3);
    const rand = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Entropy (Scattered)
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;

      // Convergence (Spiral/Galactic Disk)
      const radius = Math.random() * 8 + 1;
      const angle = radius * 2.5 + Math.random() * Math.PI * 2;
      spiral[i * 3] = Math.cos(angle) * radius;
      spiral[i * 3 + 1] = (Math.random() - 0.5) * 1.5; // Flattened disk
      spiral[i * 3 + 2] = Math.sin(angle) * radius - 5;

      rand[i] = Math.random();
    }
    return [pos, spiral, rand];
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      // Get the current scroll value to drive the convergence
      materialRef.current.uniforms.uScroll.value = scrollYProgress.get();
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSpiralPosition" count={particleCount} array={spiralPositions} itemSize={3} />
        <bufferAttribute attach="attributes-aRandom" count={particleCount} array={randoms} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uColor: { value: new THREE.Color('#a46cfc') }, // H2H Brand Purple
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// --- CONSTELLATION WEB (Mouse Interaction) ---
function ConstellationWeb() {
  const linesRef = useRef<THREE.LineSegments>(null);
  const nodesCount = 100;
  const connectionDistance = 2.5;
  const mouseRadius = 3.0;

  const nodes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < nodesCount; i++) {
      arr.push(new THREE.Vector3((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5 - 2));
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!linesRef.current) return;
    
    // Create subtle movement for nodes
    const time = state.clock.elapsedTime * 0.1;
    const currentNodes = nodes.map((node, i) => {
      return new THREE.Vector3(
        node.x + Math.sin(time + i) * 0.5,
        node.y + Math.cos(time + i) * 0.5,
        node.z
      );
    });

    const positions = [];
    const mouse = new THREE.Vector3(
      (state.pointer.x * state.viewport.width) / 2,
      (state.pointer.y * state.viewport.height) / 2,
      0
    );

    // Calculate lines between close nodes
    for (let i = 0; i < nodesCount; i++) {
      for (let j = i + 1; j < nodesCount; j++) {
        const dist = currentNodes[i].distanceTo(currentNodes[j]);
        const distToMouse = Math.min(
          currentNodes[i].distanceTo(mouse),
          currentNodes[j].distanceTo(mouse)
        );

        // If nodes are close to each other AND close to the mouse, draw a line
        if (dist < connectionDistance && distToMouse < mouseRadius) {
          positions.push(
            currentNodes[i].x, currentNodes[i].y, currentNodes[i].z,
            currentNodes[j].x, currentNodes[j].y, currentNodes[j].z
          );
        }
      }
    }

    linesRef.current.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry />
      <lineBasicMaterial color="#e8e2ff" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

// --- MAIN WRAPPER ---
export function NeuralNebulaBackground({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <NebulaDust scrollYProgress={scrollYProgress} />
        <ConstellationWeb />
        
        {/* Awwwards-Level Post Processing */}
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.002, 0.002)} />
          <Noise premultiply blendFunction={BlendFunction.ADD} opacity={0.3} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}