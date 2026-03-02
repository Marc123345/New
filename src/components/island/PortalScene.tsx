import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';


const CORRECTED_PILLAR_CONFIG = [
  {
    label: '01',
    title: 'Company Pages',
    subtitle: 'Pillar 01',
    colorHex: 0xa46cfc,
    worldColorHex: 0x050012,
    innerColorHex: 0x7c3fc0,
    particleColorHex: 0xd4a8ff,
  },
  {
    label: '02',
    title: 'Leadership Branding',
    subtitle: 'Pillar 02',
    colorHex: 0xfc8c6c,
    worldColorHex: 0x120500,
    innerColorHex: 0xc84020,
    particleColorHex: 0xffc8a8,
  },
  {
    label: '03',
    title: 'Advocacy Program',
    subtitle: 'Pillar 03',
    colorHex: 0x6cfca4,
    worldColorHex: 0x00120a,
    innerColorHex: 0x20c870,
    particleColorHex: 0xa8ffd4,
  },
];

interface PortalSceneProps {
  onPillarSelect: (index: number) => void;
}

export function PortalScene({ onPillarSelect }: PortalSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const portalMeshesRef = useRef<THREE.Mesh[]>([]);
  const innerWorldsRef = useRef<THREE.Group[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, normX: 0, normY: 0 });
  const clockRef = useRef(new THREE.Clock());
  const hoveredRef = useRef<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  const buildInnerWorld = useCallback((cfg: typeof CORRECTED_PILLAR_CONFIG[0], index: number): THREE.Group => {
    const group = new THREE.Group();
    const color = new THREE.Color(cfg.colorHex);
    const innerColor = new THREE.Color(cfg.innerColorHex);
    const particleColor = new THREE.Color(cfg.particleColorHex);

    const floorGeo = new THREE.PlaneGeometry(8, 8, 16, 16);
    const floorMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(cfg.worldColorHex),
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.5;
    group.add(floor);

    const orbGeo = new THREE.SphereGeometry(0.3, 32, 32);
    const orbMat = new THREE.MeshBasicMaterial({ color: innerColor });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.set(0, 0.2, -2);
    orb.userData.isOrb = true;
    group.add(orb);

    const glowGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.copy(orb.position);
    group.add(glow);

    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: particleColor,
      size: 0.04,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    particles.userData.isParticles = true;
    group.add(particles);

    const ringGeo = new THREE.TorusGeometry(0.6, 0.02, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.6 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(orb.position);
    ring.userData.isRing = true;
    group.add(ring);

    const ring2Geo = new THREE.TorusGeometry(0.9, 0.01, 8, 48);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: particleColor, transparent: true, opacity: 0.3 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.position.copy(orb.position);
    ring2.rotation.x = Math.PI / 3;
    ring2.userData.isRing2 = true;
    group.add(ring2);

    const archCount = 3 + index;
    for (let a = 0; a < archCount; a++) {
      const angle = (a / archCount) * Math.PI * 2;
      const archGeo = new THREE.BoxGeometry(0.04, 0.8 + Math.random() * 0.6, 0.04);
      const archMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3 + Math.random() * 0.3,
      });
      const arch = new THREE.Mesh(archGeo, archMat);
      arch.position.set(Math.cos(angle) * 1.8, -0.5, Math.sin(angle) * 1.5 - 1.5);
      arch.userData.archIndex = a;
      group.add(arch);
    }

    return group;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const W = container.clientWidth;
    const H = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      stencil: true,
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.autoClear = false;
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, W / H, 0.01, 100);
    camera.position.set(0, 0, 5.5);
    cameraRef.current = camera;

    const spacing = 3.2;
    const totalW = (CORRECTED_PILLAR_CONFIG.length - 1) * spacing;

    const portalMeshes: THREE.Mesh[] = [];
    const innerWorlds: THREE.Group[] = [];

    CORRECTED_PILLAR_CONFIG.forEach((cfg, i) => {
      const x = -totalW / 2 + i * spacing;
      const portalColor = new THREE.Color(cfg.colorHex);

      const maskGeo = new THREE.PlaneGeometry(1.4, 2.2);
      const maskMat = new THREE.MeshBasicMaterial({
        colorWrite: false,
        depthWrite: false,
        side: THREE.FrontSide,
        stencilWrite: true,
        stencilFunc: THREE.AlwaysStencilFunc,
        stencilRef: i + 1,
        stencilZPass: THREE.ReplaceStencilOp,
      });
      const portalMask = new THREE.Mesh(maskGeo, maskMat);
      portalMask.position.set(x, 0, 0);
      portalMask.renderOrder = 1;
      scene.add(portalMask);
      portalMeshes.push(portalMask);

      const innerWorld = buildInnerWorld(cfg, i);
      innerWorld.position.set(x, 0, 0);
      innerWorld.renderOrder = 2;

      innerWorld.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
          const mat = child.material as THREE.Material;
          mat.stencilWrite = false;
          mat.stencilFunc = THREE.EqualStencilFunc;
          mat.stencilRef = i + 1;
          mat.stencilFail = THREE.KeepStencilOp;
          mat.stencilZFail = THREE.KeepStencilOp;
          mat.stencilZPass = THREE.KeepStencilOp;
        }
      });

      scene.add(innerWorld);
      innerWorlds.push(innerWorld);

      const borderPoints = [];
      const hw = 0.7, hh = 1.1, r = 0.12;
      const steps = 12;
      const corners = [
        [hw - r, hh], [hw, hh - r],
        [hw, -(hh - r)], [hw - r, -hh],
        [-(hw - r), -hh], [-hw, -(hh - r)],
        [-hw, hh - r], [-(hw - r), hh],
      ];
      for (let c = 0; c < corners.length; c++) {
        const [cx, cy] = corners[c];
        const [nx, ny] = corners[(c + 1) % corners.length];
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          borderPoints.push(new THREE.Vector3(cx + (nx - cx) * t, cy + (ny - cy) * t, 0.01));
        }
      }
      const borderGeo = new THREE.BufferGeometry().setFromPoints(borderPoints);
      const borderMat = new THREE.LineBasicMaterial({
        color: portalColor,
        transparent: true,
        opacity: 0.7,
      });
      const border = new THREE.LineLoop(borderGeo, borderMat);
      border.position.set(x, 0, 0.005);
      border.renderOrder = 3;
      border.userData.isBorder = true;
      border.userData.pillarIndex = i;
      scene.add(border);

      const outerBorderGeo = new THREE.BufferGeometry().setFromPoints(
        borderPoints.map(p => new THREE.Vector3(p.x * 1.04, p.y * 1.03, p.z))
      );
      const outerBorderMat = new THREE.LineBasicMaterial({
        color: portalColor,
        transparent: true,
        opacity: 0.15,
      });
      const outerBorder = new THREE.LineLoop(outerBorderGeo, outerBorderMat);
      outerBorder.position.set(x, 0, 0);
      outerBorder.renderOrder = 3;
      outerBorder.userData.isOuterBorder = true;
      outerBorder.userData.pillarIndex = i;
      scene.add(outerBorder);
    });

    portalMeshesRef.current = portalMeshes;
    innerWorldsRef.current = innerWorlds;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    setIsReady(true);

    const handleResize = () => {
      const W2 = container.clientWidth;
      const H2 = container.clientHeight;
      renderer.setSize(W2, H2);
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.normX = (mouseRef.current.x / rect.width) * 2 - 1;
      mouseRef.current.normY = -((mouseRef.current.y / rect.height) * 2 - 1);

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(
        new THREE.Vector2(mouseRef.current.normX, mouseRef.current.normY),
        camera
      );
      const hits = raycaster.intersectObjects(portalMeshes);
      if (hits.length > 0) {
        const idx = portalMeshes.indexOf(hits[0].object as THREE.Mesh);
        if (hoveredRef.current !== idx) {
          hoveredRef.current = idx;
          setHoveredIndex(idx);
          canvas.style.cursor = 'pointer';
        }
      } else {
        if (hoveredRef.current !== null) {
          hoveredRef.current = null;
          setHoveredIndex(null);
          canvas.style.cursor = 'default';
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(nx, ny), camera);
      const hits = raycaster.intersectObjects(portalMeshes);
      if (hits.length > 0) {
        const idx = portalMeshes.indexOf(hits[0].object as THREE.Mesh);
        onPillarSelect(idx);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const t = clockRef.current.getElapsedTime();
      const hov = hoveredRef.current;

      renderer.clear();
      renderer.clearStencil();

      camera.position.x += (mouseRef.current.normX * 0.3 - camera.position.x) * 0.04;
      camera.position.y += (mouseRef.current.normY * 0.15 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      scene.traverse((obj) => {
        if (obj.userData.isBorder) {
          const mat = obj as THREE.LineLoop;
          const borderMat = mat.material as THREE.LineBasicMaterial;
          const idx = obj.userData.pillarIndex;
          const targetOpacity = hov === idx ? 1.0 : 0.5;
          borderMat.opacity += (targetOpacity - borderMat.opacity) * 0.1;
          const cfg = CORRECTED_PILLAR_CONFIG[idx];
          const scale = hov === idx ? 1.04 : 1.0;
          mat.scale.x += (scale - mat.scale.x) * 0.08;
          mat.scale.y += (scale - mat.scale.y) * 0.08;
        }
        if (obj.userData.isOuterBorder) {
          const mat = obj as THREE.LineLoop;
          const borderMat = mat.material as THREE.LineBasicMaterial;
          const idx = obj.userData.pillarIndex;
          const targetOpacity = hov === idx ? 0.4 : 0.1;
          borderMat.opacity += (targetOpacity - borderMat.opacity) * 0.08;
          const scale = hov === idx ? 1.08 : 1.0;
          mat.scale.x += (scale - mat.scale.x) * 0.06;
          mat.scale.y += (scale - mat.scale.y) * 0.06;
        }
      });

      innerWorlds.forEach((world, i) => {
        const hovScale = hov === i ? 1.12 : 1.0;
        world.scale.x += (hovScale - world.scale.x) * 0.06;
        world.scale.y += (hovScale - world.scale.y) * 0.06;

        world.traverse((child) => {
          if (child.userData.isOrb) {
            child.position.y = 0.2 + Math.sin(t * 1.5 + i) * 0.15;
            child.rotation.y = t * 0.8;
          }
          if (child.userData.isRing) {
            child.rotation.z = t * 0.6 + i * Math.PI * 0.5;
            child.rotation.y = t * 0.3;
          }
          if (child.userData.isRing2) {
            child.rotation.z = -t * 0.4 + i;
            child.rotation.x = Math.PI / 3 + Math.sin(t * 0.5) * 0.2;
          }
          if (child.userData.isParticles) {
            child.rotation.y = t * 0.08 + i * 0.5;
            child.rotation.x = Math.sin(t * 0.05) * 0.1;
          }
          if (child.userData.archIndex !== undefined) {
            const a = child.userData.archIndex;
            child.position.y = -0.5 + Math.sin(t * 0.8 + a * 1.2) * 0.1;
          }
        });
      });

      portalMeshes.forEach((mask, i) => {
        const targetZ = hov === i ? 0.05 : 0;
        mask.position.z += (targetZ - mask.position.z) * 0.08;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      renderer.dispose();
    };
  }, [buildInnerWorld, onPillarSelect]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: 'clamp(340px, 40vw, 520px)' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      <AnimatePresence>
        {hoveredIndex !== null && isReady && (
          <motion.div
            key={hoveredIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none"
          >
            <div
              className="px-4 py-2 text-xs tracking-[0.2em] uppercase"
              style={{
                background: 'rgba(0,0,0,0.7)',
                border: `1px solid rgba(${hoveredIndex === 0 ? '164,108,252' : hoveredIndex === 1 ? '252,140,108' : '108,252,164'},0.4)`,
                color: hoveredIndex === 0 ? '#a46cfc' : hoveredIndex === 1 ? '#fc8c6c' : '#6cfca4',
                fontFamily: 'var(--font-stack-heading)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {CORRECTED_PILLAR_CONFIG[hoveredIndex].title} — Click to explore
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-6 left-0 right-0 flex justify-center gap-8 pointer-events-none">
        {CORRECTED_PILLAR_CONFIG.map((cfg, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: hoveredIndex === null || hoveredIndex === i ? 1 : 0.3,
              scale: hoveredIndex === i ? 1.05 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div
              className="text-[9px] tracking-[0.3em] uppercase mb-1"
              style={{
                color: hoveredIndex === i
                  ? (i === 0 ? '#a46cfc' : i === 1 ? '#fc8c6c' : '#6cfca4')
                  : 'rgba(251,251,252,0.9)',
                fontFamily: 'var(--font-stack-heading)',
                transition: 'color 0.3s',
              }}
            >
              {cfg.subtitle}
            </div>
            <div
              className="text-sm font-bold"
              style={{
                color: hoveredIndex === i ? 'rgba(251,251,252,0.95)' : '#ffffff',
                fontFamily: 'var(--font-stack-heading)',
                transition: 'color 0.3s',
              }}
            >
              {cfg.title}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
