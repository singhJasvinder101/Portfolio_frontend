import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Blog from "@/lib/models/Blog";
import { formatBlog, validateBlog } from "@/lib/blogs";

export async function GET(request, { params }) {
  const { slug } = await params;
  try {
    await connectDb();
    const blog = await Blog.findOne({ slug }).lean();
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(formatBlog(blog));
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

async function updateBlog(request, { params }) {
  const { slug } = await params;
  try {
    await connectDb();
    const existing = await Blog.findOne({ slug }).lean();
    if (!existing) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const payload = await request.json();
    const { blog, error } = validateBlog(payload, existing);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const updatedBlog = await Blog.findOneAndUpdate({ slug }, blog, {
      new: true,
      runValidators: true,
    });
    return NextResponse.json(formatBlog(updatedBlog));
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "A blog with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export const PUT = updateBlog;
export const PATCH = updateBlog;

export async function DELETE(request, { params }) {
  const { slug } = await params;
  try {
    await connectDb();
    const deletedBlog = await Blog.findOneAndDelete({ slug });
    if (!deletedBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
