"use client";

import { useState, useCallback } from "react";
import { listKeysAction, generateKeysAction } from "@/app/actions/admin";
import type { DownloadKey, KeysResponse } from "@/lib/api";

type FilterTab = "all" | "unused" | "used";

interface AdminDashboardProps {
  initialData: KeysResponse;
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CopyButton({ value }: { value: string }) {
  const [label, setLabel] = useState("Copy");

  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setLabel("Copied!");
      setTimeout(() => setLabel("Copy"), 1800);
    });
  }

  return (
    <button
      className={`copy-btn${label === "Copied!" ? " copied" : ""}`}
      onClick={handleCopy}
      type="button"
    >
      {label}
    </button>
  );
}

export default function AdminDashboard({ initialData }: AdminDashboardProps) {
  const [data, setData] = useState<KeysResponse>(initialData);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [showGenModal, setShowGenModal] = useState(false);
  const [genCount, setGenCount] = useState<number>(1);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    const result = await listKeysAction();
    if (result.ok) setData(result.data);
    setRefreshing(false);
  }, []);

  async function handleGenerate() {
    setGenerating(true);
    setGenError(null);
    const result = await generateKeysAction(genCount);
    if (result.ok) {
      await refresh();
      setShowGenModal(false);
      setGenCount(1);
    } else {
      setGenError(result.error);
    }
    setGenerating(false);
  }

  const filtered =
    filter === "all"
      ? data.keys
      : filter === "used"
      ? data.keys.filter((k) => k.used)
      : data.keys.filter((k) => !k.used);

  return (
    <>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={{ fontSize: "1.25rem" }}>Key Management</h1>
            <span className="ww-badge" style={{ fontSize: "0.6875rem" }}>
              Admin
            </span>
          </div>
          <p style={{ fontSize: "0.8125rem", marginTop: 4 }}>
            Generate and monitor one-time download keys for the SLC framework.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn-secondary"
            style={{ width: "auto", padding: "8px 16px" }}
            onClick={refresh}
            disabled={refreshing}
          >
            {refreshing ? <span className="spinner" /> : "↻"} Refresh
          </button>
          <button
            className="btn-primary"
            style={{ width: "auto", padding: "8px 20px" }}
            onClick={() => setShowGenModal(true)}
          >
            + Generate Keys
          </button>
        </div>
      </div>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <div className="admin-stats-bar">
        {[
          { label: "Total Keys", value: data.total },
          { label: "Unused", value: data.unused },
          { label: "Used", value: data.used },
        ].map(({ label, value }) => (
          <div className="admin-stat-card" key={label}>
            <div className="admin-stat-label">{label}</div>
            <div className="admin-stat-value">{value}</div>
          </div>
        ))}
      </div>

      {/* ── Filter tabs ──────────────────────────────────────────────────── */}
      <div className="admin-tabs">
        {(["all", "unused", "used"] as FilterTab[]).map((tab) => (
          <button
            key={tab}
            className={`admin-tab${filter === tab ? " active" : ""}`}
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {" "}
            <span style={{ opacity: 0.6, fontSize: "0.75rem" }}>
              ({tab === "all" ? data.total : tab === "used" ? data.used : data.unused})
            </span>
          </button>
        ))}
      </div>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            color: "var(--color-muted)",
            fontSize: "0.875rem",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius)",
          }}
        >
          No keys found. Generate some keys to get started.
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Key Value</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Used At</th>
                <th>Used By</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((key: DownloadKey) => (
                <tr key={key.id}>
                  <td>
                    <div className="key-value-cell">
                      <span className="key-mono">{key.key_value}</span>
                      <CopyButton value={key.key_value} />
                    </div>
                  </td>
                  <td>
                    <span className={`key-badge ${key.used ? "used" : "unused"}`}>
                      {key.used ? "Used" : "Unused"}
                    </span>
                  </td>
                  <td>{fmtDate(key.created_at)}</td>
                  <td>{fmtDate(key.used_at)}</td>
                  <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {key.used_by ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Generate Keys Modal ──────────────────────────────────────────── */}
      {showGenModal && (
        <div className="dialog-overlay">
          <div className="dialog-card fade-in" style={{ maxWidth: 380 }}>
            <h2 style={{ fontSize: "1.125rem", marginBottom: 6 }}>
              Generate Keys
            </h2>
            <p style={{ fontSize: "0.8125rem", marginBottom: 4 }}>
              How many one-time download keys do you want to generate?
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--color-muted)", marginBottom: 0 }}>
              Format: <span style={{ fontFamily: "var(--font-mono)" }}>XXXX-XXXX-XXXX-XXXX</span>
              &nbsp;(1 – 100)
            </p>

            <input
              type="number"
              className="gen-count-input"
              min={1}
              max={100}
              value={genCount}
              onChange={(e) =>
                setGenCount(Math.min(100, Math.max(1, Number(e.target.value))))
              }
              disabled={generating}
            />

            {genError && (
              <p className="error-text" style={{ marginBottom: 12 }}>
                {genError}
              </p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                className="btn-primary"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <span className="spinner" /> Generating…
                  </>
                ) : (
                  `Generate ${genCount} Key${genCount !== 1 ? "s" : ""}`
                )}
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowGenModal(false);
                  setGenError(null);
                }}
                disabled={generating}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
