# frontend_specs/CONTRACT.md — Frontend API Contract

> **Derived from backend_specs/CONTRACT.md.**
> Defines how the frontend consumes each API endpoint.
> No new endpoints may be invented here.

---

```slc
@block ARCH frontend_api_contract
priority: critical
intent: "Define how the frontend consumes each backend API endpoint"
scope: global
depends_on: [backend_specs/CONTRACT.md]

content:
  base_url: "process.env.BACKEND_URL + /api/v1"
  call_method: "All calls via Next.js server actions — never direct client fetch"

  consumed_endpoints:

    - backend_ref: "AUTH-01"
      path: "POST /auth/register"
      called_from: "RegisterForm server action"
      sends:
        name:      string
        email:     string
        github_id: string
        password:  string
      on_success_201:
        - "Show success message"
        - "Redirect to /login"
      on_error_409:
        - "Show: 'This email is already registered'"
      on_error_422:
        - "Show field-level validation errors"

    - backend_ref: "AUTH-02"
      path: "POST /auth/login"
      called_from: "LoginForm server action"
      sends:
        email:    string
        password: string
      on_success_200:
        - "Store access_token in httpOnly cookie (name: slc_token)"
        - "Store user data in cookie or server session"
        - "Redirect to /dashboard"
      on_error_401:
        - "Show: 'Invalid email or password'"

    - backend_ref: "DASH-01"
      path: "GET /dashboard"
      called_from: "Dashboard page server component (SSR)"
      sends:
        Authorization: "Bearer <token from cookie>"
      on_success_200:
        - "Render ProfileHeader with name, email, github_id"
        - "Render DownloadSection — show download button"
        - "If has_downloaded == true: show ReviewForm"
      on_error_401:
        - "Redirect to /login"

    - backend_ref: "DL-01"
      path: "GET /download"
      called_from: "DownloadSection server action"
      sends:
        Authorization: "Bearer <token from cookie>"
      on_success_200:
        - "Trigger file download via download_url"
        - "Set has_downloaded = true in local state"
        - "Show ReviewForm"
      on_error_401:
        - "Redirect to /login"

    - backend_ref: "REV-01"
      path: "POST /review"
      called_from: "ReviewForm server action"
      sends:
        Authorization: "Bearer <token from cookie>"
        project_link:  string (URL)
        review_text:   string
      on_success_201:
        - "Show success message: 'Review submitted! Thank you.'"
        - "Disable form or show submitted state"
      on_error_403:
        - "Show: 'Please download the SLC files first'"
      on_error_422:
        - "Show field-level validation errors"

  cookie_spec:
    name: "slc_token"
    type: "httpOnly"
    same_site: "Strict"
    secure: true
    max_age: 86400
    set_by: "Next.js server action after login"
    cleared_by: "Next.js server action on logout"
@end
```
