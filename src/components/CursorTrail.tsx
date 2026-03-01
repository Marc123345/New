import React, { useEffect, useRef } from "react";
import * as THREE from "three"; 

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FLUID_FRAG = `
  precision highp float;
  uniform sampler2D uPrev;
  uniform vec2 uMouse;
  uniform vec2 uPrevMouse;
  uniform float uAspect;
  varying vec2 vUv;

  void main() {
    vec4 prev = texture2D(uPrev, vUv);

    vec2 uv = vUv;
    uv.x *= uAspect;

    vec2 mouse = uMouse;
    mouse.x *= uAspect;

    vec2 pmouse = uPrevMouse;
    pmouse.x *= uAspect;

    vec2 vel = mouse - pmouse;
    float speed = length(vel);

    // 1. SMALLER: Reduced radius from 0.12 to 0.04
    float radius = 0.04; 
    float dist = distance(uv, mouse);
    float strength = smoothstep(radius, 0.0, dist);

    // 2. WEAKER: Reduced force from 12.0 to 4.0
    vec2 force = vel * strength * 4.0; 
    vec2 color = prev.rg + force;

    // 3. FASTER FADE: Reduced damping from 0.98 to 0.92 so it doesn't linger
    color *= 0.92;

    gl_FragColor = vec4(color, 0.0, 1.0);
  }
`;

const GLOW_FRAG = `
  precision highp float;
  uniform sampler2D uFluid;
  uniform vec2 uMouse;
  uniform float uAspect;
  varying vec2 vUv;

  void main() {
    vec2 fluid = texture2D(uFluid, vUv).rg;
    float len = length(fluid);

    vec2 uv = vUv;
    uv.x *= uAspect;
    vec2 mouse = uMouse;
    mouse.x *= uAspect;

    float dist = distance(uv, mouse);
    // Smaller head point
    float head = smoothstep(0.03, 0.0, dist); 

    // 4. STRICTLY PURPLE: Locked the color palette to purple hues
    vec3 colorSlow = vec3(0.4, 0.1, 0.8);  // Deep Purple
    vec3 colorFast = vec3(0.7, 0.3, 1.0);  // Bright Neon Purple
    
    vec3 trailColor = mix(colorSlow, colorFast, min(len * 8.0, 1.0));
    vec3 headColor = vec3(0.9, 0.7, 1.0);  // Very light purple center

    // Reduced alpha overall so it's less visually overpowering
    float trailAlpha = smoothstep(0.0, 0.08, len) * 0.6;
    float headAlpha = head * 0.7;

    float alpha = max(trailAlpha, headAlpha);
    vec3 col = mix(trailColor, headColor, head);

    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true, 
      antialias: false,
      powerPreference: "high-performance" 
    });
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geo = new THREE.PlaneGeometry(2, 2);

    const createRT = () =>
      new THREE.WebGLRenderTarget(width, height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType,
      });

    let rtA = createRT();
    let rtB = createRT();

    const mouse = new THREE.Vector2(-1, -1);
    const prevMouse = new THREE.Vector2(-1, -1);
    let hasEntered = false;
    let isFirstMove = true; 

    const fluidMat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FLUID_FRAG,
      uniforms: {
        uPrev: { value: null },
        uMouse: { value: mouse },
        uPrevMouse: { value: prevMouse },
        uAspect: { value: width / height },
      },
    });

    const glowMat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: GLOW_FRAG,
      uniforms: {
        uFluid: { value: null },
        uMouse: { value: mouse },
        uAspect: { value: width / height },
      },
      transparent: true,
      blending: THREE.AdditiveBlending, 
      depthWrite: false,
    });

    const fluidMesh = new THREE.Mesh(geo, fluidMat);
    const glowMesh = new THREE.Mesh(geo, glowMat);

    const fluidScene = new THREE.Scene();
    fluidScene.add(fluidMesh);

    const glowScene = new THREE.Scene();
    glowScene.add(glowMesh);

    const updateMouse = (clientX: number, clientY: number) => {
      const x = clientX / width;
      const y = 1.0 - clientY / height;

      if (isFirstMove) {
        prevMouse.set(x, y);
        mouse.set(x, y);
        isFirstMove = false;
      } else {
        prevMouse.copy(mouse);
        mouse.set(x, y);
      }
      hasEntered = true;
    };

    const onMouseMove = (e: MouseEvent) => updateMouse(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateMouse(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onMouseLeave = () => {
      hasEntered = false;
      isFirstMove = true; 
    };

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      
      rtA.dispose();
      rtB.dispose();
      rtA = createRT();
      rtB = createRT();
      
      fluidMat.uniforms.uAspect.value = width / height;
      glowMat.uniforms.uAspect.value = width / height;
    };

    let rafId: number;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      
      if (!hasEntered) {
        prevMouse.copy(mouse); 
      }

      fluidMat.uniforms.uPrev.value = rtA.texture;
      fluidMat.uniforms.uMouse.value = mouse;
      fluidMat.uniforms.uPrevMouse.value = prevMouse;

      renderer.setRenderTarget(rtB);
      renderer.render(fluidScene, camera);
      renderer.setRenderTarget(null);

      const tmp = rtA;
      rtA = rtB;
      rtB = tmp;

      glowMat.uniforms.uFluid.value = rtA.texture;
      glowMat.uniforms.uMouse.value = mouse;

      renderer.render(glowScene, camera);

      prevMouse.copy(mouse);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchend", onMouseLeave);
    window.addEventListener("resize", onResize);
    
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchend", onMouseLeave);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
      
      renderer.dispose();
      rtA.dispose();
      rtB.dispose();
      geo.dispose();
      fluidMat.dispose();
      glowMat.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "screen",
      }}
    />
  );
}