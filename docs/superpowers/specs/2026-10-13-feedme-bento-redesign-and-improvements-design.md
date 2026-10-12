# FeedMe — Modern Bento Athletic Redesign & Full-Stack Improvements Design Spec

**Date:** 2026-10-13  
**Scope:** Both `feedme-website` (Next.js 16 Landing + 5-Tab Web App) and `feedme-webapp` (Expo SDK 54 Cross-Platform Mobile/Web App), plus repository security & hygiene.

---

## 1. Intent & The Why

FeedMe is an AI-assisted health, nutrition, and fitness habit-building application. Previously:
1. Its UI was overhauled into a literal Duolingo clone (`#58CC02` lime green, chunky 4px cartoon borders, and a "FitOwl 🦉" mascot), which made the product feel derivative rather than having its own athletic, modern identity.
2. It relied on a custom ESP32/HX711 IoT kitchen scale (`BleScaleButton`, `BleScaleCard`, `/api/scale/reading`), which created high user friction (requiring physical hardware to weigh food) and caused severe unit-confusion bugs where food weight in grams (`150g–350g`) overwrote user body weight in kilograms (`150–350 kg`).
3. Several core features identified in the Superpowers Project Analysis were mocked, incomplete, or had security/data-integrity defects (100% mocked AI Food Scanner, missing TDEE/profile setup UI in `feedme-webapp`, 5 of 9 Supabase tables bypassed in `feedme-website/src/lib/db.ts`, missing `.eq('user_id', user.id)` filters in `feedme-webapp/src/lib/db.ts`, and ESLint/CSS regressions).

**The Goal of This Redesign & Upgrade:**
Transform both `feedme-website` and `feedme-webapp` into a cohesive, standalone, hardware-free health & fitness ecosystem under the **"Modern Bento Athletic" (Option B)** identity — combining Apple Fitness+ / modern Bento Grid clarity with RPG-style progression (Level, XP, Streaks 🔥, Coins 🪙, and Cheat Meal rewards).

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals (User-Decided & Builder-Proposed Approved Scope)
1. **New Brand & Visual Identity ("Modern Bento Athletic" — User Decided):**
   - Replace the Duolingo green (`#58CC02`), FitOwl 🦉 mascot, and 4px toy borders across **both** `feedme-website` and `feedme-webapp`.
   - Adopt the **FEEDME AI ⚡** brand identity with a crisp light slate canvas (`#F1F5F9` / `#F8FAFC`), clean white Bento cards (`#FFFFFF`, `1px solid #E2E8F0`, subtle elevation), a Dark Midnight Navy Hero Bento Card (`#0F172A` → `#1E293B`) for Net Energy Balance & Level badge (`Lv.X Fit`), and Electric Mint (`#10B981`) as the primary action accent.
2. **Complete Removal of IoT/BLE Scale Connections (User Decided):**
   - Remove all BLE/IoT scale UI and workflows from `feedme-website` (`src/components/profile/BleScaleButton.tsx` usage, scale simulator on Landing Page `src/app/page.tsx`, scale references in `Profile` and `Log`) and `feedme-webapp` (`src/components/BleScaleCard.tsx` usage in `LogScreen.tsx` and `ProfileScreen.tsx`).
   - Replace hardware food weighing with **Smart Portion Selectors** (`1 จาน`, `1 ทัพพี`, `1 ชิ้น`, `0.5x / 1x / 1.5x / 2x`, or manual gram input) and keep `Profile` strictly for **Body Weight (`kg`)** manual logging and trend tracking.
3. **5 Core Health App Pillars (Approved):**
   - **Pillar 1 — Smart Onboarding, TDEE & Body Weight Tracker:** Personal profile editor (age, gender, height, weight, activity multiplier) in both `feedme-website` (`/profile`) and `feedme-webapp` (`ProfileScreen.tsx`) using the Mifflin-St Jeor equation (`calculateGoal`), plus manual body weight (`kg`) logging with accurate BMI and real computed `change7d` / `change30d` deltas.
   - **Pillar 2 — Real AI Food Vision Scanner & Smart Search:**
     - Create `POST /api/food/analyze` in `feedme-website` using `@google/genai` (`gemini-2.5-flash`) with structured JSON output (`foodName`, `emoji`, `confidence`, `weight`, `kcal`, `protein`, `carbs`, `fat`, `ingredients`, `tips`). When `GEMINI_API_KEY` is not configured in the environment, gracefully fall back to deterministic smart analysis of the uploaded image metadata/presets with a clear badge so the app never crashes in dev/demo environments.
     - Enforce file validation (`image/jpeg`, `image/png`, `image/webp`, max `5MB`) on upload.
     - Add AI Food Scanner + Smart Portion Picker to `feedme-webapp/src/screens/LogScreen.tsx` as well.
   - **Pillar 3 — Workout Logger & AI Progressive Overload Coach:**
     - Support both Strength training (sets, reps, actual lifted weight in `kg`, RPE) and Cardio/Sports/Flexibility workouts in both apps.
     - Fix the Progressive Overload bug in `feedme-webapp/src/screens/WorkoutScreen.tsx` so `+2.5 kg` progression is calculated from the user's actual lifted weight rather than hardcoded `defaultWeight`, and do not swallow save errors.
     - Deduct burned workout calories from eaten calories to display accurate **Net Energy Balance (Net Calories)** on both dashboards.
   - **Pillar 4 — Daily Habits (Water & Supplement Tracker):**
     - Interactive Water Tracker (`+250 ml` glasses toward daily `waterGoal`) and Supplement Checklist in `feedme-website` (and synced daily habit quick-actions in `feedme-webapp` `HomeScreen`).
   - **Pillar 5 — Gamification, Cheat Meal Shop & Full Supabase Sync:**
     - Connect all 9 tables in `feedme-website/src/lib/db.ts` (`profiles`, `nutrition_goals`, `diary_entries`, `workout_entries`, `user_coins`, `streak_data`, `quests`, `purchases`, `weight_logs`) to Supabase with `localStorage` fallback when unauthenticated/offline.
     - Fix `getTodayDiary()` empty-array bug (`if (!error && data !== null)` instead of `data.length > 0`).
     - Harden `feedme-webapp/src/lib/db.ts`: add `.eq('user_id', user.id)` to every `SELECT` and `DELETE` query, fix local-timezone midnight boundaries (`getStartOfTodayISO()`), and add `AsyncStorage` local cache fallback.
4. **Security, Code Quality & Test Suite (Builder Call based on Superpowers Audit):**
   - Lock `DEV_BYPASS_AUTH` in `feedme-website` (`src/lib/supabase/middleware.ts` and API routes) to `process.env.NODE_ENV === 'development' && process.env.DEV_BYPASS_AUTH === 'true'`, and make auth errors on protected routes redirect to `/auth/login` (fail-closed).
   - Sanitize `next` redirect parameter in `feedme-website/src/app/auth/callback/route.ts` to prevent Open Redirect (`next.startsWith('/') && !next.startsWith('//')`).
   - Move hardcoded Supabase credentials in `feedme-webapp/src/lib/supabase/client.ts` to `process.env.EXPO_PUBLIC_SUPABASE_URL` / `process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY` (with safe fallback for local dev), and update `.gitignore` files to ignore `.env`, `.env.*` (except `.env.example`), and `.superpowers/`.
   - Fix all ESLint errors and warnings in `feedme-website` (`SupplementCard.tsx`, `AIFoodScanner.tsx`, `layout.tsx`, `db.ts`) and ensure `npm run typecheck`, `npm run lint`, and `npm run build` pass with 0 errors.
   - Add automated unit tests (`node --test` / Vitest/TS runner) covering TDEE/BMI calculation, Progressive Overload math, weight trend calculation (`change7d`/`change30d`), and redirect sanitization.

### Non-Goals
- **Hardware / ESP32 Firmware (`Hardware/`):** Per user instruction, hardware scale integration is dropped from the active product experience. We will only clean up the duplicate `Hardware/gemini-code-1784909444244.cpp` file and `.gitignore` so the repo stays clean, without building new ESP32 features.
- **Changing Deployment Platforms or Supabase Schema:** Vercel deployment config, Expo build config, and the 9 existing PostgreSQL tables in `feedme-website/supabase-schema.sql` remain unchanged.

### Anti-Goals (What Would Make This a Failure Even If It Works)
- **Looking like Duolingo again:** Any leftover `#58CC02` lime green, FitOwl 🦉 mascots, or thick 4px cartoon borders on white/sky-blue backgrounds.
- **Any remaining Scale / BLE buttons in the UI:** Users must not see "Connect BLE Scale" or food gram readings overwriting their body weight (`kg`).
- **Broken Dark-on-Dark or Light-on-Light text in internal views:** Every card, input, modal, and chart across `/dashboard`, `/log`, `/workout`, `/shop`, `/profile`, and `/auth/*` must use cohesive Modern Bento Athletic tokens with high contrast.

---

## 3. Design System Specification: "Modern Bento Athletic" (Option B)

### 3.1 Color Tokens

| Token Role | CSS Variable (`feedme-website`) | `theme.ts` (`feedme-webapp`) | Hex / Value | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **App Canvas** | `--bg-base` | `colors.background`, `colors.bgBase` | `#F1F5F9` (Slate 100) | Main page background |
| **Bento Card Surface** | `--bg-surface` | `colors.card`, `colors.surface`, `colors.bgSurface` | `#FFFFFF` | Standard Bento cards |
| **Elevated / Subtle Surface** | `--bg-elevated` | `colors.bgElevated` | `#F8FAFC` (Slate 50) | Inner pills, input backgrounds, secondary rows |
| **Dark Hero Bento Surface** | `--bg-hero` | `colors.heroBg` | `#0F172A` (Slate 900) | Hero Net Energy Balance card & primary badges |
| **Dark Hero Secondary** | `--bg-hero-elevated` | `colors.heroElevated` | `#1E293B` (Slate 800) | Inner macro boxes inside the Dark Hero Bento card |
| **Primary Accent (Electric Mint)** | `--accent` | `colors.primary`, `colors.accent` | `#10B981` (Emerald 500) | Primary CTAs, active states, AI Scanner highlight |
| **Primary Accent Deep** | `--accent-deep` | `colors.primaryDark`, `colors.accentDark` | `#059669` (Emerald 600) | Hover / active pressed state |
| **Primary Accent Text** | `--on-accent` | `colors.onPrimary` | `#052E16` (Emerald 950) | High-contrast dark text on `#10B981` buttons |
| **Primary Accent Soft** | `--accent-soft` | `colors.primarySoft`, `colors.accentSoft` | `rgba(16, 185, 129, 0.12)` | Active tab/badge tint |
| **Text Primary** | `--text-primary` | `colors.text`, `colors.textPrimary` | `#0F172A` (Slate 900) | Headings, numbers, primary copy |
| **Text Secondary** | `--text-secondary` | `colors.textSecondary`, `colors.textSecond` | `#475569` (Slate 600) | Body copy, subtitles |
| **Text Muted** | `--text-muted` | `colors.textMuted` | `#64748B` (Slate 500) | Uppercase labels, timestamps, hints |
| **Border Soft** | `--border-soft` | `colors.border`, `colors.borderSoft` | `#E2E8F0` (Slate 200) | Standard 1px Bento card border |
| **Border Mid** | `--border-mid` | `colors.borderMid` | `#CBD5E1` (Slate 300) | Input & secondary button borders |
| **Macro — Protein** | `--macro-protein` | `colors.protein` | `#38BDF8` (Sky 400) / `#0284C7` on light | Protein bars & badges |
| **Macro — Carbs** | `--macro-carbs` | `colors.carbs` | `#34D399` (Emerald 400) / `#059669` on light | Carbs bars & badges |
| **Macro — Fat** | `--macro-fat` | `colors.fat` | `#FBBF24` (Amber 400) / `#D97706` on light | Fat bars & badges |
| **Gamification — Streak** | `--streak` | `colors.streak` | `#F59E0B` (Amber 500) | Streak flame 🔥 badge |
| **Gamification — Gold/Coins** | `--gold` | `colors.coins`, `colors.gold` | `#F59E0B` / `#38BDF8` | Energy coins 🪙 & XP badges |
| **Danger / Error** | `--danger` | `colors.danger` | `#EF4444` (Red 500) | Delete actions, calorie surplus warnings |

### 3.2 Typography & Component Styling
- **Font Family (`feedme-website`):** Load `Plus Jakarta Sans` and `Noto Sans Thai` via `next/font/google` (with graceful system-ui fallback so offline builds never fail) in `src/app/layout.tsx`, removing the raw `<link>` tag that caused the `@next/next/no-page-custom-font` ESLint warning.
- **Bento Cards (`.card`, `.bento-card`):** `background: #FFFFFF`, `border: 1px solid #E2E8F0`, `border-radius: 20px`, `box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05)`.
- **Hero Dark Bento Card (`.bento-hero`):** `background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%)`, `color: #F8FAFC`, `border-radius: 22px`, `box-shadow: 0 12px 28px -4px rgba(15, 23, 42, 0.18)`.
- **Buttons (`.btn-primary`, `.btn-secondary`):** Modern athletic tactile buttons (`border-radius: 14px`, crisp 1px border, subtle shadow, smooth hover lift `translateY(-1px)`) replacing the 4px Duolingo cartoon borders.
- **Brand Persona:** **FEEDME AI ⚡** (`Smart Performance & Nutrition`) with RPG Fitness Level calculation (`Lv.1 Rookie` → `Lv.2 Active` → `Lv.3 Athlete` → `Lv.4 Fit` → `Lv.5 Pro` based on streak + completed quests + workouts).

---

## 4. Technical Architecture & Component Changes

### 4.1 `feedme-website` (Next.js 16)
1. **Landing Page (`src/app/page.tsx`):**
   - Redesign to **Modern Bento Athletic** (`FEEDME AI ⚡`).
   - Replace the "Scale Simulator Playground" with an **Interactive AI Nutrition & Workout Bento Playground**: visitors can click sample dishes to see instant AI Vision macro breakdowns, log a quick workout set to watch Net Energy Balance update live in the Dark Navy Hero Bento Card, and complete daily quests to earn XP & Coins 🪙.
   - All "Launch Web App" CTAs route directly to `/dashboard` (unless overridden by `NEXT_PUBLIC_APP_URL`).
2. **Global Styles & Layout (`src/app/globals.css`, `src/app/layout.tsx`, `src/components/layout/AppShell.tsx`, `src/components/layout/BottomNav.tsx`):**
   - Update all CSS custom properties and utility classes (`.card`, `.bento-hero`, `.btn-primary`, `.btn-secondary`, `.input-field`, `.progress-track`, `.progress-fill`, `.badge-accent`, `.badge-gold`) to the Modern Bento Athletic palette.
   - Update `AppShell` and `BottomNav` with the `#0F172A` / `#10B981` athletic navigation bar and header badges (`🔥 Streak`, `🪙 Coins`, `⚡ Lv.X`).
3. **AI Food Vision API (`src/app/api/food/analyze/route.ts` [NEW]) & `src/components/log/AIFoodScanner.tsx`:**
   - Implement `POST /api/food/analyze` accepting `{ imageBase64: string, mimeType: string, fileName?: string }`.
   - Validate payload size (`<= 5MB` image) and MIME type (`image/jpeg`, `image/png`, `image/webp`).
   - If `process.env.GEMINI_API_KEY` is present, call Gemini (`gemini-2.5-flash`) to analyze the dish and return a strict JSON object matching `AIScanResult`. If `GEMINI_API_KEY` is absent or the upstream call fails, return a deterministic fallback `AIScanResult` from `POPULAR_AI_FOOD_PRESETS` so the UI always works seamlessly.
   - Update `AIFoodScanner.tsx` to validate file size/type before upload, call `/api/food/analyze`, use Next.js `<Image unoptimized />` (fixing `@next/next/no-img-element`), and provide intuitive portion buttons (`0.5x`, `1x`, `1.5x`, `2x` + custom grams).
4. **Profile & Body Weight (`src/app/profile/page.tsx`, `src/components/profile/WeightCard.tsx`):**
   - Remove `BleScaleButton` from `WeightCard.tsx` and `/profile`.
   - Keep `WeightCard.tsx` strictly for **Body Weight (`kg`)** manual input (`20–300 kg`), displaying current weight, BMI, real `change7d` and `change30d` trends, and 30-day history.
   - Restyle `/profile/page.tsx` inputs and modals to use Modern Bento Athletic tokens (removing hardcoded dark `rgba(26,25,23,0.95)` backgrounds).
5. **Database Layer (`src/lib/db.ts`) & Security (`src/lib/supabase/middleware.ts`, `src/app/auth/callback/route.ts`):**
   - Connect `getCoins`/`setCoins`, `getStreak`/`updateStreak`, `getQuests`/`saveQuests`, `getPurchases`/`addPurchase`, and `getWeightHistory`/`logWeightReading` in `feedme-website/src/lib/db.ts` to their corresponding Supabase tables (`user_coins`, `streak_data`, `quests`, `purchases`, `weight_logs`) while preserving `localStorage` as an immediate cache/fallback.
   - Fix `getTodayDiary()` to check `if (!error && data !== null)` so deleting the last entry of the day returns `[]` instead of resurrecting stale `localStorage` data.
   - Compute real `change7d` and `change30d` in `getWeightStats()` by comparing the latest weight log against the closest log `>= 7` and `>= 30` days ago (matching the algorithm in `feedme-webapp/src/lib/db.ts`), removing the hardcoded `-0.8` and `-1.5` values.
   - Remove unused variables (`today`, `days`, `first`) in `src/lib/db.ts` and fix the `any` cast in `src/components/dashboard/SupplementCard.tsx:103`.
   - Restrict `DEV_BYPASS_AUTH` to `process.env.NODE_ENV === 'development' && process.env.DEV_BYPASS_AUTH === 'true'` and make `middleware.ts` redirect to `/auth/login` on auth failure for protected routes.
   - Sanitize `next` in `src/app/auth/callback/route.ts` so only safe relative paths (`next.startsWith('/') && !next.startsWith('//')`) are allowed.

### 4.2 `feedme-webapp` (Expo SDK 54 Cross-Platform App)
1. **Theme & Navigation (`src/lib/theme.ts`, `App.tsx`, `app.json`):**
   - Update `src/lib/theme.ts` to the **Modern Bento Athletic** token palette (`#F1F5F9` background, `#0F172A` hero card, `#10B981` electric mint primary, `#38BDF8` sky cyan accent, crisp 1px borders + soft shadows instead of 4px Duolingo borders).
   - Set `userInterfaceStyle: "light"` in `app.json`.
   - Update `App.tsx` bottom tab bar to the sleek Bento Athletic styling.
2. **Home Screen (`src/screens/HomeScreen.tsx`):**
   - Add the **Dark Midnight Navy Hero Bento Card** displaying **Net Energy Balance** (`eatenKcal - burnedKcal` vs `goal.tdee`), remaining calories, RPG Level badge (`Lv.X Fit`), and P/C/F macro progress pills.
   - Refresh data automatically when switching tabs or returning to Home.
3. **Log Screen (`src/screens/LogScreen.tsx`):**
   - Remove `BleScaleCard`.
   - Add **AI Food Vision Scanner** (selecting/capturing food photos or choosing AI dish presets with instant macro analysis) + **Smart Portion Selector** (`ทัพพี / จาน / ชิ้น`: `100g`, `150g`, `200g`, `250g`, `300g` + manual gram input) and search filter across the Thai/International food database.
4. **Workout Screen (`src/screens/WorkoutScreen.tsx`):**
   - Support both **Strength Builder (Progressive Overload)** and **Cardio / Sports** modes (using `WORKOUT_TYPES` from `src/lib/workout-data.ts`).
   - Fix the Progressive Overload calculation bug: compute recommended next-session weight from the user's **actual lifted weight** (`maxWeight + 2.5 kg`) instead of `ex.defaultWeight + 2.5 kg`.
   - Handle errors properly in `logSession` instead of showing a fake success alert when saving fails.
5. **Profile Screen (`src/screens/ProfileScreen.tsx`):**
   - Remove `BleScaleCard` (fixing the bug where `150g` food weight logged `0.2 kg` body weight).
   - Add a **Personal Profile & TDEE Goal Setup Card** (age, gender, height `cm`, weight `kg`, activity level) that calls `db.saveProfile()` and `calculateGoal()` so users get personalized Mifflin-St Jeor calorie & macro targets and accurate BMI.
   - Keep the manual Body Weight (`kg`) logger, 7d/30d change stats, and 30-day weight history list.
6. **Database & Supabase Client (`src/lib/db.ts`, `src/lib/supabase/client.ts`):**
   - Read `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from `process.env` (with fallback to existing project URL/anon key for seamless local run).
   - Add `.eq('user_id', user.id)` to all `SELECT` and `DELETE` queries in `src/lib/db.ts`.
   - Fix local timezone start-of-day boundary (`new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()`) in `getTodayDiary()` and `getTodayWorkouts()`.
   - Add `AsyncStorage` caching fallback in `src/lib/db.ts` so profile, goals, diary, workouts, coins, streak, quests, and weight logs work smoothly even when offline.
