# 🏗️ FeedMe 2.0 — System Architecture & Data Flow

This document defines the architecture, hardware-to-mobile communication protocols, database schema, and AI pipelines for **FeedMe 2.0** across its three core pillars: **`feedme-mobile` (Flutter)**, **`feedme-website` (Next.js 16 Promo Site)**, and **`feedme-hardware` (ESP32-C3 Smart Scale)**.

---

## 1. High-Level System Topology

```mermaid
flowchart TD
    subgraph IoT_Hardware ["feedme-hardware (ESP32-C3 Smart Scale)"]
        LC["HX711 Load Cell"] --> MCU["ESP32-C3 Microcontroller"]
        BTN_T["Tare Button (GPIO 5)"] --> MCU
        BTN_S["Send Button (GPIO 4)"] --> MCU
    end

    subgraph Mobile_Client ["feedme-mobile (Flutter: Android & iOS)"]
        TAB_HOME["1. Home & Net Calorie Balance"]
        TAB_KITCHEN["2. Smart Kitchen & AI Chef"]
        TAB_WORKOUT["3. Run (GPS) & Lift (Weights)"]
        TAB_LEAGUE["4. Weekly League & Friend Party Quests"]
        TAB_PROFILE["5. Profile & Gem Shop"]
    end

    subgraph Promo_Web ["feedme-website (Next.js 16 Showcase :3000)"]
        LANDING["Gamified Product Landing Page\n(Interactive Preview & APK Download)"]
    end

    subgraph Cloud_Backend ["Supabase & Google Gemini AI"]
        SB[("Supabase PostgreSQL + Auth + Realtime\n(Users, Meals, Runs, Lifts, Leagues, Parties)")]
        AI["Google Gemini 2.5 Flash API\n(Meal Photo Vision & Recipe Chef)"]
        OSM["OpenStreetMap Tile Server\n(GPS Route Rendering)"]
    end

    MCU -- "BLE GATT Notification\n(flutter_blue_plus)" --> TAB_KITCHEN
    TAB_KITCHEN -- "Photo / Fridge Ingredients" --> AI
    TAB_WORKOUT -- "GPS Coordinates" --> OSM
    Mobile_Client <--> SB
    LANDING -. "Directs Users to Download APK / iOS" .-> Mobile_Client
```

---

## 2. IoT Smart Scale BLE Protocol (`feedme-hardware` $\leftrightarrow$ `feedme-mobile`)

The Flutter app connects directly to the ESP32-C3 kitchen scale via Bluetooth Low Energy (`flutter_blue_plus`), eliminating manual gram entry when cooking at home.

- **Advertised Device Name:** `FeedMe Scale`
- **Primary Service UUID:** `4fafc201-1fb5-459e-8fcc-c5c9c331914b`
- **Weight Characteristic UUID:** `beb5483e-36e1-4688-b7f5-ea07361b26a8`
- **Properties:** `READ`, `NOTIFY`
- **Payload Structure (UTF-8 JSON):**
```json
{
  "weight": 185.5,
  "unit": "g",
  "stable": true
}
```
- **Hardware Pinout (ESP32-C3):**
  - `HX711 DOUT`: GPIO 19
  - `HX711 SCK`: GPIO 18
  - `TARE Button`: GPIO 5 (Zeroes out bowl/plate weight)
  - `SEND Button`: GPIO 4 (Locks current ingredient weight into the Flutter cooking bowl)

---

## 3. Database Entity Relationship Diagram (Supabase PostgreSQL)

```mermaid
erDiagram
    PROFILES ||--|| NUTRITION_GOALS : defines
    PROFILES ||--o{ DIARY_ENTRIES : logs_food
    PROFILES ||--o{ CARDIO_SESSIONS : tracks_gps_runs
    PROFILES ||--o{ WORKOUT_SESSIONS : logs_weight_training
    PROFILES ||--o{ LEAGUE_MEMBERSHIPS : competes_in
    PROFILES ||--o{ PARTY_PARTICIPANTS : joins_coop

    PROFILES {
        uuid id PK
        string username
        string avatar_url
        float height_cm
        float current_weight_kg
        int gems
        int total_xp
        int weekly_xp
        int current_streak
        int streak_freezes
        timestamp created_at
    }

    NUTRITION_GOALS {
        uuid id PK
        uuid user_id FK
        int target_daily_calories
        int protein_g
        int carbs_g
        int fat_g
    }

    DIARY_ENTRIES {
        uuid id PK
        uuid user_id FK
        string meal_type
        string food_name
        float portion_g
        int calories
        float protein_g
        float carbs_g
        float fat_g
        string log_source "ai_photo | smart_scale | recipe_chef | quick_text"
        date entry_date
    }

    CARDIO_SESSIONS {
        uuid id PK
        uuid user_id FK
        string activity_type "run | walk | cycle"
        float distance_km
        int duration_seconds
        string avg_pace
        jsonb route_coordinates
        int calories_burned
        int xp_earned
        timestamp completed_at
    }

    WORKOUT_SESSIONS {
        uuid id PK
        uuid user_id FK
        string program_name "Push Day | Full Body | Expert Plan"
        int duration_minutes
        float total_volume_kg
        jsonb exercises_sets_json
        int calories_burned
        int xp_earned
        timestamp completed_at
    }

    LEAGUE_MEMBERSHIPS {
        uuid id PK
        uuid user_id FK
        string league_tier "Bronze | Silver | Gold | Emerald | Diamond"
        string week_key "2026-W42"
        int weekly_xp
    }

    PARTY_QUESTS ||--o{ PARTY_PARTICIPANTS : includes
    PARTY_QUESTS {
        uuid id PK
        string title "แก๊งหมูกระทะ vs บอสไขมันทรานส์"
        string quest_type "on_demand_coop | special_event"
        int target_calories_burn
        int current_calories_burn
        timestamp ends_at
    }

    PARTY_PARTICIPANTS {
        uuid id PK
        uuid party_id FK
        uuid user_id FK
        int contributed_calories
        int contributed_xp
    }
```

---

## 4. Core Calculation & AI Pipelines

### 1. Real-Time Net Calorie Balance Engine
Every meal logged and every workout completed updates the daily equation on the Home tab:
$$\text{Net Calories} = \sum \text{Calories Consumed} - \left(\sum \text{Cardio Burned} + \sum \text{Weight Training Burned}\right)$$
$$\text{Remaining Calorie Quota} = \text{Target Daily TDEE} - \text{Net Calories}$$

### 2. Multimodal AI Food Scanner & "What Should I Cook?" Chef
- **Meal Photo Analysis:** Flutter captures/compresses the food image and sends it to `gemini-2.5-flash` with a structured JSON schema request, returning `dish_name`, `estimated_grams`, `calories`, `protein_g`, `carbs_g`, `fat_g`, and a fun gamified tip.
- **Smart Recipe Generator:** Takes the user's `Remaining Calorie Quota` (e.g., 650 kcal left, needs 40g protein) and optional fridge ingredients, returning 3 step-by-step recipes that can be cooked immediately with the BLE Smart Scale.

### 3. Run (GPS) & Lift (Weight Training) Burn & XP Engine
- **GPS Cardio:** Samples device GPS coordinates via `geolocator`, computes Haversine distance ($\text{km}$), pace ($\text{min/km}$), and active calories via $\text{kcal} = \text{MET} \times \text{Weight (kg)} \times \text{Duration (hr)}$.
- **Weight Training:** Tracks sets, reps, and weight ($\text{kg}$). Calculates session volume ($\sum \text{sets} \times \text{reps} \times \text{weight}$), estimates active calorie burn based on workout duration and intensity, checks for Progressive Overload records, and awards XP toward the user's Weekly League and active Party Quest.
