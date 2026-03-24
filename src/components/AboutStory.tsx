import { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import * as THREE from 'three';

// ─── Card data ─────────────────────────────────────────────────────────────

const CARDS = [
  {
    id: 'challenge',
    num: '01',
    title: 'From Brand\nVoice to Human\nConnection',
    body: 'The most impactful brands know how to connect, not just communicate. We help you show up with a voice that feels real, relatable, and worth listening to.',
    scene: 'particles' as const,
    accent: '#a46cfc',
  },
  {
    id: 'approach',
    num: '02',
    title: 'We Embed\nOurselves in\nYour World',
    body: "We don't deliver from the outside. We learn your rhythm and your audience — then build a social presence that reflects who you actually are.",
    scene: 'helix' as const,
    accent: '#b181fc',
  },
  {
    id: 'result',
    num: '03',
    title: 'Human\nto\nHuman.',
    body: "Whether you're a startup or a global brand, we help you cut through the noise and build a presence that connects on a human level.",
    scene: 'network' as const,
    accent: '#7c3aed',
  },
] as const;

type SceneType = 'particles' | 'helix' | 'network';

// ─── Three.js scene factory ────────────────────────────────────────────────

interface LiveScene {
  renderer: THREE.WebGLRenderer;
  dispose: () => void;
  onHover: () => void;
  onLeave: () => void;
  onMouseMove: (nx: number, ny: number) => void;
  onClick: () => void;
}

function buildScene(canvas: HTMLCanvasElement, type: SceneType): LiveScene {
  const w = canvas.clientWidth || 400;
  const h = canvas.clientHeight || 300;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
  camera.position.set(0, 0, 2.6);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const keyLight = new THREE.DirectionalLight(0xa46cfc, 3);
  keyLight.position.set(2, 2, 2);
  scene.add(keyLight);
  const fill = new THREE.PointLight(0x291e56, 2);
  fill.position.set(-2, -1, 1);
  scene.add(fill);
  // Extra rim light for hover glow
  const rimLight = new THREE.PointLight(0xa46cfc, 0);
  rimLight.position.set(0, 0, -2);
  scene.add(rimLight);

  let root: THREE.Object3D;

  if (type === 'particles') {
    const count = 700;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      positions[i * 3]     = Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0xa46cfc, size: 0.022, sizeAttenuation: true, transparent: true, opacity: 0.85 });
    root = new THREE.Points(geo, mat);

  } else if (type === 'helix') {
    root = new THREE.Group();
    const steps = 120;
    const pts1: THREE.Vector3[] = [];
    const pts2: THREE.Vector3[] = [];
    for (let i = 0; i < steps; i++) {
      const t = (i / (steps - 1)) * Math.PI * 2 * 4;
      const y = (i / (steps - 1)) * 2 - 1;
      pts1.push(new THREE.Vector3(Math.cos(t) * 0.55, y, Math.sin(t) * 0.55));
      pts2.push(new THREE.Vector3(Math.cos(t + Math.PI) * 0.55, y, Math.sin(t + Math.PI) * 0.55));
      if (i % 10 === 0) {
        const bg = new THREE.BufferGeometry().setFromPoints([pts1[pts1.length - 1], pts2[pts2.length - 1]]);
        (root as THREE.Group).add(new THREE.Line(bg, new THREE.LineBasicMaterial({ color: 0x7c3aed, opacity: 0.4, transparent: true })));
      }
    }
    (root as THREE.Group).add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts1), new THREE.LineBasicMaterial({ color: 0xa46cfc })));
    (root as THREE.Group).add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts2), new THREE.LineBasicMaterial({ color: 0xb181fc })));

  } else {
    root = new THREE.Group();
    const nodeCount = 22;
    const nodePositions: THREE.Vector3[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.045, 10, 10);
    for (let i = 0; i < nodeCount; i++) {
      const pos = new THREE.Vector3((Math.random() - 0.5) * 2.2, (Math.random() - 0.5) * 2.2, (Math.random() - 0.5) * 2.2);
      nodePositions.push(pos);
      const col = [0xa46cfc, 0x7c3aed, 0xb181fc, 0x291e56][i % 4];
      const mat = new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.35 });
      const sphere = new THREE.Mesh(sphereGeo, mat);
      sphere.position.copy(pos);
      (root as THREE.Group).add(sphere);
    }
    const lineMat = new THREE.LineBasicMaterial({ color: 0xa46cfc, opacity: 0.25, transparent: true });
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 1.0) {
          (root as THREE.Group).add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([nodePositions[i], nodePositions[j]]), lineMat));
        }
      }
    }
  }

  scene.add(root);

  // ── State ──
  const baseSpeed = type === 'helix' ? 0.006 : 0.004;
  let targetSpeed = baseSpeed;
  let currentSpeed = baseSpeed;
  let camTargetX = 0;
  let camTargetY = 0;
  let rimTargetIntensity = 0;
  let clickBurst = 0; // 0..1 pulse progress

  // ── Pointer drag ──
  let dragging = false;
  let lastX = 0, lastY = 0;
  const onDown = (e: PointerEvent) => { dragging = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    root.rotation.y += (e.clientX - lastX) * 0.012;
    root.rotation.x += (e.clientY - lastY) * 0.009;
    lastX = e.clientX; lastY = e.clientY;
  };
  const onUp = (e: PointerEvent) => { dragging = false; canvas.releasePointerCapture(e.pointerId); };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);

  // ── Resize ──
  const ro = new ResizeObserver(() => {
    const nw = canvas.clientWidth;
    const nh = canvas.clientHeight;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  });
  ro.observe(canvas);

  // ── Animation loop ──
  let animId = 0;
  function tick() {
    animId = requestAnimationFrame(tick);

    // Smooth speed transitions
    currentSpeed += (targetSpeed - currentSpeed) * 0.07;

    if (!dragging) {
      root.rotation.y += currentSpeed;
      if (type === 'helix') root.rotation.x += currentSpeed * 0.35;
    }

    // Click burst pulse
    if (clickBurst > 0) {
      clickBurst -= 0.04;
      const pulse = Math.sin(clickBurst * Math.PI);
      root.scale.setScalar(1 + pulse * 0.25);
      rimLight.intensity = pulse * 4;
    } else {
      root.scale.setScalar(1);
    }

    // Camera parallax
    camera.position.x += (camTargetX - camera.position.x) * 0.05;
    camera.position.y += (camTargetY - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    // Rim light lerp
    rimLight.intensity += (rimTargetIntensity - rimLight.intensity) * 0.08;

    renderer.render(scene, camera);
  }
  tick();

  return {
    renderer,
    dispose() {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      ro.disconnect();
      renderer.dispose();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry?.dispose();
          const m = mesh.material;
          if (Array.isArray(m)) m.forEach(x => x.dispose()); else m?.dispose();
        }
      });
    },
    onHover() {
      targetSpeed = baseSpeed * 3.5;
      rimTargetIntensity = 1.8;
    },
    onLeave() {
      targetSpeed = baseSpeed;
      rimTargetIntensity = 0;
      camTargetX = 0;
      camTargetY = 0;
    },
    onMouseMove(nx: number, ny: number) {
      camTargetX = nx * 0.28;
      camTargetY = -ny * 0.18;
      keyLight.position.set(nx * 3 + 1, -ny * 2 + 1, 2);
    },
    onClick() {
      clickBurst = 1;
    },
  };
}

// ─── Single 3D card ────────────────────────────────────────────────────────

function ThreeCard({ card, index }: { card: typeof CARDS[number]; index: number }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);
  const liveRef    = useRef<LiveScene | null>(null);
  const [tilt,     setTilt]     = useState({ x: 0, y: 0 });
  const [spot,     setSpot]     = useState({ x: 50, y: 50, op: 0 });
  const [hovered,  setHovered]  = useState(false);
  const [clicked,  setClicked]  = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const t = setTimeout(() => { liveRef.current = buildScene(canvas, card.scene); }, 80);
    return () => { clearTimeout(t); liveRef.current?.dispose(); liveRef.current = null; };
  }, [card.scene]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const nx = (cx / rect.width  - 0.5) * 2;
    const ny = (cy / rect.height - 0.5) * 2;
    setTilt({ x: -ny * 14, y: nx * 14 });
    setSpot({ x: (cx / rect.width) * 100, y: (cy / rect.height) * 100, op: 1 });
    liveRef.current?.onMouseMove(nx, ny);
  };

  const handleMouseEnter = () => {
    setHovered(true);
    liveRef.current?.onHover();
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
    setSpot(s => ({ ...s, op: 0 }));
    liveRef.current?.onLeave();
  };

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 600);
    liveRef.current?.onClick();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: '900px' }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          display: 'flex',
          flexDirection: 'column',
          border: `1.5px solid ${hovered ? card.accent : 'rgba(164,108,252,0.2)'}`,
          borderRadius: 20,
          overflow: 'hidden',
          background: 'rgba(14,11,31,0.75)',
          backdropFilter: 'blur(12px)',
          cursor: 'grab',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${hovered ? '8px' : '0px'})`,
          transition: tilt.x === 0 && tilt.y === 0
            ? 'transform 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.3s ease, box-shadow 0.3s ease'
            : 'transform 0.08s ease-out, border-color 0.3s ease',
          boxShadow: hovered
            ? `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${card.accent}44, 0 0 40px ${card.accent}22`
            : '0 8px 32px rgba(0,0,0,0.3)',
          position: 'relative',
          willChange: 'transform',
        }}
      >
        {/* Mouse-tracking spotlight */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 20,
          background: `radial-gradient(280px circle at ${spot.x}% ${spot.y}%, ${card.accent}18 0%, transparent 70%)`,
          opacity: spot.op,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          zIndex: 10,
        }} />

        {/* Click ripple */}
        {clicked && (
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 20,
            border: `2px solid ${card.accent}`,
            animation: 'rippleOut 0.6s ease-out forwards',
            pointerEvents: 'none',
            zIndex: 11,
          }} />
        )}

        {/* 3D canvas area */}
        <div style={{
          position: 'relative',
          aspectRatio: '4/3',
          background: `radial-gradient(ellipse at 50% 60%, rgba(41,30,86,0.85) 0%, rgba(14,11,31,0.98) 100%)`,
          overflow: 'hidden',
        }}>
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none' }}
          />

          {/* Top-left number */}
          <div style={{
            position: 'absolute', top: 14, left: 18,
            fontSize: '0.55rem', letterSpacing: '0.28em', textTransform: 'uppercase',
            color: hovered ? card.accent : 'rgba(164,108,252,0.45)',
            fontFamily: 'var(--font-stack-heading)',
            transition: 'color 0.3s ease',
          }}>{card.num}</div>

          {/* Bottom-right hint */}
          <div style={{
            position: 'absolute', bottom: 10, right: 14,
            fontSize: '0.5rem', letterSpacing: '0.18em', textTransform: 'uppercase',
            color: hovered ? 'rgba(232,226,255,0.5)' : 'rgba(164,108,252,0.3)',
            fontFamily: 'var(--font-stack-heading)',
            transition: 'color 0.3s ease',
            pointerEvents: 'none',
          }}>drag · click</div>

          {/* Top-right hover indicator */}
          <div style={{
            position: 'absolute', top: 14, right: 14,
            width: 6, height: 6, borderRadius: '50%',
            background: card.accent,
            opacity: hovered ? 1 : 0.3,
            boxShadow: hovered ? `0 0 12px ${card.accent}` : 'none',
            transition: 'opacity 0.3s ease, box-shadow 0.3s ease',
          }} />
        </div>

        {/* Divider with glow */}
        <div style={{
          height: 1,
          background: hovered
            ? `linear-gradient(90deg, transparent, ${card.accent}80, transparent)`
            : 'rgba(164,108,252,0.1)',
          transition: 'background 0.4s ease',
        }} />

        {/* Text content */}
        <div style={{
          padding: 'clamp(20px, 3vw, 32px)',
          display: 'flex', flexDirection: 'column', gap: 12, flex: 1,
        }}>
          <h3 style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: 'clamp(1.4rem, 2.2vw, 2rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: hovered ? '#ffffff' : 'var(--color-text-dark)',
            margin: 0,
            whiteSpace: 'pre-line',
            transition: 'color 0.3s ease',
          }}>{card.title}</h3>

          <p style={{
            fontFamily: 'var(--font-stack-body)',
            fontSize: 'clamp(0.85rem, 1.1vw, 0.95rem)',
            lineHeight: 1.7,
            color: hovered ? 'rgba(232,226,255,0.75)' : 'rgba(232,226,255,0.55)',
            margin: 0,
            transition: 'color 0.3s ease',
          }}>{card.body}</p>

          {/* Animated arrow that appears on hover */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginTop: 4,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateX(0)' : 'translateX(-8px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}>
            <div style={{ height: 1, width: 24, background: card.accent }} />
            <span style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: card.accent,
            }}>Explore</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────

export function AboutStory() {
  return (
    <section
      id="about"
      style={{
        background: 'var(--color-background-light)',
        padding: 'clamp(80px, 12vw, 140px) clamp(20px, 5vw, 80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '70vw', height: '50vw',
        background: 'radial-gradient(ellipse, rgba(41,30,86,0.4) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 'clamp(48px, 7vw, 88px)' }}
        >
          <h2 style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: 'clamp(2.8rem, 7vw, 6rem)',
            fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.04em',
            color: 'var(--color-text-dark)', margin: 0, textTransform: 'uppercase',
          }}>
            About{' '}
            <span style={{ color: 'transparent', WebkitTextStroke: '2px rgba(164,108,252,0.6)' }}>H2H</span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-stack-body)',
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
            lineHeight: 1.7, color: 'rgba(232,226,255,0.55)',
            marginTop: 20, maxWidth: 560,
          }}>
            A social-first agency built to help brands grow by making their digital presence feel more human — thoughtful, strategic, and real.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="about-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(16px, 2.5vw, 28px)' }}>
          {CARDS.map((card, i) => <ThreeCard key={card.id} card={card} index={i} />)}
        </div>
      </div>

      <style>{`
        @keyframes rippleOut {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.06); opacity: 0; }
        }
        @media (max-width: 900px) { .about-cards-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .about-cards-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
