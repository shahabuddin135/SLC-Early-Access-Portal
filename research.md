# SLC Framework — Competitive Research & Comparison

> **A research-grade evaluation of SLC (Spec Language for Cognition) against the dominant
> spec/context methodologies used by AI coding agents: Claude Code, GitHub Copilot / VS Code,
> Cursor, the AGENTS.md standard, and GitHub Spec Kit.**
>
> Author's framing (important): This report does **not** compare "agents vs SLC." Agents (Claude
> Code, Cursor, Copilot) are *runtimes*. SLC is a *spec language and project-structure contract*.
> The real axis of comparison is **how these systems represent specifications, memory, and context
> on disk** — i.e. `CLAUDE.md`, `AGENTS.md`, `.cursor/rules/*.mdc`, `copilot-instructions.md`, and
> Spec Kit's `spec.md / plan.md / tasks.md` — **versus the SLC block format and tiered structure.**
> SLC is *complementary* to these runtimes: it can be executed by any of them, and it can host
> Skills/subagents inside its structure.
>
> Research date: 2026-06-17 · Sources: primary docs + 2026 industry/research literature (see end).

---

## 0. Executive Summary (Read This First)

**Verdict in one line:** SLC is the only contender in this set that treats a spec as a *compiled,
machine-first artifact with an explicit dependency graph and a built-in context-tiering protocol*,
rather than as flat prose the agent must re-interpret every run. On **architecture and context
discipline, SLC leads the field.** On **ecosystem, tooling, and adoption, it is last** — because it
is a v0.1 specification with no parser, no IDE integration, and no install base, while its rivals
have millions of users and (in the case of AGENTS.md) Linux Foundation governance.

| Question the user asked | Honest answer |
|---|---|
| Is SLC's architecture better than the rest? | **Yes, on design.** No competitor combines explicit `priority`/`depends_on`/`read_order`, a HOT/WARM/COLD memory tier model, a 4KB split protocol, a conflict-authority hierarchy, and mandatory security redaction in one format. The closest (Spec Kit) has phases and a constitution but no token-tiering or block grammar; the rest are flat Markdown. |
| Does SLC dominate? | **In structure, determinism, token economy, and governance — yes.** In maturity, ecosystem, and validation tooling — **no, it loses badly.** |
| Is it better than what's available? | **For large, long-lived, multi-module, security-sensitive projects: design-wise yes.** For quick tasks, exploratory work, or teams wanting zero-overhead adoption: the flat-Markdown standards win on friction. |
| Biggest risk to SLC's claim | The "~90% token reduction" and "deterministic executor" benefits are **design claims**, not yet independently measured, and depend on the LLM actually obeying the protocol. No parser enforces it today. |

**What makes SLC genuinely novel:** it independently re-derives — and *codifies into a file
format* — the exact principles Anthropic now publishes as "effective context engineering": smallest
high-signal token set, just-in-time retrieval, structured note-taking, and progressive disclosure.
Its rivals leave those principles to agent improvisation. **SLC turns context-engineering
best-practice from a behavior into a contract.** That is its strongest defensible claim.

---

## 1. Why the Usual "Tool vs Tool" Comparison Is Wrong

Most online comparisons pit "Cursor vs Claude Code vs Copilot." That is a comparison of **IDEs and
agent runtimes** — UX, model access, autocomplete quality, pricing. It is the wrong frame for SLC.

SLC does not autocomplete code, run a model, or render a UI. SLC defines:

1. **A syntax** (`@block TYPE NAME … @end` with typed attributes) — the *language* layer (`SLC.md`).
2. **A project structure & behavioral contract** (the folder layout, read-order, tiering, authority
   hierarchy) — the *structure* layer (`slc_universal_structure.md`).
3. **An operating procedure** for humans driving an LLM through it (`SLC_GETTING_STARTED.md`).

So the correct comparison set is **the artifact layer each runtime uses to carry project intent,
memory, and tasks**:

| Layer | Claude Code | Copilot / VS Code | Cursor | Open standard | GitHub | **SLC** |
|---|---|---|---|---|---|---|
| Project memory | `CLAUDE.md` | `copilot-instructions.md` | `.cursor/rules/*.mdc` | `AGENTS.md` | `constitution.md` | `MEMORY.md` (+ tiers) |
| Spec / intent | (ad-hoc) | (ad-hoc) | (ad-hoc) | (ad-hoc) | `spec.md` | `CONTEXT.md` + `SPEC.md` |
| Architecture | (ad-hoc) | (ad-hoc) | (ad-hoc) | (ad-hoc) | `plan.md` | `ARCH.md` / `arch/` |
| API contract | (ad-hoc) | (ad-hoc) | (ad-hoc) | (ad-hoc) | (in plan) | `CONTRACT.md` / `contract/` |
| Tasks | TodoWrite (runtime) | (ad-hoc) | (ad-hoc) | (ad-hoc) | `tasks.md` | `task_index.md` + per-task files |
| Security policy | (in `CLAUDE.md`) | (in instructions) | (in a rule) | (a section) | (a principle) | `SECURITY.md` + redaction law |

**Key insight:** Of all the contenders, only **Spec Kit** and **SLC** are *full spec systems* with
separated architecture/contract/task artifacts. Everyone else ships a **single flat instruction
file** (plus optional scoped variants). So the deepest comparison is **SLC vs Spec Kit** for
structure, and **SLC vs the flat-file standards** for friction and adoption.

And crucially: **SLC is not mutually exclusive with any of them.** You can drop SLC specs into a
Claude Code repo, point a `CLAUDE.md` or `AGENTS.md` at `SPEC.md`, and run SLC through Cursor or
Copilot. SLC's own `must_read_latest` already delegates to **Context7 MCP**, and its structure can
host Claude **Skills** (`SKILL.md`) and **subagents** as dynamic, on-demand capabilities — which is
exactly the "we can integrate skills into SLC, it is dynamic" point.

---

## 2. The Research Backdrop (The Objective Yardstick)

To judge any of these systems fairly, we need an external, vendor-neutral standard for "good." The
2026 literature on **context engineering** and **context rot** provides it.

### 2.1 Context rot is real and measured
- Chroma's 2026 study across **18 frontier models** found accuracy degrades **30%+ for information
  in mid-window positions**; retrieval accuracy fell from ~70–75% at the start/end of the window to
  ~55–60% in the middle. ("Lost in the middle," now quantified.)
- Transformer attention scales **quadratically (n²)** — every token attends to every other token, so
  larger contexts dilute attention and degrade long-range reasoning. Degradation is gradual, not a
  cliff.
- Industry telemetry: **~65% of enterprise AI failures in 2025** were attributed to *context drift
  or memory loss* during multi-step reasoning.

**Implication:** Loading 80–100KB of monolithic spec into every task is not just expensive — it
*actively lowers answer quality*. A system that loads only the relevant 6–10KB is not merely
cheaper; it is **more accurate**.

### 2.2 Anthropic's "effective context engineering" — the gold-standard checklist
Anthropic's engineering guidance (the most authoritative public statement on this) prescribes:
1. **"The smallest possible set of high-signal tokens that maximize the likelihood of the desired
   outcome."**
2. **Just-in-time retrieval** — keep lightweight identifiers (file paths, queries), load full data
   at runtime via tools, rather than pre-loading everything.
3. **Structured note-taking** — persist decisions/progress *outside* the context window and reload
   on demand.
4. **Sub-agent context isolation** — fan out detailed exploration to subagents that return
   condensed 1–2K-token summaries.
5. **Compaction** — summarize and re-initialize as the window fills.
6. **Progressive disclosure** — reveal detail only as needed.

### 2.3 Spec-Driven Development (SDD): the honest critiques
The same literature that praises SDD also documents its failure modes — and these apply to *every*
spec system here, **including SLC**:
- **Maintenance tax:** keeping specs in sync with code can *double* overhead.
- **Spec drift:** "reality changes faster than specs do"; static artifacts can't hold all context.
- **Waterfall risk:** over-fixing on an upfront spec kills iteration and emergent design.
- **NL ambiguity:** natural-language specs are inherently ambiguous; agents lack human nuance.
- **Brittleness:** one change (e.g. swapping a deployment target) can invalidate a whole spec tree.
- **Scope fit:** SDD shines for strict-contract / regulated work; it breaks down for exploration.

> **We will hold every contender, SLC included, against both yardsticks**: (a) does its *format*
> embody Anthropic's context-engineering principles, and (b) how exposed is it to SDD's failure
> modes?

---

## 3. Deep Profiles of Each Contender

### 3.1 Claude Code — `CLAUDE.md` + Skills + Subagents + Memory
- **Artifact:** `CLAUDE.md` (project/user/enterprise scopes), read at the start of **every**
  session — the repo's "constitution." File-based memory, **no vector DB**: fully inspectable,
  editable, version-controllable. Best practice is to keep the main memory file **under ~500
  tokens**.
- **Dynamism (the "skills" angle):** `SKILL.md` files under `.claude/skills/<name>/` with YAML
  frontmatter, invocable via `/name` or autonomously. **Subagents** under `.claude/agents/` route by
  a `description` field (a routing rule, not a label) and run in isolated context. **Hooks** add
  deterministic enforcement; **MCP** adds tools. Recommended order: *Skills first → Hooks for
  enforcement → Subagents for isolation/parallelism.*
- **Strengths:** lowest-friction memory that actually works; superb dynamic extensibility (skills,
  hooks, subagents, MCP); strong defaults for context isolation.
- **Weaknesses (as a *spec format*):** `CLAUDE.md` is **flat Markdown** — no `priority`, no
  `depends_on`, no `read_order`, no machine-checkable structure. It is an *instruction anchor*, not a
  spec system. Architecture/contract/tasks are not first-class artifacts; they live in prose or in
  runtime TodoWrite state. No built-in security-redaction law.

### 3.2 GitHub Copilot / VS Code — `copilot-instructions.md` + scoped instructions + prompt files
- **Artifact:** `.github/copilot-instructions.md` auto-detected at workspace root, applied to all
  chat requests. `*.instructions.md` files add **glob-scoped** rules; `*.prompt.md` files in
  `.github/prompts/` are reusable prompts. `/init` can auto-generate instructions. Org-level
  instructions exist. Also **reads `AGENTS.md`.**
- **Strengths:** zero-config, huge install base, glob scoping is a real (if coarse) form of
  progressive disclosure, organizational governance.
- **Weaknesses (as a *spec format*):** flat Markdown again. Scoping is by file glob, not by a
  semantic dependency graph. No tiering, no authority hierarchy, no contract/task separation, no
  redaction law. It's an instruction layer bolted onto an IDE, not a project spec contract.

### 3.3 Cursor — `.cursor/rules/*.mdc` (MDC format)
- **Artifact:** the modern format is **MDC** = Markdown **+ YAML frontmatter** (`description`,
  `globs`, `alwaysApply`). Four **activation modes**: *Always Apply*, *Auto-Attached (globs)*,
  *Agent-Requested (description-based)*, *Manual (`@rule-name`)*. Typical production project: **5–8
  rule files** in `.cursor/rules/`, committed to the repo. Legacy `.cursorrules` still parses but is
  **silently ignored in Agent mode** — a real footgun.
- **Strengths:** MDC frontmatter + activation modes are the **closest any flat-file system gets to
  SLC's ideas** — `description`-based agent-requested rules ≈ a primitive `intent`-driven load, and
  globs ≈ scope. Committed, team-shared, modular.
- **Weaknesses (as a *spec format*):** frontmatter carries only 3 fields; **no `priority`, no
  `depends_on` graph, no read-order, no tiering, no authority hierarchy.** Scoping is by file
  pattern, not by semantic dependency. No contract/task system. The `.cursorrules`→`.mdc` migration
  trap shows the fragility of un-versioned flat conventions.

### 3.4 AGENTS.md — the open standard
- **Artifact:** plain Markdown, **no required fields, no frontmatter, no special syntax** — "a README
  for agents." Precedence is **hierarchical by file proximity** (nearest `AGENTS.md` to the edited
  file wins; explicit chat prompts override all). Nested files for monorepos.
- **Adoption (its superpower):** **60,000+ open-source projects**, read by **30+ agents** (Codex,
  Claude Code, Copilot, Cursor, Gemini CLI, Jules, Aider, Zed, Windsurf, Devin…), now **stewarded by
  the Agentic AI Foundation under the Linux Foundation.** A v1.1 proposal is debating *progressive
  disclosure* and *explicit semantics* — i.e. the standard is reaching toward exactly the
  structure SLC already has.
- **Strengths:** ubiquity, vendor neutrality, governance, zero learning curve.
- **Weaknesses (as a *spec format*):** by design it is the **least structured** option — no
  priorities, no dependency graph, no tiering, no read-order beyond file proximity, no
  contract/task artifacts, no redaction law. Its strength (simplicity) is precisely what SLC argues
  is insufficient at scale.

### 3.5 GitHub Spec Kit — the SDD toolkit (SLC's nearest rival)
- **Artifacts:** a `.specify/` tree with `memory/constitution.md` (non-negotiable principles),
  `templates/` (spec/plan/tasks), and per-feature `specs/<id>/` folders holding **`spec.md`
  (what/why) → `plan.md` (tech architecture) → `tasks.md` (ordered, dependency-aware) → supporting
  `data-model.md`, `api-spec.json`, `research.md`.**
- **Workflow (slash commands):** `/speckit.constitution → /specify → /clarify → /plan → /tasks →
  /analyze → /implement` (+ `/checklist`, `/taskstoissues`). A genuine, well-thought pipeline.
- **Machine-readable bits:** `tasks.md` uses **`[P]` parallel markers**, explicit file paths,
  dependency ordering, TDD ordering, per-story checkpoints. A **template-resolution priority stack**
  (project overrides > presets > extensions > core).
- **Strengths:** real phase separation; an explicit **constitution** (≈ SLC's `MEMORY.md` +
  `CONSTRAINTS.md`); a `/clarify` step that fights NL ambiguity; a `/analyze` cross-artifact
  consistency check (something SLC describes as diagnostics but doesn't ship); GitHub's distribution.
- **Weaknesses vs SLC:** **no formal block grammar; no token-tiering / HOT-WARM-COLD model; no
  per-block `priority`; no read-order routing enforcement; no hash/version change-detection; no
  built-in security-redaction law; no single-source-of-truth status rule.** Spec Kit relies on "AI
  agent interpretation of Markdown templates," and has **no rollback/versioning for regenerated
  artifacts**. It is SDD-as-templates; SLC is SDD-as-a-typed-format.

### 3.6 SLC — the framework under test
- **Format (`SLC.md`):** declarative `@block TYPE NAME … @end` units with **required typed
  attributes** — `priority` (1–5 / critical–optional), `intent`, `scope`, `depends_on`, optional
  `hash` (SHA-256) and `version` (semver). Block types: `INDEX, ROUTE, PLAN, TASK, ARCH, CONTRACT,
  LINK, ANCHOR, COMPUTED, META`. Mandatory **`INDEX`** block carries `read_order`,
  `must_read_latest` (Context7 fetch), and `failure_if_skipped`. **Structured diagnostics**:
  `SYNTAX_ERROR, UNRESOLVED_REFERENCE, MISSING_REQUIRED_BLOCK, HASH_MISMATCH, CIRCULAR_DEPENDENCY,
  CONSTRAINT_VIOLATION, SENSITIVE_DATA_LEAK`.
- **Structure (`slc_universal_structure.md`):** a fixed project tree (`SPEC, CONTEXT, CONSTRAINTS,
  SECURITY, MEMORY` + `backend_specs/` & `frontend_specs/` each with `ARCH|arch/`, `PLAN|plan/`,
  `CONTRACT|contract/`, `tasks/`). A **split protocol** (>4KB **or** 3+ domains → index + section
  files). A **HOT / WARM / COLD memory-tier model**. A **conflict-authority hierarchy** (`SPEC >
  MEMORY > SECURITY > CONSTRAINTS > ARCH > PLAN > TASKS`). **Frontend must derive from backend
  `CONTRACT`** (`CONTRACT_MISMATCH` otherwise). **`task_index.md` is the single source of truth for
  status** (task files carry none). Mandatory **redaction law** + `.slc_secrets` (gitignored).
- **Operating procedure (`SLC_GETTING_STARTED.md`):** Context7 MCP prerequisite, consistent-model
  rule, requirement.md → spec generation → per-task execution loading only `depends_on` sections,
  explicit sync/extension/bug protocols.
- **Claimed payoff:** **~6–10KB context per task vs ~80–100KB monolithic = ~90% reduction that stays
  flat as the project scales.** (A design claim — see §7.)

---

## 4. Architecture Head-to-Head (The Core of the Report)

### 4.1 Format: typed grammar vs flat prose
- **SLC:** typed blocks with required attributes; cross-references resolve as `file.block`;
  parseable into a symbol table; supports hashes, versions, computed blocks, conditional read-order.
- **Spec Kit:** structured *templates* + a few machine markers (`[P]`, paths) but no grammar.
- **Cursor MDC:** 3-field frontmatter + Markdown.
- **AGENTS.md / Copilot / CLAUDE.md:** pure Markdown.

**Winner: SLC**, decisively. It is the only one a deterministic parser could fully validate. This is
also its biggest *unrealized* asset — the parser/validator described in `SLC.md` §19 and the v0.2
roadmap **does not exist yet**, so today the "machine-first" benefit is delivered only insofar as the
LLM voluntarily honors the grammar.

### 4.2 Context economy & tiering (the most important axis)
This is where the external research bites hardest, and where SLC's design maps 1:1 onto Anthropic's
checklist:

| Anthropic principle | SLC mechanism | Best rival mechanism |
|---|---|---|
| Smallest high-signal token set | HOT/WARM/COLD tiers; load only `depends_on` sections | Cursor globs / Copilot scoped instructions (coarse) |
| Just-in-time retrieval | `depends_on` → load only referenced `arch/`+`contract/` sections | Spec Kit per-feature folders (manual) |
| Structured note-taking outside the window | `MEMORY.md` decisions (D1, D2…) + index files | Spec Kit `constitution.md`; CLAUDE.md memory |
| Progressive disclosure | index files (summaries) → section files (detail) | AGENTS.md v1.1 *proposal* (not shipped) |
| Live/fresh external knowledge | `must_read_latest` → Context7 MCP | none standardized |

No competitor ships an explicit, codified **tier model**. Spec Kit's per-feature folders give
*coarse* just-in-time loading; Cursor/Copilot globs give *file-pattern* scoping. **Only SLC encodes
the load decision into the spec itself** via `depends_on` + index summaries. **Winner: SLC.**

### 4.3 Determinism & hallucination resistance
- **SLC:** `MEMORY.md` is the anti-hallucination anchor; authority hierarchy resolves conflicts
  deterministically; `must_read_latest`/Context7 fights stale-API hallucination; "deterministic
  executor, not a creative assistant" is the stated stance; diagnostics define fail-fast behavior.
- **Spec Kit:** `/clarify` + `/analyze` + constitution materially reduce ambiguity — its best
  feature, and arguably *more battle-tested* than SLC's equivalents.
- **Others:** rely on a single instruction file; no conflict-resolution model.

**Winner: SLC on design (richer model), Spec Kit on proven tooling.** Call it a tie at the top.

### 4.4 Dependency & contract modeling
- **SLC:** explicit `depends_on` edges from tasks → arch/contract sections; **frontend-derives-from-
  backend** rule with `CONTRACT_MISMATCH`; `LINK` blocks for typed relations
  (`implements|depends|references|verifies`).
- **Spec Kit:** dependency-ordered tasks and `api-spec.json`, but no cross-artifact dependency
  *graph* or FE/BE derivation rule.
- **Others:** none.

**Winner: SLC**, clearly. This is one of its most differentiated and defensible features.

### 4.5 Security & data redaction
- **SLC:** a **first-class, mandatory** `SECURITY.md` + `## REDACTION RULES`, `{PLACEHOLDER}`
  tokens, `.slc_secrets` (gitignored), and a `SENSITIVE_DATA_LEAK` diagnostic with regex patterns
  (emails, `AKIA…`, `sk-…`, IPs). Treated as a build-blocking law.
- **Everyone else:** at most a "Security considerations" *section* you may choose to write. No
  enforcement, no redaction protocol, no secret-resolution convention.

**Winner: SLC**, uncontested. Given specs are committed to GitHub, this is a real, often-overlooked
edge — and an easy marketing wedge.

### 4.6 Scalability
- **SLC:** the 4KB/3-domain split protocol + index/section pattern is *designed* so per-task cost
  stays flat (~6–10KB) as the repo grows — directly countering context rot.
- **Spec Kit:** scales by feature folders, but each `spec/plan/tasks` can itself bloat with no split
  rule.
- **Flat files:** degrade worst — a single growing `CLAUDE.md`/`AGENTS.md` competes for the same
  window on every call (hence the "<500 tokens" advice for CLAUDE.md, which is a *symptom* of the
  problem SLC solves structurally).

**Winner: SLC.**

### 4.7 Dynamism / extensibility (the "skills" point)
- **Claude Code:** best-in-class *runtime* dynamism — Skills, subagents, hooks, MCP.
- **SLC:** dynamic at the *spec* layer — split files load on demand, `ROUTE`/conditional
  `read_order`, `must_read_latest`, and (critically) **it can host Skills/subagents inside its
  structure**: a `SKILL.md` becomes a WARM capability the `INDEX`/`depends_on` graph can point to.
  SLC + Claude Code is additive, not competitive.
- **Others:** limited (prompt files, manual rule attach).

**Winner: Claude Code for runtime dynamism; SLC for *structured* dynamism. Best result = combine
them.**

### 4.8 Ecosystem, tooling, adoption, governance (SLC's weak flank)
- **AGENTS.md:** 60k+ projects, 30+ agents, Linux Foundation governance. **Winner, by a mile.**
- **Copilot/Cursor/Claude Code:** massive commercial install bases, IDE integration, auto-gen
  (`/init`).
- **Spec Kit:** official GitHub project, active community, presets/extensions.
- **SLC:** **v0.1 spec, no parser, no validator, no IDE plugin, no install base, single-author,
  no third-party adoption.** Roadmap (v0.2 EBNF + reference parser, v0.3 transpiler/CI, v1.0
  ecosystem) is credible but **unbuilt.**

**Winner: everyone but SLC.** This is the gap that determines whether SLC's superior design ever
matters in practice.

---

## 5. Capability Matrix

✅ = first-class/built-in · 🟡 = partial/convention/optional · ❌ = absent

| Capability | Claude Code (`CLAUDE.md`) | Copilot/VS Code | Cursor (MDC) | AGENTS.md | Spec Kit | **SLC** |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| Machine-parseable block grammar | ❌ | ❌ | 🟡 (frontmatter) | ❌ | 🟡 (markers) | ✅ |
| Explicit per-item `priority` | ❌ | ❌ | 🟡 (alwaysApply) | ❌ | 🟡 (constitution) | ✅ |
| Dependency graph (`depends_on`) | ❌ | ❌ | ❌ | ❌ | 🟡 (task order) | ✅ |
| Mandatory read-order routing | ❌ | ❌ | ❌ | 🟡 (proximity) | 🟡 (phase order) | ✅ |
| Context tiering (HOT/WARM/COLD) | 🟡 (manual) | 🟡 (globs) | 🟡 (globs) | ❌ | 🟡 (folders) | ✅ |
| File-split protocol w/ index | ❌ | ❌ | 🟡 (multi-file) | 🟡 (nested) | 🟡 (per-feature) | ✅ |
| Conflict-authority hierarchy | ❌ | ❌ | ❌ | 🟡 (proximity) | 🟡 (constitution) | ✅ |
| Separate ARCH / CONTRACT / TASKS | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| FE-derives-from-BE contract rule | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Single-source-of-truth task status | 🟡 (runtime) | ❌ | ❌ | ❌ | 🟡 | ✅ |
| Anti-hallucination memory anchor | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | ✅ |
| Live-docs / freshness rule (MCP) | 🟡 (MCP avail.) | 🟡 | 🟡 | ❌ | ❌ | ✅ |
| Mandatory security redaction law | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Hash/version change detection | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Structured diagnostics/error codes | ❌ | ❌ | ❌ | ❌ | 🟡 (`/analyze`) | ✅ |
| Clarify / consistency-check step | 🟡 | 🟡 | 🟡 | ❌ | ✅ | 🟡 (diag spec) |
| Dynamic capabilities (Skills/agents) | ✅ | 🟡 (prompts) | 🟡 | ❌ | ❌ | 🟡 (can host) |
| Reference parser / validator | ❌ | ❌ | 🟡 | 🟡 (lint tools) | 🟡 (CLI) | ❌ (roadmap) |
| IDE / runtime integration | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Adoption / ecosystem / governance | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Zero learning curve | ✅ | ✅ | 🟡 | ✅ | 🟡 | ❌ |

**Tally (✅ count):** SLC **15** · Spec Kit ~3 (+8 partial) · Cursor ~1 (+7 partial) · Claude Code
~3 · Copilot ~1 · AGENTS.md ~1. **On capability *coverage*, SLC leads; on the last three rows
(parser, integration, adoption, curve) it is dead last** — and those rows are what determine
real-world use today.

---

## 6. Scored Evaluation (1–5, higher better)

Weighted across the dimensions a research evaluator would use. Scores reflect *current reality*
(June 2026), not potential.

| Dimension (weight) | Claude Code | Copilot | Cursor | AGENTS.md | Spec Kit | **SLC** |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| Structural rigor / format (15%) | 2 | 2 | 3 | 1 | 4 | **5** |
| Context/token economy (15%) | 3 | 3 | 3 | 2 | 3 | **5** |
| Determinism / hallucination control (12%) | 3 | 3 | 3 | 2 | 4 | **5** |
| Dependency & contract modeling (10%) | 2 | 2 | 2 | 1 | 3 | **5** |
| Security / redaction (8%) | 2 | 2 | 2 | 2 | 2 | **5** |
| Scalability to large repos (10%) | 3 | 3 | 3 | 2 | 4 | **5** |
| Dynamism / extensibility (8%) | **5** | 3 | 4 | 2 | 3 | 3 |
| Tooling / validation (7%) | 4 | 4 | 4 | 3 | 4 | **1** |
| Ecosystem / adoption / governance (8%) | **5** | **5** | **5** | **5** | 4 | **1** |
| Ease of adoption / friction (7%) | **5** | **5** | 4 | **5** | 3 | **2** |
| **Weighted total (~/5)** | **3.3** | **3.2** | **3.3** | **2.6** | **3.5** | **4.0** |

> **Reading the scores honestly:** SLC tops the weighted total **because design dimensions are
> weighted heavily and SLC maxes them.** But note its two **1s** (tooling, ecosystem) and a **2**
> (friction). If you re-weight toward "can I use it today with zero setup," Spec Kit and the flat
> standards overtake it. **SLC wins the architecture argument; it has not yet won the adoption
> argument.** Both statements are true and the report would be dishonest to hide either.

---

## 7. Stress-Testing SLC's Claims

A real researcher pressure-tests the headline numbers:

1. **"~90% token reduction (6–10KB vs 80–100KB)."** *Directionally well-founded* — it follows
   necessarily from loading only `depends_on` sections, and the context-rot literature says the
   *accuracy* benefit may matter more than the cost. **But:** (a) it is SLC's own arithmetic, not an
   independent benchmark; (b) it assumes a large project where monolithic specs would actually reach
   80–100KB — for small projects the split overhead can make SLC *heavier*, which SLC itself admits
   ("single file preferred under 4KB"); (c) it assumes the LLM actually obeys the tier protocol with
   no parser enforcing it. **Recommendation: publish a reproducible benchmark.** This single
   artifact would convert the strongest claim from "asserted" to "proven."

2. **"Deterministic executor, not a creative assistant."** The *format* enables determinism, but
   determinism is enforced only by LLM compliance today. Without the v0.2 reference parser + v0.3 CI
   validators, an LLM can silently skip `read_order` or ignore `failure_if_skipped`. **The
   determinism is contractual, not yet mechanical.**

3. **Maintenance tax (the universal SDD critique).** SLC is *more* artifacts than a single
   `AGENTS.md`, so naive maintenance cost is higher. SLC mitigates with `hash`/`version` drift
   detection and the split model (touch one section, not a monolith), and `SLC_GETTING_STARTED.md`
   codifies explicit sync/extension/bug protocols — **but those are manual prompts, not
   automation.** Until a runner auto-detects `HASH_MISMATCH`, drift control depends on user
   discipline, exactly as critics warn for all SDD.

4. **Waterfall / exploration fit.** SLC's "intent freezes before execution; tasks immutable once
   approved" is *excellent* for regulated/contract-heavy builds and *poorly suited* to exploratory
   R&D — the same boundary the literature draws for all SDD. SLC should **own** the former and
   **disclaim** the latter rather than claim universality.

---

## 8. Per-Contender Pros & Cons (Concise)

**Claude Code / `CLAUDE.md`**
- ➕ Frictionless memory; elite dynamic extensibility (Skills/subagents/hooks/MCP); inspectable
  file-based memory.
- ➖ Flat-Markdown spec layer; no dependency graph/tiering/redaction; arch/contract/tasks not
  first-class.

**GitHub Copilot / VS Code**
- ➕ Zero-config; massive reach; glob-scoped instructions; org governance; reads AGENTS.md.
- ➖ Flat files; coarse scoping; no spec system, hierarchy, or redaction.

**Cursor / MDC**
- ➕ Best flat-file design (frontmatter + 4 activation modes); modular, team-shared.
- ➖ Only 3 frontmatter fields; no `depends_on`/priority/tiering; `.cursorrules` agent-mode footgun.

**AGENTS.md**
- ➕ The standard — ubiquity, neutrality, Linux Foundation governance, zero curve.
- ➖ Deliberately structureless; weakest at scale; v1.1 only now reaching for what SLC has.

**GitHub Spec Kit**
- ➕ Real SDD pipeline; constitution; `/clarify` + `/analyze`; GitHub distribution; SLC's closest
  peer.
- ➖ No block grammar/tiering/priority/redaction/hash; relies on agent interpretation; no artifact
  rollback.

**SLC**
- ➕ Only typed, machine-first spec format; explicit dependency graph; HOT/WARM/COLD tiering; split
  protocol; authority hierarchy; FE-derives-from-BE; mandatory redaction; freshness via Context7;
  diagnostics; **codifies Anthropic's context-engineering checklist into a file format.**
- ➖ v0.1, **no parser/validator/IDE/adoption**; higher upfront friction & verbosity; overhead on
  tiny projects; determinism currently depends on LLM compliance; headline metrics unbenchmarked;
  manual sync.

---

## 9. Where SLC Genuinely Dominates

1. **Structural rigor** — the only typed, parseable spec grammar in the set.
2. **Context economy at scale** — the only built-in HOT/WARM/COLD tier + `depends_on` JIT loading;
   maps 1:1 to Anthropic's published best practice.
3. **Dependency & contract integrity** — explicit edges + FE-derives-from-BE + `CONTRACT_MISMATCH`.
4. **Security/redaction as law** — unique; meaningful because specs live in git.
5. **Conflict determinism** — explicit authority hierarchy no rival defines.
6. **Drift instrumentation** — hash/version semantics no rival has.

These six are **defensible, differentiated, and not matched by any single competitor.**

## 10. Where SLC Must Improve to Win in Practice

1. **Ship the parser/validator** (v0.2 EBNF + reference impl) — convert "machine-first" from promise
   to fact; without it, none of the determinism guarantees are enforceable.
2. **Publish a reproducible token/accuracy benchmark** — turn the ~90% claim into evidence.
3. **Provide a bridge to the standard** — auto-generate an `AGENTS.md`/`CLAUDE.md` stub that points
   to `SPEC.md`, so SLC rides existing adoption instead of fighting it.
4. **Lower friction** — a generator/CLI (`slc init`) and templates, plus a "lite" single-file mode
   for small projects (already implied by the <4KB rule — make it a first-class on-ramp).
5. **Pick the lane** — market explicitly to large, long-lived, multi-module, security/compliance-
   sensitive builds; concede exploratory work to flat files.
6. **Formalize Skills integration** — document `SKILL.md`/subagents as WARM capabilities in the
   `INDEX`/`depends_on` graph, making the "dynamic" story concrete.

---

## 11. End Summary

**The honest finding.** Across the six systems studied, the market is split into two camps:
**flat-Markdown instruction files** (`CLAUDE.md`, `AGENTS.md`, `copilot-instructions.md`, Cursor
MDC) that optimize for *frictionless adoption*, and **spec-driven systems** (GitHub Spec Kit and
SLC) that optimize for *structure and control*. Within the structured camp, **Spec Kit is the
mature incumbent and SLC is the more advanced design.**

**On architecture, SLC wins — and not narrowly.** It is the only contender that encodes
priority, dependencies, read-order, context-tiering, an authority hierarchy, contract derivation,
drift detection, and a security-redaction law into a single typed format. Independent of any
marketing, **SLC's structure is a faithful, codified implementation of the context-engineering
principles Anthropic and the 2026 context-rot literature now hold up as best practice** — principles
its rivals leave to agent improvisation. That is the deepest validation possible: SLC's design is
*correct* by the field's own emerging standard.

**On readiness, SLC loses — and not narrowly.** It is a v0.1 specification with no parser, no
validator, no IDE integration, no benchmark, and no install base, competing against an open standard
with 60,000+ projects and Linux Foundation governance, and against IDE-native systems with millions
of users. Its strongest guarantees (determinism, the ~90% token saving) are presently *contractual
claims enforced only by LLM goodwill*, not mechanically guaranteed facts.

**The synthesis.** The right verdict is not "SLC is better than Cursor/Copilot/Claude Code" — that
compares a *format* to *runtimes* and misframes the contest. The right verdict is:

> **As a methodology for how an AI agent should read, prioritize, and act on a project's specs,
> SLC is architecturally the most advanced design surveyed — measurably more disciplined than
> AGENTS.md/CLAUDE.md/Cursor/Copilot and meaningfully more rigorous than GitHub Spec Kit — but it
> is the least mature in tooling and adoption. It does not replace the agents; it upgrades the
> artifacts they run on, and it can run inside any of them.**

If SLC ships a parser, a benchmark, and an `AGENTS.md` bridge, it converts a superior design into a
defensible product. Until then, its dominance is **real on paper and unproven in practice** — which
is exactly the gap a v0.2/v0.3 roadmap should be built to close.

---

## Sources

**Primary docs / standards**
- AGENTS.md — official site & format: https://agents.md/ · repo: https://github.com/agentsmd/agents.md · v1.1 progressive-disclosure proposal: https://github.com/agentsmd/agents.md/issues/135
- GitHub Spec Kit — repo: https://github.com/github/spec-kit · spec-driven method: https://github.com/github/spec-kit/blob/main/spec-driven.md
- Claude Code memory docs: https://code.claude.com/docs/en/memory
- VS Code custom instructions: https://code.visualstudio.com/docs/agent-customization/custom-instructions · overview: https://code.visualstudio.com/docs/agent-customization/overview
- Anthropic — *Effective context engineering for AI agents*: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents · *Effective harnesses for long-running agents*: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents

**Industry / analysis**
- Microsoft Dev Blog — Spec-Driven Development with Spec Kit: https://developer.microsoft.com/blog/spec-driven-development-spec-kit
- DevOps.com — GitHub's Spec Kit: https://devops.com/githubs-spec-kit-puts-the-spec-back-in-software-development/
- LogRocket — exploring Spec Kit: https://blog.logrocket.com/github-spec-kit/
- Cursor rules 2026 (5-level system / `.cursor/rules`): https://medium.com/@vibecodingdirectory/how-to-structure-cursor-rules-in-2026-the-5-level-system-cursor-rules-eaf0df16e8e7 · `.cursorrules` vs MDC: https://thepromptshelf.dev/blog/cursorrules-vs-mdc-format-guide-2026/
- AGENTS.md vs CLAUDE.md vs .cursorrules (Morph): https://www.morphllm.com/agents-md-guide
- Claude Code 2026 features: https://www.marktechpost.com/2026/06/14/claude-code-guide-2026-25-features-with-examples-demo/ · skills/hooks/subagents: https://ofox.ai/blog/claude-code-hooks-subagents-skills-complete-guide-2026/

**Context rot / context engineering research**
- Morph — Context Rot guide: https://www.morphllm.com/context-rot
- Chroma/Redis context-rot analysis: https://redis.io/blog/context-rot/
- Understanding AI — context rot: https://www.understandingai.org/p/context-rot
- Digital Applied — Context Engineering Playbook 2026: https://www.digitalapplied.com/blog/context-engineering-agent-reliability-playbook-2026
- Atlan — LLM context-window limitations 2026: https://atlan.com/know/llm-context-window-limitations/

**SDD critiques**
- Marmelab — *Spec-Driven Development: The Waterfall Strikes Back*: https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html
- Isoform — *The Limits of Spec-Driven Development*: https://isoform.ai/blog/the-limits-of-spec-driven-development
- Arcturus Labs — *Why SDD Breaks at Scale*: http://arcturus-labs.com/blog/2025/10/17/why-spec-driven-development-breaks-at-scale-and-how-to-fix-it/

*Compiled 2026-06-17. Tool/standard details current as of that date; the agent-tooling space moves
fast — re-verify version-specific claims before quoting externally.*