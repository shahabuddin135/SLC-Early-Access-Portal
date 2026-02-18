# SPEC.md — Global Router (Entry Point)

> **SLC Early Access Portal**
> This is the single entry point for the entire spec.
> The LLM must read this file first and follow `read_order` exactly.
> Violation of this file aborts execution.

---

```slc
@block INDEX root_index
priority: critical
intent: "Global router for SLC Early Access Portal spec"
scope: global
depends_on: none
failure_if_skipped: true

read_order:
  - CONTEXT.md
  - CONSTRAINTS.md
  - SECURITY.md
  - MEMORY.md
  - backend_specs/ARCH.md
  - backend_specs/PLAN.md
  - backend_specs/CONTRACT.md
  - backend_specs/tasks/task_index.md
  - frontend_specs/ARCH.md
  - frontend_specs/PLAN.md
  - frontend_specs/CONTRACT.md
  - frontend_specs/tasks/task_index.md

must_read_latest:
  - service: "FastAPI"
    url_hint: "context7://fastapi"
  - service: "SQLModel"
    url_hint: "context7://sqlmodel"
  - service: "NextJS"
    url_hint: "context7://nextjs"
  - service: "Neon PostgreSQL"
    url_hint: "context7://neon"
  - service: "Jose (JWT)"
    url_hint: "context7://python-jose"

content:
  short: "Start here. Follow read_order. Do not skip or reorder."
@end
```

---

## EXECUTION RULES

- No code generation before ARCH files are finalized
- TASK files are locked after user approval
- CONTRACT.md is authoritative for all API shapes
- SECURITY.md overrides all other files
- MEMORY.md overrides all decisions and assumptions
- Violations must abort execution — silent correction is forbidden

---

## AUTHORITY HIERARCHY

1. SPEC.md (this file)
2. MEMORY.md
3. SECURITY.md
4. CONSTRAINTS.md
5. backend_specs/ARCH.md / frontend_specs/ARCH.md
6. PLAN.md files
7. Task files
