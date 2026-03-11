import * as THREE from 'three'
import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import { useSpring } from '@react-spring/core'
import { animated } from '@react-spring/three'

const SILVER = '#b0b2be'
const DARK_CHASSIS = '#a0a2ae'
const KEYBOARD = '#14141f'
const TRACKPAD_COLOR = '#9496a4'
const SCREEN_OFF = '#060612'

function LaptopModel({ open }: { open: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  const { lidAngle } = useSpring({
    lidAngle: open ? -1.78 : 0.08,
    config: { mass: 1.2, tension: 150, friction: 28 },
  })

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    if (open) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        Math.sin(t / 9) * 0.28,
        0.04,
      )
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        0.25 + Math.sin(t * 0.85) * 0.18,
        0.04,
      )
    } else {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.07)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.07)
    }
  })

  return (
    <group ref={groupRef}>

      {/* ── BASE BODY ── */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[3.0, 0.11, 2.0]} />
        <meshPhysicalMaterial color={SILVER} metalness={0.92} roughness={0.08} />
      </mesh>

      {/* Base underside chamfer hint (thin bottom edge) */}
      <mesh position={[0, -0.062, 0]}>
        <boxGeometry args={[2.95, 0.01, 1.95]} />
        <meshPhysicalMaterial color={DARK_CHASSIS} metalness={0.85} roughness={0.12} />
      </mesh>

      {/* Keyboard recess */}
      <mesh position={[0, 0.057, -0.18]}>
        <boxGeometry args={[2.45, 0.006, 1.35]} />
        <meshStandardMaterial color={KEYBOARD} roughness={0.85} metalness={0.15} />
      </mesh>

      {/* Trackpad */}
      <mesh position={[0, 0.057, 0.72]}>
        <boxGeometry args={[0.78, 0.006, 0.48]} />
        <meshPhysicalMaterial color={TRACKPAD_COLOR} metalness={0.72} roughness={0.18} />
      </mesh>

      {/* Speaker grille hint (left) */}
      <mesh position={[-1.2, 0.057, -0.1]}>
        <boxGeometry args={[0.12, 0.004, 0.55]} />
        <meshStandardMaterial color="#0e0e1c" roughness={0.95} />
      </mesh>
      {/* Speaker grille hint (right) */}
      <mesh position={[1.2, 0.057, -0.1]}>
        <boxGeometry args={[0.12, 0.004, 0.55]} />
        <meshStandardMaterial color="#0e0e1c" roughness={0.95} />
      </mesh>

      {/* ── LID ── pivot at back-top edge: (0, 0.055, -1.0) */}
      <animated.group position={[0, 0.055, -1.0]} rotation-x={lidAngle}>

        {/* Lid outer shell — center 1.0 forward from hinge */}
        <mesh castShadow position={[0, 0, 1.0]}>
          <boxGeometry args={[3.0, 0.09, 2.0]} />
          <meshPhysicalMaterial color={SILVER} metalness={0.92} roughness={0.08} />
        </mesh>

        {/* Lid inner face (dark bezel border) */}
        <mesh position={[0, 0.047, 0.96]}>
          <boxGeometry args={[2.82, 0.005, 1.82]} />
          <meshStandardMaterial color="#0a0a18" roughness={0.9} metalness={0.1} />
        </mesh>

        {/* Apple logo-ish notch on outer back */}
        <mesh position={[0, -0.047, 0.96]}>
          <boxGeometry args={[0.28, 0.003, 0.28]} />
          <meshPhysicalMaterial color="#d0d2de" metalness={0.98} roughness={0.04} emissive={open ? new THREE.Color(0.55, 0.35, 1.0) : new THREE.Color(0.02, 0.02, 0.04)} emissiveIntensity={open ? 1.2 : 0.05} />
        </mesh>

        {/*
          Screen plane — rotation-x={-π/2} makes it face +y in group space.
          When lid opens (group rotation-x ≈ -1.78), the normal rotates to face
          the camera, making the screen visible from the front.
        */}
        <mesh position={[0, 0.05, 0.96]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[2.42, 1.56]} />
          <meshStandardMaterial
            color={open ? '#0e0824' : SCREEN_OFF}
            emissive={open ? new THREE.Color(0.38, 0.12, 0.98) : new THREE.Color(0, 0, 0)}
            emissiveIntensity={open ? 0.9 : 0}
            roughness={0.05}
            metalness={0.0}
          />
        </mesh>

        {/* Screen glow halo (slightly larger, more transparent) */}
        <mesh position={[0, 0.048, 0.96]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[2.55, 1.68]} />
          <meshStandardMaterial
            color="#3a0dcc"
            transparent
            opacity={open ? 0.18 : 0}
            emissive={new THREE.Color(0.5, 0.18, 1.0)}
            emissiveIntensity={open ? 2.5 : 0}
            depthWrite={false}
          />
        </mesh>

        {/* Screen ambient point light when open */}
        {open && (
          <pointLight
            position={[0, 0.3, 0.96]}
            color="#a46cfc"
            intensity={1.8}
            distance={3.5}
            decay={2}
          />
        )}

      </animated.group>

    </group>
  )
}

export function Laptop3D() {
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{ width: '100%', height: '100%', cursor: 'pointer' }}
      title={open ? 'Click to close' : 'Click to open'}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 2.2, 7.5], fov: 28 }}
        shadows
      >
        <ambientLight intensity={0.55} color="#e0d8ff" />
        <spotLight
          position={[5, 8, 6]}
          angle={0.18}
          penumbra={0.9}
          intensity={1.4}
          castShadow
          shadow-mapSize={[1024, 1024]}
          color="#ffffff"
        />
        <pointLight position={[-4, 4, -4]} intensity={0.5} color="#a46cfc" />
        <pointLight position={[4, 2, 6]} intensity={0.3} color="#e8e0ff" />

        <Suspense fallback={null}>
          <group onClick={(e) => { e.stopPropagation(); setOpen((o) => !o) }}>
            <LaptopModel open={open} />
          </group>
          <Environment preset="city" />
        </Suspense>

        <ContactShadows
          position={[0, -0.62, 0]}
          opacity={0.45}
          scale={10}
          blur={2.5}
          far={3}
          color="#291e56"
        />
      </Canvas>
    </div>
  )
}
