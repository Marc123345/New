import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { FounderOrbit } from "./contact/FounderOrbit";

export function ContactForm() {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!formRef.current) return;
    // Load JotForm script
    const script = document.createElement("script");
    script.src = "https://form.jotform.com/jsform/260973737186066";
    script.type = "text/javascript";
    script.async = true;
    formRef.current.appendChild(script);
    return () => { script.remove(); };
  }, []);

  return (
    <section
      style={{
        background: "var(--color-background-light)",
        borderTop: "3px solid var(--color-text-dark)",
        position: "relative",
        overflow: "visible",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "clamp(40px, 8vw, 120px) clamp(20px, 5vw, 60px)",
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(24px, 6vw, 80px)",
          alignItems: "start",
        }}
        className="contact-grid"
      >
        {/* LEFT: Founder orbit — Shannon at the centre of the social ecosystem */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="contact-phone-box" style={{
            width: "100%",
            aspectRatio: "3 / 4",
            position: "relative",
            border: "3px solid var(--color-text-dark)",
            borderRadius: 16,
            boxShadow: "8px 8px 0 var(--color-surface-dark)",
            background: "radial-gradient(ellipse at 50% 40%, #1a1040 0%, #0e0b1f 55%, #06030f 100%)",
            overflow: "hidden",
          }}>
            <FounderOrbit />
          </div>
        </motion.div>

        {/* RIGHT: Form */}
        {/* RIGHT: JotForm */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          style={{
            border: "3px solid var(--color-text-dark)",
            borderRadius: 16,
            background: "var(--color-background-light)",
            boxShadow: "8px 8px 0 var(--color-surface-dark)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            padding: "clamp(20px, 4vw, 40px) clamp(20px, 4vw, 40px) 0",
          }}>
            <h2 style={{
              fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
              fontWeight: 700,
              color: "var(--color-text-dark)",
              marginBottom: "12px",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              fontFamily: "var(--font-stack-heading)",
            }}>
              Let&apos;s Build Your Company&apos;s Communication Strategy
            </h2>
            <p style={{
              fontSize: "0.875rem",
              color: "var(--color-text-dark)",
              opacity: 0.5,
              lineHeight: 1.6,
              fontFamily: "var(--font-stack-heading)",
            }}>
              We&apos;d love to hear more about your brand, your goals, and how we can help.
            </p>
          </div>

          <div ref={formRef} style={{ minHeight: 400 }} />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
          .contact-phone-box {
            aspect-ratio: 4 / 3 !important;
            max-height: 320px;
          }
        }
      `}</style>
    </section>
  );
}
