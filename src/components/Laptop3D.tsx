import * as THREE from 'three'
import { Suspense, useRef, useMemo } from 'react'
import { useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, useTexture } from '@react-three/drei'
import { useSpring } from '@react-spring/core'
import { animated } from '@react-spring/three'

const IMAGE_URL = 'https://ik.imagekit.io/qcvroy8xpd/unnamed%20(2)%201.png'

const SILVER = '#b0b2be'
const DARK_CHASSIS = '#a0a2ae'
const KEYBOARD = '#14141f'
const TRACKPAD_COLOR = '#9496a4'

// ── Scanline-reveal shader ─────────────────────────────────────────────────
const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FRAG = /* glsl */ `
  uniform sampler2D map;
  uniform float reveal;   // 0 → 1  (scan progress)
  uniform float time;
  varying vec2 vUv;

  void main() {
    // In Three.js planes uv.y=0 is bottom, 1 is top — we reveal top→bottom
    float revealY = 1.0 - vUv.y;
    if (revealY > reveal) discard;

    vec4 color = texture2D(map, vUv);

    // Glowing scan-line edge
    float distToEdge = abs(revealY - reveal);
    float scanGlow = smoothstep(0.055, 0.0, distToEdge);
    color.rgb += scanGlow * vec3(0.64, 0.42, 0.99) * 3.0;
    color.rgb += scanGlow * vec3(1.0, 1.0, 1.0) * 1.2;

    // Subtle horizontal scan-lines across the whole image
    float lines = sin(vUv.y * 280.0 * 3.14159) * 0.5 + 0.5;
    color.rgb *= 0.88 + lines * 0.12;

    // Chromatic aberration at the edge
    float ca = scanGlow * 0.012;
    float rSample = texture2D(map, vUv + vec2(ca, 0.0)).r;
    float bSample = texture2D(map, vUv - vec2(ca, 0.0)).b;
    color.r = mix(color.r, rSample, scanGlow * 0.6);
    color.b = mix(color.b, bSample, scanGlow * 0.6);

    // Vignette
    vec2 uvc = vUv * 2.0 - 1.0;
    float vignette = 1.0 - dot(uvc, uvc) * 0.22;
    color.rgb *= vignette;

    gl_FragColor = color;
  }
`

// ── Screen with animated reveal ────────────────────────────────────────────
function LaptopScreen({ open }: { open: boolean }) {
  const texture = useTexture(IMAGE_URL)
  texture.flipY = true

  const revealRef = useRef(0)
  const timeRef = useRef(0)
  const wasOpenRef = useRef(false)

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          map: { value: texture },
          reveal: { value: 0 },
          time: { value: 0 },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        side: THREE.FrontSide,
      }),
    [texture],
  )

  const glowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#a46cfc'),
        transparent: true,
        opacity: 0,
        emissive: new THREE.Color(0.5, 0.18, 1.0),
        emissiveIntensity: 2.5,
        depthWrite: false,
      }),
    [],
  )

  const glowLightRef = useRef<THREE.PointLight>(null)

  useFrame((_, delta) => {
    if (open && !wasOpenRef.current) {
      revealRef.current = 0
      timeRef.current = 0
      wasOpenRef.current = true
    }
    if (!open) {
      wasOpenRef.current = false
      revealRef.current = 0
    }
    if (open) {
      timeRef.current += delta
      // First 0.4s: lid is still opening — delay screen boot slightly
      const screenTime = Math.max(0, timeRef.current - 0.35)
      revealRef.current = Math.min(screenTime / 1.4, 1)
    }

    material.uniforms.reveal.value = revealRef.current
    material.uniforms.time.value = timeRef.current

    // Glow halo fades in alongside reveal
    glowMat.opacity = open ? revealRef.current * 0.22 : 0

    // Screen point light
    if (glowLightRef.current) {
      glowLightRef.current.intensity = open ? revealRef.current * 2.2 : 0
    }
  })

  return (
    <>
      {/* Screen image with scan-reveal shader */}
      <mesh position={[0, 0.051, 0.96]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[2.42, 1.56]} />
        <primitive object={material} attach="material" />
      </mesh>

      {/* Glow halo behind image */}
      <mesh position={[0, 0.047, 0.96]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[2.62, 1.74]} />
        <primitive object={glowMat} attach="material" />
      </mesh>

      {/* Point light that illuminates scene from screen */}
      <pointLight
        ref={glowLightRef}
        position={[0, 0.4, 0.85]}
        color="#a46cfc"
        intensity={0}
        distance={4}
        decay={2}
      />
    </>
  )
}

// ── Full laptop model ──────────────────────────────────────────────────────
function LaptopModel({ open }: { open: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  const { lidAngle } = useSpring({
    lidAngle: open ? -1.78 : 0.08,
    config: { mass: 1.2, tension: 150, friction: 28 },
  })

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    if (open) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        Math.sin(t / 9) * 0.28,
        0.04,
      )
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        0.25 + Math.sin(t * 0.85) * 0.18,
        0.04,
      )
    } else {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.07)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.07)
    }
  })

  return (
    <group ref={groupRef}>

      {/* ── BASE ── */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[3.0, 0.11, 2.0]} />
        <meshPhysicalMaterial color={SILVER} metalness={0.92} roughness={0.08} />
      </mesh>

      <mesh position={[0, -0.062, 0]}>
        <boxGeometry args={[2.95, 0.01, 1.95]} />
        <meshPhysicalMaterial color={DARK_CHASSIS} metalness={0.85} roughness={0.12} />
      </mesh>

      <mesh position={[0, 0.057, -0.18]}>
        <boxGeometry args={[2.45, 0.006, 1.35]} />
        <meshStandardMaterial color={KEYBOARD} roughness={0.85} metalness={0.15} />
      </mesh>

      <mesh position={[0, 0.057, 0.72]}>
        <boxGeometry args={[0.78, 0.006, 0.48]} />
        <meshPhysicalMaterial color={TRACKPAD_COLOR} metalness={0.72} roughness={0.18} />
      </mesh>

      <mesh position={[-1.2, 0.057, -0.1]}>
        <boxGeometry args={[0.12, 0.004, 0.55]} />
        <meshStandardMaterial color="#0e0e1c" roughness={0.95} />
      </mesh>
      <mesh position={[1.2, 0.057, -0.1]}>
        <boxGeometry args={[0.12, 0.004, 0.55]} />
        <meshStandardMaterial color="#0e0e1c" roughness={0.95} />
      </mesh>

      {/* ── LID ── pivot at (0, 0.055, -1.0) */}
      <animated.group position={[0, 0.055, -1.0]} rotation-x={lidAngle}>

        {/* Outer shell */}
        <mesh castShadow position={[0, 0, 1.0]}>
          <boxGeometry args={[3.0, 0.09, 2.0]} />
          <meshPhysicalMaterial color={SILVER} metalness={0.92} roughness={0.08} />
        </mesh>

        {/* Bezel border */}
        <mesh position={[0, 0.047, 0.96]}>
          <boxGeometry args={[2.82, 0.005, 1.82]} />
          <meshStandardMaterial color="#0a0a18" roughness={0.9} metalness={0.1} />
        </mesh>

        {/* Logo on back */}
        <mesh position={[0, -0.047, 0.96]}>
          <boxGeometry args={[0.28, 0.003, 0.28]} />
          <meshPhysicalMaterial
            color="#d0d2de"
            metalness={0.98}
            roughness={0.04}
            emissive={open ? new THREE.Color(0.55, 0.35, 1.0) : new THREE.Color(0.02, 0.02, 0.04)}
            emissiveIntensity={open ? 1.4 : 0.05}
          />
        </mesh>

        {/* Black screen backing (visible when closed) */}
        <mesh position={[0, 0.049, 0.96]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[2.42, 1.56]} />
          <meshStandardMaterial color="#060612" roughness={0.05} />
        </mesh>

        {/* Scanline-reveal screen (image + animation) */}
        <LaptopScreen open={open} />

      </animated.group>
    </group>
  )
}

// ── Canvas wrapper ─────────────────────────────────────────────────────────
export function Laptop3D() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ width: '100%', height: '100%', cursor: 'pointer' }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 2.2, 7.5], fov: 28 }} shadows>
        <ambientLight intensity={0.55} color="#e0d8ff" />
        <spotLight
          position={[5, 8, 6]}
          angle={0.18}
          penumbra={0.9}
          intensity={1.4}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-4, 4, -4]} intensity={0.5} color="#a46cfc" />
        <pointLight position={[4, 2, 6]} intensity={0.3} color="#e8e0ff" />

        <Suspense fallback={null}>
          <group onClick={(e) => { e.stopPropagation(); setOpen((o) => !o) }}>
            <LaptopModel open={open} />
          </group>
          <Environment preset="city" />
        </Suspense>

        <ContactShadows
          position={[0, -0.62, 0]}
          opacity={0.45}
          scale={10}
          blur={2.5}
          far={3}
          color="#291e56"
        />
      </Canvas>
    </div>
  )
}
