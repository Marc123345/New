import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Clock, User, Calendar, ArrowLeft, ArrowRight } from "lucide-react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const touchRef = useRef({ startY: 0, atTop: false });

  useEffect(() => {
    if (selectedPost !== null) {
      setScrollProgress(0);
      setShowHint(true);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedPost]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const p = el.scrollTop / (el.scrollHeight - el.clientHeight);
    setScrollProgress(p);
    if (p > 0) setShowHint(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchRef.current.startY = e.touches[0].clientY;
    touchRef.current.atTop = (scrollRef.current?.scrollTop ?? 0) <= 0;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current.atTop) return;
    const delta = e.changedTouches[0].clientY - touchRef.current.startY;
    if (delta > 100) onClose();
  }, [onClose]);

  const hasPrev = selectedPost !== null && selectedPost > 0;
  const hasNext = selectedPost !== null && selectedPost < posts.length - 1;
  const post = selectedPost !== null ? posts[selectedPost] : null;

  return (
    <AnimatePresence>
      {selectedPost !== null && post && (
        <motion.div
          key="blog-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200]"
          style={{ background: "rgba(var(--color-primary-rgb, 41,30,86),0.97)", backdropFilter: "blur(24px)" }}
          role="dialog"
          aria-modal="true"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="fixed top-0 left-0 right-0 h-[2px] z-10" style={{ background: "rgba(255,255,255,0.08)" }}>
            <motion.div
              className="h-full"
              style={{
                width: `${scrollProgress * 100}%`,
                background: "linear-gradient(to right, var(--color-secondary, #9333ea), var(--color-secondary-light, #c084fc))",
              }}
            />
          </div>

          <motion.button
            onClick={onClose}
            aria-label="Close"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.18, type: "spring", stiffness: 320, damping: 22 }}
            className="fixed top-4 right-4 md:top-8 md:right-8 z-10 flex h-11 w-11 items-center justify-center transition-all duration-200 hover:rotate-90"
            style={{
              border: "2px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.8)",
              borderRadius: 2,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
          >
            <X size={18} strokeWidth={2} />
          </motion.button>

          <div
            ref={scrollRef}
            className="h-screen overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: "touch", paddingBottom: "100px" }}
            onScroll={handleScroll}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPost}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                className="max-w-3xl mx-auto px-5 sm:px-8 pt-16 md:pt-24 pb-12"
              >
                {post.image && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.06, duration: 0.5 }}
                    className="relative w-full overflow-hidden mb-8 sm:mb-10"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(41,30,86,0.9) 0%, transparent 60%)" }}
                    />
                  </motion.div>
                )}

                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="inline-block px-3 py-1 mb-5 text-[10px] uppercase tracking-[0.25em]"
                  style={{
                    fontFamily: "var(--font-stack-heading)",
                    background: "var(--color-secondary, #9333ea)",
                    color: "#fff",
                  }}
                >
                  {post.category}
                </motion.span>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="font-bold leading-[1.05] tracking-[-0.025em] mb-6 sm:mb-8"
                  style={{ fontSize: "clamp(1.9rem, 6vw, 3.2rem)", color: "#fff", fontFamily: "var(--font-stack-heading)" }}
                >
                  {post.title}
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.18 }}
                  className="h-px w-full mb-6"
                  style={{ background: "rgba(255,255,255,0.12)" }}
                />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap items-center gap-5 mb-8"
                >
                  <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                    <User size={14} style={{ color: "var(--color-secondary, #9333ea)" }} />
                    <span style={{ fontFamily: "var(--font-stack-body)" }}>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                    <Calendar size={14} style={{ color: "var(--color-secondary, #9333ea)" }} />
                    <span style={{ fontFamily: "var(--font-stack-body)" }}>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                    <Clock size={14} style={{ color: "var(--color-secondary, #9333ea)" }} />
                    <span style={{ fontFamily: "var(--font-stack-body)" }}>{post.readTime}</span>
                  </div>
                </motion.div>

                <motion.blockquote
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24, duration: 0.45 }}
                  className="mb-8 pl-5 italic text-base sm:text-lg leading-[1.75]"
                  style={{
                    borderLeft: "2px solid var(--color-secondary, #9333ea)",
                    fontFamily: "var(--font-stack-body)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {post.excerpt}
                </motion.blockquote>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.45 }}
                  className="text-base leading-[1.85]"
                  style={{ fontFamily: "var(--font-stack-body)", color: "rgba(255,255,255,0.72)" }}
                >
                  {post.content || post.excerpt}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(20,12,50,0.95)", backdropFilter: "blur(12px)" }}
          >
            <button
              onClick={() => hasPrev && onNavigate(selectedPost! - 1)}
              disabled={!hasPrev}
              aria-label="Previous article"
              className="inline-flex items-center gap-2 transition-all duration-200 px-4 py-2.5"
              style={{
                fontFamily: "var(--font-stack-heading)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: hasPrev ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.18)",
                cursor: hasPrev ? "pointer" : "default",
                border: hasPrev ? "1px solid rgba(255,255,255,0.12)" : "1px solid transparent",
                background: "none",
              }}
              onMouseEnter={e => { if (hasPrev) { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; } }}
              onMouseLeave={e => { if (hasPrev) { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.background = "none"; } }}
            >
              <ArrowLeft size={14} />
              <span>Prev</span>
            </button>

            <button
              onClick={onClose}
              className="text-[11px] uppercase tracking-[0.15em] px-5 py-2.5 transition-all duration-200"
              style={{
                fontFamily: "var(--font-stack-heading)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.65)",
                background: "none",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.65)"; e.currentTarget.style.background = "none"; }}
            >
              Back
            </button>

            <button
              onClick={() => hasNext && onNavigate(selectedPost! + 1)}
              disabled={!hasNext}
              aria-label="Next article"
              className="inline-flex items-center gap-2 transition-all duration-200 px-4 py-2.5"
              style={{
                fontFamily: "var(--font-stack-heading)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: hasNext ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.18)",
                cursor: hasNext ? "pointer" : "default",
                border: hasNext ? "1px solid rgba(255,255,255,0.12)" : "1px solid transparent",
                background: "none",
              }}
              onMouseEnter={e => { if (hasNext) { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; } }}
              onMouseLeave={e => { if (hasNext) { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.background = "none"; } }}
            >
              <span>Next</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {showHint && scrollProgress === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
            >
              <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "rgba(255,255,255,0.3)" }}>
                  <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
              <span className="text-[11px] tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-stack-heading)" }}>Scroll</span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
