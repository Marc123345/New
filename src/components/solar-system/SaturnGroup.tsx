import { useFrame, useLoader } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"
import { TextureLoader } from "three"

interface SaturnGroupProps {
  onSelect: (name: string) => void
  elapsed: number
  isPaused: boolean
}

const SaturnGroup = ({ onSelect, elapsed, isPaused }: SaturnGroupProps) => {
  const saturnTexture = useLoader(TextureLoader, "https://ik.imagekit.io/qcvroy8xpd/saturn.jpg")
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (isPaused || !groupRef.current) return
    const angle = elapsed * 0.3
    groupRef.current.position.x = Math.cos(angle) * 16
    groupRef.current.position.z = Math.sin(angle) * 16
    groupRef.current.rotation.y += delta * 0.8
  })

  return (
    <group ref={groupRef}>
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onSelect("Saturn")
        }}
      >
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshStandardMaterial map={saturnTexture} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 2.0, 64]} />
        <meshBasicMaterial color="#c9b079" side={THREE.DoubleSide} transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

export default SaturnGroup
