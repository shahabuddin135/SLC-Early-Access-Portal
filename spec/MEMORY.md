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
      decision: "Both frontend and backend are hosted on Vercel"
      rationale: "Unified deployment, easy CI/CD, free tier available"
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
      decision: "Download is a protected route — requires valid JWT"
      rationale: "Only registered users can download SLC files"
      date: "2026-02-19"

    - id: D7
      decision: "No email verification in v1"
      rationale: "Explicitly excluded from scope in CONTEXT.md"
      date: "2026-02-19"

  assumptions:
    - id: A1
      assumption: "Single-tenant system — no multi-org or team support"
    - id: A2
      assumption: "All users have the same role — no admin/user distinction in v1"
    - id: A3
      assumption: "SLC download files are static assets hosted on Vercel or a CDN"
    - id: A4
      assumption: "Review submission is one-per-user (user can update but not create multiple)"
    - id: A5
      assumption: "GitHub ID is a plain string field — no format validation beyond non-empty"

  do_not_change:
    - "Theme colors: orange (#F97316), black (#0A0A0A), gray (#6B7280)"
    - "Font: Geist pixel — no substitutions"
    - "Tech stack as defined in CONSTRAINTS.md"
    - "User journey order: register → login → dashboard → download → review"
    - "JWT expiry: 24 hours"
    - "Password hashing: bcrypt only"
@end
```
