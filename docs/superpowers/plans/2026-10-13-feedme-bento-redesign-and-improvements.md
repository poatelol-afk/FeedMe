# FeedMe Modern Bento Athletic Redesign & Full-Stack Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform both `feedme-website` (Next.js 16) and `feedme-webapp` (Expo SDK 54) into the "Modern Bento Athletic" (`FEEDME AI ⚡`) design identity, remove all IoT/BLE scale connections, wire up real Gemini Vision food analysis + full 9-table Supabase sync + TDEE/profile setup, and fix all security, data-integrity, and ESLint issues with automated unit test coverage.

**Architecture:** We extract pure domain math & security helpers (`calculateGoal`, `calculateBmi`, `computeWeightDeltas`, `calculateFitnessLevel`, `sanitizeRedirectPath`, `computeProgressiveOverload`) with Node.js unit tests (`node --test`), upgrade the Next.js 16 web app (`feedme-website`) with the Modern Bento Athletic CSS design tokens, Gemini Vision route (`/api/food/analyze`), full 9-table Supabase persistence, and scale-free UI, and upgrade the Expo app (`feedme-webapp`) with matching Bento tokens, AI Food & Smart Portion logging, Profile/TDEE editor, `.eq('user_id', user.id)` query hardening, and `AsyncStorage` offline caching.

**Tech Stack:** TypeScript 5, Next.js 16.2 (`App Router`, `@supabase/ssr`, Tailwind CSS v4), Expo SDK 54 (`React Native 0.81`, `@react-native-async-storage/async-storage`), Supabase PostgreSQL, Node.js built-in test runner (`node --test --experimental-strip-types`).

**Spec:** `docs/superpowers/specs/2026-10-13-feedme-bento-redesign-and-improvements-design.md`

## Global Constraints

- **Design Identity:** "Modern Bento Athletic" (`--bg-base: #F1F5F9`, `--bg-surface: #FFFFFF`, `--bg-hero: #0F172A`, `--bg-hero-elevated: #1E293B`, `--accent: #10B981`, `--text-primary: #0F172A`, `--text-secondary: #475569`, `--text-muted: #64748B`, `--border-soft: #E2E8F0`). Zero leftover `#58CC02` Duolingo lime green or `FitOwl 🦉` branding.
- **No IoT/BLE Scale UI:** Remove all `BleScaleButton` and `BleScaleCard` imports/usages from `feedme-website` and `feedme-webapp`. Food logging uses grams/smart portions (`g`); Profile weight logging uses body weight (`kg`).
- **Deployment & Schema Preservation:** Do not alter Vercel deployment configs or the 9 table definitions in `feedme-website/supabase-schema.sql`.
- **Zero Lint/Type Errors:** Both `feedme-website` (`npm run typecheck`, `npm run lint`, `npm run build`) and `feedme-webapp` (`npm run typecheck`) must exit 0.

## Review Focus

1. **Open Redirect via Protocol-Relative URL (`//evil.com`):** `sanitizeRedirectPath(next)` must reject `//evil.com`, `https://evil.com`, and `\evil.com`, returning `'/dashboard'`.
2. **Deleting the Last Diary Entry of the Day:** `getTodayDiary()` in `feedme-website/src/lib/db.ts` must return `[]` when Supabase returns an empty array `data = []` (not fall back to stale `localStorage` entries).
3. **Weight Delta Calculation with Single Entry or Sparse History:** `computeWeightDeltas(history, now)` must return `{ change7d: null, change30d: null }` when only 1 entry exists, and accurately compute rounded 1-decimal `kg` differences when entries >= 6 days / oldest entry exist.
4. **Progressive Overload with User-Entered Set Weights vs Default Weight:** `computeProgressiveOverload(sets, targetReps)` must add `+2.5 kg` to the highest actual lifted weight across completed sets (`maxWeight + 2.5`), never to the static preset `defaultWeight`.
5. **AI Food Analyze Upload Validation:** `POST /api/food/analyze` must reject non-image MIME types or base64 payloads exceeding 5MB with HTTP `400`, and gracefully return a structured `AIScanResult` even when `GEMINI_API_KEY` is unset.

---

### Task 1: Core Domain Math, Security Helpers & Unit Tests (`feedme-website` & Repo Hygiene)

**Files:**
- Delete: `Hardware/gemini-code-1784909444244.cpp`
- Modify: `feedme-website/src/lib/utils.ts`
- Modify: `feedme-website/package.json`
- Test: `feedme-website/src/lib/__tests__/utils.test.ts`

**Interfaces:**
- Consumes: `UserProfile`, `NutritionGoal`, `WeightLog`, `WeightStats` from `feedme-website/src/types/index.ts`
- Produces:
  - `calculateBmi(weightKg: number, heightCm: number): number | null`
  - `computeWeightDeltas(history: WeightLog[], now?: Date): { latest: number | null; change7d: number | null; change30d: number | null; bmi: number | null }`
  - `calculateFitnessLevel(streakDays: number, completedQuests: number, workoutCount: number): { level: number; title: string; xp: number; nextLevelXp: number }`
  - `sanitizeRedirectPath(next: string | null | undefined, fallback?: string): string`

- [ ] **Step 1: Write the failing unit tests in `feedme-website/src/lib/__tests__/utils.test.ts`**

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateGoal,
  calculateBmi,
  computeWeightDeltas,
  calculateFitnessLevel,
  sanitizeRedirectPath,
} from '../utils.ts';

describe('FeedMe core domain utilities', () => {
  it('calculates Mifflin-St Jeor TDEE and 30/40/30 macros accurately', () => {
    const goal = calculateGoal({ age: 26, gender: 'male', weight: 70, height: 175, activity: 1.55 });
    assert.equal(goal.tdee, 2587);
    assert.equal(goal.protein.g, 194);
    assert.equal(goal.carbs.g, 259);
    assert.equal(goal.fat.g, 86);
  });

  it('calculates BMI to 1 decimal place and handles invalid height', () => {
    assert.equal(calculateBmi(70, 175), 22.9);
    assert.equal(calculateBmi(70, 0), null);
  });

  it('computes 7d and 30d weight deltas from actual history instead of hardcoded constants', () => {
    const now = new Date('2026-10-13T12:00:00Z');
    const single = computeWeightDeltas([
      { id: '1', weightKg: 70, bmi: 22.9, source: 'manual', measuredAt: '2026-10-13T08:00:00Z' },
    ], now);
    assert.equal(single.latest, 70);
    assert.equal(single.change7d, null);
    assert.equal(single.change30d, null);

    const multi = computeWeightDeltas([
      { id: '1', weightKg: 72.4, bmi: 23.6, source: 'manual', measuredAt: '2026-09-20T08:00:00Z' },
      { id: '2', weightKg: 71.1, bmi: 23.2, source: 'manual', measuredAt: '2026-10-05T08:00:00Z' },
      { id: '3', weightKg: 70.0, bmi: 22.9, source: 'manual', measuredAt: '2026-10-13T08:00:00Z' },
    ], now);
    assert.equal(multi.latest, 70.0);
    assert.equal(multi.change7d, -1.1);
    assert.equal(multi.change30d, -2.4);
  });

  it('rejects open-redirect paths including protocol-relative URLs', () => {
    assert.equal(sanitizeRedirectPath('/dashboard'), '/dashboard');
    assert.equal(sanitizeRedirectPath('/profile?tab=weight'), '/profile?tab=weight');
    assert.equal(sanitizeRedirectPath('//evil.com'), '/dashboard');
    assert.equal(sanitizeRedirectPath('https://evil.com'), '/dashboard');
    assert.equal(sanitizeRedirectPath('/\\evil.com'), '/dashboard');
    assert.equal(sanitizeRedirectPath(null), '/dashboard');
  });

  it('calculates RPG fitness level and title from streak, quests, and workouts', () => {
    const lv1 = calculateFitnessLevel(0, 0, 0);
    assert.equal(lv1.level, 1);
    assert.equal(lv1.title, 'Rookie');

    const lv4 = calculateFitnessLevel(7, 3, 5);
    assert.ok(lv4.level >= 3);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test --experimental-strip-types src/lib/__tests__/utils.test.ts` (in `feedme-website`)
Expected: FAIL with missing exports `calculateBmi`, `computeWeightDeltas`, `calculateFitnessLevel`, `sanitizeRedirectPath`.

- [ ] **Step 3: Implement the exported functions in `feedme-website/src/lib/utils.ts`, add `"test": "node --test --experimental-strip-types src/lib/__tests__/*.test.ts"` to `feedme-website/package.json`, and remove `Hardware/gemini-code-1784909444244.cpp`**

Implement `calculateBmi`, `computeWeightDeltas`, `calculateFitnessLevel`, and `sanitizeRedirectPath` in `feedme-website/src/lib/utils.ts` (using relative import `'../types/index.ts'` so both Next.js and Node strip-types resolve cleanly). Delete the duplicate `Hardware/gemini-code-1784909444244.cpp`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test` (in `feedme-website`)
Expected: PASS (5/5 tests passing).

- [ ] **Step 5: Commit**

```bash
git add Hardware/gemini-code-1784909444244.cpp feedme-website/package.json feedme-website/src/lib/utils.ts feedme-website/src/lib/__tests__/utils.test.ts
git commit -m "feat(core): add tested BMI, weight delta, fitness level, and redirect sanitizer helpers"
```

---

### Task 2: Database Layer Sync, Auth Hardening & AI Food Analyze Route (`feedme-website`)

**Files:**
- Create: `feedme-website/src/app/api/food/analyze/route.ts`
- Modify: `feedme-website/src/lib/db.ts`
- Modify: `feedme-website/src/lib/supabase/middleware.ts`
- Modify: `feedme-website/src/app/auth/callback/route.ts`
- Modify: `feedme-website/src/app/api/food/search/route.ts`

**Interfaces:**
- Consumes: `calculateBmi`, `computeWeightDeltas`, `sanitizeRedirectPath` from `feedme-website/src/lib/utils.ts`
- Produces:
  - `POST /api/food/analyze` accepting `{ imageBase64?: string; mimeType?: string; fileName?: string; dishHint?: string }` and returning `{ result: AIScanResult; source: 'gemini' | 'preset' }`
  - Full 9-table Supabase + `localStorage` sync in `feedme-website/src/lib/db.ts` (`getCoins`, `earnCoins`, `spendCoins`, `getStreak`, `updateStreak`, `getQuests`, `updateQuestProgress`, `getPurchases`, `addPurchase`, `logWeightReading`, `getWeightHistory`, `getWeightStats`, `deleteWeightLog`)

- [ ] **Step 1: Harden `middleware.ts`, `auth/callback/route.ts`, and `api/food/search/route.ts`**

In `feedme-website/src/lib/supabase/middleware.ts`:
- Define `const isDevBypass = process.env.NODE_ENV === 'development' && process.env.DEV_BYPASS_AUTH === 'true';`
- In the `catch` block (`lines 69-72`), if the route is protected (`isProtected && !isAuthRoute`), redirect to `/auth/login` instead of failing open.
In `feedme-website/src/app/auth/callback/route.ts`:
- Use `const next = sanitizeRedirectPath(searchParams.get('next'));` before `NextResponse.redirect(\`${origin}${next}\`)`.
In `feedme-website/src/app/api/food/search/route.ts`:
- Scope `DEV_BYPASS_AUTH` check to `process.env.NODE_ENV === 'development' && process.env.DEV_BYPASS_AUTH === 'true'`.

- [ ] **Step 2: Upgrade `feedme-website/src/lib/db.ts` to sync all 9 Supabase tables and fix ESLint unused vars**

In `feedme-website/src/lib/db.ts`:
- In `getTodayDiary()` and `getTodayWorkouts()`: change `if (!error && data && data.length > 0)` to `if (!error && data !== null)` and sync fetched rows to `setLocal(...)` when authenticated.
- Wire `getCoins`/`earnCoins`/`spendCoins` to `public.user_coins`, `getStreak`/`updateStreak` to `public.streak_data`, `getQuests`/`updateQuestProgress` to `public.quests`, `getPurchases`/`addPurchase` to `public.purchases`, and `logWeightReading`/`getWeightHistory`/`deleteWeightLog` to `public.weight_logs` (always updating `localStorage` first and syncing to Supabase when `user` is authenticated).
- Replace hardcoded `change7d: -0.8, change30d: -1.5` in `getWeightStats()` with `computeWeightDeltas(history)` from `./utils`.
- Remove unused variables `today` (`line 329`), `days` (`line 552`), and `first` (`line 567`).

- [ ] **Step 3: Create `feedme-website/src/app/api/food/analyze/route.ts`**

Implement `POST /api/food/analyze`:
- Validate MIME type (`image/jpeg`, `image/png`, `image/webp`) and base64 payload size (`<= 5 * 1024 * 1024` bytes), returning HTTP `400` on invalid input.
- When `process.env.GEMINI_API_KEY` is configured, call the Gemini REST API (`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`) with the inline image and `responseMimeType: 'application/json'` to return `{ result: AIScanResult, source: 'gemini' }`.
- When `GEMINI_API_KEY` is not set or upstream fails, match `fileName` / `dishHint` against `POPULAR_AI_FOOD_PRESETS` and return `{ result: matchedPreset, source: 'preset' }`.

- [ ] **Step 4: Run typecheck and unit tests to verify**

Run: `npm run typecheck && npm test` (in `feedme-website`)
Expected: PASS with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add feedme-website/src/lib/db.ts feedme-website/src/lib/supabase/middleware.ts feedme-website/src/app/auth/callback/route.ts feedme-website/src/app/api/food/search/route.ts feedme-website/src/app/api/food/analyze/route.ts
git commit -m "feat(website-backend): add Gemini food analyze API, sync all 9 Supabase tables, and harden auth"
```

---

### Task 3: Modern Bento Athletic Design System & Scale-Free UI (`feedme-website`)

**Files:**
- Modify: `feedme-website/src/app/globals.css`
- Modify: `feedme-website/src/app/layout.tsx`
- Modify: `feedme-website/src/app/page.tsx`
- Modify: `feedme-website/src/components/layout/AppShell.tsx`
- Modify: `feedme-website/src/components/layout/BottomNav.tsx`
- Modify: `feedme-website/src/app/dashboard/page.tsx`
- Modify: `feedme-website/src/components/dashboard/SupplementCard.tsx`
- Modify: `feedme-website/src/components/dashboard/AICoachInsight.tsx`
- Modify: `feedme-website/src/components/log/AIFoodScanner.tsx`
- Modify: `feedme-website/src/components/profile/WeightCard.tsx`
- Modify: `feedme-website/src/app/profile/page.tsx`
- Delete: `feedme-website/src/components/profile/BleScaleButton.tsx`

**Interfaces:**
- Consumes: `POST /api/food/analyze`, `calculateFitnessLevel` from `@/lib/utils`, `WeightStats` from `@/types`
- Produces: Complete Modern Bento Athletic UI across `/`, `/dashboard`, `/log`, `/workout`, `/shop`, `/profile` with zero Duolingo `#58CC02`/`FitOwl` remnants, zero BLE Scale buttons, and zero ESLint errors/warnings.

- [ ] **Step 1: Update `globals.css` and `layout.tsx` to the Modern Bento Athletic design tokens**

In `feedme-website/src/app/globals.css`:
- Replace all `--duo-*` `#58CC02` tokens with Modern Bento Athletic tokens (`--bg-base: #F1F5F9`, `--bg-surface: #FFFFFF`, `--bg-elevated: #F8FAFC`, `--bg-overlay: #E2E8F0`, `--bg-hero: #0F172A`, `--bg-hero-elevated: #1E293B`, `--accent: #10B981`, `--accent-deep: #059669`, `--accent-soft: rgba(16, 185, 129, 0.12)`, `--text-primary: #0F172A`, `--text-secondary: #475569`, `--text-muted: #64748B`, `--border-soft: #E2E8F0`, `--border-mid: #CBD5E1`, `--border-strong: #94A3B8`, `--gold: #F59E0B`, `--gold-soft: rgba(245, 158, 11, 0.12)`, `--macro-protein: #0284C7`, `--macro-carbs: #059669`, `--macro-fat: #D97706`, `--danger: #EF4444`).
- Define `.bento-hero`, `.card`, `.btn-primary`, `.btn-secondary`, `.input-field`, `.progress-track`, `.progress-fill`, `.badge-accent`, `.badge-gold`.
In `feedme-website/src/app/layout.tsx`:
- Remove the raw `<head><link ...>` Google Font tag (fixing `@next/next/no-page-custom-font`), set `themeColor: "#0F172A"`, and update metadata title to `"FeedMe AI — Smart Performance & Nutrition"`.

- [ ] **Step 2: Redesign `src/app/page.tsx` (Landing Page), `AppShell.tsx`, `BottomNav.tsx`, and `dashboard/page.tsx` to Modern Bento Athletic (`FEEDME AI ⚡`)**

In `feedme-website/src/app/page.tsx`:
- Replace the Duolingo FitOwl + Scale Playground landing page with the **FEEDME AI ⚡ Modern Bento Athletic Showcase**:
  - Header with `⚡ FEEDME AI` badge, navigation links, and `Launch Web App` button routing to `/dashboard`.
  - Dark Navy Hero Bento Card (`#0F172A` → `#1E293B`) + Interactive **AI Nutrition & Workout Bento Playground** (click dishes to test AI Food Vision macro breakdown, log workout sets to update Net Energy Balance & `Lv.4 Fit` XP bar, and complete daily quests to earn `🪙` & `🔥`).
In `AppShell.tsx`, `BottomNav.tsx`, and `dashboard/page.tsx`:
- Replace FitOwl `🦉` and `#58CC02` styling with `⚡ FEEDME AI`, the Dark Navy Hero Bento Net Energy Balance summary, and RPG Level badge (`calculateFitnessLevel`).
In `SupplementCard.tsx:103` and `AICoachInsight.tsx`:
- Replace `any` cast with `SupplementItem['timeOfDay']` in `SupplementCard.tsx` and ensure clean Bento styling.

- [ ] **Step 3: Upgrade `AIFoodScanner.tsx` to call `POST /api/food/analyze`, add Smart Portions, and remove `BleScaleButton` from `WeightCard.tsx` & `profile/page.tsx`**

In `feedme-website/src/components/log/AIFoodScanner.tsx`:
- Validate uploaded image (`<= 5MB`, `image/*`), convert to base64, and call `POST /api/food/analyze`.
- Replace `<img>` with Next.js `<Image unoptimized />` (or `next/image` with width/height/unoptimized) to eliminate `@next/next/no-img-element`.
- Add Thai/International Smart Portion quick chips (`0.5x (ครึ่งจาน)`, `1x (1 จาน/ทัพพี)`, `1.5x (พิเศษ)`, `2x (จัมโบ้)`).
In `feedme-website/src/components/profile/WeightCard.tsx` and `src/app/profile/page.tsx`:
- Delete `src/components/profile/BleScaleButton.tsx` and remove its import/usage and the `/api/scale/reading` caption from `WeightCard.tsx`.
- Fix the unit label in `WeightCard.tsx:122` from `g` to `kg`.
- Replace the hardcoded dark modal background (`rgba(26,25,23,0.95)`) in `src/app/profile/page.tsx` with clean Bento card styling.

- [ ] **Step 4: Run `npm run typecheck`, `npm run lint`, and `npm run build` in `feedme-website`**

Run: `npm run typecheck && npm run lint && npm run build` (in `feedme-website`)
Expected: All 3 commands exit 0 with 0 errors and 0 warnings.

- [ ] **Step 5: Commit**

```bash
git add feedme-website/
git commit -m "feat(website-ui): implement Modern Bento Athletic design, remove BLE scale UI, and pass lint/build"
```

---

### Task 4: Cross-Platform Mobile/Web App Upgrade (`feedme-webapp`)

**Files:**
- Modify: `feedme-webapp/app.json`
- Modify: `feedme-webapp/package.json`
- Modify: `feedme-webapp/App.tsx`
- Modify: `feedme-webapp/src/lib/theme.ts`
- Modify: `feedme-webapp/src/lib/utils.ts`
- Modify: `feedme-webapp/src/lib/supabase/client.ts`
- Modify: `feedme-webapp/src/lib/db.ts`
- Modify: `feedme-webapp/src/screens/HomeScreen.tsx`
- Modify: `feedme-webapp/src/screens/LogScreen.tsx`
- Modify: `feedme-webapp/src/screens/WorkoutScreen.tsx`
- Modify: `feedme-webapp/src/screens/ShopScreen.tsx`
- Modify: `feedme-webapp/src/screens/ProfileScreen.tsx`
- Modify: `feedme-webapp/src/screens/AuthScreen.tsx`
- Delete: `feedme-webapp/src/components/BleScaleCard.tsx`
- Test: `feedme-webapp/src/lib/__tests__/overload.test.ts`

**Interfaces:**
- Consumes: `UserProfile`, `NutritionGoal`, `DiaryEntry`, `WorkoutEntry`, `WeightLog` from `feedme-webapp/src/types/index.ts`
- Produces:
  - `computeProgressiveOverload(sets: { weight: string; reps: string; rpe: string }[], targetReps: number, fallbackWeight: number): { totalVolume: number; avgRpe: number; maxWeight: number; shouldIncrease: boolean; nextWeight: number }` in `feedme-webapp/src/lib/utils.ts`
  - Hardened `feedme-webapp/src/lib/db.ts` with `.eq('user_id', user.id)` on all queries, local timezone day bounds, and `AsyncStorage` offline fallback
  - Scale-free Modern Bento Athletic screens across all 5 tabs (`HomeScreen`, `LogScreen`, `WorkoutScreen`, `ShopScreen`, `ProfileScreen`)

- [ ] **Step 1: Write failing unit tests for `computeProgressiveOverload` and `calculateGoal` in `feedme-webapp/src/lib/__tests__/overload.test.ts`**

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateGoal, computeProgressiveOverload } from '../utils.ts';

describe('feedme-webapp workout & nutrition math', () => {
  it('computes progressive overload from actual lifted set weight, not preset defaultWeight', () => {
    const sets = [
      { weight: '80', reps: '10', rpe: '7' },
      { weight: '85', reps: '10', rpe: '7.5' },
      { weight: '85', reps: '10', rpe: '8' },
    ];
    const res = computeProgressiveOverload(sets, 10, 60);
    assert.equal(res.maxWeight, 85);
    assert.equal(res.shouldIncrease, true);
    assert.equal(res.nextWeight, 87.5);
  });

  it('does not recommend weight increase when RPE > 8 or target reps not met', () => {
    const highRpe = computeProgressiveOverload([
      { weight: '80', reps: '10', rpe: '9' },
    ], 10, 60);
    assert.equal(highRpe.shouldIncrease, false);
    assert.equal(highRpe.nextWeight, 80);
  });

  it('calculates TDEE and macro goals accurately', () => {
    const g = calculateGoal({ age: 25, gender: 'female', weight: 58, height: 165, activity: 1.55 });
    assert.ok(g.tdee > 1800 && g.tdee < 2200);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test --experimental-strip-types src/lib/__tests__/overload.test.ts` (in `feedme-webapp`)
Expected: FAIL with `computeProgressiveOverload` not exported from `../utils.ts`.

- [ ] **Step 3: Implement `computeProgressiveOverload` and `localDayBounds` in `feedme-webapp/src/lib/utils.ts`, harden `supabase/client.ts` and `db.ts`, and update `theme.ts`**

- In `feedme-webapp/src/lib/utils.ts`: add `localDayBounds()`, `calculateFitnessLevel()`, and `computeProgressiveOverload()`. Add `"test": "node --test --experimental-strip-types src/lib/__tests__/*.test.ts"` to `feedme-webapp/package.json`.
- In `feedme-webapp/src/lib/supabase/client.ts`: read `process.env.EXPO_PUBLIC_SUPABASE_URL` and `process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY` with fallback.
- In `feedme-webapp/src/lib/db.ts`: add `.eq('user_id', user.id)` to `getProfile`, `getGoal`, `getTodayDiary`, `deleteFoodLog`, `getTodayWorkouts`, `getCoins`, `getStreak`, `getPurchases`, `getRawQuests`, `getWeightHistory`, and `deleteWeightLog`; use `localDayBounds()` in `getTodayDiary` and `getTodayWorkouts`; add `AsyncStorage` caching fallback so reads/writes work offline.
- In `feedme-webapp/src/lib/theme.ts` and `app.json`: update colors and card/button presets to the **Modern Bento Athletic** palette (`#F1F5F9` canvas, `#0F172A` hero card, `#10B981` electric mint primary, `#38BDF8` sky cyan accent) and set `userInterfaceStyle: "light"`.

- [ ] **Step 4: Upgrade all 5 screens in `feedme-webapp` and delete `BleScaleCard.tsx`**

- Delete `feedme-webapp/src/components/BleScaleCard.tsx`.
- `HomeScreen.tsx`: Add the Dark Midnight Navy Hero Bento Card (`#0F172A`) showing Net Energy Balance (`eaten - burned` vs `goal.tdee`), `Lv.X Fit` badge, and P/C/F macro progress bars.
- `LogScreen.tsx`: Remove `BleScaleCard`; add **AI Dish Vision Presets & Smart Portion Picker** (`1 ทัพพี 100g`, `1 จานเล็ก 150g`, `1 จานปกติ 200g`, `จานใหญ่ 300g` + custom gram input) and food search filter.
- `WorkoutScreen.tsx`: Support both **Strength (Progressive Overload)** using `computeProgressiveOverload()` and **Cardio / Sports** using `WORKOUT_TYPES` from `workout-data.ts`; show error alert if saving fails instead of swallowing errors.
- `ProfileScreen.tsx`: Remove `BleScaleCard`; add a **Personal Profile & TDEE Goal Setup Card** (age, gender, height `cm`, weight `kg`, activity multiplier) calling `db.saveProfile()` + manual body weight (`kg`) logger with 7d/30d change stats and BMI.
- `App.tsx`, `ShopScreen.tsx`, `AuthScreen.tsx`: Update header/badges/cards from Duolingo FitOwl `🦉` to `⚡ FEEDME AI` Modern Bento Athletic styling.

- [ ] **Step 5: Run unit tests and TypeScript typecheck in `feedme-webapp` and commit**

Run: `npm test && npm run typecheck` (in `feedme-webapp`)
Expected: PASS with 0 errors.

```bash
git add feedme-webapp/
git commit -m "feat(webapp): upgrade Expo app to Modern Bento Athletic design, remove BLE scale, and add TDEE & AI food logging"
```
