import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Expand,
  Lock,
  Search,
  Sparkles,
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

  const handleSpotlightNavigate = (direction: 'prev' | 'next') => {
    const currentIdx = spotlightProjects.findIndex((p) => p.id === activeSpotlight.id);
    if (direction === 'prev') {
      const prevIdx = (currentIdx - 1 + spotlightProjects.length) % spotlightProjects.length;
      setSpotlightId(spotlightProjects[prevIdx].id);
    } else {
      const nextIdx = (currentIdx + 1) % spotlightProjects.length;
      setSpotlightId(spotlightProjects[nextIdx].id);
    }
  };

  const getGridContainerClass = (count: number) => {
    if (count === 4) {
      return 'grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8';
    }
    if (count === 5) {
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8';
    }
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8';
  };

  const getGridItemSpanClass = (count: number, idx: number) => {
    if (count === 5) {
      return idx < 2 ? 'lg:col-span-3' : 'lg:col-span-2';
    }
    return '';
  };

  return (
    <div className="bg-[#FAFAFA]">
      {/* 1. HERO & SEARCH SECTION */}
      <section className="bg-[#FAFAFA] dot-grid-light border-b border-zinc-200/80 pt-14 pb-12 sm:pt-20 sm:pb-16 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-32 right-10 w-96 h-96 bg-radial from-[#C84B13]/6 via-transparent to-transparent pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <SectionLabel number="01" label="Live Web Portfolio" />
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="font-display font-black text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight text-[#09090B]">
                Live Client{' '}
                <span className="font-serif-accent italic font-normal text-[#C84B13]">
                  Projects
                </span>
              </h1>
              <p className="font-body text-base sm:text-xl text-zinc-600 mt-4 max-w-2xl leading-relaxed">
                Explore real, active desktop previews across high-converting e-commerce sites, medical platforms, real estate engines, and national cultural portals built for our clients.
              </p>

              {/* Trust & Proof Chips */}
              <div className="flex flex-wrap items-center gap-2.5 mt-6 text-xs font-display font-medium text-zinc-600">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-zinc-200/90 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-zinc-900">12 Live Deployments</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-zinc-200/90 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C84B13]" />
                  <span>100% Production Verified</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-zinc-200/90 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Scaled Desktop Frames</span>
                </span>
              </div>
            </div>

            <div className="w-full lg:w-80 shrink-0">
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
                  placeholder="Search by domain, brand, or tag..."
                  className="w-full rounded-2xl border border-zinc-200 bg-white pl-10 pr-9 py-3 text-sm font-body text-[#09090B] placeholder:text-zinc-400 focus:border-[#C84B13] focus:ring-2 focus:ring-[#C84B13]/10 focus:outline-none transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md text-zinc-400 hover:text-[#09090B] flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div
            role="group"
            aria-label="Filter projects by category"
            className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-zinc-100/90 border border-zinc-200/80 mt-8 shadow-inner"
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
                  className={`relative px-4 py-2 rounded-xl font-display text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    active ? 'text-white' : 'text-zinc-600 hover:text-[#09090B]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="projects-filter-pill"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-xl bg-[#09090B] shadow-xs"
                    />
                  )}
                  <span className="relative z-10 inline-flex items-center gap-1.5">
                    <span>{cat}</span>
                    <span
                      className={`tabular-nums text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                        active ? 'bg-white/20 text-white' : 'bg-zinc-200/80 text-zinc-500'
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

      {/* 2. INTERACTIVE STUDIO SPOTLIGHT (DESKTOP DEFAULT) */}
      {showSpotlight && activeSpotlight && (
        <section className="py-12 sm:py-16 bg-white border-b border-zinc-200/70 relative">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <SectionLabel number="02" label="Studio Spotlight" />

              <div className="flex items-center gap-2.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200/90 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-display text-[11px] font-semibold uppercase tracking-wider text-zinc-800">
                    Desktop Viewport Stage
                  </span>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 border border-zinc-200/80 text-xs font-semibold tabular-nums text-zinc-600">
                  <span>
                    {String(spotlightProjects.findIndex((p) => p.id === activeSpotlight.id) + 1).padStart(2, '0')}
                  </span>
                  <span className="text-zinc-400">/</span>
                  <span>{String(spotlightProjects.length).padStart(2, '0')}</span>
                </div>
              </div>
            </div>

            {/* Workstation Frame */}
            <div className="relative rounded-3xl border border-zinc-200/90 bg-gradient-to-b from-white via-zinc-50/60 to-[#FAFAFA] p-6 sm:p-8 shadow-[0_24px_60px_-20px_rgba(9,9,11,0.08)] overflow-hidden">
              {/* Copper Specular Top Hairline */}
              <div
                aria-hidden="true"
                className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#C84B13]/60 to-transparent pointer-events-none"
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Panel: Featured Project Switcher */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80">
                    <span className="text-[11px] font-display font-bold uppercase tracking-[0.14em] text-[#0F4C5C]">
                      Featured Platforms
                    </span>
                    <span className="text-[11px] font-medium text-zinc-400">
                      Select to preview
                    </span>
                  </div>

                  <div className="space-y-2">
                    {spotlightProjects.map((item, idx) => {
                      const selected = item.id === activeSpotlight.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setSpotlightId(item.id)}
                          className={`w-full text-left rounded-2xl p-4 border transition-all cursor-pointer flex items-center justify-between gap-3 relative ${
                            selected
                              ? 'bg-white border-[#C84B13]/60 shadow-sm ring-1 ring-[#C84B13]/15'
                              : 'bg-white/40 border-zinc-200/70 hover:bg-white hover:border-zinc-300'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-bold tabular-nums ${
                                  selected ? 'text-[#C84B13]' : 'text-zinc-400'
                                }`}
                              >
                                0{idx + 1}
                              </span>
                              <span className="font-display font-bold text-sm sm:text-base text-[#09090B] truncate">
                                {item.title}
                              </span>
                              {item.featured && (
                                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                                  Featured
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 pl-6">
                              <span className="text-xs font-semibold text-[#0F4C5C] truncate">
                                {item.domain}
                              </span>
                              <span className="text-zinc-300">·</span>
                              <span className="text-[11px] text-zinc-500 truncate">
                                {item.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {selected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C84B13]" />
                            )}
                            <ChevronRight
                              className={`w-4 h-4 transition-transform ${
                                selected ? 'text-[#C84B13] translate-x-0.5' : 'text-zinc-300'
                              }`}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Panel: Scaled Desktop Browser Stage */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="rounded-2xl bg-white border border-zinc-200/90 shadow-sm overflow-hidden flex flex-col">
                    {/* Simulated Browser Chrome */}
                    <div className="h-10 bg-zinc-100/90 border-b border-zinc-200/80 px-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80" />
                      </div>

                      <a
                        href={activeSpotlight.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Visit ${activeSpotlight.domain}`}
                        className="flex-1 max-w-sm mx-auto flex items-center justify-center gap-1.5 px-3 py-1 rounded-md bg-white border border-zinc-200/80 text-[11px] font-medium text-zinc-600 hover:text-[#C84B13] truncate shadow-2xs transition-colors"
                      >
                        <Lock className="w-3 h-3 text-emerald-600 shrink-0" aria-hidden="true" />
                        <span className="truncate">{activeSpotlight.domain}</span>
                      </a>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setModalProjectId(activeSpotlight.id)}
                          aria-label="Inspect layout in modal"
                          title="Inspect layout in modal"
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-[#09090B] hover:bg-zinc-200/60 transition-colors cursor-pointer"
                        >
                          <Expand className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <a
                          href={activeSpotlight.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${activeSpotlight.domain} in new tab`}
                          title="Open live site"
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-[#C84B13] hover:bg-zinc-200/60 transition-colors"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      </div>
                    </div>

                    {/* Scaled Desktop Frame */}
                    <div className="p-3 sm:p-4 bg-zinc-50/50">
                      <ProjectSitePreview
                        project={activeSpotlight}
                        size="spotlight"
                        viewport="desktop"
                      />
                    </div>
                  </div>

                  {/* Spotlight Info & Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1 pt-1">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#0F4C5C]/10 text-[#0F4C5C] text-[11px] font-semibold uppercase tracking-wider">
                          {activeSpotlight.category}
                        </span>
                        <span className="text-xs font-semibold text-zinc-500">
                          {activeSpotlight.scope}
                        </span>
                      </div>
                      <p className="font-body text-sm text-zinc-600 max-w-xl leading-relaxed">
                        {activeSpotlight.caption}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="inline-flex items-center gap-1 mr-1">
                        <button
                          type="button"
                          onClick={() => handleSpotlightNavigate('prev')}
                          aria-label="Previous spotlight project"
                          className="w-9 h-9 rounded-xl border border-zinc-200 bg-white flex items-center justify-center text-zinc-600 hover:text-[#09090B] hover:border-zinc-300 transition-colors cursor-pointer shadow-2xs"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSpotlightNavigate('next')}
                          aria-label="Next spotlight project"
                          className="w-9 h-9 rounded-xl border border-zinc-200 bg-white flex items-center justify-center text-zinc-600 hover:text-[#09090B] hover:border-zinc-300 transition-colors cursor-pointer shadow-2xs"
                        >
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setModalProjectId(activeSpotlight.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-300 bg-white font-display text-xs font-semibold text-[#09090B] hover:border-[#C84B13] hover:text-[#C84B13] cursor-pointer transition-colors shadow-2xs"
                      >
                        <Expand className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Inspect</span>
                      </button>
                      <a
                        href={activeSpotlight.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#09090B] font-display text-xs font-semibold text-white hover:bg-[#C84B13] transition-colors shadow-2xs"
                      >
                        <span>Visit Site</span>
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. COMPLETE DIRECTORY GRID (ALL 12 WEBSITES) */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-5 border-b border-zinc-100">
            <div>
              <SectionLabel
                number={showSpotlight ? '03' : '02'}
                label={category === 'All' ? 'All Website Previews' : category}
              />
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight text-[#09090B] mt-1">
                {searchQuery.trim()
                  ? `Matching Websites (${visibleProjects.length})`
                  : category === 'All'
                    ? 'Complete Website Directory'
                    : `${category} Showcase`}
              </h2>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 tabular-nums">
              Showing {visibleProjects.length} of {PROJECTS_DATA.length} Production Sites
            </p>
          </div>

          {visibleProjects.length === 0 ? (
            <div className="rounded-3xl border border-zinc-200 bg-[#FAFAFA] p-12 text-center space-y-4 max-w-xl mx-auto">
              <p className="font-display font-bold text-xl text-[#09090B]">
                No websites match &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="font-body text-sm text-zinc-600 leading-relaxed">
                Try searching by domain, technology, or clear your category filter to see all 12 client platforms.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategory('All');
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#09090B] text-white font-display text-xs font-semibold hover:bg-[#C84B13] cursor-pointer transition-colors shadow-2xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={getGridContainerClass(visibleProjects.length)}>
              {visibleProjects.map((project, idx) => (
                <article
                  key={project.id}
                  className={`group rounded-3xl border border-zinc-200/90 bg-white shadow-[0_4px_20px_-8px_rgba(9,9,11,0.06)] hover:shadow-[0_16px_40px_-12px_rgba(9,9,11,0.12)] hover:border-[#C84B13]/40 p-5 sm:p-6 flex flex-col justify-between gap-5 transition-all duration-200 ${getGridItemSpanClass(
                    visibleProjects.length,
                    idx
                  )}`}
                >
                  <div className="space-y-4">
                    {/* Card Top Label & Badge */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-[#0F4C5C] tabular-nums tracking-wide">
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

                    {/* Card Browser Chrome & Desktop Preview */}
                    <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 overflow-hidden shadow-2xs">
                      <div className="h-8 px-3 rounded-t-xl bg-zinc-100/80 border-b border-zinc-200/70 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1" aria-hidden="true">
                          <span className="w-2 h-2 rounded-full bg-zinc-300" />
                          <span className="w-2 h-2 rounded-full bg-zinc-300" />
                          <span className="w-2 h-2 rounded-full bg-zinc-300" />
                        </div>
                        <span className="font-medium text-zinc-500 truncate max-w-[170px]">
                          {project.domain}
                        </span>
                        <Lock className="w-3 h-3 text-emerald-600/70" aria-hidden="true" />
                      </div>

                      <button
                        type="button"
                        onClick={() => setModalProjectId(project.id)}
                        aria-label={`Inspect desktop preview of ${project.domain}`}
                        className="block w-full text-left relative focus-visible:outline-2 focus-visible:outline-[#C84B13] cursor-pointer"
                      >
                        <ProjectSitePreview project={project} size="card" viewport="desktop" />
                        <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-lg bg-[#09090B]/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm">
                          <Expand className="w-3 h-3" aria-hidden="true" />
                          <span>Inspect Layout</span>
                        </span>
                      </button>
                    </div>

                    {/* Project Info */}
                    <div className="space-y-2">
                      <h3 className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-[#09090B] group-hover:text-[#C84B13] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs font-semibold text-[#0F4C5C] tracking-wide">
                        {project.domain}
                      </p>
                      <p className="font-body text-sm leading-relaxed text-zinc-600 line-clamp-2">
                        {project.caption}
                      </p>

                      {/* Deliverables Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.deliverables.slice(0, 2).map((del) => (
                          <span
                            key={del}
                            className="px-2 py-0.5 rounded-md bg-zinc-100 text-[10.5px] font-medium text-zinc-600"
                          >
                            {del}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
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

      {/* 4. BOTTOM COLLABORATE CTA BANNER */}
      <section className="py-20 sm:py-24 bg-[#09090B] text-white relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -bottom-28 -left-28 w-96 h-96 bg-radial from-[#C84B13]/25 via-transparent to-transparent pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <SectionLabel number={showSpotlight ? '04' : '03'} label="Collaborate" dark />
            <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight leading-[1.05]">
              Build Your Next Digital Success Story
            </h2>
            <p className="font-body text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed">
              Have an ambitious vision? Let&apos;s build your online presence with dependable engineering, dominant SEO, and digital marketing that delivers measurable growth.
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

      {/* 5. PREVIEW MODAL */}
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
