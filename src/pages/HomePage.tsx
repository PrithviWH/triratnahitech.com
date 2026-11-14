import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Code2, Sparkles, TrendingUp } from 'lucide-react';
import { HOME_COPY } from '../data/siteData';
import {
  Button,
  MarqueeStrip,
  SectionLabel,
} from '../components/UiPrimitives';
import { GemDivider, GemMarker } from '../components/GemMotif';
import { HeroBrowserMockup } from '../components/AbstractVisuals';
import { ServicesBento } from '../components/ServicesBento';
import { ShatterSegment, ShatterType } from '../components/ShatterType';
import { ShinyText } from '../components/ShinyText';
import { HomeFaqAccordion } from '../components/HomeFaqAccordion';
import { SeoAuditTool } from '../components/SeoAuditTool';
import { RegionalSummaryStrip } from '../components/RegionalSummaryStrip';
import { ClientsProjectsShowcase } from '../components/ClientsProjectsShowcase';

const HERO_SHATTER_SEGMENTS: ShatterSegment[] = [
  {
    text: 'Ideas',
    className: 'font-display font-extrabold text-[#09090B]',
    tint: '#09090B',
  },
  {
    text: 'Into',
    className: 'font-serif-accent italic font-normal text-[#0F4C5C]',
    tint: '#0F4C5C',
  },
  {
    text: 'Impact',
    className: 'font-display font-extrabold text-[#C84B13]',
    tint: '#C84B13',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* 1. HERO */}
      <section className="relative bg-[#FAFAFA] dot-grid-light border-b border-zinc-200/80 pt-14 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-[640px] h-[640px] bg-radial from-orange-100/50 via-transparent to-transparent pointer-events-none"
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-zinc-600">
                <GemMarker size={8} color="#C84B13" />
                <span className="tabular-nums">{HOME_COPY.hero.badge} · Pune</span>
              </div>

              <ShatterType
                segments={HERO_SHATTER_SEGMENTS}
                className="font-display font-extrabold text-[clamp(2.85rem,6.5vw,5.4rem)] leading-[0.98] tracking-[-0.035em] text-[#09090B] text-balance"
              />

              <p className="font-body text-lg sm:text-xl leading-relaxed text-zinc-600 max-w-xl">
                {HOME_COPY.hero.sub}
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-3.5">
                <Button to="/contact" variant="primary" magnetic>
                  <span>{HOME_COPY.hero.cta}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
                <Button to="/services" variant="ghost">
                  <span>Explore Services</span>
                </Button>
              </div>

              <div className="pt-5 border-t border-zinc-200/80 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-zinc-500">
                <span>Website Development</span>
                <span aria-hidden="true">·</span>
                <span>SEO &amp; Paid Ads</span>
                <span aria-hidden="true">·</span>
                <span>Practical Guidance</span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <HeroBrowserMockup />
            </div>
          </div>
        </div>
      </section>

      <MarqueeStrip
        items={[
          'Website Design & Development',
          'SEO & Paid Campaigns',
          'Digital Marketing Pune',
          'Practical Guidance',
        ]}
      />

      {/* 2. ABOUT TEASER */}
      <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
        {/* Subtle background ambient mesh */}
        <div
          aria-hidden="true"
          className="absolute -top-40 right-0 w-96 h-96 bg-radial from-[#C84B13]/5 via-transparent to-transparent pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Studio Milestone & Credibility Card */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5"
            >
              <SectionLabel number="01" label="Experience" />

              <div className="relative rounded-3xl border border-zinc-200/90 bg-gradient-to-b from-white via-zinc-50/70 to-[#FAFAFA] p-7 sm:p-9 shadow-[0_24px_55px_-18px_rgba(9,9,11,0.08)] overflow-hidden">
                {/* Copper Specular Hairline */}
                <div
                  aria-hidden="true"
                  className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#C84B13]/60 to-transparent pointer-events-none"
                />

                {/* Decorative Warm Radial Glow */}
                <div
                  aria-hidden="true"
                  className="absolute -top-16 -right-16 w-48 h-48 bg-radial from-[#EA580C]/15 via-transparent to-transparent pointer-events-none"
                />

                {/* Top Badge: Verified Record */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200/80 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
                    <span className="font-display text-[11px] font-semibold tracking-wide uppercase text-zinc-700">
                      Est. 2020 · Pune, India
                    </span>
                  </div>
                  <span className="font-display text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#0F4C5C]/80">
                    Proven Agency Record
                  </span>
                </div>

                {/* Hero Stat: 6+ */}
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2.5">
                    <p
                      aria-label="Over 6 years of experience"
                      className="font-display font-black text-[clamp(4.8rem,9.5vw,7.8rem)] leading-[0.85] tracking-tighter bg-gradient-to-br from-[#09090B] via-[#18181B] to-[#C84B13] bg-clip-text text-transparent tabular-nums select-none"
                    >
                      6+
                    </p>
                    <span className="font-serif-accent italic text-2xl sm:text-3xl text-[#C84B13] font-medium">
                      Years
                    </span>
                  </div>

                  <p className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-[#0F4C5C]">
                    Helping Businesses Grow &amp; Scale
                  </p>
                  <p className="font-body text-xs sm:text-sm text-zinc-500 leading-relaxed">
                    Transforming ambition into high-converting web applications, dominant SEO search visibility, and repeatable digital growth channels.
                  </p>
                </div>

                {/* Micro-metrics bento strip */}
                <div className="mt-7 pt-6 border-t border-zinc-200/80 grid grid-cols-2 gap-3.5">
                  <div className="rounded-xl bg-white/90 border border-zinc-200/80 p-3 shadow-2xs">
                    <span className="block font-display font-extrabold text-lg text-[#09090B] tabular-nums">
                      12+
                    </span>
                    <span className="block font-body text-[11px] text-zinc-500 font-medium">
                      Live Client Platforms
                    </span>
                  </div>
                  <div className="rounded-xl bg-white/90 border border-zinc-200/80 p-3 shadow-2xs">
                    <span className="block font-display font-extrabold text-lg text-[#09090B] tabular-nums">
                      100%
                    </span>
                    <span className="block font-body text-[11px] text-zinc-500 font-medium">
                      Founder-Led Execution
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Editorial Narrative & Action Hub */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="space-y-3">
                <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-[#09090B] text-balance leading-[1.08]">
                  About Triratna{' '}
                  <span className="font-serif-accent italic font-normal text-[#C84B13]">
                    Hi-Tech
                  </span>
                </h2>
                <p className="font-display text-sm sm:text-base font-semibold text-zinc-700">
                  Engineering practical digital growth for ambitious enterprises and regional leaders.
                </p>
              </div>

              <p className="font-body text-base sm:text-lg leading-relaxed text-zinc-600">
                {HOME_COPY.aboutTeaser.text} Built on deep technical expertise and genuine commercial clarity, we eliminate agency guesswork with clean code, data-driven organic search, and direct, hands-on guidance.
              </p>

              {/* 3 Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 pb-1">
                <div className="rounded-xl border border-zinc-200/90 bg-[#FAFAFA] p-3.5 space-y-1.5 transition-colors hover:border-[#C84B13]/40">
                  <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200/80 flex items-center justify-center text-[#C84B13] shadow-2xs">
                    <Code2 className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <h3 className="font-display font-bold text-xs text-[#09090B]">
                    Custom Web Apps
                  </h3>
                  <p className="font-body text-[11px] text-zinc-500 leading-snug">
                    Lightning-fast, mobile-first architectures designed to convert.
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-200/90 bg-[#FAFAFA] p-3.5 space-y-1.5 transition-colors hover:border-[#C84B13]/40">
                  <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200/80 flex items-center justify-center text-[#0F4C5C] shadow-2xs">
                    <TrendingUp className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <h3 className="font-display font-bold text-xs text-[#09090B]">
                    Organic SEO &amp; Ads
                  </h3>
                  <p className="font-body text-[11px] text-zinc-500 leading-snug">
                    First-page Google rankings &amp; high-intent paid campaigns.
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-200/90 bg-[#FAFAFA] p-3.5 space-y-1.5 transition-colors hover:border-[#C84B13]/40">
                  <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200/80 flex items-center justify-center text-[#EA580C] shadow-2xs">
                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <h3 className="font-display font-bold text-xs text-[#09090B]">
                    Direct Advisory
                  </h3>
                  <p className="font-body text-[11px] text-zinc-500 leading-snug">
                    1-on-1 strategic guidance with zero agency bureaucracy.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button to="/about#team" variant="primary">
                  <span>{HOME_COPY.aboutTeaser.cta}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>

                <Button to="/projects" variant="ghost">
                  <span>View Our Work</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              </div>
            </motion.div>
          </div>

          <RegionalSummaryStrip />

          <GemDivider />
        </div>
      </section>

      {/* 3. SERVICES BENTO GRID */}
      <section className="pb-24 sm:pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <SectionLabel number="02" label="Three Facets" />
              <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-[#09090B]">
                {HOME_COPY.services.title}
              </h2>
            </div>
            <Button to="/services" variant="ghost">
              <span>All Services</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>

          <ServicesBento />
        </div>
      </section>

      {/* 4. CLIENT STORY (Full-Bleed Dark Obsidian Block) */}
      <section className="relative bg-[#09090B] text-white py-24 sm:py-32 dot-grid-dark overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-radial from-[#C84B13]/20 via-transparent to-transparent pointer-events-none"
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2.5 mb-3 text-zinc-400">
                <GemMarker size={8} color="#F59E0B" />
                <ShinyText
                  text={`03 · ${HOME_COPY.clientStory.label}`}
                  color="rgba(161, 161, 170, 0.78)"
                  shineColor="#FFFFFF"
                  speed={3.8}
                  className="font-display text-xs font-semibold uppercase tracking-[0.14em] tabular-nums"
                />
              </div>
              <p
                aria-hidden="true"
                className="font-serif-accent italic text-[7rem] sm:text-[9rem] leading-[0.75] text-[#EA580C] select-none mt-2"
              >
                &ldquo;
              </p>
            </div>
            <div className="lg:col-span-9 space-y-8">
              <blockquote className="font-display font-semibold text-2xl sm:text-4xl lg:text-[2.75rem] leading-[1.18] tracking-tight text-zinc-100">
                <ShinyText
                  text={`\u201C${HOME_COPY.clientStory.quote}\u201D`}
                  color="#9CA3AF"
                  shineColor="#FFFFFF"
                  speed={2.8}
                  spread={120}
                />
              </blockquote>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2.5 text-zinc-400">
                  <GemMarker size={9} color="#F59E0B" />
                  {/* TODO: Replace with verified client attribution */}
                  <ShinyText
                    text={HOME_COPY.clientStory.attribution}
                    color="rgba(161, 161, 170, 0.78)"
                    shineColor="#FDE68A"
                    speed={4.6}
                    className="font-body text-sm"
                  />
                </div>
                <Button to="/testimonials" variant="dark">
                  <ShinyText
                    text="Read Client Stories"
                    color="#09090B"
                    shineColor="#C84B13"
                    speed={3.4}
                    className="font-display font-semibold text-sm tracking-tight"
                  />
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OUR CLIENTS & LIVE PROJECTS SHOWCASE */}
      <ClientsProjectsShowcase sectionNumber="04" />

      {/* 6. PROCESS STRIP (Plan / Build / Grow) */}
      <section className="py-20 sm:py-24 bg-white border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionLabel number="05" label="Three-Facet Method" />
          <div className="rounded-2xl overflow-hidden border border-zinc-200 bg-[#FAFAFA] card-elevated grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
            {HOME_COPY.process.map((step, idx) => (
              <div key={step.label} className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-[#0F4C5C] tabular-nums">
                    {step.step}
                  </span>
                  <GemMarker
                    size={10}
                    color={idx === 0 ? '#F59E0B' : idx === 1 ? '#C84B13' : '#0F4C5C'}
                  />
                </div>
                <h3 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-[#09090B]">
                  {step.label}
                </h3>
                <p className="font-body text-sm sm:text-base text-zinc-600 leading-relaxed">
                  {step.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. INSTANT SEO & ACCESSIBILITY AUDIT */}
      <section className="py-20 sm:py-28 bg-[#FAFAFA] dot-grid-light border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SeoAuditTool sectionNumber="06" />
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="py-20 sm:py-28 bg-white border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <HomeFaqAccordion sectionNumber="07" />
        </div>
      </section>

      {/* 9. CLOSING CTA */}
      <section className="py-20 sm:py-28 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-[#09090B] text-white p-8 sm:p-14 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
            <div
              aria-hidden="true"
              className="absolute top-0 right-0 w-96 h-96 bg-radial from-[#C84B13]/25 via-transparent to-transparent pointer-events-none"
            />
            <div className="relative lg:col-span-8 space-y-4">
              <SectionLabel number="08" label="Next Step" dark />
              <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight">
                {HOME_COPY.closingCta.title}
              </h2>
              <p className="font-body text-lg text-zinc-300 max-w-2xl">
                {HOME_COPY.closingCta.text}
              </p>
            </div>
            <div className="relative lg:col-span-4 lg:flex lg:justify-end">
              <Button to="/contact" variant="dark" magnetic className="px-8 py-4">
                <span>{HOME_COPY.closingCta.cta}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
