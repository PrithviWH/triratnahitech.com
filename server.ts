import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  analyzeHtmlForAudit,
  extractPageSpeedAuditResult,
  safeFetchWithSsrfProtection,
  transformProxyHtml,
  validateAndNormalizeAuditUrl,
} from './src/utils/seoAudit.ts';

dotenv.config();

const currentDir = import.meta.dirname ?? path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT) || 3000;
const PAGESPEED_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

async function runPageSpeedAudit(targetUrl: string) {
  const params = new URLSearchParams({
    url: targetUrl,
    strategy: 'mobile',
  });
  params.append('category', 'seo');
  params.append('category', 'accessibility');

  if (process.env.PAGESPEED_API_KEY) {
    params.set('key', process.env.PAGESPEED_API_KEY);
  }

  const response = await fetch(`${PAGESPEED_ENDPOINT}?${params.toString()}`, {
    signal: AbortSignal.timeout(14000),
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    return null;
  }

  const data: unknown = await response.json();
  return extractPageSpeedAuditResult(data, targetUrl);
}

async function runLiveHtmlAudit(targetUrl: string) {
  try {
    const { response, finalUrl } = await safeFetchWithSsrfProtection(targetUrl, {
      timeoutMs: 9000,
      headers: {
        'User-Agent': 'TriratnaHiTechAudit/1.0 (+https://triratnahitech.com)',
        Accept: 'text/html,application/xhtml+xml',
      },
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('text/html') && !contentType.toLowerCase().includes('xhtml')) {
      return null;
    }

    const rawText = await response.text();
    const cappedHtml = rawText.slice(0, 600_000);
    return analyzeHtmlForAudit(cappedHtml, finalUrl);
  } catch {
    return null;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/site-preview-proxy', async (req, res) => {
    const rawUrl = typeof req.query.url === 'string' ? req.query.url : '';
    const validation = validateAndNormalizeAuditUrl(rawUrl);

    if (!validation.ok) {
      res.status(400).send('Invalid preview URL');
      return;
    }

    try {
      const { response, finalUrl } = await safeFetchWithSsrfProtection(validation.url, {
        timeoutMs: 8000,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 TriratnaPreview/1.0',
          Accept: 'text/html,application/xhtml+xml',
        },
      });

      if (!response.ok) {
        res.status(response.status).send('Unable to load preview');
        return;
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.toLowerCase().includes('text/html') && !contentType.toLowerCase().includes('xhtml')) {
        res.status(415).send('Non-HTML response');
        return;
      }

      const rawHtml = await response.text();
      const html = transformProxyHtml(rawHtml, finalUrl);

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.removeHeader('X-Frame-Options');
      res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
      res.setHeader('Cache-Control', 'public, max-age=600');
      res.send(html);
    } catch {
      res.status(502).send('Error loading preview');
    }
  });

  app.post('/api/seo-audit', async (req, res) => {
    const rawUrl = typeof req.body?.url === 'string' ? req.body.url : '';
    const validation = validateAndNormalizeAuditUrl(rawUrl);

    if (!validation.ok) {
      res.status(400).json({ error: validation.error });
      return;
    }

    try {
      const pageSpeedReport = await runPageSpeedAudit(validation.url).catch(() => null);
      if (pageSpeedReport) {
        res.json(pageSpeedReport);
        return;
      }

      const htmlReport = await runLiveHtmlAudit(validation.url).catch(() => null);
      if (htmlReport) {
        res.json(htmlReport);
        return;
      }

      res.status(502).json({
        error:
          'Unable to reach that website right now. Please verify the URL is live and publicly accessible.',
      });
    } catch {
      res.status(500).json({
        error: 'Something went wrong while running the audit. Please try again.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(currentDir, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
