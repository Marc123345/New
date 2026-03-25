import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { PenLine, Bot, Search, Palette, Video, ChartBar as BarChart2, User, MessageCircle, MousePointerClick, Megaphone, X } from "lucide-react";

const SERVICES = [
  {
    id: 1,
    title: "Copy Writing",
    fullTitle: "Voice & Ghostwriting",
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
    fullTitle: "AI Humanization",
    category: "Automation",
    description:
      "AI agents are transforming how businesses operate by moving beyond simple automation into intelligent, goal-driven execution. We design and deploy AI agents tailored to specific use cases, whether it's automated lead qualification and follow-ups, personalized customer support, content research and generation, sales outreach, internal workflow optimization, or real-time data analysis.",
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
    fullTitle: "Authority Discovery",
    category: "Search",
    description:
      "Search has evolved beyond keywords. We help your brand rank across traditional search engines and the new wave of AI answer engines. From technical audits to structured content strategy, we ensure your business is found — and trusted — wherever your audience is looking.",
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
      "In an era where AI can generate visuals in seconds, true design expertise is what sets brands apart. Professional graphic design ensures your visuals are attractive and intentionally aligned with your positioning, audience psychology, and long-term brand equity. We translate your identity into cohesive, high-impact design systems.",
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
    title: "Video Creation",
    fullTitle: "Video Creation & Editing",
    category: "Production",
    description:
      "Video is the most powerful storytelling medium in today's digital ecosystem. We conceptualize, produce, and edit high-impact videos tailored for social media, advertising, and brand storytelling. From short-form reels to polished brand videos and promotional content, we create visually compelling narratives that captivate audiences.",
    icon: Video,
    color: "#e8e2ff",
    bgColor: "#1a1535",
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
    title: "Social Media",
    fullTitle: "Ecosystem Management",
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
      "Leaders' roles have shifted from optional participants in social media, to brand assets. We build authentic, strategic personal brands that position executives and founders as industry authorities. Through tailored content, storytelling frameworks, and platform optimization, we transform profiles into influence engines.",
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
    title: "Community Mgmt",
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
      "Paid social is about reaching the right audience with the right message at the right time. We develop and manage strategic campaigns across leading platforms, combining compelling creative with advanced audience targeting and performance analytics for scalable growth.",
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
          className="fixed inset-0 flex items-center justify-center p-4 sm:p-8"
          style={{ background: "#040408", zIndex: 9999 }}
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
              background: "#0a0814",
              border: `1px solid ${service.color}44`,
              boxShadow: `0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${service.color}22`,
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] z-10" style={{ background: "rgba(255,255,255,0.06)" }}>
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
              className="absolute top-4 right-4 z-30 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/20 bg-[#1a1530] hover:bg-[#2a2345] transition-all text-white cursor-pointer active:scale-95 group"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </motion.button>

            <div
              ref={scrollRef}
              className="relative z-10 overflow-y-auto overscroll-contain"
              style={{ maxHeight: "85vh", WebkitOverflowScrolling: "touch" }}
              onScroll={handleScroll}
            >
              <div className="px-5 sm:px-7 md:px-8 pt-14 sm:pt-16 pb-8 sm:pb-10 space-y-6 sm:space-y-7">
                {service.image && (
                  <motion.div
                    key={`img-${service.id}`}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full overflow-hidden"
                    style={{
                      height: 'clamp(160px, 28vw, 220px)',
                      border: `2px solid ${service.color}55`,
                      boxShadow: `6px 6px 0 ${service.color}44`,
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
                      style={{ background: `linear-gradient(to top, rgba(4,4,8,0.95) 0%, transparent 55%, ${service.bgColor}55 100%)` }}
                    />
                    <div className="absolute bottom-4 left-5 flex items-center gap-3 font-mono tracking-tighter uppercase text-xs" style={{ color: service.color }}>
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
                    className="block text-[10px] uppercase tracking-[0.35em] mb-5"
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
                    style={{ fontSize: "clamp(1.6rem, 4.5vw, 3rem)", color: "#fff", fontFamily: "var(--font-stack-heading)" }}
                  >
                    {service.fullTitle}
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
                  style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-stack-body)" }}
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
                      <span className="text-[10px] uppercase tracking-[0.35em]" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-stack-heading)" }}>
                        What We Deliver
                      </span>
                      <span className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                    </div>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {service.details.map((detail, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.32 + i * 0.05, duration: 0.35 }}
                          className="flex items-start gap-3 py-3 px-4 text-sm leading-relaxed"
                          style={{
                            background: "#110f1e",
                            border: "1px solid rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.72)",
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
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ color: "rgba(255,255,255,0.35)" }}>
                    <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
                <span className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-stack-heading)" }}>Scroll</span>
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
  const sliderRef = useRef<HTMLDivElement>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [overlayService, setOverlayService] = useState<Service | null>(null);
  const dragRef = useRef({ startX: 0, hasMoved: false, isDragging: false });

  const navigateTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(SERVICES.length - 1, index));
    setActiveIndex(clamped);

    const tab = tabRefs.current[clamped];
    if (tab) {
      tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }

    const isMobile = window.innerWidth < 768;
    if (isMobile && sliderRef.current) {
      const cardWidth = sliderRef.current.offsetWidth * 0.82;
      sliderRef.current.scrollTo({
        left: clamped * cardWidth,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    const container = sliderRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const onStart = (e: MouseEvent | TouchEvent) => {
      dragRef.current.isDragging = true;
      dragRef.current.hasMoved = false;
      dragRef.current.startX = "touches" in e ? e.touches[0].clientX : e.clientX;
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

      if (!dragRef.current.hasMoved) return;

      const endX = "changedTouches" in e
        ? e.changedTouches[0].clientX
        : (e as MouseEvent).clientX;
      const delta = endX - dragRef.current.startX;

      if (Math.abs(delta) > 40) {
        const dir = delta < 0 ? 1 : -1;
        navigateTo(activeIndex + dir);
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
  }, [navigateTo, activeIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (overlayService) return;
      if (e.key === "ArrowLeft") navigateTo(activeIndex - 1);
      if (e.key === "ArrowRight") navigateTo(activeIndex + 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigateTo, overlayService, activeIndex]);

  const isMobileView = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <>
      <div
        className="relative w-full py-16 md:py-24 overflow-hidden"
        style={{ background: "#ffffff" }}
      >
        <div className="relative z-30 text-center px-5 sm:px-6 mb-8 md:mb-14 flex flex-col items-center">
          <div
            style={{
              display: "inline-block",
              marginBottom: "12px",
              padding: "6px 16px",
              border: "2px solid var(--color-secondary)",
              boxShadow: "4px 4px 0 var(--color-secondary)",
            }}
          >
            <span
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontFamily: "var(--font-stack-heading)",
                color: "var(--color-secondary)",
              }}
            >
              Other Services We Offer
            </span>
          </div>
          <h2
            className="tracking-tight font-bold"
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontFamily: "var(--font-stack-heading)",
              color: "var(--color-text-dark, #111)",
            }}
          >
            Our Capabilities
          </h2>
        </div>

        {/* Horizontal Scrollable Tab Bar */}
        <div
          ref={tabBarRef}
          className="relative z-30 flex gap-1.5 sm:gap-2 justify-start md:justify-center px-6 sm:px-8 mb-8 sm:mb-12 md:mb-16 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
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
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "8px 14px",
                whiteSpace: "nowrap",
                border: "2px solid var(--color-secondary, #9B59F5)",
                borderRadius: "0",
                background: i === activeIndex
                  ? "var(--color-secondary, #9B59F5)"
                  : "transparent",
                color: i === activeIndex
                  ? "#ffffff"
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

        {/* Mobile: Horizontal scroll slider with peek */}
        <div className="block md:hidden relative w-full">
          <div
            ref={sliderRef}
            className="flex overflow-x-auto gap-4 px-6 snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
            onScroll={() => {
              if (!sliderRef.current) return;
              const cardWidth = sliderRef.current.offsetWidth * 0.82;
              const scrollLeft = sliderRef.current.scrollLeft;
              const newIndex = Math.round(scrollLeft / cardWidth);
              if (newIndex !== activeIndex) {
                setActiveIndex(newIndex);
                const tab = tabRefs.current[newIndex];
                if (tab) tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
              }
            }}
          >
            {SERVICES.map((service, i) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  className="flex-shrink-0 snap-center"
                  style={{
                    width: "82vw",
                    paddingRight: i === SERVICES.length - 1 ? "0" : "0",
                  }}
                >
                  <div
                    className="relative h-full w-full overflow-hidden flex flex-col justify-between p-6 transition-all duration-300"
                    style={{
                      backgroundColor: service.bgColor,
                      border: "2px solid rgba(255,255,255,0.12)",
                      borderRadius: "0",
                      minHeight: "380px",
                      boxShadow: i === activeIndex ? "8px 8px 0 rgba(164,108,252,0.5)" : "none",
                      opacity: i === activeIndex ? 1 : 0.7,
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span
                          className="block font-semibold"
                          style={{
                            fontFamily: "var(--font-stack-heading)",
                            fontSize: "0.6rem",
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.9)",
                            marginBottom: "4px",
                          }}
                        >
                          SERVICE {String(service.id).padStart(2, "0")}
                        </span>
                        <span
                          className="block font-medium uppercase"
                          style={{
                            fontFamily: "var(--font-stack-heading)",
                            fontSize: "0.6rem",
                            letterSpacing: "0.15em",
                            color: "rgba(255,255,255,0.85)",
                          }}
                        >
                          {service.category}
                        </span>
                      </div>
                      <div
                        className="w-10 h-10 flex items-center justify-center opacity-25"
                        style={{ color: "#fff" }}
                      >
                        <IconComponent size={28} strokeWidth={1.5} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-5 mt-8">
                      <h3
                        className="font-bold leading-tight"
                        style={{
                          fontSize: "clamp(1.3rem, 5.5vw, 2rem)",
                          fontFamily: "var(--font-stack-heading)",
                          color: "#fff",
                          margin: 0,
                        }}
                      >
                        {service.fullTitle}
                      </h3>

                      <div className="mt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (i !== activeIndex) { navigateTo(i); return; }
                            setOverlayService(service);
                          }}
                          className="group inline-flex items-center gap-3 transition-all duration-300 active:scale-95"
                          style={{
                            fontFamily: "var(--font-stack-heading)",
                            fontSize: "0.7rem",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: "#fff",
                            background: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.3)",
                            borderRadius: "0",
                            padding: "12px 24px",
                            cursor: "pointer",
                            minHeight: "44px",
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
            {/* Right padding for peek effect */}
            <div className="flex-shrink-0 w-6" />
          </div>
        </div>

        {/* Desktop: Arc / 3D card arrangement */}
        <DesktopArcSlider
          activeIndex={activeIndex}
          navigateTo={navigateTo}
          dragRef={dragRef}
          setOverlayService={setOverlayService}
        />

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

interface DesktopArcSliderProps {
  activeIndex: number;
  navigateTo: (index: number) => void;
  dragRef: React.MutableRefObject<{ startX: number; hasMoved: boolean; isDragging: boolean }>;
  setOverlayService: (s: Service | null) => void;
}

function DesktopArcSlider({ activeIndex, navigateTo, dragRef, setOverlayService }: DesktopArcSliderProps) {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const positionCards = useCallback((index: number, animate: boolean) => {
    const containerWidth = containerRef.current?.offsetWidth ?? 900;
    const cardWidth = Math.min(380, Math.max(260, containerWidth * 0.55));
    const spreadStep1 = cardWidth * 0.82;
    const spreadStep2 = cardWidth * 1.3;
    const spreadStep3 = cardWidth * 1.75;

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
        translateX = 0; rotateY = 0; translateZ = 0; scale = 1; opacity = 1; targetZIndex = 10;
      } else if (absOffset === 1) {
        translateX = offset * spreadStep1; rotateY = offset < 0 ? 28 : -28; translateZ = -100; scale = 0.83; opacity = 0.55; targetZIndex = 5;
      } else if (absOffset === 2) {
        translateX = offset * spreadStep2; rotateY = offset < 0 ? 42 : -42; translateZ = -200; scale = 0.66; opacity = 0.2; targetZIndex = 2;
      } else {
        translateX = offset * spreadStep3; rotateY = offset < 0 ? 52 : -52; translateZ = -300; scale = 0.5; opacity = 0; targetZIndex = 1;
      }

      const shadow = absOffset === 0 ? "10px 10px 0 rgba(164,108,252,0.6)" : "none";

      const transform = `translateX(${translateX}px) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`;
      if (animate) {
        card.style.zIndex = String(targetZIndex);
        card.style.transition = "transform 0.7s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.7s ease, box-shadow 0.7s ease";
        card.style.transform = transform;
        card.style.opacity = String(opacity);
        card.style.boxShadow = shadow;
      } else {
        card.style.transition = "none";
        card.style.transform = transform;
        card.style.opacity = String(opacity);
        card.style.zIndex = String(targetZIndex);
        card.style.boxShadow = shadow;
      }
    });
  }, []);

  useEffect(() => {
    positionCards(activeIndex, true);
  }, [activeIndex, positionCards]);

  useEffect(() => {
    positionCards(activeIndex, false);
    const handleResize = () => positionCards(activeIndex, false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [positionCards, activeIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startX = 0;
    let isDragging = false;
    let hasMoved = false;
    let currentDelta = 0;

    const onStart = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      hasMoved = false;
      currentDelta = 0;
      startX = "touches" in e ? e.touches[0].clientX : e.clientX;
      dragRef.current.isDragging = true;
      dragRef.current.hasMoved = false;
      dragRef.current.startX = startX;
      container.style.cursor = "grabbing";
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      currentDelta = x - startX;
      if (Math.abs(currentDelta) > 5) {
        hasMoved = true;
        dragRef.current.hasMoved = true;
      }

      const dampened = currentDelta * 0.3;
      const activeCard = cardsRef.current[activeIndex];
      if (activeCard) {
        activeCard.style.transition = "none";
        const baseTransform = `translateX(${dampened}px) rotateY(0deg) translateZ(0px) scale(1)`;
        activeCard.style.transform = baseTransform;
      }
    };

    const onEnd = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      isDragging = false;
      dragRef.current.isDragging = false;
      container.style.cursor = "grab";

      if (!hasMoved) {
        positionCards(activeIndex, false);
        return;
      }

      const endX = "changedTouches" in e ? e.changedTouches[0].clientX : (e as MouseEvent).clientX;
      const delta = endX - startX;

      if (Math.abs(delta) > 30) {
        navigateTo(activeIndex + (delta < 0 ? 1 : -1));
      } else {
        positionCards(activeIndex, true);
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
  }, [navigateTo, activeIndex, dragRef, positionCards]);

  return (
    <div
      ref={containerRef}
      className="hidden md:block relative w-full cursor-grab active:cursor-grabbing overflow-hidden"
      style={{
        height: "clamp(380px, 50vw, 500px)",
        perspective: "1400px",
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
                width: "clamp(240px, 32vw, 360px)",
                aspectRatio: "3 / 3.8",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
            >
              <div
                className="relative h-full w-full overflow-hidden flex flex-col justify-between p-5 sm:p-8 md:p-10 transition-colors duration-500 cursor-grab active:cursor-grabbing"
                style={{
                  backgroundColor: service.bgColor,
                  border: "2px solid rgba(255,255,255,0.12)",
                  borderRadius: "0",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                }}
                onDragStart={(e) => e.preventDefault()}
              >
                <div className="flex justify-between items-start pointer-events-none">
                  <div>
                    <span
                      className="block font-semibold"
                      style={{
                        fontFamily: "var(--font-stack-heading)",
                        fontSize: "0.6rem",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.9)",
                        marginBottom: "4px",
                      }}
                    >
                      SERVICE {String(service.id).padStart(2, "0")}
                    </span>
                    <span
                      className="block font-medium uppercase"
                      style={{
                        fontFamily: "var(--font-stack-heading)",
                        fontSize: "0.6rem",
                        letterSpacing: "0.15em",
                        color: "rgba(255,255,255,0.85)",
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
                    className="tracking-tight leading-[1.1] font-bold pointer-events-none"
                    style={{
                      fontSize: "clamp(1.3rem, 3vw, 2rem)",
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
                        if (i !== activeIndex) { navigateTo(i); return; }
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
                        marginTop: "4px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
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
  );
}
