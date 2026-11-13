export type ProjectCategory =
  | 'Business & Brands'
  | 'Knowledge & Portals'
  | 'News & Regional';

export type ProjectPreviewTheme =
  | 'constitution'
  | 'music'
  | 'quotes'
  | 'walls'
  | 'kimaya'
  | 'saksham'
  | 'care32'
  | 'history'
  | 'news'
  | 'hindi'
  | 'marathi'
  | 'askk';

export interface ProjectSummaryLike {
  id: string;
  domain: string;
  title: string;
  category: ProjectCategory;
  caption: string;
}

export function normalizeWebsiteUrl(domainOrUrl: string): string {
  const trimmed = domainOrUrl.trim().replace(/\/+$/, '');
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function filterProjects<T extends ProjectSummaryLike>(
  projects: readonly T[],
  category: string,
  searchQuery = ''
): T[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return projects.filter((project) => {
    const matchesCategory = category === 'All' || project.category === category;
    if (!matchesCategory) return false;

    if (!normalizedQuery) return true;

    return (
      project.domain.toLowerCase().includes(normalizedQuery) ||
      project.title.toLowerCase().includes(normalizedQuery) ||
      project.caption.toLowerCase().includes(normalizedQuery) ||
      project.category.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function getCategoryCounts<T extends { category: string }>(
  projects: readonly T[],
  categories: readonly string[]
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const cat of categories) {
    counts[cat] =
      cat === 'All'
        ? projects.length
        : projects.filter((project) => project.category === cat).length;
  }
  return counts;
}

export function getAdjacentProject<T extends { id: string }>(
  projects: readonly T[],
  currentId: string,
  direction: 'prev' | 'next'
): T | null {
  if (projects.length === 0) return null;
  const idx = projects.findIndex((item) => item.id === currentId);
  if (idx === -1) return projects[0];
  const offset = direction === 'next' ? 1 : -1;
  const nextIndex = (idx + offset + projects.length) % projects.length;
  return projects[nextIndex];
}
