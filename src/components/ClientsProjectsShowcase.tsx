import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Expand,
  Globe,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  CLIENTS_DATA,
  HOME_COPY,
  PROJECT_CATEGORIES,
  PROJECTS_DATA,
  type ClientItem,
  type ProjectItem,
} from '../data/siteData';
import {
  filterProjects,
  getAdjacentProject,
  getCategoryCounts,
} from '../utils/projectShowcase';
import { Button, SectionLabel } from './UiPrimitives';
import { GemMarker } from './GemMotif';
import ProjectSitePreview from './ProjectSitePreview';
import ProjectPreviewModal from './ProjectPreviewModal';

const HOME_SHOWCASE_TABS = [
  'Featured Launches',
  'Business & Brands',
  'Knowledge & Portals',
  'News & Regional',
] as const;

type ShowcaseTab = (typeof HOME_SHOWCASE_TABS)[number];

const FEATURED_HOME_PROJECT_IDS = [
  'kimaya-food-products',
  'saksham-real-estate',
  'care32-dentist',
  'askk-international',
  'constitution-brambedkar',
  'marathi-brambedkar',
] as const;

export function ClientsProjectsShowcase({
  sectionNumber = '04',
}: {
  sectionNumber?: string;
}) {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('Featured Launches');
  const [modalProjectId, setModalProjectId] = useState<string | null>(null);

  const categoryCounts = useMemo(
    () => getCategoryCounts(PROJECTS_DATA, PROJECT_CATEGORIES),
    [],
  );

  const displayedProjects = useMemo<ProjectItem[]>(() => {
    if (activeTab === 'Featured Launches') {
      return FEATURED_HOME_PROJECT_IDS.map((id) =>
        PROJECTS_DATA.find((p) => p.id === id),
      ).filter((p): p is ProjectItem => Boolean(p));
    }
    return filterProjects(PROJECTS_DATA, activeTab);
  }, [activeTab]);

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

  const rowOneClients = CLIENTS_DATA.slice(0, 5);
  const rowTwoClients = CLIENTS_DATA.slice(5);

  const renderClientMarqueeCard = (
    client: ClientItem,
    key: string,
    darkBadge = false,
  ) => {
    const hasLiveProject = Boolean(client.projectId);
    return (
      <div
        key={key}
        className="w-[330px] sm:w-[370px] shrink-0 rounded-2xl border border-zinc-200/90 bg-white p-5 flex flex-col justify-between gap-4 card-elevated hover:border-[#C84B13]/45 transition-colors"
      >
        <div className="flex items-start justify-between gap-3.5">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center font-display font-bold text-xs tracking-tight ${
                darkBadge
                  ? 'bg-[#0F4C5C] text-white'
                  : 'bg-[#09090B] text-white'
              }`}
            >
              {client.monogram}
            </div>
            <div className="min-w-0">
              <h4 className="font-display font-bold text-base text-[#09090B] leading-snug">
                {client.name}
              </h4>
              <p className="text-xs font-medium text-zinc-500 mt-0.5">
                {client.category} · {client.focus}
              </p>
            </div>
          </div>
          <GemMarker
            size={7}
            color={hasLiveProject ? '#C84B13' : '#0F4C5C'}
            className="shrink-0 mt-1.5"
          />
        </div>

        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2 text-xs">
          <span className="font-body text-zinc-500 truncate">
            {client.deliverables[0]} · {client.deliverables[1]}
          </span>
          {client.projectId ? (
            <button
              type="button"
              onClick={() => setModalProjectId(client.projectId!)}
              className="inline-flex items-center gap-1 font-display font-semibold text-[#C84B13] hover:text-[#09090B] shrink-0 cursor-pointer transition-colors"
            >
              <span>Preview</span>
              <Expand className="w-3 h-3" aria-hidden="true" />
            </button>
          ) : (
            <Link
              to="/clients"
              className="inline-flex items-center gap-1 font-display font-semibold text-[#0F4C5C] hover:text-[#09090B] shrink-0 transition-colors"
            >
              <span>Details</span>
              <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 sm:py-28 bg-[#FAFAFA] dot-grid-light border-b border-zinc-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* 1. Section Header & Quantitative Proof Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-10 border-b border-zinc-200/80">
          <div className="lg:col-span-7 space-y-3">
            <SectionLabel number={sectionNumber} label="Collaborations & Live Work" />
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-[#09090B] text-balance">
              {HOME_COPY.clientsSection.title}{' '}
              <span className="font-serif-accent italic font-normal text-[#C84B13]">
                &amp; Live Launches
              </span>
            </h2>
            <p className="font-body text-base sm:text-lg text-zinc-600 max-w-2xl leading-relaxed">
              {HOME_COPY.clientsSection.text} Explore interactive previews of live client websites, regional publications, and digital portals built by our Pune studio.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-wrap lg:justify-end items-center gap-3">
            <Button to="/clients" variant="ghost">
              <span>View All Clients</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
            <Button to="/projects" variant="primary">
              <span>All 12 Projects</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Architectural Proof Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200/80 rounded-2xl border border-zinc-200 bg-white my-8 card-elevated">
          {[
            { value: '9+', label: 'Featured Client Partners', sub: 'Healthcare, Food, Real Estate & Media' },
            { value: '12', label: 'Live Websites & Portals', sub: 'Interactive desktop & mobile previews' },
            { value: '3', label: 'Regional Languages', sub: 'English, Marathi & Hindi editions' },
            { value: '6+ Yrs', label: 'Pune Digital Studio', sub: 'Web, SEO & ongoing growth support' },
          ].map((stat) => (
            <div key={stat.label} className="p-5 sm:p-6 space-y-1">
              <p className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-[#09090B] tabular-nums">
                {stat.value}
              </p>
              <p className="font-display font-semibold text-xs text-[#0F4C5C]">
                {stat.label}
              </p>
              <p className="font-body text-xs text-zinc-500">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* 2. Interactive Category Filter + Live Website Showcase (From Projects Page) */}
        <div className="mt-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div
              role="group"
              aria-label="Filter client project launches by category"
              className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-zinc-100 border border-zinc-200/80 self-start"
            >
              {HOME_SHOWCASE_TABS.map((tab) => {
                const active = activeTab === tab;
                const count =
                  tab === 'Featured Launches'
                    ? FEATURED_HOME_PROJECT_IDS.length
                    : (categoryCounts[tab] ?? 0);

                return (
                  <button
                    key={tab}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-3.5 py-2 rounded-lg font-display text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                      active ? 'text-white' : 'text-zinc-600 hover:text-[#09090B]'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="home-clients-projects-tab"
                        transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                        className="absolute inset-0 rounded-lg bg-[#09090B] shadow-xs"
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-1.5">
                      <span>{tab}</span>
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

            <p className="font-body text-xs text-zinc-500">
              Click any live preview below to inspect Desktop &amp; Mobile layouts or visit the live domain.
            </p>
          </div>

          {/* Live Project Preview Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProjects.map((project, idx) => (
              <article
                key={project.id}
                className="group rounded-2xl border border-zinc-200 bg-white card-elevated card-elevated-hover hover:border-[#C84B13]/45 p-5 sm:p-6 flex flex-col justify-between gap-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-display font-semibold text-[#0F4C5C] tabular-nums">
                      {String(idx + 1).padStart(2, '0')} · {project.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500">
                      <GemMarker size={7} color="#C84B13" />
                      <span>{project.scope}</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setModalProjectId(project.id)}
                    aria-label={`Inspect interactive preview of ${project.title} (${project.domain})`}
                    className="block w-full text-left relative rounded-xl focus-visible:outline-2 focus-visible:outline-[#C84B13] cursor-pointer"
                  >
                    <ProjectSitePreview project={project} size="card" />
                    <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-lg bg-[#09090B]/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm">
                      <Expand className="w-3 h-3" aria-hidden="true" />
                      <span>Inspect</span>
                    </span>
                  </button>

                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-lg sm:text-xl tracking-tight text-[#09090B] group-hover:text-[#C84B13] transition-colors">
                      {project.title}
                    </h3>
                    <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C84B13] tracking-wide">
                      <Globe className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{project.domain}</span>
                    </p>
                    <p className="font-body text-sm leading-relaxed text-zinc-600">
                      {project.caption}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-zinc-100">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-500">
                    <span>{project.deliverables[0]}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.deliverables[1]}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
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
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Full-Bleed Architectural Client Roster Ticker */}
      <div className="mt-16 pt-12 border-t border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <GemMarker size={8} color="#C84B13" />
            <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Partner Roster Across Industries
            </span>
          </div>
          <Link
            to="/clients"
            className="inline-flex items-center gap-1.5 font-display text-xs font-semibold text-[#0F4C5C] hover:text-[#C84B13] transition-colors"
          >
            <span>Browse full client directory &amp; case focus</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="marquee-group marquee-mask space-y-4">
          <div className="flex w-max animate-marquee-left gap-4">
            {[...rowOneClients, ...rowOneClients, ...rowOneClients].map(
              (client, idx) =>
                renderClientMarqueeCard(client, `${client.id}-r1-${idx}`, false),
            )}
          </div>

          <div className="flex w-max animate-marquee-right gap-4">
            {[...rowTwoClients, ...rowTwoClients, ...rowTwoClients].map(
              (client, idx) =>
                renderClientMarqueeCard(client, `${client.id}-r2-${idx}`, true),
            )}
          </div>
        </div>
      </div>

      <ProjectPreviewModal
        project={activeModalProject}
        totalCount={PROJECTS_DATA.length}
        currentIndex={activeModalIndex}
        onClose={() => setModalProjectId(null)}
        onNavigate={handleModalNavigate}
      />
    </section>
  );
}
