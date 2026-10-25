import { site } from '../data.mjs';
import { basePathForLocale } from './locales.mjs';

const familyForPath = path => basePathForLocale(path).split('/').filter(Boolean)[0] || 'home';

export function documentLangForRoute(route) {
  if (route.locale !== 'en-CA') return route.locale;
  if (route.path === '/legal/privacy/' || route.path === '/legal/terms/') return 'en-CA';
  return 'en';
}

export function renderSemanticsForRoute(route) {
  const basePath = basePathForLocale(route.path);
  const family = familyForPath(route.path);
  return {
    basePath,
    family,
    lang: documentLangForRoute(route),
    socialImage: route.page?.image || site.ogImages?.[family] || site.ogImage
  };
}

export function hardenRenderedLocaleHtml(html, route) {
  const semantics = renderSemanticsForRoute(route);
  return String(html || '').replace(/<body class="page-[^"]+"/, `<body class="page-${semantics.family}"`);
}
