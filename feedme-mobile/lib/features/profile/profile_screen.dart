import 'package:flutter/material.dart';
import '../../core/models/feedme_models.dart';
import '../../core/services/feedme_controller.dart';
import '../../core/theme/feedme_theme.dart';
import '../../core/widgets/tactile_button.dart';
import '../../core/widgets/tactile_card.dart';

/// ═══════════════════════════════════════════════════════════════════════════════
/// ProfileScreen (Tab 5)
/// User Avatar, Gamification Stats, Duolingo Gem Shop, and BLE Scale Hardware
/// ═══════════════════════════════════════════════════════════════════════════════
class ProfileScreen extends StatelessWidget {
  final FeedMeController controller;

  const ProfileScreen({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, _) {
        return Scaffold(
          backgroundColor: FeedMeColors.canvasDark,
          body: SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // ─── User Profile & Avatar Header ────────────────────────
                  _buildProfileHeader(context),
                  const SizedBox(height: 16),

                  // ─── Streak & Anti-Goal Badges ───────────────────────────
                  _buildStreakProtectionCard(context),
                  const SizedBox(height: 16),

                  // ─── Duolingo Reward Gem Shop ────────────────────────────
                  _buildGemShopSection(context),
                  const SizedBox(height: 16),

                  // ─── BLE Smart Scale Hardware Simulator ──────────────────
                  _buildBleScaleHardwareCard(context),
                  const SizedBox(height: 16),

                  // ─── Lifetime Stats ──────────────────────────────────────
                  _buildLifetimeStatsCard(context),
                  const SizedBox(height: 16),

                  // ─── Anti-Goal Coaching Philosophy ───────────────────────
                  _buildAntiGoalPhilosophyCard(context),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  // ─── Profile & Avatar Header ───────────────────────────────────────────────
  Widget _buildProfileHeader(BuildContext context) {
    return TactileCard(
      surfaceColor: FeedMeColors.surfaceCard,
      borderColor: FeedMeColors.surfaceCardStroke,
      child: Row(
        children: [
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              color: FeedMeColors.gemPurple.withValues(alpha: 0.2),
              shape: BoxShape.circle,
              border: Border.all(
                color: FeedMeColors.gemPurple,
                width: 3,
              ),
            ),
            child: const Center(
              child: Text(
                '⚡',
                style: TextStyle(fontSize: 36),
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Text(
                      'สมชาย สายลีน',
                      style: TextStyle(
                        color: FeedMeColors.textLight,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: FeedMeColors.streakOrange.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Text(
                        'Lv. 14',
                        style: TextStyle(
                          color: FeedMeColors.streakOrange,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                const Text(
                  'ฟิตเนสมาสเตอร์ · Emerald League 🏆',
                  style: TextStyle(
                    color: FeedMeColors.textMuted,
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Text(
                      '🔥 สตรีค ${controller.streakDays} วัน',
                      style: const TextStyle(
                        color: FeedMeColors.streakOrange,
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      '💎 ${controller.gems} Gems',
                      style: const TextStyle(
                        color: FeedMeColors.gemPurple,
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ─── Streak Freeze & Cheat Meal Card ───────────────────────────────────────
  Widget _buildStreakProtectionCard(BuildContext context) {
    return TactileCard(
      surfaceColor: FeedMeColors.surfaceCard,
      borderColor: FeedMeColors.surfaceCardStroke,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text(
                '❄️',
                style: TextStyle(fontSize: 22),
              ),
              const SizedBox(width: 8),
              const Expanded(
                child: Text(
                  'ระบบปกป้องสตรีค (Streak Protection)',
                  style: TextStyle(
                    color: FeedMeColors.textLight,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: FeedMeColors.cardioBlue.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  'มี ${controller.streakFreezes} ชิ้น',
                  style: const TextStyle(
                    color: FeedMeColors.cardioBlue,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          const Text(
            'Streak Freeze จะทำงานอัตโนมัติเมื่อคุณลืมบันทึกอาหารหรือออกกำลังกาย 1 วัน เพื่อให้สถิติของคุณคงอยู่ตลอดไป',
            style: TextStyle(
              color: FeedMeColors.textMuted,
              fontSize: 13,
              height: 1.4,
            ),
          ),
          if (controller.cheatMealActive) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: FeedMeColors.featherGreen.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: FeedMeColors.featherGreen.withValues(alpha: 0.4),
                ),
              ),
              child: const Row(
                children: [
                  Text('🍔', style: TextStyle(fontSize: 20)),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'บัตรตามใจปาก (Cheat Meal Pass) ทำงานอยู่! โควต้าแคลอรี่วันนี้ขยายเพิ่ม +500 kcal โดยไม่ถูกหักสถิติ',
                      style: TextStyle(
                        color: FeedMeColors.featherGreen,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  // ─── Duolingo Reward Gem Shop ──────────────────────────────────────────────
  Widget _buildGemShopSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Row(
              children: [
                Text(
                  '🏪 ร้านค้ารางวัล (Gem Shop)',
                  style: TextStyle(
                    color: FeedMeColors.textLight,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: FeedMeColors.gemPurple.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: FeedMeColors.gemPurple.withValues(alpha: 0.4),
                ),
              ),
              child: Row(
                children: [
                  const Text('💎', style: TextStyle(fontSize: 13)),
                  const SizedBox(width: 4),
                  Text(
                    '${controller.gems} Gems',
                    style: const TextStyle(
                      color: FeedMeColors.gemPurple,
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        ...controller.shopItems.map((item) {
          final canAfford = controller.gems >= item.costGems;
          return Padding(
            padding: const EdgeInsets.only(bottom: 12.0),
            child: TactileCard(
              surfaceColor: FeedMeColors.surfaceCard,
              borderColor: FeedMeColors.surfaceCardStroke,
              child: Row(
                children: [
                  Container(
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                      color: FeedMeColors.canvasDark,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Center(
                      child: Text(
                        item.emoji,
                        style: const TextStyle(fontSize: 28),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item.title,
                          style: const TextStyle(
                            color: FeedMeColors.textLight,
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          item.description,
                          style: const TextStyle(
                            color: FeedMeColors.textMuted,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 10),
                  TactileButton(
                    onPressed: () {
                      final success = controller.purchaseShopItem(item);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          backgroundColor: success
                              ? FeedMeColors.featherGreen
                              : FeedMeColors.flameRed,
                          content: Text(
                            success
                                ? '🎉 แลกซื้อ ${item.title} สำเร็จแล้ว!'
                                : '💎 เพชรไม่พอ (${item.costGems} Gems) ไปออกกำลังกายเพื่อสะสมเพชรเพิ่มนะ!',
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          duration: const Duration(seconds: 2),
                        ),
                      );
                    },
                    color: canAfford
                        ? FeedMeColors.gemPurple
                        : FeedMeColors.surfaceCardStroke,
                    elevation: canAfford ? 3.0 : 1.0,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                    child: Text(
                      '${item.costGems} 💎',
                      style: TextStyle(
                        color: canAfford ? Colors.white : FeedMeColors.textMuted,
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }

  // ─── BLE Smart Scale Hardware Card ────────────────────────────────────────
  Widget _buildBleScaleHardwareCard(BuildContext context) {
    final isConnected = controller.isScaleConnected;

    return TactileCard(
      surfaceColor: FeedMeColors.surfaceCard,
      borderColor: isConnected
          ? FeedMeColors.featherGreen.withValues(alpha: 0.5)
          : FeedMeColors.surfaceCardStroke,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text('⚖️', style: TextStyle(fontSize: 22)),
              const SizedBox(width: 8),
              const Expanded(
                child: Text(
                  'FeedMe Smart Scale (ESP32-C3)',
                  style: TextStyle(
                    color: FeedMeColors.textLight,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isConnected
                      ? FeedMeColors.featherGreen.withValues(alpha: 0.2)
                      : FeedMeColors.textMuted.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isConnected
                            ? FeedMeColors.featherGreen
                            : FeedMeColors.textMuted,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      isConnected ? 'เชื่อมต่อแล้ว' : 'ออฟไลน์',
                      style: TextStyle(
                        color: isConnected
                            ? FeedMeColors.featherGreen
                            : FeedMeColors.textMuted,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: FeedMeColors.canvasDark,
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'อุปกรณ์ BLE:',
                      style: TextStyle(color: FeedMeColors.textMuted, fontSize: 12),
                    ),
                    Text(
                      'FeedMe Scale (ESP32-C3)',
                      style: TextStyle(
                        color: FeedMeColors.textLight,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'แบตเตอรี่ตาชั่ง:',
                      style: TextStyle(color: FeedMeColors.textMuted, fontSize: 12),
                    ),
                    Text(
                      '🔋 92% (พร้อมใช้งาน)',
                      style: TextStyle(
                        color: FeedMeColors.featherGreen,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'GATT UUID:',
                      style: TextStyle(color: FeedMeColors.textMuted, fontSize: 12),
                    ),
                    Text(
                      '4fafc201-1fb5-459e-8fcc...914b',
                      style: TextStyle(
                        color: FeedMeColors.textMuted,
                        fontSize: 11,
                        fontFamily: 'monospace',
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          TactileButton(
            onPressed: () {
              controller.toggleScaleConnection();
            },
            color: isConnected
                ? FeedMeColors.surfaceCardStroke
                : FeedMeColors.featherGreen,
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 10),
            child: Text(
              isConnected ? 'ตัดการเชื่อมต่อชั่วคราว' : '🔌 เชื่อมต่อ FeedMe Scale',
              style: TextStyle(
                color: isConnected ? FeedMeColors.textMuted : Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ─── Lifetime Stats Card ──────────────────────────────────────────────────
  Widget _buildLifetimeStatsCard(BuildContext context) {
    return TactileCard(
      surfaceColor: FeedMeColors.surfaceCard,
      borderColor: FeedMeColors.surfaceCardStroke,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '📊 สถิติความสำเร็จทั้งหมด',
            style: TextStyle(
              color: FeedMeColors.textLight,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildStatTile(
                  '⚡ คะแนนรวม',
                  '${controller.weeklyXp} XP',
                  FeedMeColors.lightningYellow,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildStatTile(
                  '🔥 เผาผลาญสะสม',
                  '${controller.burnedCalories} kcal',
                  FeedMeColors.streakOrange,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildStatTile(
                  '🥗 บันทึกอาหาร',
                  '${controller.loggedMeals.length} มื้อ',
                  FeedMeColors.featherGreen,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatTile(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: FeedMeColors.canvasDark,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: FeedMeColors.textMuted,
              fontSize: 11,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  // ─── Anti-Goal Coaching Philosophy Card ────────────────────────────────────
  Widget _buildAntiGoalPhilosophyCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: FeedMeColors.featherGreen.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: FeedMeColors.featherGreen.withValues(alpha: 0.3),
        ),
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('💚', style: TextStyle(fontSize: 22)),
          SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'FeedMe Anti-Goal Philosophy',
                  style: TextStyle(
                    color: FeedMeColors.featherGreen,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'สุขภาพที่ดีเกิดจากความสม่ำเสมอและความสุข ไม่ใช่ความเครียดหรือความรู้สึกผิด แม้วันนี้แคลอรี่จะเกิน คุณก็สามารถเลือกเดินเล่น ชดเชย หรือใช้บัตรตามใจปากได้อย่างสบายใจ!',
                  style: TextStyle(
                    color: FeedMeColors.textLight,
                    fontSize: 12,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
