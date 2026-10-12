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

  const R = 68;
  const C = 2 * Math.PI * R;
  const strokeOffset = C * (1 - pct / 100);

  useEffect(() => {
    const duration = 700;
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
    <div className="bento-hero" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: '18px' }}>
        <div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              color: '#38BDF8',
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981' }} />
            Net Energy Balance
          </span>
          <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
            Food Consumed − Workout Burned vs TDEE
          </p>
        </div>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '999px',
            background: isOver ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.18)',
            color: isOver ? '#FCA5A5' : '#34D399',
            border: `1px solid ${isOver ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.32)'}`,
          }}
        >
          {isOver ? `${Math.abs(remaining).toLocaleString()} kcal over` : `${remaining.toLocaleString()} kcal left`}
        </span>
      </div>

      {/* Main Visual: Ring + 3 Metrics */}
      <div className="flex items-center" style={{ gap: '22px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '150px', height: '150px', flexShrink: 0, margin: '0 auto' }}>
          <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="75"
              cy="75"
              r={R}
              fill="none"
              stroke="rgba(148, 163, 184, 0.2)"
              strokeWidth="10"
            />
            <circle
              cx="75"
              cy="75"
              r={R}
              fill="none"
              stroke={isOver ? '#EF4444' : '#10B981'}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={strokeOffset}
              style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)' }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <span style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.04em', color: '#FFFFFF', lineHeight: 1 }}>
              {net.toLocaleString()}
            </span>
            <span style={{ fontSize: '10px', color: '#94A3B8', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              Net kcal
            </span>
          </div>
        </div>

        {/* 3-Column Metrics Breakdown */}
        <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center" style={{ gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(56, 189, 248, 0.14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                }}
              >
                🍱
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>Food Consumed</p>
                <p style={{ fontSize: '11px', color: '#94A3B8' }}>Meals &amp; snacks</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: 800, color: '#38BDF8' }}>
                +{animatedConsumed.toLocaleString()}
              </p>
              <p style={{ fontSize: '10px', color: '#94A3B8' }}>kcal</p>
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(148, 163, 184, 0.16)' }} />

          <div className="flex items-center justify-between">
            <div className="flex items-center" style={{ gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                }}
              >
                🔥
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>Workout Burned</p>
                <p style={{ fontSize: '11px', color: '#94A3B8' }}>Strength &amp; cardio</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: 800, color: '#34D399' }}>
                -{animatedBurned.toLocaleString()}
              </p>
              <p style={{ fontSize: '10px', color: '#94A3B8' }}>kcal</p>
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(148, 163, 184, 0.16)' }} />

          <div className="flex items-center justify-between">
            <div className="flex items-center" style={{ gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                }}
              >
                🎯
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>TDEE Target</p>
                <p style={{ fontSize: '11px', color: '#94A3B8' }}>Mifflin-St Jeor</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: 800, color: '#FBBF24' }}>
                {goal.toLocaleString()}
              </p>
              <p style={{ fontSize: '10px', color: '#94A3B8' }}>kcal goal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Quick Actions */}
      <div
        style={{
          marginTop: '18px',
          paddingTop: '14px',
          borderTop: '1px solid rgba(148, 163, 184, 0.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '12px', color: '#94A3B8' }}>
          Daily budget used: <strong style={{ color: '#FFFFFF' }}>{pct}%</strong>
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link
            href="/log"
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: 700,
              background: '#10B981',
              color: '#FFFFFF',
              textDecoration: 'none',
            }}
          >
            + Log Food
          </Link>
          <Link
            href="/workout"
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: 700,
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(148, 163, 184, 0.25)',
              color: '#F8FAFC',
              textDecoration: 'none',
            }}
          >
            + Workout
          </Link>
        </div>
      </div>
    </div>
  );
}
