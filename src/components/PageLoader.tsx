import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { H2HLogo } from "./H2HLogo";

const VIDEO_URL =
  "https://ik.imagekit.io/qcvroy8xpd/Video_Generation_Successful%20(1).mp4?updatedAt=1771264402365";

function LoaderPhone() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const w = el.clientWidth;
    const h = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(3, 5, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x88ccff, 0.5);
    fill.position.set(-3, -2, 3);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffd0a0, 0.4);
    rim.position.set(0, -4, -3);
    scene.add(rim);

    const phone = new THREE.Group();
    scene.add(phone);

    const bodyGeo = new THREE.BoxGeometry(1.4, 2.8, 0.14);
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x111111,
      metalness: 0.6,
      roughness: 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    phone.add(body);

    const screenGeo = new THREE.PlaneGeometry(1.15, 2.45);
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 256;
    screenCanvas.height = 512;
    const ctx = screenCanvas.getContext("2d")!;
    const grad = ctx.createLinearGradient(0, 0, 256, 512);
    grad.addColorStop(0, "#060412");
    grad.addColorStop(0.5, "#0d0820");
    grad.addColorStop(1, "#060412");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 512);
    ctx.fillStyle = "rgba(164,108,252,0.15)";
    ctx.beginPath();
    ctx.arc(128, 160, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(164,108,252,0.6)";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("H2H DIGITAL", 128, 210);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "11px Arial";
    ctx.fillText("Human to Human", 128, 230);
    const screenTex = new THREE.CanvasTexture(screenCanvas);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = 0.075;
    phone.add(screen);

    const notchGeo = new THREE.BoxGeometry(0.35, 0.07, 0.02);
    const notchMat = new THREE.MeshPhysicalMaterial({ color: 0x050505, metalness: 0.5, roughness: 0.3 });
    const notch = new THREE.Mesh(notchGeo, notchMat);
    notch.position.set(0, 1.34, 0.075);
    phone.add(notch);

    const homeGeo = new THREE.BoxGeometry(0.4, 0.04, 0.01);
    const homeIndicator = new THREE.Mesh(homeGeo, new THREE.MeshPhysicalMaterial({ color: 0x555555, metalness: 0.3, roughness: 0.5 }));
    homeIndicator.position.set(0, -1.3, 0.076);
    phone.add(homeIndicator);

    const btnMat = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.2 });
    const volUpGeo = new THREE.BoxGeometry(0.04, 0.3, 0.08);
    const volUp = new THREE.Mesh(volUpGeo, btnMat);
    volUp.position.set(-0.72, 0.6, 0);
    phone.add(volUp);
    const volDn = volUp.clone();
    volDn.position.set(-0.72, 0.2, 0);
    phone.add(volDn);
    const pwrGeo = new THREE.BoxGeometry(0.04, 0.4, 0.1);
    const pwr = new THREE.Mesh(pwrGeo, btnMat);
    pwr.position.set(0.72, 0.3, 0);
    phone.add(pwr);

    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const rGeo = new THREE.TorusGeometry(0.3 + i * 0.25, 0.015, 8, 40);
      const rMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.75 + i * 0.03, 0.9, 0.65),
        transparent: true,
        opacity: 0.6 - i * 0.15,
      });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.position.set(0.8, 1.2, 0.3);
      ring.rotation.x = Math.PI / 4;
      scene.add(ring);
      rings.push(ring);
    }

    const dots: THREE.Mesh[] = [];
    const dotColors = [0xa46cfc, 0xc084fc, 0x7c3aed];
    dotColors.forEach((c, i) => {
      const dGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const dMat = new THREE.MeshPhysicalMaterial({ color: c, emissive: c, emissiveIntensity: 0.8, metalness: 0.3, roughness: 0.3 });
      const dot = new THREE.Mesh(dGeo, dMat);
      dot.position.set(-0.55 + i * 0.55, -0.9, 0.12);
      phone.add(dot);
      dots.push(dot);
    });

    let t = 0;
    const clock = new THREE.Clock();

    function animate() {
      const raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      t += dt;

      phone.rotation.y = Math.sin(t * 0.8) * 0.35;
      phone.rotation.x = Math.sin(t * 0.5) * 0.12;
      phone.rotation.z = Math.sin(t * 0.6) * 0.08;
      phone.position.y = Math.sin(t * 1.2) * 0.15;
      phone.position.x = Math.sin(t * 0.7) * 0.08;

      rings.forEach((r, i) => {
        const scale = 1 + Math.sin(t * 2 + i * 0.8) * 0.3;
        r.scale.setScalar(scale);
        (r.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.5 - i * 0.1 + Math.sin(t * 2 + i) * 0.2);
        r.rotation.z = t * 0.5 + i * Math.PI / 3;
      });

      dots.forEach((d, i) => {
        d.position.y = -0.9 + Math.sin(t * 2 + i * 1.2) * 0.05;
        (d.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.6 + Math.sin(t * 3 + i) * 0.4;
      });

      renderer.render(scene, camera);
      return raf;
    }

    const rafId = animate();

    const handleResize = () => {
      if (!el) return;
      const nw = el.clientWidth;
      const nh = el.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />;
}

interface PageLoaderProps {
  onComplete: () => void;
}

export function PageLoader({ onComplete }: PageLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const DURATION = 3000;

    function tick(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const p = Math.min(elapsed / DURATION, 1);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setProgress(Math.round(eased * 100));
      if (p < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setExiting(true);
          setTimeout(onComplete, 800);
        }, 300);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#06040f" }}
        >
          <video
            src={VIDEO_URL}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.45 }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(164,108,252,0.12) 0%, transparent 70%), linear-gradient(to bottom, rgba(6,4,15,0.3) 0%, rgba(6,4,15,0.6) 100%)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-sm px-8">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center"
            >
              <H2HLogo height={52} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
              style={{ width: 160, height: 280 }}
            >
              <LoaderPhone />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full space-y-3"
            >
              <div className="flex justify-between items-center">
                <span
                  className="text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: "rgba(164,108,252,0.7)", fontFamily: "var(--font-stack-heading)" }}
                >
                  Loading
                </span>
                <span
                  className="text-[10px] tabular-nums"
                  style={{ color: "rgba(164,108,252,0.7)", fontFamily: "var(--font-stack-heading)" }}
                >
                  {progress}%
                </span>
              </div>

              <div
                className="w-full h-[2px] overflow-hidden"
                style={{ background: "rgba(164,108,252,0.15)" }}
              >
                <motion.div
                  className="h-full"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(to right, #7c3aed, #a46cfc, #c084fc)",
                    boxShadow: "0 0 8px rgba(164,108,252,0.8)",
                    transition: "width 0.12s linear",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="page-loader-exit"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999]"
          style={{ background: "#06040f", pointerEvents: "none" }}
        />
      )}
    </AnimatePresence>
  );
}
