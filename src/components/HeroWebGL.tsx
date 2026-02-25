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
const RADII = ALL_URLS.map((_, i) => (i < PEOPLE_IMAGES.length ? 2.2 : 1.6));
const N = ALL_URLS.length;

const DAMPING = 0.985;
const MOUSE_REPEL_RADIUS = 12.0;
const MOUSE_REPEL_STRENGTH = 6.0;
const SOFT_BOUND_STRENGTH = 0.8;
const DRIFT_STRENGTH = 0.015;

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

    // Fallback safe dimensions to prevent division by zero
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0, 35);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const px = new Float32Array(N); 
    const py = new Float32Array(N); 
    const pz = new Float32Array(N); 
    const vx = new Float32Array(N); 
    const vy = new Float32Array(N); 
    const radii = new Float32Array(RADII);
    const driftX = new Float32Array(N);
    const driftY = new Float32Array(N);

    const meshes: THREE.Group[] = [];
    const innerGroups: THREE.Group[] = [];
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");

    let boundX = 15;
    let boundY = 10;
    
    const calculateBounds = () => {
        const currentW = container.clientWidth || window.innerWidth;
        const currentH = container.clientHeight || window.innerHeight;
        const aspect = currentW / currentH;
        const vFov = (camera.fov * Math.PI) / 180;
        const height = 2 * Math.tan(vFov / 2) * camera.position.z;
        boundX = (height * aspect) / 2;
        boundY = height / 2;
    };
    calculateBounds();

    for (let i = 0; i < N; i++) {
      const r = radii[i];
      px[i] = (Math.random() - 0.5) * boundX * 1.5;
      py[i] = (Math.random() - 0.5) * boundY * 1.5;
      pz[i] = (Math.random() - 0.5) * 8; 
      
      vx[i] = (Math.random() - 0.5) * 3;
      vy[i] = (Math.random() - 0.5) * 3;

      driftX[i] = (Math.random() - 0.5) * DRIFT_STRENGTH;
      driftY[i] = (Math.random() - 0.5) * DRIFT_STRENGTH;

      const group = new THREE.Group();
      const inner = new THREE.Group();
      group.add(inner);
      group.position.set(px[i], py[i], pz[i]);
      
      mainGroup.add(group);
      meshes.push(group);
      innerGroups.push(inner);

      inner.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      const s = r * 2;
      const cubeGeo = new THREE.BoxGeometry(s, s, s);
      const tex = textureLoader.load(ALL_URLS[i], (t) => {
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
          t.needsUpdate = true;
      });

      const cubeMat = new THREE.ShaderMaterial({
        vertexShader: CUBE_VERT,
        fragmentShader: CUBE_FRAG,
        uniforms: { 
          uMap: { value: tex }, 
          uRimColor: { value: SHELL_COLORS[i % SHELL_COLORS.length] }, 
          uRimStr: { value: 1.2 } 
        },
      });
      inner.add(new THREE.Mesh(cubeGeo, cubeMat));
    }

    let cx3d = -9999, cy3d = -9999;
    let mouseActive = false;
    let tiltX = 0, tiltY = 0;

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
      cx3d = hitPt.x;
      cy3d = hitPt.y;
      mouseActive = true;
    };

    window.addEventListener("mousemove", (e) => updateMouse(e.clientX, e.clientY));
    container.addEventListener("touchmove", (e) => {
        if(e.touches[0]) updateMouse(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    container.addEventListener("mouseleave", () => { mouseActive = false; });
    container.addEventListener("touchend", () => { mouseActive = false; });

    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);

      const targetTiltX = mouseActive ? mouse2D.x * 0.04 : 0;
      const targetTiltY = mouseActive ? -mouse2D.y * 0.04 : 0;
      tiltX += (targetTiltX - tiltX) * 0.05;
      tiltY += (targetTiltY - tiltY) * 0.05;
      mainGroup.rotation.y = tiltX;
      mainGroup.rotation.x = tiltY;

      for (let i = 0; i < N; i++) {
        vx[i] += driftX[i];
        vy[i] += driftY[i];

        if (mouseActive) {
          const dx = px[i] - cx3d;
          const dy = py[i] - cy3d;
          const distSq = dx * dx + dy * dy;
          // SAFE MATH: Check > 0.001 to prevent NaN
          if (distSq < MOUSE_REPEL_RADIUS * MOUSE_REPEL_RADIUS && distSq > 0.001) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / MOUSE_REPEL_RADIUS) * MOUSE_REPEL_STRENGTH;
            vx[i] += (dx / dist) * force * dt * 60;
            vy[i] += (dy / dist) * force * dt * 60;
          }
        }

        const r = radii[i];
        if (px[i] > boundX + r) vx[i] -= SOFT_BOUND_STRENGTH * dt * 60;
        if (px[i] < -boundX - r) vx[i] += SOFT_BOUND_STRENGTH * dt * 60;
        if (py[i] > boundY + r) vy[i] -= SOFT_BOUND_STRENGTH * dt * 60;
        if (py[i] < -boundY - r) vy[i] += SOFT_BOUND_STRENGTH * dt * 60;

        for (let j = i + 1; j < N; j++) {
            const dx = px[j] - px[i];
            const dy = py[j] - py[i];
            const distSq = dx * dx + dy * dy;
            const minDist = radii[i] + radii[j] + 0.8; 
            
            // SAFE MATH: Prevent NaN crashes if objects overlap perfectly
            if (distSq < minDist * minDist && distSq > 0.001) {
                const dist = Math.sqrt(distSq);
                const overlap = minDist - dist;
                const force = overlap * 0.08; 
                const nx = (dx / dist) * force;
                const ny = (dy / dist) * force;
                
                vx[i] -= nx; vy[i] -= ny;
                vx[j] += nx; vy[j] += ny;
            } else if (distSq <= 0.001) {
                // If perfectly overlapped, gently nudge apart
                vx[i] += (Math.random() - 0.5) * 0.2;
                vy[i] += (Math.random() - 0.5) * 0.2;
            }
        }

        vx[i] *= DAMPING;
        vy[i] *= DAMPING;
        
        px[i] += vx[i] * dt * 60;
        py[i] += vy[i] * dt * 60;
        
        pz[i] = Math.sin(clock.elapsedTime * 0.6 + i) * 2.5;

        meshes[i].position.set(px[i], py[i], pz[i]);
        
        innerGroups[i].rotation.x += (vx[i] * 0.01) + 0.002;
        innerGroups[i].rotation.y += (vy[i] * 0.01) + 0.003;
      }

      renderer.render(scene, camera);
    };
    
    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const currentW = container.clientWidth || window.innerWidth;
      const currentH = container.clientHeight || window.innerHeight;
      camera.aspect = currentW / currentH;
      camera.updateProjectionMatrix();
      renderer.setSize(currentW, currentH);
      calculateBounds();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" />;
}