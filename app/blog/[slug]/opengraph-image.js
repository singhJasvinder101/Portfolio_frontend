import { ImageResponse } from "next/og";
import { getBlogBySlugSafe } from "@/lib/blogs";
import { SITE_NAME } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug } = await params;
  const { post } = await getBlogBySlugSafe(slug);
  const title = post?.title || "Post not found";
  const tags = post?.tags?.join(" · ") || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0a0c",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", color: "#4fd1c5", fontSize: 26 }}>
          cat {slug}.md
        </div>
        <div
          style={{
            display: "flex",
            color: "#dde3e8",
            fontSize: 56,
            fontWeight: 700,
            marginTop: 28,
            lineHeight: 1.25,
          }}
        >
          {title}
        </div>
        {tags && (
          <div style={{ display: "flex", color: "#e8b339", fontSize: 28, marginTop: 32 }}>
            {tags}
          </div>
        )}
        <div style={{ display: "flex", color: "#545d69", fontSize: 24, marginTop: "auto" }}>
          {SITE_NAME}
        </div>
      </div>
    ),
    { ...size },
  );
}
