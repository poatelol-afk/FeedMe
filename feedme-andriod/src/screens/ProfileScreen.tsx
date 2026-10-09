import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  RefreshControl, TextInput, TouchableOpacity, Alert,
} from 'react-native';
import * as db from '../lib/db';
import BleScaleCard from '../components/BleScaleCard';
import { colors, spacing, radius, fontSize } from '../lib/theme';
import type { WeightLog, WeightStats } from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
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
      setManualKg('');
      await load();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: spacing.lg + insets.top }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.accent} />}
    >
      <Text style={styles.pageTitle}>Profile</Text>
      <Text style={styles.pageSub}>YOUR BODY, YOUR GOALS</Text>

      {/* BLE Scale */}
      <BleScaleCard />

      {/* Weight card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>⚖️ BODY WEIGHT</Text>
        {stats?.latest != null ? (
          <View style={styles.weightCenter}>
            <Text style={styles.weightNum}>{stats.latest}</Text>
            <Text style={styles.weightUnit}>kg</Text>
          </View>
        ) : (
          <Text style={styles.emptyText}>ยังไม่มีข้อมูลน้ำหนัก</Text>
        )}
      </View>

      {/* Manual entry */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>✏️ บันทึกด้วยตัวเอง</Text>
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
            style={[styles.saveBtn, saving && { opacity: 0.5 }]}
            onPress={handleManualLog}
            disabled={saving}
          >
            <Text style={styles.saveBtnText}>บันทึก</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* History */}
      {history.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>📋 ประวัติ (30 วัน)</Text>
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
                  { backgroundColor: log.source === 'scale' ? colors.accentSoft : colors.bgElevated }
                ]}>
                  <Text style={[
                    styles.sourceBadgeText,
                    { color: log.source === 'scale' ? colors.accent : colors.textMuted }
                  ]}>
                    {log.source === 'scale' ? '⚡ เครื่องชั่ง' : '✏️ manual'}
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
  screen:    { flex: 1, backgroundColor: colors.bgBase },
  content:   { padding: spacing.lg, gap: spacing.md, paddingBottom: 40 },

  pageTitle: { fontSize: fontSize['2xl'], fontWeight: '300', color: colors.textPrimary },
  pageSub:   { fontSize: fontSize.xs, color: colors.textMuted, letterSpacing: 2, marginTop: 2, marginBottom: spacing.sm },

  card: {
    backgroundColor: colors.bgCard, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.borderSoft, padding: spacing.lg,
  },
  cardLabel: { fontSize: fontSize.xs, color: colors.textMuted, letterSpacing: 1, marginBottom: spacing.md },

  weightCenter: { alignItems: 'center', paddingVertical: spacing.md },
  weightNum:    { fontSize: 64, fontWeight: '200', color: colors.textPrimary, letterSpacing: -3 },
  weightUnit:   { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 4 },
  emptyText:    { color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.lg },

  inputRow:  { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  input:     {
    flex: 1, backgroundColor: colors.bgElevated,
    borderWidth: 1, borderColor: colors.borderMid,
    borderRadius: radius.md, padding: spacing.md,
    color: colors.textPrimary, fontSize: fontSize.base,
  },
  inputUnit: { fontSize: fontSize.sm, color: colors.textMuted },
  saveBtn:   {
    backgroundColor: colors.accent, paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md, borderRadius: radius.md,
  },
  saveBtnText: { color: colors.bgBase, fontWeight: '600', fontSize: fontSize.sm },

  historyRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.borderSoft,
  },
  historyDate:   { fontSize: fontSize.xs, color: colors.textMuted },
  historyRight:  { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  historyWeight: { fontSize: fontSize.sm, color: colors.textPrimary },
  sourceBadge:   { borderRadius: radius.sm, paddingHorizontal: 6, paddingVertical: 2 },
  sourceBadgeText: { fontSize: 10, fontWeight: '500' },
});
