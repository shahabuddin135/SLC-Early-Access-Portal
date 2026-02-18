# frontend_specs/PLAN.md — Frontend Execution Plan

> **High-level phases only. No implementation details.**
> Frontend phases must align with backend contract.

---

```slc
@block PLAN frontend_phases
priority: high
intent: "Define the high-level frontend execution phases"
scope: global
depends_on: [frontend_specs/ARCH.md, backend_specs/CONTRACT.md]

content:
  phases:
    - phase: 1
      name: "Foundation"
      description: "Next.js init, design system (tokens, global CSS, Geist font), root layout"
      tasks: [1.1, 1.2, 1.3]
      estimate_minutes: 45
      milestone: "Next.js runs locally with Geist font and orange/black/gray design tokens applied"

    - phase: 2
      name: "Auth Pages"
      description: "Register form and login form pages with API integration"
      tasks: [2.1, 2.2]
      estimate_minutes: 60
      milestone: "Users can register and log in via the UI. JWT stored in httpOnly cookie."
      depends_on: phase-1

    - phase: 3
      name: "Dashboard"
      description: "SSR dashboard page with profile header and download flow"
      tasks: [3.1, 3.2]
      estimate_minutes: 60
      milestone: "Authenticated users see dashboard, can trigger download"
      depends_on: phase-2

    - phase: 4
      name: "Review"
      description: "Review submission form (appears after download)"
      tasks: [4.1]
      estimate_minutes: 30
      milestone: "Review form visible and functional after download"
      depends_on: phase-3

  total_tasks: 8
  total_estimate_minutes: 195
@end
```
