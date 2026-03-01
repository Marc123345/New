import React, { useEffect, useRef } from "react";
// Assuming you have a local wrapper, but standard Three.js import is used here for compatibility.
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

    // Increased radius and smoothstep for a softer, wider fluid spread
    float radius = 0.12; 
    float dist = distance(uv, mouse);
    float strength = smoothstep(radius, 0.0, dist);

    // Boosted force multiplier for more reactive trails
    vec2 force = vel * strength * 12.0; 
    vec2 color = prev.rg + force;

    // Adjusted damping: 0.98 makes the trail last slightly longer (was 0.965)
    color *= 0.98;

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
    float head = smoothstep(0.06, 0.0, dist);

    // UI Improvement: Dynamic colors based on velocity (len)
    vec3 colorSlow = vec3(0.486, 0.016, 0.988); // Deep Purple
    vec3 colorFast = vec3(0.0, 0.8, 1.0);       // Neon Cyan
    
    // Mix the colors based on how much fluid force is present
    vec3 trailColor = mix(colorSlow, colorFast, min(len * 4.0, 1.0));
    vec3 headColor = vec3(1.0, 1.0, 1.0); // White hot center

    float trailAlpha = smoothstep(0.0, 0.15, len) * 0.8;
    float headAlpha = head * 0.9;

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
    
    // Scale canvas for crisp UI, but keep simulation resolution standard for performance
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
    let isFirstMove = true; // Prevents sudden splatters on initial entry

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
      blending: THREE.AdditiveBlending, // Makes the glow pop beautifully against dark backgrounds
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
      isFirstMove = true; // Reset so returning to the screen doesn't draw a line
    };

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      
      // Recreate render targets to match new screen dimensions
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
      
      // If the mouse isn't on screen, we slowly fade out the buffer but skip heavy calculations
      if (!hasEntered) {
        prevMouse.copy(mouse); // Keeps velocity at 0 when idle
      }

      fluidMat.uniforms.uPrev.value = rtA.texture;
      fluidMat.uniforms.uMouse.value = mouse;
      fluidMat.uniforms.uPrevMouse.value = prevMouse;

      // 1. Render fluid simulation step
      renderer.setRenderTarget(rtB);
      renderer.render(fluidScene, camera);
      renderer.setRenderTarget(null);

      // Swap buffers (Ping-Pong)
      const tmp = rtA;
      rtA = rtB;
      rtB = tmp;

      // 2. Render final glowing output to screen
      glowMat.uniforms.uFluid.value = rtA.texture;
      glowMat.uniforms.uMouse.value = mouse;

      renderer.render(glowScene, camera);

      // Always sync prevMouse for the next frame
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
      
      // Memory cleanup
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
        mixBlendMode: "screen", // Excellent for glowing UI effects over dark backgrounds
      }}
    />
  );
}