import { research, site } from '../data.mjs';
import { pageHero, researchRows } from '../components.mjs';
import { esc, sectionId } from '../lib/html.mjs';

export function researchIndexPage() {
  const types = [...new Set(research.map(item => item.type))];
  const topics = [...new Set(research.map(item => item.topic))];
  const body = pageHero({
    eyebrow: 'Research',
    title: 'Specific security questions. Useful answers.',
    lead: 'Blackpine Research publishes technical guides and engineering notes where the subject is specific enough to be useful. We do not publish generic cybersecurity content simply to fill a calendar.'
  }) + `<section class="section"><div class="shell"><div class="filter-bar"><div class="filter-field"><label for="type-filter">Type</label><select id="type-filter" data-filter-type><option value="all">All types</option>${types.map(value => `<option>${esc(value)}</option>`).join('')}</select></div><div class="filter-field"><label for="topic-filter">Topic</label><select id="topic-filter" data-filter-topic><option value="all">All topics</option>${topics.map(value => `<option>${esc(value)}</option>`).join('')}</select></div></div>${researchRows(research)}</div></section>`;

  return {
    title: 'Cybersecurity Research & Technical Guides | Blackpine',
    description: 'Blackpine cybersecurity research, engineering notes, incident response guidance, identity security analysis, and practical technical guides.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Research', href: '/research/' }],
    body
  };
}

export function researchPage(item) {
  const onPage = item.sections.map(section => section.heading);
  const body = `<article>${pageHero({
    eyebrow: `${item.type} / ${item.topic}`,
    title: item.title,
    lead: item.dek,
    meta: `<strong>Blackpine Research</strong><time datetime="${esc(item.date)}">${esc(item.date)}</time><br>${esc(item.readTime)} read`
  })}
  <section class="section"><div class="shell content-grid"><aside class="on-page"><span>On this page</span>${onPage.map(title => `<a href="#${sectionId(title)}">${esc(title)}</a>`).join('')}<a href="#sources">Sources</a></aside><div class="prose">
  ${item.sections.map(section => `<h2 id="${sectionId(section.heading)}">${esc(section.heading)}</h2>${(section.paragraphs || []).map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}${section.bullets ? `<ul>${section.bullets.map(bullet => `<li>${esc(bullet)}</li>`).join('')}</ul>` : ''}`).join('')}
  <h2 id="sources">Sources and further reading</h2><ul>${item.sources.map(([label, url]) => `<li><a href="${esc(url)}" rel="noopener">${esc(label)}</a></li>`).join('')}</ul>
  <div class="notice"><strong>Scope note.</strong><p>This publication is general technical information, not incident-specific advice and not a substitute for an authorized investigation of your environment.</p></div>
  </div></div></section></article>`;

  return {
    title: `${item.title} | Blackpine Research`,
    description: item.dek,
    type: 'article',
    image: site.ogImage,
    articleMeta: item,
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Research', href: '/research/' }, { label: item.title, href: `/research/${item.slug}/` }],
    body
  };
}
