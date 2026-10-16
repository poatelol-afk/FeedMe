# FeedMe - Implementation Plan
> Updated: September 2026 | All-in-One Health & Fitness App
> อ้างอิงจาก FeedMe_Plan.md และ Tech_Stack.md

---

## สถานะปัจจุบัน (Audit)

### feedme-website (Next.js 16 + Supabase)
- STATUS: ✅ โครงสร้างพร้อมแล้ว — กำลัง Phase 1
- มี: Auth, Dashboard shell, Food Log (USDA search), Workout Form, Shop, BLE Web
- มี: Net Calorie Balance, Workout Preset Plans (MET calculation), Water Tracker, Supplement Tracker, AI Food Photo Scanner

### feedme-andriod (React Native Expo SDK 54)
- STATUS: 🔄 โค้ดพื้นฐานพร้อม — รอ EAS Build สำหรับ BLE Testing
- มี: Screens ครบ, BleScaleCard, Supabase client, EAS config
- ขาด: Workout Presets, Water/Supplement, AI Photo feature

### feedme-ios (React Native Expo SDK 54)
- STATUS: ⏳ ยังไม่เริ่ม — รอ Phase 3

---

## DEV SETUP — Bypass Auth (ทดสอบง่าย)

เพิ่มใน `feedme-website/.env.local`:
```env
DEV_BYPASS_AUTH=true
```
ผล: เข้าทุกหน้าได้โดยไม่ต้อง Login ⚠️ ใช้เฉพาะ dev เท่านั้น!

---

## Architecture

```
[ESP32-C3 + HX711 Load Cell]
         | BLE GATT
         |
   [Mobile App]                          [Web App]
   feedme-andriod / feedme-ios           feedme-website
   (React Native + Expo SDK 54)          (Next.js 16)
         |                                     |
         +──────────────────────────────────────+
                          |
                   [Supabase Backend]
                   ptvjyexxxsfwjszdzthw.supabase.co
                   PostgreSQL + Auth + Realtime + Storage
                          |
                   [External APIs]
                   - USDA Food Data Central
                   - AI Vision API (TBD: Gemini / GPT-4o)
```

---

## Phase 1: Web App MVP (feedme-website) — Priority NOW

### 🎯 เป้าหมาย: Web App ครบทุก Feature ที่ตกลงกัน

#### Step 1.1 — Fix & Test Existing Features ✅ IN PROGRESS
- [x] DEV_BYPASS_AUTH=true เพิ่มแล้ว (ข้าม Login ได้)
- [ ] เพิ่ม USDA_API_KEY ใน .env.local → ทดสอบ Food Search
- [ ] ทดสอบ Dashboard, Food Log, Workout Form

#### Step 1.2 — Dashboard Enhancements
Feature ที่ต้องเพิ่ม:
- [x] **Net Calorie Summary** — กิน X kcal | เผา Y kcal | เหลือ Z kcal (top of dashboard)
- [x] **Calorie Trend Graph** — กราฟ 7 วัน (ใช้ Recharts หรือ Chart.js)
- [x] **Weight Progress Graph** — timeline น้ำหนักตัว
- [x] **TDEE Calculator** — คำนวณจาก Profile (Mifflin-St Jeor) แสดงบน Profile

#### Step 1.3 — Workout Preset Plans
- [x] สร้างแท็บ Preset Plans — เลือก Goal (ลดน้ำหนัก/กล้ามเนื้อ/Maintain)
- [x] Preset Plan data: ชื่อท่า, Sets, Reps, Rest time, MET value
- [x] บันทึก Session → คำนวณ kcal burned → update net calorie

MET Values (สำหรับคำนวณ):
```
Running: 8.0 | Cycling: 6.0 | Weight Training: 5.0
Walking: 3.5 | Yoga: 3.0 | HIIT: 8.5 | Swimming: 6.0
```

#### Step 1.4 — Water + Supplement Tracker
- [x] **Water Tracker UI:** ปุ่ม +150ml / +250ml / +500ml + Custom input + Daily goal bar
- [x] **Supplement Logger:** เพิ่มรายการ (ชื่อ, dose, เวลา) + ประวัติวันนี้
- [x] เพิ่ม LocalStorage & Supabase fallback: `water_entries`, `supplements`

#### Step 1.5 — AI Food Photo (Mock Version)
UI เต็มก่อน → เชื่อม API จริงทีหลัง:
- [x] ปุ่ม "📷 ถ่ายรูปอาหาร (AI Photo Scan)" บนหน้า Log
- [x] Upload รูป / เลือกเมนูยอดนิยม → แสดง Loading & Scanning Laser → โชว์ผล AI วิเคราะห์ (ชื่ออาหาร + kcal)
- [x] ปรับ Portion ขนาดเสิร์ฟ → กด "Add to Diary" บันทึกเข้ามื้ออาหารทันที

#### Step 1.6 — Notifications (Browser)
- [ ] Web Notification API สำหรับ Reminder
- [ ] ตั้งเวลาเตือน: กินอาหาร, ออกกำลังกาย, ดื่มน้ำ

---

## Phase 2: Android App (feedme-andriod) — BLE Testing

### 🎯 เป้าหมาย: APK ที่ทดสอบ BLE กับ ESP32-C3 ได้

#### Step 2.1 — EAS Build
```bash
cd "c:\Users\poate\OneDrive\เอกสาร\FeedMe\feedme-andriod"
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```
- ผลลัพธ์: ไฟล์ .apk → ติดตั้งบน Android จริง

#### Step 2.2 — ทดสอบ BLE
1. แฟลชโค้ดลง ESP32-C3 (`Hardware/Hardware_Scale.ino`)
2. เปิด FeedMe Android → กด "Connect Scale"
3. เลือก BLE device → รับน้ำหนัก → บันทึก

#### Step 2.3 — Sync Features จาก Web
- [ ] Copy Workout Preset Plans
- [ ] Add Water + Supplement Tracker screens
- [ ] AI Food Photo (Mock)

---

## Phase 3: iOS + AI Integration

#### Step 3.1 — เลือก AI Vision API
| API | ข้อดี | ข้อเสีย |
|-----|-------|---------|
| Gemini Vision | รองรับภาษาไทย, ราคาถูก, Google Cloud | ใหม่กว่า |
| GPT-4o Vision | แม่นยำสูง, ecosystem ใหญ่ | ราคาสูงกว่า |
| Logmeal API | เชี่ยวชาญ Food Recognition | subscription-based |

#### Step 3.2 — iOS Build
```bash
cd "c:\Users\poate\OneDrive\เอกสาร\FeedMe\feedme-ios"
eas build --platform ios --profile preview
```

#### Step 3.3 — Thai Food Database
- Integration กับ Thai Food Composition Database (INMU/Mahidol)

---

## Shared Code (iOS ↔ Android)

ใช้ร่วมกันระหว่าง `feedme-andriod` และ `feedme-ios`:

| ไฟล์ | หน้าที่ |
|------|---------|
| `src/lib/supabase/client.ts` | Supabase session |
| `src/lib/db.ts` | Database queries |
| `src/lib/theme.ts` | Design tokens |
| `src/lib/food-data.ts` | Static food fallback |
| `src/lib/utils.ts` | TDEE, MET calculations |
| `src/types/index.ts` | TypeScript types |
| `src/components/BleScaleCard.tsx` | BLE component |

---

## Feature Priority Matrix

| Feature | Impact | Effort | Priority |
|---------|--------|--------|----------|
| USDA Food Search | High | Done ✅ | P0 — ทดสอบให้ผ่าน |
| Net Calorie Dashboard | High | Low | P1 |
| Workout Preset Plans | High | Medium | P1 |
| Water Tracker | Medium | Low | P1 |
| Supplement Tracker | Medium | Low | P1 |
| Calorie Trend Graph | High | Medium | P2 |
| AI Food Photo (Mock) | High | Medium | P2 |
| EAS Android Build | High | Low | P2 |
| AI Food Photo (Real API) | High | High | P3 |
| iOS Build | Medium | Low | P3 |
| Thai Food Database | Medium | High | P4 |
| Push Notifications (Mobile) | Medium | Medium | P3 |

---

## Supabase Tables ที่ต้องเพิ่ม

```sql
-- Water intake tracking
CREATE TABLE water_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  amount_ml INTEGER NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Supplement tracking
CREATE TABLE supplement_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  dose TEXT,
  unit TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own water_logs" ON water_logs
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own supplement_logs" ON supplement_logs
  USING (auth.uid() = user_id);
```

