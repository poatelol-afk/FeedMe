'use client';

import React from 'react';

export default function PillarsBento() {
  return (
    <section id="features" className="py-20 bg-[#0B1317] border-y border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A282F] border border-[#1CB0F6]/30 text-xs font-black uppercase tracking-wider text-[#1CB0F6]">
            ✨ THE 3 PILLARS OF FEEDME 2.0
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            3 เสาหลักที่จะเปลี่ยนการดูแลตัวเอง <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58CC02] via-[#1CB0F6] to-[#CE82FF]">
              จากภาระน่าเบื่อ สู่เกมที่หยุดเล่นไม่ได้
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            หมดยุคการจดแคลลงตาราง Excel หรือออกกำลังกายอย่างโดดเดี่ยว นี่คืออีโคซิสเต็มที่ออกแบบมาเพื่อผลลัพธ์จริงและความสนุกทุกวัน
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* PILLAR 1: SMART KITCHEN & BLE SCALE (Col span 12 or 7) */}
          <div className="md:col-span-12 lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#162329] to-[#0F171B] border-2 border-[#233842] hover:border-[#1CB0F6]/50 transition-all shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-3 py-1 rounded-full bg-[#1CB0F6]/20 text-[#1CB0F6] border border-[#1CB0F6]/40 uppercase tracking-wide">
                🍳 เสาหลักที่ 1: Smart Kitchen & BLE Scale
              </span>
              <span className="text-2xl">📸 ⚖️</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                ครัวอัจฉริยะ & ตาชั่งดิจิทัล IoT
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                ไม่ว่าจะกินข้าวนอกบ้านหรือเข้าครัวปรุงเอง ทุกอย่างง่ายในปลายนิ้ว พร้อมคำนวณสารอาหารลึกระดับกรัม
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-2xl p-4 bg-[#101A1F] border border-white/5 space-y-1.5">
                <div className="text-lg">📸</div>
                <div className="text-sm font-black text-white">Photo AI Scanner</div>
                <p className="text-xs text-slate-400">
                  ถ่ายรูปอาหารจานโปรด ระบบแยกแยะเมนูและคำนวณแคล+โปรตีนให้ทันที
                </p>
              </div>

              <div className="rounded-2xl p-4 bg-[#101A1F] border border-white/5 space-y-1.5">
                <div className="text-lg">👨‍🍳</div>
                <div className="text-sm font-black text-white">Recipe Chef</div>
                <p className="text-xs text-slate-400">
                  &quot;วันนี้กินอะไรดี?&quot; แนะนำเมนูตามวัตถุดิบและโควต้าแคลที่ยังเหลือ
                </p>
              </div>

              <div className="rounded-2xl p-4 bg-[#101A1F] border border-white/5 space-y-1.5">
                <div className="text-lg">⚖️</div>
                <div className="text-sm font-black text-white">ESP32 BLE Scale</div>
                <p className="text-xs text-slate-400">
                  เชื่อมตาชั่งบลูทูธ ชั่งลงชามรู้สารอาหารสดๆ (มีโหมดจำลองในแอป)
                </p>
              </div>
            </div>
          </div>

          {/* PILLAR 2: RUN & LIFT (Col span 12 or 5) */}
          <div className="md:col-span-12 lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#1E2529] to-[#12181C] border-2 border-[#2F3D45] hover:border-[#FF9600]/50 transition-all shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-3 py-1 rounded-full bg-[#FF9600]/20 text-[#FF9600] border border-[#FF9600]/40 uppercase tracking-wide">
                🏃 เสาหลักที่ 2: Run & Lift
              </span>
              <span className="text-2xl">🔥 🏋️</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Strava-grade Cardio & เวทเทรนนิ่ง
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                พลังสองสายที่ทำงานร่วมกัน: วิ่งจับ GPS เส้นทางจริง และตารางยกเวทพร้อมระบบคุมน้ำหนัก
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#121A1F] border border-white/5 flex items-start gap-3">
                <div className="text-xl mt-0.5">🗺️</div>
                <div>
                  <div className="text-sm font-black text-white">วิ่งกลางแจ้งพร้อม GPS Map</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    วัดระยะทาง, Pace, เวลาจริง และแปลงพลังงานเผาผลาญเข้า Net Calories
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#121A1F] border border-white/5 flex items-start gap-3">
                <div className="text-xl mt-0.5">⚡</div>
                <div>
                  <div className="text-sm font-black text-white">Progressive Overload Coach</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    เช็คและแจ้งเตือนเมื่อคุณยกได้หนักขึ้น พร้อมแจกเหรียญรางวัลพิเศษ
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PILLAR 3: DUOLINGO-STYLE LEAGUES & PARTY QUESTS (Full Width 12 Cols) */}
          <div className="md:col-span-12 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#1B271F] via-[#142018] to-[#0E1712] border-2 border-[#25422D] hover:border-[#58CC02]/50 transition-all shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-[#58CC02]/20 text-[#58CC02] border border-[#58CC02]/40 uppercase tracking-wide">
                    🏆 เสาหลักที่ 3: Duolingo Gamification & Co-op
                  </span>
                  <span className="text-sm font-bold text-[#FFC800]">🔥 ไฟไม่เคยดับ</span>
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
                  ลีกประจำสัปดาห์ & ปาร์ตี้บอสกับเพื่อน
                </h3>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  เปลี่ยนวินัยให้เป็นการผจญภัย: ทุกมื้ออาหารที่คุมได้ ทุกกิโลเมตรที่วิ่ง ทุกเซ็ตที่ยก จะกลายเป็น XP ไต่ลีกจาก Bronze ไปสู่ Diamond
                  พร้อมระบบชวนเพื่อนตั้งตี้สู้ <span className="text-[#CE82FF] font-bold">&quot;บอสหมูกระทะ&quot;</span> รวมพลังเผาผลาญ 10,000 kcal ร่วมกัน
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
                    <div className="text-xs text-slate-400 mt-0.5">อีเวนต์พิเศษชวนเพื่อนล่าของรางวัลระดับพรีเมียม</div>
                  </div>
                </div>
              </div>

              {/* Graphic Showcase Inside Card */}
              <div className="lg:col-span-5 p-4 rounded-2xl bg-[#0B150F] border border-[#58CC02]/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-black text-white">
                  <span>🏆 DIAMOND LEAGUE — สัปดาห์นี้</span>
                  <span className="text-[#58CC02]">TOP 3 PROMOTION</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#142319] border border-[#58CC02]">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[#FFC800]">🥇 1</span>
                      <span className="font-bold text-white">AthleticSam</span>
                    </div>
                    <span className="font-black text-[#58CC02]">4,820 XP</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#0F1B13]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-400">🥈 2</span>
                      <span className="font-bold text-slate-200">คุณ (You)</span>
                    </div>
                    <span className="font-black text-[#58CC02]">4,210 XP</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#0F1B13]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-400">🥉 3</span>
                      <span className="font-bold text-slate-200">CoachTon</span>
                    </div>
                    <span className="font-black text-[#58CC02]">3,980 XP</span>
                  </div>
                </div>
                <div className="text-center pt-1 text-[11px] text-slate-400 font-bold">
                  🔥 รักษาสถิติแล้ว 18 วันติดต่อกัน!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
