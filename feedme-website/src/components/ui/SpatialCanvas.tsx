'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  baseRadius: number;
  color: string;
  vx: number;
  vy: number;
  vz: number;
}

const PALETTE = [
  '#58CC02', // Feather Green
  '#1CB0F6', // Kitchen Cyan
  '#FF9600', // Cardio Orange
  '#CE82FF', // Gem Purple
];

/**
 * SpatialCanvas
 * High-performance 60fps 3D Perspective Horizon Grid & Floating Energy Orbs.
 * Self-suspends when offscreen or in background tabs, with full prefers-reduced-motion support.
 */
export default function SpatialCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let isVisible = true;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;
    let scrollYOffset = 0;

    // Responsive resize handler
    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Scroll tracking
    const handleScroll = () => {
      scrollYOffset = window.scrollY * 0.15;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Intersection observer to pause when off-screen
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        lastTime = performance.now();
      }
    }, { threshold: 0.05 });
    observer.observe(canvas);

    // Tab visibility handling
    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initialize 3D Energy Orbs
    const particlesCount = 28;
    const particles: Particle[] = [];
    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.2,
        z: Math.random() * 800 + 100,
        baseRadius: Math.random() * 3 + 2,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: -(Math.random() * 0.6 + 0.3),
      });
    }

    let lastTime = performance.now();

    const render = (currentTime: number) => {
      animationId = requestAnimationFrame(render);
      if (!isVisible) return;

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const fov = 400;
      const vpX = width / 2 + (mouseX - width / 2) * 0.12;
      const vpY = height * 0.6 + (mouseY - height / 2) * 0.08;

      // ─── Draw 3D Perspective Floor Grid ───
      ctx.save();
      ctx.lineWidth = 1;
      const gridCount = 14;
      const gridSpread = width * 1.6;

      // Converging perspective lines
      for (let i = -gridCount; i <= gridCount; i++) {
        const xFloor = vpX + (i / gridCount) * gridSpread;
        ctx.beginPath();
        ctx.moveTo(vpX, vpY);
        ctx.lineTo(xFloor, height);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
        ctx.stroke();
      }

      // Horizontal depth lines
      const depthSteps = 10;
      for (let d = 1; d <= depthSteps; d++) {
        const t = d / depthSteps;
        const depthY = vpY + Math.pow(t, 2) * (height - vpY);
        const dynamicAlpha = Math.pow(t, 2.5) * 0.07;

        ctx.beginPath();
        ctx.moveTo(0, depthY);
        ctx.lineTo(width, depthY);
        ctx.strokeStyle = `rgba(88, 204, 2, ${dynamicAlpha})`;
        ctx.stroke();
      }
      ctx.restore();

      // ─── Draw Floating 3D Energy Orbs ───
      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particle
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Recycle if behind camera
        if (p.z <= 10) {
          p.z = 800;
          p.x = (Math.random() - 0.5) * width * 1.5;
          p.y = (Math.random() - 0.5) * height * 1.2;
        }

        // Project 3D to 2D
        const scale = fov / (fov + p.z);
        const projX = vpX + (p.x - (mouseX - width / 2) * 0.4) * scale;
        const projY = vpY + (p.y - (mouseY - height / 2) * 0.4 - scrollYOffset) * scale;
        const radius = Math.max(p.baseRadius * scale * 2, 0.8);
        const alpha = Math.min(Math.max((1 - p.z / 800) * 0.55, 0.05), 0.7);

        // Draw soft glow
        const gradient = ctx.createRadialGradient(projX, projY, 0, projX, projY, radius * 2.5);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(projX, projY, radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = alpha * 0.6;
        ctx.fill();

        // Draw particle core
        ctx.beginPath();
        ctx.arc(projX, projY, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
      }
      ctx.restore();
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10"
      style={{ opacity: 0.85 }}
    />
  );
}
