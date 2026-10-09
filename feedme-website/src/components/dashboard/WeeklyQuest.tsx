'use client';

import { Quest } from '@/types';

export default function WeeklyQuest({ quests }: { quests: Quest[] }) {
  if (quests.length === 0) return null;
  const done = quests.filter(q => q.isCompleted).length;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <p className="text-label">Quests</p>
        <span className="badge-accent">{done}/{quests.length} done</span>
      </div>

      <div className="flex flex-col gap-3">
        {quests.map((q) => {
          const pct = q.target > 0 ? Math.min((q.progress / q.target) * 100, 100) : 0;
          return (
            <div key={q.id}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span style={{ fontSize: '14px', lineHeight: '1.4', flexShrink: 0 }}>{q.emoji}</span>
                  <div className="min-w-0">
                    <p style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: q.isCompleted ? 'var(--accent)' : 'var(--text-primary)',
                      lineHeight: 1.3,
                    }}>
                      {q.title}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {q.description}
                    </p>
                  </div>
                </div>
                <span className="badge-gold ml-2 shrink-0" style={{ fontSize: '10px' }}>
                  +{q.reward}
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${pct}%`,
                    background: q.isCompleted ? 'var(--accent)' : 'var(--border-strong)',
                  }}
                />
              </div>
              <div className="flex justify-end mt-1">
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  {q.progress}/{q.target}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
