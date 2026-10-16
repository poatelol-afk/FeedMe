# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Stack

- **Mobile App:** Flutter (Dart) native client for Android and iOS
- **Showcase Website:** Next.js 16 (App Router, React 19, Tailwind CSS, TypeScript)
- **Hardware Integration:** ESP32-C3 BLE GATT Smart Scale (Arduino C++)

## Users

Primary users are health and fitness enthusiasts, runners, lifters, and everyday individuals who want to track nutrition and exercise without the anxiety, burnout, or guilt common to traditional calorie-counting apps. They seek high dopamine feedback, consistent daily habits, and clear athletic progress.

## Product Purpose

FeedMe transforms daily nutrition and fitness management into an engaging, rewarding game. It unites:
1. **Duolingo-inspired Habit Gamification:** Streaks, Emerald League tiers, Gem Shop, and non-punishing Streak Freezes.
2. **Strava-inspired Athletic HUD:** High-contrast GPS cardio route tracking and expert weight-training loggers with automatic Progressive Overload detection.
3. **Smart Kitchen & Hardware Integration:** AI food recognition and direct BLE smart scale integration for exact gram-level macro tracking without manual entry friction.

## Positioning

Unlike conventional calorie counters that punish users when they eat over their quota, FeedMe operates on a **Non-Punishing Anti-Goal** philosophy:
- Focuses strictly on **Net Calories** (`Net = Consumed - Burned`), encouraging light physical activity (e.g. a 15-minute walk) or redeeming a **Cheat Meal Pass (`🍔`)** instead of inflicting guilt.
- Opt-in social raids (`+ ชวนเพื่อนตั้งตี้`) allow cooperative team goals without risking individual weekly league rankings.
- 100% self-contained offline simulation mode so every feature can be explored and demonstrated without mandatory external credentials or physical peripherals.

## Core Capabilities

- **Real-Time Net Calorie Balance:** Interactive hero balance engine tracking target, consumed, burned, and remaining daily calories with macro split (Protein, Carbs, Fat).
- **Smart Kitchen Suite:**
  - AI Food Scanner viewfinder with instant recognition.
  - "What Should I Cook?" chef filtering recipes dynamically based on remaining calorie quota.
  - ESP32-C3 Smart Scale BLE GATT simulator with live bowl weight accumulation and tare function.
- **Cardio & Strength Workouts:**
  - GPS route map painter with simulated run pace, distance, and calorie expenditure.
  - Weight training sets with automatic progressive overload tracking (+XP reward bonuses).
- **Gamification & Social Economy:**
  - Weekly Duolingo-style Leaderboard (Emerald League).
  - Opt-in Party Boss Raid ("แก๊งหมูกระทะ vs. บอสไขมันทรานส์") and 1-tap sticker cheer feed.
  - Gem Shop offering Streak Freezes, Cheat Meal Passes, and Double XP potions.
