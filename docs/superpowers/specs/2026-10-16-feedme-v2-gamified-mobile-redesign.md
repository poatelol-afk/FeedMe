# FeedMe 2.0 — Gamified Social Fitness & Smart Nutrition Ecosystem Design Spec

**Date:** 2026-10-16  
**Status:** Draft (Pending Builder Check & User Approval)  
**Target Platforms:**
- **Mobile Application (`feedme-mobile`):** Flutter (Dart) for Native Android (Primary Focus) & iOS
- **Promotional Website (`feedme-website`):** Next.js 16 (App Router), Tailwind CSS v4 (Marketing & App Showcase ONLY — No Web App)
- **IoT Hardware (`feedme-hardware`):** ESP32-C3 + HX711 Smart Kitchen Scale (BLE GATT)

---

## 1. Intent & The Why

Most fitness and nutrition apps feel like a chore: clinical, overly serious, solitary, and tedious to log. Users face three major pain points:
1. **Exercise feels forced and lonely:** Tracking workouts is treated like solitary homework rather than a fun, social game with friends.
2. **Decision fatigue around food ("What should I eat?"):** People starting a fitness journey struggle to think of meals, don't know the calories/macros of what they eat or cook, and hate tedious manual ingredient entry.
3. **Disconnected "Eat vs. Burn" visibility:** Users don't clearly see how their food intake balances against calories burned from running or weight training in real time.

**FeedMe 2.0** solves this by merging the best of **Duolingo** (habit streaks, weekly leagues, optional co-op quests, playful tactile UI), **Strava** (GPS running/cardio tracking, social kudos, daily/weekly distance events), and **Kalguroo / AI Kitchen** (1-snap AI meal recognition, smart recipe generator based on remaining calories, and Bluetooth smart scale integration for home cooking).

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
- **Native Mobile First (`feedme-mobile`):** Build a pure Flutter (Dart) mobile application targeting Android first (APK/AAB) with full iOS compatibility.
- **Instant Net Calorie Clarity:** Show `Net Calories = Consumed - Burned (Cardio + Weight Training)` vs. `Daily Target` at the top of the Home screen so users immediately know their remaining calorie budget.
- **Frictionless Food Logging & Cooking Assistant:**
  - **Eat Out / Quick Log:** Snap a photo (Gemini Multimodal Vision), speak/type a dish name, or scan a barcode for instant calorie and macro (Protein, Carbs, Fat) breakdown.
  - **Home Cooking & Recipe Generator:** Suggest recipes tailored to the user's remaining calorie/protein budget or available fridge ingredients. Support step-by-step ingredient weighing via the **ESP32 BLE Smart Scale** (plus an in-app slider/mock scale for users without hardware).
- **Dual-Mode Fitness (`Run & Lift`):**
  - **Strava-style Cardio:** GPS route tracking, pace, distance, duration, and active calorie burn calculation.
  - **Structured Weight Training:** Expert/goal-based workout programs (e.g., Push/Pull/Legs, Full Body, Beginner Strength), set/rep/weight logging, progressive overload suggestions, and estimated calorie burn fed directly into the Net Calorie dashboard.
- **Hybrid Gamification & Social Engine:**
  - **Core Loop (Duolingo League):** Weekly individual XP leaderboard (Bronze to Diamond leagues with promotion/demotion zones) driven by logging meals, hitting calorie/macro goals, running, and lifting.
  - **On-Demand & Event Co-op (`Friend Quests / Party`):** Optional party/duo quests that users can trigger on demand with friends or join during special limited-time events (e.g., "Burn 10,000 kcal together this weekend" or "Co-op Boss Raid").
- **Redesigned Promotional Website (`feedme-website`):** Complete visual overhaul of the Next.js landing page to showcase the new gamified mobile app, GPS + Weight features, AI kitchen, and Smart Scale, driving visitors to download the Android APK / iOS app.

### Non-Goals
- **No Browser Web App (`feedme-webapp` is deprecated):** We are no longer building or maintaining a browser-based web app version of the tracker. All user tracking happens in the native Flutter mobile app (`feedme-mobile`).
- **No Real-Money E-Commerce / Payment Gateways:** The in-app Reward Shop uses earned Gems/Energy Coins only.
- **No Medical Diagnostics:** Not a medical device or clinical dietetic prescription tool.

### Anti-Goals (What Would Make This a Failure)
- **Clinical, Stressful, or Guilt-Inducing UX:** Punishing users harshly or displaying intimidating spreadsheets of numbers. Even going over calories should be framed playfully (e.g., a comedic nudge or a quick evening walk quest to balance it out).
- **Mandatory Social Pressure:** Forcing users into co-op party quests every week when they want solo focus. Party/Friend Quests must remain opt-in or event-based.
- **Tedious Manual Food Entry:** Requiring users to search 5 different database screens just to log a single home-cooked meal.

---

## 3. Repository & Folder Naming Structure

The project workspace (`c:\Users\poate\OneDrive\เอกสาร\FeedMe`) is reorganized into a clean 3-pillar structure:

```text
FeedMe/
├── feedme-mobile/        # NEW: Flutter (Dart) Native Mobile App (Android focus + iOS)
│   ├── android/          # Native Android configuration (Permissions: GPS, BLE, Camera)
│   ├── ios/              # Native iOS configuration
│   ├── lib/
│   │   ├── core/         # Theme (Duolingo 3D tactile design tokens), constants, Supabase client
│   │   ├── features/
│   │   │   ├── home/     # Net Calorie Balance ring/bar, Daily Quests, Streak header
│   │   │   ├── kitchen/  # AI Photo Scanner, Recipe Generator ("What to eat?"), BLE Scale Cooking Mode
│   │   │   ├── workout/  # Strava-style GPS Run tracker + Weight Training Programs & Set Logger
│   │   │   ├── league/   # Weekly XP Leaderboard + Opt-in Friend Quests / Special Events + Social Feed
│   │   │   └── profile/  # Avatar, Streak Freeze Shop, Body Metrics, Hardware Scale Pairing
│   └── pubspec.yaml
├── feedme-website/       # REDESIGNED: Next.js 16 Promotional Landing Page (No Web App routes)
│   ├── src/app/          # Single high-impact marketing page + APK/App Store download CTAs
│   └── src/components/   # Interactive 3D phone mockups, Feature showcases (AI Kitchen, Run & Lift, League)
├── feedme-hardware/      # RENAMED from Hardware/: ESP32-C3 + HX711 Smart Kitchen Scale Firmware
│   ├── Hardware_Scale.ino
│   └── README.md
└── docs/                 # Specs, architecture, and implementation plans
```
*(Note: The legacy `feedme-webapp/` directory will be removed/replaced by `feedme-mobile/` during implementation).*

---

## 4. Core User Experience & Feature Specifications (User-Decided)

### 4.1 Tab 1: Home & Energy Balance (`หน้าแรก & สมดุลพลังงาน`)
- **Top Status Bar:** Displays active **Streak Fire (`🔥 วันต่อเนื่อง`)**, **Gems (`💎 เพชร`)**, and **Weekly XP (`⚡ XP`)**.
- **Net Calorie Balance Card (Hero Widget):**
  - Formula: $\text{Remaining Quota} = \text{Target Daily Calories} - (\text{Food Consumed} - \text{Exercise Burned})$.
  - Visual breakdown showing:
    - `🍽️ กินเข้าไป (Consumed)` in kcal + Macro progress bars (Protein, Carbs, Fat).
    - `🔥 เผาผลาญ (Burned)` combined from GPS Cardio + Weight Training sessions.
    - `⚖️ สุทธิ / เหลือโควต้า (Net / Remaining)` highlighted clearly so the user knows exactly how much they can eat for their next meal.
- **Daily Quests (`เควสประจำวัน`):**
  - 3 daily bite-sized missions (e.g., *"ถ่ายรูปอาหารเช้า (+20 XP)"*, *"ยกเวทตามตาราง 1 โปรแกรม (+100 XP)"*, *"เดิน/วิ่งสะสม 2 กม. (+80 XP)"*) that reward XP and Gems upon completion with tactile confetti animations.

### 4.2 Tab 2: Smart Kitchen & AI Nutrition (`อาหาร & โหมดทำครัว` — Mockup / Simulation Mode)
- **Mode A — Eat Out / Quick Snap (`สายซื้อกิน` — Simulated AI):**
  - **AI Camera Scanner (Mockup):** Users can snap/pick a photo or choose from sample Thai & international dishes. The app simulates the AI Vision scanning animation and returns realistic pre-calibrated / rule-based calorie and macro (P/C/F) breakdowns without requiring a live Gemini API key.
  - **Voice / Quick Text:** Type or select a dish name (e.g., *"กะเพราหมูสับไข่ดาวไม่สุก"*) for instant simulated nutrition estimation.
- **Mode B — Home Cooking & Smart Scale (`สายทำกินเอง & ตู้เย็นอัจฉริยะ` — Simulated Chef & Scale):**
  - **"What Should I Cook?" AI Chef (`วันนี้ทำอะไรกินดี?` — Mockup):** Suggests 3 curated recipes dynamically filtered to fit the user's *remaining calorie and protein quota* for the day or selected fridge ingredients.
  - **Interactive Cooking & Mock Smart Scale Bowl:**
    - Features an interactive **On-Screen Smart Scale Simulator** (slider, `+10g / +50g` quick buttons, `TARE` button, and `SEND TO BOWL` button) that mimics the `ESP32-C3` hardware scale experience so users can weigh virtual ingredients (e.g., raw chicken breast 150g, rice 120g) and see real-time calorie & macro calculations immediately.

### 4.3 Tab 3: Run & Lift (`ออกกำลังกาย: วิ่ง GPS & เวทเทรนนิ่ง`)
- **Cardio GPS Mode (Strava Style):**
  - Tracks outdoor running, walking, or cycling using mobile GPS (with a built-in simulated run/route demo mode for indoor testing) and map polyline rendering.
  - Displays live Distance (km), Pace (min/km), Duration, and Active Calories Burned (calculated via METs + user weight).
  - Includes Daily/Weekly Running Challenges (e.g., *"อีเวนต์วิ่งสะสม 15 กม. ประจำสัปดาห์"*).
- **Weight Training Mode (Expert Programs & Logger):**
  - Pre-built **Expert & Goal Programs** (e.g., *3-Day Full Body*, *4-Day Upper/Lower*, *Push/Pull/Legs*, *Fat Loss Circuit*).
  - Interactive Set Logger: Check off sets (`Weight kg x Reps`), built-in rest timer between sets, and automatic **Progressive Overload** badge when lifting heavier or more reps than last session.
  - Automatically converts workout duration and intensity/volume into **Burned Calories** and **XP**, updating the Home Net Calorie balance immediately.

### 4.4 Tab 4: League & Social Party (`ลีก & คอมมูนิตี้`)
- **Weekly Duolingo-Style League (Always Active):**
  - Users are grouped into tiers (*Bronze, Silver, Gold, Emerald, Diamond*) resetting every Sunday night.
  - All healthy actions (logging meals accurately, hitting protein goals, completing a run or weight session) grant **XP**.
  - Top 5 promote to the next league; bottom 5 enter the demotion zone.
- **On-Demand Friend Quests & Special Events (Opt-In Co-op):**
  - Users can tap **"+ ชวนเพื่อนตั้งตี้ (Create/Join Party Quest)"** whenever they want, or join **Seasonal/Weekend Boss Events** (e.g., *"แก๊งหมูกระทะ vs. บอสไขมันทรานส์: ช่วยกันเผาผลาญรวม 10,000 kcal ใน 7 วัน"*).
  - Features a playful **Activity Feed** where friends can send 1-tap stickers/nudges (🔥 เชียร์, 👏 ยินดีด้วย, 👀 แซวเวลาแอบกินเกิน) without any toxic messaging.

### 4.5 Tab 5: Profile, Avatar & Reward Shop (`โปรไฟล์ & ร้านค้า`)
- Spend earned **Gems (`💎`)** on **Streak Freezes (`❄️ กันไฟดับ`)**, custom Avatar outfits/frames, or **Planned Cheat Meal Passes (`🍔 บัตรตามใจปาก`)** that adjust the day's calorie target without breaking the user's streak.
- Manage body weight logs, daily TDEE/macro goals, and Smart Scale simulator settings.

---

## 5. Promotional Website Redesign (`feedme-website`)

- **Role:** Pure marketing & product showcase website (`http://localhost:3000`). **No `/dashboard` or web-app tracker routes.**
- **Visual Direction:** Vibrant, tactile gamified aesthetic matching the new Flutter app (Bold typography, 3D tactile buttons, animated phone mockups, playful badges).
- **Sections:**
  1. **Hero Section:** High-energy headline (*"เปลี่ยนการคุมอาหารและออกกำลังกายให้เป็นเกมที่สนุกที่สุด"*), interactive 3D phone preview toggling between Home Net Calories, AI Kitchen, GPS Run, and League, plus **"Download for Android (APK)"** and **"Coming Soon to iOS"** buttons.
  2. **The 3 Pillars Bento Grid:**
     - *Smart Kitchen & IoT Scale* (Photo AI + Recipe Chef + Smart Scale demo).
     - *Run & Lift* (Strava-like GPS + Expert Weight Programs).
     - *Duolingo-style Gamification* (Weekly Leagues + On-demand Party Boss Raids).
  3. **Live Interactive Calorie & XP Calculator Demo:** A fun mini widget on the landing page where visitors can click a meal + workout to see how FeedMe balances calories and awards XP.

---

## 6. Architecture & Technical Decisions (Builder's Call)

These technical defaults are chosen to accelerate development while keeping the codebase self-contained, fast, and zero-config to run:
- **Mock-First / Self-Contained Services (User Requested):**
  - **AI Food Scanner & Recipe Chef (`MockAiKitchenService`):** Implemented as an interactive local simulation with rich Thai/International dish datasets, scanning animations, and dynamic recipe filtering by remaining calories—no external `GEMINI_API_KEY` required.
  - **Bluetooth Smart Scale (`MockBleScaleService`):** Implemented as an interactive in-app Smart Scale Simulator (with live weight oscillation, Tare, Send, and ingredient presets) mimicking the `ESP32-C3` hardware experience without requiring physical BLE pairing during this phase.
- **Flutter State Management & Routing:** Clean state management (`ChangeNotifier` / `Provider` or `flutter_riverpod`) + `IndexedStack` / `go_router` for 5-tab bottom navigation with persistent state and local storage (`shared_preferences`).
- **GPS & Map Rendering:** `flutter_map` (OpenStreetMap free tiles) + `geolocator` with a built-in simulated running route generator so GPS tracking can be tested smoothly on any Android emulator or device.
- **Documentation Suite Updates:**
  - Update `README.md`, `FeedMe.md`, `ARCHITECTURE.md`, `PRE_LAUNCH_CHECKLIST.md`, `SECURITY.md`, `CONTRIBUTING.md`, and `feedme-hardware/README.md` to reflect the new Flutter (`feedme-mobile`) + Next.js (`feedme-website`) + ESP32 (`feedme-hardware`) architecture with Mockup/Simulation mode for AI and BLE Scale.
