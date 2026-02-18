# backend_specs/ARCH.md — Backend Architecture

> **No tasks. No code. Architecture only.**
> Defines data models, control flow, and system boundaries.
> This file is authoritative for all backend implementation.

---

```slc
@block ARCH user_model
priority: critical
intent: "Define the User data model"
scope: global
depends_on: none

content:
  data_model:
    table: "users"
    fields:
      - id:         { type: int, primary_key: true, auto_increment: true }
      - name:       { type: string, max_length: 100, nullable: false }
      - email:      { type: string, max_length: 255, nullable: false, unique: true }
      - github_id:  { type: string, max_length: 100, nullable: false }
      - password_hash: { type: string, nullable: false }
      - has_downloaded: { type: bool, default: false }
      - created_at: { type: timestamp, default: "now()" }

  constraints:
    - "email must be unique"
    - "password_hash is bcrypt hash — never plain text"
    - "has_downloaded tracks whether user has triggered download"
@end

@block ARCH review_model
priority: critical
intent: "Define the ReviewSubmission data model"
scope: global
depends_on: [ARCH.user_model]

content:
  data_model:
    table: "review_submissions"
    fields:
      - id:           { type: int, primary_key: true, auto_increment: true }
      - user_id:      { type: int, foreign_key: "users.id", nullable: false }
      - project_link: { type: string, max_length: 500, nullable: false }
      - review_text:  { type: string, max_length: 2000, nullable: false }
      - submitted_at: { type: timestamp, default: "now()" }

  constraints:
    - "One review per user (unique constraint on user_id)"
    - "project_link must be a valid URL"
    - "review_text must be non-empty"
@end

@block ARCH download_event_model
priority: high
intent: "Track download events per user"
scope: global
depends_on: [ARCH.user_model]

content:
  data_model:
    table: "download_events"
    fields:
      - id:           { type: int, primary_key: true, auto_increment: true }
      - user_id:      { type: int, foreign_key: "users.id", nullable: false }
      - downloaded_at: { type: timestamp, default: "now()" }
      - ip_address:   { type: string, max_length: 45, nullable: true }

  notes: "Tracks each download event. User can download multiple times but has_downloaded flag is set on first download."
@end

@block ARCH control_flow
priority: critical
intent: "Define the system control flow and request lifecycle"
scope: global
depends_on: [ARCH.user_model, ARCH.review_model]

content:
  flows:
    - name: "Registration Flow"
      steps:
        - "Client sends POST /auth/register with {name, email, github_id, password}"
        - "API validates input via Pydantic schema"
        - "API checks email uniqueness — 409 if duplicate"
        - "API hashes password with bcrypt"
        - "API inserts user record into DB"
        - "API returns 201 with {id, name, email}"

    - name: "Login Flow"
      steps:
        - "Client sends POST /auth/login with {email, password}"
        - "API validates input via Pydantic schema"
        - "API fetches user by email — 401 if not found"
        - "API verifies bcrypt hash — 401 if mismatch"
        - "API generates JWT with {sub: user_id, exp: +24h}"
        - "API returns 200 with JWT in response body (frontend stores in httpOnly cookie)"

    - name: "Dashboard Flow"
      steps:
        - "Client sends GET /dashboard with Authorization: Bearer <token>"
        - "API validates JWT via dependency"
        - "API fetches user record"
        - "API returns {name, email, github_id, has_downloaded}"

    - name: "Download Flow"
      steps:
        - "Client sends GET /download with Authorization: Bearer <token>"
        - "API validates JWT"
        - "API records download event in download_events"
        - "API sets user.has_downloaded = true"
        - "API returns download URL or signed link to SLC files"

    - name: "Review Submission Flow"
      steps:
        - "Client sends POST /review with {project_link, review_text} + Authorization"
        - "API validates JWT"
        - "API checks user.has_downloaded == true — 403 if false"
        - "API validates payload via Pydantic"
        - "API upserts review (one per user)"
        - "API returns 201 with review record"

  boundaries:
    - "No business logic in route handlers — use service layer"
    - "Route handlers only: validate input, call service, return response"
    - "Database access only through SQLModel session — no raw asyncpg"
    - "JWT validation is a FastAPI Depends() — not inline in routes"
@end

@block ARCH project_structure
priority: high
intent: "Define the backend folder structure"
scope: global
depends_on: none

content:
  structure:
    backend/:
      main.py:          "FastAPI app factory, router registration, CORS"
      pyproject.toml:   "UV-managed dependencies"
      .env:             "Environment variables (not committed)"
      app/:
        models/:
          user.py:      "User SQLModel"
          review.py:    "ReviewSubmission SQLModel"
          download.py:  "DownloadEvent SQLModel"
        schemas/:
          auth.py:      "Pydantic request/response schemas for auth"
          review.py:    "Pydantic schemas for review"
          dashboard.py: "Pydantic schemas for dashboard"
        routers/:
          auth.py:      "POST /auth/register, POST /auth/login"
          dashboard.py: "GET /dashboard"
          download.py:  "GET /download"
          review.py:    "POST /review"
        services/:
          auth_service.py:     "Registration, login, JWT logic"
          download_service.py: "Download event recording"
          review_service.py:   "Review upsert logic"
        core/:
          database.py:  "Async SQLModel engine and session"
          security.py:  "JWT encode/decode, bcrypt helpers"
          config.py:    "Settings via pydantic-settings"
        dependencies/:
          auth.py:      "get_current_user FastAPI dependency"
@end
```
