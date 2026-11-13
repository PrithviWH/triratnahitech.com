import { ArrowRight } from 'lucide-react';
import { SERVICE_FAQS, SERVICES_STACK } from '../data/siteData';
import { Button, MarqueeStrip, SectionLabel } from '../components/UiPrimitives';
import { SplitAccordion, StickyStackCard } from '../components/ServicesInteractive';

export default function ServicesPage() {
  return (
    <div>
      <section className="bg-[#FAFAFA] dot-grid-light border-b border-zinc-200/80 pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionLabel number="01" label="Capabilities" />
          <h1 className="font-display font-extrabold text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight text-[#09090B] max-w-3xl">
            Our <span className="font-serif-accent italic font-normal text-[#0F4C5C]">Services</span>
          </h1>
          <p className="font-body text-lg sm:text-xl text-zinc-600 mt-5 max-w-2xl">
            Website design and development, SEO, paid campaigns, and hands-on guidance built around practical business growth.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionLabel number="02" label="Core Pillars" />
          <div className="space-y-8 pb-8">
            {SERVICES_STACK.map((service, idx) => (
              <StickyStackCard
                key={service.index}
                index={service.index}
                title={service.title}
                summary={service.summary}
                accent={service.accent}
                stackOffset={idx}
              />
            ))}
          </div>
        </div>
      </section>

      <MarqueeStrip
        items={['Websites', 'SEO Services', 'Paid Ads', 'Google Listings', 'AI Guidance']}
        dark={false}
      />

      <section className="bg-[#09090B] text-white py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <SectionLabel number="03" label="Get Started" dark />
            <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight">
              Ready to Grow?
            </h2>
            <p className="font-body text-lg text-zinc-300 max-w-2xl">
              Let&apos;s build a stronger digital presence with websites, marketing, and practical support tailored to your business goals.
            </p>
          </div>
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <Button to="/contact" variant="dark" magnetic>
              <span>Start</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      <section id="service-faqs" className="scroll-mt-20 py-20 sm:py-28 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl mb-10 space-y-3">
            <SectionLabel number="04" label="Answers" />
            <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-[#09090B]">
              SEO &amp; Web Development FAQs
            </h2>
            <p className="font-body text-base sm:text-lg text-zinc-600 leading-relaxed">
              Common questions from Pune businesses about custom website development, local search rankings, Google Business listings, and ongoing digital growth.
            </p>
          </div>
          <SplitAccordion items={SERVICE_FAQS} />
        </div>
      </section>
    </div>
  );
}
