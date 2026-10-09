# 🚀 Pre-Launch Shipping Checklist (Vibe Coder Standards)
> **Reference:** Synthesized directly from `Shipping isn’t just about getting your app to work.mp4`.
> *“Before you push that vibe-coded project live, verify these 4 critical pillars.”*

---

## Pillar 01: Responsive Design
*“Make sure your build works seamlessly across mobile, tablet, and desktop.”*

- [ ] **Mobile Viewport (<640px):**
  - [ ] App bottom bar and floating action buttons do not overlap main content.
  - [ ] Font sizes remain readable without manual pinching or zooming.
  - [ ] Touch targets (buttons, inputs, toggles) are at least $44 \times 44 \text{ px}$.
  - [ ] Tables and charts switch to scrollable cards or responsive wrappers.
- [ ] **Tablet Viewport (768px - 1024px):**
  - [ ] 2-column dashboard layout distributes metric cards evenly without awkward line wraps.
  - [ ] Sidebars collapse or expand smoothly with responsive breakpoints.
- [ ] **Desktop Viewport (>1024px):**
  - [ ] Max content width is constrained (e.g., `max-w-7xl mx-auto`) so wide screens do not over-stretch cards.
  - [ ] Web Bluetooth pairing modal centers cleanly.
- [ ] **Common Layout Breaks:**
  - [ ] No horizontal scrollbar overflow (`overflow-x-hidden` on root container).
  - [ ] Long food names (e.g., "ข้าวมันไก่ตอนเนื้อน่องพิเศษไม่เอาหนัง") truncate with ellipsis (`truncate`) rather than breaking the card container.

---

## Pillar 02: Security
*“Check for exposed keys, weak validation, sensitive errors, and unprotected routes.”*

- [ ] **Environment Variables & Secrets:**
  - [ ] No hardcoded API keys in client-side code (`NEXT_PUBLIC_` only used for public safe keys).
  - [ ] Supabase Service Role Key (`SUPABASE_SERVICE_ROLE_KEY`) is **NEVER** exposed to client components.
  - [ ] `.env.local`, `.env`, and hardware Wi-Fi credentials are included in `.gitignore`.
- [ ] **Database Row Level Security (RLS):**
  - [ ] Every Supabase table (`profiles`, `diary_entries`, `workout_entries`, `weight_logs`) has RLS enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).
  - [ ] Policies restrict CRUD operations to `auth.uid() = user_id`.
- [ ] **Input & Payload Validation:**
  - [ ] IoT Scale endpoint `/api/scale/reading` strictly validates types (ensures `weight_kg` is positive number, `device_id` is non-empty string).
  - [ ] Image upload endpoint restricts file size (< 5MB) and mime types (`image/jpeg`, `image/png`, `image/webp`).
- [ ] **Route Protection:**
  - [ ] Unauthenticated requests to `/dashboard`, `/log`, and `/workout` redirect gracefully to `/auth` or safe fallback.

---

## Pillar 03: Performance
*“Check load speed, large assets, unnecessary requests, and loading behavior.”*

- [ ] **Core Web Vitals:**
  - [ ] Largest Contentful Paint (LCP) under 2.5 seconds.
  - [ ] Cumulative Layout Shift (CLS) under 0.1 (all card skeletons reserve their explicit height).
- [ ] **Asset Optimization:**
  - [ ] Food images compressed and served in WebP or modern formats with Next.js `<Image />`.
  - [ ] Static icons bundled as SVGs rather than oversized PNG assets.
- [ ] **Network & Re-renders:**
  - [ ] Tab switching does not trigger redundant full database re-fetches.
  - [ ] Recharts diagrams memoized (`useMemo`) to avoid lagging animations during state changes.
- [ ] **Loading States & Skeletons:**
  - [ ] Every asynchronous data fetch has a matching skeleton placeholder to prevent flash of empty content.

---

## Pillar 04: Error States
*“Handle form errors, failed requests, empty states, and unexpected errors properly.”*

- [ ] **Empty States:**
  - [ ] First-time users see friendly zero-state illustrations/cards (e.g., "ยังไม่มีมื้ออาหารวันนี้ กด + เพื่อเริ่มบันทึก", "ยังไม่มีประวัติการชั่ง").
- [ ] **Hardware Disconnection:**
  - [ ] If the ESP32 scale goes out of BLE range or disconnects, the UI shows a clear amber indicator ("Scale Disconnected — Tap to Reconnect") instead of freezing.
- [ ] **Network & Offline Behavior:**
  - [ ] When offline, log entries save to `localStorage` / `AsyncStorage` and sync once internet is restored.
  - [ ] Toasts/Alerts explain network failures in plain, user-friendly language without leaking raw stack traces or internal server errors.
- [ ] **Form Validation Errors:**
  - [ ] Invalid numbers (e.g., negative calories or weights) highlight inputs in red with inline explanatory text.
