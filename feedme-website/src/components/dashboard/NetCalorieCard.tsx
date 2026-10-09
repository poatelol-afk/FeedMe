'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface NetCalorieCardProps {
  consumed: number;
  burned: number;
  goal: number;
}

export default function NetCalorieCard({ consumed, burned, goal }: NetCalorieCardProps) {
  const [animatedConsumed, setAnimatedConsumed] = useState(0);
  const [animatedBurned, setAnimatedBurned] = useState(0);

  const net = Math.max(0, consumed - burned);
  const remaining = goal - net;
  const isOver = net > goal;
  const pct = goal > 0 ? Math.min(Math.round((net / goal) * 100), 100) : 0;

  const R = 72;
  const C = 2 * Math.PI * R;
  const strokeOffset = C * (1 - pct / 100);

  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setAnimatedConsumed(Math.round(consumed * ease));
      setAnimatedBurned(Math.round(burned * ease));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [consumed, burned]);

  return (
    <div className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
        <div>
          <span className="text-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
            Net Calorie Balance
          </span>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Daily Energy = Food In − Workout Out
          </p>
        </div>
        <span
          className="badge-accent"
          style={{
            fontSize: '11px',
            background: isOver ? 'rgba(201,123,123,0.15)' : 'var(--accent-soft)',
            color: isOver ? 'var(--danger)' : 'var(--accent)',
            border: `1px solid ${isOver ? 'rgba(201,123,123,0.3)' : 'rgba(143,184,154,0.25)'}`,
          }}
        >
          {isOver ? 'Deficit Exceeded' : remaining === 0 ? 'Goal Met' : `${remaining.toLocaleString()} kcal left`}
        </span>
      </div>

      {/* Main Visual: Ring + Formula */}
      <div className="flex items-center" style={{ gap: '28px', flexWrap: 'wrap' }}>
        {/* Ring */}
        <div style={{ position: 'relative', width: '160px', height: '160px', flexShrink: 0, margin: '0 auto' }}>
          <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background track */}
            <circle
              cx="80" cy="80" r={R}
              fill="none"
              stroke="var(--border-soft)"
              strokeWidth="9"
            />
            {/* Progress arc */}
            <circle
              cx="80" cy="80" r={R}
              fill="none"
              stroke={isOver ? 'var(--danger)' : 'var(--accent)'}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={strokeOffset}
              style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
          }}>
            <span style={{ fontSize: '1.75rem', fontWeight: '300', letterSpacing: '-0.04em', color: 'var(--text-primary)', lineHeight: 1 }}>
              {net.toLocaleString()}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Net kcal
            </span>
          </div>
        </div>

        {/* 3-Column Metrics Breakdown */}
        <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Eaten */}
          <div className="flex items-center justify-between">
            <div className="flex items-center" style={{ gap: '10px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '10px',
                background: 'rgba(212,169,106,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '15px',
              }}>
                🍱
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>Food Consumed</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Calorie intake</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--macro-fat)' }}>
                +{animatedConsumed.toLocaleString()}
              </p>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>kcal</p>
            </div>
          </div>

          <div className="divider" />

          {/* Burned */}
          <div className="flex items-center justify-between">
            <div className="flex items-center" style={{ gap: '10px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '10px',
                background: 'rgba(201,169,110,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '15px',
              }}>
                🔥
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>Workout Burned</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MET exercise burn</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--gold)' }}>
                -{animatedBurned.toLocaleString()}
              </p>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>kcal</p>
            </div>
          </div>

          <div className="divider" />

          {/* Budget */}
          <div className="flex items-center justify-between">
            <div className="flex items-center" style={{ gap: '10px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '10px',
                background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '15px',
              }}>
                🎯
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>TDEE Target</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mifflin-St Jeor</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--accent)' }}>
                {goal.toLocaleString()}
              </p>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>kcal goal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Footer */}
      <div style={{
        marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Budget used: <strong style={{ color: 'var(--text-primary)' }}>{pct}%</strong>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link
            href="/log"
            style={{
              padding: '6px 12px', borderRadius: '8px', fontSize: '11px',
              fontWeight: '500', background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)',
              color: 'var(--accent)', textDecoration: 'none',
            }}
          >
            + Food
          </Link>
          <Link
            href="/workout"
            style={{
              padding: '6px 12px', borderRadius: '8px', fontSize: '11px',
              fontWeight: '500', background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)',
              color: 'var(--gold)', textDecoration: 'none',
            }}
          >
            + Move
          </Link>
        </div>
      </div>
    </div>
  );
}
