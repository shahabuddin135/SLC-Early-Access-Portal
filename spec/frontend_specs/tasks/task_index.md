# frontend_specs/tasks/task_index.md — HOT: Global Frontend Task Registry

> **Authority: Global frontend task registry — lists ALL frontend tasks at once.**
> LLM reads this once per session, then loads only the individual task file needed.

---

```slc
@block INDEX frontend_task_registry
priority: critical
intent: "Global frontend task registry - all tasks visible, status tracked here"
scope: global
failure_if_skipped: true
depends_on: [frontend_specs/PLAN.md]

content:
  total_tasks: 8
  total_estimate_minutes: 195

  phases:
    - phase: 1
      name: "Foundation"
      dir: "phases/phase-1/"
      tasks: 3
      estimate_minutes: 45

    - phase: 2
      name: "Auth Pages"
      dir: "phases/phase-2/"
      tasks: 2
      estimate_minutes: 60

    - phase: 3
      name: "Dashboard"
      dir: "phases/phase-3/"
      tasks: 2
      estimate_minutes: 60

    - phase: 4
      name: "Review"
      dir: "phases/phase-4/"
      tasks: 1
      estimate_minutes: 30

  all_tasks:
    # Phase 1 — Foundation
    - id: "1.1"
      name: "Initialize Next.js project"
      file: "phases/phase-1/1.1_next_init.md"
      estimate_minutes: 15
      status: done

    - id: "1.2"
      name: "Build design system"
      file: "phases/phase-1/1.2_design_system.md"
      estimate_minutes: 20
      status: done

    - id: "1.3"
      name: "Create root layout"
      file: "phases/phase-1/1.3_layout.md"
      estimate_minutes: 10
      status: done

    # Phase 2 — Auth Pages
    - id: "2.1"
      name: "Build register page"
      file: "phases/phase-2/2.1_register_page.md"
      estimate_minutes: 30
      status: done

    - id: "2.2"
      name: "Build login page"
      file: "phases/phase-2/2.2_login_page.md"
      estimate_minutes: 30
      status: done

    # Phase 3 — Dashboard
    - id: "3.1"
      name: "Build dashboard page"
      file: "phases/phase-3/3.1_dashboard_page.md"
      estimate_minutes: 35
      status: done

    - id: "3.2"
      name: "Build download flow"
      file: "phases/phase-3/3.2_download_flow.md"
      estimate_minutes: 25
      status: done

    # Phase 4 — Review
    - id: "4.1"
      name: "Build review submission form"
      file: "phases/phase-4/4.1_review_form.md"
      estimate_minutes: 30
      status: done
@end
```
