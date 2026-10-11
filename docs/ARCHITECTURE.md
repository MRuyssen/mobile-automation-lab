# Architecture

## Goals
- One TypeScript runner (Playwright Test) for Appium specs, so fixtures, reporters and CI patterns match the
  existing Playwright web setup at the client.
- A runner-agnostic shared layer (data, config, capabilities, platform helpers) that could survive a runner change.
- Maestro consumes the same data through a generated bridge, so the comparison is about the tools, not about data.
- Every run produces a machine-readable record for the comparison report.

Non-goals: production CI, a SQL data provider (interface only), modifying the app, iOS real devices (ADR-005).

## Repository layout (target)
```
mobile-automation-lab/
├─ CLAUDE.md  AGENTS.md  PROGRESS.md  README.md
├─ package.json              # npm workspaces root; scripts as listed in CLAUDE.md; exact version pins
├─ tsconfig.base.json        # strict
├─ eslint.config.js          # flat config, minimal
├─ .env.example
├─ apps/                     # downloaded binaries (gitignored)
├─ .appium/                  # APPIUM_HOME: repo-local drivers (gitignored)
├─ packages/
│  ├─ test-data/             # pure data + provider interface; zero runner/tool deps
│  │  └─ src/ schemas.ts · provider.ts · static/{users,forms,swipe,texts}.ts · index.ts
│  ├─ core/                  # runner-agnostic; may import webdriverio types, never @playwright/test
│  │  └─ src/ config.ts · targets.ts · app-ids.ts
│  │         capabilities/{index,local,browserstack,testmu}.ts
│  │         vendors/{browserstack,testmu}.ts        # upload, session status, session URL
│  │         platform/{selectors,gestures,alerts,keyboard,context,app-lifecycle}.ts
│  │         metrics/{record,writer}.ts
│  └─ mobile-e2e/            # Playwright Test layer
│     ├─ playwright.config.ts
│     ├─ fixtures/ driver.ts · app.ts · screens.ts · data.ts · evidence.ts · metrics.ts · index.ts
│     ├─ screens/ Navigation · Login · Forms · Swipe · WebView · Drag · DataManagement (.screen.ts)
│     └─ specs/ F1-login.spec.ts … F6-data-persistence.spec.ts
├─ maestro/
│  ├─ config.yaml
│  ├─ flows/ F1-login.yaml …
│  ├─ subflows/{common,android,ios}/   # platform-divergent steps only
│  ├─ .generated/data.js               # generated from packages/test-data (gitignored)
│  └─ cloud/ browserstack/ (zip layout) · testmu/hyperexecute.yaml
├─ scripts/                  # tsx: download-apps, upload-app, maestro-package, maestro-run, flake, report
├─ results/ runs/*.json · REPORT.md
└─ docs/
```

## Layering rules
```
test-data  ←  core  ←  mobile-e2e (Playwright)
    ↑
    └──── scripts/generate-maestro-data → maestro/.generated/data.js ← maestro flows
```
- Lower layers never import upper layers. `core` has no Playwright import, so it can be reused with
  another runner or in the client repo unchanged.
- Specs import fixtures and screens only. Screens import `core/platform`. Nobody imports vendor modules
  except `core/capabilities` and the `driver` fixture.

## Runner choice (ADR-001)
Playwright Test drives Appium through WebdriverIO's standalone `remote()`. We keep Playwright's fixtures,
projects, retries, reporters and `testInfo.attach`. We lose Playwright's auto-retrying locator assertions,
trace viewer, UI mode and codegen for mobile. Compensate with `expect.poll` and evidence attachments.

## Targets matrix (Playwright projects)
| Project | Platform | Target | App artifact | Device | Purpose |
|---|---|---|---|---|---|
| `android-local` | Android | local Appium | `android.wdio.native.app.v2.2.0.apk` | emulator (`ANDROID_AVD`) | authoring, flake runs |
| `ios-local` | iOS | local Appium (macOS only) | `wdiodemoapp.app` from simulator zip | simulator (`IOS_SIM_DEVICE`) | authoring, flake runs |
| `android-bs` | Android | BrowserStack App Automate | uploaded APK (`bs://…`) | one current real Android model | cloud comparison |
| `android-tm` | Android | TestMu AI real device | uploaded APK (`lt://…`) | same model family as BrowserStack | cloud comparison |
| `ios-tm-sim` | iOS | TestMu AI virtual device (UNVERIFIED) | uploaded simulator build | simulator | iOS cloud data point |
| — | iOS | BrowserStack | needs a device `.ipa`; app ships simulator-only | — | excluded (ADR-005) |

Project `use` carries `{ platform, target, device }`; everything else is derived in `core`.

## Fixtures (packages/mobile-e2e/fixtures)
| Fixture | Scope | Responsibility |
|---|---|---|
| `driver` | worker | build capabilities via `core/capabilities`, `remote()`, measure `sessionCreateMs`; teardown: mark vendor session status, `deleteSession()`. Fixture timeout 300 s (cloud sessions are slow). |
| `app` | test | reset policy per flow (default: terminate + activate; F6: explicit lifecycle). Bundle ids from `core/app-ids.ts`. |
| `screens` | test | lazily constructed screen objects bound to `driver` |
| `data` | test | `TestDataProvider` from `packages/test-data` |
| `evidence` | test, auto | on failure attach screenshot, page source and (cloud) session URL |
| `metrics` | test, auto | write one run record per test to `results/runs/` |

Parallelism: local `workers: 1` (one device). Cloud workers = purchased parallels (trials: see `docs/VENDORS.md`).
If more than one local device is ever used, map devices and ports by `testInfo.parallelIndex`, never `workerIndex`.

## Selector strategy (ADR-002)
The app's `testProperties(id)` sets `testID` on iOS and `accessibilityLabel` on Android. Therefore:
- Appium: `el(id)` → `$('~' + id)` on both platforms (accessibility id = iOS identifier / Android content-desc).
- Text lookup `byText(text)`: Android `android=new UiSelector().text("…")`, iOS `-ios predicate string:label == "…"`.
- All platform-specific code lives in `core/src/platform/*`: `selectors`, `gestures` (swipe, scroll, drag),
  `alerts` (native dialogs), `keyboard`, `context` (WebView), `app-lifecycle` (terminate, activate, clearApp, deep link).
- Maestro: platform-divergent selectors go into `maestro/subflows/android|ios` and are chosen with
  `runFlow` + `when: platform:` (see H1 in APP-ANALYSIS). The number of divergent steps is a metric.

## Test data (packages/test-data)
- `TestDataProvider` interface, **async from day one** (a future SQL provider must not change signatures).
- `StaticProvider` implements it from typed modules validated with zod.
- Query by intent (`users.valid()`, `users.invalidEmail()`, `users.uniqueSignUp(runId)`), not by index.
- Expected UI strings (alert texts, validation errors, card titles) live here too: one source for both tools.

## Maestro data bridge (ADR-003, verify in S1)
`npm run data:maestro` writes `maestro/.generated/data.js` that assigns the data to Maestro's `output`
object. Flows start with `runScript` on that file and then use `${output.data...}`. Fallback if that
doesn't work: generate `-e KEY=value` flags. For cloud runs the generated file is packaged into the suite.

## Run records
Appium: written by the `metrics` fixture. Maestro: `scripts/maestro-run.ts` runs the CLI with JUnit output
and converts it into the same record shape. Schema: `docs/COMPARISON-METHOD.md`.

## Security
- Credentials only from environment, only inside `core/src/vendors/*`; never logged.
- Nothing sensitive in capabilities, build, session or test names (vendor residency controls don't cover them).
- Synthetic data only. `.env` is denied to Claude Code.

## What transfers to the client repo
`packages/test-data` (interface + provider pattern), `packages/core` (capabilities, vendors, platform helpers),
fixture design, project matrix, run-record schema. The demo-app screens and flows do not transfer.
