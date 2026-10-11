# ADR-004 — Exact version pins, at least 14 days old

Status: accepted (2026-10-11)

## Decision
Pin exact versions released at least two weeks before adoption (supply-chain hygiene, ecosystem settling).
Pins on 2026-10-11:

| Package | Pin | Note |
|---|---|---|
| appium | 3.8.0 | |
| appium-uiautomator2-driver | 8.7.0 | |
| appium-xcuitest-driver | 12.13.2 | 12.17.x too fresh |
| webdriverio | 9.32.0 | v10.0.0 released 2026-10-05 → re-evaluate after it settles |
| @playwright/test | 1.63.0 | 1.64.0 too fresh |
| typescript | 6.0.3 | TS 7 (native compiler) deferred until lint tooling is confirmed compatible |
| tsx | 4.23.15 | |
| zod | 4.6.5 | |
| Maestro CLI | 2.10.0 | 2.11.0 eligible from 2026-10-13 |

## Consequences
Upgrades are deliberate: a new ADR, then one session that runs the full local suite before and after.
