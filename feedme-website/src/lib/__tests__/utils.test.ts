import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateGoal,
  calculateBmi,
  computeWeightDeltas,
  calculateFitnessLevel,
  sanitizeRedirectPath,
} from '../utils.ts';

describe('FeedMe core domain utilities', () => {
  it('calculates Mifflin-St Jeor TDEE and 30/40/30 macros accurately', () => {
    const goal = calculateGoal({ age: 26, gender: 'male', weight: 70, height: 175, activity: 1.55 });
    assert.equal(goal.tdee, 2587);
    assert.equal(goal.protein.g, 194);
    assert.equal(goal.carbs.g, 259);
    assert.equal(goal.fat.g, 86);
  });

  it('calculates BMI to 1 decimal place and handles invalid height', () => {
    assert.equal(calculateBmi(70, 175), 22.9);
    assert.equal(calculateBmi(70, 0), null);
  });

  it('computes 7d and 30d weight deltas from actual history instead of hardcoded constants', () => {
    const now = new Date('2026-10-13T12:00:00Z');
    const single = computeWeightDeltas([
      { id: '1', weightKg: 70, bmi: 22.9, source: 'manual', measuredAt: '2026-10-13T08:00:00Z' },
    ], now);
    assert.equal(single.latest, 70);
    assert.equal(single.change7d, null);
    assert.equal(single.change30d, null);

    const multi = computeWeightDeltas([
      { id: '1', weightKg: 72.4, bmi: 23.6, source: 'manual', measuredAt: '2026-09-20T08:00:00Z' },
      { id: '2', weightKg: 71.1, bmi: 23.2, source: 'manual', measuredAt: '2026-10-05T08:00:00Z' },
      { id: '3', weightKg: 70.0, bmi: 22.9, source: 'manual', measuredAt: '2026-10-13T08:00:00Z' },
    ], now);
    assert.equal(multi.latest, 70.0);
    assert.equal(multi.change7d, -1.1);
    assert.equal(multi.change30d, -2.4);
  });

  it('rejects open-redirect paths including protocol-relative URLs', () => {
    assert.equal(sanitizeRedirectPath('/dashboard'), '/dashboard');
    assert.equal(sanitizeRedirectPath('/profile?tab=weight'), '/profile?tab=weight');
    assert.equal(sanitizeRedirectPath('//evil.com'), '/dashboard');
    assert.equal(sanitizeRedirectPath('https://evil.com'), '/dashboard');
    assert.equal(sanitizeRedirectPath('/\\evil.com'), '/dashboard');
    assert.equal(sanitizeRedirectPath(null), '/dashboard');
  });

  it('calculates RPG fitness level and title from streak, quests, and workouts', () => {
    const lv1 = calculateFitnessLevel(0, 0, 0);
    assert.equal(lv1.level, 1);
    assert.equal(lv1.title, 'Rookie');

    const lv4 = calculateFitnessLevel(7, 3, 5);
    assert.ok(lv4.level >= 3);
  });
});
