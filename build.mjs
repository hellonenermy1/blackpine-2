import fs from 'node:fs/promises';
import { site } from './src/data.mjs';
import { layout } from './src/layout.mjs';
import { routes, errorPage } from './src/routes.mjs';

const out = new URL('./dist/', import.meta.url);
const src = new URL('./src/', import.meta.url);
const pub = new URL('./public/', import.meta.url);
const styleSources = [
  './styles/tokens.css',
  './styles/base.css',
  './styles/layout.css',
  './styles/components.css',
  './styles/pages.css',
  './styles/responsive.css'
];

async function writeRoute(route) {
  const clean = route.path === '/' ? '' : route.path.replace(/^\//, '').replace(/\/$/, '');
  const dir = new URL(`./${clean ? `${clean}/` : ''}`, out);
  await fs.mkdir(dir, { recursive: true });
  const html = layout({ path: route.path, noindex: !route.indexable, ...route.page });
  await fs.writeFile(new URL('./index.html', dir), html);
}

await fs.rm(out, { recursive: true, force: true });
await fs.mkdir(out, { recursive: true });
await fs.cp(pub, out, { recursive: true });
for (const asset of ['site.js', 'theme-init.js']) {
  await fs.copyFile(new URL(`./${asset}`, src), new URL(`./${asset}`, out));
}
const styles = (await Promise.all(styleSources.map(file => fs.readFile(new URL(file, src), 'utf8')))).join('\n\n');
await fs.writeFile(new URL('./styles.css', out), `${styles.trim()}\n`);

for (const route of routes) await writeRoute(route);
await fs.writeFile(new URL('./404.html', out), layout({ path: '/404/', noindex: true, ...errorPage }));

const indexableRoutes = routes.filter(route => route.indexable);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexableRoutes.map(route => `  <url><loc>${new URL(route.path, site.url)}</loc></url>`).join('\n')}\n</urlset>\n`;
await fs.writeFile(new URL('./sitemap.xml', out), sitemap);
await fs.writeFile(new URL('./robots.txt', out), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`Built ${indexableRoutes.length} indexable routes and ${routes.length - indexableRoutes.length + 1} noindex/error routes.`);
