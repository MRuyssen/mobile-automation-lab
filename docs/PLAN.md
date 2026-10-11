# Build plan — S0 (you) + four Claude Code sessions

Principles: local first, cloud last. One flow end-to-end on one platform before widening. Every session ends
green, committed, and with `PROGRESS.md` updated. Start each session in a fresh conversation: `/clear`, then `/session <n>`.

Working style that keeps sessions efficient:
- Start S1 in plan mode and confirm the plan before writing files.
- Use the subagents for doc lookups and hierarchy dumps; they keep the main context small.
- Run the narrowest check after each task (one spec, one flow, typecheck), not the whole suite.
- `/compact` when context gets long. Commit after each task.

Cloud budget: S1–S2 use **0** cloud minutes. S3 caps at **80 min BrowserStack** and **80 min TestMu AI**
(20 min reserve each). Every `cloud:*` run needs an explicit OK in chat.

---

## S0 — Human prep (you, 1–2 h) → `docs/SETUP.md`
DoD: emulator visible in `adb devices`; `maestro --version` = 2.10.0;
(macOS) a booted iPhone simulator; `.env` filled; vendor accounts created; repo committed.

---

## S1 — Skeleton + F1 end-to-end on Android, both tools
Goal: prove the architecture with one complete vertical slice and the metrics pipeline.

Tasks
1. Root: `package.json` (workspaces, exact pins from CLAUDE.md, all script names), `tsconfig.base.json` (strict),
   minimal flat ESLint config, `.gitignore` (apps/, .appium/, .env, maestro/.generated/, test-results/, .cache/).
2. `scripts/download-apps.ts` → `apps/` (APK + unzip iOS simulator build). Idempotent.
3. Repo-local Appium: `APPIUM_HOME=.appium`, install the pinned drivers via an npm script, run `appium driver doctor` for each; `npm run appium`.
4. `packages/test-data`: zod schemas, `TestDataProvider` (async), `StaticProvider`, data for F1–F4 (APP-ANALYSIS §6).
5. `packages/core`: `config.ts` (env via `process.loadEnvFile` if `.env` exists), `targets.ts`, `app-ids.ts`,
   `capabilities/local.ts`, `platform/{selectors,alerts,keyboard,app-lifecycle}.ts`, `metrics/*`.
6. `packages/mobile-e2e`: `playwright.config.ts` (projects `android-local`, `ios-local`), all fixtures from
   ARCHITECTURE, `Navigation` + `Login` screens, `F1-login.spec.ts` (cases a, b, c).
7. `/verify-selectors Login` on Android: evidence files + status columns; resolve **H1, H6, H7, H9** in APP-ANALYSIS.
8. Maestro: `config.yaml`, `scripts/generate-maestro-data.ts` (ADR-003; fall back to `-e` flags if `runScript` can't
   feed variables), `flows/F1-login.yaml` (+ platform subflows if H1 confirmed), `scripts/maestro-run.ts` (JUnit → run records).
9. `scripts/report.ts` → `npm run metrics:report` → first `results/REPORT.md`.
10. macOS only: F1 on `ios-local` for both tools.

DoD
- F1 green 3× consecutively on `android-local` in both tools (and `ios-local` if on macOS).
- Run records for every run, `REPORT.md` generated, typecheck + lint clean.
- H1, H6, H7, H9 resolved with evidence. `PROGRESS.md` updated, committed.

Stop conditions: Appium session won't start after 30 min of debugging → log an environment finding and ask me.

---

## S2 — Core flows F2–F4 + flake data (local only)
Tasks
1. Screens + specs + flows for **F2 Forms**, **F3 Swipe**, **F4 WebView** in both tools (`/new-flow F2` …).
2. `platform/gestures.ts` (carousel swipe, scroll-into-view) and `platform/context.ts` (WebView); resolve **H2, H3, H4**.
3. `/verify-selectors` for Forms, Swipe, WebView on each available platform.
4. `/flake-check` n=10 for F1–F4 × both tools × each local platform.
5. Authoring log in `PROGRESS.md`: attempts to green per flow per tool, platform branches added, notable workarounds.

DoD: F1–F4 green in both tools on `android-local` (and `ios-local` on macOS); n=10 flake records each;
H2–H4 resolved with evidence; `REPORT.md` regenerated; committed.

---

## S3 — Cloud: BrowserStack + TestMu AI (ask before every cloud command)
Tasks
1. `vendor-docs-researcher`: verify every UNVERIFIED item S3 depends on (hubs, capability names, session-status
   APIs, TestMu virtual iOS, HyperExecute on the free plan, BrowserStack's Maestro version). Update `docs/VENDORS.md`.
2. `core/vendors/{browserstack,testmu}.ts`: upload (cache returned app ids in `.cache/apps.json`), session status,
   session URL. `core/capabilities/{browserstack,testmu}.ts`.
3. Playwright projects `android-bs`, `android-tm` (+ `ios-tm-sim` only if verified).
4. Maestro cloud: BrowserStack (`scripts/maestro-package.ts` builds the suite zip incl. `.generated/data.js`; v2 API:
   upload app → upload suite → build → poll); TestMu (`maestro/cloud/testmu/hyperexecute.yaml`).
5. Smoke first: F1 only, one run per vendor × tool (~5 min each). Then F1–F4 × 2 runs per vendor × tool.
6. Record session-create time, queue time if the vendor exposes it, run time, artifact quality, failure root causes.

DoD: each vendor × tool executed F1–F4 twice on a real Android device (or a documented blocker); minutes ledger
up to date; `REPORT.md` has the cloud section; committed.

---

## S4 — Report + stretch
Tasks
1. Final `results/REPORT.md` answering COMPARISON-METHOD §1 with data, plus a recommendation matrix.
2. Stretch, in order: **F5 Drag** (H5), **F6 Data persistence** (H8), `ios-tm-sim` cloud data point if not done.
3. Note on iOS real devices: what it would take (build from source, signing, Apple Developer account), no implementation.
4. Client-transfer checklist: which files move unchanged, which need replacing.

DoD: report complete and data-backed; `PROGRESS.md` final; committed.
