import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const CONTACTS = [
  {
    id: "c1",
    name: "Amara Okafor",
    company: "TechVentures Nigeria",
    country: "Nigeria",
    city: "Lagos",
    role: "CEO",
    countryCode: "NG",
    dot: { x: 44.5, y: 45.5 },
  },
  {
    id: "c2",
    name: "Kwame Mensah",
    company: "GhanaFintech",
    country: "Ghana",
    city: "Accra",
    role: "Founder",
    countryCode: "GH",
    dot: { x: 38.5, y: 48.5 },
  },
  {
    id: "c3",
    name: "Fatima Diallo",
    company: "Senegal Commerce",
    country: "Senegal",
    city: "Dakar",
    role: "Co-Founder",
    countryCode: "SN",
    dot: { x: 32, y: 42 },
  },
  {
    id: "c4",
    name: "Zainab Hassan",
    company: "EduTech Kenya",
    country: "Kenya",
    city: "Nairobi",
    role: "Director",
    countryCode: "KE",
    dot: { x: 63, y: 55 },
  },
  {
    id: "c5",
    name: "Shannon Varani",
    company: "Varani Group",
    country: "South Africa",
    city: "Cape Town",
    role: "Founder & CEO",
    countryCode: "ZA",
    dot: { x: 52, y: 77 },
  },
  {
    id: "c6",
    name: "Thabo Nkosi",
    company: "SA Digital Solutions",
    country: "South Africa",
    city: "Johannesburg",
    role: "Managing Director",
    countryCode: "ZA",
    dot: { x: 54, y: 74 },
  },
];

export function Testimonials() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section className="relative bg-[var(--color-surface-dark)] border-t border-white/10 py-20 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <div
            className="inline-block mb-4 px-4 py-2"
            style={{
              border: "2px solid var(--color-secondary)",
              boxShadow: "4px 4px 0 var(--color-secondary)",
            }}
          >
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{
                fontFamily: "var(--font-stack-heading)",
                color: "var(--color-secondary)",
              }}
            >
              Trusted Across Africa
            </span>
          </div>
          <h2
            className="tracking-tight text-white"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontFamily: "var(--font-stack-heading)",
            }}
          >
            Our Partners on the Ground
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          <AfricaMapPanel activeId={activeId} onHover={setActiveId} />
          <ContactsPanel activeId={activeId} onHover={setActiveId} />
        </div>
      </div>
    </section>
  );
}

function AfricaMapPanel({
  activeId,
  onHover,
}: {
  activeId: string | null;
  onHover: (id: string | null) => void;
}) {
  return (
    <div
      className="lg:w-[420px] shrink-0 flex flex-col items-center justify-between py-10 px-8 relative"
      style={{
        background: "var(--color-primary)",
        border: "4px solid var(--color-secondary)",
        boxShadow: "var(--shadow-geometric)",
      }}
    >
      <div className="text-center z-10">
        <p
          className="text-lg leading-tight"
          style={{ fontFamily: "var(--font-stack-heading)" }}
        >
          <span style={{ color: "var(--color-secondary)" }}>Trusted</span>
          <br />
          <span className="text-white">Across Africa</span>
        </p>
      </div>

      <div className="relative w-full flex items-center justify-center mt-6">
        <AfricaSVG activeId={activeId} onHover={onHover} />
      </div>

      <div className="z-10 text-center mt-6">
        <p
          className="text-xs tracking-[0.2em] uppercase text-white/40"
          style={{ fontFamily: "var(--font-stack-heading)" }}
        >
          {CONTACTS.length} Partners · 5 Countries
        </p>
      </div>
    </div>
  );
}

function AfricaSVG({
  activeId,
  onHover,
}: {
  activeId: string | null;
  onHover: (id: string | null) => void;
}) {
  return (
    <svg
      viewBox="0 0 200 220"
      fill="none"
      className="w-full max-w-[300px]"
      style={{ filter: "drop-shadow(0 0 24px rgba(164,108,252,0.15))" }}
    >
      <path
        d="
          M 72 8
          L 85 8
          L 96 12
          L 108 10
          L 118 14
          L 124 20
          L 128 28
          L 134 32
          L 138 40
          L 138 50
          L 142 56
          L 148 60
          L 152 68
          L 150 76
          L 146 82
          L 148 90
          L 145 98
          L 148 106
          L 152 116
          L 152 126
          L 148 134
          L 142 142
          L 136 152
          L 128 164
          L 118 174
          L 110 180
          L 102 186
          L 96 190
          L 90 194
          L 86 196
          L 84 192
          L 80 188
          L 76 180
          L 72 172
          L 66 164
          L 60 154
          L 54 144
          L 48 134
          L 44 124
          L 42 114
          L 40 104
          L 40 94
          L 42 84
          L 40 74
          L 38 64
          L 36 54
          L 36 44
          L 38 36
          L 42 28
          L 48 20
          L 56 14
          L 64 10
          Z
        "
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      <path
        d="
          M 54 130
          L 46 126
          L 38 118
          L 32 110
          L 28 102
          L 26 94
          L 28 86
          L 32 80
          L 36 76
          L 36 70
          L 38 64
        "
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
        fill="none"
      />

      {CONTACTS.map((contact) => {
        const isActive = activeId === contact.id;
        const x = (contact.dot.x / 100) * 200;
        const y = (contact.dot.y / 100) * 220;

        return (
          <g
            key={contact.id}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => onHover(contact.id)}
            onMouseLeave={() => onHover(null)}
          >
            {isActive && (
              <motion.circle
                cx={x}
                cy={y}
                r={12}
                fill="none"
                stroke="var(--color-secondary)"
                strokeWidth="1"
                initial={{ r: 6, opacity: 0.8 }}
                animate={{ r: 16, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <motion.circle
              cx={x}
              cy={y}
              animate={
                isActive
                  ? {
                      r: 6,
                      fill: "var(--color-secondary)" as any,
                      filter:
                        "drop-shadow(0 0 8px rgba(164,108,252,0.9)) drop-shadow(0 0 16px rgba(164,108,252,0.5))",
                    }
                  : {
                      r: 4,
                      fill: "rgba(255,255,255,0.7)" as any,
                      filter: "none",
                    }
              }
              transition={{ duration: 0.25, ease: "easeOut" }}
            />
          </g>
        );
      })}
    </svg>
  );
}

function ContactsPanel({
  activeId,
  onHover,
}: {
  activeId: string | null;
  onHover: (id: string | null) => void;
}) {
  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      style={{
        border: "2px solid rgba(255,255,255,0.15)",
        boxShadow: "var(--shadow-geometric)",
        background: "var(--color-surface-dark)",
      }}
    >
      <div
        className="px-6 py-4 border-b border-white/10 shrink-0"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <span
          className="text-xs tracking-[0.25em] uppercase text-white/40"
          style={{ fontFamily: "var(--font-stack-heading)" }}
        >
          Key People
        </span>
      </div>

      <div className="flex flex-col divide-y divide-white/5 overflow-y-auto">
        {CONTACTS.map((contact) => {
          const isActive = activeId === contact.id;
          return (
            <motion.div
              key={contact.id}
              className="relative flex items-center gap-4 px-6 py-4 cursor-pointer overflow-hidden"
              onHoverStart={() => onHover(contact.id)}
              onHoverEnd={() => onHover(null)}
              onTouchStart={() => onHover(contact.id)}
              onTouchEnd={() => onHover(null)}
            >
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-[3px]"
                style={{ background: "var(--color-secondary)" }}
                animate={{ scaleY: isActive ? 1 : 0 }}
                initial={{ scaleY: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />

              <motion.div
                className="absolute inset-0"
                style={{ background: "var(--color-primary)" }}
                animate={{ opacity: isActive ? 0.35 : 0 }}
                transition={{ duration: 0.2 }}
              />

              <div
                className="relative shrink-0 flex items-center justify-center w-10 h-10"
                style={{ border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <motion.span
                  className="text-xs font-bold tracking-widest"
                  style={{ fontFamily: "var(--font-stack-heading)" }}
                  animate={{ color: isActive ? "var(--color-secondary)" : "rgba(255,255,255,0.4)" }}
                  transition={{ duration: 0.2 }}
                >
                  {contact.countryCode}
                </motion.span>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute inset-0"
                      style={{ border: "1px solid var(--color-secondary)" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
              </div>

              <div className="relative flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span
                    className="text-white text-sm font-semibold"
                    style={{ fontFamily: "var(--font-stack-heading)" }}
                  >
                    {contact.name}
                  </span>
                  <span
                    className="text-[10px] tracking-widest uppercase shrink-0"
                    style={{
                      fontFamily: "var(--font-stack-heading)",
                      color: "var(--color-secondary)",
                    }}
                  >
                    {contact.role}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span
                    className="text-xs text-white/40"
                    style={{ fontFamily: "var(--font-stack-body)" }}
                  >
                    {contact.company}
                  </span>
                  <span className="text-white/20 text-xs">·</span>
                  <span
                    className="text-xs text-white/50 shrink-0"
                    style={{ fontFamily: "var(--font-stack-body)" }}
                  >
                    {contact.city ? `${contact.city}, ` : ""}{contact.country}
                  </span>
                </div>
              </div>

              <motion.div
                className="relative shrink-0 w-2 h-2 rounded-full"
                animate={
                  isActive
                    ? {
                        backgroundColor: "var(--color-secondary)",
                        boxShadow: "0 0 8px 3px rgba(164,108,252,0.6)",
                      }
                    : {
                        backgroundColor: "rgba(255,255,255,0.15)",
                        boxShadow: "none",
                      }
                }
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
