import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, "data", "blogs.json");
const PORT = Number(process.env.PORT || 3002);

const sendJson = (res, status, payload) => {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  });
  res.end(body);
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body ? JSON.parse(body) : {}));
    req.on("error", reject);
  });

const readBlogs = async () => {
  const raw = await readFile(DATA_FILE, "utf8");
  return JSON.parse(raw);
};

const writeBlogs = async (blogs) => {
  await writeFile(DATA_FILE, `${JSON.stringify(blogs, null, 2)}\n`);
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

const validateBlog = (payload, existing = {}) => {
  const title = payload.title ?? existing.title;
  const bodyMd = payload.bodyMd ?? existing.bodyMd;
  const slug = slugify(payload.slug ?? existing.slug ?? title);

  if (!title || !String(title).trim()) return { error: "title is required" };
  if (!bodyMd || !String(bodyMd).trim()) return { error: "bodyMd is required" };
  if (!slug) return { error: "slug or title must create a valid slug" };

  return {
    blog: {
      ...existing,
      slug,
      date: payload.date ?? existing.date ?? new Date().toISOString().slice(0, 10),
      tags: normalizeTags(payload.tags ?? existing.tags),
      readTime: payload.readTime ?? existing.readTime ?? "1 min",
      title: String(title).trim(),
      excerpt: payload.excerpt ?? existing.excerpt ?? "",
      bodyMd: String(bodyMd),
      updatedAt: new Date().toISOString(),
      createdAt: existing.createdAt ?? new Date().toISOString(),
    },
  };
};

const getRoute = (req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const parts = url.pathname.split("/").filter(Boolean);
  return { url, parts };
};

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  const { parts } = getRoute(req);
  if (parts[0] !== "api" || parts[1] !== "blogs") {
    sendJson(res, 404, { error: "Route not found" });
    return;
  }

  try {
    const slug = parts[2];
    const blogs = await readBlogs();

    if (req.method === "GET" && !slug) {
      sendJson(res, 200, blogs.sort((a, b) => String(b.date).localeCompare(String(a.date))));
      return;
    }

    if (req.method === "GET" && slug) {
      const blog = blogs.find((item) => item.slug === slug);
      sendJson(res, blog ? 200 : 404, blog || { error: "Blog not found" });
      return;
    }

    if (req.method === "POST" && !slug) {
      const payload = await readBody(req);
      const { blog, error } = validateBlog(payload);
      if (error) {
        sendJson(res, 400, { error });
        return;
      }
      if (blogs.some((item) => item.slug === blog.slug)) {
        sendJson(res, 409, { error: "A blog with this slug already exists" });
        return;
      }
      const nextBlogs = [blog, ...blogs];
      await writeBlogs(nextBlogs);
      sendJson(res, 201, blog);
      return;
    }

    if ((req.method === "PUT" || req.method === "PATCH") && slug) {
      const index = blogs.findIndex((item) => item.slug === slug);
      if (index === -1) {
        sendJson(res, 404, { error: "Blog not found" });
        return;
      }
      const payload = await readBody(req);
      const { blog, error } = validateBlog(payload, blogs[index]);
      if (error) {
        sendJson(res, 400, { error });
        return;
      }
      const duplicate = blogs.some((item, itemIndex) => itemIndex !== index && item.slug === blog.slug);
      if (duplicate) {
        sendJson(res, 409, { error: "A blog with this slug already exists" });
        return;
      }
      blogs[index] = blog;
      await writeBlogs(blogs);
      sendJson(res, 200, blog);
      return;
    }

    if (req.method === "DELETE" && slug) {
      const nextBlogs = blogs.filter((item) => item.slug !== slug);
      if (nextBlogs.length === blogs.length) {
        sendJson(res, 404, { error: "Blog not found" });
        return;
      }
      await writeBlogs(nextBlogs);
      sendJson(res, 200, { ok: true });
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Internal server error" });
  }
});

server.listen(PORT, () => {
  console.log(`Blog API running on http://localhost:${PORT}`);
});
