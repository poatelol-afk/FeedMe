// =================================================================
//  FeedMe — Workout Preset Plans
//  Based on Phase 1 Implementation Plan & MET Exercise Science
// =================================================================

import { WorkoutPlan } from '@/types';

export const WORKOUT_PLANS: WorkoutPlan[] = [
  // ── Fat Loss (ลดไขมัน / เผาผลาญ) ──────────────────────────────────
  {
    id: 'plan-hiit-burn',
    title: 'HIIT Full Body Torch',
    subtitle: 'High-intensity interval fat incineration',
    goal: 'fat_loss',
    mode: 'cardio',
    durationMin: 25,
    met: 8.5,
    difficulty: 'Intermediate',
    emoji: '⚡',
    description: 'เร่งการเผาผลาญไขมันสูงสุดด้วย HIIT Circuit เผาผลาญต่อเนื่องแม้หลังออกเสร็จ (Afterburn effect)',
    exercises: [
      { name: 'Jumping Jacks Warmup', sets: 2, reps: '45s', restSeconds: 15, notes: 'Warm up shoulders and hips' },
      { name: 'Burpees with Jump', sets: 4, reps: '30s', restSeconds: 30, notes: 'Explosive push off the floor' },
      { name: 'High Knees Sprint', sets: 4, reps: '30s', restSeconds: 30, notes: 'Drive knees up past waist' },
      { name: 'Mountain Climbers', sets: 4, reps: '30s', restSeconds: 30, notes: 'Keep core tight and hips level' },
      { name: 'Squat Jumps', sets: 3, reps: '30s', restSeconds: 30, notes: 'Land softly through midfoot' },
      { name: 'Plank Shoulder Taps', sets: 3, reps: '45s', restSeconds: 45, notes: 'Core stability finisher' },
    ],
  },
  {
    id: 'plan-tabata-express',
    title: 'Tabata 4-Minute Protocol',
    subtitle: 'Ultra-fast intense fat burner',
    goal: 'fat_loss',
    mode: 'home',
    durationMin: 20,
    met: 8.0,
    difficulty: 'Intermediate',
    emoji: '🔥',
    description: 'โปรแกรม 20 วิทำเต็มที่ พัก 10 วิ ช่วยกระตุ้นระบบเผาผลาญและหัวใจอย่างมีประสิทธิภาพสูง',
    exercises: [
      { name: 'Jump Rope / Ghost Jumps', sets: 4, reps: '20s on / 10s off', restSeconds: 30 },
      { name: 'Bodyweight Speed Squats', sets: 4, reps: '20s on / 10s off', restSeconds: 30 },
      { name: 'Push-up to Downward Dog', sets: 4, reps: '20s on / 10s off', restSeconds: 30 },
      { name: 'Bicycle Crunches', sets: 4, reps: '20s on / 10s off', restSeconds: 30 },
    ],
  },
  {
    id: 'plan-treadmill-incline',
    title: 'Treadmill Incline Shred',
    subtitle: 'Cardio endurance & fat oxidation',
    goal: 'fat_loss',
    mode: 'cardio',
    durationMin: 35,
    met: 8.0,
    difficulty: 'Beginner',
    emoji: '🏃',
    description: 'เดินชันสลับวิ่งคาร์ดิโอ ปลอดภัยต่อข้อต่อ เผาผลาญแคลอรี่สูงต่อเนื่อง',
    exercises: [
      { name: 'Incline Walk (Incline 12%, Speed 4.5 km/h)', sets: 1, reps: '15 min', restSeconds: 60 },
      { name: 'Moderate Jog (Speed 8.5 km/h)', sets: 1, reps: '10 min', restSeconds: 60 },
      { name: 'Incline Cool Down Walk', sets: 1, reps: '10 min', restSeconds: 0 },
    ],
  },

  // ── Muscle Gain (เพิ่มกล้ามเนื้อ / Hypertrophy) ───────────────────
  {
    id: 'plan-push-power',
    title: 'Push Day: Chest & Shoulders',
    subtitle: 'Hypertrophy for upper body pressing',
    goal: 'muscle_gain',
    mode: 'gym',
    durationMin: 45,
    met: 5.0,
    difficulty: 'Intermediate',
    emoji: '🏋️',
    description: 'เน้นกล้ามเนื้ออก หัวไหล่ และหลังแขน ด้วยท่า Compound Pressing ที่มีประสิทธิภาพ',
    exercises: [
      { name: 'Barbell / Dumbbell Bench Press', sets: 4, reps: '8-10', restSeconds: 90, notes: 'Focus on chest contraction' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', restSeconds: 75, notes: 'Target upper pectorals' },
      { name: 'Overhead Dumbbell Shoulder Press', sets: 3, reps: '10-12', restSeconds: 75, notes: 'Control on way down' },
      { name: 'Lateral Raises', sets: 3, reps: '12-15', restSeconds: 60, notes: 'Side deltoid width' },
      { name: 'Tricep Rope Pushdowns', sets: 3, reps: '12-15', restSeconds: 60, notes: 'Lockout at bottom' },
    ],
  },
  {
    id: 'plan-pull-strength',
    title: 'Pull Day: Back & Biceps',
    subtitle: 'V-taper back and arm development',
    goal: 'muscle_gain',
    mode: 'gym',
    durationMin: 45,
    met: 5.0,
    difficulty: 'Intermediate',
    emoji: '💪',
    description: 'เสริมสร้างแผ่นหลังให้กว้าง หนา และสร้างกล้ามเนื้อหน้าแขนอย่างสมดุล',
    exercises: [
      { name: 'Lat Pulldowns or Pull-ups', sets: 4, reps: '8-10', restSeconds: 90, notes: 'Drive elbows down to hips' },
      { name: 'Seated Cable Row / Dumbbell Row', sets: 4, reps: '10-12', restSeconds: 75, notes: 'Squeeze shoulder blades' },
      { name: 'Face Pulls', sets: 3, reps: '15', restSeconds: 60, notes: 'Rotator cuff and rear delts' },
      { name: 'Barbell Bicep Curls', sets: 3, reps: '10-12', restSeconds: 60, notes: 'Strict form, no swinging' },
      { name: 'Hammer Curls', sets: 3, reps: '12', restSeconds: 60, notes: 'Forearms and brachialis' },
    ],
  },
  {
    id: 'plan-legs-core',
    title: 'Leg Day & Core Blast',
    subtitle: 'Foundation strength and athletic power',
    goal: 'muscle_gain',
    mode: 'gym',
    durationMin: 50,
    met: 5.5,
    difficulty: 'Advanced',
    emoji: '🦵',
    description: 'ฝึกกล้ามเนื้อมัดใหญ่ที่สุดของร่างกาย เพิ่มการหลั่งฮอร์โมนสร้างกล้ามเนื้อและเผาผลาญพลังงาน',
    exercises: [
      { name: 'Barbell Squats / Goblet Squats', sets: 4, reps: '8-10', restSeconds: 90, notes: 'Deep squat past 90 degrees' },
      { name: 'Romanian Deadlifts (RDL)', sets: 3, reps: '10-12', restSeconds: 75, notes: 'Hips back, stretch hamstrings' },
      { name: 'Bulgarian Split Squats', sets: 3, reps: '10 each', restSeconds: 60, notes: 'Single-leg balance and glutes' },
      { name: 'Standing Calf Raises', sets: 3, reps: '15-20', restSeconds: 45, notes: 'Pause 2s at peak contraction' },
      { name: 'Hanging Leg Raises', sets: 3, reps: '12-15', restSeconds: 60, notes: 'Lower abs control' },
    ],
  },

  // ── Maintain & Health (รักษาสุขภาพ / Home Workout) ───────────────
  {
    id: 'plan-home-bodyweight',
    title: 'Home Bodyweight Master',
    subtitle: 'No equipment full body workout',
    goal: 'maintain',
    mode: 'home',
    durationMin: 30,
    met: 5.0,
    difficulty: 'Beginner',
    emoji: '🏠',
    description: 'ออกกำลังกายที่บ้านได้โดยไม่ต้องมีอุปกรณ์ ฝึกความแข็งแรงของกล้ามเนื้อทุกส่วน',
    exercises: [
      { name: 'Standard Push-ups', sets: 3, reps: '12-15', restSeconds: 60, notes: 'Keep body in rigid plank' },
      { name: 'Air Squats with Pulse', sets: 3, reps: '15-20', restSeconds: 60, notes: 'Full depth' },
      { name: 'Glute Bridges', sets: 3, reps: '15', restSeconds: 45, notes: 'Hold 2 seconds at top' },
      { name: 'Chair / Couch Tricep Dips', sets: 3, reps: '12', restSeconds: 60, notes: 'Elbows bend to 90 degrees' },
      { name: 'Superman Back Extensions', sets: 3, reps: '15', restSeconds: 45, notes: 'Strengthen lower back' },
      { name: 'Forearm Plank', sets: 3, reps: '45-60s', restSeconds: 60, notes: 'Tighten abs and squeeze glutes' },
    ],
  },
  {
    id: 'plan-office-mobility',
    title: 'Mobility & Spine Relief',
    subtitle: 'Fix posture and relieve desk fatigue',
    goal: 'maintain',
    mode: 'home',
    durationMin: 20,
    met: 3.0,
    difficulty: 'Beginner',
    emoji: '🧘',
    description: 'คลายกล้ามเนื้อคอ บ่า ไหล่ และหลัง แก้อาการ Office Syndrome และเพิ่มความยืดหยุ่น',
    exercises: [
      { name: 'Cat-Cow Spine Flow', sets: 2, reps: '10 breaths', restSeconds: 30 },
      { name: 'World’s Greatest Stretch', sets: 2, reps: '5 each side', restSeconds: 30 },
      { name: 'Doorway Chest Opener', sets: 2, reps: '30s hold', restSeconds: 20 },
      { name: 'Child’s Pose with Side Reach', sets: 2, reps: '45s', restSeconds: 30 },
      { name: 'Glute & Piriformis Stretch', sets: 2, reps: '30s each', restSeconds: 20 },
    ],
  },
  {
    id: 'plan-zone2-cardio',
    title: 'Zone 2 Steady State Cardio',
    subtitle: 'Mitochondrial health and cardiovascular base',
    goal: 'maintain',
    mode: 'cardio',
    durationMin: 40,
    met: 6.0,
    difficulty: 'Beginner',
    emoji: '🚴',
    description: 'ปั่นจักรยานหรือวิ่งเบาๆ ในระดับที่ยังพูดคุยได้ พัฒนาระบบหัวใจและการใช้ออกซิเจนระดับเซลล์',
    exercises: [
      { name: 'Zone 2 Steady Cycle / Jog', sets: 1, reps: '35 min', restSeconds: 60, notes: 'Keep heart rate at 60-70% max' },
      { name: 'Hamstring & Quad Cool Down', sets: 1, reps: '5 min', restSeconds: 0 },
    ],
  },
];

/**
 * คำนวณแคลอรี่ที่เผาผลาญด้วยสูตร MET (Metabolic Equivalent of Task)
 * Calories Burned = MET * Weight(kg) * (durationMin / 60)
 */
export function calculateMetCalories(met: number, userWeightKg: number, durationMin: number): number {
  const safeWeight = userWeightKg > 0 ? userWeightKg : 70; // fallback to 70kg
  const hours = durationMin / 60;
  return Math.round(met * safeWeight * hours);
}
