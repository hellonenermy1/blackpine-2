import { spanishSourceRoutes, spanishRoutes } from '../src/routes.mjs';
import { esCatalogConflicts, translateEs } from '../src/i18n/es-localize.mjs';

const decode = value => String(value || '')
  .replaceAll('&amp;', '&')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'")
  .replaceAll('&nbsp;', ' ')
  .replaceAll('&mdash;', '—')
  .replaceAll('&ndash;', '–')
  .replaceAll('&rsquo;', '’')
  .replaceAll('&ldquo;', '“')
  .replaceAll('&rdquo;', '”')
  .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)));

const clean = value => decode(value).replace(/\s+/g, ' ').trim();
const protectedValue = value => {
  const text = clean(value);
  if (!text) return true;
  if (/^[\d\s./:+#@©↗→↑↓⌘—–-]+$/u.test(text)) return true;
  if (/^(?:https?:\/\/|mailto:|tel:)/i.test(text)) return true;
  if (/^[A-Z0-9_.:@/+ -]{1,30}$/.test(text) && !/[a-z]/.test(text)) return true;
  return false;
};

const metadataGaps = [];
const bodyGaps = new Map();

for (let index = 0; index < spanishSourceRoutes.length; index += 1) {
  const en = spanishSourceRoutes[index];
  const es = spanishRoutes[index];
  if (!es) continue;
  for (const field of ['title', 'description']) {
    const source = clean(en.page?.[field]);
    const target = clean(es.page?.[field]);
    if (source && source === target && !protectedValue(source)) metadataGaps.push({ path: en.path, field, source });
  }
  const body = String(en.page?.body || '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, '');
  for (const match of body.matchAll(/>([^<>]+)</g)) {
    const source = clean(match[1]);
    if (!source || protectedValue(source)) continue;
    if (translateEs(source) !== null) continue;
    const record = bodyGaps.get(source) || { source, routes: [] };
    if (!record.routes.includes(en.path)) record.routes.push(en.path);
    bodyGaps.set(source, record);
  }
  for (const match of body.matchAll(/\b(?:aria-label|placeholder|title|alt)="([^"]+)"/gi)) {
    const source = clean(match[1]);
    if (!source || protectedValue(source)) continue;
    if (translateEs(source) !== null) continue;
    const record = bodyGaps.get(source) || { source, routes: [] };
    if (!record.routes.includes(en.path)) record.routes.push(en.path);
    bodyGaps.set(source, record);
  }
}

console.log(`PHASE3 GAP REPORT: ${metadataGaps.length} untranslated metadata fields; ${bodyGaps.size} untranslated page-body/attribute strings; ${esCatalogConflicts.length} catalog conflicts; ${spanishRoutes.length} Spanish routes.`);
for (const gap of metadataGaps) console.log(`META\t${gap.path}\t${gap.field}\t${gap.source}`);
for (const gap of [...bodyGaps.values()].sort((a, b) => a.source.localeCompare(b.source))) console.log(`BODY\t${gap.routes.join(',')}\t${gap.source}`);
for (const conflict of esCatalogConflicts) console.log(`CONFLICT\t${conflict.english}\t${conflict.first}\t${conflict.second}`);
