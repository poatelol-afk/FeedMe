'use client';

import React, { useState } from 'react';
import { ScrollReveal, useAnimatedNumber } from './ui/ScrollReveal';

interface MealOption {
  id: string;
  name: string;
  kcal: number;
  protein: number;
  xp: number;
  emoji: string;
  tag: string;
}

interface WorkoutOption {
  id: string;
  name: string;
  kcal: number;
  xp: number;
  emoji: string;
  tag: string;
}

const SAMPLE_MEALS: MealOption[] = [
  { id: 'krapao', name: 'ข้าวกะเพราอกไก่ไข่ดาว', kcal: 580, protein: 38, xp: 40, emoji: '🍛', tag: 'High Protein' },
  { id: 'chicken-rice', name: 'ข้าวมันไก่ตอนเนื้อน่อง', kcal: 650, protein: 28, xp: 35, emoji: '🍗', tag: 'Classic' },
  { id: 'salmon-salad', name: 'สลัดแซลมอนย่างอะโวคาโด', kcal: 420, protein: 32, xp: 50, emoji: '🥗', tag: 'Clean & Healthy' },
  { id: 'suki', name: 'สุกี้น้ำอกไก่หม้อรวม', kcal: 320, protein: 35, xp: 60, emoji: '🍲', tag: 'Low Calorie' },
  { id: 'boba', name: 'ชานมไข่มุกหวาน 25%', kcal: 310, protein: 2, xp: 10, emoji: '🧋', tag: 'Cheat Treat' },
];

const SAMPLE_WORKOUTS: WorkoutOption[] = [
  { id: 'run5k', name: 'วิ่ง Tempo GPS 5 กม.', kcal: 350, xp: 80, emoji: '🏃', tag: 'Cardio' },
  { id: 'run10k', name: 'วิ่ง City Run 10 กม.', kcal: 680, xp: 150, emoji: '👟', tag: 'Endurance' },
  { id: 'push-day', name: 'เวท Push Day (อก/ไหล่)', kcal: 280, xp: 90, emoji: '🏋️', tag: 'Hypertrophy' },
  { id: 'walk', name: 'เดินเร็วสวนสาธารณะ 30 นาที', kcal: 140, xp: 40, emoji: '🚶', tag: 'Active Walk' },
  { id: 'rest', name: 'พักผ่อน Active Recovery', kcal: 0, xp: 20, emoji: '🧘', tag: 'Rest Day' },
];

export default function InteractiveDemo() {
  const [selectedMeal, setSelectedMeal] = useState<MealOption>(SAMPLE_MEALS[0]);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutOption>(SAMPLE_WORKOUTS[0]);

  const targetDailyCalories = 2000;
  const netCalories = selectedMeal.kcal - selectedWorkout.kcal;
  const remainingQuota = targetDailyCalories - netCalories;
  const earnedXp = selectedMeal.xp + selectedWorkout.xp;

  // Smooth numerical count-up hooks (tabular numbers)
  const animMealKcal = useAnimatedNumber(selectedMeal.kcal);
  const animWorkoutKcal = useAnimatedNumber(selectedWorkout.kcal);
  const animNetKcal = useAnimatedNumber(netCalories);
  const animQuota = useAnimatedNumber(remainingQuota);
  const animXp = useAnimatedNumber(earnedXp);

  // Quota percentage for the gauge bar
  const consumedPct = Math.min(Math.round((selectedMeal.kcal / targetDailyCalories) * 100), 100);
  const burnedPct = Math.min(Math.round((selectedWorkout.kcal / targetDailyCalories) * 100), 100);

  return (
    <section id="demo" className="py-20 bg-[#0F172A] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#58CC02]/10 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            ลองคำนวณ <span className="text-[#58CC02]">Net Calories & XP</span>
          </h2>
          <p className="text-slate-300 text-sm font-medium">
            เลือกมื้ออาหารและกิจกรรม เพื่อดูแคลอรีสุทธิและแต้ม XP ทันที
          </p>
        </ScrollReveal>

        {/* Interactive Playground Container */}
        <ScrollReveal staggerDelayMs={150} className="rounded-3xl p-6 sm:p-8 bg-[#16222F] border-2 border-[#2A3E47] shadow-2xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Step 1: Pick a Meal */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#58CC02] text-white flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span>เลือกมื้ออาหาร</span>
                </span>
                <span className="text-xs text-[#58CC02] font-black tabular-nums">+{selectedMeal.kcal} kcal</span>
              </div>

              <div className="space-y-2">
                {SAMPLE_MEALS.map(meal => {
                  const isSelected = selectedMeal.id === meal.id;
                  return (
                    <button
                      key={meal.id}
                      onClick={() => setSelectedMeal(meal)}
                      className={`w-full text-left p-3 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#1E3326] border-[#58CC02] shadow-[0_2px_0_#46A302] translate-y-[-2px]'
                          : 'bg-[#121D24] border-white/5 hover:border-white/20 active:translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{meal.emoji}</span>
                        <div>
                          <div className="text-sm font-bold text-white">{meal.name}</div>
                          <div className="text-xs text-slate-400">
                            โปรตีน {meal.protein}g · <span className="text-slate-500">{meal.tag}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-white tabular-nums">+{meal.kcal} kcal</div>
                        <div className="text-[10px] font-bold text-[#FFC800]">+{meal.xp} XP</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Pick a Workout */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FF9600] text-white flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span>เลือกกิจกรรม</span>
                </span>
                <span className="text-xs text-[#FF9600] font-black tabular-nums">
                  {selectedWorkout.kcal > 0 ? `-${selectedWorkout.kcal}` : '0'} kcal
                </span>
              </div>

              <div className="space-y-2">
                {SAMPLE_WORKOUTS.map(workout => {
                  const isSelected = selectedWorkout.id === workout.id;
                  return (
                    <button
                      key={workout.id}
                      onClick={() => setSelectedWorkout(workout)}
                      className={`w-full text-left p-3 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#332414] border-[#FF9600] shadow-[0_2px_0_#CC7800] translate-y-[-2px]'
                          : 'bg-[#121D24] border-white/5 hover:border-white/20 active:translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{workout.emoji}</span>
                        <div>
                          <div className="text-sm font-bold text-white">{workout.name}</div>
                          <div className="text-xs text-slate-400">{workout.tag}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-[#FF9600] tabular-nums">
                          {workout.kcal > 0 ? `-${workout.kcal}` : '0'} kcal
                        </div>
                        <div className="text-[10px] font-bold text-[#FFC800]">+{workout.xp} XP</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Real-time Calculation Result Bar with Smooth Count-Up Numbers */}
          <div className="p-6 rounded-2xl bg-[#111A20] border-2 border-[#58CC02]/40 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-xl bg-[#0F171C]">
                <div className="text-xs text-slate-400 font-bold">กินเข้าไป (Food)</div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1 tabular-nums">+{animMealKcal}</div>
                <div className="text-[10px] text-slate-500">kcal</div>
              </div>

              <div className="p-3 rounded-xl bg-[#0F171C]">
                <div className="text-xs text-slate-400 font-bold">เผาผลาญ (Burn)</div>
                <div className="text-xl sm:text-2xl font-black text-[#FF9600] mt-1 tabular-nums">
                  -{animWorkoutKcal}
                </div>
                <div className="text-[10px] text-slate-500">kcal</div>
              </div>

              <div className="p-3 rounded-xl bg-[#0F171C] border border-[#58CC02]/30">
                <div className="text-xs text-[#58CC02] font-black">สุทธิ (Net Calories)</div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1 tabular-nums">
                  {animNetKcal > 0 ? `+${animNetKcal}` : animNetKcal}
                </div>
                <div className="text-[10px] text-slate-500">kcal</div>
              </div>

              <div className="p-3 rounded-xl bg-[#0F171C] border border-[#FFC800]/30">
                <div className="text-xs text-[#FFC800] font-black">XP ที่ได้รับรวม</div>
                <div className="text-xl sm:text-2xl font-black text-[#FFC800] mt-1 tabular-nums">
                  +{animXp}
                </div>
                <div className="text-[10px] text-slate-500">XP เข้าลีก</div>
              </div>
            </div>

            {/* Visual Dynamic Net Calorie Quota Gauge Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-400">
                  สัดส่วนพลังงาน (เทียบเป้าหมาย {targetDailyCalories} kcal):
                </span>
                <span className="text-[#58CC02] tabular-nums">
                  สุทธิ {animNetKcal} kcal ({Math.round((animNetKcal / targetDailyCalories) * 100)}%)
                </span>
              </div>
              <div className="w-full h-3 bg-[#0B1317] rounded-full overflow-hidden flex p-0.5 border border-white/5">
                <div
                  className="h-full bg-[#58CC02] rounded-full transition-all duration-500"
                  style={{ width: `${consumedPct}%` }}
                  title={`กินเข้าไป: ${consumedPct}%`}
                />
                <div
                  className="h-full bg-[#FF9600] rounded-full transition-all duration-500 ml-1 opacity-80"
                  style={{ width: `${burnedPct}%` }}
                  title={`เผาผลาญ: ${burnedPct}%`}
                />
              </div>
            </div>

            {/* Bottom Status Verdict */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-300 flex items-center gap-2">
                <span className="text-lg">⚖️</span>
                <span>
                  เหลือโควต้าวันนี้:{' '}
                  <strong className={`tabular-nums ${remainingQuota >= 0 ? 'text-[#58CC02]' : 'text-[#EF4444]'}`}>
                    {animQuota} kcal
                  </strong>
                </span>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-[#58CC02]/20 border border-[#58CC02]/40 text-[#58CC02] font-black">
                ✨ บาลานซ์สมบูรณ์แบบ ได้สุขภาพ + ได้คะแนน!
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
