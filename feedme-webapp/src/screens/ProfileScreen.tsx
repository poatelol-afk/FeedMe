import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  RefreshControl, TextInput, TouchableOpacity, Alert,
} from 'react-native';
import * as db from '../lib/db';
import BleScaleCard from '../components/BleScaleCard';
import { colors, spacing, radius, fontSize, button3D } from '../lib/theme';
import type { WeightLog, WeightStats } from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [history, setHistory]   = useState<WeightLog[]>([]);
  const [stats, setStats]       = useState<WeightStats | null>(null);
  const [manualKg, setManualKg] = useState('');
  const [saving, setSaving]     = useState(false);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [h, s] = await Promise.all([
        db.getWeightHistory(30),
        db.getWeightStats(),
      ]);
      setHistory(h);
      setStats(s);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleManualLog = async () => {
    const val = parseFloat(manualKg);
    if (!Number.isFinite(val) || val <= 0 || val > 300) {
      Alert.alert('กรุณากรอกน้ำหนักที่ถูกต้อง');
      return;
    }
    setSaving(true);
    try {
      await db.logWeightReading(val, 'manual');
      await db.earnCoins(10);
      setManualKg('');
      Alert.alert('บันทึกน้ำหนักสำเร็จ! ⚖️', `บันทึก ${val} kg\n🪙 ได้รับ +10 เหรียญรางวัล!`);
      await load();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: spacing.md + insets.top }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.accent} />}
    >
      {/* ── Gamified User Profile Header ── */}
      <View style={styles.profileHeaderCard}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarEmoji}>🦉</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.email?.split('@')[0] || 'นักกีฬา'}</Text>
          <View style={styles.leagueBadge}>
            <Text style={styles.leagueText}>🥇 Bronze League · Rank #3</Text>
          </View>
        </View>
      </View>

      {/* BLE Scale */}
      <BleScaleCard onWeightReceived={async (grams) => {
        const kg = Math.round((grams / 1000) * 10) / 10;
        await db.logWeightReading(kg, 'scale');
        await db.earnCoins(15);
        Alert.alert('เครื่องชั่ง FeedMe เชื่อมต่อ! ⚡', `บันทึกน้ำหนักอัตโนมัติ: ${kg} kg (+15 🪙)`);
        await load();
      }} />

      {/* Current Weight 3D Card */}
      <View style={styles.card3D}>
        <Text style={styles.cardPreTitle}>⚖️ น้ำหนักตัวปัจจุบัน (BODY WEIGHT)</Text>
        {stats?.latest != null ? (
          <View style={styles.weightCenter}>
            <Text style={styles.weightNum}>{stats.latest}</Text>
            <Text style={styles.weightUnit}>กิโลกรัม (kg)</Text>
          </View>
        ) : (
          <Text style={styles.emptyText}>ยังไม่มีข้อมูลน้ำหนัก — ชั่งหรือกรอกด้านล่างเพื่อเริ่มติดตาม</Text>
        )}
      </View>

      {/* Manual Entry 3D Card */}
      <View style={styles.card3D}>
        <Text style={styles.cardPreTitle}>✏️ บันทึกน้ำหนักด้วยตัวเอง</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={manualKg}
            onChangeText={setManualKg}
            placeholder="เช่น 72.5"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
          />
          <Text style={styles.inputUnit}>kg</Text>
          <TouchableOpacity
            style={[styles.saveBtn3D, button3D.primary, saving && { opacity: 0.5 }]}
            onPress={handleManualLog}
            disabled={saving}
          >
            <Text style={styles.saveBtnText}>บันทึก (+10 🪙)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 30-Day History */}
      {history.length > 0 && (
        <View style={styles.card3D}>
          <Text style={styles.cardPreTitle}>📋 ประวัติน้ำหนัก (30 วันล่าสุด)</Text>
          {history.slice(0, 10).map((log, i) => (
            <View key={log.id ?? i} style={styles.historyRow}>
              <Text style={styles.historyDate}>
                {new Date(log.measuredAt).toLocaleDateString('th-TH', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                })}
              </Text>
              <View style={styles.historyRight}>
                <Text style={styles.historyWeight}>{log.weightKg} kg</Text>
                <View style={[
                  styles.sourceBadge,
                  { backgroundColor: log.source === 'scale' ? '#f6fff0' : '#f0f9ff', borderColor: log.source === 'scale' ? '#a5ed6e' : '#1cb0f6' }
                ]}>
                  <Text style={[
                    styles.sourceBadgeText,
                    { color: log.source === 'scale' ? '#2c6800' : '#0e88c7' }
                  ]}>
                    {log.source === 'scale' ? '⚡ ตาชั่ง BLE' : '✏️ กรอกเอง'}
                  </Text>
                </View>
              </View>
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

  profileHeaderCard: {
    backgroundColor: '#ffffff',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderBottomWidth: 4,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ddf4ff',
    borderWidth: 2,
    borderColor: '#1cb0f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 30 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: fontSize.base, fontWeight: '800', color: colors.text },
  leagueBadge: {
    backgroundColor: '#fff7e6',
    borderColor: '#ff9600',
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  leagueText: { fontSize: 11, fontWeight: '800', color: '#cc7800' },

  card3D: {
    backgroundColor: '#ffffff',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderBottomWidth: 4,
    padding: spacing.md,
  },
  cardPreTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },

  weightCenter: { alignItems: 'center', paddingVertical: spacing.sm },
  weightNum: {
    fontSize: 54,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -2,
  },
  weightUnit: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: '700',
    marginTop: 2,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.md,
    fontWeight: '600',
  },

  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#d6d6d6',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: '800',
  },
  inputUnit: { fontSize: fontSize.sm, color: colors.textMuted, fontWeight: '700' },
  saveBtn3D: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  saveBtnText: {
    color: '#111111',
    fontWeight: '800',
    fontSize: fontSize.xs,
  },

  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyDate: { fontSize: fontSize.xs, color: colors.textMuted, fontWeight: '600' },
  historyRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  historyWeight: { fontSize: fontSize.sm, color: colors.text, fontWeight: '800' },
  sourceBadge: {
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
  },
  sourceBadgeText: { fontSize: 10, fontWeight: '800' },
});
