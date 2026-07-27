"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
    };

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();

      if (res.ok) {
        router.push(next || "/dashboard");
      } else {
        setError(body.error ?? "Login failed.");
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

      <div className="field" style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 6,
          }}
        >
          <label className="label" htmlFor="password" style={{ marginBottom: 0 }}>
            Password
          </label>
          <Link href="/forgot-password" style={{ fontSize: "0.8125rem" }}>
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          className="input"
          placeholder="••••••••"
          required
          disabled={loading}
          autoComplete="current-password"
        />
      </div>

      {error && <p className="error-text" style={{ marginBottom: 16 }}>{error}</p>}

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? <span className="spinner" /> : null}
        {loading ? "Signing in…" : "Log in"}
      </button>
    </form>
  );
}
