import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert,
} from 'react-native';
import { colors, spacing, radius, fontSize, button3D } from '../lib/theme';
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
  const [selectedExId, setSelectedExId] = useState(EXERCISES[0].id);
  const ex = EXERCISES.find(e => e.id === selectedExId) ?? EXERCISES[0];

  const [sets, setSets] = useState<ExerciseSet[]>([
    { setNumber: 1, weightKg: ex.defaultWeight, reps: ex.targetReps[1], rpe: 8 },
    { setNumber: 2, weightKg: ex.defaultWeight, reps: ex.targetReps[1], rpe: 8 },
    { setNumber: 3, weightKg: ex.defaultWeight, reps: ex.targetReps[0], rpe: 8.5 },
  ]);

  const [loggedSessions, setLoggedSessions] = useState<Array<{ name: string; volume: number; cals: number }>>([]);

  const volumeLoad = sets.reduce((s, x) => s + x.weightKg * x.reps, 0);
  const avgRpe = sets.reduce((s, x) => s + x.rpe, 0) / Math.max(1, sets.length);
  const shouldIncrease = sets.every(s => s.reps >= ex.targetReps[1]) && avgRpe <= 8;

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

  const logSession = async () => {
    const duration = sets.length * 4;
    const cals = Math.round(duration * 6.5);
    const coinsEarned = 30;

    try {
      await db.addWorkout({
        workoutId: ex.id,
        workoutName: ex.name,
        emoji: '🏋️',
        duration,
        coinsEarned,
        caloriesBurned: cals,
      });
    } catch (e) {
      console.error(e);
    }

    setLoggedSessions([
      ...loggedSessions,
      { name: ex.name, volume: volumeLoad, cals },
    ]);

    Alert.alert(
      '🎉 เลเวลอัป สำเร็จ!',
      `บันทึก ${ex.name} ${sets.length} เซ็ต\n🔥 เผาผลาญ ~${cals} kcal\n🪙 ได้รับ +${coinsEarned} เหรียญ และ +50 XP!`
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.preTitle}>🏋️ MOVE & TRAIN</Text>
          <Text style={styles.title}>AI โค้ชยกเวท</Text>
        </View>
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>⚡ +50 XP</Text>
        </View>
      </View>

      {/* Exercise Selector Horizontal Scroll */}
      <Text style={styles.sectionLabel}>เลือกท่าฝึกประจำวัน</Text>
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

      {/* Sets Table Card (3D) */}
      <View style={styles.card3D}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>{ex.name}</Text>
            <Text style={styles.targetBadge}>เป้าหมาย: {ex.targetReps[0]}-{ex.targetReps[1]} reps ต่อเซ็ต</Text>
          </View>
        </View>

        {/* Table column header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.thText, { width: 34 }]}>เซ็ต</Text>
          <Text style={[styles.thText, { flex: 1, textAlign: 'center' }]}>น้ำหนัก (kg)</Text>
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

      {/* AI Progressive Overload Advice Card (3D) */}
      <View style={[styles.card3D, shouldIncrease ? styles.cardHighlightOverload : styles.cardNormalCoach]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Text style={{ fontSize: 18 }}>{shouldIncrease ? '🚀' : '🤖'}</Text>
          <Text style={[styles.cardTitle, { color: shouldIncrease ? '#2c6800' : colors.text }]}>
            {shouldIncrease ? 'พร้อมเพิ่มน้ำหนักแล้ว! (Overload)' : 'AI วิเคราะห์ความก้าวหน้า'}
          </Text>
        </View>

        <Text style={styles.adviceText}>
          {shouldIncrease
            ? `ยอดเยี่ยมมาก! คุณทำครบเป้า ${ex.targetReps[1]} reps ทุกเซ็ตด้วย RPE ≤ 8 ครั้งหน้าแนะนำให้เพิ่มน้ำหนักขึ้น +2.5 kg (${ex.defaultWeight + 2.5} kg) ได้เลย 🔥`
            : `ปัจจุบันทำได้เฉลี่ย RPE ${avgRpe.toFixed(1)} ขอแนะนำให้ฝึกน้ำหนักเดิม ${ex.defaultWeight} kg ให้ครบ ${ex.targetReps[1]} ครั้งอย่างสมบูรณ์แบบก่อนเพิ่มน้ำหนัก`}
        </Text>

        <View style={styles.statsRow}>
          <View>
            <Text style={styles.statLabel}>Total Volume</Text>
            <Text style={styles.statVal}>{volumeLoad} kg</Text>
          </View>
          <View>
            <Text style={styles.statLabel}>Avg RPE</Text>
            <Text style={styles.statVal}>{avgRpe.toFixed(1)}</Text>
          </View>
          <View>
            <Text style={styles.statLabel}>เผาผลาญประมาณ</Text>
            <Text style={styles.statVal}>~{Math.round(sets.length * 4 * 6.5)} kcal</Text>
          </View>
        </View>

        {/* Big 3D Duolingo Button */}
        <TouchableOpacity style={[styles.saveBtn3D, button3D.primary]} onPress={logSession}>
          <Text style={styles.saveBtnText}>บันทึกการออกกำลังกาย (+30 🪙 & 50 XP)</Text>
        </TouchableOpacity>
      </View>

      {/* Completed History Today */}
      {loggedSessions.length > 0 && (
        <View style={styles.card3D}>
          <Text style={[styles.cardTitle, { marginBottom: 10 }]}>🏆 บันทึกสำเร็จแล้ววันนี้</Text>
          {loggedSessions.map((s, idx) => (
            <View key={idx} style={styles.loggedItem}>
              <View>
                <Text style={{ fontSize: 14, color: colors.text, fontWeight: '700' }}>
                  🏋️ {s.name}
                </Text>
                <Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: '600', marginTop: 2 }}>
                  Volume: {s.volume} kg
                </Text>
              </View>
              <View style={styles.rewardTag}>
                <Text style={styles.rewardTagText}>-{s.cals} kcal · +30 🪙</Text>
              </View>
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
    marginBottom: spacing.xs,
  },
  preTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: colors.textMuted,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
  },
  xpBadge: {
    backgroundColor: '#ffffff',
    borderColor: '#ce82ff',
    borderWidth: 2,
    borderBottomWidth: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.md,
  },
  xpText: {
    fontSize: fontSize.xs,
    fontWeight: '800',
    color: '#a559d9',
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exScroll: { marginBottom: spacing.xs },
  exChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.md,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderBottomWidth: 3,
    marginRight: 8,
  },
  exChipActive: {
    backgroundColor: '#1cb0f6',
    borderColor: '#1899d6',
  },
  exChipText: {
    fontSize: fontSize.xs,
    color: colors.text,
    fontWeight: '700',
  },
  exChipTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },

  card3D: {
    backgroundColor: '#ffffff',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderBottomWidth: 4,
    padding: spacing.md,
  },
  cardHighlightOverload: {
    borderColor: '#a5ed6e',
    backgroundColor: '#f6fff0',
  },
  cardNormalCoach: {
    borderColor: '#bfe9ff',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: fontSize.base,
    fontWeight: '800',
    color: colors.text,
  },
  targetBadge: {
    fontSize: 11,
    color: '#1cb0f6',
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
    backgroundColor: '#f9f9f9',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#e5e5e5',
    padding: 8,
    marginBottom: 8,
    gap: 8,
  },
  setNumBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
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
    backgroundColor: '#ffffff',
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: '#d6d6d6',
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 6,
  },

  addBtn: {
    borderWidth: 2,
    borderColor: '#1cb0f6',
    borderStyle: 'dashed',
    borderRadius: radius.md,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  addBtnText: {
    fontSize: fontSize.xs,
    color: '#1cb0f6',
    fontWeight: '800',
  },

  adviceText: {
    fontSize: fontSize.xs,
    color: colors.text,
    lineHeight: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#e5e5e5',
    padding: 10,
    marginBottom: 14,
  },
  statLabel: { fontSize: 10, color: colors.textMuted, fontWeight: '700' },
  statVal: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
  },

  saveBtn3D: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#111111',
    fontWeight: '800',
    fontSize: fontSize.sm,
    letterSpacing: 0.3,
  },

  loggedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  rewardTag: {
    backgroundColor: '#fff7e6',
    borderColor: '#ff9600',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  rewardTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ff9600',
  },
});
