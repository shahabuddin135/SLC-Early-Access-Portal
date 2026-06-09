import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com; font-src 'self' data:;",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

// PostHog ingestion hosts (override per region via env; defaults to US cloud).
const POSTHOG_HOST = process.env.POSTHOG_HOST ?? "https://us.i.posthog.com";
const POSTHOG_ASSET_HOST =
  process.env.POSTHOG_ASSET_HOST ?? "https://us-assets.i.posthog.com";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/download/file": ["./files/**"],
  },
  // Required so the PostHog proxy paths below aren't trailing-slash redirected.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    // Same-origin reverse proxy for PostHog — keeps all analytics traffic on our
    // own origin so the strict Content-Security-Policy doesn't need loosening.
    return [
      { source: "/ingest/static/:path*", destination: `${POSTHOG_ASSET_HOST}/static/:path*` },
      { source: "/ingest/:path*", destination: `${POSTHOG_HOST}/:path*` },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
