"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function LandingNav() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      navRef.current,
      { y: -16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.6 }
    );

    ScrollTrigger.create({
      start: "top -60",
      onUpdate: (self) => setScrolled(self.scroll() > 60),
    });
  }, []);

  const dark = !scrolled;

  return (
    <nav
      ref={navRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        padding: "18px clamp(14px, 4vw, 48px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        flexWrap: "wrap",
        background: scrolled ? "rgba(10,10,10,0.94)" : "transparent",
        borderBottom: scrolled ? "1px solid #1A1A1A" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        transition: "background 0.4s, border-color 0.4s",
        opacity: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "#FF4500",
            textTransform: "uppercase",
          }}
        >
          [SLC]
        </span>
        <span style={{ width: "1px", height: "14px", background: "#2A2A2A" }} />
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.72rem",
            color: dark ? "#C8C4BC" : "#B8B5AE",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          WeWise Labs
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
        <a
          href="#syntax"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem",
            color: dark ? "#DDD9D1" : "#D2CDC3",
            textDecoration: "none",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Syntax
        </a>
        <a
          href="#framework"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem",
            color: dark ? "#DDD9D1" : "#D2CDC3",
            textDecoration: "none",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Framework
        </a>
        <Link
          href="/login"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem",
            color: dark ? "#DDD9D1" : "#D2CDC3",
            textDecoration: "none",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Sign in
        </Link>
        <Link
          href="/register"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#0A0A0A",
            background: "#FF4500",
            padding: "10px 18px",
            textDecoration: "none",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Get Access
        </Link>
      </div>
    </nav>
  );
}
