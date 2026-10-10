import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, fontSize, button3D } from '../lib/theme';
import { SHOP_ITEMS } from '../lib/shop-data';
import type { PurchaseRecord, ShopItem } from '../types';
import * as db from '../lib/db';

const POWER_UPS = [
  {
    id: 'streak-freeze',
    name: 'Streak Freeze',
    emoji: '❄️',
    description: 'แช่แข็ง Streak กันหลุด 1 วัน หากลืมบันทึก',
    coinPrice: 100,
  },
  {
    id: 'xp-boost',
    name: 'Double XP Potion',
    emoji: '🧪',
    description: 'รับค่า XP สองเท่าจากทุกกิจกรรม 30 นาที',
    coinPrice: 150,
  },
  {
    id: 'heart-refill',
    name: 'Heart Refill',
    emoji: '💖',
    description: 'ฟื้นฟูพลังชีวิตและหัวใจให้เต็ม 5 ดวงทันที',
    coinPrice: 50,
  },
];

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const [coins, setCoins] = useState(0);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'powerup' | 'cheatmeal'>('powerup');

  const loadData = useCallback(async () => {
    try {
      const [c, p] = await Promise.all([
        db.getCoins(),
        db.getPurchases(),
      ]);
      setCoins(c);
      setPurchases(p);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBuy = async (item: { id: string; name: string; emoji: string; coinPrice: number }) => {
    if (coins < item.coinPrice) {
      Alert.alert(
        '🪙 เหรียญไม่พอ!',
        `คุณมี ${coins} เหรียญ แต่ต้องใช้ ${item.coinPrice} เหรียญ\nออกกำลังกายหรือบันทึกอาหารเพื่อรับเหรียญเพิ่มนะ!`
      );
      return;
    }

    try {
      const res = await db.addPurchase({
        itemId: item.id,
        itemName: item.name,
        coinSpent: item.coinPrice,
      });

      if (res) {
        Alert.alert(
          'แลกรางวัลสำเร็จ! 🎉',
          `คุณได้แลก ${item.emoji} ${item.name} เรียบร้อยแล้ว!\nใช้ไป ${item.coinPrice} เหรียญ`
        );
        await loadData();
      } else {
        Alert.alert('เกิดข้อผิดพลาดในการแลกรางวัล');
      }
    } catch (e: any) {
      Alert.alert('เกิดข้อผิดพลาด', e.message);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: spacing.md + insets.top }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor={colors.accent} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.preTitle}>💎 REWARD & SHOP</Text>
          <Text style={styles.title}>ร้านค้าแลกรางวัล</Text>
        </View>
      </View>

      {/* Coins Balance 3D Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceEmoji}>🪙</Text>
          <View>
            <Text style={styles.balanceSub}>เหรียญทองที่คุณมี</Text>
            <Text style={styles.balanceNum}>{coins} <Text style={{ fontSize: fontSize.base }}>Coins</Text></Text>
          </View>
        </View>
        <Text style={styles.balanceHint}>สะสมเหรียญได้จากการทานอาหารครบเป้าและยกเวท!</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, selectedTab === 'powerup' && styles.tabBtnActive]}
          onPress={() => setSelectedTab('powerup')}
        >
          <Text style={[styles.tabBtnText, selectedTab === 'powerup' && styles.tabBtnTextActive]}>
            ⚡ ไอเทมช่วยเหลือ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, selectedTab === 'cheatmeal' && styles.tabBtnActive]}
          onPress={() => setSelectedTab('cheatmeal')}
        >
          <Text style={[styles.tabBtnText, selectedTab === 'cheatmeal' && styles.tabBtnTextActive]}>
            🍔 บัตรอาหารตามใจ
          </Text>
        </TouchableOpacity>
      </View>

      {/* Power-ups List */}
      {selectedTab === 'powerup' && (
        <View style={styles.itemsGrid}>
          {POWER_UPS.map((item) => (
            <View key={item.id} style={styles.shopItemCard}>
              <Text style={styles.shopItemEmoji}>{item.emoji}</Text>
              <View style={styles.shopItemInfo}>
                <Text style={styles.shopItemTitle}>{item.name}</Text>
                <Text style={styles.shopItemDesc}>{item.description}</Text>
              </View>
              <TouchableOpacity
                style={[styles.buyBtn3D, button3D.gold]}
                onPress={() => handleBuy(item)}
              >
                <Text style={styles.buyBtnText}>{item.coinPrice} 🪙</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Cheat Meals List */}
      {selectedTab === 'cheatmeal' && (
        <View style={styles.itemsGrid}>
          {SHOP_ITEMS.slice(0, 8).map((item) => (
            <View key={item.id} style={styles.shopItemCard}>
              <Text style={styles.shopItemEmoji}>{item.emoji}</Text>
              <View style={styles.shopItemInfo}>
                <Text style={styles.shopItemTitle}>{item.name}</Text>
                <Text style={styles.shopItemDesc}>{item.description} (~{item.calories} kcal)</Text>
              </View>
              <TouchableOpacity
                style={[styles.buyBtn3D, button3D.primary]}
                onPress={() => handleBuy(item)}
              >
                <Text style={styles.buyBtnText}>{item.coinPrice} 🪙</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Purchase History */}
      {purchases.length > 0 && (
        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>📦 ประวัติการแลกของรางวัล</Text>
          {purchases.slice(0, 5).map((p, idx) => (
            <View key={p.id || idx} style={styles.historyItem}>
              <Text style={styles.historyItemName}>🎁 {p.itemName}</Text>
              <Text style={styles.historyItemCoins}>-{p.coinSpent} 🪙</Text>
            </View>
          ))}
        </View>
      )}
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

  balanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: '#ffc800',
    borderBottomWidth: 4,
    padding: spacing.md,
  },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  balanceEmoji: { fontSize: 36 },
  balanceSub: { fontSize: fontSize.xs, color: colors.textMuted, fontWeight: '700' },
  balanceNum: { fontSize: 32, fontWeight: '800', color: '#b38600', letterSpacing: -1 },
  balanceHint: { fontSize: 11, color: colors.textMuted, fontWeight: '600', marginTop: 8 },

  tabRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderBottomWidth: 3,
    alignItems: 'center',
  },
  tabBtnActive: {
    borderColor: '#1cb0f6',
    backgroundColor: '#f1faff',
  },
  tabBtnText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.text,
  },
  tabBtnTextActive: {
    color: '#1cb0f6',
    fontWeight: '800',
  },

  itemsGrid: { gap: spacing.sm },
  shopItemCard: {
    backgroundColor: '#ffffff',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderBottomWidth: 4,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shopItemEmoji: { fontSize: 32 },
  shopItemInfo: { flex: 1 },
  shopItemTitle: { fontSize: fontSize.sm, fontWeight: '800', color: colors.text },
  shopItemDesc: { fontSize: 11, color: colors.textMuted, fontWeight: '600', marginTop: 2 },
  buyBtn3D: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 75,
    alignItems: 'center',
  },
  buyBtnText: {
    fontSize: fontSize.xs,
    fontWeight: '800',
    color: '#111111',
  },

  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderBottomWidth: 4,
    padding: spacing.md,
  },
  historyTitle: { fontSize: fontSize.sm, fontWeight: '800', color: colors.text, marginBottom: spacing.xs },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  historyItemName: { fontSize: fontSize.xs, fontWeight: '700', color: colors.text },
  historyItemCoins: { fontSize: fontSize.xs, fontWeight: '800', color: colors.danger },
});
