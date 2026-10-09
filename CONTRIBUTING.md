# 🤝 Contributing to FeedMe

Thank you for contributing to the **FeedMe** ecosystem! This document outlines coding standards, branching conventions, and quality gates for maintaining this multi-platform project.

---

## 1. Monorepo Organization

- [`feedme-website`](file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/feedme-website): Next.js 16 Web Dashboard.
- [`feedme-andriod`](file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/feedme-andriod): Expo React Native Android app.
- [`feedme-ios`](file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/feedme-ios): Expo React Native iOS app.
- [`Hardware`](file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/Hardware): ESP32-C3 firmware and electronics.

---

## 2. Coding Guidelines & Quality Standards

### Front-End (Web & Mobile)
- **TypeScript:** Strict mode enabled. No `any` types unless interfacing with raw untyped third-party payloads. Run `npm run typecheck` before committing.
- **Tailwind CSS v4:** Use established semantic design tokens defined in `globals.css` (e.g., `var(--bg-base)`, `var(--accent)`, `var(--text-primary)`). Do not introduce arbitrary hardcoded hex codes.
- **Component Design:** Keep components modular, isolated, and focused on single responsibilities.

### Firmware (ESP32)
- Follow Non-Blocking paradigms (avoid long `delay()` calls in the main loop; use `millis()` timers or RTOS tasks).
- Preserve hardware calibration constants (`CALIBRATION_FACTOR = 460.00`).

---

## 3. Pre-Commit Checklist

Before pushing any commit or PR, verify:
1. `npm run typecheck` passes with 0 errors.
2. `npm run lint` passes cleanly.
3. Review [`PRE_LAUNCH_CHECKLIST.md`](file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/PRE_LAUNCH_CHECKLIST.md) to ensure no regressions in responsive design, security, or error states.
