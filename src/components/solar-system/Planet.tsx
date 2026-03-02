import { useFrame, useLoader } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"
import { TextureLoader } from "three"

interface PlanetProps {
  name: string
  radius: number
  distance: number
  speed: number
  elapsed: number
  isPaused: boolean
  onSelect: (name: string) => void
}

const BASE = "https://cdn.jsdelivr.net/npm/three-globe/example/img"
const TEXTURE_URLS: Record<string, string> = {
  Mercury: `${BASE}/earth-night.jpg`,
  Venus: `${BASE}/earth-day.jpg`,
  Earth: `${BASE}/earth-day.jpg`,
  Mars: `${BASE}/earth-night.jpg`,
  Jupiter: `${BASE}/earth-day.jpg`,
  Uranus: `${BASE}/earth-water.png`,
  Neptune: `${BASE}/earth-night.jpg`,
  Saturn: `${BASE}/earth-day.jpg`,
}

const Planet = ({ name, radius, distance, speed, elapsed, isPaused, onSelect }: PlanetProps) => {
  const textureUrl = TEXTURE_URLS[name]
  const texture = useLoader(TextureLoader, textureUrl || TEXTURE_URLS.Earth)
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (isPaused || !meshRef.current) return
    meshRef.current.rotation.y += delta * 0.8
    const angle = elapsed * speed
    meshRef.current.position.x = Math.cos(angle) * distance
    meshRef.current.position.z = Math.sin(angle) * distance
  })

  return (
    <mesh onClick={() => onSelect(name)} ref={meshRef} position={[distance, 0, 0]}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

export default Planet
