import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, User, MessageSquare, Send } from "lucide-react";
import { DancingPhone } from "./contact/DancingPhone";

export function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStatus("success");
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setStatus("idle");
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section
      style={{
        background: "var(--color-background-light)",
        borderTop: "3px solid var(--color-text-dark)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "clamp(60px, 8vw, 120px) clamp(20px, 5vw, 60px)",
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px, 6vw, 80px)",
          alignItems: "start",
        }}
        className="contact-grid"
      >
        {/* LEFT: 3D Dancing Phone */}
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
          <div style={{
            width: "100%",
            aspectRatio: "3 / 4",
            position: "relative",
            border: "3px solid var(--color-text-dark)",
            boxShadow: "8px 8px 0 var(--color-surface-dark)",
            background: "linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 50%, #0a1a0d 100%)",
            overflow: "hidden",
          }}>
            <DancingPhone />
          </div>
        </motion.div>

        {/* RIGHT: Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          style={{
            border: "3px solid var(--color-text-dark)",
            padding: "clamp(32px, 4vw, 52px)",
            background: "var(--color-background-light)",
            boxShadow: "8px 8px 0 var(--color-surface-dark)",
            position: "relative",
          }}
        >
          <div style={{ marginBottom: "36px" }}>
            <h3 style={{
              fontSize: "clamp(1.5rem, 2vw, 2rem)",
              fontWeight: 700,
              color: "var(--color-text-dark)",
              marginBottom: "8px",
              letterSpacing: "-0.01em",
              fontFamily: "var(--font-stack-heading)",
            }}>
              Start a Project
            </h3>
            <p style={{
              fontSize: "0.875rem",
              color: "var(--color-text-dark)",
              opacity: 0.45,
              fontFamily: "var(--font-stack-heading)",
            }}>
              Share your vision — we'll handle the rest.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "60px 20px",
                  textAlign: "center",
                  gap: "16px",
                }}
              >
                <div style={{
                  width: "64px", height: "64px",
                  border: "3px solid var(--color-text-dark)",
                  boxShadow: "4px 4px 0 var(--color-surface-dark)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  color: "var(--color-text-dark)",
                  fontWeight: 800,
                }}>
                  ✓
                </div>
                <div style={{
                  color: "var(--color-text-dark)",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-stack-heading)",
                }}>
                  Message Sent!
                </div>
                <div style={{
                  color: "var(--color-text-dark)",
                  opacity: 0.45,
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-stack-heading)",
                }}>
                  We'll be in touch shortly.
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "20px" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {[
                  { name: "name", label: "Your Name", type: "text", icon: User, placeholder: "Jane Smith" },
                  { name: "email", label: "Email Address", type: "email", icon: Mail, placeholder: "jane@company.com" },
                ].map((field) => (
                  <div key={field.name}>
                    <label style={{
                      display: "block",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "var(--color-text-dark)",
                      marginBottom: "8px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-stack-heading)",
                    }}>
                      {field.label}
                    </label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <field.icon
                        size={15}
                        style={{
                          position: "absolute",
                          left: "13px",
                          color: "var(--color-text-dark)",
                          opacity: 0.4,
                          pointerEvents: "none",
                        }}
                      />
                      <input
                        type={field.type}
                        name={field.name}
                        required
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        style={{
                          width: "100%",
                          background: "var(--color-background-light)",
                          border: "3px solid var(--color-text-dark)",
                          borderRadius: 0,
                          padding: "13px 16px 13px 40px",
                          color: "var(--color-text-dark)",
                          fontSize: "0.9rem",
                          outline: "none",
                          transition: "box-shadow 0.2s",
                          fontFamily: "var(--font-stack-heading)",
                          boxShadow: "4px 4px 0 var(--color-surface-dark)",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.boxShadow = "6px 6px 0 var(--color-text-dark)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.boxShadow = "4px 4px 0 var(--color-surface-dark)";
                        }}
                      />
                    </div>
                  </div>
                ))}

                <div>
                  <label style={{
                    display: "block",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "var(--color-text-dark)",
                    marginBottom: "8px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-stack-heading)",
                  }}>
                    Message
                  </label>
                  <div style={{ position: "relative" }}>
                    <MessageSquare
                      size={15}
                      style={{
                        position: "absolute",
                        left: "13px",
                        top: "15px",
                        color: "var(--color-text-dark)",
                        opacity: 0.4,
                        pointerEvents: "none",
                      }}
                    />
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project, goals, and timeline..."
                      style={{
                        width: "100%",
                        background: "var(--color-background-light)",
                        border: "3px solid var(--color-text-dark)",
                        borderRadius: 0,
                        padding: "13px 16px 13px 40px",
                        color: "var(--color-text-dark)",
                        fontSize: "0.9rem",
                        outline: "none",
                        resize: "none",
                        transition: "box-shadow 0.2s",
                        fontFamily: "inherit",
                        boxShadow: "4px 4px 0 var(--color-surface-dark)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow = "6px 6px 0 var(--color-text-dark)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = "4px 4px 0 var(--color-surface-dark)";
                      }}
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={status !== "idle"}
                  whileHover={{ x: status === "idle" ? -2 : 0, y: status === "idle" ? -2 : 0 }}
                  whileTap={{ x: 0, y: 0 }}
                  style={{
                    width: "100%",
                    padding: "16px 24px",
                    background: "var(--color-text-dark)",
                    border: "3px solid var(--color-text-dark)",
                    borderRadius: 0,
                    color: "var(--color-background-light)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: status !== "idle" ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    opacity: status !== "idle" ? 0.6 : 1,
                    boxShadow: "6px 6px 0 var(--color-surface-dark)",
                    transition: "box-shadow 0.2s, transform 0.2s, opacity 0.2s",
                    marginTop: "4px",
                    fontFamily: "var(--font-stack-heading)",
                  }}
                  onMouseEnter={(e) => {
                    if (status === "idle") e.currentTarget.style.boxShadow = "8px 8px 0 var(--color-surface-dark)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "6px 6px 0 var(--color-surface-dark)";
                  }}
                >
                  {status === "idle" && (
                    <>
                      <Send size={15} />
                      Send Message
                    </>
                  )}
                  {status === "submitting" && (
                    <div style={{
                      width: "20px",
                      height: "20px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "var(--color-background-light)",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                    }} />
                  )}
                </motion.button>

                <p style={{
                  textAlign: "center",
                  fontSize: "0.75rem",
                  color: "var(--color-text-dark)",
                  opacity: 0.3,
                  marginTop: "4px",
                  fontFamily: "var(--font-stack-heading)",
                  letterSpacing: "0.05em",
                }}>
                  We respond within 24 hours. No spam, ever.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .contact-grid input::placeholder,
        .contact-grid textarea::placeholder {
          color: var(--color-text-dark);
          opacity: 0.3;
        }
      `}</style>
    </section>
  );
}
