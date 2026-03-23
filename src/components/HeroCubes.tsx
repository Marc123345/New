import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERT = `
varying vec3 vNormal;
varying vec3 vViewDir;
varying float vFresnel;

void main() {
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  vec3 viewDir = normalize(-mvPos.xyz);
  vNormal = normalize(normalMatrix * normal);
  vFresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.5);
  vViewDir = viewDir;
  gl_Position = projectionMatrix * mvPos;
}`;

const FRAG = `
uniform vec3 uColor;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vViewDir;
varying float vFresnel;

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vViewDir);

  // Key light — warm white from top-right
  vec3 L1 = normalize(vec3(0.6, 1.0, 0.9));
  float diff1 = max(dot(n, L1), 0.0);
  vec3 H1 = normalize(L1 + v);
  float spec1 = pow(max(dot(n, H1), 0.0), 90.0);

  // Fill light — cool purple from bottom-left
  vec3 L2 = normalize(vec3(-0.8, -0.5, 0.3));
  float diff2 = max(dot(n, L2), 0.0) * 0.25;

  vec3 col =
    uColor * 0.38                                          // ambient
    + uColor * diff1 * 0.55                               // diffuse key
    + uColor * diff2                                       // fill
    + vec3(1.0) * spec1 * 0.85                            // specular highlight
    + vec3(0.88, 0.85, 1.0) * vFresnel * 0.45            // fresnel rim
    + vec3(0.55, 0.35, 1.0) * vFresnel * vFresnel * 0.18; // purple edge glow

  gl_FragColor = vec4(col, 1.0);
}`;

// 3 cube definitions: size, home position, initial rotation, color
const CUBES = [
  { size: 2.6,  pos: [-2.2,  0.4,  0.0], color: [0.97, 0.96, 1.00] },
  { size: 2.3,  pos: [ 0.4, -0.5,  0.6], color: [0.98, 0.97, 1.00] },
  { size: 2.5,  pos: [ 2.4,  0.5, -0.6], color: [0.96, 0.94, 1.00] },
];

export function HeroCubes() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(46, w / h, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const scene = new THREE.Scene();
    // No background — Unicorn scene shows through

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Build the 3 cubes
    const meshes = CUBES.map(({ size, pos, color }) => {
      const geo = new THREE.SphereGeometry(size / 2, 64, 64);
      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          uColor: { value: new THREE.Color(...(color as [number, number, number])) },
          uTime:  { value: 0 },
        },
        transparent: true,
        side: THREE.FrontSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...(pos as [number, number, number]));
      // Random initial rotation
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI * 0.3,
      );
      scene.add(mesh);
      return mesh;
    });

    // Rotation speeds per cube (slow, deliberate)
    const rotSpeeds = [
      { x: 0.0018, y: 0.0030, z: 0.0008 },
      { x: 0.0025, y: 0.0015, z: 0.0010 },
      { x: 0.0012, y: 0.0022, z: 0.0006 },
    ];

    // Float offsets
    const floatPhase = CUBES.map((_, i) => i * 1.3);

    // Mouse parallax
    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      mouseY = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let tiltX = 0, tiltY = 0;
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t  = clock.elapsedTime;

      // Smooth camera tilt toward mouse
      tiltX += (mouseX * 0.06 - tiltX) * (1 - Math.exp(-3 * dt));
      tiltY += (-mouseY * 0.05 - tiltY) * (1 - Math.exp(-3 * dt));
      camera.rotation.y = tiltX;
      camera.rotation.x = tiltY;

      meshes.forEach((mesh, i) => {
        // Gentle float
        const baseY = CUBES[i].pos[1];
        mesh.position.y = baseY + Math.sin(t * 0.4 + floatPhase[i]) * 0.18;

        (mesh.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      meshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.ShaderMaterial).dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />;
}
