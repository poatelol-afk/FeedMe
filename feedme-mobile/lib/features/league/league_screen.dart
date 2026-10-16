import 'package:flutter/material.dart';
import '../../core/services/feedme_controller.dart';
import '../../core/theme/feedme_theme.dart';
import '../../core/widgets/tactile_button.dart';
import '../../core/widgets/tactile_card.dart';

/// ═══════════════════════════════════════════════════════════════════════════════
/// Tab 4: Duolingo-style Weekly Leagues & Opt-In Party Quests / Boss Raid
/// ═══════════════════════════════════════════════════════════════════════════════
class LeagueScreen extends StatelessWidget {
  final FeedMeController controller;

  const LeagueScreen({
    super.key,
    required this.controller,
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
              // ─── 1. Weekly League Header Card ──────────────────────────────
              _buildLeagueBanner(),
              const SizedBox(height: 14.0),

              // ─── 2. Leaderboard Rankings ────────────────────────────────────
              _buildLeaderboardCard(),
              const SizedBox(height: 18.0),

              // ─── 3. Opt-in Party Boss Raid ──────────────────────────────────
              _buildPartyQuestCard(context),
              const SizedBox(height: 18.0),

              // ─── 4. Friend Activity Feed & 1-Tap Stickers ───────────────────
              _buildFriendActivityFeed(),
              const SizedBox(height: 24.0),
            ],
          ),
        );
      },
    );
  }

  Widget _buildLeagueBanner() {
    return TactileCard(
      borderColor: FeedMeColors.leagueGold,
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: FeedMeColors.leagueGold.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: const Text('🏆', style: TextStyle(fontSize: 28)),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  controller.currentLeagueName.isNotEmpty
                      ? controller.currentLeagueName
                      : 'Emerald League (ลีกมรกต)',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w900,
                  ),
                ),

                const SizedBox(height: 2),
                const Text(
                  'รีเซ็ตผลใน 2 วัน 14 ชั่วโมง · เลื่อนชั้น 3 อันดับแรก',
                  style: TextStyle(
                    color: FeedMeColors.textSecondary,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLeaderboardCard() {
    return TactileCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'ตารางอันดับสัปดาห์นี้',
                style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w900),
              ),
              Text(
                '🟢 โซนเลื่อนชั้น (Top 3)',
                style: TextStyle(color: FeedMeColors.featherGreen, fontSize: 11, fontWeight: FontWeight.w800),
              ),
            ],
          ),
          const SizedBox(height: 10),
          ...controller.leagueMembers.asMap().entries.map((entry) {
            final rank = entry.key + 1;
            final member = entry.value;
            final isPromotion = rank <= 3;

            return Container(
              margin: const EdgeInsets.only(bottom: 6),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              decoration: BoxDecoration(
                color: member.isCurrentUser ? FeedMeColors.cardHover : const Color(0xFF131F24),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: member.isCurrentUser
                      ? FeedMeColors.featherGreen
                      : (isPromotion
                          ? FeedMeColors.leagueGold.withValues(alpha: 0.3)
                          : Colors.white.withValues(alpha: 0.05)),
                  width: member.isCurrentUser ? 2.0 : 1.0,
                ),
              ),
              child: Row(
                children: [
                  SizedBox(
                    width: 24,
                    child: Text(
                      '#$rank',
                      style: TextStyle(
                        color: isPromotion ? FeedMeColors.leagueGold : FeedMeColors.textMuted,
                        fontSize: 12,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(member.avatarEmoji, style: const TextStyle(fontSize: 20)),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      member.name,
                      style: TextStyle(
                        color: member.isCurrentUser ? FeedMeColors.featherGreen : Colors.white,
                        fontSize: 12,
                        fontWeight: member.isCurrentUser ? FontWeight.w900 : FontWeight.w700,
                      ),
                    ),
                  ),
                  Text(
                    '${member.weeklyXp} XP',
                    style: TextStyle(
                      color: isPromotion ? FeedMeColors.featherGreen : FeedMeColors.textSecondary,
                      fontSize: 12,
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

  Widget _buildPartyQuestCard(BuildContext context) {
    final party = controller.activePartyQuest;
    final ratio = (party.currentBurnKcal / party.targetBurnKcal).clamp(0.0, 1.0);

    return TactileCard(
      backgroundColor: FeedMeColors.liftPurple.withValues(alpha: 0.12),
      borderColor: FeedMeColors.liftPurple.withValues(alpha: 0.4),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                party.bossName,
                style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w900),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: FeedMeColors.liftPurple.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  party.isJoined ? 'อยู่ในปาร์ตี้ ✓' : 'ยังไม่เข้าร่วม',
                  style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(
              value: ratio,
              backgroundColor: const Color(0xFF131F24),
              valueColor: const AlwaysStoppedAnimation<Color>(FeedMeColors.liftPurple),
              minHeight: 10,
            ),
          ),
          const SizedBox(height: 6),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('เผาผลาญร่วมกัน:', style: TextStyle(color: FeedMeColors.textSecondary, fontSize: 11)),
              Text(
                '${party.currentBurnKcal} / ${party.targetBurnKcal} kcal (${(ratio * 100).round()}%)',
                style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w900),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            'สมาชิกในตี้: ${party.memberNames.join(', ')}',
            style: const TextStyle(color: FeedMeColors.textMuted, fontSize: 10, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 12),
          TactileButton(
            label: party.isJoined ? 'ออกจากปาร์ตี้ชั่วคราว' : '+ ชวนเพื่อนตั้งตี้ / เข้าร่วมอีเวนต์',
            color: party.isJoined ? FeedMeColors.card : FeedMeColors.featherGreen,
            shadowColor: party.isJoined ? FeedMeColors.cardBorder : FeedMeColors.featherGreenShadow,
            height: 42,
            onPressed: () {
              controller.togglePartyQuestJoin();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  backgroundColor: FeedMeColors.card,
                  content: Text(
                    controller.activePartyQuest.isJoined
                        ? 'เข้าร่วมปาร์ตี้ล่าบอสไขมันทรานส์แล้ว! 👾'
                        : 'ออกจากปาร์ตี้ชั่วคราว (XP เดี่ยวของคุณยังคงอยู่ครบ) 👍',
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildFriendActivityFeed() {
    return TactileCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'เพื่อนๆ ในลีก (ส่งสติกเกอร์ให้กำลังใจ 1-Tap):',
            style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildStickerButton('🔥 เชียร์'),
              _buildStickerButton('👏 สุดยอด'),
              _buildStickerButton('👀 แอบกินไร'),
              _buildStickerButton('⚡ สู้ๆ'),
            ],
          ),
          if (controller.recentStickers.isNotEmpty) ...[
            const SizedBox(height: 12),
            const Divider(color: Color(0x20FFFFFF), height: 1),
            const SizedBox(height: 10),
            ...controller.recentStickers.take(3).map((stk) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Text(
                  '✓ $stk (+5 XP)',
                  style: const TextStyle(color: FeedMeColors.leagueGold, fontSize: 11, fontWeight: FontWeight.bold),
                ),
              );
            }),
          ],
        ],
      ),
    );
  }

  Widget _buildStickerButton(String label) {
    return GestureDetector(
      onTap: () => controller.sendFriendSticker('เพื่อนในลีก', label),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: const Color(0xFF131F24),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
        ),
        child: Text(
          label,
          style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}
