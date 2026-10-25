import { site, capabilityFamilies } from './data.mjs';
import { publicCompany } from './public-company.mjs';
import { navGroups } from './nav-v4.mjs';
import { breadcrumb } from './components.mjs';
import { esc, safeJson } from './lib/html.mjs';
import { frenchHrefFor, translateFrCa } from './i18n/fr-ca-localize.mjs';

const basePathForChrome = path => {
  const value = String(path || '/');
  if (value === '/fr/' || value === '/fr') return '/';
  if (value.startsWith('/fr/')) return value.slice(3) || '/';
  return value;
};

const localText = (value, isFrench) => isFrench ? (translateFrCa(value) ?? value) : value;
const localHref = (value, isFrench) => isFrench ? frenchHrefFor(value) : value;

function organizationSchema(isFrench = false) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    legalName: publicCompany.legalName,
    url: site.url,
    email: site.email,
    telephone: publicCompany.phoneDisplay,
    description: localText(site.description, isFrench),
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

function breadcrumbSchema(items) {
  if (!items?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: new URL(item.href, site.url).toString()
    }))
  };
}

function articleSchema(articleMeta, canonical, image, isFrench = false) {
  if (!articleMeta) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: articleMeta.title,
    description: articleMeta.dek,
    datePublished: articleMeta.date,
    dateModified: articleMeta.updated,
    mainEntityOfPage: canonical,
    image: [image],
    author: {
      '@type': 'Organization',
      name: 'Blackpine Research',
      url: `${site.url}${isFrench ? '/fr/research/' : '/research/'}`
    },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      url: site.url,
      logo: {
        '@type': 'ImageObject',
        url: new URL('/favicon.svg', site.url).toString()
      }
    }
  };
}

const navChildLinks = group => (group.columns || []).flatMap(column => column[1]);
const pathMatches = (path, href) => href !== '/' && (path === href || path.startsWith(href));
const navGroupIsActive = (group, path) => pathMatches(path, group.href) || navChildLinks(group).some(([, href]) => pathMatches(path, href));

function primaryNavigation(path, isFrench = false) {
  const basePath = basePathForChrome(path);
  return navGroups.map((group, index) => {
    const active = navGroupIsActive(group, basePath);
    const current = basePath === group.href;
    const groupHref = localHref(group.href, isFrench);
    const groupLabel = localText(group.label, isFrench);
    if (!group.columns?.length) return `<a class="nav-direct${active ? ' is-context-active' : ''}" href="${esc(groupHref)}"${current ? ' aria-current="page"' : ''}>${esc(groupLabel)}</a>`;
    const panelId = `nav-panel-${index}`;
    const toggleLabel = localText(`Toggle ${group.label} menu`, isFrench);
    const viewLabel = localText(`View ${group.label.toLowerCase()} →`, isFrench);
    return `<div class="nav-group" data-nav-group>
      <div class="nav-group-head"><a class="nav-parent${active ? ' is-context-active' : ''}" href="${esc(groupHref)}"${current ? ' aria-current="page"' : ''}>${esc(groupLabel)}</a><button class="nav-group-toggle" type="button" aria-expanded="false" aria-controls="${panelId}" data-nav-group-toggle><span class="sr-only">${esc(toggleLabel)}</span><span aria-hidden="true">⌄</span></button></div>
      <div class="mega-panel" id="${panelId}" data-nav-panel>
        <div class="mega-inner">${group.columns.map(([heading, links]) => `<div class="mega-column"><span>${esc(localText(heading, isFrench))}</span>${links.map(([label, href]) => `<a href="${esc(localHref(href, isFrench))}"${basePath === href ? ' aria-current="page"' : ''}>${esc(localText(label, isFrench))}</a>`).join('')}</div>`).join('')}<div class="mega-footer"><a href="${esc(groupHref)}"${current ? ' aria-current="page"' : ''}>${esc(viewLabel)}</a></div></div>
      </div>
    </div>`;
  }).join('');
}

const localeCode = locale => ({ 'en-CA': 'EN', 'fr-CA': 'FR', es: 'ES' }[locale] || 'EN');
const preferencesLabel = locale => ({
  'en-CA': 'Language & preferences',
  'fr-CA': 'Langue et préférences',
  es: 'Idioma y preferencias'
}[locale] || 'Language & preferences');

function languageSwitcher(localization, isFrench = false) {
  const options = localization?.languageOptions || [];
  const currentLocale = localization?.currentLocale || 'en-CA';
  const unavailable = localText('Translation not published for this page yet', isFrench);
  const rows = options.map(option => {
    const copy = `<span class="language-code">${esc(localeCode(option.id))}</span><span class="language-option-copy"><strong lang="${esc(option.code)}">${esc(option.label)}</strong>${option.available ? '' : `<small>${esc(unavailable)}</small>`}</span>`;
    if (option.current) return `<span class="language-option" aria-current="page" data-locale="${esc(option.id)}">${copy}</span>`;
    if (option.available && option.href) return `<a class="language-option" href="${esc(option.href)}" hreflang="${esc(option.hreflang)}" lang="${esc(option.code)}" data-language-choice data-locale="${esc(option.id)}">${copy}</a>`;
    return `<span class="language-option" data-locale="${esc(option.id)}" aria-disabled="true">${copy}</span>`;
  }).join('');
  return `<details class="language-switcher" data-language-menu>
    <summary aria-label="${esc(localText('Language', isFrench))}"><span>${esc(localeCode(currentLocale))}</span><span aria-hidden="true">⌄</span></summary>
    <div class="language-menu-panel">
      <span class="language-menu-title">${esc(localText('Language', isFrench))}</span>
      ${rows}
      <button class="language-preferences-link" type="button" data-preferences-open>${esc(preferencesLabel(currentLocale))}</button>
    </div>
  </details>`;
}

const preferenceCopy = Object.freeze({
  'en-CA': Object.freeze({
    kicker: 'Preferences',
    title: 'Language & appearance',
    close: 'Close',
    closeAria: 'Close preferences',
    intro: 'Choose the language and theme you prefer on this browser.',
    preferredLanguage: 'Language',
    available: 'Available on this page.',
    unavailable: 'This page is not available in this language yet. You can still save it as your preference.',
    displayTheme: 'Theme',
    auto: 'Auto', dark: 'Dark', light: 'Light',
    autoNote: 'Use your device setting.',
    darkNote: 'Always use the dark theme.',
    lightNote: 'Always use the light theme.',
    privacyLead: 'Saved on this device. ',
    privacy: 'Blackpine stores only your language and theme in this browser. No unique preference identifier is created or sent to Blackpine.',
    clear: 'Reset preferences',
    dismiss: 'Cancel',
    save: 'Save',
    statusBlocked: 'Your browser blocked preference storage. These choices apply to this page only.',
    statusUnavailable: 'Preference saved. This page is not available in that language yet.',
    statusCleared: 'Saved preferences were cleared from this browser.',
    themeButton: 'Theme: {label}',
    themeAria: 'Colour theme is {label}. Activate to change theme.'
  }),
  'fr-CA': Object.freeze({
    kicker: 'Préférences',
    title: 'Langue et apparence',
    close: 'Fermer',
    closeAria: 'Fermer les préférences',
    intro: 'Choisissez la langue et le thème à utiliser dans ce navigateur.',
    preferredLanguage: 'Langue',
    available: 'Disponible sur cette page.',
    unavailable: 'Cette page n’est pas encore offerte dans cette langue. Vous pouvez quand même l’enregistrer comme préférence.',
    displayTheme: 'Thème',
    auto: 'Auto', dark: 'Sombre', light: 'Clair',
    autoNote: 'Utiliser le réglage de votre appareil.',
    darkNote: 'Toujours utiliser le thème sombre.',
    lightNote: 'Toujours utiliser le thème clair.',
    privacyLead: 'Enregistré sur cet appareil. ',
    privacy: 'Blackpine enregistre seulement votre langue et votre thème dans ce navigateur. Aucun identifiant unique de préférence n’est créé ni transmis à Blackpine.',
    clear: 'Réinitialiser',
    dismiss: 'Annuler',
    save: 'Enregistrer',
    statusBlocked: 'Votre navigateur a bloqué l’enregistrement. Ces choix s’appliquent uniquement à cette page.',
    statusUnavailable: 'Préférence enregistrée. Cette page n’est pas encore offerte dans cette langue.',
    statusCleared: 'Les préférences enregistrées ont été supprimées de ce navigateur.',
    themeButton: 'Thème : {label}',
    themeAria: 'Le thème de couleurs est {label}. Activez ce bouton pour changer de thème.'
  }),
  es: Object.freeze({
    kicker: 'Preferencias',
    title: 'Idioma y apariencia',
    close: 'Cerrar',
    closeAria: 'Cerrar preferencias',
    intro: 'Elija el idioma y el tema que prefiere en este navegador.',
    preferredLanguage: 'Idioma',
    available: 'Disponible en esta página.',
    unavailable: 'Esta página aún no está disponible en este idioma. Puede guardarlo como preferencia de todos modos.',
    displayTheme: 'Tema',
    auto: 'Automático', dark: 'Oscuro', light: 'Claro',
    autoNote: 'Usar la configuración del dispositivo.',
    darkNote: 'Usar siempre el tema oscuro.',
    lightNote: 'Usar siempre el tema claro.',
    privacyLead: 'Guardado en este dispositivo. ',
    privacy: 'Blackpine guarda únicamente el idioma y el tema en este navegador. No se crea ni se envía a Blackpine ningún identificador único de preferencias.',
    clear: 'Restablecer',
    dismiss: 'Cancelar',
    save: 'Guardar',
    statusBlocked: 'El navegador bloqueó el almacenamiento. Estas opciones se aplican únicamente a esta página.',
    statusUnavailable: 'Preferencia guardada. Esta página aún no está disponible en ese idioma.',
    statusCleared: 'Las preferencias guardadas se borraron de este navegador.',
    themeButton: 'Tema: {label}',
    themeAria: 'El tema de color es {label}. Active este botón para cambiarlo.'
  })
});

function preferencesDialog(localization, currentLocale, path) {
  const copy = preferenceCopy[currentLocale] || preferenceCopy['en-CA'];
  const options = localization?.languageOptions || [];
  const languageRows = options.map(option => {
    const target = option.current ? path : option.available && option.href ? option.href : '';
    return `<label class="preference-choice"><input type="radio" name="preferred-language" value="${esc(option.id)}" data-target="${esc(target)}"${option.current ? ' checked' : ''}><span class="preference-choice-copy"><strong lang="${esc(option.code)}">${esc(option.label)}</strong><small>${esc(option.available || option.current ? copy.available : copy.unavailable)}</small></span></label>`;
  }).join('');
  const themeRows = [
    ['auto', copy.auto, copy.autoNote],
    ['dark', copy.dark, copy.darkNote],
    ['light', copy.light, copy.lightNote]
  ].map(([value, label, note]) => `<label class="preference-choice"><input type="radio" name="preferred-theme" value="${value}"${value === 'auto' ? ' checked' : ''}><span class="preference-choice-copy"><strong>${esc(label)}</strong><small>${esc(note)}</small></span></label>`).join('');

  return `<dialog class="preferences-dialog" data-preferences-dialog aria-labelledby="preferences-title" data-status-storage-blocked="${esc(copy.statusBlocked)}" data-status-language-unavailable="${esc(copy.statusUnavailable)}" data-status-cleared="${esc(copy.statusCleared)}" data-theme-button-template="${esc(copy.themeButton)}" data-theme-aria-template="${esc(copy.themeAria)}">
    <form class="preferences-form" data-preferences-form>
      <div class="preferences-head"><div><span class="preferences-kicker">${esc(copy.kicker)}</span><h2 id="preferences-title">${esc(copy.title)}</h2></div><button class="preferences-close" type="button" data-preferences-close aria-label="${esc(copy.closeAria)}">${esc(copy.close)}</button></div>
      <p class="preferences-copy">${esc(copy.intro)}</p>
      <fieldset class="preferences-fieldset"><legend>${esc(copy.preferredLanguage)}</legend>${languageRows}</fieldset>
      <fieldset class="preferences-fieldset"><legend>${esc(copy.displayTheme)}</legend>${themeRows}</fieldset>
      <div class="preferences-privacy"><strong>${esc(copy.privacyLead)}</strong>${esc(copy.privacy)}</div>
      <p class="preferences-status" data-preferences-status role="status" aria-live="polite"></p>
      <div class="preferences-actions"><button class="preferences-clear" type="button" data-preferences-clear>${esc(copy.clear)}</button><button class="preferences-close" type="button" data-preferences-close>${esc(copy.dismiss)}</button><button class="preferences-save" type="submit">${esc(copy.save)}</button></div>
    </form>
  </dialog>`;
}

const defaultAssets = {
  styles: '/styles.css',
  themeInit: '/theme-init.js',
  site: '/site.js',
  preferences: '/preferences.js',
  a11y: '/a11y-v3.js',
  phase2: '/phase2.js',
  phase3: '/phase3.js'
};

export function layout({
  title,
  description,
  path = '/',
  body,
  image = null,
  imageAlt = null,
  type = 'website',
  breadcrumbItems = [],
  articleMeta = null,
  noindex = false,
  assets = defaultAssets,
  lang = 'en',
  alternateLinks = [],
  localization = null
}) {
  const canonical = new URL(path, site.url).toString();
  const currentLocale = localization?.currentLocale || (String(lang).toLowerCase().startsWith('fr') ? 'fr-CA' : 'en-CA');
  const isFrench = currentLocale === 'fr-CA';
  const basePath = basePathForChrome(path);
  const pathSegments = basePath.split('/').filter(Boolean);
  const pageFamily = pathSegments[0] || 'home';
  const socialImage = image || site.ogImages?.[pageFamily] || site.ogImage;
  const socialImageAlt = imageAlt || `${site.name} — ${title}`;
  const includeOrganization = path === '/' || path === '/company/about/';
  const schemas = [includeOrganization ? organizationSchema(false) : null, breadcrumbSchema(breadcrumbItems), articleSchema(articleMeta, canonical, socialImage, isFrench)].filter(Boolean);
  const alternates = alternateLinks.map(link => `<link rel="alternate" hreflang="${esc(link.hreflang)}" href="${esc(new URL(link.href, site.url).toString())}">`).join('\n  ');
  const translationKey = localization?.translationKey || '';
  const t = value => localText(value, isFrench);
  const href = value => localHref(value, isFrench);

  return `<!doctype html>
<html lang="${esc(lang)}" data-theme="auto">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${noindex ? '<meta name="robots" content="noindex,follow">' : ''}
  <meta name="color-scheme" content="dark light">
  <meta name="theme-color" content="#07100f" media="(prefers-color-scheme: dark)">
  <meta name="theme-color" content="#f1f4f1" media="(prefers-color-scheme: light)">
  <link rel="canonical" href="${esc(canonical)}">
  ${alternates}
  <meta property="og:type" content="${esc(type)}">
  <meta property="og:site_name" content="${esc(site.name)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:image" content="${esc(socialImage)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(socialImageAlt)}">
  ${articleMeta ? `<meta property="article:published_time" content="${esc(articleMeta.date)}"><meta property="article:modified_time" content="${esc(articleMeta.updated)}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(socialImage)}">
  <meta name="twitter:image:alt" content="${esc(socialImageAlt)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="/site.webmanifest">
  <script src="${esc(assets.themeInit)}"></script>
  <link rel="stylesheet" href="${esc(assets.styles)}">
  <script src="${esc(assets.site)}" defer></script>
  <script src="${esc(assets.preferences)}" defer></script>
  <script src="${esc(assets.a11y)}" defer></script>
  <script src="${esc(assets.phase2)}" defer></script>
  <script src="${esc(assets.phase3)}" defer></script>
  ${schemas.map(schema => `<script type="application/ld+json">${safeJson(schema)}</script>`).join('\n  ')}
</head>
<body class="page-${esc(pageFamily)}" data-locale="${esc(currentLocale)}" data-translation-key="${esc(translationKey)}">
  <header class="site-header" data-header>
    <a class="skip-link" href="#main">${esc(t('Skip to content'))}</a>
    <div class="header-inner">
      <a class="brand" href="${esc(href('/'))}" aria-label="${esc(t('Blackpine Cybersecurity home'))}">
        <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2 5 27h5l6-7 6 7h5L16 2Zm0 8 3 7-3-3.3L13 17l3-7Z"/></svg>
        <span>BLACKPINE</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" data-nav-toggle><span>${esc(t('Menu'))}</span></button>
      <nav id="primary-nav" class="primary-nav" aria-label="${esc(t('Primary'))}" data-nav>${primaryNavigation(path, isFrench)}</nav>
      <div class="header-tools">
        <button class="search-trigger" type="button" data-search-open aria-haspopup="dialog"><span>${esc(t('Search'))}</span><kbd>Ctrl/⌘ K</kbd></button>
        ${languageSwitcher(localization, isFrench)}
        <a class="header-contact" href="${esc(href('/contact/'))}">${esc(t('Contact'))}</a>
        <button class="theme-toggle" type="button" data-theme-toggle aria-label="${esc(t('Change colour theme'))}">${esc(t('Theme: Auto'))}</button>
      </div>
    </div>
  </header>
  <div class="search-overlay" data-search-overlay hidden role="dialog" aria-modal="true" aria-labelledby="site-search-title">
    <div class="search-dialog">
      <div class="search-dialog-head"><div><span class="eyebrow">Blackpine</span><h2 id="site-search-title">${esc(t('Search the public site'))}</h2></div><button class="search-close" type="button" data-search-close aria-label="${esc(t('Close search'))}">${esc(t('Close'))}</button></div>
      <label class="sr-only" for="site-search-input">${esc(t('Search Blackpine'))}</label>
      <input id="site-search-input" class="site-search-input" type="search" autocomplete="off" maxlength="120" data-search-input placeholder="${esc(t('Try: CEO account hacked, weird MFA, ransomware, DMARC'))}">
      <div class="search-hint"><span>${esc(t('↑↓ Navigate'))}</span><span>${esc(t('Enter Open'))}</span><span>${esc(t('Esc Close'))}</span><a href="${esc(href('/search/'))}">${esc(t('Full search page'))}</a></div>
      <div class="search-results" data-search-results role="status" aria-live="polite"><p>${esc(t('Type a keyword or phrase to search public Blackpine pages.'))}</p></div>
    </div>
  </div>
  <main id="main">
    ${breadcrumb(breadcrumbItems, currentLocale)}
    ${body}
  </main>
  <footer class="site-footer">
    <div class="footer-top">
      <div class="footer-brand"><span class="footer-mark">BLACKPINE</span><p>${esc(t('Montreal-based Canadian security engineering, incident response, security operations, and technical research.'))}</p><address>${esc(publicCompany.businessAddress)}<br><a href="tel:${esc(publicCompany.phoneHref)}">${esc(publicCompany.phoneDisplay)}</a></address></div>
      <div class="footer-columns">
        <div><h2>${esc(t('Capabilities'))}</h2>${capabilityFamilies.map(family => `<a href="${esc(href(family.path))}">${esc(t(family.name.replace('Blackpine ', '')))}</a>`).join('')}<a href="${esc(href('/services/'))}">${esc(t('All capabilities'))}</a></div>
        <div><h2>${esc(t('Knowledge'))}</h2><a href="${esc(href('/research/'))}">${esc(t('Research'))}</a><a href="${esc(href('/advisories/'))}">${esc(t('Advisories'))}</a><a href="${esc(href('/resources/'))}">${esc(t('Resources'))}</a><a href="${esc(href('/security-baseline/'))}">${esc(t('Security Baseline'))}</a><a href="${esc(href('/tools/'))}">${esc(t('Tools'))}</a></div>
        <div><h2>Blackpine</h2><a href="${esc(href('/company/about/'))}">${esc(t('About'))}</a><a href="${esc(href('/company/team/'))}">${esc(t('Leadership'))}</a><a href="${esc(href('/work/'))}">${esc(t('Work'))}</a><a href="${esc(href('/company/careers/'))}">${esc(t('Careers'))}</a><a href="${esc(href('/contact/'))}">${esc(t('Contact'))}</a></div>
        <div><h2>${esc(t('Trust'))}</h2><a href="${esc(href('/trust/'))}">${esc(t('Trust Center'))}</a><a href="${esc(href('/trust/security-practices/'))}">${esc(t('Security Practices'))}</a><a href="${esc(href('/trust/enterprise-assurance/'))}">${esc(t('Enterprise Assurance'))}</a><a href="${esc(href('/trust/responsible-disclosure/'))}">${esc(t('Responsible Disclosure'))}</a><a href="/.well-known/security.txt">security.txt</a></div>
        <div><h2>${esc(t('Surfaces'))}</h2><a href="https://cipher.blackpinecybersecurity.com" rel="noopener">Cipher ↗</a><a href="${esc(href('/labs/cipher/security-model/'))}">${esc(t('Verification guidance'))}</a><a href="https://support.blackpinecybersecurity.com" rel="noopener">${esc(t('Support ↗'))}</a><a href="${esc(href('/services/emergency-response/'))}">${esc(t('Emergency Response'))}</a></div>
      </div>
    </div>
    <div class="footer-bottom"><span>© ${esc(publicCompany.legalName)}</span><span>${esc(publicCompany.publicLocation)}</span><a href="${esc(href('/legal/company-information/'))}">${esc(t('Company information'))}</a><a href="${esc(href('/legal/privacy/'))}">${esc(t('Privacy'))}</a><a href="${esc(href('/legal/terms/'))}">${esc(t('Terms'))}</a><a href="${esc(href('/legal/acceptable-use/'))}">${esc(t('Acceptable Use'))}</a><a href="${esc(href('/search/'))}">${esc(t('Search'))}</a><button class="footer-preferences" type="button" data-preferences-open>${esc(t('Privacy preferences'))}</button></div>
  </footer>
  ${preferencesDialog(localization, currentLocale, path)}
</body>
</html>`;
}