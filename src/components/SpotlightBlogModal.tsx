import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Clock, User, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface ModalPost {
  title: string;
  excerpt: string;
  content?: string;
  sections?: { heading: string; content: string }[];
  author: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
}

interface SpotlightBlogModalProps {
  posts: ModalPost[];
  selectedPost: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function SpotlightBlogModal({
  posts,
  selectedPost,
  onClose,
  onNavigate,
}: SpotlightBlogModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedPost !== null) {
      document.body.style.overflow = "hidden";
      scrollRef.current?.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedPost]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedPost === null) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && selectedPost > 0) onNavigate(selectedPost - 1);
      if (e.key === "ArrowRight" && selectedPost < posts.length - 1) onNavigate(selectedPost + 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onNavigate, selectedPost, posts.length]);

  const post = selectedPost !== null ? posts[selectedPost] : null;

  return createPortal(
    <AnimatePresence>
      {selectedPost !== null && post && (
        <motion.div
          className="fixed inset-0"
          style={{ zIndex: 9999, background: "#060810" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Top bar */}
          <div
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
            style={{
              padding: "clamp(12px, 2vw, 20px) clamp(16px, 3vw, 40px)",
              background: "linear-gradient(to bottom, rgba(6,8,16,0.95), transparent)",
              backdropFilter: "blur(8px)",
            }}
          >
            <button
              onClick={onClose}
              className="flex items-center gap-2 transition-colors duration-200 hover:text-white"
              style={{
                fontFamily: "var(--font-stack-heading)",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
                background: "none",
                border: "none",
                cursor: "pointer",
                minHeight: 44,
              }}
            >
              <ChevronLeft size={16} />
              Back
            </button>

            <div className="flex items-center gap-2">
              {selectedPost > 0 && (
                <button
                  onClick={() => onNavigate(selectedPost - 1)}
                  className="w-10 h-10 flex items-center justify-center transition-colors duration-200"
                  style={{
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.7)",
                    cursor: "pointer",
                    borderRadius: 6,
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
              )}
              {selectedPost < posts.length - 1 && (
                <button
                  onClick={() => onNavigate(selectedPost + 1)}
                  className="w-10 h-10 flex items-center justify-center transition-colors duration-200"
                  style={{
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.7)",
                    cursor: "pointer",
                    borderRadius: 6,
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              )}
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center transition-colors duration-200 ml-1"
                style={{
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  borderRadius: 6,
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div
            ref={scrollRef}
            className="h-full overflow-y-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {/* Hero image */}
            {post.image && (
              <div className="relative w-full" style={{ height: "clamp(240px, 45vh, 520px)" }}>
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, #060810 0%, rgba(6,8,16,0.4) 40%, transparent 100%)" }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0"
                  style={{ padding: "clamp(20px, 4vw, 48px) clamp(20px, 6vw, 120px)" }}
                >
                  <span
                    className="inline-block mb-4"
                    style={{
                      padding: "6px 14px",
                      fontSize: "0.6rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-stack-heading)",
                      background: "var(--color-secondary)",
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    {post.category}
                  </span>
                  <h1
                    style={{
                      fontFamily: "var(--font-stack-heading)",
                      fontSize: "clamp(1.5rem, 5vw, 3.5rem)",
                      lineHeight: 1.05,
                      color: "#ffffff",
                      fontWeight: 900,
                      letterSpacing: "-0.02em",
                      maxWidth: "800px",
                    }}
                  >
                    {post.title}
                  </h1>
                </div>
              </div>
            )}

            {/* Article body */}
            <div
              style={{
                maxWidth: "780px",
                margin: "0 auto",
                padding: post.image
                  ? "clamp(24px, 4vw, 48px) clamp(20px, 6vw, 40px) clamp(60px, 8vw, 120px)"
                  : "clamp(100px, 14vh, 160px) clamp(20px, 6vw, 40px) clamp(60px, 8vw, 120px)",
              }}
            >
              {/* Title if no image */}
              {!post.image && (
                <div style={{ marginBottom: "clamp(24px, 4vw, 40px)" }}>
                  <span
                    className="inline-block mb-4"
                    style={{
                      padding: "6px 14px",
                      fontSize: "0.6rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-stack-heading)",
                      background: "var(--color-secondary)",
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    {post.category}
                  </span>
                  <h1
                    style={{
                      fontFamily: "var(--font-stack-heading)",
                      fontSize: "clamp(1.5rem, 5vw, 3.5rem)",
                      lineHeight: 1.05,
                      color: "#ffffff",
                      fontWeight: 900,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {post.title}
                  </h1>
                </div>
              )}

              {/* Author / date / read time */}
              <div
                className="flex flex-wrap items-center gap-5"
                style={{
                  paddingBottom: "clamp(16px, 3vw, 28px)",
                  marginBottom: "clamp(20px, 4vw, 36px)",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  <User size={15} style={{ color: "var(--color-secondary)" }} />
                  <span style={{ fontFamily: "var(--font-stack-body)" }}>{post.author}</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  <Calendar size={15} style={{ color: "var(--color-secondary)" }} />
                  <span style={{ fontFamily: "var(--font-stack-body)" }}>{post.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  <Clock size={15} style={{ color: "var(--color-secondary)" }} />
                  <span style={{ fontFamily: "var(--font-stack-body)" }}>{post.readTime}</span>
                </div>
              </div>

              {/* Excerpt as pull quote */}
              <blockquote
                style={{
                  borderLeft: "3px solid var(--color-secondary)",
                  paddingLeft: "clamp(16px, 2vw, 24px)",
                  marginBottom: "clamp(28px, 4vw, 40px)",
                  fontFamily: "var(--font-stack-body)",
                  fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                  color: "rgba(232,226,255,0.8)",
                }}
              >
                {post.excerpt}
              </blockquote>

              {/* Intro content */}
              {post.content && (
                <div
                  style={{
                    fontFamily: "var(--font-stack-body)",
                    fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
                    lineHeight: 1.85,
                    color: "rgba(232,226,255,0.75)",
                    marginBottom: "clamp(28px, 4vw, 40px)",
                    whiteSpace: "pre-line",
                  }}
                >
                  {post.content}
                </div>
              )}

              {/* Article sections */}
              {post.sections && post.sections.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "clamp(32px, 5vw, 48px)" }}>
                  {post.sections.map((section, i) => (
                    <div key={i}>
                      <h2
                        style={{
                          fontFamily: "var(--font-stack-heading)",
                          fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
                          lineHeight: 1.15,
                          color: "#ffffff",
                          fontWeight: 800,
                          letterSpacing: "-0.01em",
                          marginBottom: "clamp(12px, 2vw, 20px)",
                        }}
                      >
                        {section.heading}
                      </h2>
                      <div
                        style={{
                          fontFamily: "var(--font-stack-body)",
                          fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
                          lineHeight: 1.85,
                          color: "rgba(232,226,255,0.75)",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {section.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom nav */}
              <div
                className="flex flex-wrap items-center justify-between gap-4"
                style={{
                  marginTop: "clamp(40px, 6vw, 64px)",
                  paddingTop: "clamp(20px, 3vw, 32px)",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <button
                  onClick={onClose}
                  style={{
                    fontFamily: "var(--font-stack-heading)",
                    fontSize: "0.68rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "12px 20px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "rgba(255,255,255,0.7)",
                    background: "transparent",
                    cursor: "pointer",
                    minHeight: 44,
                  }}
                >
                  Back to Articles
                </button>
                <div className="flex gap-2">
                  {selectedPost > 0 && (
                    <button
                      onClick={() => onNavigate(selectedPost - 1)}
                      style={{
                        fontFamily: "var(--font-stack-heading)",
                        fontSize: "0.68rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        padding: "12px 20px",
                        border: "1px solid rgba(255,255,255,0.2)",
                        background: "rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.7)",
                        cursor: "pointer",
                        minHeight: 44,
                      }}
                    >
                      Prev
                    </button>
                  )}
                  {selectedPost < posts.length - 1 && (
                    <button
                      onClick={() => onNavigate(selectedPost + 1)}
                      style={{
                        fontFamily: "var(--font-stack-heading)",
                        fontSize: "0.68rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        padding: "12px 20px",
                        border: "1px solid rgba(255,255,255,0.2)",
                        background: "rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.7)",
                        cursor: "pointer",
                        minHeight: 44,
                      }}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
