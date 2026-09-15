import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Blog from "@/lib/models/Blog";
import { formatBlog, validateBlog } from "@/lib/blogs";

export async function GET() {
  try {
    await connectDb();
    const blogs = await Blog.find().sort({ date: -1, createdAt: -1 }).lean();
    return NextResponse.json(blogs.map(formatBlog));
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDb();
    const payload = await request.json();
    const { blog, error } = validateBlog(payload);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const createdBlog = await Blog.create(blog);
    return NextResponse.json(formatBlog(createdBlog), { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "A blog with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
