import { ArrowRight } from 'lucide-react';
import { TEAM_PLACEHOLDERS } from '../data/siteData';
import {
  Button,
  ChamferCard,
  MarqueeStrip,
  SectionLabel,
} from '../components/UiPrimitives';
import { GemLogo, GemMarker } from '../components/GemMotif';
import { TimelineStrip } from '../components/TimelineStrip';
import { ShinyText } from '../components/ShinyText';

export default function AboutPage() {
  const journeyCells = [
    {
      kicker: 'Pune / 6+ Years',
      headline: '6+ Years',
      body: 'Websites designed to turn ideas into a practical online presence.',
    },
    {
      kicker: 'What We Do',
      headline: 'Worldwide / Pune, India',
      body: 'Guidance for launching channels and building tech confidence.',
    },
    {
      kicker: 'Digital Growth',
      headline: 'Our Journey',
      body: 'Thoughtful web development, digital marketing, SEO and practical guidance.',
    },
  ];

  return (
    <div>
      <section className="bg-[#FAFAFA] dot-grid-light border-b border-zinc-200/80 pt-14 pb-20 sm:pt-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-6">
            <SectionLabel number="01" label="About Us" />
            <h1 className="font-display font-extrabold text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight text-[#09090B] text-balance">
              Your Digital Growth{' '}
              <span className="font-serif-accent italic font-normal text-[#C84B13]">
                Partner
              </span>
            </h1>
            <p className="font-body text-lg sm:text-xl leading-relaxed text-zinc-600 max-w-2xl">
              For 6+ years, Triratna Hi-Tech has helped businesses grow with thoughtful web development, digital marketing, SEO and practical guidance from Pune to clients worldwide.
            </p>
            <div>
              <Button href="#team" variant="primary" magnetic>
                <span>Meet Our Team</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end">
            <div className="rounded-2xl bg-[#09090B] text-white p-8 shadow-2xl border border-white/10 w-full max-w-xs space-y-4">
              <GemLogo size={56} darkBg animated />
              <p className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-amber-400">
                Three Jewels Motif
              </p>
              <p className="font-body text-sm text-zinc-300 leading-relaxed">
                Strategy, technology, and steady guidance working together for long-term clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <SectionLabel number="02" label="Foundation" />
              <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-[#09090B]">
                Built Together
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p className="font-body text-xl sm:text-2xl leading-relaxed text-zinc-700">
                For 6+ years, Triratna Hi-Tech has helped people and organizations build their online presence, grow their businesses, and bring their ideas to life through technology.
              </p>
            </div>
          </div>

          <div>
            <SectionLabel number="03" label="Digital Growth & Our Journey" />
            <TimelineStrip cells={journeyCells} />
          </div>
        </div>
      </section>

      <MarqueeStrip
        items={['Pune, India', '6+ Years', 'Web Development', 'Digital Marketing', 'Guidance']}
      />

      <section className="bg-[#09090B] text-white py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="inline-flex items-center gap-2.5 mb-3 text-zinc-400">
            <GemMarker size={8} color="#F59E0B" />
            <ShinyText
              text="04 · Client Stories"
              color="rgba(161, 161, 170, 0.78)"
              shineColor="#FFFFFF"
              speed={3.2}
              className="font-display text-xs font-semibold uppercase tracking-[0.14em] tabular-nums"
            />
          </div>
          <blockquote className="font-display font-semibold text-2xl sm:text-4xl leading-snug tracking-tight max-w-4xl text-zinc-100">
            <ShinyText
              text={`\u201CTriratna Hi-Tech helped us strengthen our online presence and reach more customers with practical guidance and a website that fits our business.\u201D`}
              color="#9CA3AF"
              shineColor="#FFFFFF"
              speed={2.8}
              spread={120}
            />
          </blockquote>
          {/* TODO: Add verified client attribution */}
          <p className="text-sm text-zinc-400 mt-6">
            <ShinyText
              text="Client name - TBD"
              color="rgba(161, 161, 170, 0.78)"
              shineColor="#FDE68A"
              speed={3.8}
            />
          </p>
        </div>
      </section>

      <section id="team" className="py-20 sm:py-28 bg-[#FAFAFA] border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionLabel number="05" label="People" />
          <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-[#09090B] mb-10">
            Meet Our Team
          </h2>

          {/* TODO: Replace placeholder team cards below with verified team member names and roles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM_PLACEHOLDERS.map((member) => (
              <ChamferCard key={member.id} surface="white" className="p-7 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs font-semibold text-[#0F4C5C] tabular-nums">
                    {member.facet}
                  </span>
                  <GemMarker size={8} color="#C84B13" />
                </div>
                <div className="h-32 rounded-xl border border-dashed border-zinc-300 bg-[#FAFAFA] flex items-center justify-center">
                  <GemLogo size={52} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-xl text-[#09090B]">
                    {member.label}
                  </h3>
                  <p className="text-xs text-zinc-500">{member.roleLabel}</p>
                </div>
              </ChamferCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-[#09090B]">
              Ready to Grow?
            </h2>
            <p className="font-body text-lg text-zinc-600 max-w-2xl">
              Let Triratna Hi-Tech help your business grow with thoughtful digital marketing, web development, and one-to-one guidance.
            </p>
          </div>
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <Button to="/contact" variant="primary" magnetic>
              <span>Connect</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
