"use client";

import { useState } from "react";
import RequestsTab from "@/components/admin/RequestsTab";
import KeysTab from "@/components/admin/KeysTab";
import type { KeysResponse, RequestsResponse } from "@/lib/api";

type Tab = "requests" | "keys";

interface AdminDashboardProps {
  initialRequests: RequestsResponse;
  initialKeys: KeysResponse;
}

export default function AdminDashboard({
  initialRequests,
  initialKeys,
}: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>("requests");

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1 style={{ fontSize: "1.25rem" }}>Admin Console</h1>
          <span className="ww-badge" style={{ fontSize: "0.6875rem" }}>Admin</span>
        </div>
        <p style={{ fontSize: "0.8125rem", marginTop: 4 }}>
          Approve access requests and manage one-time download keys for the SLC framework.
        </p>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab${tab === "requests" ? " active" : ""}`}
          onClick={() => setTab("requests")}
        >
          Access Requests{" "}
          <span style={{ opacity: 0.6, fontSize: "0.75rem" }}>
            ({initialRequests.stats.pending} pending)
          </span>
        </button>
        <button
          className={`admin-tab${tab === "keys" ? " active" : ""}`}
          onClick={() => setTab("keys")}
        >
          Keys{" "}
          <span style={{ opacity: 0.6, fontSize: "0.75rem" }}>({initialKeys.total})</span>
        </button>
      </div>

      {/* Both tabs stay mounted to preserve their search state; only one is shown. */}
      <div style={{ display: tab === "requests" ? "block" : "none" }}>
        <RequestsTab initial={initialRequests} />
      </div>
      <div style={{ display: tab === "keys" ? "block" : "none" }}>
        <KeysTab initial={initialKeys} />
      </div>
    </>
  );
}
