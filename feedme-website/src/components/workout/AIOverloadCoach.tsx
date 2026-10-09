'use client';

import { useState } from 'react';
import {
  POPULAR_EXERCISES,
  ExerciseSet,
  evaluateProgressiveOverload,
} from '@/lib/progressiveOverload';

interface AIOverloadCoachProps {
  onLogWorkout: (name: string, durationMin: number, caloriesBurned: number, coinsEarned: number) => void;
}

export default function AIOverloadCoach({ onLogWorkout }: AIOverloadCoachProps) {
  const [selectedExId, setSelectedExId] = useState(POPULAR_EXERCISES[0].id);
  const exercise = POPULAR_EXERCISES.find((e) => e.id === selectedExId) ?? POPULAR_EXERCISES[0];

  const [sets, setSets] = useState<ExerciseSet[]>([
    { setNumber: 1, weightKg: exercise.defaultWeight, reps: exercise.reps[1], rpe: 8 },
    { setNumber: 2, weightKg: exercise.defaultWeight, reps: exercise.reps[1], rpe: 8 },
    { setNumber: 3, weightKg: exercise.defaultWeight, reps: exercise.reps[0], rpe: 8.5 },
  ]);

  const insight = evaluateProgressiveOverload(sets, exercise.reps);

  const handleExerciseChange = (id: string) => {
    setSelectedExId(id);
    const ex = POPULAR_EXERCISES.find((e) => e.id === id) ?? POPULAR_EXERCISES[0];
    setSets([
      { setNumber: 1, weightKg: ex.defaultWeight, reps: ex.reps[1], rpe: 8 },
      { setNumber: 2, weightKg: ex.defaultWeight, reps: ex.reps[1], rpe: 8 },
      { setNumber: 3, weightKg: ex.defaultWeight, reps: ex.reps[0], rpe: 8.5 },
    ]);
  };

  const updateSet = (index: number, field: keyof ExerciseSet, value: number) => {
    const updated = [...sets];
    updated[index] = { ...updated[index], [field]: value };
    setSets(updated);
  };

  const addSet = () => {
    const last = sets[sets.length - 1];
    setSets([
      ...sets,
      {
        setNumber: sets.length + 1,
        weightKg: last ? last.weightKg : exercise.defaultWeight,
        reps: last ? last.reps : exercise.reps[0],
        rpe: 8,
      },
    ]);
  };

  const removeSet = (index: number) => {
    if (sets.length <= 1) return;
    setSets(sets.filter((_, i) => i !== index).map((s, idx) => ({ ...s, setNumber: idx + 1 })));
  };

  const handleSaveToDiary = () => {
    const totalVolume = insight.volumeLoad;
    // Estimate calories burned: based on gym lifting session (~5-6 kcal/min, ~4 min per 3 sets including rest)
    const duration = Math.max(15, sets.length * 4);
    const calories = Math.round(duration * 6.5);
    const coins = Math.round(duration * 2);

    onLogWorkout(
      `${exercise.name} (${sets.length} sets · ${totalVolume.toLocaleString()} kg volume)`,
      duration,
      calories,
      coins
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Exercise Selector */}
      <div className="card" style={{ padding: '20px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '14px' }}>
          <div>
            <span className="text-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
              AI Progressive Overload Planner
            </span>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              บันทึกน้ำหนัก, Reps และ RPE เพื่อคำนวณการเพิ่มน้ำหนักอัตโนมัติ
            </p>
          </div>
          <span style={{
            fontSize: '11px',
            padding: '3px 8px',
            borderRadius: '6px',
            background: 'var(--accent-soft)',
            color: 'var(--accent)',
            fontWeight: '600',
          }}>
            Target: {exercise.reps[0]}–{exercise.reps[1]} reps
          </span>
        </div>

        {/* Dropdown */}
        <select
          value={selectedExId}
          onChange={(e) => handleExerciseChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-soft)',
            color: 'var(--text-primary)',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            marginBottom: '16px',
          }}
        >
          {POPULAR_EXERCISES.map((ex) => (
            <option key={ex.id} value={ex.id}>
              🏋️ {ex.name} ({ex.category.toUpperCase()})
            </option>
          ))}
        </select>

        {/* Sets Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr 32px',
            gap: '8px', padding: '0 4px', fontSize: '10px', color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            <span>Set</span>
            <span>Weight (kg)</span>
            <span>Reps</span>
            <span>RPE (1-10)</span>
            <span></span>
          </div>

          {sets.map((set, idx) => (
            <div
              key={set.setNumber}
              style={{
                display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr 32px',
                gap: '8px', alignItems: 'center',
                padding: '8px 10px', borderRadius: '10px',
                background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
                #{set.setNumber}
              </span>

              <input
                type="number"
                step="0.5"
                value={set.weightKg}
                onChange={(e) => updateSet(idx, 'weightKg', parseFloat(e.target.value) || 0)}
                style={{
                  padding: '6px 8px', borderRadius: '8px',
                  background: 'var(--bg-surface)', border: '1px solid var(--border-soft)',
                  color: 'var(--text-primary)', fontSize: '12px', textAlign: 'center',
                }}
              />

              <input
                type="number"
                value={set.reps}
                onChange={(e) => updateSet(idx, 'reps', parseInt(e.target.value) || 0)}
                style={{
                  padding: '6px 8px', borderRadius: '8px',
                  background: 'var(--bg-surface)', border: '1px solid var(--border-soft)',
                  color: 'var(--text-primary)', fontSize: '12px', textAlign: 'center',
                }}
              />

              <select
                value={set.rpe}
                onChange={(e) => updateSet(idx, 'rpe', parseFloat(e.target.value) || 8)}
                style={{
                  padding: '6px 4px', borderRadius: '8px',
                  background: 'var(--bg-surface)', border: '1px solid var(--border-soft)',
                  color: 'var(--text-primary)', fontSize: '12px', textAlign: 'center',
                }}
              >
                <option value={7}>7 (เหลือ 3 reps)</option>
                <option value={7.5}>7.5</option>
                <option value={8}>8 (เหลือ 2 reps)</option>
                <option value={8.5}>8.5</option>
                <option value={9}>9 (เหลือ 1 rep)</option>
                <option value={9.5}>9.5</option>
                <option value={10}>10 (หมดแรงพอดี)</option>
              </select>

              <button
                type="button"
                onClick={() => removeSet(idx)}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--text-muted)',
                  cursor: 'pointer', fontSize: '14px',
                }}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addSet}
            style={{
              padding: '8px', borderRadius: '8px',
              background: 'transparent', border: '1px dashed var(--border-mid)',
              color: 'var(--text-secondary)', fontSize: '11px', cursor: 'pointer',
              marginTop: '4px',
            }}
          >
            + เพิ่มเซ็ตถัดไป
          </button>
        </div>
      </div>

      {/* AI Recommendation Insight Card */}
      <div style={{
        borderRadius: '16px',
        padding: '20px',
        background: insight.status === 'increase' ? 'rgba(143,184,154,0.06)' : 'var(--bg-surface)',
        border: `1px solid ${insight.status === 'increase' ? 'rgba(143,184,154,0.3)' : 'var(--border-mid)'}`,
      }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>
              {insight.status === 'increase' ? '🚀' : '📊'}
            </span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
              คำแนะนำ AI สำหรับรอบถัดไป
            </span>
          </div>
          <span style={{
            fontSize: '12px', fontWeight: '600',
            color: insight.status === 'increase' ? 'var(--accent)' : 'var(--text-secondary)',
          }}>
            เป้าหมาย: {insight.nextRecommendedWeightKg} kg × {insight.targetReps} reps
          </span>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
          {insight.message}
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
          padding: '12px', borderRadius: '12px', background: 'var(--bg-elevated)',
          marginBottom: '16px',
        }}>
          <div>
            <span className="text-label">Total Volume Load</span>
            <p style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-primary)', marginTop: '2px' }}>
              {insight.volumeLoad.toLocaleString()} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>kg</span>
            </p>
          </div>
          <div>
            <span className="text-label">Avg Set Intensity</span>
            <p style={{ fontSize: '16px', fontWeight: '500', color: 'var(--gold)', marginTop: '2px' }}>
              RPE {(sets.reduce((s, x) => s + x.rpe, 0) / sets.length).toFixed(1)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveToDiary}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            background: 'var(--accent)',
            color: '#0f1a10',
            fontWeight: '600',
            fontSize: '13px',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.15s ease',
          }}
        >
          บันทึกเข้าประวัติการออกกำลังกาย (+Coins & เผาผลาญแคลอรี)
        </button>
      </div>
    </div>
  );
}
