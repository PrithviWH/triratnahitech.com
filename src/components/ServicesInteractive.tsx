import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import {
  FaqItem,
  SERVICE_FAQ_CATEGORIES,
  ServiceFaqItem,
} from '../data/siteData';
import {
  buildFaqJsonLd,
  filterByCategory,
  toggleAccordionId,
} from '../utils/siteLogic';
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

export function SplitAccordion({
  items,
}: {
  items: readonly (FaqItem | ServiceFaqItem)[];
}) {
  const normalizedItems: ServiceFaqItem[] = items.map((item) => ({
    ...item,
    category: 'category' in item ? item.category : 'Web Development',
  }));

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openId, setOpenId] = useState<string | null>(normalizedItems[0]?.id ?? null);

  const visibleItems = filterByCategory(normalizedItems, selectedCategory);
  const faqSchema = buildFaqJsonLd(normalizedItems);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const nextVisible = filterByCategory(normalizedItems, category);
    if (!nextVisible.some((item) => item.id === openId)) {
      setOpenId(nextVisible[0]?.id ?? null);
    }
  };

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Category Filter Bar & Local Pune Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div
          role="group"
          aria-label="Filter service FAQs by topic"
          className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-white border border-zinc-200/90 self-start"
        >
          {SERVICE_FAQ_CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={active}
                onClick={() => handleCategorySelect(category)}
                className={`relative px-3.5 py-2 rounded-lg font-display text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  active ? 'text-white' : 'text-zinc-600 hover:text-[#09090B]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="services-faq-filter-pill"
                    transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                    className="absolute inset-0 rounded-lg bg-[#09090B] shadow-xs"
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </div>

        <Link
          to="/contact"
          className="group inline-flex items-center gap-1.5 font-display text-xs sm:text-sm font-semibold text-[#C84B13] hover:text-[#09090B] transition-colors self-start md:self-auto"
        >
          <span>Have a specific project question? Ask our Pune team</span>
          <ArrowRight
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>

      {/* Accordion Items */}
      <div className="rounded-2xl overflow-hidden border border-zinc-200 divide-y divide-zinc-200 bg-white card-elevated">
        {visibleItems.map((item, idx) => {
          const isOpen = item.id === openId;
          const buttonId = `service-faq-trigger-${item.id}`;
          const panelId = `service-faq-panel-${item.id}`;

          return (
            <div
              key={item.id}
              className={`transition-colors duration-200 ${
                isOpen ? 'bg-[#F8F7F4]/80' : 'bg-white'
              }`}
            >
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId((prev) => toggleAccordionId(prev, item.id))}
                  className="w-full text-left px-6 py-5 sm:px-8 sm:py-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-zinc-50/80 transition-colors"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 text-xs font-display font-semibold tracking-wide text-zinc-500">
                      <span
                        className={`tabular-nums ${
                          isOpen ? 'text-[#C84B13]' : 'text-zinc-400'
                        }`}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#0F4C5C]">{item.category}</span>
                    </div>
                    <span className="block font-display font-bold text-base sm:text-xl leading-snug tracking-tight text-[#09090B]">
                      {item.question}
                    </span>
                  </div>

                  <span
                    aria-hidden="true"
                    className={`mt-1 w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-colors duration-200 ${
                      isOpen
                        ? 'bg-[#09090B] border-[#09090B] text-white'
                        : 'bg-white border-zinc-200 text-zinc-600'
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 sm:px-8 sm:pb-7 pt-0">
                      <p className="font-body text-sm sm:text-base leading-relaxed text-zinc-600 max-w-3xl">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

