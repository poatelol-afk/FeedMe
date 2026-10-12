import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  RefreshControl, TextInput, TouchableOpacity, Alert,
} from 'react-native';
import * as db from '../lib/db';
import { colors, spacing, radius, fontSize, button3D } from '../lib/theme';
import type { NutritionGoal, UserProfile, WeightLog, WeightStats } from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';

const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'ไม่ออกกำลัง (1.2x)' },
  { value: 1.375, label: '1–3 วัน/สัปดาห์ (1.375x)' },
  { value: 1.55, label: '3–5 วัน/สัปดาห์ (1.55x)' },
  { value: 1.725, label: '6–7 วัน/สัปดาห์ (1.725x)' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [history, setHistory] = useState<WeightLog[]>([]);
  const [stats, setStats] = useState<WeightStats | null>(null);
  const [goal, setGoal] = useState<NutritionGoal | null>(null);

  const [age, setAge] = useState('26');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState('175');
  const [weightKgInput, setWeightKgInput] = useState('70');
  const [activity, setActivity] = useState<number>(1.55);

  const [manualKg, setManualKg] = useState('');
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [p, g, h, s] = await Promise.all([
        db.getProfile(),
        db.getGoal(),
        db.getWeightHistory(30),
        db.getWeightStats(),
      ]);
      if (p) {
        setAge(String(p.age));
        setGender(p.gender);
        setHeightCm(String(p.height));
        setWeightKgInput(String(p.weight));
        setActivity(p.activity);
      }
      setGoal(g);
      setHistory(h);
      setStats(s);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleSaveProfile = async () => {
    const parsedAge = parseInt(age, 10);
    const parsedHeight = parseFloat(heightCm);
    const parsedWeight = parseFloat(weightKgInput);

    if (!parsedAge || !parsedHeight || !parsedWeight) {
      Alert.alert('กรุณากรอกข้อมูลอายุ ส่วนสูง และน้ำหนักให้ครบถ้วน');
      return;
    }

    setSaving(true);
    try {
      const profile: UserProfile = {
        age: parsedAge,
        gender,
        height: parsedHeight,
        weight: parsedWeight,
        activity,
      };
      const newGoal = await db.saveProfile(profile);
      setGoal(newGoal);
      Alert.alert('คำนวณและบันทึก TDEE สำเร็จ! ⚡', `เป้าหมายพลังงาน: ${newGoal.tdee} kcal/วัน\nโปรตีน ${newGoal.protein.g}g · คาร์บ ${newGoal.carbs.g}g · ไขมัน ${newGoal.fat.g}g`);
      await load();
    } catch (e: any) {
      Alert.alert('เกิดข้อผิดพลาด', e?.message || 'ไม่สามารถบันทึกโปรไฟล์ได้');
    } finally {
      setSaving(false);
    }
  };

  const handleManualLog = async () => {
    const val = parseFloat(manualKg);
    if (!Number.isFinite(val) || val <= 0 || val > 300) {
      Alert.alert('กรุณากรอกน้ำหนักตัว (kg) ที่ถูกต้อง');
      return;
    }
    setSaving(true);
    try {
      await db.logWeightReading(val, 'manual');
      await db.earnCoins(10);
      setManualKg('');
      Alert.alert('บันทึกน้ำหนักตัวสำเร็จ! 📉', `บันทึก ${val} kg (+10 🪙)`);
      await load();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: spacing.md + insets.top }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load(); }} tintColor={colors.primary} />}
    >
      {/* Header Card */}
      <View style={styles.heroProfileCard}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarEmoji}>⚡</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.brandSub}>FEEDME AI · BODY &amp; TDEE</Text>
          <Text style={styles.profileName}>{user?.email?.split('@')[0] || 'Athlete'}</Text>
          {goal && (
            <Text style={styles.tdeeSummary}>
              Target: {goal.tdee.toLocaleString()} kcal · P {goal.protein.g}g · C {goal.carbs.g}g · F {goal.fat.g}g
            </Text>
          )}
        </View>
      </View>

      {/* Current Body Weight & Deltas Bento Card */}
      <View style={styles.bentoCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardPreTitle}>📉 น้ำหนักตัวปัจจุบัน (BODY WEIGHT)</Text>
          {stats?.bmi && (
            <View style={styles.bmiPill}>
              <Text style={styles.bmiPillText}>BMI {stats.bmi}</Text>
            </View>
          )}
        </View>

        {stats?.latest != null ? (
          <View style={styles.weightCenter}>
            <Text style={styles.weightNum}>{stats.latest}</Text>
            <Text style={styles.weightUnit}>กิโลกรัม (kg)</Text>
            <View style={styles.deltaRow}>
              <Text style={styles.deltaText}>
                7 วัน: {stats.change7d != null ? `${stats.change7d > 0 ? '+' : ''}${stats.change7d} kg` : '—'}
              </Text>
              <Text style={styles.deltaText}>
                30 วัน: {stats.change30d != null ? `${stats.change30d > 0 ? '+' : ''}${stats.change30d} kg` : '—'}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.emptyText}>ยังไม่มีประวัติน้ำหนัก — กรอกน้ำหนักตัว (kg) ด้านล่างเพื่อเริ่มติดตาม</Text>
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={manualKg}
            onChangeText={setManualKg}
            placeholder="บันทึกน้ำหนักวันนี้ เช่น 69.5"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
          />
          <Text style={styles.inputUnit}>kg</Text>
          <TouchableOpacity
            style={[styles.saveBtnSmall, button3D.primary, saving && { opacity: 0.5 }]}
            onPress={handleManualLog}
            disabled={saving}
          >
            <Text style={styles.saveBtnText}>บันทึก</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Personal Profile & Mifflin-St Jeor TDEE Setup Card */}
      <View style={styles.bentoCard}>
        <Text style={styles.cardPreTitle}>🎯 ตั้งค่าข้อมูลร่างกาย &amp; คำนวณ TDEE (Mifflin-St Jeor)</Text>

        <View style={styles.genderRow}>
          {(['male', 'female'] as const).map(g => (
            <TouchableOpacity
              key={g}
              style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
              onPress={() => setGender(g)}
            >
              <Text style={[styles.genderBtnText, gender === g && styles.genderBtnTextActive]}>
                {g === 'male' ? '♂ ชาย (Male)' : '♀ หญิง (Female)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.metricsRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>อายุ (ปี)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={age} onChangeText={setAge} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>ส่วนสูง (cm)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={heightCm} onChangeText={setHeightCm} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>น้ำหนัก (kg)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={weightKgInput} onChangeText={setWeightKgInput} />
          </View>
        </View>

        <Text style={[styles.fieldLabel, { marginTop: 10 }]}>ระดับกิจกรรม (Activity Multiplier)</Text>
        <View style={styles.activityGrid}>
          {ACTIVITY_LEVELS.map(a => (
            <TouchableOpacity
              key={a.value}
              style={[styles.activityChip, activity === a.value && styles.activityChipActive]}
              onPress={() => setActivity(a.value)}
            >
              <Text style={[styles.activityChipText, activity === a.value && styles.activityChipTextActive]}>
                {a.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.fullSaveBtn, button3D.primary, saving && { opacity: 0.6 }]}
          onPress={handleSaveProfile}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>คำนวณและบันทึกเป้าหมาย TDEE</Text>
        </TouchableOpacity>
      </View>

      {/* 30-Day History */}
      {history.length > 0 && (
        <View style={styles.bentoCard}>
          <Text style={styles.cardPreTitle}>📋 ประวัติน้ำหนักย้อนหลัง</Text>
          {[...history].reverse().slice(0, 10).map((log, i) => (
            <View key={log.id ?? i} style={styles.historyRow}>
              <Text style={styles.historyDate}>
                {new Date(log.measuredAt).toLocaleDateString('th-TH', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                })}
              </Text>
              <Text style={styles.historyWeight}>
                {log.weightKg} kg {log.bmi ? `· BMI ${log.bmi}` : ''}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 60 },

  heroProfileCard: {
    backgroundColor: colors.heroBg,
    borderRadius: radius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.heroElevated,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 26 },
  profileInfo: { flex: 1 },
  brandSub: { fontSize: 10, fontWeight: '800', color: '#38BDF8', letterSpacing: 0.7 },
  profileName: { fontSize: fontSize.lg, fontWeight: '800', color: '#FFFFFF', marginTop: 2 },
  tdeeSummary: { fontSize: 11, color: '#34D399', fontWeight: '700', marginTop: 4 },

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
  },
  cardPreTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.7,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  bmiPill: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  bmiPillText: { fontSize: 11, fontWeight: '800', color: colors.primaryDark },

  weightCenter: { alignItems: 'center', paddingVertical: spacing.sm },
  weightNum: {
    fontSize: 46,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -1.5,
  },
  weightUnit: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: '700',
  },
  deltaRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 6,
  },
  deltaText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.md,
    fontWeight: '600',
  },

  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  input: {
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderMid,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  inputUnit: { fontSize: fontSize.xs, color: colors.textMuted, fontWeight: '700' },
  saveBtnSmall: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  fullSaveBtn: {
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 14,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: fontSize.xs,
  },

  genderRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: radius.sm,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderMid,
    alignItems: 'center',
  },
  genderBtnActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  genderBtnText: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  genderBtnTextActive: { color: colors.primaryDark, fontWeight: '800' },

  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 4,
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  activityChip: {
    width: '48%',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderMid,
  },
  activityChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  activityChipText: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  activityChipTextActive: { color: colors.primaryDark, fontWeight: '800' },

  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyDate: { fontSize: fontSize.xs, color: colors.textMuted, fontWeight: '600' },
  historyWeight: { fontSize: fontSize.sm, color: colors.text, fontWeight: '800' },
});
