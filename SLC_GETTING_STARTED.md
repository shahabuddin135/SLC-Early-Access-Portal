# Getting Started with SLC Framework

> **Build structured, hallucination-resistant software with LLMs.**
> This guide walks you through everything — from prerequisites to shipping — using the SLC framework.

---

## ⚠️ Prerequisites (Required Before Anything Else)

Before you open `SLC.md` or `slc_universal_structure.md`, you must set up the following. **SLC will not work properly without these.**

### 1. Context7 MCP or Web Search Feature

SLC has a built-in rule that fetches the **latest documentation** for every library used in your project (FastAPI, Next.js, SQLModel, etc.) using Context7. Without Context7, the LLM will hallucinate outdated APIs.

**Install Context7 MCP** in your editor (VS Code / Cursor / Windsurf):

Add to your MCP config (`mcp.json` or equivalent):

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

Verify it's active — you should see `context7` listed in your MCP tools panel before proceeding.
If you somehow fail to setup the MCP server, you can use the IDE's Native Web Search Tool with each prompt, which is basically last resort & obviously tiring `:(` .

> **Why this matters:** SLC's `SPEC.md` has a `must_read_latest` block that instructs the LLM to pull live docs via Context7 for every service in your stack. If Context7 is missing, that block is silently skipped and the LLM falls back to its training data — which may be months out of date.

---

### 2. A Consistent LLM

**Use the same LLM model throughout your entire project.** Switching models mid-way causes:
- Different interpretations of the same spec file
- Conflicting decisions that contradict `MEMORY.md`
- Drift from the original architecture

**Recommended models** (in order of quality for SLC):
- `claude-sonnet-4.5 to 4.6` / `claude-opus` — best for complex spec generation and long-context reasoning
- `gpt-5` — solid for task execution
- `gemini-3.0 to 3.0 pro` — good alternative

> Avoid models smaller than 70B parameters for spec generation. Small models miss nuance and hallucinate constraints.

---

### 3. The Two SLC Files

You need both files in your project root before starting:

| File | Purpose |
|---|---|
| `SLC.md` | The full SLC language specification — rules, syntax, block types, enforcement logic |
| `slc_universal_structure.md` | The universal folder/file structure every SLC project must follow |

Place them at the **root of your project**. These are the LLM's rulebook — they are referenced constantly.

---

## Step 1 — Write Your Requirements Document

Before you touch the LLM, write a **requirements document**. This is the single source of truth the LLM will use to generate your entire spec.

### What to name it

`requirement.md` (or `requirements.md`) — place it at the project root alongside `SLC.md`.

### What to include

The more detailed your requirements, the better your spec. A thin requirements document produces thin specs with gaps that the LLM fills with guesses.

**A good requirements document includes:**

```markdown
## Goal
What the app does in 2-3 sentences.

## User Journeys
Step-by-step flows for every type of user (regular user, admin, guest, etc.)

## Features
Every feature listed explicitly — do not assume the LLM will infer them.

## Tech Stack
- Frontend: (framework, language, styling approach, hosting)
- Backend: (framework, language, ORM, auth method, hosting)
- Database: (provider, type)
- Any third-party services (storage, email, payments, etc.)

## Design
- Color palette (hex codes)
- Font
- Design style (minimal, corporate, etc.)

## Non-Goals
Explicitly list what the app will NOT do.
This prevents scope creep and hallucinated features.

## Constraints
Hard limits — things that must never be violated regardless of convenience.
```

> **Rule of thumb:** If you wouldn't trust a junior developer to guess it, write it down. Vague requirements = hallucinated specs.

### Example of a bad vs good requirement

| ❌ Bad | ✅ Good |
|---|---|
| "Users can log in" | "Users log in with email and password. JWT is issued on success, stored in an httpOnly cookie named `app_token`, expires in 24 hours." |
| "Admin panel" | "5 hardcoded admin emails. Admins can generate 1–100 one-time download keys. Non-admins are redirected to /dashboard." |
| "Download files" | "Download requires a one-time key redeemed via POST /redeem. After redemption a single-use UUID token (10 min TTL) is issued. The file is streamed from private Supabase Storage — the URL is never sent to the client." |

---

## Step 2 — Generate the Specs

Open your LLM with a **fresh conversation**. Use this exact prompt pattern:

### The Spec Generation Prompt

```
I am going to give you three files to read carefully. Do not miss a single point in any of them.

1. SLC.md — This is the SLC language and framework specification. Follow every rule in it exactly. Do not skip or abbreviate any block type, priority level, or enforcement rule.

2. slc_universal_structure.md — This defines the universal folder and file structure every SLC project must follow. Your output must conform to this structure without deviation.

3. requirement.md — This is the full requirements document for the app I want to build.

After reading all three files completely, generate the full spec for this project following SLC rules. This includes:
- SPEC.md (entry point / global router)
- CONTEXT.md (intent, user journeys, non-goals)
- CONSTRAINTS.md (tech stack, hard rules)
- SECURITY.md (security laws)
- MEMORY.md (decisions, assumptions, do-not-change anchors)
- backend_specs/ARCH.md (data models, control flows, project structure)
- backend_specs/CONTRACT.md (all API endpoints with full request/response schemas)
- backend_specs/PLAN.md (execution phases)
- backend_specs/tasks/task_index.md (all task IDs)
- backend_specs/tasks/phases/ (one file per task)
- frontend_specs/ARCH.md (state shape, routing, components, rendering strategy)
- frontend_specs/CONTRACT.md (how frontend consumes each API endpoint)
- frontend_specs/PLAN.md (execution phases)
- frontend_specs/tasks/task_index.md
- frontend_specs/tasks/phases/ (one file per task)

Do not generate any code. Do not make assumptions — if something is not in the requirements, flag it and ask before proceeding. Follow the SLC rules for every block: priority, intent, scope, depends_on.

[PASTE requirement.md content here]
[PASTE SLC.md content here]
[PASTE slc_universal_structure.md content here]
```

> **Important:** Paste the actual file contents inline — do not attach files unless your LLM interface supports proper file reading. Many interfaces truncate attachments.

### What good spec output looks like

- Every file has `@block` / `@end` SLC syntax
- `MEMORY.md` has numbered decisions (D1, D2...) with rationale and dates
- `CONTRACT.md` has every endpoint with ID (AUTH-01, DASH-01...), full request schema, and all response codes
- `ARCH.md` has explicit data models with field types, every control flow step-by-step
- Task files have `acceptance_criteria` and `blocked_by` fields
- `SPEC.md` has a `must_read_latest` block listing all services with Context7 URL hints

If any of these are missing, prompt: *"The spec is missing [X]. Please generate it following SLC rules."*

---

## Step 3 — Execute Tasks via SPEC.md

Once your specs are saved to disk, **every new conversation with the LLM starts the same way:**

### The Execution Prompt

```
Read SPEC.md first. It is the entry point for this project.
Follow the read_order in SPEC.md exactly — do not skip any file.
Use Context7 to fetch the latest documentation for every service listed in must_read_latest.
After reading all spec files, execute task [TASK_ID] from the task index.
```

**Why always start with `SPEC.md`?**

`SPEC.md` is the global router. It contains the `read_order` — a strict sequence of files the LLM must read before touching any code. Skipping it means the LLM starts without knowing your constraints, security rules, decisions, or architecture. It will hallucinate.

### Task execution flow

```
SPEC.md → read_order files → task file → acceptance criteria → code
```

Execute tasks **one at a time**. Don't batch multiple tasks in a single prompt — the LLM loses track of acceptance criteria.

---

## Step 4 — Keeping Specs in Sync

The LLM will not automatically update your spec files as the project evolves. **You must explicitly prompt it.**

### When to update specs

| Situation | Files to update |
|---|---|
| A new technical decision was made | `MEMORY.md` — add a new `D{n}` decision entry |
| An API endpoint changed shape | `backend_specs/CONTRACT.md` + `frontend_specs/CONTRACT.md` |
| A new table was added | `backend_specs/ARCH.md` |
| A component was added | `frontend_specs/ARCH.md` |
| A bug revealed a wrong assumption | `MEMORY.md` (update the assumption) |
| Security rule was tightened | `SECURITY.md` |
| A constraint changed | `CONSTRAINTS.md` |

### The update prompt

```
The following change was made during task execution:
[describe what changed]

Update the following spec files to reflect this accurately:
- [list the files]

Follow SLC rules. Do not change anything unrelated to this update.
```

> **Do not let spec drift accumulate.** If `MEMORY.md` gets out of sync with reality, future LLM sessions will make decisions based on stale facts — and the errors compound.

---

## Step 5 — Extending Scope

If you want to add new features **after** the initial tasks are complete, follow this exact process. **Do not ask the LLM to add tasks informally** — that bypasses SLC's scope control.

### The scope extension process

1. **Update `requirement.md`** — add the new feature with the same level of detail as your original requirements
2. **Tell the LLM explicitly:**

```
I have updated requirement.md with a new feature: [brief description].
Read the updated requirement.md and the current SPEC.md read_order files.
Extend the scope by:
1. Updating CONTEXT.md with the new user journey steps
2. Updating CONSTRAINTS.md if new tech is involved
3. Updating ARCH.md with any new data models or control flows
4. Adding new endpoints to CONTRACT.md
5. Creating new task files for the additional work
6. Updating task_index.md with the new task IDs
Do not modify existing completed tasks.
```

> **Never ask for "just one more thing" informally.** Informal additions create undocumented features that break the spec's integrity and cause hallucinations in future sessions.

---

## Step 6 — Fixing Issues

When something breaks during execution, fixing it **does not require updating the spec** — unless the fix changes the architecture or a decision.

### Simple bug fix (no spec change needed)

```
Task [X] was completed but there is a bug:
[describe the bug and the error]

Fix the bug. Do not change the architecture or any other behaviour.
Reference SECURITY.md and CONSTRAINTS.md to ensure the fix doesn't violate any rules.
```

### Bug that reveals a wrong decision (spec change needed)

```
Task [X] was completed but we discovered that [decision D3] in MEMORY.md is wrong because:
[explain why]

The correct approach is: [explain the fix]

1. Fix the code for task [X]
2. Update MEMORY.md — amend decision D3 with the corrected decision and add a note explaining what changed and why
3. Check if ARCH.md or CONTRACT.md need to be updated as a result
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│                  SLC WORKFLOW                           │
│                                                         │
│  PREREQUISITES                                          │
│  ├── Context7 MCP installed and active                  │
│  ├── Consistent LLM model chosen (don't switch)         │
│  └── SLC.md + slc_universal_structure.md in root        │
│                                                         │
│  PHASE 1: SPEC GENERATION                               │
│  ├── Write detailed requirement.md                      │
│  ├── Prompt LLM: read all 3 files → generate specs      │
│  └── Verify every spec file has correct SLC syntax      │
│                                                         │
│  PHASE 2: EXECUTION                                     │
│  ├── Every session: "Read SPEC.md first"                │
│  ├── Execute one task at a time                         │
│  └── Verify acceptance criteria before moving on        │
│                                                         │
│  ONGOING                                                │
│  ├── Changes → prompt LLM to update spec files          │
│  ├── New features → update requirement.md first         │
│  └── Bugs → fix code (update spec only if needed)       │
└─────────────────────────────────────────────────────────┘
```

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---|---|---|
| Skipping Context7 setup | Hallucinated API signatures | Install MCP before starting |
| Thin requirement.md | Specs full of guesses | Rewrite requirements in detail, regenerate specs |
| Switching LLM mid-project | Conflicting interpretations | Pick one model, stick to it |
| Not starting sessions with SPEC.md | LLM ignores constraints and security rules | Always prompt "Read SPEC.md first" |
| Asking for features without updating requirement.md | Undocumented scope creep | Update requirement.md → then extend spec |
| Not updating MEMORY.md after decisions | Future sessions make contradictory choices | Prompt spec update after every significant decision |
| Batching multiple tasks | LLM loses track of acceptance criteria | One task per conversation |

---

*SLC Framework — WeWise Labs*
