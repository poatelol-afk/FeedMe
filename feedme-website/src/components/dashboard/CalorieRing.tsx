'use client';

import { useEffect, useState } from 'react';

interface CalorieRingProps {
  consumed: number;
  goal: number;
}

export default function CalorieRing({ consumed, goal }: CalorieRingProps) {
  const [animated, setAnimated] = useState(0);
  const R = 76;
  const C = 2 * Math.PI * R;
  const pct = goal > 0 ? Math.min(consumed / goal, 1) : 0;
  const over = consumed > goal;
  const remaining = Math.max(goal - consumed, 0);

  useEffect(() => {
    const duration = 1000;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      setAnimated(Math.round(consumed * ease));
      if (t < 1 && consumed > 0) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [consumed]);

  return (
    <div
      className="card"
      style={{ padding: '28px 24px' }}
    >
      <p className="text-label mb-6">Calories</p>

      <div className="flex items-center gap-8">
        {/* Ring */}
        <div className="relative shrink-0">
          <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background track */}
            <circle cx="90" cy="90" r={R}
              fill="none"
              stroke="var(--border-soft)"
              strokeWidth="8"
            />
            {/* Progress arc */}
            <circle cx="90" cy="90" r={R}
              fill="none"
              stroke={over ? 'var(--danger)' : 'var(--accent)'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct)}
              style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              style={{
                fontSize: '2rem',
                fontWeight: '300',
                letterSpacing: '-0.04em',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              {animated.toLocaleString()}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              kcal
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-5 flex-1">
          <div>
            <p className="text-label mb-1">Goal</p>
            <p style={{ fontSize: '1.25rem', fontWeight: '300', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              {goal.toLocaleString()}
            </p>
          </div>
          <div className="divider" />
          <div>
            <p className="text-label mb-1">{over ? 'Over' : 'Left'}</p>
            <p style={{
              fontSize: '1.25rem',
              fontWeight: '300',
              letterSpacing: '-0.03em',
              color: over ? 'var(--danger)' : 'var(--accent)',
            }}>
              {over ? `+${(consumed - goal).toLocaleString()}` : remaining.toLocaleString()}
            </p>
          </div>
          <div className="divider" />
          <div>
            <p className="text-label mb-1">Progress</p>
            <p style={{ fontSize: '1.25rem', fontWeight: '300', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              {Math.round(pct * 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
