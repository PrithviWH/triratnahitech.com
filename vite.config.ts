import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import {
  safeFetchWithSsrfProtection,
  transformProxyHtml,
} from './src/utils/seoAudit.ts';

function previewProxyPlugin(): Plugin {
  return {
    name: 'preview-proxy-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const reqPath = req.url || '';

        if (reqPath.startsWith('/api/site-preview-proxy')) {
          const reqUrl = new URL(reqPath, 'http://localhost');
          const targetUrl = reqUrl.searchParams.get('url');
          if (!targetUrl) {
            res.statusCode = 400;
            res.end('Missing url parameter');
            return;
          }
          try {
            const parsed = new URL(targetUrl);
            res.writeHead(302, { Location: `/api/preview-frame/${parsed.hostname}/` });
            res.end();
          } catch {
            res.statusCode = 400;
            res.end('Invalid URL');
          }
          return;
        }

        if (reqPath.startsWith('/api/preview-frame/')) {
          const raw = reqPath.slice('/api/preview-frame/'.length);
          const slashIdx = raw.indexOf('/');
          const host = slashIdx === -1 ? raw : raw.slice(0, slashIdx);
          const subPath = slashIdx === -1 ? '' : raw.slice(slashIdx + 1);
          const targetUrl = `https://${host}/${subPath}`;

          try {
            const { response, finalUrl } = await safeFetchWithSsrfProtection(targetUrl, {
              timeoutMs: 8000,
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 TriratnaPreview/1.0',
                Accept: (typeof req.headers.accept === 'string' && req.headers.accept) || '*/*',
              },
            });

            if (!response.ok) {
              res.statusCode = response.status;
              res.end('Unable to load preview');
              return;
            }

            const contentType = response.headers.get('content-type') || 'application/octet-stream';
            const isHtml =
              contentType.toLowerCase().includes('text/html') ||
              contentType.toLowerCase().includes('xhtml');

            res.setHeader('Access-Control-Allow-Origin', '*');

            if (isHtml) {
              const rawHtml = await response.text();
              const html = transformProxyHtml(rawHtml, finalUrl, `/api/preview-frame/${host}/`);

              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.setHeader('Cache-Control', 'public, max-age=600');
              res.end(html);
            } else {
              const buffer = Buffer.from(await response.arrayBuffer());
              res.setHeader('Content-Type', contentType);
              res.setHeader('Cache-Control', 'public, max-age=86400');
              res.end(buffer);
            }
          } catch {
            res.statusCode = 502;
            res.end('Error loading preview');
          }
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), previewProxyPlugin()],
    optimizeDeps: {
      include: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname ?? '.', '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
