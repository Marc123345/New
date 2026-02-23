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

interface SpotlightBlogCardProps {
  post: BlogCardPost;
  index: number;
  onClick: () => void;
}

export function SpotlightBlogCard({
  post,
  index,
  onClick,
}: SpotlightBlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div
        className="relative overflow-hidden bg-[var(--color-background-light)]"
        style={{
          border: "2px solid var(--color-text-dark)",
          boxShadow: "var(--shadow-geometric)",
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "var(--shadow-geometric-hover)";
          e.currentTarget.style.transform = "translate(-2px, -2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "var(--shadow-geometric)";
          e.currentTarget.style.transform = "translate(0, 0)";
        }}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
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

        <div className="p-5 sm:p-6">
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
