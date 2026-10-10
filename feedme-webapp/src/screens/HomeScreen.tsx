import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  RefreshControl, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as db from '../lib/db';
import { colors, spacing, radius, fontSize, button3D } from '../lib/theme';
import { useAuth } from '../hooks/useAuth';
import type { DiaryEntry, NutritionGoal, StreakData } from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<any>();
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

  const tdee = goal?.tdee ?? 2000;
  const calPct = Math.min((totalCal / tdee) * 100, 100);

  const targetProt = goal?.protein.g ?? 140;
  const targetCarb = goal?.carbs.g ?? 200;
  const targetFat  = goal?.fat.g ?? 60;

  // Day of week tracker (Duolingo style)
  const daysOfWeek = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
  const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: spacing.md + insets.top }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
    >
      {/* ── Gamified Status Bar (Duolingo Header) ── */}
      <View style={styles.topStatusHeader}>
        <View style={styles.userGreetingBox}>
          <Text style={styles.greetingTitle}>สวัสดีคุณ {user?.email?.split('@')[0] || 'นักกีฬา'} 👋</Text>
          <Text style={styles.levelSubtitle}>Level 3 · Apprentice Athlete</Text>
        </View>

        <View style={styles.statsRow}>
          {/* Streak Flame */}
          <View style={styles.badgeStreak}>
            <Text style={styles.badgeEmoji}>🔥</Text>
            <Text style={styles.badgeTextStreak}>{streak?.current ?? 1}</Text>
          </View>

          {/* Gems / Coins */}
          <TouchableOpacity onPress={() => navigation.navigate('Shop')} style={styles.badgeCoins}>
            <Text style={styles.badgeEmoji}>🪙</Text>
            <Text style={styles.badgeTextCoins}>{coins}</Text>
          </TouchableOpacity>

          {/* Hearts */}
          <View style={styles.badgeHearts}>
            <Text style={styles.badgeEmoji}>❤️</Text>
            <Text style={styles.badgeTextHearts}>5</Text>
          </View>
        </View>
      </View>

      {/* ── Weekly Streak Trail (Duolingo Path Style) ── */}
      <View style={styles.streakCard}>
        <View style={styles.streakCardHeader}>
          <Text style={styles.streakTitle}>🔥 สถิติความต่อเนื่อง 7 วัน</Text>
          <Text style={styles.streakDaysText}>{streak?.current ?? 1} วันติดกันแล้ว!</Text>
        </View>
        <View style={styles.weekCirclesRow}>
          {daysOfWeek.map((day, idx) => {
            const isCompleted = idx < todayIndex || (idx === todayIndex && today.length > 0);
            const isToday = idx === todayIndex;
            return (
              <View key={day} style={styles.dayCircleCol}>
                <View style={[
                  styles.dayCircle,
                  isCompleted && styles.dayCircleCompleted,
                  isToday && !isCompleted && styles.dayCircleToday,
                ]}>
                  <Text style={[
                    styles.dayCircleEmoji,
                    isCompleted && { color: '#ffffff' }
                  ]}>
                    {isCompleted ? '✓' : isToday ? '🔥' : ''}
                  </Text>
                </View>
                <Text style={[styles.dayCircleLabel, isToday && styles.dayCircleLabelToday]}>{day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* ── Calories Today (Main Duolingo 3D Card) ── */}
      <View style={styles.card3D}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={styles.cardPreTitle}>⚡ พลังงานประจำวัน</Text>
            <Text style={styles.cardMainTitle}>เป้าหมายแคลอรี่</Text>
          </View>
          <View style={styles.xpPill}>
            <Text style={styles.xpPillText}>+50 XP</Text>
          </View>
        </View>

        <View style={styles.calBigRow}>
          <Text style={styles.calBigNum}>{Math.round(totalCal)}</Text>
          <Text style={styles.calBigSlash}>/</Text>
          <Text style={styles.calBigTarget}>{tdee} kcal</Text>
        </View>

        {/* 3D Progress Bar */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${calPct}%` as any }]} />
        </View>
        <Text style={styles.progressPercentText}>{Math.round(calPct)}% ของเป้าหมายประจำวัน</Text>
      </View>

      {/* ── Macros 3D Triple Grid ── */}
      <View style={styles.card3D}>
        <Text style={styles.cardPreTitle}>🥗 สารอาหารหลัก (MACROS)</Text>
        <View style={styles.macroColumns}>
          {/* Protein */}
          <View style={[styles.macroPillBox, { borderColor: '#1cb0f6' }]}>
            <Text style={[styles.macroLabel, { color: '#1cb0f6' }]}>โปรตีน</Text>
            <Text style={styles.macroValText}>{Math.round(totalProt)}g</Text>
            <Text style={styles.macroTargetText}>เป้า {targetProt}g</Text>
            <View style={styles.miniBarTrack}>
              <View style={[styles.miniBarFill, { backgroundColor: '#1cb0f6', width: `${Math.min((totalProt / targetProt) * 100, 100)}%` as any }]} />
            </View>
          </View>

          {/* Carbs */}
          <View style={[styles.macroPillBox, { borderColor: '#ffc800' }]}>
            <Text style={[styles.macroLabel, { color: '#cca000' }]}>คาร์บ</Text>
            <Text style={styles.macroValText}>{Math.round(totalCarb)}g</Text>
            <Text style={styles.macroTargetText}>เป้า {targetCarb}g</Text>
            <View style={styles.miniBarTrack}>
              <View style={[styles.miniBarFill, { backgroundColor: '#ffc800', width: `${Math.min((totalCarb / targetCarb) * 100, 100)}%` as any }]} />
            </View>
          </View>

          {/* Fat */}
          <View style={[styles.macroPillBox, { borderColor: '#ff9600' }]}>
            <Text style={[styles.macroLabel, { color: '#ff9600' }]}>ไขมัน</Text>
            <Text style={styles.macroValText}>{Math.round(totalFat)}g</Text>
            <Text style={styles.macroTargetText}>เป้า {targetFat}g</Text>
            <View style={styles.miniBarTrack}>
              <View style={[styles.miniBarFill, { backgroundColor: '#ff9600', width: `${Math.min((totalFat / targetFat) * 100, 100)}%` as any }]} />
            </View>
          </View>
        </View>
      </View>

      {/* ── Daily Quests (Duolingo Missions) ── */}
      <View style={styles.card3D}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardMainTitle}>🎯 ภารกิจรับเหรียญวันนี้</Text>
          <Text style={styles.questSubtitle}>รับเพิ่มสูงสุด +65 🪙</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.questItem}>
          <Text style={styles.questEmoji}>⚖️</Text>
          <View style={styles.questInfo}>
            <Text style={styles.questName}>ชั่งน้ำหนักเช้านี้ด้วย BLE Scale</Text>
            <Text style={styles.questReward}>+15 🪙 เหรียญรางวัล</Text>
          </View>
          <View style={styles.questActionBtn}>
            <Text style={styles.questActionText}>ทำเลย</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Log')} style={styles.questItem}>
          <Text style={styles.questEmoji}>🥗</Text>
          <View style={styles.questInfo}>
            <Text style={styles.questName}>บันทึกอาหารมื้อแรกของวัน</Text>
            <Text style={styles.questReward}>+20 🪙 เหรียญรางวัล</Text>
          </View>
          <View style={[styles.questActionBtn, today.length > 0 && styles.questActionBtnDone]}>
            <Text style={[styles.questActionText, today.length > 0 && { color: '#ffffff' }]}>
              {today.length > 0 ? 'สำเร็จ ✓' : 'ทำเลย'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Workout')} style={styles.questItem}>
          <Text style={styles.questEmoji}>💪</Text>
          <View style={styles.questInfo}>
            <Text style={styles.questName}>ออกกำลังกาย 3 เซ็ตขึ้นไป</Text>
            <Text style={styles.questReward}>+30 🪙 เหรียญรางวัล</Text>
          </View>
          <View style={styles.questActionBtn}>
            <Text style={styles.questActionText}>ทำเลย</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* ── Duolingo Quick Actions (Pushable 3D Buttons) ── */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.bigButton3D, button3D.primary]}
          onPress={() => navigation.navigate('Log')}
        >
          <Text style={styles.bigButtonTextPrimary}>+ บันทึกอาหารทันที</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bigButton3D, button3D.accent]}
          onPress={() => navigation.navigate('Workout')}
        >
          <Text style={styles.bigButtonTextAccent}>🏋️ เริ่มออกกำลังกาย</Text>
        </TouchableOpacity>
      </View>

      {/* Sign out text */}
      <TouchableOpacity onPress={signOut} style={styles.logoutBtn}>
        <Text style={styles.logoutText}>ออกจากระบบบัญชี ({user?.email})</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 40 },

  // Gamification Top Status Bar
  topStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  userGreetingBox: { flex: 1 },
  greetingTitle: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.text,
  },
  levelSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },

  // Badges (Streak, Coins, Hearts)
  badgeStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#ff9600',
    borderWidth: 2,
    borderBottomWidth: 3,
    borderRadius: radius.md,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 3,
  },
  badgeTextStreak: {
    fontSize: fontSize.xs,
    fontWeight: '800',
    color: '#ff9600',
  },
  badgeCoins: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#ffc800',
    borderWidth: 2,
    borderBottomWidth: 3,
    borderRadius: radius.md,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 3,
  },
  badgeTextCoins: {
    fontSize: fontSize.xs,
    fontWeight: '800',
    color: '#cca000',
  },
  badgeHearts: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#ff4b4b',
    borderWidth: 2,
    borderBottomWidth: 3,
    borderRadius: radius.md,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 3,
  },
  badgeTextHearts: {
    fontSize: fontSize.xs,
    fontWeight: '800',
    color: '#ff4b4b',
  },
  badgeEmoji: { fontSize: 13 },

  // Weekly Streak Tracker Card
  streakCard: {
    backgroundColor: '#ffffff',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderBottomWidth: 4,
    padding: spacing.md,
  },
  streakCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  streakTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.text,
  },
  streakDaysText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: '#ff9600',
  },
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
    backgroundColor: '#f2f2f2',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleCompleted: {
    backgroundColor: '#ff9600',
    borderColor: '#cc7800',
  },
  dayCircleToday: {
    borderColor: '#ff9600',
    borderWidth: 2,
    backgroundColor: '#fff7e6',
  },
  dayCircleEmoji: { fontSize: 13, fontWeight: '800' },
  dayCircleLabel: { fontSize: 10, fontWeight: '700', color: colors.textMuted },
  dayCircleLabelToday: { color: '#ff9600', fontWeight: '800' },

  // Main 3D Card
  card3D: {
    backgroundColor: '#ffffff',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderBottomWidth: 4,
    padding: spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardPreTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  cardMainTitle: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  xpPill: {
    backgroundColor: '#f1faff',
    borderColor: '#1cb0f6',
    borderWidth: 1.5,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  xpPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1cb0f6',
  },

  // Calories Display
  calBigRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 6,
    marginBottom: spacing.xs,
  },
  calBigNum: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1,
  },
  calBigSlash: {
    fontSize: fontSize.xl,
    fontWeight: '400',
    color: colors.textMuted,
  },
  calBigTarget: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.textMuted,
  },

  // 3D Progress Bar
  progressBarTrack: {
    height: 16,
    backgroundColor: '#e5e5e5',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#a5ed6e',
    borderRadius: 8,
    borderBottomWidth: 3,
    borderColor: '#79c838',
  },
  progressPercentText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 6,
    textAlign: 'right',
  },

  // Macros Triple Column
  macroColumns: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  macroPillBox: {
    flex: 1,
    backgroundColor: '#fbfbfb',
    borderWidth: 2,
    borderBottomWidth: 3,
    borderRadius: radius.md,
    padding: 10,
    alignItems: 'center',
  },
  macroLabel: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  macroValText: { fontSize: fontSize.base, fontWeight: '800', color: colors.text, marginVertical: 2 },
  macroTargetText: { fontSize: 10, color: colors.textMuted, fontWeight: '600' },
  miniBarTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#e5e5e5',
    borderRadius: 3,
    marginTop: 6,
    overflow: 'hidden',
  },
  miniBarFill: { height: '100%', borderRadius: 3 },

  // Quests Section
  questSubtitle: { fontSize: 11, fontWeight: '700', color: '#cca000' },
  questItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 10,
  },
  questEmoji: { fontSize: 24 },
  questInfo: { flex: 1 },
  questName: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text },
  questReward: { fontSize: 11, fontWeight: '700', color: '#cca000', marginTop: 1 },
  questActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#1cb0f6',
    borderBottomWidth: 3,
    borderRadius: radius.md,
  },
  questActionBtnDone: {
    backgroundColor: '#a5ed6e',
    borderColor: '#79c838',
  },
  questActionText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1cb0f6',
  },

  // Pushable Big 3D Buttons
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 4,
  },
  bigButton3D: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigButtonTextPrimary: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 0.3,
  },
  bigButtonTextAccent: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.3,
  },

  logoutBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  logoutText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
