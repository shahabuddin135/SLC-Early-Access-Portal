// Server-only: derive the public origin a user is actually on, so emailed links
// (verification, reset, dashboard) auto-adapt to any deployment — production,
// Vercel preview, or custom domain — with zero manual config. Forwarded to the
// backend via the X-App-Base-Url header, where it's validated against an allowlist.
import { headers } from "next/headers";

function buildBaseUrl(host: string | null, proto: string | null): string | null {
  if (!host) return null;
  const scheme =
    proto ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${scheme}://${host}`;
}

/** Build the base URL from a Headers object (e.g. a route handler's `req.headers`). */
export function baseUrlFromHeaders(h: Headers): string | null {
  return buildBaseUrl(
    h.get("x-forwarded-host") ?? h.get("host"),
    h.get("x-forwarded-proto")
  );
}

/** Build the base URL from the current request context (server component / action). */
export async function getRequestBaseUrl(): Promise<string | null> {
  try {
    return baseUrlFromHeaders(await headers());
  } catch {
    return null;
  }
}
