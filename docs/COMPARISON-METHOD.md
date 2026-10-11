# Comparison method

## 1. Questions the report must answer
| ID | Question |
|---|---|
| Q1 | Can each tool meet the client requirements: real devices in the cloud (incl. iOS), shared data, modular hooks and fixtures? |
| Q2 | Authoring effort and readability per flow |
| Q3 | Stability: pass rate and flakiness, local and cloud |
| Q4 | Speed: session creation and flow duration |
| Q5 | Hard-case coverage (H2–H8) |
| Q6 | Cloud ergonomics per vendor: upload, run, artifacts, API steps, failure diagnosis |
| Q7 | Architecture fit: data sharing, fixtures and hooks, CI integration, reporting into a test management tool |

## 2. Metrics
| Metric | Definition | How it's measured |
|---|---|---|
| Pass rate | passes / runs per (flow, tool, platform, target) | run records; local n=10, cloud n=2 |
| Flake count | failures that pass on an unchanged rerun | `npm run flake`; reruns are separate records, never counted as passes |
| Flow duration | test body only, excluding session creation | Appium: `metrics` fixture. Maestro: JUnit per-flow time |
| Session creation | time until the device is driveable | Appium: `remote()` duration. Maestro cloud: vendor build timestamps if exposed |
| Queue time | waiting for a free cloud device | vendor API timestamps if exposed, else `null` with a note |
| Authoring size | non-blank, non-comment lines per flow, incl. helpers it uses (pro-rated) | script or manual count, recorded once per flow |
| Platform divergence | count of platform branches / platform subflows a flow needs | code review, recorded once per flow |
| Attempts to green | number of failed iterations before the first green run | authoring log in `PROGRESS.md` |
| Hard-case outcome | `native` / `workaround` / `fail` + note | per hypothesis |
| Artifact quality | 1–5 rubric: video, logs, screenshot and hierarchy at failure, direct session link | judged per vendor × tool in S3 |
| Cloud integration cost | number of API calls / scripts / packaging steps to run one suite | from implementation |
| Data sharing | `native import` / `generated bridge` / `not possible` | per tool |

## 3. Fairness rules
- Same app build (v2.2.0), same data, same device model and OS per target for both tools.
- Tool versions fixed (CLAUDE.md pins). Record versions in every run record.
- Cold vs warm: first run after app install is marked `cold: true`.
- Retries are disabled for measurement runs. A rerun is a new record.
- Both tools are authored by Claude Code: authoring time is indicative only. Readability is judged by Maarten
  from side-by-side listings in the report.

## 4. Run record schema (`results/runs/<runId>.json`, one file per test or flow run)
```json
{
  "runId": "2026-10-12T10-15-00Z_F1_appium_android_local_01",
  "flowId": "F1",
  "case": "a",
  "tool": "appium",
  "platform": "android",
  "target": "local",
  "device": "Pixel_8_API_35",
  "osVersion": "15",
  "status": "passed",
  "cold": false,
  "durationMs": 18234,
  "sessionCreateMs": 6120,
  "queueMs": null,
  "failure": null,
  "toolVersions": { "appium": "3.8.0", "uiautomator2": "8.7.0", "webdriverio": "9.32.0", "playwright": "1.63.0", "maestro": null },
  "appVersion": "2.2.0",
  "artifacts": { "video": null, "screenshot": null, "sessionUrl": null },
  "notes": ""
}
```
`status`: `passed` | `failed` | `blocked` (environment or vendor issue, not the test). `failure`: `{ type, message }`
with `type` in `selector` | `timing` | `gesture` | `environment` | `vendor` | `assertion`.

## 5. Report template (`results/REPORT.md`, generated + hand-finished)
1. Summary: recommendation in five lines, with the deciding metrics.
2. Requirement fit (Q1) table: tool × requirement → yes / workaround / no.
3. Local results: pass rate, flakes, durations per flow × tool × platform.
4. Hard cases (Q5): H2–H8 outcome matrix with evidence links.
5. Authoring (Q2): size, divergence, attempts; side-by-side F1 listing for readability.
6. Cloud (Q4, Q6): per vendor × tool: session/queue/run times, artifact score, integration cost, minutes used.
7. Architecture fit (Q7): data sharing, fixtures and hooks, reporting into test management.
8. Threats to validity.
