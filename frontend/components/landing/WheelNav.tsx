"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { motion } from "framer-motion";

const CIRCLE_TEXT = "NAV  ·  CIRCLE  ·  NAV  ·  CIRCLE  ·  NAV  ·  CIRCLE  ·  NAV  ·  CIRCLE  ·  ";

// ── Nav data ─────────────────────────────────────────────────────────────────
const LINKS = [
  { label: "Syntax",    href: "#syntax",    num: "01" },
  { label: "Framework", href: "#framework", num: "02" },
  { label: "Protocol",  href: "#protocol",  num: "03" },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function WheelNav() {
  const [visible, setVisible]       = useState(false);
  const [open, setOpen]             = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [btnPos, setBtnPos]         = useState<{ left: number; top: number } | null>(null);

  const btnWrapRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);
  const linksRef   = useRef<HTMLDivElement>(null);
  const dragRef    = useRef<{
    active: boolean;
    startX: number; startY: number;
    startLeft: number; startTop: number;
  } | null>(null);
  // Tracks whether the last interaction was a drag so onClick can ignore it
  const wasDragRef = useRef(false);

  // ── GSAP entrance ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!btnWrapRef.current) return;
    gsap.fromTo(
      btnWrapRef.current,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.7)", delay: 0.9 }
    );
  }, []);

  // ── Open sidebar ───────────────────────────────────────────────────────────
  const openNav = () => { setVisible(true); setOpen(true); };

  // ── Close sidebar ────────────────────────────────────────────────────────────────────────
  const closeNav = async () => {
    if (!panelRef.current) { setOpen(false); setVisible(false); return; }
    const { default: anime } = await import("animejs/lib/anime.es.js" as string);
    anime({
      targets: panelRef.current,
      translateX: ["0%", "100%"],
      duration: 380,
      easing: "easeInCubic",
      complete: () => { setOpen(false); setVisible(false); },
    });
  };

  // ── Sidebar open animation ─────────────────────────────────────────────────
  useEffect(() => {
    if (!open || !visible) return;

    const run = async () => {
      const { default: anime } = await import("animejs/lib/anime.es.js" as string);

      // Panel slides in from right
      if (panelRef.current) {
        anime({
          targets: panelRef.current,
          translateX: ["100%", "0%"],
          duration: 600,
          easing: "easeOutExpo",
        });
      }

      // Nav items stagger up + fade in
      if (linksRef.current) {
        const items = linksRef.current.querySelectorAll<HTMLElement>(".nav-item");
        anime({
          targets: items,
          translateY: [56, 0],
          opacity:    [0, 1],
          duration:   720,
          delay:      anime.stagger(75, { start: 220 }),
          easing:     "easeOutExpo",
        });
      }
    };

    run();
  }, [open, visible]);

  // ── Escape key ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && open) closeNav(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = btnWrapRef.current!.getBoundingClientRect();
    dragRef.current = {
      active: false,
      startX: e.clientX, startY: e.clientY,
      startLeft: rect.left, startTop: rect.top,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    // Do NOT call preventDefault here — iOS treats it as a long-press intent
    // and delays pointerup. touchAction:"none" already prevents scroll.
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (!dragRef.current.active && Math.hypot(dx, dy) < 10) return;
    dragRef.current.active = true;
    wasDragRef.current = true;  // mark as drag so onClick won't open nav
    setIsDragging(true);
    const W = 86, H = 86;
    setBtnPos({
      left: Math.max(0, Math.min(window.innerWidth  - W, dragRef.current.startLeft + dx)),
      top:  Math.max(0, Math.min(window.innerHeight - H, dragRef.current.startTop  + dy)),
    });
  }, []);

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
    setIsDragging(false);
    // openNav is handled by onClick — more reliable for mobile single-tap
  }, []);

  // onClick fires correctly after a simple tap on all mobile browsers,
  // even without press-and-hold. Skip if the gesture was a drag.
  const handleClick = useCallback(() => {
    if (wasDragRef.current) { wasDragRef.current = false; return; }
    openNav();
  }, []);

  const posStyle: React.CSSProperties = btnPos
    ? { left: `${btnPos.left}px`, top: `${btnPos.top}px`, right: "auto" }
    : { top: "clamp(14px, 2.2vh, 22px)", right: "clamp(16px, 3vw, 36px)" };

  return (
    <>
      {/* ── Circle nav button — draggable, inverse-blend, double ring ─────── */}
      <div
        ref={btnWrapRef}
        role="button"
        tabIndex={0}
        aria-label="Open navigation"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={handleClick}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => e.key === "Enter" && openNav()}
        style={{
          position: "fixed",
          ...posStyle,
          zIndex: 300,
          width: "86px",
          height: "86px",
          opacity: 0,           /* GSAP animates in */
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none" as React.CSSProperties["WebkitTouchCallout"],
          background: "#FF4500",
          borderRadius: "50%",
        }}
      >
        {/* Layer 1 — SVG with mix-blend-mode:difference
            Solid white disc inverts whatever bg is behind the button.
            Double ring + spinning circular text ride on top. */}
        <svg
          viewBox="0 0 86 86"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
          {/* Spinning circular text — no borders, mix-blend-mode:difference adapts to any bg */}
          <defs>
            <path id="nctp" d="M 43,43 m -38.5,0 a 38.5,38.5 0 1,1 77,0 a 38.5,38.5 0 1,1 -77,0" />
          </defs>
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "30px 30px" }}
          >
            <text
              fill="rgba(255,255,255,1)"
              fontSize="5.8"
              letterSpacing="3"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <textPath href="#nctp">{CIRCLE_TEXT}</textPath>
            </text>
          </motion.g>
        </svg>

        {/* Layer 2 — orange NAV label, no blend, always readable */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.5rem",
              letterSpacing: "0.28em",
              color: "#FFFFFF",
              textTransform: "uppercase",
              fontWeight: 600,
              userSelect: "none",
              paddingLeft: "0.28em",
            }}
          >
            NAV
          </span>
        </div>
      </div>

      {/* ── Sidebar + backdrop ───────────────────────────────────────────── */}
      {visible && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400 }}>
          {/* Blurred backdrop */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(3,3,3,0.72)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
            onClick={closeNav}
          />

          {/* Panel */}
          <div
            ref={panelRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "min(500px, 100vw)",
              background: "#070707",
              borderLeft: "1px solid #161616",
              display: "flex",
              flexDirection: "column",
              padding: "clamp(28px,4.5vh,60px) clamp(32px,5vw,60px)",
              transform: "translateX(100%)", // anime.js slides this to 0%
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "clamp(44px, 8vh, 80px)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  color: "#FF4500",
                  textTransform: "uppercase",
                }}
              >
                [SLC]
              </span>
              <button
                onClick={closeNav}
                aria-label="Close navigation"
                style={{
                  background: "none",
                  border: "1px solid #222",
                  cursor: "pointer",
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#555",
                  transition: "color 0.2s, border-color 0.2s",
                  padding: 0,
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.color = "#ccc";
                  el.style.borderColor = "#555";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.color = "#555";
                  el.style.borderColor = "#222";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <line x1="2" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="12" y1="2" x2="2" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <div ref={linksRef} style={{ flex: 1 }}>
              {LINKS.map(({ label, href, num }) => (
                <div
                  key={label}
                  className="nav-item"
                  style={{
                    opacity: 0,
                    borderBottom: "1px solid #111",
                  }}
                >
                  <a
                    href={href}
                    onClick={closeNav}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "clamp(12px,2.4vh,20px) 0",
                      textDecoration: "none",
                      fontFamily: "var(--font-display)",
                      fontWeight: 100,
                      fontSize: "clamp(2.8rem, 6vw, 6.5rem)",
                      color: "#D8D4CC",
                      letterSpacing: "-0.045em",
                      lineHeight: 1,
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = "#FF4500";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = "#D8D4CC";
                    }}
                  >
                    <span>{label}</span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.55rem",
                        letterSpacing: "0.22em",
                        color: "#272727",
                        alignSelf: "flex-start",
                        paddingTop: "0.65em",
                      }}
                    >
                      {num}
                    </span>
                  </a>
                </div>
              ))}

              {/* Auth links */}
              <div
                className="nav-item"
                style={{
                  opacity: 0,
                  marginTop: "clamp(28px,5vh,48px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <Link
                  href="/login"
                  onClick={closeNav}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 100,
                    fontSize: "clamp(1.6rem, 3.2vw, 3rem)",
                    color: "#363636",
                    textDecoration: "none",
                    letterSpacing: "-0.035em",
                    lineHeight: 1,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#888";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#363636";
                  }}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={closeNav}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    letterSpacing: "0.08em",
                    color: "#0A0A0A",
                    background: "#FF4500",
                    padding: "12px 28px",
                    textDecoration: "none",
                    textTransform: "uppercase",
                    display: "inline-block",
                    marginTop: "4px",
                  }}
                >
                  Request access →
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div
              className="nav-item"
              style={{
                opacity: 0,
                borderTop: "1px solid #0F0F0F",
                paddingTop: "20px",
                marginTop: "24px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.54rem",
                  letterSpacing: "0.15em",
                  color: "#222",
                  textTransform: "uppercase",
                }}
              >
                WeWise Labs · Early Access 2026
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
