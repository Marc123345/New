import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { brandLogos } from "../lib/brandLogos";

const PEOPLE_IMAGES = [
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
];

interface Block {
  mesh: THREE.Group;
  vel: THREE.Vector2;
  pos: THREE.Vector2;
  w: number;
  h: number;
  targetRotZ: number;
  currentRotZ: number;
  rotVel: number;
  z: number;
  floatPhase: number;
  floatSpeed: number;
  floatAmp: number;
  drift: THREE.Vector2; // Added for continuous zero-gravity motion
}

export function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Fallback safe dimensions
    const initialW = container.clientWidth || window.innerWidth;
    const initialH = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const aspect = initialW / initialH;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.set(0, 0, 38);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(initialW, initialH);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(8, 15, 20);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xd0e8ff, 1.0);
    fillLight.position.set(-12, -8, 10);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfff8f0, 0.5);
    rimLight.position.set(0, 0, -15);
    scene.add(rimLight);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");

    const blocks: Block[] = [];
    const loadedTextures: THREE.Texture[] = [];

    // Fluid physics modifiers
    const RESTITUTION = 0.6; // Softer bounces on collision
    const FRICTION = 0.985; // Simulates drag in fluid
    const REPULSION_RADIUS = 8.0; 
    const REPULSION_STRENGTH = 1.2;

    // Dynamic Bounds based on FOV (Solves Mobile Responsiveness)
    let boundX = 15;
    let boundY = 10;
    const calculateBounds = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const currentAspect = w / h;
      const vFov = (camera.fov * Math.PI) / 180;
      const height = 2 * Math.tan(vFov / 2) * camera.position.z;
      boundX = (height * currentAspect) / 2;
      boundY = height / 2;
    };
    calculateBounds();

    const createBlock = (url: string, w: number, h: number, index: number, total: number) => {
      const group = new THREE.Group();

      const texture = textureLoader.load(
        url,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
          tex.needsUpdate = true;
        }
      );
      loadedTextures.push(texture);

      const depth = 0.22;
      const geo = new THREE.BoxGeometry(w, h, depth, 1, 1, 1);

      const faceMat = new THREE.MeshStandardMaterial({
        map: texture,
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.05,
      });

      const edgeMat = new THREE.MeshStandardMaterial({
        color: 0xf5f5f5,
        roughness: 0.3,
        metalness: 0.1,
      });

      const materials = [edgeMat, edgeMat, edgeMat, edgeMat, faceMat, edgeMat];
      const box = new THREE.Mesh(geo, materials);
      box.castShadow = true;
      box.receiveShadow = true;
      group.add(box);

      const angle = (index / total) * Math.PI * 2 + Math.random() * 0.5;
      const spreadX = boundX * 0.65;
      const spreadY = boundY * 0.65;
      const px = Math.cos(angle) * spreadX * (0.4 + Math.random() * 0.5);
      const py = Math.sin(angle) * spreadY * (0.4 + Math.random() * 0.5);
      const pz = (Math.random() - 0.5) * 4;

      group.position.set(px, py, pz);
      group.scale.set(0, 0, 0);
      mainGroup.add(group);

      const speed = 2.0 + Math.random() * 2;
      const dir = Math.random() * Math.PI * 2;
      const vx = Math.cos(dir) * speed;
      const vy = Math.sin(dir) * speed;

      blocks.push({
        mesh: group,
        vel: new THREE.Vector2(vx, vy),
        pos: new THREE.Vector2(px, py),
        w,
        h,
        targetRotZ: 0,
        currentRotZ: (Math.random() - 0.5) * 0.3,
        rotVel: 0,
        z: pz,
        floatPhase: Math.random() * Math.PI * 2,
        floatSpeed: 0.3 + Math.random() * 0.4,
        floatAmp: 0.06 + Math.random() * 0.1,
        drift: new THREE.Vector2((Math.random() - 0.5) * 0.03, (Math.random() - 0.5) * 0.03)
      });

      gsap.to(group.scale, {
        x: 1, y: 1, z: 1,
        duration: 0.9,
        delay: 0.07 * index,
        ease: "back.out(1.7)",
      });
    };

    const totalBlocks = PEOPLE_IMAGES.length + brandLogos.length;

    PEOPLE_IMAGES.forEach((url, i) => {
      const isPortrait = i % 3 !== 0;
      const w = isPortrait ? 3.5 : 4.2;
      const h = isPortrait ? 4.8 : 3.2;
      createBlock(url, w, h, i, totalBlocks);
    });

    brandLogos.forEach((url, i) => {
      const s = 2.8 + Math.random() * 0.8;
      createBlock(url, s, s, i + PEOPLE_IMAGES.length, totalBlocks);
    });

    const mouse = new THREE.Vector2();
    const targetMouse = new THREE.Vector2();
    const springPos = new THREE.Vector2();
    const springVel = new THREE.Vector2();
    const SPRING_K = 120;
    const SPRING_DAMP = 14;

    let hoveredBlock: Block | null = null;
    let draggedBlock: Block | null = null;
    let mouseActive = false;

    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mouse3D = new THREE.Vector3();

    const updateMouse = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, mouse3D);
      mouseActive = true;
    };

    const findHit = (): Block | null => {
      const hits = raycaster.intersectObjects(mainGroup.children, true);
      const hit = hits[0];
      if (!hit) return null;
      let obj: THREE.Object3D | null = hit.object;
      while (obj && !(obj instanceof THREE.Group && obj.parent === mainGroup)) {
        obj = obj.parent;
      }
      return blocks.find((b) => b.mesh === obj) || null;
    };

    const setHover = (b: Block | null) => {
      if (b === hoveredBlock) return;
      if (hoveredBlock && hoveredBlock !== draggedBlock) {
        gsap.to(hoveredBlock.mesh.scale, { x: 1, y: 1, z: 1, duration: 0.3, ease: "power2.out" });
      }
      hoveredBlock = b;
      if (b && b !== draggedBlock) {
        container.style.cursor = "grab";
        gsap.to(b.mesh.scale, { x: 1.08, y: 1.08, z: 1.08, duration: 0.3, ease: "power2.out" });
      } else if (!b) {
        container.style.cursor = "default";
      }
    };

    const onPointerMove = (cx: number, cy: number) => {
      updateMouse(cx, cy);
      if (!draggedBlock) setHover(findHit());
    };

    const onPointerDown = () => {
      if (hoveredBlock) {
        draggedBlock = hoveredBlock;
        container.style.cursor = "grabbing";
        draggedBlock.vel.set(0, 0);
        gsap.to(draggedBlock.mesh.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.15 });
      }
    };

    const onPointerUp = () => {
      if (draggedBlock) {
        gsap.to(draggedBlock.mesh.scale, {
          x: 1, y: 1, z: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)",
        });
        // Toss the block based on its velocity when released
        draggedBlock.vel.multiplyScalar(0.5); 
        draggedBlock = null;
      }
      container.style.cursor = hoveredBlock ? "grab" : "default";
    };

    const handleMouseMove = (e: MouseEvent) => onPointerMove(e.clientX, e.clientY);
    const handleMouseLeave = () => { mouseActive = false; };
    const handleMouseDown = () => onPointerDown();
    const handleMouseUp = () => onPointerUp();
    
    const handleTouchStart = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      updateMouse(e.touches[0].clientX, e.touches[0].clientY);
      setHover(findHit());
      onPointerDown();
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchEnd = () => {
      mouseActive = false;
      onPointerUp();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd);

    const clock = new THREE.Clock();
    let animId: number;

    const resolveAABBCollision = (a: Block, b: Block) => {
      const dx = b.pos.x - a.pos.x;
      const dy = b.pos.y - a.pos.y;
      const overlapX = (a.w / 2 + b.w / 2) - Math.abs(dx);
      const overlapY = (a.h / 2 + b.h / 2) - Math.abs(dy);

      if (overlapX <= 0 || overlapY <= 0) return;

      const gap = 0.05;
      if (overlapX < overlapY) {
        const sign = dx > 0 ? 1 : -1;
        const push = (overlapX + gap) * 0.5;
        a.pos.x -= sign * push;
        b.pos.x += sign * push;

        const relVx = a.vel.x - b.vel.x;
        const impulse = relVx * RESTITUTION;
        a.vel.x -= impulse;
        b.vel.x += impulse;

        a.rotVel += sign * Math.abs(a.vel.y) * 0.04;
        b.rotVel -= sign * Math.abs(b.vel.y) * 0.04;
      } else {
        const sign = dy > 0 ? 1 : -1;
        const push = (overlapY + gap) * 0.5;
        a.pos.y -= sign * push;
        b.pos.y += sign * push;

        const relVy = a.vel.y - b.vel.y;
        const impulse = relVy * RESTITUTION;
        a.vel.y -= impulse;
        b.vel.y += impulse;

        a.rotVel -= sign * Math.abs(a.vel.x) * 0.04;
        b.rotVel += sign * Math.abs(b.vel.x) * 0.04;
      }
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const rawDelta = clock.getDelta();
      const delta = Math.min(rawDelta, 0.05);
      const time = clock.elapsedTime;

      // Camera Spring Interpolation
      const springAccX = -SPRING_K * (springPos.x - mouse.x) - SPRING_DAMP * springVel.x;
      const springAccY = -SPRING_K * (springPos.y - mouse.y) - SPRING_DAMP * springVel.y;
      springVel.x += springAccX * delta;
      springVel.y += springAccY * delta;
      springPos.x += springVel.x * delta;
      springPos.y += springVel.y * delta;

      targetMouse.lerp(mouse, 0.06);
      const tiltX = targetMouse.x * 0.08;
      const tiltY = -targetMouse.y * 0.06;
      mainGroup.rotation.y = THREE.MathUtils.lerp(mainGroup.rotation.y, tiltX, 0.06);
      mainGroup.rotation.x = THREE.MathUtils.lerp(mainGroup.rotation.x, tiltY, 0.06);

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, -springPos.x * 0.5, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, springPos.y * 0.35, 0.05);

      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];

        if (b === draggedBlock) {
          // Force item to follow mouse exactly
          const targetX = mouse3D.x;
          const targetY = mouse3D.y;
          b.vel.x = (targetX - b.pos.x) * 15;
          b.vel.y = (targetY - b.pos.y) * 15;
          b.pos.x += (targetX - b.pos.x) * 0.4;
          b.pos.y += (targetY - b.pos.y) * 0.4;
          b.rotVel *= 0.85;
          b.targetRotZ = THREE.MathUtils.clamp(b.vel.x * 0.015, -0.3, 0.3);
        } else {
          // Continuous lushion drift force
          b.vel.add(b.drift);
          
          // Fluid Repulsion from cursor (If hovering over screen but not dragging this element)
          if (mouseActive) {
            const dx = b.pos.x - mouse3D.x;
            const dy = b.pos.y - mouse3D.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < REPULSION_RADIUS * REPULSION_RADIUS && distSq > 0.01) {
              const dist = Math.sqrt(distSq);
              const force = (1 - dist / REPULSION_RADIUS) * REPULSION_STRENGTH;
              b.vel.x += (dx / dist) * force * delta * 60;
              b.vel.y += (dy / dist) * force * delta * 60;
            }
          }

          // Move the block
          b.pos.x += b.vel.x * delta;
          b.pos.y += b.vel.y * delta;
          b.vel.multiplyScalar(FRICTION); // Apply fluid drag

          const halfW = b.w / 2;
          const halfH = b.h / 2;

          // Soft Fluid Boundaries (Pushes gently instead of hard bouncing)
          const margin = 0.5;
          if (b.pos.x + halfW > boundX) b.vel.x -= margin * delta * 60;
          if (b.pos.x - halfW < -boundX) b.vel.x += margin * delta * 60;
          if (b.pos.y + halfH > boundY) b.vel.y -= margin * delta * 60;
          if (b.pos.y - halfH < -boundY) b.vel.y += margin * delta * 60;

          // Natural tilt from horizontal speed
          b.targetRotZ = THREE.MathUtils.clamp(-b.vel.x * 0.02, -0.25, 0.25);
        }

        // Apply Rotations Smoothly
        b.rotVel *= 0.92;
        b.currentRotZ += b.rotVel * delta;
        b.currentRotZ = THREE.MathUtils.lerp(b.currentRotZ, b.targetRotZ, 0.08);

        // Check Collisions against other blocks
        for (let j = i + 1; j < blocks.length; j++) {
          resolveAABBCollision(b, blocks[j]);
        }

        // Ambient Floating effects
        const floatY = Math.sin(time * b.floatSpeed + b.floatPhase) * b.floatAmp;
        const floatX = Math.cos(time * b.floatSpeed * 0.6 + b.floatPhase) * b.floatAmp * 0.4;
        const parallaxX = springPos.x * (b.z * 0.08);
        const parallaxY = springPos.y * (b.z * 0.06);

        // Sync mathematical position to Three.js Mesh
        b.mesh.position.set(
          b.pos.x + floatX + parallaxX,
          b.pos.y + floatY + parallaxY,
          b.z
        );
        b.mesh.rotation.z = b.currentRotZ;
        const tiltFromVel = b.vel.y * 0.008;
        b.mesh.rotation.x = THREE.MathUtils.lerp(b.mesh.rotation.x, tiltFromVel, 0.1);
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      calculateBounds(); // Re-adjust physics wall bounds on resize
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);

      loadedTextures.forEach((t) => t.dispose());

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            if ((m as THREE.MeshStandardMaterial).map) (m as THREE.MeshStandardMaterial).map!.dispose();
            m.dispose();
          });
        }
      });

      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" />;
}