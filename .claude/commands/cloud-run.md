---
description: Run a suite on a cloud vendor with budget control (BrowserStack or TestMu AI)
argument-hint: <bs|tm> <appium|maestro> [smoke|full]
---
Cloud run requested: $ARGUMENTS

Preflight (stop at the first failure and report):
1. The flows involved passed locally 3× in a row (check run records).
2. Every vendor fact this run depends on is VERIFIED in `docs/VENDORS.md`; otherwise use `vendor-docs-researcher` first.
3. Read the minutes ledger in `PROGRESS.md`. Estimate minutes for this run (session start + flows) and tell me.
4. Wait for my explicit OK. Then run the matching `npm run cloud:*` script.

After the run:
- Collect run records, session/build URLs, session-create and queue times, artifact availability.
- Score artifact quality (rubric in `docs/COMPARISON-METHOD.md`).
- Update the minutes ledger and Findings. Never auto-retry on vendor errors; report them.
