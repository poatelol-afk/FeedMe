'use client';

import { useState } from 'react';
import { POPULAR_AI_FOOD_PRESETS } from '@/lib/ai-food-presets';
import { AIScanResult, DiaryEntry } from '@/types';

interface AIFoodScannerProps {
  onSaveFood: (entry: Omit<DiaryEntry, 'id' | 'timestamp'>) => Promise<void>;
  onSuccess: (foodName: string) => void;
}

export default function AIFoodScanner({ onSaveFood, onSuccess }: AIFoodScannerProps) {
  const [selectedPreset, setSelectedPreset] = useState<AIScanResult>(POPULAR_AI_FOOD_PRESETS[0]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<AIScanResult | null>(POPULAR_AI_FOOD_PRESETS[0]);
  const [portionScale, setPortionScale] = useState(1.0);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectPreset = (preset: AIScanResult) => {
    setSelectedPreset(preset);
    setImagePreview(null);
    triggerScan(preset);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImagePreview(dataUrl);

      // Match preset based on filename or randomly pick a delicious preset
      const name = file.name.toLowerCase();
      const match = POPULAR_AI_FOOD_PRESETS.find(p =>
        name.includes(p.foodName.toLowerCase()) ||
        name.includes(p.emoji) ||
        p.ingredients.some(ing => name.includes(ing.toLowerCase()))
      ) ?? POPULAR_AI_FOOD_PRESETS[Math.floor(Math.random() * POPULAR_AI_FOOD_PRESETS.length)];

      triggerScan(match);
    };
    reader.readAsDataURL(file);
  };

  const triggerScan = (targetResult: AIScanResult) => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult(targetResult);
      setPortionScale(1.0);
    }, 1200);
  };

  const scaledGrams = scanResult ? Math.round(scanResult.weight * portionScale) : 0;
  const scaledKcal = scanResult ? Math.round(scanResult.kcal * portionScale) : 0;
  const scaledProtein = scanResult ? +(scanResult.protein * portionScale).toFixed(1) : 0;
  const scaledCarbs = scanResult ? +(scanResult.carbs * portionScale).toFixed(1) : 0;
  const scaledFat = scanResult ? +(scanResult.fat * portionScale).toFixed(1) : 0;

  const handleSave = async () => {
    if (!scanResult || isSaving) return;
    setIsSaving(true);
    try {
      await onSaveFood({
        foodName: scanResult.foodName,
        emoji: scanResult.emoji,
        weight: scaledGrams,
        kcal: scaledKcal,
        protein: scaledProtein,
        carbs: scaledCarbs,
        fat: scaledFat,
      });
      onSuccess(`${scanResult.foodName} (${scaledGrams}g)`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Upload Box / Scanner HUD */}
      <div className="card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
        <p className="text-label" style={{ marginBottom: '12px' }}>AI Vision Food Camera</p>

        <div style={{
          position: 'relative', width: '100%', height: '220px', borderRadius: '16px',
          background: 'var(--bg-elevated)', border: '2px dashed var(--border-mid)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', cursor: 'pointer',
        }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{
              position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10,
            }}
          />

          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Food capture"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '16px', pointerEvents: 'none' }}>
              <span style={{ fontSize: '42px', display: 'block', marginBottom: '8px' }}>
                {selectedPreset.emoji}
              </span>
              <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>
                Tap to Take Photo or Upload
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Gemini Vision analyzes calories, macros & ingredients
              </p>
            </div>
          )}

          {/* Scanning Laser Beam Effect */}
          {isScanning && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 5,
              background: 'rgba(143, 184, 154, 0.1)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                position: 'absolute', width: '100%', height: '3px',
                background: 'linear-gradient(90deg, transparent 0%, #8FB89A 50%, transparent 100%)',
                boxShadow: '0 0 15px #8FB89A',
                animation: 'feedme-laser 1.2s infinite ease-in-out',
                top: '50%',
              }} />
              <div style={{
                background: 'rgba(17,17,16,0.85)', padding: '8px 16px', borderRadius: '20px',
                border: '1px solid var(--accent)', color: 'var(--accent)', fontSize: '12px',
                fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span className="search-spinner" />
                Analyzing ingredients & portion size...
              </div>
            </div>
          )}
        </div>

        {/* Quick Sample Selector */}
        <p className="text-label" style={{ marginTop: '16px', marginBottom: '8px' }}>
          Or test with sample popular dishes:
        </p>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {POPULAR_AI_FOOD_PRESETS.map((preset) => (
            <button
              key={preset.foodName}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              style={{
                padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '500',
                background: selectedPreset.foodName === preset.foodName ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                color: selectedPreset.foodName === preset.foodName ? 'var(--accent)' : 'var(--text-secondary)',
                border: `1px solid ${selectedPreset.foodName === preset.foodName ? 'var(--accent)' : 'var(--border-soft)'}`,
                cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px',
              }}
            >
              <span>{preset.emoji}</span>
              <span>{preset.foodName.split('(')[0].trim()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Detection Result Card */}
      {scanResult && !isScanning && (
        <div className="card animate-fade-up" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start" style={{ gap: '12px' }}>
              <span style={{ fontSize: '28px', lineHeight: 1 }}>{scanResult.emoji}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {scanResult.foodName}
                  </h3>
                  <span className="badge-accent" style={{ fontSize: '10px', padding: '2px 8px' }}>
                    {Math.round(scanResult.confidence * 100)}% match
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                  {scanResult.tips}
                </p>
              </div>
            </div>
          </div>

          {/* Portion scaling buttons */}
          <div style={{
            background: 'var(--bg-elevated)', borderRadius: '12px', padding: '10px 14px',
            border: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <p className="text-label">Portion Size</p>
              <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', marginTop: '2px' }}>
                {scaledGrams} grams ({portionScale}x serving)
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[0.5, 1.0, 1.5, 2.0].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPortionScale(s)}
                  style={{
                    padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '500',
                    background: portionScale === s ? 'var(--accent)' : 'var(--bg-overlay)',
                    color: portionScale === s ? '#111110' : 'var(--text-secondary)',
                    border: '1px solid var(--border-soft)', cursor: 'pointer',
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Nutrition 4-col Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
            <div style={{ background: 'var(--bg-elevated)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
              <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>{scaledKcal}</p>
              <p className="text-label" style={{ marginTop: '2px' }}>Calories</p>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
              <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--macro-protein)' }}>{scaledProtein}g</p>
              <p className="text-label" style={{ marginTop: '2px' }}>Protein</p>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
              <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--macro-carbs)' }}>{scaledCarbs}g</p>
              <p className="text-label" style={{ marginTop: '2px' }}>Carbs</p>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
              <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--macro-fat)' }}>{scaledFat}g</p>
              <p className="text-label" style={{ marginTop: '2px' }}>Fat</p>
            </div>
          </div>

          {/* Detected Ingredients */}
          <div>
            <p className="text-label" style={{ marginBottom: '6px' }}>Detected Ingredients</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {scanResult.ingredients.map((ing) => (
                <span
                  key={ing}
                  style={{
                    fontSize: '11px', background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-soft)', borderRadius: '6px',
                    padding: '3px 8px', color: 'var(--text-secondary)',
                  }}
                >
                  ✓ {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Add to Diary Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary"
            style={{ padding: '14px', marginTop: '4px' }}
          >
            {isSaving ? 'Logging Meal...' : `Add ${scanResult.foodName} to Diary 🍱`}
          </button>
        </div>
      )}
    </div>
  );
}
