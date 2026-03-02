import { motion } from "motion/react";
import { COUNTRY_DOTS, type CountryDot } from "../../constants/africaContacts";

interface AfricaMapSvgProps {
  activeCountry: string | null;
  onDotHover: (code: string | null) => void;
  onDotClick: (code: string) => void;
}

export function AfricaMapSvg({ activeCountry, onDotHover, onDotClick }: AfricaMapSvgProps) {
  return (
    <svg
      viewBox="0 0 420 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
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

      <AfricaOutline />

      {COUNTRY_DOTS.map((dot) => (
        <CountryDotMarker
          key={dot.code}
          dot={dot}
          isActive={activeCountry === dot.code}
          onHover={onDotHover}
          onClick={onDotClick}
        />
      ))}
    </svg>
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
        fill={isActive ? "var(--color-secondary)" : "rgba(164, 108, 252, 0.5)"}
        filter={isActive ? "url(#glow-filter)" : undefined}
        animate={{
          r: isActive ? 6 : 4,
          fill: isActive ? "var(--color-secondary)" : "rgba(164, 108, 252, 0.5)",
        }}
        transition={{ duration: 0.25 }}
      />

      {isActive && (
        <motion.text
          x={dot.cx}
          y={dot.cy - 16}
          textAnchor="middle"
          fill="var(--color-text-dark)"
          fontSize="10"
          fontFamily="var(--font-stack-heading)"
          letterSpacing="0.1em"
          initial={{ opacity: 0, y: dot.cy - 10 }}
          animate={{ opacity: 1, y: dot.cy - 22 }}
          transition={{ duration: 0.3 }}
        >
          {dot.name.toUpperCase()}
        </motion.text>
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

function AfricaOutline() {
  return (
    <path
      d="
        M 170 60
        C 175 55, 195 50, 215 52
        C 235 54, 260 58, 280 65
        C 295 70, 305 78, 310 88
        C 315 98, 318 108, 315 120
        L 320 115
        C 325 108, 332 105, 335 110
        C 338 115, 335 125, 330 135
        C 325 145, 318 152, 315 160
        C 312 168, 312 178, 315 188
        C 318 198, 322 208, 325 218
        C 328 228, 328 238, 325 248
        C 322 258, 318 265, 312 275
        C 308 285, 302 295, 295 305
        C 288 315, 278 325, 268 332
        C 258 339, 250 348, 245 355
        C 240 362, 230 365, 220 360
        C 215 358, 218 350, 225 342
        C 230 336, 238 330, 240 322
        C 242 314, 238 308, 232 302
        C 226 296, 218 292, 212 285
        C 206 278, 198 270, 192 260
        C 186 250, 180 242, 175 232
        C 170 222, 168 212, 165 202
        C 162 192, 158 182, 152 175
        C 146 168, 138 165, 130 168
        C 125 170, 118 172, 112 170
        C 106 168, 100 162, 105 155
        C 108 150, 115 148, 118 142
        C 120 136, 118 128, 120 122
        C 122 116, 125 110, 130 105
        C 135 100, 140 92, 145 85
        C 150 78, 158 70, 165 64
        Z
      "
      fill="rgba(164, 108, 252, 0.06)"
      stroke="rgba(164, 108, 252, 0.2)"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  );
}
