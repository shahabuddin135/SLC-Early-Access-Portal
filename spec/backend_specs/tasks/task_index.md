# backend_specs/tasks/task_index.md — HOT: Global Backend Task Registry

> **Authority: Global task registry — lists ALL backend tasks at once.**
> **Key Rule: Tasks are NOT locked. All visible from start.**
> LLM reads this once per session, then loads only the individual task file needed.

---

```slc
@block INDEX task_registry
priority: critical
intent: "Global backend task registry - all tasks visible, status tracked here"
scope: global
failure_if_skipped: true
depends_on: [backend_specs/PLAN.md]

content:
  total_tasks: 15
  total_estimate_minutes: 260

  phases:
    - phase: 1
      name: "Foundation"
      dir: "phases/phase-1/"
      tasks: 5
      estimate_minutes: 60

    - phase: 2
      name: "Authentication"
      dir: "phases/phase-2/"
      tasks: 4
      estimate_minutes: 90

    - phase: 3
      name: "Download"
      dir: "phases/phase-3/"
      tasks: 2
      estimate_minutes: 40

    - phase: 4
      name: "Review"
      dir: "phases/phase-4/"
      tasks: 2
      estimate_minutes: 40

    - phase: 5
      name: "Polish & Deploy"
      dir: "phases/phase-5/"
      tasks: 2
      estimate_minutes: 30

  all_tasks:
    # Phase 1 — Foundation
    - id: "1.1"
      name: "Initialize FastAPI project"
      file: "phases/phase-1/1.1_init_project.md"
      estimate_minutes: 10
      status: done

    - id: "1.2"
      name: "Create project folder structure"
      file: "phases/phase-1/1.2_project_structure.md"
      estimate_minutes: 10
      status: done

    - id: "1.3"
      name: "Configure environment variables"
      file: "phases/phase-1/1.3_env_config.md"
      estimate_minutes: 10
      status: done

    - id: "1.4"
      name: "Set up Neon PostgreSQL connection"
      file: "phases/phase-1/1.4_database_connection.md"
      estimate_minutes: 15
      status: done

    - id: "1.5"
      name: "Create database tables"
      file: "phases/phase-1/1.5_create_tables.md"
      estimate_minutes: 15
      status: done

    # Phase 2 — Authentication
    - id: "2.1"
      name: "Create User SQLModel"
      file: "phases/phase-2/2.1_user_model.md"
      estimate_minutes: 15
      status: done

    - id: "2.2"
      name: "Implement register endpoint"
      file: "phases/phase-2/2.2_register_endpoint.md"
      estimate_minutes: 25
      status: done

    - id: "2.3"
      name: "Implement login endpoint and JWT"
      file: "phases/phase-2/2.3_login_endpoint.md"
      estimate_minutes: 30
      status: done

    - id: "2.4"
      name: "Implement auth middleware dependency"
      file: "phases/phase-2/2.4_auth_middleware.md"
      estimate_minutes: 20
      status: done

    # Phase 3 — Download
    - id: "3.1"
      name: "Implement download endpoint"
      file: "phases/phase-3/3.1_download_endpoint.md"
      estimate_minutes: 20
      status: done

    - id: "3.2"
      name: "Implement download event tracking"
      file: "phases/phase-3/3.2_download_tracking.md"
      estimate_minutes: 20
      status: done

    # Phase 4 — Review
    - id: "4.1"
      name: "Create ReviewSubmission SQLModel"
      file: "phases/phase-4/4.1_review_model.md"
      estimate_minutes: 15
      status: done

    - id: "4.2"
      name: "Implement review submission endpoint"
      file: "phases/phase-4/4.2_review_endpoint.md"
      estimate_minutes: 25
      status: done

    # Phase 5 — Polish & Deploy
    - id: "5.1"
      name: "Global error handling"
      file: "phases/phase-5/5.1_error_handling.md"
      estimate_minutes: 15
      status: done

    - id: "5.2"
      name: "CORS config and Vercel deployment"
      file: "phases/phase-5/5.2_cors_and_deploy.md"
      estimate_minutes: 15
      status: done
@end
```
