import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { motion, AnimatePresence } from "motion/react";
import {
  PenLine,
  Bot,
  Search,
  Palette,
  Video,
  BarChart2,
  User,
  MessageCircle,
  MousePointerClick,
  Megaphone,
  X,
} from "lucide-react";

const SERVICES = [
  {
    id: 1,
    title: "Copy Writing",
    fullTitle: "Copy Writing",
    category: "Content",
    description:
      "In a digital landscape saturated with AI-generated content, authenticity matters more than ever. Search engines and social platforms are increasingly sophisticated at detecting generic, automated writing, and often limiting its reach and impact. Our professional copywriters craft content that feels human, nuanced, and strategically aligned with your brand voice. The result is compelling storytelling that builds trust, drives organic engagement across platforms.",
    icon: PenLine,
    color: "#7B2FF2",
    bgColor: "#5A05E6",
    image: "https://images.pexels.com/photos/3059745/pexels-photo-3059745.jpeg?auto=compress&cs=tinysrgb&w=1200",
    details: [
      "Brand voice development",
      "Website & landing page copy",
      "Social media captions & campaigns",
      "Long-form blog & thought leadership",
    ],
  },
  {
    id: 2,
    title: "Agentic AI",
    fullTitle: "Agentic AI",
    category: "Automation",
    description:
      "AI agents are transforming how businesses operate by moving beyond simple automation into intelligent, goal-driven execution. We design and deploy AI agents tailored to specific use cases, whether it's automated lead qualification and follow-ups, personalized customer support, content research and generation, sales outreach, internal workflow optimization, or real-time data analysis. These agents can operate across platforms, integrate with your existing tools, and continuously learn from interactions to improve performance. The result is a scalable, always-on digital workforce that increases efficiency, reduces manual workload, and unlocks new growth opportunities.",
    icon: Bot,
    color: "#9B59F5",
    bgColor: "#6F11F5",
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200",
    details: [
      "Automated lead qualification & follow-ups",
      "Personalized customer support agents",
      "Sales outreach automation",
      "Internal workflow optimization",
    ],
  },
  {
    id: 3,
    title: "SEO & AEO",
    fullTitle: "SEO & AEO",
    category: "Search",
    description:
      "AI agents are transforming how businesses operate by moving beyond simple automation into intelligent, goal-driven execution. We design and deploy AI agents tailored to specific use cases, whether it's automated lead qualification and follow-ups, personalized customer support, content research and generation, sales outreach, internal workflow optimization, or real-time data analysis. These agents can operate across platforms, integrate with your existing tools, and continuously learn from interactions to improve performance. The result is a scalable, always-on digital workforce that increases efficiency, reduces manual workload, and unlocks new growth opportunities.",
    icon: Search,
    color: "#B181FC",
    bgColor: "#8338EC",
    image: "https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=1200",
    details: [
      "Technical SEO audits & optimization",
      "AI-era answer engine optimization",
      "Content strategy & keyword research",
      "Performance tracking & reporting",
    ],
  },
  {
    id: 4,
    title: "Graphic Design",
    fullTitle: "Graphic Design",
    category: "Creative",
    description:
      "In an era where AI can generate visuals in seconds, true design expertise is what sets brands apart. While automated tools produce volume, they rarely deliver strategic thinking, brand consistency, or emotional depth. Professional graphic design ensures your visuals are attractive and intentionally aligned with your positioning, audience psychology, and long-term brand equity. We translate your identity into cohesive, high-impact design systems and campaign assets that cut through the noise, build recognition, and communicate with clarity and purpose across every touchpoint.",
    icon: Palette,
    color: "#6610E6",
    bgColor: "#4A00D8",
    image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200",
    details: [
      "Brand identity & design systems",
      "Campaign & social media assets",
      "Presentation & pitch deck design",
      "Print & digital collateral",
    ],
  },
  {
    id: 5,
    title: "Video Creation & Editing",
    fullTitle: "Video Creation & Editing",
    category: "Production",
    description:
      "Video is the most powerful storytelling medium in today's digital ecosystem. We conceptualize, produce, and edit high-impact videos tailored for social media, advertising, and brand storytelling. From short-form reels to polished brand videos and promotional content, we create visually compelling narratives that captivate audiences and drive measurable results.",
    icon: Video,
    color: "#7B2FF2",
    bgColor: "#5A05E6",
    image: "https://images.pexels.com/photos/2510428/pexels-photo-2510428.jpeg?auto=compress&cs=tinysrgb&w=1200",
    details: [
      "Short-form reels & social content",
      "Brand & promotional videos",
      "Professional editing & post-production",
      "Motion graphics & animation",
    ],
  },
  {
    id: 6,
    title: "Social Media Management",
    fullTitle: "Social Media Management",
    category: "Social",
    description:
      "Effective social media requires strategy, consistency, and performance-driven execution. We manage your platforms end-to-end, developing content calendars, publishing optimized posts, engaging audiences, and analyzing results. Our approach ensures your brand remains relevant and aligned with clear business objectives.",
    icon: BarChart2,
    color: "#C9A3FF",
    bgColor: "#3A0CA3",
    image: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1200",
    details: [
      "Content calendar development",
      "Optimized post publishing",
      "Audience engagement & community building",
      "Performance analytics & reporting",
    ],
  },
  {
    id: 7,
    title: "Personal Branding",
    fullTitle: "Personal Branding",
    category: "Leadership",
    description:
      "Leaders' role have shifted from optional participants in social media, to brand assets. We build authentic, strategic personal brands that position executives and founders as industry authorities. Through tailored content, storytelling frameworks, and platform optimization, we transform profiles into influence engines that drive credibility, visibility, and opportunity.",
    icon: User,
    color: "#7B2FF2",
    bgColor: "#5A05E6",
    image: "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=1200",
    details: [
      "Personal brand audit & strategy",
      "Executive profile optimization",
      "Ghostwritten thought-leadership content",
      "Platform growth & audience building",
    ],
  },
  {
    id: 8,
    title: "Community Management",
    fullTitle: "Community Management",
    category: "Engagement",
    description:
      "A strong community turns followers into advocates. We actively manage conversations, nurture relationships, and create meaningful engagement across your digital platforms. By fostering dialogue and responding with purpose, we help build loyal communities that strengthen brand trust and long-term growth.",
    icon: MessageCircle,
    color: "#9B59F5",
    bgColor: "#6F11F5",
    image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200",
    details: [
      "Active conversation & comment management",
      "Relationship nurturing & audience engagement",
      "Community health monitoring",
      "Brand sentiment tracking",
    ],
  },
  {
    id: 9,
    title: "Google Ads",
    fullTitle: "Google Ads",
    category: "Paid Search",
    description:
      "Our Google Ads campaigns are designed to capture high-intent audiences at the exact moment they are searching for your solutions. Through data-backed optimization, continuous testing, and conversion-focused execution, we maximize ROI and drive measurable business outcomes.",
    icon: MousePointerClick,
    color: "#B181FC",
    bgColor: "#8338EC",
    image: "https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg?auto=compress&cs=tinysrgb&w=1200",
    details: [
      "Search & display campaign strategy",
      "Keyword research & bid management",
      "Conversion-focused ad copy",
      "Continuous A/B testing & optimization",
    ],
  },
  {
    id: 10,
    title: "Social Ads",
    fullTitle: "Social Ads",
    category: "Paid Social",
    description:
      "Paid social is about reaching the right audience with the right message at the right time. We develop and manage strategic campaigns across leading platforms, combining compelling creative with advanced audience targeting and performance analytics. The result is scalable growth, stronger brand awareness, and consistent lead generation.",
    icon: Megaphone,
    color: "#6610E6",
    bgColor: "#4A00D8",
    image: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1200",
    details: [
      "Multi-platform campaign management",
      "Advanced audience targeting",
      "Compelling creative production",
      "Performance analytics & scaling",
    ],
  },
];

type Service = typeof SERVICES[number];

interface OverlayProps {
  service: Service | null;
  onClose: () => void;
}

function ServiceOverlay({ service, onClose }: OverlayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const touchRef = useRef({ startY: 0, atTop: false });
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });

  useEffect(() => {
    if (!service) return;
    setScrollProgress(0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    const el = scrollRef.current;
    const isScrollable = el ? el.scrollHeight > el.clientHeight : false;
    setShowHint(isScrollable);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    const prevOverflow = document.body.style.overflow;
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [service]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const p = el.scrollTop / (el.scrollHeight - el.clientHeight);
    setScrollProgress(p);
    if (p > 0) setShowHint(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchRef.current.startY = e.touches[0].clientY;
    touchRef.current.atTop = (scrollRef.current?.scrollTop ?? 0) <= 0;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current.atTop) return;
    const delta = e.changedTouches[0].clientY - touchRef.current.startY;
    if (delta > 100) onCloseRef.current();
  }, []);

  return createPortal(
    <AnimatePresence>
      {service && (
        <motion.div
          key="service-overlay-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 backdrop-blur-sm"
          style={{ background: "rgba(255, 255, 255, 0.85)" }} // Changed to translucent white
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-card-title"
        >
          <motion.div
            key="service-overlay-panel"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full overflow-hidden"
            style={{
              maxWidth: "680px",
              maxHeight: "85vh",
              background: "#ffffff", // Changed to white
              border: `1px solid ${service.color}44`,
              boxShadow: `0 32px 80px rgba(0,0,0,0.1), 0 0 0 1px ${service.color}22`, // Softened shadow
              borderRadius: "16px", // Added a subtle radius for modern look
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] z-10" style={{ background: "rgba(0,0,0,0.06)" }}>
              <motion.div
                className="h-full"
                style={{ width: `${scrollProgress * 100}%`, background: `linear-gradient(to right, ${service.bgColor}, ${service.color})` }}
              />
            </div>

            <motion.button
              onClick={onClose}
              aria-label="Close overlay"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.18, type: "spring", stiffness: 320, damping: 22 }}
              className="absolute top-3 right-3 z-30 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-black/10 bg-gray-50 hover:bg-gray-100 transition-all text-gray-800 cursor-pointer active:scale-95 group" // Adapted colors for light mode
            >
              <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </motion.button>

            <div
              ref={scrollRef}
              className="relative z-10 overflow-y-auto overscroll-contain"
              style={{ maxHeight: "85vh", WebkitOverflowScrolling: "touch" }}
              onScroll={handleScroll}
            >
              <div className="px-6 sm:px-8 pt-14 pb-8 space-y-6">
              {service.image && (
                <motion.div
                  key={`img-${service.id}`}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full overflow-hidden rounded-lg" // Added rounding
                  style={{
                    height: 'clamp(160px, 28vw, 220px)',
                    border: `1px solid ${service.color}33`,
                    boxShadow: `4px 4px 0 ${service.color}22`,
                  }}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(to top, rgba(255,255,255,0.95) 0%, transparent 55%, ${service.bgColor}22 100%)` }} // Changed to white gradient
                  />
                  <div className="absolute bottom-4 left-5 flex items-center gap-3 font-mono tracking-tighter uppercase text-xs font-semibold" style={{ color: service.color }}>
                    <span className="h-px w-8 inline-block" style={{ backgroundColor: service.color }} />
                    {service.category}
                  </div>
                </motion.div>
              )}

              <div>
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08, duration: 0.4 }}
                  className="block text-[10px] uppercase tracking-[0.35em] mb-5 font-bold"
                  style={{ color: service.color, fontFamily: "var(--font-stack-heading)" }}
                >
                  <span className="inline-block w-4 h-[1px] mr-2 align-middle" style={{ background: service.color }} />
                  {service.category} &mdash; Service {String(service.id).padStart(2, "0")}
                </motion.span>

                <motion.h2
                  id="service-card-title"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="font-bold leading-[1.05] tracking-[-0.03em]"
                  style={{ fontSize: "clamp(2.2rem, 7vw, 4rem)", color: "#111827", fontFamily: "var(--font-stack-heading)" }} // Changed to dark text
                >
                  {service.title}
                </motion.h2>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.16 }}
                className="h-px w-full"
                style={{ background: `linear-gradient(to right, ${service.color}44, transparent)` }}
              />

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.45 }}
                className="leading-[1.8] text-base sm:text-lg"
                style={{ color: "#4B5563", fontFamily: "var(--font-stack-body)" }} // Changed to medium gray
              >
                {service.description}
              </motion.p>

              {service.details.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.45 }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[10px] uppercase tracking-[0.35em] font-bold" style={{ color: "#9CA3AF", fontFamily: "var(--font-stack-heading)" }}>
                      What We Deliver
                    </span>
                    <span className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.07)" }} />
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {service.details.map((detail, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.32 + i * 0.05, duration: 0.35 }}
                        className="flex items-start gap-3 py-3 px-4 text-sm leading-relaxed rounded-md"
                        style={{
                          background: "#F9FAFB", // Light gray background
                          border: "1px solid rgba(0,0,0,0.05)",
                          color: "#374151", // Dark gray text
                          fontFamily: "var(--font-stack-body)",
                        }}
                      >
                        <span className="mt-[3px] flex-shrink-0" style={{ color: service.color }}>&#8594;</span>
                        {detail}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
            </div>

            {showHint && scrollProgress === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
              >
                <motion.div animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ color: "rgba(0,0,0,0.4)" }}>
                    <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
                <span className="text-[10px] tracking-[0.15em] uppercase font-bold" style={{ color: "rgba(0,0,0,0.4)", fontFamily: "var(--font-stack-heading)" }}>Scroll</span>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
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

      // Softened the shadow for a light theme
      const shadow = absOffset === 0
        ? "10px 10px 0 rgba(155, 89, 245, 0.2)"
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
        style={{ background: "#ffffff" }} // Main canvas is now white
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
              color: "#111827", // Heading changed to dark gray
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
              className="flex-shrink-0 transition-all duration-300 font-bold"
              style={{
                fontFamily: "var(--font-stack-heading)",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "10px 24px",
                whiteSpace: "nowrap",
                border: "2px solid rgba(155, 89, 245, 0.3)", // Lighter border
                borderRadius: "999px", // Rounded pills look better on light mode
                background: i === activeIndex
                  ? "var(--color-secondary, #9B59F5)"
                  : "transparent",
                color: i === activeIndex
                  ? "#ffffff"
                  : "#4B5563", // Dark gray inactive text
                cursor: "pointer",
                boxShadow: i === activeIndex
                  ? "0 4px 14px rgba(155, 89, 245, 0.25)"
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
                    className="relative h-full w-full overflow-hidden flex flex-col justify-between p-8 sm:p-10 transition-colors duration-500 rounded-xl"
                    style={{
                      backgroundColor: "#ffffff", // Cards are now white
                      border: `1px solid ${service.color}44`, // Softened borders
                      boxShadow: `4px 4px 0 ${service.color}33`,
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-[6px]"
                      style={{ background: service.color }}
                    />
                    <div className="flex justify-between items-start mt-2">
                      <div>
                        <span
                          className="text-[10px] tracking-[0.3em] font-bold block"
                          style={{
                            fontFamily: "var(--font-stack-heading)",
                            color: service.color,
                            marginBottom: "4px",
                          }}
                        >
                          SERVICE {String(service.id).padStart(2, "0")}
                        </span>
                        <span
                          className="text-[10px] tracking-[0.15em] font-bold uppercase"
                          style={{
                            fontFamily: "var(--font-stack-heading)",
                            color: "#9CA3AF", // Light text for category
                          }}
                        >
                          {service.category}
                        </span>
                      </div>
                      <div
                        className="w-10 h-10 flex items-center justify-center"
                        style={{ color: service.color, opacity: 0.9 }}
                      >
                        <IconComponent size={32} strokeWidth={2} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      <h3
                        className="tracking-tight leading-[1.1] font-bold"
                        style={{
                          fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)",
                          fontFamily: "var(--font-stack-heading)",
                          color: "#111827", // Dark card text
                          margin: 0,
                        }}
                      >
                        {service.fullTitle}
                      </h3>

                      <div className="mt-2">
                        <button
                          onClick={(e) => {
                            if (dragRef.current.hasMoved) return;
                            if (i !== activeIndex) { navigateTo(i); return; }
                            e.stopPropagation();
                            setOverlayService(service);
                          }}
                          className="group inline-flex items-center gap-3 transition-all duration-300 font-bold"
                          style={{
                            fontFamily: "var(--font-stack-heading)",
                            fontSize: "0.75rem",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: "#111827", // Dark button text
                            background: "transparent",
                            border: `1px solid rgba(0,0,0,0.15)`, // Light border
                            borderRadius: "99px",
                            padding: "12px 24px",
                            cursor: "pointer",
                            pointerEvents: "auto",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = service.color;
                            e.currentTarget.style.color = "#fff";
                            e.currentTarget.style.borderColor = service.color;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#111827";
                            e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)";
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
                borderRadius: "99px",
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