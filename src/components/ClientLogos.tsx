import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useMotionValue } from "motion/react";

const GlobeWrapper = lazy(() =>
  import("./HeroStory/Globe/GlobeWrapper").then((m) => ({ default: m.GlobeWrapper }))
);

const CLIENT_LOGOS = [
  { src: "https://ik.imagekit.io/qcvroy8xpd/WhatsApp%20Image%202026-04-08%20at%2011.45.06.jpeg?tr=e-removedotbg", alt: "Client" },
  { src: "https://ik.imagekit.io/qcvroy8xpd/WhatsApp%20Image%202026-04-08%20at%2011.48.00.jpeg?tr=e-removedotbg", alt: "Client" },
  { src: "https://ik.imagekit.io/qcvroy8xpd/WhatsApp%20Image%202026-04-08%20at%2011.48.18.jpeg?tr=e-removedotbg", alt: "Client" },
  { src: "https://ik.imagekit.io/qcvroy8xpd/WhatsApp%20Image%202026-04-08%20at%2011.46.37.jpeg?tr=e-removedotbg", alt: "Client" },
  { src: "https://ik.imagekit.io/qcvroy8xpd/WhatsApp%20Image%202026-04-08%20at%2011.46.15.jpeg?tr=e-removedotbg", alt: "Client" },
  { src: "https://ik.imagekit.io/qcvroy8xpd/WhatsApp%20Image%202026-04-08%20at%2011.46.58.jpeg?tr=e-removedotbg", alt: "Client" },
  { src: "https://ik.imagekit.io/qcvroy8xpd/GOLD%20TEXT%20LOGO%20NO%20GLOW%20EFFECT%20ADDED%201.png?updatedAt=1748753342858", alt: "Untapped Africa" },
  { src: "https://ik.imagekit.io/qcvroy8xpd/WhatsApp%20Image%202026-04-08%20at%2011.45.25.jpeg?updatedAt=1775647107094", alt: "YDPay" },
  { src: "https://ik.imagekit.io/qcvroy8xpd/2610dfc9-72f0-4a52-89b0-d277a1dc13c4.jpeg?updatedAt=1775656772352", alt: "Stallion Integrated" },
];

export function ClientLogos() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "200px 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes scrollLogos {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .logo-scroll-track {
          animation: scrollLogos 35s linear infinite;
          display: flex;
          width: max-content;
          will-change: transform;
        }
        @media (max-width: 640px) {
          .logo-scroll-track { animation-duration: 12s; }
        }
        .logo-scroll-track:hover { animation-play-state: paused; }
      `}</style>

      <section ref={sectionRef} className="w-full bg-[var(--color-background-light)] py-8 sm:py-14">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center gap-8 sm:gap-12 px-4 sm:px-8">

          {/* Globe */}
          <div
            className="relative flex-shrink-0 rounded-full overflow-hidden"
            style={{
              width: 'clamp(240px, 40vw, 400px)',
              height: 'clamp(240px, 40vw, 400px)',
              background: '#1A1040',
              border: '4px solid var(--color-secondary)',
              boxShadow: '0 0 60px rgba(164,108,252,0.2), var(--shadow-geometric)',
            }}
          >
            <Suspense fallback={null}>
              <GlobeWrapper
                scrollYProgress={scrollYProgress}
                isVisible={isVisible}
                hideArcs={false}
                activeCityIndex={0}
              />
            </Suspense>
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(164,108,252,0.25), transparent 70%)',
                mixBlendMode: 'screen',
              }}
            />
          </div>

          <p
            className="text-center"
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-secondary)',
              fontWeight: 700,
            }}
          >
            Trusted Across Africa
          </p>

          {/* Logo slider */}
          <div className="w-full overflow-hidden relative" style={{ height: 'clamp(36px, 6vw, 56px)' }}>
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[var(--color-background-light)] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[var(--color-background-light)] to-transparent z-10 pointer-events-none" />
            <div className="logo-scroll-track gap-10 sm:gap-12 lg:gap-16">
              <div className="flex items-center gap-10 sm:gap-12 lg:gap-16">
                {CLIENT_LOGOS.map((logo, i) => (
                  <div key={`original-${i}`} className="flex-shrink-0 px-2">
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="h-7 sm:h-10 md:h-14 object-contain opacity-80"
                      style={{ minWidth: 60, width: 'auto' }}
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-10 sm:gap-12 lg:gap-16" aria-hidden="true">
                {CLIENT_LOGOS.map((logo, i) => (
                  <div key={`duplicate-${i}`} className="flex-shrink-0 px-2">
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="h-7 sm:h-10 md:h-14 object-contain opacity-80"
                      style={{ minWidth: 60, width: 'auto' }}
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
