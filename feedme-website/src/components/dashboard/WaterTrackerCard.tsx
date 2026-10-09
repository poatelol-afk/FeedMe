'use client';

import { useState } from 'react';
import { useAppState } from '@/hooks/useAppState';

export default function WaterTrackerCard() {
  const { waterToday, waterGoal, waterEntries, addWater, deleteWater } = useAppState();
  const [customMl, setCustomMl] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const pct = waterGoal > 0 ? Math.min(Math.round((waterToday / waterGoal) * 100), 100) : 0;
  const isGoalReached = waterToday >= waterGoal;

  const handleQuickAdd = async (ml: number) => {
    await addWater(ml);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(customMl, 10);
    if (!isNaN(amount) && amount > 0 && amount <= 3000) {
      await addWater(amount);
      setCustomMl('');
    }
  };

  return (
    <div className="card" style={{ padding: '22px' }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
        <div className="flex items-center" style={{ gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: 'rgba(126, 184, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px',
          }}>
            💧
          </div>
          <div>
            <p className="text-label">Water Intake</p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '1px' }}>
              Daily Hydration Goal
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '16px', fontWeight: '500', color: 'var(--macro-protein)' }}>
            {waterToday.toLocaleString()}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {' '}/ {waterGoal.toLocaleString()} ml
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div style={{
        height: '10px', background: 'var(--border-soft)', borderRadius: '999px',
        overflow: 'hidden', position: 'relative', marginBottom: '14px',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: 'linear-gradient(90deg, #5C9EB8 0%, #7EB8D4 100%)',
          borderRadius: '999px',
          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>

      <div className="flex items-center justify-between" style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px' }}>
        <span>{pct}% completed</span>
        <span>{isGoalReached ? '🎉 Daily Goal Met!' : `${(waterGoal - waterToday).toLocaleString()} ml left`}</span>
      </div>

      {/* Quick Add Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
        {[
          { label: '+150 ml', sub: 'Cup 🥛', ml: 150 },
          { label: '+250 ml', sub: 'Glass ☕', ml: 250 },
          { label: '+500 ml', sub: 'Bottle 💧', ml: 500 },
        ].map(item => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleQuickAdd(item.ml)}
            style={{
              padding: '10px 8px', borderRadius: '12px',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              cursor: 'pointer', transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--macro-protein)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-soft)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>{item.label}</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.sub}</span>
          </button>
        ))}
      </div>

      {/* Custom ml form + toggle history */}
      <div className="flex items-center justify-between" style={{ gap: '10px' }}>
        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '6px', flex: 1 }}>
          <input
            type="number"
            value={customMl}
            onChange={e => setCustomMl(e.target.value)}
            placeholder="Custom ml..."
            min="10"
            max="3000"
            className="input-field"
            style={{ padding: '8px 12px', fontSize: '12px', height: '36px' }}
          />
          <button
            type="submit"
            disabled={!customMl}
            style={{
              padding: '0 14px', borderRadius: '10px', background: 'var(--macro-protein)',
              color: '#111110', border: 'none', fontWeight: '600', fontSize: '12px',
              cursor: customMl ? 'pointer' : 'default', opacity: customMl ? 1 : 0.4,
              whiteSpace: 'nowrap',
            }}
          >
            + Add
          </button>
        </form>

        {waterEntries.length > 0 && (
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            style={{
              background: 'transparent', border: 'none', color: 'var(--text-muted)',
              fontSize: '11px', cursor: 'pointer', textDecoration: 'underline',
              padding: '4px',
            }}
          >
            {showHistory ? 'Hide' : `${waterEntries.length} logs`}
          </button>
        )}
      </div>

      {/* Logs History (Accordion) */}
      {showHistory && waterEntries.length > 0 && (
        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-soft)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {waterEntries.map((entry) => {
            const time = new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={entry.id} className="flex items-center justify-between" style={{ padding: '4px 0', fontSize: '11px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>💧 {entry.amountMl} ml ({time})</span>
                <button
                  type="button"
                  onClick={() => deleteWater(entry.id)}
                  style={{
                    background: 'transparent', border: 'none', color: 'var(--text-muted)',
                    cursor: 'pointer', padding: '2px 6px',
                  }}
                  title="Remove entry"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
