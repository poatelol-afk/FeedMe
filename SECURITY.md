# 🔒 Security & Privacy Policy — FeedMe 2.0

Because **FeedMe 2.0** combines a Flutter mobile app (`feedme-mobile`), a Next.js promotional site (`feedme-website`), an ESP32 BLE Smart Scale (`feedme-hardware`), cloud database sync (Supabase), and GPS/Camera sensors, this policy governs secure configuration across the monorepo.

---

## 1. Secrets Management & Environment Isolation

### Never Commit Secrets
The following files and credentials must never be committed to Git:
- `.env`, `.env.local`, `.env.production`, or `dart_define` secret files
- Google Gemini API Keys (`GEMINI_API_KEY`)
- Supabase `SERVICE_ROLE_KEY`
- Android release keystore files (`*.jks`, `*.keystore`, `key.properties`)

### Environment Variable Standards
- **Flutter Mobile (`feedme-mobile`):** Pass public Supabase URL/Anon keys via `--dart-define-from-file` or `.env` (excluded from Git). Route sensitive AI requests through authenticated Supabase Edge Functions or secure backend endpoints in production.
- **Promotional Website (`feedme-website`):** Only public showcase configurations may use `NEXT_PUBLIC_`.

---

## 2. Supabase Row Level Security (RLS)

All tables in Supabase PostgreSQL must have RLS enabled:
- **Personal Health Logs (`diary_entries`, `nutrition_goals`, `cardio_sessions`, `workout_sessions`):**
  - Strictly restricted to `auth.uid() = user_id` for `SELECT`, `INSERT`, `UPDATE`, and `DELETE` (GPS route coordinates are private by default unless explicitly shared).
- **Social & Gamification (`league_memberships`, `party_quests`, `party_participants`):**
  - Authenticated users may view leaderboard XP and co-op party progress, but may only update their own participation rows (`auth.uid() = user_id`).

---

## 3. Sensor & Hardware Security (`feedme-mobile` & `feedme-hardware`)

- **BLE Smart Scale Validation:**
  - Incoming BLE GATT payloads from `FeedMe Scale` (`4fafc201-1fb5-459e-8fcc-c5c9c331914b`) are parsed defensively with bounds checking ($0\text{ g} \le \text{weight} \le 10,000\text{ g}$) to prevent malformed packet crashes.
- **Location & Camera Privacy:**
  - Camera images are used strictly for meal/ingredient nutritional estimation.
  - GPS tracking is active only when the user explicitly starts a Cardio Run/Walk/Cycle session.

---

## 4. Reporting a Security Issue
If you discover a security vulnerability or credential exposure in this repository, please contact the project maintainer immediately rather than opening a public issue.
