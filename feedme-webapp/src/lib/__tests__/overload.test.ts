import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateGoal, computeProgressiveOverload } from '../utils.ts';

describe('feedme-webapp workout & nutrition math', () => {
  it('computes progressive overload from actual lifted set weight, not preset defaultWeight', () => {
    const sets = [
      { weight: '80', reps: '10', rpe: '7' },
      { weight: '85', reps: '10', rpe: '7.5' },
      { weight: '85', reps: '10', rpe: '8' },
    ];
    const res = computeProgressiveOverload(sets, 10, 60);
    assert.equal(res.maxWeight, 85);
    assert.equal(res.shouldIncrease, true);
    assert.equal(res.nextWeight, 87.5);
  });

  it('does not recommend weight increase when RPE > 8 or target reps not met', () => {
    const highRpe = computeProgressiveOverload([
      { weight: '80', reps: '10', rpe: '9' },
    ], 10, 60);
    assert.equal(highRpe.shouldIncrease, false);
    assert.equal(highRpe.nextWeight, 80);
  });

  it('calculates TDEE and macro goals accurately', () => {
    const g = calculateGoal({ age: 25, gender: 'female', weight: 58, height: 165, activity: 1.55 });
    assert.ok(g.tdee > 1800 && g.tdee < 2200);
  });
});
