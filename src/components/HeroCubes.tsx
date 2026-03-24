/**
 * HeroCubes — Lusion.co physics replica
 *
 * Exact params from canxerian/lusion-reverse-engineered:
 *  • 30 spheres, radius 0.6
 *  • Orthographic camera (15 frustum units at 1280 px ref width)
 *  • Zero gravity
 *  • Centering force: 3.5  →  velocity += toward(0,0,0) * 3.5 * dt
 *  • Linear damping:  0.6  →  velocity *= (1 - 0.6 * dt)
 *  • Restitution:     0.3
 *  • Mouse impulse:   delta * 10
 *  • Material: MeshStandardMaterial, roughness 0.22, metalness 0
 *              + RoomEnvironment for reflections + ACESFilmic tone-map
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const N      = 30;
const RADIUS = 0.6;

/* Lusion colour palette — pinks, lavenders, pearls */
const COLORS = [
  0xf5c2d5, 0xdbb4f0, 0xb8d4f5, 0xf0d5c2,
  0xe8c5e8, 0xc5d5e8, 0xf5e6c2, 0xd5f5c2,
  0xffffff, 0xf0e8ff, 0xffe8f0, 0xe8fff0,
];

export function HeroCubes() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let W = container.clientWidth;
    let H = container.clientHeight;

    /* ── Orthographic camera (Lusion calibration: 15 units at 1280 px) ── */
    const getFrustum = (w: number, h: number) => {
      const fs = 15 * (w / 1280);
      const aspect = w / h;
      return { l: -fs / 2, r: fs / 2, t: fs / 2 / aspect, b: -fs / 2 / aspect };
    };
    const f0 = getFrustum(W, H);
    const camera = new THREE.OrthographicCamera(f0.l, f0.r, f0.t, f0.b, 0, 100);
    camera.position.z = 10;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace  = THREE.SRGBColorSpace;
    renderer.toneMapping       = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    /* ── Scene + RoomEnvironment (gives soft studio reflections) ── */
    const scene  = new THREE.Scene();
    const pmrem  = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    /* Subtle directional (matches Lusion: 0.1 intensity, dir (1,1,1)) */
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.1);
    dirLight.position.set(1, 1, 1).normalize();
    scene.add(dirLight);

    /* ── Build spheres ── */
    const geo   = new THREE.SphereGeometry(RADIUS, 64, 64);
    const meshes: THREE.Mesh[] = [];

    for (let i = 0; i < N; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color:     COLORS[i % COLORS.length],
        roughness: 0.22,
        metalness: 0,
        envMapIntensity: 1.2,
      });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);
      meshes.push(mesh);
    }

    /* ── Physics state ── */
    const px = new Float32Array(N);
    const py = new Float32Array(N);
    const vx = new Float32Array(N);
    const vy = new Float32Array(N);

    /* Scatter initial positions across scene */
    for (let i = 0; i < N; i++) {
      const angle = (i / N) * Math.PI * 2;
      const dist  = 1.0 + Math.random() * 4.0;
      px[i] = Math.cos(angle) * dist + (Math.random() - 0.5) * 0.5;
      py[i] = Math.sin(angle) * dist + (Math.random() - 0.5) * 0.5;
    }

    /* ── Mouse tracking ── */
    let prevMx = 0, prevMy = 0;
    let worldPrevX = 0, worldPrevY = 0;
    let mouseReady = false;

    const toWorld = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      // Map client coords to orthographic world coords
      const ndcX =  ((clientX - rect.left)  / rect.width)  * 2 - 1;
      const ndcY = -((clientY - rect.top)   / rect.height) * 2 + 1;
      const f    = getFrustum(rect.width, rect.height);
      return {
        x: ndcX * (f.r),
        y: ndcY * (f.t),
      };
    };

    const onMM = (e: MouseEvent) => {
      const w = toWorld(e.clientX, e.clientY);
      if (mouseReady) {
        const dx = (w.x - worldPrevX);
        const dy = (w.y - worldPrevY);
        /* Apply impulse to all spheres weighted by proximity */
        for (let i = 0; i < N; i++) {
          const sx  = px[i] - w.x, sy  = py[i] - w.y;
          const d   = Math.hypot(sx, sy);
          const inf = Math.max(0, 1 - d / 4.5);           // radius of influence
          vx[i] += dx * 10 * inf;
          vy[i] += dy * 10 * inf;
        }
      }
      worldPrevX = w.x; worldPrevY = w.y;
      prevMx = e.clientX; prevMy = e.clientY;
      mouseReady = true;
    };

    const onML = () => { mouseReady = false; };
    window.addEventListener("mousemove",     onMM, { passive: true });
    container.addEventListener("mouseleave", onML);

    /* ── Animation loop ── */
    const clock  = new THREE.Clock();
    let   animId = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const raw = clock.getDelta();
      const dt  = Math.min(raw, 1 / 30); // cap at 30fps equivalent

      /* Sub-steps for stable collision */
      const SUB   = 8;
      const subDt = dt / SUB;

      for (let s = 0; s < SUB; s++) {
        /* 1. Centering force (3.5) — pulls all balls toward origin */
        for (let i = 0; i < N; i++) {
          const d  = Math.hypot(px[i], py[i]);
          if (d < 0.001) continue;
          const nx = -px[i] / d, ny = -py[i] / d;
          vx[i] += nx * 3.5 * subDt;
          vy[i] += ny * 3.5 * subDt;
        }

        /* 2. Linear damping (0.6): velocity *= (1 - 0.6 * subDt) */
        const damp = Math.max(0, 1 - 0.6 * subDt);
        for (let i = 0; i < N; i++) {
          vx[i] *= damp;
          vy[i] *= damp;
        }

        /* 3. Integrate */
        for (let i = 0; i < N; i++) {
          px[i] += vx[i] * subDt;
          py[i] += vy[i] * subDt;
        }

        /* 4. Sphere–sphere elastic collision (restitution 0.3) */
        for (let i = 0; i < N; i++) {
          for (let j = i + 1; j < N; j++) {
            const dx = px[j] - px[i], dy = py[j] - py[i];
            const d2 = dx * dx + dy * dy;
            const md = RADIUS * 2 * 1.002;
            if (d2 >= md * md || d2 < 0.0001) continue;
            const d  = Math.sqrt(d2);
            const nx = dx / d, ny = dy / d;
            /* positional correction */
            const corr = (md - d) * 0.5;
            px[i] -= nx * corr; py[i] -= ny * corr;
            px[j] += nx * corr; py[j] += ny * corr;
            /* velocity exchange */
            const rvn = (vx[i] - vx[j]) * nx + (vy[i] - vy[j]) * ny;
            if (rvn > 0) continue;
            const imp = -(1 + 0.3) * rvn * 0.5;   // equal mass
            vx[i] += nx * imp; vy[i] += ny * imp;
            vx[j] -= nx * imp; vy[j] -= ny * imp;
          }
        }
      }

      /* 5. Upload positions */
      for (let i = 0; i < N; i++) {
        meshes[i].position.set(px[i], py[i], 0);
      }

      renderer.render(scene, camera);
    };
    animate();

    /* ── Resize ── */
    const onResize = () => {
      W = container.clientWidth;
      H = container.clientHeight;
      const fn = getFrustum(W, H);
      (camera as THREE.OrthographicCamera).left   = fn.l;
      (camera as THREE.OrthographicCamera).right  = fn.r;
      (camera as THREE.OrthographicCamera).top    = fn.t;
      (camera as THREE.OrthographicCamera).bottom = fn.b;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("resize",    onResize);
      container.removeEventListener("mouseleave", onML);
      geo.dispose();
      meshes.forEach(m => (m.material as THREE.Material).dispose());
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />;
}
