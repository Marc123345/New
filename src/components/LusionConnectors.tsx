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

const IMAGES = [
  // Faces — full portrait photos
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=256&h=256&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=256&h=256&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=256&h=256&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=256&h=256&fit=crop&crop=face',
  // Company logos (from logo.clearbit.com — CORS-friendly, square)
  'https://logo.clearbit.com/linkedin.com',
  'https://logo.clearbit.com/instagram.com',
  'https://logo.clearbit.com/youtube.com',
  'https://logo.clearbit.com/x.com',
  'https://logo.clearbit.com/tiktok.com',
  'https://logo.clearbit.com/google.com',
  'https://logo.clearbit.com/facebook.com',
  'https://logo.clearbit.com/spotify.com',
  'https://logo.clearbit.com/whatsapp.com',
]

// ─── Texture hook — loads image as full-bleed texture, no suspend ────────────

function useImageTexture(url: string): THREE.Texture | null {
  const [tex, setTex] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (cancelled) return
      const t = new THREE.Texture(img)
      t.colorSpace = THREE.SRGBColorSpace
      t.needsUpdate = true
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

// ─── Image cube — full bleed photo/logo on every face ────────────────────────

function ImageCube({ url, size = CUBE_SIZE }: { url: string; size?: number }) {
  const texture = useImageTexture(url)

  return (
    <RoundedBox args={[size, size, size]} radius={CUBE_RADIUS} smoothness={4} castShadow receiveShadow>
      <meshStandardMaterial
        map={texture}
        color={texture ? '#ffffff' : '#2a1a45'}
        metalness={0.05}
        roughness={0.3}
        envMapIntensity={0.5}
      />
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
  imageUrl,
  accent = false,
  accentColor,
}: {
  position?: [number, number, number]
  imageUrl: string
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
      <ImageCube url={imageUrl} />
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

      {IMAGES.map((url, i) => (
        <Connector
          key={i}
          imageUrl={url}
          accent={i >= IMAGES.length - 3}
          accentColor={accentColor}
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
