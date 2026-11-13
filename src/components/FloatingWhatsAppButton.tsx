import { SITE_INFO } from '../data/siteData';
import { buildWhatsAppUrl } from '../utils/siteLogic';

const DEFAULT_WHATSAPP_MESSAGE =
  "Hi Triratna Hi-Tech, I'd like to discuss a project for my business.";

function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12.03 2a9.95 9.95 0 0 0-8.57 15.02L2 22l5.12-1.43A9.96 9.96 0 1 0 12.03 2Zm0 18.14a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-3.04.85.82-2.96-.2-.31a8.19 8.19 0 1 1 6.89 3.74Zm4.49-6.13c-.25-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.17.25-.64.8-.78.97-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.45-1.36-1.7-.14-.24-.01-.37.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.24-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.31-.23.24-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.73 2.65 4.2 3.71.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.45-.59 1.66-1.17.2-.57.2-1.06.14-1.17-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  );
}

export function FloatingWhatsAppButton() {
  const href = buildWhatsAppUrl(SITE_INFO.phoneRaw, DEFAULT_WHATSAPP_MESSAGE);

  return (
    <div className="fixed bottom-16 right-4 md:bottom-6 md:right-6 z-40 group">
      <div
        aria-hidden="true"
        className="pointer-events-none hidden sm:flex items-center gap-2 absolute right-0 bottom-full mb-2.5 px-3.5 py-2 rounded-xl bg-[#09090B] text-white border border-white/15 shadow-xl opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 whitespace-nowrap"
      >
        <span className="font-body text-xs text-zinc-300">Chat on WhatsApp</span>
        <span className="text-zinc-600">·</span>
        <span className="font-display text-xs font-semibold text-amber-300 tabular-nums">
          {SITE_INFO.phoneDisplay}
        </span>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat on WhatsApp with ${SITE_INFO.name} at ${SITE_INFO.phoneDisplay}`}
        className="inline-flex items-center justify-center gap-2.5 h-12 w-12 sm:w-auto sm:px-4 rounded-2xl bg-[#15803D] text-white border border-white/20 shadow-[0_14px_34px_-10px_rgba(9,9,11,0.38)] hover:bg-[#166534] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 whitespace-nowrap shrink-0"
      >
        <WhatsAppIcon className="w-5 h-5 shrink-0" />
        <span className="hidden sm:inline font-display font-semibold text-sm tracking-tight">
          WhatsApp
        </span>
      </a>
    </div>
  );
}
