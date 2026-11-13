import { useState } from 'react';
import { ArrowRight, Globe2 } from 'lucide-react';
import { REGIONAL_SUPPORT_COPY } from '../data/siteData';
import type { RegionalLanguage } from '../utils/siteLogic';
import { Button } from './UiPrimitives';

const LANGUAGE_ORDER: RegionalLanguage[] = ['en', 'mr', 'hi'];

export function RegionalSummaryStrip() {
  const [lang, setLang] = useState<RegionalLanguage>('en');
  const active = REGIONAL_SUPPORT_COPY[lang];

  return (
    <div className="mt-10 rounded-2xl border border-zinc-200 bg-[#FAFAFA] p-6 sm:p-8 card-elevated">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-200/80">
        <div className="flex items-center gap-2.5 text-xs font-display font-semibold uppercase tracking-[0.12em] text-[#0F4C5C]">
          <Globe2 className="w-4 h-4 text-[#C84B13] shrink-0" aria-hidden="true" />
          <span>{active.eyebrow}</span>
        </div>

        <div
          role="tablist"
          aria-label="Choose quick summary language"
          className="inline-flex items-center rounded-xl border border-zinc-200 bg-white p-1 self-start sm:self-auto"
        >
          {LANGUAGE_ORDER.map((code) => {
            const option = REGIONAL_SUPPORT_COPY[code];
            const selected = lang === code;
            return (
              <button
                key={code}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setLang(code)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-display font-semibold transition-colors cursor-pointer ${
                  selected
                    ? 'bg-[#09090B] text-white'
                    : 'text-zinc-600 hover:text-[#09090B]'
                }`}
              >
                {option.nativeLabel}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-8 space-y-3" lang={active.code}>
          <h3 className="font-display font-bold text-xl sm:text-2xl leading-snug tracking-tight text-[#09090B]">
            {active.headline}
          </h3>
          <p className="font-body text-sm sm:text-base leading-relaxed text-zinc-600">
            {active.summary}
          </p>
          <ul className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-medium text-zinc-700">
            {active.highlights.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-zinc-200/90 bg-white px-3 py-2"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 lg:pt-1">
          <p className="font-body text-xs text-zinc-500 lg:text-right max-w-xs">
            English · मराठी · हिन्दी support for Pune &amp; regional portals
          </p>
          <Button
            to={lang === 'en' ? '/contact' : `/contact?lang=${lang}`}
            variant="primary"
          >
            <span>{active.ctaLabel}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
