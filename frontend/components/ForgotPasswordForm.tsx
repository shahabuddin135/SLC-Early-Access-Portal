"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setResetUrl(null);
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
    };

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();

      if (res.ok) {
        setMessage(body.message ?? "If an account exists for that email, reset instructions have been sent.");
        setResetUrl(body.resetUrl ?? null);
      } else {
        setError(body.error ?? "Unable to process reset request.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="label" htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          className="input"
          placeholder="ada@example.com"
          required
          disabled={loading}
          autoComplete="email"
        />
      </div>

      {error && <p className="error-text" style={{ marginBottom: 16 }}>{error}</p>}

      {message && (
        <div style={{ marginBottom: 16 }}>
          <p className="success-text" style={{ marginTop: 0 }}>{message}</p>
          {resetUrl && (
            <p style={{ marginTop: 10, fontSize: "0.875rem" }}>
              Local development reset link: <a href={resetUrl}>{resetUrl}</a>
            </p>
          )}
        </div>
      )}

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? <span className="spinner" /> : null}
        {loading ? "Sending reset link…" : "Send reset link"}
      </button>

      <p style={{ textAlign: "center", fontSize: "0.875rem", marginTop: 18 }}>
        Remembered it? <Link href="/login">Back to login</Link>
      </p>
    </form>
  );
}