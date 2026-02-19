# CONTEXT.md — Intent Freezer

> **Immutable unless user explicitly changes it.**
> No technical implementation details belong here.
> LLMs must reject features that violate NON-GOALS.

---

```slc
@block INTENT project_context
priority: critical
intent: "Define the purpose and boundaries of the SLC Early Access Portal"
scope: global
depends_on: none

content:
  goal: >
    Build a registration portal for early access to the SLC language and framework.
    Users register, log in, download the SLC files, and submit a project review
    after using the framework.

  user_journey:
    - step: 1
      action: "User registers with name, email, and GitHub ID"
    - step: 2
      action: "User logs in with email and password"
    - step: 3
      action: "On first login, user sees WeWise Labs NDA/Terms modal — must agree to proceed (disagree logs out)"
    - step: 4
      action: "User is taken to the dashboard"
    - step: 5
      action: "User clicks Download — sees confidentiality warning dialog, acknowledges 5 obligations"
    - step: 6
      action: "User enters their one-time download key (issued by admin)"
    - step: 7
      action: "Key is redeemed → single-use 60s download token issued → file streams from private Supabase Storage"
    - step: 8
      action: "After downloading, a review submission form appears"
    - step: 9
      action: "User submits their project link and review"

  admin_journey:
    - step: 1
      action: "Admin logs in with one of the 5 hardcoded admin emails"
    - step: 2
      action: "Admin navigates to /admin dashboard"
    - step: 3
      action: "Admin generates 1–100 download keys, views all keys (used/unused), copies keys to share with users"

  non_goals:
    - "No social features (comments, likes, follows)"
    - "No payment or subscription system"
    - "No real-time features (no websockets, no live updates)"
    - "No mobile-native app (web only)"
    - "No multi-language / i18n support"
    - "No file upload by users (download only)"
    - "No email verification flow (out of scope for v1)"
    - "No dynamic admin role assignment — admin set is fixed at deploy time"
    - "No key expiry — keys remain valid until redeemed (no time-based expiry on keys themselves)"
@end
```
