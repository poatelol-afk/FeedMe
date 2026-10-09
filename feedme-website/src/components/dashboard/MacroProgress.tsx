'use client';

import { MacroTotals, NutritionGoal } from '@/types';

interface Props {
  consumed: MacroTotals;
  goal: NutritionGoal;
}

function Bar({ label, consumed, total, color }: {
  label: string; consumed: number; total: number; color: string;
}) {
  const pct = total > 0 ? Math.min((consumed / total) * 100, 100) : 0;
  const over = consumed > total;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
          {label}
        </span>
        <span style={{ fontSize: '12px', color: over ? 'var(--danger)' : 'var(--text-muted)' }}>
          {Math.round(consumed)}<span style={{ color: 'var(--text-muted)' }}>/{total}g</span>
        </span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${pct}%`,
            background: over ? 'var(--danger)' : color,
          }}
        />
      </div>
    </div>
  );
}

export default function MacroProgress({ consumed, goal }: Props) {
  return (
    <div className="card">
      <p className="text-label mb-5">Macros</p>
      <div className="flex flex-col gap-4">
        <Bar label="Protein" consumed={consumed.protein} total={goal.protein.g} color="var(--macro-protein)" />
        <Bar label="Carbs"   consumed={consumed.carbs}   total={goal.carbs.g}   color="var(--macro-carbs)" />
        <Bar label="Fat"     consumed={consumed.fat}     total={goal.fat.g}     color="var(--macro-fat)" />
      </div>
    </div>
  );
}
