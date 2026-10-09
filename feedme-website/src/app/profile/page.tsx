'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/hooks/useAppState';
import Toast, { useToast } from '@/components/ui/Toast';
import { createClient } from '@/lib/supabase/client';
import WeightCard from '@/components/profile/WeightCard';
import { UserProfile } from '@/types';

const ACTIVITY_OPTIONS = [
  { value: 1.2,   label: 'Sedentary',         sub: 'Little or no exercise' },
  { value: 1.375, label: 'Lightly Active',     sub: '1–3 days/week' },
  { value: 1.55,  label: 'Moderately Active',  sub: '3–5 days/week' },
  { value: 1.725, label: 'Very Active',        sub: '6–7 days/week' },
  { value: 1.9,   label: 'Extra Active',       sub: 'Hard training daily' },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-label" style={{ marginBottom: '8px' }}>{label}</p>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { profile, goal, saveProfile, coins, streak } = useAppState();
  const { toast, showToast, hideToast } = useToast();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activity, setActivity] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profile) return;
    const timer = window.setTimeout(() => {
      setAge(String(profile.age));
      setGender(profile.gender);
      setWeight(String(profile.weight));
      setHeight(String(profile.height));
      setActivity(String(profile.activity));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!age || !gender || !weight || !height || !activity) {
      setError('Please fill in all fields');
      return;
    }
    await saveProfile({
      age: Number(age), gender: gender as 'male' | 'female',
      weight: Number(weight), height: Number(height),
      activity: Number(activity),
    } as UserProfile);
    showToast('Profile saved');
  };

  return (
    <div style={{ padding: '32px 24px 0' }} className="animate-fade-in">
      <Toast message={toast.message} isVisible={toast.isVisible} onClose={hideToast} />

      <h1 style={{ fontSize: '22px', fontWeight: '300', letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '4px' }}>
        Profile
      </h1>
      <p className="text-label" style={{ marginBottom: '24px' }}>Your body, your goals</p>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
        {[
          { label: 'Coins', value: coins.toLocaleString(), color: 'var(--gold)' },
          { label: 'Streak', value: `${streak.current}d`, color: 'var(--text-primary)' },
          { label: 'Best', value: `${streak.longest}d`, color: 'var(--accent)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '14px', textAlign: 'center' }}>
            <p style={{ fontSize: '17px', fontWeight: '300', letterSpacing: '-0.03em', color: s.color, lineHeight: 1 }}>
              {s.value}
            </p>
            <p className="text-label" style={{ marginTop: '6px' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Weight Card — scale integration */}
      <WeightCard />

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p className="text-label">Body Metrics</p>

          {/* Age + Gender */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Age">
              <input id="age" type="number" value={age} onChange={e => setAge(e.target.value)}
                placeholder="25" min="10" max="120" className="input-field" />
            </Field>
            <Field label="Gender">
              <select id="gender" value={gender} onChange={e => setGender(e.target.value as 'male' | 'female')}
                className="input-field">
                <option value="" style={{ background: '#1A1917' }}>–</option>
                <option value="male" style={{ background: '#1A1917' }}>Male</option>
                <option value="female" style={{ background: '#1A1917' }}>Female</option>
              </select>
            </Field>
          </div>

          {/* Weight + Height */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Weight (kg)">
              <input id="weight" type="number" value={weight} onChange={e => setWeight(e.target.value)}
                placeholder="70" min="20" max="300" step="0.1" className="input-field" />
            </Field>
            <Field label="Height (cm)">
              <input id="height" type="number" value={height} onChange={e => setHeight(e.target.value)}
                placeholder="175" min="50" max="280" className="input-field" />
            </Field>
          </div>

          {/* Activity */}
          <Field label="Activity Level">
            <select id="activity" value={activity} onChange={e => setActivity(e.target.value)}
              className="input-field">
              <option value="" style={{ background: '#1A1917' }}>Choose…</option>
              {ACTIVITY_OPTIONS.map(o => (
                <option key={o.value} value={o.value} style={{ background: '#1A1917' }}>
                  {o.label} — {o.sub}
                </option>
              ))}
            </select>
          </Field>

          {error && (
            <p style={{ fontSize: '12px', color: 'var(--danger)' }}>{error}</p>
          )}

          <button type="submit" className="btn-primary" style={{ marginTop: '4px' }}>
            Calculate my goal
          </button>
        </div>
      </form>

      {/* Results */}
      {goal && (
        <div className="card animate-fade-up" style={{ marginTop: '16px', marginBottom: '8px' }}>
          <p className="text-label" style={{ marginBottom: '16px' }}>Your Daily Goal</p>

          {/* TDEE */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <p style={{
              fontSize: '3rem', fontWeight: '300', letterSpacing: '-0.04em',
              color: 'var(--text-primary)', lineHeight: 1,
            }}>
              {goal.tdee.toLocaleString()}
            </p>
            <p className="text-label" style={{ marginTop: '6px' }}>kcal / day</p>
          </div>

          {/* Macros */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
            {[
              { label: 'Protein', g: goal.protein.g, pct: goal.protein.pct, color: 'var(--macro-protein)' },
              { label: 'Carbs',   g: goal.carbs.g,   pct: goal.carbs.pct,   color: 'var(--macro-carbs)' },
              { label: 'Fat',     g: goal.fat.g,     pct: goal.fat.pct,     color: 'var(--macro-fat)' },
            ].map(m => (
              <div key={m.label} style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-soft)',
                borderRadius: '12px', padding: '12px 10px', textAlign: 'center',
              }}>
                <p style={{ fontSize: '18px', fontWeight: '300', color: m.color, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {m.g}g
                </p>
                <p className="text-label" style={{ marginTop: '6px' }}>{m.label}</p>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{m.pct}%</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        style={{
          marginTop: '8px', marginBottom: '8px',
          width: '100%', padding: '12px',
          background: 'transparent',
          border: '1px solid var(--border-mid)',
          borderRadius: '12px',
          fontSize: '13px', fontWeight: '500',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        Sign out
      </button>
    </div>
  );
}
