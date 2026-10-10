# 📱 FeedMe Core Cross-Platform Web & Mobile App (`feedme-andriod`)

Unified Cross-Platform Health & Fitness Application built with **Expo SDK 54** and **React Native Web**, serving both as a responsive **Web App** (`http://localhost:8081`) and native **Android/iOS apps**.

---

## 🌟 Key Features

1. **5 Core Tabs:**
   - **Home (หน้าหลัก):** Net Calorie summary, Hydration, Coins counter, and Streak tracking.
   - **Log (บันทึก):** Fast food search, USDA integration, and photo scanning.
   - **Workout (ออกกำลัง):** AI Progressive Overload Workout Planner (Bench Press, DB Press, Squat, RDL) with automated volume load and weight recommendations.
   - **Shop (ร้านค้า):** Gamified reward store to redeem earned Energy Coins.
   - **Profile (โปรไฟล์):** Target TDEE calculator (Mifflin-St Jeor) and Smart Scale controls.
2. **Dual-Mode Scale Connectivity:**
   - **On Mobile:** Native Bluetooth Low Energy (`react-native-ble-plx`) connecting to `FeedMe Scale`.
   - **On Web & Expo Go:** 1-Click Mock Scale Simulation bar (`150g`, `240g`, `350g`) to test hands-free logging with zero native hardware crashes.

---

## 🛠️ Tech Stack & Dependencies

- **Framework:** Expo SDK 54 / React Native 0.81
- **Web Runtime:** `react-native-web` 0.20 + `@expo/metro-runtime`
- **Navigation:** React Navigation 7 (Bottom Tabs + Native Stack)
- **Database Client:** `@supabase/supabase-js` with `@react-native-async-storage/async-storage`

---

## 🚀 Running Locally

### Run as Web App in your Browser:
```bash
npm install
npx expo start --web
# Open http://localhost:8081
```

### Run on Android Device / Emulator:
```bash
npx expo start --android
```
