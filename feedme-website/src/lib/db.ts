// =================================================================
//  FeedMe — Supabase & Local Database Layer
//  Full 9-table Supabase sync with LocalStorage offline fallback
// =================================================================

import { createClient } from '@/lib/supabase/client';
import {
  AppState, CalorieTrendPoint, DiaryEntry, NutritionGoal, PurchaseRecord,
  Quest, StreakData, SupplementItem, UserProfile, WaterEntry, WeightLog, WeightStats, WorkoutEntry,
} from '@/types';
import {
  calculateBmi, calculateGoal, computeWeightDeltas, genId, localDateKey, localDayBounds, todayKey, yesterdayKey,
} from './utils';

function sb() { return createClient(); }

// ── Local Storage Helpers (for DEV_BYPASS_AUTH / offline mode) ──
const IS_BROWSER = typeof window !== 'undefined';

function getLocal<T>(key: string, fallback: T): T {
  if (!IS_BROWSER) return fallback;
  try {
    const item = localStorage.getItem(`feedme_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (!IS_BROWSER) return;
  try {
    localStorage.setItem(`feedme_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn('[LocalStorage] save error:', e);
  }
}

// ── Profile & Goals ──────────────────────────────────────────────

const DEFAULT_PROFILE: UserProfile = {
  age: 26,
  gender: 'male',
  weight: 70,
  height: 175,
  activity: 1.55,
};

export async function saveProfile(profile: UserProfile): Promise<NutritionGoal> {
  const goal = calculateGoal(profile);
  setLocal('profile', profile);
  setLocal('goal', goal);

  try {
    const supabase = sb();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').upsert({
        user_id: user.id,
        age: profile.age,
        gender: profile.gender,
        weight: profile.weight,
        height: profile.height,
        activity: profile.activity,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      await supabase.from('nutrition_goals').upsert({
        user_id: user.id,
        tdee: goal.tdee,
        protein_pct: goal.protein.pct,
        protein_g: goal.protein.g,
        protein_kcal: goal.protein.kcal,
        carbs_pct: goal.carbs.pct,
        carbs_g: goal.carbs.g,
        carbs_kcal: goal.carbs.kcal,
        fat_pct: goal.fat.pct,
        fat_g: goal.fat.g,
        fat_kcal: goal.fat.kcal,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    }
  } catch (e) {
    console.info('[db] saveProfile using local storage fallback:', e);
  }

  return goal;
}

export async function getProfile(): Promise<UserProfile | null> {
  try {
    const supabase = sb();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data && !error) {
        const p: UserProfile = {
          age: Number(data.age),
          gender: data.gender as 'male' | 'female',
          weight: Number(data.weight),
          height: Number(data.height),
          activity: Number(data.activity),
        };
        setLocal('profile', p);
        return p;
      }
    }
  } catch {
    // fallback
  }
  return getLocal<UserProfile>('profile', DEFAULT_PROFILE);
}

export async function getGoal(): Promise<NutritionGoal | null> {
  try {
    const supabase = sb();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('nutrition_goals')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data && !error) {
        const g: NutritionGoal = {
          tdee: Number(data.tdee),
          protein: { pct: Number(data.protein_pct), g: Number(data.protein_g), kcal: Number(data.protein_kcal) },
          carbs:   { pct: Number(data.carbs_pct),   g: Number(data.carbs_g),   kcal: Number(data.carbs_kcal) },
          fat:     { pct: Number(data.fat_pct),     g: Number(data.fat_g),     kcal: Number(data.fat_kcal) },
        };
        setLocal('goal', g);
        return g;
      }
    }
  } catch {
    // fallback
  }
  const cachedGoal = getLocal<NutritionGoal | null>('goal', null);
  if (cachedGoal) return cachedGoal;

  const profile = await getProfile();
  return profile ? calculateGoal(profile) : calculateGoal(DEFAULT_PROFILE);
}

// ── Food Diary ───────────────────────────────────────────────────

export async function getTodayDiary(): Promise<DiaryEntry[]> {
  const { start, end } = localDayBounds();
  try {
    const supabase = sb();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', start)
        .lt('logged_at', end)
        .order('logged_at', { ascending: true });

      if (!error && data !== null) {
        const mapped: DiaryEntry[] = data.map(r => ({
          id: r.id,
          foodName: r.food_name,
          emoji: r.emoji,
          weight: Number(r.weight),
          kcal: Number(r.kcal),
          protein: Number(r.protein),
          carbs: Number(r.carbs),
          fat: Number(r.fat),
          timestamp: r.logged_at,
        }));
        const today = todayKey();
        const otherDays = getLocal<DiaryEntry[]>('diary_entries', []).filter(
          e => localDateKey(new Date(e.timestamp)) !== today
        );
        setLocal('diary_entries', [...mapped, ...otherDays]);
        return mapped;
      }
    }
  } catch {
    // fallback
  }

  const allLocal = getLocal<DiaryEntry[]>('diary_entries', []);
  const today = todayKey();
  return allLocal.filter(e => localDateKey(new Date(e.timestamp)) === today);
}

export async function addFoodLog(entry: Omit<DiaryEntry, 'id' | 'timestamp'>): Promise<DiaryEntry> {
  const now = new Date().toISOString();
  const newEntry: DiaryEntry = { ...entry, id: genId(), timestamp: now };

  const allLocal = getLocal<DiaryEntry[]>('diary_entries', []);
  allLocal.unshift(newEntry);
  setLocal('diary_entries', allLocal);

  try {
    const supabase = sb();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('diary_entries').insert({
        id: newEntry.id,
        user_id: user.id,
        food_name: entry.foodName,
        emoji: entry.emoji,
        weight: entry.weight,
        kcal: entry.kcal,
        protein: entry.protein,
        carbs: entry.carbs,
        fat: entry.fat,
        logged_at: now,
      });
    }
  } catch (e) {
    console.info('[db] addFoodLog fallback to local:', e);
  }

  return newEntry;
}

export async function deleteFoodLog(id: string): Promise<void> {
  const allLocal = getLocal<DiaryEntry[]>('diary_entries', []);
  setLocal('diary_entries', allLocal.filter(e => e.id !== id));

  try {
    const supabase = sb();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('diary_entries').delete().eq('id', id).eq('user_id', user.id);
    }
  } catch {
    // silent fallback
  }
}

// ── Workouts ─────────────────────────────────────────────────────

export async function getTodayWorkouts(): Promise<WorkoutEntry[]> {
  const { start, end } = localDayBounds();
  try {
    const supabase = sb();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('workout_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', start)
        .lt('logged_at', end)
        .order('logged_at', { ascending: true });

      if (!error && data !== null) {
        const mapped: WorkoutEntry[] = data.map(r => ({
          id: r.id,
          workoutId: r.workout_id,
          workoutName: r.workout_name,
          emoji: r.emoji,
          duration: Number(r.duration),
          coinsEarned: Number(r.coins_earned),
          caloriesBurned: Number(r.calories_burned),
          timestamp: r.logged_at,
        }));
        const today = todayKey();
        const otherDays = getLocal<WorkoutEntry[]>('workout_entries', []).filter(
          w => localDateKey(new Date(w.timestamp)) !== today
        );
        setLocal('workout_entries', [...mapped, ...otherDays]);
        return mapped;
      }
    }
  } catch {
    // fallback
  }

  const allWorkouts = getLocal<WorkoutEntry[]>('workout_entries', []);
  const today = todayKey();
  return allWorkouts.filter(w => localDateKey(new Date(w.timestamp)) === today);
}

export async function addWorkout(entry: Omit<WorkoutEntry, 'id' | 'timestamp'>): Promise<WorkoutEntry> {
  const now = new Date().toISOString();
  const newEntry: WorkoutEntry = { ...entry, id: genId(), timestamp: now };

  const allWorkouts = getLocal<WorkoutEntry[]>('workout_entries', []);
  allWorkouts.unshift(newEntry);
  setLocal('workout_entries', allWorkouts);

  await earnCoins(entry.coinsEarned);
  await updateStreak();
  await updateQuestProgress('workout', 1);

  try {
    const supabase = sb();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('workout_entries').insert({
        id: newEntry.id,
        user_id: user.id,
        workout_id: entry.workoutId,
        workout_name: entry.workoutName,
        emoji: entry.emoji,
        duration: entry.duration,
        coins_earned: entry.coinsEarned,
        calories_burned: entry.caloriesBurned,
        logged_at: now,
      });
    }
  } catch (e) {
    console.info('[db] addWorkout fallback to local:', e);
  }

  return newEntry;
}

// ── Water Tracking ───────────────────────────────────────────────

export async function getWaterEntries(): Promise<WaterEntry[]> {
  const all = getLocal<WaterEntry[]>('water_entries', []);
  const today = todayKey();
  return all.filter(w => localDateKey(new Date(w.timestamp)) === today);
}

export async function getTodayWater(): Promise<number> {
  const entries = await getWaterEntries();
  return entries.reduce((sum, w) => sum + w.amountMl, 0);
}

export async function addWater(amountMl: number): Promise<WaterEntry> {
  const now = new Date().toISOString();
  const entry: WaterEntry = { id: genId(), amountMl, timestamp: now };

  const all = getLocal<WaterEntry[]>('water_entries', []);
  all.unshift(entry);
  setLocal('water_entries', all);

  return entry;
}

export async function deleteWater(id: string): Promise<void> {
  const all = getLocal<WaterEntry[]>('water_entries', []);
  setLocal('water_entries', all.filter(w => w.id !== id));
}

// ── Supplement Tracking ──────────────────────────────────────────

const DEFAULT_SUPPLEMENTS: SupplementItem[] = [
  { id: 'supp-whey',     name: 'Whey Protein Isolate', dose: '1 Scoop (30g)', timeOfDay: 'morning',   emoji: '🥛', taken: false },
  { id: 'supp-creatine', name: 'Creatine Monohydrate', dose: '5g',            timeOfDay: 'morning',   emoji: '⚡', taken: false },
  { id: 'supp-vitc',     name: 'Vitamin C 1000mg',     dose: '1 Tablet',      timeOfDay: 'afternoon', emoji: '🍊', taken: false },
  { id: 'supp-omega3',   name: 'Omega-3 Fish Oil',     dose: '2 Softgels',    timeOfDay: 'evening',   emoji: '🐟', taken: false },
  { id: 'supp-mag',      name: 'Magnesium Glycinate',  dose: '200mg',         timeOfDay: 'bedtime',   emoji: '🌙', taken: false },
];

export async function getSupplements(): Promise<SupplementItem[]> {
  const saved = getLocal<SupplementItem[]>('supplements', DEFAULT_SUPPLEMENTS);
  const today = todayKey();

  return saved.map(s => {
    const isToday = s.lastTakenAt && localDateKey(new Date(s.lastTakenAt)) === today;
    return { ...s, taken: Boolean(isToday) };
  });
}

export async function toggleSupplement(id: string): Promise<SupplementItem[]> {
  const supps = await getSupplements();
  const updated = supps.map(s => {
    if (s.id === id) {
      const willBeTaken = !s.taken;
      return {
        ...s,
        taken: willBeTaken,
        lastTakenAt: willBeTaken ? new Date().toISOString() : undefined,
      };
    }
    return s;
  });
  setLocal('supplements', updated);
  return updated;
}

export async function addCustomSupplement(
  name: string, dose: string, timeOfDay: SupplementItem['timeOfDay'], emoji = '💊'
): Promise<SupplementItem[]> {
  const current = await getSupplements();
  const newItem: SupplementItem = { id: genId(), name, dose, timeOfDay, emoji, taken: false };
  const updated = [...current, newItem];
  setLocal('supplements', updated);
  return updated;
}

// ── Calorie Trend ────────────────────────────────────────────────

export async function getCalorieTrend(): Promise<CalorieTrendPoint[]> {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
  const points: CalorieTrendPoint[] = [];

  for (let offset = 0; offset < 7; offset += 1) {
    const date = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + offset);
    points.push({
      date: localDateKey(date),
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      kcal: 0,
    });
  }

  const byDate = new Map(points.map(point => [point.date, point]));

  try {
    const supabase = sb();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const startIso = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate()).toISOString();
      const { data, error } = await supabase
        .from('diary_entries')
        .select('kcal, logged_at')
        .eq('user_id', user.id)
        .gte('logged_at', startIso);

      if (!error && data !== null) {
        for (const row of data) {
          const dKey = localDateKey(new Date(row.logged_at));
          const point = byDate.get(dKey);
          if (point) point.kcal = +(point.kcal + (Number(row.kcal) || 0)).toFixed(1);
        }
        return points;
      }
    }
  } catch {
    // fallback to local
  }

  const allDiary = getLocal<DiaryEntry[]>('diary_entries', []);
  for (const row of allDiary) {
    const dKey = localDateKey(new Date(row.timestamp));
    const point = byDate.get(dKey);
    if (point) point.kcal = +(point.kcal + (Number(row.kcal) || 0)).toFixed(1);
  }

  return points;
}

// ── Gamification: Coins & Streak (Synced with user_coins & streak_data) ──

export async function getCoins(): Promise<number> {
  try {
    const supabase = sb();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('user_coins')
        .select('balance')
        .eq('user_id', user.id)
        .maybeSingle();
      if (!error && data) {
        const balance = Number(data.balance);
        setLocal('coins', balance);
        return balance;
      }
    }
  } catch {
    // fallback
  }
  return getLocal<number>('coins', 150);
}

export async function earnCoins(amount: number): Promise<number> {
  const current = await getCoins();
  const next = current + amount;
  setLocal('coins', next);

  try {
    const supabase = sb();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('user_coins').upsert({
        user_id: user.id,
        balance: next,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    }
  } catch {
    // local fallback
  }
  return next;
}

export async function spendCoins(amount: number): Promise<boolean> {
  const current = await getCoins();
  if (current < amount) return false;
  const next = current - amount;
  setLocal('coins', next);

  try {
    const supabase = sb();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('user_coins').upsert({
        user_id: user.id,
        balance: next,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    }
  } catch {
    // local fallback
  }
  return true;
}

export async function getStreak(): Promise<StreakData> {
  try {
    const supabase = sb();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('streak_data')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (!error && data) {
        const s: StreakData = {
          current: Number(data.current),
          longest: Number(data.longest),
          lastActiveDate: data.last_active_date ?? null,
        };
        setLocal('streak', s);
        return s;
      }
    }
  } catch {
    // fallback
  }
  return getLocal<StreakData>('streak', { current: 3, longest: 7, lastActiveDate: todayKey() });
}

export async function updateStreak(): Promise<StreakData> {
  const today = todayKey();
  const yesterday = yesterdayKey();
  const s = await getStreak();

  if (s.lastActiveDate === today) return s;

  let current = s.current;
  if (s.lastActiveDate === yesterday) {
    current += 1;
  } else {
    current = 1;
  }
  const longest = Math.max(s.longest, current);
  const updated: StreakData = { current, longest, lastActiveDate: today };
  setLocal('streak', updated);

  try {
    const supabase = sb();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('streak_data').upsert({
        user_id: user.id,
        current: updated.current,
        longest: updated.longest,
        last_active_date: updated.lastActiveDate,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    }
  } catch {
    // local fallback
  }
  return updated;
}

// ── Quests (Synced with public.quests) ───────────────────────────

export function generateDefaultQuests(): Quest[] {
  const endOfWeek = new Date();
  endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
  endOfWeek.setHours(23, 59, 59, 999);
  const exp = endOfWeek.toISOString();

  return [
    { id: 'q-workout-5', title: 'Workout Warrior', description: 'Complete 5 workout sessions this week', emoji: '🏋️', target: 5, progress: 2, reward: 200, type: 'workout', isCompleted: false, expiresAt: exp },
    { id: 'q-log-10',    title: 'Food Tracker',    description: 'Log 10 meals this week',                emoji: '🍱', target: 10, progress: 4, reward: 150, type: 'food',    isCompleted: false, expiresAt: exp },
    { id: 'q-streak-3',  title: 'Streak Master',   description: 'Maintain a 3-day workout streak',       emoji: '🔥', target: 3,  progress: 3, reward: 300, type: 'streak',  isCompleted: true,  expiresAt: exp },
  ];
}

export async function getQuests(): Promise<Quest[]> {
  try {
    const supabase = sb();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .eq('user_id', user.id);

      if (!error && data && data.length > 0) {
        const mapped: Quest[] = data.map(r => ({
          id: r.quest_key,
          title: r.title,
          description: r.description,
          emoji: r.emoji,
          target: Number(r.target),
          progress: Number(r.progress),
          reward: Number(r.reward),
          type: r.type as Quest['type'],
          isCompleted: Boolean(r.is_completed),
          expiresAt: r.expires_at,
        }));
        setLocal('quests', mapped);
        return mapped;
      }
    }
  } catch {
    // fallback
  }
  return getLocal<Quest[]>('quests', generateDefaultQuests());
}

export async function updateQuestProgress(type: Quest['type'], increment: number): Promise<void> {
  const quests = await getQuests();
  let changed = false;

  for (const q of quests) {
    if (q.type === type && !q.isCompleted) {
      q.progress = Math.min(q.progress + increment, q.target);
      if (q.progress >= q.target) {
        q.isCompleted = true;
        await earnCoins(q.reward);
      }
      changed = true;
    }
  }

  if (changed) {
    setLocal('quests', quests);
    try {
      const supabase = sb();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const rows = quests.map(q => ({
          user_id: user.id,
          quest_key: q.id,
          title: q.title,
          description: q.description,
          emoji: q.emoji,
          target: q.target,
          progress: q.progress,
          reward: q.reward,
          type: q.type,
          is_completed: q.isCompleted,
          expires_at: q.expiresAt,
        }));
        await supabase.from('quests').upsert(rows, { onConflict: 'user_id,quest_key' });
      }
    } catch {
      // local fallback
    }
  }
}

// ── Purchases (Synced with public.purchases) ─────────────────────

export async function getPurchases(): Promise<PurchaseRecord[]> {
  try {
    const supabase = sb();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id)
        .order('purchased_at', { ascending: false });

      if (!error && data !== null) {
        const mapped: PurchaseRecord[] = data.map(r => ({
          id: r.id,
          itemId: r.item_id,
          itemName: r.item_name,
          coinSpent: Number(r.coin_spent),
          timestamp: r.purchased_at,
        }));
        setLocal('purchases', mapped);
        return mapped;
      }
    }
  } catch {
    // fallback
  }
  return getLocal<PurchaseRecord[]>('purchases', []);
}

export async function addPurchase(entry: Omit<PurchaseRecord, 'id' | 'timestamp'>): Promise<boolean> {
  const spent = await spendCoins(entry.coinSpent);
  if (!spent) return false;

  const now = new Date().toISOString();
  const newPurchase: PurchaseRecord = { ...entry, id: genId(), timestamp: now };
  const all = getLocal<PurchaseRecord[]>('purchases', []);
  all.unshift(newPurchase);
  setLocal('purchases', all);

  try {
    const supabase = sb();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('purchases').insert({
        id: newPurchase.id,
        user_id: user.id,
        item_id: entry.itemId,
        item_name: entry.itemName,
        coin_spent: entry.coinSpent,
        purchased_at: now,
      });
    }
  } catch {
    // local fallback
  }

  return true;
}

// ── Full State ───────────────────────────────────────────────────

export async function getFullState(): Promise<AppState> {
  const [
    profile, goal, diary, workouts, coins, streak, quests, purchases, calorieTrend,
    waterEntries, waterToday, supplements,
  ] = await Promise.all([
    getProfile(),
    getGoal(),
    getTodayDiary(),
    getTodayWorkouts(),
    getCoins(),
    getStreak(),
    getQuests(),
    getPurchases(),
    getCalorieTrend(),
    getWaterEntries(),
    getTodayWater(),
    getSupplements(),
  ]);

  return {
    profile,
    goal,
    diary,
    workouts,
    coins,
    streak,
    quests,
    purchases,
    calorieTrend,
    waterGoal: 2500,
    waterToday,
    waterEntries,
    supplements,
  };
}

// ── Body Weight Log (Synced with public.weight_logs) ─────────────

export async function logWeightReading(
  weightKg: number,
  source: 'manual' | 'scale' = 'manual',
  deviceId?: string,
): Promise<WeightLog> {
  let bmi: number | undefined;
  const profile = await getProfile();
  if (profile && profile.height > 0) {
    bmi = calculateBmi(weightKg, profile.height) ?? undefined;
  }

  const now = new Date().toISOString();
  const entry: WeightLog = {
    id: genId(),
    weightKg,
    bmi,
    deviceId,
    source,
    measuredAt: now,
  };

  const logs = getLocal<WeightLog[]>('weight_logs', []);
  logs.push(entry);
  setLocal('weight_logs', logs);

  try {
    const supabase = sb();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('weight_logs').insert({
        id: entry.id,
        user_id: user.id,
        weight_kg: entry.weightKg,
        bmi: entry.bmi ?? null,
        device_id: entry.deviceId ?? null,
        source: entry.source,
        measured_at: entry.measuredAt,
      });
    }
  } catch {
    // local fallback
  }

  if (profile) {
    await saveProfile({ ...profile, weight: weightKg });
  }

  return entry;
}

export async function getWeightHistory(days = 30): Promise<WeightLog[]> {
  const cutoff = new Date(Date.now() - days * 86400000).toISOString();

  try {
    const supabase = sb();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('measured_at', cutoff)
        .order('measured_at', { ascending: true });

      if (!error && data !== null && data.length > 0) {
        const mapped: WeightLog[] = data.map(r => ({
          id: r.id,
          weightKg: Number(r.weight_kg),
          bmi: r.bmi !== null && r.bmi !== undefined ? Number(r.bmi) : undefined,
          deviceId: r.device_id ?? undefined,
          source: (r.source === 'scale' ? 'scale' : 'manual') as 'manual' | 'scale',
          measuredAt: r.measured_at,
        }));
        setLocal('weight_logs', mapped);
        return mapped;
      }
    }
  } catch {
    // fallback
  }

  const logs = getLocal<WeightLog[]>('weight_logs', [
    { id: 'w1', weightKg: 71.5, bmi: 23.3, measuredAt: new Date(Date.now() - 14 * 86400000).toISOString(), source: 'manual' },
    { id: 'w2', weightKg: 70.8, bmi: 23.1, measuredAt: new Date(Date.now() - 7 * 86400000).toISOString(), source: 'manual' },
    { id: 'w3', weightKg: 70.0, bmi: 22.9, measuredAt: new Date().toISOString(), source: 'manual' },
  ]);
  return logs.filter(w => w.measuredAt >= cutoff);
}

export async function getWeightStats(): Promise<WeightStats> {
  const history = await getWeightHistory(30);
  const stats = computeWeightDeltas(history);

  if (stats.latest !== null && stats.bmi === null) {
    const profile = await getProfile();
    if (profile && profile.height > 0) {
      stats.bmi = calculateBmi(stats.latest, profile.height);
    }
  }
  return stats;
}

export async function deleteWeightLog(id: string): Promise<void> {
  const logs = getLocal<WeightLog[]>('weight_logs', []);
  setLocal('weight_logs', logs.filter(w => w.id !== id));

  try {
    const supabase = sb();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('weight_logs').delete().eq('id', id).eq('user_id', user.id);
    }
  } catch {
    // local fallback
  }
}
