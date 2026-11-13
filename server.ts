import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  analyzeHtmlForAudit,
  extractPageSpeedAuditResult,
  isPrivateOrLocalHost,
  validateAndNormalizeAuditUrl,
} from './src/utils/seoAudit.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  const response = await fetch(targetUrl, {
    method: 'GET',
    redirect: 'follow',
    signal: AbortSignal.timeout(9000),
    headers: {
      'User-Agent': 'TriratnaHiTechAudit/1.0 (+https://triratnahitech.in)',
      Accept: 'text/html,application/xhtml+xml',
    },
  });

  const finalUrl = response.url || targetUrl;
  try {
    const finalParsed = new URL(finalUrl);
    if (isPrivateOrLocalHost(finalParsed.hostname)) {
      return null;
    }
  } catch {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType && !contentType.toLowerCase().includes('text/html') && !contentType.toLowerCase().includes('xhtml')) {
    return null;
  }

  const rawText = await response.text();
  const cappedHtml = rawText.slice(0, 600_000);
  return analyzeHtmlForAudit(cappedHtml, finalUrl);
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
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
    const distDir = path.resolve(__dirname, 'dist');
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
