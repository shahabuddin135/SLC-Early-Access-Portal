"use client";

import { useState } from "react";
import { downloadAction } from "@/app/actions/download";
import DownloadWarningDialog from "@/components/DownloadWarningDialog";

type ViewState = "idle" | "warning" | "enter_key" | "loading" | "done";

interface DownloadSectionProps {
  hasDownloaded: boolean;
}

export default function DownloadSection({
  hasDownloaded: initialHasDownloaded,
}: DownloadSectionProps) {
  const [view, setView] = useState<ViewState>(
    initialHasDownloaded ? "done" : "idle"
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
        // Open the file route in a new tab — auth cookie + key both validated server-side
        window.open(
          `/api/download/file?key=${encodeURIComponent(key.trim())}`,
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

  /*  Warning dialog — shown before key entry  */
  if (view === "warning") {
    return (
      <DownloadWarningDialog
        onConfirm={() => setView("enter_key")}
        onCancel={() => setView("idle")}
      />
    );
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
            onClick={() => { setKey(""); setError(null); setView("warning"); }}
            className="btn-secondary"
            style={{ width: "auto", alignSelf: "flex-start" }}
          >
            Download again
          </button>
        </div>
      </div>
    );
  }

  /*  Idle state: show download CTA  */
  if (view === "idle") {
    return (
      <div className="card">
        <h3 style={{ marginBottom: 8 }}>SLC Language &amp; Framework</h3>
        <p style={{ fontSize: "0.875rem", marginBottom: 20 }}>
          Download the SLC framework package to get started.
          A download key is required — contact{" "}
          <a href="mailto:wewiselabs@gmail.com">wewiselabs@gmail.com</a>{" "}
          to obtain yours.
        </p>
        <button
          onClick={() => setView("warning")}
          className="btn-primary"
        >
          Download SLC Language &amp; Framework
        </button>
      </div>
    );
  }

  /*  Key-entry / loading state  */
  return (
    <div className="card">
      <h3 style={{ marginBottom: 8 }}>SLC Language &amp; Framework</h3>
      <p style={{ fontSize: "0.875rem", marginBottom: 4 }}>
        Enter your download key to access the SLC framework files.
      </p>
      <p
        style={{
          fontSize: "0.8125rem",
          color: "var(--color-muted)",
          marginBottom: 20,
        }}
      >
        Don&apos;t have a key? Contact{" "}
        <a href="mailto:wewiselabs@gmail.com">wewiselabs@gmail.com</a>{" "}
        to obtain your download key.
      </p>

      <div className="field" style={{ marginBottom: 20 }}>
        <label className="label" htmlFor="download_key">
          Download Key
        </label>
        <input
          id="download_key"
          type="text"
          className="input"
          placeholder="SLC-XXXX-XXXX-XXXX"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          disabled={view === "loading"}
          onKeyDown={(e) => e.key === "Enter" && handleDownload()}
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      {error && (
        <p className="error-text" style={{ marginBottom: 16 }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={handleDownload}
          className="btn-primary"
          disabled={view === "loading"}
          style={{ flex: 1 }}
        >
          {view === "loading" ? <span className="spinner" /> : null}
          {view === "loading" ? "Validating" : "Download"}
        </button>
        <button
          onClick={() => { setView("idle"); setError(null); setKey(""); }}
          className="btn-secondary"
          disabled={view === "loading"}
          style={{ width: "auto" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}