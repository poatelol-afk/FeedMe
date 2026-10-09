'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, isVisible, onClose, duration = 2800 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const t = setTimeout(onClose, duration);
      return () => clearTimeout(t);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div
      className="animate-slide-down"
      style={{
        position: 'fixed', top: '20px', left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        background: 'var(--bg-overlay)',
        border: '1px solid var(--border-mid)',
        borderRadius: '12px',
        padding: '11px 20px',
        fontSize: '13px',
        fontWeight: '500',
        color: 'var(--text-primary)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        whiteSpace: 'nowrap',
        maxWidth: 'calc(100vw - 48px)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {message}
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState({ message: '', isVisible: false });
  const showToast = (message: string) => setToast({ message, isVisible: true });
  const hideToast = () => setToast(p => ({ ...p, isVisible: false }));
  return { toast, showToast, hideToast };
}
