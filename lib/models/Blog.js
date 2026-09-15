import mongoose from "mongoose";

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

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
