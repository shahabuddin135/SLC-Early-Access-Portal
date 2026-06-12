"use client";

import Link from "next/link";
import { SparklesText } from "@/components/ui/sparkles-text";

const TESTERS = [
  {
    name: "Ilsa Ubaid",
    role: "Agentic AI Developer",
    linkedin: "https://www.linkedin.com/in/ilsa-ubaid-agentic-ai-developer",
    note:
      "Thank you, Ilsa. You believed in SLC before there was much to believe in — and you showed up for it like it already mattered. We're so grateful for your time, your sharp eye, and your faith in where this is going. It means more than you know.",
  },
  {
    name: "Darakhshan Imran",
    role: "Early Tester & Reviewer",
    linkedin: "https://www.linkedin.com/in/darakhshan-imran-5b9727297/",
    note:
      "Thank you, Darakhshan. You gave SLC both your patience and your honesty, exactly when it needed them most. Every bit of feedback you shared made this better. We're genuinely lucky to have had you with us — thank you for caring.",
  },
  {
    name: "Abeera Umair",
    role: "Early Tester & Reviewer",
    linkedin: "https://www.linkedin.com/in/abeera-u-4377a8296/",
    note:
      "Thank you, Abeera. Your curiosity and care left a real mark on SLC — and on us. Thank you for showing up, for the thoughtful notes, and for making early access feel a little warmer and a lot more human. We appreciate you so much.",
  },
];

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

export default function TestersPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(120% 90% at 50% 0%, rgba(255,69,0,0.14) 0%, transparent 55%), #0A0A0A",
        color: "#F0EEE9",
        padding: "clamp(40px, 7vw, 88px) clamp(16px, 5vw, 48px) 96px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Back link */}
      <Link href="/" className="testers-back" style={{ position: "relative", zIndex: 2 }}>
        &larr; Back to home
      </Link>

      {/* Header */}
      <header style={{ maxWidth: "780px", margin: "clamp(36px, 6vw, 72px) auto clamp(48px, 8vw, 96px)", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#FF6B33",
            marginBottom: "22px",
          }}
        >
          [SLC] &middot; With Gratitude
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 200,
            fontSize: "clamp(2.6rem, 7vw, 5.4rem)",
            letterSpacing: "-0.045em",
            lineHeight: 1.02,
            color: "#F7F2EA",
            margin: "0 0 24px",
          }}
        >
          Hall of <span style={{ color: "#FF4500" }}>Recognition.</span>
        </h1>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(1rem, 1.7vw, 1.2rem)",
            lineHeight: 1.7,
            color: "rgba(240,238,233,0.6)",
            margin: 0,
          }}
        >
          SLC exists because a few generous builders tested it before anyone else — breaking it,
          questioning it, and making it better with every session. These three shaped the framework
          with their time and their honesty. From all of us: thank you.
        </p>
      </header>

      {/* Testers */}
      <div style={{ maxWidth: "880px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(64px, 10vw, 128px)" }}>
        {TESTERS.map((t, i) => (
          <section key={t.name} style={{ textAlign: "center", position: "relative" }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.66rem",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "rgba(255,107,51,0.85)",
                marginBottom: "clamp(18px, 2.5vw, 28px)",
              }}
            >
              {String(i + 1).padStart(2, "0")} &middot; {t.role}
            </p>

            <SparklesText
              text={t.name}
              className="testers-name"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(2.4rem, 8.5vw, 6rem)",
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                color: "#F7F2EA",
              }}
            />

            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(1rem, 1.6vw, 1.18rem)",
                lineHeight: 1.75,
                color: "rgba(240,238,233,0.66)",
                maxWidth: "620px",
                margin: "clamp(26px, 4vw, 40px) auto clamp(24px, 3vw, 32px)",
              }}
            >
              {t.note}
            </p>

            <a
              href={t.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="testers-link"
            >
              <LinkedInIcon />
              <span>Connect on LinkedIn</span>
              <span aria-hidden>&#8599;</span>
            </a>
          </section>
        ))}
      </div>

      {/* Sign-off */}
      <footer style={{ maxWidth: "880px", margin: "clamp(80px, 12vw, 140px) auto 0", textAlign: "center" }}>
        <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", marginBottom: "32px" }} />
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(1.05rem, 1.8vw, 1.35rem)",
            color: "rgba(240,238,233,0.8)",
            margin: "0 0 6px",
          }}
        >
          Built with the people who believed early.
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "0.85rem",
            letterSpacing: "0.06em",
            color: "#FF6B33",
            margin: "0 0 28px",
          }}
        >
          &mdash; The SLC Team &middot; WeWise Labs
        </p>
        <Link href="/" className="testers-back">
          &larr; Back to home
        </Link>
      </footer>

      <style>{`
        .testers-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(240,238,233,0.55);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .testers-back:hover { color: #FF6B33; }

        .testers-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.82rem;
          letter-spacing: 0.04em;
          color: #F0EEE9;
          background: rgba(255,69,0,0.10);
          border: 1px solid rgba(255,107,51,0.40);
          padding: 12px 24px;
          border-radius: 999px;
          text-decoration: none;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }
        .testers-link:hover {
          background: rgba(255,69,0,0.18);
          border-color: #FF6B33;
          transform: translateY(-2px);
        }
      `}</style>
    </main>
  );
}
