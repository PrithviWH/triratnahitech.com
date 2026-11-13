import { motion } from 'motion/react';

export const BRAND_LOGO_SRC = '/assets/aistudio/Triratna_Hi-Tech_ae2dc234.jpg';

interface GemLogoProps {
  size?: number;
  animated?: boolean;
  darkBg?: boolean;
  className?: string;
}

export function GemLogo({
  size = 36,
  animated = false,
  darkBg = false,
  className = '',
}: GemLogoProps) {
  const frameClasses = `inline-flex items-center justify-center rounded-full bg-white overflow-hidden shrink-0 ${
    darkBg
      ? 'ring-2 ring-white/25 shadow-[0_6px_18px_-4px_rgba(0,0,0,0.45)]'
      : 'ring-1 ring-zinc-200/90 shadow-xs'
  } ${className}`;

  if (animated) {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: size, height: size }}
        className={frameClasses}
        aria-hidden="true"
      >
        <img
          src={BRAND_LOGO_SRC}
          alt=""
          className="w-full h-full object-contain p-[2px]"
          loading="eager"
          decoding="async"
        />
      </motion.span>
    );
  }

  return (
    <span
      style={{ width: size, height: size }}
      className={frameClasses}
      aria-hidden="true"
    >
      <img
        src={BRAND_LOGO_SRC}
        alt=""
        className="w-full h-full object-contain p-[2px]"
        loading="eager"
        decoding="async"
      />
    </span>
  );
}

export function GemMarker({
  size = 10,
  color = '#C84B13',
  className = '',
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <polygon points="8,1 15,8 8,15 1,8" fill={color} />
    </svg>
  );
}

export function GemDivider({ dark = false }: { dark?: boolean }) {
  return (
    <div className="w-full py-8 flex items-center gap-4" aria-hidden="true">
      <div
        className={`h-px flex-1 ${
          dark
            ? 'bg-gradient-to-r from-transparent via-white/15 to-white/5'
            : 'bg-gradient-to-r from-transparent via-zinc-300 to-zinc-200'
        }`}
      />
      <GemLogo size={28} darkBg={dark} />
      <div
        className={`h-px flex-1 ${
          dark
            ? 'bg-gradient-to-l from-transparent via-white/15 to-white/5'
            : 'bg-gradient-to-l from-transparent via-zinc-300 to-zinc-200'
        }`}
      />
    </div>
  );
}
