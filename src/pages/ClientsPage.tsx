import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { CLIENT_CATEGORIES, CLIENTS_DATA, HOME_COPY } from '../data/siteData';
import { filterByCategory } from '../utils/siteLogic';
import { Button, ChamferCard, SectionLabel } from '../components/UiPrimitives';
import { GemMarker } from '../components/GemMotif';

export default function ClientsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const filteredClients = filterByCategory(CLIENTS_DATA, selectedCategory);

  return (
    <div>
      <section className="bg-[#FAFAFA] dot-grid-light border-b border-zinc-200/80 pt-14 pb-16 sm:pt-20 sm:pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionLabel number="01" label="Collaborations" />
          <h1 className="font-display font-extrabold text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight text-[#09090B]">
            {HOME_COPY.clientsSection.title}
          </h1>
          <p className="font-body text-lg sm:text-xl text-zinc-600 mt-4 max-w-2xl">
            {HOME_COPY.clientsSection.text}
          </p>

          <div
            role="group"
            aria-label="Filter clients by industry"
            className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-zinc-100 border border-zinc-200/80 mt-8"
          >
            {CLIENT_CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative px-4 py-2 rounded-lg font-display text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    active ? 'text-white' : 'text-zinc-600 hover:text-[#09090B]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="clients-filter-pill"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-lg bg-[#09090B] shadow-xs"
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* TODO: Replace monogram badges with real client logo SVG/image assets when supplied */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client, idx) => (
              <ChamferCard
                key={client.id}
                surface="white"
                className="group relative p-7 min-h-[220px] flex flex-col justify-between card-elevated-hover"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200/70 flex items-center justify-center font-display font-bold text-base text-[#C84B13]">
                    {client.monogram}
                  </div>
                  <span className="text-xs font-medium text-zinc-500 tabular-nums">
                    0{idx + 1} · {client.category}
                  </span>
                </div>

                <div className="pt-8">
                  <h2 className="font-display font-bold text-2xl tracking-tight text-[#09090B] group-hover:text-[#C84B13] transition-colors">
                    {client.name}
                  </h2>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
                  <p className="font-body text-sm text-zinc-600">{client.focus}</p>
                  <GemMarker size={8} color="#0F4C5C" className="shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              </ChamferCard>
            ))}
          </div>

          <div className="mt-16 pt-10 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="font-body text-base sm:text-lg text-zinc-600">
              Ready to build your digital presence with our Pune team?
            </p>
            <Button to="/contact" variant="primary" magnetic>
              <span>Let&apos;s Talk</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
