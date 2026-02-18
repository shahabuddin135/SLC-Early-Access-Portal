# backend_specs/PLAN.md — Backend Execution Plan

> **High-level phases only. No implementation details.**
> Each phase references tasks by ID.
> This file is read after ARCH.md.

---

```slc
@block PLAN backend_phases
priority: high
intent: "Define the high-level backend execution phases"
scope: global
depends_on: [backend_specs/ARCH.md]

content:
  phases:
    - phase: 1
      name: "Foundation"
      description: "Project initialization, structure, environment, and database connection"
      tasks: [1.1, 1.2, 1.3, 1.4, 1.5]
      estimate_minutes: 60
      milestone: "Backend runs locally, connects to Neon DB, tables created"

    - phase: 2
      name: "Authentication"
      description: "User registration, login, JWT issuance, and auth middleware"
      tasks: [2.1, 2.2, 2.3, 2.4]
      estimate_minutes: 90
      milestone: "Users can register and log in, JWT returned and validated"
      depends_on: phase-1

    - phase: 3
      name: "Download"
      description: "Protected download endpoint and download event tracking"
      tasks: [3.1, 3.2]
      estimate_minutes: 40
      milestone: "Authenticated users can trigger download, event recorded"
      depends_on: phase-2

    - phase: 4
      name: "Review"
      description: "Review submission model and protected review endpoint"
      tasks: [4.1, 4.2]
      estimate_minutes: 40
      milestone: "Users who downloaded can submit project review"
      depends_on: phase-3

    - phase: 5
      name: "Polish & Deploy"
      description: "Global error handling, CORS configuration, Vercel deployment"
      tasks: [5.1, 5.2]
      estimate_minutes: 30
      milestone: "Backend deployed to Vercel, all endpoints accessible"
      depends_on: phase-4

  total_tasks: 15
  total_estimate_minutes: 260
@end
```
