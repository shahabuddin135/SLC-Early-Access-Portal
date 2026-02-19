# MEMORY.md — Anti-Hallucination Anchor

> **If a conflict arises, MEMORY.md always wins.**
> This file prevents drift, contradictions, and hallucinated changes.
> All decisions recorded here are final unless user explicitly overrides.

---

```slc
@block ANCHOR project_memory
priority: critical
intent: "Frozen decisions, assumptions, and immutable facts for the portal"
scope: global
depends_on: none

content:
  decisions:
    - id: D1
      decision: "Authentication is JWT-based, stored in httpOnly cookie"
      rationale: "Security requirement — no localStorage exposure"
      date: "2026-02-19"

    - id: D2
      decision: "Database is Neon PostgreSQL with async SQLModel"
      rationale: "Serverless-compatible, free tier sufficient for v1"
      date: "2026-02-19"

    - id: D3
      decision: "Frontend is hosted on Vercel; backend is hosted on a standard ASGI host (Railway / Render / Fly.io)"
      rationale: "FastAPI requires a persistent ASGI server — Vercel serverless is not compatible"
      date: "2026-02-19"

    - id: D4
      decision: "Review form appears only after the user has downloaded the files"
      rationale: "Ensures review is based on actual usage"
      date: "2026-02-19"

    - id: D5
      decision: "GitHub ID is collected at registration but not verified via OAuth"
      rationale: "Simplicity for v1 — no OAuth integration"
      date: "2026-02-19"

    - id: D6
      decision: "Download requires a valid one-time key redeemed via POST /redeem"
      rationale: "Prevents unauthorized access; keys are generated and managed by admins"
      date: "2026-02-19"

    - id: D7
      decision: "No email verification in v1"
      rationale: "Explicitly excluded from scope in CONTEXT.md"
      date: "2026-02-19"

    - id: D8
      decision: "Password hashing uses bcrypt directly — passlib removed"
      rationale: "passlib 1.7.4 is incompatible with bcrypt 4.x; direct bcrypt.hashpw/checkpw is simpler and maintained"
      date: "2026-02-19"

    - id: D9
      decision: "Users must agree to WeWise Labs NDA/Terms before accessing the dashboard"
      rationale: "Legal requirement — terms_agreed_at stored in DB; blocking modal on first login"
      date: "2026-02-19"

    - id: D10
      decision: "5 hardcoded admin emails control key generation and admin dashboard access"
      rationale: "Simple admin system for v1 — no admin role in DB; enforced in app/constants.py and SSR page guard"
      date: "2026-02-19"

    - id: D11
      decision: "SLC files are stored in a private Supabase Storage bucket"
      rationale: "Files must not be publicly accessible — FastAPI fetches using SUPABASE_SERVICE_KEY"
      date: "2026-02-19"

    - id: D12
      decision: "Download uses a single-use UUID token (60s TTL) issued after key redemption"
      rationale: "Decouples key validation from file streaming; prevents token reuse and link sharing"
      date: "2026-02-19"

  assumptions:
    - id: A1
      assumption: "Single-tenant system — no multi-org or team support"
    - id: A2
      assumption: "Admin role is granted by email inclusion in ADMIN_EMAILS frozenset — no DB role column"
    - id: A3
      assumption: "SLC download files live in a private Supabase Storage bucket; URL + service key are FastAPI-only env vars"
    - id: A4
      assumption: "Review submission is one-per-user (user can update but not create multiple)"
    - id: A5
      assumption: "GitHub ID is a plain string field — no format validation beyond non-empty"
    - id: A6
      assumption: "Each download key is single-use; once redeemed it is permanently marked used with email + timestamp"
    - id: A7
      assumption: "Download tokens expire after 60 seconds and are single-use regardless of expiry"

  do_not_change:
    - "Theme colors: orange (#F97316), black (#0A0A0A), gray (#6B7280)"
    - "Font: Geist pixel — no substitutions"
    - "Tech stack as defined in CONSTRAINTS.md"
    - "User journey order: register → login → terms modal → dashboard → download warning → key entry → download → review"
    - "JWT expiry: 24 hours"
    - "Password hashing: direct bcrypt only (no passlib)"
    - "Admin emails: voyagersvrs135@gmail.com, aleemabeera@gmail.com, sarfarazsaba11@gmail.com, darakhshanimranid@gmail.com, myscienceworld135@gmail.com"
    - "Key format: XXXX-XXXX-XXXX-XXXX using secrets.token_hex(2).upper()"
    - "Download token TTL: 60 seconds"
@end
```
