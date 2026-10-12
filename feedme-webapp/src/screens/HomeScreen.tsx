import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  RefreshControl, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as db from '../lib/db';
import { colors, spacing, radius, fontSize, button3D } from '../lib/theme';
import { calculateFitnessLevel } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';
import type { DiaryEntry, NutritionGoal, Quest, StreakData, WorkoutEntry } from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [goal, setGoal] = useState<NutritionGoal | null>(null);
  const [today, setToday] = useState<DiaryEntry[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [coins, setCoins] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [g, entries, w, q, s, c] = await Promise.all([
        db.getGoal(),
        db.getTodayDiary(),
        db.getTodayWorkouts(),
        db.getQuests(),
        db.getStreak(),
        db.getCoins(),
      ]);
      setGoal(g);
      setToday(entries);
      setWorkouts(w);
      setQuests(q);
      setStreak(s);
      setCoins(c);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const onRefresh = () => { setRefreshing(true); void load(); };

  const totalCal  = today.reduce((s, e) => s + (e.kcal ?? 0), 0);
  const totalBurned = workouts.reduce((s, w) => s + (w.caloriesBurned ?? 0), 0);
  const netCal = Math.max(0, Math.round(totalCal - totalBurned));

  const totalProt = today.reduce((s, e) => s + (e.protein ?? 0), 0);
  const totalCarb = today.reduce((s, e) => s + (e.carbs ?? 0), 0);
  const totalFat  = today.reduce((s, e) => s + (e.fat ?? 0), 0);

  const tdee = goal?.tdee ?? 2200;
  const remainingCal = Math.max(0, tdee - netCal);
  const calPct = Math.min((netCal / Math.max(1, tdee)) * 100, 100);

  const targetProt = goal?.protein.g ?? 165;
  const targetCarb = goal?.carbs.g ?? 220;
  const targetFat  = goal?.fat.g ?? 73;

  const completedQuests = quests.filter(q => q.isCompleted).length;
  const fitnessLevel = calculateFitnessLevel(streak?.current ?? 1, completedQuests, workouts.length);

  const daysOfWeek = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
  const todayIndex = (new Date().getDay() + 6) % 7;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: spacing.md + insets.top }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      {/* Top Modern Bento Header */}
      <View style={styles.topHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.brandLabel}>⚡ FEEDME AI · BENTO ATHLETIC</Text>
          <Text style={styles.greetingTitle}>สวัสดีคุณ {user?.email?.split('@')[0] || 'Athlete'} 👋</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.pillStreak}>
            <Text style={styles.pillEmoji}>🔥</Text>
            <Text style={styles.pillTextStreak}>{streak?.current ?? 1}d</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Shop')} style={styles.pillCoins}>
            <Text style={styles.pillEmoji}>🪙</Text>
            <Text style={styles.pillTextCoins}>{coins}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.pillLevel}>
            <Text style={styles.pillTextLevel}>Lv.{fitnessLevel.level} {fitnessLevel.title}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dark Midnight Navy Hero Bento Card: Net Energy Balance */}
      <View style={styles.heroCard}>
        <View style={styles.heroHeaderRow}>
          <View>
            <Text style={styles.heroPreTitle}>LIVE NET ENERGY BALANCE</Text>
            <Text style={styles.heroSubTitle}>Food In − Workout Burn vs TDEE</Text>
          </View>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>{remainingCal.toLocaleString()} kcal left</Text>
          </View>
        </View>

        <View style={styles.heroMainRow}>
          <View>
            <Text style={styles.heroBigNum}>{netCal.toLocaleString()}</Text>
            <Text style={styles.heroBigUnit}>/ {tdee.toLocaleString()} Net kcal</Text>
          </View>

          <View style={styles.heroBreakdownCol}>
            <View style={styles.heroBreakdownItem}>
              <Text style={styles.heroBreakdownLabel}>🍱 ทานแล้ว</Text>
              <Text style={[styles.heroBreakdownVal, { color: '#38BDF8' }]}>+{Math.round(totalCal)} kcal</Text>
            </View>
            <View style={styles.heroBreakdownItem}>
              <Text style={styles.heroBreakdownLabel}>🔥 เผาผลาญ</Text>
              <Text style={[styles.heroBreakdownVal, { color: '#34D399' }]}>-{Math.round(totalBurned)} kcal</Text>
            </View>
            <View style={styles.heroBreakdownItem}>
              <Text style={styles.heroBreakdownLabel}>⚡ XP สะสม</Text>
              <Text style={[styles.heroBreakdownVal, { color: '#FBBF24' }]}>{fitnessLevel.xp} XP</Text>
            </View>
          </View>
        </View>

        <View style={styles.heroProgressTrack}>
          <View style={[styles.heroProgressFill, { width: `${calPct}%` as any }]} />
        </View>
      </View>

      {/* Macros Triple Bento Grid */}
      <View style={styles.bentoCard}>
        <Text style={styles.cardPreTitle}>🥗 MACRONUTRIENT TARGETS</Text>
        <View style={styles.macroColumns}>
          <View style={styles.macroBox}>
            <Text style={[styles.macroLabel, { color: colors.protein }]}>โปรตีน</Text>
            <Text style={styles.macroValText}>{Math.round(totalProt)}g</Text>
            <Text style={styles.macroTargetText}>/ {targetProt}g</Text>
            <View style={styles.miniBarTrack}>
              <View style={[styles.miniBarFill, { backgroundColor: colors.protein, width: `${Math.min((totalProt / Math.max(1, targetProt)) * 100, 100)}%` as any }]} />
            </View>
          </View>

          <View style={styles.macroBox}>
            <Text style={[styles.macroLabel, { color: colors.carbs }]}>คาร์บ</Text>
            <Text style={styles.macroValText}>{Math.round(totalCarb)}g</Text>
            <Text style={styles.macroTargetText}>/ {targetCarb}g</Text>
            <View style={styles.miniBarTrack}>
              <View style={[styles.miniBarFill, { backgroundColor: colors.carbs, width: `${Math.min((totalCarb / Math.max(1, targetCarb)) * 100, 100)}%` as any }]} />
            </View>
          </View>

          <View style={styles.macroBox}>
            <Text style={[styles.macroLabel, { color: colors.fat }]}>ไขมัน</Text>
            <Text style={styles.macroValText}>{Math.round(totalFat)}g</Text>
            <Text style={styles.macroTargetText}>/ {targetFat}g</Text>
            <View style={styles.miniBarTrack}>
              <View style={[styles.miniBarFill, { backgroundColor: colors.fat, width: `${Math.min((totalFat / Math.max(1, targetFat)) * 100, 100)}%` as any }]} />
            </View>
          </View>
        </View>
      </View>

      {/* Weekly Consistency Bento Card */}
      <View style={styles.bentoCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardMainTitle}>🔥 วินัยความต่อเนื่อง 7 วัน</Text>
          <Text style={styles.streakHighlight}>{streak?.current ?? 1} วันติดกัน</Text>
        </View>
        <View style={styles.weekCirclesRow}>
          {daysOfWeek.map((day, idx) => {
            const isCompleted = idx < todayIndex || (idx === todayIndex && (today.length > 0 || workouts.length > 0));
            const isToday = idx === todayIndex;
            return (
              <View key={day} style={styles.dayCircleCol}>
                <View style={[
                  styles.dayCircle,
                  isCompleted && styles.dayCircleCompleted,
                  isToday && !isCompleted && styles.dayCircleToday,
                ]}>
                  <Text style={[styles.dayCircleEmoji, isCompleted && { color: '#FFFFFF' }]}>
                    {isCompleted ? '✓' : isToday ? '⚡' : ''}
                  </Text>
                </View>
                <Text style={[styles.dayCircleLabel, isToday && styles.dayCircleLabelToday]}>{day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Daily Missions (Scale-Free) */}
      <View style={styles.bentoCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardMainTitle}>🎯 ภารกิจสุขภาพประจำวัน</Text>
          <Text style={styles.questSubtitle}>รับเหรียญ &amp; XP</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Log')} style={styles.questItem}>
          <Text style={styles.questEmoji}>📸</Text>
          <View style={styles.questInfo}>
            <Text style={styles.questName}>บันทึกมื้ออาหารด้วย AI หรือสัดส่วนทัพพี/จาน</Text>
            <Text style={styles.questReward}>+20 🪙 เหรียญรางวัล</Text>
          </View>
          <View style={[styles.questActionBtn, today.length > 0 && styles.questActionBtnDone]}>
            <Text style={[styles.questActionText, today.length > 0 && { color: '#FFFFFF' }]}>
              {today.length > 0 ? 'สำเร็จ ✓' : 'บันทึก'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Workout')} style={styles.questItem}>
          <Text style={styles.questEmoji}>🏋️</Text>
          <View style={styles.questInfo}>
            <Text style={styles.questName}>ฝึกเวท Progressive Overload หรือคาร์ดิโอ</Text>
            <Text style={styles.questReward}>+30 🪙 เหรียญรางวัล</Text>
          </View>
          <View style={[styles.questActionBtn, workouts.length > 0 && styles.questActionBtnDone]}>
            <Text style={[styles.questActionText, workouts.length > 0 && { color: '#FFFFFF' }]}>
              {workouts.length > 0 ? 'สำเร็จ ✓' : 'เริ่มฝึก'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.questItem}>
          <Text style={styles.questEmoji}>📉</Text>
          <View style={styles.questInfo}>
            <Text style={styles.questName}>อัปเดตน้ำหนักตัว (kg) และเป้าหมาย TDEE</Text>
            <Text style={styles.questReward}>+15 🪙 เหรียญรางวัล</Text>
          </View>
          <View style={styles.questActionBtn}>
            <Text style={styles.questActionText}>อัปเดต</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Quick Action Row */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.bigBtn, button3D.primary]}
          onPress={() => navigation.navigate('Log')}
        >
          <Text style={styles.bigBtnTextPrimary}>+ บันทึกอาหาร (AI)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bigBtn, button3D.accent]}
          onPress={() => navigation.navigate('Workout')}
        >
          <Text style={styles.bigBtnTextAccent}>🏋️ เริ่มฝึกซ้อม</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={signOut} style={styles.logoutBtn}>
        <Text style={styles.logoutText}>ออกจากระบบ ({user?.email})</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 40 },

  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  brandLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 0.7,
  },
  greetingTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  pillStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 3,
  },
  pillTextStreak: { fontSize: 11, fontWeight: '800', color: colors.streakDark },
  pillCoins: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 3,
  },
  pillTextCoins: { fontSize: 11, fontWeight: '800', color: colors.coinsDark },
  pillLevel: {
    backgroundColor: colors.heroBg,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillTextLevel: { fontSize: 10, fontWeight: '800', color: '#34D399' },
  pillEmoji: { fontSize: 12 },

  // Hero Bento Card
  heroCard: {
    backgroundColor: colors.heroBg,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.22)',
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  heroPreTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.8,
  },
  heroSubTitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  heroBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heroBadgeText: { fontSize: 11, fontWeight: '800', color: '#34D399' },
  heroMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heroBigNum: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  heroBigUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  heroBreakdownCol: {
    backgroundColor: colors.heroElevated,
    borderRadius: radius.md,
    padding: 10,
    gap: 5,
    minWidth: 145,
  },
  heroBreakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  heroBreakdownLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  heroBreakdownVal: { fontSize: 11, fontWeight: '800' },
  heroProgressTrack: {
    height: 8,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  heroProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 999,
  },

  // Bento Card
  bentoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardPreTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  cardMainTitle: {
    fontSize: fontSize.base,
    fontWeight: '800',
    color: colors.text,
  },
  streakHighlight: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryDark,
  },

  macroColumns: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  macroBox: {
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 10,
    alignItems: 'center',
  },
  macroLabel: { fontSize: 11, fontWeight: '800' },
  macroValText: { fontSize: fontSize.base, fontWeight: '800', color: colors.text, marginTop: 2 },
  macroTargetText: { fontSize: 10, color: colors.textMuted, fontWeight: '600' },
  miniBarTrack: {
    width: '100%',
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 999,
    marginTop: 6,
    overflow: 'hidden',
  },
  miniBarFill: { height: '100%', borderRadius: 999 },

  weekCirclesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  dayCircleCol: { alignItems: 'center', gap: 4 },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  dayCircleToday: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.primarySoft,
  },
  dayCircleEmoji: { fontSize: 12, fontWeight: '800', color: colors.primaryDark },
  dayCircleLabel: { fontSize: 10, fontWeight: '700', color: colors.textMuted },
  dayCircleLabelToday: { color: colors.primaryDark, fontWeight: '800' },

  questSubtitle: { fontSize: 11, fontWeight: '700', color: colors.coinsDark },
  questItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 10,
  },
  questEmoji: { fontSize: 22 },
  questInfo: { flex: 1 },
  questName: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text },
  questReward: { fontSize: 11, fontWeight: '700', color: colors.coinsDark, marginTop: 1 },
  questActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderMid,
    borderRadius: radius.sm,
  },
  questActionBtnDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  questActionText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.text,
  },

  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  bigBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigBtnTextPrimary: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bigBtnTextAccent: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  logoutBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  logoutText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: '600',
  },
});
