import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_ROLE, SITE_COMPANY } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(255,255,255,0.06) 2px, transparent 0)",
          backgroundSize: "50px 50px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", color: "#4fd1c5", fontSize: 28, marginBottom: 24 }}>
          $ go run whoami.go
        </div>
        <div style={{ display: "flex", color: "#dde3e8", fontSize: 72, fontWeight: 700 }}>
          {SITE_NAME}
        </div>
        <div style={{ display: "flex", color: "#e8b339", fontSize: 36, marginTop: 20 }}>
          {SITE_ROLE} @ {SITE_COMPANY}
        </div>
      </div>
    ),
    { ...size },
  );
}
