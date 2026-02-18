# frontend_specs/ARCH.md — Frontend Architecture

> **No tasks. No code. Architecture only.**
> Frontend MUST derive from backend CONTRACT.md.
> No API invention allowed.

---

```slc
@block ARCH frontend_state
priority: critical
intent: "Define the frontend state shape"
scope: global
depends_on: [backend_specs/CONTRACT.md]

content:
  state_shape:
    auth:
      token: { type: string, storage: "httpOnly cookie", managed_by: "Next.js server action" }
      user:
        id:             { type: int | null }
        name:           { type: string | null }
        email:          { type: string | null }
        github_id:      { type: string | null }
        has_downloaded: { type: bool, default: false }
      is_authenticated: { type: bool, derived: "token != null" }

    ui:
      loading:        { type: bool }
      error:          { type: string | null }
      review_visible: { type: bool, derived: "user.has_downloaded == true" }
@end

@block ARCH ui_flow
priority: critical
intent: "Define the UI page flow and routing"
scope: global
depends_on: [ARCH.frontend_state]

content:
  routes:
    - path: "/"
      page: "Landing / Register"
      auth_required: false
      redirect_if_authed: "/dashboard"

    - path: "/login"
      page: "Login"
      auth_required: false
      redirect_if_authed: "/dashboard"

    - path: "/dashboard"
      page: "Dashboard"
      auth_required: true
      redirect_if_unauthed: "/login"

  flow:
    - "User lands on / → sees Register form"
    - "After register → redirected to /login"
    - "After login → redirected to /dashboard"
    - "Dashboard shows: profile header, download button"
    - "After clicking download → file downloads, review form appears"
    - "User fills review form and submits"

  components:
    - RegisterForm:     "Name, email, GitHub ID, password fields + submit"
    - LoginForm:        "Email, password fields + submit"
    - ProfileHeader:    "Shows user name, email, GitHub ID"
    - DownloadSection:  "Download button + status indicator"
    - ReviewForm:       "Project link + review text + submit (visible after download)"
@end

@block ARCH rendering_strategy
priority: high
intent: "Define rendering strategy per page"
scope: global
depends_on: [ARCH.ui_flow]

content:
  pages:
    - route: "/"
      strategy: "SSG (Static Site Generation)"
      reason: "No dynamic data needed for register form"

    - route: "/login"
      strategy: "SSG"
      reason: "No dynamic data needed for login form"

    - route: "/dashboard"
      strategy: "SSR (Server-Side Rendering)"
      reason: "User data must be fetched server-side with auth cookie"
      data_fetch: "GET /api/v1/dashboard via server action"

  api_calls:
    - "All API calls go through Next.js server actions or API route handlers"
    - "No direct fetch() calls to FastAPI from client-side components"
    - "JWT stored in httpOnly cookie — set by server action after login"
    - "Cookie cleared by server action on logout"

  design_tokens:
    colors:
      primary:    "#F97316"   # orange
      background: "#0A0A0A"   # black
      surface:    "#111111"   # near-black card surface
      muted:      "#6B7280"   # gray
      text:       "#FFFFFF"   # white
      text_muted: "#9CA3AF"   # light gray

    typography:
      font_family: "Geist, monospace"
      font_source: "next/font/local or @vercel/geist"

    spacing:
      base: "8px"

    borders:
      radius: "4px"   # sharp, Vercel-style — no large radius
      color:  "#222222"
@end

@block ARCH project_structure
priority: high
intent: "Define the frontend folder structure"
scope: global
depends_on: none

content:
  structure:
    frontend/:
      package.json:         "Next.js + TypeScript dependencies"
      next.config.js:       "CSP headers, image domains"
      tsconfig.json:        "TypeScript config"
      .env.local:           "BACKEND_URL (server-side only)"
      app/:
        layout.tsx:         "Root layout — Geist font, global CSS"
        page.tsx:           "/ — Register page"
        login/
          page.tsx:         "/login — Login page"
        dashboard/
          page.tsx:         "/dashboard — Dashboard (SSR)"
      components/:
        RegisterForm.tsx:   "Register form component"
        LoginForm.tsx:      "Login form component"
        ProfileHeader.tsx:  "User profile header"
        DownloadSection.tsx: "Download button + status"
        ReviewForm.tsx:     "Review submission form"
      lib/:
        api.ts:             "API call helpers (server-side)"
        auth.ts:            "Cookie helpers, token management"
      styles/:
        globals.css:        "Design tokens, resets, base styles"
@end
```
