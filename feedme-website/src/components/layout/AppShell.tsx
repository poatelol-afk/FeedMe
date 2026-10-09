'use client';

import { usePathname } from 'next/navigation';
import BottomNav from './BottomNav';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  if (isLandingPage) {
    return <main className="min-h-screen w-full bg-[var(--bg-base)]">{children}</main>;
  }

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        maxWidth: '480px',
        margin: '0 auto',
        background: 'var(--bg-base)',
      }}
    >
      <main style={{ paddingBottom: '80px' }}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
