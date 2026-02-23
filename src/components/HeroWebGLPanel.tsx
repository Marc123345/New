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

// Physics - tuned to match Lusion's exact feel
const BOUNDS_X = 13;
const BOUNDS_Y = 9;

// Centralized attractor - strong enough to pull objects into a tight cluster
const ATTRACTOR_BASE = 1.8;
// Scales with distance so far-away objects accelerate hard back toward center
const ATTRACTOR_SCALE = 0.14;

// High restitution = lofty, buoyant bounces between objects
const RESTITUTION = 0.82;

// Low damping = objects stay energetic for a long time (lofty feeling)
const DAMPING = 0.994;

// Hard contact radius for cursor collision push
const CURSOR_CONTACT_RADIUS = 2.8;
// Soft field radius - objects feel the cursor before contact (Lusion feel)
const CURSOR_FIELD_RADIUS = 6.5;
// Soft field strength multiplier
const CURSOR_FIELD_STRENGTH = 22.0;

// Max velocity
const MAX_SPEED = 11.0;

// Micro-impulse to keep cluster alive at all times
const MICRO_IMPULSE = 1.4;
const MICRO_INTERVAL_MIN = 0.3;
const MICRO_INTERVAL_MAX = 0.8;

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

      // Spawn from edges so they visibly fall into cluster at start
      const angle = (index / total) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const spawnDist = 0.55 + Math.random() * 0.4;
      const x = Math.cos(angle) * BOUNDS_X * spawnDist;
      const y = Math.sin(angle) * BOUNDS_Y * spawnDist;
      const z = (Math.random() - 0.5) * 2.5;

      group.position.set(x, y, z);
      group.scale.set(0, 0, 0);
      mainGroup.add(group);

      objects.push({
        mesh: group,
        innerGroup,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          0
        ),
        position: new THREE.Vector3(x, y, z),
        radius,
        mass: radius * radius,
        squishX: 1,
        squishY: 1,
        spawned: false,
        rotSpeedX: (Math.random() - 0.5) * 0.7,
        rotSpeedY: (Math.random() - 0.5) * 0.7,
        rotSpeedZ: (Math.random() - 0.5) * 0.3,
        nextImpulseTime: Math.random() * MICRO_INTERVAL_MAX,
      });

      const thisObj = objects[objects.length - 1];
      const delay = 0.06 * index;
      const startTime = performance.now() + delay * 1000;
      const springIn = () => {
        const elapsed = (performance.now() - startTime) / 1000;
        if (elapsed < 0) { requestAnimationFrame(springIn); return; }
        const t = Math.min(elapsed / 1.0, 1);
        const ease = t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const bounce = ease * (1 + 0.1 * Math.sin(elapsed * 10) * Math.max(0, 1 - t * 1.8));
        group.scale.setScalar(bounce);
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
    const smoothMouse3D = new THREE.Vector3(-9999, -9999, 0);
    const prevSmooth3D = new THREE.Vector3(-9999, -9999, 0);
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

    const applySquish = (obj: PhysicsBall, nx: number, ny: number, strength: number) => {
      const amount = Math.min(strength * 0.075, 0.45);
      obj.squishX = 1 + Math.abs(ny) * amount - Math.abs(nx) * amount * 0.6;
      obj.squishY = 1 + Math.abs(nx) * amount - Math.abs(ny) * amount * 0.6;
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

      const impact = Math.abs(relVelAlongN);
      if (impact > 0.1) {
        applySquish(a, nx, ny, impact);
        applySquish(b, -nx, -ny, impact);
      }
    };

    // Lusion cursor: soft radial field + hard contact push
    // Soft field: objects within CURSOR_FIELD_RADIUS feel a smooth inverse-square repulsion
    // This is what gives Lusion that "objects feel you coming" quality before you touch them
    const applyCursorForce = (obj: PhysicsBall, cx: number, cy: number, cvx: number, cvy: number, subDt: number) => {
      const dx = obj.position.x - cx;
      const dy = obj.position.y - cy;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);

      // Soft field: smooth falloff over CURSOR_FIELD_RADIUS
      if (dist < CURSOR_FIELD_RADIUS && dist > 0.01) {
        const t = 1.0 - dist / CURSOR_FIELD_RADIUS;
        // Cubic ease for smooth falloff
        const fieldMag = t * t * t * CURSOR_FIELD_STRENGTH;
        const nx = dx / dist;
        const ny = dy / dist;
        obj.velocity.x += nx * fieldMag * subDt;
        obj.velocity.y += ny * fieldMag * subDt;
      }

      // Hard contact: rigid body push with velocity transfer
      const contactMin = obj.radius + CURSOR_CONTACT_RADIUS;
      if (dist < contactMin && dist > 0.001) {
        const nx = dx / dist;
        const ny = dy / dist;
        const overlap = contactMin - dist;

        // Positional correction
        obj.position.x += nx * overlap * 1.05;
        obj.position.y += ny * overlap * 1.05;

        const cursorSpeed = Math.sqrt(cvx * cvx + cvy * cvy);
        const boost = Math.min(cursorSpeed * 0.7 + 1.5, 5.0);

        const relVx = obj.velocity.x - cvx;
        const relVy = obj.velocity.y - cvy;
        const relVn = relVx * nx + relVy * ny;

        const baseImpulse = Math.max(-(1 + RESTITUTION) * relVn, 1.5);
        const impulse = baseImpulse * boost;

        obj.velocity.x += nx * impulse;
        obj.velocity.y += ny * impulse;

        applySquish(obj, nx, ny, impulse * 0.4);
      }
    };

    const clock = new THREE.Clock();
    let animId: number;
    const groupTilt = new THREE.Vector2();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const rawDelta = clock.getDelta();
      const delta = Math.min(rawDelta, 0.05);
      const time = clock.elapsedTime;

      smoothMouse.lerp(mouse, 0.08);

      prevSmooth3D.copy(smoothMouse3D);
      if (mouseActive) {
        smoothMouse3D.lerp(mouse3D, 0.14);
      }
      cursorVelocity.subVectors(smoothMouse3D, prevSmooth3D).divideScalar(Math.max(delta, 0.008));

      // Subtle group tilt follows mouse
      groupTilt.x = THREE.MathUtils.lerp(groupTilt.x, smoothMouse.x * 0.05, 0.03);
      groupTilt.y = THREE.MathUtils.lerp(groupTilt.y, -smoothMouse.y * 0.04, 0.03);
      mainGroup.rotation.y = groupTilt.x;
      mainGroup.rotation.x = groupTilt.y;

      const SUB = 8;
      const subDelta = delta / SUB;
      const cVelX = cursorVelocity.x;
      const cVelY = cursorVelocity.y;

      for (let s = 0; s < SUB; s++) {
        for (let i = 0; i < objects.length; i++) {
          const obj = objects[i];

          // Centralized attractor force - this is the heart of the Lusion simulation
          // Objects far from center feel much stronger pull (attractor scale with distance)
          const px = obj.position.x;
          const py = obj.position.y;
          const distFromCenter = Math.sqrt(px * px + py * py);
          const attractMag = ATTRACTOR_BASE + distFromCenter * ATTRACTOR_SCALE;
          obj.velocity.x -= px * attractMag * subDelta;
          obj.velocity.y -= py * attractMag * subDelta;

          // Tiny downward bias adds organic asymmetry
          obj.velocity.y -= 0.05 * subDelta;

          // Low damping - preserves lofty buoyant energy
          obj.velocity.multiplyScalar(Math.pow(DAMPING, subDelta * 60));

          // Speed cap
          const spd = Math.sqrt(obj.velocity.x * obj.velocity.x + obj.velocity.y * obj.velocity.y);
          if (spd > MAX_SPEED) {
            const sc = MAX_SPEED / spd;
            obj.velocity.x *= sc;
            obj.velocity.y *= sc;
          }

          obj.position.x += obj.velocity.x * subDelta;
          obj.position.y += obj.velocity.y * subDelta;
          obj.position.z += obj.velocity.z * subDelta;

          // Wall bounces - the attractor makes these rare since objects pull back to center
          const maxBX = BOUNDS_X - obj.radius;
          const maxBY = BOUNDS_Y - obj.radius;
          const maxBZ = 1.5;
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

        // Object-object collisions
        for (let i = 0; i < objects.length; i++) {
          for (let j = i + 1; j < objects.length; j++) {
            resolveCollision(objects[i], objects[j]);
          }
        }

        // Cursor interaction
        if (mouseActive) {
          for (let i = 0; i < objects.length; i++) {
            applyCursorForce(
              objects[i],
              smoothMouse3D.x,
              smoothMouse3D.y,
              cVelX * subDelta,
              cVelY * subDelta,
              subDelta
            );
          }
        }
      }

      // Continuous micro-impulses - keep cluster perpetually jostling (never frozen)
      for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        if (!obj.spawned) continue;
        if (time >= obj.nextImpulseTime) {
          const angle = Math.random() * Math.PI * 2;
          obj.velocity.x += Math.cos(angle) * MICRO_IMPULSE;
          obj.velocity.y += Math.sin(angle) * MICRO_IMPULSE;
          obj.nextImpulseTime = time + MICRO_INTERVAL_MIN + Math.random() * (MICRO_INTERVAL_MAX - MICRO_INTERVAL_MIN);
        }
      }

      // Visual update - squish recovery + rotation
      const squishLerp = 1 - Math.pow(0.06, delta);
      for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        obj.mesh.position.set(obj.position.x, obj.position.y, obj.position.z);

        if (obj.spawned) {
          obj.squishX += (1 - obj.squishX) * squishLerp;
          obj.squishY += (1 - obj.squishY) * squishLerp;
          const squishZ = 2 - (obj.squishX + obj.squishY) * 0.5;
          obj.mesh.scale.set(obj.squishX, obj.squishY, squishZ);
        }

        const speed = obj.velocity.length();
        const spinBoost = 1 + speed * 0.45;
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
