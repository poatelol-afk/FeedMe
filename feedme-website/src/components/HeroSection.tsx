'use client';

import React, { useState } from 'react';
import PhoneMockup, { PhoneTabKey } from './PhoneMockup';
import SpatialCanvas from './ui/SpatialCanvas';
import { ScrollReveal, TiltCard3D } from './ui/ScrollReveal';

export default function HeroSection() {
  const [phoneTab, setPhoneTab] = useState<PhoneTabKey>('home');

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 perspective-stage">
      {/* 60fps Interactive 3D Canvas Energy Grid Background */}
      <SpatialCanvas />

      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-[#58CC02]/15 via-[#1CB0F6]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & Tactile CTAs */}
          <ScrollReveal className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Direct Headline (Solid high-contrast lettering) */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
              เปลี่ยนการคุมอาหารและออกกำลังกาย{' '}
              <span className="text-[#58CC02]">
                ให้เป็นเกมที่สนุกที่สุด
              </span>
            </h1>

            {/* High-energy Distilled Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              ผสานลีก <span className="text-[#58CC02] font-bold">Duolingo</span> + วิ่งและเวทสไตล์{' '}
              <span className="text-[#FF9600] font-bold">Strava</span> + ตาชั่งครัว IoT คำนวณ Net Calories เรียลไทม์แบบไม่กดดัน
            </p>

            {/* 3D Tactile Buttons (Layered shadow with physical active translation) */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              {/* Android APK Download 3D Button */}
              <a
                href="#download"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl btn-3d-green font-black text-base tracking-wide cursor-pointer"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-1.0002 0-.5515.4482-1.0001.9993-1.0001.5516 0 .9997.4486.9997 1.0001 0 .5516-.4481 1.0002-.9997 1.0002m-11.046 0c-.5511 0-.9993-.4486-.9993-1.0002 0-.5515.4482-1.0001.9993-1.0001.5516 0 .9997.4486.9997 1.0001 0 .5516-.4481 1.0002-.9997 1.0002m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.411 13.856 8.125 12 8.125c-1.8561 0-3.5902.286-5.1368.8247L4.8409 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.7774h24c-.3432-4.1185-2.6889-7.5907-6.1185-9.456" />
                </svg>
                <span>ดาวน์โหลดสำหรับ Android (APK)</span>
              </a>

              {/* iOS Coming Soon Button */}
              <div className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl btn-3d-slate font-bold text-sm tracking-wide cursor-default">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.79 1.07-1.89.95-3-.98.04-2.19.67-2.88 1.48-.61.71-1.14 1.83-1 2.94 1.1.09 2.26-.59 2.93-1.42z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase text-slate-400 font-medium">Coming Soon</div>
                  <div className="leading-tight font-black">App Store (iOS)</div>
                </div>
              </div>
            </div>

            {/* 3D Stat Counters with TiltCard3D */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
              <TiltCard3D maxTiltDeg={6} className="p-3 rounded-2xl bg-[#16222F]/80 border border-white/10 text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-black text-white">4.9 / 5.0</div>
                <div className="text-xs text-slate-400 mt-0.5">เรตติ้งจากคอมมูนิตี้</div>
              </TiltCard3D>
              <TiltCard3D maxTiltDeg={6} className="p-3 rounded-2xl bg-[#16222F]/80 border border-white/10 text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-black text-[#58CC02]">10,000+</div>
                <div className="text-xs text-slate-400 mt-0.5">ภารกิจสำเร็จ/สัปดาห์</div>
              </TiltCard3D>
              <TiltCard3D maxTiltDeg={6} className="p-3 rounded-2xl bg-[#16222F]/80 border border-white/10 text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-black text-[#1CB0F6]">0 Config</div>
                <div className="text-xs text-slate-400 mt-0.5">เล่นได้ทันทีไม่ต้องมีคีย์</div>
              </TiltCard3D>
            </div>
          </ScrollReveal>

          {/* Right Column: 3D Interactive Phone Preview */}
          <ScrollReveal staggerDelayMs={150} className="lg:col-span-5 relative flex justify-center preserve-3d">
            {/* Floating Tactile Badges directly switching phone tabs */}
            <button
              type="button"
              onClick={() => setPhoneTab('home')}
              className={`hidden sm:flex absolute -left-6 top-14 z-30 items-center gap-2 px-3.5 py-2 rounded-2xl border transition-all text-xs font-black cursor-pointer shadow-xl ${
                phoneTab === 'home'
                  ? 'bg-[#1E3326] border-[#58CC02] text-white scale-105'
                  : 'bg-[#1E293B] border-[#58CC02]/40 text-slate-200 hover:scale-105'
              }`}
            >
              <span className="text-base">⚡</span>
              <span>+120 XP Net Calorie Met!</span>
            </button>

            <button
              type="button"
              onClick={() => setPhoneTab('kitchen')}
              className={`hidden sm:flex absolute -right-6 bottom-24 z-30 items-center gap-2 px-3.5 py-2 rounded-2xl border transition-all text-xs font-black cursor-pointer shadow-xl ${
                phoneTab === 'kitchen'
                  ? 'bg-[#152B38] border-[#1CB0F6] text-white scale-105'
                  : 'bg-[#1E293B] border-[#1CB0F6]/40 text-slate-200 hover:scale-105'
              }`}
            >
              <span className="text-base">⚖️</span>
              <span>ตาชั่ง BLE เชื่อมต่ออัตโนมัติ</span>
            </button>

            <button
              type="button"
              onClick={() => setPhoneTab('workout')}
              className={`hidden sm:flex absolute -left-4 bottom-12 z-30 items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all text-[11px] font-black cursor-pointer shadow-xl ${
                phoneTab === 'workout'
                  ? 'bg-[#332414] border-[#FF9600] text-white scale-105'
                  : 'bg-[#1E293B] border-[#FF9600]/40 text-slate-200 hover:scale-105'
              }`}
            >
              <span className="text-sm">🏃</span>
              <span>GPS Pace 5:18</span>
            </button>

            {/* Phone Screen Component wired to external tab control */}
            <PhoneMockup externalTab={phoneTab} onTabChange={setPhoneTab} />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
