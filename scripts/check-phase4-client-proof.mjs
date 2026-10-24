import fs from 'node:fs/promises';
import { clientTestimonials, featuredTestimonialIds, testimonialEvidenceSnapshots } from '../src/phase4-client-evidence.mjs';
import { team } from '../src/v3-data.mjs';

if (clientTestimonials.length !== 20) throw new Error(`Phase 4 check failed: expected 20 supplied testimonials, found ${clientTestimonials.length}`);
if (new Set(clientTestimonials.map(item => item.id)).size !== 20) throw new Error('Phase 4 check failed: testimonial IDs are not unique');
if (featuredTestimonialIds.length !== 5) throw new Error(`Phase 4 check failed: expected 5 homepage testimonial selections, found ${featuredTestimonialIds.length}`);
if (testimonialEvidenceSnapshots.length !== 3) throw new Error(`Phase 4 check failed: expected 3 testimonial-derived evidence snapshots, found ${testimonialEvidenceSnapshots.length}`);

const teamNames = new Set(team.map(person => person.name.toLowerCase()));
for (const item of clientTestimonials) {
  if (!item.quote || !item.title || !item.organization) throw new Error(`Phase 4 check failed: incomplete testimonial ${item.id}`);
  if (item.publishName && teamNames.has(item.name.toLowerCase())) throw new Error(`Phase 4 check failed: testimonial ${item.id} publicly attributes a name that collides with a Blackpine team member`);
}

const priya = clientTestimonials.find(item => item.id === 'T06');
if (!priya || priya.name !== 'Priya Nair' || priya.publishName !== false) throw new Error('Phase 4 check failed: Priya Nair attribution collision is not conservatively gated');

for (const snapshot of testimonialEvidenceSnapshots) {
  if (!clientTestimonials.some(item => item.id === snapshot.sourceTestimonialId)) throw new Error(`Phase 4 check failed: ${snapshot.id} has no supporting testimonial`);
  if (!snapshot.boundary) throw new Error(`Phase 4 check failed: ${snapshot.id} has no evidence boundary`);
}

const requiredPages = [
  ['dist/work/index.html', ['Client evidence without invented metrics', 'Case-study threshold']],
  ['dist/work/testimonials/index.html', ['20 testimonials', 'company names are intentionally not published', 'Client name withheld on site']],
  ['dist/work/client-evidence/index.html', ['Testimonial-derived', 'Microsoft 365 configuration and access review', 'Prioritized remediation for limited time and budget', 'Access and account-management weaknesses']],
  ['dist/company/external-verification/index.html', ['Check Blackpine outside Blackpine', 'Google Business Profile', 'Current boundary']]
];

for (const [path, required] of requiredPages) {
  const body = await fs.readFile(path, 'utf8');
  for (const text of required) {
    if (!body.toLowerCase().includes(text.toLowerCase())) throw new Error(`Phase 4 check failed: ${path} missing ${text}`);
  }
}

const home = await fs.readFile('dist/index.html', 'utf8');
for (const href of ['/work/testimonials/', '/work/client-evidence/']) {
  if (!home.includes(`href="${href}"`)) throw new Error(`Phase 4 check failed: homepage missing ${href}`);
}
for (const id of featuredTestimonialIds) {
  const item = clientTestimonials.find(testimonial => testimonial.id === id);
  const publicName = item.publishName ? item.name : 'Client name withheld on site';
  if (!home.includes(publicName)) throw new Error(`Phase 4 check failed: homepage does not render featured testimonial ${id}`);
}

const testimonialPage = await fs.readFile('dist/work/testimonials/index.html', 'utf8');
for (const item of clientTestimonials.filter(item => item.publishName)) {
  if (!testimonialPage.includes(item.name)) throw new Error(`Phase 4 check failed: public testimonial page missing approved attribution ${item.id}`);
}
if (testimonialPage.includes('Priya Nair')) throw new Error('Phase 4 check failed: ambiguous Priya Nair testimonial name is publicly rendered');

const externalPage = await fs.readFile('dist/company/external-verification/index.html', 'utf8');
for (const unsupported of ['5.0 stars', 'five-star rated', 'google rating: ', 'clutch rating: ', 'certified microsoft partner', 'certified aws partner']) {
  if (externalPage.toLowerCase().includes(unsupported)) throw new Error(`Phase 4 check failed: unsupported external-proof claim: ${unsupported}`);
}

const clientStandard = await fs.readFile('governance/CLIENT_EVIDENCE_STANDARD.md', 'utf8');
for (const required of ['TESTIMONIAL-DERIVED SNAPSHOT', 'ANONYMIZED CASE STUDY', 'Do not manufacture', 'Current Blackpine Phase 4 boundary']) {
  if (!clientStandard.includes(required)) throw new Error(`Phase 4 check failed: client evidence standard missing ${required}`);
}

const externalRegister = await fs.readFile('governance/EXTERNAL_REPUTATION_REGISTER.md', 'utf8');
if ((externalRegister.match(/\| OPEN \|/g) || []).length < 9) throw new Error('Phase 4 check failed: external reputation register does not conservatively track open evidence');
const verifiedRows = externalRegister.match(/^\|.*\| VERIFIED \|.*$/gm) || [];
if (verifiedRows.length !== 1 || !verifiedRows[0].includes('Google Business Profile identity/location/contact')) throw new Error('Phase 4 check failed: only the verified Google Business Profile identity/location/contact record may be promoted to VERIFIED at this stage');
if (!externalRegister.includes('Dynamic rating, review count and hours remain source-of-truth data on the third-party profile')) throw new Error('Phase 4 check failed: dynamic Google Business Profile claim boundary is missing');

console.log('Phase 4 client-proof checks passed: 20 testimonials, 5 homepage selections, 3 bounded evidence snapshots, attribution-collision gating, verified business-profile identity/location/contact, and conservative external-reputation claim controls.');
