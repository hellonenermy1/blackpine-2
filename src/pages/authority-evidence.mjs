import { pageHero } from '../components.mjs';
import { esc } from '../lib/html.mjs';
import { research } from '../data.mjs';
import { clientTestimonials, testimonialEvidenceSnapshots } from '../phase4-client-evidence.mjs';
import { authorityReferenceVerifiedDate, authorityReferences, authorityEvidence } from '../authority-data.mjs';

const evidenceItems = authorityEvidence.map(item => `<article class="evidence-snapshot"><h2>${esc(item.label)}</h2><p>${esc(item.basis)}</p><p><a href="${esc(item.href)}">Inspect this evidence →</a></p></article>`).join('');

const referenceItems = authorityReferences.map(item => `<article class="evidence-snapshot"><span class="eyebrow">Reviewed ${esc(authorityReferenceVerifiedDate)}</span><h2>${esc(item.name)} ${esc(item.version)}</h2><p><strong>Publisher:</strong> ${esc(item.publisher)}</p><p>${esc(item.use)}</p><p><a href="${esc(item.url)}" rel="noopener">Open authoritative source →</a></p></article>`).join('');

const publicationItems = research.map(item => `<article class="evidence-snapshot"><span class="eyebrow">${esc(item.type)}</span><h2><a href="/research/${esc(item.slug)}/">${esc(item.title)}</a></h2><p>Source-backed technical guidance or engineering analysis using ${item.sources.length} listed source${item.sources.length === 1 ? '' : 's'}.</p><p><strong>Published:</strong> ${esc(item.date)}</p></article>`).join('');

export function authorityEvidencePage() {
  const body = pageHero({
    eyebrow: 'Research / Evidence',
    title: 'Public evidence and source references.',
    lead: 'This page brings together Blackpine material that can be inspected directly, along with the primary sources used for important framework references and technical guidance.',
    meta: `<strong>References reviewed</strong>${esc(authorityReferenceVerifiedDate)}<br><strong>Public evidence categories</strong>${authorityEvidence.length}`
  }) + `<section class="section"><div class="shell"><div class="section-head"><div class="section-label">Blackpine evidence</div><div><h2>Material you can inspect directly.</h2><p>Each entry links to published work, methodology, reporting or documentation that can be reviewed on its own merits.</p></div></div>${evidenceItems}</div></section>
  <section class="section"><div class="shell"><div class="section-head"><div class="section-label">Primary sources</div><div><h2>Framework references are tied to authoritative publishers.</h2><p>Blackpine uses frameworks as reference structures where relevant to scope. Listing a framework here does not mean Blackpine or a client is certified against it.</p></div></div>${referenceItems}<div class="notice"><strong>Keeping references current.</strong><p>When a publisher issues a new edition or revision, Blackpine reviews the change before updating related methodology or mapping language.</p></div></div></section>
  <section class="section"><div class="shell"><div class="section-head"><div class="section-label">Research library</div><div><h2>${research.length} current research publications.</h2><p>The library contains technical guidance and engineering analysis. Each publication lists the sources used to support its content.</p></div></div>${publicationItems}</div></section>
  <section class="section compact"><div class="shell callout"><div><h2>Independent recognition is stated only when it can be verified.</h2><p>Certifications, awards, vulnerability acknowledgements, partnerships and similar third-party recognition are published only when there is a current, verifiable basis for the exact claim.</p></div><a class="button secondary" href="/trust/enterprise-assurance/">Enterprise assurance</a></div></section>`;

  return {
    title: 'Authority & Evidence | Blackpine Cybersecurity',
    description: 'Inspectable Blackpine evidence, authoritative framework references, and source-backed research publications.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Research', href: '/research/' }, { label: 'Authority & evidence', href: '/research/evidence/' }],
    body,
    searchTerms: ['authority evidence framework source register research publications verification']
  };
}

export function caseStudyStandardPage() {
  const criteria = [
    ['Publication basis', 'Document client permission or another clear publication basis. Confidentiality restrictions override marketing value.'],
    ['Safe organization description', 'Use only the sector, organization description, geography and scale details approved for public use.'],
    ['Problem', 'State the actual business or security problem without inventing urgency, breach status or financial impact.'],
    ['Scope', 'Identify what was actually assessed or delivered and what was outside the engagement.'],
    ['Material evidence', 'Use only findings, observations or evidence the client has approved for publication.'],
    ['Action taken', 'Describe remediation or decisions that actually occurred; recommendations alone are not outcomes.'],
    ['Result', 'Publish only outcomes supported by evidence. Do not convert qualitative feedback into percentages, ROI or risk-reduction figures.'],
    ['Final review', 'Record the reviewer, approval date, confidentiality check and source evidence before release.']
  ];
  const criteriaHtml = criteria.map(([title, text], index) => `<article class="evidence-snapshot"><span class="eyebrow">Requirement ${String(index + 1).padStart(2, '0')}</span><h2>${esc(title)}</h2><p>${esc(text)}</p></article>`).join('');
  const body = pageHero({
    eyebrow: 'Work / Case studies',
    title: 'How Blackpine publishes client case studies.',
    lead: 'A full case study is published only when approved evidence supports the problem, scope, material observations, actions taken and result. Missing engagement details are not inferred from a testimonial.',
    meta: `<strong>Current testimonials</strong>${clientTestimonials.length}<br><strong>Evidence snapshots</strong>${testimonialEvidenceSnapshots.length}`
  }) + `<section class="section"><div class="shell"><div class="notice"><strong>Current material.</strong><p>The client material currently approved for publication supports ${clientTestimonials.length} testimonials and ${testimonialEvidenceSnapshots.length} bounded outcome snapshots. It does not contain enough approved engagement detail for a full client case study.</p></div><div class="section-head"><div class="section-label">Publication criteria</div><div><h2>What a full case study must establish.</h2><p>A named case study also requires explicit permission to identify the client organization and any quoted people.</p></div></div>${criteriaHtml}<div class="actions"><a class="button" href="/work/client-evidence/">Inspect current client evidence</a><a class="button secondary" href="/work/testimonials/">Read testimonials</a></div></div></section>
  <section class="section"><div class="shell content-grid"><aside class="on-page"><span>Boundaries</span><a href="#never-infer">Never infer</a><a href="#quantification">Quantification</a><a href="#confidentiality">Confidentiality</a><a href="#withdrawal">Corrections</a></aside><article class="prose"><h2 id="never-infer">Never infer missing engagement facts</h2><p>Blackpine does not infer client size, architecture, project value, location, incident status, findings, tools used, remediation completion, time saved or business outcome from a testimonial.</p><h2 id="quantification">Quantification requires measurement evidence</h2><p>Statements such as “reduced risk by 70%,” “saved 40 hours,” “cut costs by 30%,” or “prevented a breach” require a defensible measurement basis and client approval. Positive feedback alone is not that basis.</p><h2 id="confidentiality">Confidentiality survives publication</h2><p>A client may approve a testimonial while still requiring its company name, systems, findings or engagement details to remain confidential. Public material must preserve that boundary.</p><h2 id="withdrawal">Corrections and withdrawal</h2><p>If approved client material becomes inaccurate, loses its publication basis, or a client requests an appropriate correction or withdrawal, Blackpine should update the public record rather than preserve stale credibility evidence.</p></article></div></section>`;

  return {
    title: 'Client Case Study Publication Standard | Blackpine',
    description: 'How Blackpine verifies client permission, scope, findings, remediation, outcomes, confidentiality and evidence-backed quantification before publishing a case study.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Work', href: '/work/' }, { label: 'Case-study standard', href: '/work/case-study-standard/' }],
    body,
    searchTerms: ['case study publication evidence client approval scope findings outcomes confidentiality']
  };
}
