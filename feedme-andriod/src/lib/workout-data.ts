// ═══════════════════════════════════════════════════════
//  FeedMe — Workout Types & Coin Rates
// ═══════════════════════════════════════════════════════

import type { WorkoutType } from '../types';

export const WORKOUTS: WorkoutType[] = [
  // Cardio — high coin rate
  { id: 'running',      name: 'Running',         emoji: '🏃', coinsPerMinute: 3.0,  caloriesPerMinute: 10,  category: 'cardio' },
  { id: 'cycling',      name: 'Cycling',          emoji: '🚴', coinsPerMinute: 2.5,  caloriesPerMinute: 8,   category: 'cardio' },
  { id: 'swimming',     name: 'Swimming',         emoji: '🏊', coinsPerMinute: 3.5,  caloriesPerMinute: 11,  category: 'cardio' },
  { id: 'jump-rope',    name: 'Jump Rope',        emoji: '🤸', coinsPerMinute: 3.0,  caloriesPerMinute: 12,  category: 'cardio' },
  { id: 'walking',      name: 'Walking',          emoji: '🚶', coinsPerMinute: 1.5,  caloriesPerMinute: 5,   category: 'cardio' },

  // Strength — moderate coin rate
  { id: 'weight-train', name: 'Weight Training',  emoji: '🏋️', coinsPerMinute: 2.0,  caloriesPerMinute: 7,   category: 'strength' },
  { id: 'bodyweight',   name: 'Bodyweight',       emoji: '💪', coinsPerMinute: 2.0,  caloriesPerMinute: 6,   category: 'strength' },
  { id: 'hiit',         name: 'HIIT',             emoji: '⚡', coinsPerMinute: 3.5,  caloriesPerMinute: 13,  category: 'strength' },

  // Flexibility
  { id: 'yoga',         name: 'Yoga',             emoji: '🧘', coinsPerMinute: 1.0,  caloriesPerMinute: 4,   category: 'flexibility' },
  { id: 'stretching',   name: 'Stretching',       emoji: '🤷', coinsPerMinute: 0.8,  caloriesPerMinute: 3,   category: 'flexibility' },

  // Sports
  { id: 'basketball',   name: 'Basketball',       emoji: '🏀', coinsPerMinute: 2.5,  caloriesPerMinute: 9,   category: 'sports' },
  { id: 'soccer',       name: 'Soccer',           emoji: '⚽', coinsPerMinute: 2.5,  caloriesPerMinute: 9,   category: 'sports' },
  { id: 'badminton',    name: 'Badminton',        emoji: '🏸', coinsPerMinute: 2.0,  caloriesPerMinute: 7,   category: 'sports' },
];

export const WORKOUT_CATEGORIES = [
  { id: 'cardio',       label: 'Cardio',      emoji: '❤️' },
  { id: 'strength',     label: 'Strength',    emoji: '💪' },
  { id: 'flexibility',  label: 'Flexibility', emoji: '🧘' },
  { id: 'sports',       label: 'Sports',      emoji: '🏆' },
] as const;
