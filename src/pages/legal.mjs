import { pageHero } from '../components.mjs';
import { site } from '../data.mjs';
import { publicCompany } from '../public-company.mjs';
import { esc, sectionId } from '../lib/html.mjs';
import { websiteTerms, privacyPolicy } from '../legal-documents.mjs';

const clauseHtml = clause => {
  const separator = clause.text.indexOf('. ');
  const label = separator === -1 ? clause.text : clause.text.slice(0, separator + 1);
  const body = separator === -1 ? '' : clause.text.slice(separator + 2);
  return `<p id="clause-${clause.number}"><strong>${clause.number}. ${esc(label)}</strong>${body ? ` ${esc(body)}` : ''}</p>`;
};

const renderLegalDocument = (document, slug) => {
  const nav = document.sections.map(section => `<a href="#${slug}-${sectionId(section.letter)}">${esc(section.letter)}. ${esc(section.heading)}</a>`).join('');
  const sections = document.sections.map(section => `<section class="legal-section" aria-labelledby="${slug}-${sectionId(section.letter)}"><h2 id="${slug}-${sectionId(section.letter)}">${esc(section.letter)}. ${esc(section.heading)}</h2>${section.clauses.map(clauseHtml).join('')}</section>`).join('');
  return `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>On this page</span>${nav}</aside><article class="prose legal-document"><div class="notice legal-meta"><strong>Effective Date: ${esc(document.effectiveDate)}</strong><p>Last Updated: ${esc(document.lastUpdated)}</p></div><p>${esc(document.intro)}</p>${sections}</article></div></section>`;
};

const privacyOfficerContact = `<section class="section compact" aria-labelledby="privacy-officer-contact"><div class="shell"><div class="notice"><strong id="privacy-officer-contact">Privacy Officer / Person in Charge of the Protection of Personal Information</strong><p>Privacy questions, complaints and rights requests may be directed to this role at <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> or <a href="tel:${esc(publicCompany.phoneHref)}">${esc(publicCompany.phoneDisplay)}</a>, Blackpine Cybersecurity Inc., ${esc(publicCompany.businessAddress)}. The general <a href="/contact/">Contact page</a> remains available for other inquiries.</p></div></div></section>`;

export function privacyPage() {
  const body = pageHero({
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    lead: privacyPolicy.intro,
    meta: `<strong>Effective Date</strong>${esc(privacyPolicy.effectiveDate)}<br><strong>Last Updated</strong>${esc(privacyPolicy.lastUpdated)}`
  }) + privacyOfficerContact + renderLegalDocument(privacyPolicy, 'privacy');

  return {
    title: 'Privacy Policy | Blackpine Cybersecurity',
    description: 'Blackpine Cybersecurity Inc. privacy policy covering the corporate website, business operations, inquiries, professional relationships and authorized cybersecurity activities.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Privacy Policy', href: '/legal/privacy/' }],
    body,
    searchTerms: 'privacy policy Quebec personal information Privacy Officer CASL cross-border security safeguards retention individual rights'
  };
}

export function termsPage() {
  const body = pageHero({
    eyebrow: 'Legal',
    title: 'Website Terms and Conditions',
    lead: websiteTerms.intro,
    meta: `<strong>Effective Date</strong>${esc(websiteTerms.effectiveDate)}<br><strong>Last Updated</strong>${esc(websiteTerms.lastUpdated)}`
  }) + renderLegalDocument(websiteTerms, 'terms');

  return {
    title: 'Website Terms and Conditions | Blackpine Cybersecurity',
    description: 'Website Terms and Conditions governing access to and use of Blackpine Cybersecurity Inc.’s public corporate website and associated public materials.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Website Terms and Conditions', href: '/legal/terms/' }],
    body,
    searchTerms: 'website terms conditions Quebec cybersecurity services authorization liability responsible security research acceptable use'
  };
}
