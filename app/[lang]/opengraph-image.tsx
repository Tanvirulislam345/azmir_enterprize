import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded social preview built from theme colours; Latin text only so no extra font is needed. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#252A2D",
          color: "#F7F5F0",
        }}
      >
        <div style={{ width: 96, height: 8, background: "#E87932", marginBottom: 40 }} />
        <div style={{ fontSize: 76, fontWeight: 800 }}>{siteConfig.name}</div>
        <div style={{ fontSize: 36, color: "#F2B17A", marginTop: 20 }}>Construction material supplier · Bangladesh</div>
      </div>
    ),
    size,
  );
}
