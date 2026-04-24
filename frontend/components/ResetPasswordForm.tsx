"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!token) {
      setError("This reset link is missing or invalid. Request a new one.");
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    const form = e.currentTarget;
    const newPassword = (form.elements.namedItem("new_password") as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem("confirm_password") as HTMLInputElement).value;

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      const body = await res.json();

      if (res.ok) {
        setSuccess(body.message ?? "Password reset successful.");
        setTimeout(() => router.push("/login?reset=1"), 1200);
      } else {
        setError(body.error ?? "Reset failed. Please request a new link.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div>
        <p className="error-text" style={{ marginTop: 0, marginBottom: 16 }}>
          This reset link is missing or invalid. Request a new one.
        </p>
        <Link href="/forgot-password">Request a new reset link</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="label" htmlFor="new_password">New password</label>
        <input
          id="new_password"
          name="new_password"
          type="password"
          className="input"
          placeholder="Min. 8 characters"
          required
          minLength={8}
          autoComplete="new-password"
          disabled={loading}
        />
      </div>

      <div className="field" style={{ marginBottom: 24 }}>
        <label className="label" htmlFor="confirm_password">Confirm new password</label>
        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          className="input"
          placeholder="Repeat new password"
          required
          minLength={8}
          autoComplete="new-password"
          disabled={loading}
        />
      </div>

      {error && <p className="error-text" style={{ marginBottom: 16 }}>{error}</p>}
      {success && <p className="success-text" style={{ marginBottom: 16 }}>{success}</p>}

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? <span className="spinner" /> : null}
        {loading ? "Updating password…" : "Reset password"}
      </button>

      <p style={{ textAlign: "center", fontSize: "0.875rem", marginTop: 18 }}>
        <Link href="/login">Back to login</Link>
      </p>
    </form>
  );
}