# 🚀 Pre-Launch Shipping Checklist — FeedMe 2.0
> *“Verify these 4 critical pillars across `feedme-mobile` (Flutter), `feedme-website` (Next.js), and `feedme-hardware` (ESP32) before shipping.”*

---

## Pillar 01: Multi-Device UI & Responsive Design
*“Ensure the Flutter mobile app feels great on all Android/iOS screen sizes and the promotional website is responsive across mobile, tablet, and desktop.”*

- [ ] **Flutter Mobile App (`feedme-mobile`):**
  - [ ] SafeArea handling (`SafeArea` / `MediaQuery`) prevents notches, status bars, and bottom gesture bars from overlapping the 5-tab navigation or floating buttons.
  - [ ] Tactile 3D buttons and set-logging checkboxes have touch targets of at least $48 \times 48\text{ dp}$.
  - [ ] Long Thai dish names (e.g., *"ข้าวมันไก่ตอนเนื้อน่องพิเศษไม่เอาหนัง"*) wrap or truncate cleanly without `RenderFlex overflowed` errors.
- [ ] **Promotional Website (`feedme-website`):**
  - [ ] Mobile (<640px), Tablet (768px–1024px), and Desktop (>1024px) layouts render cleanly with zero horizontal overflow (`overflow-x-hidden`).
  - [ ] Primary CTAs clearly direct users to download the Android APK / iOS app (no broken links to deprecated web-app routes).

---

## Pillar 02: Security & Privacy
*“Protect API keys, database tables, GPS privacy, and Bluetooth permissions.”*

- [ ] **Secrets & Environment Isolation:**
  - [ ] No hardcoded `GEMINI_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` committed to Git.
  - [ ] `.env`, `.env.local`, and local Flutter environment configs are listed in `.gitignore`.
- [ ] **Supabase Row Level Security (RLS):**
  - [ ] RLS enabled on all tables (`profiles`, `nutrition_goals`, `diary_entries`, `cardio_sessions`, `workout_sessions`, `league_memberships`, `party_quests`, `party_participants`).
  - [ ] Users can only modify their own health logs (`auth.uid() = user_id`), while leaderboard and party quest views expose only non-sensitive display names, avatars, and XP/calorie-burn totals.
- [ ] **Mobile Permissions (Android & iOS):**
  - [ ] Graceful runtime permission requests for Camera (AI Food Scanner), Fine/Coarse Location (GPS Running), and Bluetooth Scan/Connect (Smart Scale).

---

## Pillar 03: Performance & Battery Efficiency
*“Keep animations at 60/120fps, GPS tracking battery-friendly, and website load times under 2.5s.”*

- [ ] **Flutter App Performance:**
  - [ ] Meal photos are compressed before uploading or sending to Gemini Vision API.
  - [ ] GPS coordinate sampling uses appropriate distance filters (e.g., update every 5–10 meters) to prevent battery drain and jittery polylines.
  - [ ] Tab switching preserves state (`IndexedStack` / `StatefulShellRoute`) without re-fetching unchanged data.
- [ ] **Website Core Web Vitals (`feedme-website`):**
  - [ ] Largest Contentful Paint (LCP) under 2.5 seconds; Cumulative Layout Shift (CLS) under 0.1.

---

## Pillar 04: Error States & Offline Resilience
*“Handle disconnections, missing permissions, and empty states playfully.”*

- [ ] **Friendly Empty States:**
  - [ ] New users see encouraging Duolingo-style zero states (e.g., *"ยังไม่มีมื้ออาหารวันนี้ มาถ่ายรูปมื้อแรกเก็บ +20 XP กัน!"*).
- [ ] **BLE Smart Scale Fallback:**
  - [ ] When the `FeedMe Scale` (`ESP32-C3`) is not connected or unavailable, the Smart Kitchen seamlessly provides a manual/slider gram input so cooking mode never blocks the user.
- [ ] **GPS & Network Fallbacks:**
  - [ ] If GPS signal is weak or permissions are denied, display a clear instruction modal and allow manual cardio logging.
  - [ ] Offline meal and workout logs cache locally on the device and sync when connectivity returns.
