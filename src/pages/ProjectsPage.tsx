import { useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Expand,
  Monitor,
  Search,
  Smartphone,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  PROJECT_CATEGORIES,
  PROJECTS_DATA,
  type ProjectItem,
} from '../data/siteData';
import {
  filterProjects,
  getAdjacentProject,
  getCategoryCounts,
} from '../utils/projectShowcase';
import { Button, SectionLabel } from '../components/UiPrimitives';
import { GemMarker } from '../components/GemMotif';
import ProjectSitePreview from '../components/ProjectSitePreview';
import ProjectPreviewModal from '../components/ProjectPreviewModal';

const SPOTLIGHT_IDS = [
  'constitution-brambedkar',
  'kimaya-food-products',
  'saksham-real-estate',
  'care32-dentist',
  'askk-international',
] as const;

export default function ProjectsPage() {
  const [category, setCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [spotlightId, setSpotlightId] = useState<string>(SPOTLIGHT_IDS[0]);
  const [spotlightViewport, setSpotlightViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [modalProjectId, setModalProjectId] = useState<string | null>(null);

  const categoryCounts = useMemo(
    () => getCategoryCounts(PROJECTS_DATA, PROJECT_CATEGORIES),
    []
  );

  const visibleProjects = useMemo(
    () => filterProjects(PROJECTS_DATA, category, searchQuery),
    [category, searchQuery]
  );

  const spotlightProjects = useMemo(
    () =>
      SPOTLIGHT_IDS.map((id) => PROJECTS_DATA.find((item) => item.id === id)).filter(
        (item): item is ProjectItem => Boolean(item)
      ),
    []
  );

  const activeSpotlight =
    spotlightProjects.find((item) => item.id === spotlightId) ?? spotlightProjects[0];

  const modalList = visibleProjects.length > 0 ? visibleProjects : PROJECTS_DATA;
  const activeModalProject =
    modalProjectId ? modalList.find((item) => item.id === modalProjectId) ?? null : null;
  const activeModalIndex = activeModalProject
    ? modalList.findIndex((item) => item.id === activeModalProject.id)
    : -1;

  const showSpotlight = category === 'All' && searchQuery.trim() === '';

  const handleModalNavigate = (direction: 'prev' | 'next') => {
    if (!activeModalProject) return;
    const next = getAdjacentProject(modalList, activeModalProject.id, direction);
    if (next) setModalProjectId(next.id);
  };

  const getGridContainerClass = (count: number) => {
    if (count === 4) {
      return 'grid grid-cols-1 md:grid-cols-2 gap-6';
    }
    if (count === 5) {
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6';
    }
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
  };

  const getGridItemSpanClass = (count: number, idx: number) => {
    if (count === 5) {
      return idx < 2 ? 'lg:col-span-3' : 'lg:col-span-2';
    }
    return '';
  };

  return (
    <div>
      <section className="bg-[#FAFAFA] dot-grid-light border-b border-zinc-200/80 pt-14 pb-12 sm:pt-20 sm:pb-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionLabel number="01" label="Live Web Portfolio" />
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="font-display font-extrabold text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight text-[#09090B]">
                Our Projects
              </h1>
              <p className="font-body text-lg sm:text-xl text-zinc-600 mt-4 max-w-2xl">
                Interactive previews across business websites, regional news editions, and cultural portals launched with our clients.
              </p>
            </div>

            <div className="w-full lg:w-72 shrink-0">
              <label htmlFor="project-search-input" className="sr-only">
                Search websites by domain or title
              </label>
              <div className="relative">
                <Search
                  className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="project-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search domain or project..."
                  className="w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-9 py-2.5 text-sm font-body text-[#09090B] placeholder:text-zinc-400 focus:border-[#C84B13] focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md text-zinc-400 hover:text-[#09090B] flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div
            role="group"
            aria-label="Filter projects by category"
            className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-zinc-100 border border-zinc-200/80 mt-8"
          >
            {PROJECT_CATEGORIES.map((cat) => {
              const active = category === cat;
              const count = categoryCounts[cat] ?? 0;
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(cat)}
                  className={`relative px-4 py-2 rounded-lg font-display text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    active ? 'text-white' : 'text-zinc-600 hover:text-[#09090B]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="projects-filter-pill"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-lg bg-[#09090B] shadow-xs"
                    />
                  )}
                  <span className="relative z-10 inline-flex items-center gap-1.5">
                    <span>{cat}</span>
                    <span
                      className={`tabular-nums text-[11px] ${
                        active ? 'text-amber-300' : 'text-zinc-400'
                      }`}
                    >
                      {count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {showSpotlight && activeSpotlight && (
        <section className="py-12 sm:py-16 bg-white border-b border-zinc-100">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <SectionLabel number="02" label="Interactive Spotlight" />
              <div
                role="group"
                aria-label="Spotlight device frame"
                className="inline-flex items-center p-1 rounded-xl bg-zinc-100 border border-zinc-200/80"
              >
                <button
                  type="button"
                  aria-pressed={spotlightViewport === 'desktop'}
                  onClick={() => setSpotlightViewport('desktop')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    spotlightViewport === 'desktop'
                      ? 'bg-[#09090B] text-white'
                      : 'text-zinc-600 hover:text-[#09090B]'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  aria-pressed={spotlightViewport === 'mobile'}
                  onClick={() => setSpotlightViewport('mobile')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    spotlightViewport === 'mobile'
                      ? 'bg-[#09090B] text-white'
                      : 'text-zinc-600 hover:text-[#09090B]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-[#FAFAFA] card-elevated p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-2">
                {spotlightProjects.map((item, idx) => {
                  const selected = item.id === activeSpotlight.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setSpotlightId(item.id)}
                      className={`w-full text-left rounded-2xl px-4 py-3.5 border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        selected
                          ? 'bg-white border-[#C84B13]/50 shadow-sm'
                          : 'bg-transparent border-transparent hover:bg-white/70 hover:border-zinc-200/80'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-semibold tabular-nums ${
                              selected ? 'text-[#C84B13]' : 'text-zinc-400'
                            }`}
                          >
                            0{idx + 1}
                          </span>
                          <span className="font-display font-bold text-sm sm:text-base text-[#09090B] truncate">
                            {item.title}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-zinc-500 mt-0.5 pl-6 truncate">
                          {item.domain}
                        </p>
                      </div>
                      <ArrowRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          selected
                            ? 'text-[#C84B13] translate-x-0.5'
                            : 'text-zinc-300'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>

              <div className="lg:col-span-7 space-y-5">
                <div className="group rounded-2xl bg-white border border-zinc-200/90 p-3 sm:p-4 shadow-xs">
                  <ProjectSitePreview
                    project={activeSpotlight}
                    size="spotlight"
                    viewport={spotlightViewport}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0F4C5C]">
                      {activeSpotlight.scope} · {activeSpotlight.deliverables[0]}
                    </p>
                    <p className="font-body text-sm sm:text-base text-zinc-600 max-w-xl">
                      {activeSpotlight.caption}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setModalProjectId(activeSpotlight.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-300 bg-white font-display text-xs font-semibold text-[#09090B] hover:border-[#C84B13] hover:text-[#C84B13] cursor-pointer transition-colors"
                    >
                      <Expand className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Inspect</span>
                    </button>
                    <a
                      href={activeSpotlight.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#09090B] font-display text-xs font-semibold text-white hover:bg-[#C84B13] transition-colors"
                    >
                      <span>Visit Site</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <SectionLabel
                number={showSpotlight ? '03' : '02'}
                label={category === 'All' ? 'All Website Previews' : category}
              />
              <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-[#09090B]">
                {searchQuery.trim()
                  ? `Matching Websites (${visibleProjects.length})`
                  : category === 'All'
                    ? 'Complete Website Directory'
                    : `${category} Showcase`}
              </h2>
            </div>

            <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500 tabular-nums">
              Showing {visibleProjects.length} of {PROJECTS_DATA.length} Websites
            </p>
          </div>

          {visibleProjects.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-[#FAFAFA] p-10 text-center space-y-4">
              <p className="font-display font-bold text-xl text-[#09090B]">
                No websites match &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="font-body text-sm text-zinc-600 max-w-md mx-auto">
                Try clearing your filter or switching back to all 12 client and portal websites.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategory('All');
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#09090B] text-white font-display text-xs font-semibold hover:bg-[#C84B13] cursor-pointer transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={getGridContainerClass(visibleProjects.length)}>
              {visibleProjects.map((project, idx) => (
                <article
                  key={project.id}
                  className={`group rounded-2xl border border-zinc-200 bg-white card-elevated card-elevated-hover hover:border-[#C84B13]/45 p-5 sm:p-6 flex flex-col justify-between gap-5 ${getGridItemSpanClass(
                    visibleProjects.length,
                    idx
                  )}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-[#0F4C5C] tabular-nums">
                        {String(idx + 1).padStart(2, '0')} · {project.category}
                      </span>
                      {project.featured ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C84B13]">
                          <GemMarker size={8} color="#C84B13" />
                          Featured
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-zinc-400">
                          {project.scope}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setModalProjectId(project.id)}
                      aria-label={`Inspect preview of ${project.domain}`}
                      className="block w-full text-left relative rounded-xl focus-visible:outline-2 focus-visible:outline-[#C84B13] cursor-pointer"
                    >
                      <ProjectSitePreview project={project} size="card" />
                      <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-lg bg-[#09090B]/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm">
                        <Expand className="w-3 h-3" aria-hidden="true" />
                        <span>Inspect</span>
                      </span>
                    </button>

                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-display font-bold text-lg sm:text-xl tracking-tight text-[#09090B]">
                          {project.title}
                        </h3>
                      </div>
                      <p className="text-xs font-semibold text-[#C84B13] tracking-wide">
                        {project.domain}
                      </p>
                      <p className="font-body text-sm leading-relaxed text-zinc-600">
                        {project.caption}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setModalProjectId(project.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-display font-semibold text-[#09090B] hover:text-[#C84B13] cursor-pointer transition-colors"
                    >
                      <Expand className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Preview Layout</span>
                    </button>

                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-display font-semibold text-[#0F4C5C] hover:text-[#C84B13] transition-colors"
                    >
                      <span>Visit Site</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-[#09090B] text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <SectionLabel number={showSpotlight ? '04' : '03'} label="Collaborate" dark />
            <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight">
              Build Your Next Project
            </h2>
            <p className="font-body text-lg text-zinc-300 max-w-2xl">
              Have a project in mind? Let&apos;s build your online presence with thoughtful design, dependable development, and digital marketing that helps your business grow.
            </p>
          </div>
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <Button to="/contact" variant="dark" magnetic>
              <span>Let&apos;s Talk</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      <ProjectPreviewModal
        project={activeModalProject}
        totalCount={modalList.length}
        currentIndex={activeModalIndex}
        onClose={() => setModalProjectId(null)}
        onNavigate={handleModalNavigate}
      />
    </div>
  );
}
