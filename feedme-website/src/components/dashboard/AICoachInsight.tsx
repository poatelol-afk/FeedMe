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
        icon: '☀️',
        title: 'เริ่มต้นวันใหม่อย่างมีระบบ',
        advice: `เป้าหมายพลังงานวันนี้ ${goalCalories.toLocaleString()} kcal และโปรตีน ${targetProteinGrams}g บันทึกมื้อเช้าหรือเริ่มวอร์มอัพเพื่อรักษาวินัยวันที่ ${streakDays + 1}`,
      };
    }

    if (burnedCalories > 300 && proteinPct < 70) {
      return {
        badge: 'Post-Workout Recovery',
        icon: '⚡',
        title: 'การเผาผลาญดีเยี่ยม — เติมโปรตีนเพื่อซ่อมแซมกล้ามเนื้อ',
        advice: `วันนี้เผาผลาญไปแล้ว ${burnedCalories} kcal แต่โปรตีนแตะเพียง ${proteinGrams}g (${proteinPct}%) แนะนำเติมโปรตีนสะอาดอีก ${Math.max(0, targetProteinGrams - proteinGrams)}g เพื่อให้กล้ามเนื้อฟื้นตัวสูงสุด`,
      };
    }

    if (remaining < 0) {
      return {
        badge: 'Energy Deficit Exceeded',
        icon: '⚖️',
        title: 'แคลอรีสุทธิเกินเป้าหมายเล็กน้อย',
        advice: `วันนี้ทานเกินเป้าไป ${Math.abs(remaining)} kcal แนะนำเดินเบาๆ 20 นาที หรือรักษาวินัยการนอนเพื่อให้ฮอร์โมนเผาผลาญทำงานเต็มที่`,
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
    <div style={{
      borderRadius: '16px',
      background: 'linear-gradient(135deg, rgba(143,184,154,0.08) 0%, rgba(26,25,23,0.95) 100%)',
      border: '1px solid rgba(143,184,154,0.22)',
      padding: '16px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>{insight.icon}</span>
          <span style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: '600',
            color: 'var(--accent)',
          }}>
            AI Health Coach · {insight.badge}
          </span>
        </div>
        <span style={{
          fontSize: '10px',
          color: 'var(--text-muted)',
          padding: '2px 8px',
          borderRadius: '999px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-soft)',
        }}>
          Real-time Synthesis
        </span>
      </div>

      <p style={{
        fontSize: '13px',
        fontWeight: '500',
        color: 'var(--text-primary)',
        marginBottom: '4px',
        letterSpacing: '-0.01em',
      }}>
        {insight.title}
      </p>

      <p style={{
        fontSize: '12px',
        color: 'var(--text-secondary)',
        lineHeight: 1.55,
      }}>
        {insight.advice}
      </p>
    </div>
  );
}
