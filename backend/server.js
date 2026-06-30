import { configDotenv } from "dotenv";
import express from "express";
import mongoose from "mongoose";

const PORT = Number(process.env.PORT || 8000);
const MONGODB_URI = process.env.MONGODB_URI;

configDotenv({
  debug: true,
  override: true,
});

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

const blogSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    date: { type: String, required: true },
    tags: { type: [String], default: [] },
    readTime: { type: String, default: "1 min" },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, default: "" },
    bodyMd: { type: String, required: true },
  },
  { timestamps: true },
);

const Blog = mongoose.model("Blog", blogSchema);

const connectDb = async () => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }
  await mongoose.connect(MONGODB_URI);
};

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

const formatBlog = (blog) => {
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

const validateBlog = (payload, existing = {}) => {
  const title = payload.title ?? existing.title;
  const bodyMd = payload.bodyMd ?? existing.bodyMd;
  const slug = slugify(payload.slug ?? existing.slug ?? title);

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
    },
  };
};

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.get("/api/blogs", async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ date: -1, createdAt: -1 }).lean();
    res.json(blogs.map(formatBlog));
  } catch (error) {
    next(error);
  }
});

app.get("/api/blogs/:slug", async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).lean();
    if (!blog) {
      res.status(404).json({ error: "Blog not found" });
      return;
    }
    res.json(formatBlog(blog));
  } catch (error) {
    next(error);
  }
});

app.post("/api/blogs", async (req, res, next) => {
  try {
    const { blog, error } = validateBlog(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    const createdBlog = await Blog.create(blog);
    res.status(201).json(formatBlog(createdBlog));
  } catch (error) {
    next(error);
  }
});

const updateBlog = async (req, res, next) => {
  try {
    const existing = await Blog.findOne({ slug: req.params.slug }).lean();
    if (!existing) {
      res.status(404).json({ error: "Blog not found" });
      return;
    }

    const { blog, error } = validateBlog(req.body, existing);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    const updatedBlog = await Blog.findOneAndUpdate({ slug: req.params.slug }, blog, {
      new: true,
      runValidators: true,
    });
    res.json(formatBlog(updatedBlog));
  } catch (error) {
    next(error);
  }
};

app.put("/api/blogs/:slug", updateBlog);
app.patch("/api/blogs/:slug", updateBlog);

app.delete("/api/blogs/:slug", async (req, res, next) => {
  try {
    const deletedBlog = await Blog.findOneAndDelete({ slug: req.params.slug });
    if (!deletedBlog) {
      res.status(404).json({ error: "Blog not found" });
      return;
    }
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }
  if (error.code === 11000) {
    res.status(409).json({ error: "A blog with this slug already exists" });
    return;
  }
  res.status(500).json({ error: error.message || "Internal server error" });
});

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Blog API running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Failed to start Blog API: ${error.message}`);
    process.exit(1);
  });
