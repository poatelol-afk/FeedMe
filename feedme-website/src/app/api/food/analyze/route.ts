import { NextResponse } from 'next/server';
import { POPULAR_AI_FOOD_PRESETS, analyzeFoodImage } from '@/lib/ai-food-presets';
import type { AIScanResult } from '@/types';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

interface AnalyzeRequestBody {
  imageBase64?: string;
  mimeType?: string;
  fileName?: string;
  dishHint?: string;
}

function estimateBase64Bytes(base64: string): number {
  const cleaned = base64.replace(/^data:[^;]+;base64,/, '').trim();
  return Math.floor((cleaned.length * 3) / 4);
}

function stripDataUrlPrefix(base64: string): string {
  return base64.replace(/^data:[^;]+;base64,/, '').trim();
}

function normalizeAiResult(raw: Record<string, unknown>, fallback: AIScanResult): AIScanResult {
  const foodName = typeof raw.foodName === 'string' && raw.foodName.trim() ? raw.foodName.trim() : fallback.foodName;
  const emoji = typeof raw.emoji === 'string' && raw.emoji.trim() ? raw.emoji.trim() : fallback.emoji;
  const confidence = typeof raw.confidence === 'number' && raw.confidence > 0 && raw.confidence <= 1
    ? raw.confidence
    : 0.94;
  const weight = typeof raw.weight === 'number' && raw.weight > 0 ? Math.round(raw.weight) : fallback.weight;
  const kcal = typeof raw.kcal === 'number' && raw.kcal >= 0 ? Math.round(raw.kcal) : fallback.kcal;
  const protein = typeof raw.protein === 'number' && raw.protein >= 0 ? +(raw.protein).toFixed(1) : fallback.protein;
  const carbs = typeof raw.carbs === 'number' && raw.carbs >= 0 ? +(raw.carbs).toFixed(1) : fallback.carbs;
  const fat = typeof raw.fat === 'number' && raw.fat >= 0 ? +(raw.fat).toFixed(1) : fallback.fat;
  const ingredients = Array.isArray(raw.ingredients)
    ? raw.ingredients.filter((i): i is string => typeof i === 'string' && i.trim().length > 0).slice(0, 6)
    : fallback.ingredients;
  const tips = typeof raw.tips === 'string' && raw.tips.trim() ? raw.tips.trim() : fallback.tips;

  return {
    foodName,
    emoji,
    confidence,
    weight,
    kcal,
    protein,
    carbs,
    fat,
    ingredients: ingredients.length > 0 ? ingredients : fallback.ingredients,
    tips,
  };
}

export async function POST(request: Request) {
  let body: AnalyzeRequestBody;
  try {
    body = (await request.json()) as AnalyzeRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }

  const { imageBase64, mimeType, fileName, dishHint } = body;

  if (mimeType && !ALLOWED_MIME_TYPES.has(mimeType.toLowerCase())) {
    return NextResponse.json(
      { error: 'Unsupported image MIME type. Please upload JPEG, PNG, or WEBP.' },
      { status: 400 }
    );
  }

  if (imageBase64) {
    const byteSize = estimateBase64Bytes(imageBase64);
    if (byteSize > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: 'Image size exceeds the 5MB limit.' },
        { status: 400 }
      );
    }
  }

  const fallbackPreset = await analyzeFoodImage(dishHint || fileName);
  const geminiKey = process.env.GEMINI_API_KEY?.trim();

  if (geminiKey && imageBase64) {
    try {
      const cleanBase64 = stripDataUrlPrefix(imageBase64);
      const effectiveMime = mimeType && ALLOWED_MIME_TYPES.has(mimeType.toLowerCase())
        ? mimeType.toLowerCase()
        : 'image/jpeg';

      const prompt = [
        'Analyze this meal photo and estimate its nutritional values for a single serving.',
        'Return strictly a JSON object with keys:',
        'foodName (string, include Thai name in parentheses if Thai dish),',
        'emoji (single food emoji),',
        'confidence (number 0.7 to 0.99),',
        'weight (estimated serving weight in grams, number),',
        'kcal (total calories, number),',
        'protein (grams, number),',
        'carbs (grams, number),',
        'fat (grams, number),',
        'ingredients (array of 3-5 strings with estimated gram breakdown),',
        'tips (1 concise nutrition coach sentence).',
      ].join(' ');

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: effectiveMime,
                      data: cleanBase64,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
          signal: AbortSignal.timeout(12000),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText: string | undefined =
          data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText) as Record<string, unknown>;
          const result = normalizeAiResult(parsed, fallbackPreset);
          return NextResponse.json({ result, source: 'gemini' as const });
        }
      }
    } catch (err) {
      console.warn('[api/food/analyze] Gemini Vision call failed, using preset fallback:', err);
    }
  }

  return NextResponse.json({
    result: fallbackPreset ?? POPULAR_AI_FOOD_PRESETS[0],
    source: 'preset' as const,
  });
}
