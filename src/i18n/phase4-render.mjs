import { site } from '../data.mjs';
import { navGroups } from '../nav-v4.mjs';
import { frenchHrefFor } from './fr-ca-localize.mjs';
import { basePathForLocale } from './locales.mjs';
import { spanishHrefFor } from './es-localize.mjs';

const familyForPath = path => basePathForLocale(path).split('/').filter(Boolean)[0] || 'home';
const navChildLinks = group => (group.columns || []).flatMap(column => column[1]);
const pathMatches = (path, href) => href !== '/' && (path === href || path.startsWith(href));
const navGroupIsActive = (group, path) => pathMatches(path, group.href) || navChildLinks(group).some(([, href]) => pathMatches(path, href));
const escapeRegex = value => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const localizedHref = (href, locale) => {
  if (locale === 'fr-CA') return frenchHrefFor(href);
  if (locale === 'es') return spanishHrefFor(href);
  return href;
};

const addAttribute = (tag, attribute) => tag.includes(attribute.split('=')[0]) ? tag : tag.replace(/>$/, ` ${attribute}>`);

const addClass = (tag, className) => tag.replace(/class="([^"]*)"/, (match, classes) => {
  const values = new Set(classes.split(/\s+/).filter(Boolean));
  values.add(className);
  return `class="${[...values].join(' ')}"`;
});

const hardenPrimaryNavigation = (html, route, basePath) => String(html || '').replace(
  /(<nav id="primary-nav"\b[^>]*>)([\s\S]*?)(<\/nav>)/,
  (match, open, nav, close) => {
    let output = nav;
    for (const group of navGroups) {
      const groupHref = localizedHref(group.href, route.locale);
      const groupPattern = new RegExp(`<a\\b[^>]*class="[^"]*\\bnav-(?:parent|direct)\\b[^"]*"[^>]*href="${escapeRegex(groupHref)}"[^>]*>`, 'g');
      output = output.replace(groupPattern, tag => {
        let next = tag;
        if (navGroupIsActive(group, basePath)) next = addClass(next, 'is-context-active');
        if (basePath === group.href) next = addAttribute(next, 'aria-current="page"');
        return next;
      });

      for (const [, href] of navChildLinks(group)) {
        if (basePath !== href) continue;
        const childHref = localizedHref(href, route.locale);
        const childPattern = new RegExp(`<a\\b[^>]*href="${escapeRegex(childHref)}"[^>]*>`, 'g');
        output = output.replace(childPattern, tag => addAttribute(tag, 'aria-current="page"'));
      }
    }
    return `${open}${output}${close}`;
  }
);

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
  const withFamily = String(html || '').replace(/<body class="page-[^"]+"/, `<body class="page-${semantics.family}"`);
  return hardenPrimaryNavigation(withFamily, route, semantics.basePath);
}
