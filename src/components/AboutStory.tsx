import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import { SignalBackground } from './about/SignalBackground';
import { SpinningH2H } from './about/SpinningH2H';

// ─── Narrative scroll phases ───────────────────────────────────────────────

const PHASES = [
  {
    label: 'The Problem',
    headline: 'The world is\nflooded with\ncontent.',
    sub: 'Every brand is posting. Scheduling. Publishing. Yet most of it disappears into the noise — unseen, unfelt, ignored.',
  },
  {
    label: 'The Shift',
    headline: 'Real connection\nis rare.',
    sub: 'People don\'t want more content. They want brands that feel human — brands that listen, respond, and actually mean something.',
  },
  {
    label: 'The Answer',
    headline: 'We build\nbridges.',
    sub: 'From B2B to H2H. Human to Human. We help brands stop broadcasting and start connecting — with strategy, story, and soul.',
  },
] as const;

// ─── Card data ─────────────────────────────────────────────────────────────

const CARDS = [
  {
    id: 'voice',
    num: '01',
    tag: 'Foundation',
    title: 'From Brand\nVoice to Human\nConnection',
    body: 'The most impactful brands know how to connect, not just communicate. We help you show up with a voice that feels real, relatable, and worth listening to.',
    expand: 'We audit your current brand voice, identify the gaps between how you speak and how your audience listens, then rebuild from the ground up.',
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
    expand: 'Monthly strategy sessions, real-time content review, and direct Slack access to your team. We\'re not a vendor — we\'re an extension of your team.',
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
    expand: 'The H2H framework: every piece of content maps to a real human moment — curiosity, trust, aspiration, or belonging. No filler. No fluff.',
    scene: 'network' as const,
    accent: '#7c3aed',
    accentRgb: '124,58,237',
  },
] as const;

type SceneType = 'particles' | 'helix' | 'network';

// ─── HUD corner brackets (from HologramVideoBlock) ─────────────────────────

function HUDBrackets({ visible, accent }: { visible: boolean; accent: string }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9 }}>
      {/* Top-left */}
      <svg style={{ position: 'absolute', top: 14, left: 14, width: 40, height: 40, opacity: visible ? 0.6 : 0.25, transition: 'opacity 0.4s ease' }}>
        <motion.path d="M0,10 L10,0 L30,0" stroke={accent} strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.1 }} />
        <motion.path d="M0,10 L0,30" stroke={accent} strokeWidth="1.5" fill="none" opacity={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.25 }} />
      </svg>
      {/* Top-right */}
      <svg style={{ position: 'absolute', top: 14, right: 14, width: 40, height: 40, opacity: visible ? 0.6 : 0.25, transition: 'opacity 0.4s ease' }}>
        <motion.path d="M40,10 L30,0 L10,0" stroke={accent} strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.1 }} />
        <motion.path d="M40,10 L40,30" stroke={accent} strokeWidth="1.5" fill="none" opacity={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.25 }} />
      </svg>
      {/* Bottom-left */}
      <svg style={{ position: 'absolute', bottom: 14, left: 14, width: 40, height: 40, opacity: visible ? 0.6 : 0.25, transition: 'opacity 0.4s ease' }}>
        <motion.path d="M0,30 L0,10" stroke={accent} strokeWidth="1.5" fill="none" opacity={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.2 }} />
        <motion.path d="M0,30 L10,40 L30,40" stroke={accent} strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.35 }} />
      </svg>
      {/* Bottom-right */}
      <svg style={{ position: 'absolute', bottom: 14, right: 14, width: 40, height: 40, opacity: visible ? 0.6 : 0.25, transition: 'opacity 0.4s ease' }}>
        <motion.path d="M40,30 L40,10" stroke={accent} strokeWidth="1.5" fill="none" opacity={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.2 }} />
        <motion.path d="M40,30 L30,40 L10,40" stroke={accent} strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.35 }} />
      </svg>

      {/* Scan-line */}
      {visible && (
        <motion.div
          style={{
            position: 'absolute', left: 14, right: 14, height: 1,
            background: `linear-gradient(90deg, transparent, ${accent}80, transparent)`,
          }}
          animate={{ top: ['15%', '85%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatType: 'reverse' }}
        />
      )}

      {/* Live pulse dot */}
      <div style={{ position: 'absolute', top: 18, right: 62 }}>
        <motion.div
          style={{ width: 5, height: 5, borderRadius: '50%', background: accent }}
          animate={{ opacity: [1, 0.2, 1], scale: [1, 1.4, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      </div>
    </div>
  );
}

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
  const h = canvas.clientHeight || 300;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080614, 0.2);

  const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
  camera.position.set(0, 0, 2.8);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;

  scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  const keyLight = new THREE.PointLight(accentHex, 7, 9);
  keyLight.position.set(2, 2, 2);
  scene.add(keyLight);
  const fill = new THREE.PointLight(0x1a0a40, 3, 6);
  fill.position.set(-2, -1, 1);
  scene.add(fill);
  const rim = new THREE.PointLight(accentHex, 0, 5);
  rim.position.set(0, 0, -3);
  scene.add(rim);
  const core = new THREE.PointLight(accentHex, 0.6, 3);
  scene.add(core);

  let root: THREE.Group | THREE.Points;

  if (type === 'particles') {
    const count = 900;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const r = 1 + (Math.random() - 0.5) * 0.1;
      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i*3+2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    root = new THREE.Points(geo, new THREE.PointsMaterial({
      color: accentHex, size: 0.026, sizeAttenuation: true,
      transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    // Inner wireframe sphere
    const inner = new THREE.Mesh(
      new THREE.SphereGeometry(0.52, 24, 24),
      new THREE.MeshBasicMaterial({ color: accentHex, wireframe: true, transparent: true, opacity: 0.07 })
    );
    scene.add(inner);

  } else if (type === 'helix') {
    root = new THREE.Group();
    const steps = 160;
    const pts1: THREE.Vector3[] = [], pts2: THREE.Vector3[] = [];
    for (let i = 0; i < steps; i++) {
      const t = (i / (steps - 1)) * Math.PI * 2 * 4.5;
      const y = (i / (steps - 1)) * 2.2 - 1.1;
      pts1.push(new THREE.Vector3(Math.cos(t) * 0.6, y, Math.sin(t) * 0.6));
      pts2.push(new THREE.Vector3(Math.cos(t + Math.PI) * 0.6, y, Math.sin(t + Math.PI) * 0.6));
      if (i % 12 === 0) {
        const p1 = pts1[pts1.length-1], p2 = pts2[pts2.length-1];
        root.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([p1, p2]),
          new THREE.LineBasicMaterial({ color: 0x7c3aed, opacity: 0.35, transparent: true })
        ));
        const jGeo = new THREE.SphereGeometry(0.032, 8, 8);
        const jMat = new THREE.MeshStandardMaterial({ color: accentHex, emissive: accentHex, emissiveIntensity: 1.8 });
        const j1 = new THREE.Mesh(jGeo, jMat); j1.position.copy(p1); root.add(j1);
        const j2 = new THREE.Mesh(jGeo, jMat); j2.position.copy(p2); root.add(j2);
      }
    }
    root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts1), new THREE.LineBasicMaterial({ color: accentHex })));
    root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts2), new THREE.LineBasicMaterial({ color: 0xd8b4fe, transparent: true, opacity: 0.7 })));

  } else {
    root = new THREE.Group();
    const nodeCount = 28;
    const nodePos: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const r = 0.6 + Math.random() * 0.85;
      const p = new THREE.Vector3(r*Math.sin(phi)*Math.cos(theta), r*Math.sin(phi)*Math.sin(theta), r*Math.cos(phi));
      nodePos.push(p);
      const size = 0.022 + Math.random() * 0.055;
      const bright = i % 5 === 0;
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(size, 12, 12),
        new THREE.MeshStandardMaterial({ color: bright ? accentHex : 0x5b21b6, emissive: accentHex, emissiveIntensity: bright ? 2 : 0.4 })
      );
      mesh.position.copy(p);
      root.add(mesh);
    }
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i+1; j < nodeCount; j++) {
        const d = nodePos[i].distanceTo(nodePos[j]);
        if (d < 1.1) {
          root.add(new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([nodePos[i], nodePos[j]]),
            new THREE.LineBasicMaterial({ color: accentHex, opacity: (1 - d/1.1) * 0.4, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
          ));
        }
      }
    }
  }

  scene.add(root);

  const baseSpeed = type === 'helix' ? 0.005 : 0.003;
  let targetSpeed = baseSpeed, currentSpeed = baseSpeed;
  let camTX = 0, camTY = 0, rimTarget = 0, coreBase = 0.6;
  let clickPhase = 0, time = 0;

  let dragging = false, lx = 0, ly = 0;
  const onDown = (e: PointerEvent) => { dragging = true; lx = e.clientX; ly = e.clientY; canvas.setPointerCapture(e.pointerId); };
  const onMove = (e: PointerEvent) => { if (!dragging) return; root.rotation.y += (e.clientX-lx)*0.012; root.rotation.x += (e.clientY-ly)*0.009; lx = e.clientX; ly = e.clientY; };
  const onUp   = (e: PointerEvent) => { dragging = false; canvas.releasePointerCapture(e.pointerId); };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);

  const ro = new ResizeObserver(() => {
    const nw = canvas.clientWidth, nh = canvas.clientHeight;
    camera.aspect = nw / nh; camera.updateProjectionMatrix(); renderer.setSize(nw, nh);
  });
  ro.observe(canvas);

  let animId = 0;
  function tick() {
    animId = requestAnimationFrame(tick);
    time += 0.016;
    currentSpeed += (targetSpeed - currentSpeed) * 0.06;
    if (!dragging) {
      root.rotation.y += currentSpeed;
      if (type === 'helix') root.rotation.x += currentSpeed * 0.3;
    }
    core.intensity = coreBase + Math.sin(time * 1.8) * 0.35;
    if (clickPhase > 0) {
      clickPhase = Math.max(0, clickPhase - 0.045);
      const p = Math.sin(clickPhase * Math.PI);
      root.scale.setScalar(1 + p * 0.32);
      rim.intensity = p * 7;
    } else { root.scale.setScalar(1); }
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
      ro.disconnect(); renderer.dispose();
      scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.geometry?.dispose(); const mt = m.material; Array.isArray(mt) ? mt.forEach(x=>x.dispose()) : mt?.dispose(); }});
    },
    onHover()  { targetSpeed = baseSpeed * 4; rimTarget = 2.8; coreBase = 1.4; },
    onLeave()  { targetSpeed = baseSpeed; rimTarget = 0; coreBase = 0.6; camTX = 0; camTY = 0; },
    onMouseMove(nx, ny) { camTX = nx*0.3; camTY = -ny*0.2; keyLight.position.set(nx*3+1, -ny*2.5+1, 2); },
    onClick()  { clickPhase = 1; },
  };
}

// ─── Card ──────────────────────────────────────────────────────────────────

function ThreeCard({ card, index }: { card: typeof CARDS[number]; index: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef   = useRef<HTMLDivElement>(null);
  const liveRef   = useRef<LiveScene | null>(null);
  const [tilt,     setTilt]     = useState({ x: 0, y: 0 });
  const [spot,     setSpot]     = useState({ x: 50, y: 50, op: 0 });
  const [hovered,  setHovered]  = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [flashed,  setFlashed]  = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const t = setTimeout(() => { liveRef.current = buildScene(canvas, card.scene, card.accent); }, 100 + index * 60);
    return () => { clearTimeout(t); liveRef.current?.dispose(); liveRef.current = null; };
  }, [card.scene, card.accent, index]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current!.getBoundingClientRect();
    const cx = e.clientX - r.left, cy = e.clientY - r.top;
    const nx = (cx/r.width - 0.5)*2, ny = (cy/r.height - 0.5)*2;
    setTilt({ x: -ny*16, y: nx*16 });
    setSpot({ x: (cx/r.width)*100, y: (cy/r.height)*100, op: 1 });
    liveRef.current?.onMouseMove(nx, ny);
  };
  const onEnter = () => { setHovered(true);  liveRef.current?.onHover(); };
  const onLeave = () => { setHovered(false); setTilt({x:0,y:0}); setSpot(s=>({...s,op:0})); liveRef.current?.onLeave(); };
  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(v => !v);
    setFlashed(true); setTimeout(()=>setFlashed(false), 700);
    liveRef.current?.onClick();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 70, scale: 0.93 }}
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
          position: 'relative', borderRadius: 20, overflow: 'hidden',
          cursor: 'crosshair',
          height: expanded ? 'auto' : 'clamp(480px, 56vw, 600px)',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${hovered ? 14 : 0}px)`,
          transition: tilt.x === 0 && tilt.y === 0
            ? 'transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease, height 0.5s ease'
            : 'transform 0.07s ease-out, height 0.5s ease',
          boxShadow: hovered
            ? `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1.5px rgba(${card.accentRgb},0.7), 0 0 60px rgba(${card.accentRgb},0.18)`
            : `0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(${card.accentRgb},0.18)`,
          willChange: 'transform',
        }}
      >
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: expanded ? '360px' : '100%', display: 'block', touchAction: 'none' }}
        />

        {/* Dark base bg */}
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 50% 40%, rgba(41,30,86,0.88) 0%, #060412 100%)`, zIndex:0 }} />

        {/* HUD Brackets + scan line */}
        <HUDBrackets visible={hovered} accent={card.accent} />

        {/* Spotlight */}
        <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none',
          background:`radial-gradient(380px circle at ${spot.x}% ${spot.y}%, rgba(${card.accentRgb},0.15) 0%, transparent 65%)`,
          opacity: spot.op, transition:'opacity 0.35s ease' }} />

        {/* Vignette */}
        <div style={{ position:'absolute', inset:0, zIndex:3, pointerEvents:'none',
          background:'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(4,3,14,0.65) 100%)' }} />

        {/* Bottom scrim */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'65%', zIndex:4, pointerEvents:'none',
          background:`linear-gradient(to top, rgba(4,3,14,0.97) 0%, rgba(4,3,14,0.78) 38%, transparent 100%)` }} />

        {/* Border glow */}
        <div style={{ position:'absolute', inset:0, borderRadius:20, zIndex:5, pointerEvents:'none',
          border:`1px solid rgba(${card.accentRgb},${hovered?0.6:0.2})`,
          transition:'border-color 0.4s ease',
          boxShadow: hovered ? `inset 0 0 40px rgba(${card.accentRgb},0.07)` : 'none' }} />

        {/* Click flash */}
        {flashed && <div style={{ position:'absolute', inset:0, borderRadius:20, zIndex:6, pointerEvents:'none',
          background:`rgba(${card.accentRgb},0.09)`, animation:'flashFade 0.7s ease-out forwards' }} />}

        {/* Grain overlay */}
        <div className="grain-overlay" style={{ position:'absolute', inset:0, zIndex:7, pointerEvents:'none', opacity:0.03, mixBlendMode:'overlay' }} />

        {/* Content */}
        <div style={{ position: expanded ? 'relative' : 'absolute', bottom: expanded ? 'auto' : 0, left: 0, right: 0,
          zIndex:8, padding:'clamp(18px,2.5vw,28px)', paddingTop: expanded ? 'clamp(18px,2.5vw,28px)' : 0,
          marginTop: expanded ? '340px' : 0 }}>

          {/* Top row inside content */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            {/* Tag pill */}
            <div style={{ display:'flex', alignItems:'center', gap:7,
              opacity: hovered||expanded ? 1 : 0, transform: hovered||expanded ? 'translateY(0)' : 'translateY(5px)',
              transition:'opacity 0.35s ease, transform 0.35s ease' }}>
              <div style={{ width:14, height:1, background:card.accent }} />
              <span style={{ fontFamily:'var(--font-stack-heading)', fontSize:'0.52rem',
                letterSpacing:'0.28em', textTransform:'uppercase', color:card.accent }}>{card.tag}</span>
            </div>
            {/* Expand toggle */}
            <button onClick={onClick} style={{ background:'none', border:`1px solid rgba(${card.accentRgb},0.4)`,
              borderRadius:999, width:26, height:26, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              color:card.accent, fontSize:'0.9rem', lineHeight:1, transition:'background 0.2s, border-color 0.2s',
              fontFamily:'monospace' }}
              onMouseEnter={e=>(e.currentTarget.style.background=`rgba(${card.accentRgb},0.15)`)}
              onMouseLeave={e=>(e.currentTarget.style.background='none')}>
              {expanded ? '−' : '+'}
            </button>
          </div>

          {/* Ghost number */}
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-55%)',
            fontFamily:'var(--font-stack-heading)', fontSize:'clamp(8rem,20vw,16rem)', fontWeight:900,
            color:'transparent', WebkitTextStroke:`1px rgba(${card.accentRgb},${hovered?0.08:0.03})`,
            lineHeight:1, letterSpacing:'-0.06em', userSelect:'none', pointerEvents:'none',
            whiteSpace:'nowrap', transition:'-webkit-text-stroke 0.4s ease', zIndex:-1 }}>{card.num}</div>

          <h3 style={{ fontFamily:'var(--font-stack-heading)', fontSize:'clamp(1.5rem,2.4vw,2.1rem)',
            fontWeight:900, lineHeight:1.02, letterSpacing:'-0.03em', color:'#ffffff',
            margin:'0 0 12px 0', whiteSpace:'pre-line',
            textShadow:`0 0 50px rgba(${card.accentRgb},0.35)` }}>{card.title}</h3>

          <p style={{ fontFamily:'var(--font-stack-body)', fontSize:'clamp(0.8rem,1vw,0.88rem)',
            lineHeight:1.65, color:`rgba(232,226,255,${hovered||expanded?0.72:0.48})`,
            margin:0, transition:'color 0.3s ease' }}>{card.body}</p>

          {/* Expanded detail */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
                style={{ overflow:'hidden' }}
              >
                <div style={{ marginTop:16, paddingTop:16,
                  borderTop:`1px solid rgba(${card.accentRgb},0.2)` }}>
                  <p style={{ fontFamily:'var(--font-stack-body)', fontSize:'clamp(0.78rem,0.95vw,0.85rem)',
                    lineHeight:1.7, color:`rgba(${card.accentRgb},0.85)`, margin:0 }}>{card.expand}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Scroll phase text ─────────────────────────────────────────────────────

function PhaseText({ phase, scrollYProgress, index }: {
  phase: typeof PHASES[number];
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  index: number;
}) {
  const total = PHASES.length;
  const band = 1 / total;
  const e0 = index * band, e1 = e0 + band * 0.25;
  const x0 = e0 + band * 0.65, x1 = e0 + band * 0.9;
  const opacity = useTransform(scrollYProgress, [e0, e1, x0, x1], [0, 1, 1, 0]);
  const y       = useTransform(scrollYProgress, [e0, e1, x0, x1], [50, 0, 0, -50]);

  return (
    <motion.div
      style={{ opacity, y, position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'center', padding:'clamp(2rem,6vw,6rem)' }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
        <div style={{ width:24, height:1, background:'rgba(164,108,252,0.6)' }} />
        <span style={{ fontFamily:'var(--font-stack-heading)', fontSize:'0.58rem', letterSpacing:'0.3em',
          textTransform:'uppercase', color:'rgba(164,108,252,0.7)' }}>{phase.label}</span>
      </div>
      <h2 style={{ fontFamily:'var(--font-stack-heading)', fontSize:'clamp(3rem,7vw,6.5rem)',
        fontWeight:900, lineHeight:0.96, letterSpacing:'-0.04em', color:'var(--color-text-dark)',
        margin:'0 0 28px 0', textTransform:'uppercase', whiteSpace:'pre-line' }}>{phase.headline}</h2>
      <p style={{ fontFamily:'var(--font-stack-body)', fontSize:'clamp(1rem,1.5vw,1.18rem)',
        lineHeight:1.7, color:'rgba(232,226,255,0.55)', maxWidth:540, margin:0 }}>{phase.sub}</p>
    </motion.div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────

export function AboutStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef     = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: pinRef, offset: ['start start', 'end end'] });
  const progressW = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={sectionRef} id="about" style={{ position:'relative', background:'var(--color-background-light)' }}>
      {/* ── Global signal waves ── */}
      <div style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}>
        <SignalBackground />
      </div>

      {/* ══════════════════════════════════════════════════
          PART 1 — Scroll-pinned narrative (300vh)
      ══════════════════════════════════════════════════ */}
      <div ref={pinRef} style={{ height:'300vh', position:'relative' }}>
        <div style={{ position:'sticky', top:0, height:'100vh', overflow:'hidden' }}>

          {/* Ambient glow */}
          <div style={{ position:'absolute', top:'20%', left:'30%', width:'50vw', height:'50vw', borderRadius:'50%',
            background:'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
            filter:'blur(80px)', pointerEvents:'none' }} />

          {/* SpinningH2H — fixed top-right of sticky area */}
          <div style={{ position:'absolute', top:'clamp(90px,12vh,130px)', right:'clamp(40px,6vw,80px)', zIndex:20 }}>
            <SpinningH2H />
          </div>

          {/* Phase texts */}
          <div style={{ position:'relative', height:'100%', zIndex:10 }}>
            {PHASES.map((p, i) => (
              <PhaseText key={p.label} phase={p} scrollYProgress={scrollYProgress} index={i} />
            ))}
          </div>

          {/* Scroll progress bar */}
          <div style={{ position:'absolute', bottom:32, left:'clamp(2rem,6vw,6rem)', right:'clamp(2rem,6vw,6rem)', zIndex:20 }}>
            <div style={{ height:1, background:'rgba(164,108,252,0.12)', position:'relative' }}>
              <motion.div style={{ position:'absolute', inset:0, transformOrigin:'left',
                background:'linear-gradient(90deg, rgba(164,108,252,0.8), rgba(192,132,252,0.4))',
                width: progressW }} />
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:10 }}>
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                <path d="M0 4H12M12 4L8 1M12 4L8 7" stroke="rgba(192,132,252,0.6)" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              <span style={{ fontFamily:'var(--font-stack-heading)', fontSize:'0.55rem',
                letterSpacing:'0.24em', textTransform:'uppercase', color:'rgba(192,132,252,0.5)' }}>
                Scroll to explore
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          PART 2 — 3D Cards
      ══════════════════════════════════════════════════ */}
      <div style={{ position:'relative', zIndex:10, padding:'clamp(80px,10vw,120px) clamp(20px,5vw,80px) clamp(100px,12vw,140px)' }}>
        <div style={{ maxWidth:1320, margin:'0 auto' }}>

          {/* Section label */}
          <motion.div
            initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
            style={{ marginBottom:'clamp(48px,7vw,80px)' }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
              <div style={{ width:32, height:1, background:'rgba(164,108,252,0.5)' }} />
              <span style={{ fontFamily:'var(--font-stack-heading)', fontSize:'0.58rem',
                letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(164,108,252,0.6)' }}>Our Story</span>
            </div>
            <h2 style={{ fontFamily:'var(--font-stack-heading)', fontSize:'clamp(3rem,8vw,7rem)',
              fontWeight:900, lineHeight:0.95, letterSpacing:'-0.04em', color:'var(--color-text-dark)',
              margin:'0 0 24px 0', textTransform:'uppercase' }}>
              About{' '}
              <span style={{ color:'transparent', WebkitTextStroke:'2px rgba(164,108,252,0.5)' }}>H2H</span>
            </h2>
            <p style={{ fontFamily:'var(--font-stack-body)', fontSize:'clamp(0.95rem,1.4vw,1.12rem)',
              lineHeight:1.72, color:'rgba(232,226,255,0.48)', maxWidth:520, margin:0 }}>
              Click any card to expand. Drag the 3D scene to explore.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="about-cards-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'clamp(14px,2vw,24px)' }}>
            {CARDS.map((card, i) => <ThreeCard key={card.id} card={card} index={i} />)}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes flashFade { 0% { opacity: 1; } 100% { opacity: 0; } }
        .grain-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 160px 160px;
        }
        @media (max-width: 900px)  { .about-cards-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px)  { .about-cards-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
