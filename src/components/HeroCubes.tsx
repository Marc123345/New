import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ─── Shader ─────────────────────────────────────────────────────────────── */
const VERT = `
varying vec3 vNormal;
varying vec3 vViewDir;
varying float vFresnel;
void main() {
  vec4 mvPos   = modelViewMatrix * vec4(position, 1.0);
  vec3 viewDir = normalize(-mvPos.xyz);
  vNormal  = normalize(normalMatrix * normal);
  vFresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.8);
  vViewDir = viewDir;
  gl_Position = projectionMatrix * mvPos;
}`;

const FRAG = `
uniform vec3  uColor;
uniform float uGlow;
varying vec3  vNormal;
varying vec3  vViewDir;
varying float vFresnel;
void main() {
  vec3 n  = normalize(vNormal);
  vec3 v  = normalize(vViewDir);

  // key light
  vec3  L1    = normalize(vec3(0.5, 1.0, 0.8));
  float diff  = max(dot(n, L1), 0.0);
  vec3  H1    = normalize(L1 + v);
  float spec  = pow(max(dot(n, H1), 0.0), 55.0);

  // fill light (cool)
  vec3  L2    = normalize(vec3(-0.6, -0.4, 0.5));
  float diff2 = max(dot(n, L2), 0.0) * 0.18;

  // iridescent rim: shifts from base colour → electric violet → ice-blue
  float fr2   = vFresnel * vFresnel;
  vec3 rim1   = mix(uColor, vec3(0.55, 0.30, 1.00), vFresnel * 0.7);
  vec3 rim2   = mix(rim1,   vec3(0.70, 0.88, 1.00), fr2     * 0.5);

  vec3 col =
      uColor * 0.30
    + uColor * diff  * 0.48
    + uColor * diff2
    + vec3(1.0)      * spec         * (0.9 + uGlow * 0.5)
    + rim2           * vFresnel     * 0.55
    + vec3(0.9,0.85,1.0) * fr2     * 0.25;

  gl_FragColor = vec4(col, 1.0);
}`;

/* ─── Sphere palette (Lusion-style: soft whites, pearls, light lavender) ── */
const PALETTE: [number,number,number][] = [
  [0.98, 0.97, 1.00],
  [0.96, 0.94, 1.00],
  [1.00, 0.96, 0.98],
  [0.95, 0.93, 1.00],
  [0.99, 0.98, 1.00],
  [0.97, 0.95, 1.00],
];

const N  = 18;               // number of spheres
const RADII = Array.from({ length: N }, (_, i) =>
  0.42 + (i % 5) * 0.09     // range 0.42 – 0.78, varied but not random
);

/* ─── Physics ────────────────────────────────────────────────────────────── */
const CENTER_SPRING = 0.006;   // weak pull toward (0,0) — creates clustering
const DAMPING       = 0.975;   // very sluggish / heavy feel
const RESTITUTION   = 0.28;    // soft bounce
const MAX_V         = 6.0;

const CURSOR_R      = 1.8;     // invisible push sphere
const CURSOR_SMOOTH = 10.0;
const PUSH_RADIUS   = 5.5;     // field radius
const PUSH_STR      = 22.0;

export function HeroCubes() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = container.clientWidth;
    const H = container.clientHeight;

    /* camera: closer + narrower FOV = bigger feel */
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.set(0, 0, 8.0);

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    /* shared high-res geometry */
    const geo = new THREE.SphereGeometry(1, 72, 72);

    const meshes: THREE.Mesh[]           = [];
    const mats:   THREE.ShaderMaterial[] = [];

    for (let i = 0; i < N; i++) {
      const col = PALETTE[i % PALETTE.length];
      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT, fragmentShader: FRAG,
        uniforms: {
          uColor: { value: new THREE.Color(...col) },
          uGlow:  { value: 0 },
        },
      });
      mats.push(mat);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.scale.setScalar(RADII[i]);
      scene.add(mesh);
      meshes.push(mesh);
    }

    /* ── physics state ── */
    const px = new Float32Array(N);
    const py = new Float32Array(N);
    const pz = new Float32Array(N);
    const vx = new Float32Array(N);
    const vy = new Float32Array(N);
    const vz = new Float32Array(N);

    /* float noise: each sphere has 2 independent sine oscillators per axis */
    const fAx = new Float32Array(N); const fAy = new Float32Array(N);
    const fBx = new Float32Array(N); const fBy = new Float32Array(N);
    const fpx = new Float32Array(N); const fpy = new Float32Array(N);
    const fqx = new Float32Array(N); const fqy = new Float32Array(N);
    const fa  = new Float32Array(N); const fb  = new Float32Array(N);

    /* scatter spheres across scene initially */
    const spread = 4.5;
    for (let i = 0; i < N; i++) {
      const angle = (i / N) * Math.PI * 2 + Math.random() * 0.4;
      const dist  = 0.4 + Math.random() * spread;
      px[i] = Math.cos(angle) * dist;
      py[i] = Math.sin(angle) * dist;
      pz[i] = (Math.random() - 0.5) * 2.0;

      /* irrational frequency ratios → never-repeating Lissajous drift */
      fAx[i] = 0.08 + Math.random() * 0.06;  // primary x freq
      fAy[i] = 0.07 + Math.random() * 0.06;  // primary y freq
      fBx[i] = fAx[i] * 1.618 + Math.random() * 0.02; // golden-ratio harmonic
      fBy[i] = fAy[i] * 1.414 + Math.random() * 0.02; // √2 harmonic
      fa[i]  = 0.18 + Math.random() * 0.14;  // amplitude A
      fb[i]  = 0.10 + Math.random() * 0.08;  // amplitude B
      fpx[i] = Math.random() * Math.PI * 2;
      fpy[i] = Math.random() * Math.PI * 2;
      fqx[i] = Math.random() * Math.PI * 2;
      fqy[i] = Math.random() * Math.PI * 2;
    }

    /* ── cursor state ── */
    let cxT = -999, cyT = -999, cx = -999, cy = -999;
    let pcx = -999, pcy = -999, cvx = 0, cvy = 0;
    let mouseActive = false;
    let ndcX = 0.5, ndcY = 0.5;

    const raycaster = new THREE.Raycaster();
    const m2d       = new THREE.Vector2();
    const plane     = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hit       = new THREE.Vector3();

    const trackMouse = (clientX: number, clientY: number) => {
      const r = container.getBoundingClientRect();
      m2d.x =  ((clientX - r.left) / r.width)  * 2 - 1;
      m2d.y = -((clientY - r.top)  / r.height) * 2 + 1;
      raycaster.setFromCamera(m2d, camera);
      raycaster.ray.intersectPlane(plane, hit);
      cxT = hit.x; cyT = hit.y;
      ndcX = (clientX - r.left) / r.width;
      ndcY = 1 - (clientY - r.top) / r.height;
      mouseActive = true;
    };

    const onMM = (e: MouseEvent) => trackMouse(e.clientX, e.clientY);
    const onTM = (e: TouchEvent) => { if (e.touches[0]) trackMouse(e.touches[0].clientX, e.touches[0].clientY); };
    const onML = () => { mouseActive = false; };
    window.addEventListener("mousemove",     onMM, { passive: true });
    container.addEventListener("touchmove",  onTM, { passive: true });
    container.addEventListener("mouseleave", onML);

    let tiltX = 0, tiltY = 0;
    const clock = new THREE.Clock();
    let animId  = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const raw = clock.getDelta();
      const dt  = Math.min(raw, 0.05);
      const t   = clock.elapsedTime;

      /* smooth cursor */
      if (mouseActive) {
        const sf = 1 - Math.exp(-CURSOR_SMOOTH * dt);
        cx += (cxT - cx) * sf;
        cy += (cyT - cy) * sf;
      }
      cvx = (cx - pcx) / Math.max(dt, 0.004);
      cvy = (cy - pcy) / Math.max(dt, 0.004);
      pcx = cx; pcy = cy;
      const cspeed = Math.hypot(cvx, cvy);

      /* very subtle camera parallax */
      tiltX += ((ndcX - 0.5) * 0.05 - tiltX) * (1 - Math.exp(-2.5 * dt));
      tiltY += (-(ndcY - 0.5) * 0.04 - tiltY) * (1 - Math.exp(-2.5 * dt));
      camera.rotation.y = tiltX;
      camera.rotation.x = tiltY;

      const SUB   = 5;
      const subDt = dt / SUB;
      const damp  = Math.pow(DAMPING, subDt * 60);

      for (let s = 0; s < SUB; s++) {

        for (let i = 0; i < N; i++) {
          /* complex Lissajous float offsets — never repeating */
          const offX =
            Math.sin(t * fAx[i] + fpx[i]) * fa[i] +
            Math.sin(t * fBx[i] + fqx[i]) * fb[i];
          const offY =
            Math.cos(t * fAy[i] + fpy[i]) * fa[i] +
            Math.cos(t * fBy[i] + fqy[i]) * fb[i];

          /* center spring: pull toward (offX, offY) anchored at origin */
          vx[i] += (offX - px[i]) * CENTER_SPRING * subDt * 60;
          vy[i] += (offY - py[i]) * CENTER_SPRING * subDt * 60;
          vz[i] += (0    - pz[i]) * CENTER_SPRING * 0.3 * subDt * 60;

          /* heavy damping — the sluggish Lusion feel */
          vx[i] *= damp; vy[i] *= damp; vz[i] *= damp;

          /* clamp */
          const spd = Math.hypot(vx[i], vy[i]);
          if (spd > MAX_V) { const sc = MAX_V / spd; vx[i] *= sc; vy[i] *= sc; }

          px[i] += vx[i] * subDt;
          py[i] += vy[i] * subDt;
          pz[i] += vz[i] * subDt;
        }

        /* sphere–sphere: soft elastic collision */
        for (let i = 0; i < N; i++) {
          for (let j = i + 1; j < N; j++) {
            const dx = px[j]-px[i], dy = py[j]-py[i], dz = pz[j]-pz[i];
            const d2 = dx*dx + dy*dy + dz*dz;
            const md = (RADII[i] + RADII[j]) * 1.005;
            if (d2 >= md*md || d2 < 0.0001) continue;
            const d  = Math.sqrt(d2);
            const nx = dx/d, ny = dy/d, nz = dz/d;
            const ov = md - d;
            const mA = RADII[i], mB = RADII[j], mT = mA + mB;
            px[i] -= nx*ov*0.5*(mB/mT); py[i] -= ny*ov*0.5*(mB/mT);
            px[j] += nx*ov*0.5*(mA/mT); py[j] += ny*ov*0.5*(mA/mT);
            const rvn = (vx[i]-vx[j])*nx + (vy[i]-vy[j])*ny + (vz[i]-vz[j])*nz;
            if (rvn > 0) continue;
            const imp = (-(1+RESTITUTION)*rvn) / mT;
            vx[i]+=nx*imp*mB; vy[i]+=ny*imp*mB;
            vx[j]-=nx*imp*mA; vy[j]-=ny*imp*mA;
          }
        }

        /* cursor push — smooth, proportional to cursor speed */
        if (mouseActive && cx > -99) {
          for (let i = 0; i < N; i++) {
            const dx = px[i]-cx, dy = py[i]-cy;
            const d  = Math.hypot(dx, dy);
            const nx = dx/(d+0.001), ny = dy/(d+0.001);
            const contact = CURSOR_R + RADII[i];

            /* hard contact push */
            if (d < contact) {
              px[i] += nx*(contact-d); py[i] += ny*(contact-d);
              const rvn = (vx[i]-cvx)*nx + (vy[i]-cvy)*ny;
              if (rvn < 0) {
                vx[i] += -rvn*nx*(1+RESTITUTION);
                vy[i] += -rvn*ny*(1+RESTITUTION);
              }
            }

            /* field push — speed-proportional, no attract (pure push-away) */
            if (d >= contact && d < PUSH_RADIUS) {
              const t0   = (d - contact) / (PUSH_RADIUS - contact);
              const fall = (1-t0)*(1-t0)*(1-t0);   // cubic falloff
              const str  = PUSH_STR * fall * Math.min(cspeed/3, 1.0) * subDt;
              vx[i] += nx * str;
              vy[i] += ny * str;
            }
          }
        }
      }

      /* sync meshes + glow */
      const gLerp = 1 - Math.exp(-4 * dt);
      for (let i = 0; i < N; i++) {
        meshes[i].position.set(px[i], py[i], pz[i]);
        let g = 0;
        if (mouseActive && cx > -99) {
          const d = Math.hypot(px[i]-cx, py[i]-cy);
          if (d < PUSH_RADIUS) g = Math.pow(1 - d/PUSH_RADIUS, 2);
        }
        mats[i].uniforms.uGlow.value += (g - mats[i].uniforms.uGlow.value) * gLerp;
      }

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = container.clientWidth, nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("resize",    onResize);
      container.removeEventListener("touchmove",  onTM);
      container.removeEventListener("mouseleave", onML);
      geo.dispose();
      mats.forEach(m => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />;
}
