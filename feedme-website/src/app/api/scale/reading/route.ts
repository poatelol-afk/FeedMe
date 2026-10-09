// ═══════════════════════════════════════════════════════
//  FeedMe — Scale API Endpoint
//  POST /api/scale/reading  ← hardware ส่งค่ามาที่นี่
//  GET  /api/scale/reading  ← ดูประวัติ (debug)
//
//  Payload จาก ESP32/Hardware:
//  {
//    "device_id": "scale-01",
//    "weight_kg": 68.5,
//    "unit": "kg",
//    "stable": true
//  }
// ═══════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ── POST — รับค่าน้ำหนักจาก hardware ─────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate payload
    const { device_id, weight_kg, stable } = body;
    const weightNum = parseFloat(weight_kg);

    if (isNaN(weightNum) || weightNum <= 0 || weightNum > 500) {
      return NextResponse.json(
        { ok: false, error: 'Invalid weight value (must be 0–500 kg)' },
        { status: 400 },
      );
    }

    // ไม่บันทึกถ้าเครื่องชั่งยังไม่นิ่ง
    if (stable === false) {
      return NextResponse.json({ ok: true, saved: false, message: 'Scale not stable — skipped' });
    }

    // ดึง user จาก session (Supabase auth cookie)
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized — please log in via FeedMe app first' },
        { status: 401 },
      );
    }

    // คำนวณ BMI จาก profile
    let bmi: number | null = null;
    const { data: profileData } = await supabase
      .from('profiles')
      .select('height')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileData?.height && profileData.height > 0) {
      const hm = profileData.height / 100;
      bmi = Math.round((weightNum / (hm * hm)) * 10) / 10;
    }

    // บันทึกลง weight_logs
    const { data: saved, error: insertError } = await supabase
      .from('weight_logs')
      .insert({
        user_id: user.id,
        weight_kg: Math.round(weightNum * 10) / 10,
        bmi,
        device_id: device_id ?? 'unknown',
        source: 'scale',
        measured_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Scale API] Insert error:', insertError);
      return NextResponse.json(
        { ok: false, error: 'Database error' },
        { status: 500 },
      );
    }

    console.log(`[Scale] ✓ ${user.email} — ${weightNum} kg from ${device_id ?? 'unknown'} (BMI: ${bmi})`);

    return NextResponse.json({
      ok: true,
      saved: true,
      data: {
        id: saved.id,
        weight_kg: saved.weight_kg,
        bmi: saved.bmi,
        measured_at: saved.measured_at,
      },
    });

  } catch (err) {
    console.error('[Scale API] Error:', err);
    return NextResponse.json(
      { ok: false, error: 'Invalid request body' },
      { status: 400 },
    );
  }
}

// ── GET — ดูประวัติย้อนหลัง 10 รายการ (debug) ────────

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { data } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('measured_at', { ascending: false })
    .limit(10);

  return NextResponse.json({ ok: true, count: data?.length ?? 0, entries: data ?? [] });
}
