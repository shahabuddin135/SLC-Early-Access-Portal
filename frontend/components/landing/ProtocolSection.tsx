"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShaderAnimation } from "@/components/shader-lines";

const MANIFESTO = ["Spec first.", "Code second.", "Memory anchored.", "No drift.", "That’s SLC."];

// Celebration mascot — the closing CTA illustration.
const ILLUSTRATION =
  "https://res.cloudinary.com/didt1ywys/image/upload/v1781002983/happy_jump_djg2ti.png";

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
      gsap.fromTo(
        ".verdict-art",
        { opacity: 0, x: 48, scale: 0.92 },
        {
          opacity: 1, x: 0, scale: 1, duration: 0.9, ease: "power3.out", delay: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
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

      {/* Content — text left, big mascot right */}
      <div className="verdict-grid" style={{ position: "relative", zIndex: 1 }}>
        {/* ── Copy ── */}
        <div className="verdict-copy" style={{ minWidth: 0 }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#B8B5AE",
              marginBottom: "clamp(28px, 4vw, 48px)",
            }}
          >
            The Verdict
          </p>

          <div style={{ marginBottom: "clamp(36px, 5vw, 56px)" }}>
            {MANIFESTO.map((line, i) => (
              <div key={i} style={{ overflow: "hidden" }}>
                <h2
                  className="manifesto-line"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "clamp(2.6rem, 6vw, 5.6rem)",
                    letterSpacing: "-0.045em",
                    lineHeight: 0.94,
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
        </div>

        {/* ── Big mascot ── */}
        <div className="verdict-art" style={{ position: "relative", minWidth: 0, opacity: 0 }}>
          <span className="verdict-glow" aria-hidden />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ILLUSTRATION}
            alt=""
            aria-hidden
            loading="lazy"
            className="verdict-mascot"
          />
        </div>
      </div>

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
          zIndex: 1,
        }}
      >
        WeWise Labs | {new Date().getFullYear()}
      </div>

      <style>{`
        .verdict-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
          align-items: center;
          gap: clamp(24px, 5vw, 72px);
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
        }
        .verdict-art {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .verdict-glow {
          position: absolute;
          inset: -8%;
          background: radial-gradient(circle, rgba(255,80,20,0.34) 0%, rgba(255,80,20,0) 66%);
          filter: blur(14px);
          z-index: 0;
        }
        .verdict-mascot {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: clamp(280px, 40vw, 480px);
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 28px 50px rgba(255,69,0,0.32));
        }
        @media (max-width: 900px) {
          .verdict-grid {
            grid-template-columns: 1fr;
            gap: clamp(16px, 6vw, 36px);
            text-align: left;
          }
          .verdict-mascot { max-width: min(64vw, 340px); }
        }
      `}</style>
    </section>
  );
}
