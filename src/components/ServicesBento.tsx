import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Compass,
  Globe,
  Layers,
  Monitor,
  Search,
  Smartphone,
} from 'lucide-react';
import { HOME_COPY } from '../data/siteData';
import { GemMarker } from './GemMotif';

type DeviceMode = 'desktop' | 'mobile';
type GuidanceTopicId = 'growth' | 'reputation' | 'ai' | 'skills';

interface GuidanceTopic {
  id: GuidanceTopicId;
  label: string;
  heading: string;
  summary: string;
  step: string;
}

const GUIDANCE_TOPICS: GuidanceTopic[] = [
  {
    id: 'growth',
    label: 'Business Growth',
    heading: 'Clear digital direction',
    summary:
      'Structured plans for business setup, customer outreach, and steady online expansion.',
    step: '01',
  },
  {
    id: 'reputation',
    label: 'Online Reputation',
    heading: 'Trusted local presence',
    summary:
      'Consistent profiles, Google listings, and clear communication that build customer confidence.',
    step: '02',
  },
  {
    id: 'ai',
    label: 'AI Tools',
    heading: 'Practical AI workflows',
    summary:
      'Hands-on guidance to adopt everyday AI tools without complexity or guesswork.',
    step: '03',
  },
  {
    id: 'skills',
    label: 'Digital Skills',
    heading: 'Confident team execution',
    summary:
      'Step-by-step training so your team can manage content, campaigns, and updates smoothly.',
    step: '04',
  },
];

function CopperBentoCard({
  children,
  surface = 'white',
  className = '',
}: {
  children: React.ReactNode;
  surface?: 'white' | 'alabaster';
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--copper-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--copper-y', `${e.clientY - rect.top}px`);
  };

  const bgClass = surface === 'alabaster' ? 'bg-[#F8F7F4]' : 'bg-white';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-2xl overflow-hidden border border-zinc-200/90 ${bgClass} shadow-[0_1px_2px_rgba(9,9,11,0.03),0_12px_32px_-12px_rgba(9,9,11,0.07)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[#C84B13]/45 hover:shadow-[0_24px_54px_-16px_rgba(200,75,19,0.14),0_8px_20px_-10px_rgba(9,9,11,0.07)] ${className}`}
    >
      {/* Pointer-following warm copper sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(520px circle at var(--copper-x, 50%) var(--copper-y, 30%), rgba(200, 75, 19, 0.085), transparent 62%)',
        }}
      />
      {/* Subtle bottom copper hairline sweep on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#C84B13]/70 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

function WebStudioPreview({ mode, onModeChange }: { mode: DeviceMode; onModeChange: (m: DeviceMode) => void }) {
  return (
    <div className="rounded-xl bg-white border border-zinc-200/90 shadow-[0_14px_38px_-14px_rgba(9,9,11,0.12)] overflow-hidden">
      {/* Studio Browser Chrome + Working Responsive View Switcher */}
      <div className="h-11 bg-zinc-50/90 px-3.5 sm:px-4 flex items-center justify-between gap-3 border-b border-zinc-200/80">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 group-hover:bg-[#C84B13]/70 transition-colors" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 group-hover:bg-amber-400/80 transition-colors" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 group-hover:bg-[#0F4C5C]/70 transition-colors" />
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-zinc-200/80 text-[11px] font-medium text-zinc-600 truncate">
            <Globe className="w-3 h-3 text-[#C84B13] shrink-0" aria-hidden="true" />
            <span className="truncate">triratnahitech.in</span>
          </div>
        </div>

        {/* Interactive Desktop / Mobile Segmented Control */}
        <div
          role="group"
          aria-label="Website preview device layout"
          className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-zinc-200/70 shrink-0"
        >
          <button
            type="button"
            onClick={() => onModeChange('desktop')}
            aria-pressed={mode === 'desktop'}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-display font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-all duration-150 ${
              mode === 'desktop'
                ? 'bg-white text-[#09090B] shadow-2xs'
                : 'text-zinc-600 hover:text-[#09090B]'
            }`}
          >
            <Monitor className="w-3 h-3 text-[#C84B13]" aria-hidden="true" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange('mobile')}
            aria-pressed={mode === 'mobile'}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-display font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-all duration-150 ${
              mode === 'mobile'
                ? 'bg-white text-[#09090B] shadow-2xs'
                : 'text-zinc-600 hover:text-[#09090B]'
            }`}
          >
            <Smartphone className="w-3 h-3 text-[#0F4C5C]" aria-hidden="true" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* Live Miniature Viewport Stage */}
      <div className="p-4 sm:p-5 bg-[#FAFAFA] dot-grid-light min-h-[252px] flex items-center justify-center">
        {mode === 'desktop' ? (
          <motion.div
            key="desktop"
            initial={{ opacity: 0.35, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="w-full space-y-3"
          >
            {/* Miniature Top Site Bar */}
            <div className="rounded-lg bg-white border border-zinc-200/80 px-3.5 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rotate-45 bg-[#C84B13] inline-block" aria-hidden="true" />
                <span className="font-display font-bold text-xs text-[#09090B]">
                  Custom Business Site
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-[11px] font-medium text-zinc-500">
                <span>Home</span>
                <span>Services</span>
                <span>Contact</span>
              </div>
            </div>

            {/* Miniature Hero & Feature Grid */}
            <div className="grid grid-cols-12 gap-3 items-stretch">
              <div className="col-span-12 sm:col-span-7 rounded-xl bg-white border border-zinc-200/90 p-4 flex flex-col justify-between gap-3 transition-transform duration-200 group-hover:-translate-y-0.5">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-display font-semibold uppercase tracking-[0.14em] text-[#C84B13]">
                    Responsive Architecture
                  </p>
                  <p className="font-display font-bold text-sm sm:text-base leading-snug text-[#09090B]">
                    Fast layout built around your goals
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#09090B] text-white text-[10px] font-display font-semibold">
                    Get Started
                  </span>
                  <span className="h-2 w-16 rounded-full bg-zinc-200" />
                </div>
              </div>

              <div className="col-span-12 sm:col-span-5 rounded-xl bg-[#0F4C5C] text-white p-4 flex flex-col justify-between gap-3 transition-transform duration-200 group-hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <Layers className="w-4 h-4 text-amber-300" aria-hidden="true" />
                  <span className="text-[10px] font-display font-semibold uppercase tracking-[0.14em] text-teal-200">
                    Scalable
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-4/5 rounded-full bg-white/85" />
                  <div className="h-2 w-3/5 rounded-full bg-amber-300/80" />
                  <div className="h-2 w-2/3 rounded-full bg-white/30" />
                </div>
              </div>
            </div>

            {/* Bottom Feature Modules */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { title: 'Clean Code', accent: 'bg-[#C84B13]' },
                { title: 'Mobile Ready', accent: 'bg-[#0F4C5C]' },
                { title: 'SEO Structure', accent: 'bg-amber-500' },
              ].map((mod) => (
                <div
                  key={mod.title}
                  className="rounded-lg bg-white border border-zinc-200/80 px-3 py-2.5 flex items-center gap-2"
                >
                  <span className={`w-2 h-2 rounded-xs shrink-0 ${mod.accent}`} aria-hidden="true" />
                  <span className="text-[11px] font-display font-semibold text-zinc-700 whitespace-nowrap">
                    {mod.title}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="mobile"
            initial={{ opacity: 0.35, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col sm:flex-row items-center justify-center gap-4"
          >
              {/* Crisp Mobile Viewport Frame */}
              <div className="w-48 rounded-[1.25rem] bg-[#09090B] p-2 shadow-lg border border-zinc-800 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5">
                <div className="rounded-[0.95rem] bg-white p-3 space-y-2.5">
                  <div className="w-10 h-1 rounded-full bg-zinc-200 mx-auto" aria-hidden="true" />
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[10px] font-display font-bold text-[#09090B]">
                      Mobile Screen
                    </span>
                    <span className="w-2 h-2 rotate-45 bg-[#C84B13]" aria-hidden="true" />
                  </div>
                  <div className="rounded-lg bg-[#FFF7ED] border border-orange-200/80 p-2.5 space-y-1">
                    <div className="h-1.5 w-12 rounded-full bg-[#C84B13]" />
                    <div className="h-2 w-full rounded-full bg-[#09090B]/85" />
                    <div className="h-1.5 w-4/5 rounded-full bg-zinc-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="h-9 rounded-md bg-[#0F4C5C] p-1.5 flex items-end">
                      <span className="h-1 w-6 rounded-full bg-amber-300" />
                    </div>
                    <div className="h-9 rounded-md bg-zinc-100 border border-zinc-200/80 p-1.5 flex items-end">
                      <span className="h-1 w-6 rounded-full bg-zinc-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Companion Layout Notes */}
              <div className="flex-1 max-w-xs space-y-2.5">
                <div className="rounded-xl bg-white border border-zinc-200/90 p-3.5 space-y-1">
                  <p className="text-[10px] font-display font-semibold uppercase tracking-[0.14em] text-[#0F4C5C]">
                    Adaptive Grid
                  </p>
                  <p className="font-body text-xs leading-relaxed text-zinc-600">
                    Every layout scales cleanly across phones, tablets, and desktops without clutter.
                  </p>
                </div>
                <div className="rounded-xl bg-white border border-zinc-200/90 p-3.5 space-y-1">
                  <p className="text-[10px] font-display font-semibold uppercase tracking-[0.14em] text-[#C84B13]">
                    Ready To Expand
                  </p>
                  <p className="font-body text-xs leading-relaxed text-zinc-600">
                    Add new pages, catalogs, or lead forms smoothly as your business grows.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
      </div>
    </div>
  );
}

type MarketingChannelId = 'seo' | 'ads' | 'social';

const MARKETING_CHANNELS: {
  id: MarketingChannelId;
  name: string;
  detail: string;
  barWidth: string;
  color: string;
}[] = [
  {
    id: 'seo',
    name: 'SEO & Local Search',
    detail: 'On-page clarity & Google visibility',
    barWidth: 'w-4/5',
    color: 'bg-[#0F4C5C]',
  },
  {
    id: 'ads',
    name: 'Paid Ads',
    detail: 'Targeted search & social reach',
    barWidth: 'w-3/4',
    color: 'bg-[#C84B13]',
  },
  {
    id: 'social',
    name: 'Social & Promotion',
    detail: 'Consistent campaigns for customers',
    barWidth: 'w-2/3',
    color: 'bg-amber-500',
  },
];

function MarketingStudioPreview() {
  const [activeChannel, setActiveChannel] = useState<MarketingChannelId>('seo');
  const currentChannel =
    MARKETING_CHANNELS.find((ch) => ch.id === activeChannel) ??
    MARKETING_CHANNELS[0];

  return (
    <div className="rounded-xl bg-[#FAFAFA] dot-grid-light border border-zinc-200/90 p-4 space-y-3 h-[232px] flex flex-col justify-between overflow-hidden">
      {/* Miniature Search Query Bar */}
      <div className="rounded-lg bg-white border border-zinc-200/90 px-3 py-2 flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2 min-w-0">
          <Search className="w-3.5 h-3.5 text-[#C84B13] shrink-0" aria-hidden="true" />
          <span className="text-xs font-body text-zinc-700 truncate">
            Pune business visibility &amp; customer reach
          </span>
        </div>
        <span className="text-[10px] font-display font-semibold text-[#0F4C5C] shrink-0">
          Search
        </span>
      </div>

      {/* Channel Hierarchy + Smooth Spline Graph */}
      <div className="grid grid-cols-12 gap-3 items-stretch flex-1 min-h-0">
        <div
          role="group"
          aria-label="Marketing channels"
          className="col-span-7 space-y-2 flex flex-col justify-center"
        >
          {MARKETING_CHANNELS.map((ch) => {
            const isSelected = ch.id === activeChannel;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => setActiveChannel(ch.id)}
                aria-pressed={isSelected}
                className={`w-full text-left rounded-lg bg-white px-2.5 py-2 space-y-1 cursor-pointer transition-all duration-150 border ${
                  isSelected
                    ? 'border-[#C84B13]/45 shadow-2xs translate-x-0.5'
                    : 'border-zinc-200/80 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-display font-semibold text-[#09090B] truncate">
                    {ch.name}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                  <div className={`h-full rounded-full ${ch.barWidth} ${ch.color}`} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="col-span-5 rounded-xl bg-white border border-zinc-200/90 p-3 flex flex-col justify-between transition-transform duration-200 group-hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-display font-semibold uppercase tracking-wider text-zinc-500">
              Reach
            </span>
            <span className="w-2 h-2 rotate-45 bg-[#C84B13]" aria-hidden="true" />
          </div>
          <svg viewBox="0 0 110 64" className="w-full h-20" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="marketingAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C84B13" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#C84B13" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="4" y1="56" x2="106" y2="56" stroke="#E4E4E7" strokeWidth="1.2" />
            <path
              d="M6 52 C 26 48, 38 34, 58 30 C 76 26, 86 14, 102 8 L 102 56 L 6 56 Z"
              fill="url(#marketingAreaGrad)"
            />
            <motion.path
              d="M6 52 C 26 48, 38 34, 58 30 C 76 26, 86 14, 102 8"
              stroke="#C84B13"
              strokeWidth="2.4"
              strokeLinecap="round"
              initial={{ pathLength: 0.25 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            />
            <circle cx="102" cy="8" r="3.5" fill="#0F4C5C" />
          </svg>
          <span className="text-[10px] font-body text-zinc-600 leading-tight line-clamp-2">
            {currentChannel.detail}
          </span>
        </div>
      </div>
    </div>
  );
}

function GuidanceWorkspacePreview({
  activeTopic,
  onSelectTopic,
}: {
  activeTopic: GuidanceTopicId;
  onSelectTopic: (id: GuidanceTopicId) => void;
}) {
  const current =
    GUIDANCE_TOPICS.find((t) => t.id === activeTopic) ?? GUIDANCE_TOPICS[0];

  return (
    <div className="rounded-xl bg-white border border-zinc-200/90 p-4 space-y-3 h-[232px] flex flex-col justify-between overflow-hidden">
      {/* Workspace Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
        <div className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-[#C84B13]" aria-hidden="true" />
          <span className="text-xs font-display font-semibold text-[#09090B]">
            Advisory &amp; Support Workspace
          </span>
        </div>
        <span className="text-[11px] font-display font-semibold text-[#0F4C5C] tabular-nums">
          {current.step} / 04
        </span>
      </div>

      {/* Interactive Focus Selector Grid */}
      <div
        role="group"
        aria-label="Guidance advisory focus areas"
        className="grid grid-cols-2 gap-1.5"
      >
        {GUIDANCE_TOPICS.map((topic) => {
          const isSelected = topic.id === activeTopic;
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => onSelectTopic(topic.id)}
              aria-pressed={isSelected}
              className={`px-2.5 py-1.5 rounded-lg text-left text-[11px] font-display font-semibold whitespace-nowrap truncate cursor-pointer transition-all duration-150 border ${
                isSelected
                  ? 'bg-[#FFF7ED] text-[#B8420E] border-[#C84B13]/40 shadow-2xs'
                  : 'bg-zinc-50 text-zinc-600 border-zinc-200/70 hover:text-[#09090B] hover:border-zinc-300'
              }`}
            >
              <span className="tabular-nums opacity-70 mr-1.5">{topic.step}.</span>
              {topic.label}
            </button>
          );
        })}
      </div>

      {/* Selected Focus Brief Panel */}
      <motion.div
        key={current.id}
        initial={{ opacity: 0.35, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-lg bg-[#F8F7F4] border border-zinc-200/80 px-3.5 py-2.5 flex-1 flex flex-col justify-center"
      >
        <p className="font-display font-bold text-xs text-[#09090B]">
          {current.heading}
        </p>
        <p className="font-body text-xs leading-snug text-zinc-600 mt-1 line-clamp-2">
          {current.summary}
        </p>
      </motion.div>
    </div>
  );
}

export function ServicesBento() {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [guidanceTopic, setGuidanceTopic] = useState<GuidanceTopicId>('growth');

  const webTile = HOME_COPY.services.tiles[0];
  const marketingTile = HOME_COPY.services.tiles[1];
  const guidanceTile = HOME_COPY.services.tiles[2];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* 01 · Flagship Wide Top Card */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.4 }}
        className="lg:col-span-12"
      >
        <CopperBentoCard surface="alabaster" className="p-7 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Editorial Copy Column */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              <div className="flex items-center justify-between gap-4">
                <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-[#0F4C5C] tabular-nums">
                  {webTile.number} · Web Craft
                </span>
                <GemMarker size={10} color="#C84B13" />
              </div>

              <div className="space-y-3">
                <h3 className="font-display font-bold text-2xl sm:text-3xl lg:text-[2.15rem] leading-[1.12] tracking-tight text-[#09090B] text-balance group-hover:text-[#B8420E] transition-colors">
                  {webTile.title}
                </h3>
                <p className="font-body text-base sm:text-lg leading-relaxed text-zinc-600">
                  {webTile.description}
                </p>
              </div>

              <div className="pt-1">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-[#B8420E] hover:text-[#09090B] transition-colors"
                >
                  <span>Explore Service</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>

            {/* Interactive Studio Browser Stage */}
            <div className="lg:col-span-7">
              <WebStudioPreview mode={deviceMode} onModeChange={setDeviceMode} />
            </div>
          </div>
        </CopperBentoCard>
      </motion.div>

      {/* 02 · Balanced Bottom Left Card */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.4, delay: 0.06 }}
        className="lg:col-span-6 flex"
      >
        <CopperBentoCard surface="white" className="w-full p-7 sm:p-9">
          <div className="h-full flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-zinc-600 tabular-nums">
                  {marketingTile.number} · Search &amp; Social
                </span>
                <GemMarker size={10} color="#0F4C5C" />
              </div>

              <MarketingStudioPreview />
            </div>

            <div className="space-y-3 pt-1">
              <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight text-[#09090B] text-balance group-hover:text-[#B8420E] transition-colors">
                {marketingTile.title}
              </h3>
              <p className="font-body text-sm sm:text-base leading-relaxed text-zinc-600">
                {marketingTile.description}
              </p>
              <div className="pt-1">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-[#B8420E] hover:text-[#09090B] transition-colors"
                >
                  <span>Explore Service</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        </CopperBentoCard>
      </motion.div>

      {/* 03 · Balanced Bottom Right Card */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.4, delay: 0.12 }}
        className="lg:col-span-6 flex"
      >
        <CopperBentoCard surface="alabaster" className="w-full p-7 sm:p-9">
          <div className="h-full flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-[#0F4C5C] tabular-nums">
                  {guidanceTile.number} · Advisory &amp; AI
                </span>
                <GemMarker size={10} color="#C84B13" />
              </div>

              <GuidanceWorkspacePreview
                activeTopic={guidanceTopic}
                onSelectTopic={setGuidanceTopic}
              />
            </div>

            <div className="space-y-3 pt-1">
              <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight text-[#09090B] text-balance group-hover:text-[#B8420E] transition-colors">
                {guidanceTile.title}
              </h3>
              <p className="font-body text-sm sm:text-base leading-relaxed text-zinc-600">
                {guidanceTile.description}
              </p>
              <div className="pt-1">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-[#B8420E] hover:text-[#09090B] transition-colors"
                >
                  <span>Explore Service</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        </CopperBentoCard>
      </motion.div>
    </div>
  );
}
