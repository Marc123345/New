import { BLOG_POSTS } from "../constants/blog";
import { SpotlightBlog, type SpotlightBlogPost } from "./SpotlightBlog";

const spotlightPosts: SpotlightBlogPost[] = BLOG_POSTS.slice(0, 6).map(
  (post, i) => ({
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    author: post.author,
    date: post.date,
    readTime: post.readTime,
    category: post.category,
    featured: i === 0,
    image: post.img,
  })
);

export function BlogSection() {
  return <SpotlightBlog posts={spotlightPosts} />;
}
