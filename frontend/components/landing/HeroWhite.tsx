"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { LayoutGroup, motion, AnimatePresence } from "motion/react";
import { ShaderAnimation } from "@/components/shader-lines";
import TextRotate from "@/components/fancy/text/text-rotate";

const MARQUEE_TEXT =
  "SLC  \u00b7  SPEC LANGUAGE FOR COGNITION  \u00b7  TOKEN-EFFICIENT  \u00b7  SPEC-NATIVE  \u00b7  ZERO DRIFT  \u00b7  AI-NATIVE  \u00b7  WEWISE LABS  \u00b7  EARLY ACCESS 2026  \u00b7  ";

const ROTATING_WORDS = [
  "token-efficient.",
  "cost-reducing.",
  "AI-native.",
  "drift-proof.",
  "agent-ready.",
  "precision.",
  "inevitable.",
  "effortless.",
  "structured.",
  "memory-anchored.",
];

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

export default function HeroWhite() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const article = VOWELS.has(ROTATING_WORDS[currentIndex][0].toLowerCase()) ? "An" : "A";

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".hero-topbar",      { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.6  }, 0.15);
      tl.fromTo(".hero-tag",         { opacity: 0, y: 16  }, { opacity: 1, y: 0, duration: 0.6  }, 0.4 );
      tl.fromTo(".hero-headline",    { opacity: 0, y: 40  }, { opacity: 1, y: 0, duration: 0.9  }, 0.55);
      tl.fromTo(".hero-sub",         { opacity: 0, y: 22  }, { opacity: 1, y: 0, duration: 0.7  }, 0.9 );
      tl.fromTo(".hero-cta",         { opacity: 0, y: 18  }, { opacity: 1, y: 0, duration: 0.65, stagger: 0.12 }, 1.1 );
      tl.fromTo(".hero-scroll-hint", { opacity: 0 },         { opacity: 1, duration: 0.5        }, 1.45);
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={heroRef}
      style={{
        position: "relative",
        minHeight: "110svh",
        overflow: "hidden",
        background: "#0A0A0A",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Shader bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          opacity: 0.09,
          filter: "blur(80px) saturate(1.6)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <ShaderAnimation />
      </div>

      {/* Hairline */}
      <div
        style={{
          position: "absolute",
          top: "72px",
          left: "clamp(16px, 4vw, 48px)",
          right: "clamp(16px, 4vw, 48px)",
          height: "1px",
          background: "rgba(255,255,255,0.06)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Content column */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "0 clamp(16px, 4vw, 48px)",
        }}
      >
        {/* Topbar */}
        <div
          className="hero-topbar"
          style={{
            opacity: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "52px",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#FF4500",
            }}
          >
            [SLC]
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.28)",
            }}
          >
            WeWise Labs &middot; Early Access
          </span>
        </div>

        {/* Centre — flex:1 vertically centres content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: "48px",
            paddingBottom: "48px",
          }}
        >
          {/* Tag badge */}
          <div className="hero-tag" style={{ opacity: 0, marginBottom: "32px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.28)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "5px 14px",
                display: "inline-block",
              }}
            >
              The world&apos;s first spec-native language
            </span>
          </div>

          {/* Rotating headline */}
          <div className="hero-headline" style={{ opacity: 0 }}>
            <LayoutGroup>
              <motion.p
                layout
                className="flex flex-wrap items-baseline"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 200,
                  fontSize: "clamp(3.5rem, 7.5vw, 8.5rem)",
                  letterSpacing: "-0.045em",
                  lineHeight: 1.0,
                  color: "#F0EEE9",
                  gap: "0.28em",
                  margin: 0,
                }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={article}
                    layout
                    initial={{ opacity: 0, y: "30%" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: "-30%" }}
                    transition={{ type: "spring", damping: 28, stiffness: 380 }}
                    style={{ display: "inline-block" }}
                  >
                    {article}
                  </motion.span>
                </AnimatePresence>
                <TextRotate
                  texts={ROTATING_WORDS}
                  mainClassName="bg-[#FF4500] text-white px-[0.18em] pb-[0.05em] overflow-hidden"
                  staggerFrom="last"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.018}
                  splitLevelClassName="pb-[0.06em]"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  layoutTransition={{ type: "spring", damping: 16, stiffness: 180 }}
                  rotationInterval={2500}
                  onIndexChange={setCurrentIndex}
                />
                <motion.span
                  layout
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                >
                  language &amp; framework.
                </motion.span>
              </motion.p>
            </LayoutGroup>
          </div>

          {/* Subtitle */}
          <p
            className="hero-sub"
            style={{
              opacity: 0,
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)",
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "-0.01em",
              marginTop: "36px",
              maxWidth: "560px",
              lineHeight: 1.6,
            }}
          >
            SLC is the world&apos;s first token-efficient, spec-native language for cognition.
            Two files. Every AI session reads them first. No re-explaining. No drift. No wasted context.
          </p>
        </div>

        {/* Footer row — CTAs */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "14px",
            flexWrap: "wrap",
            paddingBottom: "36px",
          }}
        >
          <span
            className="hero-scroll-hint"
            style={{
              opacity: 0,
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            Scroll to explore
          </span>

          <div
            style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}
          >
            <Link
              href="/register"
              className="hero-cta"
              style={{
                opacity: 0,
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "0.85rem",
                letterSpacing: "0.06em",
                color: "#F7F5F0",
                background: "#FF4500",
                padding: "13px 30px",
                textDecoration: "none",
                textTransform: "uppercase",
                display: "inline-block",
              }}
            >
              Request access
            </Link>
            <a
              href="#tokens"
              className="hero-cta"
              style={{
                opacity: 0,
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: "0.85rem",
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.4)",
                textDecoration: "none",
                textTransform: "uppercase",
                padding: "13px 0",
              }}
            >
              See how it works &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Marquee — in normal flex flow at the bottom */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(10,10,10,0.9)",
          backdropFilter: "blur(8px)",
          padding: "22px 0",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            animation: "marquee-light 32s linear infinite",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 200,
              fontSize: "clamp(0.9rem, 1.8vw, 1.25rem)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.18)",
            }}
          >
            {MARQUEE_TEXT}
            {MARQUEE_TEXT}
            {MARQUEE_TEXT}
            {MARQUEE_TEXT}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes marquee-light {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
