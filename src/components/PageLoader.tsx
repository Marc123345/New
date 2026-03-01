import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { H2HLogo } from "./H2HLogo";

const VIDEO_URL =
  "https://ik.imagekit.io/qcvroy8xpd/Video_Generation_Successful%20(1).mp4?updatedAt=1771264402365";

// Stripped down to just the sleek hardware
function PhoneSVG() {
  return (
    <svg
      viewBox="0 0 120 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", filter: "drop-shadow(0px 20px 40px rgba(164,108,252,0.2))" }}
    >
      <defs>
        <linearGradient id="phoneBody" x1="0" y1="0" x2="120" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2a2a3e" />
          <stop offset="50%" stopColor="#0d0d1a" />
          <stop offset="100%" stopColor="#1a1a2e" />
        </linearGradient>
        <linearGradient id="screen" x1="10" y1="20" x2="110" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#05020a" />
          <stop offset="50%" stopColor="#0a0618" />
          <stop offset="100%" stopColor="#05020a" />
        </linearGradient>
        <linearGradient id="gloss" x1="0" y1="0" x2="120" y2="220">
          <stop offset="0%" stopColor="white" stopOpacity="0.15" />
          <stop offset="40%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Outer Chassis */}
      <rect x="2" y="1" width="116" height="218" rx="20" fill="url(#phoneBody)" />
      
      {/* Inner Screen Bezel */}
      <rect x="6" y="5" width="108" height="210" rx="16" fill="black" />
      
      {/* Screen Display */}
      <rect x="8" y="7" width="104" height="206" rx="14" fill="url(#screen)" />
      
      {/* Glass Reflection */}
      <rect x="2" y="1" width="116" height="218" rx="20" fill="url(#gloss)" />

      {/* Hardware Buttons */}
      <rect x="0" y="60" width="2" height="24" rx="1" fill="#3a3a4e" />
      <rect x="0" y="90" width="2" height="24" rx="1" fill="#3a3a4e" />
      <rect x="118" y="75" width="2" height="32" rx="1" fill="#3a3a4e" />
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
    const DURATION = 3000;

    function tick(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const p = Math.min(elapsed / DURATION, 1);
      // Cinematic easing
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      setProgress(Math.round(eased * 100));
      if (p < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setExiting(true);
          setTimeout(onComplete, 1000); // Slightly longer fade out for elegance
        }, 400);
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
          exit={{ opacity: 0, scale: 1.05 }} // Subtle zoom-in on exit
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#020104" }}
        >
          {/* Background Video with Noise/Blur overlay for cinematic feel */}
          <video
            src={VIDEO_URL}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen"
            style={{ opacity: 0.25, filter: "blur(4px)" }}
          />

          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(164,108,252,0.08) 0%, rgba(2,1,4,0.9) 70%)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-8">
            
            {/* The Floating Phone Component */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: 10 }}
              animate={{ opacity: 1, y: [0, -12, 0], rotateX: 0 }}
              transition={{
                opacity: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
                rotateX: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="relative flex items-center justify-center w-[160px] h-[300px]"
              style={{ perspective: "1000px" }}
            >
              <PhoneSVG />
              
              {/* Screen Content Wrapper */}
              <div className="absolute inset-0 top-[4%] left-[7%] right-[7%] bottom-[4%] rounded-[12px] flex flex-col items-center justify-center overflow-hidden">
                
                {/* Simulated Dynamic Island */}
                <div className="absolute top-2 w-[35%] h-[14px] bg-[#020104] rounded-full border border-white/5 z-20 shadow-inner" />
                
                {/* Glowing Screen Aura */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#a46cfc]/10 to-transparent opacity-50" />

                {/* The Logo inside the phone */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 drop-shadow-[0_0_15px_rgba(164,108,252,0.5)]"
                >
                  <H2HLogo height={38} />
                </motion.div>
              </div>
            </motion.div>

            {/* Premium Loading Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full mt-16 space-y-4"
            >
              <div className="flex justify-between items-end px-1">
                <span
                  className="text-[9px] uppercase tracking-[0.4em] font-medium"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Initializing
                </span>
                <span
                  className="text-[10px] tabular-nums font-light tracking-wider"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  {progress}%
                </span>
              </div>

              {/* 1px hairline progress bar */}
              <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, transparent, #c084fc, #fff)",
                    boxShadow: "0 0 10px #a46cfc",
                    transition: "width 0.1s linear",
                  }}
                />
              </div>
            </motion.div>

          </div>
        </motion.div>
      ) : (
        <motion.div
          key="page-loader-exit"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999]"
          style={{ background: "#020104", pointerEvents: "none" }}
        />
      )}
    </AnimatePresence>
  );
}