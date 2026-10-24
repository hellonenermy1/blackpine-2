import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '0.0.0.0';
const types = new Map([
  ['.html','text/html; charset=utf-8'],
  ['.css','text/css; charset=utf-8'],
  ['.js','text/javascript; charset=utf-8'],
  ['.svg','image/svg+xml'],
  ['.xml','application/xml; charset=utf-8'],
  ['.txt','text/plain; charset=utf-8'],
  ['.webmanifest','application/manifest+json; charset=utf-8'],
  ['.json','application/json; charset=utf-8']
]);

function safePath(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split('?')[0]);
  } catch {
    return null;
  }
  const normalized = path.posix.normalize(decoded);
  if (normalized.includes('..')) return null;
  return normalized;
}

function localized404(requested) {
  if (requested === '/fr' || requested.startsWith('/fr/')) return path.join(root, 'fr', '404.html');
  if (requested === '/es' || requested.startsWith('/es/')) return path.join(root, 'es', '404.html');
  return path.join(root, '404.html');
}

const server = http.createServer(async (req,res) => {
  try {
    const requested = safePath(req.url || '/');
    if (!requested) { res.writeHead(400); res.end('Bad request'); return; }
    let file = path.join(root, requested);
    const stat = await fs.stat(file).catch(() => null);
    if (stat?.isDirectory()) file = path.join(file, 'index.html');
    let data = await fs.readFile(file).catch(() => null);
    let status = 200;
    if (!data) {
      status = 404;
      const locale404 = localized404(requested);
      file = locale404;
      data = await fs.readFile(file).catch(() => null);
      if (!data && locale404 !== path.join(root, '404.html')) {
        file = path.join(root, '404.html');
        data = await fs.readFile(file);
      }
    }
    const ext = path.extname(file);
    res.writeHead(status, {
      'Content-Type': types.get(ext) || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
    });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {
    res.writeHead(500, {'Content-Type':'text/plain; charset=utf-8'});
    res.end('Internal server error');
  }
});

server.listen(port, host, () => console.log(`Blackpine local preview: http://${host}:${port}`));