import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Menu,
  X,
  Phone,
  MessageCircle,
  Send,
  ArrowUpRight,
  Mail,
  MapPin,
} from 'lucide-react';
import { NAV_ITEMS, SITE_INFO } from '../data/siteData';
import { GemLogo, GemMarker } from './GemMotif';
import { StarBorder } from './StarBorder';

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
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
    if (!mobileOpen) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileOpen]);

  // Top nav links (excluding Contact, which serves as the primary action button on the right)
  const primaryLinks = NAV_ITEMS.filter((item) => item.path !== '/contact');
  const whatsAppHref =
    SITE_INFO.socials.find((s) => s.name === 'WhatsApp')?.href ??
    'https://wa.me/918169598429';

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] rounded-lg bg-[#09090B] text-white px-4 py-2 font-display font-semibold text-sm shadow-lg"
      >
        Skip to content
      </a>

      {/* Architectural Sticky Top Header */}
      <header
        className={`fixed top-0 left-0 right-0 h-16 z-40 transition-all duration-200 ${
          scrolled
            ? 'bg-white/92 backdrop-blur-xl border-b border-zinc-200/90 shadow-[0_8px_30px_-12px_rgba(9,9,11,0.1)]'
            : 'bg-[#FAFAFA]/85 backdrop-blur-md border-b border-zinc-200/60'
        }`}
      >
        {/* Subtle top copper specular hairline */}
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C84B13]/45 to-transparent pointer-events-none"
        />

        <div className="max-w-7xl mx-auto h-full px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Identity Lockup */}
          <Link
            to="/"
            aria-label="Triratna Hi-Tech Home"
            className="flex items-center gap-3 whitespace-nowrap shrink-0 group focus-visible:rounded-xl"
          >
            <span className="transition-transform duration-200 group-hover:scale-[1.04]">
              <GemLogo size={38} />
            </span>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-[15.5px] leading-tight tracking-tight text-[#09090B] group-hover:text-[#C84B13] transition-colors">
                {SITE_INFO.name}
              </span>
              <span className="font-body text-[10.5px] font-medium tracking-wide text-zinc-500 hidden sm:block">
                Pune · Web &amp; Digital Growth
              </span>
            </div>
          </Link>

          {/* Zone 2: Interactive Segmented Navigation Dock (Desktop) */}
          <nav
            aria-label="Primary navigation"
            onMouseLeave={() => setHoveredPath(null)}
            className="hidden lg:flex items-center gap-0.5 p-1 rounded-xl bg-zinc-100/90 border border-zinc-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
          >
            {primaryLinks.map((item) => {
              const isActive =
                item.path === '/'
                  ? pathname === '/'
                  : pathname === item.path || pathname.startsWith(`${item.path}/`);
              const isHovered = hoveredPath === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  onMouseEnter={() => setHoveredPath(item.path)}
                  onFocus={() => setHoveredPath(item.path)}
                  className={`relative px-[12.73px] xl:px-[14.85px] py-[6.37px] rounded-lg font-display text-[13.79px] font-semibold tracking-tight whitespace-nowrap shrink-0 transition-colors duration-150 ${
                    isActive
                      ? 'text-white'
                      : 'text-zinc-600 hover:text-[#09090B]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-lg bg-[#09090B] shadow-[0_2px_8px_rgba(9,9,11,0.18)]"
                    />
                  )}
                  {!isActive && isHovered && (
                    <motion.span
                      layoutId="nav-hover-pill"
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 rounded-lg bg-white/90 border border-zinc-200/70 shadow-2xs"
                    />
                  )}
                  <span className="relative z-10 inline-flex items-center gap-1.5">
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="w-1.5 h-1.5 rotate-45 bg-[#F59E0B] shrink-0"
                      />
                    )}
                    <span>{item.label}</span>
                  </span>
                </NavLink>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-2.5 shrink-0">
            <StarBorder
              as={Link}
              to="/contact"
              theme="dark"
              backgroundColor={pathname === '/contact' ? '#C84B13' : '#09090B'}
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
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-overlay-menu"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="lg:hidden inline-flex items-center justify-center gap-2 h-10 px-3 rounded-xl border border-zinc-200 bg-white text-[#09090B] hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.97] transition-all cursor-pointer shadow-2xs"
            >
              <span className="font-display font-semibold text-xs hidden sm:inline">
                Menu
              </span>
              {mobileOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / Tablet Full-Screen Architectural Overlay Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-overlay-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden fixed inset-0 z-50 bg-[#09090B] text-white flex flex-col justify-between p-5 sm:p-8 overflow-y-auto dot-grid-dark"
          >
            {/* Top Drawer Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3"
              >
                <GemLogo size={36} darkBg />
                <div>
                  <span className="font-display font-bold text-base block leading-tight text-white">
                    {SITE_INFO.name}
                  </span>
                  <span className="font-body text-[11px] text-zinc-400">
                    Pune · Web &amp; Digital Growth
                  </span>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/10 cursor-pointer transition-colors"
              >
                <span className="font-display font-semibold text-xs">Close</span>
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Center Drawer Navigation List */}
            <nav aria-label="Mobile site links" className="py-6 my-auto">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {NAV_ITEMS.map((item, idx) => {
                  const isActive =
                    item.path === '/'
                      ? pathname === '/'
                      : pathname === item.path || pathname.startsWith(`${item.path}/`);

                  return (
                    <motion.li
                      key={item.path}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.18,
                        delay: idx * 0.025,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Link
                        to={item.path}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => setMobileOpen(false)}
                        className={`group flex items-center justify-between rounded-xl px-[16.97px] py-[14.85px] border transition-all ${
                          isActive
                            ? 'bg-white/10 border-[#C84B13]/70 text-white'
                            : 'bg-white/[0.02] border-white/10 text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-display text-[12.73px] font-semibold tabular-nums ${
                              isActive ? 'text-[#F59E0B]' : 'text-zinc-500'
                            }`}
                          >
                            {item.index}
                          </span>
                          <span className="font-display font-bold text-[19.1px] tracking-tight">
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isActive && <GemMarker size={7} color="#F59E0B" />}
                          <ArrowUpRight
                            className={`w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                              isActive ? 'text-[#F59E0B]' : 'text-zinc-500 group-hover:text-white'
                            }`}
                            aria-hidden="true"
                          />
                        </div>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            {/* Bottom Drawer Direct Contact & Office Strip */}
            <div className="pt-5 border-t border-white/10 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <a
                  href={`tel:${SITE_INFO.phoneRaw}`}
                  className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-zinc-200 hover:bg-white/[0.08] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#EA580C] shrink-0" aria-hidden="true" />
                  <span className="font-display font-semibold tabular-nums">
                    {SITE_INFO.phoneDisplay}
                  </span>
                </a>
                <a
                  href={`mailto:${SITE_INFO.email}`}
                  className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-zinc-200 hover:bg-white/[0.08] transition-colors truncate"
                >
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
                  <span className="font-body truncate">{SITE_INFO.email}</span>
                </a>
                <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2.5 text-zinc-400">
                  <MapPin className="w-4 h-4 text-zinc-500 shrink-0" aria-hidden="true" />
                  <span className="font-body truncate">
                    {SITE_INFO.address} · {SITE_INFO.hours}
                  </span>
                </div>
              </div>
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
          className="flex items-center justify-center gap-1.5 text-zinc-200 hover:text-white active:bg-white/5 font-display font-semibold text-xs whitespace-nowrap transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-[#EA580C]" aria-hidden="true" />
          <span>Call</span>
        </a>
        <a
          href={whatsAppHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-zinc-200 hover:text-white active:bg-white/5 font-display font-semibold text-xs whitespace-nowrap transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <span>WhatsApp</span>
        </a>
        <Link
          to="/contact"
          aria-current={pathname === '/contact' ? 'page' : undefined}
          className="flex items-center justify-center gap-1.5 bg-[#C84B13] hover:bg-[#EA580C] text-white font-display font-semibold text-xs whitespace-nowrap transition-colors"
        >
          <Send className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Enquire</span>
        </Link>
      </nav>
    </>
  );
}
