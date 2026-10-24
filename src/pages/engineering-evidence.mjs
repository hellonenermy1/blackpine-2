import { pageHero } from '../components.mjs';
import { esc, sectionId } from '../lib/html.mjs';

const renderSections = sections => `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>On this page</span>${sections.map(([heading]) => `<a href="#${sectionId(heading)}">${esc(heading)}</a>`).join('')}</aside><article class="prose">${sections.map(([heading, paragraphs = [], bullets = []]) => `<h2 id="${sectionId(heading)}">${esc(heading)}</h2>${paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}${bullets.length ? `<ul>${bullets.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}`).join('')}</article></div></section>`;

export function engineeringEvidencePage() {
  const sections = [
    ['What is inspectable today', [
      'Blackpine publishes selected security tools, research, methodology, sample reporting, advisory standards, and trust documentation on Blackpine-owned web properties. These public artifacts are intended to be inspected directly without exposing internal development-account details.'
    ]],
    ['Privacy boundary', [
      'Internal development locations, account identifiers, private operational material, client evidence, credentials, incident material, recovery information, and private audit evidence are not linked from the corporate website.'
    ]],
    ['Tool publication standard', [
      'A public security utility should document what it checks, what it does not check, whether data leaves the browser, relevant limitations, and the version or release information needed to interpret the result.'
    ]],
    ['Public evidence boundary', [
      'Public website content can demonstrate published methodology, tools, research and documentation. It does not by itself prove that every internal Blackpine control operates effectively; operating-effectiveness claims require separate evidence.'
    ]]
  ];

  const body = pageHero({
    eyebrow: 'Labs / Engineering Evidence',
    title: 'Engineering evidence without exposing internal development details.',
    lead: 'Blackpine publishes inspectable technical material through Blackpine-controlled public surfaces while keeping internal development accounts and operational repositories out of the customer-facing website.',
    meta: '<strong>Public evidence</strong>Blackpine-owned web properties only'
  }) + renderSections(sections) + `<section class="section"><div class="shell"><div class="actions"><a class="button" href="/tools/">Open public tools</a><a class="button secondary" href="/research/">Read research</a></div></div></section>`;

  return {
    title: 'Engineering Evidence | Blackpine Labs',
    description: 'Inspectable Blackpine engineering evidence through Blackpine-owned public tools, research, methodology and documentation without exposing internal development-account details.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Labs', href: '/labs/' }, { label: 'Engineering evidence', href: '/labs/engineering-evidence/' }],
    body
  };
}
