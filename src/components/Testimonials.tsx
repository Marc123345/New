import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";

const GlobeWrapper = lazy(() =>
  import('./HeroStory/Globe/GlobeWrapper').then((m) => ({ default: m.GlobeWrapper }))
);

const CONTACTS = [
  {
    id: "c1",
    name: "Amara Okafor",
    company: "TechVentures Nigeria",
    country: "Nigeria",
    city: "Lagos",
    role: "CEO",
    service: "Leadership Branding",
    countryCode: "NG",
    dot: { x: 44.5, y: 45.5 },
    avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&h=400&fit=crop",
    quote: "H2H Social didn't just build a platform; they built a digital ecosystem that understands the heartbeat of Lagos markets. Their expertise in African fintech is unmatched.",
    mapView: { x: "-15%", y: "8%", scale: 2.5 },
  },
  {
    id: "c2",
    name: "Kwame Mensah",
    company: "GhanaFintech",
    country: "Ghana",
    city: "Accra",
    role: "Founder",
    service: "Ecosystem Management",
    countryCode: "GH",
    dot: { x: 38.5, y: 48.5 },
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    quote: "The level of creativity exceeded our expectations. Our transaction volume tripled within three months. H2H brought world-class execution to West Africa.",
    mapView: { x: "-18%", y: "10%", scale: 2.8 },
  },
  {
    id: "c3",
    name: "Zainab Hassan",
    company: "EduTech Kenya",
    country: "Kenya",
    city: "Nairobi",
    role: "Director",
    service: "Authority Discovery",
    countryCode: "KE",
    dot: { x: 63, y: 55 },
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    quote: "A game-changer for education. They delivered a world-class learning platform that truly resonates with our students and scales across East Africa beautifully.",
    mapView: { x: "-42%", y: "12%", scale: 2.6 },
  },
  {
    id: "c4",
    name: "Thabo Nkosi",
    company: "SA Digital Solutions",
    country: "South Africa",
    city: "Johannesburg",
    role: "Managing Director",
    service: "AI Humanization",
    countryCode: "ZA",
    dot: { x: 54, y: 74 },
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    quote: "From the first pixel to the final line of code, the execution was flawless. H2H is the partner you dream of — combining global standards with African insight.",
    mapView: { x: "-28%", y: "-32%", scale: 2.3 },
  },
  {
    id: "c5",
    name: "Fatima Diallo",
    company: "Senegal Commerce",
    country: "Senegal",
    city: "Dakar",
    role: "Co-Founder",
    service: "Cross-Border Strategy",
    countryCode: "SN",
    dot: { x: 32, y: 42 },
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    quote: "Their expertise in e-commerce and digital payments helped us scale rapidly across Francophone Africa. The results speak for themselves.",
    mapView: { x: "-20%", y: "5%", scale: 2.4 },
  },
];

export function Testimonials() {
  const containerRef = useRef(null);
  const globePanelRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [globeVisible, setGlobeVisible] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const idx = Math.min(
        CONTACTS.length - 1,
        Math.floor(latest * CONTACTS.length)
      );
      setActiveIndex(idx);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  useEffect(() => {
    const el = globePanelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setGlobeVisible(visible);
        if (visible) setGlobeReady(true);
      },
      { threshold: 0, rootMargin: '200px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-[#13082A]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden border-t border-white/10 pt-16 pb-4 md:pt-20 md:pb-0">

        <div className="text-center mb-4 sm:mb-5 md:mb-8 px-4 md:px-8">
          <div
            className="inline-block mb-3 md:mb-4 px-3 py-1.5 md:px-4 md:py-2"
            style={{
              border: "2px solid var(--color-secondary)",
              boxShadow: "4px 4px 0 var(--color-secondary)",
            }}
          >
            <span
              className="text-[10px] md:text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-stack-heading)", color: "var(--color-secondary)" }}
            >
              Human Stories, Proven Results
            </span>
          </div>
          <h2
            className="tracking-tight font-bold"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
              fontFamily: "var(--font-stack-heading)",
              color: "#ffffff",
            }}
          >
            Impact Across the Continent
          </h2>
        </div>

        <div className="max-w-[1400px] mx-auto w-full flex-1 min-h-0 flex gap-4 sm:gap-6 px-3 sm:px-5 md:px-8">
          {/* LEFT: Globe Panel — desktop only */}
          <div
            ref={globePanelRef}
            className="hidden lg:flex w-[400px] flex-col items-center justify-between py-12 px-8 text-white relative shrink-0 bg-[#1A1040] overflow-hidden"
            style={{
              border: "4px solid var(--color-secondary)",
              boxShadow: "var(--shadow-geometric)",
            }}
          >
            {globeReady && (
              <Suspense fallback={null}>
                <GlobeWrapper
                  scrollYProgress={scrollYProgress}
                  isVisible={globeVisible}
                  hideArcs={false}
                />
              </Suspense>
            )}

            <div className="text-center z-10 mt-4 relative">
              <p
                className="text-lg leading-tight"
                style={{ fontFamily: "var(--font-stack-heading)" }}
              >
                <span style={{ color: "var(--color-secondary)" }}>Trusted</span>
                <br />
                Across Africa
              </p>
            </div>

            <div className="z-10 relative text-center mb-4">
              <p
                className="text-3xl leading-[0.8] tracking-wide -rotate-2"
                style={{ fontFamily: "var(--font-stack-body)", fontStyle: "italic", color: "var(--color-secondary)" }}
              >
                H2H's Global
                <br />
                Community
              </p>
            </div>
          </div>

          {/* RIGHT: Testimonial Cards */}
          <div
            className="flex-1 bg-[#1A1040] relative overflow-hidden flex flex-col min-w-0"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "var(--shadow-geometric)",
              minHeight: "clamp(360px, 60vh, 600px)",
            }}
          >
            <div
              className="relative w-full flex-1 flex items-center justify-center min-h-0 overflow-hidden"
              style={{ perspective: "1000px" }}
            >
              {CONTACTS.map((contact, i) => (
                <TestimonialCard
                  key={contact.id}
                  contact={contact}
                  index={i}
                  total={CONTACTS.length}
                  scrollProgress={scrollYProgress}
                />
              ))}
            </div>

            {/* Client navigation strip */}
            <div className="relative z-20 shrink-0 border-t border-white/10 bg-[#1A1040]">
              {/* Mobile: dot pagination */}
              <div className="flex sm:hidden items-center justify-between px-4 py-3 gap-3">
                <div className="flex items-center gap-1.5 min-w-0">
                  <img
                    src={`https://flagcdn.com/20x15/${CONTACTS[activeIndex].countryCode.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/40x30/${CONTACTS[activeIndex].countryCode.toLowerCase()}.png 2x`}
                    width={20}
                    height={15}
                    alt={CONTACTS[activeIndex].country}
                    className="rounded-[2px] shrink-0"
                  />
                  <span
                    className="text-[11px] tracking-widest uppercase truncate"
                    style={{
                      fontFamily: "var(--font-stack-heading)",
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    {CONTACTS[activeIndex].name.split(" ")[0]} · {CONTACTS[activeIndex].country}
                  </span>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {CONTACTS.map((_, i) => (
                    <div
                      key={i}
                      className="transition-all duration-300"
                      style={{
                        width: i === activeIndex ? 20 : 6,
                        height: 4,
                        borderRadius: 2,
                        background: i === activeIndex
                          ? "var(--color-secondary)"
                          : "rgba(255,255,255,0.2)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Tablet+: horizontal scrollable list */}
              <div
                className="hidden sm:flex overflow-x-auto gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
              >
                {CONTACTS.map((contact, i) => (
                  <div
                    key={contact.id}
                    className="flex items-center shrink-0 gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 transition-all duration-200"
                    style={{
                      border: i === activeIndex
                        ? "1px solid var(--color-secondary)"
                        : "1px solid rgba(255,255,255,0.1)",
                      background: i === activeIndex ? "rgba(164,108,252,0.12)" : "transparent",
                    }}
                  >
                    <img
                      src={`https://flagcdn.com/20x15/${contact.countryCode.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/40x30/${contact.countryCode.toLowerCase()}.png 2x`}
                      width={20}
                      height={15}
                      alt={contact.country}
                      className="rounded-[2px] shrink-0"
                      style={{ opacity: i === activeIndex ? 1 : 0.45 }}
                    />
                    <span
                      className="text-[10px] tracking-widest uppercase whitespace-nowrap"
                      style={{
                        fontFamily: "var(--font-stack-heading)",
                        color: i === activeIndex ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)",
                      }}
                    >
                      {contact.name.split(" ")[0]} · {contact.country}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({
  contact,
  index,
  total,
  scrollProgress,
}: {
  contact: (typeof CONTACTS)[number];
  index: number;
  total: number;
  scrollProgress: MotionValue<number>;
}) {
  const segmentSize = 1 / total;
  const start = index * segmentSize;
  const end = (index + 1) * segmentSize;
  const fadeIn = Math.min(start + segmentSize * 0.2, end);
  const fadeOut = Math.max(end - segmentSize * 0.2, start);

  const isFirst = index === 0;
  const isLast = index === total - 1;

  const opacityInput = isFirst
    ? [start, start, fadeOut, end]
    : isLast
      ? [start, fadeIn, end, end]
      : [start, fadeIn, fadeOut, end];
  const opacityOutput = isFirst
    ? [1, 1, 1, 0]
    : isLast
      ? [0, 1, 1, 1]
      : [0, 1, 1, 0];

  const opacity = useTransform(scrollProgress, opacityInput, opacityOutput);
  const y = useTransform(
    scrollProgress,
    opacityInput,
    isFirst ? [0, 0, 0, -50] : isLast ? [50, 0, 0, 0] : [50, 0, 0, -50]
  );
  const rotateX = useTransform(
    scrollProgress,
    opacityInput,
    isFirst ? [0, 0, 0, 35] : isLast ? [-35, 0, 0, 0] : [-35, 0, 0, 35]
  );
  const scale = useTransform(
    scrollProgress,
    opacityInput,
    isFirst ? [1, 1, 1, 0.92] : isLast ? [0.92, 1, 1, 1] : [0.92, 1, 1, 0.92]
  );

  return (
    <motion.div
      className="absolute bg-[var(--color-primary)] text-white flex flex-col"
      data-geometric-card
      data-index={index}
      style={{
        opacity,
        y,
        rotateX,
        scale,
        width: "min(92%, 560px)",
        maxHeight: "calc(100% - 1.5rem)",
        padding: "clamp(1.25rem, 4vw, 2.5rem)",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <div className="relative flex flex-col gap-4 md:gap-6 overflow-hidden">
        {/* Service tag */}
        <div
          className="self-start text-[9px] sm:text-[10px] tracking-[0.25em] uppercase px-2 py-1"
          style={{
            fontFamily: "var(--font-stack-heading)",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.2em",
          }}
        >
          {contact.service}
        </div>

        {/* Quote */}
        <blockquote
          className="leading-relaxed tracking-tight"
          style={{
            fontFamily: "var(--font-stack-heading)",
            fontSize: "clamp(1rem, 3.5vw, 1.65rem)",
            color: "#ffffff",
            margin: 0,
          }}
        >
          "{contact.quote}"
        </blockquote>

        {/* Author row */}
        <div className="flex items-center gap-3 md:gap-4 mt-auto pt-2">
          <motion.div
            className="shrink-0 rounded-full overflow-hidden border-2 border-white/30"
            style={{
              width: "clamp(36px, 6vw, 56px)",
              height: "clamp(36px, 6vw, 56px)",
              boxShadow: "0 0 0 0 rgba(164, 108, 252, 0)",
            }}
            animate={{
              scale: [1, 1.08, 1],
              boxShadow: [
                "0 0 0 0 rgba(164, 108, 252, 0)",
                "0 0 20px 4px rgba(164, 108, 252, 0.4)",
                "0 0 0 0 rgba(164, 108, 252, 0)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="min-w-0">
            <div
              className="leading-none mb-1 truncate"
              style={{
                fontFamily: "var(--font-stack-body)",
                fontStyle: "italic",
                fontSize: "clamp(0.9rem, 2.5vw, 1.4rem)",
                color: "#FBFBFC",
              }}
            >
              {contact.name}
            </div>
            <div
              className="inline-block bg-[var(--color-secondary)] px-2 py-0.5 md:px-3 md:py-1 tracking-widest"
              style={{
                fontFamily: "var(--font-stack-heading)",
                fontSize: "clamp(8px, 1.5vw, 11px)",
                color: "var(--color-background-light)",
                whiteSpace: "nowrap",
              }}
            >
              {contact.role} · {contact.city}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}