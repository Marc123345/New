import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { FounderOrbit } from "./contact/FounderOrbit";

type Tab = "form" | "agent";

export function ContactForm() {
  const [activeTab, setActiveTab] = useState<Tab>("form");
  const formRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const formLoaded = useRef(false);
  const agentLoaded = useRef(false);

  // Load JotForm contact form
  useEffect(() => {
    if (activeTab !== "form" || formLoaded.current || !formRef.current) return;
    const script = document.createElement("script");
    script.src = "https://form.jotform.com/jsform/260973737186066";
    script.type = "text/javascript";
    script.async = true;
    formRef.current.appendChild(script);
    formLoaded.current = true;
  }, [activeTab]);

  // Load AI agent
  useEffect(() => {
    if (activeTab !== "agent" || agentLoaded.current || !agentRef.current) return;

    const iframe = document.createElement("iframe");
    iframe.id = "JotFormIFrame-019d6d549dcd7547a9afe8a31ffe982e36dc";
    iframe.title = "Darius: Digital Marketing Consultant";
    iframe.src = "https://agent.jotform.com/019d6d549dcd7547a9afe8a31ffe982e36dc?embedMode=iframe&autofocus=0&background=1&shadow=1";
    iframe.style.cssText = "width:100%;height:min(688px, 70vh);border:none;max-width:100%;";
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("allow", "geolocation; microphone; camera; fullscreen");
    iframe.scrolling = "no";
    agentRef.current.appendChild(iframe);

    const handler = document.createElement("script");
    handler.src = "https://cdn.jotfor.ms/s/umd/87418c24ff6/for-form-embed-handler.js";
    handler.onload = () => {
      (window as any).jotformEmbedHandler?.(
        "iframe[id='JotFormIFrame-019d6d549dcd7547a9afe8a31ffe982e36dc']",
        "https://www.jotform.com"
      );
    };
    document.body.appendChild(handler);
    agentLoaded.current = true;

    return () => { handler.remove(); };
  }, [activeTab]);

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
        }}
      >
        {/* Tab switcher — full width at top */}
        <div className="contact-tab-switcher" style={{
          display: "flex",
          gap: "4px",
          background: "rgba(0,0,0,0.06)",
          borderRadius: 12,
          padding: 4,
          maxWidth: 480,
          margin: "0 auto clamp(24px, 4vw, 48px)",
        }}>
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            style={{
              flex: 1,
              padding: "14px 20px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-stack-heading)",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "all 0.25s ease",
              background: activeTab === "form" ? "var(--color-text-dark)" : "transparent",
              color: activeTab === "form" ? "var(--color-background-light)" : "var(--color-text-dark)",
              boxShadow: activeTab === "form" ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
            }}
          >
            Contact Form
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("agent")}
            style={{
              flex: 1,
              padding: "14px 20px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-stack-heading)",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "all 0.25s ease",
              background: activeTab === "agent" ? "var(--color-secondary)" : "transparent",
              color: activeTab === "agent" ? "#ffffff" : "var(--color-text-dark)",
              boxShadow: activeTab === "agent" ? "0 2px 8px rgba(164,108,252,0.3)" : "none",
            }}
          >
            Chat with Darius
          </button>
        </div>

        {/* CONTACT FORM VIEW */}
        <div style={{ display: activeTab === "form" ? "block" : "none" }}>
          <div
            className="contact-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(24px, 6vw, 80px)",
              alignItems: "start",
            }}
          >
            {/* LEFT: Founder orbit */}
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

            {/* RIGHT: JotForm */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
              className="contact-form-card"
              style={{
                border: "3px solid var(--color-text-dark)",
                borderRadius: 16,
                background: "var(--color-background-light)",
                boxShadow: "8px 8px 0 var(--color-surface-dark)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "clamp(16px, 4vw, 40px) clamp(16px, 4vw, 40px) 0" }}>
                <h2 style={{
                  fontSize: "clamp(1.4rem, 3.5vw, 2.5rem)",
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
        </div>

        {/* AI AGENT VIEW */}
        <div style={{ display: activeTab === "agent" ? "block" : "none" }}>
          <div
            className="contact-agent-box"
            style={{
              maxWidth: 720,
              margin: "0 auto",
              border: "3px solid var(--color-text-dark)",
              borderRadius: 16,
              background: "var(--color-background-light)",
              boxShadow: "8px 8px 0 var(--color-surface-dark)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "clamp(20px, 4vw, 32px) clamp(20px, 4vw, 32px) 0" }}>
              <h2 style={{
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                fontWeight: 700,
                color: "var(--color-text-dark)",
                marginBottom: "8px",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                fontFamily: "var(--font-stack-heading)",
              }}>
                Chat with Darius
              </h2>
              <p style={{
                fontSize: "0.875rem",
                color: "var(--color-text-dark)",
                opacity: 0.5,
                lineHeight: 1.6,
                fontFamily: "var(--font-stack-heading)",
              }}>
                Our AI consultant can answer questions about H2H&apos;s services and help you get started.
              </p>
            </div>
            <div ref={agentRef} style={{ minHeight: 500, padding: "8px" }} />
          </div>
        </div>
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
        @media (max-width: 480px) {
          .contact-tab-switcher {
            max-width: 100% !important;
          }
          .contact-tab-switcher button {
            padding: 12px 12px !important;
            font-size: 0.7rem !important;
            letter-spacing: 0.05em !important;
          }
          .contact-agent-box {
            border-width: 2px !important;
            box-shadow: 4px 4px 0 var(--color-surface-dark) !important;
            border-radius: 12px !important;
          }
          .contact-form-card {
            border-width: 2px !important;
            box-shadow: 4px 4px 0 var(--color-surface-dark) !important;
            border-radius: 12px !important;
          }
          .contact-phone-box {
            border-width: 2px !important;
            box-shadow: 4px 4px 0 var(--color-surface-dark) !important;
            border-radius: 12px !important;
          }
        }
      `}</style>
    </section>
  );
}
