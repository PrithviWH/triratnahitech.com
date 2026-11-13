import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUp, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { NAV_ITEMS, SITE_INFO } from '../data/siteData';
import { validateNewsletterEmail } from '../utils/siteLogic';
import { GemLogo } from './GemMotif';
import { ToastState } from './UiPrimitives';

export function Footer({
  onToast,
}: {
  onToast: (toast: ToastState) => void;
}) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateNewsletterEmail(email);
    if (validationError) {
      setError(validationError);
      setSubscribed(false);
      return;
    }
    setError(null);
    setSubscribed(true);
    setEmail('');
    onToast({
      type: 'success',
      message: 'Subscribed! Thank you for joining the Triratna Hi-Tech newsletter.',
    });
  };

  const scrollToTop = () => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  const explorePaths = new Set(['/', '/services', '/clients', '/projects']);
  const companyPaths = new Set(['/about', '/testimonials', '/careers', '/blog']);

  const exploreLinks = NAV_ITEMS.filter((item) => explorePaths.has(item.path));
  const companyLinks = NAV_ITEMS.filter((item) => companyPaths.has(item.path));

  return (
    <footer className="relative bg-[#09090B] text-white pt-16 sm:pt-20 overflow-hidden">
      {/* Subtle Copper Specular Top Edge & Ambient Depth */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C84B13]/65 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[520px] h-[420px] bg-radial from-[#C84B13]/10 via-transparent to-transparent pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        {/* Band 1: Brand Presence + Actionable Contact Grid & Newsletter Module */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 sm:pb-14 border-b border-white/10">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3.5">
              <GemLogo size={46} darkBg />
              <div>
                <span className="font-display font-bold text-xl tracking-tight text-white block leading-tight">
                  {SITE_INFO.name}
                </span>
                <span className="font-body text-xs text-zinc-400">
                  Pune · Digital Marketing &amp; Web Development
                </span>
              </div>
            </div>

            <p className="font-body text-sm sm:text-base text-zinc-300 max-w-md leading-relaxed">
              Digital marketing and web development that help Pune businesses grow with confidence.
            </p>

            {/* Interactive Contact Details Grid */}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-5 border-t border-white/10 text-sm">
              <div>
                <dt className="font-body text-xs text-zinc-500 mb-1">Email</dt>
                <dd>
                  <a
                    href={`mailto:${SITE_INFO.email}`}
                    className="font-body font-medium text-zinc-200 hover:text-amber-300 transition-colors break-all"
                  >
                    {SITE_INFO.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-body text-xs text-zinc-500 mb-1">Phone</dt>
                <dd>
                  <a
                    href={`tel:${SITE_INFO.phoneRaw}`}
                    className="font-body font-medium text-zinc-200 hover:text-amber-300 transition-colors tabular-nums"
                  >
                    {SITE_INFO.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-body text-xs text-zinc-500 mb-1">Address</dt>
                <dd>
                  <Link
                    to="/contact"
                    className="font-body font-medium text-zinc-200 hover:text-amber-300 transition-colors"
                  >
                    {SITE_INFO.address}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="font-body text-xs text-zinc-500 mb-1">Hours</dt>
                <dd className="font-body font-medium text-zinc-200 tabular-nums">
                  {SITE_INFO.hours}
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-6 flex items-stretch">
            <div className="w-full rounded-2xl border border-white/12 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 sm:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] flex flex-col justify-between gap-6">
              <div className="space-y-2">
                <p className="font-display text-xs font-semibold tracking-wide text-amber-400">
                  Updates &amp; Insights
                </p>
                <h2 className="font-display font-bold text-2xl sm:text-[1.75rem] leading-tight tracking-tight text-white">
                  Subscribe to our newsletter
                </h2>
                <p className="font-body text-sm text-zinc-400 leading-relaxed">
                  Practical guidance on websites, local SEO, and digital growth from our Pune team.
                </p>
              </div>

              <form onSubmit={handleSubscribe} noValidate className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label htmlFor="footer-newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="footer-newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="you@company.com"
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? 'footer-newsletter-error' : undefined}
                      className="w-full h-12 rounded-xl px-4 bg-zinc-950/80 text-white border border-white/15 font-body text-sm placeholder:text-zinc-500 focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/25 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-12 rounded-xl px-6 bg-[#C84B13] text-white font-display font-semibold text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer hover:bg-[#EA580C] active:scale-[0.98] transition-all"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                {error && (
                  <p
                    id="footer-newsletter-error"
                    role="alert"
                    className="flex items-center gap-1.5 text-xs text-amber-300"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{error}</span>
                  </p>
                )}

                {subscribed && !error && (
                  <p role="status" className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Subscribed. Thank you for joining our updates.</span>
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Band 2: Structured 4-Column Sitemap & Project Action */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-10 py-12 border-b border-white/10">
          <div className="col-span-1 lg:col-span-3">
            <p className="font-display text-xs font-semibold tracking-wide text-zinc-400 mb-4">
              Explore
            </p>
            <ul className="space-y-2.5">
              {exploreLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="inline-flex items-center font-body text-sm text-zinc-300 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-3">
            <p className="font-display text-xs font-semibold tracking-wide text-zinc-400 mb-4">
              Studio
            </p>
            <ul className="space-y-2.5">
              {companyLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="inline-flex items-center font-body text-sm text-zinc-300 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-3">
            <p className="font-display text-xs font-semibold tracking-wide text-zinc-400 mb-4">
              Connect
            </p>
            <ul className="space-y-2.5">
              {SITE_INFO.socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 font-body text-sm text-zinc-300 hover:text-white transition-colors"
                  >
                    <span>{social.name}</span>
                    <ArrowUpRight
                      className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/contact"
                  className="inline-flex items-center font-body text-sm text-zinc-300 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1 lg:col-span-3 space-y-4">
            <p className="font-display text-xs font-semibold tracking-wide text-zinc-400">
              Start a Project
            </p>
            <p className="font-body text-sm text-zinc-300 leading-relaxed">
              Have a website, campaign, or digital goal in mind? Speak directly with our team.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-[#09090B] px-5 py-2.5 font-display font-semibold text-xs whitespace-nowrap shrink-0 hover:bg-zinc-100 active:scale-[0.98] transition-all"
              >
                <span>Let&apos;s Talk</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* Band 3: Clean Legal & Back-to-Top Footer Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-7 pb-20 md:pb-7 text-xs font-body text-zinc-400">
          <p>{SITE_INFO.copyright}</p>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-6">
            <p className="text-zinc-500">
              Pune · Web Development · Digital Marketing · Guidance
            </p>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="inline-flex items-center gap-1.5 font-display font-semibold text-xs text-zinc-300 hover:text-white whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
