# Mobile Automation Lab — Appium vs Maestro on React Native

Evidence-driven comparison of **Appium (WebdriverIO client inside Playwright Test)** and **Maestro** on the
[WebdriverIO native demo app](https://github.com/webdriverio/native-demo-app) (Expo / React Native),
locally and on the **BrowserStack** and **TestMu AI** device clouds.

Second goal: prove the architecture that will be proposed to a client — one TypeScript test runner,
a shared data package, shared fixtures, modular packages — before it touches a production React Native app.

## Status
Docs-first. No code yet. Claude Code builds it in 4 sessions (`docs/PLAN.md`), progress in `PROGRESS.md`.

## How to start
1. Do the human prerequisites in `docs/SETUP.md` (session S0).
2. `cp .env.example .env` and fill in vendor credentials. Claude Code is denied read access to `.env`.
3. `git init && git add -A && git commit -m "S0: docs and Claude Code config"`
4. Run `claude` in the repo root, then type `/session 1`. Start each later session in a fresh
   Claude Code conversation (`/clear`) with `/session <n>`.

## Map
| Path | Purpose |
|---|---|
| `CLAUDE.md` | Standing instructions for Claude Code (loaded every session) |
| `docs/ARCHITECTURE.md` | Packages, layers, fixtures, targets matrix |
| `docs/APP-ANALYSIS.md` | App facts, full selector map, flow specs F1–F6, hypotheses H1–H9 |
| `docs/PLAN.md` | Sessions S0–S4 with tasks, Definition of Done, cloud budgets |
| `docs/COMPARISON-METHOD.md` | Questions, metrics, fairness rules, results schema, report template |
| `docs/VENDORS.md` | BrowserStack / TestMu AI facts, marked VERIFIED / UNVERIFIED with sources |
| `docs/SETUP.md` | Machine and account prerequisites |
| `docs/decisions/` | Architecture Decision Records |
| `.claude/commands/` | `/session`, `/new-flow`, `/verify-selectors`, `/flake-check`, `/cloud-run`, `/report` |
| `.claude/agents/` | `selector-auditor`, `vendor-docs-researcher` subagents |
| `.claude/settings.json` | Permissions: local runs allowed, cloud runs ask first, secrets denied |
| `PROGRESS.md` | Session log, cloud-minute ledger, findings |
