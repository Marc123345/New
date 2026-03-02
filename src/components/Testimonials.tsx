import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// 1. EXTENSIBLE DATA STRUCTURE
// Shannon can easily update this list. 
// x and y coordinates are percentages based on the map container.
const CONTACTS = [
  {
    id: "1",
    name: "Amara Okafor",
    company: "TechVentures Nigeria",
    country: "Nigeria",
    role: "Regional Director",
    coordinates: { x: "35%", y: "48%" },
  },
  {
    id: "2",
    name: "Kwame Mensah",
    company: "GhanaFintech",
    country: "Ghana",
    role: "Operations Lead",
    coordinates: { x: "28%", y: "50%" },
  },
  {
    id: "3",
    name: "Zainab Hassan",
    company: "EduTech Kenya",
    country: "Kenya",
    role: "Partnerships Manager",
    coordinates: { x: "72%", y: "55%" },
  },
  {
    id: "4",
    name: "Thabo Nkosi",
    company: "SA Digital Solutions",
    country: "South Africa",
    role: "Managing Director",
    coordinates: { x: "58%", y: "85%" },
  },
  {
    id: "5",
    name: "Fatima Diallo",
    company: "Senegal Commerce",
    country: "Senegal",
    role: "Market Expansion",
    coordinates: { x: "15%", y: "42%" },
  },
];

export function RegionalPresence() {
  // 2. STATE MANAGEMENT
  // Tracks which contact/country is currently being hovered
  const [activeContactId, setActiveContactId] = useState<string | null>(null);

  return (
    <section className="relative min-h-screen bg-[var(--color-surface-dark)] py-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Header Section */}
        <div className="mb-16">
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
              Regional Presence
            </span>
          </div>
          <h2
            className="tracking-tight"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontFamily: "var(--font-stack-heading)",
              color: "#ffffff",
            }}
          >
            Our Network Across Africa
          </h2>
        </div>

        {/* 3. LAYOUT: Grid for Map (Left) and Contacts (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* --- LEFT COLUMN: STYLIZED MAP --- */}
          <div className="relative w-full aspect-square max-w-[600px] mx-auto bg-[#1A1040] rounded-full overflow-hidden border border-[var(--color-primary)]/30 shadow-[var(--shadow-geometric)]">
            {/* Map Background Placeholder (Replace src with an Africa-specific map SVG/Image if preferred) */}
            <img
              src="https://cdn.prod.website-files.com/68a5787bba0829184628bd51/68b6b0d7f637ee0f1ff47780_BASE.avif"
              alt="Stylized Africa Map"
              className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale mix-blend-screen scale-150 origin-center translate-x-[10%] translate-y-[10%]"
            />
            
            {/* 4. MAP DOTS */}
            {CONTACTS.map((contact) => {
              const isActive = activeContactId === contact.id;

              return (
                <div
                  key={`dot-${contact.id}`}
                  className="absolute z-10 cursor-pointer"
                  style={{ left: contact.coordinates.x, top: contact.coordinates.y }}
                  onMouseEnter={() => setActiveContactId(contact.id)}
                  onMouseLeave={() => setActiveContactId(null)}
                >
                  {/* The core dot */}
                  <motion.div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: isActive ? "var(--color-secondary)" : "#ffffff",
                    }}
                    animate={{
                      scale: isActive ? 1.5 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                  
                  {/* The pulsing glow effect for active dot */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{ opacity: [0.8, 0], scale: [1, 3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: "var(--color-secondary)" }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* --- RIGHT COLUMN: CONTACT DIRECTORY --- */}
          <div className="flex flex-col gap-4 w-full max-w-[600px] mx-auto lg:mx-0">
            {CONTACTS.map((contact) => {
              const isActive = activeContactId === contact.id;

              return (
                <motion.div
                  key={`contact-${contact.id}`}
                  className="relative p-6 cursor-pointer overflow-hidden border border-white/10 transition-colors duration-300"
                  style={{
                    backgroundColor: isActive 
                      ? "var(--color-primary)" 
                      : "transparent",
                  }}
                  onMouseEnter={() => setActiveContactId(contact.id)}
                  onMouseLeave={() => setActiveContactId(null)}
                >
                  {/* Active Card Geometric Accent */}
                  {isActive && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ backgroundColor: "var(--color-secondary)" }}
                    />
                  )}
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3
                        className="text-xl md:text-2xl text-white mb-1"
                        style={{ fontFamily: "var(--font-stack-heading)" }}
                      >
                        {contact.name}
                      </h3>
                      <p
                        className="text-sm text-white/60 uppercase tracking-wider"
                        style={{ fontFamily: "var(--font-stack-body)" }}
                      >
                        {contact.role}
                      </p>
                    </div>
                    
                    <div className="text-left md:text-right">
                      <p
                        className="text-[var(--color-secondary)] font-bold"
                        style={{ fontFamily: "var(--font-stack-heading)" }}
                      >
                        {contact.country}
                      </p>
                      <p className="text-white/80 text-sm">
                        {contact.company}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
        </div>
      </div>
    </section>
  );
}