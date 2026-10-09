'use client';

export default function CoinBalance({ coins }: { coins: number }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-amber-500/10 bg-amber-500/[0.04] px-5 py-4">
      <span className="text-2xl">🪙</span>
      <div className="flex-1">
        <p className="text-[10px] font-medium uppercase tracking-widest text-amber-400/60">
          Coin Balance
        </p>
        <p className="text-2xl font-bold tabular-nums text-amber-400">
          {coins.toLocaleString()}
        </p>
      </div>
      <div className="rounded-xl bg-amber-500/10 px-3 py-1.5 text-[11px] font-medium text-amber-300">
        Earn more →
      </div>
    </div>
  );
}
