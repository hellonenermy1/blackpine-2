import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { site } from './src/data.mjs';
import { layout } from './src/layout.mjs';
import { writeOgImages } from './src/lib/og-images.mjs';
import { routes, errorPage, errorPageFr, errorPageEs, spanishCounterpartPaths } from './src/routes.mjs';
import { alternateLinksForRoute, basePathForLocale, decorateRoute, languageOptionsForRoute, mergeAlternateLinks } from './src/i18n/locales.mjs';
import { localizeHtmlEs } from './src/i18n/es-localize.mjs';

const out = new URL('./dist/', import.meta.url);
const src = new URL('./src/', import.meta.url);
const pub = new URL('./public/', import.meta.url);
const styleSources = [
  './styles/tokens.css',
  './styles/base.css',
  './styles/layout.css',
  './styles/components.css',
  './styles/pages.css',
  './styles/phase2.css',
  './styles/phase4.css',
  './styles/preferences.css',
  './styles/responsive.css'
];

const entityMap = new Map([
  ['&amp;', '&'], ['&lt;', '<'], ['&gt;', '>'], ['&quot;', '"'], ['&#39;', "'"], ['&nbsp;', ' '], ['&mdash;', '—'], ['&ndash;', '–']
]);

const decodeEntities = value => {
  let output = value;
  for (const [entity, replacement] of entityMap) output = output.replaceAll(entity, replacement);
  return output.replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)));
};

const textFromHtml = html => decodeEntities(String(html || '')
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim());

const headingsFromHtml = html => [...String(html || '').matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)]
  .map(match => textFromHtml(match[1]))
  .filter(Boolean);

const digest = content => createHash('sha256').update(content).digest('hex').slice(0, 12);

async function writeBuildAsset(name, extension, content) {
  const filename = `${name}.${digest(content)}.${extension}`;
  const directory = new URL('./build/', out);
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(new URL(`./${filename}`, directory), content);
  return `/build/${filename}`;
}

const localizedRoutes = routes.map(decorateRoute);

async function writeRoute(route, assets) {
  const clean = route.path === '/' ? '' : route.path.replace(/^\//, '').replace(/\/$/, '');
  const dir = new URL(`./${clean ? `${clean}/` : ''}`, out);
  await fs.mkdir(dir, { recursive: true });
  const generatedAlternates = alternateLinksForRoute(route, localizedRoutes);
  const alternateLinks = mergeAlternateLinks(route.page.alternateLinks, generatedAlternates);
  const localization = {
    currentLocale: route.locale,
    translationKey: route.translationKey,
    languageOptions: languageOptionsForRoute(route, localizedRoutes)
  };
  let html = layout({ path: route.path, noindex: !route.indexable, assets, ...route.page, alternateLinks, localization });
  if (route.locale === 'es') html = localizeHtmlEs(html, spanishCounterpartPaths, { finalRender: true });
  await fs.writeFile(new URL('./index.html', dir), html);
}

await fs.rm(out, { recursive: true, force: true });
await fs.mkdir(out, { recursive: true });
await fs.cp(pub, out, { recursive: true });
await writeOgImages(out);

const styles = `${(await Promise.all(styleSources.map(file => fs.readFile(new URL(file, src), 'utf8')))).join('\n\n').trim()}\n`;
const [themeInit, siteJs, preferencesJs, a11yJs, phase2Js, phase3Js] = await Promise.all([
  fs.readFile(new URL('./theme-init.js', src), 'utf8'),
  fs.readFile(new URL('./site.js', src), 'utf8'),
  fs.readFile(new URL('./preferences.js', src), 'utf8'),
  fs.readFile(new URL('./a11y-v3.js', pub), 'utf8'),
  fs.readFile(new URL('./phase2.js', pub), 'utf8'),
  fs.readFile(new URL('./phase3.js', pub), 'utf8')
]);

const assets = {
  styles: await writeBuildAsset('styles', 'css', styles),
  themeInit: await writeBuildAsset('theme-init', 'js', themeInit),
  site: await writeBuildAsset('site', 'js', siteJs),
  preferences: await writeBuildAsset('preferences', 'js', preferencesJs),
  a11y: await writeBuildAsset('a11y', 'js', a11yJs),
  phase2: await writeBuildAsset('phase2', 'js', phase2Js),
  phase3: await writeBuildAsset('phase3', 'js', phase3Js)
};

for (const stable of ['a11y-v3.js', 'phase2.js', 'phase3.js']) {
  await fs.rm(new URL(`./${stable}`, out), { force: true });
}

for (const route of localizedRoutes) await writeRoute(route, assets);

const localizedErrorEn = decorateRoute({ path: '/404/', indexable: false, page: errorPage });
const localizedErrorFr = decorateRoute({ path: '/fr/404/', indexable: false, page: errorPageFr });
const localizedErrorEs = decorateRoute({ path: '/es/404/', indexable: false, page: errorPageEs });
const errorRoutes = [localizedErrorEn, localizedErrorFr, localizedErrorEs];

const errorLocalization = route => ({
  currentLocale: route.locale,
  translationKey: route.translationKey,
  languageOptions: languageOptionsForRoute(route, [route])
});

await fs.writeFile(new URL('./404.html', out), layout({
  path: '/404/',
  noindex: true,
  assets,
  ...errorPage,
  localization: errorLocalization(localizedErrorEn)
}));

await fs.mkdir(new URL('./fr/', out), { recursive: true });
await fs.writeFile(new URL('./fr/404.html', out), layout({
  path: '/fr/404/',
  noindex: true,
  assets,
  ...errorPageFr,
  localization: errorLocalization(localizedErrorFr)
}));

await fs.mkdir(new URL('./es/', out), { recursive: true });
let spanish404 = layout({
  path: '/es/404/',
  noindex: true,
  assets,
  ...errorPageEs,
  localization: errorLocalization(localizedErrorEs)
});
spanish404 = localizeHtmlEs(spanish404, spanishCounterpartPaths, { finalRender: true });
await fs.writeFile(new URL('./es/404.html', out), spanish404);

const indexableRoutes = localizedRoutes.filter(route => route.indexable);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexableRoutes.map(route => `  <url><loc>${new URL(route.path, site.url)}</loc></url>`).join('\n')}\n</urlset>\n`;
await fs.writeFile(new URL('./sitemap.xml', out), sitemap);
await fs.writeFile(new URL('./robots.txt', out), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);

const searchRecord = route => {
  const body = route.page.body || '';
  const basePath = basePathForLocale(route.path);
  const pathSegments = basePath.split('/').filter(Boolean);
  const family = pathSegments[0] || 'home';
  const requestedTextLimit = Number.isInteger(route.page.searchTextLimit) ? route.page.searchTextLimit : 6000;
  const textLimit = Math.max(0, Math.min(requestedTextLimit, 6000));
  return {
    path: route.path,
    title: route.page.title,
    description: route.page.description,
    family,
    headings: headingsFromHtml(body),
    terms: Array.isArray(route.page.searchTerms) ? route.page.searchTerms.join(' ') : String(route.page.searchTerms || ''),
    text: textFromHtml(body).slice(0, textLimit)
  };
};

const englishSearchIndex = indexableRoutes.filter(route => route.locale === 'en-CA').map(searchRecord);
const frenchSearchIndex = indexableRoutes.filter(route => route.locale === 'fr-CA').map(searchRecord);
const spanishSearchIndex = indexableRoutes.filter(route => route.locale === 'es').map(searchRecord);
await fs.writeFile(new URL('./search-index.json', out), `${JSON.stringify(englishSearchIndex)}\n`);
await fs.mkdir(new URL('./fr/', out), { recursive: true });
await fs.writeFile(new URL('./fr/search-index.json', out), `${JSON.stringify(frenchSearchIndex)}\n`);
await fs.mkdir(new URL('./es/', out), { recursive: true });
await fs.writeFile(new URL('./es/search-index.json', out), `${JSON.stringify(spanishSearchIndex)}\n`);

console.log(`Built ${indexableRoutes.length} indexable routes and ${localizedRoutes.length - indexableRoutes.length + errorRoutes.length} noindex/error routes.`);
console.log(`Search indexes: ${englishSearchIndex.length} English routes; ${frenchSearchIndex.length} French routes; ${spanishSearchIndex.length} Spanish routes.`);
console.log(`Runtime assets: ${Object.values(assets).join(', ')}`);
