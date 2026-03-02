import { useState, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import AnimationController from "./AnimationController"
import Sun from "./Sun"
import Planet from "./Planet"
import SaturnGroup from "./SaturnGroup"
import InfoPanel from "./InfoPanel"
import Starfield from "./Starfield"

const PLANETS = [
  { name: "Mercury", radius: 0.3, distance: 4, speed: 1.6 },
  { name: "Venus", radius: 0.5, distance: 6, speed: 1.2 },
  { name: "Earth", radius: 0.55, distance: 8, speed: 1.0 },
  { name: "Mars", radius: 0.4, distance: 10, speed: 0.8 },
  { name: "Jupiter", radius: 1.2, distance: 13, speed: 0.5 },
  { name: "Uranus", radius: 0.7, distance: 20, speed: 0.2 },
  { name: "Neptune", radius: 0.65, distance: 23, speed: 0.15 },
]

export default function SolarSystem() {
  const [elapsed, setElapsed] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)

  const handleSelect = (name: string) => {
    setSelectedPlanet(name)
    setIsPaused(true)
  }

  const handleClose = () => {
    setSelectedPlanet(null)
    setIsPaused(false)
  }

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 15, 30], fov: 50, near: 0.1, far: 1000 }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
        style={{ pointerEvents: "auto" }}
      >
        <color attach="background" args={["#000"]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#ff9933" distance={100} decay={0.5} />
        <Suspense fallback={null}>
          <Starfield />
          <Sun />
          {PLANETS.map((p) => (
            <Planet
              key={p.name}
              name={p.name}
              radius={p.radius}
              distance={p.distance}
              speed={p.speed}
              elapsed={elapsed}
              isPaused={isPaused}
              onSelect={handleSelect}
            />
          ))}
          <SaturnGroup onSelect={handleSelect} elapsed={elapsed} isPaused={isPaused} />
        </Suspense>
        <AnimationController isPaused={isPaused} setElapsed={setElapsed} />
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={80}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          maxPolarAngle={Math.PI * 0.85}
          minPolarAngle={Math.PI * 0.1}
        />
      </Canvas>

      {selectedPlanet && <InfoPanel planet={selectedPlanet} onClose={handleClose} />}
    </div>
  )
}
