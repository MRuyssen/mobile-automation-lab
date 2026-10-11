---
description: Verify the APP-ANALYSIS selector map for one screen against the live UI, both tools
argument-hint: <screen e.g. Login> [android|ios]
---
Verify selectors for: $ARGUMENTS

Delegate to the `selector-auditor` subagent with the screen name and platform(s). Then:
1. Make sure evidence files exist: `docs/evidence/<platform>/<screen>.appium.xml` and `.maestro.json`.
2. Update the status columns in `docs/APP-ANALYSIS.md` §3 (✅ / ❌ / ~ with a short note).
3. Where a tool needs a different locator than the id column, add the exact working locator in the notes.
4. If a hypothesis in §4 is resolved by this, update it there and in `PROGRESS.md`.
Do not change test code in this command.
