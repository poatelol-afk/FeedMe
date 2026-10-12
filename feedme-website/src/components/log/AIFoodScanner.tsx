'use client';

import { useState } from 'react';
import Image from 'next/image';
import { POPULAR_AI_FOOD_PRESETS } from '@/lib/ai-food-presets';
import { AIScanResult, DiaryEntry } from '@/types';

interface AIFoodScannerProps {
  onSaveFood: (entry: Omit<DiaryEntry, 'id' | 'timestamp'>) => Promise<void>;
  onSuccess: (foodName: string) => void;
}

const SMART_PORTIONS = [
  { scale: 0.5, label: '0.5x (ครึ่งจาน)' },
  { scale: 1.0, label: '1x (1 จาน/ทัพพี)' },
  { scale: 1.5, label: '1.5x (พิเศษ)' },
  { scale: 2.0, label: '2x (จัมโบ้)' },
] as const;

export default function AIFoodScanner({ onSaveFood, onSuccess }: AIFoodScannerProps) {
  const [selectedPreset, setSelectedPreset] = useState<AIScanResult>(POPULAR_AI_FOOD_PRESETS[0]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<AIScanResult | null>(POPULAR_AI_FOOD_PRESETS[0]);
  const [scanSource, setScanSource] = useState<'gemini' | 'preset'>('preset');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [portionScale, setPortionScale] = useState(1.0);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectPreset = async (preset: AIScanResult) => {
    setSelectedPreset(preset);
    setImagePreview(null);
    setUploadError(null);
    setIsScanning(true);
    setScanResult(null);
    try {
      const res = await fetch('/api/food/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dishHint: preset.foodName }),
      });
      if (res.ok) {
        const data = (await res.json()) as { result: AIScanResult; source: 'gemini' | 'preset' };
        setScanResult(data.result);
        setScanSource(data.source);
      } else {
        setScanResult(preset);
        setScanSource('preset');
      }
    } catch {
      setScanResult(preset);
      setScanSource('preset');
    } finally {
      setIsScanning(false);
      setPortionScale(1.0);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a JPEG, PNG, or WEBP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image exceeds the 5MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setImagePreview(dataUrl);
      setIsScanning(true);
      setScanResult(null);

      try {
        const res = await fetch('/api/food/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: dataUrl,
            mimeType: file.type,
            fileName: file.name,
          }),
        });
        const data = (await res.json()) as { result?: AIScanResult; source?: 'gemini' | 'preset'; error?: string };
        if (res.ok && data.result) {
          setScanResult(data.result);
          setScanSource(data.source ?? 'preset');
          setPortionScale(1.0);
        } else {
          setUploadError(data.error ?? 'Could not analyze image.');
          setScanResult(selectedPreset);
        }
      } catch {
        setScanResult(selectedPreset);
        setScanSource('preset');
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
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
        <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
          <p className="text-label">AI Vision Food Camera</p>
          <span className="badge-accent" style={{ fontSize: '10px' }}>
            {scanSource === 'gemini' ? '⚡ Gemini Vision Live' : '⚡ Smart AI Preset'}
          </span>
        </div>

        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '220px',
            borderRadius: '16px',
            background: 'var(--bg-elevated)',
            border: '2px dashed var(--border-mid)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileUpload}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              cursor: 'pointer',
              zIndex: 10,
            }}
          />

          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Food capture"
              fill
              unoptimized
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '16px', pointerEvents: 'none' }}>
              <span style={{ fontSize: '42px', display: 'block', marginBottom: '8px' }}>
                {selectedPreset.emoji}
              </span>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Tap to Take Photo or Upload Meal (JPEG/PNG/WEBP ≤ 5MB)
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Gemini Vision analyzes calories, macros &amp; smart portions automatically
              </p>
            </div>
          )}

          {/* Scanning Laser Beam Effect */}
          {isScanning && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 5,
                background: 'rgba(15, 23, 42, 0.55)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent 0%, #10B981 50%, transparent 100%)',
                  boxShadow: '0 0 15px #10B981',
                  animation: 'feedme-laser 1.2s infinite ease-in-out',
                  top: '50%',
                }}
              />
              <div
                style={{
                  background: '#0F172A',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  border: '1px solid #10B981',
                  color: '#34D399',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span className="search-spinner" />
                Analyzing dish macros &amp; portion size...
              </div>
            </div>
          )}
        </div>

        {uploadError && (
          <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '10px', fontWeight: 600 }}>
            {uploadError}
          </p>
        )}

        {/* Quick Sample Selector */}
        <p className="text-label" style={{ marginTop: '16px', marginBottom: '8px' }}>
          Or select a popular dish preset:
        </p>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {POPULAR_AI_FOOD_PRESETS.map((preset) => (
            <button
              key={preset.foodName}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              style={{
                padding: '7px 12px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 700,
                background: selectedPreset.foodName === preset.foodName ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                color: selectedPreset.foodName === preset.foodName ? 'var(--accent-deep)' : 'var(--text-secondary)',
                border: `1px solid ${selectedPreset.foodName === preset.foodName ? 'var(--accent)' : 'var(--border-soft)'}`,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
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

          {/* Smart Portion Scaling Buttons */}
          <div
            style={{
              background: 'var(--bg-elevated)',
              borderRadius: '14px',
              padding: '12px 14px',
              border: '1px solid var(--border-soft)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-label">Smart Portion Size (ไม่ต้องพึ่งเครื่องชั่ง)</p>
              <p style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {scaledGrams} g ({portionScale}x)
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {SMART_PORTIONS.map(p => (
                <button
                  key={p.scale}
                  type="button"
                  onClick={() => setPortionScale(p.scale)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: portionScale === p.scale ? 'var(--accent)' : '#FFFFFF',
                    color: portionScale === p.scale ? '#FFFFFF' : 'var(--text-secondary)',
                    border: `1px solid ${portionScale === p.scale ? 'var(--accent-deep)' : 'var(--border-soft)'}`,
                    cursor: 'pointer',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Nutrition 4-col Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
            <div style={{ background: 'var(--bg-elevated)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
              <p style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>{scaledKcal}</p>
              <p className="text-label" style={{ marginTop: '2px' }}>Calories</p>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
              <p style={{ fontSize: '16px', fontWeight: 800, color: 'var(--macro-protein)' }}>{scaledProtein}g</p>
              <p className="text-label" style={{ marginTop: '2px' }}>Protein</p>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
              <p style={{ fontSize: '16px', fontWeight: 800, color: 'var(--macro-carbs)' }}>{scaledCarbs}g</p>
              <p className="text-label" style={{ marginTop: '2px' }}>Carbs</p>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
              <p style={{ fontSize: '16px', fontWeight: 800, color: 'var(--macro-fat)' }}>{scaledFat}g</p>
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
                    fontSize: '11px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-soft)',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
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
