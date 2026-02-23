import { motion } from "motion/react";
import { BLOG_POSTS } from "../constants/blog";
import { SpotlightBlog, type SpotlightBlogPost } from "../components/SpotlightBlog";
import { Navigation } from "../components/Navigation";

const allPosts: SpotlightBlogPost[] = BLOG_POSTS.map((post, i) => ({
  title: post.title,
  excerpt: post.excerpt,
  content: post.content,
  author: post.author,
  date: post.date,
  readTime: post.readTime,
  category: post.category,
  featured: i === 0,
  image: post.img,
}));

export function BlogPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-background-light)" }}
    >
      <Navigation />

      <div
        className="container mx-auto px-6 md:px-12"
        style={{
          paddingTop: "clamp(100px, 12vw, 140px)",
          paddingBottom: 0,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: "inline-block",
            marginBottom: "16px",
            padding: "6px 16px",
            border: "2px solid var(--color-secondary)",
            boxShadow: "4px 4px 0 var(--color-secondary)",
          }}
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
            Insights &amp; Stories
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            fontSize: "clamp(2.4rem, 5vw, 4rem)",
            fontWeight: 900,
            fontFamily: "var(--font-stack-heading)",
            color: "var(--color-text-dark)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            marginBottom: "14px",
          }}
        >
          All{" "}
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>Articles</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          style={{
            fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)",
            lineHeight: 1.7,
            opacity: 0.6,
            fontFamily: "var(--font-stack-body)",
            maxWidth: "560px",
            marginBottom: 0,
          }}
        >
          Explore our latest insights on digital innovation, technology, and the
          African startup ecosystem.
        </motion.p>
      </div>

      <SpotlightBlog posts={allPosts} hideHeader />
    </div>
  );
}
