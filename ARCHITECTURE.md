# 🏗️ FeedMe — System Architecture & Data Flow

This document details the architectural boundaries, hardware-to-software protocols, database schema, and data flows across the entire **FeedMe** ecosystem.

---

## 1. High-Level System Topology

```mermaid
flowchart TD
    subgraph IoT_Hardware ["Hardware Layer (ESP32-C3)"]
        LC["HX711 Load Cell"] --> MCU["ESP32 Microcontroller"]
        BTN_T["Tare Button (GPIO 5)"] --> MCU
        BTN_S["Send Button (GPIO 4)"] --> MCU
    end

    subgraph Client_Applications ["Client Application Layer"]
        WEB["Next.js 16 Web Dashboard\n(Desktop / Tablet)"]
        APP_A["Expo React Native Android\n(Native BLE Client)"]
        APP_I["Expo React Native iOS\n(Native BLE Client)"]
    end

    subgraph Backend_Cloud ["Backend & Services Layer"]
        API["Next.js Route Handlers\n(/api/scale/reading)"]
        SB[("Supabase PostgreSQL\n(Profiles, Diets, Workouts)")]
        AI["Google Gemini Vision API\n(Food Recognition Engine)"]
    end

    MCU -- "BLE GATT Notification\n(Service: 4fafc201...)" --> APP_A
    MCU -- "BLE GATT Notification\n(Service: 4fafc201...)" --> APP_I
    MCU -. "Web Bluetooth (Chrome)" .-> WEB
    MCU -- "Wi-Fi HTTP POST (192.168.x.x)" --> API

    API --> SB
    WEB <--> SB
    APP_A <--> SB
    APP_I <--> SB

    WEB -- "Image Payload" --> AI
    APP_A -- "Image Payload" --> AI
```

---

## 2. IoT Smart Scale Communication Protocol

### A. Bluetooth Low Energy (BLE GATT)
- **Advertised Device Name:** `FeedMe Scale`
- **Primary Service UUID:** `4fafc201-1fb5-459e-8fcc-c5c9c331914b`
- **Weight Characteristic UUID:** `beb5483e-36e1-4688-b7f5-ea07361b26a8`
- **Properties:** Read, Notify
- **Packet Structure (JSON Base64 Encoded):**
```json
{
  "weight": 185.5,
  "unit": "g"
}
```

### B. Wi-Fi Fallback API Endpoint
- **Endpoint:** `POST /api/scale/reading`
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "device_id": "scale-01",
  "weight_kg": 0.185,
  "stable": true
}
```
- **Response:**
```json
{
  "status": "success",
  "logged_at": "2026-10-10T00:25:00Z",
  "bmi": 21.4
}
```

---

## 3. Database Entity Relationship Diagram (Supabase PostgreSQL)

```mermaid
erDiagram
    PROFILES ||--o{ DIARY_ENTRIES : logs
    PROFILES ||--o{ WORKOUT_ENTRIES : records
    PROFILES ||--o{ WEIGHT_LOGS : tracks
    PROFILES ||--|| NUTRITION_GOALS : defines
    PROFILES ||--o{ USER_QUESTS : completes

    PROFILES {
        uuid id PK
        string full_name
        float height_cm
        float current_weight_kg
        int energy_coins
        int current_streak
        timestamp created_at
    }

    NUTRITION_GOALS {
        uuid id PK
        uuid user_id FK
        int target_calories
        int protein_g
        int carbs_g
        int fat_g
        int water_ml
    }

    DIARY_ENTRIES {
        uuid id PK
        uuid user_id FK
        string meal_type
        string food_name
        float portion_g
        int calories
        float protein
        float carbs
        float fat
        string source
        date entry_date
    }

    WORKOUT_ENTRIES {
        uuid id PK
        uuid user_id FK
        string workout_type
        string exercise_name
        int sets
        int reps
        float weight_kg
        int rpe
        int duration_minutes
        int calories_burned
        date entry_date
    }

    WEIGHT_LOGS {
        uuid id PK
        uuid user_id FK
        string device_id
        float weight_kg
        float bmi
        timestamp recorded_at
    }
```

---

## 4. AI Engine Pipelines

### 1. Multimodal Meal Scanner Pipeline
1. **Capture:** User uploads or photographs a plate from web or mobile camera.
2. **Preprocessing:** Image resized to max 1280px width, converted to base64.
3. **Inference:** Sent to `gemini-1.5-flash` / `gemini-2.0-flash` with structured system prompt for food portion and macronutrient estimation.
4. **Correction:** User adjusts the estimated weight or accepts IoT scale weight.
5. **Ingestion:** Entry inserted into `diary_entries`.

### 2. Progressive Overload Workout Engine
1. **History Retrieval:** Fetch previous 4 sessions of the exercise (e.g., Incline Dumbbell Press).
2. **Calculation:**
   - If user completes all target sets with `RPE <= 8` $\rightarrow$ Recommend $+2.5 \text{ kg}$ next session.
   - If user achieves lower reps with `RPE >= 9.5` $\rightarrow$ Maintain weight, suggest deload or volume consolidation.
3. **Volume Load Tracking:** Compute $\sum (\text{sets} \times \text{reps} \times \text{weight})$ and visualize weekly strength trajectory.
