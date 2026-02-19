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
        id:               { type: int | null }
        name:             { type: string | null }
        email:            { type: string | null }
        github_id:        { type: string | null }
        has_downloaded:   { type: bool, default: false }
        has_agreed_terms: { type: bool, default: false }
      is_authenticated: { type: bool, derived: "token != null" }
      is_admin:         { type: bool, derived: "user.email in ADMIN_EMAILS set" }

    ui:
      loading:        { type: bool }
      error:          { type: string | null }
      review_visible: { type: bool, derived: "user.has_downloaded == true" }
      terms_required: { type: bool, derived: "user.has_agreed_terms == false" }
      download_state: { type: enum, values: [idle, warning, enter_key, loading, done] }
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

    - path: "/admin"
      page: "Admin Dashboard"
      auth_required: true
      admin_required: true
      guard: "SSR checks email against ADMIN_EMAILS Set — redirects non-admins to /dashboard"

  flow:
    - "User lands on / → sees Register form"
    - "After register → redirected to /login"
    - "After login → redirected to /dashboard"
    - "If has_agreed_terms == false → TermsAgreementModal blocks entire dashboard"
    - "After agreeing → dashboard visible: profile header, download section"
    - "User clicks Download → DownloadWarningDialog (5 obligations)"
    - "After acknowledging warning → key entry field appears"
    - "User enters key → redeemKey() → downloadToken → browser opens /api/download/file?token=uuid"
    - "After download → review form appears"
    - "Admin navigates to /admin → sees key stats, generates keys, copies keys"

  components:
    - RegisterForm:           "Name, email, GitHub ID, password fields + submit"
    - LoginForm:              "Email, password fields + submit"
    - ProfileHeader:          "Shows user name, email, GitHub ID + WeWise Labs badge"
    - DownloadSection:        "States: idle → warning → enter_key → loading → done"
    - ReviewForm:             "Project link + review text + submit (visible after download)"
    - TermsAgreementModal:    "Full-screen blocking modal with WeWise Labs NDA — agree or logout"
    - DownloadWarningDialog:  "Pre-download confidentiality acknowledgment (5 obligations)"
    - AdminDashboard:         "Stats bar, filter tabs (All/Unused/Used), key table with copy buttons, generate modal"
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
        layout.tsx:              "Root layout — Geist font, global CSS"
        globals.css:             "Design tokens, resets, base styles, modal/admin styles"
        page.tsx:                "/ — Register page"
        login/
          page.tsx:              "/login — Login page"
        dashboard/
          page.tsx:              "/dashboard — Dashboard (SSR) — renders TermsAgreementModal if !has_agreed_terms"
        admin/
          page.tsx:              "/admin — Admin dashboard (SSR) — SSR email guard → AdminDashboard"
        actions/
          auth.ts:               "registerAction, loginAction, logoutAction server actions"
          download.ts:           "downloadAction(keyValue) → calls redeemKey → returns downloadToken"
          terms.ts:              "agreeToTermsAction() → calls POST /terms/agree"
          admin.ts:              "listKeysAction(), generateKeysAction(count)"
        api/
          download/
            file/
              route.ts:          "GET proxy: validates cookie, proxies GET /api/v1/download?token= to FastAPI, streams response"
      components/:
        RegisterForm.tsx:        "Register form component"
        LoginForm.tsx:           "Login form component"
        ProfileHeader.tsx:       "User profile header + WeWise Labs badge"
        DownloadSection.tsx:     "States: idle → warning → enter_key → loading → done"
        ReviewForm.tsx:          "Review submission form"
        TermsAgreementModal.tsx: "Full-screen NDA modal — agree/disagree"
        DownloadWarningDialog.tsx: "5-obligation confidentiality dialog before key entry"
        AdminDashboard.tsx:      "Full admin UI: stats, filter tabs, key table, generate modal"
      lib/:
        api.ts:   "All API call helpers: auth, dashboard, redeemKey, agreeToTerms, listAdminKeys, generateAdminKeys"
        auth.ts:  "Cookie helpers, token management"
      files/:
        slc-framework.zip: "(dev placeholder only — production uses Supabase Storage)"
@end
```
