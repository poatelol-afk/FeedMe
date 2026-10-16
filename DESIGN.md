# Design System

<!-- impeccable:design-tokens 1 -->

## Design Philosophy: Duolingo Tactile 3D × Strava Athletic HUD

FeedMe fuses the approachable, gamified tactile design language of Duolingo with the focused, high-contrast clarity of Strava's athletic performance interface.

### Principles

1. **Physical Tactility (3D Press Feedback):**
   Buttons and interactive cards carry physical depth through distinct bottom offset shadows (`0 4px 0 <colorShadow>`). Pressing an element physically translates it downward by 2–4px with zero-delay haptic response.
2. **Confident Solid Hierarchy (No AI Slop):**
   Headlines lead directly with bold, purposeful scale and weight. We refuse gradient text, generic floating badges, and eyebrow kickers. Emphasis comes from typographic scale and intentional solid color contrast.
3. **Non-Punishing Playfulness:**
   Exceeding calorie quotas triggers encouraging, constructive suggestions (a brisk 15-minute walk or a Cheat Meal Pass) styled in warm orange and feather green rather than punitive crimson alerts.
4. **Athletic Dark Precision:**
   Dark slate grounds (`#131F24`) provide power efficiency and high visibility during workouts, while luminous accents indicate status at a glance.

---

## Color Tokens

| Token Name | Hex | Semantic Role |
|---|---|---|
| `canvas` / `canvasDark` | `#131F24` | Primary app and dark showcase canvas ground |
| `card` / `surfaceCard` | `#1F2F36` | Elevated cards, dialogs, and navigation containers |
| `cardBorder` / `surfaceCardStroke` | `#2B3E47` | Subtle 1.5–2px structural dividers and card borders |
| `featherGreen` | `#58CC02` | Primary brand action, completed quests, promotions |
| `featherGreenShadow` | `#46A302` | 3D depth shadow for primary buttons |
| `cardioOrange` | `#FF9600` | Running cardio, burn stats, daily streak fire |
| `cardioOrangeShadow` | `#CC7800` | 3D depth shadow for cardio buttons |
| `liftPurple` / `gemPurple` | `#CE82FF` | Weight training, Boss Raid, Duolingo Gems |
| `kitchenCyan` / `cardioBlue` | `#1CB0F6` | AI food scanning, BLE smart scale, water/hydration |
| `leagueGold` / `lightningYellow` | `#FFC800` | Weekly Emerald League, XP counters, trophies |
| `coralRed` / `flameRed` | `#FF4B4B` | Demotion warnings, active boss attacks, reset actions |
| `textPrimary` | `#FFFFFF` | Primary headings, active metrics (Contrast: 15.8:1) |
| `textSecondary` | `#94A3B8` | Subheadings, card descriptions (Contrast: 6.2:1) |
| `textMuted` | `#64748B` | Labels, timestamps, inactive icons (Contrast: 4.8:1) |

---

## Typography

- **Font Family:** `Prompt`, `Plus Jakarta Sans`, sans-serif
- **Numerics:** `font-variant-numeric: tabular-nums` for timers, paces, weights, and calories.
- **Scale:**
  - Hero Display: 40–56px, `font-weight: 900`
  - Section Headings: 20–24px, `font-weight: 800`
  - Card Titles: 16–18px, `font-weight: 700`
  - Body: 14–15px, `font-weight: 500`, line-height: 1.5
  - Captions & Meta: 11–13px, `font-weight: 600`

---

## Motion & Transitions

- **Button Press:** 60ms spring down on `onTapDown` / `:active`.
- **Tab & Mode Transitions:** 180ms `ease-out-cubic`.
- **Metric Increments:** Smooth numerical count-up on XP and Gem rewards.
