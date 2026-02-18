# CONSTRAINTS.md — Reality Anchor

> **Hard limits. These override all plans and tasks.**
> LLMs must not propose solutions outside these constraints.

---

```slc
@block CONSTRAINTS tech_stack
priority: critical
intent: "Define the fixed technology stack for the SLC Early Access Portal"
scope: global
depends_on: none

content:
  tech:
    frontend:
      framework: "Next.js (App Router)"
      language: "TypeScript"
      styling: "Vanilla CSS + CSS Modules"
      font: "Geist (pixel variant)"
      hosting: "Vercel"

    backend:
      framework: "FastAPI"
      language: "Python 3.12+"
      orm: "SQLModel"
      auth: "JWT via python-jose + passlib[bcrypt]"
      hosting: "Vercel (serverless functions)"

    database:
      provider: "Neon PostgreSQL"
      connection: "asyncpg via SQLModel async engine"

  scale:
    expected_users: "< 10,000 for v1 early access"
    concurrent_requests: "< 500"
    file_size: "SLC download files < 50MB total"
    database_size: "< 1GB for v1"

  hard_rules:
    - "No ORM other than SQLModel"
    - "No CSS framework (no Tailwind, no Bootstrap) — Vanilla CSS only"
    - "Font must be Geist — no substitutions"
    - "Theme: orange (#F97316), black (#0A0A0A), gray (#6B7280) — no other primary colors"
    - "Design must follow Vercel-style: sharp, sleek, minimal, high-contrast"
    - "No raw SQL strings — use SQLModel query builders"
    - "No synchronous database calls — async only"
    - "No secrets in frontend code or environment variables exposed to client"
    - "All API calls from frontend must go through Next.js API routes or server actions"
    - "No third-party auth providers (no OAuth, no Auth0) for v1"
@end
```
