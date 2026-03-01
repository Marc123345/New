
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
// Assuming H2HLogo is in the same directory
import { H2HLogo } from "./H2HLogo"; 

const NAV_LINKS = [
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Blog", href: "#blog" },
];

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  const { scrollY } = useScroll();

  // Smart scroll effect: Hide on scroll down, show on scroll up
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > 150 && latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 40);
  });

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-100%", opacity: 0 },
        }}
        animate={hidden && !mobileOpen ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-6 md:px-10"
        style={{
          height: 80, // Slightly taller for a more premium breathing room
          background: scrolled ? "rgba(14, 11, 31, 0.7)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(164, 108, 252, 0.1)" : "1px solid transparent",
          transition: "background 0.4s ease, backdrop-filter 0.4s ease",
        }}
      >
        {/* Logo */}
        <div className="flex-1 flex justify-start">
          <a href="#" aria-label="H2H Home" className="relative z-50">
            <H2HLogo height={36} />
          </a>
        </div>

        {/* Desktop Links with Sliding Pill Effect */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-2 relative">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onMouseEnter={() => setHoveredLink(link.label)}
              onMouseLeave={() => setHoveredLink(null)}
              className="relative px-4 py-2 text-[13px] font-medium uppercase tracking-widest transition-colors duration-300 z-10"
              style={{
                color: hoveredLink === link.label ? "#fff" : "rgba(232,226,255,0.65)",
              }}
            >
              {link.label}
              {/* The Sliding Pill */}
              {hoveredLink === link.label && (
                <motion.div
                  layoutId="nav-hover-pill"
                  className="absolute inset-0 bg-white/10 rounded-full -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </a>
          ))}
        </nav>

        {/* Desktop CTA & Mobile Toggle */}
        <div className="flex-1 flex justify-end items-center gap-4">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#contact"
            className="hidden md:inline-flex px-6 py-2.5 rounded-full text-[13px] font-bold uppercase tracking-widest bg-gradient-to-r from-[#a46cfc] to-[#7b3fe4] text-white shadow-[0_0_20px_rgba(164,108,252,0.3)] hover:shadow-[0_0_30px_rgba(164,108,252,0.5)] transition-shadow duration-300"
          >
            Get in Touch
          </motion.a>

          <button
            className="md:hidden relative z-[10000] flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
            style={{ color: "#fff" }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <motion.div
              animate={{ rotate: mobileOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </div>
      </motion.header>

      {/* Full-Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9998] flex flex-col justify-center px-10"
            style={{
              background: "rgba(14,11,31,0.98)",
              backdropFilter: "blur(24px)",
            }}
          >
            <nav className="flex flex-col gap-6 mt-12">
              {[...NAV_LINKS, { label: "Contact", href: "#contact" }].map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-4xl font-light tracking-wide text-white hover:text-[#a46cfc] transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}