'use client';

import { useState } from 'react';
import Link from 'next/link';
import { POPULAR_AI_FOOD_PRESETS } from '@/lib/ai-food-presets';

const SAMPLE_WORKOUTS = [
  { id: 'bench', name: 'Barbell Bench Press (4×8 @ 75kg)', kcal: 240, coins: 120, xp: 65, overload: '+2.5 kg Next Session → 77.5 kg' },
  { id: 'run', name: 'Zone 2 Tempo Run (35 min)', kcal: 320, coins: 140, xp: 80, overload: 'Pace target met · HR 146 bpm' },
  { id: 'squat', name: 'Back Squat Hypertrophy (4×10 @ 95kg)', kcal: 290, coins: 150, xp: 85, overload: '+2.5 kg Next Session → 97.5 kg' },
];

export default function LandingShowcasePage() {
  const [selectedDishIdx, setSelectedDishIdx] = useState(0);
  const [portionMultiplier, setPortionMultiplier] = useState(1.0);
  const [loggedBurnKcal, setLoggedBurnKcal] = useState(320);
  const [coins, setCoins] = useState(1250);
  const [streak] = useState(7);
  const [xp, setXp] = useState(680);
  const [waterMl, setWaterMl] = useState(1750);

  const dish = POPULAR_AI_FOOD_PRESETS[selectedDishIdx] ?? POPULAR_AI_FOOD_PRESETS[0];
  const dishKcal = Math.round(dish.kcal * portionMultiplier);
  const dishProtein = +(dish.protein * portionMultiplier).toFixed(1);
  const dishCarbs = +(dish.carbs * portionMultiplier).toFixed(1);
  const dishFat = +(dish.fat * portionMultiplier).toFixed(1);
  const dishGrams = Math.round(dish.weight * portionMultiplier);

  const baseEaten = 980;
  const totalEaten = baseEaten + dishKcal;
  const tdeeGoal = 2400;
  const netKcal = Math.max(0, totalEaten - loggedBurnKcal);
  const remainingKcal = Math.max(0, tdeeGoal - netKcal);
  const level = xp >= 1000 ? 5 : xp >= 600 ? 4 : 3;
  const levelTitle = level === 5 ? 'Pro Athlete' : level === 4 ? 'Fit' : 'Active';

  const handleLogWorkoutDemo = (w: typeof SAMPLE_WORKOUTS[number]) => {
    setLoggedBurnKcal(prev => prev + w.kcal);
    setCoins(prev => prev + w.coins);
    setXp(prev => prev + w.xp);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F1F5F9', color: '#0F172A' }}>
      {/* Sticky Modern Bento Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: 'rgba(248, 250, 252, 0.9)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <div
          style={{
            maxWidth: '1160px',
            margin: '0 auto',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '11px',
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10B981',
                fontWeight: 900,
                fontSize: '18px',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
              }}
            >
              ⚡
            </div>
            <div>
              <span style={{ fontWeight: 900, fontSize: '16px', letterSpacing: '-0.02em', color: '#0F172A' }}>
                FEEDME AI
              </span>
              <span
                style={{
                  marginLeft: '8px',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(16, 185, 129, 0.14)',
                  color: '#059669',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Bento Athletic 2.0
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '999px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              <span style={{ color: '#F59E0B' }}>🔥 {streak}d</span>
              <span style={{ color: '#CBD5E1' }}>|</span>
              <span style={{ color: '#D97706' }}>🪙 {coins.toLocaleString()}</span>
              <span style={{ color: '#CBD5E1' }}>|</span>
              <span style={{ color: '#059669' }}>Lv.{level} {levelTitle}</span>
            </div>

            <Link
              href="/dashboard"
              className="btn-primary"
              style={{ width: 'auto', minHeight: '40px', padding: '0 18px', fontSize: '13px', textDecoration: 'none' }}
            >
              Open App →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '44px 24px 80px' }}>
        {/* Hero Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                fontSize: '12px',
                fontWeight: 700,
                color: '#0F172A',
                marginBottom: '16px',
              }}
            >
              <span style={{ color: '#10B981' }}>●</span> Standalone AI Nutrition & Progressive Overload OS
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.1rem, 4vw, 3.25rem)',
                fontWeight: 900,
                letterSpacing: '-0.035em',
                lineHeight: 1.1,
                color: '#0F172A',
                marginBottom: '16px',
              }}
            >
              Precision Nutrition &amp; Strength Coaching.{' '}
              <span style={{ color: '#059669' }}>Zero Hardware Required.</span>
            </h1>

            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.65, marginBottom: '24px', maxWidth: '540px' }}>
              Snap any Thai or international meal with Gemini Vision, select intuitive portion sizes (ทัพพี / จาน / กรัม),
              track real-time Net Energy Balance, and get automatic +2.5 kg Progressive Overload targets.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Link
                href="/dashboard"
                className="btn-primary"
                style={{ width: 'auto', padding: '0 26px', minHeight: '48px', fontSize: '15px', textDecoration: 'none' }}
              >
                ⚡ Launch Dashboard
              </Link>
              <Link
                href="/log"
                className="btn-secondary"
                style={{ width: 'auto', padding: '0 22px', minHeight: '48px', fontSize: '14px', textDecoration: 'none' }}
              >
                📸 Try AI Food Scanner
              </Link>
              <Link
                href="/workout"
                className="btn-secondary"
                style={{ width: 'auto', padding: '0 22px', minHeight: '48px', fontSize: '14px', textDecoration: 'none' }}
              >
                🏋️ Progressive Overload Coach
              </Link>
            </div>
          </div>

          {/* Signature Dark Midnight Navy Hero Bento Card */}
          <div className="bento-hero" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    color: '#38BDF8',
                    textTransform: 'uppercase',
                  }}
                >
                  LIVE NET ENERGY BALANCE
                </span>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
                  Mifflin-St Jeor TDEE · Food In − Workout Burn
                </p>
              </div>
              <span
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.18)',
                  color: '#34D399',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 800,
                }}
              >
                Lv.{level} {levelTitle} · {xp} XP
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '18px',
                alignItems: 'center',
                backgroundColor: 'rgba(15, 23, 42, 0.55)',
                border: '1px solid rgba(148, 163, 184, 0.16)',
                borderRadius: '16px',
                padding: '18px',
                marginBottom: '16px',
              }}
            >
              <div>
                <p style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-0.04em', color: '#FFFFFF', lineHeight: 1 }}>
                  {netKcal.toLocaleString()}{' '}
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#94A3B8' }}>/ {tdeeGoal.toLocaleString()} kcal</span>
                </p>
                <p style={{ fontSize: '12px', color: '#10B981', fontWeight: 700, marginTop: '6px' }}>
                  {remainingKcal.toLocaleString()} kcal remaining today
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>🍱 Eaten</span>
                  <span style={{ color: '#F8FAFC', fontWeight: 700 }}>+{totalEaten.toLocaleString()} kcal</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>🔥 Burned</span>
                  <span style={{ color: '#34D399', fontWeight: 700 }}>-{loggedBurnKcal.toLocaleString()} kcal</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>💧 Hydration</span>
                  <span style={{ color: '#38BDF8', fontWeight: 700 }}>{waterMl} / 2500 ml</span>
                </div>
              </div>
            </div>

            {/* 3 Macro Bars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { label: 'Protein', val: `${Math.round(88 + dishProtein)}g / 180g`, pct: Math.min(100, Math.round(((88 + dishProtein) / 180) * 100)), color: '#38BDF8' },
                { label: 'Carbs', val: `${Math.round(110 + dishCarbs)}g / 240g`, pct: Math.min(100, Math.round(((110 + dishCarbs) / 240) * 100)), color: '#10B981' },
                { label: 'Fat', val: `${Math.round(32 + dishFat)}g / 80g`, pct: Math.min(100, Math.round(((32 + dishFat) / 80) * 100)), color: '#F59E0B' },
              ].map(m => (
                <div
                  key={m.label}
                  style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.85)',
                    border: '1px solid rgba(148, 163, 184, 0.15)',
                    borderRadius: '12px',
                    padding: '10px 12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
                    <span style={{ color: '#94A3B8', fontWeight: 700 }}>{m.label}</span>
                    <span style={{ color: '#F8FAFC', fontWeight: 700 }}>{m.val}</span>
                  </div>
                  <div style={{ height: '5px', backgroundColor: 'rgba(148, 163, 184, 0.2)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${m.pct}%`, height: '100%', backgroundColor: m.color, borderRadius: '999px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Bento Playground Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Bento Card 1: Interactive AI Dish & Smart Portion Simulator */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span className="text-label" style={{ color: '#059669' }}>📸 AI Food Vision + Smart Portions</span>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                  Instant Dish &amp; Portion Breakdown
                </h2>
              </div>
              <span className="badge-accent">{Math.round(dish.confidence * 100)}% AI Confidence</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '14px' }}>
              {POPULAR_AI_FOOD_PRESETS.map((item, idx) => (
                <button
                  key={item.foodName}
                  type="button"
                  onClick={() => setSelectedDishIdx(idx)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: idx === selectedDishIdx ? '1.5px solid #10B981' : '1px solid #E2E8F0',
                    backgroundColor: idx === selectedDishIdx ? 'rgba(16, 185, 129, 0.1)' : '#F8FAFC',
                    color: idx === selectedDishIdx ? '#059669' : '#475569',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.emoji} {item.foodName.split('(')[0].trim()}
                </button>
              ))}
            </div>

            {/* Smart Portion Selector */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                padding: '12px 14px',
                marginBottom: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="text-label">Smart Portion Selector (ไม่ต้องพึ่งตาชั่ง)</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>{dishGrams} g</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {[
                  { scale: 0.5, label: '0.5x ครึ่งจาน' },
                  { scale: 1.0, label: '1x ปกติ' },
                  { scale: 1.5, label: '1.5x พิเศษ' },
                  { scale: 2.0, label: '2x จัมโบ้' },
                ].map(p => (
                  <button
                    key={p.scale}
                    type="button"
                    onClick={() => setPortionMultiplier(p.scale)}
                    style={{
                      padding: '7px 6px',
                      borderRadius: '10px',
                      border: portionMultiplier === p.scale ? '1px solid #059669' : '1px solid #CBD5E1',
                      backgroundColor: portionMultiplier === p.scale ? '#10B981' : '#FFFFFF',
                      color: portionMultiplier === p.scale ? '#FFFFFF' : '#475569',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px' }}>
                <p style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>{dishKcal}</p>
                <p className="text-label">kcal</p>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px' }}>
                <p style={{ fontSize: '17px', fontWeight: 800, color: '#0284C7' }}>{dishProtein}g</p>
                <p className="text-label">Protein</p>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px' }}>
                <p style={{ fontSize: '17px', fontWeight: 800, color: '#059669' }}>{dishCarbs}g</p>
                <p className="text-label">Carbs</p>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px' }}>
                <p style={{ fontSize: '17px', fontWeight: 800, color: '#D97706' }}>{dishFat}g</p>
                <p className="text-label">Fat</p>
              </div>
            </div>
          </div>

          {/* Bento Card 2: AI Progressive Overload & Habit Coach */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <span className="text-label" style={{ color: '#0284C7' }}>🏋️ AI Strength &amp; Cardio Coach</span>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                    Progressive Overload &amp; Daily Habits
                  </h2>
                </div>
                <span className="badge-gold">+Coins &amp; XP</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {SAMPLE_WORKOUTS.map(w => (
                  <div
                    key={w.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{w.name}</p>
                      <p style={{ fontSize: '11px', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                        ⚡ {w.overload} · -{w.kcal} kcal
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleLogWorkoutDemo(w)}
                      style={{
                        padding: '7px 12px',
                        borderRadius: '10px',
                        backgroundColor: '#0F172A',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      + Log Set
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Hydration Quick Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '14px',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
              }}
            >
              <div>
                <p style={{ fontSize: '12px', fontWeight: 800, color: '#0284C7' }}>
                  💧 Daily Hydration: {waterMl} / 2,500 ml
                </p>
                <p style={{ fontSize: '11px', color: '#475569' }}>
                  One-tap water &amp; daily supplement checklist
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWaterMl(w => Math.min(3500, w + 250))}
                style={{
                  padding: '7px 12px',
                  borderRadius: '10px',
                  backgroundColor: '#0284C7',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                +250 ml
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
