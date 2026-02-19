# backend_specs/CONTRACT.md — API Contract

> **This file is authoritative for the frontend.**
> Frontend must derive all API calls from this file.
> No endpoint may be invented outside this contract.

---

```slc
@block ARCH api_contract
priority: critical
intent: "Define all API endpoints, request schemas, and response schemas"
scope: global
depends_on: [backend_specs/ARCH.md]

content:
  base_url: "/api/v1"

  endpoints:

    - id: "AUTH-01"
      method: POST
      path: "/auth/register"
      auth_required: false
      description: "Register a new user"
      request_body:
        content_type: "application/json"
        schema:
          name:      { type: string, required: true, max_length: 100 }
          email:     { type: string, required: true, format: email }
          github_id: { type: string, required: true, max_length: 100 }
          password:  { type: string, required: true, min_length: 8 }
      responses:
        201:
          description: "User created successfully"
          schema:
            id:    { type: int }
            name:  { type: string }
            email: { type: string }
        409:
          description: "Email already registered"
          schema:
            detail: { type: string }
        422:
          description: "Validation error"

    - id: "AUTH-02"
      method: POST
      path: "/auth/login"
      auth_required: false
      description: "Log in and receive JWT"
      request_body:
        content_type: "application/json"
        schema:
          email:    { type: string, required: true }
          password: { type: string, required: true }
      responses:
        200:
          description: "Login successful"
          schema:
            access_token: { type: string }
            token_type:   { type: string, value: "bearer" }
            user:
              id:    { type: int }
              name:  { type: string }
              email: { type: string }
        401:
          description: "Invalid credentials"
          schema:
            detail: { type: string }

    - id: "DASH-01"
      method: GET
      path: "/dashboard"
      auth_required: true
      description: "Get current user dashboard data"
      request_headers:
        Authorization: "Bearer <token>"
      responses:
        200:
          description: "Dashboard data"
          schema:
            id:               { type: int }
            name:             { type: string }
            email:            { type: string }
            github_id:        { type: string }
            has_downloaded:   { type: bool }
            has_agreed_terms: { type: bool, derived: "terms_agreed_at != null" }
        401:
          description: "Missing or invalid token"

    - id: "TERMS-01"
      method: POST
      path: "/terms/agree"
      auth_required: true
      description: "Record that user has agreed to WeWise Labs NDA/Terms"
      request_headers:
        Authorization: "Bearer <token>"
      responses:
        200:
          description: "Agreement recorded"
          schema:
            agreed:           { type: bool, value: true }
            terms_agreed_at:  { type: timestamp }
        401:
          description: "Missing or invalid token"

    - id: "REDEEM-01"
      method: POST
      path: "/redeem"
      auth_required: true
      description: "Redeem a one-time download key — returns a single-use 60s download token"
      request_headers:
        Authorization: "Bearer <token>"
      request_body:
        content_type: "application/json"
        schema:
          key_value: { type: string, required: true, pattern: "XXXX-XXXX-XXXX-XXXX" }
      responses:
        200:
          description: "Key redeemed — download token returned"
          schema:
            download_token: { type: string, format: uuid }
        400:
          description: "Invalid or already used key"
          schema:
            detail: { type: string }
        401:
          description: "Missing or invalid token"

    - id: "DL-01"
      method: GET
      path: "/download"
      auth_required: false
      description: "Validate single-use token and stream ZIP from private Supabase Storage. Token IS the credential."
      query_params:
        token: { type: string, required: true, format: uuid }
      responses:
        200:
          description: "ZIP file streamed as application/zip"
          headers:
            Content-Disposition: 'attachment; filename="slc-framework.zip"'
            Cache-Control: "no-store, no-cache, must-revalidate"
            X-Content-Type-Options: "nosniff"
        410:
          description: "Token already used, expired (>60s), or not found"
          schema:
            detail: { type: string }
        503:
          description: "DOWNLOAD_FILE_URL not configured or Supabase unreachable"

    - id: "ADMIN-01"
      method: GET
      path: "/admin/keys"
      auth_required: true
      admin_required: true
      description: "List all download keys with stats (admin only)"
      request_headers:
        Authorization: "Bearer <admin token>"
      responses:
        200:
          description: "Keys list with aggregate stats"
          schema:
            total:  { type: int }
            used:   { type: int }
            unused: { type: int }
            keys:   { type: array, items: KeyOut }
        403:
          description: "User is not an admin"

    - id: "ADMIN-02"
      method: POST
      path: "/admin/keys/generate"
      auth_required: true
      admin_required: true
      description: "Generate 1–100 new one-time download keys (admin only)"
      request_headers:
        Authorization: "Bearer <admin token>"
      request_body:
        content_type: "application/json"
        schema:
          count: { type: int, required: true, min: 1, max: 100 }
      responses:
        201:
          description: "Keys generated"
          schema:
            type: array
            items: KeyOut
        403:
          description: "User is not an admin"
        422:
          description: "count out of range"

    - id: "REV-01"
      method: POST
      path: "/review"
      auth_required: true
      description: "Submit or update project review (requires has_downloaded == true)"
      request_headers:
        Authorization: "Bearer <token>"
      request_body:
        content_type: "application/json"
        schema:
          project_link: { type: string, required: true, format: uri, max_length: 500 }
          review_text:  { type: string, required: true, min_length: 10, max_length: 2000 }
      responses:
        201:
          description: "Review submitted"
          schema:
            id:           { type: int }
            user_id:      { type: int }
            project_link: { type: string }
            review_text:  { type: string }
            submitted_at: { type: timestamp }
        403:
          description: "User has not downloaded files yet"
          schema:
            detail: { type: string }
        401:
          description: "Missing or invalid token"
        422:
          description: "Validation error"

  error_format:
    description: "All error responses follow this shape"
    schema:
      detail: { type: string }
@end
```
