---
description: Repeat a flow N times locally and record pass/flake data
argument-hint: <flow-id> <appium|maestro> <android|ios> [n=10]
---
Run a local flake check for: $ARGUMENTS

1. Use `npm run flake -- $ARGUMENTS` (default n=10). Local targets only — never cloud.
2. Retries must be disabled; every repetition writes its own run record.
3. Summarise: passes, failures, failure types (selector / timing / gesture / environment / assertion), median duration.
4. For any failure, attach the evidence path and add a line to Findings in `PROGRESS.md`.
Do not fix code in this command; propose fixes separately.
