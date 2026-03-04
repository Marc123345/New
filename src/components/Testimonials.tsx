import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const CONTACTS = [
  {
    id: "c1",
    name: "Amara Okafor",
    company: "TechVentures Nigeria",
    country: "Nigeria",
    city: "Lagos",
    role: "CEO",
    countryCode: "NG",
    dot: { x: 44.5, y: 45.5 },
    avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&h=400&fit=crop",
    quote: "H2H Digital didn't just build a platform; they built a digital ecosystem that understands the heartbeat of Lagos markets. Their expertise in African fintech is unmatched.",
    mapView: { x: "-15%", y: "8%", scale: 2.5 },
  },
  {
    id: "c2",
    name: "Kwame Mensah",
    company: "GhanaFintech",
    country: "Ghana",
    city: "Accra",
    role: "Founder",
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
    countryCode: "ZA",
    dot: { x: 54, y: 74 },
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    quote: "From the first pixel to the final line of code, the execution was flawless. H2H is the partner you dream of—combining global standards with African insight.",
    mapView: { x: "-28%", y: "-32%", scale: 2.3 },
  },
  {
    id: "c5",
    name: "Fatima Diallo",
    company: "Senegal Commerce",
    country: "Senegal",
    city: "Dakar",
    role: "Co-Founder",
    countryCode: "SN",
    dot: { x: 32, y: 42 },
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    quote: "Their expertise in e-commerce and digital payments helped us scale rapidly across francophone Africa. The results speak for themselves.",
    mapView: { x: "-20%", y: "5%", scale: 2.4 },
  },
];

export function Testimonials() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);

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

  return (
    <div ref={containerRef} className="relative bg-[var(--color-surface-dark)]" style={{ height: 'clamp(200vh, 250vh, 250vh)' }}>
      <div className="sticky top-0 h-[100dvh] flex flex-col justify-center overflow-hidden border-t border-white/10">

        <div className="text-center mb-4 sm:mb-8 px-4 md:px-8">
          <div
            className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2"
            style={{
              border: "2px solid var(--color-secondary)",
              boxShadow: "4px 4px 0 var(--color-secondary)",
            }}
          >
            <span
              className="text-[10px] sm:text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-stack-heading)", color: "var(--color-secondary)" }}
            >
              Testimonials
            </span>
          </div>
          <h2
            className="tracking-tight"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
              fontFamily: "var(--font-stack-heading)",
              color: "#ffffff",
            }}
          >
            Trusted Across Africa
          </h2>
        </div>

        <div className="max-w-[1400px] mx-auto w-full flex-1 min-h-0 flex gap-4 sm:gap-6 px-3 sm:px-4 md:px-8 pb-3 sm:pb-0">
          {/* LEFT: Globe Panel */}
          <div
            className="hidden lg:flex w-[400px] bg-[var(--color-primary)] flex-col items-center justify-between py-12 px-8 text-white relative shrink-0"
            style={{
              border: "4px solid var(--color-secondary)",
              boxShadow: "var(--shadow-geometric)",
            }}
          >
            <div className="text-center z-10 mt-4">
              <p
                className="text-lg leading-tight"
                style={{ fontFamily: "var(--font-stack-heading)" }}
              >
                <span className="text-[var(--color-secondary)]">Trusted</span>
                <br />
                Across Africa
              </p>
            </div>

            <div className="relative w-[340px] h-[340px] flex-shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 w-full h-full">
                <svg
                  viewBox="0 0 380 380"
                  fill="none"
                  className="w-full h-full animate-[spin_60s_linear_infinite]"
                >
                  <circle
                    cx="190"
                    cy="190"
                    r="189"
                    stroke="white"
                    strokeWidth="1"
                    strokeDasharray="2 10"
                    opacity="0.2"
                  />
                </svg>

                <svg
                  viewBox="0 0 380 380"
                  className="absolute inset-0 w-full h-full -rotate-90"
                >
                  <motion.circle
                    cx="190"
                    cy="190"
                    r="184.5"
                    stroke="rgba(232,226,255,0.12)"
                    strokeWidth="11"
                    fill="none"
                    style={{ pathLength: scrollYProgress }}
                  />
                  <motion.circle
                    cx="190"
                    cy="190"
                    r="184.5"
                    stroke="var(--color-secondary)"
                    strokeWidth="3"
                    fill="none"
                    style={{ pathLength: scrollYProgress }}
                  />
                </svg>
              </div>

              <GlobeMap
                scrollProgress={scrollYProgress}
                activeIndex={activeIndex}
              />
            </div>

            <div className="z-10 relative text-center mb-4">
              <p
                className="text-[var(--color-secondary)] text-3xl leading-[0.8] tracking-wide -rotate-2"
                style={{ fontFamily: "var(--font-stack-body)", fontStyle: "italic" }}
              >
                H2H's Global
                <br />
                Community
              </p>
            </div>
          </div>

          {/* RIGHT: Testimonial Cards */}
          <div
            className="flex-1 bg-[var(--color-surface-dark)] relative overflow-hidden flex flex-col min-h-0"
            style={{
              border: "2px solid rgba(255,255,255,0.15)",
              boxShadow: "var(--shadow-geometric)",
            }}
          >
            <div className="relative w-full flex-1 flex items-center justify-center perspective-[1000px]" style={{ minHeight: 0 }}>
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

            {/* Contact list strip at bottom */}
            <div className="shrink-0 border-t border-white/10 px-2 sm:px-4 md:px-6 py-2 sm:py-3 overflow-x-auto">
              <div className="flex gap-1.5 sm:gap-2 sm:flex-wrap">
                {CONTACTS.map((contact, i) => (
                  <div
                    key={contact.id}
                    className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 transition-all duration-200 shrink-0"
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
                      className="text-[8px] sm:text-[10px] tracking-widest uppercase whitespace-nowrap"
                      style={{
                        fontFamily: "var(--font-stack-heading)",
                        color: i === activeIndex ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
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

function GlobeMap({
  scrollProgress,
  activeIndex,
}: {
  scrollProgress: any;
  activeIndex: number;
}) {
  const active = CONTACTS[activeIndex];

  return (
    <div className="absolute inset-[24px] rounded-full overflow-hidden bg-[#1A1040] border border-[var(--color-primary)]/20">
      <motion.div
        className="relative w-full h-full"
        animate={{
          x: active.mapView.x,
          y: active.mapView.y,
          scale: active.mapView.scale,
        }}
        transition={{
          duration: 1.2,
          ease: [0.625, 0.05, 0, 1],
        }}
      >
        <img
          src="https://cdn.prod.website-files.com/68a5787bba0829184628bd51/68b6b0d7f637ee0f1ff47780_BASE.avif"
          alt="World Map Base"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-50 grayscale"
        />

        {CONTACTS.map((contact, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={contact.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${contact.dot.x}%`,
                top: `${contact.dot.y}%`,
                zIndex: 10,
              }}
            >
              <div
                className={`globe-dot${isActive ? ' globe-dot--active' : ''}`}
              />
            </div>
          );
        })}
      </motion.div>
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
  scrollProgress: any;
}) {
  const start = index / total;
  const end = (index + 1) / total;

  const opacity = useTransform(
    scrollProgress,
    [start, start + 0.05, end - 0.05, end],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollProgress,
    [start, start + 0.1, end - 0.1, end],
    [60, 0, 0, -60]
  );
  const rotateX = useTransform(
    scrollProgress,
    [start, start + 0.1, end - 0.1, end],
    [-45, 0, 0, 45]
  );
  const scale = useTransform(
    scrollProgress,
    [start, start + 0.1, end - 0.1, end],
    [0.9, 1, 1, 0.9]
  );

  return (
    <motion.div
      style={{ opacity, y, rotateX, scale }}
      className="absolute w-[92%] sm:w-[85%] md:w-[80%] bg-[var(--color-primary)] text-white p-5 sm:p-8 md:p-10"
      data-geometric-card
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: "4px solid rgba(255,255,255,0.2)",
          boxShadow: "var(--shadow-geometric)",
        }}
      />
      <div className="relative flex flex-col gap-4 sm:gap-6">
        <h3
          className="text-base sm:text-xl md:text-3xl leading-[1.15] sm:leading-[1.1] tracking-tight"
          style={{ fontFamily: "var(--font-stack-heading)" }}
        >
          "{contact.quote}"
        </h3>
        <div className="flex items-center gap-3 sm:gap-4">
          <motion.div
            className="w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white/30 shrink-0"
            style={{ boxShadow: "0 0 0 0 rgba(164, 108, 252, 0)" }}
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
              className="text-lg sm:text-2xl leading-none mb-1 text-[#FBFBFC] truncate"
              style={{
                fontFamily: "var(--font-stack-body)",
                fontStyle: "italic",
              }}
            >
              {contact.name}
            </div>
            <div
              className="inline-block bg-[var(--color-secondary)] px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs tracking-widest text-[var(--color-background-light)]"
              style={{ fontFamily: "var(--font-stack-heading)" }}
            >
              {contact.role} · {contact.company}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
