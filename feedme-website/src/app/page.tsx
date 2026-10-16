'use client';

import React, { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import PillarsBento from '@/components/PillarsBento';
import InteractiveDemo from '@/components/InteractiveDemo';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col font-sans selection:bg-[#58CC02]/30 selection:text-white">
      {/* ─── Sticky Promotional Navbar with Scroll Progress HUD ─── */}
      <header className="sticky top-0 z-50 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/10">
        {/* Scroll Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-transparent overflow-hidden">
          <div
            className="h-full bg-[#58CC02] transition-all duration-100 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Tag */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#58CC02] to-[#1CB0F6] flex items-center justify-center font-black text-white text-lg shadow-md shadow-[#58CC02]/20">
              ⚡
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg sm:text-xl tracking-tight text-white">
                FEEDME <span className="text-[#58CC02]">2.0</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#58CC02]/20 text-[#58CC02] border border-[#58CC02]/30">
                MOBILE GAMIFIED
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-[#58CC02] transition-colors">
              3 เสาหลัก
            </a>
            <a href="#demo" className="hover:text-[#58CC02] transition-colors">
              ทดลองคำนวณ
            </a>
            <a href="#compare" className="hover:text-[#58CC02] transition-colors">
              เปรียบเทียบ
            </a>
            <a href="#download" className="hover:text-[#58CC02] transition-colors">
              ดาวน์โหลด APK
            </a>
          </nav>

          {/* Quick CTA */}
          <div className="flex items-center gap-3">
            <a
              href="#download"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#58CC02] hover:bg-[#4EBA02] text-white text-xs font-black tracking-wide shadow-[0_2px_0_#3D8F00] active:shadow-none active:translate-y-0.5 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-1.0002 0-.5515.4482-1.0001.9993-1.0001.5516 0 .9997.4486.9997 1.0001 0 .5516-.4481 1.0002-.9997 1.0002m-11.046 0c-.5511 0-.9993-.4486-.9993-1.0002 0-.5515.4482-1.0001.9993-1.0001.5516 0 .9997.4486.9997 1.0001 0 .5516-.4481 1.0002-.9997 1.0002m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.411 13.856 8.125 12 8.125c-1.8561 0-3.5902.286-5.1368.8247L4.8409 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.7774h24c-.3432-4.1185-2.6889-7.5907-6.1185-9.456" />
              </svg>
              <span>ดาวน์โหลด APK</span>
            </a>
          </div>
        </div>
      </header>

      {/* ─── Hero Section with Phone Mockup ─── */}
      <main className="flex-1">
        <HeroSection />

        {/* ─── 3-Pillars Bento Grid ─── */}
        <PillarsBento />

        {/* ─── Interactive Net Calorie & XP Simulator ─── */}
        <InteractiveDemo />

        {/* ─── Comparison Section ─── */}
        <section id="compare" className="py-20 bg-[#0B1317] border-t border-white/5">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                ทำไมต้อง <span className="text-[#58CC02]">FeedMe 2.0</span>?
              </h2>
              <p className="text-slate-300 text-sm">
                ลืมแอปนับแคลที่กดดันและเต็มไปด้วยตัวเลขเครียดๆ ไปได้เลย
              </p>
            </ScrollReveal>

            <ScrollReveal staggerDelayMs={150} className="rounded-3xl overflow-hidden border-2 border-[#23353D] bg-[#121E24] shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Old Apps */}
                <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-[#23353D] bg-[#0E171C] space-y-4">
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                    <span className="text-red-400 text-lg">✕</span>
                    <span>แอปนับแคลและฟิตเนสแบบเดิมๆ</span>
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">−</span>
                      <span>ต้องค้นหาฐานข้อมูลทีละรายการ แล้วพิมพ์กรอกกรัมมืออย่างน่าเบื่อ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">−</span>
                      <span>ไม่เห็นภาพรวม Net Calories แยกกินกับออกกำลังกายคนละที่</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">−</span>
                      <span>ออกกำลังกายคนเดียว ว้าเหว่ ขาดแรงจูงใจ ทำได้ 3 วันก็เลิก</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">−</span>
                      <span>กินเกินแคลแล้วรู้สึกผิด โดนแอปดุ สร้างความเครียดให้ชีวิต</span>
                    </li>
                  </ul>
                </div>

                {/* FeedMe 2.0 */}
                <div className="p-6 sm:p-8 bg-gradient-to-br from-[#132B1E] via-[#0F2217] to-[#0A1710] space-y-4">
                  <div className="flex items-center gap-2 text-[#58CC02] font-black text-sm">
                    <span className="text-[#58CC02] text-lg">✓</span>
                    <span>FeedMe 2.0 Gamified Ecosystem</span>
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-200 font-medium">
                    <li className="flex items-start gap-2">
                      <span className="text-[#58CC02] font-black">✓</span>
                      <span>
                        <strong className="text-white">Smart Kitchen & BLE Scale:</strong> ถ่ายรูปแชะเดียวรู้แคล หรือชั่งลงชามรู้ผลทันที
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#58CC02] font-black">✓</span>
                      <span>
                        <strong className="text-white">Real-time Net Calories:</strong> กิน − เผาผลาญ (วิ่ง GPS + เวท) = โควต้าที่เหลือแม่นยำ
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#58CC02] font-black">✓</span>
                      <span>
                        <strong className="text-white">Duolingo Gamification:</strong> ลีกรายสัปดาห์, Streak Fire, และเควสช่วยเพื่อนตีบอส
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#58CC02] font-black">✓</span>
                      <span>
                        <strong className="text-white">Positive & Playful:</strong> กินเกินก็มีเควสเดินเล่นชิลๆ ชดเชยได้ ไม่ต้องกังวล
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ─── Download CTA Section ─── */}
        <section id="download" className="py-20 bg-gradient-to-b from-[#0F172A] to-[#070D18] relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <ScrollReveal className="space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                พร้อมเปลี่ยนการดูแลสุขภาพ <br />
                ให้เป็นเกมที่คุณรักแล้วหรือยัง?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
                ดาวน์โหลด FeedMe 2.0 สำหรับ Android ได้ทันทีในรูปแบบไฟล์ APK ติดตั้งง่าย ปลอดภัย และเริ่มเล่นได้เลย
              </p>
            </ScrollReveal>

            {/* Tactile Big Download Card */}
            <ScrollReveal staggerDelayMs={150} className="p-6 sm:p-8 rounded-3xl bg-[#14232B] border-2 border-[#58CC02]/50 max-w-lg mx-auto shadow-2xl space-y-5">
              <div className="flex items-center justify-between text-xs text-slate-300 font-bold border-b border-white/10 pb-3">
                <span className="flex items-center gap-1.5 text-white">
                  <span>📱</span> FeedMe Mobile Client
                </span>
                <span className="text-[#58CC02]">v2.0.0 (Native Flutter)</span>
              </div>

              {/* Download Button */}
              <a
                href="#download"
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#58CC02] hover:bg-[#4EBA02] text-white font-black text-base sm:text-lg tracking-wide shadow-[0_4px_0_#3D8F00] active:shadow-none active:translate-y-1 transition-all cursor-pointer"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-1.0002 0-.5515.4482-1.0001.9993-1.0001.5516 0 .9997.4486.9997 1.0001 0 .5516-.4481 1.0002-.9997 1.0002m-11.046 0c-.5511 0-.9993-.4486-.9993-1.0002 0-.5515.4482-1.0001.9993-1.0001.5516 0 .9997.4486.9997 1.0001 0 .5516-.4481 1.0002-.9997 1.0002m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.411 13.856 8.125 12 8.125c-1.8561 0-3.5902.286-5.1368.8247L4.8409 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.7774h24c-.3432-4.1185-2.6889-7.5907-6.1185-9.456" />
                </svg>
                <span>ดาวน์โหลดสำหรับ Android (APK)</span>
              </a>

              {/* 3-Step Horizontal Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-[#0D181F] border border-white/5 flex items-center gap-2 text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-[#58CC02]/20 text-[#58CC02] flex items-center justify-center font-black text-[10px]">
                    1
                  </span>
                  <span>ดาวน์โหลด APK</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0D181F] border border-white/5 flex items-center gap-2 text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-[#58CC02]/20 text-[#58CC02] flex items-center justify-center font-black text-[10px]">
                    2
                  </span>
                  <span>กดติดตั้งบนเครื่อง</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0D181F] border border-white/5 flex items-center gap-2 text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-[#58CC02]/20 text-[#58CC02] flex items-center justify-center font-black text-[10px]">
                    3
                  </span>
                  <span>เริ่มเล่นได้ทันที</span>
                </div>
              </div>
            </ScrollReveal>

            {/* iOS Coming Soon notice */}
            <div className="inline-flex items-center gap-2 text-xs text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.79 1.07-1.89.95-3-.98.04-2.19.67-2.88 1.48-.61.71-1.14 1.83-1 2.94 1.1.09 2.26-.59 2.93-1.42z" />
              </svg>
              <span>กำลังเตรียมเปิดให้ทดสอบบน Apple TestFlight & App Store เร็วๆ นี้</span>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="bg-[#080D15] border-t border-white/5 py-10 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-300">FEEDME 2.0</span>
            <span>· Gamified Fitness & Smart Nutrition Ecosystem</span>
          </div>
          <div>
            <span>© 2026 FeedMe. All rights reserved. Designed for health champions.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
