"use client";

import { useRouter } from "next/navigation";
import type { DashboardData } from "@/lib/api";

interface ProfileHeaderProps {
  user: DashboardData;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
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
        <button
          onClick={handleLogout}
          className="btn-secondary"
          style={{ flexShrink: 0, width: "auto" }}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
