import { useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"

const Sun = () => {
  const sunTexture = useLoader(TextureLoader, "https://ik.imagekit.io/qcvroy8xpd/sun.jpg")

  return (
    <mesh>
      <sphereGeometry args={[1.4, 32, 32]} />
      <meshBasicMaterial map={sunTexture} />
    </mesh>
  )
}

export default Sun
