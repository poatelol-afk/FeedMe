'use client';

import { FoodItem } from '@/types';

interface FoodCardProps {
  food: FoodItem;
  weight: number;
}

export default function FoodCard({ food, weight }: FoodCardProps) {
  const m = weight / 100;
  const kcal    = Math.round(food.kcal * m);
  const protein = +(food.protein * m).toFixed(1);
  const carbs   = +(food.carbs * m).toFixed(1);
  const fat     = +(food.fat * m).toFixed(1);

  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-mid)',
      borderRadius: '16px',
      padding: '16px',
    }}>
      {/* Header */}
      <div className="flex items-center" style={{ gap: '10px', marginBottom: '14px' }}>
        <span style={{ fontSize: '22px' }}>{food.emoji}</span>
        <div>
          <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{food.name}</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{weight}g serving</p>
        </div>
      </div>

      {/* Macro grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
        {[
          { label: 'Kcal',    value: kcal,    unit: '',  color: 'var(--text-primary)' },
          { label: 'Protein', value: protein,  unit: 'g', color: 'var(--macro-protein)' },
          { label: 'Carbs',   value: carbs,    unit: 'g', color: 'var(--macro-carbs)' },
          { label: 'Fat',     value: fat,      unit: 'g', color: 'var(--macro-fat)' },
        ].map(item => (
          <div key={item.label} style={{
            background: 'var(--bg-base)',
            border: '1px solid var(--border-soft)',
            borderRadius: '10px',
            padding: '10px 8px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '15px', fontWeight: '400', color: item.color, letterSpacing: '-0.02em', lineHeight: 1 }}>
              {item.value}{item.unit}
            </p>
            <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginTop: '4px' }}>
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
