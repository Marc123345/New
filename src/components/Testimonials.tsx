import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { useIsMobile } from "../hooks/useIsMobile";


const GlobeWrapper = lazy(() =>
  import("./HeroStory/Globe/GlobeWrapper").then((m) => ({ default: m.GlobeWrapper }))
);

const CLIENT_LOGOS = [
  { name: "Client", url: "https://ik.imagekit.io/qcvroy8xpd/WhatsApp%20Image%202026-04-08%20at%2011.45.06.jpeg?tr=e-removedotbg" },
  { name: "Client", url: "https://ik.imagekit.io/qcvroy8xpd/WhatsApp%20Image%202026-04-08%20at%2011.48.00.jpeg?tr=e-removedotbg" },
  { name: "Client", url: "https://ik.imagekit.io/qcvroy8xpd/WhatsApp%20Image%202026-04-08%20at%2011.48.18.jpeg?tr=e-removedotbg" },
  { name: "Client", url: "https://ik.imagekit.io/qcvroy8xpd/WhatsApp%20Image%202026-04-08%20at%2011.46.37.jpeg?tr=e-removedotbg" },
  { name: "Stallion Integrated", url: "https://ik.imagekit.io/qcvroy8xpd/2610dfc9-72f0-4a52-89b0-d277a1dc13c4.jpeg?updatedAt=1775656772352" },
  { name: "Client", url: "https://ik.imagekit.io/qcvroy8xpd/WhatsApp%20Image%202026-04-08%20at%2011.46.58.jpeg?tr=e-removedotbg" },
  { name: "Untapped Africa", url: "https://ik.imagekit.io/qcvroy8xpd/GOLD%20TEXT%20LOGO%20NO%20GLOW%20EFFECT%20ADDED%201.png?updatedAt=1748753342858" },
  { name: "YDPay", url: "https://ik.imagekit.io/qcvroy8xpd/WhatsApp%20Image%202026-04-08%20at%2011.45.25.jpeg?updatedAt=1775647107094" },
];

function InfiniteLogoSlider({ logos }: { logos: typeof CLIENT_LOGOS }) {
  const isMobile = useIsMobile();
  const duplicated = [...logos, ...logos, ...logos, ...logos];

  return (
    <div className="relative w-full overflow-hidden py-4">
      <motion.div
        className="flex flex-nowrap gap-6 items-center w-max"
        animate={{ x: "-50%" }}
        transition={{ ease: "linear", duration: isMobile ? 20 : 40, repeat: Infinity }}
        style={{ willChange: "transform" }}
      >
        {duplicated.map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            className="flex-shrink-0 flex items-center justify-center min-w-[140px] md:min-w-[180px] h-24"
          >
            <img
              src={logo.url}
              alt={logo.name}
              className="w-auto h-10 md:h-12 object-contain opacity-80 hover:opacity-100 transition-opacity duration-500"
            />
          </div>
        ))}
      </motion.div>
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
    </div>
  );
}

const CONTACTS = [
  {
    id: "stallion",
    name: "Brad Soekoe",
    company: "Stallion Integrated",
    country: "South Africa",
    countryCode: "ZA",
    role: "CEO",
    service: "Rebrand Communications",
    logo: "https://ik.imagekit.io/qcvroy8xpd/2610dfc9-72f0-4a52-89b0-d277a1dc13c4.jpeg",
    quote: "H2H Social played a pivotal role in leading Stallion's rebrand communications. Their expertise helped us deliver our message with clarity, confidence, and in a way that set a benchmark for industry communications.",
  },
  {
    id: "untapped",
    name: "Gabriel Sher",
    company: "Untapped Africa",
    country: "Zimbabwe",
    countryCode: "ZW",
    role: "CEO",
    service: "Brand Identity",
    logo: "https://ik.imagekit.io/qcvroy8xpd/image_1_11_kdrafy.png?tr=f-auto,q-80" as string | null,
    quote: "Before H2H Social, we had the vision, but we hadn't yet realized how powerful communication could be. They gave us the language, identity, and clarity to express what we were building, and in doing so, they shaped our brand. This deepened belief in the impact we were created to make.",
  },
  {
    id: "ydpay",
    name: "Chike Okonkwo",
    company: "YDPay",
    country: "Nigeria",
    countryCode: "NG",
    role: "Head of Business Development & Marketing",
    service: "Community Growth",
    logo: "https://ik.imagekit.io/qcvroy8xpd/WhatsApp%20Image%202026-04-08%20at%2011.45.25.jpeg?updatedAt=1775647107094",
    quote: "H2H social agency has been a valuable agency partner to YDPay, consistently delivering on community growth and user engagement. We've seen firsthand their professionalism, creativity, and commitment to execution, making them a reliable partner for any brand looking to grow.",
  },
  {
    id: "icetech",
    name: "Myles Donnolley",
    company: "ICE Tech",
    country: "South Africa",
    countryCode: "ZA",
    role: "Head of Sales & Marketing",
    service: "Social Media Strategy",
    logo: "/logos/icetech.png",
    quote: "H2H has been instrumental in elevating ICE Tech's social media presence. Their ability to clearly communicate our brand and message has helped us reach a wider audience and strengthen our online identity.",
  },
  {
    id: "askafrica",
    name: "Anoushka Rademeyer",
    company: "Ask Africa",
    country: "South Africa",
    countryCode: "ZA",
    role: "Head of Marketing",
    service: "Brand Strategy",
    logo: "https://ik.imagekit.io/qcvroy8xpd/downloads/Ask_Africa_logo_website_1_kbp13c.png",
    quote: "Representing and building the African narrative is not a small task. As the brand was already going through large-scale shifts, H2H could not have showed up at a better time.",
  },
];

// Card variants — flip-over effect with rotateY on every breakpoint
const cardVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    rotateY: dir > 0 ? 45 : -45,
    scale: 0.92,
  }),
  center: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (dir: number) => ({
    opacity: 0,
    rotateY: dir > 0 ? -45 : 45,
    scale: 0.92,
    transition: { duration: 0.5, ease: [0.55, 0, 1, 0.45] },
  }),
};

export function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [globeVisible, setGlobeVisible] = useState(false);
  const [globeLoaded, setGlobeLoaded] = useState(true);
  const activeIndexRef = useRef(0);
  const directionRef = useRef(1);
  const touchStartX = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Single scroll listener — updates state only when index changes
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const idx = Math.min(CONTACTS.length - 1, Math.floor(latest * CONTACTS.length));
    if (idx !== activeIndexRef.current) {
      directionRef.current = idx > activeIndexRef.current ? 1 : -1;
      activeIndexRef.current = idx;
      setActiveIndex(idx);
    }
  });

  // Track globe visibility for animation pausing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setGlobeVisible(entry.isIntersecting),
      { rootMargin: "200px 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const navigateTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(CONTACTS.length - 1, idx));
    if (clamped === activeIndexRef.current) return;
    directionRef.current = clamped > activeIndexRef.current ? 1 : -1;
    activeIndexRef.current = clamped;
    setActiveIndex(clamped);
  };

  // Touch swipe — native event listeners so preventDefault works (React registers passive)
  const cardRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const swiping = useRef(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      swiping.current = false;
    };
    const onMove = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;
      const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
      const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
      if (dx > dy && dx > 15) {
        swiping.current = true;
        e.preventDefault();
      }
    };
    const onEnd = (e: TouchEvent) => {
      if (touchStartX.current === null) return;
      const delta = e.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;
      touchStartY.current = null;
      if (!swiping.current && Math.abs(delta) < 40) return;
      const newDir = delta < 0 ? 1 : -1;
      const newIdx = Math.max(0, Math.min(CONTACTS.length - 1, activeIndexRef.current + newDir));
      if (newIdx !== activeIndexRef.current) {
        directionRef.current = newDir;
        activeIndexRef.current = newIdx;
        setActiveIndex(newIdx);
      }
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
    };
  }, []);

  const contact = CONTACTS[activeIndex];

  return (
    <>
      <style>{`
        @keyframes avatarPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(164,108,252,0); }
          50%      { box-shadow: 0 0 18px 4px rgba(164,108,252,0.4); }
        }
        .avatar-pulse { animation: avatarPulse 2.5s ease-in-out infinite; }
      `}</style>

      <div ref={containerRef} className="relative h-[300vh] sm:h-[300vh] lg:h-[350vh] bg-white">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden border-t border-black/5 pt-4 sm:pt-10 md:pt-16 pb-2 sm:pb-4 md:pb-0" style={{ contain: 'layout style paint' }}>


          {/* Client logo slider */}
          <div className="shrink-0 mb-1 sm:mb-3 md:mb-6">
            <InfiniteLogoSlider logos={CLIENT_LOGOS} />
          </div>

          <div className="max-w-[1400px] mx-auto w-full flex-1 min-h-0 flex flex-col lg:flex-row gap-2 sm:gap-4 lg:gap-6 px-3 sm:px-5 md:px-8">

            {/* LEFT: Globe Panel — hidden on mobile, visible on sm+ */}
            <div
              className="flex lg:w-[340px] flex-row lg:flex-col items-center justify-center gap-3 py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 text-white relative shrink-0 bg-[#1A1040]"
              style={{ border: "4px solid var(--color-secondary)", borderRadius: "12px", boxShadow: "var(--shadow-geometric)" }}
            >
              <div className="text-center z-10 lg:block hidden">
                <p className="text-base leading-tight" style={{ fontFamily: "var(--font-stack-heading)" }}>
                  <span style={{ color: "var(--color-secondary)" }}>Trusted</span>
                  <br />Across Africa
                </p>
              </div>

              <div className="relative w-[220px] h-[220px] sm:w-[240px] sm:h-[240px] lg:w-[260px] lg:h-[260px] flex-shrink-0">
                {/* SVG rings */}
                <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <svg viewBox="0 0 380 380" fill="none" className="w-full h-full animate-[spin_60s_linear_infinite]" style={{ animationPlayState: globeVisible ? 'running' : 'paused' }}>
                    <circle cx="190" cy="190" r="189" stroke="white" strokeWidth="1" strokeDasharray="2 10" opacity="0.2" />
                  </svg>
                  <svg viewBox="0 0 380 380" className="absolute inset-0 w-full h-full -rotate-90">
                    <motion.circle cx="190" cy="190" r="184.5" stroke="rgba(232,226,255,0.12)" strokeWidth="11" fill="none" style={{ pathLength: scrollYProgress }} />
                    <motion.circle cx="190" cy="190" r="184.5" stroke="var(--color-secondary)" strokeWidth="3" fill="none" style={{ pathLength: scrollYProgress }} />
                  </svg>
                </div>

                {/* Globe — same as HeroStory, lazy loaded, paused when off-screen */}
                <div className="absolute inset-[24px] rounded-full overflow-hidden bg-[#1A1040]">
                  {globeLoaded && (
                    <Suspense fallback={null}>
                      <GlobeWrapper
                        scrollYProgress={scrollYProgress}
                        isVisible={globeVisible}
                        hideArcs
                        activeCityIndex={activeIndex}
                      />
                    </Suspense>
                  )}
                  {/* Shadow glow that intensifies with each testimonial */}
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none z-10"
                    style={{
                      background: 'radial-gradient(circle at 50% 50%, rgba(164,108,252,0.35), rgba(164,108,252,0.1) 50%, transparent 70%)',
                      opacity: 0.3 + (activeIndex / (CONTACTS.length - 1)) * 0.7,
                      transition: 'opacity 0.8s ease',
                      mixBlendMode: 'screen',
                    }}
                  />
                </div>
              </div>

              {/* Mobile-only text beside globe */}
              <div className="text-center z-10 lg:hidden">
                <p className="text-sm leading-tight" style={{ fontFamily: "var(--font-stack-heading)" }}>
                  <span style={{ color: "var(--color-secondary)" }}>Trusted</span>
                  {" "}Across Africa
                </p>
              </div>

            </div>

            {/* RIGHT: Single active card via AnimatePresence */}
            <div
              ref={cardRef}
              className="flex-1 bg-[#1A1040] relative overflow-hidden flex flex-col min-w-0"
              style={{ border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", boxShadow: "var(--shadow-geometric)", minHeight: "clamp(280px, 50vh, 560px)" }}
            >
              <div
                className="relative w-full flex-1 flex items-center justify-center min-h-0 overflow-hidden"
                style={{ perspective: "1000px" }}
              >
                <AnimatePresence custom={directionRef.current} mode="wait">
                  <motion.div
                    key={contact.id}
                    custom={directionRef.current}
                    variants={cardVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute bg-[var(--color-primary)] text-white flex flex-col overflow-y-auto"
                    style={{
                      width: "min(92%, 560px)",
                      maxHeight: "calc(100% - 1.5rem)",
                      padding: "clamp(1rem, 3.5vw, 2.5rem)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "10px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                      willChange: "transform, opacity",
                    }}
                  >
                    <div className="relative flex flex-col gap-4 md:gap-6 overflow-hidden">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div
                          className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase px-2 py-1"
                          style={{ fontFamily: "var(--font-stack-heading)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "4px", color: "rgba(255,255,255,0.7)" }}
                        >
                          {contact.service}
                        </div>
                        {contact.logo && (
                          <div
                            className="flex items-center justify-center bg-white shrink-0 overflow-hidden"
                            style={{
                              height: "clamp(28px, 4vw, 40px)",
                              maxWidth: "clamp(80px, 20vw, 140px)",
                              padding: "0 clamp(6px, 1vw, 12px)",
                              borderRadius: "6px",
                              border: "1px solid rgba(255,255,255,0.25)",
                            }}
                          >
                            <img
                              src={contact.logo}
                              alt={`${contact.company} logo`}
                              className="w-auto object-contain"
                              style={{ maxHeight: "clamp(16px, 3vw, 26px)", maxWidth: "100%" }}
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        )}
                      </div>

                      <blockquote
                        className="leading-relaxed tracking-tight"
                        style={{ fontFamily: "var(--font-stack-heading)", fontSize: "clamp(0.95rem, 3vw, 1.5rem)", color: "#ffffff", margin: 0 }}
                      >
                        "{contact.quote}"
                      </blockquote>

                      <div className="flex flex-col gap-1.5 mt-auto pt-2 min-w-0">
                        <div className="leading-tight" style={{ fontFamily: "var(--font-stack-body)", fontStyle: "italic", fontSize: "clamp(1rem, 2.5vw, 1.4rem)", color: "#FBFBFC" }}>
                          {contact.name}
                        </div>
                        <div
                          className="self-start bg-[var(--color-secondary)] px-2 py-1 md:px-3 md:py-1 tracking-widest"
                          style={{ fontFamily: "var(--font-stack-heading)", fontSize: "clamp(9px, 1.8vw, 11px)", borderRadius: "4px", color: "var(--color-background-light)", lineHeight: 1.4 }}
                        >
                          {contact.role} · {contact.company}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation strip */}
              <div className="relative z-20 shrink-0 border-t border-white/10 bg-[#1A1040]" style={{ borderRadius: "0 0 12px 12px" }}>
                {/* Mobile: dots */}
                <div className="flex sm:hidden items-center justify-between px-4 py-3 gap-3">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <img
                      src={`https://flagcdn.com/20x15/${contact.countryCode.toLowerCase()}.png`}
                      width={20} height={15} alt={contact.country}
                      className="rounded-[2px] shrink-0" loading="lazy"
                    />
                    <span className="text-[11px] tracking-widest uppercase truncate" style={{ fontFamily: "var(--font-stack-heading)", color: "rgba(255,255,255,0.9)" }}>
                      {contact.name.split(" ")[0]} · {contact.country}
                    </span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {CONTACTS.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Testimonial ${i + 1}`}
                        onClick={() => navigateTo(i)}
                        className="flex items-center justify-center"
                        style={{ minWidth: 44, minHeight: 44, padding: 0, background: "none", border: "none", cursor: "pointer" }}
                      >
                        <div style={{ width: i === activeIndex ? 20 : 6, height: 5, borderRadius: 3, background: i === activeIndex ? "var(--color-secondary)" : "rgba(255,255,255,0.2)", transition: "width 0.3s ease, background 0.3s ease" }} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tablet+: list */}
                <div className="hidden sm:flex overflow-x-auto gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                  {CONTACTS.map((c, i) => (
                    <div
                      key={c.id}
                      className="flex items-center shrink-0 gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5"
                      style={{ border: i === activeIndex ? "1px solid var(--color-secondary)" : "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", background: i === activeIndex ? "rgba(164,108,252,0.12)" : "transparent", transition: "border-color 0.2s ease, background 0.2s ease" }}
                    >
                      <img
                        src={`https://flagcdn.com/20x15/${c.countryCode.toLowerCase()}.png`}
                        width={20} height={15} alt={c.country}
                        className="rounded-[2px] shrink-0" loading="lazy"
                        style={{ opacity: i === activeIndex ? 1 : 0.45 }}
                      />
                      <span className="text-[10px] tracking-widest uppercase whitespace-nowrap" style={{ fontFamily: "var(--font-stack-heading)", color: i === activeIndex ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)" }}>
                        {c.name.split(" ")[0]} · {c.country}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
