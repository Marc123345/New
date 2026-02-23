import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Clock, User, Calendar } from "lucide-react";

interface ModalPost {
  title: string;
  excerpt: string;
  content?: string;
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
  useEffect(() => {
    if (selectedPost !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedPost]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {selectedPost !== null && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-start justify-center overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(41, 30, 86, 0.85)", backdropFilter: "blur(8px)" }}
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-3xl mx-4 my-12 bg-[var(--color-background-light)]"
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              border: "2px solid var(--color-text-dark)",
              boxShadow: "16px 16px 0 var(--color-primary)",
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-[var(--color-background-light)] transition-colors duration-200 hover:bg-[var(--color-primary)] hover:text-[var(--color-background-light)]"
              style={{
                border: "2px solid var(--color-text-dark)",
                color: "var(--color-text-dark)",
              }}
            >
              <X size={18} />
            </button>

            {posts[selectedPost].image && (
              <div className="relative h-72 md:h-96 overflow-hidden">
                <img
                  src={posts[selectedPost].image}
                  alt={posts[selectedPost].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-8 right-8">
                  <span
                    className="inline-block px-3 py-1 mb-4 text-[10px] uppercase tracking-[0.2em] bg-[var(--color-secondary)] text-[var(--color-primary)]"
                    style={{ fontFamily: "var(--font-stack-heading)" }}
                  >
                    {posts[selectedPost].category}
                  </span>
                  <h2
                    className="text-[var(--color-background-light)]"
                    style={{
                      fontFamily: "var(--font-stack-heading)",
                      fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                      lineHeight: 1.05,
                      textShadow: "0 4px 20px rgba(0,0,0,0.5)",
                    }}
                  >
                    {posts[selectedPost].title}
                  </h2>
                </div>
              </div>
            )}

            <div className="px-8 md:px-12 py-8">
              {!posts[selectedPost].image && (
                <>
                  <span
                    className="inline-block px-3 py-1 mb-4 text-[10px] uppercase tracking-[0.2em] bg-[var(--color-secondary)] text-[var(--color-primary)]"
                    style={{ fontFamily: "var(--font-stack-heading)" }}
                  >
                    {posts[selectedPost].category}
                  </span>
                  <h2
                    className="mb-6"
                    style={{
                      fontFamily: "var(--font-stack-heading)",
                      fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                      lineHeight: 1.05,
                      color: "var(--color-text-dark)",
                    }}
                  >
                    {posts[selectedPost].title}
                  </h2>
                </>
              )}

              <div
                className="flex flex-wrap items-center gap-5 mb-8 pb-6"
                style={{ borderBottom: "1px solid rgba(35,35,35,0.1)" }}
              >
                <div className="flex items-center gap-2 text-sm opacity-60">
                  <User size={15} className="text-[var(--color-secondary)]" />
                  <span style={{ fontFamily: "var(--font-stack-body)" }}>
                    {posts[selectedPost].author}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm opacity-60">
                  <Calendar size={15} className="text-[var(--color-secondary)]" />
                  <span style={{ fontFamily: "var(--font-stack-body)" }}>
                    {posts[selectedPost].date}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm opacity-60">
                  <Clock size={15} className="text-[var(--color-secondary)]" />
                  <span style={{ fontFamily: "var(--font-stack-body)" }}>
                    {posts[selectedPost].readTime}
                  </span>
                </div>
              </div>

              <blockquote
                className="mb-8 pl-5 italic text-lg leading-relaxed"
                style={{
                  borderLeft: "3px solid var(--color-secondary)",
                  fontFamily: "var(--font-stack-body)",
                  color: "var(--color-text-dark)",
                  opacity: 0.85,
                }}
              >
                {posts[selectedPost].excerpt}
              </blockquote>

              <div
                className="text-base leading-[1.8] mb-8"
                style={{
                  fontFamily: "var(--font-stack-body)",
                  color: "var(--color-text-dark)",
                  opacity: 0.8,
                }}
              >
                {posts[selectedPost].content || posts[selectedPost].excerpt}
              </div>

              <div
                className="flex flex-wrap items-center justify-between gap-4 pt-6"
                style={{ borderTop: "2px solid var(--color-text-dark)" }}
              >
                <button
                  onClick={onClose}
                  className="px-5 py-3 text-[11px] uppercase tracking-[0.15em] transition-colors duration-200 hover:bg-[var(--color-text-dark)] hover:text-[var(--color-background-light)]"
                  style={{
                    fontFamily: "var(--font-stack-heading)",
                    border: "2px solid var(--color-text-dark)",
                    color: "var(--color-text-dark)",
                  }}
                >
                  Back to Articles
                </button>
                <div className="flex gap-2">
                  {selectedPost > 0 && (
                    <button
                      onClick={() => onNavigate(selectedPost - 1)}
                      className="px-5 py-3 text-[11px] uppercase tracking-[0.15em] bg-[var(--color-primary)] text-[var(--color-background-light)] transition-colors duration-200 hover:bg-[var(--color-secondary)]"
                      style={{
                        fontFamily: "var(--font-stack-heading)",
                        border: "2px solid var(--color-text-dark)",
                      }}
                    >
                      Prev
                    </button>
                  )}
                  {selectedPost < posts.length - 1 && (
                    <button
                      onClick={() => onNavigate(selectedPost + 1)}
                      className="px-5 py-3 text-[11px] uppercase tracking-[0.15em] bg-[var(--color-primary)] text-[var(--color-background-light)] transition-colors duration-200 hover:bg-[var(--color-secondary)]"
                      style={{
                        fontFamily: "var(--font-stack-heading)",
                        border: "2px solid var(--color-text-dark)",
                      }}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
