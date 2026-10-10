// ═══════════════════════════════════════════════════════
//  FeedMe — Supabase Database Layer
//  แทนที่ mock-db.ts (localStorage) ด้วย Supabase PostgreSQL
//  Interface ของ functions ยังเหมือนเดิมทุกอย่าง
// ═══════════════════════════════════════════════════════

import { supabase } from './supabase/client';
import type {
  AppState, DiaryEntry, NutritionGoal, PurchaseRecord,
  Quest, StreakData, UserProfile, WeightLog, WeightStats, WorkoutEntry,
} from '../types';
import { genId, todayKey, yesterdayKey, calculateGoal } from './utils';

// ─── helpers ────────────────────────────────────────────
function sb() { return supabase; }

// ── Profile ──────────────────────────────────────────────

export async function saveProfile(profile: UserProfile): Promise<NutritionGoal> {
  const supabase = sb();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const goal = calculateGoal(profile);

  await supabase.from('profiles').upsert({
    user_id: user.id,
    age: profile.age,
    gender: profile.gender,
    weight: profile.weight,
    height: profile.height,
    activity: profile.activity,
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
  }, { onConflict: 'user_id' });

  return goal;
}

export async function getProfile(): Promise<UserProfile | null> {
  const { data, error } = await sb()
    .from('profiles')
    .select('*')
    .maybeSingle();

  if (error || !data) return null;
  return {
    age: data.age,
    gender: data.gender as 'male' | 'female',
    weight: data.weight,
    height: data.height,
    activity: data.activity,
  };
}

export async function getGoal(): Promise<NutritionGoal | null> {
  const { data, error } = await sb()
    .from('nutrition_goals')
    .select('*')
    .maybeSingle();

  if (error || !data) return null;
  return {
    tdee: data.tdee,
    protein: { pct: data.protein_pct, g: data.protein_g, kcal: data.protein_kcal },
    carbs:   { pct: data.carbs_pct,   g: data.carbs_g,   kcal: data.carbs_kcal },
    fat:     { pct: data.fat_pct,     g: data.fat_g,     kcal: data.fat_kcal },
  };
}

// ── Food Diary ─────────────────────────────────────────

export async function getTodayDiary(): Promise<DiaryEntry[]> {
  const today = todayKey();
  const { data, error } = await sb()
    .from('diary_entries')
    .select('*')
    .gte('logged_at', `${today}T00:00:00`)
    .lte('logged_at', `${today}T23:59:59`)
    .order('logged_at', { ascending: true });

  if (error || !data) return [];
  return data.map(r => ({
    id: r.id,
    foodName: r.food_name,
    emoji: r.emoji,
    weight: r.weight,
    kcal: r.kcal,
    protein: r.protein,
    carbs: r.carbs,
    fat: r.fat,
    timestamp: r.logged_at,
  }));
}

export async function addFoodLog(entry: Omit<DiaryEntry, 'id' | 'timestamp'>): Promise<DiaryEntry> {
  const supabase = sb();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('diary_entries')
    .insert({
      id: genId(),
      user_id: user.id,
      food_name: entry.foodName,
      emoji: entry.emoji,
      weight: entry.weight,
      kcal: entry.kcal,
      protein: entry.protein,
      carbs: entry.carbs,
      fat: entry.fat,
      logged_at: now,
    })
    .select()
    .single();

  if (error) throw error;
  return { ...entry, id: data.id, timestamp: data.logged_at };
}

export async function deleteFoodLog(id: string): Promise<void> {
  await sb().from('diary_entries').delete().eq('id', id);
}

// ── Workouts ──────────────────────────────────────────

export async function getTodayWorkouts(): Promise<WorkoutEntry[]> {
  const today = todayKey();
  const { data, error } = await sb()
    .from('workout_entries')
    .select('*')
    .gte('logged_at', `${today}T00:00:00`)
    .lte('logged_at', `${today}T23:59:59`)
    .order('logged_at', { ascending: true });

  if (error || !data) return [];
  return data.map(r => ({
    id: r.id,
    workoutId: r.workout_id,
    workoutName: r.workout_name,
    emoji: r.emoji,
    duration: r.duration,
    coinsEarned: r.coins_earned,
    caloriesBurned: r.calories_burned,
    timestamp: r.logged_at,
  }));
}

export async function addWorkout(entry: Omit<WorkoutEntry, 'id' | 'timestamp'>): Promise<WorkoutEntry> {
  const supabase = sb();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('workout_entries')
    .insert({
      id: genId(),
      user_id: user.id,
      workout_id: entry.workoutId,
      workout_name: entry.workoutName,
      emoji: entry.emoji,
      duration: entry.duration,
      coins_earned: entry.coinsEarned,
      calories_burned: entry.caloriesBurned,
      logged_at: now,
    })
    .select()
    .single();

  if (error) throw error;

  await earnCoins(entry.coinsEarned);
  await updateStreak();
  await updateQuestProgress('workout', 1);

  return { ...entry, id: data.id, timestamp: data.logged_at };
}

// ── Coins ─────────────────────────────────────────────

export async function getCoins(): Promise<number> {
  const { data, error } = await sb()
    .from('user_coins')
    .select('balance')
    .maybeSingle();
  if (error || !data) return 0;
  return data.balance ?? 0;
}

export async function earnCoins(amount: number): Promise<number> {
  const supabase = sb();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const current = await getCoins();
  const updated = current + Math.round(amount);

  await supabase.from('user_coins').upsert(
    { user_id: user.id, balance: updated },
    { onConflict: 'user_id' },
  );
  return updated;
}

export async function spendCoins(amount: number): Promise<boolean> {
  const supabase = sb();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const current = await getCoins();
  if (current < amount) return false;

  await supabase.from('user_coins').upsert(
    { user_id: user.id, balance: current - amount },
    { onConflict: 'user_id' },
  );
  return true;
}

// ── Streak ────────────────────────────────────────────

export async function getStreak(): Promise<StreakData> {
  const supabase = sb();
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('streak_data')
    .select('*')
    .maybeSingle();

  const defaultStreak: StreakData = { current: 0, longest: 0, lastActiveDate: '' };
  if (error || !data) return defaultStreak;

  const streak: StreakData = {
    current: data.current ?? 0,
    longest: data.longest ?? 0,
    lastActiveDate: data.last_active_date ?? '',
  };

  // Break streak if missed a day
  const today = todayKey();
  const yesterday = yesterdayKey();
  if (user && streak.lastActiveDate && streak.lastActiveDate !== today && streak.lastActiveDate !== yesterday) {
    streak.current = 0;
    await supabase.from('streak_data').update({ current: 0 }).eq('user_id', user.id);
  }

  return streak;
}

export async function updateStreak(): Promise<StreakData> {
  const supabase = sb();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { current: 0, longest: 0, lastActiveDate: '' };

  const streak = await getStreak();
  const today = todayKey();

  if (streak.lastActiveDate === today) return streak;

  streak.current += 1;
  streak.longest = Math.max(streak.longest, streak.current);
  streak.lastActiveDate = today;

  await supabase.from('streak_data').upsert(
    { user_id: user.id, current: streak.current, longest: streak.longest, last_active_date: today },
    { onConflict: 'user_id' },
  );

  // Update streak quest
  const quests = await getRawQuests();
  let changed = false;
  for (const q of quests) {
    if (q.type === 'streak' && !q.isCompleted) {
      q.progress = Math.min(q.progress + 1, q.target);
      if (q.progress >= q.target) { q.isCompleted = true; await earnCoins(q.reward); }
      changed = true;
    }
  }
  if (changed) await saveQuests(user.id, quests);

  return streak;
}

// ── Purchases ─────────────────────────────────────────

export async function getPurchases(): Promise<PurchaseRecord[]> {
  const { data, error } = await sb()
    .from('purchases')
    .select('*')
    .order('purchased_at', { ascending: false });

  if (error || !data) return [];
  return data.map(r => ({
    id: r.id,
    itemId: r.item_id,
    itemName: r.item_name,
    coinSpent: r.coin_spent,
    timestamp: r.purchased_at,
  }));
}

export async function addPurchase(record: Omit<PurchaseRecord, 'id' | 'timestamp'>): Promise<PurchaseRecord | null> {
  const supabase = sb();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const ok = await spendCoins(record.coinSpent);
  if (!ok) return null;

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('purchases')
    .insert({
      id: genId(),
      user_id: user.id,
      item_id: record.itemId,
      item_name: record.itemName,
      coin_spent: record.coinSpent,
      purchased_at: now,
    })
    .select()
    .single();

  if (error) return null;
  return { ...record, id: data.id, timestamp: data.purchased_at };
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
  const { data, error } = await sb()
    .from('quests')
    .select('*');

  if (error || !data || data.length === 0) return [];

  return data.map(r => ({
    id: r.quest_key,
    title: r.title,
    description: r.description,
    emoji: r.emoji,
    target: r.target,
    progress: r.progress,
    reward: r.reward,
    type: r.type as Quest['type'],
    isCompleted: r.is_completed,
    expiresAt: r.expires_at,
  }));
}

async function saveQuests(userId: string, quests: Quest[]): Promise<void> {
  const supabase = sb();
  for (const q of quests) {
    await supabase.from('quests').upsert({
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
    }, { onConflict: 'user_id,quest_key' });
  }
}

export async function getQuests(): Promise<Quest[]> {
  const supabase = sb();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let quests = await getRawQuests();
  const now = new Date();

  if (quests.length === 0 || quests.every(q => new Date(q.expiresAt) < now)) {
    quests = generateDefaultQuests();
    await saveQuests(user.id, quests);
  }

  return quests;
}

export async function updateQuestProgress(type: Quest['type'], increment: number): Promise<void> {
  const supabase = sb();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const quests = await getRawQuests();
  let changed = false;

  for (const q of quests) {
    if (q.type === type && !q.isCompleted) {
      q.progress = Math.min(q.progress + increment, q.target);
      if (q.progress >= q.target) { q.isCompleted = true; await earnCoins(q.reward); }
      changed = true;
    }
  }

  if (changed) await saveQuests(user.id, quests);
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

// ── Weight / Scale ────────────────────────────────────

/**
 * บันทึกน้ำหนักที่รับมาจาก hardware scale หรือกรอกเอง
 * source: 'scale' = รับจากเครื่องชั่งอัตโนมัติ, 'manual' = กรอกเอง
 */
export async function logWeightReading(
  weightKg: number,
  source: 'manual' | 'scale' = 'manual',
  deviceId?: string,
): Promise<WeightLog> {
  const supabase = sb();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // คำนวณ BMI จาก profile ถ้ามี
  let bmi: number | undefined;
  const profile = await getProfile();
  if (profile && profile.height > 0) {
    const heightM = profile.height / 100;
    bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;
  }

  const now = new Date().toISOString();
  const id = genId();

  const { data, error } = await supabase
    .from('weight_logs')
    .insert({
      id,
      user_id: user.id,
      weight_kg: weightKg,
      bmi: bmi ?? null,
      device_id: deviceId ?? null,
      source,
      measured_at: now,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    weightKg: data.weight_kg,
    bmi: data.bmi ?? undefined,
    deviceId: data.device_id ?? undefined,
    source: data.source as 'manual' | 'scale',
    measuredAt: data.measured_at,
  };
}

/**
 * ดึงประวัติน้ำหนักย้อนหลัง N วัน (default 30 วัน)
 */
export async function getWeightHistory(days = 30): Promise<WeightLog[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await sb()
    .from('weight_logs')
    .select('*')
    .gte('measured_at', since.toISOString())
    .order('measured_at', { ascending: true });

  if (error || !data) return [];

  return data.map(r => ({
    id: r.id,
    weightKg: r.weight_kg,
    bmi: r.bmi ?? undefined,
    deviceId: r.device_id ?? undefined,
    source: r.source as 'manual' | 'scale',
    measuredAt: r.measured_at,
  }));
}

/**
 * ดึงสถิติน้ำหนัก: ล่าสุด, เปลี่ยนแปลง 7/30 วัน, BMI
 */
export async function getWeightStats(): Promise<WeightStats> {
  const history = await getWeightHistory(30);

  if (history.length === 0) {
    return { latest: null, change7d: null, change30d: null, bmi: null };
  }

  const latest = history[history.length - 1];
  const now = new Date();

  const entry7d = history.find(h => {
    const d = new Date(h.measuredAt);
    return now.getTime() - d.getTime() >= 6 * 24 * 60 * 60 * 1000;
  });
  const entry30d = history[0];

  return {
    latest: latest.weightKg,
    bmi: latest.bmi ?? null,
    change7d: entry7d ? Math.round((latest.weightKg - entry7d.weightKg) * 10) / 10 : null,
    change30d: entry30d.id !== latest.id
      ? Math.round((latest.weightKg - entry30d.weightKg) * 10) / 10
      : null,
  };
}

/**
 * ลบ weight log รายการหนึ่ง
 */
export async function deleteWeightLog(id: string): Promise<void> {
  await sb().from('weight_logs').delete().eq('id', id);
}
