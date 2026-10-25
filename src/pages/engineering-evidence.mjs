import { pageHero } from '../components.mjs';
import { esc, sectionId } from '../lib/html.mjs';

const renderSections = sections => `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>On this page</span>${sections.map(([heading]) => `<a href="#${sectionId(heading)}">${esc(heading)}</a>`).join('')}</aside><article class="prose">${sections.map(([heading, paragraphs = [], bullets = []]) => `<h2 id="${sectionId(heading)}">${esc(heading)}</h2>${paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}${bullets.length ? `<ul>${bullets.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}`).join('')}</article></div></section>`;

export function engineeringEvidencePage() {
  const sections = [
    ['What you can inspect', [
      'Blackpine publishes selected security tools, research, methodology, sample reporting, advisory standards, and trust documentation on Blackpine-owned web properties.'
    ]],
    ['What stays private', [
      'Client evidence, credentials, incident material, recovery information, private audit evidence, and other sensitive operational records are not published on the corporate website.'
    ]],
    ['Tool publication standard', [
      'A public security utility should document what it checks, what it does not check, whether data leaves the browser, relevant limitations, and the version or release information needed to interpret the result.'
    ]],
    ['Limits of public evidence', [
      'Published tools and documentation can demonstrate specific methods and technical work. They do not by themselves prove that every internal control operates effectively; claims about operating effectiveness require separate evidence.'
    ]]
  ];

  const body = pageHero({
    eyebrow: 'Labs / Engineering evidence',
    title: 'Technical work you can inspect.',
    lead: 'Blackpine publishes selected tools, research, methodology and technical documentation so customers and security reviewers can examine the work directly.',
    meta: '<strong>Published evidence</strong>Tools, research, methodology and documentation'
  }) + renderSections(sections) + `<section class="section"><div class="shell"><div class="actions"><a class="button" href="/tools/">Open public tools</a><a class="button secondary" href="/research/">Read research</a></div></div></section>`;

  return {
    title: 'Engineering Evidence | Blackpine Labs',
    description: 'Inspectable Blackpine engineering evidence through public tools, research, methodology and technical documentation.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Labs', href: '/labs/' }, { label: 'Engineering evidence', href: '/labs/engineering-evidence/' }],
    body
  };
}
