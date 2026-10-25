import { site } from '../data.mjs';
import { publicCompany } from '../public-company.mjs';
import { safeJson } from '../lib/html.mjs';
import { basePathForLocale } from './locales.mjs';
import { translateFrCa } from './fr-ca-localize.mjs';
import { translateEs } from './es-localize.mjs';

const localize = (value, locale) => {
  if (locale === 'fr-CA') return translateFrCa(value) ?? value;
  if (locale === 'es') return translateEs(value) ?? value;
  return value;
};

const familyForPath = path => basePathForLocale(path).split('/').filter(Boolean)[0] || 'home';

export function renderSemanticsForRoute(route) {
  const basePath = basePathForLocale(route.path);
  const family = familyForPath(route.path);
  return {
    basePath,
    family,
    lang: route.locale,
    socialImage: route.page?.image || site.ogImages?.[family] || site.ogImage,
    includeOrganization: basePath === '/' || basePath === '/company/about/'
  };
}

function organizationSchema(locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    legalName: publicCompany.legalName,
    url: site.url,
    email: site.email,
    telephone: publicCompany.phoneDisplay,
    description: localize(site.description, locale),
    logo: new URL('/favicon.svg', site.url).toString(),
    address: {
      '@type': 'PostalAddress',
      streetAddress: publicCompany.streetAddress,
      addressLocality: publicCompany.cityDisplay,
      addressRegion: publicCompany.provinceCode,
      postalCode: publicCompany.postalCode,
      addressCountry: publicCompany.countryCode
    },
    areaServed: publicCompany.country,
    sameAs: [publicCompany.googleBusinessUrl]
  };
}

export function hardenRenderedLocaleHtml(html, route) {
  const semantics = renderSemanticsForRoute(route);
  let output = String(html || '');

  output = output.replace(/<body class="page-[^"]+"/, `<body class="page-${semantics.family}"`);

  if (semantics.includeOrganization && !output.includes('"@type":"Organization"')) {
    const block = `<script type="application/ld+json">${safeJson(organizationSchema(route.locale))}</script>`;
    output = output.replace('</head>', `  ${block}\n</head>`);
  }

  return output;
}
