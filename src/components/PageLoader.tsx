import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { H2HLogo } from "./H2HLogo";

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
          style={{ background: "#0e0b1f" }}
        >
          {/* Background video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.85 }}
          >
            <source
              src="https://ik.imagekit.io/qcvroy8xpd/Video_Generation_Successful.mp4?updatedAt=1771263861214"
              type="video/mp4"
            />
          </video>

          {/* Dark overlay so text/logo remains readable */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />

          {/* Logo + progress UI */}
          <div className="relative z-10 flex flex-col items-center w-full max-w-xs px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-12 drop-shadow-[0_0_24px_rgba(255,255,255,0.25)]"
            >
              <H2HLogo height={56} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col space-y-3"
            >
              <div className="flex justify-between items-end px-1">
                <span
                  className="text-[9px] uppercase tracking-[0.3em] font-medium"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  Loading
                </span>
                <span
                  className="text-[10px] tabular-nums font-light tracking-wider"
                  style={{ color: "rgba(255,255,255,0.9)" }}
                >
                  {progress}%
                </span>
              </div>

              <div className="w-full h-[1px] bg-white/15 relative overflow-hidden rounded-full">
                <motion.div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), #fff)",
                    boxShadow: "0 0 12px rgba(255,255,255,0.5)",
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
          style={{ background: "#0e0b1f", pointerEvents: "none" }}
        />
      )}
    </AnimatePresence>
  );
}
