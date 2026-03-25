/**
 * LusionConnectors — faithful TypeScript port of the pmndrs "Lusion connectors" demo
 * with face avatars and social media logos on select connectors.
 */

import { useRef, useReducer, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  MeshTransmissionMaterial,
  Environment,
  Lightformer,
  Html,
} from '@react-three/drei'
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

// ─── Overlay definitions ──────────────────────────────────────────────────────

type OverlayType = 'face' | 'logo' | undefined

interface OverlayDef {
  type: OverlayType
  src?: string        // face image URL
  logo?: string       // logo key
}

const FACE_URLS = [
  'https://i.pravatar.cc/150?img=32',
  'https://i.pravatar.cc/150?img=47',
  'https://i.pravatar.cc/150?img=12',
  'https://i.pravatar.cc/150?img=25',
]

const LOGO_DEFS: Record<string, { bg: string; label: string; color?: string }> = {
  linkedin:  { bg: '#0A66C2', label: 'in' },
  instagram: { bg: 'linear-gradient(135deg, #F58529, #DD2A7B, #8134AF, #515BD4)', label: '📷', color: '#fff' },
  x:         { bg: '#000000', label: '𝕏' },
  tiktok:    { bg: '#000000', label: '♪' },
  facebook:  { bg: '#1877F2', label: 'f' },
}

const OVERLAYS: OverlayDef[] = [
  { type: 'face', src: FACE_URLS[0] },
  { type: 'logo', logo: 'linkedin' },
  { type: 'face', src: FACE_URLS[1] },
  { type: 'logo', logo: 'instagram' },
  { type: 'face', src: FACE_URLS[2] },
  { type: 'logo', logo: 'x' },
  { type: 'face', src: FACE_URLS[3] },
  { type: 'logo', logo: 'tiktok' },
  { type: undefined },                   // accent — no overlay
]

function connectorConfigs(accent = 0) {
  return [
    { color: '#444',            roughness: 0.1,  overlay: OVERLAYS[0] },
    { color: '#444',            roughness: 0.75, overlay: OVERLAYS[1] },
    { color: '#444',            roughness: 0.75, overlay: OVERLAYS[2] },
    { color: 'red',             roughness: 0.1,  overlay: OVERLAYS[3] },
    { color: 'white',           roughness: 0.75, overlay: OVERLAYS[4] },
    { color: 'white',           roughness: 0.1,  overlay: OVERLAYS[5] },
    { color: ACCENTS[accent],   roughness: 0.1,  accent: true, overlay: OVERLAYS[6] },
    { color: ACCENTS[accent],   roughness: 0.75, accent: true, overlay: OVERLAYS[7] },
    { color: ACCENTS[accent],   roughness: 0.1,  accent: true, overlay: OVERLAYS[8] },
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

// ─── Overlay: face avatar or social logo rendered via Html ────────────────────

const OVERLAY_CONTAINER: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  overflow: 'hidden',
  border: '2px solid rgba(255,255,255,0.2)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.4), 0 0 20px rgba(164,108,252,0.15)',
  backdropFilter: 'blur(4px)',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

function ConnectorOverlay({ overlay }: { overlay: OverlayDef }) {
  if (!overlay.type) return null

  if (overlay.type === 'face' && overlay.src) {
    return (
      <Html center distanceFactor={7} style={{ pointerEvents: 'none' }}>
        <div style={OVERLAY_CONTAINER}>
          <img
            src={overlay.src}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            loading="lazy"
          />
        </div>
      </Html>
    )
  }

  if (overlay.type === 'logo' && overlay.logo) {
    const def = LOGO_DEFS[overlay.logo]
    if (!def) return null
    return (
      <Html center distanceFactor={7} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            ...OVERLAY_CONTAINER,
            background: def.bg,
            color: def.color || '#fff',
            fontSize: overlay.logo === 'instagram' ? '18px' : '16px',
            fontWeight: 800,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: overlay.logo === 'linkedin' ? '-0.02em' : 0,
          }}
        >
          {def.label}
        </div>
      </Html>
    )
  }

  return null
}

// ─── Pointer ──────────────────────────────────────────────────────────────────

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

// ─── Connector ────────────────────────────────────────────────────────────────

interface ConnectorProps {
  position?: [number, number, number]
  color?: string
  roughness?: number
  accent?: boolean
  glass?: boolean
  overlay?: OverlayDef
}

function Connector({
  position,
  color = 'white',
  roughness = 0,
  accent = false,
  glass = false,
  overlay,
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

      {overlay && <ConnectorOverlay overlay={overlay} />}

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

      {connectors.map((props, i) => (
        <Connector key={i} {...props} />
      ))}

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
