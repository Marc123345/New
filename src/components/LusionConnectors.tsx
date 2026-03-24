import { useRef, useMemo, useReducer, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, MeshTransmissionMaterial, useGLTF } from '@react-three/drei'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import * as THREE from 'three'
import * as easing from 'maath/easing'

// ─── H2H accent color palette (purple tones) ───────────────────────────────

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

// ─── GLB connector model ────────────────────────────────────────────────────

function Model({ children, color = 'white', roughness = 0 }: {
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

// ─── Physics connector (pure JS, no WASM) ───────────────────────────────────

const BOX = 5 // half-extent of bounding box

function Connector({
  color = 'white',
  roughness = 0,
  accent = false,
  children,
  mouseWorld,
}: {
  color?: string
  roughness?: number
  accent?: boolean
  children?: React.ReactNode
  mouseWorld: React.RefObject<THREE.Vector3>
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const r = THREE.MathUtils.randFloatSpread
  const pos = useMemo<THREE.Vector3>(() => new THREE.Vector3(r(6), r(6), r(4)), [])
  const vel = useMemo<THREE.Vector3>(() => new THREE.Vector3(
    (Math.random() - 0.5) * 3,
    (Math.random() - 0.5) * 3,
    (Math.random() - 0.5) * 1.5
  ), [])
  const rot = useMemo<THREE.Euler>(() => new THREE.Euler(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  ), [])
  const rotVel = useMemo<THREE.Vector3>(() => new THREE.Vector3(
    (Math.random() - 0.5) * 1.5,
    (Math.random() - 0.5) * 1.5,
    (Math.random() - 0.5) * 1.5
  ), [])

  useFrame((_state, delta) => {
    const dt = Math.min(delta, 0.1)

    // Center-seeking force
    vel.addScaledVector(pos, -0.12 * dt * 60)

    // Damping
    vel.multiplyScalar(1 - 0.4 * dt * 60 * 0.016)

    // Mouse repulsion
    const mouse = mouseWorld.current!
    const dx = pos.x - mouse.x
    const dy = pos.y - mouse.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 2.2 && dist > 0.001) {
      const force = (2.2 - dist) * 3.5
      vel.x += (dx / dist) * force * dt * 60 * 0.016
      vel.y += (dy / dist) * force * dt * 60 * 0.016
    }

    // Integrate
    pos.addScaledVector(vel, dt)

    // Bounce off walls
    if (pos.x > BOX) { pos.x = BOX; vel.x *= -0.7 }
    if (pos.x < -BOX) { pos.x = -BOX; vel.x *= -0.7 }
    if (pos.y > BOX) { pos.y = BOX; vel.y *= -0.7 }
    if (pos.y < -BOX) { pos.y = -BOX; vel.y *= -0.7 }
    if (pos.z > 2.5) { pos.z = 2.5; vel.z *= -0.7 }
    if (pos.z < -2.5) { pos.z = -2.5; vel.z *= -0.7 }

    // Rotation
    rot.x += rotVel.x * dt * 0.5
    rot.y += rotVel.y * dt * 0.5
    rot.z += rotVel.z * dt * 0.5

    groupRef.current.position.copy(pos)
    groupRef.current.rotation.copy(rot)
  })

  return (
    <group ref={groupRef}>
      {children ?? <Model color={color} roughness={roughness} />}
      {accent && <pointLight intensity={4} distance={2.5} color={color} />}
    </group>
  )
}

// ─── Mouse tracker ───────────────────────────────────────────────────────────

function MouseTracker({ mouseWorld }: { mouseWorld: React.RefObject<THREE.Vector3> }) {
  const { viewport } = useThree()
  useFrame(({ mouse }) => {
    mouseWorld.current!.set(
      (mouse.x * viewport.width) / 2,
      (mouse.y * viewport.height) / 2,
      0
    )
  })
  return null
}

// ─── Scene ───────────────────────────────────────────────────────────────────

function SceneContent({ connectors, mouseWorld }: {
  connectors: ReturnType<typeof shuffle>
  mouseWorld: React.RefObject<THREE.Vector3>
}) {
  return (
    <>
      <color attach="background" args={['#141622']} />
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <MouseTracker mouseWorld={mouseWorld} />

      <Suspense fallback={null}>
        {connectors.map((props, i) => (
          <Connector key={i} {...props} mouseWorld={mouseWorld} />
        ))}
        <Connector mouseWorld={mouseWorld}>
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
      </Suspense>

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
  const connectors = useMemo(() => shuffle(accent), [accent])
  const mouseWorld = useRef<THREE.Vector3>(new THREE.Vector3())

  return (
    <Canvas
      onClick={click}
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: false }}
      camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }}
      style={{ width: '100%', height: '100%' }}
    >
      <SceneContent connectors={connectors} mouseWorld={mouseWorld} />
    </Canvas>
  )
}

useGLTF.preload('/c-transformed.glb')
