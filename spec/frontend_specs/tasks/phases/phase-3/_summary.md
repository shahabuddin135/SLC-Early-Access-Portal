# Phase 3 — Dashboard Summary

```slc
@block PHASE fe_phase_3_summary
priority: high
intent: "Frontend Phase 3 overview — Dashboard"
scope: phase-3
depends_on: [fe_phase_2]

content:
  name: "Dashboard"
  description: "SSR dashboard page with profile header, download section, and conditional review form"
  total_tasks: 2
  estimate_minutes: 60
  completed: 0

  task_order:
    - 3.1_dashboard_page
    - 3.2_download_flow

  milestone: "Authenticated users see dashboard with profile and can trigger download"
@end
```
