# 🥗 FeedMe 2.0 — Gamified Social Fitness & Smart Nutrition Ecosystem
> **"Eat Smart, Train Together, Level Up Every Day"**
> แอพพลิเคชันสุขภาพและออกกำลังกายแนว **Gamification & Social** (ลูกผสมระหว่าง **Duolingo + Strava + Kalguroo**) บนมือถือ **Android & iOS (Flutter)** ที่เปลี่ยนการนับแคลอรี่และการออกกำลังกายให้กลายเป็นเกมสุดสนุก พร้อมระบบ **AI คิดเมนูอาหาร**, **โหมดวิ่ง GPS & ตารางเวทเทรนนิ่ง**, และ **เครื่องชั่งวัตถุดิบอัจฉริยะ IoT (ESP32 BLE Scale)**

---

## 🌟 จุดเด่นและแนวคิดหลัก (Core Pillars)

1. **⚖️ สมดุลพลังงานเข้าใจง่ายในหน้าเดียว (Net Calorie Balance):**
   - คำนวณ `แคลอรี่สุทธิ = แคลอรี่ที่กิน - แคลอรี่ที่เผาผลาญ (วิ่ง + เวท)` เทียบกับเป้าหมายรายวัน ให้รู้ทันทีว่าวันนี้ยังกินได้อีกกี่แคลอรี่โดยไม่ต้องปวดหัวคำนวณเอง
2. **🍳 ครัวอัจฉริยะ & AI สแกนอาหาร (Smart Kitchen & AI Nutrition):**
   - **สายซื้อกิน:** ถ่ายรูปอาหาร (Gemini Multimodal AI), พูดชื่อเมนู หรือสแกนบาร์โค้ด เพื่อดูแคลอรี่และสารอาหาร (โปรตีน/คาร์บ/ไขมัน) ทันที
   - **สายทำอาหารเอง:** มีผู้ช่วย **"วันนี้ทำอะไรกินดี?"** แนะนำเมนูจากแคลอรี่ที่เหลือหรือวัตถุดิบในตู้เย็น พร้อมโหมดทำอาหารที่เชื่อมต่อกับ **เครื่องชั่งน้ำหนักวัตถุดิบอัจฉริยะ (`feedme-hardware`)** ส่งค่าน้ำหนักกรัมเข้าแอพผ่าน Bluetooth (BLE) คำนวณสารอาหารตามจริงแบบเรียลไทม์
3. **🏃‍♂️🏋️‍♂️ ออกกำลังกายครบวงจร (Run & Lift):**
   - **โหมด Cardio (สไตล์ Strava):** จับสัญญาณ GPS วิ่ง/เดิน/ปั่นจักรยาน ดูแผนที่เส้นทาง ระยะทาง เพซ (Pace) และอีเวนต์สะสมระยะทาง
   - **โหมด Weight Training:** มีโปรแกรมตารางฝึกตามเป้าหมายและผู้เชี่ยวชาญ (เช่น Push/Pull/Legs, Full Body) บันทึกน้ำหนัก x จำนวนครั้ง พร้อมคำนวณ Progressive Overload และแคลอรี่ที่เผาผลาญส่งกลับไปหักลบกับอาหารอัตโนมัติ
4. **🏆 ระบบเกมและโซเชียลสไตล์ Duolingo (Hybrid Gamification):**
   - **Weekly League (แกนหลัก):** สะสม XP จากการคุมอาหาร วิ่ง และยกเวท เพื่อไต่แรงก์รายสัปดาห์ (Bronze -> Diamond) มีโซนเลื่อนชั้นและตกชั้น
   - **Friend Quests & Party Raids (ตามใจสั่ง / อีเวนต์พิเศษ):** กดสร้างปาร์ตี้ชวนเพื่อนเมื่อไหร่ก็ได้ หรือเข้าร่วมอีเวนต์พิเศษเพื่อช่วยกันเผาผลาญแคลอรี่รวม/ตีบอส พร้อมฟีดส่งสติ๊กเกอร์เชียร์หรือแซวเพื่อน

---

## 📂 โครงสร้างโปรเจคและชื่อโฟลเดอร์ (Monorepo Structure)

```text
FeedMe/
├── feedme-mobile/          # แอพมือถือ Native Android & iOS เขียนด้วย Flutter (Dart)
│   ├── android/            # โครงสร้าง Android (โฟกัสหลัก: GPS, BLE, Camera)
│   ├── ios/                # โครงสร้าง iOS
│   ├── lib/
│   │   ├── core/           # Duolingo 3D Tactile Theme, Routing, Supabase & AI Services
│   │   └── features/       # 5 แท็บหลัก: Home, Kitchen, Workout (Run & Lift), League, Profile
│   └── pubspec.yaml
├── feedme-website/         # เว็บไซต์โปรโมทแอพโฉมใหม่ เขียนด้วย Next.js 16 + Tailwind CSS v4
│   ├── src/app/            # Landing Page แนะนำฟีเจอร์, 3D Mockup และปุ่มดาวน์โหลด APK / iOS
│   └── src/components/     # Interactive Demo คำนวณแคลอรี่ & XP บนหน้าเว็บ
├── feedme-hardware/        # โค้ดไมโครคอนโทรลเลอร์เครื่องชั่งอาหารอัจฉริยะ (ESP32-C3 + HX711)
│   ├── Hardware_Scale.ino  # เฟิร์มแวร์ส่งค่าน้ำหนักผ่าน BLE GATT
│   └── README.md           # แผงวงจรและการตั้งค่า Calibration
├── docs/                   # เอกสารการออกแบบ (Specs) และแผนการพัฒนา (Implementation Plans)
├── FeedMe.md               # เอกสาร Master Specification & สถาปัตยกรรมระบบทั้งหมด
├── ARCHITECTURE.md         # โครงสร้างระบบ, ฐานข้อมูล Supabase, และโปรโตคอล BLE / AI
├── PRE_LAUNCH_CHECKLIST.md # เช็คลิสต์มาตรฐานก่อนปล่อยใช้งานจริง 4 ด้าน
├── SECURITY.md             # นโยบายความปลอดภัยและการจัดการ API Keys / RLS
└── CONTRIBUTING.md         # แนวทางการเขียนโค้ด (Flutter Dart, Next.js TypeScript, ESP32 C++)
```

---

## 🚀 วิธีเริ่มต้นใช้งาน (Quick Start Guide)

### 1. แอพพลิเคชันมือถือ (`feedme-mobile` — Flutter Android & iOS)
```bash
cd feedme-mobile
flutter pub get

# รันบน Android Emulator หรือเครื่องจริงที่เสียบสาย USB:
flutter run -d android

# สร้างไฟล์ติดตั้ง Android APK:
flutter build apk --release
```

### 2. เว็บไซต์โปรโมท (`feedme-website` — Next.js 16 Showcase)
```bash
cd feedme-website
npm install
npm run dev
# เปิดเบราว์เซอร์ที่ http://localhost:3000
```

### 3. เฟิร์มแวร์เครื่องชั่งอาหารอัจฉริยะ (`feedme-hardware` — ESP32-C3)
1. เชื่อมต่อบอร์ด ESP32-C3 เข้ากับคอมพิวเตอร์ผ่านพอร์ต USB
2. ต่อวงจรโมดูลชั่งน้ำหนัก HX711 (`DOUT=GPIO19`, `SCK=GPIO18`, `TARE=GPIO5`, `SEND=GPIO4`)
3. คอมไพล์และอัปโหลดไฟล์ `Hardware_Scale.ino` ด้วย Arduino IDE หรือ PlatformIO

---

## 📄 เอกสารสำคัญในโปรเจค (Documentation Suite)
- [เอกสารออกแบบฉบับสมบูรณ์ (`docs/superpowers/specs/2026-10-16-feedme-v2-gamified-mobile-redesign.md`)](file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/docs/superpowers/specs/2026-10-16-feedme-v2-gamified-mobile-redesign.md)
- [Master Specification (`FeedMe.md`)](file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/FeedMe.md)
- [System Architecture (`ARCHITECTURE.md`)](file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/ARCHITECTURE.md)
- [Pre-Launch Checklist (`PRE_LAUNCH_CHECKLIST.md`)](file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/PRE_LAUNCH_CHECKLIST.md)
- [Security Guidelines (`SECURITY.md`)](file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/SECURITY.md)
- [Contributing Guide (`CONTRIBUTING.md`)](file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/CONTRIBUTING.md)
