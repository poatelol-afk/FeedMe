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
import BleScaleCard from '../components/BleScaleCard';

export default function LogScreen() {
  const insets = useSafeAreaInsets();
  const [selectedFood, setSelectedFood] = useState<FoodItem>(FOODS[0]);
  const [weightGrams, setWeightGrams] = useState<number>(150);
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
    loadEntries();
  }, [loadEntries]);

  // Live macro calculation based on selected food & weight
  const multiplier = weightGrams / 100;
  const calculatedKcal = Math.round(selectedFood.kcal * multiplier);
  const calculatedProtein = Math.round(selectedFood.protein * multiplier * 10) / 10;
  const calculatedCarbs = Math.round(selectedFood.carbs * multiplier * 10) / 10;
  const calculatedFat = Math.round(selectedFood.fat * multiplier * 10) / 10;

  const handleAddLog = async () => {
    if (weightGrams <= 0) {
      Alert.alert('กรุณากรอกน้ำหนักอาหาร');
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

      // Earn reward coins & update streak
      await db.earnCoins(5);
      await db.updateStreak();

      Alert.alert('บันทึกอาหารสำเร็จ! 🎉', `เพิ่ม ${selectedFood.emoji} ${selectedFood.name} (${weightGrams}g)\n+${calculatedKcal} kcal\n🪙 ได้รับ +5 เหรียญ และ +10 XP!`);
      await loadEntries();
    } catch (e: any) {
      Alert.alert('เกิดข้อผิดพลาด', e.message || 'ไม่สามารถบันทึกได้');
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

  const handleWeightFromScale = (grams: number) => {
    setWeightGrams(grams);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: spacing.md + insets.top }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadEntries(); }} tintColor={colors.accent} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.preTitle}>🥗 FOOD LOG & SCALE</Text>
          <Text style={styles.title}>บันทึกมื้ออาหาร</Text>
        </View>
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>⚡ +10 XP</Text>
        </View>
      </View>

      {/* BLE Scale Card */}
      <BleScaleCard onWeightReceived={handleWeightFromScale} />

      {/* Food Selection 3D Card */}
      <View style={styles.card3D}>
        <Text style={styles.sectionTitle}>เลือกเมนูอาหารยอดนิยม</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.foodScroll}>
          {FOODS.map((item) => (
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
              <Text style={[styles.foodKcalSub, selectedFood.id === item.id && styles.foodKcalSubActive]}>
                {item.kcal} kcal/100g
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Portion Adjuster */}
        <View style={styles.portionSection}>
          <Text style={styles.portionLabel}>น้ำหนักอาหาร (กรัม):</Text>
          <View style={styles.weightInputRow}>
            <TextInput
              style={styles.weightInput}
              keyboardType="numeric"
              value={String(weightGrams)}
              onChangeText={(t) => setWeightGrams(parseFloat(t) || 0)}
            />
            <Text style={styles.unitGrams}>กรัม</Text>
          </View>
          {/* Quick presets */}
          <View style={styles.presetRow}>
            {[100, 150, 200, 250].map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.presetBtn, weightGrams === g && styles.presetBtnActive]}
                onPress={() => setWeightGrams(g)}
              >
                <Text style={[styles.presetBtnText, weightGrams === g && styles.presetBtnTextActive]}>
                  {g}g
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Live Macro Calculation Preview */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryVal}>{calculatedKcal}</Text>
            <Text style={styles.summaryLabel}>kcal</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryVal, { color: '#1cb0f6' }]}>{calculatedProtein}g</Text>
            <Text style={styles.summaryLabel}>โปรตีน</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryVal, { color: '#cca000' }]}>{calculatedCarbs}g</Text>
            <Text style={styles.summaryLabel}>คาร์บ</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryVal, { color: '#ff9600' }]}>{calculatedFat}g</Text>
            <Text style={styles.summaryLabel}>ไขมัน</Text>
          </View>
        </View>

        {/* Big 3D Duolingo Button */}
        <TouchableOpacity
          style={[styles.bigLogBtn, button3D.primary, saving && { opacity: 0.6 }]}
          onPress={handleAddLog}
          disabled={saving}
        >
          <Text style={styles.bigLogBtnText}>+ บันทึกมื้อนี้ (+10 XP & 5 🪙)</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Logged Items List */}
      <View style={styles.card3D}>
        <View style={styles.listHeaderRow}>
          <Text style={styles.sectionTitle}>📋 อาหารที่ทานแล้ววันนี้ ({todayEntries.length} เมนู)</Text>
        </View>

        {todayEntries.length === 0 ? (
          <Text style={styles.emptyListText}>ยังไม่มีรายการอาหารวันนี้ — เริ่มบันทึกด้านบนได้เลย!</Text>
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

  card3D: {
    backgroundColor: '#ffffff',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderBottomWidth: 4,
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },

  foodScroll: { marginBottom: spacing.md },
  foodChip: {
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderBottomWidth: 3,
    padding: 12,
    marginRight: 10,
    alignItems: 'center',
    width: 110,
  },
  foodChipActive: {
    borderColor: '#1cb0f6',
    backgroundColor: '#f1faff',
  },
  foodEmoji: { fontSize: 28, marginBottom: 4 },
  foodName: { fontSize: 12, fontWeight: '700', color: colors.text, textAlign: 'center' },
  foodNameActive: { color: '#1cb0f6', fontWeight: '800' },
  foodKcalSub: { fontSize: 10, color: colors.textMuted, marginTop: 2, fontWeight: '600' },
  foodKcalSubActive: { color: '#1cb0f6' },

  portionSection: {
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginBottom: spacing.md,
  },
  portionLabel: { fontSize: fontSize.xs, fontWeight: '700', color: colors.textMuted, marginBottom: 6 },
  weightInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  weightInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: '#d6d6d6',
    paddingVertical: 8,
    paddingHorizontal: 14,
    fontSize: fontSize.base,
    fontWeight: '800',
    color: colors.text,
  },
  unitGrams: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textMuted },

  presetRow: { flexDirection: 'row', gap: 8 },
  presetBtn: {
    flex: 1,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: '#e5e5e5',
    alignItems: 'center',
  },
  presetBtnActive: {
    borderColor: '#a5ed6e',
    backgroundColor: '#f6fff0',
    borderWidth: 2,
  },
  presetBtnText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.text },
  presetBtnTextActive: { color: '#2c6800', fontWeight: '800' },

  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fbfbfb',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#e5e5e5',
    padding: 10,
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
    color: '#111111',
    letterSpacing: 0.3,
  },

  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
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
    borderTopColor: '#f0f0f0',
    gap: 10,
  },
  logItemEmoji: { fontSize: 24 },
  logItemInfo: { flex: 1 },
  logItemName: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text },
  logItemMacros: { fontSize: 11, color: colors.textMuted, fontWeight: '600', marginTop: 2 },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: { fontSize: 12, color: colors.danger, fontWeight: '800' },
});
