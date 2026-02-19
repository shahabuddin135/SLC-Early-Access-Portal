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
      auth: "JWT via python-jose + direct bcrypt (no passlib)"
      hosting: "Railway / Render / Fly.io (standard ASGI — NOT Vercel serverless)"
      file_storage: "Supabase Storage (private bucket) — accessed via SUPABASE_SERVICE_KEY"

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
    - "DOWNLOAD_FILE_URL and SUPABASE_SERVICE_KEY are backend-only env vars — never set on Vercel"
    - "Admin access is enforced by TWO guards: get_admin_user dependency (backend) + SSR email check (frontend)"
    - "Download keys are single-use — never regenerate or reuse after redemption"
    - "Download tokens are single-use UUID, 60s TTL — never extend or bypass"
    - "All datetime columns use TIMESTAMP WITHOUT TIME ZONE — strip tzinfo before writes with .replace(tzinfo=None)"
@end
```
