# SLC CLI

> Spec-driven generation for AI builders. SLC reads your requirement, uses **your own LLM**, and
> generates a complete, validated **SLC spec tree** — for 100% faithful, decision-accurate specs.
> **It generates specs, never application code.**

Built on [Ink](https://github.com/vadimdemedes/ink) (React for terminals) — the mission map, every
prompt, and every report (`doctor`, `estimate`, `db`, `audit`) are real components. **Requires Node ≥22.**

## Run it

```bash
npx @wewiselabs/slc    # or: pnpm dlx @wewiselabs/slc   ·   bunx @wewiselabs/slc
```

Want the bare `slc` command? Install it globally once:

```bash
npm install -g @wewiselabs/slc
slc --help
```

> Heads-up: always use the full scoped name with npx. `npx slc` (unscoped) is a
> **different, unrelated package** on npm.

New here? **[GROUNDWORK.md](./GROUNDWORK.md)** is the field guide — step-by-step scenarios
(bridge mode with Claude Code, local Ollama, resuming after Ctrl+C, a requirement that isn't named
`requirement.md`, adding a feature to a built project, CI validation) and a troubleshooting table
for every known "it won't run" situation.

## What it does

1. **Uses your LLM.** Pick Anthropic (Claude) or any OpenAI-compatible endpoint (OpenAI, Google,
   OpenRouter, Ollama, …). Your model, your key, your decisions.
2. **Finds your requirement** — whatever it's called, whatever shape it's in. Common names first,
   then a content-scored scan of the folder, or `--file <path>` to point at it directly. No
   requirement at all? Type the idea into the terminal and SLC drafts one.
3. **Scrutinizes before it builds.** Your LLM audits the idea like a principal engineer —
   contradictions, feasibility, stack compatibility, security footguns, scale/cost for your
   ambition level (hobby · growth · business) — and asks every decision that genuinely matters
   (no cap). Skipped decisions become **explicit assumptions**, never silent inventions.
   **It reviews; it does not rewrite:** an already-solid brief is left completely untouched, and
   when there are fixes you see a **diff** before anything is written (original backed up to
   `.slc/requirement.backup.md`). Nothing generates until you confirm.
4. **Splits scope** — a single full-app requirement becomes backend + frontend work.
5. **Backend first.** Generates the backend spec tree, validates it, and **stops at a review gate**.
6. **Frontend second.** Only after you confirm the backend, it generates the frontend specs with their
   CONTRACT **derived from the backend** (FE-derives-from-BE).
7. **Validates** everything with `slc doctor`.

## Commands

| Command | Does |
|---|---|
| `slc` | The guided generator (the flow above). Finds your requirement automatically. |
| `slc --file <path>` | Same, but reads the requirement from an exact path — any name, any format. |
| `slc feature "<desc>"` | Add one feature to an existing `spec/` tree without regenerating it. New phase, nothing renumbered; `CONTEXT`/`CONSTRAINTS`/`SECURITY` never touched. |
| `slc estimate` | Token report for an existing `spec/` tree — measured + derived + estimated, no baked-in pricing. |
| `slc db` | Data model view — entities, fields, inferred relationships. No LLM call. |
| `slc audit` | Security/architecture review of the generated specs — report only, never an auto-fix. |
| `slc doctor` | Validate an existing `spec/` tree — structure, references, secrets, and post-merge damage (conflict markers, duplicate ids/blocks, stale counts). Run it after every merge. |
| `slc --help` / `--version` | Help / version. |

## Config

Your provider + key are saved to `.slc/config.json` (auto-gitignored). `ANTHROPIC_API_KEY` or
`OPENAI_API_KEY` in the environment are picked up automatically.

## Develop

```bash
npm install
npm run build
node dist/index.js --help
```
