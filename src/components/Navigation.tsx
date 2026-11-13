import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X, Phone, MessageCircle, Send, ArrowUpRight } from 'lucide-react';
import { NAV_ITEMS, SITE_INFO } from '../data/siteData';
import { GemLogo } from './GemMotif';
import { StarBorder } from './StarBorder';

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  // Top nav links (excluding Contact, which serves as the primary action button on the right)
  const primaryLinks = NAV_ITEMS.filter((item) => item.path !== '/contact');

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] rounded-lg bg-[#09090B] text-white px-4 py-2 font-display font-semibold text-sm"
      >
        Skip to content
      </a>

      {/* Sleek Glassy Sticky Top Header */}
      <header
        className={`fixed top-0 left-0 right-0 h-16 z-40 backdrop-blur-md border-b transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 border-zinc-200 shadow-[0_4px_20px_-6px_rgba(9,9,11,0.08)]'
            : 'bg-white/80 border-zinc-200/70'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-5 sm:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Mark */}
          <Link
            to="/"
            aria-label="Triratna Hi-Tech Home"
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group"
          >
            <GemLogo size={36} />
            <span className="font-display font-bold text-base tracking-tight text-[#09090B]">
              Triratna Hi-Tech
            </span>
          </Link>

          {/* Zone 2: Clean Single-Line Navigation Links (Desktop) */}
          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-6">
            {primaryLinks.map((item) => {
              const isActive =
                item.path === '/'
                  ? pathname === '/'
                  : pathname === item.path || pathname.startsWith(`${item.path}/`);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`relative py-1 font-body text-[13.5px] font-medium whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'text-[#09090B]'
                      : 'text-zinc-500 hover:text-[#09090B]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-[#C84B13] rounded-full"
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <StarBorder
              as={Link}
              to="/contact"
              theme="dark"
              backgroundColor="#09090B"
              textColor="#FFFFFF"
              borderColor="rgba(255, 255, 255, 0.22)"
              color="#FFFFFF"
              trailColor="#FB923C"
              duration={3.2}
              stars={1}
              trailLength={0.42}
              thickness={2}
              radius={12}
              glow={0.85}
              hover="lap"
              sparkle
              clickPulse
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 font-display font-semibold text-xs tracking-tight whitespace-nowrap shrink-0 hover:bg-[#18181B] transition-colors"
            >
              <span>Let&apos;s Talk</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </StarBorder>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-overlay-menu"
              aria-label="Open navigation menu"
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-zinc-200 bg-white text-[#09090B] hover:bg-zinc-50 cursor-pointer"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / Tablet Full-Screen Overlay Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-overlay-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden fixed inset-0 z-50 bg-[#09090B] text-white flex flex-col justify-between p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <GemLogo size={34} darkBg />
                <span className="font-display font-bold text-base">
                  Triratna Hi-Tech
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                className="flex items-center justify-center w-10 h-10 rounded-xl border border-white/15 bg-white/5 text-white cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile site links" className="py-4">
              <ul className="flex flex-col divide-y divide-white/10">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    item.path === '/'
                      ? pathname === '/'
                      : pathname === item.path || pathname.startsWith(`${item.path}/`);

                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between py-3 px-1 transition-colors ${
                          isActive ? 'text-[#F59E0B]' : 'text-zinc-200 hover:text-white'
                        }`}
                      >
                        <span className="font-display font-semibold text-xl tracking-tight">
                          {item.label}
                        </span>
                        <span className="font-body text-xs text-zinc-500 tabular-nums">
                          {item.index}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="pt-4 border-t border-white/10 text-xs text-zinc-400 space-y-1">
              <p>{SITE_INFO.address}</p>
              <p>{SITE_INFO.phoneDisplay}</p>
              <p>{SITE_INFO.email}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Compact Bottom Quick Actions (<= 15% total mobile sticky height with top header) */}
      <nav
        aria-label="Mobile quick actions"
        className="md:hidden fixed bottom-0 left-0 right-0 h-12 z-40 bg-[#09090B]/95 backdrop-blur-md border-t border-white/10 grid grid-cols-3 divide-x divide-white/10"
      >
        <a
          href={`tel:${SITE_INFO.phoneRaw}`}
          className="flex items-center justify-center gap-1.5 text-zinc-200 font-display font-medium text-xs whitespace-nowrap"
        >
          <Phone className="w-3.5 h-3.5 text-[#EA580C]" aria-hidden="true" />
          <span>Call</span>
        </a>
        <a
          href={SITE_INFO.socials.find((s) => s.name === 'WhatsApp')?.href ?? 'https://wa.me/+918169598429'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-zinc-200 font-display font-medium text-xs whitespace-nowrap"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <span>WhatsApp</span>
        </a>
        <Link
          to="/contact"
          className="flex items-center justify-center gap-1.5 bg-[#C84B13] text-white font-display font-semibold text-xs whitespace-nowrap"
        >
          <Send className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Enquire</span>
        </Link>
      </nav>
    </>
  );
}
