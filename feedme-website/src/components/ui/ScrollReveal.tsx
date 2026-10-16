'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  staggerDelayMs?: number;
}

/**
 * ScrollReveal Component
 * Smoothly reveals content as it scrolls into view using IntersectionObserver
 * and cubic-bezier(0.16, 1, 0.3, 1) exponential deceleration.
 */
export function ScrollReveal({
  children,
  className = '',
  staggerDelayMs = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Respect reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ '--stagger-delay': `${staggerDelayMs}ms` } as React.CSSProperties}
      className={`reveal-on-scroll ${isVisible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * useAnimatedNumber Hook
 * Animates numerical values with smooth exponential count-up.
 */
export function useAnimatedNumber(targetValue: number, durationMs = 380): number {
  const [currentValue, setCurrentValue] = useState(targetValue);
  const prevTargetRef = useRef(targetValue);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrentValue(targetValue);
      prevTargetRef.current = targetValue;
      return;
    }

    const startValue = currentValue;
    const endValue = targetValue;
    const startTime = performance.now();

    let animationFrameId: number;

    const updateNumber = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Exponential deceleration (ease-out-cubic: 1 - (1 - t)^3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(startValue + (endValue - startValue) * easeProgress);

      setCurrentValue(nextValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateNumber);
      } else {
        prevTargetRef.current = targetValue;
      }
    };

    animationFrameId = requestAnimationFrame(updateNumber);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetValue, durationMs]);

  return currentValue;
}
