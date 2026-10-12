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
  { value: 1.375, label: 'Lightly Active',    sub: '1–3 days/week' },
  { value: 1.55,  label: 'Moderately Active', sub: '3–5 days/week' },
  { value: 1.725, label: 'Very Active',       sub: '6–7 days/week' },
  { value: 1.9,   label: 'Extra Active',      sub: 'Hard training daily' },
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
    showToast('Profile & TDEE Goal updated');
  };

  return (
    <div style={{ padding: '28px 20px 88px' }} className="animate-fade-in">
      <Toast message={toast.message} isVisible={toast.isVisible} onClose={hideToast} />

      <div style={{ marginBottom: '20px' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-deep)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          ⚡ FEEDME AI · Body &amp; TDEE
        </span>
        <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginTop: '2px' }}>
          Body Metrics &amp; Daily Goal
        </h1>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Coins', value: `🪙 ${coins.toLocaleString()}`, color: 'var(--gold)' },
          { label: 'Streak', value: `🔥 ${streak.current}d`, color: 'var(--text-primary)' },
          { label: 'Best', value: `🏆 ${streak.longest}d`, color: 'var(--accent-deep)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '14px', textAlign: 'center' }}>
            <p style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.02em', color: s.color, lineHeight: 1 }}>
              {s.value}
            </p>
            <p className="text-label" style={{ marginTop: '6px' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Body Weight Tracker Card */}
      <WeightCard />

      {/* Personal Profile & TDEE Calculator Form */}
      <form onSubmit={handleSubmit}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p className="text-label">Mifflin-St Jeor TDEE Calculator</p>

          {/* Age + Gender */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Age">
              <input id="age" type="number" value={age} onChange={e => setAge(e.target.value)}
                placeholder="25" min="10" max="120" className="input-field" />
            </Field>
            <Field label="Gender">
              <select id="gender" value={gender} onChange={e => setGender(e.target.value as 'male' | 'female')}
                className="input-field">
                <option value="">–</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
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
              <option value="">Choose…</option>
              {ACTIVITY_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label} — {o.sub}
                </option>
              ))}
            </select>
          </Field>

          {error && (
            <p style={{ fontSize: '12px', color: 'var(--danger)', fontWeight: 600 }}>{error}</p>
          )}

          <button type="submit" className="btn-primary" style={{ marginTop: '4px' }}>
            Calculate &amp; Save My Goal
          </button>
        </div>
      </form>

      {/* Results */}
      {goal && (
        <div className="bento-hero animate-fade-up" style={{ marginTop: '16px', marginBottom: '8px' }}>
          <p style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>
            Your Daily TDEE &amp; Macro Target
          </p>

          {/* TDEE */}
          <div style={{ textAlign: 'center', marginBottom: '18px' }}>
            <p style={{
              fontSize: '2.75rem', fontWeight: 900, letterSpacing: '-0.04em',
              color: '#FFFFFF', lineHeight: 1,
            }}>
              {goal.tdee.toLocaleString()}
            </p>
            <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginTop: '6px' }}>
              kcal / day
            </p>
          </div>

          {/* Macros */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
            {[
              { label: 'Protein', g: goal.protein.g, pct: goal.protein.pct, color: '#38BDF8' },
              { label: 'Carbs',   g: goal.carbs.g,   pct: goal.carbs.pct,   color: '#34D399' },
              { label: 'Fat',     g: goal.fat.g,     pct: goal.fat.pct,     color: '#FBBF24' },
            ].map(m => (
              <div key={m.label} style={{
                background: 'rgba(30, 41, 59, 0.85)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px', padding: '12px 10px', textAlign: 'center',
              }}>
                <p style={{ fontSize: '18px', fontWeight: 800, color: m.color, letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {m.g}g
                </p>
                <p style={{ fontSize: '11px', color: '#F8FAFC', fontWeight: 700, marginTop: '6px' }}>{m.label}</p>
                <p style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>{m.pct}%</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="btn-secondary"
        style={{
          marginTop: '12px',
          marginBottom: '8px',
          width: '100%',
        }}
      >
        Sign out
      </button>
    </div>
  );
}
