import { useEffect, useRef } from "react";
import * as THREE from "three";
import { isMobileDevice } from "../hooks/useIsMobile";

const BALL_COLORS = [
  0xa78bfa, 0x8b5cf6, 0xc4b5fd,
  0x7c3aed, 0x6d28d9, 0xddd6fe,
  0xede9fe, 0xf5f3ff, 0x4c1d95,
  0xe0e7ff, 0xc7d2fe, 0xffffff,
  0x312e81, 0x4338ca, 0x1e1b4b,
];

interface Ball {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  x: number;
  y: number;
  spawnT: number;
  spawnDelay: number;
}

const SPHERE_VERT = `
varying vec3 vNormal;
varying vec3 vViewPos;

void main() {
  vec4 viewPos = modelViewMatrix * vec4(position, 1.0);
  vViewPos = viewPos.xyz;
  vNormal  = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * viewPos;
}
`;

const SPHERE_FRAG = `
uniform vec3  uColor;
uniform float uRoughness;
uniform float uMetalness;
uniform float uSpawnT;

varying vec3 vNormal;
varying vec3 vViewPos;

vec3 fresnelSchlick(float cosTheta, vec3 F0) {
  return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

float GGX(vec3 N, vec3 H, float r) {
  float a = r * r;
  float a2 = a * a;
  float d = max(dot(N, H), 0.0);
  float denom = d * d * (a2 - 1.0) + 1.0;
  return a2 / (3.14159 * denom * denom);
}

float smithG(float NdV, float r) {
  float k = (r + 1.0) * (r + 1.0) / 8.0;
  return NdV / (NdV * (1.0 - k) + k);
}

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vViewPos);

  vec3 L1 = normalize(vec3(1.4, 2.0, 2.5));
  vec3 L2 = normalize(vec3(-1.8, 0.4, 1.0));
  vec3 L3 = normalize(vec3(0.0, -1.0, 1.5));

  vec3 F0 = mix(vec3(0.04), uColor, uMetalness);

  float NdV = max(dot(N, V), 0.0);

  vec3 color = vec3(0.0);

  // Light 1 - warm key
  {
    vec3 H = normalize(V + L1);
    float NdL = max(dot(N, L1), 0.0);
    float D = GGX(N, H, uRoughness);
    float G = smithG(NdV, uRoughness) * smithG(NdL, uRoughness);
    vec3 F = fresnelSchlick(max(dot(H, V), 0.0), F0);
    vec3 spec = (D * G * F) / max(4.0 * NdV * NdL, 0.001);
    vec3 kD = (1.0 - F) * (1.0 - uMetalness);
    color += (kD * uColor / 3.14159 + spec) * NdL * vec3(1.0, 0.96, 0.88) * 3.0;
  }

  // Light 2 - cool fill
  {
    vec3 H = normalize(V + L2);
    float NdL = max(dot(N, L2), 0.0);
    float D = GGX(N, H, uRoughness);
    float G = smithG(NdV, uRoughness) * smithG(NdL, uRoughness);
    vec3 F = fresnelSchlick(max(dot(H, V), 0.0), F0);
    vec3 spec = (D * G * F) / max(4.0 * NdV * NdL, 0.001);
    color += spec * NdL * vec3(0.5, 0.6, 1.0) * 1.4;
  }

  // Light 3 - bounce/under
  {
    float NdL = max(dot(N, L3), 0.0);
    color += uColor * NdL * vec3(0.3, 0.25, 0.6) * 0.35;
  }

  // Ambient
  color += uColor * 0.04;

  // Rim
  float rim = pow(1.0 - NdV, 4.0);
  color += rim * mix(vec3(0.6, 0.5, 1.0), vec3(1.0), uMetalness) * 0.5;

  // Spawn scale
  color *= uSpawnT;

  gl_FragColor = vec4(color, uSpawnT);
}
`;

export function HeroWebGLPanel() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const mobile = isMobileDevice();
    const W = el.clientWidth;
    const H = el.clientHeight;
    const dpr = mobile ? 1 : Math.min(window.devicePixelRatio, 2);

    // ── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: !mobile,
      alpha: true,
      powerPreference: mobile ? "low-power" : "high-performance",
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(dpr);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Camera / scene ───────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const FOV = 38;
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 0.1, 300);
    camera.position.set(0, 0, 55);

    // World bounds at z=0 plane (camera distance = 55)
    const halfW = () => Math.tan((FOV * Math.PI) / 360) * 55;
    const halfH = () => halfW() / (el.clientWidth / el.clientHeight);

    // ── Balls ────────────────────────────────────────────────────────────
    const BALL_COUNT = mobile ? 16 : 30;
    const balls: Ball[] = [];

    for (let i = 0; i < BALL_COUNT; i++) {
      const radius = 1.2 + Math.random() * 2.0;
      const mass = radius * radius;
      const colorHex = BALL_COLORS[i % BALL_COLORS.length];
      const roughness = 0.06 + Math.random() * 0.20;
      const metalness = 0.25 + Math.random() * 0.65;

      const mat = new THREE.ShaderMaterial({
        vertexShader: SPHERE_VERT,
        fragmentShader: SPHERE_FRAG,
        uniforms: {
          uColor:     { value: new THREE.Color(colorHex) },
          uRoughness: { value: roughness },
          uMetalness: { value: metalness },
          uSpawnT:    { value: 0.0 },
        },
        transparent: true,
      });

      const segs = mobile ? 28 : 52;
      const geo  = new THREE.SphereGeometry(radius, segs, segs);
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      // Spawn from top, staggered
      const bx = (Math.random() - 0.5) * halfW() * 1.6;
      const by = halfH() + radius + Math.random() * halfH() * 2;

      mesh.position.set(bx, by, 0);

      balls.push({
        mesh,
        radius,
        mass,
        vx: (Math.random() - 0.5) * 3,
        vy: -1 - Math.random() * 2,
        x: bx,
        y: by,
        spawnT: 0,
        spawnDelay: i * 0.07,
      });
    }

    // ── Mouse / touch tracking ──────────────────────────────────────────
    const mouse3D  = new THREE.Vector2(99999, 99999);
    const mouseVel = new THREE.Vector2(0, 0);
    let   lastMouseX = 99999;
    let   lastMouseY = 99999;
    let   mouseInside = false;

    const toWorld = (cx: number, cy: number) => {
      const rect = el.getBoundingClientRect();
      const nx = (cx - rect.left) / rect.width;
      const ny = (cy - rect.top)  / rect.height;
      return new THREE.Vector2(
        (nx * 2 - 1) * halfW(),
        -(ny * 2 - 1) * halfH(),
      );
    };

    const onMouseMove = (e: MouseEvent) => {
      const w = toWorld(e.clientX, e.clientY);
      mouseVel.set(w.x - lastMouseX, w.y - lastMouseY);
      mouse3D.copy(w);
      lastMouseX = w.x;
      lastMouseY = w.y;
      mouseInside = true;
    };
    const onMouseLeave = () => {
      mouseInside = false;
      mouse3D.set(99999, 99999);
      mouseVel.set(0, 0);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const w = toWorld(e.touches[0].clientX, e.touches[0].clientY);
      mouseVel.set(w.x - lastMouseX, w.y - lastMouseY);
      mouse3D.copy(w);
      lastMouseX = w.x;
      lastMouseY = w.y;
      mouseInside = true;
    };

    el.addEventListener("mousemove",  onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("touchmove",  onTouchMove,  { passive: true });
    el.addEventListener("touchend",   onMouseLeave);

    // ── Physics constants ───────────────────────────────────────────────
    const GRAVITY       = -22;
    const FRICTION      = 0.985;
    const FLOOR_BOUNCE  = 0.28;
    const WALL_BOUNCE   = 0.35;
    const MOUSE_RADIUS  = 7.0;
    const MOUSE_ATTRACT = 28.0;
    const MOUSE_VEL_XFER = 0.55;
    const COLLIDE_DAMP  = 0.68;
    const MAX_SPEED     = 30;
    const SUBSTEPS      = 3;

    const startTime = performance.now();
    let lastTime = performance.now();
    let animId: number;

    function simulate(dt: number) {
      const sub_dt = dt / SUBSTEPS;
      const hw = halfW();
      const hh = halfH();

      for (let step = 0; step < SUBSTEPS; step++) {
        const n = balls.length;

        for (let i = 0; i < n; i++) {
          const b = balls[i];
          if (b.spawnT < 1) continue;

          // Gravity
          b.vy += GRAVITY * sub_dt;

          // Mouse interaction – attract toward cursor + transfer cursor velocity
          if (mouseInside) {
            const dx = mouse3D.x - b.x;
            const dy = mouse3D.y - b.y;
            const dist2 = dx * dx + dy * dy;
            const dist  = Math.sqrt(dist2) + 0.001;
            if (dist < MOUSE_RADIUS) {
              const t = 1 - dist / MOUSE_RADIUS;
              const smoothT = t * t * (3 - 2 * t);
              const force = smoothT * MOUSE_ATTRACT;
              b.vx += (dx / dist) * force * sub_dt;
              b.vy += (dy / dist) * force * sub_dt;
              // Transfer cursor velocity
              b.vx += mouseVel.x * smoothT * MOUSE_VEL_XFER;
              b.vy += mouseVel.y * smoothT * MOUSE_VEL_XFER;
            }
          }

          // Friction
          b.vx *= Math.pow(FRICTION, sub_dt * 60);
          b.vy *= Math.pow(FRICTION, sub_dt * 60);

          // Speed cap
          const sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
          if (sp > MAX_SPEED) {
            b.vx = (b.vx / sp) * MAX_SPEED;
            b.vy = (b.vy / sp) * MAX_SPEED;
          }

          b.x += b.vx * sub_dt;
          b.y += b.vy * sub_dt;

          // Floor
          const floor = -hh + b.radius;
          if (b.y < floor) {
            b.y  = floor;
            b.vy = Math.abs(b.vy) * FLOOR_BOUNCE;
            b.vx *= 0.88;
          }

          // Ceiling
          const ceil = hh - b.radius;
          if (b.y > ceil) {
            b.y  = ceil;
            b.vy = -Math.abs(b.vy) * WALL_BOUNCE;
          }

          // Left / right walls
          const left  = -hw + b.radius;
          const right =  hw - b.radius;
          if (b.x < left)  { b.x = left;  b.vx =  Math.abs(b.vx) * WALL_BOUNCE; }
          if (b.x > right) { b.x = right; b.vx = -Math.abs(b.vx) * WALL_BOUNCE; }
        }

        // Ball-ball collisions
        for (let i = 0; i < n; i++) {
          const a = balls[i];
          if (a.spawnT < 1) continue;

          for (let j = i + 1; j < n; j++) {
            const b = balls[j];
            if (b.spawnT < 1) continue;

            const dx  = a.x - b.x;
            const dy  = a.y - b.y;
            const d2  = dx * dx + dy * dy;
            const min = a.radius + b.radius;

            if (d2 < min * min && d2 > 0.0001) {
              const d     = Math.sqrt(d2);
              const pen   = (min - d) / d;
              const invM  = 1 / (a.mass + b.mass);
              const wa    = b.mass * invM;
              const wb    = a.mass * invM;

              // Separate
              a.x += dx * pen * wa;
              a.y += dy * pen * wa;
              b.x -= dx * pen * wb;
              b.y -= dy * pen * wb;

              // Impulse along collision normal
              const nx  = dx / d;
              const ny  = dy / d;
              const dvx = a.vx - b.vx;
              const dvy = a.vy - b.vy;
              const dvn = dvx * nx + dvy * ny;

              if (dvn < 0) {
                const imp = dvn * COLLIDE_DAMP;
                a.vx -= imp * wa * nx;
                a.vy -= imp * wa * ny;
                b.vx += imp * wb * nx;
                b.vy += imp * wb * ny;
              }
            }
          }
        }

        // Write to meshes
        for (const b of balls) {
          b.mesh.position.set(b.x, b.y, 0);
        }
      }
    }

    function animate() {
      animId = requestAnimationFrame(animate);
      const now     = performance.now();
      const dt      = Math.min((now - lastTime) / 1000, 0.05);
      const elapsed = (now - startTime) / 1000;
      lastTime = now;

      for (const b of balls) {
        const t = Math.min(Math.max((elapsed - b.spawnDelay) / 0.5, 0), 1);
        b.spawnT = t * t * (3 - 2 * t);
        const mat = b.mesh.material as THREE.ShaderMaterial;
        mat.uniforms.uSpawnT.value = b.spawnT;
        b.mesh.scale.setScalar(b.spawnT);
      }

      // Reset mouse velocity each frame (only meaningful for 1 frame)
      mouseVel.set(0, 0);

      simulate(dt);
      renderer.render(scene, camera);
    }

    animate();

    // ── Resize ───────────────────────────────────────────────────────────
    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      el.removeEventListener("mousemove",  onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("touchmove",  onTouchMove);
      el.removeEventListener("touchend",   onMouseLeave);
      for (const b of balls) {
        b.mesh.geometry.dispose();
        (b.mesh.material as THREE.ShaderMaterial).dispose();
      }
      renderer.dispose();
      if (renderer.domElement.parentNode === el) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
