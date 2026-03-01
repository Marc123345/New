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
    <div className="relative w-6 h-5 flex flex-col justify-between">
      <motion.span
        animate={open ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="block h-[1.5px] w-full origin-center"
        style={{ background: "rgba(232,226,255,0.85)" }}
      />
      <motion.span
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.2 }}
        className="block h-[1.5px] w-4 origin-left"
        style={{ background: "rgba(232,226,255,0.85)" }}
      />
      <motion.span
        animate={open ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="block h-[1.5px] w-full origin-center"
        style={{ background: "rgba(232,226,255,0.85)" }}
      />
    </div>
  );
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
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
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onOutside);
    };
  }, [open]);

  const handleLinkClick = () => setOpen(false);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-6 md:px-10"
        style={{
          height: 68,
          background: scrolled || open ? "rgba(14,11,31,0.92)" : "transparent",
          backdropFilter: scrolled || open ? "blur(20px)" : "none",
          borderBottom: scrolled || open ? "1px solid rgba(164,108,252,0.12)" : "1px solid transparent",
          transition: "background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease",
        }}
      >
        <a href="#" aria-label="H2H Home">
          <H2HLogo height={36} />
        </a>

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex items-center justify-center w-10 h-10 focus:outline-none"
          >
            <HamburgerIcon open={open} />
          </button>
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
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9990]"
              style={{ background: "rgba(8,5,20,0.6)", backdropFilter: "blur(4px)" }}
              onClick={() => setOpen(false)}
            />

            <motion.nav
              key="nav-panel"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 z-[9995] flex flex-col"
              style={{
                width: "min(420px, 90vw)",
                background: "rgba(10,7,24,0.97)",
                backdropFilter: "blur(32px)",
                borderLeft: "1px solid rgba(164,108,252,0.15)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at top right, rgba(164,108,252,0.08) 0%, transparent 65%)",
                }}
              />

              <div className="flex items-center justify-between px-8 pt-5 pb-4" style={{ height: 68 }}>
                <H2HLogo height={32} />
                <button
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-10 h-10 focus:outline-none"
                  aria-label="Close menu"
                >
                  <HamburgerIcon open={true} />
                </button>
              </div>

              <div
                className="mx-8 mb-6"
                style={{ height: "1px", background: "rgba(164,108,252,0.12)" }}
              />

              <ul className="flex flex-col flex-1 px-8 gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.07 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <a
                      href={link.href}
                      onClick={handleLinkClick}
                      className="group flex items-center justify-between py-4 text-[13px] font-medium uppercase tracking-widest border-b"
                      style={{
                        color: "rgba(232,226,255,0.55)",
                        borderColor: "rgba(164,108,252,0.08)",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(232,226,255,0.55)";
                      }}
                    >
                      <span>{link.label}</span>
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="text-[10px] tracking-wider"
                        style={{ color: "#a46cfc" }}
                      >
                        ↗
                      </motion.span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="px-8 pb-10"
              >
                <div
                  className="pt-6 mt-2"
                  style={{ borderTop: "1px solid rgba(164,108,252,0.1)" }}
                >
                  <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: "rgba(164,108,252,0.6)" }}>
                    Human to Human
                  </p>
                  <p className="text-[11px] uppercase tracking-widest" style={{ color: "rgba(232,226,255,0.2)" }}>
                    LinkedIn Growth Agency
                  </p>
                </div>
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
