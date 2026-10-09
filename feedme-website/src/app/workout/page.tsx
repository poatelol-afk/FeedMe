'use client';

import { useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import WorkoutForm from '@/components/workout/WorkoutForm';
import WorkoutPresets from '@/components/workout/WorkoutPresets';
import AIOverloadCoach from '@/components/workout/AIOverloadCoach';
import Toast, { useToast } from '@/components/ui/Toast';
import { WorkoutPlan, WorkoutType } from '@/types';

export default function WorkoutPage() {
  const { addWorkout, workouts, coins } = useAppState();
  const { toast, showToast, hideToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overload' | 'presets' | 'custom'>('overload');

  const handleCustomSubmit = (workout: WorkoutType, duration: number) => {
    const coinsEarned = Math.round(workout.coinsPerMinute * duration);
    const caloriesBurned = Math.round(workout.caloriesPerMinute * duration);
    addWorkout({
      workoutId: workout.id,
      workoutName: workout.name,
      emoji: workout.emoji,
      duration,
      coinsEarned,
      caloriesBurned,
    });
    showToast(`${workout.name} logged — +${coinsEarned} coins, -${caloriesBurned} kcal`);
  };

  const handlePresetComplete = (plan: WorkoutPlan, caloriesBurned: number, coinsEarned: number) => {
    addWorkout({
      workoutId: plan.id,
      workoutName: plan.title,
      emoji: plan.emoji,
      duration: plan.durationMin,
      coinsEarned,
      caloriesBurned,
    });
    showToast(`Great job! Completed ${plan.title} — +${coinsEarned} coins, -${caloriesBurned} kcal 🔥`);
  };

  const handleOverloadComplete = (name: string, duration: number, caloriesBurned: number, coinsEarned: number) => {
    addWorkout({
      workoutId: 'progressive-overload',
      workoutName: name,
      emoji: '🏋️',
      duration,
      coinsEarned,
      caloriesBurned,
    });
    showToast(`Saved ${name} — +${coinsEarned} coins, -${caloriesBurned} kcal!`);
  };

  const totalCoinsToday = workouts.reduce((s, w) => s + w.coinsEarned, 0);
  const totalCalsToday  = workouts.reduce((s, w) => s + w.caloriesBurned, 0);

  return (
    <div style={{ padding: '32px 24px 80px' }} className="animate-fade-in">
      <Toast message={toast.message} isVisible={toast.isVisible} onClose={hideToast} />

      {/* Header */}
      <div className="flex items-start justify-between" style={{ marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '300', letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Move & Workout
          </h1>
          <p className="text-label">AI Progressive Overload, Preset Routines & MET Burns</p>
        </div>
        <div style={{
          background: 'var(--gold-soft)',
          border: '1px solid rgba(201,169,110,0.2)',
          borderRadius: '10px', padding: '6px 12px',
        }}>
          <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--gold)' }}>
            {coins.toLocaleString()} coins
          </span>
        </div>
      </div>

      {/* Today's Summary Card */}
      {workouts.length > 0 && (
        <div className="card" style={{ marginBottom: '18px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '14px' }}>
            <p className="text-label">Today&apos;s Activity</p>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {workouts.length} session{workouts.length > 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', marginBottom: '14px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '20px', fontWeight: '300', color: 'var(--gold)', letterSpacing: '-0.03em' }}>
                +{totalCoinsToday}
              </p>
              <p className="text-label" style={{ marginTop: '4px' }}>Coins earned</p>
            </div>
            <div style={{ background: 'var(--border-soft)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '20px', fontWeight: '300', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                {totalCalsToday}
              </p>
              <p className="text-label" style={{ marginTop: '4px' }}>Cals burned (kcal)</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {workouts.map((w, i) => (
              <div key={w.id}>
                <div className="flex items-center" style={{ gap: '12px', padding: '10px 0' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{w.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>{w.workoutName}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
                      {w.duration} min · -{w.caloriesBurned} kcal
                    </p>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--gold)', fontWeight: '500' }}>+{w.coinsEarned}</p>
                </div>
                {i < workouts.length - 1 && <div className="divider" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px',
        padding: '4px', background: 'var(--bg-elevated)', borderRadius: '14px',
        border: '1px solid var(--border-soft)', marginBottom: '18px',
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('overload')}
          style={{
            padding: '10px 4px', borderRadius: '10px', fontSize: '12px', fontWeight: '500',
            border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
            background: activeTab === 'overload' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'overload' ? 'var(--accent)' : 'var(--text-muted)',
            boxShadow: activeTab === 'overload' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
          }}
        >
          🧠 AI Overload
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          style={{
            padding: '10px 4px', borderRadius: '10px', fontSize: '12px', fontWeight: '500',
            border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
            background: activeTab === 'presets' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'presets' ? 'var(--accent)' : 'var(--text-muted)',
            boxShadow: activeTab === 'presets' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
          }}
        >
          📋 Preset Plans
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('custom')}
          style={{
            padding: '10px 4px', borderRadius: '10px', fontSize: '12px', fontWeight: '500',
            border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
            background: activeTab === 'custom' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'custom' ? 'var(--accent)' : 'var(--text-muted)',
            boxShadow: activeTab === 'custom' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
          }}
        >
          ✍️ Quick Log
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overload' ? (
        <AIOverloadCoach onLogWorkout={handleOverloadComplete} />
      ) : activeTab === 'presets' ? (
        <WorkoutPresets onPlanComplete={handlePresetComplete} />
      ) : (
        <div className="card">
          <p className="text-label" style={{ marginBottom: '16px' }}>Log a custom activity</p>
          <WorkoutForm onSubmit={handleCustomSubmit} />
        </div>
      )}
    </div>
  );
}
