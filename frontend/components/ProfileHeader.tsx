"use client";

import { useRouter } from "next/navigation";
import type { DashboardData } from "@/lib/api";

interface ProfileHeaderProps {
  user: DashboardData;
  isAdmin?: boolean;
}

export default function ProfileHeader({ user, isAdmin }: ProfileHeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div
      className="card"
      style={{
        borderLeft: "4px solid var(--color-primary)",
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <div>
          <h2 style={{ marginBottom: 4 }}>{user.name}</h2>
          <p style={{ fontSize: "0.875rem", marginBottom: 2 }}>{user.email}</p>
          <p style={{ fontSize: "0.875rem", color: "var(--color-muted)" }}>
            github.com/{user.github_id}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", flexShrink: 0 }}>
          {isAdmin && (
            <button
              onClick={() => router.push("/admin")}
              className="btn-primary"
              style={{ width: "auto", fontSize: "0.8125rem", padding: "6px 14px" }}
            >
              ⚙ Admin Panel
            </button>
          )}
          <button
            onClick={handleLogout}
            className="btn-secondary"
            style={{ width: "auto" }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
