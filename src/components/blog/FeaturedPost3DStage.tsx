import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

interface FeaturedPost {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
}

interface FeaturedPost3DStageProps {
  post: FeaturedPost;
  onClick: () => void;
}

function createCategoryTexture(category: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#291e56";
  ctx.fillRect(0, 0, 512, 256);

  ctx.strokeStyle = "#a46cfc";
  ctx.lineWidth = 3;
  ctx.strokeRect(6, 6, 500, 244);

  ctx.fillStyle = "#a46cfc";
  ctx.font = "bold 28px Helvetica, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "8px";
  ctx.fillText(category.toUpperCase(), 256, 90);

  ctx.fillStyle = "rgba(251,251,252,0.7)";
  ctx.font = "16px Helvetica, Arial, sans-serif";
  ctx.letterSpacing = "2px";
  ctx.fillText("LATEST FEATURE", 256, 160);

  ctx.strokeStyle = "rgba(164,108,252,0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 128);
  ctx.lineTo(452, 128);
  ctx.stroke();

  return new THREE.CanvasTexture(canvas);
}

export function FeaturedPost3DStage({ post, onClick }: FeaturedPost3DStageProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const hoverRef = useRef(false);

  useEffect(() => {
    hoverRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x291e56, 0.055);

    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
    camera.position.set(0, 1.8, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x291e56, 0.85);
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0x291e56, 1.2);
    scene.add(ambient);

    const spotlight = new THREE.SpotLight(0xa46cfc, 12, 30, Math.PI / 5, 0.4, 1.5);
    spotlight.position.set(0, 8, 5);
    spotlight.target.position.set(0, 0, 0);
    spotlight.castShadow = true;
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    scene.add(spotlight);
    scene.add(spotlight.target);

    const rimLight = new THREE.DirectionalLight(0xb181fc, 3);
    rimLight.position.set(-5, 3, -5);
    scene.add(rimLight);

    const groundGeo = new THREE.PlaneGeometry(20, 20);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1a1240,
      roughness: 0.85,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.2;
    ground.receiveShadow = true;
    scene.add(ground);

    const slabGeo = new THREE.BoxGeometry(5.5, 3, 0.35);
    const categoryTex = createCategoryTexture(post.category);
    const slabMats = [
      new THREE.MeshStandardMaterial({ color: 0x291e56, roughness: 0.3, metalness: 0.5 }),
      new THREE.MeshStandardMaterial({ color: 0x291e56, roughness: 0.3, metalness: 0.5 }),
      new THREE.MeshStandardMaterial({ color: 0x1a1240, roughness: 0.4, metalness: 0.3 }),
      new THREE.MeshStandardMaterial({ color: 0x1a1240, roughness: 0.4, metalness: 0.3 }),
      new THREE.MeshStandardMaterial({ map: categoryTex, roughness: 0.2, metalness: 0.6 }),
      new THREE.MeshStandardMaterial({ color: 0x0f0a2b, roughness: 0.5, metalness: 0.2 }),
    ];

    const slab = new THREE.Mesh(slabGeo, slabMats);
    slab.castShadow = true;
    slab.position.set(0, 0.2, 0);
    scene.add(slab);

    const edgeGeo = new THREE.EdgesGeometry(slabGeo);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xa46cfc, transparent: true, opacity: 0.7 });
    const edges = new THREE.LineSegments(edgeGeo, edgeMat);
    slab.add(edges);

    const ringCount = 3;
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < ringCount; i++) {
      const r = 1.5 + i * 0.8;
      const ringGeo = new THREE.TorusGeometry(r, 0.015, 8, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xa46cfc,
        transparent: true,
        opacity: 0.3 - i * 0.08,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -2.19;
      scene.add(ring);
      rings.push(ring);
    }

    const particleCount = 60;
    const pPositions = new Float32Array(particleCount * 3);
    const pVelocities: number[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1 + Math.random() * 4;
      pPositions[i * 3] = Math.cos(angle) * radius;
      pPositions[i * 3 + 1] = -2.2 + Math.random() * 5;
      pPositions[i * 3 + 2] = Math.sin(angle) * radius;
      pVelocities.push(0.005 + Math.random() * 0.012);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xa46cfc,
      size: 0.08,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });
    const pSystem = new THREE.Points(pGeo, pMat);
    scene.add(pSystem);

    let elapsed = 0;
    let animId: number;
    let targetCamZ = 10;
    let currentCamZ = 10;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      elapsed += 0.016;

      targetCamZ = hoverRef.current ? 7.5 : 10;
      currentCamZ += (targetCamZ - currentCamZ) * 0.04;
      camera.position.z = currentCamZ;

      slab.rotation.y = Math.sin(elapsed * 0.3) * 0.25 + elapsed * 0.08;
      slab.position.y = 0.2 + Math.sin(elapsed * 0.6) * 0.1;

      spotlight.position.x = Math.sin(elapsed * 0.4) * 4;
      spotlight.position.z = Math.cos(elapsed * 0.3) * 4 + 3;

      for (let i = 0; i < ringCount; i++) {
        rings[i].rotation.z = elapsed * (0.2 + i * 0.08);
        const s = 1 + Math.sin(elapsed * 0.5 + i) * 0.04;
        rings[i].scale.set(s, s, 1);
      }

      const pArr = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pArr[i * 3 + 1] += pVelocities[i];
        if (pArr[i * 3 + 1] > 4) {
          pArr[i * 3 + 1] = -2.2;
        }
      }
      pGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      slabGeo.dispose();
      edgeGeo.dispose();
      edgeMat.dispose();
      slabMats.forEach(m => m.dispose());
      categoryTex.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      rings.forEach(r => {
        (r.geometry as THREE.BufferGeometry).dispose();
        (r.material as THREE.Material).dispose();
      });
      pGeo.dispose();
      pMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [post.category]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group cursor-pointer col-span-1 md:col-span-2 lg:col-span-2"
    >
      <div
        style={{
          border: "2px solid var(--color-text-dark)",
          boxShadow: hovered ? "var(--shadow-geometric-hover)" : "var(--shadow-geometric)",
          transform: hovered ? "translate(-2px,-2px)" : "translate(0,0)",
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
          background: "var(--color-background-light)",
          overflow: "hidden",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div
            ref={canvasRef}
            className="relative w-full"
            style={{ height: "300px", minHeight: "260px", overflow: "hidden" }}
          />

          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="inline-block px-3 py-1 text-[10px] uppercase tracking-[0.2em]"
                  style={{
                    fontFamily: "var(--font-stack-heading)",
                    border: "1px solid var(--color-text-dark)",
                    background: "var(--color-primary)",
                    color: "var(--color-background-light)",
                  }}
                >
                  {post.category}
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.2em] opacity-50"
                  style={{ fontFamily: "var(--font-stack-heading)" }}
                >
                  Featured
                </span>
              </div>

              <h2
                className="leading-tight mb-4 transition-colors duration-300 group-hover:text-[var(--color-secondary)]"
                style={{
                  color: "var(--color-text-dark)",
                  fontFamily: "var(--font-stack-heading)",
                  fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                  lineHeight: 1.1,
                }}
              >
                {post.title}
              </h2>

              <p
                className="text-sm leading-relaxed opacity-70 mb-6"
                style={{ fontFamily: "var(--font-stack-body)" }}
              >
                {post.excerpt}
              </p>
            </div>

            <div>
              <div
                className="flex items-center gap-3 mb-5 text-[11px] tracking-wider uppercase opacity-50"
                style={{ fontFamily: "var(--font-stack-heading)" }}
              >
                <span>{post.date}</span>
                <span className="w-1 h-1 rounded-full bg-current" />
                <span>{post.readTime}</span>
                <span className="w-1 h-1 rounded-full bg-current" />
                <span>{post.author}</span>
              </div>

              <button
                className="flex items-center gap-2 px-5 py-3 text-[11px] uppercase tracking-[0.15em] transition-all duration-300 group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-background-light)]"
                style={{
                  fontFamily: "var(--font-stack-heading)",
                  border: "2px solid var(--color-text-dark)",
                  color: "var(--color-text-dark)",
                  background: "transparent",
                  boxShadow: "var(--shadow-button)",
                }}
              >
                Read Article
                <ArrowUpRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
