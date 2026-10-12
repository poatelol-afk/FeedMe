'use client';

import { useMemo } from 'react';

interface AICoachInsightProps {
  netCalories: number;
  consumedCalories: number;
  burnedCalories: number;
  goalCalories: number;
  proteinGrams: number;
  targetProteinGrams: number;
  waterMl: number;
  streakDays: number;
}

export default function AICoachInsight({
  netCalories,
  consumedCalories,
  burnedCalories,
  goalCalories,
  proteinGrams,
  targetProteinGrams,
  waterMl,
  streakDays,
}: AICoachInsightProps) {
  const insight = useMemo(() => {
    const remaining = goalCalories - netCalories;
    const proteinPct = Math.round((proteinGrams / Math.max(1, targetProteinGrams)) * 100);

    if (consumedCalories === 0 && burnedCalories === 0) {
      return {
        badge: 'Ready for Today',
        icon: '⚡',
        title: 'เริ่มต้นวันใหม่อย่างมีระบบ',
        advice: `เป้าหมายพลังงานวันนี้ ${goalCalories.toLocaleString()} kcal และโปรตีน ${targetProteinGrams}g บันทึกมื้อเช้าหรือเริ่มวอร์มอัพเพื่อรักษาวินัยวันที่ ${streakDays + 1}`,
      };
    }

    if (burnedCalories > 300 && proteinPct < 70) {
      return {
        badge: 'Post-Workout Recovery',
        icon: '💪',
        title: 'การเผาผลาญดีเยี่ยม — เติมโปรตีนเพื่อซ่อมแซมกล้ามเนื้อ',
        advice: `วันนี้เผาผลาญไปแล้ว ${burnedCalories} kcal แต่โปรตีนแตะเพียง ${proteinGrams}g (${proteinPct}%) แนะนำเติมโปรตีนสะอาดอีก ${Math.max(0, targetProteinGrams - proteinGrams)}g เพื่อให้กล้ามเนื้อฟื้นตัวสูงสุด`,
      };
    }

    if (remaining < 0) {
      return {
        badge: 'Calorie Target Exceeded',
        icon: '🏃',
        title: 'แคลอรีสุทธิเกินเป้าหมายเล็กน้อย',
        advice: `วันนี้ทานเกินเป้าไป ${Math.abs(remaining)} kcal แนะนำเดินชันหรือคาร์ดิโอเบาๆ 20 นาทีเพื่อปรับสมดุลพลังงานสุทธิ`,
      };
    }

    return {
      badge: 'On Track',
      icon: '🎯',
      title: 'วินัยยอดเยี่ยม — รักษาสมดุลอย่างต่อเนื่อง',
      advice: `แคลอรีสุทธิเหลืออีก ${remaining.toLocaleString()} kcal และดื่มน้ำไปแล้ว ${waterMl} ml ทุกอย่างกำลังดำเนินไปตามแผนเหมือนนักกีฬามืออาชีพ`,
    };
  }, [netCalories, consumedCalories, burnedCalories, goalCalories, proteinGrams, targetProteinGrams, waterMl, streakDays]);

  return (
    <div
      style={{
        borderRadius: '18px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, #FFFFFF 100%)',
        border: '1px solid rgba(16, 185, 129, 0.28)',
        padding: '16px 20px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>{insight.icon}</span>
          <span
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              fontWeight: 800,
              color: 'var(--accent-deep)',
            }}
          >
            FEEDME AI Coach · {insight.badge}
          </span>
        </div>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            padding: '2px 8px',
            borderRadius: '999px',
            background: '#FFFFFF',
            border: '1px solid var(--border-soft)',
          }}
        >
          Live Synthesis
        </span>
      </div>

      <p
        style={{
          fontSize: '14px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '4px',
          letterSpacing: '-0.01em',
        }}
      >
        {insight.title}
      </p>

      <p
        style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          lineHeight: 1.55,
        }}
      >
        {insight.advice}
      </p>
    </div>
  );
}
