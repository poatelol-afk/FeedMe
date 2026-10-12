'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Today',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth={active ? '2.2' : '1.7'} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="2" />
        <rect x="14" y="3" width="7" height="5" rx="2" />
        <rect x="14" y="12" width="7" height="9" rx="2" />
        <rect x="3" y="16" width="7" height="5" rx="2" />
      </svg>
    ),
  },
  {
    href: '/log',
    label: 'Food AI',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth={active ? '2.2' : '1.7'} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    href: '/workout',
    label: 'Train',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth={active ? '2.2' : '1.7'} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    href: '/shop',
    label: 'Rewards',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth={active ? '2.2' : '1.7'} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12V22H4V12" />
        <path d="M22 7H2v5h20V7z" />
        <path d="M12 22V7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Body',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth={active ? '2.2' : '1.7'} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderTop: '1px solid var(--border-soft)',
        boxShadow: '0 -4px 20px rgba(15, 23, 42, 0.04)',
      }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-4 pb-safe pt-2 pb-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-1 transition-all duration-150"
              style={{
                color: isActive ? 'var(--accent-deep)' : 'var(--text-muted)',
                textDecoration: 'none',
              }}
            >
              <span
                className="transition-all duration-200"
                style={{
                  transform: isActive ? 'scale(1.06)' : 'scale(1)',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  backgroundColor: isActive ? 'var(--accent-soft)' : 'transparent',
                }}
              >
                {item.icon(isActive)}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: isActive ? 800 : 600,
                  letterSpacing: '0.03em',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
