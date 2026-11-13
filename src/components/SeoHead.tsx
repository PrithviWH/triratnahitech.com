import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageSeo } from '../utils/siteLogic';

export function SeoHead({
  customTitle,
  customDescription,
}: {
  customTitle?: string;
  customDescription?: string;
}) {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getPageSeo(pathname);
    const title = customTitle ?? seo.title;
    const description = customDescription ?? seo.description;

    document.title = title;

    const updateMeta = (selector: string, attr: string, value: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };

    updateMeta('meta[name="description"]', 'content', description);
    updateMeta('meta[property="og:title"]', 'content', title);
    updateMeta('meta[property="og:description"]', 'content', description);
    updateMeta('meta[name="twitter:title"]', 'content', title);
    updateMeta('meta[name="twitter:description"]', 'content', description);

    const canonicalUrl = `${window.location.origin}${pathname}`;
    updateMeta('meta[property="og:url"]', 'content', canonicalUrl);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [pathname, customTitle, customDescription]);

  return null;
}
