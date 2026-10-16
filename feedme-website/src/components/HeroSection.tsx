'use client';

import React from 'react';
import PhoneMockup from './PhoneMockup';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#58CC02]/15 via-[#1CB0F6]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & Tactile CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Playful Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A282F] border border-[#58CC02]/30 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#58CC02] animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-[#58CC02]">
                ⚡ FEEDME 2.0 GAMIFIED ECOSYSTEM
              </span>
            </div>

            {/* Thai Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
              เปลี่ยนการคุมอาหารและออกกำลังกาย{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58CC02] via-[#1CB0F6] to-[#FF9600]">
                ให้เป็นเกมที่สนุกที่สุด
              </span>
            </h1>

            {/* High-energy Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              รวมความสนุกของ <span className="text-[#58CC02] font-bold">Duolingo</span> (รักษาสถิติ Streak & ลีกรายสัปดาห์) +{' '}
              <span className="text-[#FF9600] font-bold">Strava</span> (วิ่ง GPS & เวทเทรนนิ่ง Progressive Overload) +{' '}
              <span className="text-[#1CB0F6] font-bold">Smart Kitchen & ตาชั่ง BLE</span> คำนวณสมดุลแคลอรีสุทธิ (Net Calories) ให้เห็นแบบเรียลไทม์
            </p>

            {/* 3D Tactile Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              {/* Android APK Download 3D Button */}
              <a
                href="#download"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#58CC02] hover:bg-[#4EBA02] text-white font-black text-base tracking-wide border-b-4 border-[#3D8F00] active:border-b-0 active:translate-y-1 shadow-[0_12px_24px_-6px_rgba(88,204,2,0.35)] transition-all cursor-pointer"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-1.0002 0-.5515.4482-1.0001.9993-1.0001.5516 0 .9997.4486.9997 1.0001 0 .5516-.4481 1.0002-.9997 1.0002m-11.046 0c-.5511 0-.9993-.4486-.9993-1.0002 0-.5515.4482-1.0001.9993-1.0001.5516 0 .9997.4486.9997 1.0001 0 .5516-.4481 1.0002-.9997 1.0002m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.411 13.856 8.125 12 8.125c-1.8561 0-3.5902.286-5.1368.8247L4.8409 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.7774h24c-.3432-4.1185-2.6889-7.5907-6.1185-9.456" />
                </svg>
                <span>ดาวน์โหลดสำหรับ Android (APK)</span>
              </a>

              {/* iOS Coming Soon Button */}
              <div className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#1E293B] hover:bg-[#28384E] text-slate-200 font-bold text-sm tracking-wide border-b-4 border-[#0F172A] active:border-b-0 active:translate-y-1 shadow-md transition-all cursor-default">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.79 1.07-1.89.95-3-.98.04-2.19.67-2.88 1.48-.61.71-1.14 1.83-1 2.94 1.1.09 2.26-.59 2.93-1.42z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase text-slate-400 font-medium">Coming Soon</div>
                  <div className="leading-tight font-black">App Store (iOS)</div>
                </div>
              </div>
            </div>

            {/* Social Proof & Metrics Badges */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-black text-white">4.9 / 5.0</div>
                <div className="text-xs text-slate-400">เรตติ้งจากคอมมูนิตี้</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-black text-[#58CC02]">10,000+</div>
                <div className="text-xs text-slate-400">ภารกิจสำเร็จต่อสัปดาห์</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-black text-[#1CB0F6]">0 Config</div>
                <div className="text-xs text-slate-400">เล่นได้ทันทีไม่ต้องมีคีย์</div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Phone Preview */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Floating Tactile Badges around Phone */}
            <div className="hidden sm:flex absolute -left-6 top-16 z-30 items-center gap-2 px-3 py-2 rounded-2xl bg-[#1E293B] border-2 border-[#58CC02] shadow-xl text-white text-xs font-black animate-bounce duration-1000">
              <span className="text-base">⚡</span>
              <span>+120 XP Net Calorie Met!</span>
            </div>

            <div className="hidden sm:flex absolute -right-6 bottom-24 z-30 items-center gap-2 px-3 py-2 rounded-2xl bg-[#1E293B] border-2 border-[#1CB0F6] shadow-xl text-white text-xs font-black">
              <span className="text-base">⚖️</span>
              <span>ตาชั่ง BLE เชื่อมต่ออัตโนมัติ</span>
            </div>

            {/* Phone Screen Component */}
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
