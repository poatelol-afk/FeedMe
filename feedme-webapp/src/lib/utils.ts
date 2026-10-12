// ═══════════════════════════════════════════════════════
//  FeedMe — Utility Functions (Expo Mobile/Web)
// ═══════════════════════════════════════════════════════

import type { DiaryEntry, MacroTotals, NutritionGoal, UserProfile, WorkoutEntry } from '../types/index.ts';

/** Generate a short unique ID */
export function genId(): string {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

/** Format a Date as YYYY-MM-DD using its local calendar date. */
export function localDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Get today's date as YYYY-MM-DD in LOCAL timezone (not UTC) */
export function todayKey(): string {
  return localDateKey(new Date());
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

  const bmr = gender === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  const tdee = Math.round(bmr * activity);

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
 * Compute Progressive Overload from actual lifted set weights (not static defaultWeight).
 */
export function computeProgressiveOverload(
  sets: Array<{ weight?: string | number; weightKg?: number; reps?: string | number; rpe?: string | number }>,
  targetReps: number,
  fallbackWeight: number
): {
  totalVolume: number;
  avgRpe: number;
  maxWeight: number;
  shouldIncrease: boolean;
  nextWeight: number;
} {
  if (!sets || sets.length === 0) {
    return {
      totalVolume: 0,
      avgRpe: 8,
      maxWeight: fallbackWeight,
      shouldIncrease: false,
      nextWeight: fallbackWeight,
    };
  }

  let totalVolume = 0;
  let rpeSum = 0;
  let maxWeight = 0;
  let allMetTargetReps = true;

  for (const s of sets) {
    const w = typeof s.weightKg === 'number' ? s.weightKg : parseFloat(String(s.weight ?? fallbackWeight)) || 0;
    const r = typeof s.reps === 'number' ? s.reps : parseInt(String(s.reps ?? 0), 10) || 0;
    const rpe = typeof s.rpe === 'number' ? s.rpe : parseFloat(String(s.rpe ?? 8)) || 8;

    totalVolume += w * r;
    rpeSum += rpe;
    if (w > maxWeight) maxWeight = w;
    if (r < targetReps) allMetTargetReps = false;
  }

  const effectiveMax = maxWeight > 0 ? maxWeight : fallbackWeight;
  const avgRpe = +(rpeSum / sets.length).toFixed(1);
  const shouldIncrease = allMetTargetReps && avgRpe <= 8;
  const nextWeight = shouldIncrease ? +(effectiveMax + 2.5).toFixed(1) : effectiveMax;

  return {
    totalVolume: Math.round(totalVolume),
    avgRpe,
    maxWeight: effectiveMax,
    shouldIncrease,
    nextWeight,
  };
}

/** Calculate RPG Fitness Level & Title */
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
