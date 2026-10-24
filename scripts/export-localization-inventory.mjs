import fs from 'node:fs/promises';
import { routes } from '../src/routes.mjs';
import { decorateRoute } from '../src/i18n/locales.mjs';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const artifacts = new URL('../browser-artifacts/', import.meta.url);

const entityMap = new Map([
  ['&amp;', '&'], ['&lt;', '<'], ['&gt;', '>'], ['&quot;', '"'], ['&#39;', "'"], ['&nbsp;', ' '], ['&mdash;', '—'], ['&ndash;', '–'], ['&rsquo;', '’'], ['&ldquo;', '“'], ['&rdquo;', '”']
]);

const decodeEntities = value => {
  let output = String(value || '');
  for (const [entity, replacement] of entityMap) output = output.replaceAll(entity, replacement);
  return output.replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)));
};

const clean = value => decodeEntities(value).replace(/\s+/g, ' ').trim();

const htmlPathForRoute = path => {
  if (path === '/') return new URL('./index.html', dist);
  const relative = path.replace(/^\//, '').replace(/\/$/, '');
  return new URL(`./${relative}/index.html`, dist);
};

const records = new Map();
const pages = {};

const add = (value, path, kind) => {
  const text = clean(value);
  if (!text) return;
  if (/^[\d\s./:+#@©↗→↑↓⌘—–-]+$/u.test(text)) return;
  const key = `${kind}\u0000${text}`;
  const record = records.get(key) || { kind, source: text, routes: [], count: 0 };
  record.count += 1;
  if (!record.routes.includes(path)) record.routes.push(path);
  records.set(key, record);
  pages[path] ||= [];
  if (!pages[path].some(item => item.kind === kind && item.source === text)) pages[path].push({ kind, source: text });
};

const decorated = routes.map(decorateRoute);
const englishRoutes = decorated.filter(route => route.locale === 'en-CA');

for (const route of englishRoutes) {
  const html = await fs.readFile(htmlPathForRoute(route.path), 'utf8');
  const withoutCode = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, '');

  for (const match of withoutCode.matchAll(/>([^<>]+)</g)) add(match[1], route.path, 'text');
  for (const match of withoutCode.matchAll(/\b(aria-label|placeholder|title|alt)="([^"]+)"/gi)) add(match[2], route.path, match[1].toLowerCase());
}

const errorHtml = await fs.readFile(new URL('./404.html', dist), 'utf8');
const errorPath = '/404/';
const errorWithoutCode = errorHtml
  .replace(/<script\b[\s\S]*?<\/script>/gi, '')
  .replace(/<style\b[\s\S]*?<\/style>/gi, '')
  .replace(/<svg\b[\s\S]*?<\/svg>/gi, '');
for (const match of errorWithoutCode.matchAll(/>([^<>]+)</g)) add(match[1], errorPath, 'text');
for (const match of errorWithoutCode.matchAll(/\b(aria-label|placeholder|title|alt)="([^"]+)"/gi)) add(match[2], errorPath, match[1].toLowerCase());

const output = {
  generatedAt: new Date().toISOString(),
  scope: 'Rendered English corporate-site strings for Phase 2 French localization review. Lawyer-controlled EN/FR legal bodies remain separately hash-protected.',
  englishRouteCount: englishRoutes.length,
  uniqueStringCount: records.size,
  strings: [...records.values()].sort((a, b) => a.source.localeCompare(b.source) || a.kind.localeCompare(b.kind)),
  pages
};

await fs.mkdir(artifacts, { recursive: true });
await fs.writeFile(new URL('./localization-inventory-en.json', artifacts), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Localization inventory exported: ${englishRoutes.length} English routes + 404; ${records.size} unique rendered strings.`);
