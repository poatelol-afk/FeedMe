import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert,
} from 'react-native';
import { colors, spacing, radius, fontSize } from '../lib/theme';

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

  const logSession = () => {
    const duration = sets.length * 4;
    const cals = Math.round(duration * 6.5);
    setLoggedSessions([
      ...loggedSessions,
      { name: ex.name, volume: volumeLoad, cals },
    ]);
    Alert.alert('บันทึกสำเร็จ!', `บันทึก ${ex.name} ${sets.length} เซ็ต\nเผาผลาญ ~${cals} kcal 🔥`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Move & Workout</Text>
          <Text style={styles.subtitle}>AI Progressive Overload Planner</Text>
        </View>
        <View style={styles.coinBadge}>
          <Text style={styles.coinText}>⚡ AI Coach</Text>
        </View>
      </View>

      {/* Exercise Selector Horizontal Scroll */}
      <Text style={styles.sectionLabel}>เลือกท่าออกกำลังกาย</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exScroll}>
        {EXERCISES.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.exChip, selectedExId === item.id && styles.exChipActive]}
            onPress={() => handleExChange(item.id)}
          >
            <Text style={[styles.exChipText, selectedExId === item.id && styles.exChipTextActive]}>
              🏋️ {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sets Table Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>บันทึกเซ็ตการฝึก</Text>
          <Text style={styles.targetBadge}>Target: {ex.targetReps[0]}–{ex.targetReps[1]} reps</Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.thText, { width: 36 }]}>Set</Text>
          <Text style={[styles.thText, { flex: 1 }]}>Weight (kg)</Text>
          <Text style={[styles.thText, { flex: 1 }]}>Reps</Text>
          <Text style={[styles.thText, { flex: 1 }]}>RPE (1-10)</Text>
        </View>

        {sets.map((set, idx) => (
          <View key={set.setNumber} style={styles.setRow}>
            <Text style={styles.setNum}>#{set.setNumber}</Text>

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
              onChangeText={(t) => updateSet(idx, 'reps', parseInt(t) || 0)}
            />

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(set.rpe)}
              onChangeText={(t) => updateSet(idx, 'rpe', parseFloat(t) || 8)}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={addSet}>
          <Text style={styles.addBtnText}>+ เพิ่มเซ็ตถัดไป</Text>
        </TouchableOpacity>
      </View>

      {/* AI Recommendation Card */}
      <View style={[styles.card, shouldIncrease && styles.cardHighlight]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Text style={{ fontSize: 16 }}>{shouldIncrease ? '🚀' : '📊'}</Text>
          <Text style={styles.cardTitle}>คำแนะนำ AI รอบถัดไป</Text>
        </View>

        <Text style={styles.adviceText}>
          {shouldIncrease
            ? `ยอดเยี่ยม! คุณทำครบ ${ex.targetReps[1]} ครั้งที่ RPE ${avgRpe.toFixed(1)} แนะนำเพิ่มน้ำหนักเป็น ${sets[sets.length - 1].weightKg + 2.5} kg ในรอบถัดไป`
            : `รักษาน้ำหนัก ${sets[sets.length - 1].weightKg} kg โฟกัสฟอร์มการเล่นและพยายามแตะ ${ex.targetReps[1]} reps ในทุกเซ็ต`}
        </Text>

        <View style={styles.statsRow}>
          <View>
            <Text style={styles.statLabel}>Volume Load รวม</Text>
            <Text style={styles.statVal}>{volumeLoad.toLocaleString()} kg</Text>
          </View>
          <View>
            <Text style={styles.statLabel}>RPE เฉลี่ย</Text>
            <Text style={[styles.statVal, { color: colors.gold }]}>{avgRpe.toFixed(1)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={logSession}>
          <Text style={styles.saveBtnText}>บันทึกกิจกรรมนี้ (+Coins & เผาผลาญแคลอรี)</Text>
        </TouchableOpacity>
      </View>

      {/* Completed History Today */}
      {loggedSessions.length > 0 && (
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { marginBottom: 10 }]}>กิจกรรมที่บันทึกแล้ววันนี้</Text>
          {loggedSessions.map((s, idx) => (
            <View key={idx} style={styles.loggedItem}>
              <Text style={{ fontSize: 13, color: colors.textPrimary, fontWeight: '500' }}>
                🏋️ {s.name}
              </Text>
              <Text style={{ fontSize: 11, color: colors.accent }}>
                Volume {s.volume} kg · -{s.cals} kcal
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgBase },
  content:   { padding: spacing.lg, paddingBottom: 100 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title:    { fontSize: fontSize.xl, fontWeight: '300', color: colors.textPrimary },
  subtitle: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },

  coinBadge: {
    backgroundColor: 'rgba(143,184,154,0.12)',
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: radius.md, borderWidth: 1, borderColor: 'rgba(143,184,154,0.25)',
  },
  coinText: { fontSize: fontSize.xs, fontWeight: '600', color: colors.accent },

  sectionLabel: { fontSize: fontSize.xs, color: colors.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  exScroll:     { marginBottom: spacing.lg },
  exChip: {
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: radius.md, backgroundColor: colors.bgElevated,
    borderWidth: 1, borderColor: colors.borderSoft, marginRight: 8,
  },
  exChipActive:     { backgroundColor: colors.accent, borderColor: colors.accent },
  exChipText:       { fontSize: fontSize.xs, color: colors.textSecondary },
  exChipTextActive: { color: '#0f1a10', fontWeight: '600' },

  card: {
    backgroundColor: colors.bgCard, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.borderSoft,
    padding: spacing.md, marginBottom: spacing.md,
  },
  cardHighlight: { borderColor: colors.accentMid, backgroundColor: 'rgba(143,184,154,0.04)' },

  cardHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  cardTitle:   { fontSize: fontSize.sm, fontWeight: '600', color: colors.textPrimary },
  targetBadge: { fontSize: fontSize.xs, color: colors.accent, fontWeight: '500' },

  tableHeader: { flexDirection: 'row', marginBottom: 8, paddingHorizontal: 4 },
  thText:      { fontSize: 10, color: colors.textMuted, textTransform: 'uppercase' },

  setRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgElevated, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.borderSoft,
    padding: 8, marginBottom: 6, gap: 8,
  },
  setNum: { width: 28, fontSize: fontSize.xs, color: colors.textMuted, fontWeight: '600' },
  input: {
    flex: 1, backgroundColor: colors.bgCard, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.borderSoft,
    color: colors.textPrimary, fontSize: fontSize.xs,
    textAlign: 'center', paddingVertical: 4,
  },

  addBtn: {
    borderWidth: 1, borderColor: colors.borderMid, borderStyle: 'dashed',
    borderRadius: radius.md, paddingVertical: 8, alignItems: 'center', marginTop: 4,
  },
  addBtnText: { fontSize: fontSize.xs, color: colors.textSecondary },

  adviceText: { fontSize: fontSize.xs, color: colors.textSecondary, lineHeight: 18, marginBottom: 12 },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: colors.bgElevated, borderRadius: radius.md,
    padding: 10, marginBottom: 14,
  },
  statLabel: { fontSize: 10, color: colors.textMuted },
  statVal:   { fontSize: fontSize.sm, fontWeight: '600', color: colors.textPrimary, marginTop: 2 },

  saveBtn: {
    backgroundColor: colors.accent, borderRadius: radius.md,
    paddingVertical: 10, alignItems: 'center',
  },
  saveBtnText: { color: '#0f1a10', fontWeight: '700', fontSize: fontSize.xs },

  loggedItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.borderSoft,
  },
});
