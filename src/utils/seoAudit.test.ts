import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeHtmlForAudit,
  extractPageSpeedAuditResult,
  getScoreGrade,
  safeFetchWithSsrfProtection,
  transformProxyHtml,
  validateAndNormalizeAuditUrl,
} from './seoAudit';

test('validateAndNormalizeAuditUrl normalizes valid domains and rejects unsafe or invalid URLs', () => {
  const bare = validateAndNormalizeAuditUrl('sakshamrealestate.in');
  assert.equal(bare.ok, true);
  if (bare.ok) {
    assert.equal(bare.url, 'https://sakshamrealestate.in/');
    assert.equal(bare.hostname, 'sakshamrealestate.in');
  }

  const empty = validateAndNormalizeAuditUrl('   ');
  assert.equal(empty.ok, false);

  const local = validateAndNormalizeAuditUrl('http://localhost:3000');
  assert.equal(local.ok, false);

  const privateIp = validateAndNormalizeAuditUrl('http://192.168.1.1');
  assert.equal(privateIp.ok, false);

  const jsScheme = validateAndNormalizeAuditUrl('javascript:alert(1)');
  assert.equal(jsScheme.ok, false);
});

test('extractPageSpeedAuditResult extracts SEO and Accessibility scores and checks from Lighthouse JSON', () => {
  const mockPayload = {
    lighthouseResult: {
      finalDisplayedUrl: 'https://example.com/',
      categories: {
        seo: { score: 0.92 },
        accessibility: { score: 0.84 },
      },
      audits: {
        'document-title': { id: 'document-title', score: 1 },
        'meta-description': { id: 'meta-description', score: 0 },
        'html-has-lang': { id: 'html-has-lang', score: 1 },
        'image-alt': { id: 'image-alt', score: 0, displayValue: '2 elements' },
      },
    },
  };

  const report = extractPageSpeedAuditResult(mockPayload, 'https://example.com');
  assert.ok(report);
  assert.equal(report.seoScore, 92);
  assert.equal(report.accessibilityScore, 84);
  assert.equal(report.source, 'pagespeed');
  assert.equal(report.hostname, 'example.com');
  assert.equal(report.checks.find((c) => c.id === 'document-title')?.passed, true);
  assert.equal(report.checks.find((c) => c.id === 'meta-description')?.passed, false);
  assert.match(
    report.checks.find((c) => c.id === 'image-alt')?.detail ?? '',
    /2 elements/,
  );
});

test('analyzeHtmlForAudit scores well-structured HTML 100 and catches missing tags', () => {
  const strongHtml = `<!doctype html>
    <html lang="en">
      <head>
        <title>Triratna Hi-Tech Digital Studio Pune</title>
        <meta name="description" content="Thoughtful web development, SEO, and digital marketing in Pune." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://example.com/" />
      </head>
      <body>
        <main><h1>Welcome</h1><img src="/a.jpg" alt="Studio preview" /></main>
      </body>
    </html>`;

  const strongReport = analyzeHtmlForAudit(strongHtml, 'https://example.com/');
  assert.equal(strongReport.seoScore, 100);
  assert.equal(strongReport.accessibilityScore, 100);
  assert.equal(strongReport.source, 'html-inspector');

  const weakHtml = `<html><head><title>Hi</title></head><body><img src="/a.jpg"></body></html>`;
  const weakReport = analyzeHtmlForAudit(weakHtml, 'https://weak.example/');
  assert.ok(weakReport.seoScore < 50);
  assert.ok(weakReport.accessibilityScore < 50);
});

test('getScoreGrade maps score thresholds cleanly', () => {
  assert.equal(getScoreGrade(90), 'Strong');
  assert.equal(getScoreGrade(85), 'Strong');
  assert.equal(getScoreGrade(72), 'Needs Attention');
  assert.equal(getScoreGrade(40), 'Critical');
});

test('transformProxyHtml injects base tag, strips X-Frame-Options, and honors custom basePath', () => {
  const sample = `<html><head><meta http-equiv="X-Frame-Options" content="DENY"><title>Music</title></head><body><h1>Bhim Geet</h1></body></html>`;
  const result = transformProxyHtml(sample, 'https://music.brambedkar.in/', '/api/preview-frame/music.brambedkar.in/');
  assert.match(result, /<base href="\/api\/preview-frame\/music\.brambedkar\.in\/" \/>/);
  assert.equal(result.includes('http-equiv="X-Frame-Options"'), false);
});

test('safeFetchWithSsrfProtection rejects private, local, and metadata IP targets immediately', async () => {
  await assert.rejects(
    () => safeFetchWithSsrfProtection('http://169.254.169.254/latest/meta-data/'),
    /SSRF blocked/,
  );

  await assert.rejects(
    () => safeFetchWithSsrfProtection('http://127.0.0.1:8080/'),
    /SSRF blocked/,
  );

  await assert.rejects(
    () => safeFetchWithSsrfProtection('http://localhost:3000/'),
    /SSRF blocked/,
  );
});
