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
    <section className="relative py-16 md:py-24" style={{ background: "var(--color-background-light)" }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
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
              color: "#FBFBFC",
            }}
          >
            Our Network Across Africa
          </h2>
          <p
            className="mt-3 text-sm max-w-md mx-auto"
            style={{
              color: "rgba(232, 226, 255, 0.5)",
              fontFamily: "var(--font-stack-body)",
            }}
          >
            {countryCount} countries, {AFRICA_CONTACTS.length} key contacts driving digital transformation across the continent.
          </p>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8"
        >
          <div
            className="relative flex flex-col items-center justify-center p-6 md:p-10 min-h-[400px] lg:min-h-[520px]"
            style={{
              border: "2px solid rgba(164, 108, 252, 0.15)",
              background: "rgba(41, 30, 86, 0.2)",
            }}
          >
            <MapGridLines />

            <div className="relative w-full max-w-[420px] aspect-square">
              <AfricaMapSvg
                activeCountry={activeCountry}
                onDotHover={handleDotHover}
                onDotClick={handleDotClick}
              />
            </div>

            <ExpandedContactInfo contact={activeContact} />

            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-secondary)" }} />
              <span
                className="text-[10px] tracking-widest uppercase"
                style={{
                  color: "rgba(232, 226, 255, 0.3)",
                  fontFamily: "var(--font-stack-heading)",
                }}
              >
                Active Presence
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(164, 108, 252, 0.3) transparent" }}>
            <div
              className="text-[10px] tracking-[0.25em] uppercase mb-2 px-4"
              style={{
                color: "rgba(232, 226, 255, 0.35)",
                fontFamily: "var(--font-stack-heading)",
              }}
            >
              Key Contacts ({AFRICA_CONTACTS.length})
            </div>
            {AFRICA_CONTACTS.map((contact) => (
              <AfricaContactCard
                key={contact.id}
                contact={contact}
                isActive={activeCountry === contact.countryCode}
                onHover={handleDotHover}
                onClick={handleDotClick}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MapGridLines() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.04 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px"
          style={{
            top: `${(i + 1) * (100 / 13)}%`,
            background: "var(--color-secondary)",
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: i * 0.05 }}
          viewport={{ once: true }}
        />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: `${(i + 1) * (100 / 13)}%`,
            background: "var(--color-secondary)",
          }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: i * 0.05 }}
          viewport={{ once: true }}
        />
      ))}
    </div>
  );
}
