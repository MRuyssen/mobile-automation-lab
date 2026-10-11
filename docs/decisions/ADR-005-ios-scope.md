# ADR-005 — iOS scope: simulators only

Status: accepted (2026-10-11)

## Context
The demo app ships an iOS simulator build only; upstream states there is no build for physical iPhones.
Real-device clouds need a device `.ipa`.

## Decision
iOS runs locally on simulators (macOS) and, if verified, on TestMu AI virtual iOS devices. BrowserStack iOS and
all real-iPhone runs are out of scope. S4 documents what real-device iOS would take (build from source, signing,
Apple Developer account).

## Consequences
The cloud comparison is Android-symmetric only. The client's real-iPhone requirement is evaluated on paper here
(vendor capability, Maestro wrapper status) and must be validated with the client's own signed build.
