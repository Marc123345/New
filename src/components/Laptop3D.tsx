import * as THREE from 'three'
import { Suspense, useEffect, useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, useTexture } from '@react-three/drei'
import { useSpring } from '@react-spring/core'
import { a as three } from '@react-spring/three'

const IMAGE_URL = 'https://ik.imagekit.io/qcvroy8xpd/unnamed%20(2)%201.png'

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
  uniform float reveal;
  uniform float time;
  varying vec2 vUv;
  void main() {
    float revealY = 1.0 - vUv.y;
    if (revealY > reveal) discard;
    vec4 color = texture2D(map, vUv);
    float distToEdge = abs(revealY - reveal);
    float scanGlow = smoothstep(0.06, 0.0, distToEdge);
    color.rgb += scanGlow * vec3(0.64, 0.42, 0.99) * 3.0;
    color.rgb += scanGlow * vec3(1.0, 1.0, 1.0) * 1.0;
    float ca = scanGlow * 0.014;
    float rSample = texture2D(map, vUv + vec2(ca, 0.0)).r;
    float bSample = texture2D(map, vUv - vec2(ca, 0.0)).b;
    color.r = mix(color.r, rSample, scanGlow * 0.7);
    color.b = mix(color.b, bSample, scanGlow * 0.7);
    float lines = sin(vUv.y * 280.0 * 3.14159) * 0.5 + 0.5;
    color.rgb *= 0.88 + lines * 0.12;
    vec2 uvc = vUv * 2.0 - 1.0;
    color.rgb *= 1.0 - dot(uvc, uvc) * 0.2;
    gl_FragColor = color;
  }
`

// ── Screen with animated scan-reveal ──────────────────────────────────────
function LaptopScreen({ open }: { open: boolean }) {
  const texture = useTexture(IMAGE_URL)
  texture.flipY = true

  const revealRef = useRef(0)
  const timeRef = useRef(0)
  const wasOpenRef = useRef(false)
  const glowLightRef = useRef<THREE.PointLight>(null)

  const scanMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { map: { value: texture }, reveal: { value: 0 }, time: { value: 0 } },
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
      const screenTime = Math.max(0, timeRef.current - 0.4)
      revealRef.current = Math.min(screenTime / 1.3, 1)
    }
    scanMat.uniforms.reveal.value = revealRef.current
    scanMat.uniforms.time.value = timeRef.current
    glowMat.opacity = open ? revealRef.current * 0.22 : 0
    if (glowLightRef.current) {
      glowLightRef.current.intensity = open ? revealRef.current * 2.4 : 0
    }
  })

  return (
    <>
      {/* Black screen backing */}
      <mesh position={[0, 0.051, 0.96]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[2.42, 1.56]} />
        <meshStandardMaterial color="#060612" roughness={0.05} />
      </mesh>
      {/* Scan-reveal image */}
      <mesh position={[0, 0.052, 0.96]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[2.42, 1.56]} />
        <primitive object={scanMat} attach="material" />
      </mesh>
      {/* Glow halo */}
      <mesh position={[0, 0.048, 0.96]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[2.62, 1.74]} />
        <primitive object={glowMat} attach="material" />
      </mesh>
      <pointLight ref={glowLightRef} position={[0, 0.4, 0.85]} color="#a46cfc" intensity={0} distance={4} decay={2} />
    </>
  )
}

// ── Procedural MacBook model (same animation as original) ──────────────────
function Model({ open, hinge }: { open: boolean; hinge: any }) {
  const group = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  useEffect(() => void (document.body.style.cursor = hovered ? 'pointer' : 'auto'), [hovered])

  // Exact same useFrame as the original codesandbox
  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      open ? Math.cos(t / 10) / 10 + 0.25 : 0,
      0.1,
    )
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      open ? Math.sin(t / 10) / 4 : 0,
      0.1,
    )
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      open ? Math.sin(t / 10) / 10 : 0,
      0.1,
    )
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      open ? (-2 + Math.sin(t)) / 3 : -4.3,
      0.1,
    )
  })

  // ── Procedural geometry matching the GLB proportions ──
  const SILVER = '#b2b4c0'
  const DARK   = '#0e0e1a'
  const KEYS   = '#141420'

  return (
    <group
      ref={group}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
    >
      {/* ── LID (hinge-animated) ── */}
      {/* hinge goes 1.575 → -0.425 same as original */}
      <three.group rotation-x={hinge} position={[0, -0.04, 0.41]}>
        <group position={[0, 2.96, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
          {/* Lid outer shell */}
          <mesh>
            <boxGeometry args={[5.8, 0.14, 4.1]} />
            <meshPhysicalMaterial color={SILVER} metalness={0.92} roughness={0.08} />
          </mesh>
          {/* Bezel inner */}
          <mesh position={[0, 0.076, 0]}>
            <boxGeometry args={[5.6, 0.01, 3.85]} />
            <meshStandardMaterial color={DARK} roughness={0.9} />
          </mesh>
          {/* Logo on back */}
          <mesh position={[0, -0.076, 0]}>
            <boxGeometry args={[0.55, 0.006, 0.55]} />
            <meshPhysicalMaterial
              color="#d0d2de"
              metalness={0.98}
              roughness={0.04}
              emissive={open ? new THREE.Color(0.55, 0.35, 1.0) : new THREE.Color(0.02, 0.02, 0.04)}
              emissiveIntensity={open ? 1.6 : 0.06}
            />
          </mesh>
          {/* Screen contents (image + scanline reveal) */}
          {/* Screen lives in this group's local space. This group has rotation [π/2, 0, 0]
              so the lid faces the camera when the hinge opens. */}
          <LaptopScreen open={open} />
        </group>
      </three.group>

      {/* ── KEYBOARD (base top) ── */}
      <mesh position={[1.79, 0, 3.45]}>
        <boxGeometry args={[5.6, 0.1, 3.6]} />
        <meshPhysicalMaterial color={SILVER} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Key recess */}
      <mesh position={[1.79, 0.052, 3.0]}>
        <boxGeometry args={[5.0, 0.01, 2.6]} />
        <meshStandardMaterial color={KEYS} roughness={0.85} />
      </mesh>

      {/* ── TRACKPAD + BASE ── */}
      <group position={[0, -0.1, 3.39]}>
        {/* Main base body */}
        <mesh>
          <boxGeometry args={[5.8, 0.22, 4.1]} />
          <meshPhysicalMaterial color={SILVER} metalness={0.92} roughness={0.08} />
        </mesh>
        {/* Trackpad */}
        <mesh position={[0, 0.115, 0.8]}>
          <boxGeometry args={[1.5, 0.01, 1.0]} />
          <meshPhysicalMaterial color="#9898a8" metalness={0.72} roughness={0.18} />
        </mesh>
      </group>

      {/* ── TOUCHBAR ── */}
      <mesh position={[0, -0.03, 1.2]}>
        <boxGeometry args={[4.2, 0.06, 0.25]} />
        <meshStandardMaterial color={DARK} roughness={0.4} emissive={open ? new THREE.Color(0.2, 0.1, 0.5) : new THREE.Color(0, 0, 0)} emissiveIntensity={0.8} />
      </mesh>
    </group>
  )
}

// ── Canvas wrapper ─────────────────────────────────────────────────────────
export function Laptop3D() {
  const [open, setOpen] = useState(false)
  // Same spring as original: interpolates 0→1
  const props = useSpring({ open: Number(open), config: { mass: 1, tension: 180, friction: 30 } })

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Same camera as original */}
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, -30], fov: 35 }}>
        {/* Same point light as original, purple tint when open */}
        <three.pointLight
          position={[10, 10, 10]}
          intensity={1.5}
          color={props.open.to([0, 1], ['#e8e0ff', '#a46cfc'])}
        />
        <ambientLight intensity={0.4} color="#e0d8ff" />

        <Suspense fallback={null}>
          {/* Same: rotate group by π around Y so model faces camera */}
          <group
            rotation={[0, Math.PI, 0]}
            onClick={(e) => { e.stopPropagation(); setOpen((o) => !o) }}
          >
            <Model
              open={open}
              hinge={props.open.to([0, 1], [1.575, -0.425])}
            />
          </group>
          <Environment preset="city" />
        </Suspense>

        {/* Same contact shadows as original */}
        <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={1.75} far={4.5} />
      </Canvas>
    </div>
  )
}
