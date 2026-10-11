# CLAUDE.md — Mobile Automation Lab

## Mission
Build a comparison lab: the same flows implemented in **Appium** (WebdriverIO `remote()` client, driven by
**Playwright Test**) and in **Maestro**, run against the WebdriverIO native demo app (Expo / React Native)
locally and on BrowserStack + TestMu AI. The output is evidence (run records in `results/`), not opinions.
The architecture itself (shared data + fixtures, modular packages) is also under test: it will be proposed to a client.

## Start of every session
1. Read `PROGRESS.md` (state, open issues, cloud minutes left).
2. Read your session in `docs/PLAN.md` (tasks + Definition of Done). Entry point: `/session <n>`.
3. Load on demand, not upfront: `docs/APP-ANALYSIS.md` (selectors, flow specs), `docs/ARCHITECTURE.md`,
   `docs/VENDORS.md`, `docs/COMPARISON-METHOD.md`, `docs/decisions/*`.

## Stack (pinned — changing a pin requires a new ADR, see ADR-004)
- Node 24 LTS, npm workspaces, TypeScript 6.0.3 (strict)
- @playwright/test 1.63.0 — the ONLY runner for Appium specs (ADR-001)
- webdriverio 9.32.0, used as standalone `remote()` client (not the WDIO runner, not v10 yet)
- appium 3.8.0 + appium-uiautomator2-driver 8.7.0 + appium-xcuitest-driver 12.13.2, repo-local (`APPIUM_HOME=.appium`)
- Maestro CLI 2.10.0
- tsx 4.23.15, zod 4.6.5. Prefer Node built-ins over new deps (`process.loadEnvFile()` instead of dotenv).
- App under test: native-demo-app **v2.2.0**, binaries in `apps/` (downloaded, never committed)

## Commands (create exactly these in S1; keep names stable)
| Command | What |
|---|---|
| `npm run apps:download` | fetch v2.2.0 APK + iOS simulator zip into `apps/` |
| `npm run appium` | start local Appium (port `APPIUM_PORT`, default 4723) |
| `npm run test:local:android` / `npm run test:local:ios` | Playwright projects `android-local` / `ios-local` |
| `npm run maestro:local:android` / `npm run maestro:local:ios` | Maestro flows locally |
| `npm run data:maestro` | generate `maestro/.generated/data.js` from `packages/test-data` |
| `npm run flake -- <flow> <tool> <platform> <n>` | repeat local runs, write run records |
| `npm run cloud:bs:appium` / `npm run cloud:bs:maestro` | BrowserStack — consumes minutes |
| `npm run cloud:tm:appium` / `npm run cloud:tm:maestro` | TestMu AI — consumes minutes |
| `npm run metrics:report` | aggregate `results/runs/*.json` into `results/REPORT.md` |
| `npm run typecheck` / `npm run lint` | quality gates, run before every commit |

Anything that consumes cloud minutes MUST be named `cloud:*` (the permission config asks before running those).

## Hard rules
1. **Selectors come from `docs/APP-ANALYSIS.md` only.** If one fails: dump the hierarchy, fix the doc first
   (evidence in `docs/evidence/`), then the code. Use `/verify-selectors` or the `selector-auditor` subagent.
   No guessing. No XPath unless the doc lists it as an exception.
2. **Every flow exists twice** (Appium spec + Maestro flow) with the same Flow ID and the same data from
   `packages/test-data`. Never hard-code test data or expected UI strings in specs or flows.
3. **Cloud minutes are scarce.** Before any `cloud:*` script: state the expected minutes and wait for my OK.
   Only send suites that passed locally 3× in a row. Log minutes used in `PROGRESS.md`.
4. **Secrets:** never read `.env`, never echo credentials, never put credentials, tokens or personal data in
   capabilities, build names, session names or test names. Vendor credentials are read only via `process.env`
   inside `packages/core/src/vendors/*`.
5. **Vendor facts:** `docs/VENDORS.md` marks items VERIFIED / UNVERIFIED. Before relying on an UNVERIFIED item,
   verify it in official docs (`vendor-docs-researcher` subagent) and update the doc with the source URL.
6. **Don't modify the demo app and don't hide its limitations.** Untestable = a finding in `PROGRESS.md`.
7. **Measure everything:** every run writes a record per `docs/COMPARISON-METHOD.md`. Log failed authoring
   attempts too; authoring effort is a metric.
8. **Platform branches live in one place:** `packages/core/src/platform/*` (Appium) and
   `maestro/subflows/{android,ios}/` (Maestro). Never inside specs.
9. Small files, strict TS, no `any`, no fixed sleeps. If a wait is unavoidable, document it as a finding.
10. End every session: update `PROGRESS.md`, run typecheck + lint, commit as `S<n>: <summary>`.

## Conventions
- Flow IDs: F1 login · F2 forms · F3 swipe · F4 webview · F5 drag (stretch) · F6 data persistence (stretch)
- Files: `packages/mobile-e2e/specs/F1-login.spec.ts` ↔ `maestro/flows/F1-login.yaml`
- Playwright projects: `android-local`, `ios-local`, `android-bs`, `android-tm`, `ios-tm-sim`
- Screen objects: one per app screen, intent-level methods (`login(user)`), no assertions inside.
- Assertions live in specs; use `expect.poll` for eventual conditions.
- One task = one commit where practical.

## When stuck
- Selector or gesture problem → `/verify-selectors <screen>` or the `selector-auditor` subagent.
- Vendor API problem → `vendor-docs-researcher` subagent, then update `docs/VENDORS.md`.
- Same failure 3 times → stop, write it up in `PROGRESS.md` as a finding, move on or ask me.
