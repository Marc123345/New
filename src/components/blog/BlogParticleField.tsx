import { useEffect, useRef } from "react";
import * as THREE from "three";

export function BlogParticleField() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );
    camera.position.set(0, 0, 40);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const particleCount = 180;
    const positions = new Float32Array(particleCount * 3);
    const velocities: { vx: number; vy: number; vz: number }[] = [];
    const colors = new Float32Array(particleCount * 3);

    const primaryColor = new THREE.Color(0x291e56);
    const secondaryColor = new THREE.Color(0xa46cfc);
    const accentColor = new THREE.Color(0xb181fc);

    const palette = [primaryColor, secondaryColor, accentColor];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      velocities.push({
        vx: (Math.random() - 0.5) * 0.012,
        vy: Math.random() * 0.015 + 0.005,
        vz: (Math.random() - 0.5) * 0.005,
      });

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const smallGeomCount = 30;
    const smallMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < smallGeomCount; i++) {
      const isTriangle = Math.random() > 0.5;
      const geo = isTriangle
        ? new THREE.TetrahedronGeometry(0.18 + Math.random() * 0.2, 0)
        : new THREE.BoxGeometry(0.18, 0.18, 0.18);

      const c = palette[Math.floor(Math.random() * palette.length)];
      const mat = new THREE.MeshBasicMaterial({
        color: c,
        transparent: true,
        opacity: 0.25 + Math.random() * 0.2,
        wireframe: Math.random() > 0.5,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 55,
        (Math.random() - 0.5) * 38,
        (Math.random() - 0.5) * 15
      );
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      mesh.userData.rotSpeed = {
        x: (Math.random() - 0.5) * 0.008,
        y: (Math.random() - 0.5) * 0.012,
        z: (Math.random() - 0.5) * 0.006,
      };
      mesh.userData.floatSpeed = Math.random() * 0.01 + 0.005;
      mesh.userData.floatPhase = Math.random() * Math.PI * 2;
      scene.add(mesh);
      smallMeshes.push(mesh);
    }

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    let animId: number;
    let elapsed = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      elapsed += 0.016;

      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      const pos = geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        arr[i * 3] += velocities[i].vx;
        arr[i * 3 + 1] += velocities[i].vy;
        arr[i * 3 + 2] += velocities[i].vz;

        if (arr[i * 3 + 1] > 22) {
          arr[i * 3 + 1] = -22;
          arr[i * 3] = (Math.random() - 0.5) * 60;
        }
        if (Math.abs(arr[i * 3]) > 32) velocities[i].vx *= -1;
        if (Math.abs(arr[i * 3 + 2]) > 12) velocities[i].vz *= -1;
      }
      pos.needsUpdate = true;

      for (let i = 0; i < smallMeshes.length; i++) {
        const m = smallMeshes[i];
        m.rotation.x += m.userData.rotSpeed.x;
        m.rotation.y += m.userData.rotSpeed.y;
        m.rotation.z += m.userData.rotSpeed.z;
        m.position.y += 0.008;
        m.position.y +=
          Math.sin(elapsed * m.userData.floatSpeed + m.userData.floatPhase) *
          0.003;
        if (m.position.y > 22) m.position.y = -22;
      }

      scene.rotation.y = targetX * 0.06;
      scene.rotation.x = targetY * 0.03;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
