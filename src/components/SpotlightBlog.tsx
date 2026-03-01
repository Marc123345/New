import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Clock, Calendar, User } from "lucide-react";
import { SpotlightBlogModal } from "./SpotlightBlogModal";
import { MagneticBlogCard } from "./blog/MagneticBlogCard";

export interface SpotlightBlogPost {
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  featured?: boolean;
  image?: string;
}

interface SpotlightBlogProps {
  posts: SpotlightBlogPost[];
  hideHeader?: boolean;
}

function FeaturedHeroCard({ post, onClick }: { post: SpotlightBlogPost; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group cursor-pointer"
      style={{ marginBottom: "clamp(32px, 4vw, 56px)" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "480px",
          border: "2px solid var(--color-text-dark)",
          boxShadow: hovered ? "var(--shadow-geometric-hover)" : "var(--shadow-geometric)",
          transform: hovered ? "translate(-3px,-3px)" : "translate(0,0)",
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
          overflow: "hidden",
          background: "var(--color-background-light)",
        }}
        className="featured-hero-grid"
      >
        {/* Image side */}
        <div style={{ position: "relative", overflow: "hidden", minHeight: "360px" }}>
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transform: hovered ? "scale(1.04)" : "scale(1)",
                transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)",
              }}
              loading="lazy"
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "var(--color-primary)" }} />
          )}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, transparent 60%, rgba(var(--color-background-light-rgb, 255,255,255), 0.05) 100%)",
          }} />
          {/* Featured badge */}
          <div style={{
            position: "absolute", top: "20px", left: "20px",
            display: "flex", gap: "8px",
          }}>
            <span
              style={{
                padding: "6px 14px",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontFamily: "var(--font-stack-heading)",
                background: "var(--color-primary)",
                color: "var(--color-background-light)",
                border: "1px solid var(--color-text-dark)",
              }}
            >
              Featured
            </span>
            <span
              style={{
                padding: "6px 14px",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontFamily: "var(--font-stack-heading)",
                background: "var(--color-background-light)",
                color: "var(--color-text-dark)",
                border: "1px solid var(--color-text-dark)",
              }}
            >
              {post.category}
            </span>
          </div>
        </div>

        {/* Content side */}
        <div style={{
          padding: "clamp(32px, 4vw, 56px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderLeft: "2px solid var(--color-text-dark)",
        }}>
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "20px",
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              opacity: 0.45,
              fontFamily: "var(--font-stack-heading)",
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Calendar size={11} /> {post.date}
              </span>
              <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "currentColor" }} />
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Clock size={11} /> {post.readTime}
              </span>
            </div>

            <h2
              style={{
                fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                color: "var(--color-text-dark)",
                fontFamily: "var(--font-stack-heading)",
                marginBottom: "20px",
                letterSpacing: "-0.02em",
                transition: "color 0.3s ease",
              }}
              className="group-hover:text-[var(--color-secondary)]"
            >
              {post.title}
            </h2>

            <p style={{
              fontSize: "clamp(0.875rem, 1.1vw, 1rem)",
              lineHeight: 1.7,
              opacity: 0.65,
              fontFamily: "var(--font-stack-body)",
              marginBottom: "32px",
            }}>
              {post.excerpt}
            </p>
          </div>

          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "28px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(35,35,35,0.12)",
            }}>
              <div style={{
                width: "32px", height: "32px",
                borderRadius: "50%",
                background: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-background-light)",
                fontSize: "0.7rem",
                fontWeight: 700,
                fontFamily: "var(--font-stack-heading)",
                flexShrink: 0,
              }}>
                {post.author.charAt(0)}
              </div>
              <div>
                <div style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-stack-heading)",
                  color: "var(--color-text-dark)",
                  letterSpacing: "0.05em",
                }}>
                  {post.author}
                </div>
              </div>
            </div>

            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 24px",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontFamily: "var(--font-stack-heading)",
                fontWeight: 700,
                border: "2px solid var(--color-text-dark)",
                background: hovered ? "var(--color-primary)" : "transparent",
                color: hovered ? "var(--color-background-light)" : "var(--color-text-dark)",
                cursor: "pointer",
                transition: "background 0.25s ease, color 0.25s ease, box-shadow 0.18s ease, transform 0.18s ease",
                boxShadow: hovered ? "var(--shadow-button-hover)" : "var(--shadow-button)",
                transform: hovered ? "translate(-2px, -2px)" : "translate(0, 0)",
              }}
            >
              Read Article
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function SpotlightBlog({ posts, hideHeader = false }: SpotlightBlogProps) {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(posts.map((p) => p.category))],
    [posts]
  );

  const filtered =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  const openPost = (post: SpotlightBlogPost) => {
    const idx = posts.indexOf(post);
    setSelectedPost(idx >= 0 ? idx : 0);
  };

  const featuredPost = filtered[0];
  const secondaryPosts = filtered.slice(1, 3);
  const gridPosts = filtered.slice(3);

  return (
    <section
      className="relative"
      style={{
        background: "var(--color-background-light)",
        paddingTop: "clamp(60px, 8vw, 100px)",
        paddingBottom: "clamp(60px, 8vw, 100px)",
        overflow: "visible",
      }}
    >
      <div className="container mx-auto px-6 md:px-12 relative" style={{ zIndex: 10 }}>

        {/* Header */}
        <motion.div
          style={{ marginBottom: "clamp(40px, 5vw, 64px)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "24px",
          }}>
            {!hideHeader && (
              <div>
                <motion.div
                  style={{
                    display: "inline-block",
                    marginBottom: "10px",
                    padding: "6px 16px",
                    border: "2px solid var(--color-secondary)",
                    boxShadow: "4px 4px 0 var(--color-secondary)",
                  }}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <span
                    style={{
                      fontSize: "0.68rem",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-stack-heading)",
                      color: "var(--color-secondary)",
                    }}
                  >
                    Journal
                  </span>
                </motion.div>
                <h2
                  style={{
                    fontSize: "clamp(2.4rem, 5vw, 4rem)",
                    fontWeight: 900,
                    fontFamily: "var(--font-stack-heading)",
                    color: "var(--color-text-dark)",
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                    margin: 0,
                  }}
                >
                  Latest{" "}
                  <span style={{ fontStyle: "italic", fontWeight: 400 }}>Insights</span>
                </h2>
              </div>
            )}

            {/* Category filters */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "8px 16px",
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-stack-heading)",
                    border: "2px solid var(--color-text-dark)",
                    background: activeCategory === cat ? "var(--color-primary)" : "transparent",
                    color: activeCategory === cat ? "var(--color-background-light)" : "var(--color-text-dark)",
                    cursor: "pointer",
                    transition: "background 0.2s, color 0.2s, box-shadow 0.18s ease, transform 0.18s ease",
                    boxShadow: activeCategory === cat ? "var(--shadow-button)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "var(--shadow-button-hover)";
                    e.currentTarget.style.transform = "translate(-2px, -2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = activeCategory === cat ? "var(--shadow-button)" : "none";
                    e.currentTarget.style.transform = "translate(0, 0)";
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            style={{
              marginTop: "28px",
              height: "2px",
              background: "var(--color-text-dark)",
              transformOrigin: "left",
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "80px 0" }}
            >
              <p style={{ opacity: 0.5, marginBottom: "24px", fontFamily: "var(--font-stack-body)" }}>
                No articles in this category.
              </p>
              <button
                onClick={() => setActiveCategory("All")}
                style={{
                  padding: "12px 24px",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-stack-heading)",
                  background: "var(--color-primary)",
                  color: "var(--color-background-light)",
                  border: "2px solid var(--color-text-dark)",
                  cursor: "pointer",
                  boxShadow: "var(--shadow-button)",
                  transition: "box-shadow 0.18s ease, transform 0.18s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow-button-hover)";
                  e.currentTarget.style.transform = "translate(-2px, -2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow-button)";
                  e.currentTarget.style.transform = "translate(0, 0)";
                }}
              >
                Show All
              </button>
            </motion.div>
          ) : (
            <motion.div key={activeCategory} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

              {/* Featured hero */}
              {featuredPost && (
                <FeaturedHeroCard post={featuredPost} onClick={() => openPost(featuredPost)} />
              )}

              {/* Secondary row: 2 large cards side by side */}
              {secondaryPosts.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: secondaryPosts.length === 1 ? "1fr" : "1fr 1fr",
                    gap: "clamp(20px, 3vw, 36px)",
                    marginBottom: "clamp(20px, 3vw, 36px)",
                  }}
                  className="secondary-posts-grid"
                >
                  {secondaryPosts.map((post, i) => (
                    <SecondaryCard key={`${post.title}-${i}`} post={post} index={i} onClick={() => openPost(post)} />
                  ))}
                </div>
              )}

              {/* Rest: 3-column grid */}
              {gridPosts.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "clamp(20px, 3vw, 36px)",
                  }}
                  className="grid-posts"
                >
                  {gridPosts.map((post, i) => (
                    <MagneticBlogCard
                      key={`${post.title}-${i}`}
                      post={post}
                      index={i}
                      onClick={() => openPost(post)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SpotlightBlogModal
        posts={posts}
        selectedPost={selectedPost}
        onClose={() => setSelectedPost(null)}
        onNavigate={setSelectedPost}
      />

      <style>{`
        @media (max-width: 768px) {
          .featured-hero-grid {
            grid-template-columns: 1fr !important;
          }
          .secondary-posts-grid {
            grid-template-columns: 1fr !important;
          }
          .grid-posts {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .grid-posts {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

function SecondaryCard({ post, index, onClick }: { post: SpotlightBlogPost; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group cursor-pointer"
    >
      <div style={{
        border: "2px solid var(--color-text-dark)",
        boxShadow: hovered ? "var(--shadow-geometric-hover)" : "var(--shadow-geometric)",
        transform: hovered ? "translate(-3px,-3px)" : "translate(0,0)",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        background: "var(--color-background-light)",
        overflow: "hidden",
      }}>
        {/* Image */}
        <div style={{ position: "relative", overflow: "hidden", aspectRatio: "16/9" }}>
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transform: hovered ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
              }}
              loading="lazy"
            />
          ) : (
            <div style={{ width: "100%", paddingBottom: "56.25%", background: "var(--color-primary)" }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)" }} />
          <div style={{ position: "absolute", top: "16px", left: "16px" }}>
            <span style={{
              padding: "5px 12px",
              fontSize: "0.62rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "var(--font-stack-heading)",
              background: "var(--color-background-light)",
              color: "var(--color-text-dark)",
              border: "1px solid var(--color-text-dark)",
            }}>
              {post.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "clamp(20px, 2.5vw, 32px)" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "14px",
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            opacity: 0.45,
            fontFamily: "var(--font-stack-heading)",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Calendar size={10} /> {post.date}
            </span>
            <span style={{ width: "2px", height: "2px", borderRadius: "50%", background: "currentColor" }} />
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Clock size={10} /> {post.readTime}
            </span>
          </div>

          <h3
            style={{
              fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)",
              fontWeight: 800,
              lineHeight: 1.2,
              color: "var(--color-text-dark)",
              fontFamily: "var(--font-stack-heading)",
              marginBottom: "12px",
              letterSpacing: "-0.015em",
              transition: "color 0.25s",
            }}
            className="group-hover:text-[var(--color-secondary)]"
          >
            {post.title}
          </h3>

          <p style={{
            fontSize: "0.875rem",
            lineHeight: 1.6,
            opacity: 0.6,
            fontFamily: "var(--font-stack-body)",
            marginBottom: "20px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {post.excerpt}
          </p>

          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "16px",
            borderTop: "1px solid rgba(35,35,35,0.1)",
          }}>
            <span style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.7rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              opacity: 0.5,
              fontFamily: "var(--font-stack-heading)",
            }}>
              <User size={11} /> {post.author}
            </span>
            <div style={{
              width: "34px", height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid var(--color-text-dark)",
              color: "var(--color-text-dark)",
              background: hovered ? "var(--color-primary)" : "transparent",
              transition: "background 0.25s, color 0.25s",
            }}
              className={hovered ? "text-[var(--color-background-light)]" : ""}
            >
              <ArrowUpRight size={15} />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
