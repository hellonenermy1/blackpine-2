import { esCatalog, esCatalogConflicts } from './es-catalog.mjs';

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

export const spanishPathFor = path => {
  const value = String(path || '/');
  if (value === '/') return '/es/';
  if (value === '/es' || value.startsWith('/es/')) return value;
  return `/es${value.startsWith('/') ? value : `/${value}`}`;
};

export const spanishHrefFor = (href, availablePaths = null) => {
  const value = String(href || '');
  if (!value.startsWith('/') || value.startsWith('//') || value === '/es' || value.startsWith('/es/') || value === '/fr' || value.startsWith('/fr/')) return value;
  if (/^\/(?:assets|build)(?:\/|$)|^\/(?:favicon\.ico|favicon\.svg|site\.webmanifest)$|^\/\.well-known\//.test(value)) return value;
  const match = value.match(/^([^?#]*)([?#].*)?$/);
  const pathname = match?.[1] || value;
  const suffix = match?.[2] || '';
  if (availablePaths && !availablePaths.has(pathname)) return value;
  return `${spanishPathFor(pathname)}${suffix}`;
};

export const translateEs = source => {
  const key = decodeEntities(String(source || '')).replace(/\s+/g, ' ').trim();
  if (!key) return key;
  return esCatalog.get(key) ?? null;
};

const localizeTextNode = value => {
  const match = String(value).match(/^(\s*)([\s\S]*?)(\s*)$/);
  const core = decodeEntities(match?.[2] || '').replace(/\s+/g, ' ').trim();
  if (!core) return value;
  const translated = translateEs(core);
  return translated === null ? value : `${match?.[1] || ''}${escapeText(translated)}${match?.[3] || ''}`;
};

const localizeTag = (tag, availablePaths, finalRender = false) => {
  let output = String(tag);
  const explicitLanguageChoice = finalRender && (/\bdata-language-choice\b/i.test(output) || /\bhreflang=/i.test(output));
  if (!explicitLanguageChoice) {
    output = output.replace(/\bhref="([^"]+)"/gi, (match, href) => {
      const decoded = decodeEntities(href);
      const localized = spanishHrefFor(decoded, availablePaths);
      return localized === decoded ? match : `href="${escapeAttribute(localized)}"`;
    });
  }
  output = output.replace(/\b(aria-label|placeholder|title|alt)="([^"]*)"/gi, (match, name, raw) => {
    const decoded = decodeEntities(raw);
    const translated = translateEs(decoded);
    return translated === null ? match : `${name}="${escapeAttribute(translated)}"`;
  });
  return output;
};

const localizeJsonLd = source => {
  let value;
  try { value = JSON.parse(source); } catch { return source; }
  const visit = node => {
    if (Array.isArray(node)) return node.map(visit);
    if (node && typeof node === 'object') {
      const output = {};
      for (const [key, child] of Object.entries(node)) {
        if (typeof child === 'string') {
          let next = translateEs(child) ?? child;
          if (key === 'url' && /\/research\/$/.test(next) && !/\/es\/research\/$/.test(next)) next = next.replace(/\/research\/$/, '/es/research/');
          output[key] = next;
        } else output[key] = visit(child);
      }
      return output;
    }
    return node;
  };
  return JSON.stringify(visit(value)).replaceAll('<', '\\u003c');
};

export const localizeHtmlEs = (html, availablePaths = null, { finalRender = false } = {}) => {
  let source = String(html || '');
  if (finalRender) {
    source = source.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/gi,
      (_, open, json, close) => `${open}${localizeJsonLd(json)}${close}`);
  }
  const parts = source.split(/(<[^>]+>)/g);
  let skipDepth = 0;
  const skipTags = new Set(['code', 'pre', 'script', 'style', 'textarea']);

  return parts.map(part => {
    if (!part.startsWith('<')) return skipDepth ? part : localizeTextNode(part);
    const close = part.match(/^<\/\s*([a-z0-9-]+)/i)?.[1]?.toLowerCase();
    const open = part.match(/^<\s*([a-z0-9-]+)/i)?.[1]?.toLowerCase();
    if (close && skipTags.has(close)) skipDepth = Math.max(0, skipDepth - 1);
    const localized = skipDepth ? part : localizeTag(part, availablePaths, finalRender);
    if (open && !/^<\//.test(part) && !/\/>$/.test(part) && skipTags.has(open)) skipDepth += 1;
    return localized;
  }).join('');
};

const localizeField = value => {
  if (typeof value !== 'string') return value;
  return translateEs(value) ?? value;
};

export function localizePageEs(page, englishPath, availablePaths) {
  if (!page || typeof page !== 'object') return page;
  return {
    ...page,
    title: localizeField(page.title),
    description: localizeField(page.description),
    body: localizeHtmlEs(page.body, availablePaths),
    lang: 'es',
    breadcrumbItems: Array.isArray(page.breadcrumbItems)
      ? page.breadcrumbItems.map(item => ({
          ...item,
          label: localizeField(item.label),
          href: item.href ? spanishHrefFor(item.href, availablePaths) : item.href
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

export { esCatalogConflicts };
