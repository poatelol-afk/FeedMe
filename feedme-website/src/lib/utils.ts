// ═══════════════════════════════════════════════════════
//  FeedMe — Utility Functions
// ═══════════════════════════════════════════════════════

import { DiaryEntry, MacroTotals, NutritionGoal, UserProfile, WorkoutEntry } from '@/types';

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
  const fatKcal      = tdee * 0.30;

  return {
    tdee,
    protein: { pct: 30, g: Math.round(proteinKcal / 4), kcal: Math.round(proteinKcal) },
    carbs:   { pct: 40, g: Math.round(carbsKcal / 4),   kcal: Math.round(carbsKcal) },
    fat:     { pct: 30, g: Math.round(fatKcal / 9),      kcal: Math.round(fatKcal) },
  };
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
