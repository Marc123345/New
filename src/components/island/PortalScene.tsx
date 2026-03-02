import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

const PILLAR_CONFIG = [
  {
    label: '01',
    title: 'Company Pages',
    subtitle: 'Pillar 01',
    colorHex: 0xa46cfc,
    worldColorHex: 0x050012,
    innerColorHex: 0x7c3fc0,
    particleColorHex: 0xd4a8ff,
    accentCss: '#a46cfc',
    tagline: 'Brand presence & authority',
  },
  {
    label: '02',
    title: 'Leadership Branding',
    subtitle: 'Pillar 02',
    colorHex: 0xfc8c6c,
    worldColorHex: 0x120500,
    innerColorHex: 0xc84020,
    particleColorHex: 0xffc8a8,
    accentCss: '#fc8c6c',
    tagline: 'Executive visibility & trust',
  },
  {
    label: '03',
    title: 'Advocacy Program',
    subtitle: 'Pillar 03',
    colorHex: 0x6cfca4,
    worldColorHex: 0x00120a,
    innerColorHex: 0x20c870,
    particleColorHex: 0xa8ffd4,
    accentCss: '#6cfca4',
    tagline: 'Employee-powered reach',
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
  const portalMeshesRef = useRef<THREE.Mesh[]>([]);
  const innerWorldsRef = useRef<THREE.Group[]>([]);
  const mouseRef = useRef({ normX: 0, normY: 0 });
  const clockRef = useRef(new THREE.Clock());
  const hoveredRef = useRef<number | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster()); // hoisted — no per-frame allocation
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);
  // Track per-portal label positions for DOM overlay
  const [labelPositions, setLabelPositions] = useState<{ x: number; y: number }[]>([]);

  const buildInnerWorld = useCallback((cfg: typeof PILLAR_CONFIG[0], index: number): THREE.Group => {
    const group = new THREE.Group();
    const color = new THREE.Color(cfg.colorHex);
    const innerColor = new THREE.Color(cfg.innerColorHex);
    const particleColor = new THREE.Color(cfg.particleColorHex);

    // Floor grid
    const floorGeo = new THREE.PlaneGeometry(8, 8, 16, 16);
    const floorMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(cfg.worldColorHex),
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.5;
    group.add(floor);

    // Central orb
    const orbGeo = new THREE.SphereGeometry(0.28, 32, 32);
    const orbMat = new THREE.MeshBasicMaterial({ color: innerColor });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.set(0, 0.2, -2);
    orb.userData.isOrb = true;
    group.add(orb);

    // Orb glow
    const glowGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.copy(orb.position);
    group.add(glow);

    // Particles — count varies per pillar for visual differentiation
    const particleCount = 60 + index * 25;
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
      size: 0.045,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    particles.userData.isParticles = true;
    group.add(particles);

    // Primary orbit ring
    const ringGeo = new THREE.TorusGeometry(0.55, 0.018, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.65 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(orb.position);
    ring.userData.isRing = true;
    group.add(ring);

    // Secondary tilted ring
    const ring2Geo = new THREE.TorusGeometry(0.85, 0.01, 8, 48);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: particleColor, transparent: true, opacity: 0.28 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.position.copy(orb.position);
    ring2.rotation.x = Math.PI / 3;
    ring2.userData.isRing2 = true;
    group.add(ring2);

    // Tertiary ring — only on pillars 2 & 3 for visual variety
    if (index > 0) {
      const ring3Geo = new THREE.TorusGeometry(1.1, 0.008, 8, 32);
      const ring3Mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.12 });
      const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
      ring3.position.copy(orb.position);
      ring3.rotation.x = -Math.PI / 4;
      ring3.rotation.z = Math.PI / 6;
      ring3.userData.isRing3 = true;
      group.add(ring3);
    }

    // Vertical accent pillars — count varies per pillar
    const archCount = 2 + index * 2;
    for (let a = 0; a < archCount; a++) {
      const angle = (a / archCount) * Math.PI * 2;
      const archGeo = new THREE.BoxGeometry(0.035, 0.7 + Math.random() * 0.7, 0.035);
      const archMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.25 + Math.random() * 0.3,
      });
      const arch = new THREE.Mesh(archGeo, archMat);
      arch.position.set(Math.cos(angle) * 1.7, -0.5, Math.sin(angle) * 1.4 - 1.5);
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // cap at 1.5 for perf
    renderer.autoClear = false;
    rendererRef.current = renderer;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, W / H, 0.01, 100);
    camera.position.set(0, 0, 5.5);
    cameraRef.current = camera;

    const spacing = 3.2;
    const totalW = (PILLAR_CONFIG.length - 1) * spacing;

    const portalMeshes: THREE.Mesh[] = [];
    const innerWorlds: THREE.Group[] = [];

    PILLAR_CONFIG.forEach((cfg, i) => {
      const x = -totalW / 2 + i * spacing;
      const portalColor = new THREE.Color(cfg.colorHex);

      // Stencil mask
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

      // Inner world
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

      // Portal border (rounded rect approximation)
      const buildBorderPoints = (scaleX = 1, scaleY = 1) => {
        const pts = [];
        const hw = 0.7 * scaleX, hh = 1.1 * scaleY, r = 0.12;
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
            pts.push(new THREE.Vector3(cx + (nx - cx) * t, cy + (ny - cy) * t, 0.01));
          }
        }
        return pts;
      };

      const border = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(buildBorderPoints()),
        new THREE.LineBasicMaterial({ color: portalColor, transparent: true, opacity: 0.65 })
      );
      border.position.set(x, 0, 0.005);
      border.renderOrder = 3;
      border.userData.isBorder = true;
      border.userData.pillarIndex = i;
      scene.add(border);

      // Outer glow border
      const outerBorder = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(buildBorderPoints(1.06, 1.04)),
        new THREE.LineBasicMaterial({ color: portalColor, transparent: true, opacity: 0.12 })
      );
      outerBorder.position.set(x, 0, 0);
      outerBorder.renderOrder = 3;
      outerBorder.userData.isOuterBorder = true;
      outerBorder.userData.pillarIndex = i;
      scene.add(outerBorder);
    });

    portalMeshesRef.current = portalMeshes;
    innerWorldsRef.current = innerWorlds;
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // ── Compute label world→screen positions ──
    const updateLabelPositions = () => {
      if (!cameraRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const positions = PILLAR_CONFIG.map((_, i) => {
        const x = -totalW / 2 + i * spacing;
        const worldPos = new THREE.Vector3(x, -1.4, 0);
        worldPos.project(cameraRef.current!);
        return {
          x: ((worldPos.x + 1) / 2) * rect.width,
          y: ((-worldPos.y + 1) / 2) * rect.height,
        };
      });
      setLabelPositions(positions);
    };

    setIsReady(true);

    // ── Resize ──
    const handleResize = () => {
      const W2 = container.clientWidth;
      const H2 = container.clientHeight;
      renderer.setSize(W2, H2);
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      updateLabelPositions();
    };
    window.addEventListener('resize', handleResize);

    // ── Mouse / Touch ──
    const updateHover = (normX: number, normY: number) => {
      mouseRef.current.normX = normX;
      mouseRef.current.normY = normY;
      raycasterRef.current.setFromCamera(new THREE.Vector2(normX, normY), camera);
      const hits = raycasterRef.current.intersectObjects(portalMeshes);
      const idx = hits.length > 0 ? portalMeshes.indexOf(hits[0].object as THREE.Mesh) : null;
      if (hoveredRef.current !== idx) {
        hoveredRef.current = idx;
        setHoveredIndex(idx);
        canvas.style.cursor = idx !== null ? 'pointer' : 'default';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      updateHover(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      );
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const rect = container.getBoundingClientRect();
      updateHover(
        ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1,
        -(((e.touches[0].clientY - rect.top) / rect.height) * 2 - 1)
      );
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      raycasterRef.current.setFromCamera(new THREE.Vector2(nx, ny), camera);
      const hits = raycasterRef.current.intersectObjects(portalMeshes);
      if (hits.length > 0) {
        onPillarSelect(portalMeshes.indexOf(hits[0].object as THREE.Mesh));
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      if (!touch) return;
      const rect = container.getBoundingClientRect();
      const nx = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
      raycasterRef.current.setFromCamera(new THREE.Vector2(nx, ny), camera);
      const hits = raycasterRef.current.intersectObjects(portalMeshes);
      if (hits.length > 0) {
        onPillarSelect(portalMeshes.indexOf(hits[0].object as THREE.Mesh));
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd);

    // ── Animate ──
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const t = clockRef.current.getElapsedTime();
      const hov = hoveredRef.current;

      renderer.clear();
      renderer.clearStencil();

      // Subtle parallax camera drift
      camera.position.x += (mouseRef.current.normX * 0.25 - camera.position.x) * 0.035;
      camera.position.y += (mouseRef.current.normY * 0.12 - camera.position.y) * 0.035;
      camera.lookAt(0, 0, 0);

      // Border animations
      scene.traverse((obj) => {
        if (obj.userData.isBorder) {
          const line = obj as THREE.LineLoop;
          const mat = line.material as THREE.LineBasicMaterial;
          const idx = obj.userData.pillarIndex;
          mat.opacity += ((hov === idx ? 1.0 : 0.5) - mat.opacity) * 0.1;
          // Pulsing scale on non-hovered portals
          const pulse = hov === null ? 1 + Math.sin(t * 1.2 + idx * 2.1) * 0.008 : 1;
          const targetScale = hov === idx ? 1.05 : pulse;
          line.scale.x += (targetScale - line.scale.x) * 0.08;
          line.scale.y += (targetScale - line.scale.y) * 0.08;
        }
        if (obj.userData.isOuterBorder) {
          const line = obj as THREE.LineLoop;
          const mat = line.material as THREE.LineBasicMaterial;
          const idx = obj.userData.pillarIndex;
          mat.opacity += ((hov === idx ? 0.45 : 0.1) - mat.opacity) * 0.08;
          const targetScale = hov === idx ? 1.1 : 1.0;
          line.scale.x += (targetScale - line.scale.x) * 0.06;
          line.scale.y += (targetScale - line.scale.y) * 0.06;
        }
      });

      // Inner world animations
      innerWorlds.forEach((world, i) => {
        const hovScale = hov === i ? 1.1 : 1.0;
        world.scale.x += (hovScale - world.scale.x) * 0.06;
        world.scale.y += (hovScale - world.scale.y) * 0.06;

        world.traverse((child) => {
          if (child.userData.isOrb) {
            child.position.y = 0.2 + Math.sin(t * 1.4 + i * 1.1) * 0.14;
            child.rotation.y = t * 0.7;
          }
          if (child.userData.isRing) {
            child.rotation.z = t * 0.55 + i * Math.PI * 0.5;
            child.rotation.y = t * 0.25;
          }
          if (child.userData.isRing2) {
            child.rotation.z = -t * 0.38 + i;
            child.rotation.x = Math.PI / 3 + Math.sin(t * 0.45) * 0.18;
          }
          if (child.userData.isRing3) {
            child.rotation.z = t * 0.2;
            child.rotation.y = -t * 0.15;
          }
          if (child.userData.isParticles) {
            child.rotation.y = t * 0.07 + i * 0.5;
            child.rotation.x = Math.sin(t * 0.04) * 0.08;
          }
          if (child.userData.archIndex !== undefined) {
            child.position.y = -0.5 + Math.sin(t * 0.75 + child.userData.archIndex * 1.2) * 0.1;
          }
        });
      });

      // Portal mask z-depth on hover
      portalMeshes.forEach((mask, i) => {
        mask.position.z += ((hov === i ? 0.04 : 0) - mask.position.z) * 0.08;
      });

      renderer.render(scene, camera);

      // Update label positions every frame (camera moves with parallax)
      updateLabelPositions();
    };

    animate();
    updateLabelPositions();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      renderer.dispose();
    };
  }, [buildInnerWorld, onPillarSelect]);

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none"
      style={{ height: 'clamp(320px, 38vw, 500px)' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* ── Per-portal DOM labels (world-space projected) ── */}
      {isReady && labelPositions.length === PILLAR_CONFIG.length && PILLAR_CONFIG.map((cfg, i) => {
        const pos = labelPositions[i];
        if (!pos) return null;
        const isHov = hoveredIndex === i;
        return (
          <motion.button
            key={i}
            type="button"
            onClick={() => onPillarSelect(i)}
            animate={{
              opacity: hoveredIndex === null || isHov ? 1 : 0.35,
            }}
            transition={{ duration: 0.3 }}
            className="absolute text-center pointer-events-auto focus:outline-none"
            style={{
              left: pos.x,
              top: pos.y + 16,
              transform: 'translateX(-50%)',
              cursor: 'pointer',
            }}
          >
            <motion.div
              animate={{ y: isHov ? -3 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="text-[8px] sm:text-[9px] tracking-[0.3em] uppercase mb-0.5"
                style={{
                  color: isHov ? cfg.accentCss : 'rgba(255,255,255,0.4)',
                  fontFamily: 'var(--font-stack-heading)',
                  transition: 'color 0.3s',
                }}
              >
                {cfg.subtitle}
              </div>
              <div
                className="text-xs sm:text-sm font-bold whitespace-nowrap"
                style={{
                  color: isHov ? '#fff' : 'rgba(255,255,255,0.75)',
                  fontFamily: 'var(--font-stack-heading)',
                  transition: 'color 0.3s',
                  textShadow: isHov ? `0 0 20px ${cfg.accentCss}88` : 'none',
                }}
              >
                {cfg.title}
              </div>
              {/* Underline indicator */}
              <motion.div
                animate={{ scaleX: isHov ? 1 : 0, opacity: isHov ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className="mt-1 h-px origin-left"
                style={{ background: cfg.accentCss }}
              />
            </motion.div>
          </motion.button>
        );
      })}

      {/* ── Hover tooltip ── */}
      <AnimatePresence>
        {hoveredIndex !== null && isReady && (
          <motion.div
            key={hoveredIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 3 }}
            transition={{ duration: 0.18 }}
            className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none"
          >
            <div
              className="flex items-center gap-3 px-4 py-2"
              style={{
                background: 'rgba(0,0,0,0.75)',
                border: `1px solid ${PILLAR_CONFIG[hoveredIndex].accentCss}55`,
                backdropFilter: 'blur(12px)',
              }}
            >
              <span
                className="block w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: PILLAR_CONFIG[hoveredIndex].accentCss }}
              />
              <span
                className="text-[10px] tracking-[0.22em] uppercase"
                style={{
                  color: PILLAR_CONFIG[hoveredIndex].accentCss,
                  fontFamily: 'var(--font-stack-heading)',
                }}
              >
                {PILLAR_CONFIG[hoveredIndex].tagline}
              </span>
              <span
                className="text-[10px] tracking-[0.15em] uppercase"
                style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-stack-heading)' }}
              >
                — Click to explore
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}