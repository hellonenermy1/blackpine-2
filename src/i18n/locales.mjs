export const preferenceStorageKey = 'blackpine.preferences.v1';
export const preferenceSchemaVersion = 1;

export const locales = Object.freeze([
  Object.freeze({ id: 'en-CA', code: 'en', label: 'English', prefix: '', hreflang: 'en-CA', rollout: 'published' }),
  Object.freeze({ id: 'fr-CA', code: 'fr', label: 'Français', prefix: '/fr', hreflang: 'fr-CA', rollout: 'partial' }),
  Object.freeze({ id: 'es', code: 'es', label: 'Español', prefix: '/es', hreflang: 'es', rollout: 'planned' })
]);

export const defaultLocale = 'en-CA';

const byId = new Map(locales.map(locale => [locale.id, locale]));
const prefixes = locales.filter(locale => locale.prefix).sort((a, b) => b.prefix.length - a.prefix.length);

export const localeById = id => byId.get(id) || byId.get(defaultLocale);

export function localeForPath(pathname = '/') {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const match = prefixes.find(locale => path === `${locale.prefix}/` || path.startsWith(`${locale.prefix}/`));
  return match?.id || defaultLocale;
}

export function basePathForLocale(pathname = '/') {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const locale = localeById(localeForPath(path));
  if (!locale.prefix) return path;
  const stripped = path.slice(locale.prefix.length) || '/';
  return stripped.startsWith('/') ? stripped : `/${stripped}`;
}

export function translationKeyForPath(pathname = '/') {
  const base = basePathForLocale(pathname).replace(/^\/+|\/+$/g, '');
  return base ? base.split('/').join('.') : 'home';
}

export function decorateRoute(route) {
  return {
    ...route,
    locale: localeForPath(route.path),
    translationKey: translationKeyForPath(route.path)
  };
}

export function languageOptionsForRoute(route, allRoutes) {
  const decorated = route.translationKey ? route : decorateRoute(route);
  const candidates = allRoutes.map(item => item.translationKey ? item : decorateRoute(item));
  return locales.map(locale => {
    const counterpart = candidates.find(candidate => candidate.translationKey === decorated.translationKey && candidate.locale === locale.id);
    return {
      ...locale,
      current: locale.id === decorated.locale,
      available: Boolean(counterpart),
      href: counterpart?.path || null
    };
  });
}

export function alternateLinksForRoute(route, allRoutes) {
  const options = languageOptionsForRoute(route, allRoutes).filter(option => option.available);
  if (options.length < 2) return [];
  const links = options.map(option => ({ hreflang: option.hreflang, href: option.href }));
  const english = options.find(option => option.id === defaultLocale);
  if (english) links.push({ hreflang: 'x-default', href: english.href });
  return links;
}

export function mergeAlternateLinks(...groups) {
  const merged = new Map();
  for (const group of groups) {
    for (const link of group || []) {
      if (!link?.hreflang || !link?.href) continue;
      merged.set(link.hreflang, { hreflang: link.hreflang, href: link.href });
    }
  }
  return [...merged.values()];
}
