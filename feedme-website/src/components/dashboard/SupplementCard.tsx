'use client';

import { useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { SupplementItem } from '@/types';

export default function SupplementCard() {
  const { supplements, toggleSupplement, addCustomSupplement } = useAppState();
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<SupplementItem['timeOfDay']>('morning');
  const [emoji, setEmoji] = useState('💊');

  const takenCount = supplements.filter(s => s.taken).length;
  const totalCount = supplements.length;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await addCustomSupplement(name.trim(), dose.trim() || '1 serving', timeOfDay, emoji);
    setName('');
    setDose('');
    setShowAddModal(false);
  };

  const timeLabels = {
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    bedtime: 'Bedtime',
  };

  return (
    <div className="card" style={{ padding: '22px' }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
        <div className="flex items-center" style={{ gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: 'rgba(201, 169, 110, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px',
          }}>
            💊
          </div>
          <div>
            <p className="text-label">Supplements & Vitamins</p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '1px' }}>
              Daily Health Stack
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge-gold" style={{ fontSize: '11px' }}>
            {takenCount} / {totalCount} taken
          </span>
          <button
            type="button"
            onClick={() => setShowAddModal(!showAddModal)}
            style={{
              width: '26px', height: '26px', borderRadius: '50%',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)',
              color: 'var(--text-primary)', fontSize: '16px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
            title="Add supplement"
          >
            +
          </button>
        </div>
      </div>

      {/* Add Custom Supplement Form Drawer */}
      {showAddModal && (
        <form onSubmit={handleAdd} className="animate-fade-up" style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border-mid)',
          borderRadius: '14px', padding: '14px', marginBottom: '14px',
        }}>
          <p style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Add Custom Supplement
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              placeholder="Name (e.g. Zinc)"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input-field"
              style={{ fontSize: '12px', padding: '8px 10px' }}
            />
            <input
              type="text"
              placeholder="Dose (e.g. 50mg)"
              value={dose}
              onChange={e => setDose(e.target.value)}
              className="input-field"
              style={{ fontSize: '12px', padding: '8px 10px' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            <select
              value={timeOfDay}
              onChange={e => setTimeOfDay(e.target.value as any)}
              className="input-field"
              style={{ fontSize: '12px', padding: '8px 10px' }}
            >
              <option value="morning">Morning 🌅</option>
              <option value="afternoon">Afternoon ☀️</option>
              <option value="evening">Evening 🌇</option>
              <option value="bedtime">Bedtime 🌙</option>
            </select>
            <input
              type="text"
              placeholder="Emoji (e.g. 💊)"
              value={emoji}
              onChange={e => setEmoji(e.target.value)}
              className="input-field"
              style={{ fontSize: '12px', padding: '8px 10px' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              style={{
                padding: '6px 12px', borderRadius: '8px', background: 'transparent',
                border: '1px solid var(--border-soft)', color: 'var(--text-muted)', fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              style={{
                padding: '6px 14px', borderRadius: '8px', background: 'var(--gold)',
                color: '#111110', border: 'none', fontWeight: '600', fontSize: '11px',
                cursor: name.trim() ? 'pointer' : 'default', opacity: name.trim() ? 1 : 0.4,
              }}
            >
              Save Stack
            </button>
          </div>
        </form>
      )}

      {/* Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {supplements.map(item => (
          <div
            key={item.id}
            onClick={() => toggleSupplement(item.id)}
            style={{
              padding: '10px 14px', borderRadius: '12px',
              background: item.taken ? 'rgba(143, 184, 154, 0.08)' : 'var(--bg-elevated)',
              border: `1px solid ${item.taken ? 'rgba(143, 184, 154, 0.3)' : 'var(--border-soft)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', transition: 'all 0.15s ease',
            }}
          >
            <div className="flex items-center" style={{ gap: '10px' }}>
              <span style={{ fontSize: '16px' }}>{item.emoji}</span>
              <div>
                <p style={{
                  fontSize: '13px', fontWeight: '500',
                  color: item.taken ? 'var(--text-muted)' : 'var(--text-primary)',
                  textDecoration: item.taken ? 'line-through' : 'none',
                }}>
                  {item.name}
                </p>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>
                  {item.dose} · {timeLabels[item.timeOfDay]}
                </p>
              </div>
            </div>

            <div style={{
              width: '22px', height: '22px', borderRadius: '6px',
              border: `1.5px solid ${item.taken ? 'var(--accent)' : 'var(--border-mid)'}`,
              background: item.taken ? 'var(--accent)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#111110', fontSize: '12px', fontWeight: 'bold',
              transition: 'all 0.2s ease',
            }}>
              {item.taken && '✓'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
