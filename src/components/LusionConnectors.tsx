// Lusion.co connector demo — exact source, rapier physics
// https://twitter.com/lusionltd/status/1701534187545636964

import { useRef, useReducer, useMemo, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, MeshTransmissionMaterial, Environment, Lightformer } from '@react-three/drei'
import { CuboidCollider, BallCollider, Physics, RigidBody } from '@react-three/rapier'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { easing } from 'maath'
import * as THREE from 'three'
import { init as initRapier } from '@dimforge/rapier3d-compat'

// ─── H2H accent colors ────────────────────────────────────────────────────────

const accents = ['#a46cfc', '#7c3aed', '#c084fc', '#9333ea']

const shuffle = (accent = 0) => [
  { color: '#444', roughness: 0.1 },
  { color: '#444', roughness: 0.75 },
  { color: '#444', roughness: 0.75 },
  { color: '#1a0a2e', roughness: 0.1 },
  { color: 'white', roughness: 0.75 },
  { color: 'white', roughness: 0.1 },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: accents[accent], roughness: 0.75, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true },
]

// ─── Rapier pre-initializer ───────────────────────────────────────────────────
// rapier.es.js ships with import.meta.url deleted — we must pass the WASM URL
// explicitly so fetch() can load it from /public.

function useRapierReady() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    initRapier('/rapier_wasm3d_bg.wasm').then(() => setReady(true))
  }, [])
  return ready
}

// ─── GLB connector model ──────────────────────────────────────────────────────

function Model({
  children,
  color = 'white',
  roughness = 0,
}: {
  children?: React.ReactNode
  color?: string
  roughness?: number
}) {
  const ref = useRef<THREE.Mesh>(null!)
  const { nodes, materials } = useGLTF('/c-transformed.glb') as any
  useFrame((_state, delta) => {
    easing.dampC(ref.current.material.color, color, 0.2, delta)
  })
  return (
    <mesh ref={ref} castShadow receiveShadow scale={10} geometry={nodes.connector.geometry}>
      <meshStandardMaterial metalness={0.2} roughness={roughness} map={materials.base.map} />
      {children}
    </mesh>
  )
}

// ─── Connector rigid body ─────────────────────────────────────────────────────

function Connector({
  position,
  children,
  vec = new THREE.Vector3(),
  accent,
  color = 'white',
  roughness = 0,
}: {
  position?: [number, number, number]
  children?: React.ReactNode
  vec?: THREE.Vector3
  accent?: boolean
  color?: string
  roughness?: number
}) {
  const api = useRef<any>(null)
  const r = THREE.MathUtils.randFloatSpread
  const pos = useMemo<[number, number, number]>(() => position ?? [r(10), r(10), r(10)], []) // eslint-disable-line
  useFrame((_state, delta) => {
    delta = Math.min(0.1, delta)
    api.current?.applyImpulse(vec.copy(api.current.translation()).negate().multiplyScalar(0.2))
  })
  return (
    <RigidBody linearDamping={4} angularDamping={1} friction={0.1} position={pos} ref={api} colliders={false}>
      <CuboidCollider args={[0.38, 1.27, 0.38]} />
      <CuboidCollider args={[1.27, 0.38, 0.38]} />
      <CuboidCollider args={[0.38, 0.38, 1.27]} />
      {children ?? <Model color={color} roughness={roughness} />}
      {accent && <pointLight intensity={4} distance={2.5} color={color} />}
    </RigidBody>
  )
}

// ─── Kinematic mouse pointer ──────────────────────────────────────────────────

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef<any>(null)
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

// ─── Scene (only rendered after rapier WASM is ready) ────────────────────────

function Scene({ accent }: { accent: number }) {
  const connectors = useMemo(() => shuffle(accent), [accent])
  return (
    <>
      <color attach="background" args={['#141622']} />
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <Physics gravity={[0, 0, 0]}>
        <Pointer />
        {connectors.map((props, i) => (
          <Connector key={i} {...props} />
        ))}
        <Connector position={[10, 10, 5]}>
          <Model>
            <MeshTransmissionMaterial
              clearcoat={1}
              thickness={0.1}
              anisotropicBlur={0.1}
              chromaticAberration={0.1}
              samples={8}
              resolution={512}
            />
          </Model>
        </Connector>
      </Physics>
      <EffectComposer disableNormalPass multisampling={8}>
        <N8AO distanceFalloff={1} aoRadius={1} intensity={4} />
      </EffectComposer>
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
        </group>
      </Environment>
    </>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function LusionConnectors() {
  const [accent, click] = useReducer((s: number) => (s + 1) % accents.length, 0)
  const rapierReady = useRapierReady()

  return (
    <Canvas
      onClick={click}
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: false }}
      camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }}
      style={{ width: '100%', height: '100%' }}
    >
      {rapierReady && (
        <Suspense fallback={null}>
          <Scene accent={accent} />
        </Suspense>
      )}
    </Canvas>
  )
}

useGLTF.preload('/c-transformed.glb')
