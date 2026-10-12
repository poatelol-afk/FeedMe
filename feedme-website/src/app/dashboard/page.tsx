'use client';

import { useAppState } from '@/hooks/useAppState';
import { calculateFitnessLevel, getGreeting, formatDate, getTodayTotals } from '@/lib/utils';
import NetCalorieCard from '@/components/dashboard/NetCalorieCard';
import AICoachInsight from '@/components/dashboard/AICoachInsight';
import WaterTrackerCard from '@/components/dashboard/WaterTrackerCard';
import SupplementCard from '@/components/dashboard/SupplementCard';
import StatsRow from '@/components/dashboard/StatsRow';
import MacroProgress from '@/components/dashboard/MacroProgress';
import WeeklyQuest from '@/components/dashboard/WeeklyQuest';
import NutritionCharts from '@/components/dashboard/NutritionCharts';
import Link from 'next/link';

export default function DashboardPage() {
  const { goal, diary, workouts, calorieTrend, coins, streak, quests, loading, deleteFood, waterToday } = useAppState();
  const totals = getTodayTotals(diary);
  const totalBurnedToday = workouts.reduce((s, w) => s + (w.caloriesBurned || 0), 0);

  if (loading) {
    return (
      <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[180, 90, 120, 100].map((h, i) => (
          <div key={i} style={{
            height: `${h}px`, borderRadius: '16px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-soft)',
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: `${i * 0.1}s`,
          }} />
        ))}
      </div>
    );
  }

  const effectiveGoal = goal ?? {
    tdee: 2400,
    protein: { pct: 30, g: 180, kcal: 720 },
    carbs: { pct: 40, g: 240, kcal: 960 },
    fat: { pct: 30, g: 80, kcal: 720 },
  };

  const netCalories = Math.max(0, totals.kcal - totalBurnedToday);
  const completedQuests = quests.filter(q => q.isCompleted).length;
  const fitnessLevel = calculateFitnessLevel(streak?.current ?? 0, completedQuests, workouts.length);

  return (
    <div style={{ padding: '28px 20px 88px' }} className="animate-fade-in">
      {/* Modern Bento Header */}
      <div style={{ marginBottom: '18px' }} className="flex items-start justify-between">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 900, color: 'var(--accent-deep)', letterSpacing: '0.04em' }}>
              ⚡ FEEDME AI
            </span>
            <span style={{ color: 'var(--border-mid)' }}>·</span>
            <span className="text-label">{formatDate()}</span>
          </div>
          <p style={{
            fontSize: '22px', fontWeight: 800,
            letterSpacing: '-0.02em', color: 'var(--text-primary)',
          }}>
            {getGreeting()} 👋
          </p>
        </div>

        <Link
          href="/profile"
          style={{
            background: 'var(--bg-hero)',
            color: '#F8FAFC',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            borderRadius: '999px',
            padding: '7px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
          }}
        >
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.02em' }}>
            Lv.{fitnessLevel.level} {fitnessLevel.title}
          </span>
        </Link>
      </div>

      {/* Bento Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* 1. Hero Bento Card: Net Calorie Summary */}
        <NetCalorieCard
          consumed={totals.kcal}
          burned={totalBurnedToday}
          goal={effectiveGoal.tdee}
        />

        {/* 2. AI Health Coach Insight Card */}
        <AICoachInsight
          netCalories={netCalories}
          consumedCalories={totals.kcal}
          burnedCalories={totalBurnedToday}
          goalCalories={effectiveGoal.tdee}
          proteinGrams={totals.protein}
          targetProteinGrams={effectiveGoal.protein.g}
          waterMl={waterToday}
          streakDays={streak?.current ?? 0}
        />

        {/* 3. Gamification Stats (Coins & Streak) */}
        <StatsRow coins={coins} streak={streak} />

        {/* 4. Macronutrients Breakdown */}
        <MacroProgress consumed={totals} goal={effectiveGoal} />

        {/* 5. Water Tracker Card */}
        <WaterTrackerCard />

        {/* 6. Supplement & Health Stack */}
        <SupplementCard />

        {/* 7. Trend & Energy Charts */}
        <NutritionCharts trend={calorieTrend} totals={totals} />

        {/* 8. Weekly Quests */}
        <WeeklyQuest quests={quests} />

        {/* 9. Today's Food Log */}
        <div className="card" style={{ marginBottom: '4px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
            <p className="text-label">Today&apos;s Food Diary</p>
            <Link
              href="/log"
              style={{
                fontSize: '12px', fontWeight: 700,
                color: 'var(--accent-deep)', textDecoration: 'none',
              }}
            >
              + Log Meal
            </Link>
          </div>

          {diary.length === 0 ? (
            <div style={{ padding: '20px 0', textAlign: 'center' }}>
              <p className="text-body" style={{ marginBottom: '4px' }}>Nothing logged yet today</p>
              <Link href="/log" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-deep)', textDecoration: 'none' }}>
                Log your first meal with AI Vision or Search →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {diary.map((entry, i) => {
                const time = new Date(entry.timestamp).toLocaleTimeString([], {
                  hour: '2-digit', minute: '2-digit',
                });
                return (
                  <div key={entry.id}>
                    <div className="flex items-center" style={{ gap: '12px', padding: '10px 0' }}>
                      <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0 }}>{entry.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {entry.foodName}
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
                          {entry.weight}g · {time}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {entry.kcal}
                        </p>
                        <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>kcal</p>
                      </div>
                      <button
                        onClick={() => deleteFood(entry.id)}
                        title="Remove"
                        style={{
                          flexShrink: 0, width: '28px', height: '28px',
                          borderRadius: '50%', border: 'none',
                          background: 'transparent',
                          color: 'var(--text-muted)', fontSize: '16px',
                          cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          transition: 'color 0.15s, background 0.15s',
                        }}
                      >×</button>
                    </div>
                    {i < diary.length - 1 && <div className="divider" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 10. Today's Workout Sessions */}
        {workouts.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between" style={{ marginBottom: '14px' }}>
              <p className="text-label">Today&apos;s Workout Sessions</p>
              <Link
                href="/workout"
                style={{
                  fontSize: '12px', fontWeight: 700,
                  color: 'var(--accent-deep)', textDecoration: 'none',
                }}
              >
                + Train
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {workouts.map((w, i) => (
                <div key={w.id}>
                  <div className="flex items-center" style={{ gap: '12px', padding: '10px 0' }}>
                    <span style={{ fontSize: '18px', flexShrink: 0 }}>{w.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{w.workoutName}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
                        {w.duration} min · -{w.caloriesBurned} kcal
                      </p>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 700 }}>
                      +{w.coinsEarned} coins
                    </span>
                  </div>
                  {i < workouts.length - 1 && <div className="divider" />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
