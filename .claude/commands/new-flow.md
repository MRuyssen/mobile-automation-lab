---
description: Implement one flow (F1–F6) in BOTH Appium and Maestro from its spec
argument-hint: <flow-id e.g. F2>
---
Implement flow $ARGUMENTS in both tools.

1. Read the $ARGUMENTS spec in `docs/APP-ANALYSIS.md` §5, the selector rows it uses (§3) and the data keys (§6).
2. If any needed selector row is `?` for the current platform, run the hierarchy check first (`selector-auditor`).
3. Add missing data to `packages/test-data` (never inline data or expected strings).
4. Appium: screen object methods (intent-level, no assertions) → `packages/mobile-e2e/specs/$ARGUMENTS-*.spec.ts`.
   Platform-specific behaviour only in `packages/core/src/platform/*`.
5. Maestro: `maestro/flows/$ARGUMENTS-*.yaml`; platform-divergent steps in `maestro/subflows/{android,ios}/`.
6. Run each once locally per available platform; iterate to green. Log every failed attempt and its cause in the
   authoring log in `PROGRESS.md` (attempt count is a metric).
7. Run 3× consecutively per tool; then commit `$ARGUMENTS: <summary>`.
