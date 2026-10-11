# ADR-003 — Feed Maestro from the TypeScript data package via a generated script

Status: proposed — verify in S1

## Context
Maestro flows are YAML; its JavaScript (`runScript`) cannot import npm/TypeScript modules.

## Decision
`npm run data:maestro` serialises `packages/test-data` into `maestro/.generated/data.js`, which assigns the data to
Maestro's `output` object. Flows run it first and reference `${output.data...}`. Fallback: generated `-e KEY=value` flags.

## Consequences
+ Single source of truth for data and expected strings across both tools.
− An extra build step; the generated file must be packaged for cloud runs.
This bridge is itself a comparison result for Q7 (data sharing: "generated bridge" vs Appium's "native import").
