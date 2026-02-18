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
      action: "User is taken to the dashboard where they can download SLC files"
    - step: 4
      action: "After downloading, a review submission form appears"
    - step: 5
      action: "User submits their project link and review"

  non_goals:
    - "No social features (comments, likes, follows)"
    - "No payment or subscription system"
    - "No admin panel beyond basic data storage"
    - "No role-based access control (all users are equal)"
    - "No real-time features (no websockets, no live updates)"
    - "No mobile-native app (web only)"
    - "No multi-language / i18n support"
    - "No file upload by users (download only)"
    - "No email verification flow (out of scope for v1)"
@end
```
