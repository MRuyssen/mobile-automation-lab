# Vendor integration facts

Status: **VERIFIED** = confirmed in vendor docs on 2026-10-11 (source listed). **UNVERIFIED** = plausible but must
be checked against official docs before code depends on it (use the `vendor-docs-researcher` subagent, then update
this file with the URL and date). Prefer the vendor's capabilities generator over memory.

## BrowserStack App Automate
| Topic | Fact | Status |
|---|---|---|
| App upload | `POST https://api-cloud.browserstack.com/app-automate/upload` (multipart `file`, or `data={"url":…}`; optional `custom_id`) → `app_url` `bs://…` | VERIFIED [1] |
| Upload retention | uploaded apps are deleted after 30 days by default | VERIFIED [1] |
| iOS apps | `.ipa` only; BrowserStack re-signs with its own profile. The demo app has no device build → no iOS on BrowserStack (ADR-005) | VERIFIED [2][3] |
| iOS simulators on App Automate | assume none | UNVERIFIED |
| Appium hub | `https://hub.browserstack.com/wd/hub` | UNVERIFIED |
| Capabilities | W3C `bstack:options` (`userName`, `accessKey`, `deviceName`, `osVersion`, `projectName`, `buildName`, `sessionName`) + `appium:app = bs://…` | UNVERIFIED (names) |
| Session status | `browserstack_executor` `setSessionStatus` via `executeScript` | UNVERIFIED |
| Maestro flow | upload app → upload suite zip `POST /app-automate/maestro/v2/test-suite` → run `POST /app-automate/maestro/v2/android/build` (or `/ios/build`) → poll `GET /app-automate/maestro/v2/builds/{id}` | VERIFIED [4][5] |
| Maestro suite layout | without an `execute` list the suite needs a `main.yaml` in its parent folder | VERIFIED [5] |
| Maestro iOS | iOS versions below 15 unsupported | VERIFIED [5] |
| Maestro version run by BrowserStack | may lag the CLI; check before using 2.x-only YAML features | UNVERIFIED |
| EU data residency | Geo Region Restriction for App Automate, EU region, enabled via support, uses `hub-eu-only.browserstack.com`; capabilities, build and test names are not region-restricted. Not needed for this lab (synthetic data) | VERIFIED [6] |
| Free trial | 100 App Automate minutes | VERIFIED (third-party) [7] |
| Tunnel | not needed: the app only calls the public webdriver.io site | — |

## TestMu AI (formerly LambdaTest)
| Topic | Fact | Status |
|---|---|---|
| App upload (real devices) | `POST https://manual-api.lambdatest.com/app/upload/realDevice` (multipart `appFile`, or `url`) → `app_url` `lt://APP…` | VERIFIED [8] |
| Appium hub | `https://mobile-hub.lambdatest.com/wd/hub` with credentials inline; the browser hub is a different service | VERIFIED [8] |
| Capabilities | `platformName`, `deviceName`, `platformVersion`, `app`, `isRealMobile: true` (+ `build`, `name`) — exact nesting inside `LT:Options` vs top-level | UNVERIFIED (nesting) |
| Virtual iOS simulators | upload endpoint for simulator builds and `isRealMobile: false` behaviour | UNVERIFIED |
| Session status | API or executor to mark pass/fail | UNVERIFIED |
| Maestro | runs through HyperExecute with one YAML config; build uploaded via the same endpoint | VERIFIED [9] |
| Maestro on real iPhones | needs a vendor wrapper JAR, enabled per organisation via support | VERIFIED [10] |
| HyperExecute on the free plan | unknown | UNVERIFIED |
| Free plan | 100 lifetime minutes, 2 parallel sessions | VERIFIED [11] |
| EU data residency | no public documentation found | UNVERIFIED |

## Cloud run protocol (S3)
1. Preconditions: suite green 3× locally; `PROGRESS.md` shows minutes left; user said OK in chat.
2. Smoke: F1 only, one run, one device. Check artifacts and status reporting before running more.
3. Full: F1–F4, two runs. Same device model for both tools on the same vendor.
4. After each run: append to the minutes ledger in `PROGRESS.md`; never retry blindly on vendor errors.

## Sources
1. https://www.browserstack.com/docs/app-automate/appium/getting-started/java/testng/manage-apps/upload-app/from-public-url
2. https://www.browserstack.com/docs/app-automate/appium/references/ipa-creation
3. https://github.com/webdriverio/native-demo-app (README, Downloads note)
4. https://www.browserstack.com/docs/app-automate/api-reference/maestro/builds
5. https://www.browserstack.com/docs/app-automate/maestro/get-started/execute-tests
6. https://www.browserstack.com/docs/app-automate/appium/references/geo-region-restriction
7. https://bug0.com/knowledge-base/browserstack-app-automate
8. https://www.testmuai.com/support/docs/appium-troubleshooting/
9. https://www.testmuai.com/learning-hub/maestro-testing/
10. https://github.com/LambdaTest/documentation/pull/2118
11. https://www.testmuai.com/pricing/
