import { useEffect, useMemo, useRef, useState } from 'react';
import { Globe, Lock, RefreshCw } from 'lucide-react';
import type { ProjectItem } from '../data/siteData';

export interface ProjectSitePreviewProps {
  project: ProjectItem;
  size?: 'card' | 'spotlight' | 'modal';
  viewport?: 'desktop' | 'mobile';
  interactive?: boolean;
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

/**
 * Returns the effective iframe preview source for a website.
 * Domains that block iframes via X-Frame-Options (e.g. music.brambedkar.in)
 * are routed through our preview proxy.
 */
function resolvePreviewUrl(rawUrl: string, previewTheme?: string, forceProxy?: boolean): string {
  if (forceProxy) {
    return `/api/site-preview-proxy?url=${encodeURIComponent(rawUrl)}`;
  }

  try {
    const parsed = new URL(rawUrl);
    if (parsed.hostname === 'music.brambedkar.in' || previewTheme === 'music') {
      return `/api/site-preview-proxy?url=${encodeURIComponent(rawUrl)}`;
    }
    return rawUrl;
  } catch {
    return rawUrl;
  }
}

export default function ProjectSitePreview({
  project,
  size = 'card',
  viewport = 'desktop',
  interactive = false,
}: ProjectSitePreviewProps) {
  const palette = THEME_ACCENTS[project.previewTheme] ?? THEME_ACCENTS.constitution;
  const isMobileFrame = viewport === 'mobile';

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const [useProxy, setUseProxy] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const previewSrc = useMemo(
    () => resolvePreviewUrl(project.url, project.previewTheme, useProxy),
    [project.url, project.previewTheme, useProxy]
  );

  // Monitor container size for accurate CSS scale transform
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setContainerSize({
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
      }
    };

    measure();

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect && entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setContainerSize({
            width: Math.round(entry.contentRect.width),
            height: Math.round(entry.contentRect.height),
          });
        }
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [viewport, size]);

  // Reset loading state when source URL or viewport changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);

    // Timeout safety fallback: reveal after 7.5s even if analytics/trackers delay iframe load event
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 7500);

    return () => clearTimeout(timer);
  }, [previewSrc, viewport]);

  // Compute virtual resolution and scale factor
  const virtualWidth = isMobileFrame ? 375 : 1280;
  const defaultWidth = isMobileFrame
    ? 280
    : size === 'spotlight'
      ? 640
      : size === 'modal'
        ? 800
        : 340;
  const activeWidth = containerSize.width > 0 ? containerSize.width : defaultWidth;
  const scale = activeWidth / virtualWidth;

  const defaultHeight = isMobileFrame
    ? 400
    : size === 'spotlight'
      ? 260
      : size === 'modal'
        ? 340
        : 180;
  const activeHeight = containerSize.height > 0 ? containerSize.height : defaultHeight;
  const virtualHeight = scale > 0 ? Math.ceil(activeHeight / scale) : (isMobileFrame ? 667 : 800);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    if (!useProxy && !previewSrc.includes('/api/site-preview-proxy')) {
      setUseProxy(true);
    } else {
      setHasError(true);
    }
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasError(false);
    setIsLoaded(false);
    setUseProxy(true);
  };

  const frameHeightClass =
    size === 'modal'
      ? isMobileFrame
        ? 'h-[380px] sm:h-[420px]'
        : 'h-[320px] sm:h-[360px]'
      : size === 'spotlight'
        ? isMobileFrame
          ? 'h-[300px] sm:h-[340px]'
          : 'h-[260px] sm:h-[300px]'
        : 'h-48 sm:h-52';

  return (
    <div
      className={`${
        isMobileFrame
          ? 'mx-auto w-[280px] sm:w-[300px] rounded-[26px] p-2 bg-zinc-900 shadow-2xl'
          : 'w-full'
      }`}
    >
      <div
        className={`w-full ${frameHeightClass} ${
          isMobileFrame ? 'rounded-[18px]' : 'rounded-xl'
        } overflow-hidden border ${
          palette.darkChrome ? 'border-white/10' : 'border-zinc-200/90'
        } ${palette.bg} flex flex-col shadow-xs transition-transform duration-300 group-hover:scale-[1.015]`}
      >
        {/* Browser Chrome Header */}
        <div
          className={`flex items-center justify-between gap-2 px-3 py-2 border-b ${palette.headerBg} shrink-0 select-none`}
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

          <div className="flex items-center gap-1.5 w-6 justify-end" aria-hidden="true">
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                isLoaded ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'
              }`}
              title={isLoaded ? 'Live website connected' : 'Connecting to live website...'}
            />
          </div>
        </div>

        {/* Scaled Mini Preview Canvas */}
        <div
          ref={containerRef}
          className="relative flex-1 min-h-0 w-full overflow-hidden bg-white"
        >
          <iframe
            key={`${previewSrc}-${viewport}`}
            src={previewSrc}
            title={`Real mini preview of ${project.title}`}
            loading="lazy"
            tabIndex={-1}
            aria-hidden="true"
            sandbox="allow-scripts allow-same-origin allow-forms"
            scrolling="no"
            onLoad={handleLoad}
            onError={handleError}
            style={{
              width: `${virtualWidth}px`,
              height: `${virtualHeight}px`,
              transform: `scale(${scale})`,
              transformOrigin: '0 0',
              pointerEvents: interactive ? 'auto' : 'none',
              border: 'none',
            }}
            className={`absolute top-0 left-0 select-none bg-white transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Loading Skeleton */}
          {!isLoaded && !hasError && (
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 bg-zinc-50/90 transition-opacity duration-300 pointer-events-none"
              aria-hidden="true"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-xs border border-zinc-200/80 text-zinc-700 text-[11px] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#C84B13] animate-ping" />
                <span>Loading live preview...</span>
              </div>
            </div>
          )}

          {/* Error / Offline Fallback */}
          {hasError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 bg-zinc-50 text-center">
              <Globe className="w-6 h-6 text-zinc-400 mb-1.5" aria-hidden="true" />
              <p className="text-xs font-semibold text-zinc-800">{project.domain}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5 max-w-[200px]">
                {project.title}
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium text-[#C84B13] hover:underline cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" aria-hidden="true" />
                <span>Reload preview</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
