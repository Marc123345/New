import { useEffect } from "react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { BlogPost, BLOG_POSTS } from "../constants/blog";
import gsap from "gsap";

interface BlogOverlayProps {
  post: BlogPost | null;
  onClose: () => void;
  onNavigate?: (post: BlogPost) => void;
}

export function BlogOverlay({ post, onClose, onNavigate }: BlogOverlayProps) {
  useEffect(() => {
    if (post) {
      const t1 = gsap.fromTo(".blog-overlay", { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
      const t2 = gsap.fromTo(".blog-overlay-content", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", delay: 0.08 });
      document.body.style.overflow = "hidden";
      return () => {
        t1.kill();
        t2.kill();
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [post]);

  if (!post) return null;

  const currentIndex = BLOG_POSTS.findIndex(p => p.id === post.id);
  const prevPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
  const nextPost = currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

  const handleClose = () => {
    gsap.to(".blog-overlay", { opacity: 0, duration: 0.18, ease: "power2.in" });
    gsap.to(".blog-overlay-content", { y: 24, opacity: 0, duration: 0.18, ease: "power2.in", onComplete: onClose });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  return (
    <div
      className="blog-overlay fixed inset-0 z-[150] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)" }}
      onClick={handleOverlayClick}
    >
      <div
        className="blog-overlay-content relative w-full h-full overflow-y-auto"
        style={{ background: "var(--color-background-light)", scrollbarWidth: "thin", scrollbarColor: "var(--color-secondary) var(--color-background-light)" }}
      >
        {/* Fixed top bar */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between px-6 md:px-12 py-4"
          style={{ background: "rgba(14,11,31,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(164,108,252,0.15)" }}
        >
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-sm transition-opacity duration-200 hover:opacity-60"
            style={{ fontFamily: "var(--font-stack-heading)", letterSpacing: "0.08em", color: "var(--color-text-dark)" }}
          >
            <X size={16} strokeWidth={2} />
            Close
          </button>

          <span
            className="text-xs tracking-widest uppercase"
            style={{ fontFamily: "var(--font-stack-heading)", color: "var(--color-secondary)" }}
          >
            {post.category}
          </span>
        </div>

        {/* Hero image */}
        <div className="relative w-full overflow-hidden" style={{ height: "clamp(200px, 45vh, 480px)" }}>
          <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(14,11,31,0) 40%, rgba(14,11,31,0.7) 100%)" }} />
        </div>

        {/* Article body */}
        <div className="max-w-3xl mx-auto px-6 md:px-8 pt-12 pb-24">

          {/* Title */}
          <h1
            className="mb-6 tracking-tight"
            style={{
              fontSize: "clamp(1.75rem, 4.5vw, 3rem)",
              fontFamily: "var(--font-stack-heading)",
              color: "var(--color-text-dark)",
              lineHeight: "1.1",
            }}
          >
            {post.title}
          </h1>

          {/* Meta row */}
          <div
            className="flex flex-wrap items-center gap-x-6 gap-y-1 mb-10 pb-8"
            style={{ borderBottom: "1px solid rgba(164,108,252,0.15)", fontFamily: "var(--font-stack-body)", fontSize: "0.875rem", color: "rgba(232,226,255,0.5)" }}
          >
            <span>{post.author}</span>
            <span style={{ color: "rgba(232,226,255,0.2)" }}>·</span>
            <span>{post.date}</span>
            <span style={{ color: "rgba(232,226,255,0.2)" }}>·</span>
            <span>{post.readTime}</span>
          </div>

          {/* Excerpt */}
          <p
            className="mb-10 leading-relaxed"
            style={{
              fontSize: "1.15rem",
              fontFamily: "var(--font-stack-body)",
              color: "var(--color-text-dark)",
              fontStyle: "italic",
              borderLeft: "2px solid var(--color-secondary)",
              paddingLeft: "1.25rem",
            }}
          >
            {post.excerpt}
          </p>

          {/* Intro paragraph */}
          <p
            className="mb-10"
            style={{ fontFamily: "var(--font-stack-body)", color: "rgba(232,226,255,0.8)", lineHeight: "1.85", fontSize: "1.05rem" }}
          >
            {post.content}
          </p>

          {/* Sections */}
          {post.sections && post.sections.length > 0 && (
            <article className="space-y-10">
              {post.sections.map((section, i) => (
                <section key={i}>
                  <h2
                    className="mb-3 tracking-tight"
                    style={{
                      fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
                      fontFamily: "var(--font-stack-heading)",
                      color: "var(--color-text-dark)",
                      lineHeight: "1.2",
                    }}
                  >
                    {section.heading}
                  </h2>
                  <p style={{ fontFamily: "var(--font-stack-body)", color: "rgba(232,226,255,0.75)", lineHeight: "1.85", fontSize: "1.05rem" }}>
                    {section.content}
                  </p>
                </section>
              ))}
            </article>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8" style={{ borderTop: "1px solid rgba(164,108,252,0.12)" }}>
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs"
                  style={{
                    fontFamily: "var(--font-stack-heading)",
                    background: "rgba(164,108,252,0.08)",
                    color: "rgba(232,226,255,0.6)",
                    letterSpacing: "0.05em",
                    border: "1px solid rgba(164,108,252,0.2)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom navigation bar */}
        <div
          className="sticky bottom-0 z-20"
          style={{ background: "rgba(14,11,31,0.96)", backdropFilter: "blur(8px)", borderTop: "1px solid rgba(164,108,252,0.15)" }}
        >
          <div className="max-w-3xl mx-auto flex items-center justify-between px-6 md:px-8 py-4">
            <button
              onClick={handleClose}
              className="flex items-center gap-2 text-xs uppercase tracking-widest transition-opacity duration-200 hover:opacity-50"
              style={{ fontFamily: "var(--font-stack-heading)", color: "var(--color-text-dark)", border: "1px solid rgba(232,226,255,0.2)", padding: "0.6rem 1.1rem", background: "none" }}
            >
              <ArrowLeft size={13} strokeWidth={2} />
              Articles
            </button>

            <div className="flex items-center gap-3">
              {prevPost && onNavigate && (
                <button
                  onClick={() => onNavigate(prevPost)}
                  className="flex items-center gap-2 text-xs uppercase tracking-widest transition-opacity duration-200 hover:opacity-50"
                  style={{ fontFamily: "var(--font-stack-heading)", color: "var(--color-text-dark)", border: "1px solid rgba(232,226,255,0.2)", padding: "0.6rem 1.1rem", background: "none" }}
                >
                  <ArrowLeft size={13} strokeWidth={2} />
                  Prev
                </button>
              )}
              {nextPost && onNavigate && (
                <button
                  onClick={() => onNavigate(nextPost)}
                  className="flex items-center gap-2 text-xs uppercase tracking-widest transition-all duration-200"
                  style={{ fontFamily: "var(--font-stack-heading)", color: "var(--color-background-light)", background: "var(--color-secondary)", padding: "0.6rem 1.25rem", border: "1px solid var(--color-secondary)" }}
                >
                  Next
                  <ArrowRight size={13} strokeWidth={2} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
