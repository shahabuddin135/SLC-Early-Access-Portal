"use client";

import { useCallback, useState } from "react";
import {
  generateKeysAction,
  keySuggestionsAction,
  listKeysAction,
} from "@/app/actions/admin";
import { formatDateTime } from "@/lib/utils";
import { useLazySearch } from "@/lib/hooks/useLazySearch";
import SmartSearch from "@/components/admin/SmartSearch";
import LazySentinel from "@/components/admin/LazySentinel";
import type { DownloadKey, KeysResponse } from "@/lib/api";

type KeyStats = { total: number; used: number; unused: number };

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "unused", label: "Unused" },
  { value: "used", label: "Used" },
];

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

export default function KeysTab({ initial }: { initial: KeysResponse }) {
  const fetcher = useCallback(
    async (params: { q: string; status: string; limit: number; offset: number }) => {
      const res = await listKeysAction(params);
      if (!res.ok) return null;
      return {
        items: res.data.keys,
        stats: { total: res.data.total, used: res.data.used, unused: res.data.unused },
      };
    },
    []
  );

  const search = useLazySearch<DownloadKey, KeyStats>({
    initial: {
      items: initial.keys,
      stats: { total: initial.total, used: initial.used, unused: initial.unused },
    },
    fetcher,
  });

  const fetchSuggestions = useCallback((q: string) => keySuggestionsAction(q), []);

  const [showGenModal, setShowGenModal] = useState(false);
  const [genCount, setGenCount] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  async function handleGenerate() {
    setGenerating(true);
    setGenError(null);
    const result = await generateKeysAction(genCount);
    if (result.ok) {
      await search.refresh();
      setShowGenModal(false);
      setGenCount(1);
    } else {
      setGenError(result.error);
    }
    setGenerating(false);
  }

  const { stats } = search;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button
          className="btn-primary"
          style={{ width: "auto", padding: "8px 20px" }}
          onClick={() => setShowGenModal(true)}
        >
          + Generate Keys
        </button>
      </div>

      <div className="admin-stats-bar">
        {[
          { label: "Total Keys", value: stats.total },
          { label: "Unused", value: stats.unused },
          { label: "Used", value: stats.used },
        ].map(({ label, value }) => (
          <div className="admin-stat-card" key={label}>
            <div className="admin-stat-label">{label}</div>
            <div className="admin-stat-value">{value}</div>
          </div>
        ))}
      </div>

      <SmartSearch
        query={search.query}
        onQueryChange={search.setQuery}
        status={search.status}
        onStatusChange={search.setStatus}
        statusOptions={STATUS_OPTIONS}
        fetchSuggestions={fetchSuggestions}
        placeholder="Search by key, assignee, or redeemer…"
        loading={search.loading}
      />

      {search.error && (
        <p className="error-text" style={{ marginBottom: 12 }}>
          {search.error}
        </p>
      )}

      {search.items.length === 0 && !search.loading ? (
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
          No keys match your search. Generate some to get started.
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Key Value</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Created</th>
                <th>Used At</th>
                <th>Used By</th>
              </tr>
            </thead>
            <tbody>
              {search.items.map((key) => (
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
                  <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {key.assigned_email ?? "—"}
                  </td>
                  <td>{formatDateTime(key.created_at)}</td>
                  <td>{formatDateTime(key.used_at)}</td>
                  <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {key.used_by ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <LazySentinel
        enabled={search.hasMore}
        loading={search.loading}
        onVisible={search.loadMore}
        onLoadMore={search.loadMore}
      />

      {/* Generate Keys modal */}
      {showGenModal && (
        <div className="dialog-overlay">
          <div className="dialog-card fade-in" style={{ maxWidth: 380 }}>
            <h2 style={{ fontSize: "1.125rem", marginBottom: 6 }}>Generate Keys</h2>
            <p style={{ fontSize: "0.8125rem", marginBottom: 4 }}>
              How many one-time download keys do you want to generate?
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--color-muted)", marginBottom: 0 }}>
              Format: <span style={{ fontFamily: "var(--font-mono)" }}>XXXX-XXXX-XXXX-XXXX</span>
              &nbsp;(1 – 100). These are open keys (not bound to an account).
            </p>

            <input
              type="number"
              className="gen-count-input"
              min={1}
              max={100}
              value={genCount}
              onChange={(e) => setGenCount(Math.min(100, Math.max(1, Number(e.target.value))))}
              disabled={generating}
            />

            {genError && (
              <p className="error-text" style={{ marginBottom: 12 }}>
                {genError}
              </p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="btn-primary" onClick={handleGenerate} disabled={generating}>
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
