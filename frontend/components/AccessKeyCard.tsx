"use client";

import { useState } from "react";

interface AccessKeyCardProps {
  keyValue: string;
  /** Optional caption shown under the key. */
  caption?: string;
}

/**
 * Displays an access key hidden by default (masked), with a reveal/hide toggle
 * and a one-click copy button. Copy works whether or not the key is revealed.
 */
export default function AccessKeyCard({ keyValue, caption }: AccessKeyCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Keep the dash grouping, mask everything else.
  const masked = keyValue.replace(/[^-]/g, "•");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(keyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — ignore */
    }
  }

  return (
    <div className="access-key-card">
      <div className="access-key-eyebrow">Your access key</div>

      <div className="access-key-row">
        <code
          className="access-key-value"
          aria-label={revealed ? keyValue : "Access key hidden"}
        >
          {revealed ? keyValue : masked}
        </code>

        <div className="access-key-actions">
          <button
            type="button"
            className="access-key-icon-btn"
            onClick={() => setRevealed((r) => !r)}
            aria-pressed={revealed}
            aria-label={revealed ? "Hide key" : "Reveal key"}
            title={revealed ? "Hide" : "Reveal"}
          >
            {revealed ? "🙈" : "👁"}
          </button>
          <button
            type="button"
            className={`access-key-copy${copied ? " copied" : ""}`}
            onClick={handleCopy}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      {caption && <p className="access-key-caption">{caption}</p>}
    </div>
  );
}
