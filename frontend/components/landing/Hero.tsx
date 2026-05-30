"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ShaderAnimation } from "@/components/shader-lines";

const MARQUEE_TEXT =
  "SLC  ·  SPEC LANGUAGE FOR COGNITION  ·  MEMORY OVERRIDES CREATIVITY  ·  SPECS BEFORE CODE  ·  NOT A SYNTAX, A PROTOCOL  ·  WEWISE LABS  ·  EARLY ACCESS 2026  ·  ";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = heroRef.current?.querySelectorAll<HTMLElement>(".h-line");
      if (lines) {
        gsap.fromTo(
          lines,
          { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.08, delay: 0.05 }
      );
      }
      gsap.fromTo(".hero-meta", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.1 });
      gsap.fromTo(".hero-footer", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.35 });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      style={{
        background: "#0A0A0A",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        padding: "0 clamp(16px, 4vw, 48px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, opacity: 0.1 }}>
        <ShaderAnimation />
      </div>
      <div
        className="hero-meta"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          paddingTop: "80px",
          opacity: 0,
          position: "relative",
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#FF4500" }}>
          [SLC]
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#666" }}>
          WeWise Labs · Early Access
        </span>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: "60px", paddingBottom: "40px", position: "relative" }}>
        {["The language", "machines", "think in."].map((word, i) => (
          <div key={i} style={{ overflow: "hidden", lineHeight: 0.92 }}>
            <h1
              className="h-line"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 200,
                fontSize: "clamp(4.5rem, 12.5vw, 13rem)",
                color: i === 2 ? "#FF4500" : "#F0EEE9",
                letterSpacing: "-0.045em",
                lineHeight: 0.92,
                margin: 0,
                opacity: 0,
                display: "block",
                paddingBottom: "0.06em",
              }}
            >
              {word}
            </h1>
          </div>
        ))}

        <div style={{ overflow: "hidden", marginTop: "40px" }}>
          <p
            className="h-line"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "clamp(1.2rem, 2.2vw, 1.5rem)",
              color: "#bbb",
              letterSpacing: "-0.01em",
              margin: 0,
              opacity: 0,
              maxWidth: "560px",
              lineHeight: 1.55,
            }}
          >
            A protocol that gives every AI session structured, deterministic memory — write the spec once and every model runs with full context, without drift.
          </p>
        </div>
      </div>

      <div
        className="hero-footer"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "14px", flexWrap: "wrap", paddingBottom: "clamp(90px, 12vh, 110px)", opacity: 0, position: "relative" }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#666" }}>
          Scroll to explore
        </span>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <Link
            href="/register"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "0.85rem",
              letterSpacing: "0.06em",
              color: "#0A0A0A",
              background: "#FF4500",
              padding: "12px 28px",
              textDecoration: "none",
              textTransform: "uppercase",
              display: "inline-block",
            }}
          >
            Request access
          </Link>
          <a
            href="#syntax"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: "0.85rem",
              letterSpacing: "0.06em",
              color: "#B8B5AE",
              textDecoration: "none",
              textTransform: "uppercase",
              padding: "12px 0",
            }}
          >
            See how it works →
          </a>
        </div>
      </div>

      <div style={{ position: "absolute", top: "68px", left: "clamp(16px, 4vw, 48px)", right: "clamp(16px, 4vw, 48px)", height: "1px", background: "#1A1A1A" }} />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: "1px solid #1A1A1A",
          background: "#0A0A0A",
          padding: "22px 0",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ display: "inline-flex", animation: "marquee 32s linear infinite" }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontWeight: 200,
            fontSize: "clamp(0.9rem, 1.8vw, 1.25rem)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#C8C4BC",
          }}>
            {MARQUEE_TEXT}{MARQUEE_TEXT}{MARQUEE_TEXT}{MARQUEE_TEXT}
          </span>
        </div>
      </div>

      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </section>
  );
}
