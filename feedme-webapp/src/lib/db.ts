// ═══════════════════════════════════════════════════════
//  FeedMe — Supabase + AsyncStorage Database Layer (Expo)
//  Hardened with explicit .eq('user_id', user.id), local
//  day bounds, and AsyncStorage offline fallback
// ═══════════════════════════════════════════════════════

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase/client';
import type {
  AppState, DiaryEntry, NutritionGoal, PurchaseRecord,
  Quest, StreakData, UserProfile, WeightLog, WeightStats, WorkoutEntry,
} from '../types';
import {
  calculateBmi, calculateGoal, genId, localDateKey, localDayBounds, todayKey, yesterdayKey,
} from './utils';

function sb() { return supabase; }

async function getCache<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(`feedme_${key}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function setCache<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(`feedme_${key}`, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

const DEFAULT_PROFILE: UserProfile = {
  age: 26,
  gender: 'male',
  weight: 70,
  height: 175,
  activity: 1.55,
};

// ── Profile & Goals ─────────────────────────────────────

export async function saveProfile(profile: UserProfile): Promise<NutritionGoal> {
  const goal = calculateGoal(profile);
  await setCache('profile', profile);
  await setCache('goal', goal);

  try {
    const { data: { user } } = await sb().auth.getUser();
    if (user) {
      await sb().from('profiles').upsert({
        user_id: user.id,
        age: profile.age,
        gender: profile.gender,
        weight: profile.weight,
        height: profile.height,
        activity: profile.activity,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      await sb().from('nutrition_goals').upsert({
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
  } catch {
    // offline fallback saved in AsyncStorage
  }

  return goal;
}

export async function getProfile(): Promise<UserProfile | null> {
  try {
    const { data: { user } } = await sb().auth.getUser();
    if (user) {
      const { data, error } = await sb()
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        const p: UserProfile = {
          age: Number(data.age),
          gender: data.gender as 'male' | 'female',
          weight: Number(data.weight),
          height: Number(data.height),
          activity: Number(data.activity),
        };
        await setCache('profile', p);
        return p;
      }
    }
  } catch {
    // fallback
  }
  return getCache<UserProfile>('profile', DEFAULT_PROFILE);
}

export async function getGoal(): Promise<NutritionGoal | null> {
  try {
    const { data: { user } } = await sb().auth.getUser();
    if (user) {
      const { data, error } = await sb()
        .from('nutrition_goals')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        const g: NutritionGoal = {
          tdee: Number(data.tdee),
          protein: { pct: Number(data.protein_pct), g: Number(data.protein_g), kcal: Number(data.protein_kcal) },
          carbs:   { pct: Number(data.carbs_pct),   g: Number(data.carbs_g),   kcal: Number(data.carbs_kcal) },
          fat:     { pct: Number(data.fat_pct),     g: Number(data.fat_g),     kcal: Number(data.fat_kcal) },
        };
        await setCache('goal', g);
        return g;
      }
    }
  } catch {
    // fallback
  }
  const cached = await getCache<NutritionGoal | null>('goal', null);
  if (cached) return cached;
  const profile = await getProfile();
  return calculateGoal(profile ?? DEFAULT_PROFILE);
}

// ── Food Diary ─────────────────────────────────────────

export async function getTodayDiary(): Promise<DiaryEntry[]> {
  const { start, end } = localDayBounds();
  try {
    const { data: { user } } = await sb().auth.getUser();
    if (user) {
      const { data, error } = await sb()
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
        const prev = await getCache<DiaryEntry[]>('diary_entries', []);
        const otherDays = prev.filter(e => localDateKey(new Date(e.timestamp)) !== today);
        await setCache('diary_entries', [...mapped, ...otherDays]);
        return mapped;
      }
    }
  } catch {
    // fallback
  }
  const all = await getCache<DiaryEntry[]>('diary_entries', []);
  const today = todayKey();
  return all.filter(e => localDateKey(new Date(e.timestamp)) === today);
}

export async function addFoodLog(entry: Omit<DiaryEntry, 'id' | 'timestamp'>): Promise<DiaryEntry> {
  const now = new Date().toISOString();
  const newEntry: DiaryEntry = { ...entry, id: genId(), timestamp: now };

  const all = await getCache<DiaryEntry[]>('diary_entries', []);
  all.unshift(newEntry);
  await setCache('diary_entries', all);

  try {
    const { data: { user } } = await sb().auth.getUser();
    if (user) {
      await sb().from('diary_entries').insert({
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
  } catch {
    // saved in AsyncStorage
  }

  return newEntry;
}

export async function deleteFoodLog(id: string): Promise<void> {
  const all = await getCache<DiaryEntry[]>('diary_entries', []);
  await setCache('diary_entries', all.filter(e => e.id !== id));

  try {
    const { data: { user } } = await sb().auth.getUser();
    if (user) {
      await sb().from('diary_entries').delete().eq('id', id).eq('user_id', user.id);
    }
  } catch {
    // offline fallback
  }
}

// ── Workouts ──────────────────────────────────────────

export async function getTodayWorkouts(): Promise<WorkoutEntry[]> {
  const { start, end } = localDayBounds();
  try {
    const { data: { user } } = await sb().auth.getUser();
    if (user) {
      const { data, error } = await sb()
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
        const prev = await getCache<WorkoutEntry[]>('workout_entries', []);
        const otherDays = prev.filter(w => localDateKey(new Date(w.timestamp)) !== today);
        await setCache('workout_entries', [...mapped, ...otherDays]);
        return mapped;
      }
    }
  } catch {
    // fallback
  }
  const all = await getCache<WorkoutEntry[]>('workout_entries', []);
  const today = todayKey();
  return all.filter(w => localDateKey(new Date(w.timestamp)) === today);
}

export async function addWorkout(entry: Omit<WorkoutEntry, 'id' | 'timestamp'>): Promise<WorkoutEntry> {
  const now = new Date().toISOString();
  const newEntry: WorkoutEntry = { ...entry, id: genId(), timestamp: now };

  const all = await getCache<WorkoutEntry[]>('workout_entries', []);
  all.unshift(newEntry);
  await setCache('workout_entries', all);

  try {
    const { data: { user } } = await sb().auth.getUser();
    if (user) {
      const { error } = await sb()
        .from('workout_entries')
        .insert({
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
      if (error) {
        console.warn('[db] addWorkout Supabase insert warning:', error.message);
      }
    }
  } catch {
    // offline fallback saved in AsyncStorage
  }

  await earnCoins(entry.coinsEarned);
  await updateStreak();
  await updateQuestProgress('workout', 1);

  return newEntry;
}

// ── Coins ─────────────────────────────────────────────

export async function getCoins(): Promise<number> {
  try {
    const { data: { user } } = await sb().auth.getUser();
    if (user) {
      const { data, error } = await sb()
        .from('user_coins')
        .select('balance')
        .eq('user_id', user.id)
        .maybeSingle();
      if (!error && data) {
        const balance = Number(data.balance ?? 0);
        await setCache('coins', balance);
        return balance;
      }
    }
  } catch {
    // fallback
  }
  return getCache<number>('coins', 150);
}

export async function earnCoins(amount: number): Promise<number> {
  const current = await getCoins();
  const updated = current + Math.round(amount);
  await setCache('coins', updated);

  try {
    const { data: { user } } = await sb().auth.getUser();
    if (user) {
      await sb().from('user_coins').upsert(
        { user_id: user.id, balance: updated, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' },
      );
    }
  } catch {
    // offline fallback
  }
  return updated;
}

export async function spendCoins(amount: number): Promise<boolean> {
  const current = await getCoins();
  if (current < amount) return false;
  const updated = current - amount;
  await setCache('coins', updated);

  try {
    const { data: { user } } = await sb().auth.getUser();
    if (user) {
      await sb().from('user_coins').upsert(
        { user_id: user.id, balance: updated, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' },
      );
    }
  } catch {
    // offline fallback
  }
  return true;
}

// ── Streak ────────────────────────────────────────────

export async function getStreak(): Promise<StreakData> {
  const defaultStreak: StreakData = { current: 1, longest: 3, lastActiveDate: todayKey() };
  try {
    const { data: { user } } = await sb().auth.getUser();
    if (user) {
      const { data, error } = await sb()
        .from('streak_data')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        const streak: StreakData = {
          current: Number(data.current ?? 0),
          longest: Number(data.longest ?? 0),
          lastActiveDate: data.last_active_date ?? '',
        };
        const today = todayKey();
        const yesterday = yesterdayKey();
        if (streak.lastActiveDate && streak.lastActiveDate !== today && streak.lastActiveDate !== yesterday) {
          streak.current = 0;
          await sb().from('streak_data').update({ current: 0 }).eq('user_id', user.id);
        }
        await setCache('streak', streak);
        return streak;
      }
    }
  } catch {
    // fallback
  }
  return getCache<StreakData>('streak', defaultStreak);
}

export async function updateStreak(): Promise<StreakData> {
  const streak = await getStreak();
  const today = todayKey();

  if (streak.lastActiveDate === today) return streak;

  streak.current += 1;
  streak.longest = Math.max(streak.longest, streak.current);
  streak.lastActiveDate = today;
  await setCache('streak', streak);

  try {
    const { data: { user } } = await sb().auth.getUser();
    if (user) {
      await sb().from('streak_data').upsert(
        { user_id: user.id, current: streak.current, longest: streak.longest, last_active_date: today },
        { onConflict: 'user_id' },
      );
    }
  } catch {
    // offline fallback
  }

  return streak;
}

// ── Purchases ─────────────────────────────────────────

export async function getPurchases(): Promise<PurchaseRecord[]> {
  try {
    const { data: { user } } = await sb().auth.getUser();
    if (user) {
      const { data, error } = await sb()
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
        await setCache('purchases', mapped);
        return mapped;
      }
    }
  } catch {
    // fallback
  }
  return getCache<PurchaseRecord[]>('purchases', []);
}

export async function addPurchase(record: Omit<PurchaseRecord, 'id' | 'timestamp'>): Promise<PurchaseRecord | null> {
  const ok = await spendCoins(record.coinSpent);
  if (!ok) return null;

  const now = new Date().toISOString();
  const newPurchase: PurchaseRecord = { ...record, id: genId(), timestamp: now };
  const all = await getCache<PurchaseRecord[]>('purchases', []);
  all.unshift(newPurchase);
  await setCache('purchases', all);

  try {
    const { data: { user } } = await sb().auth.getUser();
    if (user) {
      await sb().from('purchases').insert({
        id: newPurchase.id,
        user_id: user.id,
        item_id: record.itemId,
        item_name: record.itemName,
        coin_spent: record.coinSpent,
        purchased_at: now,
      });
    }
  } catch {
    // offline fallback
  }

  return newPurchase;
}

// ── Quests ────────────────────────────────────────────

function generateDefaultQuests(): Quest[] {
  const endOfWeek = new Date();
  endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
  endOfWeek.setHours(23, 59, 59, 999);
  const exp = endOfWeek.toISOString();

  return [
    { id: 'q-workout-5', title: 'Workout Warrior', description: 'Complete 5 workout sessions this week', emoji: '🏋️', target: 5, progress: 0, reward: 200, type: 'workout', isCompleted: false, expiresAt: exp },
    { id: 'q-log-10',    title: 'Food Tracker',    description: 'Log 10 meals this week',                emoji: '🍽️', target: 10, progress: 0, reward: 150, type: 'food',    isCompleted: false, expiresAt: exp },
    { id: 'q-streak-3',  title: 'Streak Master',   description: 'Maintain a 3-day workout streak',       emoji: '🔥', target: 3,  progress: 0, reward: 300, type: 'streak',  isCompleted: false, expiresAt: exp },
  ];
}

async function getRawQuests(): Promise<Quest[]> {
  try {
    const { data: { user } } = await sb().auth.getUser();
    if (user) {
      const { data, error } = await sb()
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
        await setCache('quests', mapped);
        return mapped;
      }
    }
  } catch {
    // fallback
  }
  return getCache<Quest[]>('quests', []);
}

async function saveQuests(userId: string | null, quests: Quest[]): Promise<void> {
  await setCache('quests', quests);
  if (!userId) return;
  try {
    const rows = quests.map(q => ({
      user_id: userId,
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
    await sb().from('quests').upsert(rows, { onConflict: 'user_id,quest_key' });
  } catch {
    // offline fallback
  }
}

export async function getQuests(): Promise<Quest[]> {
  let userId: string | null = null;
  try {
    const { data: { user } } = await sb().auth.getUser();
    userId = user?.id ?? null;
  } catch {
    // offline
  }

  let quests = await getRawQuests();
  const now = new Date();

  if (quests.length === 0 || quests.every(q => new Date(q.expiresAt) < now)) {
    quests = generateDefaultQuests();
    await saveQuests(userId, quests);
  }

  return quests;
}

export async function updateQuestProgress(type: Quest['type'], increment: number): Promise<void> {
  let userId: string | null = null;
  try {
    const { data: { user } } = await sb().auth.getUser();
    userId = user?.id ?? null;
  } catch {
    // offline
  }

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

  if (changed) await saveQuests(userId, quests);
}

// ── Full State ────────────────────────────────────────

export async function getFullState(): Promise<AppState> {
  const [profile, goal, diary, workouts, coins, streak, quests, purchases] = await Promise.all([
    getProfile(),
    getGoal(),
    getTodayDiary(),
    getTodayWorkouts(),
    getCoins(),
    getStreak(),
    getQuests(),
    getPurchases(),
  ]);

  return { profile, goal, diary, workouts, coins, streak, quests, purchases };
}

// ── Body Weight Log ───────────────────────────────────

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

  const cached = await getCache<WeightLog[]>('weight_logs', []);
  cached.push(entry);
  await setCache('weight_logs', cached);

  try {
    const { data: { user } } = await sb().auth.getUser();
    if (user) {
      await sb().from('weight_logs').insert({
        id: entry.id,
        user_id: user.id,
        weight_kg: weightKg,
        bmi: bmi ?? null,
        device_id: deviceId ?? null,
        source,
        measured_at: now,
      });
    }
  } catch {
    // offline fallback
  }

  if (profile) {
    await saveProfile({ ...profile, weight: weightKg });
  }

  return entry;
}

export async function getWeightHistory(days = 30): Promise<WeightLog[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  try {
    const { data: { user } } = await sb().auth.getUser();
    if (user) {
      const { data, error } = await sb()
        .from('weight_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('measured_at', since.toISOString())
        .order('measured_at', { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped: WeightLog[] = data.map(r => ({
          id: r.id,
          weightKg: Number(r.weight_kg),
          bmi: r.bmi !== null && r.bmi !== undefined ? Number(r.bmi) : undefined,
          deviceId: r.device_id ?? undefined,
          source: r.source as 'manual' | 'scale',
          measuredAt: r.measured_at,
        }));
        await setCache('weight_logs', mapped);
        return mapped;
      }
    }
  } catch {
    // fallback
  }

  const cached = await getCache<WeightLog[]>('weight_logs', []);
  return cached.filter(w => w.measuredAt >= since.toISOString());
}

export async function getWeightStats(): Promise<WeightStats> {
  const history = await getWeightHistory(30);

  if (history.length === 0) {
    return { latest: null, change7d: null, change30d: null, bmi: null };
  }

  const sorted = [...history].sort(
    (a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime()
  );
  const latest = sorted[sorted.length - 1];
  const now = new Date();

  if (sorted.length < 2) {
    return {
      latest: latest.weightKg,
      bmi: latest.bmi ?? null,
      change7d: null,
      change30d: null,
    };
  }

  const entry7d = [...sorted]
    .slice(0, -1)
    .reverse()
    .find(h => now.getTime() - new Date(h.measuredAt).getTime() >= 6 * 24 * 60 * 60 * 1000) ?? sorted[0];
  const entry30d = sorted[0];

  return {
    latest: latest.weightKg,
    bmi: latest.bmi ?? null,
    change7d: +(latest.weightKg - entry7d.weightKg).toFixed(1),
    change30d: +(latest.weightKg - entry30d.weightKg).toFixed(1),
  };
}

export async function deleteWeightLog(id: string): Promise<void> {
  const cached = await getCache<WeightLog[]>('weight_logs', []);
  await setCache('weight_logs', cached.filter(w => w.id !== id));

  try {
    const { data: { user } } = await sb().auth.getUser();
    if (user) {
      await sb().from('weight_logs').delete().eq('id', id).eq('user_id', user.id);
    }
  } catch {
    // offline fallback
  }
}
