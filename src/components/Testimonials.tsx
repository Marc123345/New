import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const TESTIMONIALS = [
  {
    id: "1",
    name: "Amara Okafor",
    role: "CEO, TechVentures Nigeria",
    quote: "H2H Digital didn't just build a platform; they built a digital ecosystem that understands the heartbeat of Lagos markets.",
    avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&h=400&fit=crop",
    mapCode: "NG",
    mapView: { x: "-15%", y: "8%", scale: 2.5 },
  },
  {
    id: "2",
    name: "Kwame Mensah",
    role: "Founder, GhanaFintech",
    quote: "The level of creativity exceeded our expectations. Our transaction volume tripled within three months. H2H brought world-class execution to West Africa.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    mapCode: "GH",
    mapView: { x: "-18%", y: "10%", scale: 2.8 },
  },
  {
    id: "3",
    name: "Zainab Hassan",
    role: "Director, EduTech Kenya",
    quote: "A game-changer for education. They delivered a world-class learning platform that truly resonates with our students and scales across East Africa beautifully.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    mapCode: "KE",
    mapView: { x: "-42%", y: "12%", scale: 2.6 },
  },
  {
    id: "4",
    name: "Thabo Nkosi",
    role: "MD, SA Digital Solutions",
    quote: "From the first pixel to the final line of code, the execution was flawless. H2H is the partner you dream of—combining global standards with African insight.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    mapCode: "ZA",
    mapView: { x: "-28%", y: "-32%", scale: 2.3 },
  },
  {
    id: "5",
    name: "Fatima Diallo",
    role: "Co-Founder, Senegal Commerce",
    quote: "Their expertise in e-commerce and digital payments helped us scale rapidly across francophone Africa. The results speak for themselves.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    mapCode: "SN",
    mapView: { x: "-20%", y: "5%", scale: 2.4 },
  },
];

export function Testimonials() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={containerRef}
      className="relative bg-[#0A0514]" // Using a very dark purple/black to match your image background
      style={{ height: isMobile ? "300vh" : "250vh" }}
    >
      {/* STICKY CANVAS */}
      <div className="sticky top-0 h-screen flex flex-col justify-start md:justify-center overflow-hidden border-t border-white/10 pt-10 md:pt-0">
        
        {/* Header Section */}
        <div className="text-center mb-4 md:mb-8 px-4 md:px-8 shrink-0 z-20">
          <h2
            className="tracking-tight uppercase font-bold text-white"
            style={{
              fontSize: "clamp(2rem, 6vw, 4rem)",
              fontFamily: "var(--font-stack-heading)",
              lineHeight: 1.1
            }}
          >
            Trusted Across <br className="md:hidden" /> Africa
          </h2>
        </div>

        {/* Content Wrapper */}
        <div className="max-w-[1400px] mx-auto w-full flex-1 md:h-[650px] flex gap-6 px-4 md:px-8 pb-8 md:pb-0">
          
          {/* Left Column: Globe Map (Hidden on mobile) */}
          <div className="hidden lg:flex w-[400px] bg-[#1e133d] flex-col items-center justify-between py-12 px-8 text-white relative shrink-0">
            <GlobeMap scrollProgress={scrollYProgress} />
          </div>

          {/* Right Column: STICKY 3D SLIDER */}
          <TestimonialSlider scrollProgress={scrollYProgress} isMobile={isMobile} />
        </div>
      </div>
    </div>
  );
}

function GlobeMap({ scrollProgress }) {
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

  const active = TESTIMONIALS[currentIndex] || TESTIMONIALS[0];

  return (
    <div className="relative w-[340px] h-[340px] flex-shrink-0 flex items-center justify-center">
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
    </div>
  );
}

function TestimonialSlider({ scrollProgress, isMobile }) {
  return (
    <div className="flex-1 relative overflow-hidden flex flex-col justify-center items-center h-full w-full">
      <div className="relative w-full h-[75vh] md:h-[500px] flex items-center justify-center perspective-[1000px] mt-2 md:mt-0">
        {TESTIMONIALS.map((testimonial, i) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            index={i}
            total={TESTIMONIALS.length}
            scrollProgress={scrollProgress}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial, index, total, scrollProgress, isMobile }) {
  const start = index / total;
  const end = (index + 1) / total;

  // Timings for animations
  const opacity = useTransform(
    scrollProgress,
    [start, start + 0.05, end - 0.05, end],
    [0, 1, 1, 0]
  );
  
  // Mobile needs less extreme Y movement so it doesn't clip off screen easily
  const y = useTransform(
    scrollProgress,
    [start, start + 0.1, end - 0.1, end],
    [isMobile ? 30 : 60, 0, 0, isMobile ? -30 : -60]
  );
  const rotateX = useTransform(
    scrollProgress,
    [start, start + 0.1, end - 0.1, end],
    [-30, 0, 0, 30]
  );
  const scale = useTransform(
    scrollProgress,
    [start, start + 0.1, end - 0.1, end],
    [0.9, 1, 1, 0.9]
  );

  // The distinctive clip-path for the trapezoid shape
  const clipShape = 'polygon(0% 0%, 100% 0%, 88% 100%, 12% 100%)';

  return (
    <motion.div
      style={{ opacity, y, rotateX, scale }}
      className="absolute w-[95%] md:w-[85%] max-w-[500px] h-full md:h-auto md:min-h-[450px]"
    >
      {/* Outer wrapper to act as the glowing border */}
      <div 
        className="w-full h-full bg-[#9b51e0] p-[4px] md:p-[6px] shadow-2xl flex"
        style={{ clipPath: clipShape }}
      >
        {/* Inner container with dark background */}
        <div 
          className="w-full h-full flex flex-col justify-between bg-[#23174f] text-white p-6 md:p-10"
          style={{ clipPath: clipShape }}
        >
          <div className="flex-1 flex items-center justify-center">
            <h3
              className="uppercase font-bold text-center w-full"
              style={{ 
                fontSize: "clamp(1.2rem, 5vw, 2.2rem)", 
                lineHeight: "1.2",
                fontFamily: "var(--font-stack-heading)" 
              }}
            >
              "{testimonial.quote}"
            </h3>
          </div>

          {/* Avatar and Name Section */}
          <div className="flex flex-col items-center gap-3 mt-6 pb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <div
                className="text-2xl leading-none mb-1 text-white font-serif italic"
              >
                {testimonial.name}
              </div>
              <div
                className="text-xs tracking-widest text-white/60 uppercase"
                style={{ fontFamily: "var(--font-stack-heading)" }}
              >
                {testimonial.role}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
}