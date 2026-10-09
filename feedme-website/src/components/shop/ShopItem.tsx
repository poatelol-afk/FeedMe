'use client';

import { ShopItem as ShopItemType } from '@/types';

interface ShopItemProps {
  item: ShopItemType;
  coins: number;
  onPurchase: (item: ShopItemType) => void;
}

export default function ShopItem({ item, coins, onPurchase }: ShopItemProps) {
  const canAfford = coins >= item.coinPrice;

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-soft)',
      borderRadius: '18px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      transition: 'border-color 0.2s',
    }}>
      {/* Emoji */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '36px', lineHeight: 1 }}>{item.emoji}</span>
      </div>

      {/* Name & desc */}
      <p style={{
        fontSize: '13px', fontWeight: '500',
        color: 'var(--text-primary)', textAlign: 'center',
        lineHeight: 1.3,
      }}>
        {item.name}
      </p>
      <p style={{
        fontSize: '11px', color: 'var(--text-muted)',
        textAlign: 'center', marginTop: '4px', lineHeight: 1.4,
        flex: 1,
      }}>
        {item.calories} kcal
      </p>

      {/* Price + Buy */}
      <div style={{ marginTop: '12px' }}>
        <p style={{
          textAlign: 'center',
          fontSize: '15px', fontWeight: '400',
          color: 'var(--gold)', letterSpacing: '-0.02em',
          marginBottom: '8px',
        }}>
          {item.coinPrice.toLocaleString()}
        </p>
        <button
          onClick={() => onPurchase(item)}
          disabled={!canAfford}
          style={{
            width: '100%', borderRadius: '10px',
            padding: '9px', fontSize: '12px', fontWeight: '500',
            cursor: canAfford ? 'pointer' : 'not-allowed',
            border: `1px solid ${canAfford ? 'rgba(143,184,154,0.25)' : 'var(--border-soft)'}`,
            background: canAfford ? 'var(--accent-soft)' : 'transparent',
            color: canAfford ? 'var(--accent)' : 'var(--text-muted)',
            transition: 'all 0.15s ease',
          }}
        >
          {canAfford ? 'Redeem' : 'Not enough'}
        </button>
      </div>
    </div>
  );
}
