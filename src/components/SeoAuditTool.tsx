import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Globe,
  Loader2,
  Search,
} from 'lucide-react';
import {
  getScoreGrade,
  type SeoAuditReport,
  validateAndNormalizeAuditUrl,
} from '../utils/seoAudit';
import { SectionLabel } from './UiPrimitives';

const SAMPLE_SITES = [
  'sakshamrealestate.in',
  'kimayafoodproducts.com',
] as const;

function ScoreRingCard({
  label,
  score,
  accentColor,
  subtitle,
}: {
  label: string;
  score: number;
  accentColor: string;
  subtitle: string;
}) {
  const grade = getScoreGrade(score);
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const gradeTextClass =
    grade === 'Strong'
      ? 'text-emerald-700'
      : grade === 'Needs Attention'
        ? 'text-[#B8420E]'
        : 'text-red-700';

  return (
    <div className="rounded-xl border border-zinc-200 bg-[#FAFAFA] p-5 flex items-center gap-5">
      <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90" aria-hidden="true">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="#E4E4E7"
            strokeWidth="6.5"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={accentColor}
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          />
        </svg>
        <span className="absolute font-display font-extrabold text-xl text-[#09090B] tabular-nums">
          {clampedScore}
        </span>
      </div>

      <div className="min-w-0 space-y-1">
        <p className="font-display font-bold text-base text-[#09090B]">{label}</p>
        <p className={`font-display text-xs font-semibold ${gradeTextClass}`}>
          {grade} · {clampedScore} / 100
        </p>
        <p className="font-body text-xs text-zinc-500 leading-snug">{subtitle}</p>
      </div>
    </div>
  );
}

export function SeoAuditTool({
  sectionNumber = '06',
}: {
  sectionNumber?: string;
}) {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<SeoAuditReport | null>(null);

  const runAuditForUrl = async (rawUrl: string) => {
    const validation = validateAndNormalizeAuditUrl(rawUrl);
    if (!validation.ok) {
      setError(validation.error);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/seo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: validation.url }),
      });

      const payload = (await response.json()) as Partial<SeoAuditReport> & {
        error?: string;
      };

      if (!response.ok || typeof payload.seoScore !== 'number') {
        setError(
          payload.error ??
            'Could not complete the audit for this URL. Please check the address and try again.',
        );
        return;
      }

      setReport(payload as SeoAuditReport);
    } catch {
      setError('Network error while connecting to the audit service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void runAuditForUrl(urlInput);
  };

  const handleSampleClick = (sampleDomain: string) => {
    setUrlInput(sampleDomain);
    void runAuditForUrl(sampleDomain);
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-7 space-y-3">
          <SectionLabel number={sectionNumber} label="Instant Audit" />
          <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-[#09090B] text-balance">
            Check Your Site&apos;s SEO &amp; Accessibility
          </h2>
          <p className="font-body text-base sm:text-lg leading-relaxed text-zinc-600 max-w-2xl">
            Enter your website URL to get a quick live score for search readiness and accessibility using our integrated PageSpeed &amp; HTML audit API.
          </p>
        </div>

        <div className="lg:col-span-5 lg:text-right text-xs font-body text-zinc-500">
          <span>Try a live sample: </span>
          {SAMPLE_SITES.map((domain, idx) => (
            <span key={domain}>
              {idx > 0 && <span aria-hidden="true"> · </span>}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSampleClick(domain)}
                className="font-display font-semibold text-[#0F4C5C] hover:text-[#C84B13] underline underline-offset-4 cursor-pointer disabled:opacity-50"
              >
                {domain}
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 lg:p-10 card-elevated space-y-8">
        {/* URL Input Bar */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <label
            htmlFor="seo-audit-url-input"
            className="block font-display text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500"
          >
            Website URL
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Globe
                className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="seo-audit-url-input"
                type="url"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="https://yourbusiness.in"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'seo-audit-error' : undefined}
                className="w-full h-12 rounded-xl border border-zinc-300 bg-[#FAFAFA] pl-11 pr-4 font-body text-sm sm:text-base text-[#09090B] placeholder:text-zinc-400 focus:bg-white focus:border-[#C84B13] focus:outline-none focus:ring-2 focus:ring-[#C84B13]/15 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="h-12 rounded-xl px-6 bg-[#09090B] text-white font-display font-semibold text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer hover:bg-[#C84B13] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" aria-hidden="true" />
                  <span>Run Audit</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <p
              id="seo-audit-error"
              role="alert"
              className="flex items-center gap-2 text-xs sm:text-sm font-medium text-red-700 pt-1"
            >
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </p>
          )}
        </form>

        {/* Results or Initial Guidance State */}
        {loading && !report && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-xl border border-zinc-200 bg-[#FAFAFA] p-6 sm:p-8 flex items-center gap-4 text-sm text-zinc-600"
          >
            <Loader2 className="w-5 h-5 text-[#C84B13] animate-spin shrink-0" aria-hidden="true" />
            <div>
              <p className="font-display font-semibold text-[#09090B]">
                Checking SEO &amp; Accessibility signals...
              </p>
              <p className="font-body text-xs text-zinc-500 mt-0.5">
                Inspecting metadata, crawlability, viewport configuration, headings, and alt text.
              </p>
            </div>
          </div>
        )}

        {report && (
          <div className="space-y-6 pt-6 border-t border-zinc-200/80" aria-live="polite">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display font-bold text-lg text-[#09090B]">
                  Audit Report · {report.hostname}
                </p>
                <p className="font-body text-xs text-zinc-500 mt-0.5">
                  Source:{' '}
                  {report.source === 'pagespeed'
                    ? 'Google PageSpeed Insights API'
                    : 'Live HTML Signal Inspector'}{' '}
                  · {report.url}
                </p>
              </div>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-1.5 font-display text-xs sm:text-sm font-semibold text-[#B8420E] hover:text-[#09090B] transition-colors whitespace-nowrap"
              >
                <span>Request full optimization plan</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>

            {/* Side-by-Side Score Gauges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ScoreRingCard
                label="SEO Score"
                score={report.seoScore}
                accentColor="#C84B13"
                subtitle="Title tags, descriptions, headings, canonical links & crawlability."
              />
              <ScoreRingCard
                label="Accessibility Score"
                score={report.accessibilityScore}
                accentColor="#0F4C5C"
                subtitle="Language attributes, viewport scaling, image alt text & structure."
              />
            </div>

            {/* Individual Check Breakdown */}
            {report.checks.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {report.checks.map((check) => (
                  <div
                    key={check.id}
                    className="rounded-xl border border-zinc-200/90 bg-white px-4 py-3.5 flex items-start gap-3"
                  >
                    {check.passed ? (
                      <CheckCircle2
                        className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                    ) : (
                      <AlertTriangle
                        className="w-4 h-4 text-[#C84B13] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                    )}
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 text-xs font-display font-semibold text-[#09090B]">
                        <span>{check.label}</span>
                        <span aria-hidden="true" className="text-zinc-300">
                          ·
                        </span>
                        <span className="text-zinc-500">{check.category}</span>
                      </div>
                      <p className="font-body text-xs text-zinc-600 leading-relaxed">
                        {check.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!report && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-zinc-100 text-xs font-body text-zinc-600">
            <div className="space-y-1">
              <p className="font-display font-semibold text-[#09090B]">01 · On-Page SEO</p>
              <p>Checks title tags, meta descriptions, canonical links, and indexability.</p>
            </div>
            <div className="space-y-1">
              <p className="font-display font-semibold text-[#09090B]">02 · Accessibility</p>
              <p>Evaluates HTML language attributes, viewport rules, and image alt text.</p>
            </div>
            <div className="space-y-1">
              <p className="font-display font-semibold text-[#09090B]">03 · Actionable Fixes</p>
              <p>Highlights exactly what to tighten before launching paid or organic campaigns.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
