import { useFrame, useLoader } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

interface PlanetProps {
  name: string
  radius: number
  distance: number
  speed: number
  elapsed: number
  isPaused: boolean
  onSelect: (name: string) => void
}

const TEXTURE_URLS: Record<string, string> = {
  Mercury: "https://ik.imagekit.io/qcvroy8xpd/mercury.jpg",
  Venus: "https://ik.imagekit.io/qcvroy8xpd/venus.jpg",
  Earth: "https://ik.imagekit.io/qcvroy8xpd/earth.jpg",
  Mars: "https://ik.imagekit.io/qcvroy8xpd/mars.jpg",
  Jupiter: "https://ik.imagekit.io/qcvroy8xpd/jupiter.jpg",
  Uranus: "https://ik.imagekit.io/qcvroy8xpd/uranus.jpg",
  Neptune: "https://ik.imagekit.io/qcvroy8xpd/neptune.jpg",
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
