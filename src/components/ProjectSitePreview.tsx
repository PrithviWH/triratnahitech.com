import {
  BookOpen,
  Building2,
  Clock,
  Globe,
  Headphones,
  Image as ImageIcon,
  Lock,
  MapPin,
  Newspaper,
  Quote,
  Sparkles,
  Stethoscope,
  UtensilsCrossed,
} from 'lucide-react';
import type { ProjectItem } from '../data/siteData';

interface ProjectSitePreviewProps {
  project: ProjectItem;
  size?: 'card' | 'spotlight' | 'modal';
  viewport?: 'desktop' | 'mobile';
}

const THEME_ACCENTS: Record<
  ProjectItem['previewTheme'],
  { bg: string; headerBg: string; urlColor: string; darkChrome?: boolean }
> = {
  constitution: {
    bg: 'bg-[#10131C]',
    headerBg: 'bg-[#161B26] border-white/10',
    urlColor: 'text-amber-200/90',
    darkChrome: true,
  },
  music: {
    bg: 'bg-gradient-to-br from-[#120F24] via-[#1B1333] to-[#0B0914]',
    headerBg: 'bg-[#17122B] border-white/10',
    urlColor: 'text-orange-200/90',
    darkChrome: true,
  },
  quotes: {
    bg: 'bg-[#FBF7F0]',
    headerBg: 'bg-[#F4EDE1] border-stone-200',
    urlColor: 'text-stone-600',
  },
  walls: {
    bg: 'bg-[#0C0C10]',
    headerBg: 'bg-[#16161C] border-white/10',
    urlColor: 'text-zinc-300',
    darkChrome: true,
  },
  kimaya: {
    bg: 'bg-gradient-to-br from-[#FFF9F2] to-[#FDEBD3]',
    headerBg: 'bg-[#FFFDF9] border-amber-200/70',
    urlColor: 'text-[#8C3B10]',
  },
  saksham: {
    bg: 'bg-[#F4F7F6]',
    headerBg: 'bg-white border-zinc-200',
    urlColor: 'text-[#0F4C5C]',
  },
  care32: {
    bg: 'bg-gradient-to-br from-[#F4FBFB] to-[#E6F4F3]',
    headerBg: 'bg-white border-teal-100',
    urlColor: 'text-[#0F4C5C]',
  },
  history: {
    bg: 'bg-[#F6F1E8]',
    headerBg: 'bg-[#ECE4D5] border-stone-300/70',
    urlColor: 'text-stone-700',
  },
  news: {
    bg: 'bg-white',
    headerBg: 'bg-zinc-50 border-zinc-200',
    urlColor: 'text-zinc-700',
  },
  hindi: {
    bg: 'bg-[#FFFBF5]',
    headerBg: 'bg-[#FEF3E6] border-orange-200/70',
    urlColor: 'text-[#9A3412]',
  },
  marathi: {
    bg: 'bg-[#F4F9F9]',
    headerBg: 'bg-[#E7F2F2] border-teal-200/70',
    urlColor: 'text-[#0F4C5C]',
  },
  askk: {
    bg: 'bg-gradient-to-br from-[#0B1622] to-[#0E2235]',
    headerBg: 'bg-[#09121C] border-white/10',
    urlColor: 'text-sky-200/90',
    darkChrome: true,
  },
};

function PreviewCanvasBody({
  project,
  expanded,
  mobile,
}: {
  project: ProjectItem;
  expanded: boolean;
  mobile: boolean;
}) {
  switch (project.previewTheme) {
    case 'constitution':
      return (
        <div className="p-3.5 sm:p-4 h-full flex flex-col justify-between text-white">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span className="font-serif-accent text-[11px] font-semibold tracking-wide text-amber-200">
                SAMVIDHAN ARCHIVE
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-zinc-400">
              Preamble · Parts I–XXII
            </span>
          </div>

          <div
            className={`grid ${mobile ? 'grid-cols-1 gap-2' : 'grid-cols-12 gap-2.5'} my-auto py-2`}
          >
            <div
              className={`${mobile ? '' : 'col-span-7'} rounded-lg bg-white/[0.06] border border-amber-300/20 p-2.5 space-y-1.5`}
            >
              <p className="text-[9px] uppercase tracking-wider text-amber-400 font-semibold">
                Article 14 · Fundamental Rights
              </p>
              <p className="font-serif-accent text-xs font-semibold text-white leading-snug">
                Equality before law &amp; constitutional safeguards
              </p>
              <div className="space-y-1 pt-0.5">
                <div className="h-1 w-full rounded-full bg-white/15" />
                <div className="h-1 w-4/5 rounded-full bg-white/10" />
              </div>
            </div>
            {!mobile && (
              <div className="col-span-5 rounded-lg bg-[#1A2133] border border-white/10 p-2.5 flex flex-col justify-between">
                <span className="text-[9px] text-zinc-400">Quick Jump</span>
                <div className="space-y-1.5">
                  <div className="px-2 py-1 rounded bg-amber-400/15 text-[9px] text-amber-200 font-medium">
                    Preamble Text
                  </div>
                  <div className="px-2 py-1 rounded bg-white/5 text-[9px] text-zinc-300">
                    Parts &amp; Schedules
                  </div>
                </div>
              </div>
            )}
          </div>

          {expanded && (
            <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-2.5 text-[9px] text-zinc-300">
              <div className="rounded bg-white/5 px-2 py-1">Part III · Rights</div>
              <div className="rounded bg-white/5 px-2 py-1">Part IV · Directives</div>
              <div className="rounded bg-white/5 px-2 py-1">Schedules I–XII</div>
            </div>
          )}
        </div>
      );

    case 'music':
      return (
        <div className="p-3.5 sm:p-4 h-full flex flex-col justify-between text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-[#F59E0B]" aria-hidden="true" />
              <span className="font-display text-[11px] font-bold tracking-tight">
                Bhim Geet &amp; Audio
              </span>
            </div>
            <div className="flex items-end gap-0.5 h-3" aria-hidden="true">
              <span className="w-0.5 h-2 bg-amber-400 rounded-full" />
              <span className="w-0.5 h-3 bg-[#C84B13] rounded-full" />
              <span className="w-0.5 h-1.5 bg-amber-300 rounded-full" />
              <span className="w-0.5 h-2.5 bg-orange-400 rounded-full" />
            </div>
          </div>

          <div
            className={`grid ${mobile ? 'grid-cols-1 gap-2' : 'grid-cols-12 gap-2.5'} my-auto py-2`}
          >
            <div
              className={`${mobile ? '' : 'col-span-6'} rounded-lg bg-gradient-to-br from-[#C84B13] to-[#9A3412] p-2.5 flex flex-col justify-between shadow-sm`}
            >
              <span className="text-[9px] uppercase tracking-wider text-amber-100/80">
                Featured Album
              </span>
              <div className="mt-2">
                <p className="font-display text-xs font-bold leading-tight">
                  Tribute Anthems
                </p>
                <div className="mt-2 h-1 rounded-full bg-white/25 overflow-hidden">
                  <div className="h-full w-2/3 bg-white rounded-full" />
                </div>
              </div>
            </div>
            {!mobile && (
              <div className="col-span-6 space-y-1.5">
                {['01 · Morning Inspiration', '02 · Cultural Chorus', '03 · Heritage Classics'].map(
                  (track, i) => (
                    <div
                      key={track}
                      className={`rounded-md px-2 py-1.5 text-[9px] flex items-center justify-between ${
                        i === 0
                          ? 'bg-white/15 text-white font-medium'
                          : 'bg-white/[0.05] text-zinc-300'
                      }`}
                    >
                      <span className="truncate">{track}</span>
                      <span className="text-amber-300">▶</span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {expanded && (
            <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[9px] text-zinc-300">
              <span>Curated Audio Library</span>
              <span className="text-amber-300 font-medium">Instant Stream Ready</span>
            </div>
          )}
        </div>
      );

    case 'quotes':
      return (
        <div className="p-3.5 sm:p-4 h-full flex flex-col justify-between text-[#09090B]">
          <div className="flex items-center justify-between border-b border-stone-200/80 pb-2">
            <span className="font-serif-accent text-[11px] font-semibold italic text-stone-800">
              Quotations Index
            </span>
            <Quote className="w-3.5 h-3.5 text-[#C84B13]" aria-hidden="true" />
          </div>

          <div className="my-auto py-2 space-y-2">
            <div className="rounded-lg bg-white border border-stone-200/90 p-3 shadow-2xs">
              <p className="font-serif-accent text-xs sm:text-[13px] italic leading-snug text-stone-900">
                “Cultivation of mind should be the ultimate aim of human existence.”
              </p>
              <div className="mt-2 flex items-center justify-between text-[9px] text-stone-500">
                <span>Topic: Education &amp; Liberty</span>
                <span className="font-semibold text-[#C84B13]">Copy · Share</span>
              </div>
            </div>
            {(!mobile || expanded) && (
              <div className="grid grid-cols-3 gap-1.5 text-[9px] font-medium text-stone-600">
                <div className="rounded bg-stone-200/60 px-2 py-1 text-center">Education</div>
                <div className="rounded bg-stone-200/60 px-2 py-1 text-center">Justice</div>
                <div className="rounded bg-[#C84B13]/10 text-[#C84B13] px-2 py-1 text-center">
                  Society
                </div>
              </div>
            )}
          </div>
        </div>
      );

    case 'walls':
      return (
        <div className="p-3.5 sm:p-4 h-full flex flex-col justify-between text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span className="font-display text-[11px] font-semibold">HD Artwork Gallery</span>
            </div>
            <span className="text-[9px] text-zinc-400">Desktop · Mobile</span>
          </div>

          <div
            className={`grid ${mobile ? 'grid-cols-2' : 'grid-cols-4'} gap-2 my-auto py-2`}
          >
            <div className="h-20 rounded-lg bg-gradient-to-br from-[#C84B13] to-[#581C08] p-2 flex flex-col justify-end border border-white/15">
              <span className="text-[8px] font-semibold uppercase tracking-wider text-amber-200">
                Portrait
              </span>
            </div>
            <div className="h-20 rounded-lg bg-gradient-to-br from-[#0F4C5C] to-[#062028] p-2 flex flex-col justify-end border border-white/15">
              <span className="text-[8px] font-semibold uppercase tracking-wider text-teal-200">
                Minimal
              </span>
            </div>
            {!mobile && (
              <>
                <div className="h-20 rounded-lg bg-gradient-to-br from-amber-500/80 to-stone-900 p-2 flex flex-col justify-end border border-white/15">
                  <span className="text-[8px] font-semibold uppercase tracking-wider text-white">
                    Heritage
                  </span>
                </div>
                <div className="h-20 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-950 p-2 flex flex-col justify-end border border-white/15">
                  <span className="text-[8px] font-semibold uppercase tracking-wider text-zinc-200">
                    4K Wide
                  </span>
                </div>
              </>
            )}
          </div>

          {expanded && (
            <div className="border-t border-white/10 pt-2 flex justify-between text-[9px] text-zinc-400">
              <span>Multi-aspect resolution previews</span>
              <span className="text-amber-300">Direct Save</span>
            </div>
          )}
        </div>
      );

    case 'kimaya':
      return (
        <div className="p-3.5 sm:p-4 h-full flex flex-col justify-between text-[#09090B]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#C84B13]" aria-hidden="true" />
              <span className="font-display text-[11px] font-extrabold tracking-tight text-[#6C2406]">
                KIMAYA FOODS
              </span>
            </div>
            <span className="text-[9px] font-semibold text-[#C84B13]">
              Authentic Spices
            </span>
          </div>

          <div
            className={`grid ${mobile ? 'grid-cols-1 gap-2' : 'grid-cols-12 gap-2.5'} my-auto py-2`}
          >
            <div
              className={`${mobile ? '' : 'col-span-6'} rounded-lg bg-[#6C2406] text-white p-2.5 flex flex-col justify-between gap-2`}
            >
              <div>
                <span className="text-[8px] uppercase tracking-wider text-amber-300">
                  Signature Range
                </span>
                <p className="font-display text-[11px] font-bold leading-snug mt-0.5">
                  Pure Spices &amp; Blends
                </p>
              </div>
              <span className="inline-block text-[9px] font-semibold text-amber-200">
                Explore Catalogue →
              </span>
            </div>
            {!mobile && (
              <div className="col-span-6 grid grid-cols-2 gap-1.5">
                {[
                  { name: 'Garam Masala', tone: 'bg-amber-600' },
                  { name: 'Red Chilli', tone: 'bg-red-600' },
                  { name: 'Turmeric', tone: 'bg-yellow-500' },
                  { name: 'Special Mix', tone: 'bg-orange-600' },
                ].map((pack) => (
                  <div
                    key={pack.name}
                    className="rounded-md bg-white border border-amber-200/80 p-1.5 flex flex-col justify-between shadow-2xs"
                  >
                    <div className={`w-4 h-1.5 rounded-full ${pack.tone}`} />
                    <span className="text-[9px] font-semibold text-stone-800 leading-tight mt-2">
                      {pack.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {expanded && (
            <div className="border-t border-amber-200/70 pt-2 flex justify-between text-[9px] text-stone-700 font-medium">
              <span>Retail &amp; Wholesale Distribution</span>
              <span className="text-[#C84B13]">Direct Trade Inquiry</span>
            </div>
          )}
        </div>
      );

    case 'saksham':
      return (
        <div className="p-3.5 sm:p-4 h-full flex flex-col justify-between text-[#09090B]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#0F4C5C]" aria-hidden="true" />
              <span className="font-display text-[11px] font-bold text-[#0F4C5C]">
                Saksham Real Estate
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[9px] font-medium text-zinc-500">
              <MapPin className="w-2.5 h-2.5 text-[#C84B13]" aria-hidden="true" />
              Pune Region
            </span>
          </div>

          <div
            className={`grid ${mobile ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-2'} my-auto py-2`}
          >
            <div className="rounded-lg bg-white border border-zinc-200 p-2.5 shadow-2xs space-y-1.5">
              <div className="h-10 rounded-md bg-gradient-to-br from-[#0F4C5C] to-[#1D6D82] flex items-end p-1.5">
                <span className="text-[8px] font-semibold uppercase tracking-wider text-white">
                  Residential
                </span>
              </div>
              <p className="font-display text-[10px] font-bold text-zinc-900">
                2 &amp; 3 BHK Homes
              </p>
              <div className="h-1 w-2/3 rounded bg-zinc-200" />
            </div>
            {!mobile && (
              <div className="rounded-lg bg-white border border-zinc-200 p-2.5 shadow-2xs space-y-1.5">
                <div className="h-10 rounded-md bg-gradient-to-br from-[#C84B13] to-[#9A3412] flex items-end p-1.5">
                  <span className="text-[8px] font-semibold uppercase tracking-wider text-white">
                    Commercial
                  </span>
                </div>
                <p className="font-display text-[10px] font-bold text-zinc-900">
                  Plots &amp; Showrooms
                </p>
                <div className="h-1 w-2/3 rounded bg-zinc-200" />
              </div>
            )}
          </div>

          {expanded && (
            <div className="border-t border-zinc-200 pt-2 flex justify-between text-[9px] text-zinc-600">
              <span>Verified Property Advisory</span>
              <span className="font-semibold text-[#0F4C5C]">Schedule Site Visit</span>
            </div>
          )}
        </div>
      );

    case 'care32':
      return (
        <div className="p-3.5 sm:p-4 h-full flex flex-col justify-between text-[#09090B]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-[#0F4C5C]" aria-hidden="true" />
              <span className="font-display text-[11px] font-bold text-[#0F4C5C]">
                Care32 Dentist
              </span>
            </div>
            <span className="rounded bg-[#0F4C5C] px-2 py-0.5 text-[8px] font-semibold text-white">
              Book Visit
            </span>
          </div>

          <div className="rounded-lg bg-white border border-teal-100 p-3 my-auto shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-display text-xs font-bold text-zinc-900 leading-tight">
                Gentle Family &amp; Cosmetic Dentistry
              </p>
              <Sparkles className="w-3.5 h-3.5 text-[#0F4C5C] shrink-0" aria-hidden="true" />
            </div>
            <div className={`grid ${mobile ? 'grid-cols-2' : 'grid-cols-3'} gap-1.5 text-[9px]`}>
              <div className="rounded bg-teal-50 px-2 py-1 font-medium text-[#0F4C5C]">
                Implants
              </div>
              <div className="rounded bg-teal-50 px-2 py-1 font-medium text-[#0F4C5C]">
                Aligners
              </div>
              {!mobile && (
                <div className="rounded bg-teal-50 px-2 py-1 font-medium text-[#0F4C5C]">
                  Root Canal
                </div>
              )}
            </div>
          </div>

          {expanded && (
            <div className="border-t border-teal-100 pt-2 flex justify-between text-[9px] text-[#0F4C5C] font-medium">
              <span>Patient Care &amp; Hygiene Standards</span>
              <span>Clinic Consultation</span>
            </div>
          )}
        </div>
      );

    case 'history':
      return (
        <div className="p-3.5 sm:p-4 h-full flex flex-col justify-between text-[#1C1917]">
          <div className="flex items-center justify-between border-b border-stone-300/60 pb-2">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C84B13]" aria-hidden="true" />
              <span className="font-serif-accent text-[11px] font-semibold">
                Historical Chronology
              </span>
            </div>
            <span className="text-[9px] font-medium text-stone-500">1891 — 1956</span>
          </div>

          <div className="my-auto py-2 space-y-2">
            {[
              { year: '1927', label: 'Mahad Satyagraha & Civic Equality' },
              { year: '1949', label: 'Drafting Committee Adoption' },
            ].map((milestone, idx) => (
              <div
                key={milestone.year}
                className="flex items-center gap-2.5 rounded-lg bg-white/90 border border-stone-200/80 px-2.5 py-2"
              >
                <span
                  className={`text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded ${
                    idx === 0 ? 'bg-[#C84B13] text-white' : 'bg-stone-200 text-stone-800'
                  }`}
                >
                  {milestone.year}
                </span>
                <span className="text-[10px] font-medium text-stone-800 truncate">
                  {milestone.label}
                </span>
              </div>
            ))}
          </div>

          {expanded && (
            <div className="border-t border-stone-300/60 pt-2 text-[9px] text-stone-600 flex justify-between">
              <span>Documented Era Archives</span>
              <span className="font-semibold text-[#C84B13]">Read Monographs</span>
            </div>
          )}
        </div>
      );

    case 'news':
      return (
        <div className="p-3.5 sm:p-4 h-full flex flex-col justify-between text-[#09090B]">
          <div className="flex items-center justify-between border-b-2 border-[#09090B] pb-1.5">
            <div className="flex items-center gap-1.5">
              <Newspaper className="w-3.5 h-3.5 text-[#C84B13]" aria-hidden="true" />
              <span className="font-serif-accent text-xs font-bold tracking-tight">
                THE DAILY DISPATCH
              </span>
            </div>
            <span className="text-[8px] font-semibold uppercase tracking-widest text-[#C84B13]">
              Edition
            </span>
          </div>

          <div
            className={`grid ${mobile ? 'grid-cols-1 gap-2' : 'grid-cols-12 gap-2.5'} my-auto py-2`}
          >
            <div
              className={`${mobile ? '' : 'col-span-7'} rounded bg-zinc-50 border border-zinc-200 p-2.5 space-y-1.5`}
            >
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#C84B13]">
                Lead Report
              </span>
              <p className="font-display text-[11px] font-bold leading-snug text-zinc-900">
                Community updates, policy coverage &amp; regional reporting
              </p>
              <div className="h-1 w-5/6 bg-zinc-200 rounded" />
            </div>
            {!mobile && (
              <div className="col-span-5 space-y-1.5">
                <div className="rounded bg-zinc-100 p-2 text-[9px] font-medium text-zinc-700">
                  Editorial Commentary
                </div>
                <div className="rounded bg-zinc-100 p-2 text-[9px] font-medium text-zinc-700">
                  Public Circulars
                </div>
              </div>
            )}
          </div>

          {expanded && (
            <div className="border-t border-zinc-200 pt-2 flex justify-between text-[9px] text-zinc-500">
              <span>Categories · Opinion · Special Reports</span>
              <span className="font-semibold text-[#09090B]">Fast Reading UI</span>
            </div>
          )}
        </div>
      );

    case 'hindi':
      return (
        <div className="p-3.5 sm:p-4 h-full flex flex-col justify-between text-[#18181B]">
          <div className="flex items-center justify-between border-b border-orange-200 pb-2">
            <span className="font-display text-xs font-bold text-[#9A3412]">
              हिन्दी पोर्टल · Hindi Edition
            </span>
            <span className="text-[9px] font-semibold text-[#C84B13]">देवनागरी</span>
          </div>

          <div className="rounded-lg bg-white border border-orange-200/80 p-3 my-auto shadow-2xs space-y-1.5">
            <p className="font-display text-xs font-bold text-stone-900 leading-snug">
              विचार, इतिहास और सामाजिक जागरूकता
            </p>
            <p className="text-[10px] text-stone-600 leading-snug">
              सरल और पठनीय हिन्दी सामग्री का सुव्यवस्थित डिजिटल संग्रह।
            </p>
            <div className="flex gap-1.5 pt-1 text-[9px] font-medium text-[#9A3412]">
              <span className="rounded bg-orange-50 px-2 py-0.5">जीवनी</span>
              <span className="rounded bg-orange-50 px-2 py-0.5">संविधान</span>
              <span className="rounded bg-orange-50 px-2 py-0.5">लेख</span>
            </div>
          </div>

          {expanded && (
            <div className="border-t border-orange-200/70 pt-2 flex justify-between text-[9px] text-stone-600">
              <span>Unicode Devanagari Reading Flow</span>
              <span className="text-[#9A3412] font-semibold">Mobile Ready</span>
            </div>
          )}
        </div>
      );

    case 'marathi':
      return (
        <div className="p-3.5 sm:p-4 h-full flex flex-col justify-between text-[#18181B]">
          <div className="flex items-center justify-between border-b border-teal-200 pb-2">
            <span className="font-display text-xs font-bold text-[#0F4C5C]">
              मराठी पोर्टल · Marathi Edition
            </span>
            <span className="text-[9px] font-semibold text-[#0F4C5C]">संस्करण</span>
          </div>

          <div className="rounded-lg bg-white border border-teal-200/80 p-3 my-auto shadow-2xs space-y-1.5">
            <p className="font-display text-xs font-bold text-zinc-900 leading-snug">
              साहित्य, इतिहास आणि लोकशिक्षण दालन
            </p>
            <p className="text-[10px] text-zinc-600 leading-snug">
              मराठी वाचकांसाठी स्पष्ट, जलद आणि सुलभ वाचन अनुभव.
            </p>
            <div className="flex gap-1.5 pt-1 text-[9px] font-medium text-[#0F4C5C]">
              <span className="rounded bg-teal-50 px-2 py-0.5">चरित्र</span>
              <span className="rounded bg-teal-50 px-2 py-0.5">संविधान</span>
              <span className="rounded bg-teal-50 px-2 py-0.5">विचार</span>
            </div>
          </div>

          {expanded && (
            <div className="border-t border-teal-200/70 pt-2 flex justify-between text-[9px] text-zinc-600">
              <span>Regional Reader Architecture</span>
              <span className="text-[#0F4C5C] font-semibold">Verified Layout</span>
            </div>
          )}
        </div>
      );

    case 'askk':
      return (
        <div className="p-3.5 sm:p-4 h-full flex flex-col justify-between text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span className="font-display text-[11px] font-bold tracking-wide">
                ASKK INTERNATIONAL
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-sky-200/80">
              Global Trade
            </span>
          </div>

          <div
            className={`grid ${mobile ? 'grid-cols-1 gap-2' : 'grid-cols-12 gap-2.5'} my-auto py-2`}
          >
            <div
              className={`${mobile ? '' : 'col-span-7'} rounded-lg bg-white/[0.07] border border-white/15 p-2.5 space-y-1.5`}
            >
              <span className="text-[9px] uppercase tracking-wider text-amber-300 font-semibold">
                Export &amp; Sourcing
              </span>
              <p className="font-display text-xs font-bold leading-snug text-white">
                Global Supply &amp; Corporate Excellence
              </p>
              <div className="h-1 w-3/4 rounded bg-white/20" />
            </div>
            {!mobile && (
              <div className="col-span-5 rounded-lg bg-[#C84B13]/20 border border-[#C84B13]/40 p-2.5 flex flex-col justify-between">
                <span className="text-[9px] text-amber-200 font-medium">Markets Served</span>
                <p className="font-display text-xs font-semibold text-white">
                  B2B Partner Desk
                </p>
              </div>
            )}
          </div>

          {expanded && (
            <div className="border-t border-white/10 pt-2 flex justify-between text-[9px] text-sky-100/80">
              <span>Corporate Capability Showcase</span>
              <span className="text-amber-300 font-medium">Global Enquiries</span>
            </div>
          )}
        </div>
      );
  }
}

export default function ProjectSitePreview({
  project,
  size = 'card',
  viewport = 'desktop',
}: ProjectSitePreviewProps) {
  const palette = THEME_ACCENTS[project.previewTheme];
  const expanded = size === 'spotlight' || size === 'modal';
  const isMobileFrame = viewport === 'mobile';

  const frameHeightClass =
    size === 'modal'
      ? isMobileFrame
        ? 'h-[360px]'
        : 'h-[300px] sm:h-[340px]'
      : size === 'spotlight'
        ? 'h-[260px] sm:h-[300px]'
        : 'h-48 sm:h-52';

  return (
    <div
      className={`${
        isMobileFrame ? 'mx-auto w-[280px] sm:w-[300px] rounded-[26px] p-2 bg-zinc-900 shadow-2xl' : 'w-full'
      }`}
    >
      <div
        className={`w-full ${frameHeightClass} ${
          isMobileFrame ? 'rounded-[18px]' : 'rounded-xl'
        } overflow-hidden border ${
          palette.darkChrome ? 'border-white/10' : 'border-zinc-200/90'
        } ${palette.bg} flex flex-col shadow-xs transition-transform duration-300 group-hover:scale-[1.015]`}
      >
        <div
          className={`flex items-center justify-between gap-2 px-3 py-2 border-b ${palette.headerBg} shrink-0`}
        >
          <div className="flex items-center gap-1" aria-hidden="true">
            <span className="w-2 h-2 rounded-full bg-[#FF5F56]/85" />
            <span className="w-2 h-2 rounded-full bg-[#FFBD2E]/85" />
            <span className="w-2 h-2 rounded-full bg-[#27C93F]/85" />
          </div>

          <div
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-medium truncate max-w-[78%] ${
              palette.darkChrome ? 'bg-black/30' : 'bg-black/[0.04]'
            } ${palette.urlColor}`}
          >
            <Lock className="w-2.5 h-2.5 shrink-0 opacity-75" aria-hidden="true" />
            <span className="truncate">{project.domain}</span>
          </div>

          <span className="w-6 shrink-0" aria-hidden="true" />
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <PreviewCanvasBody
            project={project}
            expanded={expanded}
            mobile={isMobileFrame}
          />
        </div>
      </div>
    </div>
  );
}
