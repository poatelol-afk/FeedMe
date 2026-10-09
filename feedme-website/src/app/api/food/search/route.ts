import 'server-only';

import { NextResponse } from 'next/server';
import type { FoodItem, FoodPortion } from '@/types';

const USDA_SEARCH_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search';
const ENERGY_IDS = [1008, 2048, 2047] as const;

// DEV_BYPASS_AUTH: skip Supabase auth check when env flag is set
const BYPASS_AUTH = process.env.DEV_BYPASS_AUTH === 'true';

interface UsdaNutrient {
  nutrientId?: unknown;
  unitName?: unknown;
  value?: unknown;
}

interface UsdaMeasure {
  disseminationText?: unknown;
  modifier?: unknown;
  gramWeight?: unknown;
}

interface UsdaFood {
  fdcId?: unknown;
  description?: unknown;
  dataType?: unknown;
  foodCategory?: unknown;
  brandName?: unknown;
  brandOwner?: unknown;
  servingSize?: unknown;
  servingSizeUnit?: unknown;
  householdServingFullText?: unknown;
  foodNutrients?: unknown;
  foodMeasures?: unknown;
}

function finiteNumber(value: unknown): number | null {
  if (typeof value !== 'number' && (typeof value !== 'string' || !value.trim())) return null;
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function nutrientValue(nutrients: UsdaNutrient[], nutrientId: number, unit?: string): number {
  const nutrient = nutrients.find(item => (
    Number(item.nutrientId) === nutrientId
    && (!unit || String(item.unitName).toUpperCase() === unit)
  ));
  return finiteNumber(nutrient?.value) ?? 0;
}

function energyValue(nutrients: UsdaNutrient[]): number {
  for (const nutrientId of ENERGY_IDS) {
    const match = nutrients.find(item => (
      Number(item.nutrientId) === nutrientId
      && String(item.unitName).toUpperCase() === 'KCAL'
    ));
    const value = finiteNumber(match?.value);
    if (value !== null) return value;
  }
  return 0;
}

function text(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function portionsFor(food: UsdaFood): FoodPortion[] {
  const portions: FoodPortion[] = [];
  const measures = Array.isArray(food.foodMeasures) ? food.foodMeasures as UsdaMeasure[] : [];

  for (const measure of measures) {
    const grams = finiteNumber(measure.gramWeight);
    if (!grams || grams > 5000) continue;
    portions.push({
      label: text(measure.disseminationText) ?? text(measure.modifier) ?? '1 serving',
      grams: Math.round(grams * 10) / 10,
    });
  }

  const servingSize = finiteNumber(food.servingSize);
  const servingUnit = text(food.servingSizeUnit)?.toLowerCase();
  if (servingSize && servingUnit) {
    const grams = ['g', 'gram', 'grams'].includes(servingUnit)
      ? servingSize
      : ['oz', 'ounce', 'ounces'].includes(servingUnit)
        ? servingSize * 28.3495
        : null;

    if (grams && grams <= 5000) {
      portions.unshift({
        label: text(food.householdServingFullText) ?? `${servingSize} ${servingUnit}`,
        grams: Math.round(grams * 10) / 10,
      });
    }
  }

  return portions
    .filter((portion, index, all) => all.findIndex(candidate => (
      candidate.label.toLowerCase() === portion.label.toLowerCase()
      || candidate.grams === portion.grams
    )) === index)
    .slice(0, 5);
}

function mapFood(food: UsdaFood): FoodItem | null {
  const id = finiteNumber(food.fdcId);
  const name = text(food.description);
  if (id === null || !name) return null;

  const nutrients = Array.isArray(food.foodNutrients)
    ? food.foodNutrients as UsdaNutrient[]
    : [];

  return {
    id,
    name,
    emoji: '🍽️',
    kcal: Math.round(energyValue(nutrients) * 10) / 10,
    protein: Math.round(nutrientValue(nutrients, 1003) * 10) / 10,
    fat: Math.round(nutrientValue(nutrients, 1004) * 10) / 10,
    carbs: Math.round(nutrientValue(nutrients, 1005) * 10) / 10,
    category: text(food.foodCategory) ?? text(food.dataType) ?? 'Food',
    brand: text(food.brandName) ?? text(food.brandOwner),
    source: 'usda',
    portions: portionsFor(food),
  };
}

export async function GET(request: Request) {
  // Auth check -- skip when DEV_BYPASS_AUTH=true
  if (!BYPASS_AUTH) {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const query = new URL(request.url).searchParams.get('q')?.trim().replace(/\s+/g, ' ') ?? '';
  if (query.length < 2 || query.length > 100 || /[\u0000-\u001f\u007f]/.test(query)) {
    return NextResponse.json(
      { error: 'Search query must be between 2 and 100 characters.' },
      { status: 400 },
    );
  }

  const apiKey = process.env.USDA_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Food search is not configured. Please add USDA_API_KEY to .env.local' },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(`${USDA_SEARCH_URL}?api_key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query, pageSize: 20 }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: response.status === 429 ? 'Food search is temporarily rate limited.' : 'Food search is temporarily unavailable.' },
        { status: response.status === 429 ? 503 : 502 },
      );
    }

    const payload: unknown = await response.json();
    if (!payload || typeof payload !== 'object' || !Array.isArray((payload as { foods?: unknown }).foods)) {
      return NextResponse.json({ error: 'Food search returned an invalid response.' }, { status: 502 });
    }

    const foods = ((payload as { foods: UsdaFood[] }).foods)
      .map(mapFood)
      .filter((food): food is FoodItem => food !== null);

    return NextResponse.json(
      { foods },
      { headers: { 'Cache-Control': 'private, no-store' } },
    );
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === 'TimeoutError';
    return NextResponse.json(
      { error: timedOut ? 'Food search timed out. Please try again.' : 'Food search is temporarily unavailable.' },
      { status: timedOut ? 504 : 502 },
    );
  }
}
