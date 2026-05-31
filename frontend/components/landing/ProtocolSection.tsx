"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShaderAnimation } from "@/components/shader-lines";

const MANIFESTO = ["Spec first.", "Code second.", "Memory anchored.", "No drift.", "That’s SLC."];

export default function ProtocolSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".manifesto-line",
        { opacity: 0, yPercent: 80 },
        {
          opacity: 1, yPercent: 0, duration: 0.75, ease: "power3.out", stagger: 0.07,
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", once: true },
        }
      );
      gsap.fromTo(
        ".verdict-ctas",
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.55, delay: 0.4,
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="protocol"
      ref={sectionRef}
      style={{
        background: "#0A0A0A",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "120px clamp(16px, 4vw, 48px)",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid #1A1A1A",
      }}
    >
      {/* Animated shader background */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.14, pointerEvents: "none", zIndex: 0 }}>
        <ShaderAnimation />
      </div>
      {/* Content wrapper above shader */}
      <div style={{ position: "relative", zIndex: 1 }}>
      {/* Ghost label */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#B8B5AE",
          marginBottom: "60px",
        }}
      >
        The Verdict
      </p>

      {/* Headline stacked */}
      <div style={{ marginBottom: "72px", maxWidth: "1000px" }}>
        {MANIFESTO.map((line, i) => (
          <div key={i} style={{ overflow: "hidden" }}>
            <h2
              className="manifesto-line"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(3.5rem, 10vw, 10.5rem)",
                letterSpacing: "-0.045em",
                lineHeight: 0.92,
                color: i >= 3 ? "#FF4500" : "#F0EEE9",
                margin: 0,
                display: "block",
                opacity: 0,
                paddingBottom: "0.06em",
              }}
            >
              {line}
            </h2>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div
        className="verdict-ctas"
        style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap", opacity: 0 }}
      >
        <Link
          href="/register"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "0.85rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#0A0A0A",
            background: "#FF4500",
            padding: "16px 40px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Request Access
        </Link>
        <Link
          href="/login"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "0.85rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#F0EEE9",
            border: "1px solid #2A2A2A",
            padding: "16px 40px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Sign in
        </Link>
      </div>
      </div>{/* end content wrapper */}

      {/* Bottom right decoration */}
      <div
        style={{
          position: "absolute",
          bottom: "22px",
          right: "clamp(16px, 4vw, 48px)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#B8B5AE",
        }}
      >
        WeWise Labs | {new Date().getFullYear()}
      </div>
    </section>
  );
}
