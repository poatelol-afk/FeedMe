// ═══════════════════════════════════════════════════════
//  FeedMe — Type Definitions
// ═══════════════════════════════════════════════════════

// ── User & Profile ──────────────────────────────────────

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

// ── Food ────────────────────────────────────────────────

export interface FoodItem {
  id: number;
  name: string;
  emoji: string;
  kcal: number;      // per 100g
  protein: number;
  carbs: number;
  fat: number;
  category: string;
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

// ── Workout ─────────────────────────────────────────────

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

// ── Shop ────────────────────────────────────────────────

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

// ── Gamification ────────────────────────────────────────

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

// ── App State ───────────────────────────────────────────

export interface AppState {
  profile: UserProfile | null;
  goal: NutritionGoal | null;
  diary: DiaryEntry[];
  workouts: WorkoutEntry[];
  coins: number;
  streak: StreakData;
  quests: Quest[];
  purchases: PurchaseRecord[];
}

export interface MacroTotals {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

// ── Scale / Weight Log ───────────────────────────────

/** Reading received from a hardware weighing scale */
export interface WeightLog {
  id: string;
  weightKg: number;       // kg with 1 decimal precision
  bmi?: number;           // calculated from profile height
  deviceId?: string;      // e.g. "scale-01" from hardware
  source: 'manual' | 'scale'; // how the reading was recorded
  measuredAt: string;     // ISO string
}

/** Summary stats for the weight history section */
export interface WeightStats {
  latest: number | null;
  change7d: number | null;   // kg change vs 7 days ago (negative = lost)
  change30d: number | null;
  bmi: number | null;
}
