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
  'https://ik.imagekit.io/qcvroy8xpd/Ellipse%206.png?updatedAt=1769949025784',
  'https://ik.imagekit.io/qcvroy8xpd/Ellipse%205.png?updatedAt=1769949025733',
  'https://ik.imagekit.io/qcvroy8xpd/Ellipse%202.png?updatedAt=1769949025746',
  'https://ik.imagekit.io/qcvroy8xpd/Ellipse%203.png?updatedAt=1769949025608',
  'https://ik.imagekit.io/qcvroy8xpd/Ellipse%204.png?updatedAt=1769949025655',
]

interface LogoDef { text: string; bg: string; fg: string; svgPath?: string; svgVB?: number }
const LOGOS: LogoDef[] = [
  { text: 'in', bg: '#0A66C2', fg: '#fff' },
  { text: 'f',  bg: '#1877F2', fg: '#fff' },
  { text: '▶', bg: '#FF0000', fg: '#fff' },
  { text: '𝕏', bg: '#000000', fg: '#fff' },
  { text: '', bg: 'ig-gradient', fg: '#fff', svgVB: 132, svgPath: 'M66.004 18c-13.036 0-14.672.057-19.792.29-5.11.234-8.598 1.043-11.65 2.23-3.157 1.226-5.835 2.866-8.503 5.535-2.67 2.668-4.31 5.346-5.54 8.502-1.19 3.053-2 6.542-2.23 11.65C18.06 51.327 18 52.964 18 66s.058 14.667.29 19.787c.235 5.11 1.044 8.598 2.23 11.65 1.227 3.157 2.867 5.835 5.536 8.503 2.667 2.67 5.345 4.314 8.5 5.54 3.054 1.187 6.543 1.996 11.652 2.23 5.12.233 6.755.29 19.79.29 13.037 0 14.668-.057 19.788-.29 5.11-.234 8.602-1.043 11.656-2.23 3.156-1.226 5.83-2.87 8.497-5.54 2.67-2.668 4.31-5.346 5.54-8.502 1.18-3.053 1.99-6.542 2.23-11.65.23-5.12.29-6.752.29-19.788 0-13.036-.06-14.672-.29-19.792-.24-5.11-1.05-8.598-2.23-11.65-1.23-3.157-2.87-5.835-5.54-8.503-2.67-2.67-5.34-4.31-8.5-5.535-3.06-1.187-6.55-1.996-11.66-2.23-5.12-.233-6.75-.29-19.79-.29zm-4.306 8.65c1.278-.002 2.704 0 4.306 0 12.816 0 14.335.046 19.396.276 4.68.214 7.22.996 8.912 1.653 2.24.87 3.837 1.91 5.516 3.59 1.68 1.68 2.72 3.28 3.592 5.52.657 1.69 1.44 4.23 1.653 8.91.23 5.06.28 6.58.28 19.39s-.05 14.33-.28 19.39c-.214 4.68-.996 7.22-1.653 8.91-.87 2.24-1.912 3.835-3.592 5.514-1.68 1.68-3.275 2.72-5.516 3.59-1.69.66-4.232 1.44-8.912 1.654-5.06.23-6.58.28-19.396.28-12.817 0-14.336-.05-19.396-.28-4.68-.216-7.22-.998-8.913-1.655-2.24-.87-3.84-1.91-5.52-3.59-1.68-1.68-2.72-3.276-3.592-5.517-.657-1.69-1.44-4.23-1.653-8.91-.23-5.06-.276-6.58-.276-19.398s.046-14.33.276-19.39c.214-4.68.996-7.22 1.653-8.912.87-2.24 1.912-3.84 3.592-5.52 1.68-1.68 3.28-2.72 5.52-3.592 1.692-.66 4.233-1.44 8.913-1.655 4.428-.2 6.144-.26 15.09-.27zm29.928 7.97c-3.18 0-5.76 2.577-5.76 5.758 0 3.18 2.58 5.76 5.76 5.76 3.18 0 5.76-2.58 5.76-5.76 0-3.18-2.58-5.76-5.76-5.76zm-25.622 6.73c-13.613 0-24.65 11.037-24.65 24.65 0 13.613 11.037 24.645 24.65 24.645C79.617 90.645 90.65 79.613 90.65 66S79.616 41.35 66.003 41.35zm0 8.65c8.836 0 16 7.163 16 16 0 8.836-7.164 16-16 16-8.837 0-16-7.164-16-16 0-8.837 7.163-16 16-16z' },
  { text: 'G',  bg: '#4285F4', fg: '#fff' },
  { text: '', bg: '#000000', fg: '#fff', svgVB: 24, svgPath: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
  { text: '⚛', bg: '#222222', fg: '#61DAFB' },
]

// ─── Canvas texture generators (no CORS issues) ─────────────────────────────

const TEX = 256

function createLogoTexture(logo: LogoDef): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = TEX; c.height = TEX
  const ctx = c.getContext('2d')!

  // Same purple background as face cubes
  ctx.fillStyle = '#1e1535'
  ctx.fillRect(0, 0, TEX, TEX)

  // Centered logo circle
  const cx = TEX / 2
  const cy = TEX / 2
  const r = TEX * 0.3
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)

  if (logo.bg === 'ig-gradient') {
    const grad = ctx.createLinearGradient(cx - r, cy + r, cx + r, cy - r)
    grad.addColorStop(0, '#feda75')
    grad.addColorStop(0.25, '#fa7e1e')
    grad.addColorStop(0.5, '#d62976')
    grad.addColorStop(0.75, '#962fbf')
    grad.addColorStop(1, '#4f5bd5')
    ctx.fillStyle = grad
  } else {
    ctx.fillStyle = logo.bg
  }
  ctx.fill()

  if (logo.svgPath && logo.svgVB) {
    // Draw SVG path scaled to fit inside the circle
    const path = new Path2D(logo.svgPath)
    const scale = (r * 1.6) / logo.svgVB
    ctx.save()
    ctx.translate(cx - (logo.svgVB * scale) / 2, cy - (logo.svgVB * scale) / 2)
    ctx.scale(scale, scale)
    ctx.fillStyle = logo.fg
    ctx.fill(path)
    ctx.restore()
  } else {
    // Logo text
    ctx.fillStyle = logo.fg
    ctx.font = `bold ${r * 1.1}px system-ui, -apple-system, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(logo.text, cx, cy + 2)
  }

  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

const FACE_BG = '#1e1535'

function useFaceTexture(url: string): THREE.Texture {
  const [tex, setTex] = useState<THREE.Texture>(() => {
    const c = document.createElement('canvas')
    c.width = TEX; c.height = TEX
    const ctx = c.getContext('2d')!
    ctx.fillStyle = FACE_BG
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
      const c = document.createElement('canvas')
      c.width = TEX; c.height = TEX
      const ctx = c.getContext('2d')!

      // Purple background
      ctx.fillStyle = FACE_BG
      ctx.fillRect(0, 0, TEX, TEX)

      // Draw face centered in a circular clip with padding
      const cx = TEX / 2
      const cy = TEX / 2
      const radius = TEX * 0.4

      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.clip()

      // Cover-fit the image inside the circle
      const aspect = img.width / img.height
      let dw = radius * 2
      let dh = dw / aspect
      if (dh < dw) { dh = dw; dw = dh * aspect }
      ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh)
      ctx.restore()

      // Subtle ring around the face
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(164,108,252,0.4)'
      ctx.lineWidth = 2
      ctx.stroke()

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
