import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  Globe,
  Users,
  Target,
  TrendingUp,
  Sparkles,
} from "lucide-react";
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
  const isDraggingRef = useRef(false);

  const THETA = 20;
  const RADIUS = 1500;

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

    let isDragging = false;
    let startX = 0;
    let rotationAtStart = 0;

    const handleMove = (currentX: number) => {
      const dx = currentX - startX;
      let newRotation = rotationAtStart + dx / 5;

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
      isDraggingRef.current = true;
      startX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      rotationAtStart = gsap.getProperty(wheel, "rotation") as number;
      gsap.killTweensOf(wheel);

      if (container) {
        container.style.cursor = "grabbing";
      }
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      if ("touches" in e) {
        e.preventDefault();
      }
      const x = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      handleMove(x);
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      isDraggingRef.current = false;

      if (container) {
        container.style.cursor = "grab";
      }

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
      ease: "power2.out",
      onUpdate: () => {
        updateCardVisuals(gsap.getProperty(wheel, "rotation") as number);
      },
    });

    activeIndexRef.current = index;
    setActiveIndex(index);
  };

  return (
    <>
      <div className="relative w-full bg-[var(--color-background-light)] py-10 md:py-16 overflow-hidden">
        <h2
          className="relative z-30 text-center px-8 tracking-tight"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontFamily: "var(--font-stack-heading)",
            color: "var(--color-text-dark)",
            marginBottom: "clamp(80px, 12vw, 200px)",
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

        <div
          ref={containerRef}
          className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] cursor-grab active:cursor-grabbing"
          style={{
            overflow: "visible",
            marginTop: "0px",
            marginBottom: "96px",
            userSelect: "none",
            WebkitUserSelect: "none",
            touchAction: "none",
            zIndex: 10,
          }}
        >
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
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[340px] md:w-[420px] md:max-w-none aspect-[3/4] overflow-hidden will-change-transform"
                  style={{
                    top: 0,
                    left: 0,
                    backgroundColor: service.bgColor,
                    pointerEvents: "auto",
                    border: '2px solid rgba(255,255,255,0.15)',
                    boxShadow: 'var(--shadow-geometric)',
                  }}
                >
                  <div className="relative h-full w-full p-6 sm:p-10 flex flex-col justify-between">
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

                    <div>
                      <h3
                        className="tracking-tight leading-[0.85] mb-6 sm:mb-8"
                        style={{
                          fontSize: "clamp(1.75rem, 5vw, 3rem)",
                          fontFamily: "var(--font-stack-heading)",
                          color: textColor,
                        }}
                      >
                        {service.fullTitle}
                      </h3>

                      <button
                        onClick={(e) => { e.stopPropagation(); setOverlayService(service); }}
                        className="group inline-flex items-center gap-2 transition-all duration-200"
                        style={{
                          fontFamily: 'var(--font-stack-heading)',
                          fontSize: '0.75rem',
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          color: textColor,
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.25)',
                          padding: '10px 20px',
                          cursor: 'pointer',
                          pointerEvents: 'auto',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                      >
                        Learn More
                        <span
                          className="transition-transform duration-200 group-hover:translate-x-1"
                          style={{ display: 'inline-block' }}
                        >
                          &#8594;
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-20 flex gap-2 justify-center pb-4">
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

      <ServiceCardOverlay
        service={overlayService}
        onClose={() => setOverlayService(null)}
      />
    </>
  );
}
