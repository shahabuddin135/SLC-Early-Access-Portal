// All API calls are made server-side only (server actions / server components).
// Never import this in client components directly.

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

// Forwards the caller's public origin so the backend builds links (verification,
// reset, dashboard) for the right deployment. Validated server-side against an allowlist.
function baseUrlHeader(baseUrl?: string | null): Record<string, string> {
  return baseUrl ? { "X-App-Base-Url": baseUrl } : {};
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  github_id?: string;
  has_downloaded?: boolean;
}

export type AccessRequestStatus = "pending" | "granted" | "denied";

export interface DashboardData extends User {
  github_id: string;
  has_downloaded: boolean;
  email_verified: boolean;
  access_request_status: AccessRequestStatus | null;
  access_key: string | null;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ForgotPasswordResponse {
  message: string;
  reset_url?: string | null;
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

export async function requestPasswordReset(
  data: { email: string },
  baseUrl?: string | null
): Promise<
  | { ok: true; message: string; resetUrl?: string | null }
  | { ok: false; status: number; error: string }
> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...baseUrlHeader(baseUrl) },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const body = await res.json();

    if (res.ok) {
      return {
        ok: true,
        message: body.message,
        resetUrl: body.reset_url,
      };
    }

    return {
      ok: false,
      status: res.status,
      error: body?.detail ?? "Unable to process reset request. Please try again.",
    };
  } catch {
    return { ok: false, status: 0, error: "Network error. Please try again." };
  }
}

export async function resetPassword(data: {
  token: string;
  new_password: string;
}): Promise<
  | { ok: true; message: string }
  | { ok: false; status: number; error: string }
> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const body = await res.json();

    if (res.ok) {
      return { ok: true, message: body.message };
    }

    return {
      ok: false,
      status: res.status,
      error: body?.detail ?? "Reset failed. Please request a new link and try again.",
    };
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

// ── Download / Redeem ─────────────────────────────────────────────────────────

export async function redeemKey(
  token: string,
  keyValue: string
): Promise<{ download_token: string } | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ key_value: keyValue }),
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Account / verification ────────────────────────────────────────────────────

export async function sendVerificationEmail(
  token: string,
  baseUrl?: string | null
): Promise<{ ok: true; message: string } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/send-verification`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, ...baseUrlHeader(baseUrl) },
      cache: "no-store",
    });
    const body = await res.json();
    if (res.ok) return { ok: true, message: body.message };
    return { ok: false, error: body?.detail ?? "Could not send verification email." };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export async function verifyEmail(
  verificationToken: string
): Promise<{ ok: true; message: string } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: verificationToken }),
      cache: "no-store",
    });
    const body = await res.json();
    if (res.ok) return { ok: true, message: body.message };
    return { ok: false, error: body?.detail ?? "Invalid or expired verification link." };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export async function requestAccess(
  token: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/access-requests`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (res.ok) return { ok: true };
    const body = await res.json();
    return { ok: false, error: body?.detail ?? "Could not submit access request." };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

// ── Admin: keys ───────────────────────────────────────────────────────────────

export interface DownloadKey {
  id: number;
  key_value: string;
  used: boolean;
  created_at: string;
  used_at: string | null;
  used_by: string | null;
  assigned_email: string | null;
}

export interface KeysResponse {
  keys: DownloadKey[];
  total: number;
  used: number;
  unused: number;
}

export interface SearchParams {
  q?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

function buildQuery(params: SearchParams): string {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.status && params.status !== "all") sp.set("status", params.status);
  sp.set("limit", String(params.limit ?? 20));
  sp.set("offset", String(params.offset ?? 0));
  return sp.toString();
}

export async function listAdminKeys(
  token: string,
  params: SearchParams = {}
): Promise<KeysResponse | null> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/admin/keys?${buildQuery(params)}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function adminKeySuggestions(
  token: string,
  q: string
): Promise<string[]> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/admin/keys/suggestions?q=${encodeURIComponent(q)}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
    );
    if (!res.ok) return [];
    const body = await res.json();
    return body.suggestions ?? [];
  } catch {
    return [];
  }
}

export async function generateAdminKeys(
  token: string,
  count: number
): Promise<DownloadKey[] | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/admin/keys/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ count }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Admin: access requests ────────────────────────────────────────────────────

export interface AccessRequestItem {
  id: number;
  email: string;
  name: string;
  github_id: string;
  status: AccessRequestStatus;
  created_at: string;
  decided_at: string | null;
  key_id: number | null;
}

export interface RequestStats {
  pending: number;
  granted: number;
  denied: number;
  total: number;
}

export interface RequestsResponse {
  items: AccessRequestItem[];
  total: number;
  limit: number;
  offset: number;
  stats: RequestStats;
}

export async function listAdminRequests(
  token: string,
  params: SearchParams = {}
): Promise<RequestsResponse | null> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/access-requests?${buildQuery(params)}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function adminRequestSuggestions(
  token: string,
  q: string
): Promise<string[]> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/access-requests/suggestions?q=${encodeURIComponent(q)}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
    );
    if (!res.ok) return [];
    const body = await res.json();
    return body.suggestions ?? [];
  } catch {
    return [];
  }
}

export async function grantAdminRequest(
  token: string,
  id: number,
  baseUrl?: string | null
): Promise<
  | { ok: true; keyValue: string; emailSent: boolean }
  | { ok: false; error: string }
> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/access-requests/${id}/grant`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, ...baseUrlHeader(baseUrl) },
        cache: "no-store",
      }
    );
    const body = await res.json();
    if (res.ok)
      return { ok: true, keyValue: body.key_value, emailSent: body.email_sent };
    return { ok: false, error: body?.detail ?? "Could not grant request." };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export async function denyAdminRequest(
  token: string,
  id: number
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/access-requests/${id}/deny`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
    );
    if (res.ok) return { ok: true };
    const body = await res.json();
    return { ok: false, error: body?.detail ?? "Could not deny request." };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

// ── Review ────────────────────────────────────────────────────────────────────

export interface PublicReview {
  id: number;
  name: string;
  github_id: string;
  project_link: string;
  review_text: string;
  submitted_at: string;
}

// Public — powers the Builder Archive on the landing page. Fetched server-side
// in the landing page component; returns [] if the backend is unreachable so the
// section degrades to its empty state rather than throwing.
export async function getPublicReviews(): Promise<PublicReview[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/reviews`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// No-login submission — the download key identifies the author. Powers the
// "add review" flow in the Builder Archive.
export async function submitReviewByKey(data: {
  key_value: string;
  project_link: string;
  review_text: string;
}): Promise<{ ok: true; name: string } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/reviews/by-key`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    const body = await res.json();
    if (res.ok) return { ok: true, name: body.name };
    const message =
      typeof body?.detail === "string"
        ? body.detail
        : "Could not submit your review. Please check your details and try again.";
    return { ok: false, error: message };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

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
