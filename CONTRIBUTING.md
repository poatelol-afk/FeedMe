# 🤝 Contributing to FeedMe 2.0

Thank you for contributing to **FeedMe 2.0**! This guide covers our monorepo structure, coding conventions, and quality checks.

---

## 1. Monorepo Directory Structure

- [`feedme-mobile`](file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/feedme-mobile): **Flutter (Dart)** native mobile app for Android (primary focus) and iOS.
- [`feedme-website`](file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/feedme-website): **Next.js 16 (App Router) + Tailwind CSS v4** promotional showcase website.
- [`feedme-hardware`](file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/feedme-hardware): **ESP32-C3 + HX711** Smart Kitchen Scale firmware (C++ / Arduino / PlatformIO).
- [`docs`](file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/docs): Design specifications (`docs/superpowers/specs/`) and implementation plans (`docs/superpowers/plans/`).

---

## 2. Coding Standards by Pillar

### A. Mobile App (`feedme-mobile` — Flutter / Dart)
- **Architecture:** Feature-first modular organization (`lib/features/home`, `kitchen`, `workout`, `league`, `profile`) with shared theme and services in `lib/core/`.
- **Design System:** Use the centralized Duolingo-inspired tactile 3D button and card components defined in `lib/core/theme/`.
- **Static Analysis:** Always run `flutter analyze` and `flutter test` with zero errors before committing.

### B. Promotional Website (`feedme-website` — Next.js / TypeScript)
- **Scope:** Promotional landing page and interactive product showcase only (no web-app tracker routes).
- **Quality:** Strict TypeScript (`npm run typecheck`) and responsive layout verification across mobile, tablet, and desktop.

### C. Smart Scale Firmware (`feedme-hardware` — ESP32-C3)
- Use non-blocking `millis()` timers in the main loop.
- Maintain BLE GATT Service UUID (`4fafc201-1fb5-459e-8fcc-c5c9c331914b`) compatibility with `feedme-mobile`.

---

## 3. Pre-Commit Verification
1. `cd feedme-mobile && flutter analyze && flutter test`
2. `cd feedme-website && npm run build`
3. Check against [`PRE_LAUNCH_CHECKLIST.md`](file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/PRE_LAUNCH_CHECKLIST.md).
