"use client";

import FolderInteraction from "@/components/folder";

export default function FolderSection() {
  return (
    <section
      style={{
        background: "#0A0A0A",
        padding: "120px clamp(16px, 4vw, 48px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "32px",
        borderTop: "1px solid #1A1A1A",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Label */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#FF4500",
        }}
      >
        The Files
      </p>

      {/* Headline */}
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 200,
          fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
          color: "#F0EEE9",
          textAlign: "center",
          margin: 0,
          maxWidth: "640px",
        }}
      >
        Two spec files.{" "}
        <span style={{ color: "#FF4500" }}>Every AI starts here.</span>
      </h2>

      <p
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 300,
          fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)",
          color: "rgba(255,255,255,0.38)",
          letterSpacing: "-0.01em",
          lineHeight: 1.7,
          textAlign: "center",
          maxWidth: "500px",
          margin: 0,
        }}
      >
        <span style={{ color: "rgba(240,238,233,0.75)" }}>SLC.md</span> holds the syntax
        rules — the machine-readable grammar every agent understands.{" "}
        <span style={{ color: "rgba(240,238,233,0.75)" }}>
          SLC universal structure.md
        </span>{" "}
        is the universal framework your project maps to. Drop both in your root.
        The third file is your personal getting-started guide — read it once,
        never re-explain your setup again.
      </p>

      {/* Folder interaction */}
      <div style={{ marginTop: "8px" }}>
        <FolderInteraction />
      </div>

      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.18)",
          marginTop: "8px",
        }}
      >
        Click the folder to open
      </p>
    </section>
  );
}
