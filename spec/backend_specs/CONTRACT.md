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
            id:             { type: int }
            name:           { type: string }
            email:          { type: string }
            github_id:      { type: string }
            has_downloaded: { type: bool }
        401:
          description: "Missing or invalid token"

    - id: "DL-01"
      method: GET
      path: "/download"
      auth_required: true
      description: "Trigger download — records event and returns download URL"
      request_headers:
        Authorization: "Bearer <token>"
      responses:
        200:
          description: "Download URL returned"
          schema:
            download_url:   { type: string, format: uri }
            has_downloaded: { type: bool, value: true }
        401:
          description: "Missing or invalid token"

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
