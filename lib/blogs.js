import { connectDb } from "./db";
import Blog from "./models/Blog";
import { POSTS } from "./constants";

const slugify = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) return tags.map(String).map((tag) => tag.trim()).filter(Boolean);
  if (typeof tags === "string") return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  return [];
};

export const formatBlog = (blog) => {
  if (!blog) return null;
  const plain = blog.toObject ? blog.toObject() : blog;
  const rest = { ...plain };
  delete rest._id;
  delete rest.__v;
  return {
    ...rest,
    createdAt: rest.createdAt instanceof Date ? rest.createdAt.toISOString() : rest.createdAt,
    updatedAt: rest.updatedAt instanceof Date ? rest.updatedAt.toISOString() : rest.updatedAt,
  };
};

const VALID_STATUSES = ["draft", "published"];

export const validateBlog = (payload, existing = {}) => {
  const title = payload.title ?? existing.title;
  const bodyMd = payload.bodyMd ?? existing.bodyMd;
  const slug = slugify(payload.slug ?? existing.slug ?? title);
  const status = VALID_STATUSES.includes(payload.status) ? payload.status : existing.status ?? "published";

  if (!title || !String(title).trim()) return { error: "title is required" };
  if (!bodyMd || !String(bodyMd).trim()) return { error: "bodyMd is required" };
  if (!slug) return { error: "slug or title must create a valid slug" };

  return {
    blog: {
      slug,
      date: payload.date ?? existing.date ?? new Date().toISOString().slice(0, 10),
      tags: normalizeTags(payload.tags ?? existing.tags),
      readTime: payload.readTime ?? existing.readTime ?? "1 min",
      title: String(title).trim(),
      excerpt: payload.excerpt ?? existing.excerpt ?? "",
      bodyMd: String(bodyMd),
      status,
    },
  };
};

// Server-side reads used by the pages — fall back to the bundled POSTS
// constant when the database is unreachable, same behavior the old
// client-side fetch + fallback had. Drafts never appear on public pages.
export async function getAllBlogsSafe() {
  try {
    await connectDb();
    const blogs = await Blog.find({ status: { $ne: "draft" } }).sort({ date: -1, createdAt: -1 }).lean();
    return { posts: blogs.map(formatBlog), status: "ready" };
  } catch (error) {
    return { posts: POSTS, status: "fallback", error: error.message };
  }
}

export async function getBlogBySlugSafe(slug) {
  try {
    await connectDb();
    const blog = await Blog.findOne({ slug, status: { $ne: "draft" } }).lean();
    if (blog) return { post: formatBlog(blog), status: "ready" };
    return { post: POSTS.find((p) => p.slug === slug) || null, status: "ready" };
  } catch (error) {
    return { post: POSTS.find((p) => p.slug === slug) || null, status: "fallback", error: error.message };
  }
}

// Admin panel needs to see drafts too.
export async function getAllBlogsForAdmin() {
  await connectDb();
  const blogs = await Blog.find().sort({ date: -1, createdAt: -1 }).lean();
  return blogs.map(formatBlog);
}
