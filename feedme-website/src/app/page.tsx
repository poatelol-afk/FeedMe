'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FoodPreset {
  id: string;
  name: string;
  emoji: string;
  grams: number;
  kcalPer100: number;
  pPer100: number;
  cPer100: number;
  fPer100: number;
}

const PRESET_FOODS: FoodPreset[] = [
  { id: 'chicken', name: 'อกไก่ย่างสมุนไพร', emoji: '🍗', grams: 180, kcalPer100: 165, pPer100: 31, cPer100: 0, fPer100: 3.6 },
  { id: 'rice',    name: 'ข้าวหอมมะลิสุก',   emoji: '🍚', grams: 150, kcalPer100: 130, pPer100: 2.7, cPer100: 28.2, fPer100: 0.3 },
  { id: 'salmon',  name: 'แซลมอนย่างเกลือ',  emoji: '🐟', grams: 160, kcalPer100: 208, pPer100: 20, cPer100: 0, fPer100: 13 },
  { id: 'egg',     name: 'ไข่ต้มยางมะตูม',    emoji: '🥚', grams: 100, kcalPer100: 155, pPer100: 13, cPer100: 1.1, fPer100: 11 },
  { id: 'avocado', name: 'อะโวคาโดสด',       emoji: '🥑', grams: 120, kcalPer100: 160, pPer100: 2, cPer100: 8.5, fPer100: 14.7 },
];

export default function LandingPage() {
  const webAppUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8081';

  // Interactive Playground State
  const [selectedFood, setSelectedFood] = useState<FoodPreset>(PRESET_FOODS[0]);
  const [currentGrams, setCurrentGrams] = useState<number>(PRESET_FOODS[0].grams);
  const [streakDays, setStreakDays] = useState<number>(3);
  const [coinBalance, setCoinBalance] = useState<number>(140);
  const [completedQuests, setCompletedQuests] = useState<Record<string, boolean>>({});
  const [rewardToast, setRewardToast] = useState<string | null>(null);

  // Live Macro Calculation
  const multiplier = currentGrams / 100;
  const liveKcal = Math.round(selectedFood.kcalPer100 * multiplier);
  const liveProtein = Math.round(selectedFood.pPer100 * multiplier * 10) / 10;
  const liveCarbs = Math.round(selectedFood.cPer100 * multiplier * 10) / 10;
  const liveFat = Math.round(selectedFood.fPer100 * multiplier * 10) / 10;

  const handleSelectFood = (food: FoodPreset) => {
    setSelectedFood(food);
    setCurrentGrams(food.grams);
  };

  const handleToggleQuest = (questId: string, rewardCoins: number) => {
    if (completedQuests[questId]) return;

    setCompletedQuests(prev => ({ ...prev, [questId]: true }));
    const newCoins = coinBalance + rewardCoins;
    setCoinBalance(newCoins);
    setStreakDays(prev => prev + 1);

    setRewardToast(`🎉 ยินดีด้วย! สำเร็จภารกิจ ได้รับ +${rewardCoins} 🪙 เหรียญรางวัล และ Streak เพิ่มขึ้นเป็น ${streakDays + 1} วัน! 🔥`);
    setTimeout(() => {
      setRewardToast(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#4B4B4B] font-sans selection:bg-[#D7FFB8] selection:text-[#111111]">
      {/* ─── Duolingo Sticky Navigation ───────────────────── */}
      <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b-2 border-[#E5E5E5] shadow-[0_2px_0_#E5E5E5]">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#D7FFB8] border-2 border-[#58CC02] flex items-center justify-center text-2xl shadow-[0_3px_0_#46A302]">
              🦉
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-[#58CC02]">FeedMe</span>
              <span className="hidden sm:inline-block ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D7FFB8] text-[#235800] border border-[#58CC02]">
                GAMIFIED HEALTH
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-[#777777]">
            <a href="#playground" className="hover:text-[#58CC02] transition-colors">มินิเกมทดลอง</a>
            <a href="#features" className="hover:text-[#58CC02] transition-colors">ฟีเจอร์เด่น</a>
            <a href="#hardware" className="hover:text-[#58CC02] transition-colors">ตาชั่ง IoT</a>
            <a href="#shop" className="hover:text-[#58CC02] transition-colors">ร้านค้าเหรียญรางวัล</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={webAppUrl}
              className="btn-duo-primary text-sm tracking-wide"
            >
              เปิดเว็บแอป 🚀
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero Section with FitOwl Mascot ──────────────── */}
      <section className="pt-16 pb-20 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Mascot */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* FitOwl Speech Bubble */}
            <div className="inline-block mb-6 text-left">
              <div className="duo-speech-bubble inline-flex items-center gap-2.5">
                <span className="text-xl">🦉</span>
                <span>
                  <strong className="text-[#58CC02]">FitOwl:</strong> &ldquo;พร้อมกินดี มีวินัย และสะสมไฟ Streak แล้วหรือยัง?&rdquo;
                </span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-[#4B4B4B] mb-6">
              ฟิตหุ่นและดูแลสุขภาพ{' '}
              <span className="block text-[#58CC02]">ให้สนุกเหมือนเล่นเกม!</span>
            </h1>

            <p className="text-lg sm:text-xl font-bold text-[#777777] leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              หมดปัญหานับแคลอรี่น่าเบื่อ! FeedMe เชื่อมต่อตาชั่งอาหารดิจิทัล IoT และ AI โค้ชยกเวท
              เปลี่ยนมื้ออาหารและการออกกำลังกายเป็นแต้มพลังงานและเหรียญรางวัลทองคำ 🪙
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                href={webAppUrl}
                className="btn-duo-primary text-base px-8 py-3.5"
              >
                🚀 เริ่มต้นใช้งานฟรี (WEB APP)
              </Link>
              <a
                href="#features"
                className="btn-duo-secondary text-base px-6 py-3.5"
              >
                ดูฟีเจอร์ทั้งหมด ↓
              </a>
            </div>

            {/* Social Proof Badges */}
            <div className="mt-10 pt-6 border-t-2 border-[#E5E5E5] flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-bold text-[#777777]">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔥</span>
                <span>12,000+ วันแห่งความต่อเนื่อง</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">⚖️</span>
                <span>เชื่อมต่อตาชั่ง BLE แบบ Real-time</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🪙</span>
                <span>แลก Cheat Meal Pass ได้จริง</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Mascot Card */}
          <div className="lg:col-span-5">
            <div className="card-duo-3d bg-white p-8 relative overflow-hidden text-center">
              {/* Gamification Status Bar preview */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-[#F0F0F0]">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF7E6] border-2 border-[#FF9600] rounded-xl text-xs font-extrabold text-[#FF9600]">
                  <span>🔥</span> {streakDays} วันติด
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFBEA] border-2 border-[#FFD900] rounded-xl text-xs font-extrabold text-[#B38600]">
                  <span>🪙</span> {coinBalance} Coins
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF0F0] border-2 border-[#FF4B4B] rounded-xl text-xs font-extrabold text-[#FF4B4B]">
                  <span>❤️</span> 5/5
                </div>
              </div>

              {/* Big Mascot Illustration */}
              <div className="w-36 h-36 mx-auto mb-6 rounded-full bg-[#D7FFB8] border-4 border-[#58CC02] flex items-center justify-center text-7xl shadow-[0_6px_0_#46A302]">
                🦉
              </div>

              <h2 className="text-2xl font-black text-[#4B4B4B] mb-2">โค้ชนกฮูก FitOwl</h2>
              <p className="text-sm font-bold text-[#777777] mb-6">
                &ldquo;กินโปรตีนให้ถึงเป้า แล้วมาเพิ่มน้ำหนักเวทเซ็ตถัดไปกับฉันนะ!&rdquo;
              </p>

              <Link
                href={webAppUrl}
                className="btn-duo-blue w-full py-3"
              >
                เข้าสู่แอปพลิเคชันหลัก ⚡
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Interactive Playground: Smart Scale & Quest Simulator ── */}
      <section id="playground" className="py-20 bg-[#FFFFFF] border-y-2 border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-block px-3 py-1 rounded-full bg-[#D7FFB8] border border-[#58CC02] text-xs font-extrabold text-[#235800] mb-3">
              INTERACTIVE PLAYGROUND
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#4B4B4B]">
              ลองชั่งอาหารและทำภารกิจจำลอง
            </h2>
            <p className="text-base font-bold text-[#777777] mt-3">
              สัมผัสประสบการณ์ตาชั่งอัจฉริยะและการสะสมเหรียญรางวัลแบบเกม Duolingo ได้ทันทีตรงนี้
            </p>
          </div>

          {rewardToast && (
            <div className="max-w-md mx-auto mb-8 p-4 rounded-2xl bg-[#D7FFB8] border-2 border-[#58CC02] text-[#235800] font-extrabold text-sm text-center shadow-[0_4px_0_#46A302] animate-bounce">
              {rewardToast}
            </div>
          )}

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Box: Scale Simulator */}
            <div className="lg:col-span-6 card-duo-3d bg-[#F7F7F7]">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-extrabold text-[#777777] uppercase tracking-wider">
                  ⚖️ SIMULATED SMART SCALE
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D7FFB8] border border-[#58CC02] text-[11px] font-black text-[#235800]">
                  BLE CONNECTED
                </span>
              </div>

              {/* Food presets picker */}
              <div className="text-xs font-bold text-[#777777] mb-3">1. เลือกอาหารที่วางบนจาน:</div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-6">
                {PRESET_FOODS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => handleSelectFood(f)}
                    className={`p-2 rounded-xl border-2 text-center transition-all ${
                      selectedFood.id === f.id
                        ? 'bg-[#FFFFFF] border-[#58CC02] shadow-[0_3px_0_#46A302]'
                        : 'bg-[#FFFFFF] border-[#E5E5E5] hover:border-[#D7D7D7]'
                    }`}
                  >
                    <div className="text-2xl mb-1">{f.emoji}</div>
                    <div className="text-[11px] font-bold text-[#4B4B4B] truncate">{f.name.split(' ')[0]}</div>
                  </button>
                ))}
              </div>

              {/* LCD Display */}
              <div className="bg-[#FFFFFF] border-2 border-[#E5E5E5] rounded-2xl p-6 text-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)] mb-6">
                <div className="text-xs font-bold text-[#777777] mb-1">น้ำหนักที่อ่านได้จากตาชั่ง</div>
                <div className="text-5xl font-black text-[#4B4B4B] tracking-tight">
                  {currentGrams} <span className="text-2xl font-bold text-[#777777]">g</span>
                </div>
                <div className="text-xs font-extrabold text-[#58CC02] mt-2 flex items-center justify-center gap-1">
                  <span>⚡</span> รับสัญญาณเสถียร (BLE Transmitted)
                </div>
              </div>

              {/* Live Macro Calculation */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-[#FFFFFF] border-2 border-[#E5E5E5] rounded-xl p-2.5">
                  <div className="text-lg font-black text-[#4B4B4B]">{liveKcal}</div>
                  <div className="text-[10px] font-bold text-[#777777]">kcal</div>
                </div>
                <div className="bg-[#FFFFFF] border-2 border-[#1CB0F6] rounded-xl p-2.5">
                  <div className="text-lg font-black text-[#1CB0F6]">{liveProtein}g</div>
                  <div className="text-[10px] font-bold text-[#777777]">โปรตีน</div>
                </div>
                <div className="bg-[#FFFFFF] border-2 border-[#FFD900] rounded-xl p-2.5">
                  <div className="text-lg font-black text-[#B38600]">{liveCarbs}g</div>
                  <div className="text-[10px] font-bold text-[#777777]">คาร์บ</div>
                </div>
                <div className="bg-[#FFFFFF] border-2 border-[#FF9600] rounded-xl p-2.5">
                  <div className="text-lg font-black text-[#FF9600]">{liveFat}g</div>
                  <div className="text-[10px] font-bold text-[#777777]">ไขมัน</div>
                </div>
              </div>
            </div>

            {/* Right Box: Quests & Rewards Simulator */}
            <div className="lg:col-span-6 card-duo-3d bg-[#F7F7F7]">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-extrabold text-[#777777] uppercase tracking-wider">
                  🎯 DAILY QUESTS & STREAK
                </span>
                <span className="text-xs font-bold text-[#FF9600]">
                  🔥 Streak ปัจจุบัน: {streakDays} วัน
                </span>
              </div>

              <div className="space-y-3 mb-6">
                {/* Quest 1 */}
                <div className="bg-[#FFFFFF] border-2 border-[#E5E5E5] rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚖️</span>
                    <div>
                      <div className="text-sm font-extrabold text-[#4B4B4B]">ชั่งอาหารมื้อนี้ผ่าน FeedMe Scale</div>
                      <div className="text-xs font-bold text-[#B38600]">+15 🪙 Coins รางวัล</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleQuest('q1', 15)}
                    disabled={completedQuests['q1']}
                    className={completedQuests['q1'] ? 'btn-duo-primary py-2 px-3 text-xs bg-[#D7FFB8] text-[#235800] border-none' : 'btn-duo-primary py-2 px-3 text-xs'}
                  >
                    {completedQuests['q1'] ? 'สำเร็จ ✓' : 'กดทำเลย'}
                  </button>
                </div>

                {/* Quest 2 */}
                <div className="bg-[#FFFFFF] border-2 border-[#E5E5E5] rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🥗</span>
                    <div>
                      <div className="text-sm font-extrabold text-[#4B4B4B]">ทานโปรตีนให้ครบ 120g วันนี้</div>
                      <div className="text-xs font-bold text-[#B38600]">+20 🪙 Coins รางวัล</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleQuest('q2', 20)}
                    disabled={completedQuests['q2']}
                    className={completedQuests['q2'] ? 'btn-duo-primary py-2 px-3 text-xs bg-[#D7FFB8] text-[#235800] border-none' : 'btn-duo-primary py-2 px-3 text-xs'}
                  >
                    {completedQuests['q2'] ? 'สำเร็จ ✓' : 'กดทำเลย'}
                  </button>
                </div>

                {/* Quest 3 */}
                <div className="bg-[#FFFFFF] border-2 border-[#E5E5E5] rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💪</span>
                    <div>
                      <div className="text-sm font-extrabold text-[#4B4B4B]">ยกเวท Bench Press ครบ 3 เซ็ต</div>
                      <div className="text-xs font-bold text-[#B38600]">+30 🪙 Coins รางวัล</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleQuest('q3', 30)}
                    disabled={completedQuests['q3']}
                    className={completedQuests['q3'] ? 'btn-duo-primary py-2 px-3 text-xs bg-[#D7FFB8] text-[#235800] border-none' : 'btn-duo-primary py-2 px-3 text-xs'}
                  >
                    {completedQuests['q3'] ? 'สำเร็จ ✓' : 'กดทำเลย'}
                  </button>
                </div>
              </div>

              {/* Streak & Coin Bank Summary */}
              <div className="bg-[#FFFFFF] border-2 border-[#FFD900] rounded-2xl p-4 text-center">
                <div className="text-xs font-bold text-[#777777]">เหรียญสะสมของคุณในกระเป๋า</div>
                <div className="text-3xl font-black text-[#B38600] my-1">
                  🪙 {coinBalance} Coins
                </div>
                <div className="text-xs font-bold text-[#777777]">
                  นำเหรียญนี้ไปแลก Streak Freeze ❄️ หรือ Cheat Meal Pass 🍔 ในแอปได้เลย!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4 Core Feature Cards (Duolingo 3D Grid) ──────── */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-[#4B4B4B]">
            4 เสาหลักที่ทำให้ FeedMe แตกต่าง
          </h2>
          <p className="text-base font-bold text-[#777777] mt-3">
            การผสมผสานฮาร์ดแวร์ IoT, ปัญญาประดิษฐ์ AI และกลไกเกมมิ่งเพื่อผลลัพธ์ที่ยั่งยืน
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="card-duo-3d flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#D7FFB8] border-2 border-[#58CC02] flex items-center justify-center text-3xl mb-6 shadow-[0_3px_0_#46A302]">
                ⚖️
              </div>
              <h3 className="text-xl font-black text-[#4B4B4B] mb-2">Smart IoT Scale</h3>
              <p className="text-sm font-bold text-[#777777] leading-relaxed">
                ตาชั่ง ESP32 ชั่งแม่นยำระดับ 0.1g กดปุ่ม Send ส่งข้อมูลผ่าน Bluetooth/Wi-Fi เข้าแอปอัตโนมัติ ไม่ต้องพิมพ์เอง
              </p>
            </div>
            <div className="mt-6 pt-4 border-t-2 border-[#F0F0F0] text-xs font-extrabold text-[#58CC02]">
              ✓ มี Tare & Quick BLE
            </div>
          </div>

          {/* Card 2 */}
          <div className="card-duo-3d flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#E6F7FF] border-2 border-[#1CB0F6] flex items-center justify-center text-3xl mb-6 shadow-[0_3px_0_#1899D6]">
                📸
              </div>
              <h3 className="text-xl font-black text-[#4B4B4B] mb-2">AI Food Vision</h3>
              <p className="text-sm font-bold text-[#777777] leading-relaxed">
                ถ่ายภาพอาหารไทย อาหารคลีน หรือสตรีทฟู้ด AI วิเคราะห์แคลอรี่ โปรตีน คาร์โบไฮเดรต และไขมันได้แม่นยำในเสี้ยววินาที
              </p>
            </div>
            <div className="mt-6 pt-4 border-t-2 border-[#F0F0F0] text-xs font-extrabold text-[#1CB0F6]">
              ✓ Multimodal Gemini Vision
            </div>
          </div>

          {/* Card 3 */}
          <div className="card-duo-3d flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#FFF7E6] border-2 border-[#FF9600] flex items-center justify-center text-3xl mb-6 shadow-[0_3px_0_#CC7800]">
                💪
              </div>
              <h3 className="text-xl font-black text-[#4B4B4B] mb-2">Progressive Overload</h3>
              <p className="text-sm font-bold text-[#777777] leading-relaxed">
                AI โค้ชวิเคราะห์จำนวนครั้ง เซ็ต และ RPE แนะนำการเพิ่มแผ่นน้ำหนักเวทอย่างเป็นวิทยาศาสตร์ ไม่ต้องเดาเอง
              </p>
            </div>
            <div className="mt-6 pt-4 border-t-2 border-[#F0F0F0] text-xs font-extrabold text-[#FF9600]">
              ✓ แนะนำ +2.5 kg เมื่อพร้อม
            </div>
          </div>

          {/* Card 4 */}
          <div className="card-duo-3d flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#FFFBEA] border-2 border-[#FFD900] flex items-center justify-center text-3xl mb-6 shadow-[0_3px_0_#CCA000]">
                🛒
              </div>
              <h3 className="text-xl font-black text-[#4B4B4B] mb-2">Gamified Shop</h3>
              <p className="text-sm font-bold text-[#777777] leading-relaxed">
                เปลี่ยนความมีวินัยเป็นเหรียญทอง นำมาแลก Streak Freeze ป้องกันสถิติหลุด หรือแลก Cheat Meal Pass รางวัลชีวิต
              </p>
            </div>
            <div className="mt-6 pt-4 border-t-2 border-[#F0F0F0] text-xs font-extrabold text-[#B38600]">
              ✓ แลกไอเทม & อาหารตามใจ
            </div>
          </div>
        </div>
      </section>

      {/* ─── Hardware Spotlight: ESP32 Smart Scale ────────── */}
      <section id="hardware" className="py-20 bg-[#FFFFFF] border-t-2 border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <span className="px-3 py-1 rounded-full bg-[#E6F7FF] border border-[#1CB0F6] text-xs font-extrabold text-[#1899D6]">
              HARDWARE COMPANION
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#4B4B4B] mt-4 mb-6">
              FeedMe Scale: ตาชั่งที่คุยกับแอปได้ทันที
            </h2>
            <p className="text-base font-bold text-[#777777] leading-relaxed mb-6">
              ขับเคลื่อนด้วยไมโครคอนโทรลเลอร์ ESP32 และโมดูลวัดน้ำหนัก HX711 มีปุ่ม Tare เซ็ตศูนย์จานข้าว และปุ่ม Send
              ส่งค่าน้ำหนักตรงเข้ามือถือและเว็บเบราว์เซอร์ผ่าน Bluetooth GATT Notification โดยไม่ต้องกดพิมพ์ตัวเลขเอง
            </p>

            <ul className="space-y-3 font-bold text-sm text-[#4B4B4B] mb-8">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#D7FFB8] text-[#58CC02] flex items-center justify-center text-xs font-black">✓</span>
                <span>รองรับบลูทูธ BLE 4.2 / 5.0 ระยะส่งสัญญาณสูงสุด 10 เมตร</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#D7FFB8] text-[#58CC02] flex items-center justify-center text-xs font-black">✓</span>
                <span>มี Wi-Fi HTTP Fallback ส่งตรงเข้า Supabase คลาวด์</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#D7FFB8] text-[#58CC02] flex items-center justify-center text-xs font-black">✓</span>
                <span>รองรับ Web Bluetooth API ชั่งสดๆ ผ่าน Google Chrome บนคอมพิวเตอร์</span>
              </li>
            </ul>

            <Link
              href={webAppUrl}
              className="btn-duo-primary py-3.5 px-6"
            >
              ทดลองเชื่อมต่อตาชั่งในแอป →
            </Link>
          </div>

          <div className="lg:col-span-6">
            <div className="card-duo-3d bg-[#F7F7F7] text-center p-10">
              <div className="text-8xl mb-4">⚖️</div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#FFFFFF] border-2 border-[#58CC02] text-xs font-black text-[#58CC02] shadow-[0_2px_0_#46A302] mb-3">
                FEEDME SCALE HARDWARE
              </div>
              <h3 className="text-xl font-black text-[#4B4B4B]">ESP32 + HX711 Load Cell</h3>
              <p className="text-xs font-bold text-[#777777] mt-2 max-w-sm mx-auto">
                เฟิร์มแวร์ C++ / Arduino พัฒนาพร้อมใช้งานในโฟลเดอร์ <code>/Hardware</code> ของโปรเจกต์
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Call to Action Banner (Duolingo Style) ────────── */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="rounded-3xl bg-[#58CC02] border-b-8 border-[#46A302] p-10 sm:p-14 text-center text-white relative overflow-hidden shadow-lg">
          <div className="text-6xl mb-4">🦉</div>
          <h2 className="text-3xl sm:text-5xl font-black mb-4">
            พร้อมที่จะเปลี่ยนชีวิตการออกกำลังกายของคุณหรือยัง?
          </h2>
          <p className="text-base sm:text-lg font-bold text-[#E6FFD1] max-w-2xl mx-auto mb-8">
            เริ่มต้นใช้งานฟรีวันนี้ ไม่ต้องติดตั้งให้ยุ่งยาก ใช้งานผ่านเว็บแอปได้ทันทีบนทุกอุปกรณ์
          </p>

          <Link
            href={webAppUrl}
            className="inline-flex items-center gap-2 bg-[#FFFFFF] text-[#58CC02] border-b-4 border-[#D7D7D7] rounded-2xl px-10 py-4 font-black text-lg tracking-wide hover:bg-[#F7F7F7] transition-all"
          >
            เปิดใช้งานแอปพลิเคชัน FEEDME เลย 🚀
          </Link>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────── */}
      <footer className="bg-[#FFFFFF] border-t-2 border-[#E5E5E5] py-10 px-6 text-center text-xs font-bold text-[#777777]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🦉</span>
            <span className="font-extrabold text-[#58CC02]">FeedMe Ecosystem</span>
            <span>· All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/Khalidabdi1/design-ai" target="_blank" rel="noreferrer" className="hover:text-[#58CC02]">
              Duolingo Design Reference
            </a>
            <Link href={webAppUrl} className="hover:text-[#58CC02]">
              Launch Web App
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
