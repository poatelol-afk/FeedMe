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
 * and cubic-bezier(0.16, 1, 0.3, 1) exponential deceleration in 3D space.
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

interface TiltCard3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTiltDeg?: number;
  spotlightColor?: string;
  glare?: boolean;
}

/**
 * TiltCard3D Component
 * Interactive 3D spatial card primitive with mouse-directed rotateX/rotateY,
 * dynamic specular spotlight glare overlay, and transform-style: preserve-3d.
 */
export function TiltCard3D({
  children,
  className = '',
  maxTiltDeg = 8,
  spotlightColor = 'rgba(88, 204, 2, 0.15)',
  glare = true,
  style,
  ...props
}: TiltCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rx = ((y / rect.height) - 0.5) * -maxTiltDeg;
    const ry = ((x / rect.width) - 0.5) * maxTiltDeg;

    setTilt({ rx, ry });
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg)`,
        transformStyle: 'preserve-3d',
        transition: tilt.rx === 0 && tilt.ry === 0 ? 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
        ...style,
      }}
      className={`relative will-change-transform ${className}`}
      {...props}
    >
      {/* Specular Glare Spotlight Layer */}
      {glare && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-10"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, ${spotlightColor}, transparent 80%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}
