import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { TestimonialItem } from '../data/siteData';
import { getNextIndex, getPrevIndex } from '../utils/siteLogic';
import { GemMarker } from './GemMotif';

export function QuoteCarousel({ items }: { items: TestimonialItem[] }) {
  const [index, setIndex] = useState(0);
  const current = items[index] ?? items[0];

  const handlePrev = () => setIndex((prev) => getPrevIndex(prev, items.length));
  const handleNext = () => setIndex((prev) => getNextIndex(prev, items.length));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  if (!current) return null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C84B13] rounded-2xl"
    >
      {/* Subtle stacked depth layers */}
      <div
        aria-hidden="true"
        className="hidden sm:block absolute inset-x-4 -bottom-3 h-8 rounded-2xl bg-zinc-200/70 border border-zinc-300/60"
      />

      <div className="relative rounded-2xl bg-[#09090B] text-white border border-white/10 shadow-2xl p-8 sm:p-12 lg:p-14">
        <div className="flex items-start justify-between gap-4 mb-6">
          <span
            aria-hidden="true"
            className="font-serif-accent italic text-7xl sm:text-8xl leading-none text-[#EA580C] select-none"
          >
            &ldquo;
          </span>
          <span className="font-display text-xs font-medium uppercase tracking-[0.14em] text-zinc-400 tabular-nums">
            {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>
        </div>

        <blockquote className="font-display font-semibold text-xl sm:text-2xl lg:text-3xl leading-snug tracking-tight max-w-3xl mb-8 text-zinc-100">
          &ldquo;{current.quote}&rdquo;
        </blockquote>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2.5">
            <GemMarker size={8} color="#F59E0B" />
            <p className="font-body text-sm text-zinc-400">{current.attribution}</p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 text-white border border-white/15 cursor-pointer hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#C84B13] text-white cursor-pointer hover:bg-[#EA580C] transition-colors"
            >
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
