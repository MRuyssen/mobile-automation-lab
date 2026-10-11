# ADR-001 — Playwright Test as the single runner, WebdriverIO as Appium client

Status: accepted (2026-10-11)

## Context
The client already runs Playwright Test for web. The goal is shared data, hooks and fixtures across web and mobile.
Options: (a) WebdriverIO test runner for mobile, (b) Playwright Test driving Appium via WebdriverIO `remote()`.

## Decision
(b). Appium sessions are created inside Playwright fixtures with `webdriverio`'s standalone `remote()`.

## Consequences
+ One runner, one fixture model, one reporter pipeline, same CI patterns as web.
+ The shared layer (`test-data`, `core`) is runner-agnostic, so (a) remains possible later.
− No auto-retrying locator assertions, trace viewer, UI mode or codegen for mobile → `expect.poll`, evidence fixture.
− Fewer community examples than the WDIO runner; Appium server lifecycle is ours to manage.
