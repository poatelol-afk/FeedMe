'use client';

import { useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import FoodSearch from '@/components/log/FoodSearch';
import FoodCard from '@/components/log/FoodCard';
import AIFoodScanner from '@/components/log/AIFoodScanner';
import Toast, { useToast } from '@/components/ui/Toast';
import { FoodItem } from '@/types';

export default function LogPage() {
  const { addFood } = useAppState();
  const { toast, showToast, hideToast } = useToast();
  const [logMode, setLogMode] = useState<'ai' | 'search'>('ai');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [portionMode, setPortionMode] = useState('manual');
  const [quantity, setQuantity] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const selectedPortion = portionMode === 'manual'
    ? null
    : selectedFood?.portions?.[Number(portionMode)] ?? null;
  const quantityNumber = Number(quantity);
  const rawGrams = selectedPortion ? selectedPortion.grams * quantityNumber : quantityNumber;
  const grams = Number.isFinite(rawGrams) ? Math.round(rawGrams * 10) / 10 : 0;
  const maxQuantity = selectedPortion ? 100 : 5000;
  const isValid = quantity.trim() !== ''
    && Number.isFinite(quantityNumber)
    && quantityNumber > 0
    && quantityNumber <= maxQuantity
    && grams >= 1
    && grams <= 5000;

  const handleSelect = (food: FoodItem) => {
    const hasPortions = Boolean(food.portions?.length);
    setSelectedFood(food);
    setPortionMode(hasPortions ? '0' : 'manual');
    setQuantity(hasPortions ? '1' : '');
    setSaveError('');
  };

  const handleSaveSearchFood = async () => {
    if (!selectedFood || !isValid || saving) return;

    const food = selectedFood;
    const multiplier = grams / 100;
    setSaving(true);
    setSaveError('');

    try {
      await addFood({
        foodName: food.name,
        emoji: food.emoji,
        weight: grams,
        kcal: Math.round(food.kcal * multiplier),
        protein: +(food.protein * multiplier).toFixed(1),
        carbs: +(food.carbs * multiplier).toFixed(1),
        fat: +(food.fat * multiplier).toFixed(1),
      });
      showToast(`Saved ${food.name} (${grams}g)`);
      setSelectedFood(null);
      setPortionMode('manual');
      setQuantity('');
    } catch {
      setSaveError('Could not save this food. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '32px 24px 80px' }} className="animate-fade-in">
      <Toast message={toast.message} isVisible={toast.isVisible} onClose={hideToast} />

      {/* Header */}
      <h1 style={{ fontSize: '22px', fontWeight: '300', letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '4px' }}>
        Log a Meal
      </h1>
      <p className="text-label" style={{ marginBottom: '20px' }}>
        AI photo recognition & USDA nutritional search
      </p>

      {/* Mode Switcher */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px',
        padding: '4px', background: 'var(--bg-elevated)', borderRadius: '14px',
        border: '1px solid var(--border-soft)', marginBottom: '20px',
      }}>
        <button
          type="button"
          onClick={() => setLogMode('ai')}
          style={{
            padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: '500',
            border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
            background: logMode === 'ai' ? 'var(--bg-surface)' : 'transparent',
            color: logMode === 'ai' ? 'var(--accent)' : 'var(--text-muted)',
            boxShadow: logMode === 'ai' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
          }}
        >
          📷 AI Photo Scan
        </button>
        <button
          type="button"
          onClick={() => setLogMode('search')}
          style={{
            padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: '500',
            border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
            background: logMode === 'search' ? 'var(--bg-surface)' : 'transparent',
            color: logMode === 'search' ? 'var(--accent)' : 'var(--text-muted)',
            boxShadow: logMode === 'search' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
          }}
        >
          🔍 Search / Scale Log
        </button>
      </div>

      {/* Mode Content */}
      {logMode === 'ai' ? (
        <AIFoodScanner
          onSaveFood={addFood}
          onSuccess={(name) => showToast(`Logged meal: ${name}`)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Search section */}
          <div className="card">
            <p className="text-label" style={{ marginBottom: '12px' }}>Search Food Database</p>
            <FoodSearch onSelect={handleSelect} selectedId={selectedFood?.id ?? null} />
          </div>

          {/* Weight input */}
          {selectedFood && (
            <div className="card animate-fade-up">
              <p className="text-label" style={{ marginBottom: '12px' }}>Serving amount</p>
              <label htmlFor="portion" style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Portion
              </label>
              <select
                id="portion"
                value={portionMode}
                onChange={event => {
                  const mode = event.target.value;
                  setPortionMode(mode);
                  setQuantity(mode === 'manual' ? '' : '1');
                  setSaveError('');
                }}
                className="input-field"
                style={{ marginBottom: '12px' }}
              >
                {selectedFood.portions?.map((portion, index) => (
                  <option key={`${portion.label}-${portion.grams}`} value={String(index)}>
                    {portion.label} ({portion.grams}g)
                  </option>
                ))}
                <option value="manual">Manual grams</option>
              </select>
              <label htmlFor="quantity" style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {selectedPortion ? 'Quantity' : 'Grams'}
              </label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={event => {
                  setQuantity(event.target.value);
                  setSaveError('');
                }}
                placeholder={selectedPortion ? 'e.g. 1.5' : 'e.g. 150'}
                min={selectedPortion ? '0.1' : '1'}
                max={String(maxQuantity)}
                step={selectedPortion ? '0.1' : '1'}
                className="input-field"
                aria-describedby="amount-help"
              />
              <p id="amount-help" style={{ fontSize: '11px', color: isValid ? 'var(--text-muted)' : 'var(--danger)', marginTop: '8px' }}>
                {isValid
                  ? `${selectedPortion ? `${quantityNumber} × ${selectedPortion.grams}g = ` : ''}${grams}g total`
                  : quantity.trim() ? 'Total weight must be between 1g and 5,000g.' : 'Enter an amount between 1g and 5,000g.'}
              </p>
            </div>
          )}

          {/* Macro preview */}
          {selectedFood && isValid && (
            <div className="animate-fade-up">
              <FoodCard food={selectedFood} weight={grams} />
            </div>
          )}

          {saveError && (
            <p role="alert" style={{ fontSize: '12px', color: 'var(--danger)', textAlign: 'center' }}>{saveError}</p>
          )}

          {/* Save button */}
          {selectedFood && (
            <button
              onClick={handleSaveSearchFood}
              disabled={!isValid || saving}
              className="btn-primary animate-fade-up"
            >
              {saving ? 'Saving...' : 'Add to diary'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
