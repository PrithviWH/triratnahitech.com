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
      server.middlewares.use('/api/site-preview-proxy', async (req, res) => {
        try {
          const reqUrl = new URL(req.url || '', 'http://localhost');
          const targetUrl = reqUrl.searchParams.get('url');
          if (!targetUrl) {
            res.statusCode = 400;
            res.end('Missing url parameter');
            return;
          }

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
            const html = transformProxyHtml(rawHtml, finalUrl);

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
