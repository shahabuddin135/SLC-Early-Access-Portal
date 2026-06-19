"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PublicReview } from "@/lib/api";
import { reviewByKeyAction } from "@/app/actions/review";

// The archive keeper: mascot carrying the folder of stories.
const KEEPER =
  "https://res.cloudinary.com/didt1ywys/image/upload/v1781002981/carrying_file_nmcdwo.png";

// ── helpers ─────────────────────────────────────────────────────────────────
// github_id is entered freehand. Some users put a bare handle ("Syedailsa"),
// others a full URL ("https://github.com/shahabuddin135"). Normalise to a handle.
function ghHandle(r: PublicReview): string {
  let h = (r.github_id || "")
    .trim()
    .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
    .replace(/^@/, "")
    .replace(/\/+$/, "");
  if (!h || /[\s/:]/.test(h)) h = r.name || "builder";
  return h;
}

function fileName(r: PublicReview): string {
  const base = ghHandle(r)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `${base || "builder"}.slc`;
}

function shortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function fillRow(items: PublicReview[], min: number): PublicReview[] {
  if (items.length === 0) return [];
  const out: PublicReview[] = [];
  let i = 0;
  while (out.length < min) out.push(items[i++ % items.length]);
  return out;
}

// ── card ────────────────────────────────────────────────────────────────────
function ReviewCard({ r }: { r: PublicReview }) {
  return (
    <article className="rev-card">
      <header className="rev-bar">
        <span className="rev-dots" aria-hidden>
          <i style={{ background: "#FF5F56" }} />
          <i style={{ background: "#FFBD2E" }} />
          <i style={{ background: "#27C93F" }} />
        </span>
        <span className="rev-file">{fileName(r)}</span>
      </header>
      <div className="rev-body">
        <p className="rev-text">{r.review_text}</p>
      </div>
      <footer className="rev-foot">
        <span className="rev-author">{r.name}</span>
        <span className="rev-meta">
          <span className="rev-handle">@{ghHandle(r)}</span>
          {r.project_link && (
            <>
              {" · "}
              <a className="rev-link" href={r.project_link} target="_blank" rel="noopener noreferrer">
                project ↗
              </a>
            </>
          )}
          {shortDate(r.submitted_at) && <span className="rev-date">{shortDate(r.submitted_at)}</span>}
        </span>
      </footer>
    </article>
  );
}

// ── add-review modal ─────────────────────────────────────────────────────────
function AddReviewModal({ onClose }: { onClose: () => void }) {
  const [key, setKey] = useState("");
  const [project, setProject] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "ok">("idle");
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  async function submit() {
    setError(null);
    if (!key.trim()) return setError("Enter your download key.");
    if (!/^https?:\/\/.+\..+/.test(project.trim()))
      return setError("Enter a valid project link (https://…).");
    if (text.trim().length < 10) return setError("Your review needs at least 10 characters.");

    setStatus("submitting");
    const res = await reviewByKeyAction({
      key_value: key.trim(),
      project_link: project.trim(),
      review_text: text.trim(),
    });
    if (res.ok) {
      setName(res.name);
      setStatus("ok");
    } else {
      setError(res.error);
      setStatus("idle");
    }
  }

  return (
    <div className="rvm-overlay" onClick={onClose}>
      <div className="rvm-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="rvm-close" onClick={onClose} aria-label="Close">×</button>

        {status === "ok" ? (
          <div className="rvm-done">
            <p className="rvm-done-file">{name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.slc</p>
            <p className="rvm-done-title">Filed. Thank you, {name}.</p>
            <p className="rvm-done-text">
              Your review is recorded against your key and will appear in the archive as we open up
              post-launch stories.
            </p>
            <button className="rvm-submit" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <p className="rvm-eyebrow">Add your review</p>
            <p className="rvm-lead">
              Your download key proves you actually used SLC. Your name is pulled from it, so no
              login is needed.
            </p>

            <label className="rvm-label">Download key</label>
            <input
              className="rvm-input rvm-mono"
              placeholder="XXXX-XXXX-XXXX-XXXX"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              autoFocus
            />

            <label className="rvm-label">Project link</label>
            <input
              className="rvm-input"
              placeholder="https://github.com/you/your-slc-project"
              value={project}
              onChange={(e) => setProject(e.target.value)}
            />

            <label className="rvm-label">Your review</label>
            <textarea
              className="rvm-input rvm-textarea"
              placeholder="What did building with SLC actually feel like?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              maxLength={2000}
            />

            {error && <p className="rvm-error">{error}</p>}

            <button className="rvm-submit" onClick={submit} disabled={status === "submitting"}>
              {status === "submitting" ? "Filing…" : "File in archive"}
            </button>
          </>
        )}
      </div>

      <style>{`
        .rvm-overlay { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px; background: rgba(5,5,5,0.78); backdrop-filter: blur(6px); animation: rvm-fade 0.2s ease; }
        .rvm-card { position: relative; width: 100%; max-width: 460px; background: #0C0C0C; border: 1px solid #262626; padding: clamp(28px, 4vw, 40px); box-shadow: 0 30px 80px rgba(0,0,0,0.6); animation: rvm-rise 0.28s cubic-bezier(0.2,0.8,0.2,1); }
        .rvm-close { position: absolute; top: 14px; right: 16px; background: none; border: none; color: #666; font-size: 1.5rem; line-height: 1; cursor: pointer; padding: 4px; }
        .rvm-close:hover { color: #ccc; }
        .rvm-eyebrow { font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: #FF4500; margin: 0 0 12px; }
        .rvm-lead { font-family: var(--font-display); font-weight: 300; font-size: 0.92rem; line-height: 1.55; color: #9A9690; margin: 0 0 22px; }
        .rvm-label { display: block; font-family: var(--font-mono); font-size: 0.64rem; letter-spacing: 0.14em; text-transform: uppercase; color: #6E6B66; margin: 0 0 7px; }
        .rvm-input { width: 100%; background: #141414; border: 1px solid #2A2A2A; color: #F0EEE9; padding: 11px 13px; font-family: var(--font-display); font-size: 0.92rem; margin-bottom: 16px; transition: border-color 0.15s; }
        .rvm-input:focus { outline: none; border-color: #FF4500; }
        .rvm-input::placeholder { color: #514E4A; }
        .rvm-mono { font-family: var(--font-mono); letter-spacing: 0.08em; }
        .rvm-textarea { resize: vertical; min-height: 96px; line-height: 1.5; }
        .rvm-error { font-family: var(--font-display); font-size: 0.82rem; color: #FF6B4A; margin: 0 0 14px; }
        .rvm-submit { width: 100%; background: #FF4500; color: #fff; border: none; padding: 13px; font-family: var(--font-sans); font-weight: 700; font-size: 0.82rem; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: opacity 0.15s; }
        .rvm-submit:hover:not(:disabled) { opacity: 0.9; }
        .rvm-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .rvm-done { text-align: center; }
        .rvm-done-file { font-family: var(--font-mono); font-size: 0.72rem; color: #FF7A45; margin: 0 0 14px; }
        .rvm-done-title { font-family: var(--font-display); font-weight: 200; font-size: 1.5rem; letter-spacing: -0.02em; color: #F0EEE9; margin: 0 0 12px; }
        .rvm-done-text { font-family: var(--font-display); font-weight: 300; font-size: 0.9rem; line-height: 1.6; color: #8A8782; margin: 0 0 24px; }
        @keyframes rvm-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rvm-rise { from { opacity: 0; transform: translateY(14px) scale(0.98); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

// ── section ─────────────────────────────────────────────────────────────────
export default function ReviewsSection({ reviews }: { reviews: PublicReview[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const hasReviews = reviews.length > 0;
  const twoRows = reviews.length >= 4;

  const rowA = fillRow(reviews, 7);
  const rowB = fillRow([...reviews].reverse(), 7);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".rev-reveal",
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const renderTrack = (items: PublicReview[], reverse = false) => (
    <div className="rev-row">
      <div className={`rev-track ${reverse ? "rev-track-rev" : ""}`}>
        {items.map((r, i) => <ReviewCard key={`a-${r.id}-${i}`} r={r} />)}
        {items.map((r, i) => <ReviewCard key={`b-${r.id}-${i}`} r={r} />)}
      </div>
    </div>
  );

  const addButton = (
    <button className="rev-add" onClick={() => setModalOpen(true)}>
      <span className="rev-add-plus" aria-hidden>+</span>
      Add your review
    </button>
  );

  return (
    <section
      id="archive"
      ref={sectionRef}
      style={{
        background: "#F0EEE9",
        padding: "clamp(96px, 12vw, 140px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Heading (padded) */}
      <div className="rev-head" style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(16px, 4vw, 48px)" }}>
        <div style={{ minWidth: 0 }}>
          <p
            className="rev-reveal"
            style={{
              opacity: 0,
              fontFamily: "var(--font-mono)", fontSize: "0.8rem",
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "#FF4500", marginBottom: "20px",
            }}
          >
            Builder Archive
          </p>
          <h2
            className="rev-reveal"
            style={{
              opacity: 0,
              fontFamily: "var(--font-display)", fontWeight: 200,
              fontSize: "clamp(2.1rem, 4.6vw, 3.6rem)", letterSpacing: "-0.04em",
              color: "#0A0A0A", lineHeight: 1.04, margin: "0 0 20px",
            }}
          >
            Every SLC session{" "}
            <span style={{ color: "#FF4500" }}>leaves a record.</span>
          </h2>
          <p
            className="rev-reveal"
            style={{
              opacity: 0,
              fontFamily: "var(--font-display)", fontWeight: 300,
              fontSize: "clamp(1rem, 1.5vw, 1.22rem)", color: "#5A5A5A",
              lineHeight: 1.62, margin: "0 0 22px", maxWidth: "34em",
            }}
          >
            Not star ratings. Actual stories. Every builder who shipped with SLC files a{" "}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.9em", color: "#0A0A0A" }}>.slc</span>{" "}
            record. These are theirs, in their own words.
          </p>
          <div className="rev-reveal" style={{ opacity: 0 }}>{addButton}</div>
        </div>

        {/* Keeper mascot */}
        <div className="rev-keeper rev-reveal" style={{ opacity: 0 }} aria-hidden>
          <span className="rev-keeper-glow" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={KEEPER} alt="" loading="lazy" className="rev-keeper-img" />
        </div>
      </div>

      {/* Flow / empty state */}
      {hasReviews ? (
        <div className="rev-reveal rev-flow" style={{ opacity: 0 }}>
          {renderTrack(rowA)}
          {twoRows && renderTrack(rowB, true)}
          <div className="rev-fade rev-fade-l" aria-hidden />
          <div className="rev-fade rev-fade-r" aria-hidden />
        </div>
      ) : (
        <div className="rev-reveal rev-empty" style={{ opacity: 0 }}>
          <p className="rev-empty-file">archive/empty.slc</p>
          <p className="rev-empty-title">The archive is open.</p>
          <p className="rev-empty-text">
            Every SLC build leaves a story behind, and no one has filed theirs yet. Ship something
            with SLC and yours could be the first record in the archive.
          </p>
          <div style={{ marginTop: "28px", display: "flex", justifyContent: "center" }}>{addButton}</div>
        </div>
      )}

      {modalOpen && createPortal(<AddReviewModal onClose={() => setModalOpen(false)} />, document.body)}

      <style>{`
        .rev-head {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: clamp(24px, 4vw, 56px);
        }
        .rev-keeper { position: relative; display: flex; align-items: center; justify-content: center; }
        .rev-keeper-glow {
          position: absolute; inset: -10%;
          background: radial-gradient(circle, rgba(255,120,40,0.28) 0%, rgba(255,120,40,0) 66%);
          filter: blur(14px);
        }
        .rev-keeper-img {
          position: relative; z-index: 1;
          width: clamp(140px, 16vw, 220px); height: auto; object-fit: contain;
          filter: drop-shadow(0 22px 38px rgba(180,80,20,0.24));
        }

        /* ── Ghost add-review button ── */
        .rev-add {
          display: inline-flex; align-items: center; gap: 9px;
          background: transparent; color: #0A0A0A;
          border: 1px solid rgba(11,11,11,0.22);
          padding: 9px 18px; cursor: pointer;
          font-family: var(--font-mono); font-size: 0.72rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          transition: border-color 0.18s, background 0.18s, color 0.18s;
        }
        .rev-add:hover { border-color: #FF4500; color: #FF4500; background: rgba(255,69,0,0.05); }
        .rev-add-plus { font-size: 1rem; line-height: 1; color: #FF4500; }

        /* ── Flow ── */
        .rev-flow { position: relative; margin-top: clamp(48px, 6vw, 72px); display: flex; flex-direction: column; gap: clamp(16px, 1.6vw, 20px); }
        .rev-row { overflow: hidden; }
        .rev-track { display: flex; width: max-content; gap: clamp(16px, 1.6vw, 20px); padding: 0 clamp(16px, 4vw, 48px); animation: rev-flow 60s linear infinite; }
        .rev-track-rev { animation-direction: reverse; }
        .rev-row:hover .rev-track { animation-play-state: paused; }
        @keyframes rev-flow { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .rev-fade { position: absolute; top: 0; bottom: 0; width: clamp(32px, 7vw, 110px); pointer-events: none; z-index: 2; }
        .rev-fade-l { left: 0;  background: linear-gradient(to right, #F0EEE9, transparent); }
        .rev-fade-r { right: 0; background: linear-gradient(to left,  #F0EEE9, transparent); }

        /* ── Card (a spec file) ── */
        .rev-card {
          flex: 0 0 auto;
          width: clamp(280px, 80vw, 360px);
          background: #0C0C0C;
          border: 1px solid #232323;
          display: flex; flex-direction: column;
          box-shadow: 0 18px 40px rgba(20,12,6,0.14);
        }
        .rev-bar {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 16px; border-bottom: 1px solid #1C1C1C; background: #0A0A0A;
        }
        .rev-dots { display: inline-flex; gap: 6px; flex: none; }
        .rev-dots i { width: 9px; height: 9px; border-radius: 50%; display: block; opacity: 0.85; }
        .rev-file { font-family: var(--font-mono); font-size: 0.74rem; color: #FF7A45; letter-spacing: 0.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .rev-body { padding: 22px 20px 16px; flex: 1; }
        .rev-text {
          font-family: var(--font-display); font-weight: 300;
          font-size: 0.98rem; line-height: 1.6; color: #DAD7D0; margin: 0;
          display: -webkit-box; -webkit-line-clamp: 6; -webkit-box-orient: vertical; overflow: hidden;
        }
        .rev-foot { padding: 14px 20px 18px; border-top: 1px solid #1A1A1A; }
        .rev-author { font-family: var(--font-display); font-weight: 600; font-size: 0.92rem; color: #F0EEE9; display: block; margin-bottom: 3px; }
        .rev-meta { font-family: var(--font-mono); font-size: 0.68rem; color: #6E6B66; display: block; }
        .rev-handle { color: #8A8782; }
        .rev-link { color: #FF7A45; text-decoration: none; }
        .rev-link:hover { text-decoration: underline; }
        .rev-date { display: block; margin-top: 4px; color: #565451; }

        /* ── Empty state ── */
        .rev-empty {
          max-width: 640px; margin: clamp(48px, 6vw, 72px) auto 0; padding: 0 clamp(16px, 4vw, 48px);
          text-align: center;
        }
        .rev-empty-file { font-family: var(--font-mono); font-size: 0.74rem; color: #B09A86; letter-spacing: 0.06em; margin-bottom: 16px; }
        .rev-empty-title { font-family: var(--font-display); font-weight: 200; font-size: clamp(1.6rem, 3.4vw, 2.4rem); letter-spacing: -0.03em; color: #0A0A0A; margin: 0 0 14px; }
        .rev-empty-text { font-family: var(--font-display); font-weight: 300; font-size: clamp(0.95rem, 1.4vw, 1.1rem); color: #6A6A6A; line-height: 1.62; margin: 0; }

        @media (max-width: 760px) {
          .rev-head { grid-template-columns: 1fr; }
          /* Peeking mascot on mobile */
          .rev-keeper { position: absolute; top: clamp(18px, 5vw, 32px); right: -8px; opacity: 0.5; }
          .rev-keeper-img { width: clamp(96px, 30vw, 140px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .rev-track { animation: none; }
          .rev-row { overflow-x: auto; }
        }
      `}</style>
    </section>
  );
}
