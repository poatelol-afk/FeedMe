// ══════════════════════════════════════════════════════════════
//  FeedMe AI — Modern Bento Athletic Design System Tokens
//  Light Slate Canvas (#F1F5F9), Crisp Bento Cards (#FFFFFF),
//  Midnight Navy Hero Card (#0F172A), Electric Mint (#10B981),
//  and Sky Cyan AI Accent (#38BDF8).
// ══════════════════════════════════════════════════════════════

export const colors = {
  // Core Bento Athletic Foundation
  primary:       '#10B981', // Electric Mint primary action
  primaryDark:   '#059669',
  primarySoft:   'rgba(16, 185, 129, 0.12)',
  onPrimary:     '#FFFFFF',
  background:    '#F1F5F9', // Light Slate Canvas
  heroBg:        '#0F172A', // Midnight Navy Hero Bento Card
  heroElevated:  '#1E293B',
  accent:        '#0284C7', // Sky Cyan Athletic Accent
  accentDark:    '#0369A1',
  accentSoft:    'rgba(56, 189, 248, 0.14)',
  accentMid:     'rgba(56, 189, 248, 0.25)',
  aiBlue:        '#0284C7',
  aiBlueSoft:    'rgba(56, 189, 248, 0.14)',

  // Typography
  text:          '#0F172A',
  textPrimary:   '#0F172A',
  textSecondary: '#475569',
  textSecond:    '#475569',
  textMuted:     '#64748B',

  // Containers & Surfaces
  card:          '#FFFFFF',
  surface:       '#FFFFFF',
  bgBase:        '#F1F5F9',
  bgSurface:     '#FFFFFF',
  bgElevated:    '#F8FAFC',
  bgCard:        '#FFFFFF',

  // Borders & Dividers
  border:        '#E2E8F0',
  cardBorder:    '#E2E8F0',
  borderSoft:    '#E2E8F0',
  borderMid:     '#CBD5E1',
  borderSky:     '#BAE6FD',

  // Gamification & Status
  streak:        '#F59E0B',
  streakDark:    '#D97706',
  coins:         '#F59E0B',
  coinsDark:     '#B45309',
  gold:          '#F59E0B',
  hearts:        '#EF4444',
  heartsDark:    '#DC2626',
  purple:        '#6366F1',
  purpleDark:    '#4F46E5',

  danger:        '#EF4444',
  warning:       '#F59E0B',
  success:       '#10B981',

  // Macro Palette
  protein:       '#0284C7',
  carbs:         '#059669',
  fat:           '#D97706',
};

export const spacing = {
  xs:  6,
  sm:  10,
  md:  16,
  lg:  20,
  xl:  28,
  xxl: 36,
};

export const radius = {
  sm:   10,
  md:   14,
  lg:   18,
  xl:   22,
  full: 9999,
};

export const fontSize = {
  xs:    11,
  sm:    13,
  base:  15,
  lg:    17,
  xl:    20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 42,
};

export const button3D = {
  primary: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
  },
  accent: {
    backgroundColor: colors.heroBg,
    borderRadius: radius.md,
  },
  streak: {
    backgroundColor: colors.streak,
    borderRadius: radius.md,
  },
  gold: {
    backgroundColor: colors.coins,
    borderRadius: radius.md,
  },
  white: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    borderRadius: radius.md,
  },
  danger: {
    backgroundColor: colors.danger,
    borderRadius: radius.md,
  },
};

export const buttonBento = button3D;

export const cardStyle = {
  backgroundColor: colors.card,
  borderRadius: radius.lg,
  borderWidth: 1,
  borderColor: colors.border,
  padding: spacing.lg,
};

export const cardBento = {
  backgroundColor: colors.card,
  borderRadius: radius.lg,
  borderWidth: 1,
  borderColor: colors.border,
};

export const cardHeroBento = {
  backgroundColor: colors.heroBg,
  borderRadius: radius.lg,
  borderWidth: 1,
  borderColor: colors.heroElevated,
};
