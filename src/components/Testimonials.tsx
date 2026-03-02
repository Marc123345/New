import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";

const TESTIMONIALS = [
  {
    id: "1",
    name: "Amara Okafor",
    role: "CEO, TechVentures Nigeria",
    quote:
      "H2H Digital didn't just build a platform; they built a digital ecosystem that understands the heartbeat of Lagos markets. Their expertise in African fintech is unmatched.",
    avatar:
      "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&h=400&fit=crop",
    mapCode: "NG",
    mapView: { x: "-15%", y: "8%", scale: 2.5 },
  },
  {
    id: "2",
    name: "Kwame Mensah",
    role: "Founder, GhanaFintech",
    quote:
      "The level of creativity exceeded our expectations. Our transaction volume tripled within three months. H2H brought world-class execution to West Africa.",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    mapCode: "GH",
    mapView: { x: "-18%", y: "10%", scale: 2.8 },
  },
  {
    id: "3",
    name: "Zainab Hassan",
    role: "Director, EduTech Kenya",
    quote:
      "A game-changer for education. They delivered a world-class learning platform that truly resonates with our students and scales across East Africa beautifully.",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    mapCode: "KE",
    mapView: { x: "-42%", y: "12%", scale: 2.6 },
  },
  {
    id: "4",
    name: "Thabo Nkosi",
    role: "MD, SA Digital Solutions",
    quote:
      "From the first pixel to the final line of code, the execution was flawless. H2H is the partner you dream of—combining global standards with African insight.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    mapCode: "ZA",
    mapView: { x: "-28%", y: "-32%", scale: 2.3 },
  },
  {
    id: "5",
    name: "Fatima Diallo",
    role: "Co-Founder, Senegal Commerce",
    quote:
      "Their expertise in e-commerce and digital payments helped us scale rapidly across francophone Africa. The results speak for themselves.",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    mapCode: "SN",
    mapView: { x: "-20%", y: "5%", scale: 2.4 },
  },
];

const CONTACTS = [
  {
    id: "c1",
    name: "Shannon Varani",
    company: "Varani Group",
    country: "South Africa",
    countryCode: "ZA",
    role: "Founder & CEO",
    dotPosition: { x: 52, y: 76 },
  },
  {
    id: "c2",
    name: "Amara Okafor",
    company: "TechVentures Nigeria",
    country: "Nigeria",
    countryCode: "NG",
    role: "CEO",
    dotPosition: { x: 44, y: 46 },
  },
  {
    id: "c3",
    name: "Kwame Mensah",
    company: "GhanaFintech",
    country: "Ghana",
    countryCode: "GH",
    role: "Founder",
    dotPosition: { x: 38, y: 49 },
  },
  {
    id: "c4",
    name: "Zainab Hassan",
    company: "EduTech Kenya",
    country: "Kenya",
    countryCode: "KE",
    role: "Director",
    dotPosition: { x: 62, y: 55 },
  },
  {
    id: "c5",
    name: "Fatima Diallo",
    company: "Senegal Commerce",
    country: "Senegal",
    countryCode: "SN",
    role: "Co-Founder",
    dotPosition: { x: 32, y: 42 },
  },
  {
    id: "c6",
    name: "Thabo Nkosi",
    company: "SA Digital Solutions",
    country: "South Africa",
    countryCode: "ZA",
    role: "Managing Director",
    dotPosition: { x: 52, y: 76 },
  },
];

export function Testimonials() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeContactId, setActiveContactId] = useState<string | null>(null);

  return (
    <div ref={containerRef} className="relative h-[250vh] bg-[var(--color-surface-dark)]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden border-t border-white/10">

        <div className="text-center mb-8 px-4 md:px-8">
          <div
            className="inline-block mb-4 px-4 py-2"
            style={{
              border: "2px solid var(--color-secondary)",
              boxShadow: "4px 4px 0 var(--color-secondary)",
            }}
          >
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-stack-heading)", color: "var(--color-secondary)" }}
            >
              Testimonials
            </span>
          </div>
          <h2
            className="tracking-tight"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontFamily: "var(--font-stack-heading)",
              color: "#ffffff",
            }}
          >
            Trusted Across Africa
          </h2>
        </div>

        <div className="max-w-[1400px] mx-auto w-full h-[600px] lg:h-[650px] flex gap-6 px-4 md:px-8">
          {/* LEFT COLUMN */}
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
                activeContactId={activeContactId}
                onContactHover={setActiveContactId}
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

          {/* RIGHT COLUMN */}
          <div
            className="flex-1 bg-[var(--color-surface-dark)] relative overflow-hidden flex flex-col"
            style={{
              border: "2px solid rgba(255,255,255,0.15)",
              boxShadow: "var(--shadow-geometric)",
            }}
          >
            {/* Top half: Testimonial Slider */}
            <div className="relative w-full flex-1 flex items-center justify-center perspective-[1000px]" style={{ minHeight: 0 }}>
              {TESTIMONIALS.map((testimonial, i) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  index={i}
                  total={TESTIMONIALS.length}
                  scrollProgress={scrollYProgress}
                />
              ))}
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/10 shrink-0" />

            {/* Bottom half: Contact Directory */}
            <ContactDirectory
              activeContactId={activeContactId}
              onContactHover={setActiveContactId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GlobeMap({
  scrollProgress,
  activeContactId,
  onContactHover,
}: {
  scrollProgress: any;
  activeContactId: string | null;
  onContactHover: (id: string | null) => void;
}) {
  const testimonialIndex = useTransform(
    scrollProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [0, 0, 1, 2, 3, 4]
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = testimonialIndex.on("change", (latest) => {
      setCurrentIndex(Math.floor(latest));
    });
    return unsubscribe;
  }, [testimonialIndex]);

  const active = TESTIMONIALS[currentIndex];

  const activeContact = activeContactId
    ? CONTACTS.find((c) => c.id === activeContactId)
    : null;

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

        {/* Country dots */}
        {CONTACTS.map((contact) => {
          const isActive =
            activeContactId === contact.id ||
            (activeContact && activeContact.countryCode === contact.countryCode);

          const uniqueDots = CONTACTS.filter(
            (c, idx, arr) =>
              arr.findIndex((x) => x.countryCode === c.countryCode) === idx
          );
          if (
            uniqueDots.findIndex((c) => c.id === contact.id) === -1
          ) {
            return null;
          }

          return (
            <motion.button
              key={contact.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${contact.dotPosition.x}%`,
                top: `${contact.dotPosition.y}%`,
                zIndex: 10,
              }}
              onHoverStart={() => {
                const match = CONTACTS.find(
                  (c) => c.countryCode === contact.countryCode
                );
                if (match) onContactHover(match.id);
              }}
              onHoverEnd={() => onContactHover(null)}
            >
              <motion.div
                className="relative flex items-center justify-center"
                animate={isActive ? "active" : "idle"}
              >
                <motion.div
                  className="rounded-full"
                  variants={{
                    idle: {
                      width: 8,
                      height: 8,
                      backgroundColor: "rgba(255,255,255,0.7)",
                      boxShadow: "0 0 0px 0px rgba(255,255,255,0)",
                    },
                    active: {
                      width: 12,
                      height: 12,
                      backgroundColor: "var(--color-secondary)",
                      boxShadow:
                        "0 0 12px 4px rgba(164,108,252,0.6), 0 0 24px 8px rgba(164,108,252,0.2)",
                    },
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute rounded-full border border-[var(--color-secondary)]"
                      initial={{ width: 12, height: 12, opacity: 0.8 }}
                      animate={{ width: 32, height: 32, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}

function ContactDirectory({
  activeContactId,
  onContactHover,
}: {
  activeContactId: string | null;
  onContactHover: (id: string | null) => void;
}) {
  return (
    <div className="shrink-0 overflow-y-auto" style={{ maxHeight: "240px" }}>
      <div className="px-6 py-3 border-b border-white/10 sticky top-0 bg-[var(--color-surface-dark)] z-10">
        <span
          className="text-xs tracking-[0.25em] uppercase text-white/40"
          style={{ fontFamily: "var(--font-stack-heading)" }}
        >
          Regional Contacts
        </span>
      </div>
      <div className="flex flex-col divide-y divide-white/5">
        {CONTACTS.map((contact) => {
          const isActive = activeContactId === contact.id;
          return (
            <motion.div
              key={contact.id}
              className="relative flex items-center gap-4 px-6 py-3 cursor-pointer overflow-hidden"
              onHoverStart={() => onContactHover(contact.id)}
              onHoverEnd={() => onContactHover(null)}
              animate={isActive ? "active" : "idle"}
            >
              {/* Active left bar */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-[3px]"
                style={{ backgroundColor: "var(--color-secondary)" }}
                variants={{
                  idle: { scaleY: 0, originY: 0.5 },
                  active: { scaleY: 1, originY: 0.5 },
                }}
                transition={{ duration: 0.2 }}
              />

              {/* Background fill */}
              <motion.div
                className="absolute inset-0"
                style={{ backgroundColor: "var(--color-primary)" }}
                variants={{
                  idle: { opacity: 0 },
                  active: { opacity: 0.4 },
                }}
                transition={{ duration: 0.2 }}
              />

              {/* Country badge */}
              <div className="relative shrink-0 flex items-center justify-center w-10 h-10" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
                <motion.span
                  className="text-xs font-bold tracking-widest"
                  style={{ fontFamily: "var(--font-stack-heading)" }}
                  variants={{
                    idle: { color: "rgba(255,255,255,0.4)" },
                    active: { color: "var(--color-secondary)" },
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {contact.countryCode}
                </motion.span>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute inset-0"
                      style={{ border: "1px solid var(--color-secondary)" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Info */}
              <div className="relative flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span
                    className="text-white text-sm font-medium truncate"
                    style={{ fontFamily: "var(--font-stack-heading)" }}
                  >
                    {contact.name}
                  </span>
                  <span
                    className="text-xs tracking-widest uppercase shrink-0"
                    style={{
                      fontFamily: "var(--font-stack-heading)",
                      color: "var(--color-secondary)",
                    }}
                  >
                    {contact.role}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="text-xs text-white/40 truncate"
                    style={{ fontFamily: "var(--font-stack-body)" }}
                  >
                    {contact.company}
                  </span>
                  <span className="text-white/20 text-xs">·</span>
                  <span
                    className="text-xs text-white/50 shrink-0"
                    style={{ fontFamily: "var(--font-stack-body)" }}
                  >
                    {contact.country}
                  </span>
                </div>
              </div>

              {/* Glow dot indicator */}
              <div className="relative shrink-0">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  variants={{
                    idle: {
                      backgroundColor: "rgba(255,255,255,0.15)",
                      boxShadow: "none",
                    },
                    active: {
                      backgroundColor: "var(--color-secondary)",
                      boxShadow: "0 0 8px 2px rgba(164,108,252,0.5)",
                    },
                  }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function TestimonialCard({
  testimonial,
  index,
  total,
  scrollProgress,
}: {
  testimonial: (typeof TESTIMONIALS)[number];
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
      className="absolute w-[85%] md:w-[80%] bg-[var(--color-primary)] text-white p-8 md:p-10"
      data-geometric-card
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: "4px solid rgba(255,255,255,0.2)",
          boxShadow: "var(--shadow-geometric)",
        }}
      />
      <div className="relative flex flex-col gap-6">
        <h3
          className="text-xl md:text-3xl leading-[1.1] tracking-tight"
          style={{ fontFamily: "var(--font-stack-heading)" }}
        >
          "{testimonial.quote}"
        </h3>
        <div className="flex items-center gap-4">
          <motion.div
            className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/30"
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
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div>
            <div
              className="text-2xl leading-none mb-1 text-[#FBFBFC]"
              style={{
                fontFamily: "var(--font-stack-body)",
                fontStyle: "italic",
              }}
            >
              {testimonial.name}
            </div>
            <div
              className="inline-block bg-[var(--color-secondary)] px-3 py-1 text-xs tracking-widest text-[var(--color-background-light)]"
              style={{ fontFamily: "var(--font-stack-heading)" }}
            >
              {testimonial.role}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
