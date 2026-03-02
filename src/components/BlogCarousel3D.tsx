import { useEffect, useRef, useState } from "react";
import THREE from "../lib/three";
import gsap from "gsap";
import { BLOG_POSTS, BlogPost } from "../constants/blog";
import { BlogOverlay } from "./BlogOverlay";

export function BlogCarousel3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer?: THREE.WebGLRenderer;
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    animationId?: number;
    blogGroups?: THREE.Group[];
    stage?: THREE.Group;
  }>({});

  const [isDragging, setIsDragging] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isTransitioningRef = useRef(false);
  const [selectedBlog, setSelectedBlog] =
    useState<BlogPost | null>(null);

  const dragStateRef = useRef({
    isDragging: false,
    previousMouseX: 0,
    previousMouseY: 0,
    rotationVelocityX: 0,
    rotationVelocityY: 0,
    targetRotationX: 0,
    targetRotationY: 0,
    startX: 0,
    startY: 0,
    hasMoved: false,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // --- 1. SCENE & ATMOSPHERE ---
    const scene = new THREE.Scene();
    const bgColor = 0x0a0f1e;
    scene.fog = new THREE.FogExp2(bgColor, 0.025);

    // --- 2. CAMERA ---
    const camera = new THREE.PerspectiveCamera(
      35, // Narrower FOV for telephoto lens effect
      containerRef.current.clientWidth /
        containerRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 3, 28); // Pushed further back for distant feel
    camera.lookAt(0, 0, 0);

    // --- 3. RENDERER ---
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: true,
    });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight,
    );
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 1.5),
    );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // --- 4. CRAZY STAGE LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Create multiple colored spotlights for stage effect
    const stageLights: Array<{ light: THREE.SpotLight; baseY: number; baseX: number; speed: number }> = [];

    const lightColors = [
      { color: 0xa46cfc, intensity: 8 },
      { color: 0xb181fc, intensity: 7 },
      { color: 0x291e56, intensity: 9 },
      { color: 0xa46cfc, intensity: 6 },
      { color: 0xfbfbfc, intensity: 4 },
      { color: 0xb181fc, intensity: 6 },
    ];

    lightColors.forEach((lightConfig, i) => {
      const spotlight = new THREE.SpotLight(lightConfig.color, lightConfig.intensity);
      const angle = (i / lightColors.length) * Math.PI * 2;
      const radius = 18;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      spotlight.position.set(x, 20, z);
      spotlight.angle = 0.6;
      spotlight.penumbra = 0.8;
      spotlight.distance = 50;
      spotlight.decay = 2;
      spotlight.castShadow = true;
      spotlight.target.position.set(0, 0, 0);

      scene.add(spotlight);
      scene.add(spotlight.target);

      stageLights.push({
        light: spotlight,
        baseX: x,
        baseY: 20,
        speed: 0.5 + Math.random() * 0.5
      });
    });

    // Main key light (white spotlight from above)
    const keyLight = new THREE.SpotLight(0xffffff, 12);
    keyLight.position.set(0, 25, 0);
    keyLight.angle = 0.5;
    keyLight.penumbra = 0.4;
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Rim lights for depth
    const rimLight1 = new THREE.SpotLight(0xa46cfc, 8);
    rimLight1.position.set(-20, 8, -20);
    rimLight1.angle = 0.8;
    scene.add(rimLight1);

    const rimLight2 = new THREE.SpotLight(0xb181fc, 8);
    rimLight2.position.set(20, 8, -20);
    rimLight2.angle = 0.8;
    scene.add(rimLight2);

    // --- 5. ENHANCED SPACE PARTICLES ---
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);

    const particleColors = [
      { r: 0.64, g: 0.42, b: 0.99 },
      { r: 0.69, g: 0.51, b: 0.99 },
      { r: 0.16, g: 0.12, b: 0.34 },
      { r: 1, g: 1, b: 1 },
      { r: 0.85, g: 0.8, b: 0.95 },
    ];

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 80;
      positions[i3 + 1] = (Math.random() - 0.5) * 60;
      positions[i3 + 2] = (Math.random() - 0.5) * 80;

      const colorChoice = particleColors[Math.floor(Math.random() * particleColors.length)];
      colors[i3] = colorChoice.r;
      colors[i3 + 1] = colorChoice.g;
      colors[i3 + 2] = colorChoice.b;

      sizes[i] = Math.random() * 0.15 + 0.05;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3),
    );
    particlesGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(sizes, 1),
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(
      particlesGeometry,
      particlesMaterial,
    );
    scene.add(particles);

    // --- 6. STAGE GROUP ---
    const stage = new THREE.Group();
    scene.add(stage);

    // Main Platform (Dark, reflective with glow)
    const platformGeometry = new THREE.CylinderGeometry(
      10,
      11,
      0.6,
      64,
    );
    const platformMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0f1e,
      metalness: 1,
      roughness: 0.05,
      envMapIntensity: 2,
      emissive: 0xa46cfc,
      emissiveIntensity: 0.2,
    });
    const platform = new THREE.Mesh(
      platformGeometry,
      platformMaterial,
    );
    platform.position.y = -3;
    platform.receiveShadow = true;
    platform.castShadow = true;
    stage.add(platform);

    // Platform Edge Glow
    const edgeGeometry = new THREE.TorusGeometry(10, 0.15, 16, 100);
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0xa46cfc,
      emissive: 0xa46cfc,
      emissiveIntensity: 1.5,
      metalness: 0.8,
      roughness: 0.2,
    });
    const edgeGlow = new THREE.Mesh(edgeGeometry, edgeMaterial);
    edgeGlow.rotation.x = Math.PI / 2;
    edgeGlow.position.y = -2.7;
    stage.add(edgeGlow);


    // --- 7. BLOG CARDS ---
    const blogGroups: THREE.Group[] = [];
    const textureLoader = new THREE.TextureLoader();

    BLOG_POSTS.forEach((post, index) => {
      const group = new THREE.Group();
      group.position.set(0, 0, 0);

      // Store original data for animation
      (group.userData as any).originalY = 0;
      (group.userData as any).phase = index * 0.2;

      // --- TEXT GENERATION HELPERS ---
      // We use canvas to generate high-res text textures
      const createTextSprite = (
        text: string,
        font: string,
        color: string,
        width: number,
        height: number,
        scale: [number, number, number],
        yPos: number,
        isMultiline = false,
      ) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return new THREE.Object3D();

        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.textAlign = "center";
        ctx.textBaseline = isMultiline ? "top" : "middle";

        if (isMultiline) {
          const words = text.split(" ");
          const maxWidth = width * 0.9;
          let line = "";
          let y = 10;
          const lineHeight = parseInt(font) * 1.2;

          words.forEach((word) => {
            const testLine = line + word + " ";
            if (
              ctx.measureText(testLine).width > maxWidth &&
              line !== ""
            ) {
              ctx.fillText(line, width / 2, y);
              line = word + " ";
              y += lineHeight;
            } else {
              line = testLine;
            }
          });
          ctx.fillText(line, width / 2, y);
        } else {
          ctx.fillText(text, width / 2, height / 2);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter; // Smooth scaling
        texture.generateMipmaps = false;

        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
          }),
        );
        sprite.scale.set(...scale);
        sprite.position.set(0, yPos, 0);
        return sprite;
      };

      // 1. Title
      group.add(
        createTextSprite(
          post.title.toUpperCase(),
          "bold 80px Impact, sans-serif",
          "#ffffff",
          2048,
          256,
          [8, 1, 1],
          2.5,
        ),
      );

      // 2. Category
      group.add(
        createTextSprite(
          post.category.toUpperCase(),
          "bold 48px Impact, sans-serif",
          "#A46CFC",
          512,
          128,
          [2.5, 0.6, 1],
          3.2,
        ),
      );

      // 3. Main Card (Image) - UPDATED to BoxGeometry for thickness
      const cardGeometry = new THREE.BoxGeometry(6, 4, 0.2); // Added depth
      const cardMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.4,
        metalness: 0.1,
      });
      // Load Texture
      textureLoader.load(post.img, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        cardMaterial.map = tex;
        cardMaterial.needsUpdate = true;
      });

      const cardMesh = new THREE.Mesh(
        cardGeometry,
        cardMaterial,
      );
      cardMesh.position.set(0, -0.5, 0);
      cardMesh.castShadow = true;
      group.add(cardMesh);

      // 4. Excerpt
      group.add(
        createTextSprite(
          post.excerpt,
          "40px Helvetica, Arial, sans-serif",
          "#e0e0e0",
          2048,
          512,
          [8, 2, 1],
          -3.5,
          true,
        ),
      );

      // 5. Meta
      group.add(
        createTextSprite(
          `${post.author.toUpperCase()} • ${post.date.toUpperCase()}`,
          "32px Impact, sans-serif",
          "#666666",
          1024,
          128,
          [5, 0.6, 1],
          -5,
        ),
      );

      // Initial state: Hidden (scaled down)
      group.scale.set(0, 0, 0);
      group.visible = false;

      stage.add(group);
      blogGroups.push(group);
    });

    // --- 8. INTERACTION LOGIC ---
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      dragStateRef.current.isDragging = true;
      setIsDragging(true);
      const clientX =
        "touches" in event
          ? event.touches[0].clientX
          : event.clientX;
      const clientY =
        "touches" in event
          ? event.touches[0].clientY
          : event.clientY;
      dragStateRef.current.previousMouseX = clientX;
      dragStateRef.current.previousMouseY = clientY;
      dragStateRef.current.startX = clientX;
      dragStateRef.current.startY = clientY;
      dragStateRef.current.hasMoved = false;
      if (containerRef.current)
        containerRef.current.style.cursor = "grabbing";
    };

    const onPointerMove = (event: MouseEvent | TouchEvent) => {
      if (!dragStateRef.current.isDragging) return;
      const clientX =
        "touches" in event
          ? event.touches[0].clientX
          : event.clientX;
      const clientY =
        "touches" in event
          ? event.touches[0].clientY
          : event.clientY;
      const deltaX =
        clientX - dragStateRef.current.previousMouseX;
      const deltaY =
        clientY - dragStateRef.current.previousMouseY;

      dragStateRef.current.rotationVelocityY = deltaX * 0.005;
      dragStateRef.current.rotationVelocityX = deltaY * 0.005;

      dragStateRef.current.targetRotationY +=
        dragStateRef.current.rotationVelocityY;
      dragStateRef.current.targetRotationX +=
        dragStateRef.current.rotationVelocityX;

      // Clamp vertical rotation
      dragStateRef.current.targetRotationX = Math.max(
        -Math.PI / 6,
        Math.min(
          Math.PI / 6,
          dragStateRef.current.targetRotationX,
        ),
      );

      dragStateRef.current.previousMouseX = clientX;
      dragStateRef.current.previousMouseY = clientY;

      if (
        Math.abs(clientX - dragStateRef.current.startX) > 5 ||
        Math.abs(clientY - dragStateRef.current.startY) > 5
      ) {
        dragStateRef.current.hasMoved = true;
      }
    };

    const onPointerUp = (event: MouseEvent | TouchEvent) => {
      if (!dragStateRef.current.isDragging) return;

      dragStateRef.current.isDragging = false;
      setIsDragging(false);
      if (containerRef.current)
        containerRef.current.style.cursor = "grab";
      if (!dragStateRef.current.hasMoved) {
        // Only open overlay if user clicked (not dragged)
        setSelectedBlog(BLOG_POSTS[currentBlog]);
      }
    };

    const container = containerRef.current;
    container.addEventListener("mousedown", onPointerDown);
    container.addEventListener("touchstart", onPointerDown, { passive: true });
    container.addEventListener("mousemove", onPointerMove);
    container.addEventListener("touchmove", onPointerMove, { passive: true });
    container.addEventListener("mouseup", onPointerUp);
    container.addEventListener("touchend", onPointerUp);

    // --- 9. ANIMATION LOOP ---
    const clock = new THREE.Clock();
    const animate = () => {
      sceneRef.current.animationId =
        requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Subtle camera breathing effect for cinematic depth
      camera.position.z = 28 + Math.sin(elapsed * 0.3) * 1.5;
      camera.position.y = 3 + Math.sin(elapsed * 0.2) * 0.3;
      camera.lookAt(0, 0, 0);

      // Smooth Stage Rotation
      stage.rotation.y +=
        (dragStateRef.current.targetRotationY -
          stage.rotation.y) *
        0.1;
      stage.rotation.x +=
        (dragStateRef.current.targetRotationX -
          stage.rotation.x) *
        0.1;

      if (!dragStateRef.current.isDragging) {
        // Very slow auto-rotation for cinematic effect
        dragStateRef.current.targetRotationY += 0.0005;
        dragStateRef.current.rotationVelocityX *= 0.95;
        dragStateRef.current.rotationVelocityY *= 0.95;
      }

      // Animate stage lights - crazy movement!
      stageLights.forEach((lightData, i) => {
        const { light, baseX, baseY, speed } = lightData;
        const offset = i * 2;

        // Circular motion around stage
        const angle = elapsed * speed + offset;
        const radius = 18 + Math.sin(elapsed * 0.5 + offset) * 3;
        light.position.x = Math.cos(angle) * radius;
        light.position.z = Math.sin(angle) * radius;

        // Bobbing up and down
        light.position.y = baseY + Math.sin(elapsed * 0.8 + offset) * 5;

        // Pulse intensity
        light.intensity = (lightColors[i].intensity + Math.sin(elapsed * 2 + offset) * 2);

        // Update target for dramatic effect
        light.target.position.set(
          Math.sin(elapsed * 0.3 + offset) * 2,
          0,
          Math.cos(elapsed * 0.3 + offset) * 2
        );
      });

      // Floating animation for active blog card
      if (blogGroups[currentBlog]) {
        blogGroups[currentBlog].position.y =
          Math.sin(elapsed * 0.8) * 0.2;
      }

      // Particle Drift - multiple rotations for dynamic feel
      particles.rotation.y = elapsed * 0.03;
      particles.rotation.x = Math.sin(elapsed * 0.02) * 0.1;

      // Pulse the edge glow
      if (edgeGlow) {
        edgeGlow.material.emissiveIntensity = 1.5 + Math.sin(elapsed * 2) * 0.5;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect =
        containerRef.current.clientWidth /
        containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight,
      );
    };
    window.addEventListener("resize", handleResize);

    sceneRef.current = {
      renderer,
      scene,
      camera,
      blogGroups,
      stage,
    } as any;

    return () => {
      if (sceneRef.current.animationId)
        cancelAnimationFrame(sceneRef.current.animationId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", onPointerDown);
      container.removeEventListener("touchstart", onPointerDown);
      container.removeEventListener("mousemove", onPointerMove);
      container.removeEventListener("touchmove", onPointerMove);
      container.removeEventListener("mouseup", onPointerUp);
      container.removeEventListener("touchend", onPointerUp);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((mat: any) => {
            if (mat.map) mat.map.dispose();
            mat.dispose();
          });
        }
        if (obj instanceof THREE.Sprite) {
          if (obj.material.map) obj.material.map.dispose();
          obj.material.dispose();
        }
      });

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []); // End of Mount

  // --- TRANSITION ANIMATIONS (GSAP) ---
  useEffect(() => {
    if (!sceneRef.current.blogGroups) return;
    setIsTransitioning(true);
    isTransitioningRef.current = true;
    const { blogGroups } = sceneRef.current;

    // 1. Hide all groups (Fade out & Move down)
    blogGroups.forEach((group, index) => {
      if (index !== currentBlog) {
        gsap.to(group.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.5,
          ease: "power2.in",
        });
        gsap.to(group.position, {
          y: -5,
          duration: 0.5,
          ease: "power2.in",
        });
        group.visible = false;
      }
    });

    // 2. Show current group (Fade in & Move up from bottom)
    const currentGroup = blogGroups[currentBlog];
    if (currentGroup) {
      currentGroup.visible = true;

      // Reset position slightly lower before animating up
      currentGroup.position.y = -5;

      // Scale Up
      gsap.to(currentGroup.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.8,
        ease: "back.out(1.2)", // Bouncy effect
        delay: 0.1,
      });

      // Move Up
      gsap.to(currentGroup.position, {
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.1,
        onComplete: () => {
          setIsTransitioning(false);
          isTransitioningRef.current = false;
        },
      });
    }
  }, [currentBlog]);

  // --- SCROLL NAVIGATION ---
  useEffect(() => {
    let lastScrollTime = 0;
    const handleWheel = (event: WheelEvent) => {
      if (isTransitioningRef.current) return;
      const now = Date.now();
      if (now - lastScrollTime < 1200) return;

      event.preventDefault();
      if (event.deltaY > 0) {
        setCurrentBlog((prev) => (prev + 1) % BLOG_POSTS.length);
      } else {
        setCurrentBlog((prev) => (prev - 1 + BLOG_POSTS.length) % BLOG_POSTS.length);
      }
      lastScrollTime = now;
    };

    const container = containerRef.current;
    if (container)
      container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      if (container)
        container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    // FIX: Full Screen Container with overflow hidden
    <div
      className="relative w-full h-[100vh] min-h-[800px] overflow-hidden"
      style={{
        backgroundImage: 'url(https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#0a0f1e',
      }}
    >
      {/* UI Overlay */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 text-center pointer-events-none w-full px-4">
        <span
          className="text-[#A46CFC] text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4 block drop-shadow-lg"
          style={{ fontFamily: "var(--font-stack-heading)" }}
        >
          Insights
        </span>
        <h2
          className="text-white text-4xl md:text-6xl lg:text-7xl tracking-tight drop-shadow-xl mb-4"
          style={{
            fontFamily: "var(--font-stack-heading)",
            textShadow: '0 0 20px rgba(164, 108, 252, 0.4)'
          }}
        >
          Latest Thinking
        </h2>
        <div className="flex justify-center gap-2 mt-6">
          {BLOG_POSTS.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${i === currentBlog ? "w-8 bg-[#A46CFC]" : "w-2 bg-white/20"}`}
              style={i === currentBlog ? {
                boxShadow: '0 0 10px rgba(164, 108, 252, 0.8)'
              } : {}}
            />
          ))}
        </div>
      </div>

      {/* 3D Canvas */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-10"
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none",
        }}
      />

      {/* Bottom Gradient Mask */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none" />

      {/* Top Gradient Mask */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/60 to-transparent z-20 pointer-events-none" />

      {/* Navigation Hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 text-center pointer-events-none">
        <p
          className="text-white/40 text-[10px] tracking-[0.3em] uppercase"
          style={{ fontFamily: "var(--font-stack-heading)" }}
        >
          Scroll to Navigate
        </p>
      </div>

      {/* Blog Detail Overlay */}
      {selectedBlog && (
        <BlogOverlay
          post={selectedBlog}
          onClose={() => setSelectedBlog(null)}
          onNavigate={(p) => setSelectedBlog(p)}
        />
      )}
    </div>
  );
}