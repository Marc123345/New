/**
 * LusionConnectors — faithful TypeScript port of the pmndrs "Lusion connectors" demo.
 *
 * Motion model
 * ─────────────
 * • <Physics gravity={[0,0,0]}> → zero-gravity world.
 * • Each Connector is a dynamic RigidBody with linearDamping=4 / angularDamping=1
 *   so it slows down quickly on its own.
 * • Every frame, applyImpulse( -translation * 0.2 ) pulls the body back toward
 *   the origin — giving the drifting "back to centre" feel.
 * • Soft wall repulsion starts 1.2 units from each wall, gently steering
 *   connectors inward before they hit the hard collider.
 * • Pointer is a kinematic RigidBody that lerp-tracks the mouse each frame.
 *   Its BallCollider(r=1.5) physically pushes any connector that gets close.
 * • Clicking cycles through accent colours; the accent connector carries a
 *   pointLight so it glows.
 * • One connector uses MeshTransmissionMaterial for the glass effect.
 *
 * Geometry
 * ─────────
 * The original demo loads /c-transformed.glb (a cross-shaped connector piece).
 * We reproduce that shape procedurally by merging three BoxGeometries into a
 * single BufferGeometry — same three-arm cuboid the pmndrs example uses,
 * no external file required.
 */

import { useRef, useReducer, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
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

// ─── Physics constants ────────────────────────────────────────────────────────

const CENTRE_PULL    = 0.2    // matches original pmndrs impulse scale
const WALL_MARGIN    = 1.2    // soft repulsion begins this far from wall
const WALL_PUSH      = 0.4    // repulsion strength (ramps linearly within margin)
const NUDGE_SPEED    = 2.0    // velocity set when genuinely stuck at origin
const NUDGE_COOLDOWN = 60     // frames of being stuck before nudging (~1 s)
const POINTER_LERP   = 0.5    // pointer tracking smoothness (0 = frozen, 1 = instant)
const WALL_X         = 5      // wall half-extents
const WALL_Y         = 3
const WALL_Z         = 3

// ─── Accent palette ───────────────────────────────────────────────────────────

const ACCENTS = ['#a46cfc', '#7c3aed', '#c084fc', '#9333ea'] as const

function connectorConfigs(accent = 0) {
  return [
    { color: '#444',            roughness: 0.1  },
    { color: '#444',            roughness: 0.75 },
    { color: '#555',            roughness: 0.5  },
    { color: '#2a1055',         roughness: 0.1  },
    { color: 'white',           roughness: 0.75 },
    { color: 'white',           roughness: 0.1  },
    { color: ACCENTS[accent],   roughness: 0.1,  accent: true },
    { color: ACCENTS[accent],   roughness: 0.75, accent: true },
    { color: ACCENTS[accent],   roughness: 0.1,  accent: true },
  ]
}

// ─── Connector geometry (cross shape, built once) ─────────────────────────────
//
// Three arms matching the CuboidCollider half-extents used below:
//   [0.38, 1.27, 0.38]  →  BoxGeometry(0.76, 2.54, 0.76)  (vertical)
//   [1.27, 0.38, 0.38]  →  BoxGeometry(2.54, 0.76, 0.76)  (horizontal)
//   [0.38, 0.38, 1.27]  →  BoxGeometry(0.76, 0.76, 2.54)  (depth)

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
  /** Smoothly animated target colour (maath easing). */
  color?: string
  roughness?: number
  /** When true the mesh is transparent — skip castShadow. */
  glass?: boolean
  /** Pass <MeshTransmissionMaterial> as child for the glass connector. */
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

// ─── Pointer ──────────────────────────────────────────────────────────────────

function Pointer() {
  const ref = useRef<RapierRigidBody>(null)
  const vec = useMemo(() => new THREE.Vector3(), [])
  const active = useRef(false)
  const needsWarp = useRef(true)
  const { gl } = useThree()

  useEffect(() => {
    const activate = () => { active.current = true }
    const el = gl.domElement
    el.addEventListener('pointermove', activate, { once: true })
    return () => el.removeEventListener('pointermove', activate)
  }, [gl])

  useFrame(({ mouse, viewport }) => {
    if (!ref.current || !active.current) return

    const tx = (mouse.x * viewport.width) / 2
    const ty = (mouse.y * viewport.height) / 2

    if (needsWarp.current) {
      // First active frame: warp instantly so we don't sweep from z = 20.
      needsWarp.current = false
      vec.set(tx, ty, 0)
      ref.current.setTranslation(vec, true)
    } else {
      // Lerp toward mouse — caps effective kinematic velocity so the pointer
      // can't teleport through the cluster and launch everything in one frame.
      const curr = ref.current.translation()
      vec.set(
        curr.x + (tx - curr.x) * POINTER_LERP,
        curr.y + (ty - curr.y) * POINTER_LERP,
        0,
      )
      ref.current.setNextKinematicTranslation(vec)
    }
  })

  return (
    <RigidBody ref={ref} type="kinematicPosition" colliders={false} position={[0, 0, 20]} restitution={0.5}>
      <BallCollider args={[1.5]} />
    </RigidBody>
  )
}

// ─── Connector ────────────────────────────────────────────────────────────────

interface ConnectorProps {
  position?: [number, number, number]
  color?: string
  roughness?: number
  accent?: boolean
  /** Renders the glass / transmission variant. */
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
    () => position ?? [r(7), r(4), r(4)],
    [], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const stuckFrames = useRef(0)
  const firstFrame  = useRef(true)

  useFrame((_s, delta) => {
    if (!api.current) return

    // ── First-frame kick — scene looks alive immediately ──────────────────
    if (firstFrame.current) {
      firstFrame.current = false
      api.current.setLinvel(
        { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, z: (Math.random() - 0.5) * 0.5 },
        true,
      )
      api.current.setAngvel(
        { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, z: (Math.random() - 0.5) * 2 },
        true,
      )
      return
    }

    const d = Math.min(delta, 0.1)
    const s = d * 60 // frame-rate normalisation
    const t = api.current.translation()
    const v = api.current.linvel()

    const dist  = Math.sqrt(t.x * t.x + t.y * t.y + t.z * t.z)
    const speed = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)

    // ── Centre pull — always active ───────────────────────────────────────
    vec.set(t.x, t.y, t.z).negate().multiplyScalar(CENTRE_PULL * s)

    // ── Soft wall repulsion — prevents corner trapping ────────────────────
    // Ramps linearly from 0 at (WALL - MARGIN) to full WALL_PUSH at the wall.
    // Combined with centre-pull this gently steers connectors inward before
    // they hit the hard collider, eliminating corner-vibration entirely.
    const px = Math.abs(t.x) - (WALL_X - WALL_MARGIN)
    const py = Math.abs(t.y) - (WALL_Y - WALL_MARGIN)
    const pz = Math.abs(t.z) - (WALL_Z - WALL_MARGIN)
    if (px > 0) vec.x -= Math.sign(t.x) * (px / WALL_MARGIN) * WALL_PUSH * s
    if (py > 0) vec.y -= Math.sign(t.y) * (py / WALL_MARGIN) * WALL_PUSH * s
    if (pz > 0) vec.z -= Math.sign(t.z) * (pz / WALL_MARGIN) * WALL_PUSH * s

    api.current.applyImpulse(vec, true)

    // ── Stuck nudge — only when genuinely stuck near origin ───────────────
    // With 10 connectors jostling each other this almost never fires, but it
    // catches the rare edge-case of a body at rest right at the origin.
    // setLinvel is used (not applyImpulse) so the nudge survives heavy damping.
    if (dist < 0.3 && speed < 0.05) {
      stuckFrames.current++
      if (stuckFrames.current >= NUDGE_COOLDOWN) {
        stuckFrames.current = 0
        const nx = Math.random() - 0.5
        const ny = Math.random() - 0.5
        const nz = Math.random() - 0.5
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1
        api.current.setLinvel(
          { x: (nx / len) * NUDGE_SPEED, y: (ny / len) * NUDGE_SPEED, z: (nz / len) * NUDGE_SPEED },
          true,
        )
      }
    } else {
      stuckFrames.current = 0
    }
  })

  return (
    <RigidBody
      ref={api}
      position={pos}
      linearDamping={4}
      angularDamping={1}
      friction={0.1}
      restitution={0.5}
      colliders={false}
    >
      <CuboidCollider args={[0.38, 1.27, 0.38]} />
      <CuboidCollider args={[1.27, 0.38, 0.38]} />
      <CuboidCollider args={[0.38, 0.38, 1.27]} />

      {glass ? (
        <Model roughness={roughness} glass>
          <MeshTransmissionMaterial
            clearcoat={1}
            thickness={0.5}
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

// ─── Walls ────────────────────────────────────────────────────────────────────
//
// Six invisible fixed planes that match the visible viewport bounds.
// Camera fov=17.5 at z=15 → visible ≈ ±4.1 x / ±2.3 y at z=0.
// Walls sit just beyond those edges. Soft repulsion handles most steering;
// the hard colliders are a safety net for fast-moving bodies.

function Walls() {
  return (
    <>
      <RigidBody type="fixed" friction={0} restitution={0.5} position={[ 5,  0,  0]}><CuboidCollider args={[0.1, 10, 10]} /></RigidBody>
      <RigidBody type="fixed" friction={0} restitution={0.5} position={[-5,  0,  0]}><CuboidCollider args={[0.1, 10, 10]} /></RigidBody>
      <RigidBody type="fixed" friction={0} restitution={0.5} position={[ 0,  3,  0]}><CuboidCollider args={[10, 0.1, 10]} /></RigidBody>
      <RigidBody type="fixed" friction={0} restitution={0.5} position={[ 0, -3,  0]}><CuboidCollider args={[10, 0.1, 10]} /></RigidBody>
      <RigidBody type="fixed" friction={0} restitution={0.5} position={[ 0,  0,  3]}><CuboidCollider args={[10, 10, 0.1]} /></RigidBody>
      <RigidBody type="fixed" friction={0} restitution={0.5} position={[ 0,  0, -3]}><CuboidCollider args={[10, 10, 0.1]} /></RigidBody>
    </>
  )
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene({ accent }: { accent: number }) {
  const connectors = useMemo(() => connectorConfigs(accent), [accent])

  return (
    <Physics gravity={[0, 0, 0]}>
      <Pointer />
      <Walls />

      {connectors.map((props, i) => (
        <Connector key={i} {...props} />
      ))}

      <Connector glass />

      <EffectComposer disableNormalPass multisampling={8}>
        <N8AO distanceFalloff={1} aoRadius={1} intensity={2} />
      </EffectComposer>

      <Environment resolution={512}>
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
  const pointerDown = useRef<{ x: number; y: number } | null>(null)

  return (
    <Canvas
      onPointerDown={(e) => { pointerDown.current = { x: e.clientX, y: e.clientY } }}
      onPointerUp={(e) => {
        if (!pointerDown.current) return
        const dx = e.clientX - pointerDown.current.x
        const dy = e.clientY - pointerDown.current.y
        if (Math.sqrt(dx * dx + dy * dy) < 4) cycleAccent()
        pointerDown.current = null
      }}
      onPointerLeave={() => { pointerDown.current = null }}
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
