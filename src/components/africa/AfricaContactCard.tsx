import { motion, AnimatePresence } from "motion/react";
import type { AfricaContact } from "../../constants/africaContacts";

interface AfricaContactCardProps {
  contact: AfricaContact;
  isActive: boolean;
  onHover: (code: string | null) => void;
  onClick: (code: string) => void;
}

export function AfricaContactCard({ contact, isActive, onHover, onClick }: AfricaContactCardProps) {
  return (
    <motion.div
      className="relative flex items-center gap-4 p-4 cursor-pointer transition-colors"
      style={{
        border: isActive ? "2px solid var(--color-secondary)" : "2px solid rgba(164, 108, 252, 0.1)",
        background: isActive ? "rgba(164, 108, 252, 0.08)" : "transparent",
        boxShadow: isActive ? "4px 4px 0 var(--color-secondary)" : "none",
      }}
      onMouseEnter={() => onHover(contact.countryCode)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(contact.countryCode)}
      whileHover={{
        x: -2,
        y: -2,
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-full border border-white/20">
        {contact.avatar ? (
          <img
            src={contact.avatar}
            alt={contact.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-sm"
            style={{
              background: "var(--color-primary)",
              color: "var(--color-secondary)",
              fontFamily: "var(--font-stack-heading)",
            }}
          >
            {contact.name.split(" ").map((n) => n[0]).join("")}
          </div>
        )}

        <AnimatePresence>
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: "2px solid var(--color-secondary)",
                boxShadow: "0 0 12px rgba(164, 108, 252, 0.5)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 min-w-0">
        <div
          className="text-sm font-medium truncate"
          style={{
            color: isActive ? "var(--color-secondary)" : "var(--color-text-dark)",
            fontFamily: "var(--font-stack-heading)",
          }}
        >
          {contact.name}
        </div>
        <div
          className="text-xs truncate mt-0.5"
          style={{
            color: "rgba(232, 226, 255, 0.5)",
            fontFamily: "var(--font-stack-body)",
          }}
        >
          {contact.role}, {contact.company}
        </div>
      </div>

      <div className="flex flex-col items-end shrink-0">
        <span
          className="text-[10px] tracking-widest uppercase"
          style={{
            color: isActive ? "var(--color-secondary)" : "rgba(232, 226, 255, 0.35)",
            fontFamily: "var(--font-stack-heading)",
          }}
        >
          {contact.countryCode}
        </span>
        {contact.city && (
          <span
            className="text-[10px] mt-0.5"
            style={{
              color: "rgba(232, 226, 255, 0.3)",
              fontFamily: "var(--font-stack-body)",
            }}
          >
            {contact.city}
          </span>
        )}
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-[3px]"
            style={{ background: "var(--color-secondary)" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface ExpandedContactInfoProps {
  contact: AfricaContact | null;
}

export function ExpandedContactInfo({ contact }: ExpandedContactInfoProps) {
  return (
    <div className="h-[160px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {contact ? (
          <motion.div
            key={contact.id}
            className="flex flex-col items-center text-center px-6 py-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--color-secondary)] mb-3" style={{ boxShadow: "0 0 20px rgba(164, 108, 252, 0.3)" }}>
              {contact.avatar ? (
                <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-lg"
                  style={{ background: "var(--color-primary)", color: "var(--color-secondary)" }}
                >
                  {contact.name.split(" ").map((n) => n[0]).join("")}
                </div>
              )}
            </div>
            <div
              className="text-lg"
              style={{
                color: "#FBFBFC",
                fontFamily: "var(--font-stack-heading)",
              }}
            >
              {contact.name}
            </div>
            <div
              className="text-xs mt-1"
              style={{
                color: "var(--color-secondary)",
                fontFamily: "var(--font-stack-heading)",
                letterSpacing: "0.1em",
              }}
            >
              {contact.role}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{
                color: "rgba(232, 226, 255, 0.5)",
                fontFamily: "var(--font-stack-body)",
              }}
            >
              {contact.company} &middot; {contact.city}, {contact.country}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            className="text-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="text-xs tracking-[0.2em] uppercase"
              style={{
                color: "rgba(232, 226, 255, 0.3)",
                fontFamily: "var(--font-stack-heading)",
              }}
            >
              Hover a country or contact
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
