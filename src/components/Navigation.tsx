import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { H2HLogo } from "./H2HLogo";

const NAV_LINKS = [
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="relative flex flex-col justify-center items-end gap-[5px]" style={{ width: 24, height: 20 }}>
      <motion.span
        animate={open ? { rotate: 45, y: 7, width: "100%" } : { rotate: 0, y: 0, width: "100%" }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="block h-[1.5px] origin-center"
        style={{ background: "rgba(232,226,255,0.9)" }}
      />
      <motion.span
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.2 }}
        className="block h-[1.5px] origin-right"
        style={{ background: "rgba(232,226,255,0.9)", width: "65%" }}
      />
      <motion.span
        animate={open ? { rotate: -45, y: -7, width: "100%" } : { rotate: 0, y: 0, width: "100%" }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="block h-[1.5px] origin-center"
        style={{ background: "rgba(232,226,255,0.9)", width: "100%" }}
      />
    </div>
  );
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) {
      window.addEventListener("keydown", onKey);
      window.addEventListener("mousedown", onOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onOutside);
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLinkClick = (href: string) => {
    setActiveLink(href);
    setOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between"
        style={{
          height: 72,
          padding: "0 clamp(1.5rem, 5vw, 3rem)",
          background: scrolled || open ? "rgba(10,7,22,0.94)" : "transparent",
          backdropFilter: scrolled || open ? "blur(24px) saturate(1.5)" : "none",
          borderBottom: scrolled || open ? "1px solid rgba(164,108,252,0.1)" : "1px solid transparent",
          transition: "background 0.45s ease, backdrop-filter 0.45s ease, border-color 0.45s ease",
        }}
      >
        <a href="#" aria-label="H2H Home" style={{ display: "flex", alignItems: "center" }}>
          <H2HLogo height={34} />
        </a>

        <div ref={menuRef} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <motion.a
            href="#contact"
            onClick={() => handleLinkClick("#contact")}
            initial={{ opacity: 0 }}
            animate={{ opacity: scrolled ? 1 : 0, pointerEvents: scrolled ? "auto" : "none" }}
            transition={{ duration: 0.3 }}
            className="hidden md:flex items-center"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "var(--font-stack-heading)",
              fontWeight: 600,
              color: "rgba(232,226,255,0.75)",
              padding: "8px 20px",
              border: "1px solid rgba(164,108,252,0.3)",
              background: "rgba(164,108,252,0.07)",
              marginRight: 8,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.background = "rgba(164,108,252,0.15)";
              e.currentTarget.style.borderColor = "rgba(164,108,252,0.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(232,226,255,0.75)";
              e.currentTarget.style.background = "rgba(164,108,252,0.07)";
              e.currentTarget.style.borderColor = "rgba(164,108,252,0.3)";
            }}
          >
            Get Started
          </motion.a>

          <motion.button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            animate={{ opacity: open ? 0 : 1, pointerEvents: open ? "none" : "auto" }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center focus:outline-none"
            style={{ width: 44, height: 44 }}
          >
            <HamburgerIcon open={false} />
          </motion.button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="fixed inset-0 z-[9990]"
              style={{ background: "rgba(4,2,14,0.7)", backdropFilter: "blur(6px)" }}
              onClick={() => setOpen(false)}
            />

            <motion.nav
              key="nav-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 z-[9995] flex flex-col"
              aria-label="Main navigation"
              style={{
                width: "min(440px, 92vw)",
                background: "rgba(9,6,22,0.98)",
                backdropFilter: "blur(40px)",
                borderLeft: "1px solid rgba(164,108,252,0.12)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse 60% 50% at 100% 0%, rgba(164,108,252,0.1) 0%, transparent 70%)",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse 50% 40% at 0% 100%, rgba(100,60,200,0.06) 0%, transparent 70%)",
                }}
              />

              <div
                className="relative flex items-center justify-between flex-shrink-0"
                style={{
                  height: 72,
                  padding: "0 clamp(1.5rem, 5vw, 2.5rem)",
                  borderBottom: "1px solid rgba(164,108,252,0.08)",
                }}
              >
                <H2HLogo height={32} />
                <button
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center focus:outline-none"
                  aria-label="Close menu"
                  style={{ width: 44, height: 44 }}
                >
                  <HamburgerIcon open={true} />
                </button>
              </div>

              <div
                className="relative flex flex-col flex-1 overflow-y-auto"
                style={{ padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1.5rem, 5vw, 2.5rem)" }}
              >
                <div style={{ marginBottom: "clamp(1rem, 3vw, 1.75rem)" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.65rem",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "rgba(164,108,252,0.45)",
                      fontFamily: "var(--font-stack-heading)",
                      fontWeight: 600,
                    }}
                  >
                    Navigation
                  </span>
                </div>

                <ul className="flex flex-col" style={{ gap: 2 }}>
                  {NAV_LINKS.map((link, i) => (
                    <motion.li
                      key={link.label}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 + i * 0.055, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <a
                        href={link.href}
                        onClick={() => handleLinkClick(link.href)}
                        className="group flex items-center justify-between"
                        style={{
                          padding: "clamp(0.85rem, 2.5vw, 1.1rem) 0",
                          borderBottom: "1px solid rgba(164,108,252,0.07)",
                          textDecoration: "none",
                          transition: "all 0.22s ease",
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget;
                          el.style.paddingLeft = "8px";
                          el.style.borderBottomColor = "rgba(164,108,252,0.2)";
                          const label = el.querySelector<HTMLElement>(".nav-label");
                          if (label) label.style.color = "#fff";
                          const arrow = el.querySelector<HTMLElement>(".nav-arrow");
                          if (arrow) { arrow.style.opacity = "1"; arrow.style.transform = "translate(0,0)"; }
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget;
                          el.style.paddingLeft = "0";
                          el.style.borderBottomColor = "rgba(164,108,252,0.07)";
                          const label = el.querySelector<HTMLElement>(".nav-label");
                          if (label) label.style.color = activeLink === link.href ? "rgba(232,226,255,0.9)" : "rgba(232,226,255,0.5)";
                          const arrow = el.querySelector<HTMLElement>(".nav-arrow");
                          if (arrow) { arrow.style.opacity = "0"; arrow.style.transform = "translate(-6px, 0)"; }
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                          <span
                            style={{
                              fontSize: "0.6rem",
                              letterSpacing: "0.1em",
                              color: "rgba(164,108,252,0.4)",
                              fontFamily: "var(--font-stack-heading)",
                              fontWeight: 600,
                              minWidth: 20,
                              lineHeight: 1,
                            }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className="nav-label"
                            style={{
                              fontSize: "clamp(1.4rem, 4.5vw, 1.85rem)",
                              fontFamily: "var(--font-stack-heading)",
                              fontWeight: 700,
                              letterSpacing: "-0.02em",
                              color: activeLink === link.href ? "rgba(232,226,255,0.9)" : "rgba(232,226,255,0.5)",
                              lineHeight: 1,
                              transition: "color 0.22s ease",
                            }}
                          >
                            {link.label}
                          </span>
                        </div>
                        <span
                          className="nav-arrow"
                          style={{
                            fontSize: "0.8rem",
                            color: "rgba(164,108,252,0.7)",
                            opacity: 0,
                            transform: "translate(-6px, 0)",
                            transition: "opacity 0.22s ease, transform 0.22s ease",
                          }}
                        >
                          ↗
                        </span>
                      </a>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.52, duration: 0.4 }}
                  style={{ marginTop: "clamp(2rem, 5vw, 3rem)" }}
                >
                  <a
                    href="#contact"
                    onClick={() => handleLinkClick("#contact")}
                    className="flex items-center justify-center"
                    style={{
                      padding: "clamp(0.9rem, 2.5vw, 1.1rem) 2rem",
                      border: "1px solid rgba(164,108,252,0.35)",
                      background: "rgba(164,108,252,0.08)",
                      fontSize: "0.72rem",
                      fontFamily: "var(--font-stack-heading)",
                      fontWeight: 600,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(232,226,255,0.8)",
                      textDecoration: "none",
                      transition: "all 0.25s ease",
                      width: "100%",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(164,108,252,0.18)";
                      e.currentTarget.style.borderColor = "rgba(164,108,252,0.6)";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(164,108,252,0.08)";
                      e.currentTarget.style.borderColor = "rgba(164,108,252,0.35)";
                      e.currentTarget.style.color = "rgba(232,226,255,0.8)";
                    }}
                  >
                    Start a Project &nbsp;→
                  </a>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="relative flex-shrink-0 flex items-center justify-between flex-wrap"
                style={{
                  padding: "clamp(1rem, 3vw, 1.5rem) clamp(1.5rem, 5vw, 2.5rem)",
                  borderTop: "1px solid rgba(164,108,252,0.08)",
                  gap: 8,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(164,108,252,0.55)",
                      fontFamily: "var(--font-stack-heading)",
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    Human to Human
                  </p>
                  <p
                    style={{
                      fontSize: "0.62rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(232,226,255,0.2)",
                      fontFamily: "var(--font-stack-heading)",
                      margin: "3px 0 0 0",
                    }}
                  >
                    LinkedIn Growth Agency
                  </p>
                </div>
                <span
                  style={{
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "rgba(164,108,252,0.5)",
                    boxShadow: "0 0 8px rgba(164,108,252,0.4)",
                  }}
                />
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
