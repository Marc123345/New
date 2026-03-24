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
  vFresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.5);
  vViewDir = viewDir;
  gl_Position = projectionMatrix * mvPos;
}`;

const FRAG = `
uniform vec3  uColor;
uniform float uHover;
varying vec3  vNormal;
varying vec3  vViewDir;
varying float vFresnel;
void main() {
  vec3 n  = normalize(vNormal);
  vec3 v  = normalize(vViewDir);
  vec3 L1 = normalize(vec3(0.6, 1.0, 0.9));
  float diff1 = max(dot(n, L1), 0.0);
  vec3  H1    = normalize(L1 + v);
  float spec1 = pow(max(dot(n, H1), 0.0), 80.0 + uHover * 40.0);
  vec3 L2     = normalize(vec3(-0.8, -0.5, 0.3));
  float diff2 = max(dot(n, L2), 0.0) * 0.22;
  float fr    = vFresnel + uHover * 0.2;
  vec3 col =
      uColor * 0.36
    + uColor * diff1 * 0.52
    + uColor * diff2
    + vec3(1.0)             * spec1 * (0.75 + uHover * 0.4)
    + vec3(0.88, 0.85, 1.0) * fr   * 0.5
    + vec3(0.55, 0.35, 1.0) * fr * fr * 0.22;
  gl_FragColor = vec4(col, 1.0);
}`;

/* ─── Sphere definitions ─────────────────────────────────────────────────── */
const SPHERES = [
  { r: 1.10, hx:  0.0,  hy:  0.0,  hz:  0.0, color: [0.97, 0.96, 1.00] },
  { r: 1.00, hx: -2.8,  hy:  0.6,  hz: -0.3, color: [0.98, 0.97, 1.00] },
  { r: 1.05, hx:  2.8,  hy:  0.4,  hz: -0.5, color: [0.96, 0.94, 1.00] },
  { r: 0.85, hx: -1.4,  hy: -2.2,  hz:  0.2, color: [0.95, 0.93, 1.00] },
  { r: 0.90, hx:  1.5,  hy:  2.1,  hz:  0.1, color: [0.98, 0.96, 1.00] },
  { r: 0.80, hx: -4.2,  hy: -0.5,  hz: -0.8, color: [0.97, 0.95, 1.00] },
  { r: 0.88, hx:  4.0,  hy: -1.0,  hz: -0.6, color: [0.96, 0.95, 1.00] },
  { r: 0.75, hx:  0.4,  hy: -3.0,  hz:  0.4, color: [0.98, 0.97, 1.00] },
  { r: 0.82, hx: -0.6,  hy:  2.8,  hz: -0.2, color: [0.97, 0.96, 1.00] },
];

const N = SPHERES.length;

/* ─── Physics constants ──────────────────────────────────────────────────── */
const SPRING      = 0.018;
const FRICTION    = 0.920;
const MAX_SPEED   = 18.0;
const CURSOR_R    = 2.8;    // invisible cursor sphere radius
const CURSOR_SMOOTH = 14.0;
const FIELD_R     = 9.0;    // outer attract/scatter zone
const ATTRACT_R   = 5.5;
const BOUNDS_X    = 6.0;
const BOUNDS_Y    = 4.0;

export function HeroCubes() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = container.clientWidth;
    const H = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(46, W / H, 0.1, 100);
    camera.position.set(0, 0, 9.0);

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    /* ── build meshes ── */
    const geo64 = new THREE.SphereGeometry(1, 64, 64);

    const meshes: THREE.Mesh[]           = [];
    const mats:   THREE.ShaderMaterial[] = [];

    for (let i = 0; i < N; i++) {
      const { r, color } = SPHERES[i];
      const mat = new THREE.ShaderMaterial({
        vertexShader:   VERT,
        fragmentShader: FRAG,
        uniforms: {
          uColor: { value: new THREE.Color(...(color as [number,number,number])) },
          uHover: { value: 0 },
        },
      });
      mats.push(mat);
      const mesh = new THREE.Mesh(geo64, mat);
      mesh.scale.setScalar(r);
      scene.add(mesh);
      meshes.push(mesh);
    }

    /* ── physics state (flat arrays for speed) ── */
    const px = new Float32Array(N);
    const py = new Float32Array(N);
    const pz = new Float32Array(N);
    const vx = new Float32Array(N);
    const vy = new Float32Array(N);
    const vz = new Float32Array(N);
    const fp = new Float32Array(N); // float phase
    const fs = new Float32Array(N); // float speed
    const hover = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      px[i] = SPHERES[i].hx + (Math.random() - 0.5) * 0.3;
      py[i] = SPHERES[i].hy + (Math.random() - 0.5) * 0.3;
      pz[i] = (SPHERES[i] as any).hz ?? 0;
      fp[i] = Math.random() * Math.PI * 2;
      fs[i] = 0.35 + Math.random() * 0.25;
    }

    /* ── cursor tracking ── */
    let cxTarget = -999, cyTarget = -999;
    let cx = -999, cy = -999;
    let prevCx = -999, prevCy = -999;
    let cvx = 0, cvy = 0;
    let mouseActive = false;
    let mouseNdcX = 0.5, mouseNdcY = 0.5;

    const raycaster  = new THREE.Raycaster();
    const mouse2D    = new THREE.Vector2();
    const plane      = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hitPt      = new THREE.Vector3();

    const updateMouse = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      mouse2D.x =  ((clientX - rect.left) / rect.width)  * 2 - 1;
      mouse2D.y = -((clientY - rect.top)  / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse2D, camera);
      raycaster.ray.intersectPlane(plane, hitPt);
      cxTarget    = hitPt.x;
      cyTarget    = hitPt.y;
      mouseNdcX   = (clientX - rect.left) / rect.width;
      mouseNdcY   = 1 - (clientY - rect.top) / rect.height;
      mouseActive = true;
    };

    const onMouseMove  = (e: MouseEvent)     => updateMouse(e.clientX, e.clientY);
    const onTouchMove  = (e: TouchEvent)     => { if (e.touches[0]) updateMouse(e.touches[0].clientX, e.touches[0].clientY); };
    const onMouseLeave = ()                  => { mouseActive = false; };

    window.addEventListener("mousemove",  onMouseMove,  { passive: true });
    container.addEventListener("touchmove",  onTouchMove,  { passive: true });
    container.addEventListener("mouseleave", onMouseLeave);

    /* ── camera tilt ── */
    let tiltX = 0, tiltY = 0;

    /* ── animation loop ── */
    const clock  = new THREE.Clock();
    let   animId = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const rawDt = clock.getDelta();
      const dt    = Math.min(rawDt, 0.05);
      const t     = clock.elapsedTime;

      /* smooth cursor */
      if (mouseActive) {
        const sf = 1 - Math.exp(-CURSOR_SMOOTH * dt);
        cx += (cxTarget - cx) * sf;
        cy += (cyTarget - cy) * sf;
      }
      cvx = (cx - prevCx) / Math.max(dt, 0.004);
      cvy = (cy - prevCy) / Math.max(dt, 0.004);
      prevCx = cx; prevCy = cy;
      const cspeed = Math.sqrt(cvx * cvx + cvy * cvy);

      /* camera subtle tilt */
      tiltX += ((mouseNdcX - 0.5) * 0.08 - tiltX) * (1 - Math.exp(-3 * dt));
      tiltY += (-(mouseNdcY - 0.5) * 0.06 - tiltY) * (1 - Math.exp(-3 * dt));
      camera.rotation.y = tiltX;
      camera.rotation.x = tiltY;

      /* sub-steps for stability */
      const SUB   = 6;
      const subDt = dt / SUB;

      for (let s = 0; s < SUB; s++) {
        const fp2 = Math.pow(FRICTION, subDt * 60);

        for (let i = 0; i < N; i++) {
          /* spring to home */
          const floatY = Math.sin(t * fs[i] + fp[i]) * 0.12;
          const floatX = Math.cos(t * fs[i] * 0.7 + fp[i]) * 0.06;
          vx[i] += (SPHERES[i].hx + floatX - px[i]) * SPRING * subDt * 60;
          vy[i] += (SPHERES[i].hy + floatY - py[i]) * SPRING * subDt * 60;
          vz[i] += (0 - pz[i]) * SPRING * 0.4 * subDt * 60;

          vx[i] *= fp2; vy[i] *= fp2; vz[i] *= fp2;

          /* clamp speed */
          const spd2 = vx[i]*vx[i] + vy[i]*vy[i];
          if (spd2 > MAX_SPEED * MAX_SPEED) {
            const sc = MAX_SPEED / Math.sqrt(spd2);
            vx[i] *= sc; vy[i] *= sc;
          }

          px[i] += vx[i] * subDt;
          py[i] += vy[i] * subDt;
          pz[i] += vz[i] * subDt;

          /* boundary */
          const r = SPHERES[i].r;
          if (px[i] >  BOUNDS_X - r) { px[i] =  BOUNDS_X - r; vx[i] *= -0.5; }
          if (px[i] < -BOUNDS_X + r) { px[i] = -BOUNDS_X + r; vx[i] *= -0.5; }
          if (py[i] >  BOUNDS_Y - r) { py[i] =  BOUNDS_Y - r; vy[i] *= -0.5; }
          if (py[i] < -BOUNDS_Y + r) { py[i] = -BOUNDS_Y + r; vy[i] *= -0.5; }
        }

        /* sphere–sphere collision */
        for (let i = 0; i < N; i++) {
          for (let j = i + 1; j < N; j++) {
            const dx = px[j] - px[i];
            const dy = py[j] - py[i];
            const dz = pz[j] - pz[i];
            const distSq = dx*dx + dy*dy + dz*dz;
            const minD   = (SPHERES[i].r + SPHERES[j].r) * 1.01;
            if (distSq >= minD * minD || distSq < 0.0001) continue;
            const dist = Math.sqrt(distSq);
            const nx = dx/dist, ny = dy/dist, nz = dz/dist;
            const overlap = minD - dist;
            const mA = SPHERES[i].r, mB = SPHERES[j].r, mT = mA + mB;
            px[i] -= nx * overlap * 0.5 * (mB/mT);
            py[i] -= ny * overlap * 0.5 * (mB/mT);
            px[j] += nx * overlap * 0.5 * (mA/mT);
            py[j] += ny * overlap * 0.5 * (mA/mT);
            const rvn = (vx[i]-vx[j])*nx + (vy[i]-vy[j])*ny + (vz[i]-vz[j])*nz;
            if (rvn > 0) continue;
            const imp = (-(1 + 0.65) * rvn) / mT;
            vx[i] += nx*imp*mB; vy[i] += ny*imp*mB;
            vx[j] -= nx*imp*mA; vy[j] -= ny*imp*mA;
          }
        }

        /* cursor interaction */
        if (mouseActive && cx > -999) {
          for (let i = 0; i < N; i++) {
            const dx   = px[i] - cx;
            const dy   = py[i] - cy;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const nx   = dx / (dist + 0.0001);
            const ny   = dy / (dist + 0.0001);
            const contact = CURSOR_R + SPHERES[i].r;

            /* hard push */
            if (dist < contact && dist > 0.001) {
              const overlap = contact - dist;
              px[i] += nx * overlap;
              py[i] += ny * overlap;
              const rvn = (vx[i] - cvx)*nx + (vy[i] - cvy)*ny;
              if (rvn < 0) {
                const imp = -(1 + 0.85) * rvn;
                vx[i] += nx * imp;
                vy[i] += ny * imp;
              }
              const sweep = Math.min(cspeed * 0.03, 2.0);
              vx[i] += cvx * sweep * subDt * 60;
              vy[i] += cvy * sweep * subDt * 60;
            }

            /* field zone: attract when slow, scatter when fast */
            if (dist >= contact && dist < FIELD_R) {
              const blend = Math.min(cspeed / 5.0, 1.0);
              const t0    = (dist - contact) / (FIELD_R - contact);
              const fall  = (1 - t0*t0) * (1 - t0*t0);

              if (blend < 0.8 && dist < ATTRACT_R) {
                const tA   = (dist - contact) / (ATTRACT_R - contact);
                const attF = (1 - tA) * (1 - tA);
                vx[i] -= nx * 10.0 * attF * (1 - blend) * subDt;
                vy[i] -= ny * 10.0 * attF * (1 - blend) * subDt;
              }
              if (blend > 0.15) {
                vx[i] += nx * 32.0 * fall * blend * subDt;
                vy[i] += ny * 32.0 * fall * blend * subDt;
                vx[i] += cvx * 0.006 * fall * blend * subDt * 60;
                vy[i] += cvy * 0.006 * fall * blend * subDt * 60;
              }
            }
          }
        }
      }

      /* update mesh positions + hover glow */
      const hLerp = 1 - Math.exp(-5 * dt);
      for (let i = 0; i < N; i++) {
        meshes[i].position.set(px[i], py[i], pz[i]);

        let targetHover = 0;
        if (mouseActive && cx > -999) {
          const dx = px[i] - cx, dy = py[i] - cy;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < FIELD_R * 0.65) targetHover = 1 - d / (FIELD_R * 0.65);
        }
        hover[i] += (targetHover - hover[i]) * hLerp;
        mats[i].uniforms.uHover.value = hover[i];
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
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("resize",     onResize);
      container.removeEventListener("touchmove",  onTouchMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      geo64.dispose();
      mats.forEach(m => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />;
}
