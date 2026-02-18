"use client";

import { useState } from "react";
import { reviewAction } from "@/app/actions/review";

type FormState = "idle" | "loading" | "success" | "error";

export default function ReviewForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setState("loading");

    const form = e.currentTarget;
    const data = {
      project_link: (form.elements.namedItem("project_link") as HTMLInputElement).value.trim(),
      review_text: (form.elements.namedItem("review_text") as HTMLTextAreaElement).value.trim(),
    };

    try {
      const result = await reviewAction(data);
      if (result.ok) {
        setState("success");
      } else {
        setError(result.error);
        setState("error");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div
        className="card fade-in"
        style={{ borderTop: "4px solid var(--color-success)" }}
      >
        <p
          className="success-text"
          style={{ textAlign: "center", fontSize: "1rem" }}
        >
          ✓ Review submitted! Thank you.
        </p>
      </div>
    );
  }

  const isLoading = state === "loading";

  return (
    <div
      className="card"
      style={{ borderTop: "4px solid var(--color-primary)" }}
    >
      <h3 style={{ marginBottom: 4 }}>Share Your Experience</h3>
      <p style={{ fontSize: "0.875rem", marginBottom: 20 }}>
        Submit the project you built using the SLC framework
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="label" htmlFor="project_link">Project link</label>
          <input
            id="project_link"
            name="project_link"
            type="url"
            className="input"
            placeholder="https://github.com/you/slc-project"
            required
            disabled={isLoading}
          />
        </div>

        <div className="field" style={{ marginBottom: 24 }}>
          <label className="label" htmlFor="review_text">Your review</label>
          <textarea
            id="review_text"
            name="review_text"
            className="input"
            rows={5}
            placeholder="Share your experience with the SLC framework…"
            required
            minLength={10}
            disabled={isLoading}
          />
        </div>

        {state === "error" && error && (
          <p className="error-text" style={{ marginBottom: 16 }}>{error}</p>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? <span className="spinner" /> : null}
          {isLoading ? "Submitting…" : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
