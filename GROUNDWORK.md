# Groundwork — the SLC terminal guide

> **Groundwork** is the SLC terminal: it lays the groundwork (your specs) before a single line of
> code. This is its field guide.

```
   (•‿•)    S L C
   ╭───╮    Spec Language for Cognition
   │ ▪ │    it writes specs, not vibes
   ╰───╯    wewise labs · bring your own AI
```

SLC is a calm, guided terminal. It reads your requirements, asks only what it genuinely
doesn't know, and writes a complete, validated **spec tree** — using **your** AI. It writes
**specs, never application code**. Then you point any agent at those specs and build.

Built on [Ink](https://github.com/vadimdemedes/ink) (React for terminals) — the mission map, every
prompt, and every report (`doctor`, `estimate`, `db`, `audit`) are real components, not string
concatenation. **Requires Node ≥22.**

---

## 1. Run it

```bash
npx @wewiselabs/slc      # or:  pnpm dlx @wewiselabs/slc   ·   bunx @wewiselabs/slc
```

No global install needed. Run it inside the project folder that has (or will have) your
requirement. It doesn't have to be named `requirement.md` or follow any particular structure —
SLC looks for common names first, scans the folder and judges by content if it doesn't find one,
and `slc --file <path>` points at anything directly. See §7.11.

Prefer the bare `slc` command? `npm install -g @wewiselabs/slc` once, then `slc`, `slc doctor`,
`slc --help` work anywhere. (With npx, always use the full scoped name — `npx slc` unscoped is a
different, unrelated npm package.)

---

## 2. First question: how does SLC reach your AI?

SLC never ships its own model. You bring the brain. There are two ways, and **you don't need
an API key**:

### Bridge mode  ·  *recommended for Claude Code / Copilot / chat subscriptions*

Most builders already pay for Claude Code, GitHub Copilot, or a chat plan that bundles many
models. Bridge mode uses exactly that — no separate API key.

```
◇  How should SLC reach your AI?
│  ● I use Claude Code / Copilot / a chat subscription   (no API key — recommended)
│  ○ I have an API key
│
◇  Which tool will you run the generation in?
│  ● Claude Code
```

SLC writes the full prompt to a file and hands it to your agent:

```
┌  Bridge mode · backend
│
│  ✓ Prompt written to .slc/run/backend.prompt.md
│
│  In your agent (Claude Code / Copilot / chat), say:
│    "Follow .slc/run/backend.prompt.md and save the JSON to .slc/run/backend.output.json"
│
│  or paste the prompt into a chat and save its JSON reply to that path.
└
◆  Saved backend.output.json? I'll read it now.  ›  Yes
```

SLC reads the output, writes your spec files, and validates them. Your subscription does the
thinking; SLC does the structure.

### API-key mode  ·  *for OpenAI / Anthropic / Ollama / OpenRouter / anything*

```
◇  API shape
│  ● Anthropic (Claude)        Messages API
│  ○ OpenAI-compatible         OpenAI · Google · OpenRouter · Ollama · any /chat/completions
│
◇  Model id  ›  claude-opus-4-8
◇  API key   ›  ••••••••••••   (saved to .slc/, auto-gitignored)
│
◇  Key verified ✓
```

Either way, your choice is saved to `.slc/config.json` (gitignored) so the next run is one tap.

---

## 3. The flow, end to end

```
   (•‿•)  S L C
┌  SLC spec generation
│
◇  Found requirement.md  (2,140 chars)
│
◇  Detected: Full-stack (backend first, then frontend derived from it)
│  Use this scope?  ›  Yes
│
●  ── Scrutiny — check, repair & confirm the idea ──
│
◇  What's the ambition for this app?  ›  Real project — may need to scale
◐  Scrutinizing your idea (feasibility, gaps, security, cost)…
│
┌  Scrutiny report
│  !  Good idea — needs repairs before specs.
│  Clear brief from a builder who knows the product, lighter on the infra side.
│
│  ✗ BLOCK [security]  The admin dashboard has no authentication in the brief
│     ↳ Gate every /admin route behind the same login with an admin role check
│  !  [compatibility]  SQLite won't survive the multi-instance hosting you named
│     ↳ Use the hosted Postgres your platform offers — same effort at this size
│  ·  [cost]  Image uploads on serverless functions get pricey past ~10k users
└
┌  2 decision(s) worth making before the specs
│  • Auth / access model?        (suggested: email + password, JWT in httpOnly cookie)
│  • What's out of scope for v1? (suggested: no payments, no mobile app)
└
◆  Decide these now? (No = accept every suggestion as an explicit assumption)  ›  Yes
◇  Auth / access model  ›  Enter = email + password, JWT in httpOnly cookie
│
◆  How should SLC proceed?
│  ● Apply the repairs — update my requirement and continue  (recommended)
◇  requirement.md updated (original kept at .slc/requirement.backup.md)
│
●  ── Backend specs ──────────────────────────
◐  Generating backend specs with your LLM…
◇  Backend specs written (18 files)
│     ✓ spec/SPEC.md
│     ✓ spec/CONTEXT.md
│     ✓ spec/backend_specs/CONTRACT.md
│     … +12 more
◇  slc doctor: PASS — specs conform to SLC.
│
◆  Review spec/backend_specs. Do the backend specs look right?  ›  Yes
◇  Backend specs confirmed and frozen.
│
●  ── Frontend specs ─────────────────────────
◐  Generating frontend specs (derived from the backend CONTRACT)…
◇  Frontend specs written (11 files)
◇  slc doctor: PASS — specs conform to SLC.
│
┌  Done — hand off to your agent
│  ✓ Validated spec tree under spec/
│
│  Open your coding agent (Claude Code, Cursor, …) in this folder and send it this:
│
│    Read SPEC.md, follow its read_order, then execute task 1.1
│    from spec/backend_specs/tasks/task_index.md
└
```

**Backend always comes first**, then stops at a **review gate**. The frontend is generated
only after you confirm, and its CONTRACT is **derived from the backend** — never invented.

## Scrutiny — the gate between "an idea" and "specs"

Most AI tools execute whatever you typed. SLC doesn't. Before a single spec is generated, your
own LLM audits the brief like a principal engineer reviewing it:

- **Clarity** — contradictions, ambiguity, missing essentials.
- **Feasibility & compatibility** — stack choices that fight each other or the hosting you named.
- **Security** — footguns in the *described* design (open admin surfaces, plaintext credentials, PII).
- **Scale & cost** — a rough cost outlook, tuned to your ambition.
- **Monetization** — payment provider, plans, billing edges (business posture only).

One question sets the lens — **the posture**: *hobby* (simplest, cheapest, no enterprise
nagging), *growth* (flag scale traps + cost hotspots), or *business* (security, costs, and
billing flows are first-class).

The result is a **scrutiny report** (blockers → warnings → notes, each with a one-line fix) and
every **decision genuinely worth making** — no artificial cap; a real gap SLC doesn't ask about
becomes a silent wrong guess later, which is worse than one more question. Each one ships a
suggested answer you can accept by pressing Enter.

**Scrutiny reviews; it does not rewrite.** If your requirement already exists as a file, SLC treats
it as *yours* — your structure, your wording, your section order, even if it's nothing like SLC's
own template (it might be better). A brief that's already solid is left **completely untouched** —
no menu, no "repaired" copy, nothing to confirm; SLC says so and moves straight on. When there
genuinely are fixes, SLC shows you a **diff** (lines added / removed) before anything is written, so
"apply" never means "trust me" — only the flagged spots change, plus one appended
`## Assumptions (recorded by SLC)` section if anything was left undecided. Your original is always
backed up to `.slc/requirement.backup.md` before any real change lands. The full report is saved to
`.slc/scrutiny.json`.

**No requirement file at all?** Type the idea straight into the terminal — scrutiny reviews it and
drafts a requirement file for you (there's no existing format to preserve, so this is the one case
where SLC picks the structure).

## The harness (the mission map)

SLC runs on a harness: a persistent **mission map** saved to `.slc/mission.json`. It always knows
where you are, what's done, and what the end goal is — even across pauses, Ctrl+C, and restarts.

```
✦ MISSION — a validated spec tree, then handoff
│
├ ✓ Connect your AI
├ ✓ Read your requirement
├ ✓ Scrutiny — check, repair & confirm the idea
├ ▸ Backend specs   ◄ you are here
│   ├ ✓ generate
│   ├ ✓ health check
│   └ ▸ your review
├ · Checkpoint — project setup
├ · Frontend specs (from the backend contract)
└ · Handoff to your coding agent
```

Every phase gets a numbered section header, and the map re-renders when you resume, so a long run
never turns into one slab of text.

### Checkpoints — SLC waits for you

After the backend specs are locked, SLC **pauses on purpose**. Some things only you can do: create
the database, set real secrets, configure hosting. SLC scans your specs for their `{PLACEHOLDER}`
tokens and turns them into your setup checklist:

```
┌  Checkpoint — project setup
│  Your specs reference these placeholders — give them real values:
│    · {DB_HOST}   · {SECRET}   · {ADMIN_EMAILS}
│
│  Put real values in .slc_secrets (gitignored) or your environment.
│
│  (－‿－) zZ  take your time — I'll wait right here.
└
◆  How do you want to handle this?
   ● All set — everything's configured
   ○ Give me a minute — doing it now      (SLC waits)
   ○ Skip for now                          (the handoff reminds you)
```

Answer when you're back. The harness then pulls you back to the mission: *"Back to the mission —
next up: Frontend specs."* If you skip, it's recorded and the handoff reminds you.

You can also pause at the review gate ("I need more time") — everything is saved, and the next
`slc` run reopens the map exactly where you left it.

## The handoff (SLC → your agent)

SLC's job ends at a **validated spec tree**. It does not write application code — your agent does.
The final screen prints the **exact line** to paste into your coding agent, using the real first
task from your `task_index` (not a guess). It's also saved to `.slc/START_HERE.md` so it survives
the terminal scrolling.

- **Bridge mode:** you're already in your agent — just send it that line.
- **API mode:** open your agent in the folder and send it that line.

From there your agent self-drives the SLC execution loop (read SPEC.md → task_index → execute →
update status). **SLC decides what to build and in what order; your agent writes the code.**

---

## 4. Commands

| Command | What it does |
|---|---|
| `slc` | The guided generator (the flow above). Finds your requirement automatically. |
| `slc --file <path>` | Same, but reads the requirement from an exact path — any name, any format. |
| `slc feature "<desc>"` | Add one feature to an existing `spec/` tree without regenerating it. See 7.12. |
| `slc estimate` | Token/cost report for an existing `spec/` tree — measured + derived + estimated. See 7.14. |
| `slc db` | Data model view — entities, fields, inferred relationships. No LLM call. See 7.16. |
| `slc audit` | Security/architecture review of the generated specs — report only. See 7.17. |
| `slc doctor` | Validate an existing `spec/` tree. Exit code `1` on errors — CI-friendly. |
| `slc --help` | This help. |
| `slc --version` | Version. |

---

## 5. What it generates

The SLC spec tree (per `slc_universal_structure.md`):

```
spec/
├── SPEC.md            ← entry point + READ ORDER + INDEX router
├── CONTEXT.md  CONSTRAINTS.md  SECURITY.md  MEMORY.md
├── backend_specs/     ← ARCH · PLAN · CONTRACT · tasks/  (split when >4KB / 3+ domains)
└── frontend_specs/    ← derived from the backend CONTRACT
```

---

## 6. Edge cases SLC already handles for you

- **Interrupted run?** Re-run `slc` — it offers **Resume** (picks up the phase you left off) or
  **Regenerate**. Nothing is silently overwritten. Ctrl+C before any specs exist keeps your
  posture and answers too.
- **Interrupted mid-bridge?** If your agent already wrote the output for the *exact same prompt*,
  SLC finds it on the next run and offers to reuse it — the work is never thrown away. Pressing
  Ctrl+C at a bridge step pauses cleanly; the prompt file stays saved.
- **Existing spec/ tree?** SLC asks before touching it — and if the tree has uncommitted changes
  (or isn't under git at all), regeneration demands an explicit extra confirmation, because git
  could never restore what was overwritten.
- **Crash mid-save?** State files are written atomically (temp + rename) — a crash can't leave a
  half-written state behind. If an old corrupt state is found, it's moved aside and reported,
  never silently treated as "no state".
- **Fresh clone of an already-built project?** `.slc/state.json` is gitignored (it can hold an API
  key), so a clone has none. Instead of treating that like a brand-new project, SLC samples evidence
  off the spec tree itself — which sides exist, task status counts, a leftover scrutiny report — and
  offers **Resume** at the inferred phase, reasons shown, never silent. See scenario 7.15.
- **Merged branches?** `slc doctor` catches what merges break: leftover conflict markers,
  duplicate block names/ids, ambiguous references, `ARCH.md` + `arch/` coexisting, orphaned task
  files, stale counts. See scenario 7.10.
- **Provider hiccup?** API calls **retry with backoff** before failing.
- **Requirement named anything, in any format?** SLC finds it — common names first, then a
  content-scored folder scan, then `--file`. See scenario 7.11.
- **Secrets in your requirement?** SLC scans first and **warns before sending** anything to your AI.
- **Malformed/invalid specs?** `slc doctor` runs automatically; in API mode it offers a one-tap
  **auto-fix** that re-prompts your model to repair only the broken files.
- **Requirement already complete?** Scrutiny says so and **changes nothing** — no menu, no
  reflow into SLC's template. It only ever asks about, or edits, genuine gaps.
- **Thin requirement?** Scrutiny asks about every decision that matters — no cap; whatever you
  skip is passed to generation as an **explicit assumption** for `MEMORY.md` rather than invented.
- **Unfilled template?** Leftover `<placeholders>` are detected and called out before any LLM
  call is spent on them.
- **No LLM reachable during scrutiny?** SLC falls back to the basic gap checklist and still
  records skipped items as assumptions.

---

## 7. Scenarios — real situations, step by step

Ten minutes of reading that covers ~95% of real use. Each scenario: what you have → what to do
→ what you'll see.

### 7.1 "I have nothing — just an idea in my head"

```bash
mkdir my-app && cd my-app
npx @wewiselabs/slc
```

1. Pick how SLC reaches your AI (bridge or API key — see 7.3 / 7.4).
2. SLC finds no `requirement.md` → choose **"Describe the idea right here"** and type a few
   sentences: what it does, for whom, anything you already know.
3. Answer the posture question (hobby / growth / business).
4. Scrutiny reviews the idea, shows its report, asks up to 6 decisions (Enter accepts each
   suggestion), and **drafts `requirement.md` for you**.
5. From there the normal flow runs: backend specs → your review → frontend specs → handoff.

### 7.2 "I already have a requirement.md"

Run `slc` in that folder. SLC reads it, warns if it still contains `<template placeholders>` or
anything secret-looking, then scrutinizes it. If the report proposes repairs, your original text
is never lost — it's backed up to `.slc/requirement.backup.md` before anything is rewritten.

### 7.3 "I use Claude Code / Copilot / a chat plan — no API key" (bridge mode)

The full round-trip, concretely, with Claude Code:

1. `slc` → *"How should SLC reach your AI?"* → **subscription** → **Claude Code**.
2. When a generation step comes, SLC writes a **small prompt file** and shows a **blue line** —
   that line is the thing you paste. In Claude Code (same folder), say:
   `Follow .slc/run/backend.prompt.md and save the JSON array to .slc/run/backend.output.json`
   (The SLC rulebook itself is staged once under `.slc/rulebook/` and the prompt references it,
   so prompt files stay a few KB instead of embedding ~40KB of law every time.)
3. When your agent finishes, come back to the SLC terminal and press Enter on
   *"Saved backend.output.json?"* — SLC reads it (any encoding — UTF-8/UTF-16/BOM all fine),
   writes the spec files, validates them.
4. Repeat per phase (scrutiny · backend · frontend · taste demo). Your subscription does the
   thinking; SLC does the structure and the checking.

### 7.4 "I have an API key" (incl. running fully local with Ollama)

Pick **API key** → **OpenAI-compatible** and point it anywhere that speaks `/chat/completions`:

| Provider | Base URL | Model example |
|---|---|---|
| OpenAI | `https://api.openai.com/v1` | `gpt-5` |
| Anthropic (pick *Anthropic* instead) | `https://api.anthropic.com` | `claude-opus-4-8` |
| OpenRouter | `https://openrouter.ai/api/v1` | any listed model |
| Ollama (local, free) | `http://localhost:11434/v1` | `llama3.3`, key: `ollama` |

`ANTHROPIC_API_KEY` / `OPENAI_API_KEY` in your environment are picked up automatically. Keys are
stored in `.slc/config.json`, which SLC auto-gitignores.

### 7.5 "I pressed Ctrl+C / closed the terminal mid-run"

Just run `slc` again. What happens:

- Specs already existed → you get **Resume / Regenerate / Cancel**. Resume reopens the mission
  map exactly where you stopped.
- You stopped before any specs existed → your posture and answers are kept automatically.
- You stopped at a bridge step **after** your agent wrote the output → SLC detects that the
  prompt is unchanged and asks *"Found backend.output.json from a previous run of this exact
  prompt. Use it?"* — Enter, and nothing is redone.

### 7.6 "The backend specs are wrong"

At the review gate pick **"Something's off — tell SLC what to change"** and describe it in one
or two sentences ("split auth into its own phase", "we use Prisma not raw SQL"). The backend
regenerates with your note attached, and the gate comes back. Loop until it's right — nothing is
frozen until you say so.

### 7.7 "It's a frontend-only (or backend-only) project"

Say so at the scope question (SLC's guess is only a proposal). Backend-only skips taste + frontend.
Frontend-only skips the backend and derives the CONTRACT from the requirement itself — every
derived endpoint is recorded as an explicit ASSUMPTION in `spec/MEMORY.md` so nothing is invented
silently.

### 7.8 "I want it to look like MY brand — I have screenshots / a logo / CSS"

Drop reference material in an `inspo/` folder (or anywhere) before the design-taste step:

- **Images** (`.png .jpg .webp .gif`, up to 4, ≤3MB each) — screenshots of apps you love, your
  logo, a moodboard. In API mode they're attached to the model's **vision** call; in bridge mode
  the prompt tells your agent to open and study the files.
- **Brand/design files** (`.css .scss tokens.json tailwind.config.js …`) — included verbatim
  (truncated at 8KB); their colors/fonts/radii are treated as law.
- **Links** — a URL that points at an image is fetched and used directly; other links ride along
  as style hints (bridge agents can browse them).

The taste interview asks *"Reference files on disk?"* — with an `inspo/` folder present, Enter
uses it. Whatever got picked up (and anything skipped, with the reason) is printed before the
demo renders, and the locked `design.json` records which references shaped the look.

### 7.9 "I want CI to guard the spec tree"

```yaml
- run: npx @wewiselabs/slc doctor --json
```

Exit code `1` on any error, machine-readable diagnostics on stdout. Runs headless — no terminal
needed.

### 7.10 "We're a team — several devs, several branches"

The spec tree is designed to be merged, but merges break specs in ways no single branch can see.
Three habits keep it safe:

1. **Never number things sequentially on a branch.** Decisions are `dec-<slug>` (e.g.
   `dec-auth-jwt-over-sessions`), never `dec1`, `dec2` — two branches will both allocate "the next
   number" and collide, in `MEMORY.md` *and* in every code comment that cites it. Slugs derived
   from content don't collide; when they do, it's literally the same decision.
2. **Run `slc doctor` after every merge** (or gate merges with the CI line from 7.9). It catches
   exactly the post-merge breakage: leftover `<<<<<<<` conflict markers, duplicate block names and
   task ids, ambiguous references, a file that exists both as `ARCH.md` *and* `arch/`, task files
   dropped from the index, and stale `total_tasks` counts.
3. **Know what's shared and what's local.** `spec/`, `requirement.md`, `AGENTS.md`/`CLAUDE.md` are
   shared — commit them. `.slc/` is local per developer (your key, your run state, your paper
   trail) and stays gitignored; a teammate cloning the repo works from the committed `spec/` tree,
   and SLC will warn before ever overwriting it.

When two branches disagree on a task's `status`, take the more-advanced one (`done` beats
`in-progress` beats `todo`). Counters like `total_tasks` are derived — the task list is the truth;
doctor tells you when a count went stale.

### 7.11 "My requirement isn't named requirement.md, or doesn't look like SLC's template"

Neither matters. Discovery is layered, and every layer is content-based, never format-based:

1. **Common names first** — `requirement.md`, `requirements.md`, `PRD.md` (any case). Instant,
   silent, zero setup.
2. **Not found? SLC scans the folder** — any root-level `.md`/`.txt` file — and scores each one by
   whether it actually covers the essentials (goal, users, stack, auth, data, non-goals,
   constraints — checked by keyword, not by header text, so *any* structure counts). One clear
   winner is used automatically (SLC tells you which, and why); a few plausible files get you a
   quick picker; nothing plausible falls through to describing the idea or scaffolding a template —
   it never just gives up.
3. **Know exactly which file? Skip discovery entirely:** `slc --file path/to/whatever.md`.

And once found, its **format is never judged**. Scrutiny checks whether the content covers the
essentials — never whether it's shaped like SLC's own template. See "Scrutiny reviews; it does not
rewrite" above: a complete brief in your own structure is left exactly as you wrote it.

### 7.12 "The project is already built — I just want to add a feature"

Don't run `slc` again — that's for a new project or a deliberate full regeneration. Use:

```bash
slc feature "Add a due-date field to todos, shown on the list and editable per item"
```

(No description on the command line? SLC asks for one.)

This is a **narrow, additive** operation, not a re-run of the guided flow:

- It reads what already exists — `CONTEXT.md`'s non-goals, `CONSTRAINTS.md`'s hard rules, `MEMORY.md`'s
  frozen decisions, the current backend/frontend `CONTRACT`, and the current `task_index.md` — and
  checks the request against them. A real conflict comes back as a flag (severity `block` for
  anything that truly contradicts something frozen) instead of silently generating around it.
- New tasks always land in a **brand-new phase number**, never a renumbered slot in an existing one
  — so ids can't collide with what's already there, by construction, not by careful counting.
- `CONTEXT.md`, `CONSTRAINTS.md`, and `SECURITY.md` are never touched. If the feature genuinely needs
  one of them to change, that's a full `slc` run, not this command — SLC says so instead of guessing.
- You see the exact file list before anything is written, and `slc doctor` runs immediately after.

`slc doctor` runs first too — adding to an already-broken tree just compounds the breakage, so SLC
warns and asks before building on top of existing errors.

(No description on hand and would rather not type one? Point SLC at a file instead — see 7.13.)

### 7.13 "I'd rather attach a file than type into the terminal"

Anywhere SLC asks for free text longer than a sentence, there's a file option next to it:

- **No requirement found at all** — the "How do you want to start?" menu includes *"Point me at a
  file"*: give it a path (any name, any format, anywhere on disk) and it's read exactly like
  `slc --file` would, format respected, nothing rewritten.
- **`slc feature`'s description prompt** — choose *"Attach a file instead"* and give it a path; SLC
  reads it as plain text and uses it as the feature request. Useful for anything long enough that
  retyping it into a terminal line is awkward — a bug report, a design note, a paragraph you already
  wrote somewhere else.

A bad path doesn't abort the command — SLC says so and asks again, same as everywhere else it reads
a file you named.

### 7.14 "What is this actually saving me?"

```bash
slc estimate
```

A token/cost report for the spec tree that's already there. It's split into three kinds of number,
on purpose — this tool avoids confident-sounding numbers it can't back up, and the report is no
exception:

- **MEASURED** — file count, size, a rough token estimate (bytes ÷ 4 — labelled as rough, not an
  exact tokenizer count) — read straight off disk.
- **DERIVED** — task count and total agent-time estimate, straight from the `total_tasks` /
  `total_estimate` your specs already carry. Not a new guess, just surfaced.
- **ESTIMATED** — a token-savings range for spec-driven vs. no spec tree, with the assumption printed
  next to it (an agent without specs re-derives context every task; the range is what that
  re-orientation plausibly costs). It's shown as a range, never a single confident number.

No dollar figure is ever built in — model pricing changes too often to bake into a CLI without it
going stale and misleading you. Give it a `$/million-token` rate when it asks (Enter to skip) and
it'll convert the range for you; skip it and you get tokens only.

### 7.15 "I cloned an already-built project — will it think it's brand new?"

No. `.slc/state.json` is gitignored (it can hold an API key), so a fresh clone never has it — but
SLC doesn't treat that as "start over." It samples evidence straight off the spec tree: which of
`backend_specs/`/`frontend_specs/` exist, task `status:` counts in each `task_index.md`, a leftover
`.slc/scrutiny.json`. Whatever it infers is offered as **Resume**, labelled *"inferred, not saved
state"* with the reasons printed above the menu — never silent, and you can always pick Regenerate
instead if the inference looks wrong.

### 7.16 "What does the data model actually look like?"

```bash
slc db
```

Reads every `data_model:` entry under `backend_specs/ARCH.md` (or `arch/*.md` if split) and prints
entities, fields, and types, plus relationships it can infer from `*_id`-style field names (e.g.
`Session.user_id -> User.id`). Pure, instant, no LLM call — and it says so plainly when nothing
matches the documented shape (SLC.md §5.5) rather than guessing at a different one.

### 7.17 "Is there anything risky in the specs themselves?"

```bash
slc audit
```

Scrutiny reviews your *requirement* before any spec exists. Doctor checks the generated specs are
*structurally* valid SLC. Neither one reads the actual architecture for security or design risk —
`slc audit` is that missing pass: an LLM review of ARCH + CONTRACT + SECURITY + CONSTRAINTS for
authn/authz gaps, unprotected sensitive fields, boundary violations the ARCH itself declares and
then contradicts, and constraint conflicts. Same flag shape as scrutiny (`block`/`warn`/`note`, each
with a one-line fix). It's **read-only** — a report, not an auto-fix — because a wrong security "fix"
is worse than a wrong structural one; address findings via `slc feature` or by editing the specs.

---

## 8. Troubleshooting

### Installing / running

| You see | Why | Fix |
|---|---|---|
| `slc : The term 'slc' is not recognized` (PowerShell) / `'slc' is not recognized` (cmd) | The bare command only exists after a **global install** | `npm install -g @wewiselabs/slc`, then open a new terminal |
| Still unrecognized after `-g` install | npm's global bin folder isn't on PATH | `npm config get prefix` → add that folder (Windows) or its `bin/` (macOS/Linux) to PATH, open a new terminal |
| PowerShell: `slc.ps1 cannot be loaded because running scripts is disabled` | Windows execution policy blocks npm's `.ps1` shim | Run `slc.cmd` instead, or once: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| `npx slc` installs something weird | Unscoped `slc` is a **different, unrelated package** on npm | Always the full name: `npx @wewiselabs/slc` |
| `slc is interactive — run it in a real terminal` | Output is piped, or the shell has no TTY (some CI shells, Git Bash via MinTTY) | Use Windows Terminal / PowerShell / a normal terminal; `doctor --json` and `bridge` still work piped |
| Banner/art looks garbled | Legacy console without unicode | `SLC_ASCII=1 slc` (plain-ASCII art) · `SLC_ANIM=0` disables the intro animation |
| Install fails / prompts hang oddly on an old Node | SLC's terminal UI runs on Ink, which needs **Node ≥22** | `node --version`; upgrade if older (Node 18 is past its own end-of-life anyway) |

### During a run

| You see | Do this |
|---|---|
| `Could not parse …output.json` | SLC shows what the file actually starts with. Empty → the agent saved to the wrong path. Prose → tell the agent "save the raw JSON only, no commentary". (UTF-16/BOM encodings are decoded automatically.) |
| `Expected a JSON array of files but found none` | Use a more capable model, or in bridge mode make sure the agent wrote real JSON to the output file. |
| `The output looks truncated` | The model hit its output limit — use a larger-output model, or bridge mode with your agent. |
| `slc doctor: N error(s)` | In API mode, accept the auto-fix. In bridge mode, fix in your agent and run `slc doctor`. |
| Key check failed | Check the base URL + key; you can still save and continue. |
| OpenAI `400: Unsupported parameter` (gpt-5 / o-series) | Handled automatically — SLC adapts `max_tokens`→`max_completion_tokens` and drops pinned temperature, then retries. Update SLC if you still see it. |
| Generation dies at exactly 2 minutes | Old versions had a 120s network cap; generations now get 5 minutes. Update SLC. |
| Scrutiny flagged something you disagree with | Pick **"Continue with my original text"** — the flag is recorded as an assumption, never enforced. |
| The taste demo didn't open in a browser | Open `.slc/preview/demo.html` yourself — the path is always printed. A missing/blocked opener never stops the run. |
| It generated the wrong thing | At the review gate, answer **No** and describe the change — backend regenerates. |
| Want a totally clean slate | Delete `spec/` and `.slc/`, run `slc` again. |

---

> SLC writes the specs. Your agent writes the code. Keep the two jobs separate and the drift
> goes away.
```
   (•‿•)  specs, not vibes.
```
