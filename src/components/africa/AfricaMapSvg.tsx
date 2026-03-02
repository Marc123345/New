import { motion } from "motion/react";
import { COUNTRY_DOTS, type CountryDot } from "../../constants/africaContacts";

interface AfricaMapSvgProps {
  activeCountry: string | null;
  onDotHover: (code: string | null) => void;
  onDotClick: (code: string) => void;
}

export function AfricaMapSvg({ activeCountry, onDotHover, onDotClick }: AfricaMapSvgProps) {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 rounded-full overflow-hidden bg-[#1A1040] border border-[var(--color-primary)]/20">
        <img
          src="https://cdn.prod.website-files.com/68a5787bba0829184628bd51/68b6b0d7f637ee0f1ff47780_BASE.avif"
          alt="Africa Map"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-50 grayscale"
          style={{ transform: "scale(2.2) translate(-8%, 5%)" }}
        />
      </div>

      <svg
        viewBox="0 0 340 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 2 }}
      >
        <defs>
          <radialGradient id="dot-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0" />
          </radialGradient>
          <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {COUNTRY_DOTS.map((dot) => (
          <CountryDotMarker
            key={dot.code}
            dot={dot}
            isActive={activeCountry === dot.code}
            onHover={onDotHover}
            onClick={onDotClick}
          />
        ))}

        {COUNTRY_DOTS.map((dot, i) =>
          COUNTRY_DOTS.slice(i + 1).map((dot2) => {
            const dist = Math.hypot(dot.cx - dot2.cx, dot.cy - dot2.cy);
            if (dist > 120) return null;
            const bothActive = activeCountry === dot.code || activeCountry === dot2.code;
            return (
              <line
                key={`${dot.code}-${dot2.code}`}
                x1={dot.cx}
                y1={dot.cy}
                x2={dot2.cx}
                y2={dot2.cy}
                stroke="var(--color-secondary)"
                strokeWidth={bothActive ? 1.2 : 0.4}
                strokeOpacity={bothActive ? 0.5 : 0.1}
                strokeDasharray={bothActive ? "0" : "2 4"}
                style={{ transition: "all 0.4s ease" }}
              />
            );
          })
        )}
      </svg>
    </div>
  );
}

function CountryDotMarker({
  dot,
  isActive,
  onHover,
  onClick,
}: {
  dot: CountryDot;
  isActive: boolean;
  onHover: (code: string | null) => void;
  onClick: (code: string) => void;
}) {
  return (
    <g
      style={{ cursor: "pointer" }}
      onMouseEnter={() => onHover(dot.code)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(dot.code)}
    >
      {isActive && (
        <>
          <motion.circle
            cx={dot.cx}
            cy={dot.cy}
            r={20}
            fill="url(#dot-glow)"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          />
          <motion.circle
            cx={dot.cx}
            cy={dot.cy}
            r={14}
            fill="none"
            stroke="var(--color-secondary)"
            strokeWidth={1}
            strokeOpacity={0.4}
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <motion.circle
        cx={dot.cx}
        cy={dot.cy}
        r={isActive ? 6 : 4}
        fill={isActive ? "var(--color-secondary)" : "rgba(164, 108, 252, 0.6)"}
        filter={isActive ? "url(#glow-filter)" : undefined}
        animate={{
          r: isActive ? 6 : 4,
          fill: isActive ? "var(--color-secondary)" : "rgba(164, 108, 252, 0.6)",
        }}
        transition={{ duration: 0.25 }}
      />

      <circle
        cx={dot.cx}
        cy={dot.cy}
        r={2}
        fill="#fff"
        opacity={isActive ? 1 : 0.7}
        style={{ transition: "opacity 0.3s ease" }}
      />

      {isActive && (
        <motion.g
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <rect
            x={dot.cx - dot.name.length * 3.2 - 6}
            y={dot.cy - 30}
            width={dot.name.length * 6.4 + 12}
            height={16}
            rx={2}
            fill="rgba(14, 11, 31, 0.85)"
            stroke="var(--color-secondary)"
            strokeWidth={0.5}
            strokeOpacity={0.5}
          />
          <text
            x={dot.cx}
            y={dot.cy - 19}
            textAnchor="middle"
            fill="var(--color-secondary)"
            fontSize="9"
            fontFamily="var(--font-stack-heading)"
            letterSpacing="0.12em"
          >
            {dot.name.toUpperCase()}
          </text>
        </motion.g>
      )}

      <circle
        cx={dot.cx}
        cy={dot.cy}
        r={18}
        fill="transparent"
      />
    </g>
  );
}
