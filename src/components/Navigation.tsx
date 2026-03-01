import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { H2HLogo } from "./H2HLogo";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLinkClick = () => setMobileOpen(false);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-6 md:px-10"
        style={{
          height: 68,
          background: scrolled
            ? "rgba(14,11,31,0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(164,108,252,0.12)" : "1px solid transparent",
          transition: "background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease",
        }}
      >
        <a href="#" aria-label="H2H Home">
          <H2HLogo height={36} />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[13px] font-medium uppercase tracking-widest transition-colors duration-200"
              style={{ color: "rgba(232,226,255,0.65)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#a46cfc")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,226,255,0.65)")}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-md"
          style={{ color: "rgba(232,226,255,0.8)" }}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[68px] left-0 right-0 z-[9998] flex flex-col"
            style={{
              background: "rgba(14,11,31,0.97)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(164,108,252,0.15)",
            }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.25, ease: "easeOut" }}
                onClick={handleLinkClick}
                className="px-8 py-4 text-[13px] font-medium uppercase tracking-widest border-b"
                style={{
                  color: "rgba(232,226,255,0.7)",
                  borderColor: "rgba(164,108,252,0.08)",
                }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
