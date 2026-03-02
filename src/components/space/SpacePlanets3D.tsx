import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type PlanetPreset = 'hero' | 'ecosystem' | 'about';

interface PlanetConfig {
  position: [number, number, number];
  radius: number;
  color: number;
  emissive: number;
  emissiveIntensity: number;
  rotationSpeed: [number, number, number];
  hasRings?: boolean;
  ringColor?: number;
  atmosphereColor?: number;
}

const HERO_PLANETS: PlanetConfig[] = [
  { position: [-12, 3, -18], radius: 2.8, color: 0x1a3a6e, emissive: 0x0d2550, emissiveIntensity: 0.3, rotationSpeed: [0.02, 0.08, 0.01], atmosphereColor: 0x3a7bd5 },
  { position: [14, -5, -22], radius: 1.6, color: 0x6e2a1a, emissive: 0x501808, emissiveIntensity: 0.25, rotationSpeed: [0.01, 0.12, 0.02], atmosphereColor: 0xd5603a },
  { position: [5, 8, -30], radius: 4.2, color: 0x3d2a60, emissive: 0x1e1030, emissiveIntensity: 0.2, rotationSpeed: [0.005, 0.04, 0.01], hasRings: true, ringColor: 0x8870cc, atmosphereColor: 0x7b5ea7 },
  { position: [-18, -8, -25], radius: 1.1, color: 0x2a5e40, emissive: 0x0e2e1c, emissiveIntensity: 0.3, rotationSpeed: [0.03, 0.15, 0.02], atmosphereColor: 0x4aaa70 },
];

const ECOSYSTEM_PLANETS: PlanetConfig[] = [
  { position: [16, 6, -20], radius: 3.2, color: 0x2a1a5e, emissive: 0x120830, emissiveIntensity: 0.35, rotationSpeed: [0.01, 0.06, 0.01], hasRings: true, ringColor: 0xa47cfc, atmosphereColor: 0x6040cc },
  { position: [-14, -4, -18], radius: 1.8, color: 0x1a2a4a, emissive: 0x0a1428, emissiveIntensity: 0.3, rotationSpeed: [0.02, 0.1, 0.015], atmosphereColor: 0x4a7acc },
  { position: [-6, 10, -26], radius: 2.4, color: 0x4a1a30, emissive: 0x200810, emissiveIntensity: 0.2, rotationSpeed: [0.015, 0.07, 0.02], atmosphereColor: 0xcc4a80 },
  { position: [18, -9, -30], radius: 5.0, color: 0x0e1e38, emissive: 0x060e1e, emissiveIntensity: 0.15, rotationSpeed: [0.003, 0.025, 0.005], hasRings: true, ringColor: 0x5080cc, atmosphereColor: 0x2060b0 },
];

const ABOUT_PLANETS: PlanetConfig[] = [
  { position: [13, 5, -20], radius: 2.0, color: 0x1e1240, emissive: 0x0c0820, emissiveIntensity: 0.4, rotationSpeed: [0.01, 0.09, 0.01], atmosphereColor: 0x7050cc },
  { position: [-16, -6, -24], radius: 3.6, color: 0x301a60, emissive: 0x180c30, emissiveIntensity: 0.3, rotationSpeed: [0.005, 0.04, 0.008], hasRings: true, ringColor: 0x9870e0, atmosphereColor: 0x8060d0 },
  { position: [7, -10, -28], radius: 1.4, color: 0x1a301e, emissive: 0x0c180e, emissiveIntensity: 0.25, rotationSpeed: [0.02, 0.13, 0.02], atmosphereColor: 0x50b070 },
  { position: [-8, 12, -32], radius: 4.8, color: 0x0e1828, emissive: 0x060c14, emissiveIntensity: 0.15, rotationSpeed: [0.003, 0.02, 0.004], hasRings: true, ringColor: 0x607090, atmosphereColor: 0x304868 },
];

function getPresetPlanets(preset: PlanetPreset): PlanetConfig[] {
  if (preset === 'hero') return HERO_PLANETS;
  if (preset === 'ecosystem') return ECOSYSTEM_PLANETS;
  return ABOUT_PLANETS;
}

interface SpacePlanets3DProps {
  preset?: PlanetPreset;
  className?: string;
  style?: React.CSSProperties;
}

export function SpacePlanets3D({ preset = 'hero', className = '', style }: SpacePlanets3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
    camera.position.set(0, 0, 10);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const sun = new THREE.PointLight(0xffffff, 1.2);
    sun.position.set(20, 20, 10);
    scene.add(sun);
    const fill = new THREE.PointLight(0x4466cc, 0.5);
    fill.position.set(-15, -10, 5);
    scene.add(fill);

    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 80;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.08, color: 0xffffff, transparent: true, opacity: 0.6, sizeAttenuation: true }));
    scene.add(stars);

    const configs = getPresetPlanets(preset);
    const planetMeshes: { mesh: THREE.Mesh; speed: [number, number, number] }[] = [];

    configs.forEach((cfg) => {
      const geo = new THREE.SphereGeometry(cfg.radius, 48, 48);
      const mat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.emissive,
        emissiveIntensity: cfg.emissiveIntensity,
        roughness: 0.75,
        metalness: 0.1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...cfg.position);
      scene.add(mesh);
      planetMeshes.push({ mesh, speed: cfg.rotationSpeed });

      if (cfg.atmosphereColor !== undefined) {
        const atmGeo = new THREE.SphereGeometry(cfg.radius * 1.08, 32, 32);
        const atmMat = new THREE.MeshStandardMaterial({
          color: cfg.atmosphereColor,
          transparent: true,
          opacity: 0.12,
          side: THREE.BackSide,
          depthWrite: false,
        });
        const atm = new THREE.Mesh(atmGeo, atmMat);
        atm.position.set(...cfg.position);
        scene.add(atm);
      }

      if (cfg.hasRings && cfg.ringColor !== undefined) {
        const ringGeo = new THREE.RingGeometry(cfg.radius * 1.4, cfg.radius * 2.1, 64);
        const ringMat = new THREE.MeshStandardMaterial({
          color: cfg.ringColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.45,
          roughness: 1,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(...cfg.position);
        ring.rotation.set(Math.PI / 3, 0.2, 0);
        scene.add(ring);
      }
    });

    let animId: number;
    let last = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;

      planetMeshes.forEach(({ mesh, speed }) => {
        mesh.rotation.x += speed[0] * delta;
        mesh.rotation.y += speed[1] * delta;
        mesh.rotation.z += speed[2] * delta;
      });

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      renderer.dispose();
    };
  }, [preset]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ ...style, zIndex: 0 }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}
