// Lusion.co connector demo — GLB models, pure-JS physics (no WASM)

import { useRef, useReducer, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, MeshTransmissionMaterial, Environment, Lightformer } from '@react-three/drei'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { easing } from 'maath'
import * as THREE from 'three'

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

// ─── Mouse world position tracker ────────────────────────────────────────────

function MouseTracker({ target }: { target: React.MutableRefObject<THREE.Vector3> }) {
  const { viewport } = useThree()
  useFrame(({ mouse }) => {
    target.current.set(
      (mouse.x * viewport.width) / 2,
      (mouse.y * viewport.height) / 2,
      0,
    )
  })
  return null
}

// ─── Single connector (pure-JS physics) ──────────────────────────────────────

function Connector({
  color = 'white',
  roughness = 0,
  accent = false,
  glass = false,
  mouse,
}: {
  color?: string
  roughness?: number
  accent?: boolean
  glass?: boolean
  mouse: React.MutableRefObject<THREE.Vector3>
}) {
  const group = useRef<THREE.Group>(null!)
  const r = THREE.MathUtils.randFloatSpread

  // stable per-instance state
  const state = useMemo(() => ({
    pos: new THREE.Vector3(r(8), r(8), r(3)),
    vel: new THREE.Vector3((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 1),
    rot: new THREE.Euler(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2),
    rotV: new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 0.5),
  }), []) // eslint-disable-line

  useFrame((_s, dt) => {
    const d = Math.min(dt, 0.05)
    const { pos, vel, rot, rotV } = state

    // centre-seeking (zero gravity feel)
    vel.addScaledVector(pos, -0.15 * d * 60)
    // linear damping
    vel.multiplyScalar(Math.pow(0.985, d * 60))

    // mouse repulsion
    const mx = pos.x - mouse.current.x
    const my = pos.y - mouse.current.y
    const md = Math.sqrt(mx * mx + my * my)
    if (md < 2.0 && md > 0.001) {
      const f = (2.0 - md) * 4.0
      vel.x += (mx / md) * f * d
      vel.y += (my / md) * f * d
    }

    pos.addScaledVector(vel, d)

    // soft wall bounce
    const WALL = 5.5
    if (Math.abs(pos.x) > WALL) { vel.x *= -0.65; pos.x = Math.sign(pos.x) * WALL }
    if (Math.abs(pos.y) > WALL) { vel.y *= -0.65; pos.y = Math.sign(pos.y) * WALL }
    if (Math.abs(pos.z) > 2.5)  { vel.z *= -0.65; pos.z = Math.sign(pos.z) * 2.5 }

    // tumble
    rot.x += rotV.x * d * 0.6
    rot.y += rotV.y * d * 0.6
    rot.z += rotV.z * d * 0.3

    group.current.position.copy(pos)
    group.current.rotation.copy(rot)
  })

  return (
    <group ref={group}>
      {glass ? (
        <Model roughness={roughness} color={color}>
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
    </group>
  )
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene({ accent }: { accent: number }) {
  const mouse = useRef(new THREE.Vector3())
  const connectors = useMemo(() => shuffle(accent), [accent])

  return (
    <>
      <color attach="background" args={['#141622']} />
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <MouseTracker target={mouse} />

      {connectors.map((props, i) => (
        <Connector key={i} {...props} mouse={mouse} />
      ))}
      {/* Glass connector — fixed spawn off-screen, drifts in */}
      <Connector glass roughness={0} color="white" mouse={mouse} />

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

  return (
    <Canvas
      onClick={click}
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: false }}
      camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <Scene accent={accent} />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload('/c-transformed.glb')
