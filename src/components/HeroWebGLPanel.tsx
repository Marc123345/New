import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture, MeshTransmissionMaterial, Environment, Lightformer } from '@react-three/drei'
import { CuboidCollider, BallCollider, Physics, RigidBody } from '@react-three/rapier'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { easing } from 'maath'

// Your images
const PEOPLE_IMAGES = [
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200"
];

// Fallback for brandLogos if not imported
const brandLogos = []; 
const ALL_URLS = [...PEOPLE_IMAGES, ...brandLogos];

// 1. The Pointer Component
// This tracks the mouse and pushes objects out of the way physically
function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef()
  useFrame(({ mouse, viewport }) => {
    // Convert normalized mouse coordinates to 3D world space
    vec.lerp({ x: (mouse.x * viewport.width) / 2, y: (mouse.y * viewport.height) / 2, z: 0 }, 0.2)
    ref.current?.setNextKinematicTranslation(vec)
  })
  return (
    <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[2]} />
    </RigidBody>
  )
}

// 2. The Floating Cube Component
// We apply forces every frame to pull them to the center
function FloatingCube({ url, position }) {
  const api = useRef()
  const texture = useTexture(url)
  const vec = new THREE.Vector3()

  useFrame((state, delta) => {
    if (!api.current) return
    
    // Apply a spring-like force pulling the object towards the center (0,0,0)
    api.current.applyImpulse(
      vec.copy(api.current.translation()).negate().multiplyScalar(0.2)
    )
  })

  return (
    <RigidBody
      ref={api}
      linearDamping={4}   // How quickly they slow down moving
      angularDamping={1}  // How quickly they slow down spinning
      friction={0.1}
      position={position}
      colliders="cuboid"
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <MeshTransmissionMaterial
          map={texture}
          backside
          backsideThickness={1}
          thickness={2}
          roughness={0.15}
          ior={1.5}
          chromaticAberration={0.1}
          transmission={0.8}
        />
      </mesh>
    </RigidBody>
  )
}

// 3. The Main Scene Component
export function HeroWebGLPanel() {
  // Distribute objects randomly in a sphere at start
  const objects = useMemo(() => {
    return ALL_URLS.map((url, i) => {
      const position = [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      ]
      return { id: i, url, position }
    })
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [0, 0, 20], fov: 35, near: 1, far: 50 }}
        gl={{ antialias: false }} // Disabled antialias for better post-processing performance
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#f0f0f0']} />
        
        {/* Beautiful Lighting Setup */}
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        {/* Physics Environment */}
        <Physics gravity={[0, 0, 0]}>
          <Pointer />
          {objects.map((obj) => (
            <FloatingCube key={obj.id} url={obj.url} position={obj.position} />
          ))}
        </Physics>

        {/* Environment setup for glass reflections */}
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 3, 0, 1]}>
            <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
            <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
            <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[5, 1, -1]} scale={2} />
            <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
          </group>
        </Environment>

        {/* Ambient Occlusion (Shadows in corners) to make it look grounded */}
        <EffectComposer disableNormalPass multisampling={8}>
          <N8AO distanceFalloff={1} aoRadius={1} intensity={4} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}