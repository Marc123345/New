import { useEffect, useRef } from "react";
import THREE from "../lib/three";

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

    float radius = 0.08;
    float dist = distance(uv, mouse);
    float strength = smoothstep(radius, 0.0, dist);

    vec2 force = vel * strength * 8.0;
    vec2 color = prev.rg + force;

    color *= 0.965;

    gl_FragColor = vec4(color, 0.0, 1.0);
  }
`;

const RENDER_FRAG = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform sampler2D uFluid;
  varying vec2 vUv;

  void main() {
    vec2 fluid = texture2D(uFluid, vUv).rg;
    vec2 uv = vUv + fluid * 0.012;
    vec4 color = texture2D(uTexture, uv);
    gl_FragColor = color;
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
    float head = smoothstep(0.055, 0.0, dist);

    vec3 trailColor = vec3(0.644, 0.424, 0.988);
    vec3 headColor = vec3(0.486, 0.016, 0.988);

    float trailAlpha = smoothstep(0.0, 0.18, len) * 0.7;
    float headAlpha = head * 0.85;

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

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(1);
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

    const onMouseMove = (e: MouseEvent) => {
      prevMouse.copy(mouse);
      mouse.set(e.clientX / width, 1 - e.clientY / height);
      hasEntered = true;
    };

    const onMouseLeave = () => {
      hasEntered = false;
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
      if (!hasEntered) return;

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
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", onResize);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
      renderer.dispose();
      rtA.dispose();
      rtB.dispose();
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
