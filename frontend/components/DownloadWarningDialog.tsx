"use client";

interface DownloadWarningDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const OBLIGATIONS = [
  "I will NOT upload these files to any GitHub repository — public or private.",
  "I will NOT push or commit SLC files to GitLab, Bitbucket, or any other VCS platform.",
  "I will NOT share, forward, or distribute these files to any third party.",
  "I understand these are confidential WeWise Labs research materials.",
  "I will use these files solely for testing and submitting feedback.",
];

export default function DownloadWarningDialog({
  onConfirm,
  onCancel,
}: DownloadWarningDialogProps) {
  return (
    <div className="dialog-overlay">
      <div className="dialog-card fade-in">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: "1.75rem", marginBottom: 8 }}>⚠️</div>
          <h2 style={{ fontSize: "1.125rem", marginBottom: 6 }}>
            Confidentiality Acknowledgment
          </h2>
          <p style={{ fontSize: "0.8125rem" }}>
            Before downloading the SLC Framework, you must acknowledge the
            following obligations:
          </p>
        </div>

        {/* ── Obligations list ───────────────────────────────────────────── */}
        <div style={{
          background: "#0D0D0D",
          border: "1px solid rgba(239,68,68,0.18)",
          borderRadius: "var(--radius)",
          padding: "14px 18px",
          marginBottom: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
          {OBLIGATIONS.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{
                color: "var(--color-error)",
                fontWeight: 800,
                flexShrink: 0,
                fontSize: "0.75rem",
                lineHeight: "1.75",
              }}>✕</span>
              <span style={{
                fontSize: "0.8125rem",
                color: "var(--color-text-muted)",
                lineHeight: 1.6,
              }}>
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* ── Contact line ───────────────────────────────────────────────── */}
        <p style={{
          fontSize: "0.75rem",
          color: "var(--color-muted)",
          textAlign: "center",
          marginBottom: 20,
          lineHeight: 1.5,
        }}>
          Issues or questions?{" "}
          <a href="mailto:wewiselabs@gmail.com">wewiselabs@gmail.com</a>
        </p>

        {/* ── Actions ────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button className="btn-primary" onClick={onConfirm}>
            ✓ I Acknowledge &amp; Agree — Enter Download Key
          </button>
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
