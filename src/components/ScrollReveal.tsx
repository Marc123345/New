import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";

interface ScrollRevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  className?: string;
  delay?: number;
  // "Blur" does the lens focus effect, "Parallax" moves slower than scroll
  mode?: "blur" | "parallax" | "3d";
}

export const ScrollReveal = ({
  children,
  width = "100%",
  className = "",
  delay = 0,
  mode = "blur"
}: ScrollRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const hasBeenViewed = isInView;
  
  // For Parallax Mode
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]); // Moves opposite to scroll
  const rotateX = useTransform(scrollYProgress, [0, 0.3], [15, 0]); // Tilts up

  if (mode === "parallax") {
    return (
      <div ref={ref} className={`${className} overflow-hidden`}>
        <motion.div style={{ y }} className="w-full">
          {children}
        </motion.div>
      </div>
    );
  }

  if (mode === "3d") {
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

  // DEFAULT: "The Lens Focus Reveal" (Award Winning Style)
  return (
    <div ref={ref} style={{ width }} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 75, scale: 0.95 }}
        animate={hasBeenViewed ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 75, scale: 0.95 }}
        transition={{
          duration: 0.9,
          delay: delay,
          ease: [0.25, 0.4, 0.25, 1]
        }}
        style={{ willChange: hasBeenViewed ? 'auto' : 'opacity, transform' }}
      >
        {children}
      </motion.div>
    </div>
  );
};
