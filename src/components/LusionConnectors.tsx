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
 * • Pointer is a kinematic RigidBody moved each frame to track the mouse.
 *   Its BallCollider(r=2) physically pushes any connector that gets too close.
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

const CENTRE_PULL          = 0.2   // matches original pmndrs impulse scale
const STUCK_DIST           = 0.5   // origin dead-zone: centre-pull → ~0 here
const STUCK_SPEED_ENTER    = 0.10  // enter escape mode below this m/s
const STUCK_SPEED_EXIT     = 0.30  // leave escape mode above this (hysteresis)
const STUCK_GRACE          = 20    // consecutive slow frames before acting
const ESCAPE_FORCE         = 0.5   // same order as normal drift — no visible snap
const ESCAPE_ROTATE_FRAMES = 25    // rotate escapeDir after this many escape frames
const WALL_X               = 5    // wall positions for escape-dir bias
const WALL_Y               = 3
const WALL_Z               = 3

// ─── Accent palette ───────────────────────────────────────────────────────────

const ACCENTS = ['#a46cfc', '#7c3aed', '#c084fc', '#9333ea'] as const

function shuffle(accent = 0) {
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
  /** Pass <MeshTransmissionMaterial> as child for the glass connector. */
  children?: React.ReactNode
}

function Model({ color = 'white', roughness = 0, children }: ModelProps) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((_s, dt) => {
    // Only animate when using MeshStandardMaterial (not the glass variant).
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
    <mesh ref={ref} castShadow receiveShadow geometry={connectorGeom}>
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
  const { gl } = useThree()

  useEffect(() => {
    const activate = () => { active.current = true }
    const el = gl.domElement
    el.addEventListener('pointermove', activate, { once: true })
    el.addEventListener('pointerdown', activate, { once: true })
    return () => {
      el.removeEventListener('pointermove', activate)
      el.removeEventListener('pointerdown', activate)
    }
  }, [gl])

  useFrame(({ mouse, viewport }) => {
    if (!ref.current || !active.current) return
    vec.set(
      (mouse.x * viewport.width)  / 2,
      (mouse.y * viewport.height) / 2,
      0,
    )
    ref.current.setNextKinematicTranslation(vec)
  })

  return (
    <RigidBody ref={ref} type="kinematicPosition" colliders={false} position={[0, 0, 20]} restitution={1.0}>
      <BallCollider args={[2]} />
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

  // Stable spawn position — evaluated once on mount.
  // Kept within wall bounds (±5 x, ±3 y, ±3 z) so connectors don't
  // spawn past a wall and immediately bounce back toward the centre.
  const pos = useMemo<[number, number, number]>(
    () => position ?? [r(7), r(4), r(4)],
    [], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const escapeDir   = useRef(
    new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize()
  )
  const stuckFrames = useRef(0)
  const inEscape    = useRef(false)
  const firstFrame  = useRef(true)

  useFrame((_s, delta) => {
    if (!api.current) return

    // Give each connector a small random kick on its first frame so the scene
    // looks alive immediately and the stuck-detector doesn't fire on spawn.
    if (firstFrame.current) {
      firstFrame.current = false
      api.current.setLinvel(
        { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, z: (Math.random() - 0.5) * 0.5 },
        true,
      )
      return
    }

    const d = Math.min(delta, 0.1)
    const t = api.current.translation()
    const v = api.current.linvel()

    const dist  = Math.sqrt(t.x * t.x + t.y * t.y + t.z * t.z)
    const speed = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)

    // ── Stuck state machine ─────────────────────────────────────────────────
    // Grace period prevents false kicks after a normal post-collision slowdown.
    // Hysteresis (ENTER < EXIT thresholds) prevents oscillation at boundary.
    if (!inEscape.current) {
      if (dist < STUCK_DIST || speed < STUCK_SPEED_ENTER) {
        stuckFrames.current++
        if (stuckFrames.current >= STUCK_GRACE) {
          inEscape.current    = true
          stuckFrames.current = 0
        }
      } else {
        stuckFrames.current = 0
      }
    } else {
      stuckFrames.current++
      if (stuckFrames.current % ESCAPE_ROTATE_FRAMES === 0) {
        // Random direction biased away from the nearest wall so connectors
        // don't repeatedly slam into corners.
        const dir = escapeDir.current
          .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        if (Math.abs(t.x) > WALL_X * 0.6) dir.x = -Math.sign(t.x) * Math.abs(dir.x)
        if (Math.abs(t.y) > WALL_Y * 0.6) dir.y = -Math.sign(t.y) * Math.abs(dir.y)
        if (Math.abs(t.z) > WALL_Z * 0.6) dir.z = -Math.sign(t.z) * Math.abs(dir.z)
        dir.normalize()
      }
      // Exit only when clearly moving — hysteresis prevents mode-flicker.
      if (speed > STUCK_SPEED_EXIT && dist > STUCK_DIST) {
        inEscape.current    = false
        stuckFrames.current = 0
      }
    }

    // ── Impulse ─────────────────────────────────────────────────────────────
    if (inEscape.current) {
      // ESCAPE_FORCE=0.5 → terminal ~8 m/s, same order as normal drift.
      // No visible snap; motion looks continuous.
      vec.copy(escapeDir.current).multiplyScalar(ESCAPE_FORCE * d * 60)
    } else {
      vec.set(t.x, t.y, t.z).negate().multiplyScalar(CENTRE_PULL * d * 60)
    }
    api.current.applyImpulse(vec, true)
  })

  return (
    <RigidBody
      ref={api}
      position={pos}
      linearDamping={4}
      angularDamping={1}
      friction={0}
      restitution={0.5}
      colliders={false}
    >
      {/* Three cuboid arms that match the visual geometry above */}
      <CuboidCollider args={[0.38, 1.27, 0.38]} />
      <CuboidCollider args={[1.27, 0.38, 0.38]} />
      <CuboidCollider args={[0.38, 0.38, 1.27]} />

      {glass ? (
        <Model roughness={roughness}>
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
// Walls are placed just beyond those edges so connectors bounce back
// before they fully leave the frame.

function Walls() {
  return (
    <>
      <RigidBody type="fixed" friction={0} restitution={0.8} position={[ 5,  0,  0]}><CuboidCollider args={[0.1, 10, 10]} /></RigidBody>
      <RigidBody type="fixed" friction={0} restitution={0.8} position={[-5,  0,  0]}><CuboidCollider args={[0.1, 10, 10]} /></RigidBody>
      <RigidBody type="fixed" friction={0} restitution={0.8} position={[ 0,  3,  0]}><CuboidCollider args={[10, 0.1, 10]} /></RigidBody>
      <RigidBody type="fixed" friction={0} restitution={0.8} position={[ 0, -3,  0]}><CuboidCollider args={[10, 0.1, 10]} /></RigidBody>
      <RigidBody type="fixed" friction={0} restitution={0.8} position={[ 0,  0,  3]}><CuboidCollider args={[10, 10, 0.1]} /></RigidBody>
      <RigidBody type="fixed" friction={0} restitution={0.8} position={[ 0,  0, -3]}><CuboidCollider args={[10, 10, 0.1]} /></RigidBody>
    </>
  )
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene({ accent }: { accent: number }) {
  const connectors = useMemo(() => shuffle(accent), [accent])

  return (
    <Physics gravity={[0, 0, 0]}>
      <Pointer />
      <Walls />

      {/* 9 standard connectors */}
      {connectors.map((props, i) => (
        <Connector key={i} {...props} />
      ))}

      {/* 1 glass connector — random spawn like the rest */}
      <Connector glass />

      <EffectComposer disableNormalPass multisampling={8}>
        <N8AO distanceFalloff={1} aoRadius={1} intensity={2} />
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
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: false }}
      camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }}
      style={{ width: '100%', height: '100%' }}
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
      {/*
        Suspense is required here — Physics suspends while the Rapier WASM
        loads. The dark fallback keeps the canvas background consistent.
      */}
      <Suspense fallback={null}>
        <Scene accent={accent} />
      </Suspense>
    </Canvas>
  )
}
