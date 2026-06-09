"use client";

import React from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

// ── Hack / vague file cards ─────────────────────────────────────────────────
const HACK_CARDS: {
  name: string;
  badge: string;
  badgeColor: string;
  lines: string[];
}[] = [
  {
    name: "CONTEXT_v3_FINAL.md",
    badge: "VAGUE",
    badgeColor: "#D97706",
    lines: [
      "# About the Project",
      "",
      "- does the auth thing",
      "- TODO: write more later",
      "- ask jake what stack we chose",
      "- idk how deploy works lol",
    ],
  },
  {
    name: "gpt_context_dump.txt",
    badge: "HACK",
    badgeColor: "#DC2626",
    lines: [
      "paste all of this into chatgpt",
      "",
      "project: auth + crud + stuff",
      "please don't break the database",
      "// AI deleted everything last time",
      "use claude maybe its smarter",
    ],
  },
  {
    name: "notes_DONT_DELETE.md",
    badge: "STALE",
    badgeColor: "#6B7280",
    lines: [
      "## !! IMPORTANT !!",
      "",
      "ask team what arch decision was",
      "why did we choose redis??",
      "is postgres still the main db?",
      "→ no one remembers",
    ],
  },
  {
    name: "SETUP_again_v7.md",
    badge: "BROKEN",
    badgeColor: "#DC2626",
    lines: [
      "# Setup Guide (v7)",
      "",
      "see SETUP_v6 for previous steps",
      "still broken on Windows 11",
      "TODO: someone fix this pls",
      "works on my machine though",
    ],
  },
  {
    name: "hack_auth_bypass.ts",
    badge: "DO NOT SHIP",
    badgeColor: "#DC2626",
    lines: [
      "// temp fix DO NOT COMMIT",
      "// will refactor next sprint",
      "",
      "const auth = true // bypass",
      "// TODO: fix before launch",
      "// been here 6 months...",
    ],
  },
  {
    name: "TODO_important.md",
    badge: "IGNORED",
    badgeColor: "#6B7280",
    lines: [
      "- [ ] write actual spec",
      "- [ ] stop changing arch",
      "- [ ] fix AI context problem",
      "- [ ] AI keeps forgetting context",
      "- [ ] 3rd week same bug",
      "- [ ] just use SLC already",
    ],
  },
];

// ── SLC solution card ───────────────────────────────────────────────────────
const SLC_LINES: { text: string; color: string }[] = [
  { text: "@block INDEX root_index", color: "#FF4500" },
  { text: "  priority: critical", color: "#7EB8D4" },
  { text: '  intent: "Single source of truth"', color: "#9FCA7E" },
  { text: "  failure_if_skipped: true", color: "#7EB8D4" },
  { text: "", color: "transparent" },
  { text: "  read_order:", color: "#7EB8D4" },
  { text: "    - CONTEXT.md", color: "#9FCA7E" },
  { text: "    - SECURITY.md", color: "#9FCA7E" },
  { text: "    - ARCH.md", color: "#9FCA7E" },
  { text: "    - tasks/task_index.md", color: "#9FCA7E" },
  { text: "@end", color: "#FF4500" },
];

// ── Position offsets from flex-centered position ────────────────────────────
// top/left shift the inner card div relative to where flex centering places it
const POSITIONS: { top: string; left: string; w: string; h: string }[] = [
  { top: "-18vh", left: "-32vw", w: "22vw", h: "26vh" }, // upper-left
  { top: "0",     left: "-38vw", w: "20vw", h: "26vh" }, // far left
  { top: "-20vh", left: "28vw",  w: "22vw", h: "26vh" }, // upper-right
  { top: "22vh",  left: "-28vw", w: "22vw", h: "22vh" }, // lower-left
  { top: "20vh",  left: "26vw",  w: "20vw", h: "22vh" }, // lower-right
  { top: "-28vh", left: "4vw",   w: "20vw", h: "20vh" }, // top-center
];

// ── Component ───────────────────────────────────────────────────────────────
export default function HeroZoom() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // Individual scale transforms — no loops (Rules of Hooks)
  // All scales set to 1 to remove zoom/bobbing animations
  const s0 = useTransform(scrollYProgress, [0, 1], [1, 1]); // SLC center
  const s1 = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const s2 = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const s3 = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const s4 = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const s5 = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const s6 = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const scales = [s0, s1, s2, s3, s4, s5, s6];

  // Hack cards: fade out by 55% scroll
  const hackOpacity = useTransform(scrollYProgress, [0.05, 0.55], [0.85, 0]);
  // Bottom title + CTA: fade out quickly
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.2], [0, 16]);

  return (
    <div
      ref={container}
      style={{ position: "relative", height: "300vh", background: "#0A0A0A" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100svh",
          overflow: "hidden",
        }}
      >
        {/* Hairline nav separator */}
        <div
          style={{
            position: "absolute",
            top: "68px",
            left: "clamp(16px,4vw,48px)",
            right: "clamp(16px,4vw,48px)",
            height: "1px",
            background: "#1A1A1A",
            zIndex: 30,
            pointerEvents: "none",
          }}
        />

        {/* Top corner labels */}
        <div
          style={{
            position: "absolute",
            top: "clamp(20px,2.8vh,28px)",
            left: "clamp(16px,4vw,48px)",
            right: "clamp(16px,4vw,48px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 30,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
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
              fontSize: "0.6rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#2A2A2A",
            }}
          >
            WeWise Labs · Early Access
          </span>
        </div>

        {/* Bottom title + CTA — fades out on first scroll */}
        <motion.div
          style={{
            opacity: titleOpacity,
            y: titleY,
            position: "absolute",
            bottom: "clamp(28px,4.5vh,52px)",
            left: "clamp(16px,4vw,48px)",
            right: "clamp(16px,4vw,48px)",
            zIndex: 30,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 200,
                fontSize: "clamp(1.5rem,3.8vw,3.2rem)",
                color: "#F0EEE9",
                letterSpacing: "-0.04em",
                lineHeight: 0.96,
                margin: "0 0 18px",
              }}
            >
              Every context dump.<br />
              Every{" "}
              <span style={{ color: "#FF4500" }}>&ldquo;fix later&rdquo;</span>{" "}
              comment.<br />
              Every .md that helped no one.
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.56rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#333",
                margin: 0,
              }}
            >
              Scroll to watch them disappear →
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
              flexShrink: 0,
            }}
          >
            <Link
              href="/register"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "0.82rem",
                letterSpacing: "0.07em",
                color: "#0A0A0A",
                background: "#FF4500",
                padding: "11px 26px",
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
                fontWeight: 400,
                fontSize: "0.82rem",
                letterSpacing: "0.06em",
                color: "#444",
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              See how it works →
            </a>
          </div>
        </motion.div>

        {/* ── SLC center card — the focal solution ───────────────────────── */}
        <motion.div
          style={{
            scale: scales[0],
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "25vw",
              height: "25vh",
              background: "#060606",
              border: "1px solid rgba(255,69,0,0.28)",
              boxShadow:
                "0 0 60px rgba(255,69,0,0.08), 0 4px 24px rgba(0,0,0,0.7)",
              overflow: "hidden",
              borderRadius: "2px",
            }}
          >
            {/* Card header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                borderBottom: "1px solid #141414",
                background: "#070707",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#FF4500",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.45rem",
                  color: "#9B958B",
                  letterSpacing: "0.1em",
                  flex: 1,
                }}
              >
                spec / SPEC.slc
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.36rem",
                  color: "#FF4500",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  border: "1px solid rgba(255,69,0,0.3)",
                  padding: "2px 5px",
                  flexShrink: 0,
                }}
              >
                ACTIVE
              </span>
            </div>
            {/* Code */}
            <div style={{ padding: "9px 12px" }}>
              {SLC_LINES.map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.43rem",
                    lineHeight: 1.7,
                    color: line.color,
                    whiteSpace: "pre",
                    minHeight: line.text === "" ? "0.7em" : undefined,
                  }}
                >
                  {line.text || "\u00A0"}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Hack file cards — scatter + fade ───────────────────────────── */}
        {HACK_CARDS.map((card, i) => (
          <motion.div
            key={card.name}
            style={{
              scale: scales[i + 1],
              opacity: hackOpacity,
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 8,
            }}
          >
            <div
              style={{
                position: "relative",
                width: POSITIONS[i].w,
                height: POSITIONS[i].h,
                top: POSITIONS[i].top,
                left: POSITIONS[i].left,
                background: "#0C0C0C",
                border: "1px solid #1C1C1C",
                overflow: "hidden",
                borderRadius: "2px",
              }}
            >
              {/* Card header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "6px 10px",
                  borderBottom: "1px solid #181818",
                  background: "#0A0A0A",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#242424",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.42rem",
                    color: "#3A3A3A",
                    letterSpacing: "0.07em",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {card.name}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.33rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    border: `1px solid ${card.badgeColor}44`,
                    color: card.badgeColor,
                    padding: "1px 4px",
                    flexShrink: 0,
                  }}
                >
                  {card.badge}
                </span>
              </div>
              {/* Content */}
              <div style={{ padding: "8px 10px" }}>
                {card.lines.map((line, j) => (
                  <div
                    key={j}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.39rem",
                      lineHeight: 1.8,
                      whiteSpace: "pre",
                      minHeight: line === "" ? "0.75em" : undefined,
                      color:
                        line.startsWith("#")
                          ? "#484848"
                          : line.startsWith("//")
                          ? "#323232"
                          : line.startsWith("-")
                          ? "#404040"
                          : line === ""
                          ? "transparent"
                          : "#3C3C3C",
                    }}
                  >
                    {line || "\u00A0"}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
