import { pageHero } from '../components.mjs';
import { esc } from '../lib/html.mjs';
import { research } from '../data.mjs';
import { clientTestimonials, testimonialEvidenceSnapshots } from '../phase4-client-evidence.mjs';
import { authorityReferenceVerifiedDate, authorityReferences, authorityEvidence, authorityRecognition } from '../authority-data.mjs';

const statusMark = status => `<strong>${esc(status)}</strong>`;

const evidenceItems = authorityEvidence.map(item => `<article class="evidence-snapshot"><span class="eyebrow">${esc(item.id)} / ${statusMark(item.status)}</span><h2>${esc(item.label)}</h2><p>${esc(item.basis)}</p><p><a href="${esc(item.href)}">Inspect this evidence →</a></p></article>`).join('');

const referenceItems = authorityReferences.map(item => `<article class="evidence-snapshot"><span class="eyebrow">${esc(item.id)} / verified ${esc(authorityReferenceVerifiedDate)}</span><h2>${esc(item.name)} ${esc(item.version)}</h2><p><strong>Publisher:</strong> ${esc(item.publisher)}</p><p>${esc(item.use)}</p><p><a href="${esc(item.url)}" rel="noopener">Open authoritative source →</a></p></article>`).join('');

const publicationItems = research.map(item => `<article class="evidence-snapshot"><span class="eyebrow">Published / ${esc(item.type)}</span><h2><a href="/research/${esc(item.slug)}/">${esc(item.title)}</a></h2><p><strong>Evidence basis:</strong> source-backed technical guidance or engineering analysis using ${item.sources.length} listed source${item.sources.length === 1 ? '' : 's'}.</p><p><strong>Publication date:</strong> ${esc(item.date)}. This ledger does not classify the article as original measurement research unless its own method and evidence support that label.</p></article>`).join('');

const recognitionItems = authorityRecognition.map(item => `<article class="evidence-snapshot"><span class="eyebrow">${esc(item.id)} / ${statusMark(item.status)}</span><h2>${esc(item.label)}</h2><p>${esc(item.rule)}</p></article>`).join('');

export function authorityEvidencePage() {
  const body = pageHero({
    eyebrow: 'Research / Authority evidence',
    title: 'What Blackpine can substantiate today — and what it does not claim yet.',
    lead: 'Credibility is stronger when readers can separate inspectable work from future ambitions. This register links current Blackpine evidence, pins important external references to authoritative sources, classifies the published research library, and keeps unearned recognition explicitly open.',
    meta: `<strong>Reference review</strong>${esc(authorityReferenceVerifiedDate)}<br><strong>Published evidence classes</strong>${authorityEvidence.length}<br><strong>Open recognition classes</strong>${authorityRecognition.length}`
  }) + `<section class="section"><div class="shell"><div class="section-head"><div class="section-label">Inspectable now</div><div><h2>Evidence that exists on the public site.</h2><p>These entries are not badges. Each one links to material a reader can inspect directly and judge on its own merits.</p></div></div>${evidenceItems}</div></section>
  <section class="section"><div class="shell"><div class="section-head"><div class="section-label">Reference register</div><div><h2>Named frameworks are tied to current primary sources.</h2><p>Blackpine uses frameworks as reference structures where relevant to scope. Listing a framework here does not mean Blackpine or a client is certified against it. Versions below were checked against the authoritative publisher on ${esc(authorityReferenceVerifiedDate)}.</p></div></div>${referenceItems}<div class="notice"><strong>Version discipline.</strong><p>If an authoritative publisher releases a new version, Blackpine must review the change before updating methodology or mapping language. A version number is not changed merely because a search result or secondary article says it changed.</p></div></div></section>
  <section class="section"><div class="shell"><div class="section-head"><div class="section-label">Publication ledger</div><div><h2>${research.length} current research publications, classified by their actual evidence basis.</h2><p>The current library is useful technical guidance and engineering analysis. It is not relabelled as an “original research portfolio” simply to sound more authoritative.</p></div></div>${publicationItems}</div></section>
  <section class="section"><div class="shell"><div class="section-head"><div class="section-label">Earned recognition</div><div><h2>Open means not claimed.</h2><p>These credibility signals may become publishable later, but only after a qualifying external or client-approved record exists.</p></div></div>${recognitionItems}<div class="notice"><strong>No badge stacking.</strong><p>Blackpine does not turn planned research, submitted vulnerability reports, conference applications, ordinary vendor usage, draft articles, or incomplete client narratives into public recognition claims.</p></div></div></section>`;

  return {
    title: 'Authority & Evidence Register | Blackpine Cybersecurity',
    description: 'Inspectable Blackpine authority evidence, current framework source register, research publication ledger, and evidence-gated recognition status.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Research', href: '/research/' }, { label: 'Authority & evidence', href: '/research/evidence/' }],
    body,
    searchTerms: ['authority evidence framework source register research publications CVE vendor acknowledgement case study']
  };
}

export function caseStudyStandardPage() {
  const gate = [
    ['Publication basis', 'Document client permission or another clear publication basis. Confidentiality restrictions override marketing value.'],
    ['Safe organization description', 'Use only the sector, organization description, geography and scale details approved for public use.'],
    ['Problem', 'State the actual business or security problem without inventing urgency, breach status or financial impact.'],
    ['Scope', 'Identify what was actually assessed or delivered and what was outside the engagement.'],
    ['Material evidence', 'Use only findings, observations or evidence the client has approved for publication.'],
    ['Action taken', 'Describe remediation or decisions that actually occurred; recommendations alone are not outcomes.'],
    ['Result', 'Publish only outcomes supported by evidence. Do not convert qualitative feedback into percentages, ROI or risk-reduction figures.'],
    ['Final review', 'Record the reviewer, approval date, confidentiality check and source evidence before release.']
  ];
  const gateHtml = gate.map(([title, text], index) => `<article class="evidence-snapshot"><span class="eyebrow">Gate ${String(index + 1).padStart(2, '0')}</span><h2>${esc(title)}</h2><p>${esc(text)}</p></article>`).join('');
  const body = pageHero({
    eyebrow: 'Work / Case-study standard',
    title: 'A testimonial is not silently upgraded into a case study.',
    lead: 'Blackpine publishes a full client case study only when the evidence packet supports the problem, scope, material observations, action taken and result. Missing details are left missing rather than filled with plausible cybersecurity language.',
    meta: `<strong>Current testimonials</strong>${clientTestimonials.length}<br><strong>Evidence snapshots</strong>${testimonialEvidenceSnapshots.length}<br><strong>Full client case studies supported by current supplied evidence</strong>0`
  }) + `<section class="section"><div class="shell"><div class="notice"><strong>Current boundary.</strong><p>The supplied client material supports ${clientTestimonials.length} testimonials and ${testimonialEvidenceSnapshots.length} bounded outcome snapshots. It does not contain enough approved scope, findings, remediation and outcome detail to publish a full anonymized client case study without inventing facts.</p></div><div class="section-head"><div class="section-label">Release gate</div><div><h2>Every full case study must pass all eight gates.</h2><p>A named case study additionally requires explicit permission to identify the client organization and any quoted people.</p></div></div>${gateHtml}<div class="actions"><a class="button" href="/work/client-evidence/">Inspect current client evidence</a><a class="button secondary" href="/work/testimonials/">Read testimonials</a></div></div></section>
  <section class="section"><div class="shell content-grid"><aside class="on-page"><span>Boundaries</span><a href="#never-infer">Never infer</a><a href="#quantification">Quantification</a><a href="#confidentiality">Confidentiality</a><a href="#withdrawal">Corrections</a></aside><article class="prose"><h2 id="never-infer">Never infer missing engagement facts</h2><p>Blackpine does not infer client size, architecture, project value, location, incident status, findings, tools used, remediation completion, time saved or business outcome from a testimonial.</p><h2 id="quantification">Quantification requires measurement evidence</h2><p>Statements such as “reduced risk by 70%,” “saved 40 hours,” “cut costs by 30%,” or “prevented a breach” require a defensible measurement basis and client approval. Positive feedback alone is not that basis.</p><h2 id="confidentiality">Confidentiality survives publication</h2><p>A client may approve a testimonial while still requiring its company name, systems, findings or engagement details to remain confidential. Public material must preserve that boundary.</p><h2 id="withdrawal">Corrections and withdrawal</h2><p>If approved client material becomes inaccurate, loses its publication basis, or a client requests an appropriate correction or withdrawal, Blackpine should update the public record rather than preserve stale credibility evidence.</p></article></div></section>`;

  return {
    title: 'Client Case Study Publication Standard | Blackpine',
    description: 'Blackpine case-study release gate for client permission, scope, findings, remediation, outcomes, confidentiality and evidence-backed quantification.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Work', href: '/work/' }, { label: 'Case-study standard', href: '/work/case-study-standard/' }],
    body,
    searchTerms: ['case study publication evidence client approval scope findings outcomes confidentiality']
  };
}
