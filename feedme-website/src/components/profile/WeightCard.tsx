'use client';

import { useState, useEffect, useCallback } from 'react';
import * as db from '@/lib/db';
import { WeightLog, WeightStats } from '@/types';
import BleScaleButton from '@/components/profile/BleScaleButton';

export default function WeightCard() {
  const [history, setHistory] = useState<WeightLog[]>([]);
  const [stats, setStats] = useState<WeightStats | null>(null);
  const [manualKg, setManualKg] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [h, s] = await Promise.all([db.getWeightHistory(30), db.getWeightStats()]);
    setHistory(h);
    setStats(s);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const handleManualLog = async () => {
    const kg = parseFloat(manualKg);
    if (isNaN(kg) || kg <= 0 || kg > 500) return;
    setSaving(true);
    try {
      await db.logWeightReading(kg, 'manual');
      setManualKg('');
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await db.deleteWeightLog(id);
    await load();
  };

  const changeColor = (val: number | null) => {
    if (val === null) return 'var(--text-muted)';
    if (val < 0) return 'var(--accent)';   // น้ำหนักลง = ดี (สีเขียว)
    if (val > 0) return 'var(--danger)';   // น้ำหนักขึ้น (สีแดง)
    return 'var(--text-muted)';
  };

  const changeLabel = (val: number | null) => {
    if (val === null) return '—';
    return `${val > 0 ? '+' : ''}${val} kg`;
  };

  const bmiCategory = (bmi: number | null) => {
    if (!bmi) return '';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25)   return 'Normal';
    if (bmi < 30)   return 'Overweight';
    return 'Obese';
  };

  // Mini sparkline — สร้าง SVG path จาก history
  const sparkline = (() => {
    if (history.length < 2) return null;
    const vals = history.map(h => h.weightKg);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const W = 120, H = 32;
    const pts = vals.map((v, i) => {
      const x = (i / (vals.length - 1)) * W;
      const y = H - ((v - min) / range) * H;
      return `${x},${y}`;
    });
    return `M ${pts.join(' L ')}`;
  })();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* ── BLE Connection ── */}
      <BleScaleButton onWeightReceived={async () => { await load(); }} />

      {/* ── Stats card ── */}
      <div className="card">
        <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
          <p className="text-label">⚖️ Weight</p>
          {stats?.latest && (
            <div style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)',
              borderRadius: '8px', padding: '4px 10px',
            }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>BMI </span>
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-primary)' }}>
                {stats.bmi ?? '—'}
              </span>
              {stats.bmi && (
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '4px' }}>
                  {bmiCategory(stats.bmi)}
                </span>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ height: '60px', borderRadius: '8px', background: 'var(--bg-elevated)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        ) : stats?.latest ? (
          <>
            {/* Current weight */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <p style={{
                fontSize: '3rem', fontWeight: '300', letterSpacing: '-0.04em',
                color: 'var(--text-primary)', lineHeight: 1,
              }}>
                {stats.latest}
              </p>
              <p className="text-label" style={{ marginTop: '4px' }}>g</p>
            </div>

            {/* Change stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', marginBottom: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '16px', fontWeight: '300', color: changeColor(stats.change7d), letterSpacing: '-0.02em' }}>
                  {changeLabel(stats.change7d)}
                </p>
                <p className="text-label" style={{ marginTop: '4px' }}>vs 7 days</p>
              </div>
              <div style={{ background: 'var(--border-soft)' }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '16px', fontWeight: '300', color: changeColor(stats.change30d), letterSpacing: '-0.02em' }}>
                  {changeLabel(stats.change30d)}
                </p>
                <p className="text-label" style={{ marginTop: '4px' }}>vs 30 days</p>
              </div>
            </div>

            {/* Sparkline */}
            {sparkline && (
              <svg width="100%" height="32" viewBox={`0 0 120 32`} preserveAspectRatio="none" style={{ marginBottom: '4px' }}>
                <path d={sparkline} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center' }}>Last 30 days</p>
          </>
        ) : (
          <div style={{ padding: '16px 0', textAlign: 'center' }}>
            <p className="text-body" style={{ marginBottom: '4px' }}>No weight recorded yet</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Log manually below or connect your scale
            </p>
          </div>
        )}
      </div>

      {/* ── Manual input ── */}
      <div className="card">
        <p className="text-label" style={{ marginBottom: '12px' }}>Log weight</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            value={manualKg}
            onChange={e => setManualKg(e.target.value)}
            placeholder="e.g. 68.5"
            min="20" max="500" step="0.1"
            className="input-field"
            style={{ flex: 1 }}
          />
          <button
            onClick={handleManualLog}
            disabled={saving || !manualKg || parseFloat(manualKg) <= 0}
            className="btn-primary"
            style={{ width: 'auto', padding: '0 20px', opacity: saving ? 0.6 : 1, flexShrink: 0 }}
          >
            {saving ? '…' : 'Save'}
          </button>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
          📡 Scale auto-sends via <code style={{ fontSize: '10px', background: 'var(--bg-elevated)', padding: '1px 4px', borderRadius: '4px' }}>POST /api/scale/reading</code>
        </p>
      </div>

      {/* ── History list ── */}
      {history.length > 0 && (
        <div className="card">
          <p className="text-label" style={{ marginBottom: '12px' }}>History</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {[...history].reverse().slice(0, 10).map((log, i) => {
              const date = new Date(log.measuredAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
              });
              return (
                <div key={log.id}>
                  <div className="flex items-center" style={{ gap: '10px', padding: '9px 0' }}>
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>
                      {log.source === 'scale' ? '⚖️' : '✏️'}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: '400', color: 'var(--text-primary)' }}>
                        {log.weightKg} kg
                        {log.bmi && (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                            BMI {log.bmi}
                          </span>
                        )}
                      </p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>{date}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(log.id)}
                      title="Delete"
                      style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        border: 'none', background: 'transparent',
                        color: 'var(--text-muted)', fontSize: '15px',
                        cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--danger)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
                    >×</button>
                  </div>
                  {i < Math.min(history.length, 10) - 1 && <div className="divider" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
