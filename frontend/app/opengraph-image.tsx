import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SLC Early Access — WeWise Labs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          background: "#0A0A0A",
          padding: "64px 72px",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* Grid lines for depth */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(249,115,22,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)",
          }}
        />

        {/* WeWise Labs badge */}
        <div
          style={{
            position: "absolute",
            top: 52,
            right: 72,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(249,115,22,0.12)",
            border: "1px solid rgba(249,115,22,0.35)",
            borderRadius: 4,
            padding: "6px 14px",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#F97316",
            }}
          />
          <span style={{ color: "#F97316", fontSize: 18, letterSpacing: 2 }}>
            WEWISE LABS
          </span>
        </div>

        {/* SLC label */}
        <div
          style={{
            display: "flex",
            marginBottom: 20,
            color: "#F97316",
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          SLC Language &amp; Framework
        </div>

        {/* Main headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 32,
          }}
        >
          <span
            style={{
              color: "#FFFFFF",
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1,
            }}
          >
            Early Access
          </span>
          <span
            style={{
              color: "#FFFFFF",
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1,
            }}
          >
            Portal
          </span>
        </div>

        {/* Sub-line */}
        <div
          style={{
            display: "flex",
            color: "#6B7280",
            fontSize: 24,
            lineHeight: 1.5,
            maxWidth: 680,
          }}
        >
          Register, download, and build with the SLC framework before public
          release.
        </div>

        {/* Bottom rule */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              "linear-gradient(90deg, #F97316 0%, rgba(249,115,22,0.2) 60%, transparent 100%)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
