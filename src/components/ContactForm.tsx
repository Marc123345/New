import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

type Tab = "form" | "agent";

export function ContactForm() {
  const [activeTab, setActiveTab] = useState<Tab>("form");
  const [formReady, setFormReady] = useState(false);
  const [agentReady, setAgentReady] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const formLoaded = useRef(false);
  const agentLoaded = useRef(false);

  // Load JotForm contact form
  // Load contact form eagerly on mount (not on tab click) so it's ready when user scrolls down
  useEffect(() => {
    if (formLoaded.current || !formRef.current) return;
    const script = document.createElement("script");
    script.src = "https://form.jotform.com/jsform/260973737186066";
    script.type = "text/javascript";
    script.async = true;
    formRef.current.appendChild(script);
    formLoaded.current = true;
    // Watch for JotForm to inject its content (form or iframe)
    const obs = new MutationObserver(() => {
      const el = formRef.current;
      if (el && el.children.length > 1) { setFormReady(true); obs.disconnect(); }
    });
    obs.observe(formRef.current, { childList: true, subtree: true });
    // Fallback — hide loader after 6s regardless
    const fallback = setTimeout(() => setFormReady(true), 6000);
    return () => { obs.disconnect(); clearTimeout(fallback); };
  }, []);

  // Load AI agent
  useEffect(() => {
    if (activeTab !== "agent" || agentLoaded.current || !agentRef.current) return;

    const iframe = document.createElement("iframe");
    iframe.id = "JotFormIFrame-019d6d549dcd7547a9afe8a31ffe982e36dc";
    iframe.title = "Darius: Digital Marketing Consultant";
    iframe.src = "https://agent.jotform.com/019d6d549dcd7547a9afe8a31ffe982e36dc?embedMode=iframe&autofocus=0&background=1&shadow=1";
    iframe.style.cssText = "max-width:100%;height:688px;border:none;width:100%;";
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("allow", "geolocation; microphone; camera; fullscreen");
    iframe.setAttribute("frameborder", "0");
    iframe.scrolling = "no";
    iframe.onload = () => setAgentReady(true);
    // Fallback in case onload doesn't fire (embed handler may replace iframe)
    setTimeout(() => setAgentReady(true), 5000);
    agentRef.current.appendChild(iframe);

    const handler = document.createElement("script");
    handler.src = "https://cdn.jotfor.ms/s/umd/33c1343dc9e/for-form-embed-handler.js";
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
          maxWidth: 720,
          margin: "0 auto",
          padding: "clamp(40px, 8vw, 100px) clamp(16px, 5vw, 40px) clamp(60px, 10vw, 120px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "clamp(20px, 4vw, 40px)" }}>
          <h2 style={{
            fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
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
            Send us a message or chat with our AI consultant.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="contact-tab-switcher" style={{
          display: "flex",
          gap: "4px",
          background: "rgba(0,0,0,0.06)",
          borderRadius: 12,
          padding: 4,
          marginBottom: "clamp(20px, 3vw, 32px)",
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

        {/* Content card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="contact-card"
          style={{
            border: "3px solid var(--color-text-dark)",
            borderRadius: 16,
            background: "var(--color-background-light)",
            boxShadow: "8px 8px 0 var(--color-surface-dark)",
            overflow: "visible",
          }}
        >
          {/* Contact Form */}
          <div ref={formRef} style={{ display: activeTab === "form" ? "block" : "none", minHeight: 200, position: "relative" }}>
            {!formReady && (
              <div className="contact-loader">
                <div className="contact-loader__ring" />
                <span className="contact-loader__text">Connecting</span>
              </div>
            )}
          </div>

          {/* AI Agent */}
          <div ref={agentRef} style={{ display: activeTab === "agent" ? "block" : "none", padding: "8px", minHeight: 200, position: "relative" }}>
            {!agentReady && (
              <div className="contact-loader">
                <div className="contact-loader__ring" />
                <span className="contact-loader__text">Connecting</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <style>{`
        .contact-loader {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          pointer-events: none;
        }
        .contact-loader__ring {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid rgba(164,108,252,0.1);
          border-top-color: #a46cfc;
          animation: loaderSpin 0.8s linear infinite;
          box-shadow: 0 0 12px rgba(164,108,252,0.15);
        }
        .contact-loader__text {
          font-family: var(--font-stack-heading);
          font-size: 0.5rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(164,108,252,0.4);
        }
        @keyframes loaderSpin { to { transform: rotate(360deg); } }
        @media (max-width: 480px) {
          .contact-tab-switcher button {
            padding: 12px 12px !important;
            font-size: 0.7rem !important;
            letter-spacing: 0.05em !important;
          }
          .contact-card {
            border-width: 2px !important;
            box-shadow: 4px 4px 0 var(--color-surface-dark) !important;
            border-radius: 12px !important;
          }
        }
      `}</style>
    </section>
  );
}
