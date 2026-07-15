# Releasing @wewiselabs/slc

The propagation + publish checklist. Run it top to bottom for every release.

## 0. One-time (before the FIRST publish)
- [ ] Extract `cli/` to its own public repo (`shahabuddin135/SLC-CLI`) — the portal repo stays private.
      (GitHub account is `shahabuddin135`; the wewiselabs account gets added as a collaborator.)
- [ ] Verify the LICENSE text against https://fsl.software (FSL-1.1-MIT, Licensor: WeWise Labs).
- [ ] Confirm the npm org `@wewiselabs` exists and you own it (`npm org ls wewiselabs`).
      (`@wewise` was already taken on npm, so the npm org is `wewiselabs`.)
- [ ] Set `repository`, `homepage`, `bugs` in package.json to the new repo URLs.

## 1. Propagate (framework spec → CLI → site)
- [ ] Framework files changed? `npm run sync-assets` (re-copies SLC.md, structure, getting-started
      into `assets/` and records SHA provenance in `assets/SOURCE.json`).
- [ ] If the reference grammar or required files changed: update the output contract in
      `src/generate.ts` and the checks in `src/doctor.ts` to match.
- [ ] If capabilities changed: update the site comparison + docs claims (keep Defined vs Enforced honest).

## 2. Verify
- [ ] `npm test` — clean build + all unit tests green (also runs automatically on publish).
- [ ] `node dist/index.js --version` matches package.json.
- [ ] `node dist/index.js doctor` on a known-good spec tree → PASS, exit 0.
- [ ] `node dist/index.js doctor --json` → valid JSON, exit codes correct.
- [ ] `SLC_ASCII=1 node dist/index.js --help` → plain-ASCII art renders.
- [ ] One real generation smoke test (bridge mode is free: run `slc` in a scratch dir with a small
      requirement.md, complete the loop with your agent, confirm doctor PASS + handoff line).

## 3. Publish
- [ ] Bump `version` in package.json (semver).
- [ ] `npm pack --dry-run` — confirm ONLY `dist/`, `assets/`, README, LICENSE ship. No `.slc/`, no src.
- [ ] `npm publish` (scoped package: `publishConfig.access=public` is already set).
- [ ] Tag the repo: `git tag v<version> && git push --tags`.

## 4. After
- [ ] Update the site's install snippets if the package name/major changed.
- [ ] Note the release + bundled framework hashes (assets/SOURCE.json) in the changelog.
