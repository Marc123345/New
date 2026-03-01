import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { H2HLogo } from "./H2HLogo";

function PhoneSVG() {
  return (
    <svg
      viewBox="0 0 120 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", filter: "drop-shadow(0px 30px 60px rgba(164,108,252,0.2))" }}
    >
      <defs>
        <linearGradient id="phoneBody" x1="0" y1="0" x2="120" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1a1a24" />
          <stop offset="50%" stopColor="#05050a" />
          <stop offset="100%" stopColor="#1a1a24" />
        </linearGradient>
      </defs>
      {/* Outer Chassis */}
      <rect x="2" y="1" width="116" height="218" rx="20" fill="url(#phoneBody)" />
      {/* Inner Screen Bezel */}
      <rect x="6" y="5" width="108" height="210" rx="16" fill="#050505" />
      {/* Screen Display */}
      <rect x="8" y="7" width="104" height="206" rx="14" fill="#000000" />
      
      {/* Hardware Buttons */}
      <rect x="0" y="60" width="2" height="24" rx="1" fill="#2a2a34" />
      <rect x="0" y="90" width="2" height="24" rx="1" fill="#2a2a34" />
      <rect x="118" y="75" width="2" height="32" rx="1" fill="#2a2a34" />
    </svg>
  );
}

interface PageLoaderProps {
  onComplete: () => void;
}

export function PageLoader({ onComplete }: PageLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const DURATION = 3500; // Slightly longer for the dramatic 3D rotation

    function tick(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const p = Math.min(elapsed / DURATION, 1);
      
      // Custom easing for a heavy, premium feel
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      setProgress(Math.round(eased * 100));
      
      if (p < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setExiting(true);
          setTimeout(onComplete, 1200); // Wait for the zoom-in exit to finish
        }, 500);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#000000", perspective: "1200px" }}
        >
          {/* The Phone Container */}
          <motion.div
            initial={{ opacity: 0, z: -500, rotateX: 25, rotateY: -15, y: 50 }}
            animate={{ 
              opacity: 1, 
              z: 0, 
              rotateX: 0, 
              rotateY: 0, 
              y: [0, -10, 0] // Subtle floating
            }}
            exit={{ 
              scale: 15, // THE PUSH-THROUGH EFFECT
              opacity: 0,
              filter: "blur(10px)",
              transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
            }}
            transition={{
              opacity: { duration: 1.5, ease: "easeOut" },
              rotateX: { duration: 3.5, ease: [0.22, 1, 0.36, 1] },
              rotateY: { duration: 3.5, ease: [0.22, 1, 0.36, 1] },
              z: { duration: 3.5, ease: [0.22, 1, 0.36, 1] },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
            }}
            className="relative flex items-center justify-center w-[240px] h-[460px]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <PhoneSVG />
            
            {/* Screen Content */}
            <div className="absolute inset-0 top-[3.5%] left-[7%] right-[7%] bottom-[3.5%] rounded-[18px] flex flex-col items-center justify-center overflow-hidden bg-black">
              
              {/* Animated Glass Shimmer */}
              <motion.div 
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.1) 25%, transparent 30%)",
                  backgroundSize: "200% 200%"
                }}
                animate={{ backgroundPosition: ["200% 0%", "-100% 0%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              {/* Dynamic Island */}
              <div className="absolute top-3 w-[35%] h-[14px] bg-[#050505] rounded-full z-20 shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
              
              <div className="absolute inset-0 bg-gradient-to-b from-[#a46cfc]/5 to-transparent opacity-60 z-0" />

              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.4 } }}
                transition={{ delay: 0.8, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 drop-shadow-[0_0_20px_rgba(164,108,252,0.6)] mb-10"
              >
                <H2HLogo height={46} />
              </motion.div>

              {/* Loader UI */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute bottom-12 w-[75%] flex flex-col space-y-3 z-10"
              >
                <div className="flex justify-between items-end px-1">
                  <span
                    className="text-[8px] uppercase tracking-[0.4em] font-medium"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    System
                  </span>
                  <span
                    className="text-[10px] tabular-nums font-light tracking-widest"
                    style={{ color: "rgba(255,255,255,0.9)" }}
                  >
                    {progress.toString().padStart(3, '0')}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-[1px] bg-white/10 relative overflow-hidden rounded-full">
                  <motion.div
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      background: "linear-gradient(90deg, transparent, #c084fc, #ffffff)",
                      boxShadow: "0 0 12px #a46cfc",
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}