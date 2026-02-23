import { useEffect, useRef } from "react";
import * as THREE from "three";

export function DancingPhone() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const w = el.clientWidth;
    const h = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.shadowMap.enabled = true;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(3, 5, 4);
    key.castShadow = true;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x88ccff, 0.5);
    fill.position.set(-3, -2, 3);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffd0a0, 0.4);
    rim.position.set(0, -4, -3);
    scene.add(rim);

    // Phone group
    const phone = new THREE.Group();
    scene.add(phone);

    // Body
    const bodyGeo = new THREE.BoxGeometry(1.4, 2.8, 0.14);
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x111111,
      metalness: 0.6,
      roughness: 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    phone.add(body);

    // Screen
    const screenGeo = new THREE.PlaneGeometry(1.15, 2.45);
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 256;
    screenCanvas.height = 512;
    const ctx = screenCanvas.getContext("2d")!;

    const grad = ctx.createLinearGradient(0, 0, 256, 512);
    grad.addColorStop(0, "#0a0a1a");
    grad.addColorStop(0.4, "#0d1b3e");
    grad.addColorStop(1, "#0a1a0d");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 512);

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.arc(128, 128, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.beginPath();
    ctx.arc(128, 320, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(100,200,255,0.6)";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.fillText("CONNECT", 128, 200);

    const drawRoundRect = (x: number, y: number, rw: number, rh: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + rw - r, y);
      ctx.quadraticCurveTo(x + rw, y, x + rw, y + r);
      ctx.lineTo(x + rw, y + rh - r);
      ctx.quadraticCurveTo(x + rw, y + rh, x + rw - r, y + rh);
      ctx.lineTo(x + r, y + rh);
      ctx.quadraticCurveTo(x, y + rh, x, y + rh - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
    };
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    drawRoundRect(50, 280, 156, 40, 8);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "14px Arial";
    ctx.fillText("Get in Touch", 128, 306);

    const screenTex = new THREE.CanvasTexture(screenCanvas);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = 0.075;
    phone.add(screen);

    // Notch
    const notchGeo = new THREE.BoxGeometry(0.35, 0.07, 0.02);
    const notchMat = new THREE.MeshPhysicalMaterial({ color: 0x050505, metalness: 0.5, roughness: 0.3 });
    const notch = new THREE.Mesh(notchGeo, notchMat);
    notch.position.set(0, 1.34, 0.075);
    phone.add(notch);

    // Home indicator
    const homeGeo = new THREE.BoxGeometry(0.4, 0.04, 0.01);
    const homeIndicator = new THREE.Mesh(homeGeo, new THREE.MeshPhysicalMaterial({ color: 0x555555, metalness: 0.3, roughness: 0.5 }));
    homeIndicator.position.set(0, -1.3, 0.076);
    phone.add(homeIndicator);

    // Side buttons
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

    // Floating signal rings
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const rGeo = new THREE.TorusGeometry(0.3 + i * 0.25, 0.015, 8, 40);
      const rMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.55 + i * 0.05, 0.9, 0.6),
        transparent: true,
        opacity: 0.6 - i * 0.15,
      });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.position.set(0.8, 1.2, 0.3);
      ring.rotation.x = Math.PI / 4;
      scene.add(ring);
      rings.push(ring);
    }

    // Small notification dots
    const dots: THREE.Mesh[] = [];
    const dotColors = [0xff4466, 0x44ffaa, 0xffaa44];
    dotColors.forEach((c, i) => {
      const dGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const dMat = new THREE.MeshPhysicalMaterial({ color: c, emissive: c, emissiveIntensity: 0.5, metalness: 0.3, roughness: 0.3 });
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
        (d.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.4 + Math.sin(t * 3 + i) * 0.3;
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

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
    />
  );
}
