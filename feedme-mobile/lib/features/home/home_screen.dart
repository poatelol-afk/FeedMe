import 'package:flutter/material.dart';
import '../../core/models/feedme_models.dart';
import '../../core/services/feedme_controller.dart';
import '../../core/theme/feedme_theme.dart';
import '../../core/widgets/tactile_button.dart';
import '../../core/widgets/tactile_card.dart';

/// ═══════════════════════════════════════════════════════════════════════════════
/// Tab 1: Home & Real-Time Net Calorie Balance Engine
/// ═══════════════════════════════════════════════════════════════════════════════
class HomeScreen extends StatelessWidget {
  final FeedMeController controller;
  final ValueChanged<int> onSwitchTab;

  const HomeScreen({
    super.key,
    required this.controller,
    required this.onSwitchTab,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, _) {
        return SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ─── 1. Net Calorie Balance Hero Card ───────────────────────────
              _buildNetCalorieHeroCard(),
              const SizedBox(height: 12.0),

              // ─── 2. Playful Non-Punishing Coaching Status Banner ─────────────
              _buildCoachingBanner(),
              const SizedBox(height: 16.0),

              // ─── 3. Macro Nutrient Targets Progress Bar ───────────────────────
              _buildMacroBreakdownCard(),
              const SizedBox(height: 16.0),

              // ─── 4. Quick Action Buttons ─────────────────────────────────────
              _buildQuickActionsRow(),
              const SizedBox(height: 18.0),

              // ─── 5. Daily Habit Quests ───────────────────────────────────────
              _buildDailyQuestsCard(),
              const SizedBox(height: 18.0),

              // ─── 6. Today's Logged Meals ─────────────────────────────────────
              _buildTodayMealsSection(),
              const SizedBox(height: 24.0),
            ],
          ),
        );
      },
    );
  }

  Widget _buildNetCalorieHeroCard() {
    final remaining = controller.remainingQuota;
    final isNegative = remaining < 0;

    return TactileCard(
      borderColor: isNegative
          ? FeedMeColors.cardioOrange
          : FeedMeColors.featherGreen,
      padding: const EdgeInsets.all(18.0),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                '⚖️ สมดุลพลังงาน (Net Calories)',
                style: TextStyle(
                  color: FeedMeColors.featherGreen,
                  fontSize: 13,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 0.5,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: FeedMeColors.featherGreen.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  'เป้าหมาย ${controller.targetDailyCalories} kcal',
                  style: const TextStyle(
                    color: FeedMeColors.featherGreen,
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            '$remaining',
            style: TextStyle(
              fontSize: 48,
              fontWeight: FontWeight.w900,
              color: isNegative
                  ? FeedMeColors.cardioOrange
                  : FeedMeColors.textPrimary,
              height: 1.0,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            isNegative ? 'kcal เกินโควต้า (เผาผลาญเพิ่มได้!)' : 'kcal เหลือสำหรับวันนี้',
            style: const TextStyle(
              color: FeedMeColors.textSecondary,
              fontSize: 13,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 14),
          const Divider(color: Color(0x20FFFFFF), height: 1),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildCalorieColumn('กินเข้าไป', '${controller.consumedCalories}', FeedMeColors.textPrimary),
              const Text('−', style: TextStyle(color: FeedMeColors.textMuted, fontSize: 18, fontWeight: FontWeight.bold)),
              _buildCalorieColumn('เผาผลาญ', '${controller.burnedCalories}', FeedMeColors.cardioOrange),
              const Text('=', style: TextStyle(color: FeedMeColors.textMuted, fontSize: 18, fontWeight: FontWeight.bold)),
              _buildCalorieColumn('สุทธิ', '${controller.netCalories}', FeedMeColors.kitchenCyan),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCalorieColumn(String label, String value, Color valueColor) {
    return Column(
      children: [
        Text(
          label,
          style: const TextStyle(
            color: FeedMeColors.textMuted,
            fontSize: 11,
            fontWeight: FontWeight.w700,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: TextStyle(
            color: valueColor,
            fontSize: 16,
            fontWeight: FontWeight.w900,
          ),
        ),
      ],
    );
  }

  Widget _buildCoachingBanner() {
    final remaining = controller.remainingQuota;
    final isNegative = remaining < 0;

    return TactileCard(
      backgroundColor: isNegative
          ? FeedMeColors.cardioOrange.withValues(alpha: 0.12)
          : FeedMeColors.featherGreen.withValues(alpha: 0.12),
      borderColor: isNegative
          ? FeedMeColors.cardioOrange.withValues(alpha: 0.4)
          : FeedMeColors.featherGreen.withValues(alpha: 0.4),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      child: Row(
        children: [
          Text(
            isNegative ? '💡' : '🌟',
            style: const TextStyle(fontSize: 22),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              controller.calorieStatusMessage,
              style: const TextStyle(
                color: FeedMeColors.textPrimary,
                fontSize: 12,
                fontWeight: FontWeight.w700,
                height: 1.35,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMacroBreakdownCard() {
    return TactileCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'สารอาหารหลักวันนี้ (Macros)',
            style: TextStyle(
              color: FeedMeColors.textPrimary,
              fontSize: 13,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 12),
          _buildMacroRow('โปรตีน (Protein)', controller.consumedProteinG, 140.0, FeedMeColors.kitchenCyan),
          const SizedBox(height: 10),
          _buildMacroRow('คาร์โบไฮเดรต (Carbs)', controller.consumedCarbsG, 220.0, FeedMeColors.featherGreen),
          const SizedBox(height: 10),
          _buildMacroRow('ไขมันดี (Healthy Fat)', controller.consumedFatG, 65.0, FeedMeColors.leagueGold),
        ],
      ),
    );
  }

  Widget _buildMacroRow(String title, double current, double target, Color barColor) {
    final ratio = (current / target).clamp(0.0, 1.0);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(title, style: const TextStyle(color: FeedMeColors.textSecondary, fontSize: 11, fontWeight: FontWeight.w700)),
            Text('${current.round()} / ${target.round()} g', style: TextStyle(color: barColor, fontSize: 11, fontWeight: FontWeight.w900)),
          ],
        ),
        const SizedBox(height: 5),
        ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: LinearProgressIndicator(
            value: ratio,
            backgroundColor: const Color(0xFF131F24),
            valueColor: AlwaysStoppedAnimation<Color>(barColor),
            minHeight: 8,
          ),
        ),
      ],
    );
  }

  Widget _buildQuickActionsRow() {
    return Row(
      children: [
        Expanded(
          child: TactileButton(
            label: '📸 สแกน AI',
            color: FeedMeColors.featherGreen,
            shadowColor: FeedMeColors.featherGreenShadow,
            height: 44,
            onPressed: () => onSwitchTab(1),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: TactileButton(
            label: '⚖️ ตาชั่ง BLE',
            color: FeedMeColors.kitchenCyan,
            shadowColor: FeedMeColors.kitchenCyanShadow,
            height: 44,
            onPressed: () => onSwitchTab(1),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: TactileButton(
            label: '🏃 ออกกำลัง',
            color: FeedMeColors.cardioOrange,
            shadowColor: FeedMeColors.cardioOrangeShadow,
            height: 44,
            onPressed: () => onSwitchTab(2),
          ),
        ),
      ],
    );
  }

  Widget _buildDailyQuestsCard() {
    return TactileCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                '🎯 เควสประจำวัน (Daily Quests)',
                style: TextStyle(
                  color: FeedMeColors.textPrimary,
                  fontSize: 13,
                  fontWeight: FontWeight.w900,
                ),
              ),
              Text(
                '${controller.dailyQuests.where((q) => q.completed).length}/${controller.dailyQuests.length} สำเร็จ',
                style: const TextStyle(
                  color: FeedMeColors.leagueGold,
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          ...controller.dailyQuests.map((quest) {
            return Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFF131F24),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: quest.completed
                      ? FeedMeColors.featherGreen.withValues(alpha: 0.4)
                      : Colors.white.withValues(alpha: 0.05),
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    quest.completed ? Icons.check_circle_rounded : Icons.radio_button_unchecked,
                    color: quest.completed ? FeedMeColors.featherGreen : FeedMeColors.textMuted,
                    size: 18,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      quest.title,
                      style: TextStyle(
                        color: quest.completed ? FeedMeColors.textSecondary : FeedMeColors.textPrimary,
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        decoration: quest.completed ? TextDecoration.lineThrough : null,
                      ),
                    ),
                  ),
                  Text(
                    '+${quest.rewardXp} XP',
                    style: const TextStyle(
                      color: FeedMeColors.leagueGold,
                      fontSize: 11,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildTodayMealsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '🍽️ มื้ออาหารที่บันทึกวันนี้',
          style: TextStyle(
            color: FeedMeColors.textPrimary,
            fontSize: 14,
            fontWeight: FontWeight.w900,
          ),
        ),
        const SizedBox(height: 8),
        if (controller.loggedMeals.isEmpty)
          const TactileCard(
            child: Center(
              child: Text(
                'ยังไม่มีมื้ออาหารวันนี้ แตะ "สแกน AI" หรือ "ตาชั่ง BLE" ด้านบนได้เลย!',
                style: TextStyle(color: FeedMeColors.textMuted, fontSize: 12),
              ),
            ),
          )
        else
          ...controller.loggedMeals.map((meal) {
            return Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: FeedMeColors.card,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: FeedMeColors.cardBorder),
              ),
              child: Row(
                children: [
                  Text(meal.emoji, style: const TextStyle(fontSize: 26)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          meal.name,
                          style: const TextStyle(
                            color: FeedMeColors.textPrimary,
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'P: ${meal.proteinG.round()}g · C: ${meal.carbsG.round()}g · F: ${meal.fatG.round()}g · ${meal.grams.round()}g',
                          style: const TextStyle(
                            color: FeedMeColors.textMuted,
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    '+${meal.calories} kcal',
                    style: const TextStyle(
                      color: FeedMeColors.featherGreen,
                      fontSize: 13,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ],
              ),
            );
          }),
      ],
    );
  }
}
