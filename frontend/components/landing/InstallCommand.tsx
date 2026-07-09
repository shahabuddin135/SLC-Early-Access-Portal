"use client";
import { useState } from "react";

// Click-to-copy install command, styled like a terminal pill. Sharp edges, mono,
// dark — reads well on both the cream hero and the dark sections.
export default function InstallCommand({
  command = "npx @wewise/slc",
  size = "lg",
}: {
  command?: string;
  size?: "lg" | "sm";
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked — no-op */
    }
  };
  const lg = size === "lg";
  return (
    <button
      onClick={copy}
      type="button"
      aria-label={`Copy install command: ${command}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        background: "#0A0A0A",
        border: "1px solid #2A2A2A",
        color: "#F0EEE9",
        fontFamily: "var(--font-mono)",
        fontSize: lg ? "clamp(0.8rem, 1.4vw, 0.95rem)" : "0.78rem",
        padding: lg ? "13px 16px" : "9px 13px",
        cursor: "pointer",
        whiteSpace: "nowrap",
        boxShadow: "0 14px 30px rgba(0,0,0,0.14)",
        transition: "border-color 0.18s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#FF4500")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2A2A2A")}
    >
      <span style={{ color: "#FF4500" }} aria-hidden>$</span>
      <span>{command}</span>
      <span
        style={{
          marginInlineStart: "4px",
          paddingInlineStart: "12px",
          borderInlineStart: "1px solid #2A2A2A",
          color: copied ? "#FF4500" : "#8A8A8A",
          fontSize: "0.72em",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {copied ? "copied ✓" : "copy"}
      </span>
    </button>
  );
}
