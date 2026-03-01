import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Connection {
  from: [number, number];
  to: [number, number];
  progress: number;
  speed: number;
  color: string;
  pulse: number;
}

function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function buildArcCurve(from: [number, number], to: [number, number], radius: number): THREE.CatmullRomCurve3 {
  const start = latLonToVec3(from[0], from[1], radius);
  const end = latLonToVec3(to[0], to[1], radius);
  const mid = start.clone().add(end).normalize().multiplyScalar(radius * 1.35);
  return new THREE.CatmullRomCurve3([start, mid, end]);
}

const CITIES: [number, number][] = [
  [40.7128, -74.006],   // New York
  [51.5074, -0.1278],   // London
  [48.8566, 2.3522],    // Paris
  [35.6762, 139.6503],  // Tokyo
  [-33.8688, 151.2093], // Sydney
  [1.3521, 103.8198],   // Singapore
  [55.7558, 37.6176],   // Moscow
  [19.0760, 72.8777],   // Mumbai
  [-23.5505, -46.6333], // São Paulo
  [37.7749, -122.4194], // San Francisco
  [25.2048, 55.2708],   // Dubai
  [-1.2921, 36.8219],   // Nairobi
];

const PURPLE_SHADES = [
  "#c084fc", "#a855f7", "#9333ea", "#7c3aed", "#6d28d9", "#e879f9", "#d946ef"
];

export function GlobeScene({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const W = container.clientWidth;
    const H = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    const RADIUS = 1;

    // Globe sphere
    const globeGeo = new THREE.SphereGeometry(RADIUS, 64, 64);
    const globeMat = new THREE.MeshPhongMaterial({
      color: 0x0d0820,
      emissive: 0x1a0a2e,
      transparent: true,
      opacity: 0.92,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x6b21a8,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const wireGeo = new THREE.SphereGeometry(RADIUS + 0.002, 32, 32);
    scene.add(new THREE.Mesh(wireGeo, wireMat));

    // Outer glow ring
    const glowGeo = new THREE.SphereGeometry(RADIUS + 0.04, 64, 64);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x9333ea,
      transparent: true,
      opacity: 0.04,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(glowGeo, glowMat));

    // City dots
    const dotGroup = new THREE.Group();
    const dotGeo = new THREE.SphereGeometry(0.012, 8, 8);
    CITIES.forEach((city) => {
      const pos = latLonToVec3(city[0], city[1], RADIUS + 0.012);
      const color = new THREE.Color(PURPLE_SHADES[Math.floor(Math.random() * PURPLE_SHADES.length)]);
      const mat = new THREE.MeshBasicMaterial({ color });
      const dot = new THREE.Mesh(dotGeo, mat);
      dot.position.copy(pos);
      dotGroup.add(dot);

      // Pulse ring
      const ringGeo = new THREE.RingGeometry(0.018, 0.024, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      dotGroup.add(ring);
    });
    scene.add(dotGroup);

    // Connections
    const connections: Connection[] = [];
    const arcMeshes: THREE.Line[] = [];

    function addConnection() {
      const i = Math.floor(Math.random() * CITIES.length);
      let j = Math.floor(Math.random() * CITIES.length);
      while (j === i) j = Math.floor(Math.random() * CITIES.length);

      const color = PURPLE_SHADES[Math.floor(Math.random() * PURPLE_SHADES.length)];
      connections.push({
        from: CITIES[i],
        to: CITIES[j],
        progress: 0,
        speed: 0.003 + Math.random() * 0.003,
        color,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Seed initial connections
    for (let i = 0; i < 5; i++) addConnection();

    // Lights
    scene.add(new THREE.AmbientLight(0x9333ea, 0.4));
    const dirLight = new THREE.DirectionalLight(0xc084fc, 0.8);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);
    const rimLight = new THREE.DirectionalLight(0x7c3aed, 0.5);
    rimLight.position.set(-5, -3, -5);
    scene.add(rimLight);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let isDragging = false;
    let lastMouse = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      if (isDragging) {
        targetRotY += (e.clientX - lastMouse.x) * 0.005;
        targetRotX += (e.clientY - lastMouse.y) * 0.005;
        lastMouse = { x: e.clientX, y: e.clientY };
      }
    };
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDragging = false; };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        if (isDragging) {
          targetRotY += (t.clientX - lastMouse.x) * 0.005;
          targetRotX += (t.clientY - lastMouse.y) * 0.005;
          lastMouse = { x: t.clientX, y: t.clientY };
        }
      }
    };
    const onTouchStart = (e: TouchEvent) => {
      isDragging = true;
      lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onMouseUp);

    // Resize
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    let animId: number;
    let autoRotY = 0;
    let frame = 0;
    const pendingTimeouts: ReturnType<typeof setTimeout>[] = [];

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;

      // Auto-rotate when not dragging
      if (!isDragging) {
        autoRotY += 0.0015;
        targetRotX += (mouseY * 0.12 - targetRotX) * 0.05;
        globe.rotation.y = autoRotY + targetRotY;
        globe.rotation.x = targetRotX;
        dotGroup.rotation.y = autoRotY + targetRotY;
        dotGroup.rotation.x = targetRotX;
      } else {
        globe.rotation.y = autoRotY + targetRotY;
        globe.rotation.x = targetRotX;
        dotGroup.rotation.y = autoRotY + targetRotY;
        dotGroup.rotation.x = targetRotX;
      }

      // Pulse city dots
      dotGroup.children.forEach((child, idx) => {
        if (idx % 2 === 1) {
          const mesh = child as THREE.Mesh;
          const mat = mesh.material as THREE.MeshBasicMaterial;
          const scale = 1 + 0.4 * Math.sin(frame * 0.04 + idx);
          mesh.scale.setScalar(scale);
          mat.opacity = 0.3 + 0.2 * Math.sin(frame * 0.04 + idx);
        }
      });

      // Spawn new connections
      if (frame % 120 === 0 && connections.length < 10) addConnection();

      // Update arc animations
      connections.forEach((conn, cIdx) => {
        conn.progress += conn.speed;
        conn.pulse += 0.05;

        // Remove old arc mesh for this connection index
        if (arcMeshes[cIdx]) {
          scene.remove(arcMeshes[cIdx]);
        }

        if (conn.progress > 1.15) {
          connections.splice(cIdx, 1);
          arcMeshes.splice(cIdx, 1);
          return;
        }

        const clamp = Math.min(conn.progress, 1.0);
        const curve = buildArcCurve(conn.from, conn.to, RADIUS);
        const points = curve.getPoints(80);
        const visibleCount = Math.floor(clamp * points.length);
        if (visibleCount < 2) return;

        const positions = new Float32Array(visibleCount * 3);
        for (let i = 0; i < visibleCount; i++) {
          positions[i * 3] = points[i].x;
          positions[i * 3 + 1] = points[i].y;
          positions[i * 3 + 2] = points[i].z;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const color = new THREE.Color(conn.color);
        const opacity = 0.5 + 0.4 * Math.sin(conn.pulse);
        const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
        const line = new THREE.Line(geo, mat);

        // Rotate arc with globe
        line.rotation.copy(globe.rotation);

        scene.add(line);
        arcMeshes[cIdx] = line;

        // Draw traveler dot at tip
        const tipPoint = points[visibleCount - 1];
        const tipGeo = new THREE.SphereGeometry(0.016, 6, 6);
        const tipMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const tipMesh = new THREE.Mesh(tipGeo, tipMat);
        const rotated = tipPoint.clone().applyEuler(globe.rotation);
        tipMesh.position.copy(rotated);
        scene.add(tipMesh);
        pendingTimeouts.push(setTimeout(() => scene.remove(tipMesh), 50));
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      pendingTimeouts.forEach(clearTimeout);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onMouseUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block", cursor: "grab" }}
    />
  );
}
