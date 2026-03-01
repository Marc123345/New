import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import * as THREE from 'three';
import { brandLogos } from '../lib/brandLogos';
import { ScrollReveal } from './ScrollReveal';
import { VideoOverlay } from './VideoOverlay';

const PEOPLE_IMAGES = [
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
];

const ALL_URLS = [...PEOPLE_IMAGES, ...brandLogos];
const RADII = ALL_URLS.map((_, i) => (i < PEOPLE_IMAGES.length ? 2.8 : 2.2));
const N = ALL_URLS.length;

const BOUNDS_X = 13;
const BOUNDS_Y = 9;
const CURSOR_SPHERE_R = 4.0;
const CURSOR_SMOOTH = 8.0;
const CURSOR_FIELD_R = 14.0;
const SPRING_HOME = 0.08;
const FRICTION = 0.97;
const MAX_SPEED = 55.0;
const MAX_SPEED_SQ = MAX_SPEED * MAX_SPEED;
const JELLY_SPRING = 22.0;
const JELLY_DAMPING = 5.0;

const CUBE_VERT = `
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec2 vUv;
varying float vFresnel;
void main() {
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vec4 vp = viewMatrix * wp;
  vViewDir = normalize(-vp.xyz);
  vNormal = normalize(normalMatrix * normal);
  vFresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.5);
  gl_Position = projectionMatrix * vp;
}`;

const CUBE_FRAG = `
uniform sampler2D uMap;
uniform vec3 uRimColor;
uniform float uRimStr;
uniform float uHover;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec2 vUv;
varying float vFresnel;
void main() {
  vec4 tex = texture2D(uMap, vUv);
  vec3 rim = uRimColor * vFresnel * uRimStr * (1.0 + uHover * 0.8);
  vec3 L = normalize(vec3(0.4, 0.7, 1.0));
  float diff = max(dot(vNormal, L), 0.0);
  vec3 H = normalize(L + vViewDir);
  float spec = pow(max(dot(vNormal, H), 0.0), 64.0) * (0.7 + uHover * 0.5);
  vec3 ambient = tex.rgb * 0.55;
  vec3 lit = tex.rgb * diff * 0.45;
  gl_FragColor = vec4(ambient + lit + spec * 0.9 + rim, 1.0);
}`;

const SHELL_VERT = `
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  vec4 vp = viewMatrix * modelMatrix * vec4(position, 1.0);
  vViewDir = normalize(-vp.xyz);
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * vp;
}`;

const SHELL_FRAG = `
uniform vec3 uColor;
uniform float uHover;
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  float fr = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.8);
  float glow = fr * (0.4 + uHover * 0.6);
  gl_FragColor = vec4(uColor * glow, glow * 0.6);
}`;

const DISPLACEMENT_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const DISPLACEMENT_FRAG = `
uniform sampler2D uScene;
uniform vec2 uMouse;
uniform float uRadius;
uniform float uStrength;
uniform vec2 uVelocity;
uniform vec2 uResolution;
varying vec2 vUv;
void main() {
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 uv = vUv;
  vec2 mouse = uMouse;
  vec2 diff = (uv - mouse) * aspect;
  float dist = length(diff);
  float falloff = smoothstep(uRadius, 0.0, dist);
  vec2 dir = normalize(diff + 0.0001);
  vec2 vel = uVelocity * aspect;
  float velMag = length(vel);
  vec2 displacement = dir * falloff * uStrength * 0.012;
  displacement += vel * falloff * 0.008 * min(velMag * 2.0, 1.0);
  vec2 r = texture2D(uScene, uv + displacement * 1.1).rg;
  float g = texture2D(uScene, uv + displacement).g;
  vec2 b = texture2D(uScene, uv + displacement * 0.9).ba;
  gl_FragColor = vec4(r.x, g, b.x, b.y);
}`;

const SHELL_COLORS = [
  new THREE.Color(0x88ccff), new THREE.Color(0xffd0a0),
  new THREE.Color(0xaaffcc), new THREE.Color(0xffaacc),
  new THREE.Color(0xccddff), new THREE.Color(0xffeebb),
];

function HeroButton({ variant, children, onClick }: { variant: 'primary' | 'outline'; children: React.ReactNode; onClick?: () => void }) {
  const isPrimary = variant === 'primary';
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-block px-8 py-4 border-2 cursor-pointer uppercase"
      style={{
        fontFamily: 'var(--font-stack-heading)',
        fontSize: '0.75rem',
        letterSpacing: '0.15em',
        background: isPrimary ? '#fbfbfc' : 'transparent',
        color: isPrimary ? '#291e56' : '#fbfbfc',
        borderColor: '#fbfbfc',
        boxShadow: hovered
          ? `6px 6px 0 #a46cfc`
          : `4px 4px 0 rgba(164,108,252,0.7)`,
        transform: hovered ? 'translate(-2px, -2px)' : 'translate(0, 0)',
        transition: 'box-shadow 0.18s ease, transform 0.18s ease',
      }}
    >
      {children}
    </button>
  );
}

function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 35);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const renderTarget = new THREE.WebGLRenderTarget(
      container.clientWidth * Math.min(window.devicePixelRatio, 2),
      container.clientHeight * Math.min(window.devicePixelRatio, 2)
    );

    const displacementScene = new THREE.Scene();
    const displacementCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const displacementMaterial = new THREE.ShaderMaterial({
      vertexShader: DISPLACEMENT_VERT,
      fragmentShader: DISPLACEMENT_FRAG,
      uniforms: {
        uScene: { value: renderTarget.texture },
        uMouse: { value: new THREE.Vector2(-1, -1) },
        uRadius: { value: 0.15 },
        uStrength: { value: 0.0 },
        uVelocity: { value: new THREE.Vector2(0, 0) },
        uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      },
    });
    const displacementQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), displacementMaterial);
    displacementScene.add(displacementQuad);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const geoCache = new Map<number, [THREE.BoxGeometry, THREE.BoxGeometry]>();
    const getGeos = (r: number) => {
      const key = Math.round(r * 10);
      if (!geoCache.has(key)) {
        const s = r * 2;
        geoCache.set(key, [new THREE.BoxGeometry(s, s, s), new THREE.BoxGeometry(s * 1.08, s * 1.08, s * 1.08)]);
      }
      return geoCache.get(key)!;
    };

    const px = new Float32Array(N);
    const py = new Float32Array(N);
    const pz = new Float32Array(N);
    const vx = new Float32Array(N);
    const vy = new Float32Array(N);
    const vz = new Float32Array(N);
    const radii = new Float32Array(RADII);
    const masses = new Float32Array(N);

    const jellyScaleX = new Float32Array(N).fill(1);
    const jellyScaleY = new Float32Array(N).fill(1);
    const jellyScaleZ = new Float32Array(N).fill(1);
    const jellyVelX = new Float32Array(N);
    const jellyVelY = new Float32Array(N);
    const jellyVelZ = new Float32Array(N);
    const jellyTargetX = new Float32Array(N).fill(1);
    const jellyTargetY = new Float32Array(N).fill(1);
    const jellyTargetZ = new Float32Array(N).fill(1);

    const breathPhase = new Float32Array(N);
    const floatPhaseX = new Float32Array(N);
    const floatPhaseY = new Float32Array(N);
    const floatPhaseZ = new Float32Array(N);
    const floatSpeedX = new Float32Array(N);
    const floatSpeedY = new Float32Array(N);
    const floatSpeedZ = new Float32Array(N);

    const homeX = new Float32Array(N);
    const homeY = new Float32Array(N);

    const rotVelX = new Float32Array(N);
    const rotVelY = new Float32Array(N);
    const baseRotX = new Float32Array(N);
    const baseRotY = new Float32Array(N);
    const baseRotZ = new Float32Array(N);

    const hoverAmount = new Float32Array(N);
    const spawned = new Uint8Array(N);
    const spawnStart = new Float32Array(N);

    const meshes: THREE.Group[] = [];
    const innerGroups: THREE.Group[] = [];
    const cubeMaterials: THREE.ShaderMaterial[] = [];
    const shellMaterials: THREE.ShaderMaterial[] = [];
    const loadedTextures: THREE.Texture[] = [];
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");

    for (let i = 0; i < N; i++) {
      const r = radii[i];
      masses[i] = r * r;
      spawnStart[i] = i * 0.08;

      breathPhase[i] = Math.random() * Math.PI * 2;
      floatPhaseX[i] = Math.random() * Math.PI * 2;
      floatPhaseY[i] = Math.random() * Math.PI * 2;
      floatPhaseZ[i] = Math.random() * Math.PI * 2;
      floatSpeedX[i] = 0.06 + Math.random() * 0.08;
      floatSpeedY[i] = 0.05 + Math.random() * 0.07;
      floatSpeedZ[i] = 0.04 + Math.random() * 0.06;

      baseRotX[i] = (Math.random() - 0.5) * 0.03;
      baseRotY[i] = (Math.random() - 0.5) * 0.03;
      baseRotZ[i] = (Math.random() - 0.5) * 0.015;

      const angle = (i / N) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
      const dist = 0.35 + Math.random() * 0.45;
      homeX[i] = Math.cos(angle) * BOUNDS_X * dist * 0.7;
      homeY[i] = Math.sin(angle) * BOUNDS_Y * dist * 0.7;
      px[i] = homeX[i] + (Math.random() - 0.5) * 2;
      py[i] = homeY[i] + (Math.random() - 0.5) * 2;
      pz[i] = (Math.random() - 0.5) * 3;

      const group = new THREE.Group();
      const inner = new THREE.Group();
      group.add(inner);
      group.position.set(px[i], py[i], pz[i]);
      group.scale.setScalar(0);
      mainGroup.add(group);
      meshes.push(group);
      innerGroups.push(inner);

      inner.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);

      const rimColor = SHELL_COLORS[i % SHELL_COLORS.length];
      const [cubeGeo, shellGeo] = getGeos(r);

      const tex = textureLoader.load(ALL_URLS[i], (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
        t.needsUpdate = true;
      }, undefined, () => {});
      loadedTextures.push(tex);

      const cubeMat = new THREE.ShaderMaterial({
        vertexShader: CUBE_VERT,
        fragmentShader: CUBE_FRAG,
        uniforms: {
          uMap: { value: tex },
          uRimColor: { value: rimColor },
          uRimStr: { value: 1.2 },
          uHover: { value: 0 },
        },
      });
      cubeMaterials.push(cubeMat);
      inner.add(new THREE.Mesh(cubeGeo, cubeMat));

      const shellMat = new THREE.ShaderMaterial({
        vertexShader: SHELL_VERT,
        fragmentShader: SHELL_FRAG,
        uniforms: {
          uColor: { value: rimColor },
          uHover: { value: 0 },
        },
        transparent: true, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
      });
      shellMaterials.push(shellMat);
      inner.add(new THREE.Mesh(shellGeo, shellMat));
    }

    let targetCx = -9999, targetCy = -9999;
    let sphereX = -9999, sphereY = -9999;
    let prevSphereX = -9999, prevSphereY = -9999;
    let sphereVx = 0, sphereVy = 0;
    let mouseActive = false;
    let mouseNdcX = 0, mouseNdcY = 0;
    let displacementStrength = 0;

    const raycaster = new THREE.Raycaster();
    const mouse2D = new THREE.Vector2();
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hitPt = new THREE.Vector3();

    const updateMouse = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      mouse2D.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse2D.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse2D, camera);
      raycaster.ray.intersectPlane(planeZ, hitPt);
      targetCx = hitPt.x;
      targetCy = hitPt.y;
      mouseNdcX = (clientX - rect.left) / rect.width;
      mouseNdcY = 1.0 - (clientY - rect.top) / rect.height;
      mouseActive = true;
    };

    const handleMouseMove = (e: MouseEvent) => updateMouse(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => { if (e.touches[0]) updateMouse(e.touches[0].clientX, e.touches[0].clientY); };
    const handleMouseLeave = () => { mouseActive = false; };

    window.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave);

    let hidden = false;
    const handleVisibility = () => { hidden = document.hidden; };
    document.addEventListener("visibilitychange", handleVisibility);

    let tiltX = 0, tiltY = 0;
    let time = 0;

    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (hidden) return;

      const rawDelta = clock.getDelta();
      const dt = Math.min(rawDelta, 0.05);
      time += dt;

      if (mouseActive) {
        const smoothFactor = 1 - Math.exp(-CURSOR_SMOOTH * dt);
        sphereX += (targetCx - sphereX) * smoothFactor;
        sphereY += (targetCy - sphereY) * smoothFactor;
      } else {
        sphereX += (-9999 - sphereX) * 0.02;
        sphereY += (-9999 - sphereY) * 0.02;
      }

      sphereVx = (sphereX - prevSphereX) / Math.max(dt, 0.004);
      sphereVy = (sphereY - prevSphereY) / Math.max(dt, 0.004);
      prevSphereX = sphereX;
      prevSphereY = sphereY;

      const targetTiltX = mouseActive ? (mouseNdcX - 0.5) * 0.06 : 0;
      const targetTiltY = mouseActive ? -(mouseNdcY - 0.5) * 0.05 : 0;
      tiltX += (targetTiltX - tiltX) * (1 - Math.exp(-3 * dt));
      tiltY += (targetTiltY - tiltY) * (1 - Math.exp(-3 * dt));
      mainGroup.rotation.y = tiltX;
      mainGroup.rotation.x = tiltY;

      const targetDisp = mouseActive ? 1.0 : 0.0;
      displacementStrength += (targetDisp - displacementStrength) * (1 - Math.exp(-4 * dt));

      for (let i = 0; i < N; i++) {
        if (spawned[i]) continue;
        const elapsed = time - spawnStart[i];
        if (elapsed < 0) continue;
        const t = Math.min(elapsed / 1.2, 1);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const overshoot = 1.0 + 0.15 * Math.sin(elapsed * 6) * Math.exp(-elapsed * 2.5);
        meshes[i].scale.setScalar(Math.max(ease * overshoot, 0));
        if (t >= 1) {
          meshes[i].scale.setScalar(1);
          spawned[i] = 1;
        }
      }

      const SUB = 10;
      const subDt = dt / SUB;
      const sphereSpeed = Math.sqrt(sphereVx * sphereVx + sphereVy * sphereVy);

      for (let s = 0; s < SUB; s++) {
        for (let i = 0; i < N; i++) {
          const floatOffX = Math.sin(time * floatSpeedX[i] + floatPhaseX[i]) * 0.06;
          const floatOffY = Math.sin(time * floatSpeedY[i] + floatPhaseY[i]) * 0.05;

          const dx = (homeX[i] + floatOffX) - px[i];
          const dy = (homeY[i] + floatOffY) - py[i];
          const dz = -pz[i];

          vx[i] += dx * SPRING_HOME * subDt;
          vy[i] += dy * SPRING_HOME * subDt;
          vz[i] += dz * SPRING_HOME * 0.3 * subDt;

          const frictionPow = Math.pow(FRICTION, subDt * 60);
          vx[i] *= frictionPow;
          vy[i] *= frictionPow;
          vz[i] *= frictionPow;

          const spd2 = vx[i] * vx[i] + vy[i] * vy[i] + vz[i] * vz[i];
          if (spd2 > MAX_SPEED_SQ) {
            const sc = Math.sqrt(MAX_SPEED_SQ / spd2);
            vx[i] *= sc; vy[i] *= sc; vz[i] *= sc;
          }

          px[i] += vx[i] * subDt;
          py[i] += vy[i] * subDt;
          pz[i] += vz[i] * subDt;

          const r = radii[i];
          const mX = BOUNDS_X - r, mY = BOUNDS_Y - r, mZ = 3.0;
          if (px[i] > mX) { px[i] = mX; vx[i] *= -0.4; }
          else if (px[i] < -mX) { px[i] = -mX; vx[i] *= -0.4; }
          if (py[i] > mY) { py[i] = mY; vy[i] *= -0.4; }
          else if (py[i] < -mY) { py[i] = -mY; vy[i] *= -0.4; }
          if (pz[i] > mZ) { pz[i] = mZ; vz[i] *= -0.4; }
          else if (pz[i] < -mZ) { pz[i] = -mZ; vz[i] *= -0.4; }
        }

        for (let i = 0; i < N; i++) {
          for (let j = i + 1; j < N; j++) {
            const ddx = px[j] - px[i];
            const ddy = py[j] - py[i];
            const ddz = pz[j] - pz[i];
            const distSq = ddx * ddx + ddy * ddy + ddz * ddz;
            const minD = (radii[i] + radii[j]) * 1.02;
            if (distSq >= minD * minD || distSq < 0.0001) continue;

            const dist = Math.sqrt(distSq);
            const nx = ddx / dist, ny = ddy / dist, nz = ddz / dist;
            const overlap = minD - dist;
            const mA = masses[i], mB = masses[j], mT = mA + mB;

            px[i] -= nx * overlap * 0.5 * (mB / mT);
            py[i] -= ny * overlap * 0.5 * (mB / mT);
            pz[i] -= nz * overlap * 0.5 * (mB / mT);
            px[j] += nx * overlap * 0.5 * (mA / mT);
            py[j] += ny * overlap * 0.5 * (mA / mT);
            pz[j] += nz * overlap * 0.5 * (mA / mT);

            const rvn = (vx[i] - vx[j]) * nx + (vy[i] - vy[j]) * ny + (vz[i] - vz[j]) * nz;
            if (rvn > 0) continue;
            const imp = (-(1 + 0.65) * rvn) / mT;
            vx[i] += nx * imp * mB; vy[i] += ny * imp * mB; vz[i] += nz * imp * mB;
            vx[j] -= nx * imp * mA; vy[j] -= ny * imp * mA; vz[j] -= nz * imp * mA;

            const impact = Math.abs(rvn);
            if (impact > 0.5) {
              const amt = Math.min(impact * 0.06, 0.4);
              jellyTargetX[i] = 1 - Math.abs(nx) * amt;
              jellyTargetY[i] = 1 - Math.abs(ny) * amt;
              jellyTargetZ[i] = 1 - Math.abs(nz) * amt;
              jellyTargetX[j] = 1 - Math.abs(nx) * amt;
              jellyTargetY[j] = 1 - Math.abs(ny) * amt;
              jellyTargetZ[j] = 1 - Math.abs(nz) * amt;
            }
          }
        }

        if (mouseActive && sphereX > -999) {
          for (let i = 0; i < N; i++) {
            const ddx = px[i] - sphereX;
            const ddy = py[i] - sphereY;
            const distSq = ddx * ddx + ddy * ddy;
            const dist = Math.sqrt(distSq);
            const contactDist = CURSOR_SPHERE_R + radii[i];

            if (dist < contactDist && dist > 0.001) {
              const nx = ddx / dist, ny = ddy / dist;
              const overlap = contactDist - dist;

              px[i] += nx * overlap;
              py[i] += ny * overlap;

              const relVn = (vx[i] - sphereVx) * nx + (vy[i] - sphereVy) * ny;
              if (relVn < 0) {
                const restitution = 0.75;
                const impulseMag = -(1 + restitution) * relVn;
                vx[i] += nx * impulseMag;
                vy[i] += ny * impulseMag;
              }

              const sweepFactor = Math.min(sphereSpeed * 0.015, 1.2);
              vx[i] += sphereVx * sweepFactor * subDt * 60;
              vy[i] += sphereVy * sweepFactor * subDt * 60;

              const squishAmt = Math.min(overlap / contactDist * 0.5, 0.35);
              jellyTargetX[i] = 1 + Math.abs(ny) * squishAmt - Math.abs(nx) * squishAmt * 0.7;
              jellyTargetY[i] = 1 + Math.abs(nx) * squishAmt - Math.abs(ny) * squishAmt * 0.7;
              jellyTargetZ[i] = 1 - squishAmt * 0.4;
            }

            if (dist < CURSOR_FIELD_R && dist > contactDist) {
              const nx = ddx / dist, ny = ddy / dist;
              const t = (dist - contactDist) / (CURSOR_FIELD_R - contactDist);
              const falloff = (1 - t) * (1 - t);

              const pushStr = 15.0 * falloff * (1 + sphereSpeed * 0.04) * subDt;
              vx[i] += nx * pushStr;
              vy[i] += ny * pushStr;

              if (sphereSpeed > 2.0) {
                const sweepStr = sphereSpeed * 0.003 * falloff * subDt * 60;
                vx[i] += sphereVx * sweepStr;
                vy[i] += sphereVy * sweepStr;
              }
            }
          }
        }
      }

      for (let i = 0; i < N; i++) {
        const forceX = (jellyTargetX[i] - jellyScaleX[i]) * JELLY_SPRING;
        const forceY = (jellyTargetY[i] - jellyScaleY[i]) * JELLY_SPRING;
        const forceZ = (jellyTargetZ[i] - jellyScaleZ[i]) * JELLY_SPRING;

        jellyVelX[i] += forceX * dt;
        jellyVelY[i] += forceY * dt;
        jellyVelZ[i] += forceZ * dt;

        const decay = Math.exp(-JELLY_DAMPING * dt);
        jellyVelX[i] *= decay;
        jellyVelY[i] *= decay;
        jellyVelZ[i] *= decay;

        jellyScaleX[i] += jellyVelX[i] * dt;
        jellyScaleY[i] += jellyVelY[i] * dt;
        jellyScaleZ[i] += jellyVelZ[i] * dt;

        const recover = 1 - Math.exp(-3 * dt);
        jellyTargetX[i] += (1 - jellyTargetX[i]) * recover;
        jellyTargetY[i] += (1 - jellyTargetY[i]) * recover;
        jellyTargetZ[i] += (1 - jellyTargetZ[i]) * recover;
      }

      for (let i = 0; i < N; i++) {
        if (!spawned[i]) {
          meshes[i].position.set(px[i], py[i], pz[i]);
          continue;
        }

        const zFloat = Math.sin(time * floatSpeedZ[i] + floatPhaseZ[i]) * 0.1;
        meshes[i].position.set(px[i], py[i], pz[i] + zFloat);

        const breath = 1 + Math.sin(time * 0.6 + breathPhase[i]) * 0.005;
        meshes[i].scale.set(
          jellyScaleX[i] * breath,
          jellyScaleY[i] * breath,
          jellyScaleZ[i] * breath
        );

        const speed = Math.sqrt(vx[i] * vx[i] + vy[i] * vy[i]);
        const targetRotVelX = baseRotX[i] + vy[i] * 0.15;
        const targetRotVelY = baseRotY[i] - vx[i] * 0.15;
        const rLerp = 1 - Math.exp(-6 * dt);
        rotVelX[i] += (targetRotVelX - rotVelX[i]) * rLerp;
        rotVelY[i] += (targetRotVelY - rotVelY[i]) * rLerp;

        const speedMult = 1 + Math.min(speed * 0.06, 1.0) * 10.0;
        innerGroups[i].rotation.x += rotVelX[i] * dt * speedMult;
        innerGroups[i].rotation.y += rotVelY[i] * dt * speedMult;
        innerGroups[i].rotation.z += baseRotZ[i] * dt;

        let targetHover = 0;
        if (mouseActive && sphereX > -999) {
          const hDx = px[i] - sphereX;
          const hDy = py[i] - sphereY;
          const hDist = Math.sqrt(hDx * hDx + hDy * hDy);
          if (hDist < CURSOR_FIELD_R * 0.5) {
            targetHover = 1 - (hDist / (CURSOR_FIELD_R * 0.5));
          }
        }
        hoverAmount[i] += (targetHover - hoverAmount[i]) * (1 - Math.exp(-5 * dt));
        cubeMaterials[i].uniforms.uHover.value = hoverAmount[i];
        shellMaterials[i].uniforms.uHover.value = hoverAmount[i];
      }

      displacementMaterial.uniforms.uMouse.value.set(mouseNdcX, mouseNdcY);
      displacementMaterial.uniforms.uVelocity.value.set(sphereVx * 0.01, sphereVy * 0.01);
      displacementMaterial.uniforms.uStrength.value = displacementStrength * Math.min(
        sphereSpeed * 0.06 + 0.3,
        2.0
      );

      renderer.setRenderTarget(renderTarget);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      renderer.render(displacementScene, displacementCamera);
    };
    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      const pr = Math.min(window.devicePixelRatio, 2);
      renderTarget.setSize(w * pr, h * pr);
      displacementMaterial.uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animId);

      renderTarget.dispose();
      displacementMaterial.dispose();
      displacementQuad.geometry.dispose();
      loadedTextures.forEach((t) => t.dispose());
      geoCache.forEach(([g1, g2]) => { g1.dispose(); g2.dispose(); });
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => { m.dispose(); });
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}

export function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden"
      style={{ background: '#000' }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #020408 0%, #060210 40%, #020408 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 65% 50%, rgba(30,60,120,0.25) 0%, transparent 65%)',
          }}
        />
      </div>

      <div
        className="relative z-10 px-6 md:px-12"
        style={{
          paddingTop: 'var(--space-8x)',
          paddingBottom: 'var(--space-8x)',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[60vh]">
            <header>
              <motion.h1
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: 0.05 }}
                style={{
                  fontSize: 'clamp(2.8rem, 7vw, 5rem)',
                  lineHeight: 1.08,
                  letterSpacing: '-0.03em',
                  fontFamily: 'var(--font-stack-heading)',
                  color: '#ffffff',
                  marginBottom: 'var(--space-6x)',
                  textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                }}
              >
                From{' '}
                <span style={{ WebkitTextStroke: '2px #ffffff', color: 'transparent' }}>B2B</span>{' '}
                to{' '}
                <span style={{ WebkitTextStroke: '2px #ffffff', color: 'transparent' }}>H2H</span>
                <br />
                Build a Brand People
                <br />
                Want to Talk To
              </motion.h1>

              <motion.p
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: 0.2 }}
                className="text-xl md:text-2xl"
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  lineHeight: 1.6,
                  maxWidth: '36rem',
                  marginBottom: 'var(--space-6x)',
                  textShadow: '0 1px 10px rgba(0,0,0,0.4)',
                }}
              >
                People don't only want to connect with brands anymore;
                they connect with the people behind them.
              </motion.p>

              <motion.div
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: 0.35 }}
                className="flex flex-wrap gap-4"
              >
                <HeroButton variant="primary" onClick={() => setVideoOpen(true)}>
                  Hear Our Story
                </HeroButton>
                <HeroButton variant="outline" onClick={() => setVideoOpen(true)}>
                  Our Journey
                </HeroButton>
              </motion.div>
            </header>

            <ScrollReveal mode="blur" delay={0.2} className="w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                <div
                  className="relative mx-auto w-full h-[340px] sm:h-[480px] md:h-[700px] lg:h-[820px] overflow-hidden"
                  style={{
                    border: "3px solid var(--color-text-dark)",
                    boxShadow: "10px 10px 0 var(--color-surface-dark)",
                    background: "#000",
                  }}
                >
                  <HeroCanvas />
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <VideoOverlay isOpen={videoOpen} onClose={() => setVideoOpen(false)} />
    </section>
  );
}