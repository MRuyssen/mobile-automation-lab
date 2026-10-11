# ADR-002 — Accessibility-id selectors, platform logic in one module

Status: accepted (2026-10-11); Maestro part pending H1 verification

## Context
The demo app exposes ids as `testID` on iOS and `accessibilityLabel` on Android (`testProperties`).

## Decision
- Appium: `~<id>` on both platforms via `core/platform/selectors.ts` (`el(id)`, `byText(text)`).
- Maestro: per H1 outcome; divergent steps go to `maestro/subflows/{android,ios}`.
- No XPath except documented exceptions in APP-ANALYSIS.

## Consequences
The helper isolates the strategy, so the client app (which should map `testID` to Android resource-id) only
changes `selectors.ts`, not screens or specs.
