import { pageHero } from '../components.mjs';
import { publicCompany } from '../public-company.mjs';
import { esc } from '../lib/html.mjs';
import { clientTestimonials, testimonialEvidenceSnapshots } from '../phase4-client-evidence.mjs';

const renderTestimonial = item => {
  const identity = item.publishName
    ? `<strong>${esc(item.name)}</strong><span>${esc(item.title)} · ${esc(item.organization)}</span>`
    : `<strong>Client name withheld on site</strong><span>${esc(item.title)} · ${esc(item.organization)}</span>`;
  return `<blockquote class="client-quote" id="${esc(item.id.toLowerCase())}"><p>“${esc(item.quote)}”</p><footer>${identity}</footer></blockquote>`;
};

export function testimonialsPage() {
  const body = pageHero({
    eyebrow: 'Work / Client feedback',
    title: 'Client feedback, with company names withheld for confidentiality.',
    lead: 'These testimonials were supplied to Blackpine as client feedback. The client company names are intentionally not published because the clients requested that their organizations remain confidential.',
    meta: `<strong>Published set</strong>${clientTestimonials.length} testimonials<br><strong>Company-name policy</strong>Withheld at client request`
  }) + `<section class="section"><div class="shell"><div class="notice"><strong>Attribution boundary.</strong><p>Blackpine does not publish client company names, logos, project values, or quantified outcomes unless there is a separate basis to publish them. One individual name is also withheld on this site because it collides with the name of an existing Blackpine team member; Blackpine is not assuming whether those are the same or different people.</p></div><div class="testimonial-grid">${clientTestimonials.map(renderTestimonial).join('')}</div></div></section>`;
  return {
    title: 'Client Testimonials | Blackpine Cybersecurity',
    description: 'Client feedback about Blackpine cybersecurity assessments and advisory work, with company names withheld for confidentiality.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Work', href: '/work/' }, { label: 'Client feedback', href: '/work/testimonials/' }],
    body,
    searchTerms: ['client testimonials feedback cybersecurity assessment Microsoft 365 prioritization remediation']
  };
}

export function clientEvidencePage() {
  const snapshots = testimonialEvidenceSnapshots.map(item => {
    const source = clientTestimonials.find(testimonial => testimonial.id === item.sourceTestimonialId);
    return `<article class="evidence-snapshot"><span class="eyebrow">${esc(item.id)} / Testimonial-derived</span><h2>${esc(item.title)}</h2><p>${esc(item.summary)}</p><p><strong>Evidence boundary:</strong> ${esc(item.boundary)}</p>${source ? `<p><strong>Source:</strong> ${source.publishName ? esc(source.name) : 'Client name withheld on site'}, ${esc(source.title)} · ${esc(source.organization)} (<a href="/work/testimonials/#${esc(source.id.toLowerCase())}">${esc(source.id)}</a>)</p>` : ''}</article>`;
  }).join('');
  const body = pageHero({
    eyebrow: 'Work / Client evidence',
    title: 'What can be shown from the client feedback we actually have.',
    lead: 'Blackpine separates testimonial-supported outcomes from full case studies. These snapshots use only facts stated in supplied client feedback and deliberately avoid invented environment details, percentages, timelines, savings, or technical findings.',
    meta: `<strong>Evidence snapshots</strong>${testimonialEvidenceSnapshots.length}<br><strong>Full case studies</strong>Not published without client-approved scope`
  }) + `<section class="section"><div class="shell"><div class="notice"><strong>Why these are not called full case studies.</strong><p>A defensible case study needs approved facts about the problem, scope, environment, findings, remediation, and result. The current testimonial set supports useful outcome snapshots, but not enough detail to invent those missing elements.</p></div>${snapshots}<div class="actions"><a class="button" href="/work/testimonials/">Read all testimonials</a><a class="button secondary" href="/reports/sample-security-assessment/">Review fictional sample report</a></div></div></section>`;
  return {
    title: 'Client Evidence & Outcomes | Blackpine Cybersecurity',
    description: 'Testimonial-supported Blackpine client outcome snapshots with explicit evidence boundaries and no invented metrics.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Work', href: '/work/' }, { label: 'Client evidence', href: '/work/client-evidence/' }],
    body
  };
}

export function externalReputationPage() {
  const body = pageHero({
    eyebrow: 'Company / External verification',
    title: 'Check Blackpine outside Blackpine.',
    lead: 'The useful test of a company claim is whether something independent can corroborate it. Blackpine links only to third-party records that have been checked and does not fill this page with badges or profiles that have not been verified.',
    meta: '<strong>Verified external anchor</strong>Google Business Profile'
  }) + `<section class="section"><div class="shell content-grid"><aside class="on-page"><span>External verification</span><a href="#business-profile">Google profile</a><a href="#reviews">Reviews</a><a href="#other-profiles">Other profiles</a><a href="#partners">Partnerships</a><a href="#research">Technical recognition</a><a href="#standard">Standard</a></aside><article class="prose"><h2 id="business-profile">Google Business Profile</h2><p>${esc(publicCompany.businessProfileStatus)} The listing matches the public business contact used on this site:</p><address><strong>${esc(publicCompany.legalName)}</strong><br>${esc(publicCompany.businessAddress)}<br><a href="tel:${esc(publicCompany.phoneHref)}">${esc(publicCompany.phoneDisplay)}</a></address><div class="actions"><a class="button" href="${esc(publicCompany.googleBusinessUrl)}" rel="noopener">View Blackpine on Google ↗</a></div><p>The live Google listing is the source of truth for fields that change frequently, including rating, review count, and opening hours. Blackpine does not present those values here as permanent claims.</p><h2 id="reviews">Independent reviews</h2><p>Clients who have genuinely worked with Blackpine may leave a public review if they choose. Reviews are voluntary. Blackpine does not buy reviews, require a positive rating, provide a pre-written review to post as the client's own, or ask reviewers to disclose confidential engagement details.</p><p>Blackpine has a Google review presence. Review depth is still developing, so the site does not use star-rating graphics or a review-count headline to make the record look larger than it is.</p><h2 id="other-profiles">Other company profiles</h2><p>No Blackpine LinkedIn company profile or Clutch company profile is linked from this page in this phase because no such profile has been independently verified and approved for publication. When a genuine profile exists, it can be added after its identity and company details are checked.</p><h2 id="partners">Technology and channel partnerships</h2><p>Vendor logos or partner language require a genuine current relationship and permission to use the relevant mark. Using a vendor's product, cloud platform, or documentation does not make Blackpine a partner.</p><h2 id="research">Technical recognition</h2><p>CVEs, vendor acknowledgements, conference appearances, external publications, interviews, and hall-of-fame listings are published only when the external source exists and clearly identifies Blackpine or the relevant Blackpine researcher.</p><h2 id="standard">How an external claim gets published</h2><ul><li>Check the third-party source directly.</li><li>Confirm the record clearly belongs to Blackpine or the named Blackpine researcher.</li><li>Check that names, location, and other company details agree with the approved company record.</li><li>Confirm any logo or badge may actually be displayed.</li><li>Keep changing fields such as review counts current or leave them at the source.</li><li>Remove or correct a claim when the external record changes.</li></ul><div class="notice"><strong>Current boundary.</strong><p>Google Business is the current verified third-party company profile linked here. Blackpine does not claim a Clutch profile, LinkedIn company profile, vendor partnership, certification, CVE, media feature, conference appearance, or similar third-party status unless a separately verified record supports it.</p></div></article></div></section>`;
  return {
    title: 'External Verification & Reputation | Blackpine Cybersecurity',
    description: 'Independent verification information for Blackpine Cybersecurity, including its current Google Business Profile, review standards, and third-party claim boundaries.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Company', href: '/company/about/' }, { label: 'External verification', href: '/company/external-verification/' }],
    body
  };
}

export function phase4WorkPage() {
  const body = pageHero({
    eyebrow: 'Work',
    title: 'Client evidence without invented metrics or exposed identities.',
    lead: 'Blackpine publishes client feedback and outcome evidence only to the level supported by the information available for public use. Company names remain confidential where requested, and full case studies are held back until enough client-approved detail exists to make them defensible.',
    meta: `<strong>Available now</strong>${clientTestimonials.length} testimonials · ${testimonialEvidenceSnapshots.length} evidence snapshots`
  }) + `<section class="section"><div class="shell"><div class="section-head"><div class="section-label">Client proof</div><div><h2>Two levels of evidence.</h2><p>Testimonials show what clients said. Evidence snapshots summarize only the outcomes those testimonials explicitly support. Neither is inflated into a named case study or quantified ROI claim.</p><p>Earlier illustrative engagement patterns remain illustrative engagement examples; they are not silently converted into client case studies.</p></div></div><div class="service-rows"><a class="service-row" href="/work/testimonials/"><span class="service-index">01</span><span><strong>Client testimonials</strong><small>Twenty supplied client testimonials, with company names withheld for confidentiality and one individual attribution collision handled conservatively.</small></span><span class="row-arrow">→</span></a><a class="service-row" href="/work/client-evidence/"><span class="service-index">02</span><span><strong>Client evidence snapshots</strong><small>Three outcome summaries built only from testimonial-supported facts, with explicit boundaries around what is not claimed.</small></span><span class="row-arrow">→</span></a><a class="service-row" href="/reports/sample-security-assessment/"><span class="service-index">03</span><span><strong>Sample assessment</strong><small>A separate fictional deliverable demonstrating report structure without pretending to be client work.</small></span><span class="row-arrow">→</span></a></div><div class="notice"><strong>Case-study threshold.</strong><p>Blackpine will publish a full anonymized case study only when it has approved facts for the client sector, problem, scope, material findings, remediation, and result. Missing facts are not backfilled with generic cybersecurity language.</p></div></div></section>`;
  return {
    title: 'Client Work & Evidence | Blackpine Cybersecurity',
    description: 'Blackpine client testimonials, evidence snapshots and case-study publication boundaries.',
    breadcrumbItems: [{ label: 'Home', href: '/' }, { label: 'Work', href: '/work/' }],
    body
  };
}
