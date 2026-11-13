import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { HOME_FAQ_CATEGORIES, HOME_FAQS, type HomeFaqItem } from '../data/siteData';
import { filterByCategory, toggleAccordionId } from '../utils/siteLogic';
import { SectionLabel } from './UiPrimitives';

export function HomeFaqAccordion({
  items = HOME_FAQS,
  sectionNumber = '06',
}: {
  items?: readonly HomeFaqItem[];
  sectionNumber?: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  const visibleItems = filterByCategory(items, selectedCategory);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const nextList = filterByCategory(items, category);
    if (!nextList.some((item) => item.id === openId)) {
      setOpenId(nextList[0]?.id ?? null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
      {/* Left Intro & Topic Filter Column */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
        <div>
          <SectionLabel number={sectionNumber} label="Common Questions" />
          <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-[#09090B] text-balance">
            SEO &amp; Web Development FAQs
          </h2>
          <p className="font-body text-base sm:text-lg leading-relaxed text-zinc-600 mt-4 max-w-md">
            Practical answers about how we design websites, strengthen search visibility, and support growing businesses.
          </p>
        </div>

        {/* Interactive Topic Filter */}
        <div
          role="group"
          aria-label="Filter frequently asked questions by topic"
          className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-zinc-100 border border-zinc-200/80"
        >
          {HOME_FAQ_CATEGORIES.map((category) => {
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
                    layoutId="home-faq-filter-pill"
                    transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                    className="absolute inset-0 rounded-lg bg-[#09090B] shadow-xs"
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <Link
            to="/services"
            className="group inline-flex items-center gap-1.5 font-display font-semibold text-[#B8420E] hover:text-[#09090B] transition-colors whitespace-nowrap"
          >
            <span>Explore all services</span>
            <ArrowRight
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
          <Link
            to="/contact"
            className="font-display font-semibold text-zinc-600 hover:text-[#09090B] transition-colors whitespace-nowrap"
          >
            Ask a specific question
          </Link>
        </div>
      </div>

      {/* Right Accordion List */}
      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-zinc-200 bg-white divide-y divide-zinc-200 card-elevated overflow-hidden">
          {visibleItems.map((item, idx) => {
            const isOpen = openId === item.id;
            const buttonId = `home-faq-trigger-${item.id}`;
            const panelId = `home-faq-panel-${item.id}`;

            return (
              <div
                key={item.id}
                className={`transition-colors duration-200 ${
                  isOpen ? 'bg-[#F8F7F4]/70' : 'bg-white'
                }`}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId((prev) => toggleAccordionId(prev, item.id))}
                    className="w-full text-left px-6 py-5 sm:px-7 sm:py-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-zinc-50/80 transition-colors"
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
                      <span className="block font-display font-bold text-base sm:text-lg leading-snug tracking-tight text-[#09090B]">
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
                      <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-0">
                        <p className="font-body text-sm sm:text-base leading-relaxed text-zinc-600 max-w-2xl">
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
    </div>
  );
}
