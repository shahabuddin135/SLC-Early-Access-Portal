"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      github_id: (form.elements.namedItem("github_id") as HTMLInputElement).value.trim(),
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login?registered=1"), 1200);
      } else {
        setError(body.error ?? "Registration failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <p className="success-text" style={{ textAlign: "center" }}>
        Account created! Redirecting to login…
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="label" htmlFor="name">Full name</label>
        <input
          id="name"
          name="name"
          type="text"
          className="input"
          placeholder="Ada Lovelace"
          required
          disabled={loading}
        />
      </div>

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
        />
      </div>

      <div className="field">
        <label className="label" htmlFor="github_id">GitHub username</label>
        <input
          id="github_id"
          name="github_id"
          type="text"
          className="input"
          placeholder="adalove"
          required
          disabled={loading}
        />
      </div>

      <div className="field" style={{ marginBottom: 24 }}>
        <label className="label" htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className="input"
          placeholder="Min. 8 characters"
          required
          minLength={8}
          disabled={loading}
        />
      </div>

      {error && <p className="error-text" style={{ marginBottom: 16 }}>{error}</p>}

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? <span className="spinner" /> : null}
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
