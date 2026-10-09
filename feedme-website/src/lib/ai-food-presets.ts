// =================================================================
//  FeedMe — AI Food Recognition Presets & Engine
//  Simulates Gemini / GPT-4o Vision Food Analysis Pipeline
// =================================================================

import { AIScanResult } from '@/types';

export const POPULAR_AI_FOOD_PRESETS: AIScanResult[] = [
  {
    foodName: 'Hainanese Chicken Rice (ข้าวมันไก่)',
    emoji: '🍗',
    confidence: 0.98,
    weight: 350,
    kcal: 595,
    protein: 28.5,
    carbs: 68.0,
    fat: 22.0,
    ingredients: ['Steamed chicken breast/thigh (150g)', 'Jasmine seasoned rice (180g)', 'Cucumber slices (20g)', 'Ginger-chili soybean dipping sauce'],
    tips: 'High protein meal. To reduce calories, request skinless chicken breast and less oily rice.',
  },
  {
    foodName: 'Pad Kra Pao with Fried Egg (ผัดกะเพราหมูสับไข่ดาว)',
    emoji: '🍳',
    confidence: 0.96,
    weight: 380,
    kcal: 640,
    protein: 31.0,
    carbs: 62.0,
    fat: 28.0,
    ingredients: ['Minced lean pork (120g)', 'Crispy fried egg (1 pc)', 'Holy basil & garlic chili (30g)', 'Cooked white rice (200g)'],
    tips: 'Iconic Thai staple. High in protein. The fried egg adds 120 kcal from cooking oil.',
  },
  {
    foodName: 'Grilled Salmon Avocado Bowl (สลัดแซลมอนโบวล์)',
    emoji: '🥑',
    confidence: 0.99,
    weight: 320,
    kcal: 480,
    protein: 34.0,
    carbs: 22.0,
    fat: 26.5,
    ingredients: ['Norwegian grilled salmon fillet (140g)', 'Ripe avocado halves (60g)', 'Mixed baby greens & edamame (90g)', 'Sesame soy dressing (30g)'],
    tips: 'Superfood packed with Omega-3 healthy fatty acids and antioxidants.',
  },
  {
    foodName: 'Chicken Breast & Steamed Broccoli (อกไก่อบ บรอกโคลี)',
    emoji: '🥦',
    confidence: 0.97,
    weight: 300,
    kcal: 290,
    protein: 42.0,
    carbs: 12.0,
    fat: 5.5,
    ingredients: ['Herb-crusted roasted chicken breast (180g)', 'Steamed fresh broccoli florets (100g)', 'Extra virgin olive oil mist (5g)'],
    tips: 'The ultimate clean fitness meal. Extremely high protein ratio with low fat and carbs.',
  },
  {
    foodName: 'Beef Steak with Roasted Asparagus (สเต็กเนื้อริบอาย)',
    emoji: '🥩',
    confidence: 0.95,
    weight: 320,
    kcal: 540,
    protein: 44.0,
    carbs: 8.0,
    fat: 36.0,
    ingredients: ['Grass-fed ribeye steak (220g)', 'Pan-seared asparagus (80g)', 'Garlic herb butter (20g)'],
    tips: 'Rich in bioavailable heme iron, zinc, and muscle-building creatine.',
  },
  {
    foodName: 'Greek Yogurt Oatmeal Bowl (ข้าวโอ๊ตโยเกิร์ตผลไม้)',
    emoji: '🥣',
    confidence: 0.96,
    weight: 280,
    kcal: 320,
    protein: 18.0,
    carbs: 48.0,
    fat: 6.0,
    ingredients: ['Rolled oats cooked in water (120g)', 'Plain non-fat Greek yogurt (80g)', 'Fresh blueberries & sliced banana (60g)', 'Organic chia seeds (10g)'],
    tips: 'Slow-digesting complex carbs and gut-healthy probiotics for breakfast.',
  },
];

/**
 * วิเคราะห์รูปภาพ (หรือชื่อไฟล์) แล้วตรวจจับรายการอาหารพร้อมค่าโภชนาการ
 */
export async function analyzeFoodImage(fileNameOrHint?: string): Promise<AIScanResult> {
  // Simulate AI Vision network latency
  await new Promise(r => setTimeout(r, 1200));

  if (fileNameOrHint) {
    const lower = fileNameOrHint.toLowerCase();
    const match = POPULAR_AI_FOOD_PRESETS.find(p =>
      lower.includes(p.foodName.toLowerCase()) ||
      lower.includes(p.emoji) ||
      p.ingredients.some(ing => lower.includes(ing.toLowerCase()))
    );
    if (match) return match;
  }

  // Random preset or default to first
  const randomIndex = Math.floor(Math.random() * POPULAR_AI_FOOD_PRESETS.length);
  return POPULAR_AI_FOOD_PRESETS[randomIndex];
}
