import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { H2HLogo } from "./H2HLogo";

function PhoneSVG() {
  return (
    <svg
      viewBox="0 0 120 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", filter: "drop-shadow(0px 20px 40px rgba(164,108,252,0.15))" }}
    >
      <defs>
        <linearGradient id="phoneBody" x1="0" y1="0" x2="120" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1a1a24" />
          <stop offset="50%" stopColor="#0a0a12" />
          <stop offset="100%" stopColor="#1a1a24" />
        </linearGradient>
        <linearGradient id="gloss" x1="0" y1="0" x2="120" y2="220">
          <stop offset="0%" stopColor="white" stopOpacity="0.1" />
          <stop offset="40%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="2" y="1" width="116" height="218" rx="20" fill="url(#phoneBody)" />
      <rect x="6" y="5" width="108" height="210" rx="16" fill="#050505" />
      <rect x="8" y="7" width="104" height="206" rx="14" fill="#000000" />
      <rect x="2" y="1" width="116" height="218" rx="20" fill="url(#gloss)" />

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
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    let start: number | null = null;
    const DURATION = 3000;

    function tick(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const p = Math.min(elapsed / DURATION, 1);
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      setProgress(Math.round(eased * 100));
      if (p < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        t1 = setTimeout(() => {
          setExiting(true);
          t2 = setTimeout(onComplete, 1000);
        }, 400);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source
              src="https://ik.imagekit.io/qcvroy8xpd/Video_Generation_Successful.mp4?updatedAt=1771263861214"
              type="video/mp4"
            />
          </video>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50 pointer-events-none" />

          {/* Phone + UI */}
          <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-8">
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: 10 }}
              animate={{ opacity: 1, y: [0, -12, 0], rotateX: 0 }}
              transition={{
                opacity: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
                rotateX: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="relative flex items-center justify-center w-[220px] h-[420px]"
              style={{ perspective: "1000px" }}
            >
              <PhoneSVG />

              {/* Screen content */}
              <div className="absolute inset-0 top-[3.5%] left-[7%] right-[7%] bottom-[3.5%] rounded-[18px] flex flex-col items-center justify-center overflow-hidden bg-black">
                {/* Dynamic Island */}
                <div className="absolute top-3 w-[35%] h-[14px] bg-[#050505] rounded-full border border-white/5 z-20 shadow-inner" />

                {/* Screen glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#a46cfc]/5 to-transparent opacity-50 pointer-events-none" />

                {/* Logo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 drop-shadow-[0_0_15px_rgba(164,108,252,0.4)] mb-8"
                >
                  <H2HLogo height={42} />
                </motion.div>

                {/* Progress bar */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-10 w-[75%] flex flex-col space-y-3"
                >
                  <div className="flex justify-between items-end px-1">
                    <span
                      className="text-[8px] uppercase tracking-[0.3em] font-medium"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      Loading
                    </span>
                    <span
                      className="text-[9px] tabular-nums font-light tracking-wider"
                      style={{ color: "rgba(255,255,255,0.9)" }}
                    >
                      {progress}%
                    </span>
                  </div>

                  <div className="w-full h-[1px] bg-white/10 relative overflow-hidden rounded-full">
                    <motion.div
                      className="absolute top-0 left-0 h-full rounded-full"
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
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="page-loader-exit"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999]"
          style={{ background: "#000000", pointerEvents: "none" }}
        />
      )}
    </AnimatePresence>
  );
}
