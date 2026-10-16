# FeedMe - Tech Stack
> Updated: September 2026 | All-in-One Health & Fitness App

---

## Frontend

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Web App** | Next.js 16 (App Router + Turbopack) | SSR, fast build, API Routes built-in |
| **Mobile** | React Native + Expo SDK 54 | Cross-platform iOS/Android, shared codebase |
| **Styling** | CSS Modules + Vanilla CSS (Web) / StyleSheet (Mobile) | No dependency overhead |
| **State** | React Context + useReducer | Simple, no extra library needed |
| **Charts** | Recharts (Web) / Victory Native (Mobile) | Calorie trend, macro charts |
| **Navigation (Mobile)** | React Navigation v7 (Bottom Tabs + Stack) | Standard RN navigation |

---

## Backend & Database

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Backend-as-a-Service** | Supabase | Auth + PostgreSQL + Realtime + Storage ครบในที่เดียว |
| **Database** | PostgreSQL (via Supabase) | Relational, RLS per-user security |
| **Auth** | Supabase Auth (Email/Password) | Built-in, secure |
| **File Storage** | Supabase Storage | Food photos สำหรับ AI analysis |
| **Realtime** | Supabase Realtime | Sync ข้อมูลระหว่าง Web ↔ Mobile |

---

## APIs & External Services

| Service | Usage | Status |
|---------|-------|--------|
| **USDA Food Data Central** | ค้นหาอาหาร 1M+ รายการ (Calorie/Macro) | ✅ Integrated (ต้องการ API Key) |
| **AI Vision API** (TBD) | วิเคราะห์รูปอาหาร → ประมาณ Calorie | 🔄 Mock ก่อน, เลือก API ทีหลัง |
| Gemini Vision (Recommended) | Option A — Google AI, รองรับอาหารไทยดี | - |
| GPT-4o Vision | Option B — OpenAI, accurate แต่แพงกว่า | - |
| **Thai FCD** (Future) | ฐานข้อมูลอาหารไทย (INMU) | ⏳ Phase 3+ |

---

## Hardware / IoT

| Component | Specification | Role |
|-----------|-------------|------|
| **MCU** | ESP32-C3 | BLE + WiFi processor |
| **Load Cell** | >=5 kg capacity | ชั่งน้ำหนักวัตถุดิบอาหาร |
| **ADC** | HX711 | แปลง Load Cell signal เป็น digital |
| **Protocol** | BLE GATT (UUID: 4fafc201-1fb5-459e-8fcc-c5c9c331914b) | ส่งน้ำหนักไปแอพ |
| **Firmware** | Arduino C++ | ESP32 firmware |

---

## Dev Tools & Infrastructure

| Tool | Usage |
|------|-------|
| **TypeScript** | Type safety ทั้ง Web และ Mobile |
| **ESLint** | Code quality |
| **EAS Build** | Build Android APK / iOS IPA |
| **Git** | Version control |
| **Supabase CLI** | DB migrations, local dev |

---

## Environment Variables

### feedme-website (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
USDA_API_KEY=your_usda_key_here       # fdc.nal.usda.gov/api-key-signup
AI_VISION_API_KEY=your_key_here       # Gemini or OpenAI (future)
DEV_BYPASS_AUTH=true                  # DEV ONLY - remove in production!
```

### feedme-andriod / feedme-ios
```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## Database Schema (Supabase PostgreSQL)

```sql
-- Core Tables
profiles          -- user profile (age, gender, weight, height, activity)
nutrition_goals   -- TDEE + macro targets per user
food_logs         -- daily food diary (meal_type, food_name, kcal, macros, grams)
workout_logs      -- workout sessions (type, duration, sets, reps, kcal_burned)
weight_logs       -- body weight history (from scale IoT or manual)
water_logs        -- daily water intake (ml per entry)
supplement_logs   -- supplement intake (name, dose, time)

-- Gamification (existing)
quests            -- daily/weekly challenges
purchases         -- shop items bought with coins
```

---

## Calorie Calculation

### TDEE (Mifflin-St Jeor)
```
Male:   BMR = 10W + 6.25H - 5A + 5
Female: BMR = 10W + 6.25H - 5A - 161

Activity Multiplier:
  Sedentary    = 1.2
  Light        = 1.375
  Moderate     = 1.55
  Active       = 1.725
  Very Active  = 1.9

TDEE = BMR × Activity Multiplier
```

### Workout Calories Burned (MET Method)
```
Calories = MET × Weight(kg) × Duration(hours)

MET Values:
  Running (moderate) = 8.0
  Cycling            = 6.0
  Swimming           = 6.0
  Weight Training    = 5.0
  Walking            = 3.5
  Yoga               = 3.0
  HIIT               = 8.5
```

### Net Calorie (Daily Balance)
```
Net = Calorie_In - Calorie_Burned_from_Workout
Goal: Net should match TDEE target
```
