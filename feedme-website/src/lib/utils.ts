// ═══════════════════════════════════════════════════════
//  FeedMe — Utility Functions
// ═══════════════════════════════════════════════════════

import type { DiaryEntry, MacroTotals, NutritionGoal, UserProfile, WeightLog, WeightStats, WorkoutEntry } from '../types/index.ts';

/** Generate a short unique ID */
export function genId(): string {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

/** Get today's date as YYYY-MM-DD in LOCAL timezone (not UTC) */
export function todayKey(): string {
  return localDateKey(new Date());
}

/** Format a Date as YYYY-MM-DD using its local calendar date. */
export function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** UTC ISO instants that enclose one local calendar day. */
export function localDayBounds(d = new Date()): { start: string; end: string } {
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

/** Get yesterday's date as YYYY-MM-DD in LOCAL timezone */
export function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return localDateKey(d);
}

/** Format a number with locale (e.g. 1,234) */
export function formatNumber(n: number): string {
  return Math.round(n).toLocaleString();
}

/**
 * Calculate TDEE using Mifflin-St Jeor equation.
 * Returns { tdee, protein, carbs, fat } as NutritionGoal.
 */
export function calculateGoal(profile: UserProfile): NutritionGoal {
  const { age, gender, weight, height, activity } = profile;

  // BMR (Mifflin-St Jeor)
  const bmr = gender === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  const tdee = Math.round(bmr * activity);

  // Macro split: 30% protein, 40% carbs, 30% fat
  const proteinKcal = tdee * 0.30;
  const carbsKcal   = tdee * 0.40;
  const fatKcal     = tdee * 0.30;

  return {
    tdee,
    protein: { pct: 30, g: Math.round(proteinKcal / 4), kcal: Math.round(proteinKcal) },
    carbs:   { pct: 40, g: Math.round(carbsKcal / 4),   kcal: Math.round(carbsKcal) },
    fat:     { pct: 30, g: Math.round(fatKcal / 9),     kcal: Math.round(fatKcal) },
  };
}

/** Calculate Body Mass Index (BMI) rounded to 1 decimal place */
export function calculateBmi(weightKg: number, heightCm: number): number | null {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  return +(weightKg / (heightM * heightM)).toFixed(1);
}

/**
 * Compute latest weight, BMI, and 7-day / 30-day weight deltas from actual history.
 * Returns null for change7d / change30d if insufficient historical entries exist.
 */
export function computeWeightDeltas(history: WeightLog[], now = new Date()): WeightStats {
  if (!history || history.length === 0) {
    return { latest: null, change7d: null, change30d: null, bmi: null };
  }

  const sorted = [...history].sort(
    (a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime()
  );
  const latestEntry = sorted[sorted.length - 1];
  const latest = latestEntry.weightKg;
  const bmi = latestEntry.bmi ?? null;

  if (sorted.length < 2) {
    return { latest, change7d: null, change30d: null, bmi };
  }

  const nowMs = now.getTime();
  const sixDaysAgoMs = nowMs - 6 * 24 * 60 * 60 * 1000;
  const twentyFiveDaysAgoMs = nowMs - 25 * 24 * 60 * 60 * 1000;

  // Find closest entry on or before ~7 days ago (at least 6 days old), or fallback if none
  let ref7d: WeightLog | null = null;
  for (let i = sorted.length - 2; i >= 0; i--) {
    const t = new Date(sorted[i].measuredAt).getTime();
    if (t <= sixDaysAgoMs) {
      ref7d = sorted[i];
      break;
    }
  }
  if (!ref7d) {
    ref7d = sorted[0];
  }

  // Find closest entry on or before ~30 days ago, or oldest entry
  let ref30d: WeightLog | null = null;
  for (let i = sorted.length - 2; i >= 0; i--) {
    const t = new Date(sorted[i].measuredAt).getTime();
    if (t <= twentyFiveDaysAgoMs) {
      ref30d = sorted[i];
      break;
    }
  }
  if (!ref30d) {
    ref30d = sorted[0];
  }

  const change7d = ref7d ? +(latest - ref7d.weightKg).toFixed(1) : null;
  const change30d = ref30d ? +(latest - ref30d.weightKg).toFixed(1) : null;

  return { latest, change7d, change30d, bmi };
}

/** Calculate RPG Fitness Level & Title from streak, completed quests, and workouts */
export function calculateFitnessLevel(
  streakDays: number,
  completedQuests: number,
  workoutCount: number
): { level: number; title: string; xp: number; nextLevelXp: number } {
  const xp = Math.max(0, streakDays * 40 + completedQuests * 35 + workoutCount * 50);
  const tiers = [
    { level: 1, title: 'Rookie', minXp: 0, nextXp: 150 },
    { level: 2, title: 'Starter', minXp: 150, nextXp: 350 },
    { level: 3, title: 'Active', minXp: 350, nextXp: 600 },
    { level: 4, title: 'Fit', minXp: 600, nextXp: 1000 },
    { level: 5, title: 'Pro Athlete', minXp: 1000, nextXp: 1500 },
  ];

  for (let i = tiers.length - 1; i >= 0; i--) {
    if (xp >= tiers[i].minXp) {
      return {
        level: tiers[i].level,
        title: tiers[i].title,
        xp,
        nextLevelXp: tiers[i].nextXp,
      };
    }
  }

  return { level: 1, title: 'Rookie', xp, nextLevelXp: 150 };
}

/** Sanitize post-login redirect path to prevent open-redirect vulnerabilities */
export function sanitizeRedirectPath(
  next: string | null | undefined,
  fallback = '/dashboard'
): string {
  if (!next || typeof next !== 'string') return fallback;
  const trimmed = next.trim();
  if (!trimmed.startsWith('/')) return fallback;
  if (trimmed.startsWith('//') || trimmed.startsWith('/\\')) return fallback;
  if (trimmed.includes('://')) return fallback;
  return trimmed;
}

/** Sum up macro totals from diary entries */
export function getTodayTotals(entries: DiaryEntry[]): MacroTotals {
  return entries.reduce(
    (acc, e) => ({
      kcal:    +(acc.kcal + (e.kcal || 0)).toFixed(1),
      protein: +(acc.protein + (e.protein || 0)).toFixed(1),
      carbs:   +(acc.carbs + (e.carbs || 0)).toFixed(1),
      fat:     +(acc.fat + (e.fat || 0)).toFixed(1),
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

/** Sum up total coins earned from today's workouts */
export function getTodayCoinsFromWorkouts(workouts: WorkoutEntry[]): number {
  return workouts.reduce((sum, w) => sum + w.coinsEarned, 0);
}

/** Get time-of-day greeting */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5)  return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/** Format date as "Monday, July 5" */
export function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
