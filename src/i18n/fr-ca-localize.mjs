import { frCaCatalog, frCaCatalogConflicts } from './fr-ca-catalog.mjs';

const decodeEntities = value => String(value || '')
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
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));

const escapeText = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const escapeAttribute = value => escapeText(value).replaceAll('"', '&quot;');

export const frenchPathFor = path => {
  const value = String(path || '/');
  if (value === '/') return '/fr/';
  if (value === '/fr' || value.startsWith('/fr/')) return value;
  return `/fr${value.startsWith('/') ? value : `/${value}`}`;
};

export const frenchHrefFor = (href, availablePaths = null) => {
  const value = String(href || '');
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/fr/')) return value;
  if (/^\/(?:assets|build)(?:\/|$)|^\/(?:favicon\.ico|site\.webmanifest)$|^\/\.well-known\//.test(value)) return value;
  const match = value.match(/^([^?#]*)([?#].*)?$/);
  const pathname = match?.[1] || value;
  const suffix = match?.[2] || '';
  if (availablePaths && !availablePaths.has(pathname)) return value;
  return `${frenchPathFor(pathname)}${suffix}`;
};

export const translateFrCa = source => {
  const key = decodeEntities(String(source || '')).replace(/\s+/g, ' ').trim();
  if (!key) return key;
  return frCaCatalog.get(key) ?? null;
};

const localizeTextNode = value => {
  const match = String(value).match(/^(\s*)([\s\S]*?)(\s*)$/);
  const core = decodeEntities(match?.[2] || '').replace(/\s+/g, ' ').trim();
  if (!core) return value;
  const translated = translateFrCa(core);
  return translated === null ? value : `${match?.[1] || ''}${escapeText(translated)}${match?.[3] || ''}`;
};

const localizeTag = (tag, availablePaths) => {
  let output = String(tag);
  output = output.replace(/\bhref="([^"]+)"/gi, (match, href) => {
    const localized = frenchHrefFor(decodeEntities(href), availablePaths);
    return localized === decodeEntities(href) ? match : `href="${escapeAttribute(localized)}"`;
  });
  output = output.replace(/\b(aria-label|placeholder|title|alt)="([^"]*)"/gi, (match, name, raw) => {
    const decoded = decodeEntities(raw);
    const translated = translateFrCa(decoded);
    return translated === null ? match : `${name}="${escapeAttribute(translated)}"`;
  });
  return output;
};

export const localizeHtmlFrCa = (html, availablePaths = null) => {
  const parts = String(html || '').split(/(<[^>]+>)/g);
  let skipDepth = 0;
  const skipTags = new Set(['code', 'pre', 'script', 'style', 'textarea']);

  return parts.map(part => {
    if (!part.startsWith('<')) return skipDepth ? part : localizeTextNode(part);
    const close = part.match(/^<\/\s*([a-z0-9-]+)/i)?.[1]?.toLowerCase();
    const open = part.match(/^<\s*([a-z0-9-]+)/i)?.[1]?.toLowerCase();
    if (close && skipTags.has(close)) skipDepth = Math.max(0, skipDepth - 1);
    const localized = skipDepth ? part : localizeTag(part, availablePaths);
    if (open && !/^<\//.test(part) && !/\/>$/.test(part) && skipTags.has(open)) skipDepth += 1;
    return localized;
  }).join('');
};

const localizeField = value => {
  if (typeof value !== 'string') return value;
  return translateFrCa(value) ?? value;
};

export function localizePageFrCa(page, englishPath, availablePaths) {
  if (!page || typeof page !== 'object') return page;
  return {
    ...page,
    title: localizeField(page.title),
    description: localizeField(page.description),
    body: localizeHtmlFrCa(page.body, availablePaths),
    lang: 'fr-CA',
    breadcrumbItems: Array.isArray(page.breadcrumbItems)
      ? page.breadcrumbItems.map(item => ({
          ...item,
          label: localizeField(item.label),
          href: item.href ? frenchHrefFor(item.href, availablePaths) : item.href
        }))
      : page.breadcrumbItems,
    articleMeta: page.articleMeta ? {
      ...page.articleMeta,
      title: localizeField(page.articleMeta.title),
      dek: localizeField(page.articleMeta.dek)
    } : page.articleMeta,
    imageAlt: page.imageAlt ? localizeField(page.imageAlt) : page.imageAlt,
    searchTerms: page.searchTerms ? localizeField(page.searchTerms) : page.searchTerms,
    localizationSourcePath: englishPath
  };
}

export { frCaCatalogConflicts };
