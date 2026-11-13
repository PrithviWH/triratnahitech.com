import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Monitor,
  Smartphone,
  X,
} from 'lucide-react';
import type { ProjectItem } from '../data/siteData';
import ProjectSitePreview from './ProjectSitePreview';

interface ProjectPreviewModalProps {
  project: ProjectItem | null;
  totalCount: number;
  currentIndex: number;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export default function ProjectPreviewModal({
  project,
  totalCount,
  currentIndex,
  onClose,
  onNavigate,
}: ProjectPreviewModalProps) {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onNavigate('prev');
      if (event.key === 'ArrowRight') onNavigate('next');
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose, onNavigate]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#09090B]/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white border border-zinc-200 shadow-2xl p-5 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 pb-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#0F4C5C] tabular-nums">
              {String(currentIndex + 1).padStart(2, '0')} /{' '}
              {String(totalCount).padStart(2, '0')} · {project.category}
            </p>
            <h2
              id="project-modal-title"
              className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-[#09090B] mt-1"
            >
              {project.title}
            </h2>
            <p className="text-sm font-medium text-[#C84B13] mt-0.5">{project.domain}</p>
          </div>

          <div className="flex items-center gap-2">
            <div
              role="group"
              aria-label="Preview screen size"
              className="inline-flex items-center p-1 rounded-xl bg-zinc-100 border border-zinc-200/80"
            >
              <button
                type="button"
                aria-pressed={viewport === 'desktop'}
                onClick={() => setViewport('desktop')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  viewport === 'desktop'
                    ? 'bg-[#09090B] text-white'
                    : 'text-zinc-600 hover:text-[#09090B]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                aria-pressed={viewport === 'mobile'}
                onClick={() => setViewport('mobile')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  viewport === 'mobile'
                    ? 'bg-[#09090B] text-white'
                    : 'text-zinc-600 hover:text-[#09090B]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Mobile</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close project preview"
              className="w-9 h-9 rounded-xl border border-zinc-200 bg-white flex items-center justify-center text-zinc-700 hover:bg-zinc-50 hover:text-[#09090B] cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-[#F6F6F7] border border-zinc-200/80 p-4 sm:p-6">
          <ProjectSitePreview project={project} size="modal" viewport={viewport} />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              {project.scope} · {project.deliverables[0]} · {project.deliverables[1]}
            </p>
            <p className="font-body text-base leading-relaxed text-zinc-700">
              {project.caption}
            </p>
          </div>

          <div className="md:col-span-4 flex flex-wrap items-center justify-between md:justify-end gap-2.5">
            <div className="inline-flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onNavigate('prev')}
                aria-label="Previous project"
                className="w-10 h-10 rounded-xl border border-zinc-200 bg-white flex items-center justify-center text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('next')}
                aria-label="Next project"
                className="w-10 h-10 rounded-xl border border-zinc-200 bg-white flex items-center justify-center text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 cursor-pointer transition-colors"
              >
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#09090B] text-white font-display text-sm font-semibold hover:bg-[#C84B13] transition-colors"
            >
              <span>Visit Website</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
