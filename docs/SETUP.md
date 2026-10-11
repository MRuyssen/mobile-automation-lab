# S0 — Machine and account prerequisites (human)

Do these before `/session 1`. Versions match the pins in `CLAUDE.md`.

## All platforms
- [ ] Node 24 LTS (`node -v`)
- [ ] JDK 17, `JAVA_HOME` set (Android build tools and the UiAutomator2 driver need it)
      - [ ] Android Studio + SDK; `ANDROID_HOME` set; `platform-tools` and `emulator` on `PATH`
- [ ] One emulator: Pixel 8, Google APIs image, API 35. Put its AVD name in `.env` as `ANDROID_AVD`
- [ ] Maestro CLI **2.10.0** (official install script with a pinned version; check docs.maestro.dev for the exact
      variable). Windows: Android only, follow Maestro's Windows instructions
- [ ] Claude Code installed (`npm install -g @anthropic-ai/claude-code`)
- [ ] Git

## macOS only (enables `ios-local`)
- [ ] Xcode + command line tools, one iOS simulator runtime installed
- [ ] Simulator name in `.env` as `IOS_SIM_DEVICE` (pick one from `xcrun simctl list devices available`)
- [ ] Windows/Linux: skip; iOS then runs only on TestMu AI's virtual devices in S3, if verified

## Accounts
- [ ] BrowserStack account (trial). Ask sales about the 30-day promotional pack before minutes are spent.
- [ ] TestMu AI account (free plan). Note whether HyperExecute is enabled.
- [ ] Credentials into `.env` (copy from `.env.example`). Never paste them into the Claude Code chat.

## Smoke checks (Definition of Done for S0)
```bash
adb devices                       # emulator listed
maestro --version                 # 2.10.0
xcrun simctl list | grep Booted   # macOS: one booted simulator
```
(Appium driver doctor runs in S1 once the repo-local Appium is installed.)
