import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface ScrollRevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  className?: string;
  delay?: number;
  mode?: "blur" | "parallax" | "3d";
}

// 1. Sleek Blur Reveal (Default)
const BlurReveal = ({ children, delay, width, className }: ScrollRevealProps) => {
  return (
    <div style={{ width }} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 1,
          delay: delay,
          ease: [0.16, 1, 0.3, 1], // Custom "apple-like" easing
        }}
        // Only apply willChange during animation for performance
        style={{ willChange: "transform, opacity, filter" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// 2. Parallax Reveal
const ParallaxReveal = ({ children, className }: ScrollRevealProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Milder, sleeker distance for a premium feel
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <div ref={ref} className={`${className} overflow-hidden`}>
      <motion.div
        style={{ y }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
};

// 3. 3D Tilt Reveal
const ThreeDReveal = ({ children, className }: ScrollRevealProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // Finishes animation exactly when element hits center of screen
    offset: ["start end", "center center"],
  });

  // Tie multiple values to scroll for a highly interactive 3D feel
  const rotateX = useTransform(scrollYProgress, [0, 1], [25, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  return (
    <div ref={ref} className={`${className} perspective-[1200px]`}>
      <motion.div
        style={{ rotateX, opacity, scale, transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Main Export Component
export const ScrollReveal = (props: ScrollRevealProps) => {
  // Routing to specific sub-components prevents unnecessary hook execution
  if (props.mode === "parallax") return <ParallaxReveal {...props} />;
  if (props.mode === "3d") return <ThreeDReveal {...props} />;
  
  return <BlurReveal {...props} />;
};