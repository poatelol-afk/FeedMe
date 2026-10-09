-- ═══════════════════════════════════════════════════════
--  FeedMe — Supabase Database Schema
--  วิธีใช้: ไปที่ Supabase Dashboard → SQL Editor
--  แล้ว paste SQL ทั้งหมดนี้แล้วกด Run
-- ═══════════════════════════════════════════════════════

-- ── 1. Profiles ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id   uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  age       integer       NOT NULL CHECK (age > 0 AND age < 150),
  gender    text          NOT NULL CHECK (gender IN ('male', 'female')),
  weight    numeric(5,1)  NOT NULL CHECK (weight > 0),
  height    numeric(5,1)  NOT NULL CHECK (height > 0),
  activity  numeric(4,3)  NOT NULL,
  updated_at timestamptz  DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: own data only" ON public.profiles
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── 2. Nutrition Goals ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.nutrition_goals (
  user_id      uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tdee         integer NOT NULL,
  protein_pct  integer, protein_g integer, protein_kcal integer,
  carbs_pct    integer, carbs_g   integer, carbs_kcal   integer,
  fat_pct      integer, fat_g     integer, fat_kcal     integer,
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE public.nutrition_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nutrition_goals: own data only" ON public.nutrition_goals
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── 3. Diary Entries ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.diary_entries (
  id          text        PRIMARY KEY,
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_name   text        NOT NULL,
  emoji       text        NOT NULL DEFAULT '🍽️',
  weight      numeric(8,1) NOT NULL,
  kcal        numeric(8,1) NOT NULL,
  protein     numeric(7,2) NOT NULL DEFAULT 0,
  carbs       numeric(7,2) NOT NULL DEFAULT 0,
  fat         numeric(7,2) NOT NULL DEFAULT 0,
  logged_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "diary_entries: own data only" ON public.diary_entries
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS diary_entries_user_logged ON public.diary_entries (user_id, logged_at DESC);

-- ── 4. Workout Entries ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.workout_entries (
  id              text        PRIMARY KEY,
  user_id         uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id      text        NOT NULL,
  workout_name    text        NOT NULL,
  emoji           text        NOT NULL DEFAULT '🏃',
  duration        integer     NOT NULL CHECK (duration > 0),
  coins_earned    integer     NOT NULL DEFAULT 0,
  calories_burned integer     NOT NULL DEFAULT 0,
  logged_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.workout_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workout_entries: own data only" ON public.workout_entries
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS workout_entries_user_logged ON public.workout_entries (user_id, logged_at DESC);

-- ── 5. User Coins ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_coins (
  user_id   uuid    PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance   integer NOT NULL DEFAULT 0 CHECK (balance >= 0),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_coins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_coins: own data only" ON public.user_coins
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── 6. Streak Data ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.streak_data (
  user_id          uuid  PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current          integer NOT NULL DEFAULT 0,
  longest          integer NOT NULL DEFAULT 0,
  last_active_date date,
  updated_at       timestamptz DEFAULT now()
);

ALTER TABLE public.streak_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "streak_data: own data only" ON public.streak_data
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── 7. Quests ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.quests (
  user_id      uuid  NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_key    text  NOT NULL,
  title        text  NOT NULL,
  description  text  NOT NULL DEFAULT '',
  emoji        text  NOT NULL DEFAULT '🎯',
  target       integer NOT NULL,
  progress     integer NOT NULL DEFAULT 0,
  reward       integer NOT NULL DEFAULT 0,
  type         text    NOT NULL CHECK (type IN ('workout','food','streak','shop')),
  is_completed boolean NOT NULL DEFAULT false,
  expires_at   timestamptz NOT NULL,
  PRIMARY KEY (user_id, quest_key)
);

ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quests: own data only" ON public.quests
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── 8. Purchases ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.purchases (
  id           text        PRIMARY KEY,
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id      text        NOT NULL,
  item_name    text        NOT NULL,
  coin_spent   integer     NOT NULL CHECK (coin_spent > 0),
  purchased_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "purchases: own data only" ON public.purchases
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS purchases_user_date ON public.purchases (user_id, purchased_at DESC);

-- ── 9. Weight Logs (Scale Integration) ──────────────────
CREATE TABLE IF NOT EXISTS public.weight_logs (
  id           text        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg    numeric(5,1) NOT NULL CHECK (weight_kg > 0 AND weight_kg < 500),
  bmi          numeric(4,1),
  device_id    text,                           -- e.g. "scale-01" from hardware
  source       text        NOT NULL DEFAULT 'manual'
               CHECK (source IN ('manual', 'scale')),
  measured_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "weight_logs: own data only" ON public.weight_logs
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS weight_logs_user_date
  ON public.weight_logs (user_id, measured_at DESC);

-- ═══════════════════════════════════════════════════════
--  Done! ทุก table มี Row Level Security (RLS)
--  แต่ละ user เห็นเฉพาะข้อมูลของตัวเองเท่านั้น
--  weight_logs รับค่าจาก hardware scale ผ่าน POST /api/scale/reading
-- ═══════════════════════════════════════════════════════
