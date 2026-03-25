/**
 * LusionConnectors — floating face cubes with the same zero-gravity physics
 * as the original pmndrs "Lusion connectors" demo.
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

// ─── Face image URLs ──────────────────────────────────────────────────────────

const FACES = [
  'https://i.pravatar.cc/256?img=32',
  'https://i.pravatar.cc/256?img=47',
  'https://i.pravatar.cc/256?img=12',
  'https://i.pravatar.cc/256?img=25',
  'https://i.pravatar.cc/256?img=56',
  'https://i.pravatar.cc/256?img=68',
  'https://i.pravatar.cc/256?img=3',
  'https://i.pravatar.cc/256?img=41',
  'https://i.pravatar.cc/256?img=5',
  'https://i.pravatar.cc/256?img=9',
  'https://i.pravatar.cc/256?img=15',
  'https://i.pravatar.cc/256?img=20',
  'https://i.pravatar.cc/256?img=33',
  'https://i.pravatar.cc/256?img=36',
  'https://i.pravatar.cc/256?img=49',
  'https://i.pravatar.cc/256?img=52',
  'https://i.pravatar.cc/256?img=60',
  'https://i.pravatar.cc/256?img=65',
]

// ─── Accent palette ───────────────────────────────────────────────────────────

const ACCENTS = ['#a46cfc', '#7c3aed', '#c084fc', '#9333ea'] as const

// ─── Cube size ────────────────────────────────────────────────────────────────

const CUBE_SIZE = 1.4
const CUBE_HALF = CUBE_SIZE / 2
const CUBE_RADIUS = 0.15

// ─── Texture loader (handles CORS, doesn't suspend) ─────────────────────────

const textureLoader = new THREE.TextureLoader()
textureLoader.setCrossOrigin('anonymous')

function useTextureSafe(url: string): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    let cancelled = false
    textureLoader.load(
      url,
      (tex) => {
        if (cancelled) return
        tex.colorSpace = THREE.SRGBColorSpace
        setTexture(tex)
      },
      undefined,
      () => {
        // Failed — leave as null, cube shows solid color
      },
    )
    return () => { cancelled = true }
  }, [url])

  return texture
}

// ─── Face-textured cube ──────────────────────────────────────────────────────

function FaceCube({ url, size = CUBE_SIZE }: { url: string; size?: number }) {
  const texture = useTextureSafe(url)

  return (
    <RoundedBox args={[size, size, size]} radius={CUBE_RADIUS} smoothness={4} castShadow receiveShadow>
      <meshStandardMaterial
        map={texture}
        color={texture ? '#ffffff' : '#665599'}
        metalness={0.05}
        roughness={0.35}
        envMapIntensity={0.6}
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

interface ConnectorProps {
  position?: [number, number, number]
  faceUrl: string
  accent?: boolean
  accentColor?: string
}

function Connector({
  position,
  faceUrl,
  accent = false,
  accentColor,
}: ConnectorProps) {
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
      <FaceCube url={faceUrl} />
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

      {FACES.map((url, i) => (
        <Connector
          key={i}
          faceUrl={url}
          accent={i >= FACES.length - 3}
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
