# App analysis — WebdriverIO native demo app v2.2.0

Source analysed: https://github.com/webdriverio/native-demo-app (commit `cbb9346`, 2026-03-23), by reading
the app source. Live UI verification is still pending: status columns start as `?` and are filled in S1–S2
with evidence in `docs/evidence/<platform>/`.

## 1. Facts
| Item | Value |
|---|---|
| Version | 2.2.0 (Android versionCode 21, iOS buildNumber 20) |
| Stack | Expo SDK 55, React Native 0.83.2, React 19.2, Expo Router, reanimated 4.2.1, react-native-reanimated-carousel 4, react-native-webview 13.16.0, react-native-elements 3.4.3, react-native-picker-select 9 |
| Android package | `com.wdiodemoapp` (main activity `com.wdiodemoapp.MainActivity`) |
| iOS bundle id | `org.wdiodemoapp` |
| Deep link scheme | `wdio` (declared in the Android manifest and app.json). Route URLs like `wdio://login` are UNVERIFIED (H9) |
| Android binary | https://github.com/webdriverio/native-demo-app/releases/download/v2.2.0/android.wdio.native.app.v2.2.0.apk — release build, emulators and real devices |
| iOS binary | https://github.com/webdriverio/native-demo-app/releases/download/v2.2.0/ios.simulator.wdio.native.app.v2.2.0.zip — contains `wdiodemoapp.app`, **simulators only** |
| iOS real devices | Not provided upstream (README: no build for physical iPhones). Requires building and signing from source → out of scope (ADR-005) |
| WebView | loads `https://webdriver.io/`, `webviewDebuggingEnabled` is set (context switching should work). Needs internet |
| Excluded screens | Permissions (OS dialogs differ per device/cloud), biometrics (cloud-specific) |

## 2. Selector mechanism (read this before writing any locator)
- `src/config/TestProperties.ts`: `testProperties(id)` → **iOS: `testID`** (accessibilityIdentifier), **Android: `accessibilityLabel`** (content-desc). Optional `accessible: false` to stop child grouping.
- **Appium:** accessibility id `~<id>` matches on both platforms.
- **Maestro (H1):** iOS `id: "<id>"` should match. On Android the id is content-desc, not resource-id, so `id:` will probably NOT match; a plain text selector `"<id>"` (matches accessibility text) probably will. Verify with `maestro hierarchy` in S1, then fix the strategy in this section.
- **Button component** (`src/components/Button.tsx`): id = `button-${testID || text}`, `accessible: false`.
- **Bottom tab bar:** `accessibilityLabel` = tab accessibility label, no prefix: `Home`, `Webview`, `Login`, `Forms`, `Swipe`, `Drag`, `Menu`. Permissions and Data management are not on the bar by default; open them via `Menu`.
- Client note: accessibilityLabel-as-test-hook pollutes screen-reader output. Fine for this lab; the client app should use `testID` → resource-id instead.

Status legend: `?` unverified · `✅` works · `❌` fails (link evidence) · `~` works with workaround (note it).

## 3. Selector map

### Navigation
| Element | Id / label | Appium A | Appium i | Maestro A | Maestro i |
|---|---|---|---|---|---|
| Tab Home | `Home` | ? | ? | ? | ? |
| Tab Webview | `Webview` | ? | ? | ? | ? |
| Tab Login | `Login` | ? | ? | ? | ? |
| Tab Forms | `Forms` | ? | ? | ? | ? |
| Tab Swipe | `Swipe` | ? | ? | ? | ? |
| Tab Drag | `Drag` | ? | ? | ? | ? |
| Menu button | `Menu` | ? | ? | ? | ? |
| Side menu modal / panel | `tab-side-menu-modal` / `tab-side-menu-panel` | ? | ? | ? | ? |
| Side menu item | `side-menu-item-home`, `side-menu-item-{webview,login,forms,swipe,drag,permissions,data-management}` | ? | ? | ? | ? |
| Side menu pin star | `side-menu-star-{name}` | ? | ? | ? | ? |

### Home
| Element | Id / text | Notes |
|---|---|---|
| Screen | `Home-screen` | texts "WEBDRIVER", "Demo app for the appium-boilerplate" |

### Login (`src/components/LoginForm.tsx`)
| Element | Id / text | Notes |
|---|---|---|
| Screen | `Login-screen` | |
| Login tab | `button-login-container` | |
| Sign-up tab | `button-sign-up-container` | shows repeat-password field |
| Email | `input-email` | |
| Password | `input-password` | |
| Repeat password | `input-repeat-password` | sign-up only |
| Submit | `button-LOGIN` / `button-SIGN UP` | shows a spinner for a simulated API call; wait for the alert, not the button |
| Biometric | `button-biometric` | only rendered when biometrics are enrolled — excluded |
| Error texts | "Please enter a valid email address", "Please enter at least 8 characters", "Please enter the same password" | plain text, use `byText` |
| Alert (login) | title "Success", message "You are logged in!", button "OK" | native dialog |
| Alert (sign-up) | title "Signed Up!", message "You successfully signed up!", button "OK" | native dialog |
Validation rules: email regex; password length ≥ 8; sign-up confirmation must equal password and be ≥ 8.

### Forms (`src/components/FormComponents.tsx`)
| Element | Id / text | Notes |
|---|---|---|
| Screen | `Forms-screen` | |
| Text input | `text-input` | placeholder "Type something" |
| Echo of input | `input-text-result` | shows typed text |
| Switch | `switch` | starts OFF |
| Switch label | `switch-text` | "Click to turn the switch ON" → after toggle "Click to turn the switch OFF" |
| Dropdown wrapper | `Dropdown` | `accessible: false` |
| Dropdown picker | `Dropdown picker` | iOS: picker wheel in a modal; Android: list dialog (H3) |
| Dropdown options | "webdriver.io is awesome", "Appium is awesome", "This app is awesome" | |
| Active button | `button-Active` | alert title "This button is", message "This button is active", buttons "Ask me later", "Cancel", "OK" |
| Inactive button | `button-Inactive` | disabled; tapping shows nothing |

### Swipe (`src/screens/Swipe.tsx`)
| Element | Id / text | Notes |
|---|---|---|
| Screen | `Swipe-screen` | vertical ScrollView |
| Carousel | `Carousel` | react-native-reanimated-carousel, `loop={false}`, card width 85% of window |
| Card | `card` (×6), `slideTextContainer` | `accessible: false` |
| Card titles (rendered uppercase) | "FULLY OPEN SOURCE", "GREAT COMMUNITY", "JS.FOUNDATION", "SUPPORT VIDEOS", "EXTENDABLE", "COMPATIBLE" | |
| Hidden logo | `WebdriverIO logo` + text "You found me!!!" | below the fold, needs vertical scroll |

### WebView (`src/screens/WebView.tsx`)
No test ids. Shows "Loading..." then https://webdriver.io/. Upstream README notes the page opens once per app session.

### Drag (`src/screens/Drag.tsx`, `src/components/Draggable.tsx`)
| Element | Id / text | Notes |
|---|---|---|
| Screen | `Drag-drop-screen` | |
| Pieces | `drag-{l,c,r}{1,2,3}` | PanResponder-based |
| Drop zones | `drop-{l,c,r}{1,2,3}` | piece `drag-xN` belongs on `drop-xN` |
| Reset | `renew` | |
| Success | text "Congratulations", "You made it, click retry if you want to try it again.", button `button-Retry` | |

### Data management (`src/screens/DataManagement.tsx`) — reach via Menu
| Element | Id | Notes |
|---|---|---|
| Screen | `DataManagement-screen` | |
| Inputs | `data-{memory,async,sqlite,secure}-input` | |
| Readouts | `data-{memory,async,sqlite,secure}-readout` | |
| Save / Clear | `button-data-{memory,async,sqlite,secure}-{save,clear}` | Button prefix rule applies |
Lifecycle per the app's own text: memory is lost when the process dies; the async tier (SQLite-backed here) and
SQLite are cleared by clear-app-data / uninstall; secure storage (Keychain/Keystore) differs per platform.

## 4. Hypotheses (resolve with evidence; outcomes feed the comparison)
| ID | Hypothesis | Verify in |
|---|---|---|
| H1 | Maestro needs platform-specific selectors (iOS `id:` vs Android text/accessibility match); Appium `~id` is uniform | S1 |
| H2 | The reanimated carousel rejects fast swipes: a quick UiAutomator swipe springs back to the first card (also noted in WebdriverIO's own docs). Appium needs slow W3C pointer actions. Maestro `swipe` outcome unknown | S2 |
| H3 | iOS dropdown is a picker wheel: Appium can `setValue` on the wheel; Maestro has no picker-wheel command → workaround or fail | S2 |
| H4 | WebView: Appium needs a context switch (Android also needs a matching chromedriver; Appium 3 insecure-feature syntax `uiautomator2:chromedriver_autodownload` UNVERIFIED). Maestro reads WebView content via the accessibility tree without context switching | S2 |
| H5 | Drag (PanResponder): Appium W3C actions with a press-pause work; Maestro swipe-with-duration may not register as a drag | S4 |
| H6 | Native alerts: iOS supports Appium alert commands; Android dialogs are ordinary views (`android:id/message`, `android:id/button1`). Maestro handles both with text taps | S1 |
| H7 | The keyboard hides the tab bar and may cover the submit button; hide it before tapping (`hideKeyboard`) | S1 |
| H8 | State reset differs: Maestro `clearState` / `launchApp: clearState` vs Appium `mobile: clearApp`, terminate + activate. F6 makes it measurable | S4 |
| H9 | Deep links `wdio://<route>` (Expo Router) navigate directly; if they work, both tools may use them for setup, but flows must also cover tab navigation once | S1 |

## 5. Flow specifications
All data and expected strings come from `packages/test-data` (section 6). Reset policy: terminate + activate the
app before each test unless stated otherwise.

**F1 Login (core)** — covers text input, keyboard (H7), async wait, native alerts (H6)
1. a) Tab `Login` → `Login-screen` visible → `button-login-container` → type `users.valid.email` / `.password` → hide keyboard → `button-LOGIN` → alert "Success" / "You are logged in!" → OK.
2. b) Validation: `users.invalidEmail.email` + `users.shortPassword.password` → `button-LOGIN` → both error texts visible, no alert within 2 s (documented exception to "no fixed waits").
3. c) Sign-up: `button-sign-up-container` → `users.uniqueSignUp(runId)` email, password, repeat → `button-SIGN UP` → alert "Signed Up!" / "You successfully signed up!" → OK.

**F2 Forms (core)** — covers echo assertion, switch state, picker (H3), alert buttons
1. Tab `Forms` → type `forms.text` in `text-input` → `input-text-result` equals it.
2. Toggle `switch` → `switch-text` = "Click to turn the switch OFF"; toggle back → "…ON".
3. Select `forms.dropdownOption` ("Appium is awesome") → the dropdown shows it.
4. `button-Active` → alert "This button is" / "This button is active" → OK. `button-Inactive` → no alert.

**F3 Swipe (core)** — covers horizontal gesture on reanimated carousel (H2) and scroll-into-view
1. Tab `Swipe` → swipe `Carousel` left until "COMPATIBLE" visible (5 swipes max, no loop) → "FULLY OPEN SOURCE" not visible.
2. Scroll down until `WebdriverIO logo` visible → text "You found me!!!" visible.

**F4 WebView (core)** — covers hybrid content (H4)
1. Tab `Webview` → wait until "Loading..." gone.
2. Appium: switch to the WEBVIEW context, assert page title contains "WebdriverIO", switch back to NATIVE_APP.
   Maestro: assert a stable visible text from the page. Keep assertions minimal (external site can change).
3. Tap tab `Login` → `Login-screen` visible (proves return to native).

**F5 Drag (stretch)** — covers PanResponder drag (H5)
Drag each `drag-xN` onto `drop-xN` (9 moves) → "Congratulations" visible → `button-Retry` → pieces back.

**F6 Data persistence (stretch)** — covers lifecycle and reset strategies (H8)
Menu → `side-menu-item-data-management` → write `data.persistence.value` into all four tiers → save → terminate +
relaunch → memory readout empty, other three persist → (Android) clear app data → record observed values
(no assertion until verified, then promote to assertions).

## 6. Test data contract (`packages/test-data`)
| Key | Value / rule |
|---|---|
| `users.valid` | `{ email: "lab.user@example.com", password: "LabPassw0rd!" }` |
| `users.invalidEmail` | `{ email: "not-an-email" }` |
| `users.shortPassword` | `{ password: "short" }` |
| `users.uniqueSignUp(runId)` | `{ email: "lab+<runId>@example.com", password: "LabPassw0rd!" }` |
| `forms.text` | `"Hello from the lab"` |
| `forms.dropdownOption` | `"Appium is awesome"` |
| `texts.alerts.*`, `texts.errors.*` | exact strings from section 3 |
| `swipe.cardTitles`, `swipe.foundText` | from section 3 |
| `persistence.value` | `"lab-persist-01"` |
Synthetic data only. No real names, no real emails.

## 7. Verification protocol (S1, S2)
For each screen and platform: save Appium page source to `docs/evidence/<platform>/<screen>.appium.xml` and the
Maestro hierarchy to `docs/evidence/<platform>/<screen>.maestro.json`, update the status columns above, and
record the final working locator per tool when it differs from the id column.
