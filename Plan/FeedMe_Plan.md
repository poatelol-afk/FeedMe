# FeedMe - All-in-One Health & Fitness App
> Vision: Smart Food Scale + Food Tracking + Workout + AI Photo Analysis
> Updated: September 2026 | Based on research synthesis + user interviews

---

## Core Vision

FeedMe เป็น All-in-One Health & Fitness Companion ที่รวม:
1. **Smart Food Scale IoT** (ESP32-C3 BLE) — ชั่งวัตถุดิบส่งมาแอพโดยตรง
2. **Food Tracking** — ค้นหาอาหาร (USDA), ถ่ายรูปวิเคราะห์ด้วย AI
3. **Workout Tracking** — Gym / Cardio / Home Workout พร้อม Preset Plans
4. **Net Calorie Dashboard** — แคลอรี่ที่กิน ลบ แคลอรี่ที่เผา พร้อม Progress Graph
5. **Daily Reminders** — เตือนกิน, เตือนออกกำลังกาย, เตือนดื่มน้ำ
6. **Water + Supplement Tracker** — บันทึกการดื่มน้ำและอาหารเสริม

---

## Target Users

- คนที่ทำอาหารเองที่บ้าน → ใช้ตาชั่ง IoT ชั่งวัตถุดิบ
- คนที่ซื้ออาหารกิน → ถ่ายรูปให้ AI วิเคราะห์
- คนออกกำลังกายที่ต้องการ Net Calorie ที่แม่นยำ

---

## Key Features

### 🍱 Food Tracking
- **USDA Food Search** — ค้นหา 1 ล้าน+ รายการอาหาร (Calorie/Protein/Carb/Fat)
- **AI Food Photo** — ถ่ายรูป → AI วิเคราะห์ → ยืนยัน → บันทึก (Gemini Vision หรือ GPT-4o)
- **IoT Scale** — BLE ชั่งวัตถุดิบ → กด Send → น้ำหนักส่งมาแอพ (optional สำหรับคนทำอาหาร)
- **Food Log** — บันทึกทุกมื้อ (เช้า/กลางวัน/เย็น/ว่าง) พร้อม portion size

### 💪 Workout Tracking
- **3 โหมด:** Gym (Weight Training), Cardio, Home Workout
- **Preset Plans:** เลือกเป้าหมาย (ลดน้ำหนัก / เพิ่มกล้ามเนื้อ / Maintain) → แอพแนะนำ Plan
- **Session Logger:** บันทึก Sets/Reps/Weight หรือ ระยะทาง/เวลา
- **Calorie Burned:** คำนวณด้วย MET formula → หักออกจาก Daily Budget อัตโนมัติ

### 📊 Dashboard
- **Net Calorie Ring/Bar** — กิน X kcal | เผา Y kcal | เหลือ Z kcal
- **Macro Progress** — Protein / Carb / Fat ต่อวัน
- **Weight Progress Graph** — timeline น้ำหนักตัว vs เป้าหมาย
- **Streak Counter** — ออกกำลังกาย/บันทึกอาหารติดต่อกันกี่วัน
- **Weekly Summary** — สรุปรายสัปดาห์

### 🔔 Reminders & Tracking
- **Reminders** — เตือนกินอาหาร, เตือนออกกำลังกาย, เตือนดื่มน้ำ
- **Water Tracker** — Goal น้ำต่อวัน (ml) + ปุ่ม +150ml / +250ml / +500ml
- **Supplement Tracker** — รายการอาหารเสริม + เวลาที่กิน

### ⚖️ TDEE & Goal Setting
- คำนวณ TDEE ด้วยสูตร **Mifflin-St Jeor** จาก Profile (อายุ, น้ำหนัก, ส่วนสูง, Gender)
- กำหนด Goal: ลดน้ำหนัก (-500 kcal) / Maintain / เพิ่มน้ำหนัก (+500 kcal)
- คำนวณ Macro Ratio อัตโนมัติ (Protein 30%, Carb 40%, Fat 30%)

---

## Architecture

```
[ESP32-C3 + Load Cell/HX711]
         |
         | BLE GATT → ส่งน้ำหนักผ่าน Bluetooth
         |
   [Mobile App]                          [Web App]
   feedme-andriod / feedme-ios           feedme-website
   React Native (Expo SDK 54)            Next.js 16 + React
         |                                     |
         +──────────────────────────────────────+
                          |
                   [Supabase Backend]
                   - PostgreSQL (Auth, DB, RLS)
                   - Realtime subscriptions
                   - Storage (food photos)
                   
                   [USDA Food Data Central API]
                   - 1M+ food items
                   
                   [AI Vision API] (TBD: Gemini / GPT-4o)
                   - Food photo → calorie estimation
```

---

## Platform Strategy

| Platform | โฟลเดอร์ | Priority |
|----------|---------|----------|
| Web App | `feedme-website` | ✅ Phase 1 (เริ่มก่อน) |
| Android | `feedme-andriod` | 🔄 Phase 2 (BLE Testing) |
| iOS | `feedme-ios` | ⏳ Phase 3 |

---

## Unique Selling Points

1. **IoT + Mobile Integration** — ตาชั่งส่งน้ำหนักตรงมาแอพ (ไม่ต้องพิมพ์)
2. **AI Photo Analysis** — ถ่ายรูปอาหารแล้วรู้โภชนาการทันที
3. **True Net Calorie** — รวม Workout calorie burned
4. **Thai Food Support** — รองรับอาหารไทย (Thai FCD database - future)
