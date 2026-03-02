import { useFrame } from "@react-three/fiber"
import type { Dispatch, SetStateAction } from "react"

interface AnimationControllerProps {
  isPaused: boolean
  setElapsed: Dispatch<SetStateAction<number>>
}

const AnimationController = ({ isPaused, setElapsed }: AnimationControllerProps) => {
  useFrame((_, delta) => {
    if (!isPaused) {
      setElapsed((prev) => prev + delta)
    }
  })

  return null
}

export default AnimationController
