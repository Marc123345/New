import { useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

interface BlogCardPost {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
}

interface MagneticBlogCardProps {
  post: BlogCardPost;
  index: number;
  onClick: () => void;
}

export function MagneticBlogCard({ post, index, onClick }: MagneticBlogCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const nx = (cx / rect.width - 0.5) * 2;
    const ny = (cy / rect.height - 0.5) * 2;
    setTilt({ x: -ny * 8, y: nx * 8 });
    setSpotlight({
      x: (cx / rect.width) * 100,
      y: (cy / rect.height) * 100,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setSpotlight((s) => ({ ...s, opacity: 0 }));
  };

  const cardNum = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="group cursor-pointer"
      style={{ perspective: "800px" }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: tilt.x === 0 && tilt.y === 0
            ? "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease"
            : "transform 0.08s ease-out",
          border: "2px solid var(--color-text-dark)",
          boxShadow:
            tilt.x !== 0 || tilt.y !== 0
              ? "var(--shadow-geometric-hover)"
              : "var(--shadow-geometric)",
          background: "var(--color-background-light)",
          position: "relative",
          overflow: "hidden",
          willChange: "transform",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(200px circle at ${spotlight.x}% ${spotlight.y}%, rgba(164,108,252,0.12) 0%, transparent 70%)`,
            opacity: spotlight.opacity,
            transition: "opacity 0.3s ease",
            zIndex: 2,
          }}
        />

        <div
          className="absolute top-4 right-4 select-none pointer-events-none"
          style={{
            fontFamily: "var(--font-stack-heading)",
            fontSize: "5.5rem",
            fontWeight: 900,
            lineHeight: 1,
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(164,108,252,0.18)",
            transition: "color 0.35s ease, -webkit-text-stroke 0.35s ease",
            zIndex: 1,
          }}
        >
          {cardNum}
        </div>

        <div className="relative aspect-[16/10] overflow-hidden" style={{ zIndex: 3 }}>
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              style={{
                transform: `scale(1) translate(${tilt.y * -0.3}px, ${tilt.x * 0.3}px)`,
                transition:
                  tilt.x === 0 && tilt.y === 0
                    ? "transform 0.5s cubic-bezier(0.22,1,0.36,1)"
                    : "transform 0.08s ease-out",
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute top-4 left-4">
            <span
              className="inline-block px-3 py-1 text-[10px] uppercase tracking-[0.2em] bg-[var(--color-background-light)] text-[var(--color-primary)]"
              style={{
                fontFamily: "var(--font-stack-heading)",
                border: "1px solid var(--color-text-dark)",
              }}
            >
              {post.category}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6" style={{ position: "relative", zIndex: 3 }}>
          <div
            className="flex items-center gap-3 mb-4 text-[11px] tracking-wider uppercase opacity-50"
            style={{ fontFamily: "var(--font-stack-heading)" }}
          >
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-current" />
            <span>{post.readTime}</span>
          </div>

          <h3
            className="leading-tight mb-3 transition-colors duration-300 group-hover:text-[var(--color-secondary)]"
            style={{
              color: "var(--color-text-dark)",
              fontFamily: "var(--font-stack-heading)",
              fontSize: "1.35rem",
              lineHeight: 1.15,
            }}
          >
            {post.title}
          </h3>

          <p
            className="text-sm leading-relaxed opacity-70 mb-5 line-clamp-2"
            style={{ fontFamily: "var(--font-stack-body)" }}
          >
            {post.excerpt}
          </p>

          <div
            className="flex items-center justify-between pt-4"
            style={{ borderTop: "1px solid rgba(35,35,35,0.12)" }}
          >
            <span
              className="text-[11px] tracking-wider uppercase opacity-50"
              style={{ fontFamily: "var(--font-stack-heading)" }}
            >
              {post.author}
            </span>
            <div
              className="w-8 h-8 flex items-center justify-center transition-all duration-300 group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-background-light)]"
              style={{
                border: "1px solid var(--color-text-dark)",
                color: "var(--color-text-dark)",
              }}
            >
              <ArrowUpRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
