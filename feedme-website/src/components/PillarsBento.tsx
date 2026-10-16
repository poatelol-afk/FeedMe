'use client';

import React, { useState } from 'react';
import { ScrollReveal, TiltCard3D } from './ui/ScrollReveal';

export default function PillarsBento() {
  const [selectedRival, setSelectedRival] = useState<string>('you');
  const [streakDays, setStreakDays] = useState<number>(18);
  const [streakProtected, setStreakProtected] = useState<boolean>(false);

  return (
    <section id="features" className="py-20 bg-[#0B1317] border-y border-white/5 relative perspective-stage">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading (Distilled & High-contrast) */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            3 ระบบหลัก เปลี่ยนวินัยให้เป็นเกม
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-medium">
            ถ่ายรูป ชั่งตวง วิ่ง และไต่ลีก จบในอีโคซิสเต็มเดียว
          </p>
        </ScrollReveal>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* PILLAR 1: SMART KITCHEN & BLE SCALE */}
          <ScrollReveal staggerDelayMs={100} className="md:col-span-12 lg:col-span-7">
            <TiltCard3D
              spotlightColor="rgba(28, 176, 246, 0.18)"
              className="h-full rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#162329] to-[#0F171B] border-2 border-[#233842] shadow-2xl space-y-6"
            >
              <div style={{ transform: 'translateZ(20px)' }} className="flex items-center justify-between">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-[#1CB0F6]/20 text-[#1CB0F6] border border-[#1CB0F6]/40 uppercase tracking-wide">
                  Smart Kitchen & BLE Scale
                </span>
                <span className="text-2xl">📸 ⚖️</span>
              </div>

              <div style={{ transform: 'translateZ(25px)' }} className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  ครัวอัจฉริยะ & ตาชั่งดิจิทัล IoT
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  รู้แคลทันทีตั้งแต่ถ่ายรูปจานโปรด ไปจนถึงชั่งวัตถุดิบสดผ่านบลูทูธ
                </p>
              </div>

              {/* Feature Highlights Grid Floating in 3D */}
              <div style={{ transform: 'translateZ(30px)' }} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="rounded-2xl p-4 bg-[#101A1F] border border-white/5 space-y-1.5 hover:border-[#1CB0F6]/40 transition-all">
                  <div className="text-lg">📸</div>
                  <div className="text-sm font-black text-white">Photo AI Scanner</div>
                  <p className="text-xs text-slate-400">
                    ถ่ายปุ๊บ รู้แคลและโปรตีนทันที
                  </p>
                </div>

                <div className="rounded-2xl p-4 bg-[#101A1F] border border-white/5 space-y-1.5 hover:border-[#1CB0F6]/40 transition-all">
                  <div className="text-lg">👨‍🍳</div>
                  <div className="text-sm font-black text-white">Recipe Chef</div>
                  <p className="text-xs text-slate-400">
                    คิดเมนูจากของที่มี ตามโควต้าแคล
                  </p>
                </div>

                <div className="rounded-2xl p-4 bg-[#101A1F] border border-white/5 space-y-1.5 hover:border-[#1CB0F6]/40 transition-all">
                  <div className="text-lg">⚖️</div>
                  <div className="text-sm font-black text-white">ESP32 BLE Scale</div>
                  <p className="text-xs text-slate-400">
                    ชั่งลงชาม ซิงก์กรัมและมาโครเรียลไทม์
                  </p>
                </div>
              </div>
            </TiltCard3D>
          </ScrollReveal>

          {/* PILLAR 2: RUN & LIFT */}
          <ScrollReveal staggerDelayMs={200} className="md:col-span-12 lg:col-span-5">
            <TiltCard3D
              spotlightColor="rgba(255, 150, 0, 0.18)"
              className="h-full rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#1E2529] to-[#12181C] border-2 border-[#2F3D45] shadow-2xl space-y-6"
            >
              <div style={{ transform: 'translateZ(20px)' }} className="flex items-center justify-between">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-[#FF9600]/20 text-[#FF9600] border border-[#FF9600]/40 uppercase tracking-wide">
                  Run & Lift
                </span>
                <span className="text-2xl">🔥 🏋️</span>
              </div>

              <div style={{ transform: 'translateZ(25px)' }} className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Strava-grade Cardio & เวท
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  จับเส้นทางวิ่ง GPS และบันทึกตารางเวท หักลบแคลเผาผลาญอัตโนมัติ
                </p>
              </div>

              <div style={{ transform: 'translateZ(30px)' }} className="space-y-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-[#121A1F] border border-white/5 flex items-start gap-3 hover:border-[#FF9600]/40 transition-all">
                  <div className="text-xl mt-0.5">🗺️</div>
                  <div>
                    <div className="text-sm font-black text-white">วิ่งกลางแจ้งพร้อม GPS Map</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      วัด Pace ระยะทาง และหักลบ Net Calories ทันที
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#121A1F] border border-white/5 flex items-start gap-3 hover:border-[#FF9600]/40 transition-all">
                  <div className="text-xl mt-0.5">⚡</div>
                  <div>
                    <div className="text-sm font-black text-white">Progressive Overload Coach</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      แจ้งเตือนสถิติใหม่เมื่อยกหนักขึ้น พร้อมโบนัส XP
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard3D>
          </ScrollReveal>

          {/* PILLAR 3: DUOLINGO-STYLE LEAGUES & PARTY QUESTS */}
          <ScrollReveal staggerDelayMs={300} className="md:col-span-12">
            <TiltCard3D
              spotlightColor="rgba(88, 204, 2, 0.2)"
              className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#1B271F] via-[#142018] to-[#0E1712] border-2 border-[#25422D] shadow-2xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div style={{ transform: 'translateZ(20px)' }} className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-[#58CC02]/20 text-[#58CC02] border border-[#58CC02]/40 uppercase tracking-wide">
                      Duolingo Gamification & Co-op
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setStreakProtected(!streakProtected);
                        if (!streakProtected) setStreakDays(d => d + 1);
                      }}
                      className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-[#FFC800] border border-amber-500/30 hover:scale-105 transition-all cursor-pointer"
                    >
                      🔥 {streakDays} วันติดต่อกัน {streakProtected ? '(แช่แข็งแล้ว ❄️)' : '(แตะเพื่อเซฟ)'}
                    </button>
                  </div>

                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
                    ลีกประจำสัปดาห์ & ปาร์ตี้บอสกับเพื่อน
                  </h3>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    ทุกมื้อและทุกเซ็ตคือ XP ไต่ลีกสู่ Diamond หรือตั้งตี้ตี <span className="text-[#CE82FF] font-bold">&quot;บอสหมูกระทะ&quot;</span> 10,000 kcal ร่วมกับเพื่อน
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-[#0D1812] border border-[#58CC02]/20">
                      <div className="font-black text-[#58CC02] text-sm">5 ลีกสุดเร้าใจ</div>
                      <div className="text-xs text-slate-400 mt-0.5">Bronze, Silver, Gold, Emerald, Diamond</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0D1812] border border-[#58CC02]/20">
                      <div className="font-black text-[#FF9600] text-sm">Streak & Freeze</div>
                      <div className="text-xs text-slate-400 mt-0.5">รักษาวันต่อเนื่อง ใช้ไอเทมแช่แข็งในวันพักผ่อน</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0D1812] border border-[#58CC02]/20">
                      <div className="font-black text-[#CE82FF] text-sm">Boss Party Raids</div>
                      <div className="text-xs text-slate-400 mt-0.5">อีเวนต์พิเศษชวนเพื่อนล่าของรางวัลพรีเมียม</div>
                    </div>
                  </div>
                </div>

                {/* Interactive Graphic Showcase Inside Card */}
                <div style={{ transform: 'translateZ(30px)' }} className="lg:col-span-5 p-4 rounded-2xl bg-[#0B150F] border border-[#58CC02]/30 space-y-3">
                  <div className="flex items-center justify-between text-xs font-black text-white">
                    <span>🏆 DIAMOND LEAGUE — สัปดาห์นี้</span>
                    <span className="text-[#58CC02]">TOP 3 PROMOTION</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedRival('sam')}
                      className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all text-left ${
                        selectedRival === 'sam' ? 'bg-[#183020] border-amber-400 scale-[1.02]' : 'bg-[#131F24] border-amber-400/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[#FFC800]">🥇 1</span>
                        <span className="font-bold text-white">AthleticSam</span>
                      </div>
                      <span className="font-black text-[#58CC02]">4,820 XP</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRival('you')}
                      className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all text-left ${
                        selectedRival === 'you' ? 'bg-[#1E3A28] border-[#58CC02] scale-[1.02]' : 'bg-[#0F1B13] border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#58CC02]">🥈 2</span>
                        <span className="font-black text-white">คุณ (You)</span>
                      </div>
                      <span className="font-black text-[#58CC02]">4,210 XP</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRival('ton')}
                      className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all text-left ${
                        selectedRival === 'ton' ? 'bg-[#183020] border-[#CE82FF] scale-[1.02]' : 'bg-[#0F1B13] border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-400">🥉 3</span>
                        <span className="font-bold text-slate-200">CoachTon</span>
                      </div>
                      <span className="font-black text-[#58CC02]">3,980 XP</span>
                    </button>
                  </div>
                  <div className="text-center pt-1 text-[11px] text-slate-400 font-bold">
                    🔥 รักษาสถิติแล้ว {streakDays} วันติดต่อกัน!
                  </div>
                </div>
              </div>
            </TiltCard3D>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
