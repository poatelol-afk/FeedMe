import 'package:flutter/material.dart';

/// ═══════════════════════════════════════════════════════════════════════════════
/// FeedMe 2.0 Tactile 3D Design Tokens & Theme (Duolingo-inspired Dark Slate)
/// ═══════════════════════════════════════════════════════════════════════════════
class FeedMeColors {
  // Surfaces & Backgrounds
  static const Color canvas = Color(0xFF131F24);
  static const Color card = Color(0xFF1F2F36);
  static const Color cardBorder = Color(0xFF2B3E47);
  static const Color cardHover = Color(0xFF263A42);

  // Primary Action & Gamification (Feather Green)
  static const Color featherGreen = Color(0xFF58CC02);
  static const Color featherGreenShadow = Color(0xFF46A302);

  // Cardio & Streak (Orange)
  static const Color cardioOrange = Color(0xFFFF9600);
  static const Color cardioOrangeShadow = Color(0xFFCC7800);

  // Weight Training & Boss Raid (Purple)
  static const Color liftPurple = Color(0xFFCE82FF);
  static const Color liftPurpleShadow = Color(0xFFA855F7);

  // Smart Kitchen & Gems (Cyan)
  static const Color kitchenCyan = Color(0xFF1CB0F6);
  static const Color kitchenCyanShadow = Color(0xFF0284C7);

  // League & XP (Gold)
  static const Color leagueGold = Color(0xFFFFC800);
  static const Color leagueGoldShadow = Color(0xFFE5A800);

  // Alert & Negative states (Coral)
  static const Color coralRed = Color(0xFFFF4B4B);
  static const Color coralRedShadow = Color(0xFFD63030);

  // Text
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFF94A3B8);
  static const Color textMuted = Color(0xFF64748B);

  // Semantic & Screen Aliases (for cohesive cross-screen usage)
  static const Color canvasDark = canvas;
  static const Color surfaceCard = card;
  static const Color surfaceCardStroke = cardBorder;
  static const Color featherGreenDark = featherGreenShadow;
  static const Color gemPurple = liftPurple;
  static const Color streakOrange = cardioOrange;
  static const Color cardioBlue = kitchenCyan;
  static const Color flameRed = coralRed;
  static const Color lightningYellow = leagueGold;
  static const Color textLight = textPrimary;
}

class FeedMeTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: FeedMeColors.canvas,
      primaryColor: FeedMeColors.featherGreen,
      cardColor: FeedMeColors.card,
      fontFamily: 'Prompt', // Modern Thai/English friendly font
      textSelectionTheme: TextSelectionThemeData(
        cursorColor: FeedMeColors.featherGreen,
        selectionColor: FeedMeColors.featherGreen.withValues(alpha: 0.3),
        selectionHandleColor: FeedMeColors.featherGreen,
      ),
      colorScheme: const ColorScheme.dark(
        primary: FeedMeColors.featherGreen,
        secondary: FeedMeColors.kitchenCyan,
        surface: FeedMeColors.card,
        error: FeedMeColors.coralRed,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: FeedMeColors.canvas,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: FeedMeColors.textPrimary,
          fontSize: 18,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}
