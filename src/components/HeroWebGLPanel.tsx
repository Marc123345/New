import { useEffect, useRef } from "react";
import * as THREE from "three";
import { brandLogos } from "../lib/brandLogos";

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
const ATTRACTOR_BASE = 1.8;
const ATTRACTOR_SCALE = 0.14;
const RESTITUTION = 0.82;
const DAMPING_PER_60 = 0.994;
const CURSOR_CONTACT_R = 2.8;
const CURSOR_FIELD_R = 6.5;
const CURSOR_FIELD_STR = 22.0;
const MAX_SPEED_SQ = 11.0 * 11.0;
const MICRO_IMPULSE = 1.4;
const MICRO_INT_MIN = 0.3;
const MICRO_INT_RNG = 0.5;

const CUBE_VERT = `
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vec4 vp = viewMatrix * wp;
  vViewDir = normalize(-vp.xyz);
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * vp;
}`;

const CUBE_FRAG = `
uniform sampler2D uMap;
uniform vec3 uRimColor;
uniform float uRimStr;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec2 vUv;
void main() {
  vec4 tex = texture2D(uMap, vUv);
  float fr = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.2);
  vec3 rim = uRimColor * fr * uRimStr;
  vec3 L = normalize(vec3(0.6, 0.8, 1.0));
  float diff = max(dot(vNormal, L), 0.0);
  vec3 H = normalize(L + vViewDir);
  float spec = pow(max(dot(vNormal, H), 0.0), 90.0);
  gl_FragColor = vec4(tex.rgb * (0.6 + diff * 0.4) + spec * 0.85 + rim, 1.0);
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
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  float fr = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 3.0);
  gl_FragColor = vec4(uColor * fr, fr * 0.5);
}`;

const SHELL_COLORS = [
  new THREE.Color(0x88ccff), new THREE.Color(0xffd0a0),
  new THREE.Color(0xaaffcc), new THREE.Color(0xffaacc),
  new THREE.Color(0xccddff), new THREE.Color(0xffeebb),
];

export function HeroWebGLPanel() {
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

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Shared geometries - one per unique size to avoid redundant GPU uploads
    const geoCache = new Map<number, [THREE.BoxGeometry, THREE.BoxGeometry]>();
    const getGeos = (r: number) => {
      const key = Math.round(r * 10);
      if (!geoCache.has(key)) {
        const s = r * 2;
        geoCache.set(key, [new THREE.BoxGeometry(s, s, s), new THREE.BoxGeometry(s * 1.07, s * 1.07, s * 1.07)]);
      }
      return geoCache.get(key)!;
    };

    // Flat typed arrays for all physics state - eliminates per-frame GC from THREE.Vector3
    const px = new Float32Array(N);   // position x
    const py = new Float32Array(N);   // position y
    const pz = new Float32Array(N);   // position z
    const vx = new Float32Array(N);   // velocity x
    const vy = new Float32Array(N);   // velocity y
    const vz = new Float32Array(N);   // velocity z
    const radii = new Float32Array(RADII);
    const masses = new Float32Array(N);
    const sqX = new Float32Array(N).fill(1);  // squish x
    const sqY = new Float32Array(N).fill(1);  // squish y
    const rotX = new Float32Array(N); // rotation speeds
    const rotY = new Float32Array(N);
    const rotZ = new Float32Array(N);
    const nextImpulse = new Float32Array(N);
    const spawned = new Uint8Array(N);
    const spawnStart = new Float32Array(N);

    const meshes: THREE.Group[] = [];
    const innerGroups: THREE.Group[] = [];
    const loadedTextures: THREE.Texture[] = [];
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");

    for (let i = 0; i < N; i++) {
      const r = radii[i];
      masses[i] = r * r;
      rotX[i] = (Math.random() - 0.5) * 0.7;
      rotY[i] = (Math.random() - 0.5) * 0.7;
      rotZ[i] = (Math.random() - 0.5) * 0.3;
      nextImpulse[i] = Math.random() * MICRO_INT_RNG;
      spawnStart[i] = i * 0.06;

      const angle = (i / N) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const dist = 0.55 + Math.random() * 0.4;
      px[i] = Math.cos(angle) * BOUNDS_X * dist;
      py[i] = Math.sin(angle) * BOUNDS_Y * dist;
      pz[i] = (Math.random() - 0.5) * 2.5;

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

      // Single shared material per cube (not 6 separate ones)
      const cubeMat = new THREE.ShaderMaterial({
        vertexShader: CUBE_VERT,
        fragmentShader: CUBE_FRAG,
        uniforms: { uMap: { value: tex }, uRimColor: { value: rimColor }, uRimStr: { value: 1.4 } },
      });
      inner.add(new THREE.Mesh(cubeGeo, cubeMat));

      const shellMat = new THREE.ShaderMaterial({
        vertexShader: SHELL_VERT,
        fragmentShader: SHELL_FRAG,
        uniforms: { uColor: { value: rimColor } },
        transparent: true, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
      });
      inner.add(new THREE.Mesh(shellGeo, shellMat));
    }

    // Cursor state
    let cx3d = -9999, cy3d = -9999;
    let prevCx = -9999, prevCy = -9999;
    let cvx = 0, cvy = 0;
    let mouseActive = false;
    let mouseSmoothX = -999, mouseSmoothY = -999;
    const rawMouseX = { v: -999 }, rawMouseY = { v: -999 };

    const raycaster = new THREE.Raycaster();
    const mouse2D = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hitPt = new THREE.Vector3();

    const updateMouse = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      mouse2D.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse2D.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse2D, camera);
      raycaster.ray.intersectPlane(plane, hitPt);
      rawMouseX.v = hitPt.x;
      rawMouseY.v = hitPt.y;
      mouseSmoothX = mouse2D.x;
      mouseSmoothY = mouse2D.y;
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

      // Smooth cursor tracking
      if (mouseActive) {
        cx3d += (rawMouseX.v - cx3d) * 0.14;
        cy3d += (rawMouseY.v - cy3d) * 0.14;
      }
      const newCvx = (cx3d - prevCx) / Math.max(dt, 0.008);
      const newCvy = (cy3d - prevCy) / Math.max(dt, 0.008);
      cvx = newCvx;
      cvy = newCvy;
      prevCx = cx3d;
      prevCy = cy3d;

      // Group tilt
      const targetTiltX = mouseActive ? mouseSmoothX * 0.05 : 0;
      const targetTiltY = mouseActive ? -mouseSmoothY * 0.04 : 0;
      tiltX += (targetTiltX - tiltX) * 0.03;
      tiltY += (targetTiltY - tiltY) * 0.03;
      mainGroup.rotation.y = tiltX;
      mainGroup.rotation.x = tiltY;

      // Fewer substeps when idle - saves CPU when no cursor interaction
      const SUB = mouseActive ? 8 : 4;
      const subDt = dt / SUB;
      const dampFactor = Math.pow(DAMPING_PER_60, subDt * 60);

      // Spawn animation (replaces separate RAF per object)
      for (let i = 0; i < N; i++) {
        if (spawned[i]) continue;
        const elapsed = time - spawnStart[i];
        if (elapsed < 0) continue;
        const t = Math.min(elapsed / 1.0, 1);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const s = ease * (1 + 0.1 * Math.sin(elapsed * 10) * Math.max(0, 1 - t * 1.8));
        meshes[i].scale.setScalar(Math.min(s, 1));
        if (t >= 1) {
          meshes[i].scale.setScalar(1);
          spawned[i] = 1;
        }
      }

      // Physics substeps
      for (let s = 0; s < SUB; s++) {

        // Forces + integrate
        for (let i = 0; i < N; i++) {
          const ix = px[i], iy = py[i];

          // Attractor toward center - strength grows with distance
          const distSq = ix * ix + iy * iy;
          const dist = Math.sqrt(distSq);
          const aM = (ATTRACTOR_BASE + dist * ATTRACTOR_SCALE) * subDt;
          vx[i] -= ix * aM;
          vy[i] -= iy * aM + 0.05 * subDt;

          // Damping
          vx[i] *= dampFactor;
          vy[i] *= dampFactor;

          // Speed cap (squared comparison - no sqrt needed)
          const spd2 = vx[i] * vx[i] + vy[i] * vy[i];
          if (spd2 > MAX_SPEED_SQ) {
            const sc = Math.sqrt(MAX_SPEED_SQ / spd2);
            vx[i] *= sc;
            vy[i] *= sc;
          }

          px[i] += vx[i] * subDt;
          py[i] += vy[i] * subDt;
          pz[i] += vz[i] * subDt;

          // Wall bounds
          const r = radii[i];
          const mX = BOUNDS_X - r, mY = BOUNDS_Y - r;
          if (px[i] > mX) { px[i] = mX; vx[i] = -Math.abs(vx[i]) * RESTITUTION; const a = Math.abs(vx[i]); sqX[i] = 1 - a * 0.06; sqY[i] = 1 + a * 0.06; }
          else if (px[i] < -mX) { px[i] = -mX; vx[i] = Math.abs(vx[i]) * RESTITUTION; const a = Math.abs(vx[i]); sqX[i] = 1 - a * 0.06; sqY[i] = 1 + a * 0.06; }
          if (py[i] > mY) { py[i] = mY; vy[i] = -Math.abs(vy[i]) * RESTITUTION; const a = Math.abs(vy[i]); sqX[i] = 1 + a * 0.06; sqY[i] = 1 - a * 0.06; }
          else if (py[i] < -mY) { py[i] = -mY; vy[i] = Math.abs(vy[i]) * RESTITUTION; const a = Math.abs(vy[i]); sqX[i] = 1 + a * 0.06; sqY[i] = 1 - a * 0.06; }
          if (pz[i] > 1.5) { pz[i] = 1.5; vz[i] = -Math.abs(vz[i]) * RESTITUTION; }
          else if (pz[i] < -1.5) { pz[i] = -1.5; vz[i] = Math.abs(vz[i]) * RESTITUTION; }
        }

        // Object-object collisions (O(n²) but n is small ~18)
        for (let i = 0; i < N; i++) {
          for (let j = i + 1; j < N; j++) {
            const dx = px[j] - px[i];
            const dy = py[j] - py[i];
            const dz = pz[j] - pz[i];
            const distSq = dx * dx + dy * dy + dz * dz;
            const minD = radii[i] + radii[j];
            if (distSq >= minD * minD || distSq < 0.0001) continue;

            const dist = Math.sqrt(distSq);
            const nx = dx / dist, ny = dy / dist, nz = dz / dist;
            const overlap = minD - dist;
            const mA = masses[i], mB = masses[j], mT = mA + mB;

            px[i] -= nx * overlap * (mB / mT);
            py[i] -= ny * overlap * (mB / mT);
            pz[i] -= nz * overlap * (mB / mT);
            px[j] += nx * overlap * (mA / mT);
            py[j] += ny * overlap * (mA / mT);
            pz[j] += nz * overlap * (mA / mT);

            const rvn = (vx[i] - vx[j]) * nx + (vy[i] - vy[j]) * ny + (vz[i] - vz[j]) * nz;
            if (rvn > 0) continue;
            const imp = (-(1 + RESTITUTION) * rvn) / mT;
            vx[i] += nx * imp * mB; vy[i] += ny * imp * mB; vz[i] += nz * imp * mB;
            vx[j] -= nx * imp * mA; vy[j] -= ny * imp * mA; vz[j] -= nz * imp * mA;

            const impact = Math.abs(rvn);
            if (impact > 0.1) {
              const amt = Math.min(impact * 0.075, 0.45);
              sqX[i] = 1 + Math.abs(ny) * amt - Math.abs(nx) * amt * 0.6;
              sqY[i] = 1 + Math.abs(nx) * amt - Math.abs(ny) * amt * 0.6;
              sqX[j] = 1 + Math.abs(ny) * amt - Math.abs(nx) * amt * 0.6;
              sqY[j] = 1 + Math.abs(nx) * amt - Math.abs(ny) * amt * 0.6;
            }
          }
        }

        // Cursor force: soft field + hard contact
        if (mouseActive && cx3d > -999) {
          for (let i = 0; i < N; i++) {
            const dx = px[i] - cx3d;
            const dy = py[i] - cy3d;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);

            if (dist < CURSOR_FIELD_R && dist > 0.01) {
              const t = 1 - dist / CURSOR_FIELD_R;
              const fM = t * t * t * CURSOR_FIELD_STR * subDt;
              const nx = dx / dist, ny = dy / dist;
              vx[i] += nx * fM;
              vy[i] += ny * fM;

              const contactMin = radii[i] + CURSOR_CONTACT_R;
              if (dist < contactMin) {
                const nx2 = dx / dist, ny2 = dy / dist;
                const overlap = contactMin - dist;
                px[i] += nx2 * overlap * 1.05;
                py[i] += ny2 * overlap * 1.05;

                const cSpd = Math.sqrt(cvx * cvx + cvy * cvy);
                const boost = Math.min(cSpd * 0.7 + 1.5, 5.0);
                const rvn = (vx[i] - cvx * subDt) * nx2 + (vy[i] - cvy * subDt) * ny2;
                const imp = Math.max(-(1 + RESTITUTION) * rvn, 1.5) * boost;
                vx[i] += nx2 * imp;
                vy[i] += ny2 * imp;

                const amt = Math.min(Math.abs(imp) * 0.03, 0.45);
                sqX[i] = 1 + Math.abs(ny2) * amt - Math.abs(nx2) * amt * 0.6;
                sqY[i] = 1 + Math.abs(nx2) * amt - Math.abs(ny2) * amt * 0.6;
              }
            }
          }
        }
      }

      // Micro-impulses outside substeps (once per frame per object)
      for (let i = 0; i < N; i++) {
        if (!spawned[i]) continue;
        if (time >= nextImpulse[i]) {
          const angle = Math.random() * 6.2832;
          vx[i] += Math.cos(angle) * MICRO_IMPULSE;
          vy[i] += Math.sin(angle) * MICRO_IMPULSE;
          nextImpulse[i] = time + MICRO_INT_MIN + Math.random() * MICRO_INT_RNG;
        }
      }

      // Visual sync - batch all mesh updates together
      const sqLerp = 1 - Math.pow(0.06, dt);
      for (let i = 0; i < N; i++) {
        meshes[i].position.set(px[i], py[i], pz[i]);

        if (spawned[i]) {
          sqX[i] += (1 - sqX[i]) * sqLerp;
          sqY[i] += (1 - sqY[i]) * sqLerp;
          meshes[i].scale.set(sqX[i], sqY[i], 2 - (sqX[i] + sqY[i]) * 0.5);
        }

        const speed = Math.sqrt(vx[i] * vx[i] + vy[i] * vy[i]);
        const spin = dt * (1 + speed * 0.45);
        innerGroups[i].rotation.x += rotX[i] * spin;
        innerGroups[i].rotation.y += rotY[i] * spin;
        innerGroups[i].rotation.z += rotZ[i] * spin;
      }

      renderer.render(scene, camera);
    };
    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animId);

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
