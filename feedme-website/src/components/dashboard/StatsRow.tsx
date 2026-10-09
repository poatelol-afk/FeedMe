'use client';

import { StreakData } from '@/types';

interface Props {
  coins: number;
  streak: StreakData;
}

export default function StatsRow({ coins, streak }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Coins */}
      <div className="card" style={{ padding: '18px 20px' }}>
        <p className="text-label mb-3">Coins</p>
        <div className="flex items-end gap-2">
          <span style={{
            fontSize: '1.75rem',
            fontWeight: '300',
            letterSpacing: '-0.04em',
            color: 'var(--gold)',
            lineHeight: 1,
          }}>
            {coins.toLocaleString()}
          </span>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
          available
        </p>
      </div>

      {/* Streak */}
      <div className="card" style={{ padding: '18px 20px' }}>
        <p className="text-label mb-3">Streak</p>
        <div className="flex items-end gap-2">
          <span style={{
            fontSize: '1.75rem',
            fontWeight: '300',
            letterSpacing: '-0.04em',
            color: 'var(--text-primary)',
            lineHeight: 1,
          }}>
            {streak.current}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', paddingBottom: '3px' }}>
            days
          </span>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
          best {streak.longest}d
        </p>
      </div>
    </div>
  );
}
