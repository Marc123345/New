import { memo } from "react";
import { motion } from "motion/react";
import { useIsMobile } from "../../hooks/useIsMobile";

const SHANNON_PHOTO = "https://ik.imagekit.io/qcvroy8xpd/1770306949175.jpeg?tr=f-auto,q-80";

// Exact same 8-icon set as the Loader component (ICONS array there) — same
// order, same background colours, same text-or-SVG rendering pattern. Keeps
// the contact hero visually consistent with the intro Loader.
const IG_GRADIENT =
  "linear-gradient(135deg,#feda75,#fa7e1e 25%,#d62976 50%,#962fbf 75%,#4f5bd5)";

const TIKTOK_PATH =
  "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z";
const IG_PATH =
  "M66.004 18c-13.036 0-14.672.057-19.792.29-5.11.234-8.598 1.043-11.65 2.23-3.157 1.226-5.835 2.866-8.503 5.535-2.67 2.668-4.31 5.346-5.54 8.502-1.19 3.053-2 6.542-2.23 11.65C18.06 51.327 18 52.964 18 66s.058 14.667.29 19.787c.235 5.11 1.044 8.598 2.23 11.65 1.227 3.157 2.867 5.835 5.536 8.503 2.667 2.67 5.345 4.314 8.5 5.54 3.054 1.187 6.543 1.996 11.652 2.23 5.12.233 6.755.29 19.79.29 13.037 0 14.668-.057 19.788-.29 5.11-.234 8.602-1.043 11.656-2.23 3.156-1.226 5.83-2.87 8.497-5.54 2.67-2.668 4.31-5.346 5.54-8.502 1.18-3.053 1.99-6.542 2.23-11.65.23-5.12.29-6.752.29-19.788 0-13.036-.06-14.672-.29-19.792-.24-5.11-1.05-8.598-2.23-11.65-1.23-3.157-2.87-5.835-5.54-8.503-2.67-2.67-5.34-4.31-8.5-5.535-3.06-1.187-6.55-1.996-11.66-2.23-5.12-.233-6.75-.29-19.79-.29zm-4.306 8.65c1.278-.002 2.704 0 4.306 0 12.816 0 14.335.046 19.396.276 4.68.214 7.22.996 8.912 1.653 2.24.87 3.837 1.91 5.516 3.59 1.68 1.68 2.72 3.28 3.592 5.52.657 1.69 1.44 4.23 1.653 8.91.23 5.06.28 6.58.28 19.39s-.05 14.33-.28 19.39c-.214 4.68-.996 7.22-1.653 8.91-.87 2.24-1.912 3.835-3.592 5.514-1.68 1.68-3.275 2.72-5.516 3.59-1.69.66-4.232 1.44-8.912 1.654-5.06.23-6.58.28-19.396.28-12.817 0-14.336-.05-19.396-.28-4.68-.216-7.22-.998-8.913-1.655-2.24-.87-3.84-1.91-5.52-3.59-1.68-1.68-2.72-3.276-3.592-5.517-.657-1.69-1.44-4.23-1.653-8.91-.23-5.06-.276-6.58-.276-19.398s.046-14.33.276-19.39c.214-4.68.996-7.22 1.653-8.912.87-2.24 1.912-3.84 3.592-5.52 1.68-1.68 3.28-2.72 5.52-3.592 1.692-.66 4.233-1.44 8.913-1.655 4.428-.2 6.144-.26 15.09-.27zm29.928 7.97c-3.18 0-5.76 2.577-5.76 5.758 0 3.18 2.58 5.76 5.76 5.76 3.18 0 5.76-2.58 5.76-5.76 0-3.18-2.58-5.76-5.76-5.76zm-25.622 6.73c-13.613 0-24.65 11.037-24.65 24.65 0 13.613 11.037 24.645 24.65 24.645C79.617 90.645 90.65 79.613 90.65 66S79.616 41.35 66.003 41.35zm0 8.65c8.836 0 16 7.163 16 16 0 8.836-7.164 16-16 16-8.837 0-16-7.164-16-16 0-8.837 7.163-16 16-16z";

interface Icon {
  label: string;
  bg: string; // hex colour or IG_GRADIENT
  text?: string;
  svg?: "react" | "tiktok" | "instagram";
}

const ICONS: Icon[] = [
  { label: "LinkedIn",  bg: "#0A66C2", text: "in" },
  { label: "Facebook",  bg: "#1877F2", text: "f" },
  { label: "YouTube",   bg: "#FF0000", text: "▶" },
  { label: "X",         bg: "#000000", text: "𝕏" },
  { label: "Google",    bg: "#4285F4", text: "G" },
  { label: "React",     bg: "#20232a", svg: "react" },
  { label: "TikTok",    bg: "#000000", svg: "tiktok" },
  { label: "Instagram", bg: IG_GRADIENT, svg: "instagram" },
];

const ORBIT_DURATION = 22; // seconds for one full rotation

export const FounderOrbit = memo(function FounderOrbit() {
  const isNarrow = useIsMobile();
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* ── Background glow ── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "90%",
          aspectRatio: "1",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(164,108,252,0.35) 0%, rgba(107,47,250,0.12) 45%, transparent 75%)",
          filter: "blur(18px)",
          pointerEvents: "none",
        }}
      />

      {/* ── Pulsing atmosphere — animated on desktop, static ring on mobile ── */}
      {isNarrow ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "70%",
            aspectRatio: "1",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            border: "1px solid rgba(164,108,252,0.3)",
            boxShadow: "0 0 60px rgba(164,108,252,0.25)",
            pointerEvents: "none",
            opacity: 0.55,
          }}
        />
      ) : (
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "70%",
            aspectRatio: "1",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            border: "1px solid rgba(164,108,252,0.3)",
            boxShadow: "0 0 60px rgba(164,108,252,0.25)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* ── Orbit guide rings + spokes — matches the Loader's geometry ── */}
      <svg
        viewBox="0 0 400 400"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "92%",
          aspectRatio: "1",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          opacity: 0.45,
        }}
      >
        {/* Primary ring */}
        <circle
          cx="200"
          cy="200"
          r="160"
          fill="none"
          stroke="rgba(164,108,252,0.5)"
          strokeWidth="1"
        />
        {/* Dashed outer ring */}
        <circle
          cx="200"
          cy="200"
          r="185"
          fill="none"
          stroke="rgba(164,108,252,0.28)"
          strokeWidth="0.8"
          strokeDasharray="2 8"
        />
        {/* Spokes from centre to each icon position */}
        {ICONS.map((_, i) => {
          const angle = (i / ICONS.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <line
              key={i}
              x1={200}
              y1={200}
              x2={200 + Math.cos(angle) * 160}
              y2={200 + Math.sin(angle) * 160}
              stroke="rgba(164,108,252,0.22)"
              strokeWidth="0.5"
              strokeDasharray="3 5"
            />
          );
        })}
      </svg>

      {/* ── Rotating orbit with social icons ── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: ORBIT_DURATION, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "92%",
          aspectRatio: "1",
          marginLeft: "-46%",
          marginTop: "-46%",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        {ICONS.map((icon, i) => {
          const angle = (i / ICONS.length) * 360;
          // On mobile: a plain div at the anchor position, no counter-rotation,
          // no bob loop. The whole ring still rotates so icons will tumble with
          // the ring, which matches the Loader's behaviour on mobile too.
          // On desktop: counter-rotate + individual bob for that alive feel.
          const positionStyle = {
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            width: 52,
            height: 52,
            marginLeft: -26,
            marginTop: -26,
            transform: `rotate(${angle}deg) translateY(-176%) rotate(${-angle}deg)`,
            pointerEvents: "auto" as const,
          };

          const chipStyle = {
            width: "100%",
            height: "100%",
            borderRadius: 10,
            background: icon.bg,
            border: "2px solid rgba(255,255,255,0.25)",
            boxShadow:
              "0 8px 22px rgba(0,0,0,0.5), 0 0 28px rgba(164,108,252,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // Text icons (in, f, ▶, 𝕏, G) use the same treatment as the Loader
            fontSize: 22,
            fontWeight: 800,
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: "#ffffff",
            lineHeight: 1,
          } as const;

          const chipContent = (
            <>
              {icon.svg === "tiktok" ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                  <path d={TIKTOK_PATH} />
                </svg>
              ) : icon.svg === "instagram" ? (
                <svg width="22" height="22" viewBox="0 0 132 132" fill="#fff">
                  <path d={IG_PATH} />
                </svg>
              ) : icon.svg === "react" ? (
                <svg width="26" height="26" viewBox="-11.5 -10.23174 23 20.46348" fill="none">
                  <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
                  <g stroke="#61dafb" strokeWidth="1" fill="none">
                    <ellipse rx="11" ry="4.2" />
                    <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                    <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                  </g>
                </svg>
              ) : (
                icon.text
              )}
            </>
          );

          if (isNarrow) {
            return (
              <div key={icon.label} aria-label={icon.label} style={positionStyle}>
                <div style={chipStyle}>{chipContent}</div>
              </div>
            );
          }

          // Desktop: positioning lives on a PLAIN div so the CSS transform
          // (rotate + translateY + counter-rotate) isn't overwritten by
          // framer-motion. Counter-rotation and bob animate on nested
          // motion.divs that only control their own transform axis.
          return (
            <div key={icon.label} style={positionStyle}>
              <motion.div
                // Counter-rotate so each icon stays upright while the ring spins
                animate={{ rotate: -360 }}
                transition={{ duration: ORBIT_DURATION, repeat: Infinity, ease: "linear" }}
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 2 + (i % 3) * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.25,
                  }}
                  aria-label={icon.label}
                  style={chipStyle}
                >
                  {chipContent}
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      {/* ── Center: Shannon photo with glow ── */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "relative",
          zIndex: 5,
          width: "46%",
          aspectRatio: "1",
          borderRadius: "50%",
          overflow: "hidden",
          border: "3px solid rgba(216,180,254,0.85)",
          boxShadow:
            "0 0 0 6px rgba(164,108,252,0.15), 0 0 40px rgba(164,108,252,0.55), 0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        <img
          src={SHANNON_PHOTO}
          alt="Shannon — Founder, H2H Social"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          loading="lazy"
          decoding="async"
        />
        {/* Subtle purple overlay to tint the photo into the palette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 100%, rgba(107,47,250,0.25) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
      </motion.div>

      {/* ── Founder label ── */}
      <div
        style={{
          position: "absolute",
          bottom: "6%",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 6,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-stack-body)",
            fontStyle: "italic",
            fontSize: "clamp(0.95rem, 1.8vw, 1.35rem)",
            color: "#FBFBFC",
            lineHeight: 1,
          }}
        >
          Shannon
        </div>
        <div
          style={{
            marginTop: 6,
            display: "inline-block",
            padding: "4px 12px",
            background: "var(--color-secondary)",
            color: "var(--color-background-light)",
            fontFamily: "var(--font-stack-heading)",
            fontSize: "clamp(8px, 1vw, 10px)",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            borderRadius: 4,
          }}
        >
          Founder · H2H Social
        </div>
      </div>
    </div>
  );
});
