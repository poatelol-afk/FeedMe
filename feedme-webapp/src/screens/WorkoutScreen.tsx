import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, fontSize, button3D } from '../lib/theme';
import { computeProgressiveOverload } from '../lib/utils';
import { WORKOUT_TYPES, calculateWorkoutReward } from '../lib/workout-data';
import type { WorkoutEntry } from '../types';
import * as db from '../lib/db';

interface ExerciseSet {
  setNumber: number;
  weightKg: number;
  reps: number;
  rpe: number;
}

const EXERCISES = [
  { id: 'bench-press', name: 'Barbell Bench Press', defaultWeight: 60, targetReps: [8, 10] },
  { id: 'incline-db', name: 'Incline Dumbbell Press', defaultWeight: 24, targetReps: [8, 12] },
  { id: 'squat', name: 'Barbell Back Squat', defaultWeight: 80, targetReps: [6, 8] },
  { id: 'rdl', name: 'Romanian Deadlift (RDL)', defaultWeight: 70, targetReps: [8, 10] },
  { id: 'lat-pull', name: 'Lat Pulldown', defaultWeight: 55, targetReps: [10, 12] },
];

export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<'strength' | 'cardio'>('strength');
  const [selectedExId, setSelectedExId] = useState(EXERCISES[0].id);
  const ex = EXERCISES.find(e => e.id === selectedExId) ?? EXERCISES[0];

  const [sets, setSets] = useState<ExerciseSet[]>([
    { setNumber: 1, weightKg: ex.defaultWeight, reps: ex.targetReps[1], rpe: 8 },
    { setNumber: 2, weightKg: ex.defaultWeight, reps: ex.targetReps[1], rpe: 8 },
    { setNumber: 3, weightKg: ex.defaultWeight, reps: ex.targetReps[0], rpe: 8.5 },
  ]);

  const [selectedCardioId, setSelectedCardioId] = useState(WORKOUT_TYPES[0].id);
  const [cardioMinutes, setCardioMinutes] = useState('30');
  const [todayWorkouts, setTodayWorkouts] = useState<WorkoutEntry[]>([]);
  const [saving, setSaving] = useState(false);

  const loadWorkouts = useCallback(async () => {
    try {
      const list = await db.getTodayWorkouts();
      setTodayWorkouts(list);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    void loadWorkouts();
  }, [loadWorkouts]);

  const overload = computeProgressiveOverload(sets, ex.targetReps[1], ex.defaultWeight);

  const handleExChange = (id: string) => {
    setSelectedExId(id);
    const chosen = EXERCISES.find(e => e.id === id) ?? EXERCISES[0];
    setSets([
      { setNumber: 1, weightKg: chosen.defaultWeight, reps: chosen.targetReps[1], rpe: 8 },
      { setNumber: 2, weightKg: chosen.defaultWeight, reps: chosen.targetReps[1], rpe: 8 },
      { setNumber: 3, weightKg: chosen.defaultWeight, reps: chosen.targetReps[0], rpe: 8.5 },
    ]);
  };

  const updateSet = (index: number, field: keyof ExerciseSet, val: number) => {
    const copy = [...sets];
    copy[index] = { ...copy[index], [field]: val };
    setSets(copy);
  };

  const addSet = () => {
    const last = sets[sets.length - 1];
    setSets([
      ...sets,
      {
        setNumber: sets.length + 1,
        weightKg: last ? last.weightKg : ex.defaultWeight,
        reps: last ? last.reps : ex.targetReps[0],
        rpe: 8,
      },
    ]);
  };

  const logStrengthSession = async () => {
    setSaving(true);
    const duration = sets.length * 4;
    const cals = Math.round(duration * 6.5);
    const coinsEarned = 30;

    try {
      await db.addWorkout({
        workoutId: ex.id,
        workoutName: `${ex.name} (${sets.length} sets · max ${overload.maxWeight}kg)`,
        emoji: '🏋️',
        duration,
        coinsEarned,
        caloriesBurned: cals,
      });
      await loadWorkouts();
      Alert.alert(
        'บันทึกเวทเทรนนิ่งสำเร็จ! ⚡',
        `บันทึก ${ex.name} (${sets.length} เซ็ต)\n🔥 เผาผลาญ ~${cals} kcal\n🎯 เป้าครั้งหน้า: ${overload.nextWeight} kg`
      );
    } catch (e: any) {
      Alert.alert('เกิดข้อผิดพลาดในการบันทึก', e?.message || 'ไม่สามารถบันทึกการออกกำลังกายได้');
    } finally {
      setSaving(false);
    }
  };

  const logCardioSession = async () => {
    const mins = parseInt(cardioMinutes, 10) || 0;
    if (mins <= 0) {
      Alert.alert('กรุณาระบุเวลาออกกำลังกาย (นาที)');
      return;
    }
    setSaving(true);
    try {
      const reward = calculateWorkoutReward(selectedCardioId, mins, 70);
      if (!reward) return;
      await db.addWorkout({
        workoutId: reward.workout.id,
        workoutName: reward.workout.name,
        emoji: reward.workout.emoji,
        duration: mins,
        coinsEarned: reward.coinsEarned,
        caloriesBurned: reward.caloriesBurned,
      });
      await loadWorkouts();
      Alert.alert(
        'บันทึกคาร์ดิโอสำเร็จ! 🔥',
        `${reward.workout.emoji} ${reward.workout.name} (${mins} นาที)\nเผาผลาญ -${reward.caloriesBurned} kcal · ได้รับ +${reward.coinsEarned} 🪙`
      );
    } catch (e: any) {
      Alert.alert('เกิดข้อผิดพลาดในการบันทึก', e?.message || 'ไม่สามารถบันทึกได้');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: spacing.md + insets.top }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.preTitle}>⚡ FEEDME AI · PROGRESSIVE OVERLOAD &amp; CARDIO</Text>
          <Text style={styles.title}>โค้ชฝึกซ้อม &amp; เผาผลาญ</Text>
        </View>
      </View>

      {/* Mode Switcher */}
      <View style={styles.modeSwitchRow}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'strength' && styles.modeBtnActive]}
          onPress={() => setMode('strength')}
        >
          <Text style={[styles.modeBtnText, mode === 'strength' && styles.modeBtnTextActive]}>
            🏋️ เวทเทรนนิ่ง (Overload)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'cardio' && styles.modeBtnActive]}
          onPress={() => setMode('cardio')}
        >
          <Text style={[styles.modeBtnText, mode === 'cardio' && styles.modeBtnTextActive]}>
            🏃 คาร์ดิโอ &amp; กีฬา
          </Text>
        </TouchableOpacity>
      </View>

      {mode === 'strength' ? (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exScroll}>
            {EXERCISES.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.exChip, selectedExId === item.id && styles.exChipActive]}
                onPress={() => handleExChange(item.id)}
              >
                <Text style={[styles.exChipText, selectedExId === item.id && styles.exChipTextActive]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.bentoCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>{ex.name}</Text>
                <Text style={styles.targetBadge}>เป้าหมาย: {ex.targetReps[0]}–{ex.targetReps[1]} reps ต่อเซ็ต</Text>
              </View>
            </View>

            <View style={styles.tableHeader}>
              <Text style={[styles.thText, { width: 34 }]}>เซ็ต</Text>
              <Text style={[styles.thText, { flex: 1, textAlign: 'center' }]}>น้ำหนักจริง (kg)</Text>
              <Text style={[styles.thText, { flex: 1, textAlign: 'center' }]}>จำนวนครั้ง (Reps)</Text>
              <Text style={[styles.thText, { flex: 1, textAlign: 'center' }]}>RPE</Text>
            </View>

            {sets.map((set, idx) => (
              <View key={set.setNumber} style={styles.setRow}>
                <View style={styles.setNumBox}>
                  <Text style={styles.setNum}>{set.setNumber}</Text>
                </View>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(set.weightKg)}
                  onChangeText={(t) => updateSet(idx, 'weightKg', parseFloat(t) || 0)}
                />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(set.reps)}
                  onChangeText={(t) => updateSet(idx, 'reps', parseInt(t, 10) || 0)}
                />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(set.rpe)}
                  onChangeText={(t) => updateSet(idx, 'rpe', parseFloat(t) || 0)}
                />
              </View>
            ))}

            <TouchableOpacity style={styles.addBtn} onPress={addSet}>
              <Text style={styles.addBtnText}>+ เพิ่มอีก 1 เซ็ต</Text>
            </TouchableOpacity>
          </View>

          {/* AI Progressive Overload Advice Card */}
          <View style={styles.heroOverloadCard}>
            <Text style={styles.overloadBadge}>
              {overload.shouldIncrease ? '🚀 PROGRESSIVE OVERLOAD UNLOCKED' : '🎯 MAINTAIN & BUILD FORM'}
            </Text>
            <Text style={styles.overloadTitle}>
              {overload.shouldIncrease
                ? `เพิ่มน้ำหนักครั้งหน้า +2.5 kg → ${overload.nextWeight} kg`
                : `รักษาน้ำหนักฝึกที่ ${overload.maxWeight} kg จนครบ ${ex.targetReps[1]} reps ทุกเซ็ต`}
            </Text>
            <Text style={styles.overloadDesc}>
              {overload.shouldIncrease
                ? `คุณทำครบ ${ex.targetReps[1]} reps ทุกเซ็ตที่น้ำหนักสูงสุด ${overload.maxWeight} kg ด้วย RPE เฉลี่ย ${overload.avgRpe}`
                : `Volume รวม ${overload.totalVolume} kg · RPE เฉลี่ย ${overload.avgRpe}`}
            </Text>

            <TouchableOpacity
              style={[styles.saveBtn, button3D.primary, saving && { opacity: 0.6 }]}
              onPress={logStrengthSession}
              disabled={saving}
            >
              <Text style={styles.saveBtnText}>
                {saving ? 'กำลังบันทึก...' : 'บันทึกเซสชันเวทเทรนนิ่ง (+30 🪙)'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.bentoCard}>
          <Text style={styles.cardTitle}>เลือกกิจกรรมคาร์ดิโอ / กีฬา</Text>
          <View style={styles.cardioGrid}>
            {WORKOUT_TYPES.slice(0, 8).map((w) => (
              <TouchableOpacity
                key={w.id}
                style={[styles.cardioChip, selectedCardioId === w.id && styles.cardioChipActive]}
                onPress={() => setSelectedCardioId(w.id)}
              >
                <Text style={{ fontSize: 22 }}>{w.emoji}</Text>
                <Text style={[styles.cardioChipName, selectedCardioId === w.id && { color: colors.primaryDark }]}>
                  {w.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.durationRow}>
            <Text style={styles.cardTitle}>ระยะเวลา (นาที):</Text>
            <TextInput
              style={styles.durationInput}
              keyboardType="numeric"
              value={cardioMinutes}
              onChangeText={setCardioMinutes}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, button3D.primary, saving && { opacity: 0.6 }]}
            onPress={logCardioSession}
            disabled={saving}
          >
            <Text style={styles.saveBtnText}>บันทึกคาร์ดิโอ &amp; หักลบแคลอรีสุทธิ</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Completed Sessions Today */}
      {todayWorkouts.length > 0 && (
        <View style={styles.bentoCard}>
          <Text style={[styles.cardTitle, { marginBottom: 10 }]}>🏆 เซสชันที่บันทึกแล้ววันนี้</Text>
          {todayWorkouts.map((s, idx) => (
            <View key={s.id || idx} style={styles.loggedItem}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.text, fontWeight: '700' }}>
                  {s.emoji} {s.workoutName}
                </Text>
                <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                  {s.duration} นาที · เผาผลาญ -{s.caloriesBurned} kcal
                </Text>
              </View>
              <Text style={styles.rewardTagText}>+{s.coinsEarned} 🪙</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content:   { padding: spacing.md, paddingBottom: 60, gap: spacing.md },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  preTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
    color: colors.primaryDark,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
  },

  modeSwitchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  modeBtnActive: {
    backgroundColor: colors.heroBg,
    borderColor: colors.heroBg,
  },
  modeBtnText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  modeBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  exScroll: { marginBottom: 4 },
  exChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  exChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  exChipText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  exChipTextActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },

  bentoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  cardHeader: {
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: fontSize.base,
    fontWeight: '800',
    color: colors.text,
  },
  targetBadge: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '700',
    marginTop: 2,
  },

  tableHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 4,
    gap: 8,
  },
  thText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },

  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 8,
    marginBottom: 8,
    gap: 8,
  },
  setNumBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setNum: {
    fontSize: fontSize.xs,
    color: colors.text,
    fontWeight: '800',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderMid,
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 6,
  },

  addBtn: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  addBtnText: {
    fontSize: fontSize.xs,
    color: colors.accent,
    fontWeight: '800',
  },

  heroOverloadCard: {
    backgroundColor: colors.heroBg,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  overloadBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#34D399',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  overloadTitle: {
    fontSize: fontSize.base,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  overloadDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: spacing.md,
  },

  cardioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: spacing.sm,
  },
  cardioChip: {
    width: '48%',
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardioChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  cardioChipName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    flexShrink: 1,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.sm,
  },
  durationInput: {
    width: 100,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderMid,
    borderRadius: radius.sm,
    paddingVertical: 8,
    textAlign: 'center',
    fontSize: fontSize.base,
    fontWeight: '800',
    color: colors.text,
  },

  saveBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: fontSize.sm,
  },

  loggedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rewardTagText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.coinsDark,
  },
});
