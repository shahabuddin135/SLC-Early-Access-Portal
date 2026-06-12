"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SparklesText } from "@/components/ui/sparkles-text";

export default function LandingFooter() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-content",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: ".footer-content", start: "top 88%" },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      style={{
        background: "#0B0B0B",
        borderTop: "1px solid #1C1C1C",
        padding: "80px 0 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="footer-content"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 clamp(16px, 4vw, 48px)",
          opacity: 0,
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "80px",
            flexWrap: "wrap",
            gap: "48px",
          }}
        >
          {/* Brand */}
          <div style={{ maxWidth: "420px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  color: "#FF4500",
                  textTransform: "uppercase",
                }}
              >
                SLC
              </span>
              <span style={{ width: "1px", height: "14px", background: "#333" }} />
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8rem",
                    color: "#B8B5AE",
                  letterSpacing: "0.05em",
                }}
              >
                WeWise Labs
              </span>
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#C8C4BC",
                lineHeight: 1.65,
              }}
            >
              A spec language for cognition. A methodology for LLM-guided
              development — invented to stop AI drift before it starts.
            </p>
            <p
              style={{
                fontSize: "0.78rem",
                color: "#555",
                lineHeight: 1.6,
                marginTop: "16px",
              }}
            >
              Invented by{" "}
              <span style={{ color: "#777" }}>Shahabuddin</span>.{" "}
              Reviews &amp; testing by the WeWise Labs team.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: "60px", flexWrap: "wrap" }}>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#444",
                  marginBottom: "20px",
                }}
              >
                Portal
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { label: "Register", href: "/register" },
                  { label: "Sign in", href: "/login" },
                  { label: "Dashboard", href: "/dashboard" },
                ].map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.875rem",
                      color: "#D6D1C8",
                      textDecoration: "none",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#444",
                  marginBottom: "20px",
                }}
              >
                Learn
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { label: "Framework", href: "#framework" },
                  { label: "Token Optimization", href: "#tokens" },
                  { label: "The Protocol", href: "#protocol" },
                ].map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.875rem",
                      color: "#D6D1C8",
                      textDecoration: "none",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* People — creator + WeWise Labs */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#444",
                  marginBottom: "20px",
                }}
              >
                People
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <a
                  href="https://e-commerce-api-henna-alpha.vercel.app/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.875rem",
                    color: "#FF4500",
                    textDecoration: "none",
                    letterSpacing: "0.01em",
                  }}
                >
                  The Creator ↗
                </a>
                <a
                  href="https://wewiselabs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.875rem",
                    color: "#D6D1C8",
                    textDecoration: "none",
                    letterSpacing: "0.01em",
                  }}
                >
                  WeWise Labs ↗
                </a>
                <Link
                  href="/testers"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#FF6B33",
                    textDecoration: "none",
                    letterSpacing: "0.01em",
                    display: "inline-flex",
                  }}
                >
                  <SparklesText text="Our Testers" sparklesCount={7} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "#1C1C1C", marginBottom: "36px" }} />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "#A79F92",
              letterSpacing: "0.08em",
            }}
          >
            (c) {new Date().getFullYear()} WeWise Labs. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "#A79F92",
              letterSpacing: "0.08em",
            }}
          >
            SLC | Early Access | Confidential
          </p>
        </div>
      </div>

      {/* Huge SLC reveal text — peeks out from the bottom */}
      <h2
        aria-hidden="true"
        style={{
          position: "relative",
          zIndex: 0,
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(7rem, 26vw, 22rem)",
          letterSpacing: "-0.06em",
          lineHeight: 0.85,
          color: "#FF4500",
          opacity: 0.06,
          userSelect: "none",
          pointerEvents: "none",
          margin: 0,
          paddingLeft: "clamp(16px, 4vw, 48px)",
          transform: "translateY(28%)",
        }}
      >
        SLC
      </h2>
    </footer>
  );
}
