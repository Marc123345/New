import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const TESTIMONIALS = [
  {
    id: "1",
    name: "Amara Okafor",
    role: "CEO, TechVentures Nigeria",
    quote:
      "H2H Digital didn't just build a platform; they built a digital ecosystem that understands the heartbeat of Lagos markets. Their expertise in African fintech is unmatched.",
    avatar:
      "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&h=400&fit=crop",
    mapCode: "NG", // Nigeria
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
    mapCode: "GH", // Ghana
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
    mapCode: "KE", // Kenya
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
    mapCode: "ZA", // South Africa
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
    mapCode: "SN", // Senegal
    mapView: { x: "-20%", y: "5%", scale: 2.4 },
  },
];

export function Testimonials() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative bg-[var(--color-surface-dark)]" style={{ height: isMobile ? '200vh' : '250vh' }}>
      {/* STICKY CANVAS */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden border-t border-white/10">

        <div className="text-center mb-8 px-4 md:px-8">
          <div
            className="inline-block mb-4 px-4 py-2"
            style={{
              border: '2px solid var(--color-secondary)',
              boxShadow: '4px 4px 0 var(--color-secondary)',
            }}
          >
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: 'var(--font-stack-heading)', color: 'var(--color-secondary)' }}
            >
              Testimonials
            </span>
          </div>
          <h2
            className="tracking-tight"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontFamily: 'var(--font-stack-heading)',
              color: '#ffffff',
            }}
          >
            Trusted Across Africa
          </h2>
        </div>

        <div className="max-w-[1400px] mx-auto w-full h-[600px] lg:h-[650px] flex gap-6 px-4 md:px-8">
          <div className="hidden lg:flex w-[400px] bg-[var(--color-primary)] flex-col items-center justify-between py-12 px-8 text-white relative shrink-0" style={{ border: '4px solid var(--color-secondary)', boxShadow: 'var(--shadow-geometric)' }}>
            <div className="text-center z-10 mt-4">
              <p className="text-lg leading-tight" style={{ fontFamily: 'var(--font-stack-heading)' }}>
                <span className="text-[var(--color-secondary)]">Trusted</span>
                <br />
                Across Africa
              </p>
            </div>

            {/* Globe/Map Window */}
            <div className="relative w-[340px] h-[340px] flex-shrink-0 flex items-center justify-center">
              {/* 1. SVG Progress Ring & Ticks */}
              <div className="absolute inset-0 w-full h-full">
                <svg
                  viewBox="0 0 380 380"
                  fill="none"
                  className="w-full h-full animate-[spin_60s_linear_infinite]"
                >
                  {/* Static Ticks */}
                  <path
                    d="M190.023 369.047V379.047L189.52 379.045..."
                    stroke="currentColor"
                    strokeOpacity="0.2"
                  />
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

                {/* Animated Progress Circle */}
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
                    style={{
                      pathLength: scrollYProgress
                    }}
                  />
                  <motion.circle
                    cx="190"
                    cy="190"
                    r="184.5"
                    stroke="var(--color-secondary)"
                    strokeWidth="3"
                    fill="none"
                    style={{
                      pathLength: scrollYProgress
                    }}
                  />
                </svg>
              </div>

              {/* 2. The Moving Map (Masked) */}
              <GlobeMap scrollProgress={scrollYProgress} />
            </div>

            {/* Bottom Text (Scribble) */}
            <div className="z-10 relative text-center mb-4">
              <p className="text-[var(--color-secondary)] text-3xl leading-[0.8] tracking-wide -rotate-2" style={{ fontFamily: 'var(--font-stack-body)', fontStyle: 'italic' }}>
                H2H's Global
                <br />
                Community
              </p>
            </div>
          </div>

          {/* --- RIGHT COLUMN: STICKY 3D SLIDER --- */}
          <TestimonialSlider scrollProgress={scrollYProgress} />
        </div>
      </div>
    </div>
  );
}

function GlobeMap({ scrollProgress }: { scrollProgress: any }) {
  const testimonialIndex = useTransform(
    scrollProgress, 
    [0, 0.2, 0.4, 0.6, 0.8, 1], 
    [0, 0, 1, 2, 3, 4]
  );
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const unsubscribe = testimonialIndex.on('change', (latest) => {
      setCurrentIndex(Math.floor(latest));
    });
    return unsubscribe;
  }, [testimonialIndex]);

  const active = TESTIMONIALS[currentIndex];

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
      </motion.div>
    </div>
  );
}

function TestimonialSlider({ scrollProgress }: { scrollProgress: any }) {
  return (
    <div className="flex-1 bg-[var(--color-surface-dark)] relative overflow-hidden flex flex-col justify-center" style={{ border: '2px solid rgba(255,255,255,0.15)', boxShadow: 'var(--shadow-geometric)' }}>
      <div className="relative w-full h-[400px] flex items-center justify-center perspective-[1000px]">
        {TESTIMONIALS.map((testimonial, i) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            index={i}
            total={TESTIMONIALS.length}
            scrollProgress={scrollProgress}
          />
        ))}
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
      className="absolute w-[85%] md:w-[80%] bg-[var(--color-primary)] text-white p-8 md:p-12"
      data-geometric-card
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ border: '4px solid rgba(255,255,255,0.2)', boxShadow: 'var(--shadow-geometric)' }}
      />
      <div className="relative flex flex-col gap-8">
        <h3
          className="text-2xl md:text-4xl leading-[1.1] tracking-tight"
          style={{ fontFamily: "var(--font-stack-heading)" }}
        >
          "{testimonial.quote}"
        </h3>
        <div className="flex items-center gap-4">
          <motion.div
            className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30"
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
              className="text-3xl leading-none mb-1 text-[#FBFBFC]"
              style={{ fontFamily: "var(--font-stack-body)", fontStyle: "italic" }}
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