import { ArrowRight } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/siteData';
import { Button, SectionLabel } from '../components/UiPrimitives';
import { QuoteCarousel } from '../components/QuoteCarousel';

export default function TestimonialsPage() {
  return (
    <div>
      <section className="bg-[#FAFAFA] dot-grid-light border-b border-zinc-200/80 pt-14 pb-16 sm:pt-20 sm:pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionLabel number="01" label="Testimonials" />
          <h1 className="font-display font-extrabold text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight text-[#09090B]">
            Client Stories
          </h1>
          <p className="font-body text-lg sm:text-xl text-zinc-600 mt-4 max-w-2xl">
            Hear how our digital, website, and business-growth support helps clients move forward confidently.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <QuoteCarousel items={TESTIMONIALS_DATA} />
          <p className="text-xs font-medium text-zinc-500 mt-8">
            Use the arrow buttons or Left / Right keyboard keys to navigate stories.
          </p>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <SectionLabel number="02" label="Next Chapter" />
            <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-[#09090B]">
              Your Story Matters
            </h2>
            <p className="font-body text-lg text-zinc-600 max-w-2xl">
              Ready to grow your business with Triratna Hi-Tech? Let&apos;s talk about what&apos;s possible.
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
