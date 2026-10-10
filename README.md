# 🥗 FeedMe — All-in-One AI & IoT Health Ecosystem
> **"Eat Well, Move More, Stay Disciplined"**
> An integrated health companion uniting an **ESP32 IoT Smart Food Scale**, **Multimodal AI Food Vision Scanner**, **Adaptive Progressive Overload Workout Planner**, and **Sleek Habit Gamification**.

---

## 🌟 Highlights & Philosophy

Inspired by modern health tech (Whoop, Apple Fitness+) and the behavioral engineering shared in **"AI เปลี่ยนชีวิตการออกกำลังกายของผม"** (ลงทุนDiary):
- **System Over Willpower:** Eliminate manual logging friction. Tare the plate on your IoT scale, tap Send, and your food's exact gram weight appears directly in the app.
- **AI Computer Vision (`AIFoodScanner`):** Snap a photo of any Thai or international dish to get immediate macro breakdowns and calorie estimates.
- **AI Workout Coach:** Track gym sets, reps, and RPE with automated progressive overload weight calculations.
- **Gamified Discipline:** Earn Energy Coins through consistent hydration, nutrition tracking, and workouts. Spend your coins on healthy rewards or planned cheat meals in the Shop.

---

## 📂 Project Architecture & Monorepo Map

```
FeedMe/
├── feedme-website/       # Next.js 16 Promotional Showcase Website (Landing Page)
│   ├── src/app/page.tsx  # Gamified Health-Tech Showcase & 'Launch Web App' CTA
│   └── src/components/   # Modular UI, Hero Preview, Charts, AI Scanner
├── feedme-webapp/        # Core FeedMe Cross-Platform Web & Mobile App (Expo SDK 54)
│   ├── src/screens/      # Home, Log, AI Workout, Shop, Profile tabs
│   └── src/components/   # Native BLE Scale + Web Simulation Mode
├── Hardware/             # Smart Scale Firmware & Schematics (ESP32-C3)
├── Plan/                 # Roadmap and strategic milestones (P1 Plan)
├── Reseach/              # Nutrition databases, Thai FCD references, BLE protocols
├── FeedMe.md             # Master Engineering Specification (Teamwork preview)
├── ARCHITECTURE.md       # Full System Architecture & Data Flow
├── PRE_LAUNCH_CHECKLIST.md # 4-Pillar Pre-Shipping Checklist
└── SECURITY.md           # Security Policy & Sensitive Key Protection
```

---

## 🚀 Quick Start Guide

### 1. Promotional Showcase Website (`feedme-website`)
```bash
cd feedme-website
npm install
npm run dev
# Open http://localhost:3000 (Landing Page with 'Launch Web App' CTA)
```

### 2. Core Cross-Platform Web & Mobile App (`feedme-webapp`)
```bash
cd feedme-webapp
npm install

# Run as a Web App on your browser:
npx expo start --web
# Open http://localhost:8081

# Or run on Android emulator / physical device:
npx expo start --android
```

### 3. IoT Smart Scale Firmware (`Hardware`)
1. Connect ESP32-C3 via USB.
2. Wire HX711 module (`DOUT=GPIO19`, `SCK=GPIO18`, `TARE=GPIO5`, `SEND=GPIO4`).
3. Compile and flash using PlatformIO or Arduino IDE (`sketch_jul24a.ino`).

---

## 🛡️ Pre-Launch & Shipping Checklist
Before pushing changes or deploying to production, review [`PRE_LAUNCH_CHECKLIST.md`](file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/PRE_LAUNCH_CHECKLIST.md) covering:
1. **Responsive Design** across mobile (<640px), tablet (768px-1024px), and desktop.
2. **Security & RLS** policies on Supabase tables and environment variables.
3. **Performance & Core Web Vitals** optimization.
4. **Error States & Offline Fallbacks** for BLE scale disconnection and network errors.

---

## 📄 Documentation Links
- [Master Specification (`FeedMe.md`)](file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/FeedMe.md)
- [System Architecture (`ARCHITECTURE.md`)](file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/ARCHITECTURE.md)
- [Pre-Launch Checklist (`PRE_LAUNCH_CHECKLIST.md`)](file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/PRE_LAUNCH_CHECKLIST.md)
- [Security Guidelines (`SECURITY.md`)](file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/SECURITY.md)
