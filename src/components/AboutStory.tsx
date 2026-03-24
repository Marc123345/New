import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import * as THREE from 'three';

// ─── Card data ─────────────────────────────────────────────────────────────

const CARDS = [
  {
    id: 'voice',
    num: '01',
    tag: 'Foundation',
    title: 'From Brand\nVoice to Human\nConnection',
    body: 'The most impactful brands know how to connect, not just communicate. We help you show up with a voice that feels real, relatable, and worth listening to.',
    scene: 'particles' as const,
    accent: '#a46cfc',
    accentRgb: '164,108,252',
  },
  {
    id: 'embed',
    num: '02',
    tag: 'Methodology',
    title: 'We Embed\nOurselves in\nYour World',
    body: "We don't deliver from the outside. We learn your rhythm and your audience — then build a social presence that reflects who you actually are.",
    scene: 'helix' as const,
    accent: '#c084fc',
    accentRgb: '192,132,252',
  },
  {
    id: 'h2h',
    num: '03',
    tag: 'Philosophy',
    title: 'Human\nto\nHuman.',
    body: "Whether you're a startup or a global brand, we help you cut through the noise and build a presence that connects on a human level.",
    scene: 'network' as const,
    accent: '#7c3aed',
    accentRgb: '124,58,237',
  },
] as const;

type SceneType = 'particles' | 'helix' | 'network';

// ─── Three.js factory ──────────────────────────────────────────────────────

interface LiveScene {
  dispose: () => void;
  onHover: () => void;
  onLeave: () => void;
  onMouseMove: (nx: number, ny: number) => void;
  onClick: () => void;
}

function buildScene(canvas: HTMLCanvasElement, type: SceneType, accent: string): LiveScene {
  const accentHex = parseInt(accent.replace('#', ''), 16);
  const w = canvas.clientWidth || 400;
  const h = canvas.clientHeight || 500;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0818, 0.18);

  const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
  camera.position.set(0, 0, 3.0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // Lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambient);
  const keyLight = new THREE.PointLight(accentHex, 6, 8);
  keyLight.position.set(2, 2, 2);
  scene.add(keyLight);
  const fill = new THREE.PointLight(0x291e56, 3, 6);
  fill.position.set(-2, -1, 1);
  scene.add(fill);
  const rim = new THREE.PointLight(accentHex, 0, 5);
  rim.position.set(0, 0, -3);
  scene.add(rim);
  // Pulsing core light
  const core = new THREE.PointLight(accentHex, 0.5, 3);
  core.position.set(0, 0, 0);
  scene.add(core);

  let root: THREE.Group | THREE.Points;
  let innerRoot: THREE.Object3D | null = null;

  if (type === 'particles') {
    // Outer particle sphere (fibonacci distribution)
    const count = 900;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const r = 1 + (Math.random() - 0.5) * 0.08;
      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i*3+2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: accentHex, size: 0.028, sizeAttenuation: true,
      transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    root = new THREE.Points(geo, mat);

    // Inner glowing sphere (solid)
    const innerGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
      color: accentHex, emissive: accentHex, emissiveIntensity: 0.4,
      transparent: true, opacity: 0.08, wireframe: false,
    });
    innerRoot = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerRoot);

    // Wireframe over inner sphere
    const wireMat = new THREE.MeshBasicMaterial({ color: accentHex, wireframe: true, transparent: true, opacity: 0.06 });
    scene.add(new THREE.Mesh(innerGeo, wireMat));

  } else if (type === 'helix') {
    root = new THREE.Group();
    const steps = 160;
    const pts1: THREE.Vector3[] = [];
    const pts2: THREE.Vector3[] = [];

    for (let i = 0; i < steps; i++) {
      const t = (i / (steps - 1)) * Math.PI * 2 * 4.5;
      const y = (i / (steps - 1)) * 2.2 - 1.1;
      pts1.push(new THREE.Vector3(Math.cos(t) * 0.6, y, Math.sin(t) * 0.6));
      pts2.push(new THREE.Vector3(Math.cos(t + Math.PI) * 0.6, y, Math.sin(t + Math.PI) * 0.6));
      if (i % 12 === 0) {
        const p1 = pts1[pts1.length-1], p2 = pts2[pts2.length-1];
        const bg = new THREE.BufferGeometry().setFromPoints([p1, p2]);
        root.add(new THREE.Line(bg, new THREE.LineBasicMaterial({ color: 0x7c3aed, opacity: 0.35, transparent: true })));
        // Glowing sphere at junction
        const jGeo = new THREE.SphereGeometry(0.03, 8, 8);
        const jMat = new THREE.MeshStandardMaterial({ color: accentHex, emissive: accentHex, emissiveIntensity: 1.5 });
        const j1 = new THREE.Mesh(jGeo, jMat); j1.position.copy(p1); root.add(j1);
        const j2 = new THREE.Mesh(jGeo, jMat); j2.position.copy(p2); root.add(j2);
      }
    }
    const mat1 = new THREE.LineBasicMaterial({ color: accentHex, transparent: true, opacity: 0.9 });
    const mat2 = new THREE.LineBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.7 });
    root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts1), mat1));
    root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts2), mat2));

  } else {
    // Network
    root = new THREE.Group();
    const nodeCount = 28;
    const nodePos: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      // Distribute more evenly using spherical coordinates
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const r = 0.6 + Math.random() * 0.8;
      const pos = new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
      nodePos.push(pos);
      const size = 0.02 + Math.random() * 0.06;
      const geo = new THREE.SphereGeometry(size, 12, 12);
      const bright = i % 5 === 0;
      const mat = new THREE.MeshStandardMaterial({
        color: bright ? accentHex : 0x5b21b6,
        emissive: accentHex,
        emissiveIntensity: bright ? 1.8 : 0.4,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      root.add(mesh);
    }
    // Connections
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i+1; j < nodeCount; j++) {
        const dist = nodePos[i].distanceTo(nodePos[j]);
        if (dist < 1.1) {
          const alpha = 1 - dist / 1.1;
          const lg = new THREE.BufferGeometry().setFromPoints([nodePos[i], nodePos[j]]);
          root.add(new THREE.Line(lg, new THREE.LineBasicMaterial({ color: accentHex, opacity: alpha * 0.4, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })));
        }
      }
    }
  }

  scene.add(root);

  // ── State ──
  const baseSpeed = type === 'helix' ? 0.005 : 0.003;
  let targetSpeed = baseSpeed;
  let currentSpeed = baseSpeed;
  let camTX = 0, camTY = 0;
  let rimTarget = 0;
  let coreBase = 0.5;
  let clickPhase = 0;
  let time = 0;

  // ── Pointer drag ──
  let dragging = false, lx = 0, ly = 0;
  const onDown = (e: PointerEvent) => { dragging = true; lx = e.clientX; ly = e.clientY; canvas.setPointerCapture(e.pointerId); };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    root.rotation.y += (e.clientX - lx) * 0.012;
    root.rotation.x += (e.clientY - ly) * 0.009;
    lx = e.clientX; ly = e.clientY;
  };
  const onUp = (e: PointerEvent) => { dragging = false; canvas.releasePointerCapture(e.pointerId); };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);

  // ── Resize ──
  const ro = new ResizeObserver(() => {
    const nw = canvas.clientWidth, nh = canvas.clientHeight;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  });
  ro.observe(canvas);

  // ── Loop ──
  let animId = 0;
  function tick() {
    animId = requestAnimationFrame(tick);
    time += 0.016;

    currentSpeed += (targetSpeed - currentSpeed) * 0.06;

    if (!dragging) {
      root.rotation.y += currentSpeed;
      if (type === 'helix') root.rotation.x += currentSpeed * 0.3;
      if (type === 'particles' && innerRoot) innerRoot.rotation.y -= currentSpeed * 0.4;
    }

    // Pulsing core light
    core.intensity = coreBase + Math.sin(time * 1.8) * 0.3;

    // Click burst
    if (clickPhase > 0) {
      clickPhase = Math.max(0, clickPhase - 0.045);
      const pulse = Math.sin(clickPhase * Math.PI);
      root.scale.setScalar(1 + pulse * 0.3);
      rim.intensity = pulse * 6;
    } else {
      root.scale.setScalar(1);
    }

    // Smooth camera
    camera.position.x += (camTX - camera.position.x) * 0.04;
    camera.position.y += (camTY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    rim.intensity += (rimTarget - rim.intensity) * 0.07;

    renderer.render(scene, camera);
  }
  tick();

  return {
    dispose() {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      ro.disconnect();
      renderer.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) { m.geometry?.dispose(); const mt = m.material; Array.isArray(mt) ? mt.forEach(x => x.dispose()) : mt?.dispose(); }
      });
    },
    onHover()  { targetSpeed = baseSpeed * 4; rimTarget = 2.5; coreBase = 1.2; },
    onLeave()  { targetSpeed = baseSpeed; rimTarget = 0; coreBase = 0.5; camTX = 0; camTY = 0; },
    onMouseMove(nx, ny) {
      camTX = nx * 0.3; camTY = -ny * 0.2;
      keyLight.position.set(nx * 3 + 1, -ny * 2.5 + 1, 2);
    },
    onClick()  { clickPhase = 1; },
  };
}

// ─── Card component ────────────────────────────────────────────────────────

function ThreeCard({ card, index }: { card: typeof CARDS[number]; index: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef   = useRef<HTMLDivElement>(null);
  const liveRef   = useRef<LiveScene | null>(null);
  const [tilt,    setTilt]    = useState({ x: 0, y: 0 });
  const [spot,    setSpot]    = useState({ x: 50, y: 50, op: 0 });
  const [hovered, setHovered] = useState(false);
  const [flashed, setFlashed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const t = setTimeout(() => { liveRef.current = buildScene(canvas, card.scene, card.accent); }, 100 + index * 60);
    return () => { clearTimeout(t); liveRef.current?.dispose(); liveRef.current = null; };
  }, [card.scene, card.accent, index]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current!.getBoundingClientRect();
    const cx = e.clientX - r.left, cy = e.clientY - r.top;
    const nx = (cx / r.width - 0.5) * 2, ny = (cy / r.height - 0.5) * 2;
    setTilt({ x: -ny * 18, y: nx * 18 });
    setSpot({ x: (cx / r.width) * 100, y: (cy / r.height) * 100, op: 1 });
    liveRef.current?.onMouseMove(nx, ny);
  };

  const onEnter = () => { setHovered(true); liveRef.current?.onHover(); };
  const onLeave = () => { setHovered(false); setTilt({ x:0, y:0 }); setSpot(s=>({...s,op:0})); liveRef.current?.onLeave(); };
  const onClick = () => { setFlashed(true); setTimeout(()=>setFlashed(false), 700); liveRef.current?.onClick(); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.0, delay: index * 0.18, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: '1000px' }}
    >
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={onClick}
        style={{
          position: 'relative',
          borderRadius: 24,
          overflow: 'hidden',
          cursor: 'crosshair',
          height: 'clamp(460px, 55vw, 580px)',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${hovered ? 12 : 0}px)`,
          transition: tilt.x === 0 && tilt.y === 0
            ? 'transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease'
            : 'transform 0.07s ease-out',
          boxShadow: hovered
            ? `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(${card.accentRgb},0.6), 0 0 60px rgba(${card.accentRgb},0.15)`
            : `0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(${card.accentRgb},0.15)`,
          willChange: 'transform',
        }}
      >
        {/* ── Full-bleed canvas ── */}
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', touchAction: 'none' }}
        />

        {/* ── Base background (fills before canvas loads) ── */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, rgba(41,30,86,0.9) 0%, #080614 100%)`,
          zIndex: 0,
        }} />

        {/* ── Spotlight ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: `radial-gradient(360px circle at ${spot.x}% ${spot.y}%, rgba(${card.accentRgb},0.14) 0%, transparent 65%)`,
          opacity: spot.op, transition: 'opacity 0.35s ease',
        }} />

        {/* ── Vignette ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(4,3,14,0.65) 100%)',
        }} />

        {/* ── Bottom gradient scrim (text readability) ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '62%', zIndex: 4, pointerEvents: 'none',
          background: `linear-gradient(to top, rgba(4,3,14,0.97) 0%, rgba(4,3,14,0.8) 40%, transparent 100%)`,
        }} />

        {/* ── Animated border glow ── */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 24, zIndex: 5, pointerEvents: 'none',
          border: `1px solid rgba(${card.accentRgb},${hovered ? 0.55 : 0.2})`,
          transition: 'border-color 0.4s ease',
          boxShadow: hovered ? `inset 0 0 40px rgba(${card.accentRgb},0.06)` : 'none',
        }} />

        {/* ── Click flash ── */}
        {flashed && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 24, zIndex: 6, pointerEvents: 'none',
            background: `rgba(${card.accentRgb},0.08)`,
            animation: 'flashFade 0.7s ease-out forwards',
          }} />
        )}

        {/* ── Noise grain overlay ── */}
        <div className="grain-overlay" style={{ position: 'absolute', inset: 0, zIndex: 7, pointerEvents: 'none', opacity: 0.035, mixBlendMode: 'overlay' }} />

        {/* ── Content ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 'clamp(20px, 3vw, 32px)' }}>

          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            {/* Number */}
            <span style={{
              fontFamily: 'var(--font-stack-heading)', fontSize: '0.6rem',
              fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase',
              color: `rgba(${card.accentRgb},${hovered ? 0.9 : 0.5})`,
              transition: 'color 0.3s ease',
            }}>{card.num}</span>

            {/* Status dot */}
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: card.accent,
              boxShadow: hovered ? `0 0 16px ${card.accent}, 0 0 32px ${card.accent}80` : `0 0 6px ${card.accent}80`,
              transition: 'box-shadow 0.4s ease',
            }} />
          </div>

          {/* Huge ghost number */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'var(--font-stack-heading)',
            fontSize: 'clamp(9rem, 22vw, 18rem)',
            fontWeight: 900,
            color: 'transparent',
            WebkitTextStroke: `1px rgba(${card.accentRgb},${hovered ? 0.07 : 0.035})`,
            lineHeight: 1,
            letterSpacing: '-0.06em',
            userSelect: 'none',
            transition: 'opacity 0.4s ease, -webkit-text-stroke 0.4s ease',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}>{card.num}</div>

          {/* Bottom text block */}
          <div>
            {/* Tag */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              marginBottom: 14,
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0)' : 'translateY(6px)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}>
              <div style={{ width: 16, height: 1, background: card.accent }} />
              <span style={{
                fontFamily: 'var(--font-stack-heading)', fontSize: '0.55rem',
                letterSpacing: '0.28em', textTransform: 'uppercase', color: card.accent,
              }}>{card.tag}</span>
            </div>

            <h3 style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
              fontWeight: 900, lineHeight: 1.02, letterSpacing: '-0.03em',
              color: '#ffffff', margin: '0 0 14px 0', whiteSpace: 'pre-line',
              textShadow: `0 0 40px rgba(${card.accentRgb},0.3)`,
            }}>{card.title}</h3>

            <p style={{
              fontFamily: 'var(--font-stack-body)',
              fontSize: 'clamp(0.8rem, 1vw, 0.9rem)', lineHeight: 1.65,
              color: `rgba(232,226,255,${hovered ? 0.7 : 0.45})`,
              margin: 0, maxWidth: '85%',
              transition: 'color 0.3s ease',
            }}>{card.body}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────

export function AboutStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        background: 'var(--color-background-light)',
        padding: 'clamp(100px, 14vw, 160px) clamp(20px, 5vw, 80px)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Ambient glow blobs */}
      <div style={{ position:'absolute', top:'10%', left:'15%', width:'40vw', height:'40vw', borderRadius:'50%', background:`radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)`, pointerEvents:'none', filter:'blur(60px)' }} />
      <div style={{ position:'absolute', bottom:'15%', right:'10%', width:'35vw', height:'35vw', borderRadius:'50%', background:`radial-gradient(circle, rgba(164,108,252,0.08) 0%, transparent 70%)`, pointerEvents:'none', filter:'blur(80px)' }} />

      <div style={{ maxWidth: 1320, margin: '0 auto', position: 'relative' }}>

        {/* ── Header ── */}
        <motion.div style={{ y: titleY }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: 'clamp(56px, 8vw, 96px)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 32, height: 1, background: 'rgba(164,108,252,0.5)' }} />
              <span style={{ fontFamily:'var(--font-stack-heading)', fontSize:'0.6rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(164,108,252,0.6)' }}>
                Our Story
              </span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em',
              color: 'var(--color-text-dark)', margin: '0 0 28px 0', textTransform: 'uppercase',
            }}>
              About{' '}
              <span style={{ color:'transparent', WebkitTextStroke:'2px rgba(164,108,252,0.55)', display:'inline-block' }}>H2H</span>
            </h2>

            <p style={{
              fontFamily: 'var(--font-stack-body)', fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
              lineHeight: 1.72, color: 'rgba(232,226,255,0.5)', maxWidth: 520, margin: 0,
            }}>
              A social-first agency built to help brands grow by making their digital presence feel more human — thoughtful, strategic, and real.
            </p>
          </motion.div>
        </motion.div>

        {/* ── Cards ── */}
        <div className="about-cards-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'clamp(14px,2vw,24px)' }}>
          {CARDS.map((card, i) => <ThreeCard key={card.id} card={card} index={i} />)}
        </div>
      </div>

      <style>{`
        @keyframes flashFade {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
        .grain-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 160px 160px;
        }
        @media (max-width: 900px)  { .about-cards-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px)  { .about-cards-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
