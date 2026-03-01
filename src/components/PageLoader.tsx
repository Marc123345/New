import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { H2HLogo } from "./H2HLogo";

const VIDEO_URL =
  "https://ik.imagekit.io/qcvroy8xpd/Video_Generation_Successful%20(1).mp4?updatedAt=1771264402365";

function PhoneSVG() {
  return (
    <svg
      viewBox="0 0 120 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
    >
      <defs>
        <linearGradient id="phoneBody" x1="0" y1="0" x2="120" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#0d0d1a" />
        </linearGradient>
        <linearGradient id="screen" x1="10" y1="20" x2="110" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0a0618" />
          <stop offset="50%" stopColor="#110d24" />
          <stop offset="100%" stopColor="#0a0618" />
        </linearGradient>
        <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.08" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="45%" r="35%">
          <stop offset="0%" stopColor="#a46cfc" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#a46cfc" stopOpacity="0" />
        </radialGradient>
        <filter id="shadow" x="-20%" y="-10%" width="140%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#a46cfc" floodOpacity="0.3" />
        </filter>
      </defs>

      <rect x="4" y="2" width="112" height="216" rx="18" fill="url(#phoneBody)" filter="url(#shadow)" />
      <rect x="4" y="2" width="112" height="216" rx="18" fill="url(#gloss)" />

      <rect x="8" y="6" width="104" height="208" rx="15" fill="url(#screen)" />
      <rect x="8" y="6" width="104" height="208" rx="15" fill="url(#glow)" />

      <rect x="38" y="10" width="44" height="6" rx="3" fill="#0d0d1a" />
      <circle cx="88" cy="13" r="2.5" fill="#1a1a2e" />

      <rect x="20" y="185" width="80" height="4" rx="2" fill="#2a2a3e" />

      <rect x="0" y="60" width="4" height="24" rx="2" fill="#1e1e30" />
      <rect x="0" y="90" width="4" height="24" rx="2" fill="#1e1e30" />
      <rect x="116" y="75" width="4" height="32" rx="2" fill="#1e1e30" />

      <circle cx="60" cy="85" r="22" fill="#a46cfc" fillOpacity="0.1" />
      <circle cx="60" cy="85" r="14" fill="#a46cfc" fillOpacity="0.15" />

      <text x="60" y="128" textAnchor="middle" fill="#a46cfc" fontSize="8" fontFamily="Arial" fontWeight="bold" fillOpacity="0.9">H2H DIGITAL</text>
      <text x="60" y="140" textAnchor="middle" fill="white" fontSize="5.5" fontFamily="Arial" fillOpacity="0.4">Human to Human</text>

      <rect x="20" y="152" width="80" height="18" rx="4" fill="#a46cfc" fillOpacity="0.12" />
      <text x="60" y="164" textAnchor="middle" fill="#c084fc" fontSize="6" fontFamily="Arial" fillOpacity="0.7">Get in Touch</text>

      <circle cx="38" cy="175" r="3" fill="#a46cfc" fillOpacity="0.6" />
      <circle cx="60" cy="175" r="3" fill="#c084fc" fillOpacity="0.6" />
      <circle cx="82" cy="175" r="3" fill="#7c3aed" fillOpacity="0.6" />
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
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setProgress(Math.round(eased * 100));
      if (p < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setExiting(true);
          setTimeout(onComplete, 800);
        }, 300);
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
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#06040f" }}
        >
          <video
            src={VIDEO_URL}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.45 }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(164,108,252,0.12) 0%, transparent 70%), linear-gradient(to bottom, rgba(6,4,15,0.3) 0%, rgba(6,4,15,0.6) 100%)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-sm px-8">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center"
            >
              <H2HLogo height={52} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
              transition={{
                opacity: { duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] },
                y: { duration: 3, delay: 0.9, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{ width: 130, height: 240 }}
            >
              <PhoneSVG />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full space-y-3"
            >
              <div className="flex justify-between items-center">
                <span
                  className="text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: "rgba(164,108,252,0.7)", fontFamily: "var(--font-stack-heading)" }}
                >
                  Loading
                </span>
                <span
                  className="text-[10px] tabular-nums"
                  style={{ color: "rgba(164,108,252,0.7)", fontFamily: "var(--font-stack-heading)" }}
                >
                  {progress}%
                </span>
              </div>

              <div
                className="w-full h-[2px] overflow-hidden"
                style={{ background: "rgba(164,108,252,0.15)" }}
              >
                <motion.div
                  className="h-full"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(to right, #7c3aed, #a46cfc, #c084fc)",
                    boxShadow: "0 0 8px rgba(164,108,252,0.8)",
                    transition: "width 0.12s linear",
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
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999]"
          style={{ background: "#06040f", pointerEvents: "none" }}
        />
      )}
    </AnimatePresence>
  );
}
