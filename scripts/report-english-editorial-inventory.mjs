// Build-only English copy inventory. It does not modify the site or certify authorship.
// Source: generated public HTML, not a sampling of template strings.
import fs from 'node:fs/promises';
import { englishRoutes } from '../src/routes.mjs';

const decode = value => String(value || '')
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&(?:amp|lt|gt|quot|apos|nbsp|rsquo|lsquo|ldquo|rdquo|mdash|ndash);/gi, entity =>
    ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
       '&apos;': "'", '&nbsp;': ' ', '&rsquo;': '’', '&lsquo;': '‘',
       '&ldquo;': '“', '&rdquo;': '”', '&mdash;': '—', '&ndash;': '–' }[entity.toLowerCase()] || entity))
  .replace(/\s+/g, ' ').trim();

const eraseInvisible = html => html
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<(script|style|svg|template|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ');

const plainText = html => decode(eraseInvisible(html).replace(/<[^>]*>/g, ' '));
const capture = (html, regex) => decode(html.match(regex)?.[1] || '');
const countWords = text => (text.match(/\b[\p{L}\p{N}’'-]+\b/gu) || []).length;

const inventory = [];
const missing = [];
const repeats = new Map();

for (const route of englishRoutes) {
  const location = route.path === '/' ? 'dist/index.html' : 'dist' + route.path + 'index.html';
  let html = '';
  try {
    html = await fs.readFile(location, 'utf8');
  } catch {
    missing.push(location);
    continue;
  }
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  if (main == null) {
    missing.push(location + ' (no main landmark)');
    continue;
  }
  const visible = eraseInvisible(main);
  const fragments = [...visible.matchAll(/>([^<>]+)</g)]
    .map(match => decode(match[1]))
    .filter(Boolean);
  const headings = [...main.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map(match => ({ level: Number(match[1]), text: plainText(match[2]) }));
  const attributes = [...main.matchAll(/\b(?:aria-label|alt|placeholder|title)="([^"]+)"/gi)]
    .map(match => decode(match[1]))
    .filter(Boolean);
  const title = capture(html, /<title>([\s\S]*?)<\/title>/i);
  const description = capture(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  if (!title || !description) missing.push(location + ' (missing metadata)');
  for (const fragment of fragments) {
    if (fragment.length < 68 || fragment.length > 480) continue;
    const entry = repeats.get(fragment) || new Set();
    entry.add(route.path);
    repeats.set(fragment, entry);
  }
  inventory.push({
    path: route.path, indexable: route.indexable, sourceFile: location,
    title, description, headings, fragments, attributes,
    mainText: plainText(main), mainWordCount: countWords(plainText(main))
  });
}

if (missing.length || inventory.length !== englishRoutes.length) {
  console.error('English editorial inventory failed:', missing.join(' | '),
    'got ' + inventory.length + '/' + englishRoutes.length + ' pages');
  process.exit(1);
}

const repeated = [...repeats.entries()]
  .filter(([, paths]) => paths.size > 1)
  .map(([text, paths]) => ({ text, routes: [...paths], count: paths.size }))
  .sort((a, b) => b.count - a.count || b.text.length - a.text.length);

await fs.mkdir('phase4-artifacts', { recursive: true });
await fs.writeFile(
  'phase4-artifacts/english-editorial-inventory.json',
  JSON.stringify({
    generatedAt: new Date().toISOString(),
    methodology: 'All 87 public English route main landmarks, headings, text fragments, accessibility labels and SEO metadata. No AI-authorship classification.',
    totalRoutes: inventory.length,
    totalMainWords: inventory.reduce((sum, item) => sum + item.mainWordCount, 0),
    repeatedLongFragments: repeated,
    routes: inventory
  }, null, 2) + '\n'
);
console.log('English editorial inventory: ' + inventory.length +
  ' routes; ' + inventory.reduce((sum, item) => sum + item.fragments.length, 0) +
  ' visible text fragments; ' +
  inventory.reduce((sum, item) => sum + item.mainWordCount, 0) +
  ' main-content words; ' + repeated.length +
  ' repeated long fragments spanning multiple pages.');
for (const item of repeated.slice(0, 12)) {
  console.log('Repeated ' + item.count + ' routes: ' +
    item.text.slice(0, 150).replace(/\s+/g, ' ') +
    ' [' + item.routes.slice(0, 4).join(', ') + ']');
}
