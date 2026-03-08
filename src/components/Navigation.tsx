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
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      scrollYRef.current = window.scrollY;
      document.body.style.overflow = "hidden";
      timerRef.current = setTimeout(() => setMounted(true), 50);
    } else {
      setMounted(false);
      document.body.style.overflow = "";
      window.scrollTo(0, scrollYRef.current);
    }
    return () => {
      document.body.style.overflow = "";
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);

    if (href.startsWith("/")) {
      setTimeout(() => navigate(href), 400);
      return;
    }

    if (!isHomePage) {
      setTimeout(() => {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(href.substring(1));
          if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: "smooth" });
        }, 300);
      }, 400);
      return;
    }

    setTimeout(() => {
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

  return (
    <>
      <div className="h-20 md:h-24 w-full" />

      <header
        className="fixed top-0 left-0 w-full z-[100] py-6 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? "var(--color-background-light)" : "transparent",
          borderBottom: scrolled ? "1px solid var(--color-text-dark)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="container mx-auto px-6 sm:px-8 md:px-12 flex items-center justify-between">
          <a
            href="/"
            aria-label="H2H Social Home"
            onClick={handleLogoClick}
            className={`relative z-[110] transition-all duration-300 ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          >
            <H2HLogo height={56} className="transition-all duration-300" />
          </a>

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation"
            aria-expanded={isOpen}
            className={`relative z-[110] group flex items-center gap-3 transition-all duration-300 ${
              isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            style={{ minWidth: 44, minHeight: 44, touchAction: "manipulation" }}
          >
            <span
              className="hidden sm:block text-[10px] uppercase tracking-[0.3em] font-medium transition-colors duration-500"
              style={{
                fontFamily: "var(--font-stack-heading)",
                color: scrolled ? "var(--color-text-dark)" : "rgba(255,255,255,0.85)",
              }}
            >
              Menu
            </span>
            <div className="flex flex-col gap-[5px] w-6">
              <span className="block h-[1.5px] w-full transition-colors duration-500" style={{ backgroundColor: scrolled ? "var(--color-text-dark)" : "rgba(255,255,255,0.85)" }} />
              <span className="block h-[1.5px] w-3/4 transition-colors duration-500" style={{ backgroundColor: scrolled ? "var(--color-text-dark)" : "rgba(255,255,255,0.85)" }} />
              <span className="block h-[1.5px] w-1/2 transition-colors duration-500" style={{ backgroundColor: scrolled ? "var(--color-text-dark)" : "rgba(255,255,255,0.85)" }} />
            </div>
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[110] transition-opacity duration-700 ${
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

        <div className="absolute inset-0 flex flex-col lg:flex-row">
          <div className="flex-1 lg:w-[60%] flex flex-col justify-center px-6 sm:px-8 md:px-16 lg:px-24 pt-14 sm:pt-16 lg:pt-0 overflow-y-auto">
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
                  className="group relative flex items-center py-2.5 sm:py-3 md:py-4 overflow-hidden"
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
                    className="relative z-10 w-10 text-xs mr-6 transition-colors duration-300"
                    style={{
                      fontFamily: "var(--font-stack-heading)",
                      color: activeIndex === i ? "var(--color-secondary)" : "rgba(232,226,255,0.25)",
                    }}
                  >
                    {link.id}
                  </span>

                  <span
                    className="relative z-10 flex-1 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase"
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
                    className="relative z-10 hidden md:block text-xs tracking-widest uppercase transition-all duration-300"
                    style={{
                      fontFamily: "var(--font-stack-heading)",
                      color: activeIndex === i ? "var(--color-secondary)" : "rgba(232,226,255,0.3)",
                      transform: activeIndex === i ? "translateX(4px)" : "translateX(0)",
                    }}
                  >
                    {link.sub}
                  </span>

                  <svg
                    className="relative z-10 ml-4 w-5 h-5 transition-all duration-300"
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
          </div>

          <div
            className="hidden lg:flex lg:w-[40%] flex-col justify-between py-24 px-16"
            style={{
              borderLeft: "1px solid rgba(164,108,252,0.08)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
              transitionDelay: mounted ? "200ms" : "0ms",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateX(0)" : "translateX(30px)",
            }}
          >
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.4em] mb-6"
                style={{
                  fontFamily: "var(--font-stack-heading)",
                  color: "var(--color-secondary)",
                }}
              >
                H2H Social
              </p>
              <p
                className="text-sm leading-relaxed max-w-xs"
                style={{ color: "rgba(232,226,255,0.55)" }}
              >
                Bridging human potential with digital innovation across Africa and beyond.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1" style={{ background: "rgba(164,108,252,0.1)" }} />
              <div className="w-1.5 h-1.5" style={{ background: "var(--color-secondary)", opacity: 0.4 }} />
            </div>

            <div className="space-y-8">
              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.4em] mb-3"
                  style={{
                    fontFamily: "var(--font-stack-heading)",
                    color: "rgba(232,226,255,0.35)",
                  }}
                >
                  Get in touch
                </p>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "#contact")}
                  className="text-sm transition-colors duration-300"
                  style={{ color: "rgba(232,226,255,0.55)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-secondary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(232,226,255,0.55)"; }}
                >
                  hello@h2hdigital.com
                </a>
              </div>

              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.4em] mb-3"
                  style={{
                    fontFamily: "var(--font-stack-heading)",
                    color: "rgba(232,226,255,0.35)",
                  }}
                >
                  Follow us
                </p>
                <div className="flex gap-4">
                  {SOCIAL.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="text-[11px] uppercase tracking-widest transition-colors duration-300"
                      style={{
                        fontFamily: "var(--font-stack-heading)",
                        color: "rgba(232,226,255,0.45)",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-secondary)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(232,226,255,0.45)"; }}
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 md:px-16 py-4 sm:py-5 flex items-center justify-between"
          style={{
            borderTop: "1px solid rgba(164,108,252,0.08)",
            transition: "opacity 0.8s ease",
            transitionDelay: mounted ? "350ms" : "0ms",
            opacity: mounted ? 1 : 0,
          }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.4em]"
            style={{
              fontFamily: "var(--font-stack-heading)",
              color: "rgba(232,226,255,0.3)",
            }}
          >
            &copy; {new Date().getFullYear()} H2H Social
          </p>
          <div className="flex lg:hidden gap-5">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="text-[10px] uppercase tracking-widest transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-stack-heading)",
                  color: "rgba(232,226,255,0.3)",
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
          <p
            className="hidden sm:block text-[10px] uppercase tracking-[0.4em]"
            style={{
              fontFamily: "var(--font-stack-heading)",
              color: "rgba(232,226,255,0.3)",
            }}
          >
            Nairobi &middot; Cape Town
          </p>
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
