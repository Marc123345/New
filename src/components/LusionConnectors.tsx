/**
 * LusionConnectors — floating cubes with full face photos and company logos,
 * same zero-gravity physics as the pmndrs "Lusion connectors" demo.
 */

import { useRef, useReducer, useMemo, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Environment,
  Lightformer,
  RoundedBox,
} from '@react-three/drei'
import {
  Physics,
  RigidBody,
  CuboidCollider,
  BallCollider,
} from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import * as THREE from 'three'

// ─── Accent palette ───────────────────────────────────────────────────────────

const ACCENTS = ['#a46cfc', '#7c3aed', '#c084fc', '#9333ea'] as const

// ─── Image URLs — full photos for faces, logo images for brands ──────────────

// Face images served from /public — same origin, zero CORS issues.
const FACE_URLS = [
  '/faces/face1.jpg',
  '/faces/face2.jpg',
  '/faces/face3.jpg',
  '/faces/face4.jpg',
  '/faces/face5.jpg',
  '/faces/face6.jpg',
  '/faces/face7.jpg',
  '/faces/face8.jpg',
  '/faces/face9.jpg',
]

interface LogoDef { text: string; bg: string; fg: string }
const LOGOS: LogoDef[] = [
  { text: 'in', bg: '#0A66C2', fg: '#fff' },
  { text: 'f',  bg: '#1877F2', fg: '#fff' },
  { text: '▶', bg: '#FF0000', fg: '#fff' },
  { text: '𝕏', bg: '#000000', fg: '#fff' },
  { text: '♪', bg: '#010101', fg: '#25F4EE' },
  { text: 'G',  bg: '#4285F4', fg: '#fff' },
  { text: 'P',  bg: '#E60023', fg: '#fff' },
  { text: '♫', bg: '#1DB954', fg: '#fff' },
  { text: '✉', bg: '#25D366', fg: '#fff' },
]

// ─── Canvas texture generators (no CORS issues) ─────────────────────────────

const TEX = 256

function createLogoTexture(logo: LogoDef): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = TEX; c.height = TEX
  const ctx = c.getContext('2d')!
  // Full background
  ctx.fillStyle = logo.bg
  ctx.fillRect(0, 0, TEX, TEX)
  // Centered text
  ctx.fillStyle = logo.fg
  ctx.font = `bold ${TEX * 0.45}px system-ui, -apple-system, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(logo.text, TEX / 2, TEX / 2 + 2)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function useFaceTexture(url: string): THREE.Texture {
  const [tex, setTex] = useState<THREE.Texture>(() => {
    // Immediate placeholder — dark purple
    const c = document.createElement('canvas')
    c.width = TEX; c.height = TEX
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#2a1a45'
    ctx.fillRect(0, 0, TEX, TEX)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  })

  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (cancelled) return
      // Draw full-bleed face onto canvas
      const c = document.createElement('canvas')
      c.width = TEX; c.height = TEX
      const ctx = c.getContext('2d')!
      // Cover-fit the image
      const s = Math.max(TEX / img.width, TEX / img.height)
      const w = img.width * s
      const h = img.height * s
      ctx.drawImage(img, (TEX - w) / 2, (TEX - h) / 2, w, h)
      const t = new THREE.CanvasTexture(c)
      t.colorSpace = THREE.SRGBColorSpace
      setTex(t)
    }
    img.src = url
    return () => { cancelled = true }
  }, [url])

  return tex
}

// ─── Cube size ────────────────────────────────────────────────────────────────

const CUBE_SIZE = 1.4
const CUBE_HALF = CUBE_SIZE / 2
const CUBE_RADIUS = 0.12

// ─── Cube components ─────────────────────────────────────────────────────────

function FaceCube({ url, size = CUBE_SIZE }: { url: string; size?: number }) {
  const texture = useFaceTexture(url)
  return (
    <RoundedBox args={[size, size, size]} radius={CUBE_RADIUS} smoothness={4} castShadow receiveShadow>
      <meshStandardMaterial map={texture} metalness={0.05} roughness={0.3} envMapIntensity={0.5} />
    </RoundedBox>
  )
}

function LogoCube({ logo, size = CUBE_SIZE }: { logo: LogoDef; size?: number }) {
  const texture = useMemo(() => createLogoTexture(logo), [logo])
  return (
    <RoundedBox args={[size, size, size]} radius={CUBE_RADIUS} smoothness={4} castShadow receiveShadow>
      <meshStandardMaterial map={texture} metalness={0.05} roughness={0.3} envMapIntensity={0.5} />
    </RoundedBox>
  )
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

function Connector({
  position,
  faceUrl,
  logo,
  accent = false,
  accentColor,
}: {
  position?: [number, number, number]
  faceUrl?: string
  logo?: LogoDef
  accent?: boolean
  accentColor?: string
}) {
  const api = useRef<RapierRigidBody>(null)
  const vec = useMemo(() => new THREE.Vector3(), [])
  const r = THREE.MathUtils.randFloatSpread
  const pos = useMemo<[number, number, number]>(
    () => position ?? [r(10), r(10), r(10)],
    [], // eslint-disable-line react-hooks/exhaustive-deps
  )

  useFrame(() => {
    if (!api.current) return
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
      <CuboidCollider args={[CUBE_HALF, CUBE_HALF, CUBE_HALF]} />
      {faceUrl && <FaceCube url={faceUrl} />}
      {logo && <LogoCube logo={logo} />}
      {accent && accentColor && (
        <pointLight intensity={4} distance={2.5} color={accentColor} />
      )}
    </RigidBody>
  )
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene({ accent }: { accent: number }) {
  const accentColor = ACCENTS[accent]

  return (
    <Physics gravity={[0, 0, 0]}>
      <Pointer />

      {FACE_URLS.map((url, i) => (
        <Connector key={`f${i}`} faceUrl={url} accent={i >= FACE_URLS.length - 2} accentColor={accentColor} />
      ))}
      {LOGOS.map((logo, i) => (
        <Connector key={`l${i}`} logo={logo} accent={i >= LOGOS.length - 2} accentColor={accentColor} />
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
