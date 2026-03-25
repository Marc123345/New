/**
 * LusionConnectors — faithful TypeScript port of the pmndrs "Lusion connectors" demo.
 *
 * Motion model (matches original exactly)
 * ────────────────────────────────────────
 * • <Physics gravity={[0,0,0]}> → zero-gravity world.
 * • Each Connector is a dynamic RigidBody with linearDamping=4 / angularDamping=1.
 * • Every frame: applyImpulse( -translation * 0.2 ) pulls toward origin.
 * • No walls — centre-pull alone keeps connectors in frame.
 * • Pointer is a kinematic RigidBody with BallCollider(r=1), direct mouse tracking.
 * • Restitution=0 everywhere — soft, gooey inelastic collisions.
 * • Clicking cycles accent colours; accent connectors carry a pointLight.
 * • One connector uses MeshTransmissionMaterial for the glass effect.
 *
 * Geometry
 * ─────────
 * The original loads /c-transformed.glb. We reproduce the cross shape
 * procedurally by merging three BoxGeometries — no external file required.
 */

import { useRef, useReducer, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, Environment, Lightformer } from '@react-three/drei'
import {
  Physics,
  RigidBody,
  CuboidCollider,
  BallCollider,
} from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { easing } from 'maath'
import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// ─── Accent palette ───────────────────────────────────────────────────────────

const ACCENTS = ['#a46cfc', '#7c3aed', '#c084fc', '#9333ea'] as const

function connectorConfigs(accent = 0) {
  return [
    { color: '#444',            roughness: 0.1  },
    { color: '#444',            roughness: 0.75 },
    { color: '#444',            roughness: 0.75 },
    { color: 'red',             roughness: 0.1  },
    { color: 'white',           roughness: 0.75 },
    { color: 'white',           roughness: 0.1  },
    { color: ACCENTS[accent],   roughness: 0.1,  accent: true },
    { color: ACCENTS[accent],   roughness: 0.75, accent: true },
    { color: ACCENTS[accent],   roughness: 0.1,  accent: true },
  ]
}

// ─── Connector geometry (cross shape, built once) ─────────────────────────────

const connectorGeom: THREE.BufferGeometry = (() => {
  const arms = [
    new THREE.BoxGeometry(0.76, 2.54, 0.76),
    new THREE.BoxGeometry(2.54, 0.76, 0.76),
    new THREE.BoxGeometry(0.76, 0.76, 2.54),
  ]
  const merged = BufferGeometryUtils.mergeGeometries(arms) ?? new THREE.BoxGeometry(1, 1, 1)
  arms.forEach((a) => a.dispose())
  return merged
})()

// ─── Model ────────────────────────────────────────────────────────────────────

interface ModelProps {
  color?: string
  roughness?: number
  glass?: boolean
  children?: React.ReactNode
}

function Model({ color = 'white', roughness = 0, glass = false, children }: ModelProps) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((_s, dt) => {
    if (!children) {
      easing.dampC(
        (ref.current.material as THREE.MeshStandardMaterial).color,
        color,
        0.2,
        dt,
      )
    }
  })

  return (
    <mesh ref={ref} castShadow={!glass} receiveShadow geometry={connectorGeom}>
      {children ?? (
        <meshStandardMaterial metalness={0.2} roughness={roughness} />
      )}
    </mesh>
  )
}

// ─── Pointer (matches original: radius 1, direct tracking, no lerp) ─────────

function Pointer() {
  const ref = useRef<RapierRigidBody>(null)
  const vec = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ mouse, viewport }) => {
    ref.current?.setNextKinematicTranslation(
      vec.set((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0),
    )
  })

  return (
    <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1]} />
    </RigidBody>
  )
}

// ─── Connector (matches original: just centre-pull, no walls, no stuck logic) ─

interface ConnectorProps {
  position?: [number, number, number]
  color?: string
  roughness?: number
  accent?: boolean
  glass?: boolean
}

function Connector({
  position,
  color = 'white',
  roughness = 0,
  accent = false,
  glass = false,
}: ConnectorProps) {
  const api = useRef<RapierRigidBody>(null)
  const vec = useMemo(() => new THREE.Vector3(), [])
  const r   = THREE.MathUtils.randFloatSpread
  const pos = useMemo<[number, number, number]>(
    () => position ?? [r(10), r(10), r(10)],
    [], // eslint-disable-line react-hooks/exhaustive-deps
  )

  useFrame((_s, delta) => {
    if (!api.current) return
    // Exact same impulse as the original — no delta scaling, no stuck logic.
    // Centre-pull alone keeps connectors in frame; inter-body collisions
    // prevent clustering. Simple and clean.
    delta = Math.min(0.1, delta)
    api.current.applyImpulse(
      vec.copy(api.current.translation() as unknown as THREE.Vector3).negate().multiplyScalar(0.2),
      true,
    )
  })

  return (
    <RigidBody
      ref={api}
      position={pos}
      linearDamping={4}
      angularDamping={1}
      friction={0.1}
      colliders={false}
    >
      <CuboidCollider args={[0.38, 1.27, 0.38]} />
      <CuboidCollider args={[1.27, 0.38, 0.38]} />
      <CuboidCollider args={[0.38, 0.38, 1.27]} />

      {glass ? (
        <Model roughness={roughness} glass>
          <MeshTransmissionMaterial
            clearcoat={1}
            thickness={0.1}
            anisotropicBlur={0.1}
            chromaticAberration={0.1}
            samples={8}
            resolution={512}
          />
        </Model>
      ) : (
        <Model color={color} roughness={roughness} />
      )}

      {accent && <pointLight intensity={4} distance={2.5} color={color} />}
    </RigidBody>
  )
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene({ accent }: { accent: number }) {
  const connectors = useMemo(() => connectorConfigs(accent), [accent])

  return (
    <Physics gravity={[0, 0, 0]}>
      <Pointer />

      {/* 9 standard connectors */}
      {connectors.map((props, i) => (
        <Connector key={i} {...props} />
      ))}

      {/* Glass connector — starts off-screen, drifts in via centre-pull */}
      <Connector position={[10, 10, 5]} glass />

      <EffectComposer disableNormalPass multisampling={8}>
        <N8AO distanceFalloff={1} aoRadius={1} intensity={4} />
      </EffectComposer>

      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2}  position={[0, 5, -9]}   scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2}  position={[-5, 1, -1]}  scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2}  position={[-5, -1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]}   scale={8} />
        </group>
      </Environment>
    </Physics>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function LusionConnectors() {
  const [accent, cycleAccent] = useReducer(
    (s: number) => (s + 1) % ACCENTS.length,
    0,
  )

  return (
    <Canvas
      onClick={cycleAccent}
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: false }}
      camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }}
      style={{ width: '100%', height: '100%', cursor: 'grab' }}
    >
      <color attach="background" args={['#141622']} />
      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <Suspense fallback={null}>
        <Scene accent={accent} />
      </Suspense>
    </Canvas>
  )
}
