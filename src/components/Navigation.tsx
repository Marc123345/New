import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { H2HLogo } from "./H2HLogo";

const NAV_LINKS = [
  { label: "Home", href: "#hero", id: "01", sub: "Start here" },
  { label: "About", href: "#about", id: "02", sub: "Our story" },
  { label: "Three Pillars", href: "#ecosystem", id: "03", sub: "Core framework" },
  { label: "Services", href: "#services", id: "04", sub: "What we offer" },
  { label: "Testimonials", href: "#testimonials", id: "05", sub: "Client voices" },
  { label: "Blog", href: "/blog", id: "06", sub: "Insights & ideas" },
];

const SOCIAL = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/human2humanmarketing/" },
  { label: "Twitter", href: "#" },
  { label: "Instagram", href: "#" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isNavigatingRef = useRef(false);

  const isHomePage = location.pathname === "/";

  const [inHero, setInHero] = useState(true);

  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        setScrolled(window.scrollY > 40);
        setPastHero(true);
        const heroEl = document.getElementById("hero");
        if (heroEl) {
          const rect = heroEl.getBoundingClientRect();
          setInHero(rect.bottom > 70);
        } else {
          setInHero(false);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const scrollYRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      isNavigatingRef.current = false;
      scrollYRef.current = window.scrollY;
      document.body.style.overflow = "hidden";
      timerRef.current = setTimeout(() => setMounted(true), 50);
    } else {
      setMounted(false);
      document.body.style.overflow = "";
      // Only restore scroll when closing without navigation (e.g. Escape / close button)
      if (!isNavigatingRef.current) {
        window.scrollTo(0, scrollYRef.current);
      }
      isNavigatingRef.current = false;
    }
    return () => {
      document.body.style.overflow = "";
      if (timerRef.current) clearTimeout(timerRef.current);
      // Do NOT clear navTimerRef here — it must survive the menu close
    };
  }, [isOpen]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    isNavigatingRef.current = true;
    setIsOpen(false);

    // Cancel any pending nav timeout from a previous click
    if (navTimerRef.current) clearTimeout(navTimerRef.current);

    if (href.startsWith("/")) {
      navTimerRef.current = setTimeout(() => navigate(href), 400);
      return;
    }

    if (!isHomePage) {
      navTimerRef.current = setTimeout(() => {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(href.substring(1));
          if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: "smooth" });
        }, 300);
      }, 400);
      return;
    }

    navTimerRef.current = setTimeout(() => {
      const el = document.getElementById(href.substring(1));
      if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: "smooth" });
    }, 450);
  }, [navigate, isHomePage]);

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  }, [navigate, isHomePage]);

  // Switch theme based on hero visibility
  const onDark = !inHero || !isHomePage;
  const inkColor = onDark ? "rgba(232,226,255,0.9)" : "rgba(10,10,10,0.85)";
  const inkColorFaint = onDark ? "rgba(232,226,255,0.45)" : "rgba(10,10,10,0.45)";

  return (
    <>
      {!isHomePage && <div className="h-20 md:h-24 w-full" />}

      <header
        className="fixed top-0 left-0 w-full z-[100] transition-all duration-500"
        style={{
          opacity: 1,
          pointerEvents: 'auto',
          transform: 'translateY(0)',
          padding: "clamp(10px, 2vh, 20px) clamp(12px, 4vw, 56px)",
          backgroundColor: onDark ? "var(--color-primary)" : "#f0f0f0",
          backdropFilter: "blur(14px)",
          borderBottom: onDark ? "1px solid rgba(164,108,252,0.15)" : "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo + tagline */}
          <div className={`flex items-center gap-4 sm:gap-6 transition-all duration-300 ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            <a href="/" onClick={handleLogoClick} aria-label="H2H Social Home" className="shrink-0">
              <H2HLogo className="transition-all duration-500" style={{ height: 'clamp(55px, 10vw, 90px)' }} onDark={onDark} />
            </a>
          </div>

          {/* Right: Menu trigger */}
          <div
            className={`flex items-center gap-3 sm:gap-4 transition-all duration-300 ${
              isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            {/* Menu trigger */}
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open navigation"
              aria-expanded={isOpen}
              className="group flex items-center gap-2.5"
              style={{ minWidth: 44, minHeight: 44, touchAction: "manipulation" }}
            >
              <span
                className="hidden sm:block text-[10px] uppercase tracking-[0.28em] font-medium transition-colors duration-400"
                style={{ fontFamily: "var(--font-stack-heading)", color: inkColorFaint }}
              >
                Menu
              </span>
              <div className="flex flex-col gap-[6px] w-7 sm:w-5">
                <span className="block h-[2px] sm:h-[1.5px] w-full transition-colors duration-400" style={{ backgroundColor: inkColor }} />
                <span className="block h-[2px] sm:h-[1.5px] w-3/4 transition-colors duration-400" style={{ backgroundColor: inkColor }} />
                <span className="block h-[2px] sm:h-[1.5px] w-1/2 transition-colors duration-400" style={{ backgroundColor: inkColor }} />
              </div>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[110] overflow-hidden transition-opacity duration-700 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "var(--color-background-light, #0e0b1f)" }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-20%",
            right: "-10%",
            width: "60vw",
            height: "60vw",
            background: "radial-gradient(circle, rgba(164,108,252,0.06) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "-15%",
            left: "-10%",
            width: "50vw",
            height: "50vw",
            background: "radial-gradient(circle, rgba(164,108,252,0.04) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        <div className="absolute inset-0 flex flex-col overflow-y-auto">
          <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-24 pt-20 sm:pt-24 pb-8 max-w-5xl">
            <nav
              className="flex flex-col"
              onMouseLeave={() => setActiveIndex(null)}
            >
              {NAV_LINKS.map((link, i) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className="group relative flex items-center gap-4 py-3 sm:py-4 md:py-5 overflow-hidden"
                  style={{
                    borderBottom: "1px solid rgba(164,108,252,0.08)",
                    transition: "all 0.6s cubic-bezier(0.76,0,0.24,1)",
                    transitionDelay: mounted ? `${i * 60}ms` : "0ms",
                    transform: mounted ? "translateY(0)" : "translateY(40px)",
                    opacity: mounted ? 1 : 0,
                  }}
                >
                  <div
                    className="absolute inset-0 transition-transform duration-500 origin-left"
                    style={{
                      background: "linear-gradient(90deg, rgba(164,108,252,0.06) 0%, transparent 100%)",
                      transform: activeIndex === i ? "scaleX(1)" : "scaleX(0)",
                    }}
                  />

                  <span
                    className="relative z-10 text-xs shrink-0 transition-colors duration-300"
                    style={{
                      fontFamily: "var(--font-stack-heading)",
                      color: activeIndex === i ? "var(--color-secondary)" : "rgba(232,226,255,0.25)",
                      width: 28,
                    }}
                  >
                    {link.id}
                  </span>

                  <span
                    className="relative z-10 flex-1 text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter uppercase min-w-0"
                    style={{
                      fontFamily: "var(--font-stack-heading)",
                      color: activeIndex !== null && activeIndex !== i
                        ? "rgba(232,226,255,0.12)"
                        : "var(--color-text-dark, #e8e2ff)",
                      transition: "color 0.4s ease",
                    }}
                  >
                    {link.label}
                  </span>

                  <span
                    className="relative z-10 text-[9px] sm:text-[10px] md:text-xs tracking-widest uppercase transition-all duration-300 shrink-0 hidden sm:block"
                    style={{
                      fontFamily: "var(--font-stack-heading)",
                      color: activeIndex === i ? "var(--color-secondary)" : "rgba(232,226,255,0.3)",
                      transform: activeIndex === i ? "translateX(4px)" : "translateX(0)",
                    }}
                  >
                    {link.sub}
                  </span>

                  <svg
                    className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 shrink-0 transition-all duration-300"
                    style={{
                      color: activeIndex === i ? "var(--color-secondary)" : "rgba(232,226,255,0.15)",
                      transform: activeIndex === i ? "translateX(4px)" : "translateX(0)",
                    }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </a>
              ))}
            </nav>

            {/* Contact button */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="inline-flex items-center justify-center mt-8 sm:mt-12"
              style={{
                fontFamily: "var(--font-stack-heading)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#ffffff",
                background: "var(--color-secondary)",
                padding: "16px 32px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                transition: "all 0.6s cubic-bezier(0.76,0,0.24,1)",
                transitionDelay: mounted ? `${NAV_LINKS.length * 60 + 100}ms` : "0ms",
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                opacity: mounted ? 1 : 0,
                boxShadow: "0 4px 16px rgba(164,108,252,0.3)",
                textDecoration: "none",
                alignSelf: "flex-start",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(164,108,252,0.5)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(164,108,252,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Contact Us
            </a>

            {/* Social links */}
            <div
              className="flex items-center gap-6 mt-6 sm:mt-8"
              style={{
                transition: "all 0.6s cubic-bezier(0.76,0,0.24,1)",
                transitionDelay: mounted ? `${NAV_LINKS.length * 60 + 160}ms` : "0ms",
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                opacity: mounted ? 1 : 0,
              }}
            >
              {SOCIAL.filter(s => s.href !== "#").map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-stack-heading)",
                    color: "rgba(232,226,255,0.4)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-secondary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(232,226,255,0.4)"; }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>


        <button
          onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
          className="absolute top-6 right-6 md:top-8 md:right-10 z-[120] group flex items-center gap-3 transition-colors duration-300"
          style={{
            minWidth: 56,
            minHeight: 56,
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
            cursor: "pointer",
            color: "rgba(232,226,255,0.5)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-secondary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(232,226,255,0.5)"; }}
          aria-label="Close menu"
        >
          <span
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ fontFamily: "var(--font-stack-heading)" }}
          >
            Close
          </span>
          <div className="relative w-5 h-5">
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="absolute h-[1px] w-full bg-current rotate-45 transition-transform duration-300 group-hover:rotate-[135deg]" />
              <span className="absolute h-[1px] w-full bg-current -rotate-45 transition-transform duration-300 group-hover:rotate-[45deg]" />
            </span>
          </div>
        </button>
      </div>
    </>
  );
}
