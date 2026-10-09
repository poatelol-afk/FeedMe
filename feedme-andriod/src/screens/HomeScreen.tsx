import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  RefreshControl, TouchableOpacity,
} from 'react-native';
import * as db from '../lib/db';
import { colors, spacing, radius, fontSize } from '../lib/theme';
import { useAuth } from '../hooks/useAuth';
import type { DiaryEntry, NutritionGoal, StreakData } from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const [goal, setGoal]   = useState<NutritionGoal | null>(null);
  const [today, setToday] = useState<DiaryEntry[]>([]);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [coins, setCoins]  = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [g, entries, s, c] = await Promise.all([
        db.getGoal(),
        db.getTodayDiary(),
        db.getStreak(),
        db.getCoins(),
      ]);
      setGoal(g);
      setToday(entries);
      setStreak(s);
      setCoins(c);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => { setRefreshing(true); load(); };

  // คำนวณ macros วันนี้
  const totalCal  = today.reduce((s, e) => s + (e.kcal ?? 0), 0);
  const totalProt = today.reduce((s, e) => s + (e.protein ?? 0), 0);
  const totalCarb = today.reduce((s, e) => s + (e.carbs ?? 0), 0);
  const totalFat  = today.reduce((s, e) => s + (e.fat ?? 0), 0);

  const calPct = goal ? Math.min((totalCal / goal.tdee) * 100, 100) : 0;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: spacing.lg + insets.top }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>สวัสดี 👋</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.signoutBtn}>
          <Text style={styles.signoutText}>ออก</Text>
        </TouchableOpacity>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatBox label="STREAK" value={`${streak?.current ?? 0}d`} emoji="🔥" />
        <StatBox label="BEST"   value={`${streak?.longest ?? 0}d`} emoji="🏆" />
        <StatBox label="COINS"  value={String(coins)}               emoji="🪙" />
      </View>

      {/* Calories card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>⚡ CALORIES TODAY</Text>
        <View style={styles.calRow}>
          <Text style={styles.calNum}>{Math.round(totalCal)}</Text>
          <Text style={styles.calOf}>/ {goal?.tdee ?? '—'} kcal</Text>
        </View>
        {/* Progress bar */}
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${calPct}%` as any }]} />
        </View>
      </View>

      {/* Macros card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>🥗 MACROS</Text>
        <View style={styles.macroRow}>
          <MacroBox label="Protein" value={totalProt} unit="g" color={colors.protein} />
          <MacroBox label="Carbs"   value={totalCarb} unit="g" color={colors.carbs}   />
          <MacroBox label="Fat"     value={totalFat}  unit="g" color={colors.fat}     />
        </View>
      </View>
    </ScrollView>
  );
}

function StatBox({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MacroBox({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <View style={styles.macroBox}>
      <Text style={[styles.macroVal, { color }]}>{Math.round(value)}</Text>
      <Text style={styles.macroUnit}>{unit}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: colors.bgBase },
  content:  { padding: spacing.lg, gap: spacing.md, paddingBottom: 32 },

  header:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  greeting:  { fontSize: fontSize.xl, fontWeight: '300', color: colors.textPrimary },
  email:     { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  signoutBtn: { padding: spacing.sm, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.borderMid },
  signoutText: { fontSize: fontSize.xs, color: colors.textMuted },

  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statBox:  {
    flex: 1, backgroundColor: colors.bgCard,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.borderSoft,
    alignItems: 'center', paddingVertical: spacing.lg,
  },
  statEmoji: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: fontSize.xl, fontWeight: '300', color: colors.textPrimary },
  statLabel: { fontSize: 9, color: colors.textMuted, letterSpacing: 1, marginTop: 2 },

  card:      {
    backgroundColor: colors.bgCard, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.borderSoft, padding: spacing.lg,
  },
  cardLabel: { fontSize: fontSize.xs, color: colors.textMuted, letterSpacing: 1, marginBottom: spacing.md },

  calRow:  { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, marginBottom: spacing.md },
  calNum:  { fontSize: 48, fontWeight: '200', color: colors.textPrimary, letterSpacing: -2 },
  calOf:   { fontSize: fontSize.sm, color: colors.textMuted, marginBottom: 10 },

  barBg:   { height: 4, backgroundColor: colors.bgElevated, borderRadius: 2 },
  barFill: { height: 4, backgroundColor: colors.accent, borderRadius: 2 },

  macroRow: { flexDirection: 'row', justifyContent: 'space-around' },
  macroBox: { alignItems: 'center' },
  macroVal: { fontSize: fontSize.xl, fontWeight: '300' },
  macroUnit: { fontSize: fontSize.xs, color: colors.textMuted },
  macroLabel: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
});
