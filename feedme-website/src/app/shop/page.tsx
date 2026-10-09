'use client';

import { useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { SHOP_ITEMS, SHOP_CATEGORIES } from '@/lib/shop-data';
import ShopItemCard from '@/components/shop/ShopItem';
import Toast, { useToast } from '@/components/ui/Toast';
import { ShopItem } from '@/types';

export default function ShopPage() {
  const { coins, purchaseItem } = useAppState();
  const { toast, showToast, hideToast } = useToast();
  const [category, setCategory] = useState<string>('all');

  const filtered = category === 'all' ? SHOP_ITEMS : SHOP_ITEMS.filter(i => i.category === category);

  const handlePurchase = async (item: ShopItem) => {
    const ok = await purchaseItem(item.id, item.name, item.coinPrice);
    showToast(ok ? `Redeemed ${item.name}!` : `Not enough coins`);
  };

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: '7px 14px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    border: `1px solid ${active ? 'rgba(201,169,110,0.3)' : 'var(--border-soft)'}`,
    background: active ? 'var(--gold-soft)' : 'transparent',
    color: active ? 'var(--gold)' : 'var(--text-muted)',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  });

  return (
    <div style={{ padding: '32px 24px 0' }} className="animate-fade-in">
      <Toast message={toast.message} isVisible={toast.isVisible} onClose={hideToast} />

      <div className="flex items-start justify-between" style={{ marginBottom: '8px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '300', letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Reward Shop
          </h1>
          <p className="text-label">Spend your coins on treats</p>
        </div>
        <div style={{
          background: 'var(--gold-soft)',
          border: '1px solid rgba(201,169,110,0.2)',
          borderRadius: '10px', padding: '6px 12px',
        }}>
          <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--gold)' }}>
            {coins.toLocaleString()} coins
          </span>
        </div>
      </div>

      {/* Category chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '16px 0 4px' }} className="scrollbar-none">
        {SHOP_CATEGORIES.map(cat => (
          <button key={cat.id} style={chipStyle(category === cat.id)} onClick={() => setCategory(cat.id)}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingBottom: '8px' }}>
        {filtered.map(item => (
          <ShopItemCard key={item.id} item={item} coins={coins} onPurchase={handlePurchase} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: '60px 0', textAlign: 'center' }}>
          <p className="text-body">Nothing here yet</p>
        </div>
      )}
    </div>
  );
}
