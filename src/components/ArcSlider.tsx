import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe,
  Users,
  Target,
  TrendingUp,
  Sparkles,
  X,
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
    bgColor: "#5A05E6",
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
    bgColor: "#6F11F5",
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
    bgColor: "#8338EC",
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
    bgColor: "#4A00D8",
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
    bgColor: "#3A0CA3",
    details: [
      "Social captions and campaigns",
      "Long-form blog and thought leadership",
      "Executive ghostwriting",
      "Email and web copy",
    ],
  },
];

type Service = typeof SERVICES[number];

interface OverlayProps {
  service: Service | null;
  onClose: () => void;
}

function ServiceOverlay({ service, onClose }: OverlayProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!service) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => modalRef.current?.focus(), 80);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      clearTimeout(timer);
    };
  }, [service, onClose]);

  return (
    <AnimatePresence>
      {service && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[150]"
            style={{ background: "rgba(4,4,8,0.80)", backdropFilter: "blur(18px)" }}
          />

          <motion.div
            key="container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[151] flex items-end sm:items-center justify-center p-0 sm:p-6"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-card-title"
          >
            <motion.div
              ref={modalRef}
              tabIndex={-1}
              initial={{ opacity: 0, y: 48, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full focus:outline-none flex flex-col"
              style={{
                maxWidth: 560,
                maxHeight: "92dvh",
                background: "#0d0d14",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px -16px rgba(0,0,0,0.85), 0 0 60px -20px ${service.bgColor}55`,
              }}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="h-[3px] w-full origin-left flex-shrink-0"
                style={{ background: `linear-gradient(to right, ${service.bgColor}, ${service.color}, transparent)` }}
              />

              <div
                className="relative px-6 pt-6 pb-5 sm:px-10 sm:pt-10 sm:pb-8 flex-shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <motion.button
                  onClick={onClose}
                  aria-label="Close overlay"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 22 }}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex h-9 w-9 items-center justify-center transition-all duration-200 hover:rotate-90"
                  style={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.6)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                  }}
                >
                  <X size={16} strokeWidth={2} />
                </motion.button>

                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="block text-[10px] uppercase tracking-[0.35em] mb-4"
                  style={{ color: service.color, fontFamily: "var(--font-stack-heading)" }}
                >
                  <span
                    className="inline-block w-4 h-[1px] mr-2 align-middle"
                    style={{ background: service.color }}
                  />
                  {service.category} &mdash; Service {String(service.id).padStart(2, "0")}
                </motion.span>

                <motion.h3
                  id="service-card-title"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="font-bold leading-tight tracking-tight"
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
                    color: "#fff",
                    fontFamily: "var(--font-stack-heading)",
                  }}
                >
                  {service.title}
                </motion.h3>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-10 sm:py-8 space-y-8">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.45 }}
                  className="leading-[1.8] text-[0.95rem]"
                  style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-stack-body)" }}
                >
                  {service.description}
                </motion.p>

                {service.details.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.45 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <span
                        className="text-[10px] uppercase tracking-[0.35em]"
                        style={{ color: "rgba(255,255,255,0.28)", fontFamily: "var(--font-stack-heading)" }}
                      >
                        What We Deliver
                      </span>
                      <span className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                    </div>
                    <ul className="space-y-3">
                      {service.details.map((detail, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.34 + i * 0.05, duration: 0.35 }}
                          className="flex items-start gap-4 py-3 px-4 text-[0.9rem] leading-relaxed"
                          style={{
                            background: "rgba(255,255,255,0.025)",
                            border: "1px solid rgba(255,255,255,0.05)",
                            color: "rgba(255,255,255,0.62)",
                            fontFamily: "var(--font-stack-body)",
                          }}
                        >
                          <span className="mt-[2px] flex-shrink-0" style={{ color: service.color }}>&#8594;</span>
                          {detail}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function ArcSlider() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [overlayService, setOverlayService] = useState<Service | null>(null);
  const activeIndexRef = useRef(0);
  const dragRef = useRef({ startX: 0, hasMoved: false, isDragging: false });

  const positionCards = useCallback((index: number, animate: boolean) => {
    const isMobile = window.innerWidth < 768;
    const spreadStep1 = isMobile ? 240 : 360;
    const spreadStep2 = isMobile ? 420 : 580;
    const spreadStep3 = isMobile ? 540 : 760;

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
      let targetZIndex: number;

      if (absOffset === 0) {
        translateX = 0;
        rotateY = 0;
        translateZ = 0;
        scale = 1;
        opacity = 1;
        targetZIndex = 10;
      } else if (absOffset === 1) {
        translateX = offset * spreadStep1;
        rotateY = offset < 0 ? 30 : -30;
        translateZ = -120;
        scale = 0.82;
        opacity = 0.6;
        targetZIndex = 5;
      } else if (absOffset === 2) {
        translateX = offset * spreadStep2;
        rotateY = offset < 0 ? 45 : -45;
        translateZ = -240;
        scale = 0.65;
        opacity = 0.25;
        targetZIndex = 2;
      } else {
        translateX = offset * spreadStep3;
        rotateY = offset < 0 ? 55 : -55;
        translateZ = -350;
        scale = 0.5;
        opacity = 0;
        targetZIndex = 1;
      }

      const shadow = absOffset === 0
        ? "10px 10px 0 rgba(164,108,252,0.6)"
        : "none";

      if (animate) {
        gsap.set(card, { zIndex: targetZIndex });
        gsap.to(card, {
          x: translateX,
          rotateY: rotateY,
          z: translateZ,
          scale: scale,
          opacity: opacity,
          boxShadow: shadow,
          duration: 0.7,
          ease: "power3.out",
          overwrite: true,
        });
      } else {
        gsap.set(card, {
          x: translateX,
          rotateY: rotateY,
          z: translateZ,
          scale: scale,
          opacity: opacity,
          zIndex: targetZIndex,
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
    const handleResize = () => positionCards(activeIndexRef.current, false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
      if (overlayService) return;
      if (e.key === "ArrowLeft") navigateTo(activeIndexRef.current - 1);
      if (e.key === "ArrowRight") navigateTo(activeIndexRef.current + 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigateTo, overlayService]);

  return (
    <>
      <div
        className="relative w-full py-16 md:py-24 overflow-hidden"
        style={{ background: "var(--color-background-light, #f8f9fa)" }}
      >
        <div className="relative z-30 text-center px-6 mb-10 md:mb-14">
          <span
            className="text-xs font-semibold tracking-[0.3em] mb-4 block uppercase"
            style={{
              fontFamily: "var(--font-stack-heading)",
              color: "var(--color-secondary, #9B59F5)",
            }}
          >
            Our Capabilities
          </span>
          <h2
            className="tracking-tight font-bold"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontFamily: "var(--font-stack-heading)",
              color: "var(--color-text-dark, #111)",
            }}
          >
            Services
          </h2>
        </div>

        <div
          ref={tabBarRef}
          className="relative z-30 flex gap-2 justify-start md:justify-center px-6 mb-12 md:mb-16 overflow-x-auto hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          role="tablist"
        >
          {SERVICES.map((service, i) => (
            <button
              key={service.id}
              ref={(el) => (tabRefs.current[i] = el)}
              role="tab"
              aria-selected={i === activeIndex}
              onClick={() => navigateTo(i)}
              className="flex-shrink-0 transition-all duration-300 font-semibold"
              style={{
                fontFamily: "var(--font-stack-heading)",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "10px 24px",
                whiteSpace: "nowrap",
                border: "2px solid var(--color-secondary, #9B59F5)",
                borderRadius: "0",
                background: i === activeIndex
                  ? "var(--color-secondary, #9B59F5)"
                  : "transparent",
                color: i === activeIndex
                  ? "var(--color-background-light, #fff)"
                  : "var(--color-text-dark, #111)",
                cursor: "pointer",
                boxShadow: i === activeIndex
                  ? "0 4px 14px rgba(155, 89, 245, 0.4)"
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
            height: "clamp(440px, 60vw, 560px)",
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
                    width: "clamp(280px, 28vw, 380px)",
                    aspectRatio: "3 / 4",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div
                    className="relative h-full w-full overflow-hidden flex flex-col justify-between p-6 sm:p-8 transition-colors duration-500"
                    style={{
                      backgroundColor: service.bgColor,
                      border: "2px solid rgba(255,255,255,0.12)",
                      borderRadius: "0",
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span
                          className="text-[10px] tracking-[0.3em] opacity-60 font-semibold block"
                          style={{
                            fontFamily: "var(--font-stack-heading)",
                            color: "#fff",
                            marginBottom: "4px",
                          }}
                        >
                          SERVICE {String(service.id).padStart(2, "0")}
                        </span>
                        <span
                          className="text-[10px] tracking-[0.15em] opacity-40 font-medium uppercase"
                          style={{
                            fontFamily: "var(--font-stack-heading)",
                            color: "#fff",
                          }}
                        >
                          {service.category}
                        </span>
                      </div>
                      <div
                        className="w-10 h-10 flex items-center justify-center opacity-20"
                        style={{ color: "#fff" }}
                      >
                        <IconComponent size={32} strokeWidth={1.5} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      <h3
                        className="tracking-tight leading-[1] font-bold"
                        style={{
                          fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)",
                          fontFamily: "var(--font-stack-heading)",
                          color: "#fff",
                          margin: 0,
                        }}
                      >
                        {service.fullTitle}
                      </h3>

                      <div className="mt-2">
                        <button
                          onClick={(e) => {
                            if (dragRef.current.hasMoved) return;
                            e.stopPropagation();
                            setOverlayService(service);
                          }}
                          className="group inline-flex items-center gap-3 transition-all duration-300"
                          style={{
                            fontFamily: "var(--font-stack-heading)",
                            fontSize: "0.75rem",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: "#fff",
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.25)",
                            borderRadius: "0",
                            padding: "12px 24px",
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
                          <span className="transition-transform duration-300 group-hover:translate-x-1.5 inline-block">
                            &#8594;
                          </span>
                        </button>
                      </div>
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
                borderRadius: "0",
                background: i === activeIndex
                  ? "var(--color-secondary, #9B59F5)"
                  : "rgba(155, 89, 245, 0.2)",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      <ServiceOverlay
        service={overlayService}
        onClose={() => setOverlayService(null)}
      />
    </>
  );
}
