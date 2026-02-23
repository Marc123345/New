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

// --- Lusion-style physics constants ---
const BOUNDS_X = 13;
const BOUNDS_Y = 9;
// Centralized gravity - pulls objects toward center at all times
const GRAVITY_STRENGTH = 0.55;
// How much stronger gravity gets with distance (exponential pull)
const GRAVITY_DISTANCE_SCALE = 0.048;
// Buoyant, lofty restitution - high so objects bounce off each other energetically
const RESTITUTION = 0.78;
// Mild friction so objects slow gently but never stop
const FRICTION = 0.988;
// Cursor repulsion sphere size
const CURSOR_RADIUS = 3.2;
// Random micro-impulse magnitude applied each second per object
const MICRO_IMPULSE = 0.9;
// Interval between micro-impulses (seconds)
const MICRO_IMPULSE_INTERVAL = 0.65;
// Max velocity cap
const MAX_SPEED = 9.0;

interface PhysicsBall {
  mesh: THREE.Group;
  innerGroup: THREE.Group;
  velocity: THREE.Vector3;
  position: THREE.Vector3;
  radius: number;
  mass: number;
  squishX: number;
  squishY: number;
  spawned: boolean;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  nextImpulseTime: number;
}

const CUBE_VERT = `
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vec4 viewPos = viewMatrix * worldPos;
  vViewDir = normalize(-viewPos.xyz);
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * viewPos;
}
`;

const CUBE_FRAG = `
uniform sampler2D uMap;
uniform float uFresnelPower;
uniform vec3 uRimColor;
uniform float uRimStrength;
uniform float uGlossiness;

varying vec3 vNormal;
varying vec3 vViewDir;
varying vec2 vUv;

void main() {
  vec4 texColor = texture2D(uMap, vUv);

  float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), uFresnelPower);
  vec3 rimGlow = uRimColor * fresnel * uRimStrength;

  vec3 lightDir = normalize(vec3(0.6, 0.8, 1.0));
  float diff = max(dot(vNormal, lightDir), 0.0);
  vec3 halfVec = normalize(lightDir + vViewDir);
  float spec = pow(max(dot(vNormal, halfVec), 0.0), uGlossiness);

  vec3 col = texColor.rgb * (0.6 + diff * 0.4) + vec3(spec * 0.85) + rimGlow;

  gl_FragColor = vec4(col, 1.0);
}
`;

const EDGE_VERT = `
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vec4 viewPos = viewMatrix * worldPos;
  vViewDir = normalize(-viewPos.xyz);
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * viewPos;
}
`;

const EDGE_FRAG = `
uniform vec3 uShellColor;
uniform float uFresnelPower;
uniform float uOpacity;

varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), uFresnelPower);
  float alpha = fresnel * uOpacity;
  gl_FragColor = vec4(uShellColor * fresnel, alpha);
}
`;

export function HeroWebGLPanel() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.set(0, 0, 35);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const objects: PhysicsBall[] = [];
    const loadedTextures: THREE.Texture[] = [];
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");

    const SHELL_COLORS = [
      new THREE.Color(0x88ccff),
      new THREE.Color(0xffd0a0),
      new THREE.Color(0xaaffcc),
      new THREE.Color(0xffaacc),
      new THREE.Color(0xccddff),
      new THREE.Color(0xffeebb),
    ];

    const createBall = (url: string, radius: number, index: number, total: number) => {
      const group = new THREE.Group();
      const innerGroup = new THREE.Group();
      group.add(innerGroup);

      const texture = textureLoader.load(url, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        tex.needsUpdate = true;
      }, undefined, () => {});
      loadedTextures.push(texture);

      const rimColor = SHELL_COLORS[index % SHELL_COLORS.length];
      const side = radius * 2;
      const cubeGeo = new THREE.BoxGeometry(side, side, side);

      const faceMats = Array.from({ length: 6 }, () => new THREE.ShaderMaterial({
        vertexShader: CUBE_VERT,
        fragmentShader: CUBE_FRAG,
        uniforms: {
          uMap: { value: texture },
          uFresnelPower: { value: 2.2 },
          uRimColor: { value: rimColor },
          uRimStrength: { value: 1.4 },
          uGlossiness: { value: 90.0 },
        },
      }));

      const cube = new THREE.Mesh(cubeGeo, faceMats);
      innerGroup.add(cube);

      const shellGeo = new THREE.BoxGeometry(side * 1.07, side * 1.07, side * 1.07);
      const shellMat = new THREE.ShaderMaterial({
        vertexShader: EDGE_VERT,
        fragmentShader: EDGE_FRAG,
        uniforms: {
          uShellColor: { value: rimColor },
          uFresnelPower: { value: 3.0 },
          uOpacity: { value: 0.5 },
        },
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const shell = new THREE.Mesh(shellGeo, shellMat);
      innerGroup.add(shell);

      innerGroup.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      // Spawn spread around the bounds edges so they all fall toward center
      const angle = (index / total) * Math.PI * 2;
      const spreadR = 0.5 + Math.random() * 0.45;
      const x = Math.cos(angle) * BOUNDS_X * spreadR;
      const y = Math.sin(angle) * BOUNDS_Y * spreadR;
      const z = (Math.random() - 0.5) * 2;

      group.position.set(x, y, z);
      group.scale.set(0, 0, 0);
      mainGroup.add(group);

      // Initial velocity pointing vaguely toward center for the first cluster
      const toCenterX = -x * 0.03;
      const toCenterY = -y * 0.03;

      objects.push({
        mesh: group,
        innerGroup,
        velocity: new THREE.Vector3(
          toCenterX + (Math.random() - 0.5) * 0.5,
          toCenterY + (Math.random() - 0.5) * 0.5,
          0
        ),
        position: new THREE.Vector3(x, y, z),
        radius,
        mass: radius * radius,
        squishX: 1,
        squishY: 1,
        spawned: false,
        rotSpeedX: (Math.random() - 0.5) * 0.8,
        rotSpeedY: (Math.random() - 0.5) * 0.8,
        rotSpeedZ: (Math.random() - 0.5) * 0.35,
        nextImpulseTime: Math.random() * MICRO_IMPULSE_INTERVAL,
      });

      const thisObj = objects[objects.length - 1];
      const delay = 0.055 * index;
      const startTime = performance.now() + delay * 1000;
      const springIn = () => {
        const elapsed = (performance.now() - startTime) / 1000;
        if (elapsed < 0) { requestAnimationFrame(springIn); return; }
        const t = Math.min(elapsed / 1.1, 1);
        const ease = t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const v = ease * (1 + 0.08 * Math.sin(elapsed * 8) * Math.max(0, 1 - t * 2));
        group.scale.setScalar(v);
        if (t < 1) {
          requestAnimationFrame(springIn);
        } else {
          group.scale.setScalar(1);
          thisObj.spawned = true;
        }
      };
      requestAnimationFrame(springIn);
    };

    const totalTokens = PEOPLE_IMAGES.length + brandLogos.length;
    PEOPLE_IMAGES.forEach((url, i) => createBall(url, 2.8, i, totalTokens));
    brandLogos.forEach((url, i) => createBall(url, 2.2, i + PEOPLE_IMAGES.length, totalTokens));

    const mouse = new THREE.Vector2(-999, -999);
    const smoothMouse = new THREE.Vector2(-999, -999);
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mouse3D = new THREE.Vector3();
    const smoothMouse3D = new THREE.Vector3(-999, -999, 0);
    const prevSmooth3D = new THREE.Vector3(-999, -999, 0);
    const cursorVelocity = new THREE.Vector3();

    let mouseActive = false;

    const updateMouse = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, mouse3D);
      mouseActive = true;
    };

    const handleMouseMove = (e: MouseEvent) => updateMouse(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      updateMouse(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleMouseLeave = () => { mouseActive = false; };

    window.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave);

    const tmpN = new THREE.Vector3();
    const tmpRelVel = new THREE.Vector3();

    const applySquish = (obj: PhysicsBall, nx: number, ny: number, impulseStrength: number) => {
      const amount = Math.min(impulseStrength * 0.07, 0.38);
      obj.squishX = 1 + Math.abs(ny) * amount - Math.abs(nx) * amount * 0.55;
      obj.squishY = 1 + Math.abs(nx) * amount - Math.abs(ny) * amount * 0.55;
    };

    const resolveCollision = (a: PhysicsBall, b: PhysicsBall) => {
      const dx = b.position.x - a.position.x;
      const dy = b.position.y - a.position.y;
      const dz = b.position.z - a.position.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const minDist = a.radius + b.radius;
      if (dist >= minDist || dist < 0.001) return;

      const nx = dx / dist;
      const ny = dy / dist;
      const nz = dz / dist;
      const overlap = minDist - dist;
      const totalMass = a.mass + b.mass;

      a.position.x -= nx * overlap * (b.mass / totalMass);
      a.position.y -= ny * overlap * (b.mass / totalMass);
      a.position.z -= nz * overlap * (b.mass / totalMass);
      b.position.x += nx * overlap * (a.mass / totalMass);
      b.position.y += ny * overlap * (a.mass / totalMass);
      b.position.z += nz * overlap * (a.mass / totalMass);

      tmpN.set(nx, ny, nz);
      tmpRelVel.set(
        a.velocity.x - b.velocity.x,
        a.velocity.y - b.velocity.y,
        a.velocity.z - b.velocity.z
      );
      const relVelAlongN = tmpRelVel.dot(tmpN);
      if (relVelAlongN > 0) return;

      const impulse = (-(1 + RESTITUTION) * relVelAlongN) / totalMass;
      a.velocity.x += nx * impulse * b.mass;
      a.velocity.y += ny * impulse * b.mass;
      a.velocity.z += nz * impulse * b.mass;
      b.velocity.x -= nx * impulse * a.mass;
      b.velocity.y -= ny * impulse * a.mass;
      b.velocity.z -= nz * impulse * a.mass;

      const impactStrength = Math.abs(relVelAlongN);
      if (impactStrength > 0.15) {
        applySquish(a, nx, ny, impactStrength);
        applySquish(b, -nx, -ny, impactStrength);
      }
    };

    // Cursor pushes objects away; when cursor leaves, gravity naturally pulls them back to center
    const resolveCursorCollision = (obj: PhysicsBall, cursorX: number, cursorY: number, cursorVelX: number, cursorVelY: number) => {
      const dx = obj.position.x - cursorX;
      const dy = obj.position.y - cursorY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = obj.radius + CURSOR_RADIUS;
      if (dist >= minDist || dist < 0.001) return;

      const nx = dx / dist;
      const ny = dy / dist;
      const overlap = minDist - dist;

      obj.position.x += nx * overlap * 1.05;
      obj.position.y += ny * overlap * 1.05;

      const cursorSpeed = Math.sqrt(cursorVelX * cursorVelX + cursorVelY * cursorVelY);
      const cursorBoost = Math.min(cursorSpeed * 0.6 + 1.2, 4.0);

      const relVelX = obj.velocity.x - cursorVelX;
      const relVelY = obj.velocity.y - cursorVelY;
      const relVelAlongN = relVelX * nx + relVelY * ny;

      // Always apply at least a base push even for slow cursors
      const baseImpulse = Math.max(-(1 + RESTITUTION) * relVelAlongN, 1.2);
      const impulse = baseImpulse * cursorBoost;

      obj.velocity.x += nx * impulse;
      obj.velocity.y += ny * impulse;

      applySquish(obj, nx, ny, Math.abs(impulse) * 0.5);
    };

    const clock = new THREE.Clock();
    let animId: number;
    const groupTilt = new THREE.Vector2();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const rawDelta = clock.getDelta();
      const delta = Math.min(rawDelta, 0.05);
      const time = clock.elapsedTime;

      smoothMouse.lerp(mouse, 0.06);

      prevSmooth3D.copy(smoothMouse3D);
      if (mouseActive) {
        smoothMouse3D.lerp(mouse3D, 0.12);
      }
      cursorVelocity.subVectors(smoothMouse3D, prevSmooth3D).divideScalar(Math.max(delta, 0.008));

      groupTilt.x = THREE.MathUtils.lerp(groupTilt.x, smoothMouse.x * 0.06, 0.035);
      groupTilt.y = THREE.MathUtils.lerp(groupTilt.y, -smoothMouse.y * 0.045, 0.035);
      mainGroup.rotation.y = groupTilt.x;
      mainGroup.rotation.x = groupTilt.y;

      const SUB = 6;
      const subDelta = delta / SUB;

      const cVelX = cursorVelocity.x;
      const cVelY = cursorVelocity.y;

      for (let s = 0; s < SUB; s++) {
        for (let i = 0; i < objects.length; i++) {
          const obj = objects[i];

          // --- Lusion-style centralized gravity ---
          // Pull toward center; strength increases with distance from center
          const cx = obj.position.x;
          const cy = obj.position.y;
          const distCenter = Math.sqrt(cx * cx + cy * cy);
          const gravityMag = GRAVITY_STRENGTH + distCenter * GRAVITY_DISTANCE_SCALE;
          obj.velocity.x -= cx * gravityMag * subDelta;
          obj.velocity.y -= cy * gravityMag * subDelta;

          // Very slight downward bias for organic feel
          obj.velocity.y -= 0.04 * subDelta;

          // Friction - mild damping so objects keep lofty buoyant motion
          obj.velocity.multiplyScalar(Math.pow(FRICTION, subDelta * 60));

          // Clamp speed
          const spd = Math.sqrt(obj.velocity.x * obj.velocity.x + obj.velocity.y * obj.velocity.y);
          if (spd > MAX_SPEED) {
            const sc = MAX_SPEED / spd;
            obj.velocity.x *= sc;
            obj.velocity.y *= sc;
          }

          obj.position.x += obj.velocity.x * subDelta;
          obj.position.y += obj.velocity.y * subDelta;
          obj.position.z += obj.velocity.z * subDelta;

          // Soft boundary - push back but with high restitution for bouncy feel
          const maxBX = BOUNDS_X - obj.radius;
          const maxBY = BOUNDS_Y - obj.radius;
          const maxBZ = 1.4;
          if (obj.position.x > maxBX) {
            obj.position.x = maxBX;
            obj.velocity.x = -Math.abs(obj.velocity.x) * RESTITUTION;
            applySquish(obj, 1, 0, Math.abs(obj.velocity.x));
          } else if (obj.position.x < -maxBX) {
            obj.position.x = -maxBX;
            obj.velocity.x = Math.abs(obj.velocity.x) * RESTITUTION;
            applySquish(obj, 1, 0, Math.abs(obj.velocity.x));
          }
          if (obj.position.y > maxBY) {
            obj.position.y = maxBY;
            obj.velocity.y = -Math.abs(obj.velocity.y) * RESTITUTION;
            applySquish(obj, 0, 1, Math.abs(obj.velocity.y));
          } else if (obj.position.y < -maxBY) {
            obj.position.y = -maxBY;
            obj.velocity.y = Math.abs(obj.velocity.y) * RESTITUTION;
            applySquish(obj, 0, 1, Math.abs(obj.velocity.y));
          }
          if (Math.abs(obj.position.z) > maxBZ) {
            obj.position.z = Math.sign(obj.position.z) * maxBZ;
            obj.velocity.z = -obj.velocity.z * RESTITUTION;
          }
        }

        for (let i = 0; i < objects.length; i++) {
          for (let j = i + 1; j < objects.length; j++) {
            resolveCollision(objects[i], objects[j]);
          }
        }

        if (mouseActive) {
          for (let i = 0; i < objects.length; i++) {
            resolveCursorCollision(objects[i], smoothMouse3D.x, smoothMouse3D.y, cVelX * subDelta, cVelY * subDelta);
          }
        }
      }

      // --- Continuous micro-impulses: keep cluster perpetually shifting and jostling ---
      for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        if (!obj.spawned) continue;
        if (time >= obj.nextImpulseTime) {
          const impulseAngle = Math.random() * Math.PI * 2;
          obj.velocity.x += Math.cos(impulseAngle) * MICRO_IMPULSE;
          obj.velocity.y += Math.sin(impulseAngle) * MICRO_IMPULSE;
          obj.nextImpulseTime = time + MICRO_IMPULSE_INTERVAL * (0.6 + Math.random() * 0.8);
        }
      }

      // Squish recovery
      const squishRecovery = Math.pow(0.08, delta);
      for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        obj.mesh.position.set(obj.position.x, obj.position.y, obj.position.z);

        if (obj.spawned) {
          obj.squishX += (1 - obj.squishX) * (1 - squishRecovery);
          obj.squishY += (1 - obj.squishY) * (1 - squishRecovery);
          const squishZ = 2 - (obj.squishX + obj.squishY) * 0.5;
          obj.mesh.scale.set(obj.squishX, obj.squishY, squishZ);
        }

        const speed = obj.velocity.length();
        const spinBoost = 1 + speed * 0.5;
        obj.innerGroup.rotation.x += obj.rotSpeedX * delta * spinBoost;
        obj.innerGroup.rotation.y += obj.rotSpeedY * delta * spinBoost;
        obj.innerGroup.rotation.z += obj.rotSpeedZ * delta * spinBoost;
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
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);

      loadedTextures.forEach((t) => t.dispose());
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            if (m instanceof THREE.ShaderMaterial) {
              m.dispose();
            } else if ((m as THREE.MeshStandardMaterial).map) {
              (m as THREE.MeshStandardMaterial).map!.dispose();
              m.dispose();
            }
          });
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
