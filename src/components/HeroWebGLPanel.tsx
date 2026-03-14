import { useEffect, useRef } from "react";
import * as THREE from "three";
import { isMobileDevice } from "../hooks/useIsMobile";

const BALL_COUNT = 28;
const BALL_COLORS = [
  0x8b5cf6, 0xa78bfa, 0xc4b5fd,
  0x6d28d9, 0x7c3aed, 0x4c1d95,
  0xddd6fe, 0xede9fe, 0xf5f3ff,
  0x1e1b4b, 0x312e81, 0x4338ca,
  0xffffff, 0xe0e7ff, 0xc7d2fe,
];

interface Ball {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  x: number;
  y: number;
  z: number;
}

const SPHERE_VERT = `
varying vec3 vNormal;
varying vec3 vViewPos;
varying vec3 vWorldPos;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vec4 viewPos  = viewMatrix * worldPos;
  vWorldPos = worldPos.xyz;
  vViewPos  = viewPos.xyz;
  vNormal   = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * viewPos;
}
`;

const SPHERE_FRAG = `
uniform vec3 uColor;
uniform vec3 uLightDir;
uniform vec3 uLightDir2;
uniform float uRoughness;
uniform float uMetalness;
uniform float uSpawnT;

varying vec3 vNormal;
varying vec3 vViewPos;
varying vec3 vWorldPos;

vec3 fresnelSchlick(float cosTheta, vec3 F0) {
  return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

float distributionGGX(vec3 N, vec3 H, float roughness) {
  float a  = roughness * roughness;
  float a2 = a * a;
  float NdH = max(dot(N, H), 0.0);
  float d = (NdH * NdH) * (a2 - 1.0) + 1.0;
  return a2 / (3.14159 * d * d);
}

float geometrySchlickGGX(float NdV, float roughness) {
  float r = roughness + 1.0;
  float k = (r * r) / 8.0;
  return NdV / (NdV * (1.0 - k) + k);
}

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vViewPos);

  vec3 albedo = uColor;
  float metalness  = uMetalness;
  float roughness  = uRoughness;

  vec3 F0 = mix(vec3(0.04), albedo, metalness);

  // Primary light
  vec3 L1 = normalize(uLightDir);
  vec3 H1 = normalize(V + L1);
  float NdL1 = max(dot(N, L1), 0.0);
  float NdV  = max(dot(N, V), 0.0);
  float D1  = distributionGGX(N, H1, roughness);
  float G1  = geometrySchlickGGX(NdV, roughness) * geometrySchlickGGX(NdL1, roughness);
  vec3 Fr1  = fresnelSchlick(max(dot(H1, V), 0.0), F0);
  vec3 specular1 = (D1 * G1 * Fr1) / max(4.0 * NdV * NdL1, 0.001);
  vec3 kD1 = (1.0 - Fr1) * (1.0 - metalness);

  // Secondary light (rim/fill)
  vec3 L2 = normalize(uLightDir2);
  vec3 H2 = normalize(V + L2);
  float NdL2 = max(dot(N, L2), 0.0);
  float D2  = distributionGGX(N, H2, roughness);
  float G2  = geometrySchlickGGX(NdV, roughness) * geometrySchlickGGX(NdL2, roughness);
  vec3 Fr2  = fresnelSchlick(max(dot(H2, V), 0.0), F0);
  vec3 specular2 = (D2 * G2 * Fr2) / max(4.0 * NdV * NdL2, 0.001);

  vec3 ambient = vec3(0.03) * albedo;

  vec3 color =
    ambient +
    (kD1 * albedo / 3.14159 + specular1) * NdL1 * vec3(1.0, 0.97, 0.92) * 2.5 +
    (specular2) * NdL2 * vec3(0.6, 0.65, 1.0) * 1.2;

  // Rim light for depth separation
  float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  color += rim * vec3(0.4, 0.35, 0.8) * 0.4;

  // Spawn fade-in
  color = mix(vec3(0.0), color, uSpawnT);

  gl_FragColor = vec4(color, uSpawnT);
}
`;

export function HeroWebGLPanel() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mobile = isMobileDevice();
    const W = container.clientWidth;
    const H = container.clientHeight;
    const dpr = mobile ? 1 : Math.min(window.devicePixelRatio, 2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !mobile,
      alpha: true,
      powerPreference: mobile ? "low-power" : "high-performance",
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(dpr);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 200);
    camera.position.set(0, 0, 48);

    const worldHalfW = Math.tan((40 * Math.PI) / 360) * 48;
    const worldHalfH = worldHalfW / (W / H);

    const balls: Ball[] = [];

    const ballCount = mobile ? 14 : BALL_COUNT;

    for (let i = 0; i < ballCount; i++) {
      const radius = 1.4 + Math.random() * 1.8;
      const colorHex = BALL_COLORS[i % BALL_COLORS.length];
      const color = new THREE.Color(colorHex);

      const roughness = 0.08 + Math.random() * 0.18;
      const metalness = 0.3 + Math.random() * 0.6;

      const mat = new THREE.ShaderMaterial({
        vertexShader: SPHERE_VERT,
        fragmentShader: SPHERE_FRAG,
        uniforms: {
          uColor: { value: color },
          uLightDir: { value: new THREE.Vector3(1.2, 1.8, 2.0).normalize() },
          uLightDir2: { value: new THREE.Vector3(-1.5, 0.5, 1.0).normalize() },
          uRoughness: { value: roughness },
          uMetalness: { value: metalness },
          uSpawnT: { value: 0.0 },
        },
        transparent: true,
      });

      const geo = new THREE.SphereGeometry(radius, mobile ? 24 : 48, mobile ? 24 : 48);
      const mesh = new THREE.Mesh(geo, mat);

      const angle = Math.random() * Math.PI * 2;
      const dist = 2 + Math.random() * 6;
      mesh.position.set(
        Math.cos(angle) * dist,
        Math.sin(angle) * dist,
        (Math.random() - 0.5) * 6,
      );

      scene.add(mesh);

      balls.push({
        mesh,
        radius,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 0.5,
        x: mesh.position.x,
        y: mesh.position.y,
        z: mesh.position.z,
      });
    }

    const mouse3D = new THREE.Vector3(9999, 9999, 0);
    let mouseActive = false;
    let animId: number;
    let startTime = performance.now();

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      mouse3D.set(
        (nx * 2 - 1) * worldHalfW,
        -(ny * 2 - 1) * worldHalfH,
        0,
      );
      mouseActive = true;
    };

    const onMouseLeave = () => {
      mouseActive = false;
      mouse3D.set(9999, 9999, 0);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const rect = container.getBoundingClientRect();
      const nx = (e.touches[0].clientX - rect.left) / rect.width;
      const ny = (e.touches[0].clientY - rect.top) / rect.height;
      mouse3D.set(
        (nx * 2 - 1) * worldHalfW,
        -(ny * 2 - 1) * worldHalfH,
        0,
      );
      mouseActive = true;
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onMouseLeave);

    const FRICTION = 0.96;
    const SPRING = 0.022;
    const MOUSE_REPEL_R = 5.5;
    const MOUSE_FORCE = 18.0;
    const BOUNDS_DAMP = 0.45;
    const MAX_V = 18;
    const COLLIDE_RESPONSE = 0.72;

    function simulate(dt: number) {
      const n = balls.length;

      for (let i = 0; i < n; i++) {
        const b = balls[i];

        b.vx += -b.x * SPRING * dt * 60;
        b.vy += -b.y * SPRING * dt * 60;
        b.vz += -b.z * SPRING * 0.3 * dt * 60;

        if (mouseActive) {
          const dx = b.x - mouse3D.x;
          const dy = b.y - mouse3D.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
          if (dist < MOUSE_REPEL_R) {
            const force = (1 - dist / MOUSE_REPEL_R) * MOUSE_FORCE;
            b.vx += (dx / dist) * force * dt;
            b.vy += (dy / dist) * force * dt;
          }
        }

        for (let j = i + 1; j < n; j++) {
          const b2 = balls[j];
          const dx = b.x - b2.x;
          const dy = b.y - b2.y;
          const dz = b.z - b2.z;
          const distSq = dx * dx + dy * dy + dz * dz;
          const minDist = b.radius + b2.radius;
          if (distSq < minDist * minDist && distSq > 0.0001) {
            const dist = Math.sqrt(distSq);
            const overlap = (minDist - dist) / dist;
            const nx = dx * overlap * 0.5;
            const ny = dy * overlap * 0.5;
            const nz = dz * overlap * 0.5;

            b.x += nx;
            b.y += ny;
            b.z += nz;
            b2.x -= nx;
            b2.y -= ny;
            b2.z -= nz;

            const dvx = b.vx - b2.vx;
            const dvy = b.vy - b2.vy;
            const dvn = (dvx * dx + dvy * dy) / distSq;

            if (dvn < 0) {
              const imp = dvn * COLLIDE_RESPONSE;
              b.vx -= imp * dx;
              b.vy -= imp * dy;
              b2.vx += imp * dx;
              b2.vy += imp * dy;
            }
          }
        }

        b.vx *= FRICTION;
        b.vy *= FRICTION;
        b.vz *= FRICTION;

        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (speed > MAX_V) {
          b.vx = (b.vx / speed) * MAX_V;
          b.vy = (b.vy / speed) * MAX_V;
        }

        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.z += b.vz * dt;

        const bx = worldHalfW - b.radius * 0.7;
        const by = worldHalfH - b.radius * 0.7;
        const bz = 5;

        if (b.x > bx) { b.x = bx; b.vx *= -BOUNDS_DAMP; }
        if (b.x < -bx) { b.x = -bx; b.vx *= -BOUNDS_DAMP; }
        if (b.y > by) { b.y = by; b.vy *= -BOUNDS_DAMP; }
        if (b.y < -by) { b.y = -by; b.vy *= -BOUNDS_DAMP; }
        if (b.z > bz) { b.z = bz; b.vz *= -BOUNDS_DAMP; }
        if (b.z < -bz) { b.z = -bz; b.vz *= -BOUNDS_DAMP; }

        b.mesh.position.set(b.x, b.y, b.z);
      }
    }

    let lastTime = performance.now();

    function animate() {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;

      const elapsed = (now - startTime) / 1000;

      balls.forEach((b, i) => {
        const delay = i * 0.08;
        const t = Math.min(Math.max((elapsed - delay) / 0.6, 0), 1);
        const spawnT = t * t * (3 - 2 * t);
        const mat = b.mesh.material as THREE.ShaderMaterial;
        mat.uniforms.uSpawnT.value = spawnT;

        if (t < 1) {
          b.mesh.scale.setScalar(spawnT * 1.05);
        } else {
          b.mesh.scale.setScalar(1);
        }
      });

      simulate(dt);
      renderer.render(scene, camera);
    }

    animate();

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onMouseLeave);
      balls.forEach((b) => {
        b.mesh.geometry.dispose();
        (b.mesh.material as THREE.ShaderMaterial).dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
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
