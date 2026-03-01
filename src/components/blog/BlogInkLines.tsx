import { useEffect, useRef } from "react";
import * as THREE from "three";

export function BlogInkLines() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    let triggered = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !triggered) {
          triggered = true;
          init();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    let renderer: THREE.WebGLRenderer;
    let animId: number;
    let scene: THREE.Scene;
    let camera: THREE.OrthographicCamera;
    const lineObjects: {
      line: THREE.Line;
      totalPoints: THREE.Vector3[];
      drawn: number;
      speed: number;
      delay: number;
      elapsed: number;
    }[] = [];

    function init() {
      const w = container!.clientWidth;
      const h = container!.clientHeight;

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(0, w, h, 0, -10, 10);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container!.appendChild(renderer.domElement);

      const lineDefs = [
        {
          points: [
            new THREE.Vector3(0, h * 0.22, 0),
            new THREE.Vector3(w * 0.25, h * 0.18, 0),
            new THREE.Vector3(w * 0.55, h * 0.25, 0),
            new THREE.Vector3(w * 0.8, h * 0.15, 0),
            new THREE.Vector3(w, h * 0.2, 0),
          ],
          speed: 1.8,
          delay: 0,
          opacity: 0.07,
          color: 0x291e56,
        },
        {
          points: [
            new THREE.Vector3(0, h * 0.5, 0),
            new THREE.Vector3(w * 0.15, h * 0.45, 0),
            new THREE.Vector3(w * 0.4, h * 0.52, 0),
            new THREE.Vector3(w * 0.65, h * 0.46, 0),
            new THREE.Vector3(w * 0.88, h * 0.55, 0),
            new THREE.Vector3(w, h * 0.48, 0),
          ],
          speed: 2.2,
          delay: 0.3,
          opacity: 0.05,
          color: 0xa46cfc,
        },
        {
          points: [
            new THREE.Vector3(w * 0.1, h * 0.78, 0),
            new THREE.Vector3(w * 0.3, h * 0.72, 0),
            new THREE.Vector3(w * 0.6, h * 0.8, 0),
            new THREE.Vector3(w * 0.85, h * 0.74, 0),
            new THREE.Vector3(w, h * 0.78, 0),
          ],
          speed: 1.6,
          delay: 0.6,
          opacity: 0.06,
          color: 0x291e56,
        },
        {
          points: [
            new THREE.Vector3(0, h * 0.35, 0),
            new THREE.Vector3(w * 0.2, h * 0.3, 0),
            new THREE.Vector3(w * 0.5, h * 0.38, 0),
            new THREE.Vector3(w * 0.75, h * 0.32, 0),
            new THREE.Vector3(w, h * 0.36, 0),
          ],
          speed: 2.0,
          delay: 0.15,
          opacity: 0.04,
          color: 0xb181fc,
        },
      ];

      for (const def of lineDefs) {
        const curve = new THREE.CatmullRomCurve3(def.points);
        const totalPoints = curve.getPoints(80);

        const geo = new THREE.BufferGeometry().setFromPoints([totalPoints[0]]);
        const mat = new THREE.LineBasicMaterial({
          color: def.color,
          transparent: true,
          opacity: def.opacity,
        });
        const line = new THREE.Line(geo, mat);
        scene.add(line);

        lineObjects.push({
          line,
          totalPoints,
          drawn: 1,
          speed: def.speed,
          delay: def.delay,
          elapsed: 0,
        });
      }

      let frameElapsed = 0;
      const tick = () => {
        animId = requestAnimationFrame(tick);
        frameElapsed += 0.016;

        let allDone = true;
        for (const lo of lineObjects) {
          if (frameElapsed < lo.delay) {
            allDone = false;
            continue;
          }
          const pointsToAdd = Math.ceil(lo.speed);
          lo.drawn = Math.min(lo.drawn + pointsToAdd, lo.totalPoints.length);
          if (lo.drawn < lo.totalPoints.length) allDone = false;

          const pts = lo.totalPoints.slice(0, lo.drawn);
          lo.line.geometry.setFromPoints(pts);
        }

        renderer.render(scene, camera);

        if (allDone) {
          cancelAnimationFrame(animId);
        }
      };
      tick();
    }

    const onResize = () => {
      if (!renderer || !scene || !camera) return;
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      camera.right = w;
      camera.top = h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      if (renderer) {
        renderer.dispose();
        if (container && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
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
