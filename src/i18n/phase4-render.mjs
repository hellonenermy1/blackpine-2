import { site } from '../data.mjs';
import { basePathForLocale } from './locales.mjs';

const familyForPath = path => basePathForLocale(path).split('/').filter(Boolean)[0] || 'home';

export function documentLangForLocale(locale) {
  return locale === 'en-CA' ? 'en' : locale;
}

export function renderSemanticsForRoute(route) {
  const basePath = basePathForLocale(route.path);
  const family = familyForPath(route.path);
  return {
    basePath,
    family,
    lang: documentLangForLocale(route.locale),
    socialImage: route.page?.image || site.ogImages?.[family] || site.ogImage
  };
}

export function hardenRenderedLocaleHtml(html, route) {
  const semantics = renderSemanticsForRoute(route);
  return String(html || '').replace(/<body class="page-[^"]+"/, `<body class="page-${semantics.family}"`);
}
