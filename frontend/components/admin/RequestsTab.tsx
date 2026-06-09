"use client";

import { useCallback, useState } from "react";
import {
  denyRequestAction,
  grantRequestAction,
  listRequestsAction,
  requestSuggestionsAction,
} from "@/app/actions/admin";
import { capture } from "@/lib/analytics";
import { formatDateTime } from "@/lib/utils";
import { useLazySearch } from "@/lib/hooks/useLazySearch";
import SmartSearch from "@/components/admin/SmartSearch";
import LazySentinel from "@/components/admin/LazySentinel";
import AccessKeyCard from "@/components/AccessKeyCard";
import type { AccessRequestItem, RequestStats, RequestsResponse } from "@/lib/api";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "granted", label: "Granted" },
  { value: "denied", label: "Denied" },
];

interface GrantBanner {
  email: string;
  keyValue: string;
  emailSent: boolean;
}

export default function RequestsTab({ initial }: { initial: RequestsResponse }) {
  const fetcher = useCallback(
    async (params: { q: string; status: string; limit: number; offset: number }) => {
      const res = await listRequestsAction(params);
      if (!res.ok) return null;
      return { items: res.data.items, stats: res.data.stats };
    },
    []
  );

  const search = useLazySearch<AccessRequestItem, RequestStats>({
    initial: { items: initial.items, stats: initial.stats },
    fetcher,
  });

  const fetchSuggestions = useCallback((q: string) => requestSuggestionsAction(q), []);

  const [actingId, setActingId] = useState<number | null>(null);
  const [grantBanner, setGrantBanner] = useState<GrantBanner | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleGrant(req: AccessRequestItem) {
    setActingId(req.id);
    setActionError(null);
    const result = await grantRequestAction(req.id);
    if (result.ok) {
      capture("request_granted", { email: req.email });
      setGrantBanner({ email: req.email, keyValue: result.keyValue, emailSent: result.emailSent });
      await search.refresh();
    } else {
      setActionError(result.error);
    }
    setActingId(null);
  }

  async function handleDeny(req: AccessRequestItem) {
    setActingId(req.id);
    setActionError(null);
    const result = await denyRequestAction(req.id);
    if (result.ok) {
      await search.refresh();
    } else {
      setActionError(result.error);
    }
    setActingId(null);
  }

  const { stats } = search;

  return (
    <>
      {/* Stats */}
      <div className="admin-stats-bar">
        {[
          { label: "Pending", value: stats.pending },
          { label: "Granted", value: stats.granted },
          { label: "Denied", value: stats.denied },
        ].map(({ label, value }) => (
          <div className="admin-stat-card" key={label}>
            <div className="admin-stat-label">{label}</div>
            <div className="admin-stat-value">{value}</div>
          </div>
        ))}
      </div>

      {/* Grant result banner */}
      {grantBanner && (
        <div
          className="card fade-in"
          style={{ borderLeft: "4px solid #22c55e", marginBottom: 16 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <strong>Key generated for {grantBanner.email}</strong>
              <p style={{ fontSize: "0.75rem", color: "var(--color-muted)", marginTop: 4 }}>
                {grantBanner.emailSent
                  ? "✓ Emailed to the requester."
                  : "⚠ Could not send the email — share this key manually."}
              </p>
            </div>
            <button
              className="btn-secondary"
              style={{ width: "auto", padding: "4px 12px" }}
              onClick={() => setGrantBanner(null)}
            >
              Dismiss
            </button>
          </div>
          <AccessKeyCard
            keyValue={grantBanner.keyValue}
            caption="Hidden by default — reveal to read it out, or Copy to share it without revealing on screen."
          />
        </div>
      )}

      <SmartSearch
        query={search.query}
        onQueryChange={search.setQuery}
        status={search.status}
        onStatusChange={search.setStatus}
        statusOptions={STATUS_OPTIONS}
        fetchSuggestions={fetchSuggestions}
        placeholder="Search by name, email, or GitHub…"
        loading={search.loading}
      />

      {actionError && (
        <p className="error-text" style={{ marginBottom: 12 }}>
          {actionError}
        </p>
      )}
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
          No access requests match your search.
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>GitHub</th>
                <th>Status</th>
                <th>Requested</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {search.items.map((req) => (
                <tr key={req.id}>
                  <td>{req.name}</td>
                  <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {req.email}
                  </td>
                  <td>{req.github_id}</td>
                  <td>
                    <span className={`key-badge ${req.status === "pending" ? "unused" : "used"}`}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </td>
                  <td>{formatDateTime(req.created_at)}</td>
                  <td>
                    {req.status === "pending" ? (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="btn-primary"
                          style={{ width: "auto", padding: "4px 12px", fontSize: "0.75rem" }}
                          disabled={actingId === req.id}
                          onClick={() => handleGrant(req)}
                        >
                          {actingId === req.id ? <span className="spinner" /> : "Grant"}
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ width: "auto", padding: "4px 12px", fontSize: "0.75rem" }}
                          disabled={actingId === req.id}
                          onClick={() => handleDeny(req)}
                        >
                          Deny
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>—</span>
                    )}
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
    </>
  );
}
