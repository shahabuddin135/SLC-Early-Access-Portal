"use client";

import { motion } from "motion/react";
import { useState } from "react";

const FILE_CARDS = [
  {
    label: "SLC.md",
    bg: "linear-gradient(160deg, #dbeafe 0%, #bfdbfe 55%, #93c5fd 100%)",
    text: "#1e40af",
    bar: "#3b82f6",
  },
  {
    label: "SLC universal structure.md",
    bg: "linear-gradient(160deg, #fefce8 0%, #fef9c3 55%, #fde68a 100%)",
    text: "#92400e",
    bar: "#f59e0b",
  },
  {
    label: "SLC getting started guide.md",
    bg: "linear-gradient(160deg, #fff1f2 0%, #fecdd3 55%, #fca5a5 100%)",
    text: "#991b1b",
    bar: "#ef4444",
  },
];

const Page = ({ colorIndex }: { colorIndex: number }) => {
  const c = FILE_CARDS[colorIndex] ?? FILE_CARDS[0];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: c.bg,
        borderRadius: "13px",
        padding: "8px 7px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.30), 0 1px 4px rgba(0,0,0,0.14)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "7.5px",
          fontWeight: 700,
          color: c.text,
          letterSpacing: "0.01em",
          lineHeight: 1.35,
          textAlign: "center",
          wordBreak: "break-word",
          margin: 0,
          width: "100%",
        }}
      >
        {c.label}
      </p>
      <div style={{ height: "1.5px", background: c.bar, borderRadius: "999px", width: "100%", opacity: 0.7 }} />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ display: "flex", gap: "3px", width: "100%" }}>
          <div style={{ flex: 1, height: "2.5px", background: c.bar, borderRadius: "999px", opacity: i % 2 === 0 ? 0.3 : 0.18 }} />
          <div style={{ flex: 0.55, height: "2.5px", background: c.bar, borderRadius: "999px", opacity: 0.12 }} />
        </div>
      ))}
    </div>
  );
};

// Folder back - simple rounded rectangle (no tab notch), matches reference image
const FolderBackSVG = () => (
  <svg
    viewBox="0 0 244 188"
    fill="none"
    className="w-full h-full block"
    style={{ overflow: "visible" }}
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="backGrad" x1="0" y1="0" x2="244" y2="188" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3e3a46" />
        <stop offset="35%" stopColor="#28232e" />
        <stop offset="100%" stopColor="#1c1820" />
      </linearGradient>
      <linearGradient id="backSheen" x1="0" y1="0" x2="0" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.055" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="244" height="188" rx="22" ry="22" fill="url(#backGrad)" />
    <rect x="0" y="0" width="244" height="90" rx="22" ry="22" fill="url(#backSheen)" />
  </svg>
);

const PAGES = [
  {
    closed: { rotate: -3.5, x: -38, y: 4 },
    open: { rotate: -14, x: -84, y: -78 },
    transition: { type: "spring" as const, duration: 0.58, bounce: 0.15, stiffness: 155, damping: 20 },
    zIndex: 4,
  },
  {
    closed: { rotate: 0, x: 0, y: 0 },
    open: { rotate: 2, x: 2, y: -90 },
    transition: { type: "spring" as const, duration: 0.53, bounce: 0.12, stiffness: 185, damping: 23 },
    zIndex: 5,
  },
  {
    closed: { rotate: 4, x: 42, y: 3 },
    open: { rotate: 14, x: 84, y: -78 },
    transition: { type: "spring" as const, duration: 0.56, bounce: 0.17, stiffness: 165, damping: 20 },
    zIndex: 4,
  },
];

export default function FolderInteraction() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full flex flex-col items-center gap-6 py-10 select-none">
      {/* Tooltip bubble */}
      <motion.div
        initial={{ y: 6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative flex flex-col items-center"
      >
        <div
          className="bg-[#1f1d22] text-white px-6 py-4 rounded-[18px] shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase" }}
        >
          SLC <span style={{ color: "#FF4500" }}>Spec Files</span>
        </div>
        {/* Tail */}
        <svg width="22" height="14" viewBox="0 0 22 14" className="-mt-0.5 block">
          <path d="M0 0 L22 0 L11 14 Z" fill="#1f1d22" />
        </svg>
      </motion.div>

      <div
        onClick={() => setIsOpen((v) => !v)}
        className="w-[280px] h-60 relative cursor-pointer"
      >
        {/* Soft dark aura */}
        <div
          className="absolute -left-[35px] -right-[35px] top-[50px] -bottom-10 z-0 pointer-events-none rounded-full"
          style={{
            background: `radial-gradient(ellipse 80% 70% at 50% 60%,
              rgba(16,12,22,0.70) 0%, rgba(22,16,30,0.40) 42%,
              rgba(14,10,20,0.14) 68%, transparent 100%)`,
            filter: "blur(24px)",
          }}
        />

        {/* Folder back */}
        <div className="absolute left-[18px] right-[18px] top-[18px] bottom-[14px] z-[2]">
          <FolderBackSVG />
        </div>

        {/* Pages */}
        {PAGES.map((p, i) => (
          <motion.div
            key={i}
            initial={p.closed}
            animate={isOpen ? p.open : p.closed}
            transition={p.transition}
            className="absolute top-4 left-1/2 w-[108px] h-36 rounded-[13px]"
            style={{
              marginLeft: -54,
              zIndex: p.zIndex,
            }}
          >
            <Page colorIndex={i} />
          </motion.div>
        ))}

        {/* Front flap — with iconic folder tab notch on top-left */}
        <motion.div
          animate={{ rotateX: isOpen ? -45 : 0 }}
          transition={{ type: "spring", duration: 0.52, bounce: 0.18 }}
          className="absolute left-[17px] right-[17px] bottom-[13px] h-[150px] z-[8]"
          style={{
            transformOrigin: "bottom center",
            overflow: "visible",
          }}
        >
          <svg
            viewBox="0 0 210 150"
            preserveAspectRatio="none"
            className="w-full h-full block"
            style={{
              overflow: "visible",
              filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.25))",
            }}
          >
            <defs>
              <linearGradient id="flapGrad" x1="0" y1="22" x2="0" y2="150" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(170,165,182,0.55)" />
                <stop offset="28%" stopColor="rgba(120,115,132,0.70)" />
                <stop offset="62%" stopColor="rgba(62,56,74,0.85)" />
                <stop offset="100%" stopColor="rgba(26,20,34,0.96)" />
              </linearGradient>
              <linearGradient id="flapEdge" x1="0" y1="0" x2="0" y2="150" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
                <stop offset="60%" stopColor="rgba(255,255,255,0.05)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            {/* Path: tab notch on top-left, rounded everywhere */}
            <path
              d="M 14 0
                 L 64 0
                 Q 74 0 79 9
                 L 86 22
                 L 196 22
                 Q 210 22 210 36
                 L 210 136
                 Q 210 150 196 150
                 L 14 150
                 Q 0 150 0 136
                 L 0 14
                 Q 0 0 14 0 Z"
              fill="url(#flapGrad)"
            />
            {/* Top highlight stroke */}
            <path
              d="M 14 0
                 L 64 0
                 Q 74 0 79 9
                 L 86 22
                 L 196 22
                 Q 210 22 210 36"
              fill="none"
              stroke="url(#flapEdge)"
              strokeWidth="1.2"
            />
          </svg>

          {/* Specular highlight overlay */}
          <div
            className="absolute top-[22px] left-0 w-[55%] h-[45%] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 18% 8%, rgba(255,255,255,0.14) 0%, transparent 70%)",
            }}
          />
        </motion.div>

        {/* Bottom drop shadow */}
        <div
          className="absolute -bottom-[10px] left-[20%] right-[20%] h-4 z-[1] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(6,2,14,0.35) 0%, transparent 78%)",
            filter: "blur(7px)",
          }}
        />
      </div>
    </div>
  );
}
