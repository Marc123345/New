import { useState, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { AFRICA_CONTACTS } from "../../constants/africaContacts";
import { AfricaMapSvg } from "./AfricaMapSvg";
import { AfricaContactCard, ExpandedContactInfo } from "./AfricaContactCard";

export function AfricaPresence() {
  const [activeCountry, setActiveCountry] = useState<string | null>(null);

  const handleDotHover = useCallback((code: string | null) => {
    setActiveCountry(code);
  }, []);

  const handleDotClick = useCallback((code: string) => {
    setActiveCountry((prev) => (prev === code ? null : code));
  }, []);

  const activeContact = useMemo(
    () => AFRICA_CONTACTS.find((c) => c.countryCode === activeCountry) ?? null,
    [activeCountry]
  );

  const countryCount = useMemo(
    () => new Set(AFRICA_CONTACTS.map((c) => c.countryCode)).size,
    []
  );

  return (
    <section className="relative bg-[var(--color-surface-dark)] border-t border-white/10">
      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8 py-16 md:py-24">
        <div className="text-center mb-10">
          <div
            className="inline-block mb-4 px-4 py-2"
            style={{
              border: "2px solid var(--color-secondary)",
              boxShadow: "4px 4px 0 var(--color-secondary)",
            }}
          >
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-stack-heading)", color: "var(--color-secondary)" }}
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
          <p
            className="mt-3 text-sm max-w-md mx-auto"
            style={{
              color: "rgba(232, 226, 255, 0.45)",
              fontFamily: "var(--font-stack-body)",
            }}
          >
            {countryCount} countries, {AFRICA_CONTACTS.length} key contacts driving digital transformation across the continent.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div
            className="shrink-0 w-full lg:w-[420px] flex flex-col items-center justify-between py-10 px-8 relative"
            style={{
              border: "4px solid var(--color-secondary)",
              boxShadow: "var(--shadow-geometric)",
              background: "var(--color-primary)",
            }}
          >
            <div className="text-center z-10 mb-4">
              <p
                className="text-lg leading-tight"
                style={{ fontFamily: "var(--font-stack-heading)", color: "#fff" }}
              >
                <span style={{ color: "var(--color-secondary)" }}>Trusted</span>
                <br />
                Across Africa
              </p>
            </div>

            <div className="relative w-[300px] h-[300px] flex-shrink-0">
              <div className="absolute inset-0 w-full h-full">
                <svg
                  viewBox="0 0 340 340"
                  fill="none"
                  className="w-full h-full animate-[spin_60s_linear_infinite]"
                >
                  <circle
                    cx="170"
                    cy="170"
                    r="168"
                    stroke="white"
                    strokeWidth="1"
                    strokeDasharray="2 10"
                    opacity="0.2"
                  />
                </svg>

                <svg
                  viewBox="0 0 340 340"
                  className="absolute inset-0 w-full h-full -rotate-90"
                >
                  <circle
                    cx="170"
                    cy="170"
                    r="165"
                    stroke="var(--color-secondary)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="1036"
                    strokeDashoffset="0"
                    opacity="0.5"
                  />
                </svg>
              </div>

              <div className="absolute inset-[20px]">
                <AfricaMapSvg
                  activeCountry={activeCountry}
                  onDotHover={handleDotHover}
                  onDotClick={handleDotClick}
                />
              </div>
            </div>

            <ExpandedContactInfo contact={activeContact} />
          </div>

          <div
            className="flex-1 flex flex-col"
            style={{
              border: "2px solid rgba(255,255,255,0.15)",
              boxShadow: "var(--shadow-geometric)",
              background: "var(--color-surface-dark)",
            }}
          >
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "2px solid rgba(255,255,255,0.1)" }}
            >
              <span
                className="text-[10px] tracking-[0.25em] uppercase"
                style={{
                  color: "rgba(232, 226, 255, 0.4)",
                  fontFamily: "var(--font-stack-heading)",
                }}
              >
                Key Contacts
              </span>
              <span
                className="text-[10px] tracking-widest"
                style={{
                  color: "var(--color-secondary)",
                  fontFamily: "var(--font-stack-heading)",
                }}
              >
                {AFRICA_CONTACTS.length}
              </span>
            </div>

            <div
              className="flex-1 overflow-y-auto p-3 flex flex-col gap-2"
              style={{
                maxHeight: "520px",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(164, 108, 252, 0.3) transparent",
              }}
            >
              {AFRICA_CONTACTS.map((contact, i) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{
                    duration: 0.35,
                    delay: i * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <AfricaContactCard
                    contact={contact}
                    isActive={activeCountry === contact.countryCode}
                    onHover={handleDotHover}
                    onClick={handleDotClick}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
