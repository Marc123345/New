import { useEffect, useRef, useState, useCallback } from "react";
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
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [overlayService, setOverlayService] = useState<typeof SERVICES[number] | null>(null);
  const activeIndexRef = useRef(0);
  const dragRef = useRef({ startX: 0, hasMoved: false, isDragging: false });

  const positionCards = useCallback((index: number, animate: boolean) => {
    SERVICES.forEach((_, i) => {
      const card = cardsRef.current[i];
      if (!card) return;

      const offset = i - index;
      const absOffset = Math.abs(offset);

      let translateX: number;
      let rotateY: number;
      let translateZ: number;
      let scale: number;
      let opacity: number;
      let zIndex: number;

      if (absOffset === 0) {
        translateX = 0;
        rotateY = 0;
        translateZ = 0;
        scale = 1;
        opacity = 1;
        zIndex = 10;
      } else if (absOffset === 1) {
        translateX = offset * 340;
        rotateY = offset < 0 ? 30 : -30;
        translateZ = -120;
        scale = 0.82;
        opacity = 0.6;
        zIndex = 5;
      } else if (absOffset === 2) {
        translateX = offset * 540;
        rotateY = offset < 0 ? 45 : -45;
        translateZ = -240;
        scale = 0.65;
        opacity = 0.25;
        zIndex = 2;
      } else {
        translateX = offset * 700;
        rotateY = offset < 0 ? 55 : -55;
        translateZ = -350;
        scale = 0.5;
        opacity = 0;
        zIndex = 1;
      }

      const shadow = absOffset === 0
        ? "10px 10px 0 rgba(164,108,252,0.6)"
        : "none";

      if (animate) {
        gsap.to(card, {
          x: translateX,
          rotateY: rotateY,
          z: translateZ,
          scale: scale,
          opacity: opacity,
          zIndex: zIndex,
          boxShadow: shadow,
          duration: 0.7,
          ease: "power2.out",
          overwrite: true,
        });
      } else {
        gsap.set(card, {
          x: translateX,
          rotateY: rotateY,
          z: translateZ,
          scale: scale,
          opacity: opacity,
          zIndex: zIndex,
          boxShadow: shadow,
        });
      }
    });
  }, []);

  const navigateTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(SERVICES.length - 1, index));
    activeIndexRef.current = clamped;
    setActiveIndex(clamped);
    positionCards(clamped, true);

    const tab = tabRefs.current[clamped];
    if (tab) {
      tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [positionCards]);

  useEffect(() => {
    positionCards(0, false);
  }, [positionCards]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onStart = (e: MouseEvent | TouchEvent) => {
      dragRef.current.isDragging = true;
      dragRef.current.hasMoved = false;
      dragRef.current.startX = "touches" in e ? e.touches[0].clientX : e.clientX;
      container.style.cursor = "grabbing";
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragRef.current.isDragging) return;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      if (Math.abs(x - dragRef.current.startX) > 8) {
        dragRef.current.hasMoved = true;
      }
    };

    const onEnd = (e: MouseEvent | TouchEvent) => {
      if (!dragRef.current.isDragging) return;
      dragRef.current.isDragging = false;
      container.style.cursor = "grab";

      if (!dragRef.current.hasMoved) return;

      const endX = "changedTouches" in e
        ? e.changedTouches[0].clientX
        : (e as MouseEvent).clientX;
      const delta = endX - dragRef.current.startX;

      if (Math.abs(delta) > 40) {
        const dir = delta < 0 ? 1 : -1;
        navigateTo(activeIndexRef.current + dir);
      }
    };

    container.addEventListener("mousedown", onStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    container.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd);

    return () => {
      container.removeEventListener("mousedown", onStart);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      container.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [navigateTo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") navigateTo(activeIndexRef.current - 1);
      if (e.key === "ArrowRight") navigateTo(activeIndexRef.current + 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigateTo]);

  return (
    <>
      <div
        className="relative w-full py-16 md:py-24 overflow-hidden"
        style={{ background: "var(--color-background-light)" }}
      >
        <div className="relative z-30 text-center px-6 mb-10 md:mb-14">
          <span
            className="text-xs tracking-[0.3em] mb-5 block uppercase"
            style={{
              fontFamily: "var(--font-stack-heading)",
              color: "var(--color-secondary)",
            }}
          >
            Our Capabilities
          </span>
          <h2
            className="tracking-tight"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontFamily: "var(--font-stack-heading)",
              color: "var(--color-text-dark)",
            }}
          >
            Services
          </h2>
        </div>

        <div
          ref={tabBarRef}
          className="relative z-30 flex gap-2 justify-start md:justify-center px-6 mb-12 md:mb-16 overflow-x-auto hide-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          role="tablist"
        >
          {SERVICES.map((service, i) => (
            <button
              key={service.id}
              ref={(el) => (tabRefs.current[i] = el)}
              role="tab"
              aria-selected={i === activeIndex}
              onClick={() => navigateTo(i)}
              className="flex-shrink-0 transition-all duration-300"
              style={{
                fontFamily: "var(--font-stack-heading)",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "10px 20px",
                whiteSpace: "nowrap",
                border: "2px solid var(--color-secondary)",
                background: i === activeIndex
                  ? "var(--color-secondary)"
                  : "transparent",
                color: i === activeIndex
                  ? "var(--color-background-light)"
                  : "var(--color-text-dark)",
                cursor: "pointer",
                boxShadow: i === activeIndex
                  ? "var(--shadow-button)"
                  : "none",
              }}
            >
              {service.title}
            </button>
          ))}
        </div>

        <div
          ref={containerRef}
          className="relative w-full cursor-grab active:cursor-grabbing"
          style={{
            height: "clamp(440px, 60vw, 620px)",
            perspective: "1200px",
            perspectiveOrigin: "50% 50%",
            touchAction: "pan-y",
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
          role="tabpanel"
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            {SERVICES.map((service, i) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  ref={(el) => (cardsRef.current[i] = el)}
                  className="absolute will-change-transform"
                  style={{
                    width: "clamp(280px, 28vw, 420px)",
                    aspectRatio: "3 / 4",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div
                    className="relative h-full w-full overflow-hidden flex flex-col p-5 sm:p-7"
                    style={{
                      backgroundColor: service.bgColor,
                      border: "2px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <div className="flex justify-between items-start mb-auto">
                      <div>
                        <span
                          className="text-[10px] tracking-[0.3em] opacity-50 block mb-1"
                          style={{
                            fontFamily: "var(--font-stack-heading)",
                            color: "#fff",
                          }}
                        >
                          SERVICE {String(service.id).padStart(2, "0")}
                        </span>
                        <span
                          className="text-[10px] tracking-[0.2em] opacity-35"
                          style={{
                            fontFamily: "var(--font-stack-heading)",
                            color: "#fff",
                          }}
                        >
                          {service.category.toUpperCase()}
                        </span>
                      </div>
                      <div
                        className="w-10 h-10 flex items-center justify-center opacity-15"
                        style={{ color: "#fff" }}
                      >
                        <IconComponent size={28} strokeWidth={1.5} />
                      </div>
                    </div>

                    <div className="mt-auto">
                      <h3
                        className="tracking-tight leading-[0.95] mb-2"
                        style={{
                          fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
                          fontFamily: "var(--font-stack-heading)",
                          color: "#fff",
                        }}
                      >
                        {service.fullTitle}
                      </h3>

                      <p
                        className="mb-5 line-clamp-2"
                        style={{
                          fontSize: "0.8rem",
                          lineHeight: 1.5,
                          fontFamily: "var(--font-stack-body)",
                          color: "rgba(255,255,255,0.55)",
                          margin: 0,
                          marginBottom: "20px",
                        }}
                      >
                        {service.description}
                      </p>

                      <button
                        onClick={(e) => {
                          if (dragRef.current.hasMoved) return;
                          e.stopPropagation();
                          setOverlayService(service);
                        }}
                        className="group inline-flex items-center gap-2 transition-all duration-200"
                        style={{
                          fontFamily: "var(--font-stack-heading)",
                          fontSize: "0.7rem",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: "#fff",
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.25)",
                          padding: "10px 24px",
                          cursor: "pointer",
                          pointerEvents: "auto",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.18)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                        }}
                      >
                        Discover
                        <span
                          className="transition-transform duration-200 group-hover:translate-x-1 inline-block"
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

        <div className="relative z-20 flex gap-2 justify-center mt-6 md:mt-10">
          {SERVICES.map((_, i) => (
            <button
              key={i}
              onClick={() => navigateTo(i)}
              className="transition-all duration-300"
              aria-label={`Go to service ${i + 1}`}
              style={{
                width: i === activeIndex ? 32 : 8,
                height: 4,
                background: i === activeIndex
                  ? "var(--color-secondary)"
                  : "rgba(164,108,252,0.2)",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            />
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
