import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  Globe,
  Users,
  Target,
  TrendingUp,
  Sparkles,
} from "lucide-react";

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
  // We use a ref to track the active index during the drag loop
  // to avoid reading stale state in the event listener
  const activeIndexRef = useRef(0);

  // --- CONFIGURATION ---
  const THETA = 20; // Angle between cards
  const RADIUS = 1500; // Arc radius

  // --- VISUAL UPDATE FUNCTION ---
  const updateCardVisuals = (currentRotation: number) => {
    SERVICES.forEach((_, i) => {
      const card = cardsRef.current[i];
      if (!card) return;

      const rawAngle = currentRotation + i * THETA;
      const distance = Math.abs(rawAngle);

      if (distance < THETA * 1.5) {
        const progress = 1 - distance / (THETA * 1.5);
        const scale = 0.92 + 0.08 * progress;

        gsap.set(card, {
          scale: scale,
          opacity: 1,
          filter: "none",
          zIndex: Math.round(10 + progress * 10),
        });
      } else {
        gsap.set(card, {
          scale: 0.92,
          opacity: 1,
          filter: "none",
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
      let newRotation = rotationAtStart + dx / 5;

      // Bounds
      if (newRotation > maxRotation) newRotation = maxRotation;
      if (newRotation < minRotation) newRotation = minRotation;

      gsap.set(wheel, { rotation: newRotation });
      updateCardVisuals(newRotation);

      // PERFORMANCE FIX: Only update React state if the index actually changes
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

      // Snap logic
      const currentR = gsap.getProperty(wheel, "rotation") as number;
      const snappedR = Math.round(currentR / THETA) * THETA;

      gsap.to(wheel, {
        rotation: snappedR,
        duration: 0.5,
        ease: "power2.out",
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

    // Passive false is important for preventing scroll while dragging horizontally, 
    // but we handle touch-action in CSS now.
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
      ease: "power2.out",
      onUpdate: () => {
        updateCardVisuals(gsap.getProperty(wheel, "rotation") as number);
      },
    });
    
    activeIndexRef.current = index;
    setActiveIndex(index);
  };

  return (
    <div className="relative w-full bg-[var(--color-background-light)] py-16 overflow-hidden">
      <h2
        className="relative z-30 text-center px-8 tracking-tight"
        style={{
          fontSize: "clamp(2.5rem, 5vw, 4rem)",
          fontFamily: "var(--font-stack-heading)",
          color: "var(--color-text-dark)",
          marginBottom: "240px",
        }}
      >
        <span
          className="text-xs tracking-[0.3em] mb-6 block uppercase"
          style={{ fontFamily: "var(--font-stack-heading)", color: "var(--color-secondary)" }}
        >
          Our Capabilities
        </span>
        Services
      </h2>

      {/* The Interaction Zone */}
      <div
        ref={containerRef}
        className="relative w-full h-[600px] cursor-grab active:cursor-grabbing"
        style={{
          overflow: "visible",
          // IMPROVEMENT: Increased marginTop for more visual breathing room
          marginTop: "0px", 
          marginBottom: "96px",
          userSelect: "none",
          WebkitUserSelect: "none",
          // IMPROVEMENT: Allows vertical scrolling on mobile, but captures horizontal swipes
          touchAction: "pan-y", 
          zIndex: 10,
        }}
      >
        {/* The Giant Wheel (Invisible Pivot) */}
        <div
          ref={wheelRef}
          className="absolute left-1/2 top-0 w-0 h-0"
        >
          {SERVICES.map((service, i) => {
            const IconComponent = service.icon;
            const isLight = false;
            const textColor = "#FFFFFF";

            return (
              <div
                key={service.id}
                ref={(el) => (cardsRef.current[i] = el)}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[420px] aspect-[3/4] overflow-hidden will-change-transform"
                style={{
                  top: 0,
                  left: 0,
                  backgroundColor: service.bgColor,
                  pointerEvents: "none",
                  border: isLight ? '2px solid var(--color-surface-dark)' : '2px solid rgba(255,255,255,0.15)',
                  boxShadow: 'var(--shadow-geometric)',
                }}
              >
                {/* Card Content */}
                <div className="relative h-full w-full p-10 flex flex-col justify-between">
                  {/* Top: Category & Icon */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span
                        className="text-xs tracking-[0.3em] opacity-50 block mb-1"
                        style={{
                          fontFamily: "var(--font-stack-heading)",
                          color: textColor,
                        }}
                      >
                        SERVICE {String(service.id).padStart(2, "0")}
                      </span>
                      <span
                        className="text-xs tracking-[0.2em] opacity-40"
                        style={{
                          fontFamily: "var(--font-stack-heading)",
                          color: textColor,
                        }}
                      >
                        {service.category.toUpperCase()}
                      </span>
                    </div>
                    <div
                      className="w-16 h-16 flex items-center justify-center opacity-20"
                      style={{ color: textColor }}
                    >
                      <IconComponent size={40} strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Middle: Title */}
                  <div>
                    <h3
                      className="tracking-tight leading-[0.85] mb-6"
                      style={{
                        fontSize: "clamp(2rem, 5vw, 3rem)",
                        fontFamily: "var(--font-stack-heading)",
                        color: textColor,
                      }}
                    >
                      {service.fullTitle}
                    </h3>
                    <p
                      className="leading-relaxed mb-8"
                      style={{
                        fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
                        fontFamily: "var(--font-stack-body)",
                        color: textColor,
                        opacity: 0.8,
                      }}
                    >
                      {service.description}
                    </p>

                    {/* Details List */}
                    {service.details.length > 0 && (
                      <ul className="space-y-2">
                        {service.details.map((detail, idx) => (
                          <li
                            key={idx}
                            className="text-sm flex items-start gap-2"
                            style={{
                              fontFamily: "var(--font-stack-heading)",
                              color: textColor,
                              opacity: 0.7,
                            }}
                          >
                            <span className="mt-1">→</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation (Synced) */}
      <div className="absolute bottom-12 z-20 flex gap-2 left-1/2 -translate-x-1/2">
        {SERVICES.map((_, i) => (
          <button
            key={i}
            onClick={() => navigateTo(i)}
            className="group relative pointer-events-auto"
            aria-label={`Go to service ${i + 1}`}
          >
            <div
              className={`w-12 h-1 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "bg-[#A46CFC]"
                  : "bg-[var(--color-text-dark)]/20 group-hover:bg-[var(--color-text-dark)]/40"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}