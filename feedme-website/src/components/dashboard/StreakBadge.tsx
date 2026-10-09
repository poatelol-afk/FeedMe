'use client';

import { StreakData } from '@/types';

export default function StreakBadge({ streak }: { streak: StreakData }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-4">
      <span className="text-2xl">🔥</span>
      <div className="flex-1">
        <p className="text-[10px] font-medium uppercase tracking-widest text-neutral-500">
          Current Streak
        </p>
        <p className="text-2xl font-bold tabular-nums text-white">
          {streak.current} <span className="text-sm font-normal text-neutral-500">days</span>
        </p>
      </div>
      {streak.longest > 0 && (
        <div className="text-right">
          <p className="text-[10px] text-neutral-600">Best</p>
          <p className="text-sm font-semibold text-emerald-400">{streak.longest}d</p>
        </div>
      )}
    </div>
  );
}
