'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [scaleSimWeight, setScaleSimWeight] = useState(240);
  const webAppUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8081';

  return (
    <div className="min-h-screen bg-[#111110] text-[#F5F0E8] font-sans selection:bg-[#8FB89A]/20 selection:text-[#F5F0E8]">
      {/* ─── Top Navigation ───────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#111110]/80 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🥗</span>
            <span className="font-semibold tracking-tight text-lg">FeedMe</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#8FB89A]/10 text-[#8FB89A] border border-[#8FB89A]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8FB89A] animate-pulse" />
              Ecosystem Live
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#9E9890]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#hardware" className="hover:text-white transition-colors">IoT Scale</a>
            <a href="#workout" className="hover:text-white transition-colors">AI Workout</a>
            <a href="#philosophy" className="hover:text-white transition-colors">Philosophy</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={webAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#8FB89A] text-[#0f1a10] hover:bg-[#a1cca9] transition-all shadow-[0_0_20px_rgba(143,184,154,0.2)]"
            >
              Launch Web App
              <span className="text-[10px]">↗</span>
            </a>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ─────────────────────────────────── */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#8FB89A]/[0.04] blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-[#9E9890] mb-6">
              <span>⚡</span>
              <span>All-in-One AI & IoT Health Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-light tracking-tight leading-[1.15] mb-6">
              Eat Well. Move More.{' '}
              <span className="block font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#8FB89A] via-[#C9A96E] to-[#7EB8D4]">
                Backed by Data, Driven by Habit.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#9E9890] font-light leading-relaxed mb-10 max-w-2xl mx-auto">
              เปลี่ยนการดูแลสุขภาพและออกกำลังกายให้เป็นระบบอัตโนมัติ ด้วยการผสานตาชั่งอาหารอัจฉริยะ ESP32,
              AI สแกนจานอาหาร และระบบโค้ชเวทเทรนนิ่ง Progressive Overload ในระบบเดียว
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a
                href={webAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-medium text-sm bg-[#8FB89A] text-[#0f1a10] hover:bg-[#a1cca9] transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>เปิดใช้งาน Web App (Expo Web)</span>
                <span>→</span>
              </a>

              <a
                href="#features"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-medium text-sm bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white transition-all text-center"
              >
                สำรวจฟีเจอร์ทั้งหมด
              </a>
            </div>
          </div>

          {/* ─── Hero Product Mockup Card ─────────────────── */}
          <div className="relative max-w-4xl mx-auto rounded-2xl p-1 bg-gradient-to-b from-white/[0.12] to-transparent shadow-2xl">
            <div className="rounded-[15px] bg-[#1A1917] p-6 sm:p-8 border border-white/[0.06]">
              {/* Mockup Header */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#221F1C] border border-white/[0.08] flex items-center justify-center text-lg">
                    🥗
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">FeedMe Live Dashboard Preview</p>
                    <p className="text-xs text-[#9E9890]">Real-time Net Calorie & IoT Scale Ingestion</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#8FB89A]/10 text-[#8FB89A] border border-[#8FB89A]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8FB89A]" />
                    Scale Connected
                  </span>
                </div>
              </div>

              {/* Mockup Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Net Energy Ring */}
                <div className="p-5 rounded-xl bg-[#221F1C] border border-white/[0.04] flex flex-col justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-[#9E9890] font-medium">
                    Net Energy Balance
                  </span>
                  <div className="my-4 text-center">
                    <p className="text-4xl font-light tracking-tight text-white">1,420</p>
                    <p className="text-xs text-[#9E9890] mt-1">kcal remaining</p>
                  </div>
                  <div className="text-xs text-[#9E9890] flex justify-between border-t border-white/[0.06] pt-3">
                    <span>In: 1,850 kcal</span>
                    <span className="text-[#8FB89A]">Burned: -430 kcal</span>
                  </div>
                </div>

                {/* 2. Interactive IoT Scale Telemetry */}
                <div className="p-5 rounded-xl bg-[#221F1C] border border-white/[0.04] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-[#9E9890] font-medium">
                      ESP32 Smart Scale
                    </span>
                    <span className="text-xs">⚖️</span>
                  </div>
                  <div className="my-4 text-center">
                    <p className="text-4xl font-light tracking-tight text-[#8FB89A]">
                      {scaleSimWeight} <span className="text-sm font-normal text-[#9E9890]">g</span>
                    </p>
                    <p className="text-xs text-[#9E9890] mt-1">BLE GATT Reading (Stable)</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 border-t border-white/[0.06] pt-3">
                    <button
                      onClick={() => setScaleSimWeight(150)}
                      className="text-[10px] px-2 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-[#9E9890]"
                    >
                      150g (Rice)
                    </button>
                    <button
                      onClick={() => setScaleSimWeight(240)}
                      className="text-[10px] px-2 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-[#9E9890]"
                    >
                      240g (Chicken)
                    </button>
                  </div>
                </div>

                {/* 3. AI Progressive Overload */}
                <div className="p-5 rounded-xl bg-[#221F1C] border border-white/[0.04] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-[#9E9890] font-medium">
                      AI Workout Coach
                    </span>
                    <span className="text-xs">🏋️</span>
                  </div>
                  <div className="my-3">
                    <p className="text-xs font-medium text-white mb-1">Incline DB Press</p>
                    <p className="text-xs text-[#8FB89A] leading-relaxed">
                      +2.5 kg แนะนำในรอบถัดไป (RPE 8.0 ผ่านเกณฑ์)
                    </p>
                  </div>
                  <div className="text-xs text-[#9E9890] border-t border-white/[0.06] pt-3 flex justify-between">
                    <span>3 Sets · 10 Reps</span>
                    <span className="text-[#C9A96E]">+45 Coins</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3 Core Pillars Section ───────────────────────── */}
      <section id="features" className="py-24 border-t border-white/[0.06] bg-[#141312]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#8FB89A] mb-3">
              The 3 Pillars of FeedMe
            </h2>
            <h3 className="text-3xl sm:text-4xl font-light tracking-tight text-white">
              สร้างระบบสุขภาพที่ไร้แรงต้าน
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="p-8 rounded-2xl bg-[#1A1917] border border-white/[0.06] hover:border-[#8FB89A]/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#221F1C] border border-white/[0.08] flex items-center justify-center text-2xl mb-6">
                ⚖️
              </div>
              <h4 className="text-lg font-medium text-white mb-3">
                1. Smart Food Scale IoT
              </h4>
              <p className="text-sm text-[#9E9890] leading-relaxed mb-4">
                ชั่งอาหารบนจานด้วยตาชั่ง ESP32 แล้วกด SEND น้ำหนักจะถูกส่งผ่าน Bluetooth Low Energy (BLE)
                ตรงเข้าสู่แอปทันที โดยไม่ต้องพิมพ์ตัวเลขเองแม้แต่น้อย
              </p>
              <ul className="text-xs text-[#9E9890] space-y-2">
                <li className="flex items-center gap-2">✓ HX711 Load Cell ความแม่นยำสูง</li>
                <li className="flex items-center gap-2">✓ ปุ่ม Tare หักน้ำหนักจานอัตโนมัติ</li>
                <li className="flex items-center gap-2">✓ รองรับทั้ง BLE GATT และ Wi-Fi Fallback</li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 rounded-2xl bg-[#1A1917] border border-white/[0.06] hover:border-[#8FB89A]/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#221F1C] border border-white/[0.08] flex items-center justify-center text-2xl mb-6">
                📸
              </div>
              <h4 className="text-lg font-medium text-white mb-3">
                2. Multimodal AI Meal Scanner
              </h4>
              <p className="text-sm text-[#9E9890] leading-relaxed mb-4">
                ถ่ายรูปอาหารไทยหรืออาหารจานโปรด ระบบ AI Computer Vision จะวิเคราะห์ส่วนประกอบ
                คำนวณปริมาณแคลอรี และแยกสัดส่วนโปรตีน คาร์โบไฮเดรต ไขมันให้อัตโนมัติ
              </p>
              <ul className="text-xs text-[#9E9890] space-y-2">
                <li className="flex items-center gap-2">✓ รู้จักอาหารไทย เช่น ข้าวมันไก่ กะเพราไข่ดาว</li>
                <li className="flex items-center gap-2">✓ ผสานค่าน้ำหนักจริงจากตาชั่ง IoT</li>
                <li className="flex items-center gap-2">✓ มีฐานข้อมูล USDA 1 ล้าน+ รายการ</li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 rounded-2xl bg-[#1A1917] border border-white/[0.06] hover:border-[#8FB89A]/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#221F1C] border border-white/[0.08] flex items-center justify-center text-2xl mb-6">
                🧠
              </div>
              <h4 className="text-lg font-medium text-white mb-3">
                3. AI Progressive Overload Coach
              </h4>
              <p className="text-sm text-[#9E9890] leading-relaxed mb-4">
                ออกแบบตามแนวคิดในคลิป &quot;AI เปลี่ยนชีวิตการออกกำลังกายของผม&quot; บันทึกเซ็ต น้ำหนัก Reps
                และ RPE เพื่อให้ AI แนะนำการเพิ่มน้ำหนักในรอบถัดไปอย่างมีหลักการ
              </p>
              <ul className="text-xs text-[#9E9890] space-y-2">
                <li className="flex items-center gap-2">✓ คำนวณ Volume Load ต่อเนื่อง</li>
                <li className="flex items-center gap-2">✓ แนะนำ +2.5kg / +5kg เมื่อ RPE ≤ 8</li>
                <li className="flex items-center gap-2">✓ ป้องกัน Overtraining และหมดแรงเกินจำเป็น</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Philosophy Section ───────────────────────────── */}
      <section id="philosophy" className="py-24 border-t border-white/[0.06] relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A96E] mb-3 block">
            The Philosophy
          </span>
          <h3 className="text-3xl sm:text-5xl font-light tracking-tight text-white mb-8">
            &ldquo;System Over Willpower&rdquo;
          </h3>
          <p className="text-base sm:text-lg text-[#9E9890] font-light leading-relaxed mb-8">
            พลังใจ (Willpower) เป็นทรัพยากรที่มีจำกัดและหมดลงได้เสมอเมื่อเหนื่อยล้า แต่ **ระบบที่ดี (System)**
            และการเปลี่ยนกิจวัตรให้เป็นเกมที่มี Instant Feedback Loop จะทำให้คุณรักษาวินัยได้อย่างยั่งยืน
            โดยไม่ต้องฝืนใจสู้ทุกวัน
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/[0.06]">
            <div>
              <p className="text-2xl font-light text-[#C9A96E] mb-1">Instant Loop</p>
              <p className="text-xs text-[#9E9890]">สมองได้รางวัลทันทีผ่าน Energy Coins &amp; Streaks</p>
            </div>
            <div>
              <p className="text-2xl font-light text-[#8FB89A] mb-1">Zero Friction</p>
              <p className="text-xs text-[#9E9890]">ตาชั่งกดส่งค่าน้ำหนักได้ใน 1 วินาที ไม่ต้องพิมพ์</p>
            </div>
            <div>
              <p className="text-2xl font-light text-[#7EB8D4] mb-1">True Net Cals</p>
              <p className="text-xs text-[#9E9890]">แคลอรีที่กินหักลบด้วยการออกกำลังกายจริงตามหลัก MET</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────────── */}
      <section className="py-20 border-t border-white/[0.06] bg-gradient-to-b from-[#141312] to-[#111110]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl sm:text-4xl font-light text-white mb-4">
            พร้อมสัมผัสประสบการณ์ใหม่ในการดูแลตัวเองหรือยัง?
          </h3>
          <p className="text-sm text-[#9E9890] mb-8">
            เข้าใช้งาน Web App บนเบราว์เซอร์ของคุณ หรือรันคู่กับตาชั่ง ESP32 ได้ทันที
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={webAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl font-semibold text-sm bg-[#8FB89A] text-[#0f1a10] hover:bg-[#a1cca9] transition-all shadow-xl"
            >
              เปิดใช้งาน Web App (http://localhost:8081) →
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────── */}
      <footer className="py-12 border-t border-white/[0.06] text-xs text-[#5C5850]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>🥗 FeedMe Project</span>
            <span>·</span>
            <span>Next.js 16 + Expo SDK 54 + ESP32 IoT</span>
          </div>

          <div className="flex items-center gap-6 text-[#9E9890]">
            <a href="file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/FeedMe.md" className="hover:text-white">Spec</a>
            <a href="file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/ARCHITECTURE.md" className="hover:text-white">Architecture</a>
            <a href="file:///c:/Users/poate/OneDrive/เอกสาร/FeedMe/PRE_LAUNCH_CHECKLIST.md" className="hover:text-white">Checklist</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
