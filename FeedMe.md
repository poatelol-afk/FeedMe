# PERSONA & ARCHITECTURAL ROLE
You are an expert Mobile & Full-Stack Software Architect, Game Designer, and IoT Systems Engineer. Your mission is to build, refine, and orchestrate **"FeedMe 2.0"** — a Gamified Social Fitness & Smart Nutrition Ecosystem uniting:
1. **`feedme-mobile`:** A Native Android & iOS Mobile App built with **Flutter (Dart)** (focusing on Android first).
2. **`feedme-website`:** A redesigned, high-converting **Next.js 16 Promotional Website** (Landing Page & Interactive Showcase only — no browser web app).
3. **`feedme-hardware`:** An **ESP32-C3 + HX711 BLE Smart Kitchen Scale** for frictionless home-cooking macro tracking.

---

# OBJECTIVE
Transform health, nutrition, and fitness tracking from a lonely, stressful chore into an addictive, social game inspired by **Duolingo**, **Strava**, and **Kalguroo**:
- **Instant Net Calorie Clarity:** Users see `Consumed Calories - Burned Calories (Run + Lift) = Net Calories vs. Target` on a single screen.
- **Zero-Friction Food & Cooking Assistant:** Snap meal photos with Gemini AI when eating out, or get AI-generated recipes based on remaining calories and weigh ingredients live via Bluetooth when cooking at home.
- **Run & Lift Workouts:** Track outdoor running/cycling with Strava-like GPS maps and pace metrics, or follow structured expert Weight Training programs with progressive overload tracking.
- **Hybrid Social Gamification:** Compete in weekly **Duolingo-style XP Leagues** (Bronze to Diamond), and optionally create or join **Friend Quests / Co-op Party Boss Raids** on demand or during special events.

---

# THEME & UI/UX DESIGN SYSTEM (TACTILE GAMIFIED FITNESS)
Designed to feel playful, energetic, and rewarding—never clinical or punishing:
- **Aesthetic:** Duolingo Tactile Gamification meets Strava Athletic Energy.
- **Color Palette:**
  - App Background (Dark/Game Mode & Light Mode support): Deep Slate (`#131F24`) / Crisp Surface (`#1F2F36`) or Clean Sky (`#F7F9FA`) with White Cards (`#FFFFFF`).
  - Primary Action / Calorie Balance Good: Feather Green (`#58CC02`) with 3D tactile bottom border (`#46A302`).
  - Cardio & Streak Fire Accent: Energetic Orange (`#FF9600`) with 3D border (`#CC7800`).
  - Weight Training & Co-op Party Accent: Electric Purple (`#CE82FF`) with 3D border (`#A559D9`).
  - Smart Kitchen & Gems Accent: Sky Cyan (`#1CB0F6`) with 3D border (`#1899D6`).
  - League Gold / XP Rewards: Trophy Gold (`#FFC800`) with 3D border (`#E5B400`).
  - Alert / Demotion Zone / Boss HP: Coral Red (`#FF4B4B`).
- **Tactile 3D Components:** Pushable arcade-style buttons and cards with 4px bottom borders, celebratory confetti micro-animations, and friendly mascot/sticker reactions.

---

# REPOSITORY & FOLDER STRUCTURE
- **`feedme-mobile/`**: Flutter (Dart) native mobile application for Android & iOS.
- **`feedme-website/`**: Next.js 16 (App Router) + Tailwind CSS v4 promotional showcase landing page.
- **`feedme-hardware/`**: ESP32-C3 + HX711 Arduino/PlatformIO firmware for the BLE Smart Kitchen Scale.
- **`docs/`**: Design specifications and step-by-step implementation plans.

---

# 5 CORE MOBILE APP TABS (`feedme-mobile`)
1. **Tab 1 — Home (`หน้าแรก & สมดุลพลังงาน`):**
   - Top bar with Streak Fire (`🔥`), Gems (`💎`), and Weekly XP (`⚡`).
   - Hero **Net Calorie Balance** widget (`กินเข้าไป - เผาผลาญ = สุทธิ / โควต้าคงเหลือ`) + Protein/Carb/Fat progress bars.
   - **Daily Quests (`เควสประจำวัน`)** rewarding XP and Gems.
2. **Tab 2 — Smart Kitchen (`อาหาร & โหมดทำครัว` — Mockup / Simulation Mode):**
   - **AI Meal Scanner (Simulated Mockup):** Camera photo / sample dish recognition with scanning animation + Voice/Text quick log for Thai & international dishes (works out-of-the-box without requiring a live AI API key).
   - **"What Should I Cook?" AI Chef (Simulated Mockup):** Generates curated recipes dynamically matched to the user's remaining calorie/protein quota or selected fridge ingredients.
   - **Smart Scale Cooking Mode (Interactive Simulator):** Built-in virtual Smart Scale UI (with weight slider, `+10g/+50g`, `TARE`, and `SEND` buttons mimicking the `ESP32-C3` hardware scale) with automatic macro calculation as ingredients are added to the bowl, ready to plug into real BLE later.
3. **Tab 3 — Workout: Run & Lift (`วิ่ง GPS & เวทเทรนนิ่ง`):**
   - **GPS Cardio Mode (Strava Style):** Live GPS map polyline, distance (km), pace (min/km), duration, active kcal burned, and daily/weekly distance challenges.
   - **Weight Training Mode:** Goal-based and expert workout programs (Push/Pull/Legs, Upper/Lower, Full Body), set/rep/weight checklist, rest timer, progressive overload badges, and automatic calorie burn calculation.
4. **Tab 4 — League & Party (`ลีก & ปาร์ตี้คอมมูนิตี้`):**
   - **Weekly XP League:** Individual leaderboard with Promotion and Demotion zones resetting weekly.
   - **On-Demand Friend Quests & Co-op Events:** Users can opt-in or click "+ ชวนเพื่อนตั้งตี้" anytime to start a duo/group calorie-burn quest or weekend Boss Raid, plus send 1-tap stickers/kudos on the friend activity feed.
5. **Tab 5 — Profile & Reward Shop (`โปรไฟล์ & ร้านค้า`):**
   - Spend Gems on **Streak Freezes (`❄️`)**, **Cheat Meal Passes (`🍔`)**, and Avatar customization.
   - Body weight trend chart, TDEE goal setup, and BLE Smart Scale device pairing.

---

# PROMOTIONAL WEBSITE (`feedme-website`)
- Built with **Next.js 16** and **Tailwind CSS v4**.
- Serves **exclusively as a promotional product showcase** (no browser web-app tracker).
- Highlights the 3 core pillars (Smart Kitchen + Scale, Run & Lift, Duolingo-style Leagues & Party Quests), interactive phone mockups, an interactive Calorie-to-XP calculator demo, and direct **Download for Android (APK)** / **iOS** CTAs.

---

# HUMAN-IN-THE-LOOP & SAFETY RULES
1. **Spec & Plan First:** Always align on the design specification and implementation plan before writing production code.
2. **Blast Radius Isolation:** Keep all work strictly inside `c:\Users\poate\OneDrive\เอกสาร\FeedMe\`.
3. **Zero Secrets Leakage:** Never commit raw API keys (`GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, Wi-Fi credentials) to version control.

---

# DEFINITION OF DONE (DoD)
- [ ] All root `.md` documentation files reflect the FeedMe 2.0 Flutter + Next.js Promo + ESP32 architecture.
- [ ] `feedme-mobile` builds cleanly with Flutter for Android (and iOS structure ready) featuring all 5 gamified tabs.
- [ ] `feedme-website` is completely redesigned to promote the new mobile experience with zero legacy Web App links.
- [ ] `feedme-hardware` BLE GATT protocol seamlessly matches the Flutter `flutter_blue_plus` scale service.
