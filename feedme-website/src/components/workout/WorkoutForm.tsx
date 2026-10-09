'use client';

import { useState } from 'react';
import { WORKOUTS, WORKOUT_CATEGORIES } from '@/lib/workout-data';
import { WorkoutType } from '@/types';

interface WorkoutFormProps {
  onSubmit: (workout: WorkoutType, duration: number) => void;
}

export default function WorkoutForm({ onSubmit }: WorkoutFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selected, setSelected] = useState<WorkoutType | null>(null);
  const [duration, setDuration] = useState('');

  const filtered = selectedCategory === 'all'
    ? WORKOUTS
    : WORKOUTS.filter(w => w.category === selectedCategory);

  const coins = selected && duration ? Math.round(selected.coinsPerMinute * Number(duration)) : 0;
  const cals  = selected && duration ? Math.round(selected.caloriesPerMinute * Number(duration)) : 0;

  const handleSubmit = () => {
    if (!selected || !duration || Number(duration) <= 0) return;
    onSubmit(selected, Number(duration));
    setSelected(null);
    setDuration('');
  };

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: '7px 14px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    border: `1px solid ${active ? 'rgba(143,184,154,0.3)' : 'var(--border-soft)'}`,
    background: active ? 'var(--accent-soft)' : 'transparent',
    color: active ? 'var(--accent)' : 'var(--text-muted)',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  });

  return (
    <div>
      {/* Category chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }} className="scrollbar-none">
        <button style={chipStyle(selectedCategory === 'all')} onClick={() => setSelectedCategory('all')}>
          All
        </button>
        {WORKOUT_CATEGORIES.map(c => (
          <button key={c.id} style={chipStyle(selectedCategory === c.id)} onClick={() => setSelectedCategory(c.id)}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Workout list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '12px' }}>
        {filtered.map(w => {
          const isSelected = selected?.id === w.id;
          return (
            <button
              key={w.id}
              onClick={() => setSelected(w)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                width: '100%', textAlign: 'left', cursor: 'pointer',
                padding: '13px 14px', borderRadius: '14px',
                background: isSelected ? 'var(--accent-soft)' : 'transparent',
                border: `1px solid ${isSelected ? 'rgba(143,184,154,0.2)' : 'transparent'}`,
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: '20px', lineHeight: 1, flexShrink: 0 }}>{w.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '13px', fontWeight: '500',
                  color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                }}>
                  {w.name}
                </p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: '12px', color: 'var(--gold)' }}>
                  {w.coinsPerMinute} coins/min
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Duration + Preview */}
      {selected && (
        <div className="animate-fade-up" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <p className="text-label" style={{ marginBottom: '8px' }}>Duration (minutes)</p>
            <input
              type="number"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="30"
              min="1" max="300"
              className="input-field"
            />
          </div>

          {Number(duration) > 0 && (
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1px 1fr',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-soft)',
              borderRadius: '14px', overflow: 'hidden',
            }}>
              <div style={{ padding: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '22px', fontWeight: '300', color: 'var(--gold)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {coins}
                </p>
                <p className="text-label" style={{ marginTop: '6px' }}>Coins</p>
              </div>
              <div style={{ background: 'var(--border-soft)' }} />
              <div style={{ padding: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '22px', fontWeight: '300', color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {cals}
                </p>
                <p className="text-label" style={{ marginTop: '6px' }}>Calories</p>
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!duration || Number(duration) <= 0}
            className="btn-primary"
          >
            Complete — Earn {coins} coins
          </button>
        </div>
      )}
    </div>
  );
}
