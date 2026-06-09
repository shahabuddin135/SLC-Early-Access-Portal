"use client";

import { useState } from "react";
import { sendVerificationAction } from "@/app/actions/account";

export default function EmailVerificationBanner({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSend() {
    setState("sending");
    setMessage(null);
    const result = await sendVerificationAction();
    if (result.ok) {
      setState("sent");
      setMessage(result.message);
    } else {
      setState("error");
      setMessage(result.error);
    }
  }

  return (
    <div
      className="card fade-in"
      style={{
        borderLeft: "4px solid var(--color-primary)",
        background: "rgba(249,115,22,0.05)",
        marginBottom: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{ fontSize: "1.25rem", lineHeight: 1.2 }}>✉️</span>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: "0.9375rem", marginBottom: 4 }}>
            Verify your email to request access
          </h3>
          <p style={{ fontSize: "0.8125rem", color: "var(--color-muted)", marginBottom: 12 }}>
            We need to confirm <strong style={{ color: "var(--color-text)" }}>{email}</strong>{" "}
            before you can request an access key for the SLC framework.
          </p>

          {message && (
            <p
              className={state === "error" ? "error-text" : undefined}
              style={{
                fontSize: "0.8125rem",
                marginBottom: 12,
                color: state === "sent" ? "var(--color-success, #22c55e)" : undefined,
              }}
            >
              {message}
            </p>
          )}

          <button
            className="btn-primary"
            style={{ width: "auto", padding: "8px 18px", fontSize: "0.8125rem" }}
            onClick={handleSend}
            disabled={state === "sending"}
          >
            {state === "sending" ? (
              <>
                <span className="spinner" /> Sending…
              </>
            ) : state === "sent" ? (
              "Resend verification email"
            ) : (
              "Send verification email"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
