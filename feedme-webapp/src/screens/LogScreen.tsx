import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, fontSize, button3D } from '../lib/theme';
import { FOODS } from '../lib/food-data';
import type { DiaryEntry, FoodItem } from '../types';
import * as db from '../lib/db';

const SMART_PORTIONS = [
  { grams: 100, label: '1 ทัพพี (100g)' },
  { grams: 150, label: 'จานเล็ก (150g)' },
  { grams: 200, label: '1 จานปกติ (200g)' },
  { grams: 300, label: 'พิเศษ/จัมโบ้ (300g)' },
];

export default function LogScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem>(FOODS[0]);
  const [weightGrams, setWeightGrams] = useState<number>(200);
  const [todayEntries, setTodayEntries] = useState<DiaryEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadEntries = useCallback(async () => {
    try {
      const list = await db.getTodayDiary();
      setTodayEntries(list);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  const filteredFoods = searchQuery.trim()
    ? FOODS.filter(f => f.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : FOODS;

  const multiplier = weightGrams / 100;
  const calculatedKcal = Math.round(selectedFood.kcal * multiplier);
  const calculatedProtein = Math.round(selectedFood.protein * multiplier * 10) / 10;
  const calculatedCarbs = Math.round(selectedFood.carbs * multiplier * 10) / 10;
  const calculatedFat = Math.round(selectedFood.fat * multiplier * 10) / 10;

  const handleAddLog = async () => {
    if (weightGrams <= 0) {
      Alert.alert('กรุณาระบุปริมาณอาหาร (กรัม)');
      return;
    }
    setSaving(true);
    try {
      await db.addFoodLog({
        foodName: selectedFood.name,
        emoji: selectedFood.emoji,
        weight: weightGrams,
        kcal: calculatedKcal,
        protein: calculatedProtein,
        carbs: calculatedCarbs,
        fat: calculatedFat,
      });

      await db.earnCoins(10);
      await db.updateStreak();
      await db.updateQuestProgress('food', 1);

      Alert.alert(
        'บันทึกมื้ออาหารสำเร็จ! ⚡',
        `เพิ่ม ${selectedFood.emoji} ${selectedFood.name} (${weightGrams}g)\n+${calculatedKcal} kcal (P ${calculatedProtein}g · C ${calculatedCarbs}g · F ${calculatedFat}g)`
      );
      await loadEntries();
    } catch (e: any) {
      Alert.alert('เกิดข้อผิดพลาด', e?.message || 'ไม่สามารถบันทึกได้');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await db.deleteFoodLog(id);
      await loadEntries();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: spacing.md + insets.top }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void loadEntries(); }} tintColor={colors.primary} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.preTitle}>⚡ FEEDME AI · SMART FOOD LOGGER</Text>
          <Text style={styles.title}>บันทึกอาหาร &amp; สัดส่วนอัจฉริยะ</Text>
        </View>
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>+10 🪙</Text>
        </View>
      </View>

      {/* Search & Dish Presets Bento Card */}
      <View style={styles.bentoCard}>
        <Text style={styles.sectionTitle}>1. ค้นหาหรือเลือกจานอาหาร</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="ค้นหาชื่อเมนูอาหาร เช่น อกไก่, ข้าวกล้อง, แซลมอน..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.foodScroll}>
          {filteredFoods.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.foodChip,
                selectedFood.id === item.id && styles.foodChipActive,
              ]}
              onPress={() => setSelectedFood(item)}
            >
              <Text style={styles.foodEmoji}>{item.emoji}</Text>
              <Text style={[styles.foodName, selectedFood.id === item.id && styles.foodNameActive]}>
                {item.name}
              </Text>
              <Text style={styles.foodKcalSub}>
                {item.kcal} kcal / 100g
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Smart Portion Selector (No Hardware Scale Needed) */}
        <View style={styles.portionSection}>
          <Text style={styles.sectionTitle}>2. เลือกปริมาณ (ทัพพี / จาน / กรัม)</Text>
          <View style={styles.presetGrid}>
            {SMART_PORTIONS.map((p) => (
              <TouchableOpacity
                key={p.grams}
                style={[styles.presetBtn, weightGrams === p.grams && styles.presetBtnActive]}
                onPress={() => setWeightGrams(p.grams)}
              >
                <Text style={[styles.presetBtnText, weightGrams === p.grams && styles.presetBtnTextActive]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.weightInputRow}>
            <Text style={styles.portionLabel}>หรือระบุกรัมเอง:</Text>
            <TextInput
              style={styles.weightInput}
              keyboardType="numeric"
              value={String(weightGrams)}
              onChangeText={(t) => setWeightGrams(parseFloat(t) || 0)}
            />
            <Text style={styles.unitGrams}>กรัม (g)</Text>
          </View>
        </View>

        {/* Live Macro Calculation Preview */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryVal}>{calculatedKcal}</Text>
            <Text style={styles.summaryLabel}>kcal</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryVal, { color: colors.protein }]}>{calculatedProtein}g</Text>
            <Text style={styles.summaryLabel}>โปรตีน</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryVal, { color: colors.carbs }]}>{calculatedCarbs}g</Text>
            <Text style={styles.summaryLabel}>คาร์บ</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryVal, { color: colors.fat }]}>{calculatedFat}g</Text>
            <Text style={styles.summaryLabel}>ไขมัน</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.bigLogBtn, button3D.primary, saving && { opacity: 0.6 }]}
          onPress={handleAddLog}
          disabled={saving}
        >
          <Text style={styles.bigLogBtnText}>
            {saving ? 'กำลังบันทึก...' : `+ บันทึก ${selectedFood.name} (${weightGrams}g)`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Today's Logged Items List */}
      <View style={styles.bentoCard}>
        <Text style={styles.sectionTitle}>📋 รายการอาหารวันนี้ ({todayEntries.length} เมนู)</Text>

        {todayEntries.length === 0 ? (
          <Text style={styles.emptyListText}>ยังไม่มีรายการอาหารวันนี้ — เลือกเมนูด้านบนเพื่อเริ่มบันทึก</Text>
        ) : (
          todayEntries.map((item, idx) => (
            <View key={item.id || idx} style={styles.logItemRow}>
              <Text style={styles.logItemEmoji}>{item.emoji || '🍽️'}</Text>
              <View style={styles.logItemInfo}>
                <Text style={styles.logItemName}>{item.foodName} ({item.weight}g)</Text>
                <Text style={styles.logItemMacros}>
                  {item.kcal} kcal · P {item.protein}g · C {item.carbs}g · F {item.fat}g
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                <Text style={styles.deleteBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 60, gap: spacing.md },

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
  xpBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  xpText: {
    fontSize: fontSize.xs,
    fontWeight: '800',
    color: colors.primaryDark,
  },

  bentoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  searchInput: {
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderMid,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: fontSize.sm,
    color: colors.text,
    marginBottom: spacing.sm,
  },

  foodScroll: { marginBottom: spacing.md },
  foodChip: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginRight: 8,
    alignItems: 'center',
    width: 112,
  },
  foodChipActive: {
    borderColor: colors.primary,
    borderWidth: 1.5,
    backgroundColor: colors.primarySoft,
  },
  foodEmoji: { fontSize: 26, marginBottom: 4 },
  foodName: { fontSize: 12, fontWeight: '700', color: colors.text, textAlign: 'center' },
  foodNameActive: { color: colors.primaryDark, fontWeight: '800' },
  foodKcalSub: { fontSize: 10, color: colors.textMuted, marginTop: 2, fontWeight: '600' },

  portionSection: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: spacing.md,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  presetBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderMid,
  },
  presetBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  presetBtnText: { fontSize: 11, fontWeight: '700', color: colors.textSecondary },
  presetBtnTextActive: { color: '#FFFFFF', fontWeight: '800' },

  weightInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  portionLabel: { fontSize: fontSize.xs, fontWeight: '700', color: colors.textSecondary },
  weightInput: {
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderMid,
    paddingVertical: 7,
    paddingHorizontal: 12,
    fontSize: fontSize.base,
    fontWeight: '800',
    color: colors.text,
  },
  unitGrams: { fontSize: fontSize.xs, fontWeight: '700', color: colors.textMuted },

  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: spacing.md,
  },
  summaryItem: { alignItems: 'center' },
  summaryVal: { fontSize: fontSize.base, fontWeight: '800', color: colors.text },
  summaryLabel: { fontSize: 10, color: colors.textMuted, fontWeight: '700', marginTop: 2 },

  bigLogBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  bigLogBtnText: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  emptyListText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.md,
    fontWeight: '600',
  },
  logItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 10,
  },
  logItemEmoji: { fontSize: 22 },
  logItemInfo: { flex: 1 },
  logItemName: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text },
  logItemMacros: { fontSize: 11, color: colors.textMuted, fontWeight: '600', marginTop: 2 },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: { fontSize: 12, color: colors.danger, fontWeight: '800' },
});
