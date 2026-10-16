import 'package:flutter/material.dart';
import 'core/services/feedme_controller.dart';
import 'core/theme/feedme_theme.dart';
import 'features/home/home_screen.dart';
import 'features/kitchen/kitchen_screen.dart';
import 'features/league/league_screen.dart';
import 'features/profile/profile_screen.dart';
import 'features/workout/workout_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const FeedMeApp());
}

/// ═══════════════════════════════════════════════════════════════════════════════
/// FeedMe 2.0 Mobile Root App
/// Duolingo-style Gamified Fitness & Nutrition App with Tactile 3D UI
/// ═══════════════════════════════════════════════════════════════════════════════
class FeedMeApp extends StatefulWidget {
  final FeedMeController? controller;

  const FeedMeApp({super.key, this.controller});

  @override
  State<FeedMeApp> createState() => _FeedMeAppState();
}

class _FeedMeAppState extends State<FeedMeApp> {
  late final FeedMeController _controller;

  @override
  void initState() {
    super.initState();
    _controller = widget.controller ?? FeedMeController();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FeedMe',
      debugShowCheckedModeBanner: false,
      theme: FeedMeTheme.darkTheme,
      home: FeedMeMainShell(controller: _controller),
    );
  }
}

/// ═══════════════════════════════════════════════════════════════════════════════
/// Main 5-Tab Shell with Persistent Gamification Top Bar and IndexedStack
/// ═══════════════════════════════════════════════════════════════════════════════
class FeedMeMainShell extends StatefulWidget {
  final FeedMeController controller;

  const FeedMeMainShell({super.key, required this.controller});

  @override
  State<FeedMeMainShell> createState() => _FeedMeMainShellState();
}

class _FeedMeMainShellState extends State<FeedMeMainShell> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final controller = widget.controller;

    return AnimatedBuilder(
      animation: controller,
      builder: (context, _) {
        return Scaffold(
          backgroundColor: FeedMeColors.canvasDark,
          appBar: _buildGamifiedTopBar(controller),
          body: IndexedStack(
            index: _currentIndex,
            children: [
              HomeScreen(
                controller: controller,
                onSwitchTab: (index) => setState(() => _currentIndex = index),
              ),
              KitchenScreen(controller: controller),
              WorkoutScreen(controller: controller),
              LeagueScreen(controller: controller),
              ProfileScreen(controller: controller),
            ],
          ),
          bottomNavigationBar: _buildTactileBottomBar(),
        );
      },
    );
  }

  // ─── Gamified Top Status Bar ───────────────────────────────────────────────
  PreferredSizeWidget _buildGamifiedTopBar(FeedMeController controller) {
    return PreferredSize(
      preferredSize: const Size.fromHeight(56.0),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        decoration: const BoxDecoration(
          color: FeedMeColors.canvasDark,
          border: Border(
            bottom: BorderSide(
              color: FeedMeColors.surfaceCardStroke,
              width: 1.5,
            ),
          ),
        ),
        child: SafeArea(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Logo & App Name
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: FeedMeColors.featherGreen,
                      borderRadius: BorderRadius.circular(10),
                      boxShadow: const [
                        BoxSideShadow(
                          color: FeedMeColors.featherGreenDark,
                          offset: Offset(0, 2),
                          blurRadius: 0,
                        ),
                      ],
                    ),
                    child: const Text(
                      'FeedMe',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w900,
                        fontSize: 14,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                ],
              ),

              // Gamification Counters (Streak, Gems, XP)
              Row(
                children: [
                  // Streak Counter
                  _buildStatBadge(
                    emoji: '🔥',
                    value: '${controller.streakDays}',
                    color: FeedMeColors.streakOrange,
                  ),
                  const SizedBox(width: 8),

                  // Gems Counter
                  _buildStatBadge(
                    emoji: '💎',
                    value: '${controller.gems}',
                    color: FeedMeColors.gemPurple,
                  ),
                  const SizedBox(width: 8),

                  // XP Counter
                  _buildStatBadge(
                    emoji: '⚡',
                    value: '${controller.weeklyXp}',
                    color: FeedMeColors.lightningYellow,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatBadge({
    required String emoji,
    required String value,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: color.withValues(alpha: 0.35),
          width: 1.2,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(emoji, style: const TextStyle(fontSize: 13)),
          const SizedBox(width: 4),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 13,
              fontWeight: FontWeight.w800,
            ),
          ),
        ],
      ),
    );
  }

  // ─── Duolingo-style Tactile Bottom Navigation Bar ──────────────────────────
  Widget _buildTactileBottomBar() {
    return Container(
      decoration: const BoxDecoration(
        color: FeedMeColors.surfaceCard,
        border: Border(
          top: BorderSide(
            color: FeedMeColors.surfaceCardStroke,
            width: 2.0,
          ),
        ),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 6.0, horizontal: 8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildTabItem(index: 0, label: 'หน้าแรก', emoji: '🏠'),
              _buildTabItem(index: 1, label: 'ครัว AI', emoji: '🍳'),
              _buildTabItem(index: 2, label: 'ออกกำลัง', emoji: '🏃'),
              _buildTabItem(index: 3, label: 'ลีกเพื่อน', emoji: '🏆'),
              _buildTabItem(index: 4, label: 'โปรไฟล์', emoji: '👤'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTabItem({
    required int index,
    required String label,
    required String emoji,
  }) {
    final isSelected = _currentIndex == index;

    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: () {
        setState(() {
          _currentIndex = index;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected
              ? FeedMeColors.featherGreen.withValues(alpha: 0.15)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          border: isSelected
              ? Border.all(
                  color: FeedMeColors.featherGreen.withValues(alpha: 0.4),
                  width: 1.5,
                )
              : Border.all(color: Colors.transparent, width: 1.5),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              emoji,
              style: TextStyle(
                fontSize: isSelected ? 22 : 19,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(
                color: isSelected
                    ? FeedMeColors.featherGreen
                    : FeedMeColors.textMuted,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                fontSize: 11,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Helper class for box shadows
class BoxSideShadow extends BoxShadow {
  const BoxSideShadow({
    super.color = const Color(0xFF000000),
    super.offset = Offset.zero,
    super.blurRadius = 0.0,
    super.spreadRadius = 0.0,
  });
}
