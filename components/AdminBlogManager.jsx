"use client";

import { useCallback, useEffect, useState } from "react";

const EMPTY_FORM = { slug: "", date: "", tags: "", readTime: "1 min", title: "", excerpt: "", bodyMd: "" };

export default function AdminBlogManager() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingSlug, setEditingSlug] = useState(null);
    const [message, setMessage] = useState("");
    const [saving, setSaving] = useState(false);

    const loadPosts = useCallback(async () => {
        try {
            const res = await fetch("/api/blogs");
            const data = await res.json();
            setPosts(Array.isArray(data) ? data : []);
        } catch {
            setMessage("Failed to load posts.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch, setState only runs after the awaited response
        void loadPosts();
    }, [loadPosts]);

    const resetForm = () => {
        setEditingSlug(null);
        setForm(EMPTY_FORM);
    };

    const selectPost = (post) => {
        setEditingSlug(post.slug);
        setForm({
            slug: post.slug || "",
            date: post.date || "",
            tags: (post.tags || []).join(", "),
            readTime: post.readTime || "1 min",
            title: post.title || "",
            excerpt: post.excerpt || "",
            bodyMd: post.bodyMd || "",
        });
        setMessage("");
    };

    const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");
        try {
            const url = editingSlug ? `/api/blogs/${editingSlug}` : "/api/blogs";
            const method = editingSlug ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setMessage(data.error || "Save failed.");
                return;
            }
            setMessage(editingSlug ? "Post updated." : "Post created.");
            resetForm();
            loadPosts();
        } catch {
            setMessage("Save failed.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (slug) => {
        if (!window.confirm(`Delete post "${slug}"?`)) return;
        setMessage("");
        try {
            const res = await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setMessage(data.error || "Delete failed.");
                return;
            }
            if (editingSlug === slug) resetForm();
            loadPosts();
        } catch {
            setMessage("Delete failed.");
        }
    };

    return (
        <main>
            <section style={{ paddingTop: 150 }}>
                <div className="wrap" style={{ maxWidth: 920 }}>
                    <div className="eyebrow">./admin/dev-jassi</div>
                    <h2>Blog Admin</h2>
                    <p className="section-intro">Create, edit, or delete blog posts.</p>

                    {message && <div className="blog-state">{message}</div>}

                    <div className="admin-grid">
                        <form className="admin-form" onSubmit={handleSubmit}>
                            <label className="admin-field">
                                <span>Title</span>
                                <input
                                    className="admin-input"
                                    value={form.title}
                                    onChange={handleChange("title")}
                                    required
                                />
                            </label>
                            <label className="admin-field">
                                <span>Slug (optional — derived from title if blank)</span>
                                <input
                                    className="admin-input"
                                    value={form.slug}
                                    onChange={handleChange("slug")}
                                    placeholder="my-post-slug"
                                />
                            </label>
                            <div className="admin-field-row">
                                <label className="admin-field">
                                    <span>Date</span>
                                    <input
                                        type="date"
                                        className="admin-input"
                                        value={form.date}
                                        onChange={handleChange("date")}
                                    />
                                </label>
                                <label className="admin-field">
                                    <span>Read time</span>
                                    <input
                                        className="admin-input"
                                        value={form.readTime}
                                        onChange={handleChange("readTime")}
                                        placeholder="4 min"
                                    />
                                </label>
                            </div>
                            <label className="admin-field">
                                <span>Tags (comma separated)</span>
                                <input
                                    className="admin-input"
                                    value={form.tags}
                                    onChange={handleChange("tags")}
                                    placeholder="Go, Agentic AI"
                                />
                            </label>
                            <label className="admin-field">
                                <span>Excerpt</span>
                                <input
                                    className="admin-input"
                                    value={form.excerpt}
                                    onChange={handleChange("excerpt")}
                                />
                            </label>
                            <label className="admin-field">
                                <span>Body (Markdown)</span>
                                <textarea
                                    className="admin-input admin-textarea"
                                    value={form.bodyMd}
                                    onChange={handleChange("bodyMd")}
                                    rows={14}
                                    required
                                />
                            </label>
                            <div className="admin-actions">
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? "Saving..." : editingSlug ? "$ update post" : "$ create post"}
                                </button>
                                {editingSlug && (
                                    <button type="button" className="btn btn-ghost" onClick={resetForm}>
                                        cancel edit
                                    </button>
                                )}
                            </div>
                        </form>

                        <div className="admin-list">
                            {loading && <div className="blog-state">loading posts...</div>}
                            {!loading && posts.length === 0 && (
                                <div className="blog-state">no posts yet</div>
                            )}
                            {posts.map((p) => (
                                <div className="admin-list-item" key={p.slug}>
                                    <div>
                                        <div className="post-title">{p.title}</div>
                                        <div className="post-meta">
                                            <span>{p.slug}</span><span>·</span><span>{p.date}</span>
                                        </div>
                                    </div>
                                    <div className="admin-list-actions">
                                        <button type="button" className="btn btn-ghost" onClick={() => selectPost(p)}>
                                            edit
                                        </button>
                                        <button type="button" className="btn btn-ghost" onClick={() => handleDelete(p.slug)}>
                                            delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
