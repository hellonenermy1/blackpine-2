import { site } from '../data.mjs';
import { navGroups } from '../nav-v4.mjs';
import { basePathForLocale } from './locales.mjs';

const familyForPath = path => basePathForLocale(path).split('/').filter(Boolean)[0] || 'home';
const navChildLinks = group => (group.columns || []).flatMap(column => column[1]);
const pathMatches = (path, href) => href !== '/' && (path === href || path.startsWith(href));
const navGroupIsActive = (group, path) => pathMatches(path, group.href) || navChildLinks(group).some(([, href]) => pathMatches(path, href));
const navChildPaths = new Set(navGroups.flatMap(navChildLinks).map(([, href]) => href));

const addAttribute = (tag, attribute) => tag.includes(attribute.split('=')[0]) ? tag : tag.replace(/>$/, ` ${attribute}>`);

const addClass = (tag, className) => tag.replace(/class="([^"]*)"/, (match, classes) => {
  const values = new Set(classes.split(/\s+/).filter(Boolean));
  values.add(className);
  return `class="${[...values].join(' ')}"`;
});

const hardenPrimaryNavigation = (html, basePath) => String(html || '').replace(
  /(<nav\b[^>]*\bid="primary-nav"[^>]*>)([\s\S]*?)(<\/nav>)/,
  (match, open, nav, close) => {
    const output = nav.replace(/<a\b[^>]*>/g, tag => {
      const href = tag.match(/\bhref="([^"]+)"/)?.[1];
      if (!href?.startsWith('/')) return tag;
      const linkBasePath = basePathForLocale(href);
      const isGroupLink = /\bclass="[^"]*\bnav-(?:parent|direct)\b/.test(tag);
      let next = tag;

      if (isGroupLink) {
        const group = navGroups.find(candidate => candidate.href === linkBasePath);
        if (group && navGroupIsActive(group, basePath)) next = addClass(next, 'is-context-active');
        if (basePath === linkBasePath) next = addAttribute(next, 'aria-current="page"');
        return next;
      }

      if (navChildPaths.has(linkBasePath) && basePath === linkBasePath) {
        next = addAttribute(next, 'aria-current="page"');
      }
      return next;
    });
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
  return hardenPrimaryNavigation(withFamily, semantics.basePath);
}
