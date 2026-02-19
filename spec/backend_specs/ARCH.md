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
      - id:              { type: int, primary_key: true, auto_increment: true }
      - name:            { type: string, max_length: 100, nullable: false }
      - email:           { type: string, max_length: 255, nullable: false, unique: true }
      - github_id:       { type: string, max_length: 100, nullable: false }
      - password_hash:   { type: string, nullable: false }
      - has_downloaded:  { type: bool, default: false }
      - terms_agreed_at: { type: timestamp, nullable: true, default: null }
      - created_at:      { type: timestamp, default: "now()" }

  constraints:
    - "email must be unique"
    - "password_hash is bcrypt hash — never plain text"
    - "has_downloaded tracks whether user has triggered download"
    - "terms_agreed_at is null until user agrees to WeWise Labs NDA; null means modal must be shown"
    - "terms_agreed_at column added via ALTER TABLE IF NOT EXISTS — not dropped/recreated"
@end

@block ARCH key_model
priority: critical
intent: "Define the Key data model for one-time download keys"
scope: global
depends_on: none

content:
  data_model:
    table: "keys"
    fields:
      - id:         { type: int, primary_key: true, auto_increment: true }
      - key_value:  { type: string, max_length: 19, unique: true, nullable: false }
      - used:       { type: bool, default: false, nullable: false }
      - created_at: { type: timestamp, default: "now()", nullable: false }
      - used_at:    { type: timestamp, nullable: true }
      - used_by:    { type: string, max_length: 255, nullable: true }

  constraints:
    - "key_value format: XXXX-XXXX-XXXX-XXXX (4 groups of 4 uppercase hex chars)"
    - "key_value generated via secrets.token_hex(2).upper() × 4 joined by '-'"
    - "used is set to true atomically on redemption via SELECT FOR UPDATE"
    - "used_by stores the email of the user who redeemed the key"
    - "used_at stores the UTC timestamp of redemption (tzinfo stripped)"
    - "Keys cannot be un-used — redemption is permanent"
@end

@block ARCH download_token_model
priority: critical
intent: "Define the DownloadToken model for single-use, short-lived file access tokens"
scope: global
depends_on: [ARCH.user_model, ARCH.key_model]

content:
  data_model:
    table: "download_tokens"
    fields:
      - id:           { type: int, primary_key: true, auto_increment: true }
      - token_value:  { type: string, max_length: 36, unique: true, nullable: false }
      - user_id:      { type: int, foreign_key: "users.id", nullable: false }
      - created_at:   { type: timestamp, default: "now()", nullable: false }
      - used:         { type: bool, default: false, nullable: false }

  constraints:
    - "token_value is UUID v4 (str)"
    - "TTL is 60 seconds — checked at validation time: (now - created_at).seconds > DOWNLOAD_TOKEN_TTL → 410 Gone"
    - "Tokens are consumed atomically via SELECT FOR UPDATE on first use"
    - "A used or expired token returns 410 Gone"
    - "Token is issued exactly once per successful key redemption"
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

    - name: "Terms Agreement Flow"
      steps:
        - "Client sends POST /terms/agree with Authorization: Bearer <token>"
        - "API validates JWT"
        - "API sets user.terms_agreed_at = now() (tzinfo stripped)"
        - "API returns 200 with {agreed: true, terms_agreed_at: timestamp}"
        - "Dashboard shows terms modal when terms_agreed_at is null"

    - name: "Key Redemption Flow"
      steps:
        - "Client sends POST /redeem with {key_value} + Authorization: Bearer <token>"
        - "API validates JWT"
        - "API executes SELECT FOR UPDATE on keys table where key_value matches"
        - "If not found or used == true → 400 Bad Request"
        - "API marks key: used=true, used_at=now(), used_by=user.email"
        - "API calls create_download_token(user_id) → inserts UUID into download_tokens"
        - "API returns 200 with {download_token: uuid_string}"

    - name: "Download Flow"
      steps:
        - "Client sends GET /download?token=<uuid> (no Authorization header)"
        - "API executes SELECT FOR UPDATE on download_tokens where token_value matches"
        - "If not found or used == true → 410 Gone"
        - "If (now - created_at).seconds > 60 → 410 Gone"
        - "API marks token used=true"
        - "API sets user.has_downloaded = true, inserts DownloadEvent"
        - "API fetches file from DOWNLOAD_FILE_URL (Supabase private bucket) using SUPABASE_SERVICE_KEY as Bearer token"
        - "API streams file as application/zip with Content-Disposition: attachment"

    - name: "Admin Key Generation Flow"
      steps:
        - "Client sends POST /admin/keys/generate with {count: 1-100} + Authorization: Bearer <admin token>"
        - "API validates JWT + checks email in ADMIN_EMAILS frozenset (get_admin_user dependency)"
        - "API generates count unique XXXX-XXXX-XXXX-XXXX keys"
        - "API inserts keys into keys table"
        - "API returns 201 with list of KeyOut objects"

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
      constants.py:     "ADMIN_EMAILS frozenset (5 hardcoded emails) + DOWNLOAD_TOKEN_TTL=60"
      migrate.py:       "Run once to create/alter all tables in Neon"
      app/:
        models/:
          user.py:           "User SQLModel (includes terms_agreed_at)"
          review.py:         "ReviewSubmission SQLModel"
          download.py:       "DownloadEvent SQLModel"
          key.py:            "Key SQLModel (one-time download keys)"
          download_token.py: "DownloadToken SQLModel (single-use 60s tokens)"
        schemas/:
          auth.py:      "Pydantic request/response schemas for auth"
          review.py:    "Pydantic schemas for review"
          dashboard.py: "Pydantic schemas for dashboard"
        routers/:
          auth.py:      "POST /auth/register, POST /auth/login"
          dashboard.py: "GET /dashboard"
          download.py:  "GET /download?token= (token-based, no JWT)"
          review.py:    "POST /review"
          terms.py:     "POST /terms/agree"
          redeem.py:    "POST /redeem (JWT required)"
          admin.py:     "GET /admin/keys, POST /admin/keys/generate (admin JWT required)"
        services/:
          auth_service.py:     "Registration, login, JWT logic"
          download_service.py: "Download event recording"
          review_service.py:   "Review upsert logic"
          key_service.py:      "generate_keys, list_keys, redeem_key (atomic)"
          token_service.py:    "create_download_token, validate_and_use_token (atomic)"
          terms_service.py:    "record_terms_agreement"
        core/:
          database.py:  "Async SQLModel engine and session; runs create_all + ALTER TABLE on startup"
          security.py:  "JWT encode/decode, bcrypt helpers (direct bcrypt — no passlib)"
          config.py:    "Settings: DATABASE_URL, SECRET_KEY, DOWNLOAD_FILE_URL, SUPABASE_SERVICE_KEY, etc."
        dependencies/:
          auth.py:      "get_current_user FastAPI dependency"
          admin.py:     "get_admin_user dependency (raises 403 if email not in ADMIN_EMAILS)"
@end
```
