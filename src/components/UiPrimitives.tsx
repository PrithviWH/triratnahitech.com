import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'motion/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { GemMarker } from './GemMotif';
import { RibbonType } from './RibbonType';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark';
  to?: string;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  magnetic?: boolean;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  to,
  href,
  type = 'button',
  onClick,
  magnetic = false,
  className = '',
  ariaLabel,
  disabled = false,
}: ButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const variantClasses = {
    primary:
      'bg-[#09090B] text-white border border-[#09090B] shadow-[0_2px_10px_rgba(9,9,11,0.14)] hover:bg-[#C84B13] hover:border-[#C84B13]',
    secondary:
      'bg-[#0F4C5C] text-white border border-[#0F4C5C] shadow-[0_2px_10px_rgba(15,76,92,0.16)] hover:bg-[#0c3d4a]',
    ghost:
      'bg-white text-[#18181B] border border-zinc-200 shadow-xs hover:border-zinc-400 hover:bg-zinc-50',
    dark:
      'bg-white text-[#09090B] border border-white shadow-[0_2px_14px_rgba(255,255,255,0.14)] hover:bg-[#F4F4F5]',
  }[variant];

  const baseClasses = `inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-display font-semibold text-sm tracking-tight whitespace-nowrap shrink-0 cursor-pointer select-none transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses} ${className}`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!magnetic || !ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.12;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.12;
    setOffset({ x: dx, y: dy });
  };

  const handleMouseLeave = () => {
    if (magnetic) setOffset({ x: 0, y: 0 });
  };

  const inner = to ? (
    <Link to={to} className={baseClasses} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </Link>
  ) : href ? (
    <a
      href={href}
      className={baseClasses}
      aria-label={ariaLabel}
      onClick={onClick}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ) : (
    <button
      type={type}
      onClick={onClick}
      className={baseClasses}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </button>
  );

  if (!magnetic) return inner;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: 'transform 180ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {inner}
    </div>
  );
}

export function ChamferCard({
  children,
  className = '',
  surface = 'white',
}: {
  children: React.ReactNode;
  className?: string;
  surface?: 'cream' | 'dark' | 'lemon' | 'teal' | 'saffron' | 'white';
}) {
  const surfaceStyles = {
    cream: 'bg-[#F8F7F4] text-[#18181B] border border-zinc-200/90 card-elevated',
    white: 'bg-white text-[#18181B] border border-zinc-200/90 card-elevated',
    dark: 'bg-[#09090B] text-white border border-white/10 shadow-xl',
    lemon: 'bg-[#FEF3C7]/60 text-[#18181B] border border-amber-200 card-elevated',
    teal: 'bg-[#0F4C5C] text-white border border-[#0F4C5C] shadow-lg',
    saffron: 'bg-[#C84B13] text-white border border-[#C84B13] shadow-lg',
  }[surface];

  return (
    <div className={`rounded-2xl overflow-hidden ${surfaceStyles} ${className}`}>
      {children}
    </div>
  );
}

export function SectionLabel({
  number,
  label,
  dark = false,
}: {
  number: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-2.5 mb-3">
      <GemMarker size={8} color={dark ? '#F59E0B' : '#C84B13'} />
      <span
        className={`font-display text-xs font-semibold uppercase tracking-[0.14em] tabular-nums ${
          dark ? 'text-zinc-400' : 'text-zinc-500'
        }`}
      >
        {number} · {label}
      </span>
    </div>
  );
}

export function MarqueeStrip({
  items,
  dark = false,
}: {
  items: string[];
  dark?: boolean;
}) {
  return <RibbonType items={items} dark={dark} />;
}

export interface ToastState {
  message: string;
  type: 'success' | 'error';
}

export function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastState | null;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(onDismiss, 4500);
    return () => window.clearTimeout(id);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-16 md:bottom-6 right-4 md:right-6 z-50 max-w-sm rounded-xl bg-[#09090B] text-white border border-white/15 px-4 py-3.5 shadow-2xl flex items-center gap-3"
    >
      {toast.type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
      )}
      <p className="font-body text-sm leading-snug flex-1">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="p-1 text-zinc-400 hover:text-white cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#C84B13] origin-left z-50 pointer-events-none"
      style={{ scaleX }}
    />
  );
}

export function CustomCursor() {
  return null;
}
