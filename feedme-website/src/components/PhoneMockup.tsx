'use client';

import React, { useState, useRef } from 'react';

type TabKey = 'home' | 'kitchen' | 'workout' | 'league';

interface QuestItem {
  id: string;
  text: string;
  xp: number;
  completed: boolean;
}

const AI_DISH_PRESETS = [
  { name: 'ข้าวมันไก่ต้มอกไก่ ไม่เอาหนัง', kcal: 520, p: 38, c: 64, f: 12, emoji: '🍛' },
  { name: 'สเต็กแซลมอนย่างซีอิ๊ว ควินัว', kcal: 460, p: 42, c: 32, f: 16, emoji: '🐟' },
  { name: 'สลัดอกไก่ฉีก ไข่ต้มออนเซ็น', kcal: 340, p: 36, c: 18, f: 10, emoji: '🥗' },
];

export default function PhoneMockup() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [kitchenMode, setKitchenMode] = useState<'ai' | 'chef' | 'scale'>('ai');
  const [workoutMode, setWorkoutMode] = useState<'run' | 'lift'>('run');
  const [scaleWeight, setScaleWeight] = useState(185);
  const [partyJoined, setPartyJoined] = useState(false);
  const [dishIndex, setDishIndex] = useState(0);

  // Gamification state inside phone
  const [userXp, setUserXp] = useState(1280);
  const [floatingXp, setFloatingXp] = useState<string | null>(null);
  const [quests, setQuests] = useState<QuestItem[]>([
    { id: 'q1', text: 'ถ่ายรูปมื้อเช้าด้วย AI', xp: 20, completed: true },
    { id: 'q2', text: 'วิ่ง GPS โซน 2 สะสม 5 กม.', xp: 80, completed: true },
    { id: 'q3', text: 'ยกเวทตาราง Push Day', xp: 100, completed: false },
  ]);

  // 3D Perspective Tilt state
  const phoneRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!phoneRef.current) return;
    const rect = phoneRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -10;
    const ry = ((x / rect.width) - 0.5) * 10;
    setTilt({ rx, ry });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  const toggleQuest = (id: string) => {
    setQuests(prev =>
      prev.map(q => {
        if (q.id === id) {
          const nextState = !q.completed;
          const delta = nextState ? q.xp : -q.xp;
          setUserXp(curr => curr + delta);
          if (nextState) {
            setFloatingXp(`+${q.xp} XP!`);
            setTimeout(() => setFloatingXp(null), 800);
          }
          return { ...q, completed: nextState };
        }
        return q;
      })
    );
  };

  const currentDish = AI_DISH_PRESETS[dishIndex];

  return (
    <div
      ref={phoneRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: tilt.rx === 0 && tilt.ry === 0 ? 'transform 0.4s ease-out' : 'none',
      }}
      className="relative mx-auto w-full max-w-[340px] sm:max-w-[370px] select-none will-change-transform"
    >
      {/* Floating XP Pop Notification */}
      {floatingXp && (
        <div className="absolute top-12 right-6 z-40 xp-float-anim bg-[#58CC02] text-white px-3 py-1 rounded-full text-xs font-black shadow-lg pointer-events-none">
          ⚡ {floatingXp}
        </div>
      )}

      {/* Outer Phone Shell with 3D Depth */}
      <div className="relative rounded-[48px] p-3 bg-gradient-to-b from-[#334155] via-[#1E293B] to-[#0F172A] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.12)]">
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 h-5 w-28 bg-black rounded-full flex items-center justify-center gap-2 px-2 shadow-inner">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1E293B] border border-[#334155]" />
          <div className="w-2 h-2 rounded-full bg-[#059669]/60 animate-pulse" />
        </div>

        {/* Screen Bezel & Container */}
        <div className="relative overflow-hidden rounded-[40px] bg-[#131F24] text-white border border-[#23353D] shadow-inner min-h-[660px] flex flex-col justify-between">
          {/* Top Status Bar Inside Screen */}
          <div className="pt-7 pb-2 px-5 flex items-center justify-between text-xs font-bold text-slate-400 border-b border-white/5 bg-[#131F24]/90 backdrop-blur z-20">
            <span>09:41</span>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-[#FF9600] flex items-center gap-0.5">🔥 12</span>
              <span className="text-[#1CB0F6] flex items-center gap-0.5">💎 450</span>
              <span className="text-[#58CC02] flex items-center gap-0.5 font-extrabold">
                ⚡ {userXp.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Screen Content Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-none text-left">
            {/* TAB 1: HOME NET CALORIES */}
            {activeTab === 'home' && (
              <div className="space-y-3 animate-fade-in">
                {/* Hero Net Calorie Card */}
                <div className="rounded-2xl p-4 bg-[#1E293B] border border-[#334155] shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#58CC02]">
                      ⚖️ สมดุลพลังงาน (Net Calories)
                    </span>
                    <span className="text-[10px] bg-[#58CC02]/20 text-[#58CC02] px-2 py-0.5 rounded-full font-bold">
                      เป้าหมาย 2,200
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <div className="text-3xl font-black text-white tracking-tight">
                      1,270 <span className="text-sm font-semibold text-slate-400">kcal เหลือ</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      กิน <span className="text-white font-bold">1,450</span> − เผาผลาญ{' '}
                      <span className="text-[#FF9600] font-bold">520</span> = สุทธิ 930 kcal
                    </div>
                  </div>

                  {/* Macro Progress Bars */}
                  <div className="space-y-1.5 mt-3 pt-3 border-t border-white/10 text-[11px]">
                    <div>
                      <div className="flex justify-between font-bold mb-0.5">
                        <span className="text-[#38BDF8]">โปรตีน</span>
                        <span>112 / 140 g (80%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-[#38BDF8] rounded-full w-[80%] transition-all duration-500" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between font-bold mb-0.5">
                        <span className="text-[#58CC02]">คาร์โบไฮเดรต</span>
                        <span>145 / 220 g (66%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-[#58CC02] rounded-full w-[66%] transition-all duration-500" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between font-bold mb-0.5">
                        <span className="text-[#F59E0B]">ไขมัน</span>
                        <span>38 / 60 g (63%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-[#F59E0B] rounded-full w-[63%] transition-all duration-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Daily Quests Card (Interactive Click-to-Check!) */}
                <div className="rounded-2xl p-3.5 bg-[#1A282F] border border-[#2A3E47]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      <span>🎯 เควสประจำวัน (แตะเพื่อทำภารกิจ)</span>
                    </span>
                    <span className="text-[10px] text-[#FFC800] font-bold">
                      {quests.filter(q => q.completed).length}/{quests.length} สำเร็จ
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {quests.map(q => (
                      <button
                        key={q.id}
                        onClick={() => toggleQuest(q.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl transition-all text-left ${
                          q.completed
                            ? 'bg-[#131F24] border border-[#58CC02]/40 text-slate-400'
                            : 'bg-[#1E293B] border border-white/10 text-white hover:border-[#58CC02]/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                              q.completed ? 'bg-[#58CC02] text-white' : 'border border-slate-500 text-transparent'
                            }`}
                          >
                            ✓
                          </span>
                          <span className={q.completed ? 'line-through text-slate-400' : 'font-bold'}>
                            {q.text}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-[#FFC800]">+{q.xp} XP</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SMART KITCHEN */}
            {activeTab === 'kitchen' && (
              <div className="space-y-3 animate-fade-in">
                {/* Mode Selector */}
                <div className="flex rounded-xl bg-[#1A282F] p-1 border border-white/10 text-[11px] font-bold">
                  <button
                    onClick={() => setKitchenMode('ai')}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      kitchenMode === 'ai' ? 'bg-[#58CC02] text-white shadow' : 'text-slate-400'
                    }`}
                  >
                    📸 ถ่าย AI
                  </button>
                  <button
                    onClick={() => setKitchenMode('chef')}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      kitchenMode === 'chef' ? 'bg-[#CE82FF] text-white shadow' : 'text-slate-400'
                    }`}
                  >
                    👨‍🍳 วันนี้ทำอะไรกินดี
                  </button>
                  <button
                    onClick={() => setKitchenMode('scale')}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      kitchenMode === 'scale' ? 'bg-[#1CB0F6] text-white shadow' : 'text-slate-400'
                    }`}
                  >
                    ⚖️ ตาชั่ง BLE
                  </button>
                </div>

                {kitchenMode === 'ai' && (
                  <div className="rounded-2xl p-4 bg-[#1A282F] border border-[#2A3E47] space-y-3 text-center">
                    <div className="relative h-32 rounded-xl overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center group">
                      {/* Laser scanning beam */}
                      <div
                        className="absolute inset-x-0 h-1 bg-[#58CC02] shadow-[0_0_12px_#58CC02] opacity-80"
                        style={{
                          animation: 'feedme-laser 2s ease-in-out infinite',
                        }}
                      />
                      <div className="text-4xl">{currentDish.emoji}</div>
                      <div className="absolute bottom-2 left-2 text-[10px] bg-black/70 px-2 py-0.5 rounded text-[#58CC02] font-bold">
                        AI Scanning... 99%
                      </div>
                      <button
                        onClick={() => setDishIndex((dishIndex + 1) % AI_DISH_PRESETS.length)}
                        className="absolute top-2 right-2 text-[10px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-white font-bold transition-all"
                      >
                        สลับจาน 🔄
                      </button>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-black text-white">{currentDish.name}</div>
                      <div className="text-xs text-slate-400">ประมาณการ: {currentDish.kcal} kcal</div>
                      <div className="grid grid-cols-3 gap-1.5 mt-2 text-center text-[10px]">
                        <div className="p-1 rounded bg-[#131F24] border border-white/5">
                          <span className="block text-slate-400">โปรตีน</span>
                          <span className="font-bold text-[#38BDF8]">{currentDish.p}g</span>
                        </div>
                        <div className="p-1 rounded bg-[#131F24] border border-white/5">
                          <span className="block text-slate-400">คาร์บ</span>
                          <span className="font-bold text-[#58CC02]">{currentDish.c}g</span>
                        </div>
                        <div className="p-1 rounded bg-[#131F24] border border-white/5">
                          <span className="block text-slate-400">ไขมัน</span>
                          <span className="font-bold text-[#F59E0B]">{currentDish.f}g</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {kitchenMode === 'chef' && (
                  <div className="rounded-2xl p-3.5 bg-[#1A282F] border border-[#CE82FF]/40 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-[#CE82FF]">👨‍🍳 AI Recipe Chef</span>
                      <span className="text-[10px] bg-[#CE82FF]/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                        โควต้าเหลือ 650 kcal
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      เมนูแนะนำจากของในตู้เย็น & คุมแคลอรี่เป๊ะ:
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="p-2 rounded-xl bg-[#131F24] border border-[#CE82FF]/30 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white">🍗 อกไก่ย่างสมุนไพรจิ้มแจ่ว</div>
                          <div className="text-[10px] text-slate-400">380 kcal · โปรตีน 42g</div>
                        </div>
                        <span className="text-[10px] font-bold text-[#58CC02] bg-[#58CC02]/10 px-1.5 py-0.5 rounded">
                          เข้าตู้เย็น
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#131F24] border border-white/5 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white">🍳 ไข่ตุ๋นกุ้งคลีนทรงเครื่อง</div>
                          <div className="text-[10px] text-slate-400">210 kcal · โปรตีน 22g</div>
                        </div>
                        <span className="text-[10px] font-bold text-[#58CC02] bg-[#58CC02]/10 px-1.5 py-0.5 rounded">
                          แนะนำ
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setKitchenMode('scale')}
                      className="w-full py-1.5 rounded-lg bg-[#CE82FF] text-white text-[11px] font-bold shadow-[0_2px_0_#9333EA] hover:brightness-110 active:shadow-none active:translate-y-0.5"
                    >
                      เลือกเมนูนี้แล้วปรุงด้วยตาชั่ง ⚖️
                    </button>
                  </div>
                )}

                {kitchenMode === 'scale' && (
                  <div className="rounded-2xl p-4 bg-[#1A282F] border border-[#2A3E47] space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-[#1CB0F6] font-bold">
                      <span>⚡ BLE Connected: FeedMe Scale</span>
                      <span className="w-2 h-2 rounded-full bg-[#1CB0F6] animate-ping" />
                    </div>
                    {/* Scale Digital Readout */}
                    <div className="rounded-xl bg-black p-3 text-center border-2 border-[#1CB0F6]/40 shadow-inner">
                      <span className="text-4xl font-mono font-black text-[#1CB0F6] tracking-wider">
                        {scaleWeight}.0
                      </span>
                      <span className="text-xs text-slate-400 ml-1.5 font-bold">กรัม (g)</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setScaleWeight(0)}
                        className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-slate-800 text-slate-300 border border-white/10 active:scale-95 transition-all"
                      >
                        TARE (เซ็ต 0)
                      </button>
                      <button
                        onClick={() => setScaleWeight(prev => prev + 50)}
                        className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-[#1CB0F6] text-white shadow-[0_2px_0_#0284C7] active:shadow-none active:translate-y-0.5 transition-all"
                      >
                        +50g อกไก่
                      </button>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#131F24] text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">อกไก่ลอกหนังดิบ</span>
                        <span className="font-bold text-white">{Math.round(scaleWeight * 1.2)} kcal</span>
                      </div>
                      <div className="text-[10px] text-[#38BDF8]">
                        โปรตีน {Math.round(scaleWeight * 0.23)}g · คาร์บ 0g · ไขมัน {Math.round(scaleWeight * 0.02)}g
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: RUN & LIFT */}
            {activeTab === 'workout' && (
              <div className="space-y-3 animate-fade-in">
                {/* Mode Selector */}
                <div className="flex rounded-xl bg-[#1A282F] p-1 border border-white/10 text-xs font-bold">
                  <button
                    onClick={() => setWorkoutMode('run')}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      workoutMode === 'run' ? 'bg-[#FF9600] text-white shadow' : 'text-slate-400'
                    }`}
                  >
                    🏃 วิ่ง GPS (Strava)
                  </button>
                  <button
                    onClick={() => setWorkoutMode('lift')}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      workoutMode === 'lift' ? 'bg-[#CE82FF] text-white shadow' : 'text-slate-400'
                    }`}
                  >
                    🏋️ ยกเวท Overload
                  </button>
                </div>

                {workoutMode === 'run' ? (
                  <div className="rounded-2xl p-4 bg-[#1A282F] border border-[#FF9600]/40 space-y-3">
                    <div className="relative h-28 rounded-xl overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center">
                      {/* Stylized Animated Neon GPS Map Route */}
                      <svg className="w-full h-full p-2" viewBox="0 0 200 100">
                        <path
                          d="M 20 80 Q 60 20, 100 60 T 180 30"
                          fill="none"
                          stroke="#FF9600"
                          strokeWidth="4"
                          strokeLinecap="round"
                          className="gps-route-anim"
                        />
                        <circle cx="180" cy="30" r="5" fill="#FFC800" className="animate-ping" />
                        <circle cx="180" cy="30" r="4" fill="#FFC800" />
                      </svg>
                      <div className="absolute top-2 left-2 text-[10px] bg-black/70 px-2 py-0.5 rounded text-[#FF9600] font-bold">
                        GPS Active · สวนลุมพินี
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-[#131F24]">
                        <div className="text-[10px] text-slate-400">ระยะทาง</div>
                        <div className="text-base font-black text-white">5.24 <span className="text-[10px]">km</span></div>
                      </div>
                      <div className="p-2 rounded-xl bg-[#131F24]">
                        <div className="text-[10px] text-slate-400">Pace</div>
                        <div className="text-base font-black text-white">5:18</div>
                      </div>
                      <div className="p-2 rounded-xl bg-[#131F24]">
                        <div className="text-[10px] text-slate-400">เผาผลาญ</div>
                        <div className="text-base font-black text-[#FF9600]">368 <span className="text-[10px]">kcal</span></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl p-4 bg-[#1A282F] border border-[#CE82FF]/40 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-white">Push Day (อก/ไหล่/หลังแขน)</span>
                      <span className="text-[10px] bg-[#CE82FF]/20 text-[#CE82FF] px-2 py-0.5 rounded-full font-bold">
                        เซ็ต 3/4
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#131F24] border border-[#CE82FF]/30 space-y-1">
                      <div className="text-xs font-bold text-white">Barbell Bench Press</div>
                      <div className="text-xs text-slate-300">80 kg × 8 reps</div>
                      <div className="text-[10px] text-[#58CC02] font-black mt-1">
                        🔥 Progressive Overload: +2.5 kg เทียบสัปดาห์ก่อน!
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span>เผาผลาญประมาณ: 240 kcal</span>
                      <span className="text-[#FFC800] font-bold">+85 XP</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: LEAGUE */}
            {activeTab === 'league' && (
              <div className="space-y-3 animate-fade-in">
                <div className="rounded-2xl p-4 bg-[#1A282F] border border-[#58CC02]/40 text-center space-y-2">
                  <div className="text-2xl">🏆</div>
                  <div className="text-sm font-black text-white">Emerald League (ลีกมรกต)</div>
                  <div className="text-[11px] text-slate-400">รีเซ็ตใน 2 วัน 14 ชั่วโมง</div>

                  {/* Leaderboard Podiums */}
                  <div className="space-y-1.5 text-left text-xs mt-3">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#131F24] border border-amber-400/40">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-400">#1</span>
                        <span>🥇 NinjaRunner</span>
                      </div>
                      <span className="font-black text-[#58CC02]">3,450 XP</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#1E293B] border border-[#58CC02]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#58CC02]">#2</span>
                        <span className="font-black text-white">🥈 คุณ (You)</span>
                      </div>
                      <span className="font-black text-[#58CC02]">{userXp.toLocaleString()} XP</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#131F24] border border-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-400">#3</span>
                        <span>🥉 Somchai Fit</span>
                      </div>
                      <span className="font-black text-[#58CC02]">2,890 XP</span>
                    </div>
                  </div>

                  {/* Boss Raid Party Badge with Opt-in Button */}
                  <div className="mt-3 p-2.5 rounded-xl bg-[#162329] border border-[#2B3E47] text-left text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-black text-[#CE82FF] flex items-center gap-1">
                        <span>👾 บอสไขมันทรานส์ (Co-op Raid)</span>
                      </div>
                      <span className="text-[10px] bg-[#CE82FF]/20 text-[#CE82FF] border border-[#CE82FF]/30 px-1.5 py-0.5 rounded font-bold">
                        {partyJoined ? 'เข้าร่วมแล้ว ✓' : 'เปิดรับตี้'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-300">
                      รวมพลังแก๊ง 4 คน เผาผลาญ: {partyJoined ? '8,370' : '7,850'} / 10,000 kcal
                    </div>
                    {/* Live Boss HP Bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#CE82FF] to-[#EC4899] rounded-full transition-all duration-500"
                        style={{ width: partyJoined ? '83.7%' : '78.5%' }}
                      />
                    </div>
                    <button
                      onClick={() => setPartyJoined(!partyJoined)}
                      className={`w-full py-1.5 rounded-lg text-[11px] font-black transition-all ${
                        partyJoined
                          ? 'bg-[#263A42] text-slate-200 border border-slate-600'
                          : 'bg-[#58CC02] text-white shadow-[0_2px_0_#46A302] hover:brightness-110 active:shadow-none active:translate-y-0.5'
                      }`}
                    >
                      {partyJoined ? '✓ อยู่ในปาร์ตี้ (แก๊งหมูกระทะ)' : '+ ชวนเพื่อนตั้งตี้'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom App Navigation Bar Inside Phone */}
          <div className="p-2 bg-[#131F24] border-t border-white/10 grid grid-cols-4 gap-1 text-center text-[10px] font-bold z-20">
            <button
              onClick={() => setActiveTab('home')}
              className={`py-2 rounded-xl transition-all ${
                activeTab === 'home' ? 'text-[#58CC02] bg-white/5' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-sm">🏠</div>
              <div>หน้าแรก</div>
            </button>
            <button
              onClick={() => setActiveTab('kitchen')}
              className={`py-2 rounded-xl transition-all ${
                activeTab === 'kitchen' ? 'text-[#1CB0F6] bg-white/5' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-sm">🍳</div>
              <div>ครัว AI</div>
            </button>
            <button
              onClick={() => setActiveTab('workout')}
              className={`py-2 rounded-xl transition-all ${
                activeTab === 'workout' ? 'text-[#FF9600] bg-white/5' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-sm">🏃</div>
              <div>ออกกำลัง</div>
            </button>
            <button
              onClick={() => setActiveTab('league')}
              className={`py-2 rounded-xl transition-all ${
                activeTab === 'league' ? 'text-[#FFC800] bg-white/5' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-sm">🏆</div>
              <div>ลีกเพื่อน</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
