export type AuditCategory = 'SEO' | 'Accessibility';
export type AuditSource = 'pagespeed' | 'html-inspector';
export type AuditGrade = 'Strong' | 'Needs Attention' | 'Critical';

export interface AuditCheckItem {
  id: string;
  label: string;
  category: AuditCategory;
  passed: boolean;
  detail: string;
}

export interface SeoAuditReport {
  url: string;
  hostname: string;
  seoScore: number;
  accessibilityScore: number;
  source: AuditSource;
  checkedAt: string;
  checks: AuditCheckItem[];
}

export type UrlValidationResult =
  | { ok: true; url: string; hostname: string }
  | { ok: false; error: string };

const PRIVATE_IPV4_PATTERNS = [
  /^127\./,
  /^10\./,
  /^0\./,
  /^169\.254\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
];

export function isPrivateOrLocalHost(hostname: string): boolean {
  const host = hostname.trim().toLowerCase().replace(/^\[|\]$/g, '');
  if (!host) return true;
  if (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host === '::1' ||
    host.startsWith('fc') ||
    host.startsWith('fd') ||
    host.startsWith('fe80')
  ) {
    return true;
  }
  return PRIVATE_IPV4_PATTERNS.some((pattern) => pattern.test(host));
}

export function validateAndNormalizeAuditUrl(rawInput: string): UrlValidationResult {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { ok: false, error: 'Please enter a website URL to audit.' };
  }

  const hasScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed);
  const candidate = hasScheme ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return {
      ok: false,
      error: 'Please enter a valid website address (for example, example.com).',
    };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return {
      ok: false,
      error: 'Only HTTP and HTTPS website URLs can be audited.',
    };
  }

  if (isPrivateOrLocalHost(parsed.hostname) || !parsed.hostname.includes('.')) {
    return {
      ok: false,
      error: 'Please enter a valid public domain name (such as example.com).',
    };
  }

  return {
    ok: true,
    url: parsed.toString(),
    hostname: parsed.hostname,
  };
}

export function getScoreGrade(score: number): AuditGrade {
  if (score >= 85) return 'Strong';
  if (score >= 60) return 'Needs Attention';
  return 'Critical';
}

interface LighthouseAuditNode {
  id?: string;
  title?: string;
  score?: number | null;
  displayValue?: string;
}

interface LighthousePayload {
  lighthouseResult?: {
    finalDisplayedUrl?: string;
    finalUrl?: string;
    categories?: {
      seo?: { score?: number | null };
      accessibility?: { score?: number | null };
    };
    audits?: Record<string, LighthouseAuditNode>;
  };
}

const PAGESPEED_CHECK_MAP: {
  id: string;
  label: string;
  category: AuditCategory;
  passDetail: string;
  failDetail: string;
}[] = [
  {
    id: 'document-title',
    label: 'Page Title Tag',
    category: 'SEO',
    passDetail: 'Document has a <title> element for search results.',
    failDetail: 'Missing or empty <title> element.',
  },
  {
    id: 'meta-description',
    label: 'Meta Description',
    category: 'SEO',
    passDetail: 'Document includes a meta description snippet.',
    failDetail: 'Add a concise meta description to improve search snippets.',
  },
  {
    id: 'is-crawlable',
    label: 'Search Crawlability',
    category: 'SEO',
    passDetail: 'Page is not blocked from search engine indexing.',
    failDetail: 'Page blocks search engine crawlers (noindex or robots rule).',
  },
  {
    id: 'canonical',
    label: 'Canonical URL',
    category: 'SEO',
    passDetail: 'Valid canonical link is defined.',
    failDetail: 'Missing or invalid rel="canonical" link.',
  },
  {
    id: 'viewport',
    label: 'Mobile Viewport',
    category: 'Accessibility',
    passDetail: 'Viewport meta tag supports responsive mobile scaling.',
    failDetail: 'Configure a responsive viewport meta tag without blocking zoom.',
  },
  {
    id: 'html-has-lang',
    label: 'HTML Language Attribute',
    category: 'Accessibility',
    passDetail: '<html> element declares a valid lang attribute.',
    failDetail: 'Add a lang attribute (e.g. lang="en") to the <html> tag.',
  },
  {
    id: 'image-alt',
    label: 'Image Alt Attributes',
    category: 'Accessibility',
    passDetail: 'Images provide descriptive alt text for screen readers.',
    failDetail: 'Some <img> elements are missing alt attributes.',
  },
  {
    id: 'color-contrast',
    label: 'Text Color Contrast',
    category: 'Accessibility',
    passDetail: 'Background and foreground colors meet contrast ratios.',
    failDetail: 'Some text elements have low contrast against their background.',
  },
];

export function extractPageSpeedAuditResult(
  payload: unknown,
  requestedUrl: string,
): SeoAuditReport | null {
  if (!payload || typeof payload !== 'object') return null;
  const typed = payload as LighthousePayload;
  const lh = typed.lighthouseResult;
  if (!lh || !lh.categories) return null;

  const rawSeo = lh.categories.seo?.score;
  const rawAcc = lh.categories.accessibility?.score;
  if (typeof rawSeo !== 'number' && typeof rawAcc !== 'number') {
    return null;
  }

  const finalUrl = lh.finalDisplayedUrl || lh.finalUrl || requestedUrl;
  let hostname = '';
  try {
    hostname = new URL(finalUrl).hostname;
  } catch {
    hostname = requestedUrl;
  }

  const audits = lh.audits ?? {};
  const checks: AuditCheckItem[] = [];

  for (const spec of PAGESPEED_CHECK_MAP) {
    const node = audits[spec.id];
    if (!node || typeof node.score !== 'number') continue;
    const passed = node.score >= 0.9;
    checks.push({
      id: spec.id,
      label: spec.label,
      category: spec.category,
      passed,
      detail: passed
        ? spec.passDetail
        : node.displayValue
          ? `${spec.failDetail} (${node.displayValue})`
          : spec.failDetail,
    });
  }

  return {
    url: finalUrl,
    hostname,
    seoScore: typeof rawSeo === 'number' ? Math.round(rawSeo * 100) : 0,
    accessibilityScore: typeof rawAcc === 'number' ? Math.round(rawAcc * 100) : 0,
    source: 'pagespeed',
    checkedAt: new Date().toISOString(),
    checks,
  };
}

export function analyzeHtmlForAudit(html: string, finalUrl: string): SeoAuditReport {
  let hostname = '';
  try {
    hostname = new URL(finalUrl).hostname;
  } catch {
    hostname = finalUrl;
  }

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const titleText = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : '';

  const metaDescMatch =
    html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
  const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : '';

  const h1Matches = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi) ?? [];
  const hasCanonical = /<link[^>]*rel=["'][^"']*canonical[^"']*["'][^>]*>/i.test(html);
  const robotsNoIndex =
    /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex[^"']*["'][^>]*>/i.test(html);

  const hasLang = /<html[^>]*\blang=["'][^"']+["'][^>]*>/i.test(html);
  const viewportMatch = html.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']viewport["'][^>]*>/i);
  const viewportContent = viewportMatch ? viewportMatch[1].toLowerCase() : '';
  const hasGoodViewport =
    Boolean(viewportMatch) && !viewportContent.includes('user-scalable=no');

  const imgTags = html.match(/<img\b[^>]*>/gi) ?? [];
  const imgsMissingAlt = imgTags.filter((tag) => !/\balt\s*=/i.test(tag)).length;

  const hasMainLandmark = /<(main|header|nav)\b/i.test(html) || /role=["']main["']/i.test(html);

  const checks: AuditCheckItem[] = [
    {
      id: 'document-title',
      label: 'Page Title Tag',
      category: 'SEO',
      passed: titleText.length >= 10,
      detail:
        titleText.length >= 10
          ? `Found title (${titleText.length} characters).`
          : titleText.length > 0
            ? `Title is very short (${titleText.length} characters); aim for 30–60.`
            : 'Missing <title> tag in document head.',
    },
    {
      id: 'meta-description',
      label: 'Meta Description',
      category: 'SEO',
      passed: metaDesc.length >= 30,
      detail:
        metaDesc.length >= 30
          ? `Meta description present (${metaDesc.length} characters).`
          : 'Missing or overly brief meta description tag.',
    },
    {
      id: 'heading-h1',
      label: 'Primary H1 Heading',
      category: 'SEO',
      passed: h1Matches.length === 1,
      detail:
        h1Matches.length === 1
          ? 'Single clear <h1> heading detected.'
          : h1Matches.length === 0
            ? 'No <h1> heading found on the page.'
            : `Found ${h1Matches.length} <h1> headings; prefer one primary headline.`,
    },
    {
      id: 'canonical',
      label: 'Canonical Link',
      category: 'SEO',
      passed: hasCanonical,
      detail: hasCanonical
        ? 'Canonical <link> tag is configured.'
        : 'Consider adding a rel="canonical" link tag.',
    },
    {
      id: 'is-crawlable',
      label: 'Search Crawlability',
      category: 'SEO',
      passed: !robotsNoIndex,
      detail: !robotsNoIndex
        ? 'Page allows search engine indexing.'
        : 'Meta robots tag includes "noindex".',
    },
    {
      id: 'html-has-lang',
      label: 'HTML Language Attribute',
      category: 'Accessibility',
      passed: hasLang,
      detail: hasLang
        ? '<html> element declares a lang attribute.'
        : 'Add a lang attribute (such as lang="en") to <html>.',
    },
    {
      id: 'viewport',
      label: 'Responsive Viewport',
      category: 'Accessibility',
      passed: hasGoodViewport,
      detail: hasGoodViewport
        ? 'Viewport meta allows mobile scaling and zoom.'
        : 'Missing viewport meta or pinch-zoom is disabled.',
    },
    {
      id: 'image-alt',
      label: 'Image Alt Attributes',
      category: 'Accessibility',
      passed: imgsMissingAlt === 0,
      detail:
        imgTags.length === 0
          ? 'No inline <img> elements missing alt text.'
          : imgsMissingAlt === 0
            ? `All ${imgTags.length} images include alt attributes.`
            : `${imgsMissingAlt} of ${imgTags.length} images are missing an alt attribute.`,
    },
    {
      id: 'landmarks',
      label: 'Semantic Landmarks',
      category: 'Accessibility',
      passed: hasMainLandmark,
      detail: hasMainLandmark
        ? 'Semantic landmark tags (<main>, <header>, or <nav>) detected.'
        : 'Add semantic <main> / <header> landmarks for assistive navigation.',
    },
  ];

  const seoChecks = checks.filter((c) => c.category === 'SEO');
  const accChecks = checks.filter((c) => c.category === 'Accessibility');

  const seoScore = Math.round(
    (seoChecks.filter((c) => c.passed).length / seoChecks.length) * 100,
  );
  const accessibilityScore = Math.round(
    (accChecks.filter((c) => c.passed).length / accChecks.length) * 100,
  );

  return {
    url: finalUrl,
    hostname,
    seoScore,
    accessibilityScore,
    source: 'html-inspector',
    checkedAt: new Date().toISOString(),
    checks,
  };
}
