# SLC CLI

> Spec-driven generation for AI builders. SLC reads your `requirement.md`, uses **your own LLM**, and
> generates a complete, validated **SLC spec tree** — for 100% faithful, decision-accurate specs.
> **It generates specs, never application code.**

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
(bridge mode with Claude Code, local Ollama, resuming after Ctrl+C, CI validation) and a
troubleshooting table for every known "it won't run" situation.

## What it does

1. **Uses your LLM.** Pick Anthropic (Claude) or any OpenAI-compatible endpoint (OpenAI, Google,
   OpenRouter, Ollama, …). Your model, your key, your decisions.
2. **Reads your requirement** — or takes a raw idea typed into the terminal and drafts one.
3. **Scrutinizes before it builds.** Your LLM audits the idea like a principal engineer —
   contradictions, feasibility, stack compatibility, security footguns, scale/cost for your
   ambition level (hobby · growth · business) — then proposes a **repaired requirement** and asks
   only the decisions that matter. Skipped decisions become **explicit assumptions**, never
   silent inventions. Nothing generates until you confirm.
4. **Splits scope** — a single full-app requirement becomes backend + frontend work.
5. **Backend first.** Generates the backend spec tree, validates it, and **stops at a review gate**.
6. **Frontend second.** Only after you confirm the backend, it generates the frontend specs with their
   CONTRACT **derived from the backend** (FE-derives-from-BE).
7. **Validates** everything with `slc doctor`.

## Commands

| Command | Does |
|---|---|
| `slc` | The guided generator (the flow above). |
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
