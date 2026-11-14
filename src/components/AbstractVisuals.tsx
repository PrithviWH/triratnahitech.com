import { motion } from 'motion/react';
import { HOME_COPY } from '../data/siteData';
import { GemLogo } from './GemMotif';

export function HeroBrowserMockup() {
  return (
    <div className="relative w-full max-w-xl ml-auto py-4">
      {/* Multi-layered ambient studio glow */}
      <div
        aria-hidden="true"
        className="absolute -inset-8 bg-gradient-to-tr from-[#C84B13]/14 via-amber-200/20 to-[#0F4C5C]/18 rounded-[2rem] blur-2xl pointer-events-none"
      />

      {/* Flagship Studio Showcase Frame */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl bg-white border border-zinc-200/90 shadow-[0_32px_70px_-18px_rgba(9,9,11,0.2)] overflow-hidden"
      >
        {/* Browser Chrome */}
        <div className="h-10 bg-zinc-50/90 px-4 flex items-center justify-between border-b border-zinc-200/80">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
          </div>
          <div className="px-3.5 py-1 rounded-md bg-white border border-zinc-200/80 text-[11px] font-medium text-zinc-500 shadow-2xs">
            triratnahitech.com
          </div>
          <div className="w-8" />
        </div>

        {/* Layered Agency Studio Preview */}
        <div className="p-5 sm:p-6 bg-[#FAFAFA] dot-grid-light space-y-4">
          {/* Dark Architectural Banner Inside Mockup */}
          <div className="relative rounded-xl bg-[#09090B] text-white p-5 overflow-hidden border border-white/10">
            <div
              aria-hidden="true"
              className="absolute top-0 right-0 w-40 h-40 bg-radial from-[#EA580C]/30 via-transparent to-transparent"
            />
            <div className="relative flex items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-400">
                  Triratna Studio
                </p>
                <p className="font-display font-bold text-base sm:text-lg tracking-tight text-white">
                  Web · SEO · Growth
                </p>
                <p className="text-xs text-zinc-400">
                  Responsive architecture &amp; search visibility
                </p>
              </div>
              <GemLogo size={46} darkBg />
            </div>
          </div>

          {/* 3 Architectural Craft Panels */}
          <div className="grid grid-cols-3 gap-3">
            {/* Panel 1: Responsive Grid */}
            <div className="rounded-xl bg-white border border-zinc-200/90 p-3.5 space-y-2.5 shadow-2xs">
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                Design
              </p>
              <div className="space-y-1.5">
                <div className="h-5 rounded-md bg-gradient-to-r from-amber-100/80 to-orange-100/70 border border-orange-200/60" />
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="h-5 rounded-md bg-zinc-100" />
                  <div className="h-5 rounded-md bg-zinc-100" />
                </div>
              </div>
            </div>

            {/* Panel 2: Channel Reach */}
            <div className="rounded-xl bg-[#0F4C5C] p-3.5 space-y-2.5 text-white shadow-xs">
              <p className="text-[10px] font-semibold text-teal-200 uppercase tracking-wider">
                Reach
              </p>
              <div className="flex items-end gap-1.5 h-11 pt-1">
                <motion.span
                  initial={{ scaleY: 0.4 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  style={{ originY: 1 }}
                  className="flex-1 rounded-sm bg-white/30 h-4"
                />
                <motion.span
                  initial={{ scaleY: 0.4 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  style={{ originY: 1 }}
                  className="flex-1 rounded-sm bg-amber-300 h-7"
                />
                <motion.span
                  initial={{ scaleY: 0.4 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                  style={{ originY: 1 }}
                  className="flex-1 rounded-sm bg-[#EA580C] h-10"
                />
              </div>
            </div>

            {/* Panel 3: Growth Spline */}
            <div className="rounded-xl bg-white border border-zinc-200/90 p-3.5 space-y-2 shadow-2xs">
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                Growth
              </p>
              <svg viewBox="0 0 64 36" className="w-full h-11" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="splineGradPremium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C84B13" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#C84B13" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M2 30 C 16 28, 22 14, 34 18 C 44 21, 50 8, 60 4 L 60 36 L 2 36 Z"
                  fill="url(#splineGradPremium)"
                />
                <motion.path
                  d="M2 30 C 16 28, 22 14, 34 18 C 44 21, 50 8, 60 4"
                  stroke="#C84B13"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, delay: 0.35 }}
                />
                <circle cx="60" cy="4" r="3" fill="#09090B" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Glass Badge: 6+ Years */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: 0.35 }}
        className="mt-4 sm:mt-0 sm:absolute sm:-left-6 sm:bottom-7 rounded-2xl bg-white/95 backdrop-blur-md text-[#09090B] border border-zinc-200/90 shadow-[0_18px_40px_-10px_rgba(9,9,11,0.2)] px-4 py-3 inline-flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-50 to-orange-100 border border-orange-200/70 flex items-center justify-center">
          <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <polygon points="9,1 17,9 9,17 1,9" fill="#C84B13" />
          </svg>
        </div>
        <div>
          <p className="font-display font-bold text-sm leading-none tabular-nums">
            {HOME_COPY.hero.badge}
          </p>
          <p className="text-[11px] font-medium text-zinc-500 mt-1">
            Pune Digital Studio
          </p>
        </div>
      </motion.div>
    </div>
  );
}
