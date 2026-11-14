import { useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Expand,
  Globe,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  CLIENT_CATEGORIES,
  CLIENTS_DATA,
  HOME_COPY,
  PROJECT_CATEGORIES,
  PROJECTS_DATA,
  type ProjectItem,
} from '../data/siteData';
import { filterByCategory } from '../utils/siteLogic';
import {
  filterProjects,
  getAdjacentProject,
  getCategoryCounts,
} from '../utils/projectShowcase';
import { Button, ChamferCard, SectionLabel } from '../components/UiPrimitives';
import { GemMarker } from '../components/GemMotif';
import ProjectSitePreview from '../components/ProjectSitePreview';
import ProjectPreviewModal from '../components/ProjectPreviewModal';

export default function ClientsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [projectCategory, setProjectCategory] = useState<string>('All');
  const [modalProjectId, setModalProjectId] = useState<string | null>(null);

  const filteredClients = useMemo(
    () => filterByCategory(CLIENTS_DATA, selectedCategory),
    [selectedCategory],
  );

  const projectCategoryCounts = useMemo(
    () => getCategoryCounts(PROJECTS_DATA, PROJECT_CATEGORIES),
    [],
  );

  const visibleProjects = useMemo(
    () => filterProjects(PROJECTS_DATA, projectCategory),
    [projectCategory],
  );

  const projectById = useMemo(() => {
    const map = new Map<string, ProjectItem>();
    for (const p of PROJECTS_DATA) {
      map.set(p.id, p);
    }
    return map;
  }, []);

  const activeModalProject = useMemo(
    () =>
      modalProjectId
        ? PROJECTS_DATA.find((item) => item.id === modalProjectId) ?? null
        : null,
    [modalProjectId],
  );

  const activeModalIndex = useMemo(
    () =>
      activeModalProject
        ? PROJECTS_DATA.findIndex((item) => item.id === activeModalProject.id)
        : -1,
    [activeModalProject],
  );

  const handleModalNavigate = (direction: 'prev' | 'next') => {
    if (!activeModalProject) return;
    const next = getAdjacentProject(PROJECTS_DATA, activeModalProject.id, direction);
    if (next) setModalProjectId(next.id);
  };

  return (
    <div>
      {/* 1. HERO & CLIENT INDUSTRY FILTER */}
      <section className="bg-[#FAFAFA] dot-grid-light border-b border-zinc-200/80 pt-14 pb-16 sm:pt-20 sm:pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <SectionLabel number="01" label="Collaborations & Portfolio" />
              <h1 className="font-display font-extrabold text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight text-[#09090B]">
                {HOME_COPY.clientsSection.title}{' '}
                <span className="font-serif-accent italic font-normal text-[#C84B13]">
                  &amp; Projects
                </span>
              </h1>
              <p className="font-body text-lg sm:text-xl text-zinc-600 mt-4 max-w-2xl">
                {HOME_COPY.clientsSection.text} Explore our partner roster alongside interactive previews of all 12 live websites and regional portals.
              </p>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <Button href="#live-client-projects" variant="primary">
                <span>Browse 12 Live Websites</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div
            role="group"
            aria-label="Filter clients by industry"
            className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-zinc-100 border border-zinc-200/80 mt-8"
          >
            {CLIENT_CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative px-4 py-2 rounded-lg font-display text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    active ? 'text-white' : 'text-zinc-600 hover:text-[#09090B]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="clients-filter-pill"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-lg bg-[#09090B] shadow-xs"
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. ELEVATED CLIENT PARTNER CARDS (WITH EMBEDDED PROJECT PREVIEWS) */}
      <section className="py-16 sm:py-24 bg-white border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client, idx) => {
              const linkedProject = client.projectId
                ? projectById.get(client.projectId)
                : undefined;

              return (
                <ChamferCard
                  key={client.id}
                  surface="white"
                  className="group relative p-6 sm:p-7 flex flex-col justify-between gap-6 card-elevated-hover hover:border-[#C84B13]/45"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-[#09090B] text-white flex items-center justify-center font-display font-bold text-sm tracking-tight shrink-0">
                          {client.monogram}
                        </div>
                        <div>
                          <span className="text-xs font-display font-semibold text-[#0F4C5C] tabular-nums block">
                            {String(idx + 1).padStart(2, '0')} · {client.category}
                          </span>
                          <h2 className="font-display font-bold text-xl tracking-tight text-[#09090B] group-hover:text-[#C84B13] transition-colors">
                            {client.name}
                          </h2>
                        </div>
                      </div>
                      <GemMarker
                        size={8}
                        color={linkedProject ? '#C84B13' : '#0F4C5C'}
                        className="shrink-0 mt-1"
                      />
                    </div>

                    {linkedProject && (
                      <button
                        type="button"
                        onClick={() => setModalProjectId(linkedProject.id)}
                        aria-label={`Inspect live website preview for ${client.name}`}
                        className="block w-full text-left relative rounded-xl focus-visible:outline-2 focus-visible:outline-[#C84B13] cursor-pointer"
                      >
                        <ProjectSitePreview project={linkedProject} size="card" />
                        <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-lg bg-[#09090B]/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm">
                          <Expand className="w-3 h-3" aria-hidden="true" />
                          <span>Inspect</span>
                        </span>
                      </button>
                    )}

                    <div className="space-y-1.5">
                      <p className="font-display text-xs font-semibold text-[#0F4C5C]">
                        {client.focus}
                      </p>
                      {client.domain && (
                        <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C84B13]">
                          <Globe className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{client.domain}</span>
                        </p>
                      )}
                      <p className="font-body text-sm text-zinc-600 leading-relaxed">
                        {client.summary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                      <span>{client.deliverables[0]}</span>
                      <span aria-hidden="true">·</span>
                      <span>{client.deliverables[1]}</span>
                    </div>

                    {linkedProject ? (
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => setModalProjectId(linkedProject.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-display font-semibold text-[#09090B] hover:text-[#C84B13] cursor-pointer transition-colors"
                        >
                          <Expand className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Preview Site</span>
                        </button>
                        {client.url && (
                          <a
                            href={client.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-display font-semibold text-[#0F4C5C] hover:text-[#C84B13] transition-colors"
                          >
                            <span>Visit Live</span>
                            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <span className="text-xs font-medium text-zinc-400">
                          Pune Digital Growth Partner
                        </span>
                        <Button to="/contact" variant="ghost" className="px-3 py-1.5 text-xs">
                          <span>Enquire</span>
                          <ArrowRight className="w-3 h-3" aria-hidden="true" />
                        </Button>
                      </div>
                    )}
                  </div>
                </ChamferCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. COMPLETE LIVE PROJECTS DIRECTORY (CONTENT FROM PROJECTS PAGE) */}
      <section
        id="live-client-projects"
        className="scroll-mt-20 py-20 sm:py-28 bg-[#FAFAFA] dot-grid-light"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <SectionLabel number="02" label="Live Web Portfolio" />
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-[#09090B]">
                12 Live Client &amp; Portal Websites
              </h2>
              <p className="font-body text-base sm:text-lg text-zinc-600 mt-3 max-w-2xl">
                Every website and digital edition launched across business brands, constitutional knowledge hubs, and Marathi &amp; Hindi publications.
              </p>
            </div>

            <div
              role="group"
              aria-label="Filter live websites by category"
              className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-white border border-zinc-200/90 self-start"
            >
              {PROJECT_CATEGORIES.map((cat) => {
                const active = projectCategory === cat;
                const count = projectCategoryCounts[cat] ?? 0;
                return (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setProjectCategory(cat)}
                    className={`relative px-3.5 py-2 rounded-lg font-display text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                      active ? 'text-white' : 'text-zinc-600 hover:text-[#09090B]'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="clients-page-projects-pill"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.map((project, idx) => (
              <article
                key={project.id}
                className="group rounded-2xl border border-zinc-200 bg-white card-elevated card-elevated-hover hover:border-[#C84B13]/45 p-5 sm:p-6 flex flex-col justify-between gap-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-display font-semibold text-[#0F4C5C] tabular-nums">
                      {String(idx + 1).padStart(2, '0')} · {project.category}
                    </span>
                    <span className="text-[11px] font-medium text-zinc-500">
                      {project.scope}
                    </span>
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
                    <h3 className="font-display font-bold text-lg sm:text-xl tracking-tight text-[#09090B]">
                      {project.title}
                    </h3>
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

          <div className="mt-16 pt-10 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="font-body text-base sm:text-lg text-zinc-600">
              Ready to build your digital presence with our Pune team?
            </p>
            <Button to="/contact" variant="primary" magnetic>
              <span>Let&apos;s Talk</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      <ProjectPreviewModal
        project={activeModalProject}
        totalCount={PROJECTS_DATA.length}
        currentIndex={activeModalIndex}
        onClose={() => setModalProjectId(null)}
        onNavigate={handleModalNavigate}
      />
    </div>
  );
}
