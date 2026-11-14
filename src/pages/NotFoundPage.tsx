import { ArrowLeft, Home } from 'lucide-react';
import { Button, SectionLabel } from '../components/UiPrimitives';
import { SeoHead } from '../components/SeoHead';

export default function NotFoundPage() {
  return (
    <div>
      <SeoHead
        customTitle="Page Not Found | Triratna Hi-Tech"
        customDescription="The requested page could not be found on Triratna Hi-Tech."
      />

      <section className="bg-[#FAFAFA] dot-grid-light border-b border-zinc-200/80 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center space-y-6">
          <div className="flex justify-center">
            <SectionLabel number="404" label="Not Found" />
          </div>

          <h1 className="font-display font-extrabold text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] tracking-tight text-[#09090B]">
            Page Not Found
          </h1>

          <p className="font-body text-base sm:text-lg text-zinc-600 max-w-lg mx-auto leading-relaxed">
            The page you are looking for doesn&apos;t exist, was moved, or the link you followed was incorrect.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
            <Button to="/" variant="primary">
              <Home className="w-4 h-4" aria-hidden="true" />
              <span>Back to Home</span>
            </Button>
            <Button to="/services" variant="secondary">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Explore Services</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
