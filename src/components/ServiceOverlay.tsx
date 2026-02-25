import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  Globe,
  Users,
  Target,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { ServiceCardOverlay } from "./ServiceCardOverlay";

const SERVICES = [
  {
    id: 1,
    title: "Company Pages",
    fullTitle: "Company Pages",
    category: "3-Pillar Ecosystem",
    description:
      "Strategic company page management that builds brand authority and engages your professional community.",
    icon: Globe,
    color: "#7B2FF2",
    bgColor: "#7B2FF2",
    details: [],
  },
  {
    id: 2,
    title: "Leadership Branding",
    fullTitle: "Leadership Branding",
    category: "3-Pillar Ecosystem",
    description:
      "Elevate your executives into thought leaders with strategic personal branding and content.",
    icon: Users,
    color: "#9B59F5",
    bgColor: "#9B59F5",
    details: [],
  },
  {
    id: 3,
    title: "Advocacy Program",
    fullTitle: "Advocacy Program",
    category: "3-Pillar Ecosystem",
    description:
      "Turn your team into brand ambassadors with structured employee advocacy programs.",
    icon: TrendingUp,
    color: "#B181FC",
    bgColor: "#B181FC",
    details: [],
  },
  {
    id: 4,
    title: "Website Design + SEO",
    fullTitle: "Website Design + SEO",
    category: "Digital Foundation",
    description:
      "Your website is often your first impression. We make sure it's the right one. Beautiful, high-converting websites with SEO built in from day one.",
    icon: Globe,
    color: "#6610E6",
    bgColor: "#6610E6",
    details: [
      "Strategic design & copywriting",
      "Responsive build (mobile-first)",
      "SEO fundamentals baked in",
      "Optional blog + content hub setup",
    ],
  },
  {
    id: 5,
    title: "Paid Campaigns",
    fullTitle: "Paid Campaigns",
    category: "Growth",
    description:
      "Great content deserves an audience. We create and manage paid campaigns that amplify your message and drive real business outcomes.",
    icon: Target,
    color: "#e8e2ff",
    bgColor: "#1a1535",
    details: [
      "Paid strategy & audience targeting",
      "Ad copy and creative production",
      "Optimization & A/B testing",
      "Transparent reporting",
    ],
  },
  {
    id: 6,
    title: "Content Writing",
    fullTitle: "Content Writing",
    category: "Storytelling",
    description:
      "When it comes to storytelling, words matter! We craft clear, engaging, and on-brand content that connects.",
    icon: Sparkles,
    color: "#C9A3FF",
    bgColor: "#C9A3FF",
    details: [
      "Social captions and campaigns",
      "Long-form blog and thought leadership",
      "Executive ghostwriting",
      "Email and web copy",
    ],
  },
];

export function ArcSlider() {
  const wheelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [overlayService, setOverlayService] = useState<typeof SERVICES[number] | null>(null);
  const activeIndexRef = useRef(0);

  // --- CONFIGURATION ---
  const THETA = 22; // Slightly wider angle to prevent overlap clustering
  const RADIUS = 1400; // Tighter arc radius

  // --- VISUAL UPDATE FUNCTION ---
  const updateCardVisuals = (currentRotation: number) => {
    SERVICES.forEach((_, i) => {
      const card = cardsRef.current[i];
      if (!card) return;

      const rawAngle = currentRotation + i * THETA;
      const distance = Math.abs(rawAngle);

      // UPGRADE: Dynamic Depth of Field (Scale, Opacity, and Blur)
      if (distance < THETA * 1.5) {
        const progress = 1 - distance / (THETA * 1.5);
        
        // More dramatic scale difference between active and background
        const scale = 0.85 + 0.15 * progress; 
        const opacity = 0.4 + 0.6 * progress;
        const blurAmount = 6 - (6 * progress); // Max 6px blur for inactive

        gsap.set(card, {
          scale: scale,
          opacity: opacity,
          filter: `blur(${blurAmount}px)`,
          zIndex: Math.round(10 + progress * 10),
        });
      } else {
        // Deep background state
        gsap.set(card, {
          scale: 0.85,
          opacity: 0.25, // Fall far back
          filter: "blur(6px)",
          zIndex: 1,
        });
      }
    });
  };

  useEffect(() => {
    const wheel = wheelRef.current;
    const container = containerRef.current;
    if (!wheel || !container) return;

    const totalCards = SERVICES.length;
    const maxRotation = 0;
    const minRotation = -((totalCards - 1) * THETA);

    // 1. Setup initial state
    gsap.set(wheel, {
      y: RADIUS,
      transformOrigin: "50% 50%",
      rotation: 0,
    });

    SERVICES.forEach((_, i) => {
      if (cardsRef.current[i]) {
        gsap.set(cardsRef.current[i], {
          rotation: i * THETA,
          transformOrigin: `50% ${RADIUS}px`,
          x: 0,
          y: -RADIUS,
        });
      }
    });

    // 2. Drag Logic
    let isDragging = false;
    let startX = 0;
    let rotationAtStart = 0;

    const handleMove = (currentX: number) => {
      const dx = currentX - startX;
      let newRotation = rotationAtStart + dx / 4; // Slightly more sensitive dragging

      if (newRotation > maxRotation) newRotation = maxRotation;
      if (newRotation < minRotation) newRotation = minRotation;

      gsap.set(wheel, { rotation: newRotation });
      updateCardVisuals(newRotation);

      const newIndex = Math.round(Math.abs(newRotation / THETA));
      if (newIndex !== activeIndexRef.current) {
        activeIndexRef.current = newIndex;
        setActiveIndex(newIndex);
      }
    };

    const onStart = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      startX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      rotationAtStart = gsap.getProperty(wheel, "rotation") as number;
      gsap.killTweensOf(wheel);
      
      if (container) {
        container.style.cursor = "grabbing";
      }
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const x = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      handleMove(x);
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;

      if (container) {
        container.style.cursor = "grab";
      }

      const currentR = gsap.getProperty(wheel, "rotation") as number;
      const snappedR = Math.round(currentR / THETA) * THETA;

      gsap.to(wheel, {
        rotation: snappedR,
        duration: 0.6, // Smoother snap back
        ease: "power3.out",
        onUpdate: () =>
          updateCardVisuals(gsap.getProperty(wheel, "rotation") as number),
      });
      
      const index = Math.round(Math.abs(snappedR / THETA));
      if (index !== activeIndexRef.current) {
        activeIndexRef.current = index;
        setActiveIndex(index);
      }
    };

    // 3. Attach listeners
    container.addEventListener("mousedown", onStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    container.addEventListener("touchstart", onStart, { passive: false });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);

    updateCardVisuals(0);

    return () => {
      gsap.killTweensOf(wheel);
      container.removeEventListener("mousedown", onStart);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      container.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, []);

  const navigateTo = (index: number) => {
    const wheel = wheelRef.current;
    if (!wheel) return;

    const targetRotation = -(index * THETA);
    
    gsap.to(wheel, {
      rotation: targetRotation,
      duration: 0.8,
      ease: "power3.inOut", // Better easing for nav clicks
      onUpdate: () => {
        updateCardVisuals(gsap.getProperty(wheel, "rotation") as number);
      },
    });
    
    activeIndexRef.current = index;
    setActiveIndex(index);
  };

  return (
    <>
      <div className="relative w-full bg-[var(--color-background-light)] py-20 overflow-hidden flex flex-col items-center">
        
        {/* Subtle background dynamic glow to fill whitespace */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(164,108,252,0.05) 0%, transparent 60%)'
        }} />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-30 text-center px-8 tracking-tight"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontFamily: "var(--font-stack-heading)",
            color: "var(--color-text-dark)",
            marginBottom: "clamp(3rem, 6vw, 5rem)", // WHITESPACE FIX: Tightened massive gap
            lineHeight: 1,
          }}
        >
          <span
            className="text-xs tracking-[0.3em] mb-4 block uppercase font-bold"
            style={{ fontFamily: "var(--font-stack-heading)", color: "var(--color-secondary)" }}
          >
            Our Capabilities
          </span>
          Services
        </motion.h2>

        {/* Dynamic Context: 'Drag to explore' hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute z-10 hidden md:flex items-center gap-3 text-[var(--color-secondary)] opacity-50 uppercase tracking-[0.2em] text-[0.65rem] font-bold"
          style={{ top: '50%', left: '4vw', transform: 'translateY(-50%)', writingMode: 'vertical-rl', transformOrigin: 'center' }}
        >
          <span className="animate-bounce">↓</span> Drag to explore
        </motion.div>

        {/* The Interaction Zone */}
        <div
          ref={containerRef}
          className="relative w-full cursor-grab active:cursor-grabbing"
          style={{
            height: "clamp(480px, 60vh, 550px)", // WHITESPACE FIX: Responsive container height
            overflow: "visible",
            marginBottom: "clamp(3rem, 6vw, 5rem)", // WHITESPACE FIX: Tightened bottom gap
            userSelect: "none",
            WebkitUserSelect: "none",
            touchAction: "pan-y", 
            zIndex: 20,
          }}
        >
          {/* The Giant Wheel */}
          <div
            ref={wheelRef}
            className="absolute left-1/2 top-0 w-0 h-0"
          >
            {SERVICES.map((service, i) => {
              const IconComponent = service.icon;
              const textColor = "#FFFFFF";

              return (
                <div
                  key={service.id}
                  ref={(el) => (cardsRef.current[i] = el)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-[320px] md:w-[380px] aspect-[3/4] overflow-hidden will-change-transform"
                  style={{
                    top: 0,
                    left: 0,
                    backgroundColor: service.bgColor,
                    pointerEvents: "auto",
                    border: '1px solid rgba(255,255,255,0.15)', // Refined border
                    boxShadow: '0 24px 48px -12px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2)', // Dynamic deep shadow + rim light
                    borderRadius: '2px',
                  }}
                >
                  {/* Internal Card Hover Effect */}
                  <div className="absolute inset-0 bg-white/0 hover:bg-white/5 transition-colors duration-300 z-0 pointer-events-none" />
                  
                  {/* Card Content */}
                  <div className="relative z-10 h-full w-full p-8 md:p-10 flex flex-col justify-between">
                    {/* Top: Category & Icon */}
                    <div className="flex justify-between items-start">
                      <div>
                        <span
                          className="text-[0.65rem] tracking-[0.25em] opacity-60 font-bold block mb-2"
                          style={{
                            fontFamily: "var(--font-stack-heading)",
                            color: textColor,
                          }}
                        >
                          SERVICE {String(service.id).padStart(2, "0")}
                        </span>
                        <span
                          className="text-xs tracking-[0.15em] opacity-80 uppercase"
                          style={{
                            fontFamily: "var(--font-stack-heading)",
                            color: textColor,
                          }}
                        >
                          {service.category}
                        </span>
                      </div>
                      <div
                        className="w-12 h-12 flex items-center justify-center opacity-30 bg-white/10 rounded-full"
                        style={{ color: textColor }}
                      >
                        <IconComponent size={24} strokeWidth={1.5} />
                      </div>
                    </div>

                    {/* Middle: Title + Learn More */}
                    <div>
                      <h3
                        className="tracking-tight leading-[0.9] mb-8"
                        style={{
                          fontSize: "clamp(1.75rem, 4vw, 2.5rem)", // Slightly refined font scaling
                          fontFamily: "var(--font-stack-heading)",
                          color: textColor,
                        }}
                      >
                        {service.fullTitle}
                      </h3>

                      <button
                        onClick={(e) => { e.stopPropagation(); setOverlayService(service); }}
                        className="group inline-flex items-center gap-3 transition-all duration-300"
                        style={{
                          fontFamily: 'var(--font-stack-heading)',
                          fontSize: '0.7rem',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          color: textColor,
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          padding: '12px 24px',
                          cursor: 'pointer',
                          pointerEvents: 'auto',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                      >
                        Learn More
                        <span
                          className="transition-transform duration-300 group-hover:translate-x-2"
                          style={{ display: 'inline-block' }}
                        >
                          →
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation (Synced) */}
        <div className="relative z-20 flex gap-3 mt-4">
          {SERVICES.map((_, i) => (
            <button
              key={i}
              onClick={() => navigateTo(i)}
              className="group relative pointer-events-auto p-2"
              aria-label={`Go to service ${i + 1}`}
            >
              <div
                className={`w-10 h-[2px] rounded-full transition-all duration-500 ease-out ${
                  i === activeIndex
                    ? "bg-[var(--color-secondary)] scale-y-150"
                    : "bg-[var(--color-text-dark)]/10 group-hover:bg-[var(--color-text-dark)]/30"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <ServiceCardOverlay
        service={overlayService}
        onClose={() => setOverlayService(null)}
      />
    </>
  );
}