// ══════════════════════════════════════════════════════════════
//  FeedMe — Duolingo Gamification Design System Tokens
//  Aligned with Khalidabdi1/design-ai/duolingo/DESIGN.md:
//  Primary Green (#58CC02), 3D Depth (#46A302), Canvas (#ddf4ff),
//  Crisp White Cards (#FFFFFF), Ink Text (#4B4B4B), and 3D Buttons
// ══════════════════════════════════════════════════════════════

export const colors = {
  // Core Duolingo Foundation (GitHub Spec)
  primary:      '#58CC02', // Vivid Duolingo green (CTAs, completion, success)
  primaryDark:  '#46A302', // 3D bottom border for primary button
  primarySoft:  '#D7FFB8', // Highlight fill and success tint
  onPrimary:    '#FFFFFF', // White text on vivid green
  background:   '#ddf4ff', // Calming pale sky-blue canvas
  accent:       '#1CB0F6', // Bright cyan-blue (interactive highlights & protein)
  accentDark:   '#1899D6', // 3D bottom border for accent button
  accentSoft:   'rgba(28, 176, 246, 0.12)',
  accentMid:    'rgba(28, 176, 246, 0.25)',

  // Typography
  text:         '#4B4B4B', // Duolingo primary ink
  textPrimary:  '#4B4B4B',
  textSecondary:'#777777', // Secondary labels
  textSecond:   '#777777',
  textMuted:    '#777777',

  // Containers & Surfaces
  card:         '#FFFFFF', // Crisp white content cards
  surface:      '#FFFFFF',
  bgBase:       '#ddf4ff', // Canvas background
  bgSurface:    '#FFFFFF',
  bgElevated:   '#F7F7F7', // Light gray support surface
  bgCard:       '#FFFFFF',

  // Borders & Dividers
  border:       '#E5E5E5',
  borderSoft:   '#E5E5E5',
  borderMid:    '#D7D7D7',
  borderSky:    '#BFE9FF',

  // Gamification Assets
  streak:       '#FF9600', // Fire orange
  streakDark:   '#CC7800',
  coins:        '#FFD900', // Duolingo gold coins / gems
  coinsDark:    '#CCA000',
  gold:         '#FFD900',
  hearts:       '#FF4B4B', // Duolingo heart red
  heartsDark:   '#D92B2B',
  purple:       '#CE82FF', // XP & League purple
  purpleDark:   '#A559D9',

  // Status & Feedback
  danger:       '#FF4B4B',
  warning:      '#FF9600',
  success:      '#58CC02',

  // Macro Palette
  protein:      '#1CB0F6', // Duolingo cyan
  carbs:        '#FFD900', // Duolingo gold
  fat:          '#FF9600', // Duolingo orange
};

export const spacing = {
  xs:  6,
  sm:  10, // 10px base unit
  md:  15,
  lg:  20, // 2x base
  xl:  30, // 3x base
  xxl: 40,
};

export const radius = {
  sm:   10,
  md:   14,
  lg:   16,
  xl:   24, // 24px per Duolingo card spec
  full: 9999,
};

export const fontSize = {
  xs:   11,
  sm:   13,
  base: 15,
  lg:   17,
  xl:   20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 44,
};

// ── Signature Duolingo 3D Pushable Button Styles ──────────────
export const button3D = {
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
    borderBottomWidth: 4,
    borderRadius: radius.md,
  },
  accent: {
    backgroundColor: colors.accent,
    borderColor: colors.accentDark,
    borderBottomWidth: 4,
    borderRadius: radius.md,
  },
  streak: {
    backgroundColor: colors.streak,
    borderColor: colors.streakDark,
    borderBottomWidth: 4,
    borderRadius: radius.md,
  },
  gold: {
    backgroundColor: colors.coins,
    borderColor: colors.coinsDark,
    borderBottomWidth: 4,
    borderRadius: radius.md,
  },
  white: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5E5',
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: radius.md,
  },
  danger: {
    backgroundColor: colors.danger,
    borderColor: colors.heartsDark,
    borderBottomWidth: 4,
    borderRadius: radius.md,
  },
};

// ── Playful Card Elevation (Cartoon-Physical Depth) ───────────
export const cardStyle = {
  backgroundColor: colors.card,
  borderRadius: radius.xl,
  borderWidth: 2,
  borderColor: '#E5E5E5',
  borderBottomWidth: 4,
  padding: spacing.lg,
};
