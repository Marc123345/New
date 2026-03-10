import { useEffect, useRef } from "react";
import * as THREE from "three";
import { brandLogos } from "../lib/brandLogos";
import { isMobileDevice } from "../hooks/useIsMobile";

const PEOPLE_IMAGES = [
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=400",
];

const ALL_URLS = [...PEOPLE_IMAGES, ...brandLogos];
const RADII = ALL_URLS.map((_, i) => (i < PEOPLE_IMAGES.length ? 3.0 : 2.3));
const N = ALL_URLS.length;

const BOUNDS_X = 20;
const BOUNDS_Y = 13;

const CURSOR_SPHERE_R = 5.5;
const CURSOR_SMOOTH = 16.0;
const CURSOR_FIELD_R = 16.0;

const SPRING_HOME = 0.06;
const FRICTION = 0.965;
const MAX_SPEED = 40.0;
const MAX_SPEED_SQ = MAX_SPEED * MAX_SPEED;

const JELLY_SPRING = 18.0;
const JELLY_DAMPING = 6.0;

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
  vFresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 3.0);
  gl_Position = projectionMatrix * vp;
}`;

const CUBE_FRAG = `
uniform sampler2D uMap;
uniform float uHover;
uniform float uDepth;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec2 vUv;
varying float vFresnel;
void main() {
  vec4 tex = texture2D(uMap, vUv);

  // Key light — cooler, slightly top-left
  vec3 L = normalize(vec3(0.4, 0.65, 1.0));
  float diff = max(dot(vNormal, L), 0.0) * 0.22;

  // Specular — sharp, tinted toward purple-white
  vec3 H = normalize(L + vViewDir);
  float specRaw = pow(max(dot(vNormal, H), 0.0), 140.0);
  vec3 specColor = mix(vec3(0.55, 0.35, 1.0), vec3(1.0, 1.0, 1.0), specRaw) * specRaw * (0.9 + uHover * 0.7);

  // Darker, more glass-like base
  vec3 ambient = tex.rgb * 0.48;
  vec3 diffuse = tex.rgb * diff;

  // Iridescent fresnel rim: purple → cyan based on angle
  float fr = pow(vFresnel, 2.2);
  vec3 rimPurple = vec3(0.52, 0.18, 1.0);
  vec3 rimCyan   = vec3(0.15, 0.85, 1.0);
  vec3 rim = mix(rimPurple, rimCyan, fr) * fr * (0.45 + uHover * 0.55);

  // Subtle inner color tint toward deep violet
  vec3 tint = vec3(0.08, 0.04, 0.18) * (1.0 - fr) * 0.6;

  vec3 final = ambient + diffuse + specColor + rim + tint;
  float fog = mix(1.0, 0.45, uDepth);
  gl_FragColor = vec4(final * fog, 1.0);
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
uniform float uHover;
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  float fr = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.8);

  // Iridescent shell: deep purple → vivid cyan → magenta highlights
  vec3 colA = vec3(0.48, 0.12, 1.0);   // deep purple
  vec3 colB = vec3(0.08, 0.75, 1.0);   // cyan
  vec3 colC = vec3(0.9,  0.25, 1.0);   // magenta-purple

  vec3 iriColor = mix(colA, colB, fr * fr);
  iriColor = mix(iriColor, colC, sin(fr * 3.14159) * 0.35);

  float glow = fr * (0.28 + uHover * 0.52);
  gl_FragColor = vec4(iriColor * glow, glow * 0.65);
}`;

export function HeroWebGLPanel() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 36);

    const mobile = isMobileDevice();
    const maxDpr = mobile ? 1 : Math.min(window.devicePixelRatio, 2);
    const renderer = new THREE.WebGLRenderer({ antialias: !mobile, alpha: true, powerPreference: mobile ? "low-power" : "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(maxDpr);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);


    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const geoCache = new Map<number, [THREE.BoxGeometry, THREE.BoxGeometry]>();
    const getGeos = (r: number) => {
      const key = Math.round(r * 10);
      if (!geoCache.has(key)) {
        const s = r * 2;
        geoCache.set(key, [
          new THREE.BoxGeometry(s, s, s, 1, 1, 1),
          new THREE.BoxGeometry(s * 1.12, s * 1.12, s * 1.12),
        ]);
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
    const depthFactor = new Float32Array(N);

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
      spawnStart[i] = i * 0.04;

      breathPhase[i] = Math.random() * Math.PI * 2;
      floatPhaseX[i] = Math.random() * Math.PI * 2;
      floatPhaseY[i] = Math.random() * Math.PI * 2;
      floatPhaseZ[i] = Math.random() * Math.PI * 2;
      floatSpeedX[i] = 0.04 + Math.random() * 0.06;
      floatSpeedY[i] = 0.03 + Math.random() * 0.05;
      floatSpeedZ[i] = 0.025 + Math.random() * 0.04;

      baseRotX[i] = (Math.random() - 0.5) * 0.025;
      baseRotY[i] = (Math.random() - 0.5) * 0.025;
      baseRotZ[i] = (Math.random() - 0.5) * 0.012;

      depthFactor[i] = Math.random();

      const angle = (i / N) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
      const dist = 0.25 + Math.random() * 0.6;
      homeX[i] = Math.cos(angle) * BOUNDS_X * dist * 0.78;
      homeY[i] = Math.sin(angle) * BOUNDS_Y * dist * 0.78;
      px[i] = homeX[i] + (Math.random() - 0.5) * 2;
      py[i] = homeY[i] + (Math.random() - 0.5) * 2;
      pz[i] = (Math.random() - 0.5) * 4;

      const group = new THREE.Group();
      const inner = new THREE.Group();
      group.add(inner);
      group.position.set(px[i], py[i], pz[i]);
      group.scale.setScalar(0);
      mainGroup.add(group);
      meshes.push(group);
      innerGroups.push(inner);

      inner.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      const [cubeGeo, shellGeo] = getGeos(r);

      const tex = textureLoader.load(
        ALL_URLS[i],
        (t) => {
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
          t.needsUpdate = true;
        },
        undefined,
        () => {}
      );
      loadedTextures.push(tex);

      const cubeMat = new THREE.ShaderMaterial({
        vertexShader: CUBE_VERT,
        fragmentShader: CUBE_FRAG,
        uniforms: {
          uMap: { value: tex },
          uHover: { value: 0 },
          uDepth: { value: depthFactor[i] },
        },
      });
      cubeMaterials.push(cubeMat);
      inner.add(new THREE.Mesh(cubeGeo, cubeMat));

      const shellMat = new THREE.ShaderMaterial({
        vertexShader: SHELL_VERT,
        fragmentShader: SHELL_FRAG,
        uniforms: {
          uHover: { value: 0 },
        },
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      shellMaterials.push(shellMat);
      inner.add(new THREE.Mesh(shellGeo, shellMat));
    }

    let targetCx = -9999, targetCy = -9999;
    let sphereX = -9999, sphereY = -9999;
    let prevSphereX = -9999, prevSphereY = -9999;
    let sphereVx = 0, sphereVy = 0;
    let mouseActive = false;

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
      mouseActive = true;
    };

    let justEntered = false;

    const handleMouseMove = (e: MouseEvent) => {
      updateMouse(e.clientX, e.clientY);
      // Teleport sphere to cursor on first move after entering so there is
      // no velocity spike from the sphere rushing in from -9999.
      if (justEntered) {
        sphereX = targetCx; sphereY = targetCy;
        prevSphereX = targetCx; prevSphereY = targetCy;
        sphereVx = 0; sphereVy = 0;
        justEntered = false;
      }
    };
    const handleMouseEnter = () => {
      mouseActive = true;
      justEntered = true;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) updateMouse(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleMouseLeave = () => { mouseActive = false; justEntered = false; };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave);

    let hidden = document.hidden;
    let offscreen = false;
    let animId: number;
    let animating = false;

    const visObserver = new IntersectionObserver(
      ([entry]) => { offscreen = !entry.isIntersecting; },
      { threshold: 0 }
    );
    visObserver.observe(container);

    let tiltX = 0, tiltY = 0;
    let time = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      if (hidden) {
        animating = false;
        return;
      }
      animId = requestAnimationFrame(animate);

      if (offscreen) {
        clock.getDelta();
        return;
      }

      const rawDelta = clock.getDelta();
      const dt = Math.min(rawDelta, 0.05);
      time += dt;

      if (mouseActive) {
        const sf = 1 - Math.exp(-CURSOR_SMOOTH * dt);
        sphereX += (targetCx - sphereX) * sf;
        sphereY += (targetCy - sphereY) * sf;
      } else {
        sphereX += (-9999 - sphereX) * 0.015;
        sphereY += (-9999 - sphereY) * 0.015;
      }

      sphereVx = (sphereX - prevSphereX) / Math.max(dt, 0.004);
      sphereVy = (sphereY - prevSphereY) / Math.max(dt, 0.004);
      prevSphereX = sphereX;
      prevSphereY = sphereY;

      const targetTiltX = mouseActive ? (mouseNdcX - 0.5) * 0.04 : 0;
      const targetTiltY = mouseActive ? -(mouseNdcY - 0.5) * 0.035 : 0;
      tiltX += (targetTiltX - tiltX) * (1 - Math.exp(-2.5 * dt));
      tiltY += (targetTiltY - tiltY) * (1 - Math.exp(-2.5 * dt));
      mainGroup.rotation.y = tiltX;
      mainGroup.rotation.x = tiltY;

      for (let i = 0; i < N; i++) {
        if (spawned[i]) continue;
        const elapsed = time - spawnStart[i];
        if (elapsed < 0) continue;
        const t = Math.min(elapsed / 1.4, 1);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const overshoot = 1.0 + 0.12 * Math.sin(elapsed * 5) * Math.exp(-elapsed * 2.5);
        meshes[i].scale.setScalar(Math.max(ease * overshoot, 0));
        if (t >= 1) {
          meshes[i].scale.setScalar(1);
          spawned[i] = 1;
        }
      }

      const SUB = mobile ? 3 : 8;
      const subDt = dt / SUB;
      const sphereSpeed = Math.sqrt(sphereVx * sphereVx + sphereVy * sphereVy);

      for (let s = 0; s < SUB; s++) {
        for (let i = 0; i < N; i++) {
          const floatOffX = Math.sin(time * floatSpeedX[i] + floatPhaseX[i]) * 0.08;
          const floatOffY = Math.sin(time * floatSpeedY[i] + floatPhaseY[i]) * 0.06;

          const dx = (homeX[i] + floatOffX) - px[i];
          const dy = (homeY[i] + floatOffY) - py[i];
          const dz = -pz[i];

          vx[i] += dx * SPRING_HOME * subDt;
          vy[i] += dy * SPRING_HOME * subDt;
          vz[i] += dz * SPRING_HOME * 0.25 * subDt;

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
          const mX = BOUNDS_X - r, mY = BOUNDS_Y - r, mZ = 3.5;
          if (px[i] > mX) { px[i] = mX; vx[i] *= -0.35; }
          else if (px[i] < -mX) { px[i] = -mX; vx[i] *= -0.35; }
          if (py[i] > mY) { py[i] = mY; vy[i] *= -0.35; }
          else if (py[i] < -mY) { py[i] = -mY; vy[i] *= -0.35; }
          if (pz[i] > mZ) { pz[i] = mZ; vz[i] *= -0.35; }
          else if (pz[i] < -mZ) { pz[i] = -mZ; vz[i] *= -0.35; }
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
            const imp = (-(1 + 0.55) * rvn) / mT;
            vx[i] += nx * imp * mB; vy[i] += ny * imp * mB; vz[i] += nz * imp * mB;
            vx[j] -= nx * imp * mA; vy[j] -= ny * imp * mA; vz[j] -= nz * imp * mA;

            const impact = Math.abs(rvn);
            if (impact > 0.4) {
              const amt = Math.min(impact * 0.05, 0.3);
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
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            const contactDist = CURSOR_SPHERE_R + radii[i];

            if (dist < contactDist && dist > 0.001) {
              const nx = ddx / dist, ny = ddy / dist;
              const overlap = contactDist - dist;

              px[i] += nx * overlap;
              py[i] += ny * overlap;

              const relVn = (vx[i] - sphereVx) * nx + (vy[i] - sphereVy) * ny;
              if (relVn < 0) {
                const impulseMag = -(1 + 0.7) * relVn;
                vx[i] += nx * impulseMag;
                vy[i] += ny * impulseMag;
              }

              const sweepFactor = Math.min(sphereSpeed * 0.012, 1.0);
              vx[i] += sphereVx * sweepFactor * subDt * 60;
              vy[i] += sphereVy * sweepFactor * subDt * 60;

              const squishAmt = Math.min(overlap / contactDist * 0.45, 0.28);
              jellyTargetX[i] = 1 + Math.abs(ny) * squishAmt - Math.abs(nx) * squishAmt * 0.6;
              jellyTargetY[i] = 1 + Math.abs(nx) * squishAmt - Math.abs(ny) * squishAmt * 0.6;
              jellyTargetZ[i] = 1 - squishAmt * 0.35;
            }

            if (dist < CURSOR_FIELD_R && dist > contactDist) {
              const nx = ddx / dist, ny = ddy / dist;
              const t = (dist - contactDist) / (CURSOR_FIELD_R - contactDist);
              const falloff = (1 - t) * (1 - t);
              const pushStr = 12.0 * falloff * (1 + sphereSpeed * 0.035) * subDt;
              vx[i] += nx * pushStr;
              vy[i] += ny * pushStr;

              if (sphereSpeed > 2.0) {
                const sweepStr = sphereSpeed * 0.0025 * falloff * subDt * 60;
                vx[i] += sphereVx * sweepStr;
                vy[i] += sphereVy * sweepStr;
              }
            }
          }
        }
      }

      for (let i = 0; i < N; i++) {
        jellyVelX[i] += (jellyTargetX[i] - jellyScaleX[i]) * JELLY_SPRING * dt;
        jellyVelY[i] += (jellyTargetY[i] - jellyScaleY[i]) * JELLY_SPRING * dt;
        jellyVelZ[i] += (jellyTargetZ[i] - jellyScaleZ[i]) * JELLY_SPRING * dt;

        const decay = Math.exp(-JELLY_DAMPING * dt);
        jellyVelX[i] *= decay;
        jellyVelY[i] *= decay;
        jellyVelZ[i] *= decay;

        jellyScaleX[i] += jellyVelX[i] * dt;
        jellyScaleY[i] += jellyVelY[i] * dt;
        jellyScaleZ[i] += jellyVelZ[i] * dt;

        const recover = 1 - Math.exp(-2.5 * dt);
        jellyTargetX[i] += (1 - jellyTargetX[i]) * recover;
        jellyTargetY[i] += (1 - jellyTargetY[i]) * recover;
        jellyTargetZ[i] += (1 - jellyTargetZ[i]) * recover;
      }

      for (let i = 0; i < N; i++) {
        if (!spawned[i]) {
          meshes[i].position.set(px[i], py[i], pz[i]);
          continue;
        }

        const zFloat = Math.sin(time * floatSpeedZ[i] + floatPhaseZ[i]) * 0.12;
        meshes[i].position.set(px[i], py[i], pz[i] + zFloat);

        const breath = 1 + Math.sin(time * 0.5 + breathPhase[i]) * 0.004;
        meshes[i].scale.set(
          jellyScaleX[i] * breath,
          jellyScaleY[i] * breath,
          jellyScaleZ[i] * breath
        );

        const speed = Math.sqrt(vx[i] * vx[i] + vy[i] * vy[i]);
        const targetRotVelX = baseRotX[i] + vy[i] * 0.12;
        const targetRotVelY = baseRotY[i] - vx[i] * 0.12;
        const rLerp = 1 - Math.exp(-5 * dt);
        rotVelX[i] += (targetRotVelX - rotVelX[i]) * rLerp;
        rotVelY[i] += (targetRotVelY - rotVelY[i]) * rLerp;

        const speedMult = 1 + Math.min(speed * 0.05, 1.0) * 8.0;
        innerGroups[i].rotation.x += rotVelX[i] * dt * speedMult;
        innerGroups[i].rotation.y += rotVelY[i] * dt * speedMult;
        innerGroups[i].rotation.z += baseRotZ[i] * dt;

        let targetHover = 0;
        if (mouseActive && sphereX > -999) {
          const hDx = px[i] - sphereX;
          const hDy = py[i] - sphereY;
          const hDist = Math.sqrt(hDx * hDx + hDy * hDy);
          if (hDist < CURSOR_FIELD_R * 0.6) {
            targetHover = 1 - hDist / (CURSOR_FIELD_R * 0.6);
          }
        }
        hoverAmount[i] += (targetHover - hoverAmount[i]) * (1 - Math.exp(-4 * dt));
        cubeMaterials[i].uniforms.uHover.value = hoverAmount[i];
        shellMaterials[i].uniforms.uHover.value = hoverAmount[i];
      }

      renderer.render(scene, camera);
    };

    const handleVisibility = () => {
      hidden = document.hidden;
      if (!hidden && !animating) {
        animating = true;
        clock.getDelta(); // discard accumulated delta while hidden
        animId = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    animating = true;
    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

    };
    window.addEventListener("resize", handleResize);

    return () => {
      visObserver.disconnect();
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animId);

      loadedTextures.forEach((t) => t.dispose());
      geoCache.forEach(([g1, g2]) => {
        g1.dispose();
        g2.dispose();
      });
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
