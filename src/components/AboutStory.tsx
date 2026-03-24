import { useRef, useEffect, useCallback } from 'react';
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
  },
  {
    id: 'approach',
    num: '02',
    title: 'We Embed\nOurselves in\nYour World',
    body: "We don't deliver from the outside. We learn your rhythm and your audience — then build a social presence that reflects who you actually are.",
    scene: 'helix' as const,
  },
  {
    id: 'result',
    num: '03',
    title: 'Human\nto\nHuman.',
    body: 'Whether you\'re a startup or a global brand, we help you cut through the noise and build a presence that connects on a human level.',
    scene: 'network' as const,
  },
] as const;

type SceneType = 'particles' | 'helix' | 'network';

// ─── Three.js scene factory ────────────────────────────────────────────────

interface LiveScene {
  renderer: THREE.WebGLRenderer;
  animId: number;
  root: THREE.Object3D;
  dispose: () => void;
}

function buildScene(canvas: HTMLCanvasElement, type: SceneType): LiveScene {
  const w = canvas.clientWidth || 400;
  const h = canvas.clientHeight || 300;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
  camera.position.z = 2.6;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const key = new THREE.DirectionalLight(0xa46cfc, 3);
  key.position.set(2, 2, 2);
  scene.add(key);
  const fill = new THREE.PointLight(0x291e56, 2);
  fill.position.set(-2, -1, 1);
  scene.add(fill);

  let root: THREE.Object3D;

  if (type === 'particles') {
    // ── Fibonacci sphere of particles ──
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
    const mat = new THREE.PointsMaterial({
      color: 0xa46cfc,
      size: 0.022,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
    });
    root = new THREE.Points(geo, mat);

  } else if (type === 'helix') {
    // ── Double helix ──
    root = new THREE.Group();
    const turns = 4;
    const steps = 120;
    const pts1: THREE.Vector3[] = [];
    const pts2: THREE.Vector3[] = [];

    for (let i = 0; i < steps; i++) {
      const t = (i / (steps - 1)) * Math.PI * 2 * turns;
      const y = (i / (steps - 1)) * 2 - 1;
      pts1.push(new THREE.Vector3(Math.cos(t) * 0.55, y, Math.sin(t) * 0.55));
      pts2.push(new THREE.Vector3(Math.cos(t + Math.PI) * 0.55, y, Math.sin(t + Math.PI) * 0.55));
      if (i % 10 === 0) {
        const barGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(Math.cos(t) * 0.55, y, Math.sin(t) * 0.55),
          new THREE.Vector3(Math.cos(t + Math.PI) * 0.55, y, Math.sin(t + Math.PI) * 0.55),
        ]);
        (root as THREE.Group).add(new THREE.Line(barGeo, new THREE.LineBasicMaterial({ color: 0x7c3aed, opacity: 0.4, transparent: true })));
      }
    }
    (root as THREE.Group).add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts1), new THREE.LineBasicMaterial({ color: 0xa46cfc })));
    (root as THREE.Group).add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts2), new THREE.LineBasicMaterial({ color: 0xb181fc })));

  } else {
    // ── Connected node network ──
    root = new THREE.Group();
    const nodeCount = 22;
    const nodePositions: THREE.Vector3[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.045, 10, 10);

    for (let i = 0; i < nodeCount; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 2.2,
        (Math.random() - 0.5) * 2.2,
        (Math.random() - 0.5) * 2.2,
      );
      nodePositions.push(pos);
      const col = i % 4 === 0 ? 0xa46cfc : i % 4 === 1 ? 0x7c3aed : i % 4 === 2 ? 0xb181fc : 0x291e56;
      const mat = new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.35 });
      const sphere = new THREE.Mesh(sphereGeo, mat);
      sphere.position.copy(pos);
      (root as THREE.Group).add(sphere);
    }

    const lineMat = new THREE.LineBasicMaterial({ color: 0xa46cfc, opacity: 0.25, transparent: true });
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 1.0) {
          const lg = new THREE.BufferGeometry().setFromPoints([nodePositions[i], nodePositions[j]]);
          (root as THREE.Group).add(new THREE.Line(lg, lineMat));
        }
      }
    }
  }

  scene.add(root);

  // ── Pointer-drag rotation ──
  let dragging = false;
  let lastX = 0, lastY = 0;
  const onDown = (e: PointerEvent) => { dragging = true; lastX = e.clientX; lastY = e.clientY; };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    root.rotation.y += (e.clientX - lastX) * 0.01;
    root.rotation.x += (e.clientY - lastY) * 0.008;
    lastX = e.clientX; lastY = e.clientY;
  };
  const onUp = () => { dragging = false; };
  canvas.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);

  // ── Resize ──
  const onResize = () => {
    const nw = canvas.clientWidth;
    const nh = canvas.clientHeight;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  };
  const ro = new ResizeObserver(onResize);
  ro.observe(canvas);

  // ── Animation loop ──
  let animId = 0;
  function tick() {
    animId = requestAnimationFrame(tick);
    if (!dragging) {
      root.rotation.y += type === 'helix' ? 0.006 : 0.004;
      if (type === 'helix') root.rotation.x += 0.002;
    }
    renderer.render(scene, camera);
  }
  tick();

  return {
    renderer,
    animId,
    root,
    dispose() {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      ro.disconnect();
      renderer.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          (obj as THREE.Mesh).geometry?.dispose();
          const m = (obj as THREE.Mesh).material;
          if (Array.isArray(m)) m.forEach((x) => x.dispose()); else m?.dispose();
        }
      });
    },
  };
}

// ─── Single 3D card ────────────────────────────────────────────────────────

function ThreeCard({
  card,
  index,
}: {
  card: typeof CARDS[number];
  index: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liveRef = useRef<LiveScene | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Small delay so DOM has laid out and clientWidth is available
    const t = setTimeout(() => {
      liveRef.current = buildScene(canvas, card.scene);
    }, 80);
    return () => {
      clearTimeout(t);
      liveRef.current?.dispose();
      liveRef.current = null;
    };
  }, [card.scene]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '1.5px solid rgba(164,108,252,0.25)',
        borderRadius: 20,
        overflow: 'hidden',
        background: 'rgba(14,11,31,0.7)',
        backdropFilter: 'blur(12px)',
        cursor: 'grab',
      }}
    >
      {/* 3D canvas */}
      <div style={{ position: 'relative', aspectRatio: '4/3', background: 'radial-gradient(ellipse at 50% 60%, rgba(41,30,86,0.8) 0%, rgba(14,11,31,0.95) 100%)' }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none' }}
        />
        {/* Drag hint */}
        <div style={{
          position: 'absolute',
          bottom: 10,
          right: 14,
          fontSize: '0.55rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(164,108,252,0.45)',
          fontFamily: 'var(--font-stack-heading)',
          pointerEvents: 'none',
        }}>
          drag to rotate
        </div>
        {/* Number */}
        <div style={{
          position: 'absolute',
          top: 14,
          left: 18,
          fontSize: '0.55rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(164,108,252,0.5)',
          fontFamily: 'var(--font-stack-heading)',
        }}>
          {card.num}
        </div>
      </div>

      {/* Text content */}
      <div style={{
        padding: 'clamp(20px, 3vw, 32px)',
        borderTop: '1px solid rgba(164,108,252,0.12)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        flex: 1,
      }}>
        <h3 style={{
          fontFamily: 'var(--font-stack-heading)',
          fontSize: 'clamp(1.4rem, 2.2vw, 2rem)',
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          color: 'var(--color-text-dark)',
          margin: 0,
          whiteSpace: 'pre-line',
        }}>
          {card.title}
        </h3>
        <p style={{
          fontFamily: 'var(--font-stack-body)',
          fontSize: 'clamp(0.85rem, 1.1vw, 0.95rem)',
          lineHeight: 1.7,
          color: 'rgba(232,226,255,0.6)',
          margin: 0,
        }}>
          {card.body}
        </p>
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
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '70vw',
        height: '50vw',
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
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
            color: 'var(--color-text-dark)',
            margin: 0,
            textTransform: 'uppercase',
          }}>
            About{' '}
            <span style={{ color: 'transparent', WebkitTextStroke: '2px rgba(164,108,252,0.6)' }}>
              H2H
            </span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-stack-body)',
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
            lineHeight: 1.7,
            color: 'rgba(232,226,255,0.55)',
            marginTop: 20,
            maxWidth: 560,
          }}>
            A social-first agency built to help brands grow by making their digital presence feel more human — thoughtful, strategic, and real.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div
          className="about-cards-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'clamp(16px, 2.5vw, 28px)',
          }}
        >
          {CARDS.map((card, i) => (
            <ThreeCard key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-cards-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .about-cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
