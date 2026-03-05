import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useIsMobile } from "../hooks/useIsMobile";

interface ScrollRevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  className?: string;
  delay?: number;
  mode?: "blur" | "parallax" | "3d";
}

// Blur mode: only IntersectionObserver — no scroll listener
function BlurReveal({ children, width = "100%", className = "", delay = 0 }: Omit<ScrollRevealProps, 'mode'>) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div ref={ref} style={{ width }} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 75, scale: 0.95 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 75, scale: 0.95 }}
        transition={{ duration: 0.9, delay, ease: [0.25, 0.4, 0.25, 1] }}
        style={{ willChange: isInView ? 'auto' : 'opacity, transform' }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Parallax mode: scroll-linked Y transform
function ParallaxReveal({ children, className = "" }: Omit<ScrollRevealProps, 'mode'>) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div ref={ref} className={`${className} overflow-hidden`}>
      <motion.div style={{ y }} className="w-full">
        {children}
      </motion.div>
    </div>
  );
}

// 3D mode: scroll-linked rotateX
function ThreeDReveal({ children, className = "" }: Omit<ScrollRevealProps, 'mode'>) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateX = useTransform(scrollYProgress, [0, 0.3], [15, 0]);

  return (
    <div ref={ref} className={`${className} perspective-1000`}>
      <motion.div
        style={{ rotateX, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export const ScrollReveal = ({ mode = "blur", ...props }: ScrollRevealProps) => {
  const isMobile = useIsMobile();
  const effectiveMode = isMobile ? "blur" : mode;

  if (effectiveMode === "parallax") return <ParallaxReveal {...props} />;
  if (effectiveMode === "3d") return <ThreeDReveal {...props} />;
  return <BlurReveal {...props} />;
};
