const API_BASE = "/api/blogs";

export async function fetchBlogs() {
  const response = await fetch(API_BASE);
  if (!response.ok) throw new Error("Unable to load blog posts");
  return response.json();
}

export async function fetchBlog(slug) {
  const response = await fetch(`${API_BASE}/${slug}`);
  if (!response.ok) throw new Error("Unable to load blog post");
  return response.json();
}

export async function createBlog(payload) {
  return sendBlogRequest(API_BASE, "POST", payload);
}

export async function updateBlog(slug, payload) {
  return sendBlogRequest(`${API_BASE}/${slug}`, "PUT", payload);
}

export async function deleteBlog(slug) {
  const response = await fetch(`${API_BASE}/${slug}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Unable to delete blog post");
  return response.json();
}

async function sendBlogRequest(url, method, payload) {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Unable to save blog post");
  }
  return response.json();
}
