'use client';

import { useEffect, useState } from 'react';
import { FOODS } from '@/lib/food-data';
import type { FoodItem } from '@/types';

interface FoodSearchProps {
  onSelect: (food: FoodItem) => void;
  selectedId: number | null;
}

interface SearchState {
  query: string;
  foods: FoodItem[];
  error: string;
}

export default function FoodSearch({ onSelect, selectedId }: FoodSearchProps) {
  const [query, setQuery] = useState('');
  const [searchState, setSearchState] = useState<SearchState>({ query: '', foods: [], error: '' });
  const normalizedQuery = query.trim().replace(/\s+/g, ' ');
  const canSearch = normalizedQuery.length >= 2;
  const isLoading = canSearch && searchState.query !== normalizedQuery;
  const foods = normalizedQuery ? (searchState.query === normalizedQuery ? searchState.foods : []) : FOODS;

  useEffect(() => {
    if (!canSearch) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/food/search?q=${encodeURIComponent(normalizedQuery)}`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });
        const payload = await response.json() as { foods?: FoodItem[]; error?: string };

        if (!response.ok) throw new Error(payload.error || 'Unable to search foods.');
        setSearchState({ query: normalizedQuery, foods: payload.foods ?? [], error: '' });
      } catch (error) {
        if (controller.signal.aborted) return;
        setSearchState({
          query: normalizedQuery,
          foods: [],
          error: error instanceof Error ? error.message : 'Unable to search foods.',
        });
      }
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [canSearch, normalizedQuery]);

  const showError = canSearch && searchState.query === normalizedQuery && searchState.error;
  const showEmpty = canSearch && searchState.query === normalizedQuery && !searchState.error && foods.length === 0;

  return (
    <div>
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <svg
          width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Search USDA foods..."
          className="input-field"
          style={{ paddingLeft: '40px' }}
          maxLength={100}
          autoComplete="off"
        />
      </div>

      {!normalizedQuery && (
        <p className="text-label" style={{ margin: '2px 14px 8px' }}>Suggested foods</p>
      )}

      <div style={{ maxHeight: '300px', overflowY: 'auto' }} className="scrollbar-thin" aria-live="polite">
        {normalizedQuery.length === 1 ? (
          <StateMessage>Type one more character to search.</StateMessage>
        ) : isLoading ? (
          <StateMessage>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span className="search-spinner" aria-hidden="true" /> Searching FoodData Central...
            </span>
          </StateMessage>
        ) : showError ? (
          <StateMessage role="alert">{showError}</StateMessage>
        ) : showEmpty ? (
          <StateMessage>No foods found for “{normalizedQuery}”.</StateMessage>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {foods.map(food => {
              const isSelected = selectedId === food.id;
              return (
                <button
                  key={`${food.source ?? 'static'}-${food.id}`}
                  type="button"
                  onClick={() => onSelect(food)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    width: '100%', textAlign: 'left',
                    padding: '12px 14px', borderRadius: '12px',
                    background: isSelected ? 'var(--accent-soft)' : 'transparent',
                    border: `1px solid ${isSelected ? 'rgba(143,184,154,0.2)' : 'transparent'}`,
                    cursor: 'pointer', transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '20px', lineHeight: 1, flexShrink: 0 }}>{food.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: '13px', fontWeight: '500',
                      color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {food.name}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {[food.brand, food.category].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: '400', color: 'var(--text-secondary)' }}>
                      {Math.round(food.kcal)}
                    </p>
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>per 100g</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {canSearch && (
        <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'center' }}>
          Source: <a href="https://fdc.nal.usda.gov/" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }}>USDA FoodData Central</a>
        </p>
      )}
    </div>
  );
}

function StateMessage({ children, role }: { children: React.ReactNode; role?: 'alert' }) {
  return (
    <p role={role} style={{ padding: '32px 12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
      {children}
    </p>
  );
}
