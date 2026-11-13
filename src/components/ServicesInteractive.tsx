import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { FaqItem } from '../data/siteData';
import { GemMarker } from './GemMotif';

export function StickyStackCard({
  index,
  title,
  summary,
  accent,
  stackOffset,
}: {
  index: string;
  title: string;
  summary: string;
  accent: 'cream' | 'saffron' | 'teal';
  stackOffset: number;
}) {
  const palette = {
    cream: 'bg-white text-[#18181B] border-zinc-200 card-elevated',
    saffron: 'bg-[#09090B] text-white border-white/10 shadow-2xl',
    teal: 'bg-[#0F4C5C] text-white border-[#0F4C5C] shadow-xl',
  }[accent];

  return (
    <article
      className={`sticky rounded-2xl border p-8 sm:p-10 lg:p-12 transition-transform ${palette}`}
      style={{ top: `${84 + stackOffset * 28}px` }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-3 flex items-center gap-4">
          <span className="font-display font-bold text-4xl sm:text-5xl tabular-nums tracking-tight opacity-90">
            {index}
          </span>
          <GemMarker
            size={12}
            color={accent === 'cream' ? '#C84B13' : '#F59E0B'}
          />
        </div>
        <div className="lg:col-span-9 space-y-3">
          <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
            {title}
          </h2>
          <p className="font-body text-base sm:text-lg leading-relaxed max-w-2xl opacity-85">
            {summary}
          </p>
        </div>
      </div>
    </article>
  );
}

export function SplitAccordion({ items }: { items: FaqItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  if (isDesktop) {
    return (
      <div className="grid grid-cols-12 rounded-2xl overflow-hidden border border-zinc-200 bg-white card-elevated">
        <div className="col-span-6 border-r border-zinc-200 divide-y divide-zinc-200">
          {items.map((item, idx) => {
            const isSelected = item.id === activeItem?.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-expanded={isSelected}
                onClick={() => setActiveId(item.id)}
                className={`w-full text-left px-6 py-5 flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-50 text-[#09090B]'
                    : 'bg-white text-zinc-600 hover:text-[#09090B] hover:bg-zinc-50/60'
                }`}
              >
                <div className="flex items-baseline gap-3.5">
                  <span
                    className={`font-display text-xs font-semibold tabular-nums ${
                      isSelected ? 'text-[#C84B13]' : 'text-zinc-400'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <span className="font-display font-semibold text-base tracking-tight">
                    {item.question}
                  </span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isSelected ? 'translate-x-1 text-[#C84B13]' : 'text-zinc-400'
                  }`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>

        <div
          role="region"
          aria-live="polite"
          className="col-span-6 p-10 bg-[#09090B] text-white flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-5">
              <GemMarker size={8} color="#EA580C" />
              <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-amber-400">
                Answer
              </span>
            </div>
            <h3 className="font-display font-bold text-2xl leading-snug mb-4">
              {activeItem?.question}
            </h3>
            <p className="font-body text-base leading-relaxed text-zinc-300">
              {activeItem?.answer}
            </p>
          </div>
          <p className="text-xs text-zinc-500 pt-8 border-t border-white/10">
            Triratna Hi-Tech · Service FAQs
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-zinc-200 divide-y divide-zinc-200 bg-white card-elevated">
      {items.map((item, idx) => {
        const isOpen = item.id === activeId;
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setActiveId(isOpen ? '' : item.id)}
              className={`w-full text-left px-5 py-4 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                isOpen ? 'bg-zinc-50 text-[#09090B]' : 'bg-white text-zinc-800'
              }`}
            >
              <span className="font-display font-semibold text-sm sm:text-base">
                <span className="text-xs font-semibold text-[#C84B13] mr-2.5 tabular-nums">
                  0{idx + 1}
                </span>
                {item.question}
              </span>
              <ChevronDown
                className={`w-4 h-4 shrink-0 text-zinc-500 transition-transform ${
                  isOpen ? 'rotate-180 text-[#C84B13]' : ''
                }`}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <div className="px-5 py-4 bg-[#09090B] text-zinc-300 font-body text-sm leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
