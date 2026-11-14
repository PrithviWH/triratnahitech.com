import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

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

          const response = await fetch(targetUrl, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 TriratnaPreview/1.0',
              Accept: 'text/html,application/xhtml+xml',
            },
            signal: AbortSignal.timeout(8000),
          });

          if (!response.ok) {
            res.statusCode = response.status;
            res.end('Unable to load preview');
            return;
          }

          let html = await response.text();
          const targetBase = new URL(response.url || targetUrl);
          const baseHref = `${targetBase.origin}${targetBase.pathname.endsWith('/') ? targetBase.pathname : targetBase.pathname + '/'}`;
          const baseTag = `<base href="${baseHref}" />`;

          if (/<head[^>]*>/i.test(html)) {
            html = html.replace(/(<head[^>]*>)/i, `$1\n  ${baseTag}`);
          } else {
            html = `${baseTag}\n${html}`;
          }

          html = html.replace(/<meta[^>]*http-equiv=["']?X-Frame-Options["']?[^>]*>/gi, '');

          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=600');
          res.end(html);
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
