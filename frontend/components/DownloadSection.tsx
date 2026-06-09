"use client";

import { useState } from "react";
import { downloadAction } from "@/app/actions/download";
import { capture } from "@/lib/analytics";

type ViewState = "enter_key" | "loading" | "done";

interface DownloadSectionProps {
  hasDownloaded: boolean;
}

function HeadsUpNote() {
  return (
    <div
      style={{
        background: "rgba(249,115,22,0.06)",
        border: "1px solid rgba(249,115,22,0.18)",
        borderRadius: "var(--radius)",
        padding: "14px 16px",
        marginBottom: 20,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.8125rem",
          color: "var(--color-text-muted)",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "var(--color-text)" }}>Heads up —</strong> the SLC
        framework is in active early access and is improved every day. While building,
        you may occasionally need to fix small issues in the framework yourself. If you
        get stuck, reach out to{" "}
        <a href="mailto:wewiselabs@gmail.com">wewiselabs@gmail.com</a>.
      </p>
    </div>
  );
}

export default function DownloadSection({
  hasDownloaded: initialHasDownloaded,
}: DownloadSectionProps) {
  const [view, setView] = useState<ViewState>(
    initialHasDownloaded ? "done" : "enter_key"
  );
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    if (!key.trim()) {
      setError("Please enter your download key.");
      return;
    }
    setError(null);
    setView("loading");

    try {
      const result = await downloadAction(key.trim());
      if (result.ok) {
        capture("download_started");
        // Open the proxy route in a new tab — auth + token both validated server-side.
        window.open(
          `/api/download/file?token=${encodeURIComponent(result.downloadToken)}`,
          "_blank",
          "noopener,noreferrer"
        );
        setView("done");
        // Reload so the parent SSR page re-fetches and shows ReviewForm
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setError(result.error);
        setView("enter_key");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setView("enter_key");
    }
  }

  /*  Downloaded state  */
  if (view === "done") {
    return (
      <div className="card">
        <h3 style={{ marginBottom: 12 }}>SLC Language &amp; Framework</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="badge-success" style={{ alignSelf: "flex-start" }}>
            &#10003; Downloaded
          </div>
          <button
            onClick={() => {
              setKey("");
              setError(null);
              setView("enter_key");
            }}
            className="btn-secondary"
            style={{ width: "auto", alignSelf: "flex-start" }}
          >
            Download again
          </button>
        </div>
      </div>
    );
  }

  /*  Key-entry / loading state  */
  return (
    <div className="card">
      <h3 style={{ marginBottom: 8 }}>SLC Language &amp; Framework</h3>
      <p style={{ fontSize: "0.875rem", marginBottom: 4 }}>
        Enter the download key from your access-approval email to access the SLC
        framework files.
      </p>
      <p
        style={{
          fontSize: "0.8125rem",
          color: "var(--color-muted)",
          marginBottom: 20,
        }}
      >
        Don&apos;t have a key yet? Request access above, or contact{" "}
        <a href="mailto:wewiselabs@gmail.com">wewiselabs@gmail.com</a>.
      </p>

      <HeadsUpNote />

      <div className="field" style={{ marginBottom: 20 }}>
        <label className="label" htmlFor="download_key">
          Download Key
        </label>
        <input
          id="download_key"
          type="text"
          className="input"
          placeholder="XXXX-XXXX-XXXX-XXXX"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          disabled={view === "loading"}
          onKeyDown={(e) => e.key === "Enter" && handleDownload()}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      {error && (
        <p className="error-text" style={{ marginBottom: 16 }}>
          {error}
        </p>
      )}

      <button
        onClick={handleDownload}
        className="btn-primary"
        disabled={view === "loading"}
      >
        {view === "loading" ? <span className="spinner" /> : null}
        {view === "loading" ? "Validating" : "Download"}
      </button>
    </div>
  );
}
