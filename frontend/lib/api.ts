// All API calls are made server-side only (server actions / server components).
// Never import this in client components directly.

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

// ── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  github_id?: string;
  has_downloaded?: boolean;
}

export interface DashboardData extends User {
  github_id: string;
  has_downloaded: boolean;
  has_agreed_terms: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function registerUser(data: {
  name: string;
  email: string;
  github_id: string;
  password: string;
}): Promise<{ ok: true; user: User } | { ok: false; status: number; error: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const body = await res.json();

    if (res.ok) return { ok: true, user: body };

    const message =
      res.status === 409
        ? "This email is already registered."
        : body?.detail ?? "Registration failed. Please try again.";

    return { ok: false, status: res.status, error: message };
  } catch {
    return { ok: false, status: 0, error: "Network error. Please try again." };
  }
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<
  | { ok: true; token: string; user: User }
  | { ok: false; status: number; error: string }
> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const body = await res.json();

    if (res.ok)
      return { ok: true, token: body.access_token, user: body.user };

    const message =
      res.status === 401
        ? "Invalid email or password."
        : body?.detail ?? "Login failed. Please try again.";

    return { ok: false, status: res.status, error: message };
  } catch {
    return { ok: false, status: 0, error: "Network error. Please try again." };
  }
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export async function getDashboard(
  token: string
): Promise<DashboardData | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Download ──────────────────────────────────────────────────────────────────

export async function triggerDownload(
  token: string,
  key: string
): Promise<{ has_downloaded: boolean } | null> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/download?key=${encodeURIComponent(key)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Terms ─────────────────────────────────────────────────────────────────────

export async function agreeToTerms(
  token: string
): Promise<{ agreed: boolean } | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/terms/agree`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Review ────────────────────────────────────────────────────────────────────

export async function submitReview(
  token: string,
  data: { project_link: string; review_text: string }
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    if (res.ok) return { ok: true };

    const body = await res.json();
    const message =
      res.status === 403
        ? "Please download the SLC files first."
        : body?.detail ?? "Submission failed. Please try again.";

    return { ok: false, error: message };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
