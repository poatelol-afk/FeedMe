'use client';

import { useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { WORKOUT_PLANS, calculateMetCalories } from '@/lib/workout-presets';
import { WorkoutPlan } from '@/types';

interface WorkoutPresetsProps {
  onPlanComplete: (plan: WorkoutPlan, caloriesBurned: number, coinsEarned: number) => void;
}

export default function WorkoutPresets({ onPlanComplete }: WorkoutPresetsProps) {
  const { profile } = useAppState();
  const [selectedGoal, setSelectedGoal] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [activePlan, setActivePlan] = useState<WorkoutPlan | null>(null);
  const [checkedExercises, setCheckedExercises] = useState<Record<string, boolean>>({});
  const [restTimer, setRestTimer] = useState<number | null>(null);

  const userWeight = profile?.weight ?? 70;

  const filteredPlans = WORKOUT_PLANS.filter(p => {
    if (selectedGoal !== 'all' && p.goal !== selectedGoal) return false;
    if (selectedMode !== 'all' && p.mode !== selectedMode) return false;
    return true;
  });

  const handleOpenPlan = (plan: WorkoutPlan) => {
    setActivePlan(plan);
    setCheckedExercises({});
    setRestTimer(null);
  };

  const handleToggleExercise = (name: string) => {
    setCheckedExercises(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleStartRest = (seconds: number) => {
    setRestTimer(seconds);
    const interval = setInterval(() => {
      setRestTimer(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleFinishRoutine = () => {
    if (!activePlan) return;
    const caloriesBurned = calculateMetCalories(activePlan.met, userWeight, activePlan.durationMin);
    // Coins = duration * 2.5 average
    const coinsEarned = Math.round(activePlan.durationMin * 2.5);

    onPlanComplete(activePlan, caloriesBurned, coinsEarned);
    setActivePlan(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Goal Filter */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'all', label: 'All Goals' },
            { id: 'fat_loss', label: '🔥 Fat Loss' },
            { id: 'muscle_gain', label: '💪 Muscle Gain' },
            { id: 'maintain', label: '🧘 Health & Posture' },
          ].map(g => (
            <button
              key={g.id}
              type="button"
              onClick={() => setSelectedGoal(g.id)}
              style={{
                padding: '6px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: '500',
                background: selectedGoal === g.id ? 'var(--accent)' : 'var(--bg-elevated)',
                color: selectedGoal === g.id ? '#111110' : 'var(--text-secondary)',
                border: `1px solid ${selectedGoal === g.id ? 'var(--accent)' : 'var(--border-soft)'}`,
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s ease',
              }}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Mode Filter */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
          {[
            { id: 'all', label: 'All Modes' },
            { id: 'gym', label: '🏋️ Gym' },
            { id: 'home', label: '🏠 Home' },
            { id: 'cardio', label: '🏃 Cardio' },
          ].map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMode(m.id)}
              style={{
                padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: '500',
                background: selectedMode === m.id ? 'var(--gold-soft)' : 'transparent',
                color: selectedMode === m.id ? 'var(--gold)' : 'var(--text-muted)',
                border: `1px solid ${selectedMode === m.id ? 'rgba(201,169,110,0.3)' : 'var(--border-soft)'}`,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredPlans.map(plan => {
          const estimatedCals = calculateMetCalories(plan.met, userWeight, plan.durationMin);
          return (
            <div
              key={plan.id}
              onClick={() => handleOpenPlan(plan)}
              className="card"
              style={{
                padding: '16px 18px', cursor: 'pointer', transition: 'all 0.15s ease',
                display: 'flex', flexDirection: 'column', gap: '10px',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-soft)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div className="flex items-start justify-between" style={{ gap: '10px' }}>
                <div className="flex items-start" style={{ gap: '12px' }}>
                  <span style={{ fontSize: '24px', lineHeight: 1 }}>{plan.emoji}</span>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {plan.title}
                    </h3>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {plan.subtitle}
                    </p>
                  </div>
                </div>
                <span className="badge-accent" style={{ fontSize: '10px', padding: '2px 8px' }}>
                  {plan.difficulty}
                </span>
              </div>

              <div className="flex items-center justify-between" style={{
                fontSize: '11px', color: 'var(--text-muted)', paddingTop: '8px',
                borderTop: '1px solid var(--border-soft)',
              }}>
                <span>⏱ {plan.durationMin} min · {plan.exercises.length} moves</span>
                <span style={{ color: 'var(--gold)', fontWeight: '500' }}>
                  🔥 ~{estimatedCals} kcal (MET {plan.met})
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Routine Detail Walkthrough Modal / Drawer */}
      {activePlan && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}>
          <div
            className="animate-slide-down"
            style={{
              background: 'var(--bg-surface)', borderTop: '1px solid var(--border-mid)',
              borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
              width: '100%', maxWidth: '520px', maxHeight: '88vh', overflowY: 'auto',
              padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px',
            }}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="badge-gold" style={{ fontSize: '10px' }}>
                  {activePlan.mode.toUpperCase()} · MET {activePlan.met}
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginTop: '6px' }}>
                  {activePlan.emoji} {activePlan.title}
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {activePlan.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActivePlan(null)}
                style={{
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)',
                  width: '30px', height: '30px', borderRadius: '50%', color: 'var(--text-muted)',
                  cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Stats highlight */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px',
              padding: '12px', borderRadius: '14px', background: 'var(--bg-elevated)',
              border: '1px solid var(--border-soft)', textAlign: 'center',
            }}>
              <div>
                <p style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-primary)' }}>{activePlan.durationMin}m</p>
                <p className="text-label" style={{ marginTop: '2px' }}>Duration</p>
              </div>
              <div>
                <p style={{ fontSize: '16px', fontWeight: '500', color: 'var(--gold)' }}>
                  ~{calculateMetCalories(activePlan.met, userWeight, activePlan.durationMin)}
                </p>
                <p className="text-label" style={{ marginTop: '2px' }}>Burn (kcal)</p>
              </div>
              <div>
                <p style={{ fontSize: '16px', fontWeight: '500', color: 'var(--accent)' }}>
                  +{Math.round(activePlan.durationMin * 2.5)}
                </p>
                <p className="text-label" style={{ marginTop: '2px' }}>Coins</p>
              </div>
            </div>

            {/* Rest Timer Floating Bar if active */}
            {restTimer !== null && (
              <div style={{
                background: 'rgba(201,169,110,0.15)', border: '1px solid var(--gold)',
                borderRadius: '12px', padding: '10px 14px', display: 'flex',
                alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: '13px', color: 'var(--gold)', fontWeight: '500' }}>
                  ⏳ Rest Interval: {restTimer}s remaining
                </span>
                <button
                  type="button"
                  onClick={() => setRestTimer(null)}
                  style={{
                    background: 'transparent', border: 'none', color: 'var(--gold)',
                    fontSize: '11px', cursor: 'pointer', textDecoration: 'underline',
                  }}
                >
                  Skip
                </button>
              </div>
            )}

            {/* Exercise List */}
            <p className="text-label">Exercises & Sets</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activePlan.exercises.map((ex, idx) => {
                const isChecked = Boolean(checkedExercises[ex.name]);
                return (
                  <div
                    key={ex.name}
                    onClick={() => handleToggleExercise(ex.name)}
                    style={{
                      padding: '12px 14px', borderRadius: '12px',
                      background: isChecked ? 'rgba(143,184,154,0.08)' : 'var(--bg-elevated)',
                      border: `1px solid ${isChecked ? 'rgba(143,184,154,0.3)' : 'var(--border-soft)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      cursor: 'pointer', transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        width: '22px', height: '22px', borderRadius: '50%',
                        background: 'var(--bg-overlay)', color: 'var(--text-muted)',
                        fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {idx + 1}
                      </span>
                      <div>
                        <p style={{
                          fontSize: '13px', fontWeight: '500',
                          color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: isChecked ? 'line-through' : 'none',
                        }}>
                          {ex.name}
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {ex.sets} sets × {ex.reps} {ex.notes ? `· ${ex.notes}` : ''}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          handleStartRest(ex.restSeconds);
                        }}
                        style={{
                          padding: '4px 8px', borderRadius: '6px', fontSize: '10px',
                          background: 'var(--bg-overlay)', border: '1px solid var(--border-soft)',
                          color: 'var(--text-secondary)', cursor: 'pointer',
                        }}
                      >
                        ⏱ {ex.restSeconds}s rest
                      </button>
                      <div style={{
                        width: '20px', height: '20px', borderRadius: '6px',
                        border: `1.5px solid ${isChecked ? 'var(--accent)' : 'var(--border-mid)'}`,
                        background: isChecked ? 'var(--accent)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#111110', fontSize: '11px', fontWeight: 'bold',
                      }}>
                        {isChecked && '✓'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Complete Button */}
            <button
              type="button"
              onClick={handleFinishRoutine}
              className="btn-primary"
              style={{ marginTop: '8px', padding: '14px' }}
            >
              Complete & Log Session 🔥
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
