import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  { label: "LinkedIn", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "Instagram", href: "#" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${scrollY}px`;
      timerRef.current = setTimeout(() => setMounted(true), 50);
    } else {
      setMounted(false);
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      if (scrollY) window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    if (href.startsWith("/")) {
      setTimeout(() => navigate(href), 500);
      return;
    }
    setTimeout(() => {
      const el = document.getElementById(href.substring(1));
      if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: "smooth" });
    }, 550);
  };

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
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <a
            href="#hero"
            aria-label="H2H Digital Home"
            onClick={(e) => { 
              e.preventDefault(); 
              setIsOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" }); 
            }}
            className="relative z-[110] transition-all duration-300 opacity-100"
          >
            {/* Logo remains visible even when menu is open for brand consistency */}
            <H2HLogo height={56} className="transition-all duration-300" />
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isOpen}
            className={`relative z-[110] group flex items-center gap-3 transition-all duration-300 ${
              isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
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

      {/* Fullscreen overlay */}
      <div
        className={`fixed inset-0 z-[105] transition-opacity duration-700 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "#0c0c0c" }}
      >

        {/* Accent gradient blob */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-20%",
            right: "-10%",
            width: "60vw",
            height: "60vw",
            background: "radial-gradient(circle, rgba(180,140,80,0.07) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 md:top-8 md:right-10 z-20 group flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-300"
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


        {/* Main content grid */}
        <div className="absolute inset-0 flex flex-col lg:flex-row">
          {/* Left: Nav links (60%) */}
          <div className="flex-1 lg:w-[60%] flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-28 lg:pt-0">
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
                  className="group relative flex items-center py-5 md:py-4 border-b border-white/[0.06] overflow-hidden"
                  style={{
                    transition: "all 0.6s cubic-bezier(0.76,0,0.24,1)",
                    transitionDelay: mounted ? `${i * 60}ms` : "0ms",
                    transform: mounted ? "translateY(0)" : "translateY(40px)",
                    opacity: mounted ? 1 : 0,
                  }}
                >
                  {/* Hover background fill */}
                  <div
                    className="absolute inset-0 bg-white/[0.03] transition-transform duration-500 origin-left"
                    style={{ transform: activeIndex === i ? "scaleX(1)" : "scaleX(0)" }}
                  />

                  {/* Number */}
                  <span
                    className="relative z-10 w-10 text-xs text-white/20 mr-6 transition-colors duration-300 group-hover:text-white/40"
                    style={{ fontFamily: "var(--font-stack-heading)" }}
                  >
                    {link.id}
                  </span>

                  {/* Label - Resized for better mobile fit */}
                  <span
                    className="relative z-10 flex-1 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase"
                    style={{
                      fontFamily: "var(--font-stack-heading)",
                      color: activeIndex !== null && activeIndex !== i ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.9)",
                      transition: "color 0.4s ease",
                    }}
                  >
                    {link.label}
                  </span>

                  {/* Sub label */}
                  <span
                    className="relative z-10 hidden md:block text-xs tracking-widest uppercase text-white/30 transition-all duration-300 group-hover:text-white/60 group-hover:translate-x-1"
                    style={{ fontFamily: "var(--font-stack-heading)" }}
                  >
                    {link.sub}
                  </span>

                  {/* Arrow */}
                  <svg
                    className="relative z-10 ml-4 w-5 h-5 text-white/20 transition-all duration-300 group-hover:text-white/70 group-hover:translate-x-1"
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

          {/* Right panel: info (40%) — desktop only */}
          <div
            className="hidden lg:flex lg:w-[40%] flex-col justify-between py-24 px-16 border-l border-white/[0.06]"
            style={{
              transition: "opacity 0.8s ease, transform 0.8s ease",
              transitionDelay: mounted ? "200ms" : "0ms",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateX(0)" : "translateX(30px)",
            }}
          >
            {/* Top: tagline */}
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-6"
                style={{ fontFamily: "var(--font-stack-heading)" }}
              >
                H2H Digital
              </p>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                Bridging human potential with digital innovation across Africa and beyond.
              </p>
            </div>

            {/* Middle: decorative element */}
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-white/10" />
              <div className="w-1 h-1 rounded-full bg-white/20" />
            </div>

            {/* Bottom: contact + social */}
            <div className="space-y-8">
              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.4em] text-white/20 mb-3"
                  style={{ fontFamily: "var(--font-stack-heading)" }}
                >
                  Get in touch
                </p>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "#contact")}
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  hello@h2hdigital.com
                </a>
              </div>

              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.4em] text-white/20 mb-3"
                  style={{ fontFamily: "var(--font-stack-heading)" }}
                >
                  Follow us
                </p>
                <div className="flex gap-4">
                  {SOCIAL.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="text-[11px] uppercase tracking-widest text-white/40 hover:text-white transition-colors duration-300"
                      style={{ fontFamily: "var(--font-stack-heading)" }}
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="absolute bottom-0 left-0 right-0 px-8 md:px-16 py-5 flex items-center justify-between border-t border-white/[0.06]"
          style={{
            transition: "opacity 0.8s ease",
            transitionDelay: mounted ? "350ms" : "0ms",
            opacity: mounted ? 1 : 0,
          }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.4em] text-white/20"
            style={{ fontFamily: "var(--font-stack-heading)" }}
          >
            &copy; {new Date().getFullYear()} H2H Digital
          </p>
          <div className="flex lg:hidden gap-5">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white/70 transition-colors duration-300"
                style={{ fontFamily: "var(--font-stack-heading)" }}
              >
                {s.label}
              </a>
            ))}
          </div>
          <p
            className="text-[10px] uppercase tracking-[0.4em] text-white/20 hidden sm:block"
            style={{ fontFamily: "var(--font-stack-heading)" }}
          >
            Nairobi · Lagos · Cape Town
          </p>
        </div>
      </div>
    </>
  );
}