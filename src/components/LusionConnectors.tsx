import { useRef, useReducer, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshTransmissionMaterial, Environment, Lightformer } from '@react-three/drei'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { easing } from 'maath'
import * as THREE from 'three'

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

// ─── Model ────────────────────────────────────────────────────────────────────

function Model({ children, color = 'white', roughness = 0 }: {
  children?: React.ReactNode; color?: string; roughness?: number
}) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((_s, dt) => { easing.dampC(ref.current.material.color, color, 0.2, dt) })
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[0.75, 0.75, 0.75]} />
      <meshStandardMaterial metalness={0.2} roughness={roughness} />
      {children}
    </mesh>
  )
}

// ─── Pointer sphere (kinematic, repels nearby objects) ────────────────────────

function PointerRepulsor({ target }: { target: React.MutableRefObject<THREE.Vector3> }) {
  const { viewport } = useThree()
  useFrame(({ mouse }) => {
    target.current.set(
      (mouse.x * viewport.width)  / 2,
      (mouse.y * viewport.height) / 2,
      0,
    )
  })
  return null
}

// ─── Physics constants ────────────────────────────────────────────────────────
//
// Camera sits at z=15, fov=17.5 — visible world at z=0:
//   half-height ≈ 15 * tan(8.75°) ≈ 2.31 units
//   half-width  ≈ 2.31 * aspect   ≈ 4.1  units (16:9)
//
// All constants are tuned to that coordinate space.

const REPEL_RADIUS  = 1.8   // inter-object repulsion distance
const REPEL_FORCE   = 10.0  // repulsion magnitude
const MOUSE_RADIUS  = 2.8   // mouse push radius
const MOUSE_FORCE   = 6.0
const CENTER_PULL   = 0.06  // gentle pull back to origin
const DAMPING       = 0.965 // velocity decay
const WALL_X        = 4.5
const WALL_Y        = 2.8
const WALL_Z        = 2.0

// ─── Connector ────────────────────────────────────────────────────────────────

function Connector({ color = 'white', roughness = 0, accent = false, glass = false, mouse, positions, index, startPos }: {
  color?: string; roughness?: number; accent?: boolean; glass?: boolean
  mouse: React.MutableRefObject<THREE.Vector3>
  positions: React.MutableRefObject<THREE.Vector3[]>
  index: number
  startPos: [number, number, number]
}) {
  const group = useRef<THREE.Group>(null!)

  const state = useMemo(() => ({
    pos: new THREE.Vector3(...startPos),
    vel: new THREE.Vector3(
      (Math.random() - 0.5) * 1.2,
      (Math.random() - 0.5) * 1.2,
      (Math.random() - 0.5) * 0.3,
    ),
    rot: new THREE.Euler(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    ),
    rotV: new THREE.Vector3(
      (Math.random() - 0.5) * 1.5,
      (Math.random() - 0.5) * 1.5,
      (Math.random() - 0.5) * 0.4,
    ),
  }), []) // eslint-disable-line

  useFrame((_s, dt) => {
    const d = Math.min(dt, 0.05)
    const { pos, vel, rot, rotV } = state

    // register own position
    positions.current[index] = pos

    // 1 — weak centre pull
    vel.x += -pos.x * CENTER_PULL * d * 60
    vel.y += -pos.y * CENTER_PULL * d * 60
    vel.z += -pos.z * CENTER_PULL * d * 60 * 0.5

    // 2 — repel every other connector
    for (let i = 0; i < positions.current.length; i++) {
      if (i === index) continue
      const other = positions.current[i]
      if (!other) continue
      const dx = pos.x - other.x
      const dy = pos.y - other.y
      const dz = pos.z - other.z
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001
      if (dist < REPEL_RADIUS) {
        const f = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_FORCE * d
        vel.x += (dx / dist) * f
        vel.y += (dy / dist) * f
        vel.z += (dz / dist) * f * 0.3
      }
    }

    // 3 — mouse repulsion
    const mx = pos.x - mouse.current.x
    const my = pos.y - mouse.current.y
    const md = Math.sqrt(mx * mx + my * my) || 0.001
    if (md < MOUSE_RADIUS) {
      const f = ((MOUSE_RADIUS - md) / MOUSE_RADIUS) * MOUSE_FORCE * d
      vel.x += (mx / md) * f
      vel.y += (my / md) * f
    }

    // 4 — damping
    vel.multiplyScalar(Math.pow(DAMPING, d * 60))

    // 5 — integrate
    pos.addScaledVector(vel, d)

    // 6 — wall bounce
    if (Math.abs(pos.x) > WALL_X) { vel.x *= -0.6; pos.x = Math.sign(pos.x) * WALL_X }
    if (Math.abs(pos.y) > WALL_Y) { vel.y *= -0.6; pos.y = Math.sign(pos.y) * WALL_Y }
    if (Math.abs(pos.z) > WALL_Z) { vel.z *= -0.6; pos.z = Math.sign(pos.z) * WALL_Z }

    // 7 — tumble
    rot.x += rotV.x * d * 0.5
    rot.y += rotV.y * d * 0.5
    rot.z += rotV.z * d * 0.25

    group.current.position.copy(pos)
    group.current.rotation.copy(rot)
  })

  return (
    <group ref={group}>
      {glass ? (
        <Model roughness={roughness} color={color}>
          <MeshTransmissionMaterial clearcoat={1} thickness={0.1} anisotropicBlur={0.1} chromaticAberration={0.1} samples={8} resolution={512} />
        </Model>
      ) : (
        <Model color={color} roughness={roughness} />
      )}
      {accent && <pointLight intensity={4} distance={2.5} color={color} />}
    </group>
  )
}

// ─── Scene ────────────────────────────────────────────────────────────────────

// Pre-separated start positions spread across the visible viewport.
// Camera fov=17.5 at z=15 → visible ≈ ±4 x × ±2.2 y at z=0.
// Using a loose grid so objects never start on top of each other.
const START_POSITIONS: [number, number, number][] = [
  [-3.2,  1.6,  0.8],
  [-1.2,  1.8, -0.5],
  [ 1.2,  1.5,  0.6],
  [ 3.0,  1.7, -0.8],
  [-3.4, -0.1,  0.4],
  [-0.6,  0.0, -0.7],
  [ 2.2,  0.0,  0.9],
  [-2.0, -1.6,  0.3],
  [ 0.4, -1.8, -0.6],
  [ 3.2, -1.5,  0.7],
]

function Scene({ accent }: { accent: number }) {
  const mouse = useRef(new THREE.Vector3())
  const connectors = useMemo(() => shuffle(accent), [accent])
  const allItems = useMemo(() => [...connectors, { color: 'white', roughness: 0, glass: true }], [connectors])
  const positions = useRef<THREE.Vector3[]>([])

  return (
    <>
      <color attach="background" args={['#141622']} />
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <PointerRepulsor target={mouse} />

      {allItems.map((props, i) => (
        <Connector
          key={i}
          index={i}
          positions={positions}
          mouse={mouse}
          startPos={START_POSITIONS[i % START_POSITIONS.length]}
          {...props}
        />
      ))}

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
    <Canvas onClick={click} shadows dpr={[1, 1.5]} gl={{ antialias: false }}
      camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }}
      style={{ width: '100%', height: '100%' }}>
      <Suspense fallback={null}>
        <Scene accent={accent} />
      </Suspense>
    </Canvas>
  )
}
