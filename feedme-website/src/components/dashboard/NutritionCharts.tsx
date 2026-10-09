'use client';

import {
  CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import type { CalorieTrendPoint, MacroTotals } from '@/types';

interface NutritionChartsProps {
  trend: CalorieTrendPoint[];
  totals: MacroTotals;
}

const MACRO_COLORS = ['var(--macro-protein)', 'var(--macro-carbs)', 'var(--macro-fat)'];

export default function NutritionCharts({ trend, totals }: NutritionChartsProps) {
  const macros = [
    { name: 'Protein', value: Math.round(totals.protein * 4) },
    { name: 'Carbs', value: Math.round(totals.carbs * 4) },
    { name: 'Fat', value: Math.round(totals.fat * 9) },
  ];
  const macroEnergy = macros.reduce((sum, macro) => sum + macro.value, 0);
  const donutData = macroEnergy > 0 ? macros : [{ name: 'No data', value: 1 }];

  return (
    <div className="card">
      <div className="flex items-baseline justify-between" style={{ marginBottom: '18px' }}>
        <p className="text-label">7-day calories</p>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Local days</span>
      </div>
      <div style={{ width: '100%', height: '180px' }} aria-label="Calories logged over the last seven days">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} accessibilityLayer>
            <CartesianGrid vertical={false} stroke="var(--border-soft)" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
              dy={8}
            />
            <YAxis hide domain={[0, 'auto']} />
            <Tooltip
              cursor={{ stroke: 'var(--border-strong)', strokeDasharray: '3 3' }}
              contentStyle={{
                background: 'var(--bg-overlay)', border: '1px solid var(--border-mid)',
                borderRadius: '10px', color: 'var(--text-primary)', fontSize: '11px',
              }}
              labelStyle={{ color: 'var(--text-secondary)', marginBottom: '3px' }}
            />
            <Line
              type="monotone"
              dataKey="kcal"
              name="Calories"
              unit=" kcal"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={{ r: 3, fill: 'var(--bg-surface)', stroke: 'var(--accent)', strokeWidth: 2 }}
              activeDot={{ r: 4, fill: 'var(--accent)', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="divider" style={{ margin: '20px 0' }} />

      <p className="text-label" style={{ marginBottom: '14px' }}>Today&apos;s macro energy</p>
      <div className="flex items-center" style={{ gap: '22px' }}>
        <div style={{ position: 'relative', width: '150px', height: '150px', flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart accessibilityLayer>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={67}
                paddingAngle={macroEnergy > 0 ? 2 : 0}
                stroke="none"
              >
                {donutData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={macroEnergy > 0 ? MACRO_COLORS[index] : 'var(--border-soft)'}
                  />
                ))}
              </Pie>
              {macroEnergy > 0 && (
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-overlay)', border: '1px solid var(--border-mid)',
                    borderRadius: '10px', color: 'var(--text-primary)', fontSize: '11px',
                  }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ fontSize: '20px', fontWeight: '300', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              {macroEnergy}
            </span>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>kcal</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
          {macros.map((macro, index) => (
            <div key={macro.name} className="flex items-center justify-between" style={{ gap: '10px' }}>
              <div className="flex items-center" style={{ gap: '8px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: MACRO_COLORS[index], flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{macro.name}</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{macro.value} kcal</span>
            </div>
          ))}
          {macroEnergy === 0 && <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>No macros logged yet.</p>}
        </div>
      </div>
    </div>
  );
}
