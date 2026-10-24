import { pageHero } from '../components.mjs';
import { site } from '../data.mjs';
import { publicCompany } from '../public-company.mjs';
import { esc, sectionId } from '../lib/html.mjs';
import { websiteTerms, privacyPolicy } from '../legal-documents.mjs';
import { websiteTermsFr, privacyPolicyFr } from '../legal-documents-fr.mjs';

const clauseHtml = clause => {
  const separator = clause.text.indexOf('. ');
  const label = separator === -1 ? clause.text : clause.text.slice(0, separator + 1);
  const body = separator === -1 ? '' : clause.text.slice(separator + 2);
  return `<p id="clause-${clause.number}"><strong>${clause.number}. ${esc(label)}</strong>${body ? ` ${esc(body)}` : ''}</p>`;
};

const languageSwitch = ({ current, englishHref, frenchHref }) => {
  const frenchCurrent = current === 'fr';
  const english = frenchCurrent
    ? `<a href="${esc(englishHref)}" hreflang="en-CA" lang="en">English</a>`
    : '<span aria-current="page" lang="en">English</span>';
  const french = frenchCurrent
    ? '<span aria-current="page" lang="fr">Français</span>'
    : `<a href="${esc(frenchHref)}" hreflang="fr-CA" lang="fr">Français</a>`;
  return `<section class="section compact" aria-labelledby="legal-language"><div class="shell"><div class="notice"><strong id="legal-language">${frenchCurrent ? 'Langue' : 'Language / Langue'}</strong><p>${english} · ${french}</p></div></div></section>`;
};

const renderLegalDocument = (document, slug, labels = {}) => {
  const onThisPage = labels.onThisPage || 'On this page';
  const effectiveDate = labels.effectiveDate || 'Effective Date';
  const lastUpdated = labels.lastUpdated || 'Last Updated';
  const nav = document.sections.map(section => `<a href="#${slug}-${sectionId(section.letter)}">${esc(section.letter)}. ${esc(section.heading)}</a>`).join('');
  const sections = document.sections.map(section => `<section class="legal-section" aria-labelledby="${slug}-${sectionId(section.letter)}"><h2 id="${slug}-${sectionId(section.letter)}">${esc(section.letter)}. ${esc(section.heading)}</h2>${section.clauses.map(clauseHtml).join('')}</section>`).join('');
  return `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>${esc(onThisPage)}</span>${nav}</aside><article class="prose legal-document"><div class="notice legal-meta"><strong>${esc(effectiveDate)} : ${esc(document.effectiveDate)}</strong><p>${esc(lastUpdated)} : ${esc(document.lastUpdated)}</p></div><p>${esc(document.intro)}</p>${sections}</article></div></section>`;
};

const privacyOfficerContact = `<section class="section compact" aria-labelledby="privacy-officer-contact"><div class="shell"><div class="notice"><strong id="privacy-officer-contact">Privacy Officer / Person in Charge of the Protection of Personal Information</strong><p>Privacy questions, complaints and rights requests may be directed to this role at <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> or <a href="tel:${esc(publicCompany.phoneHref)}">${esc(publicCompany.phoneDisplay)}</a>, Blackpine Cybersecurity Inc., ${esc(publicCompany.businessAddress)}. The general <a href="/contact/">Contact page</a> remains available for other inquiries.</p></div></div></section>`;

const privacyOfficerContactFr = `<section class="section compact" aria-labelledby="privacy-officer-contact-fr"><div class="shell"><div class="notice"><strong id="privacy-officer-contact-fr">Responsable de la protection des renseignements personnels / personne chargée de la protection des renseignements personnels</strong><p>Les questions, plaintes et demandes d’exercice de droits en matière de confidentialité peuvent être adressées à cette fonction à <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> ou au <a href="tel:${esc(publicCompany.phoneHref)}">${esc(publicCompany.phoneDisplay)}</a>, Blackpine Cybersecurity Inc., ${esc(publicCompany.businessAddress)}. La <a href="/contact/">page de contact</a> générale demeure disponible pour les autres demandes.</p></div></div></section>`;

const legalAlternates = (englishHref, frenchHref) => [
  { hreflang: 'en-CA', href: englishHref },
  { hreflang: 'fr-CA', href: frenchHref },
  { hreflang: 'x-default', href: englishHref }
];

export function privacyPage() {
  const englishHref = '/legal/privacy/';
  const frenchHref = '/fr/legal/privacy/';
  const body = pageHero({
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    lead: privacyPolicy.intro,
    meta: `<strong>Effective Date</strong>${esc(privacyPolicy.effectiveDate)}<br><strong>Last Updated</strong>${esc(privacyPolicy.lastUpdated)}`
  }) + languageSwitch({ current: 'en', englishHref, frenchHref }) + privacyOfficerContact + renderLegalDocument(privacyPolicy, 'privacy');

  return {
    title: 'Privacy Policy | Blackpine Cybersecurity',
    description: 'Blackpine Cybersecurity Inc. privacy policy covering the corporate website, business operations, inquiries, professional relationships and authorized cybersecurity activities.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Privacy Policy', href: englishHref }],
    body,
    searchTerms: 'privacy policy Quebec personal information Privacy Officer CASL cross-border security safeguards retention individual rights',
    searchTextLimit: 2000,
    lang: 'en-CA',
    alternateLinks: legalAlternates(englishHref, frenchHref)
  };
}

export function termsPage() {
  const englishHref = '/legal/terms/';
  const frenchHref = '/fr/legal/terms/';
  const body = pageHero({
    eyebrow: 'Legal',
    title: 'Website Terms and Conditions',
    lead: websiteTerms.intro,
    meta: `<strong>Effective Date</strong>${esc(websiteTerms.effectiveDate)}<br><strong>Last Updated</strong>${esc(websiteTerms.lastUpdated)}`
  }) + languageSwitch({ current: 'en', englishHref, frenchHref }) + renderLegalDocument(websiteTerms, 'terms');

  return {
    title: 'Website Terms and Conditions | Blackpine Cybersecurity',
    description: 'Website Terms and Conditions governing access to and use of Blackpine Cybersecurity Inc.’s public corporate website and associated public materials.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Website Terms and Conditions', href: englishHref }],
    body,
    searchTerms: 'website terms conditions Quebec cybersecurity services authorization liability responsible security research acceptable use',
    searchTextLimit: 2000,
    lang: 'en-CA',
    alternateLinks: legalAlternates(englishHref, frenchHref)
  };
}

export function privacyPageFr() {
  const englishHref = '/legal/privacy/';
  const frenchHref = '/fr/legal/privacy/';
  const body = pageHero({
    eyebrow: 'Juridique',
    title: 'Politique de confidentialité',
    lead: privacyPolicyFr.intro,
    meta: `<strong>Date d’entrée en vigueur</strong>${esc(privacyPolicyFr.effectiveDate)}<br><strong>Dernière mise à jour</strong>${esc(privacyPolicyFr.lastUpdated)}`
  }) + languageSwitch({ current: 'fr', englishHref, frenchHref }) + privacyOfficerContactFr + renderLegalDocument(privacyPolicyFr, 'confidentialite', {
    onThisPage: 'Sur cette page',
    effectiveDate: 'Date d’entrée en vigueur',
    lastUpdated: 'Dernière mise à jour'
  });

  return {
    title: 'Politique de confidentialité | Blackpine Cybersecurity',
    description: 'Politique de confidentialité de Blackpine Cybersecurity Inc. concernant le site Web institutionnel, les activités commerciales, les demandes, les relations professionnelles et les activités de cybersécurité autorisées.',
    breadcrumbItems: [{ label: 'Accueil', href: '/' }, { label: 'Politique de confidentialité', href: frenchHref }],
    body,
    searchTerms: 'politique confidentialité Québec renseignements personnels Responsable LCAP traitement transfrontalier sécurité conservation droits',
    searchTextLimit: 2000,
    lang: 'fr-CA',
    alternateLinks: legalAlternates(englishHref, frenchHref)
  };
}

export function termsPageFr() {
  const englishHref = '/legal/terms/';
  const frenchHref = '/fr/legal/terms/';
  const body = pageHero({
    eyebrow: 'Juridique',
    title: 'Conditions générales du site Web',
    lead: websiteTermsFr.intro,
    meta: `<strong>Date d’entrée en vigueur</strong>${esc(websiteTermsFr.effectiveDate)}<br><strong>Dernière mise à jour</strong>${esc(websiteTermsFr.lastUpdated)}`
  }) + languageSwitch({ current: 'fr', englishHref, frenchHref }) + renderLegalDocument(websiteTermsFr, 'conditions', {
    onThisPage: 'Sur cette page',
    effectiveDate: 'Date d’entrée en vigueur',
    lastUpdated: 'Dernière mise à jour'
  });

  return {
    title: 'Conditions générales du site Web | Blackpine Cybersecurity',
    description: 'Conditions générales régissant l’accès au site Web institutionnel public de Blackpine Cybersecurity Inc., son utilisation et les documents publics connexes.',
    breadcrumbItems: [{ label: 'Accueil', href: '/' }, { label: 'Conditions générales du site Web', href: frenchHref }],
    body,
    searchTerms: 'conditions générales site Web Québec cybersécurité services autorisation responsabilité recherche sécurité utilisation acceptable',
    searchTextLimit: 2000,
    lang: 'fr-CA',
    alternateLinks: legalAlternates(englishHref, frenchHref)
  };
}
