"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { LayoutGroup, motion, AnimatePresence } from "motion/react";
import TextRotate from "@/components/fancy/text/text-rotate";

const ROTATING_WORDS = [
  "inevitable.",
  "token-efficient.",
  "cost-reducing.",
  "AI-native.",
  "drift-proof.",
  "agent-ready.",
  "precision.",
  "effortless.",
  "structured.",
  "memory-anchored.",
];

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

// Mascot carrying the code folder — the single hero illustration (all screens).
const ILLUSTRATION =
  "https://res.cloudinary.com/didt1ywys/image/upload/v1781002981/carrying_file_nmcdwo.png";

const INK = "#1C150F";

export default function HeroWhite() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const article = VOWELS.has(ROTATING_WORDS[currentIndex][0].toLowerCase()) ? "An" : "A";

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".hero-topbar",   { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.6 }, 0.15);
      tl.fromTo(".hero-art",      { opacity: 0, x: 40, scale: 0.94 }, { opacity: 1, x: 0, scale: 1, duration: 0.95 }, 0.3);
      tl.fromTo(".hero-tag",      { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0.45);
      tl.fromTo(".hero-headline", { opacity: 0, y: 38 }, { opacity: 1, y: 0, duration: 0.9 }, 0.55);
      tl.fromTo(".hero-sub",      { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.7 }, 0.9);
      tl.fromTo(".hero-cta",      { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.65, stagger: 0.12 }, 1.1);
      tl.fromTo(".hero-scroll-hint", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.45);
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={heroRef}
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
        background:
          "radial-gradient(130% 130% at 82% 34%, #F9D7B9 0%, #FBE5D2 40%, #FAEFE4 72%, #FBF3EB 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Warm glow pooling behind the mascot */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "14%",
          right: "4%",
          width: "min(46vw, 620px)",
          height: "min(46vw, 620px)",
          background:
            "radial-gradient(circle, rgba(255,120,40,0.30) 0%, rgba(255,120,40,0) 66%)",
          filter: "blur(10px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Hairline under the topbar */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "72px",
          left: "clamp(16px, 4vw, 48px)",
          right: "clamp(16px, 4vw, 48px)",
          height: "1px",
          background: "rgba(28,21,15,0.08)",
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
              fontSize: "clamp(0.56rem, 1.3vw, 0.68rem)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(28,21,15,0.4)",
              whiteSpace: "nowrap",
            }}
          >
            WeWise Labs &middot; Early Access
          </span>
        </div>

        {/* Split stage — fixed tracks + fixed row height so nothing reflows
            as the rotating word changes width */}
        <div className="hero-stage">
          {/* ── Left: copy ── */}
          <div style={{ minWidth: 0, position: "relative", zIndex: 1 }}>
            {/* Eyebrow */}
            <div className="hero-tag" style={{ opacity: 0, marginBottom: "clamp(18px, 2.6vw, 30px)" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(0.5rem, 1.2vw, 0.62rem)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(28,21,15,0.42)",
                  border: "1px solid rgba(28,21,15,0.14)",
                  padding: "5px 14px",
                  display: "inline-block",
                  whiteSpace: "nowrap",
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
                    fontWeight: 300,
                    fontSize: "clamp(1.9rem, 3.8vw, 4rem)",
                    letterSpacing: "-0.04em",
                    lineHeight: 1.06,
                    color: INK,
                    gap: "0.26em",
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
                    mainClassName="bg-[#FF4500] text-white px-[0.18em] pb-[0.06em] overflow-hidden"
                    staggerFrom="last"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.018}
                    splitLevelClassName="pb-[0.06em]"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    layoutTransition={{ type: "spring", damping: 16, stiffness: 180 }}
                    rotationInterval={2600}
                    onIndexChange={setCurrentIndex}
                  />
                  {/* Hard line break: the tagline always stays on its own line,
                      so the rotating word can never change the line count and
                      shift the rest of the hero. */}
                  <span aria-hidden style={{ flexBasis: "100%", width: 0, height: 0 }} />
                  <span style={{ display: "inline-block" }}>language &amp; framework.</span>
                </motion.p>
              </LayoutGroup>
            </div>

            {/* Subtitle */}
            <p
              className="hero-sub"
              style={{
                opacity: 0,
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(0.82rem, 1.5vw, 1.18rem)",
                color: "rgba(28,21,15,0.55)",
                letterSpacing: "-0.01em",
                marginTop: "clamp(20px, 2.6vw, 34px)",
                maxWidth: "30em",
                lineHeight: 1.62,
              }}
            >
              SLC is the world&apos;s first token-efficient, spec-native language for cognition.
              Two files. Every AI session reads them first. No re-explaining. No drift. No wasted context.
            </p>

            {/* CTAs */}
            <div
              style={{
                display: "flex",
                gap: "clamp(10px, 2vw, 22px)",
                alignItems: "center",
                marginTop: "clamp(24px, 3vw, 40px)",
              }}
            >
              <Link
                href="/register"
                className="hero-cta"
                style={{
                  opacity: 0,
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: "clamp(0.66rem, 1.3vw, 0.85rem)",
                  letterSpacing: "0.08em",
                  color: "#FFFFFF",
                  background: "#FF4500",
                  padding: "clamp(11px, 1.5vw, 15px) clamp(20px, 2.6vw, 34px)",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.7em",
                  whiteSpace: "nowrap",
                  boxShadow: "0 14px 30px rgba(255,69,0,0.28)",
                }}
              >
                Request access <span aria-hidden>&rarr;</span>
              </Link>
              <a
                href="#syntax"
                className="hero-cta"
                style={{
                  opacity: 0,
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  fontSize: "clamp(0.62rem, 1.2vw, 0.82rem)",
                  letterSpacing: "0.06em",
                  color: "rgba(28,21,15,0.5)",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                See how it works
              </a>
            </div>
          </div>

          {/* ── Right: mascot (wide screens only) ── */}
          <div className="hero-art hero-art-wide">
            {/* floating decorative bits */}
            <span aria-hidden className="hero-deco hero-deco-spark" style={{ top: "6%", left: "8%" }}>
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l1.6 7.2L21 11l-7.4 1.8L12 21l-1.6-8.2L3 11l7.4-1.8L12 2z" fill="#FF6B33" />
              </svg>
            </span>
            <span aria-hidden className="hero-deco hero-deco-plus" style={{ bottom: "16%", right: "9%" }}>
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
                <path d="M12 4v16M4 12h16" stroke="#FF6B33" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
            </span>
            <span aria-hidden className="hero-deco hero-deco-dot" style={{ top: "30%", left: "2%" }} />
            <span aria-hidden className="hero-deco hero-deco-cloud" style={{ bottom: "10%", right: "20%" }}>
              <svg width="100%" height="100%" viewBox="0 0 40 24" fill="none">
                <path
                  d="M11 22a8 8 0 0 1-.8-15.96A10 10 0 0 1 30 7.5 6.5 6.5 0 0 1 29.5 22H11z"
                  fill="#FBEFE4"
                  stroke="rgba(28,21,15,0.06)"
                />
              </svg>
            </span>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ILLUSTRATION}
              alt="SLC mascot carrying a code folder"
              className="hero-mascot"
              width={620}
              height={620}
            />
          </div>
        </div>

        {/* Bottom hint */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingBottom: "32px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <span
            className="hero-scroll-hint"
            style={{
              opacity: 0,
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(0.56rem, 1.1vw, 0.68rem)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(28,21,15,0.32)",
            }}
          >
            Scroll to explore &darr;
          </span>
        </div>
      </div>

      <style>{`
        .hero-stage {
          flex: 1;
          display: grid;
          grid-template-columns: minmax(0, 1.06fr) minmax(0, 0.94fr);
          grid-template-rows: 1fr;
          align-items: center;
          gap: clamp(12px, 3vw, 56px);
          padding-top: 40px;
          padding-bottom: 32px;
        }
        .hero-art {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
          height: 100%;
        }
        .hero-mascot {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: min(46vw, 600px);
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 26px 42px rgba(180,80,20,0.22));
        }
        .hero-deco { position: absolute; z-index: 2; pointer-events: none; }
        .hero-deco-spark { width: clamp(14px, 2.4vw, 26px); height: clamp(14px, 2.4vw, 26px); }
        .hero-deco-plus  { width: clamp(12px, 2vw, 20px);  height: clamp(12px, 2vw, 20px); }
        .hero-deco-cloud { width: clamp(26px, 5vw, 52px);  height: auto; }
        .hero-deco-dot   { width: clamp(7px, 1.1vw, 12px); height: clamp(7px, 1.1vw, 12px); border-radius: 50%; background: #FF6B33; }

        /* On narrow screens the split becomes a centred stack: copy, then the
           single mascot below it — so the composition fills the viewport
           instead of leaving a gap. */
        @media (max-width: 760px) {
          .hero-stage {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: clamp(22px, 5vw, 40px);
            padding-top: 24px;
            padding-bottom: 24px;
          }
          .hero-art-wide { width: 100%; height: auto; }
          .hero-mascot { max-width: min(72vw, 330px); }
          .hero-sub { max-width: 34em; }
        }
      `}</style>
    </div>
  );
}
