/**
 * AI Progressive Overload & Workout Engine
 * Inspired by "AI เปลี่ยนชีวิตการออกกำลังกายของผม" (ลงทุนDiary)
 */

export interface ExerciseSet {
  setNumber: number;
  weightKg: number;
  reps: number;
  rpe: number; // Rate of Perceived Exertion: 1 - 10 (8 = 2 reps in reserve)
}

export interface ExerciseHistory {
  exerciseId: string;
  exerciseName: string;
  category: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';
  targetRepRange: [number, number];
  previousSets: ExerciseSet[];
}

export interface OverloadInsight {
  nextRecommendedWeightKg: number;
  targetReps: number;
  status: 'increase' | 'maintain' | 'deload';
  message: string;
  volumeLoad: number; // sum(weight * reps)
}

export const POPULAR_EXERCISES = [
  { id: 'bench-press', name: 'Barbell Bench Press', category: 'chest', defaultWeight: 60, reps: [8, 10] as [number, number] },
  { id: 'incline-db-press', name: 'Incline Dumbbell Press', category: 'chest', defaultWeight: 24, reps: [8, 12] as [number, number] },
  { id: 'lat-pulldown', name: 'Lat Pulldown', category: 'back', defaultWeight: 55, reps: [10, 12] as [number, number] },
  { id: 'seated-cable-row', name: 'Seated Cable Row', category: 'back', defaultWeight: 50, reps: [10, 12] as [number, number] },
  { id: 'barbell-squat', name: 'Barbell Back Squat', category: 'legs', defaultWeight: 80, reps: [6, 8] as [number, number] },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift (RDL)', category: 'legs', defaultWeight: 70, reps: [8, 10] as [number, number] },
  { id: 'db-shoulder-press', name: 'Dumbbell Shoulder Press', category: 'shoulders', defaultWeight: 18, reps: [8, 12] as [number, number] },
  { id: 'lateral-raise', name: 'Dumbbell Lateral Raise', category: 'shoulders', defaultWeight: 8, reps: [12, 15] as [number, number] },
];

/**
 * Calculates progressive overload recommendation based on completed sets and RPE
 */
export function evaluateProgressiveOverload(
  sets: ExerciseSet[],
  targetRepRange: [number, number] = [8, 12]
): OverloadInsight {
  if (sets.length === 0) {
    return {
      nextRecommendedWeightKg: 20,
      targetReps: targetRepRange[0],
      status: 'maintain',
      message: 'เริ่มต้นบันทึกเซ็ตแรกเพื่อคำนวณ Progressive Overload',
      volumeLoad: 0,
    };
  }

  const volumeLoad = sets.reduce((sum, s) => sum + s.weightKg * s.reps, 0);
  const maxRepTarget = targetRepRange[1];
  const lastWeight = sets[sets.length - 1].weightKg;
  const avgRpe = sets.reduce((s, set) => s + set.rpe, 0) / sets.length;

  // Criteria for progressive overload:
  // All sets reached the upper rep target and average RPE <= 8 (still had reserves)
  const reachedUpperLimit = sets.every((s) => s.reps >= maxRepTarget);
  const comfortableIntensity = avgRpe <= 8;

  if (reachedUpperLimit && comfortableIntensity) {
    // Increment by 2.5kg for upper body / dumbbells, or 5kg for heavy compounds
    const increment = lastWeight >= 60 ? 5 : 2.5;
    const nextWeight = lastWeight + increment;
    return {
      nextRecommendedWeightKg: nextWeight,
      targetReps: targetRepRange[0],
      status: 'increase',
      message: `ยอดเยี่ยมมาก! คุณทำครบ ${maxRepTarget} ครั้งทุกเซ็ตที่ RPE เฉลี่ย ${avgRpe.toFixed(1)} แนะนำเพิ่มน้ำหนักเป็น ${nextWeight} kg ในรอบถัดไป (+${increment} kg)`,
      volumeLoad,
    };
  }

  if (avgRpe >= 9.5) {
    return {
      nextRecommendedWeightKg: lastWeight,
      targetReps: targetRepRange[0],
      status: 'maintain',
      message: `ความหนักอยู่ในระดับสูง (RPE ${avgRpe.toFixed(1)}) แนะนำรักษาน้ำหนักเดิม ${lastWeight} kg และควบคุมฟอร์มให้สมบูรณ์ก่อนเพิ่มน้ำหนัก`,
      volumeLoad,
    };
  }

  return {
    nextRecommendedWeightKg: lastWeight,
    targetReps: Math.min(maxRepTarget, Math.max(...sets.map((s) => s.reps)) + 1),
    status: 'maintain',
    message: `รักษาน้ำหนัก ${lastWeight} kg แต่ตั้งเป้าเพิ่มจำนวนครั้งให้แตะ ${maxRepTarget} ครั้งในเซ็ตถัดไป`,
    volumeLoad,
  };
}
