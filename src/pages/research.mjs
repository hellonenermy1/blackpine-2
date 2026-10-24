import { research, site } from '../data.mjs';
import { pageHero, researchRows } from '../components.mjs';
import { esc, sectionId } from '../lib/html.mjs';

const selectedSlugs = [
  'preserve-evidence-after-suspicious-admin-login',
  'designing-account-recovery-for-privileged-accounts',
  'vendor-access-and-offboarding'
];

const featuredImages = [
  '/assets/editorial/research-patch-panel-square.jpg',
  '/assets/editorial/research-fiber-square.jpg',
  '/assets/editorial/research-workstation-square.jpg'
];

function selectedResearch() {
  return selectedSlugs.map(slug => research.find(item => item.slug === slug)).filter(Boolean);
}

function featuredRows(items) {
  return `<div class="research-featured-grid">${items.map((item, index) => `<a class="research-feature" data-research-card data-type="${esc(item.type)}" data-topic="${esc(item.topic)}" href="/research/${item.slug}/"><span class="research-feature-index">0${index + 1}</span><span class="research-feature-media"><img src="${featuredImages[index] || featuredImages[0]}" alt="" width="900" height="900" loading="lazy" decoding="async" fetchpriority="low"></span><span class="research-meta">${esc(item.type)} / ${esc(item.topic)}</span><strong>${esc(item.title)}</strong><p>${esc(item.dek)}</p><span class="research-feature-link">Read ${esc(item.readTime)} →</span></a>`).join('')}</div>`;
}

export function researchIndexPage() {
  const types = [...new Set(research.map(item => item.type))];
  const topics = [...new Set(research.map(item => item.topic))];
  const selected = selectedResearch();
  const selectedSet = new Set(selected.map(item => item.slug));
  const library = research.filter(item => !selectedSet.has(item.slug));
  const body = pageHero({
    eyebrow: 'Research',
    title: 'Technical notes for security decisions.',
    lead: 'Blackpine Research publishes practical guides and engineering notes on identity, cloud access, incident response, recovery, and administrative control. Sources are linked at article level so the reasoning can be checked. Drafts stay unpublished until their evidence, scope, and limitations are strong enough for public use.'
  }) + `<section class="section research-selected" data-research-featured-section><div class="shell"><div class="section-head"><div class="section-label">Selected</div><div><h2>Start with the control path.</h2><p>Selected notes cover three recurring places where security decisions become operational: privileged activity, account recovery, and persistent third-party access.</p></div></div>${featuredRows(selected.length ? selected : research.slice(0, 3))}</div></section>
  <section class="section"><div class="shell"><div class="section-head research-library-head"><div class="section-label">Library</div><div><h2>Browse the working set.</h2><p>Filter by publication type or topic. Articles are written as operational reference material rather than as a publishing calendar.</p></div></div><div class="filter-bar"><div class="filter-field"><label for="type-filter">Type</label><select id="type-filter" data-filter-type><option value="all">All types</option>${types.map(value => `<option>${esc(value)}</option>`).join('')}</select></div><div class="filter-field"><label for="topic-filter">Topic</label><select id="topic-filter" data-filter-topic><option value="all">All topics</option>${topics.map(value => `<option>${esc(value)}</option>`).join('')}</select></div></div>${researchRows(library)}</div></section>`;

  return {
    title: 'Cybersecurity Research & Technical Guides | Blackpine',
    description: 'Blackpine technical guides and engineering notes on security assessment, identity, cloud access, incident response, and recovery.',
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
  <div class="notice"><strong>Use in context.</strong><p>This is general technical guidance. Apply it to your environment with appropriate authorization, evidence, and incident-specific context.</p></div>
  </div></div></section></article>`;

  return {
    title: `${item.title} | Blackpine Research`,
    description: item.dek,
    type: 'article',
    image: site.ogImages.research,
    imageAlt: `Blackpine Research — ${item.title}`,
    articleMeta: item,
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Research', href: '/research/' }, { label: item.title, href: `/research/${item.slug}/` }],
    body
  };
}
