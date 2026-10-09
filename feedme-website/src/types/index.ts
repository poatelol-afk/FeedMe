// =================================================================
//  FeedMe — Type Definitions
// =================================================================

// ── User & Profile ───────────────────────────────────────────────

export interface UserProfile {
  age: number;
  gender: 'male' | 'female';
  weight: number;   // kg
  height: number;   // cm
  activity: number; // multiplier (1.2 – 1.9)
}

export interface NutritionGoal {
  tdee: number;
  protein: MacroGoal;
  carbs: MacroGoal;
  fat: MacroGoal;
}

export interface MacroGoal {
  pct: number;
  g: number;
  kcal: number;
}

// ── Food ─────────────────────────────────────────────────────────

export interface FoodItem {
  id: number;
  name: string;
  emoji: string;
  kcal: number;      // per 100g
  protein: number;
  carbs: number;
  fat: number;
  category: string;
  brand?: string;
  source?: 'static' | 'usda';
  portions?: FoodPortion[];
}

export interface FoodPortion {
  label: string;
  grams: number;
}

export interface DiaryEntry {
  id: string;
  foodName: string;
  emoji: string;
  weight: number;    // grams
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: string; // ISO string
}

// ── AI Food Scanner ──────────────────────────────────────────────

export interface AIScanResult {
  foodName: string;
  emoji: string;
  confidence: number;
  weight: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  tips?: string;
}

// ── Workout ──────────────────────────────────────────────────────

export interface WorkoutType {
  id: string;
  name: string;
  emoji: string;
  coinsPerMinute: number; // coins earned per minute
  caloriesPerMinute: number;
  category: 'cardio' | 'strength' | 'flexibility' | 'sports';
}

export interface WorkoutEntry {
  id: string;
  workoutId: string;
  workoutName: string;
  emoji: string;
  duration: number;   // minutes
  coinsEarned: number;
  caloriesBurned: number;
  timestamp: string;
}

// ── Workout Preset Plans ─────────────────────────────────────────

export interface PresetExercise {
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  subtitle: string;
  goal: 'fat_loss' | 'muscle_gain' | 'maintain';
  mode: 'gym' | 'home' | 'cardio';
  durationMin: number;
  met: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  emoji: string;
  description: string;
  exercises: PresetExercise[];
}

// ── Water & Supplement Tracker ───────────────────────────────────

export interface WaterEntry {
  id: string;
  amountMl: number;
  timestamp: string;
}

export interface SupplementItem {
  id: string;
  name: string;
  dose: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'bedtime';
  emoji: string;
  taken: boolean;
  lastTakenAt?: string;
}

// ── Shop ─────────────────────────────────────────────────────────

export interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  coinPrice: number;
  calories: number;
  category: 'junk' | 'snack' | 'drink' | 'dessert' | 'healthy';
  isPurchased?: boolean;
}

export interface PurchaseRecord {
  id: string;
  itemId: string;
  itemName: string;
  coinSpent: number;
  timestamp: string;
}

// ── Gamification ─────────────────────────────────────────────────

export interface Quest {
  id: string;
  title: string;
  description: string;
  emoji: string;
  target: number;       // e.g. 5 workouts
  progress: number;
  reward: number;        // coins
  type: 'workout' | 'food' | 'streak' | 'shop';
  isCompleted: boolean;
  expiresAt: string;     // ISO string (end of week)
}

export interface StreakData {
  current: number;       // consecutive days
  longest: number;
  lastActiveDate: string; // YYYY-MM-DD
}

// ── App State ────────────────────────────────────────────────────

export interface AppState {
  profile: UserProfile | null;
  goal: NutritionGoal | null;
  diary: DiaryEntry[];
  workouts: WorkoutEntry[];
  coins: number;
  streak: StreakData;
  quests: Quest[];
  purchases: PurchaseRecord[];
  calorieTrend: CalorieTrendPoint[];
  waterGoal: number;
  waterToday: number;
  waterEntries: WaterEntry[];
  supplements: SupplementItem[];
}

export interface MacroTotals {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface CalorieTrendPoint {
  date: string;
  label: string;
  kcal: number;
}

// ── Scale / Weight Log ───────────────────────────────────────────

export interface WeightLog {
  id: string;
  weightKg: number;
  bmi?: number;
  deviceId?: string;
  source: 'manual' | 'scale';
  measuredAt: string;
}

export interface WeightStats {
  latest: number | null;
  change7d: number | null;
  change30d: number | null;
  bmi: number | null;
}
