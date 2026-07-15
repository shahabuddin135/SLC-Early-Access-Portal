# SLC CLI — Design, Flow Map & Edge-Case Plan

> The terminal experience for SLC. Build target: a **beautiful, readable, interactive** CLI that turns a
> user's `requirement.md` into a complete, validated SLC **spec tree** — using the **user's own LLM** — and
> never writes application code. This doc plans the flow and the edge cases *before* we build, so we design
> features for them up front.
>
> Companion to [NEXT_BIG_PLAN.md](NEXT_BIG_PLAN.md) (this is the detailed execution of "Move 2").
> Status: planning · awaiting decisions in §6.

---

## 1. What the CLI is (and isn't)

**It is:** a guided, BYO-LLM spec generator. It reads the user's requirements, interviews them to close
gaps, and produces the SLC spec tree (`SPEC.md`, `CONTEXT.md`, `CONSTRAINTS.md`, `SECURITY.md`, `MEMORY.md`,
`backend_specs/*`, `frontend_specs/*`).

**It is NOT:** a code generator. It writes **specs only**. The user then runs those specs through whatever
agent they like (Claude Code, Cursor, …) to build the app.

**Core promise (state this to the user, every run):**
> "SLC uses **your** LLM to generate your specs. Your model, your key, your decisions — so the output is
> 100% faithful to your requirements, not a black box. SLC structures the thinking; your model does it."

---

## 2. The headline flow (as you specified)

```
slc
│
├─ 0. INTRO        State the promise above. Confirm the LLM/key it will use.
│
├─ 1. FIND REQS    Locate requirement.md (or requirements.md). If absent, offer to
│                  scaffold one via a short interview.
│
├─ 2. SCOPE SPLIT  Read the requirement. If it describes a whole app, SLC splits it
│                  into two derived requirement sets: BACKEND and FRONTEND.
│                  (Backend-only or frontend-only projects skip the split.)
│
├─ 3. GAP Q&A      Compare the requirement against the SLC checklist; ask only the
│                  missing/ambiguous points, as clean interactive prompts.
│
├─ 4. BACKEND      Generate the backend spec tree first (ARCH, CONTRACT, PLAN, tasks).
│      FIRST       Run the health check. Show a readable summary.
│
├─ 5. REVIEW GATE  STOP. User reviews + confirms the backend specs (or requests
│                  changes → revise loop) before anything else happens.
│
├─ 6. FRONTEND     Only after confirmation: generate the frontend spec tree, with its
│                  CONTRACT derived from the *confirmed* backend CONTRACT.
│
└─ 7. DONE         Health check, summary, "next: open your agent and run Read SPEC.md".
```

Key rule baked in: **frontend derives from backend.** That's why backend goes first and is frozen at a
confirmation gate before the frontend is touched.

---

## 3. Flow map — 10 user scenarios & the edge cases to solve ahead

For each: the scenario, what breaks, and the **feature we build now** so it doesn't bite later.

### S1 — Happy path: one requirement, full-stack app
*User has a complete `requirement.md` for a web app, runs `slc`.*
- **Edge:** the FE/BE split is ambiguous (shared concepts, auth spans both).
- **Build ahead:** the split is a *proposal* the user confirms/edits, never silent. Show "Backend will own X, Y; Frontend will own A, B" and let them move items.

### S2 — Thin / vague requirement
*`requirement.md` is 4 lines.*
- **Edge:** gap analysis produces 25 questions → interrogation fatigue; user quits.
- **Build ahead:** **prioritised, batched questions** (only blockers first, max N per round), each with a *suggested default* the user can accept with Enter. Track "assumptions made" and write them into `MEMORY.md` so nothing is silently invented.

### S3 — No requirement file at all
*User runs `slc` in a fresh folder.*
- **Edge:** nothing to read.
- **Build ahead:** `slc init` interview that scaffolds a `requirement.md` from the SLC template (Goal / Journeys / Features / Stack / Design / Non-Goals / Constraints), then continues.

### S4 — Backend-only or frontend-only project
*A pure API service, or a static marketing site.*
- **Edge:** forcing a FE/BE split makes no sense.
- **Build ahead:** **scope detection** with override. CLI guesses "looks backend-only — generate just backend specs?" and lets the user correct it. Never fabricates the missing half.

### S5 — No key / invalid key / provider error mid-run
*User hasn't configured an API key, or it's wrong, or the provider 500s during generation.*
- **Edge:** crash, or half-written files, or a confusing stack trace.
- **Build ahead:** key check up front (a tiny validation call), friendly errors, **per-file retry with backoff**, and a clear "what failed / what to do" message. Never leave a half-written file as if it's done.

### S6 — Interrupted & resumed
*Ctrl+C, laptop sleep, or terminal closed mid-generation.*
- **Edge:** rerun restarts from zero or, worse, overwrites good work.
- **Build ahead:** a `.slc/` working-state dir tracking progress per file. On rerun: "Found an in-progress run (backend 6/9 files). Resume / restart?"

### S7 — Re-running on an existing spec tree (regeneration / drift)
*User edits `requirement.md` and reruns; specs already exist, some hand-edited.*
- **Edge:** blind overwrite destroys manual edits and completed task state.
- **Build ahead:** detect existing specs, **diff against the requirement**, regenerate only what changed, and protect hand-edits (hash/version flags from the SLC format). Always ask before overwriting.

### S8 — Requirement already split, or a monorepo
*User provides `backend.md` + `frontend.md`, or a repo with multiple apps.*
- **Edge:** which one first? duplicate work? cross-app contracts?
- **Build ahead:** detect multiple requirement sources; skip the auto-split; let the user pick order; still enforce FE-after-BE per app.

### S9 — User rejects the backend spec at the review gate
*"Auth is wrong" / "add a payments table" after backend specs are generated.*
- **Edge:** no way to revise without restarting; or frontend already built on a now-wrong backend.
- **Build ahead:** a **revision loop** at the gate — amend specific files via targeted re-prompts, re-run the health check, re-confirm. Frontend is *blocked* until backend is confirmed, so it can never be built on an unconfirmed contract.

### S10 — LLM produces malformed / unsafe SLC
*Missing required block, broken `depends_on`, a real secret pasted from `requirement.md`.*
- **Edge:** invalid specs that silently poison every future agent session.
- **Build ahead:** **`slc doctor`** runs automatically after generation (the SLC diagnostics: `MISSING_REQUIRED_BLOCK`, `UNRESOLVED_REFERENCE`, `CIRCULAR_DEPENDENCY`, `CONTRACT_MISMATCH`, `SENSITIVE_DATA_LEAK`, …). On failure: auto-fix via a focused re-prompt, or surface a clear, located error. Also scan `requirement.md` for secrets *before* sending it to the LLM.

### Bonus edges (cheap to design for now)
- **Model inconsistency:** record the model used in `MEMORY.md`; warn if it changes between backend and frontend.
- **Huge requirement:** chunk by domain to stay under context limits; never truncate silently.
- **Cost awareness:** estimate tokens/cost before a big generation; let the user confirm.
- **Non-interactive / CI mode:** `--yes`, `--non-interactive` flags so it can run scripted.
- **Non-English requirement:** pass through as-is; the user's model handles language; don't assume English.

---

## 4. Gaps & shortcomings I'm flagging (need resolution)

1. **The rulebook is missing here.** Real SLC generation needs `SLC.md` (the language) + `slc_universal_structure.md` (the structure) bundled into the CLI as the LLM's instruction set. They aren't in this repo (only `SLC_GETTING_STARTED.md` is). **This is the #1 blocker — see Q1 in §6.**
2. **Determinism depends on validation.** Without `slc doctor`, "follows SLC exactly" is just hope. The validator is a v0.1 must-have, not a v1 nice-to-have.
3. **Overwrite/drift policy** must be decided before we let `slc` touch an existing tree (S7).
4. **Cost/token transparency** — BYO key means the user pays; we owe them an estimate and a confirm.
5. **Secret handling** — `requirement.md` may contain real keys/URLs; we must redact before sending upstream.
6. **State format** for resumability (`.slc/` schema) needs defining once, up front.

---

## 5. Proposed stack (pending your §6 answers)

- **Language:** TypeScript. **Package:** published to npm so it runs under every manager: `npx slc`, `pnpm dlx slc`, `bunx slc`. One codebase, universal reach.
- **Interactive layer:** `@clack/prompts` for the guided flow (the modern standard for exactly this — clean, sequential, gorgeous), with custom rendering for summaries/progress. (Alternative: Ink, if you want a persistent app-like dashboard.)
- **LLM layer:** a thin provider abstraction (Anthropic / OpenAI / Google) behind one interface, BYO key.
- **Bundled assets:** `SLC.md` + `slc_universal_structure.md` (the hidden rulebook), requirement template, `AGENTS.md`/`CLAUDE.md` bridge stub.
- **Working dir:** `.slc/` (gitignored) for key/config, run state, and resumability.
- **Validator:** `slc doctor`, implementing the SLC diagnostics.

---

## 6. Decisions — RESOLVED (2026-06-20)

| # | Decision | Resolution |
|---|---|---|
| Q1 | Rulebook | Provided in `slc_framework_files/`; bundled into `cli/assets/`. |
| Q2 | Providers | **Any AI** — Anthropic Messages API + any OpenAI-compatible endpoint, plus **Bridge mode** (no key) for Claude Code / Copilot / chat subscriptions, since that's how most users access models. |
| Q3 | Distribution | Universal npm package (`npx` / `pnpm dlx` / `bunx`). |
| Q4 | Terminal UX | `@clack/prompts` guided flow, friendly ASCII mascot banner. |

## 7. Build status (`cli/`)

Built and compiling (`npm run build`, strict TS). Implemented: 2-mode access (API key + Bridge),
intro promise, key verify, requirement read + **secret pre-scan**, FE/BE scope split, batched gap
Q&A, backend-first generation, **review gate + revise loop**, frontend (derives from backend
CONTRACT), `slc doctor` + **API-mode auto-fix**, **resume / overwrite-guard**, **retry w/ backoff**.
Terminal walkthrough in `cli/GROUNDWORK.md` ("Groundwork" — the named terminal guide).

**Still open (next):** huge-requirement chunking (S-bonus), cost estimate, clipboard copy for the
bridge prompt, and `AGENTS.md`/`CLAUDE.md` bridge-stub output.
