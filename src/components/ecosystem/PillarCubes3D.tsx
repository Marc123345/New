import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PILLAR_TEXTURES = [
  "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400",
];

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
  vec3 L = normalize(vec3(0.3, 0.6, 1.0));
  float diff = max(dot(vNormal, L), 0.0) * 0.35;
  vec3 H = normalize(L + vViewDir);
  float spec = pow(max(dot(vNormal, H), 0.0), 90.0) * (0.5 + uHover * 0.5);
  vec3 ambient = tex.rgb * 0.62;
  vec3 lit = tex.rgb * diff;
  vec3 glassRim = vec3(1.0) * vFresnel * (0.18 + uHover * 0.22);
  vec3 final = ambient + lit + vec3(spec * 0.7) + glassRim;
  float fog = mix(1.0, 0.55, uDepth);
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
  float fr = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 3.5);
  float glow = fr * (0.12 + uHover * 0.25);
  gl_FragColor = vec4(vec3(0.85, 0.90, 1.0) * glow, glow * 0.45);
}`;

const N = 3;
const RADIUS = 2.2;

const POSITIONS: [number, number, number][] = [
  [-5.5, 2.0, 0],
  [5.5, 2.0, 0],
  [0, -4.5, 0],
];

interface PillarCubes3DProps {
  className?: string;
  style?: React.CSSProperties;
  onPillarClick?: (index: number) => void;
}

export function PillarCubes3D({ className = '', style, onPillarClick }: PillarCubes3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 28);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const sunLight = new THREE.PointLight(0xffffff, 1.5);
    sunLight.position.set(10, 15, 10);
    scene.add(sunLight);
    const fillLight = new THREE.PointLight(0x4466cc, 0.6);
    fillLight.position.set(-10, -8, 5);
    scene.add(fillLight);

    const s = RADIUS * 2;
    const cubeGeo = new THREE.BoxGeometry(s, s, s, 1, 1, 1);
    const shellGeo = new THREE.BoxGeometry(s * 1.07, s * 1.07, s * 1.07);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    const meshGroups: THREE.Group[] = [];
    const innerGroups: THREE.Group[] = [];
    const cubeMaterials: THREE.ShaderMaterial[] = [];
    const shellMaterials: THREE.ShaderMaterial[] = [];
    const loadedTextures: THREE.Texture[] = [];

    const floatPhase = new Float32Array(N);
    const floatSpeed = new Float32Array(N);
    const rotSpeedX = new Float32Array(N);
    const rotSpeedY = new Float32Array(N);
    const rotSpeedZ = new Float32Array(N);
    const hoverAmount = new Float32Array(N);
    const spawned = new Uint8Array(N);
    const spawnStart = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      floatPhase[i] = Math.random() * Math.PI * 2;
      floatSpeed[i] = 0.6 + Math.random() * 0.4;
      rotSpeedX[i] = (Math.random() - 0.5) * 0.015;
      rotSpeedY[i] = 0.012 + Math.random() * 0.018;
      rotSpeedZ[i] = (Math.random() - 0.5) * 0.008;
      spawnStart[i] = i * 0.25;

      const group = new THREE.Group();
      const inner = new THREE.Group();
      group.add(inner);
      group.position.set(...POSITIONS[i]);
      group.scale.setScalar(0);
      scene.add(group);
      meshGroups.push(group);
      innerGroups.push(inner);

      inner.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      const tex = textureLoader.load(
        PILLAR_TEXTURES[i],
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
          uDepth: { value: i / (N - 1) * 0.4 },
        },
      });
      cubeMaterials.push(cubeMat);
      inner.add(new THREE.Mesh(cubeGeo, cubeMat));

      const shellMat = new THREE.ShaderMaterial({
        vertexShader: SHELL_VERT,
        fragmentShader: SHELL_FRAG,
        uniforms: { uHover: { value: 0 } },
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      shellMaterials.push(shellMat);
      inner.add(new THREE.Mesh(shellGeo, shellMat));
    }

    const raycaster = new THREE.Raycaster();
    const mouse2D = new THREE.Vector2();
    let mouseActive = false;
    let mouseNdcX = -9, mouseNdcY = -9;

    const updateMouse = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      mouse2D.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse2D.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      mouseNdcX = mouse2D.x;
      mouseNdcY = mouse2D.y;
      mouseActive = true;
    };

    const handleMouseMove = (e: MouseEvent) => updateMouse(e.clientX, e.clientY);
    const handleMouseLeave = () => { mouseActive = false; };

    const handleClick = (e: MouseEvent) => {
      if (!onPillarClick) return;
      const rect = container.getBoundingClientRect();
      mouse2D.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse2D.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse2D, camera);
      for (let i = 0; i < N; i++) {
        const inner = innerGroups[i];
        const hits = raycaster.intersectObjects(inner.children, false);
        if (hits.length > 0) {
          onPillarClick(i);
          return;
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('click', handleClick);

    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const time = clock.elapsedTime;

      for (let i = 0; i < N; i++) {
        if (!spawned[i]) {
          const elapsed = time - spawnStart[i];
          if (elapsed < 0) continue;
          const t = Math.min(elapsed / 1.2, 1);
          const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          const overshoot = 1.0 + 0.1 * Math.sin(elapsed * 5) * Math.exp(-elapsed * 2.5);
          meshGroups[i].scale.setScalar(Math.max(ease * overshoot, 0));
          if (t >= 1) {
            meshGroups[i].scale.setScalar(1);
            spawned[i] = 1;
          }
          continue;
        }

        const floatY = Math.sin(time * floatSpeed[i] + floatPhase[i]) * 0.18;
        const base = POSITIONS[i];
        meshGroups[i].position.set(base[0], base[1] + floatY, base[2]);

        innerGroups[i].rotation.x += rotSpeedX[i] * dt * 60;
        innerGroups[i].rotation.y += rotSpeedY[i] * dt * 60;
        innerGroups[i].rotation.z += rotSpeedZ[i] * dt * 60;

        let targetHover = 0;
        if (mouseActive) {
          raycaster.setFromCamera(new THREE.Vector2(mouseNdcX, mouseNdcY), camera);
          const hits = raycaster.intersectObjects(innerGroups[i].children, false);
          if (hits.length > 0) targetHover = 1;
        }
        hoverAmount[i] += (targetHover - hoverAmount[i]) * (1 - Math.exp(-5 * dt));
        cubeMaterials[i].uniforms.uHover.value = hoverAmount[i];
        shellMaterials[i].uniforms.uHover.value = hoverAmount[i];
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClick);
      cancelAnimationFrame(animId);
      ro.disconnect();
      loadedTextures.forEach((t) => t.dispose());
      cubeGeo.dispose();
      shellGeo.dispose();
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
  }, [onPillarClick]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full cursor-pointer ${className}`}
      style={style}
    />
  );
}
