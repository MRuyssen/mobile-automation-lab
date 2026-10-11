---
description: Run a planned build session from docs/PLAN.md (e.g. /session 2)
argument-hint: <session-number>
---
Execute session S$ARGUMENTS of `docs/PLAN.md`.

1. Read `PROGRESS.md` and the S$ARGUMENTS section of `docs/PLAN.md`. If the previous session's Definition of Done
   is not met, stop and list what is missing.
2. Restate the goal and DoD in at most 8 lines and create a todo list from the tasks. For S1, present the plan
   and wait for my confirmation before writing files.
3. Execute tasks in order. After each task run the narrowest relevant check (typecheck, one spec, one flow) and commit.
4. Load reference docs only when a task needs them (APP-ANALYSIS for selectors and flow specs, VENDORS for cloud work).
5. Never run a `cloud:*` script without stating expected minutes and getting my OK.
6. Finish: update `PROGRESS.md` (session log, hypotheses, authoring log, findings, minutes ledger, next steps),
   run typecheck + lint, commit `S$ARGUMENTS: <summary>`, and give me a 10-line wrap-up.
