# SECURITY.md — Global Security Law

> **This file overrides convenience, speed, and creativity.**
> Violations must be explicitly reported.
> LLMs must refuse to generate insecure code.

---

```slc
@block CONSTRAINTS security_rules
priority: critical
intent: "Define security rules that apply to all code in the portal"
scope: global
depends_on: none

content:
  backend_rules:
    passwords:
      - "Hash all passwords with bcrypt (passlib[bcrypt]) before storing"
      - "Never log, return, or expose raw passwords"
      - "Minimum password length: 8 characters (enforced at API level)"

    authentication:
      - "Use JWT (HS256) with expiry of 24 hours for access tokens"
      - "Store JWT secret in environment variable — never hardcode"
      - "Validate JWT on every protected endpoint via FastAPI dependency"
      - "Return 401 Unauthorized for missing or invalid tokens"
      - "Return 403 Forbidden for valid token but insufficient access"

    database:
      - "Use parameterized queries only — no string interpolation in queries"
      - "Never expose internal database errors to the client"
      - "Database credentials must be in environment variables only"

    rate_limiting:
      - "Rate limit POST /auth/register: 5 requests per IP per minute"
      - "Rate limit POST /auth/login: 10 requests per IP per minute"
      - "Use slowapi or equivalent FastAPI-compatible rate limiter"

    general:
      - "Validate all input with Pydantic models — reject unknown fields"
      - "Set CORS to allow only the frontend Vercel domain in production"
      - "Never return stack traces or internal errors to the client"
      - "Use HTTPS only — no HTTP in production"

  frontend_rules:
    tokens:
      - "Store JWT in httpOnly cookie — never in localStorage or sessionStorage"
      - "Never expose JWT or user secrets in client-side JavaScript"
      - "Clear token on logout by deleting the cookie server-side"

    forms:
      - "Sanitize all user inputs before sending to API"
      - "Validate form fields client-side AND rely on server-side validation as source of truth"
      - "Never trust client-side validation alone"

    general:
      - "No secrets in .env.local that are prefixed with NEXT_PUBLIC_"
      - "All sensitive API calls must go through Next.js server actions or API routes"
      - "Content Security Policy headers must be set via next.config.js"

  api_rules:
    contracts:
      - "All endpoints must validate request body against Pydantic schema"
      - "All endpoints must return typed response models"
      - "No endpoint may return raw database row objects"
      - "HTTP status codes must be semantically correct (201 for create, 200 for read, etc.)"

    headers:
      - "Set X-Content-Type-Options: nosniff"
      - "Set X-Frame-Options: DENY"
      - "Set Referrer-Policy: strict-origin-when-cross-origin"
@end
```
