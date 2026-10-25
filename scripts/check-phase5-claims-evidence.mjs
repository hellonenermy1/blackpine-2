import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicCompany } from '../src/public-company.mjs';
import { companyFacts, plannedRoles, team } from '../src/v3-data.mjs';
import { clientTestimonials, testimonialEvidenceSnapshots } from '../src/phase4-client-evidence.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registerPath = path.join(root, 'governance/PUBLIC_CLAIM_REGISTER.json');
const standardPath = path.join(root, 'governance/PUBLIC_CLAIM_EVIDENCE_STANDARD.md');
const errors = [];
const fail = message => errors.push(message);
const exists = relative => fs.existsSync(path.join(root, relative));

if (!fs.existsSync(registerPath)) fail('governance/PUBLIC_CLAIM_REGISTER.json is missing.');
if (!fs.existsSync(standardPath)) fail('governance/PUBLIC_CLAIM_EVIDENCE_STANDARD.md is missing.');

let register;
try {
  register = JSON.parse(fs.readFileSync(registerPath, 'utf8'));
} catch (error) {
  fail(`claim register is not valid JSON: ${error.message}`);
}

if (register) {
  const allowedRisk = new Set(['critical', 'high', 'standard']);
  const allowedPublication = new Set(['APPROVED', 'APPROVED_WITH_BOUNDARY', 'NOT_PUBLIC', 'RETIRED']);
  const allowedEvidenceBasis = new Set([
    'USER_DECLARED',
    'SOURCE_BUILD_VERIFIED',
    'EXTERNAL_VERIFIED',
    'CLIENT_SUPPLIED',
    'BLACKPINE_PUBLIC_EVIDENCE',
    'CONTRACT_DEPENDENT',
    'OPEN_EVIDENCE'
  ]);
  const allowedEvidenceStatus = new Set([
    'CURRENT',
    'CURRENT_WITH_REVIEW',
    'INTERNAL_CURRENT',
    'SOURCE_VERIFIED',
    'CLIENT_APPROVED',
    'OPEN'
  ]);

  if (register.schemaVersion !== 1) fail(`claim register schemaVersion must be 1; found ${register.schemaVersion}.`);
  if (register.standard !== 'governance/PUBLIC_CLAIM_EVIDENCE_STANDARD.md') fail('claim register does not point to the canonical evidence standard.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(register.updatedOn || '')) fail('claim register updatedOn must be YYYY-MM-DD.');
  if (!/^[0-9a-f]{40}$/.test(register.baselineCommit || '')) fail('claim register baselineCommit must be a full Git SHA.');
  if (!Array.isArray(register.claims) || !register.claims.length) fail('claim register must contain claims.');

  const ids = new Set();
  const claimsById = new Map();
  for (const claim of register.claims || []) {
    if (!/^[A-Z]{3}-\d{3}$/.test(claim.id || '')) fail(`invalid claim id: ${claim.id ?? '<missing>'}.`);
    if (ids.has(claim.id)) fail(`duplicate claim id: ${claim.id}.`);
    ids.add(claim.id);
    claimsById.set(claim.id, claim);

    if (!allowedRisk.has(claim.risk)) fail(`${claim.id}: invalid risk ${claim.risk}.`);
    if (!claim.class || typeof claim.class !== 'string') fail(`${claim.id}: claim class is missing.`);
    if (!allowedPublication.has(claim.publicationStatus)) fail(`${claim.id}: invalid publicationStatus ${claim.publicationStatus}.`);
    if (!claim.approvedWording || typeof claim.approvedWording !== 'string') fail(`${claim.id}: approvedWording is missing.`);
    if (!Array.isArray(claim.evidenceBasis) || !claim.evidenceBasis.length) fail(`${claim.id}: evidenceBasis is missing.`);
    for (const basis of claim.evidenceBasis || []) if (!allowedEvidenceBasis.has(basis)) fail(`${claim.id}: invalid evidence basis ${basis}.`);
    if (!allowedEvidenceStatus.has(claim.evidenceStatus)) fail(`${claim.id}: invalid evidenceStatus ${claim.evidenceStatus}.`);
    if (!Array.isArray(claim.sourcePaths) || !claim.sourcePaths.length) fail(`${claim.id}: sourcePaths is missing.`);
    if (!Array.isArray(claim.evidenceRefs) || !claim.evidenceRefs.length) fail(`${claim.id}: evidenceRefs is missing.`);
    if (!Array.isArray(claim.verificationGate) || !claim.verificationGate.length) fail(`${claim.id}: verificationGate is missing.`);
    if (!claim.wordingBoundary || typeof claim.wordingBoundary !== 'string') fail(`${claim.id}: wordingBoundary is missing.`);
    if (!claim.owner || typeof claim.owner !== 'string') fail(`${claim.id}: owner is missing.`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(claim.verifiedOn || '')) fail(`${claim.id}: verifiedOn must be YYYY-MM-DD.`);

    for (const relative of [...(claim.sourcePaths || []), ...(claim.evidenceRefs || []), ...(claim.verificationGate || [])]) {
      if (!exists(relative)) fail(`${claim.id}: referenced repository path does not exist: ${relative}.`);
    }

    if (claim.evidenceBasis?.includes('EXTERNAL_VERIFIED')) {
      if (!['CURRENT', 'CURRENT_WITH_REVIEW'].includes(claim.evidenceStatus)) fail(`${claim.id}: EXTERNAL_VERIFIED evidence must be CURRENT or CURRENT_WITH_REVIEW.`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(claim.reviewBy || '')) fail(`${claim.id}: time-sensitive external evidence needs reviewBy.`);
      if (claim.reviewBy && claim.reviewBy < new Date().toISOString().slice(0, 10)) fail(`${claim.id}: external evidence review expired on ${claim.reviewBy}.`);
    }
    if (claim.publicationStatus === 'NOT_PUBLIC' && claim.evidenceStatus !== 'OPEN') fail(`${claim.id}: NOT_PUBLIC claim must remain OPEN until evidence is sufficient.`);
    if (claim.evidenceBasis?.includes('OPEN_EVIDENCE') && ['APPROVED', 'APPROVED_WITH_BOUNDARY'].includes(claim.publicationStatus)) fail(`${claim.id}: OPEN_EVIDENCE cannot support affirmative publication.`);
    if (claim.evidenceBasis?.includes('CLIENT_SUPPLIED') && claim.evidenceStatus === 'CLIENT_APPROVED' && !/client|testimonial|case stud/i.test(claim.class + ' ' + claim.wordingBoundary)) fail(`${claim.id}: client-supplied evidence has no explicit client/testimonial/case-study boundary.`);
  }

  const requiredCritical = ['SRV-002', 'SRV-003', 'SRV-004', 'SEC-002', 'SEC-003', 'LAB-001', 'CLI-003', 'EXT-003', 'ASS-001', 'INS-001', 'HOT-001'];
  for (const id of requiredCritical) {
    const claim = claimsById.get(id);
    if (!claim) fail(`required critical claim is missing: ${id}.`);
    else if (claim.risk !== 'critical') fail(`${id}: required claim must remain critical risk.`);
  }

  const requiredClasses = [
    'company_identity', 'company_contact', 'team_size', 'leadership', 'hiring', 'service_catalog', 'authorization',
    'service_commitment', 'recovery_outcome', 'website_runtime', 'contact_data_flow', 'sensitive_data_intake',
    'surface_separation', 'preference_privacy', 'cipher_authority', 'client_testimonials', 'client_snapshots',
    'case_studies', 'external_profile', 'ratings_reviews', 'third_party_recognition', 'certification_attestation',
    'insurance', 'research_publication', 'governance_controls', 'website_provider', 'emergency_hotline'
  ];
  const classes = new Set((register.claims || []).map(claim => claim.class));
  for (const claimClass of requiredClasses) if (!classes.has(claimClass)) fail(`required claim class is missing: ${claimClass}.`);

  const cmpTeam = claimsById.get('CMP-003');
  if (publicCompany.teamSize !== companyFacts.teamSize || team.length !== publicCompany.teamSize) {
    fail(`company team-size sources disagree: publicCompany=${publicCompany.teamSize}, companyFacts=${companyFacts.teamSize}, team=${team.length}.`);
  }
  if (!cmpTeam?.approvedWording.includes(String(publicCompany.teamSize))) fail('CMP-003 wording does not reflect the current declared team size.');

  const hiring = claimsById.get('HIR-001');
  if (plannedRoles.length !== 7) fail(`planned-role source count changed: ${plannedRoles.length}; review HIR-001 before publication.`);
  if (hiring?.approvedWording !== publicCompany.currentHiringState) fail('HIR-001 wording does not match the current publicCompany hiring state.');

  const testimonials = claimsById.get('CLI-001');
  const snapshots = claimsById.get('CLI-002');
  if (!testimonials?.approvedWording.includes(String(clientTestimonials.length))) fail('CLI-001 wording does not reflect the current testimonial count.');
  const snapshotCountLabels = new Set([String(testimonialEvidenceSnapshots.length), 'three']);
  if (![...snapshotCountLabels].some(value => snapshots?.approvedWording.toLowerCase().includes(value))) fail('CLI-002 wording does not reflect the current evidence-snapshot count.');

  for (const id of ['CLI-003', 'EXT-002', 'EXT-003', 'ASS-001', 'INS-001', 'HOT-001']) {
    if (claimsById.get(id)?.publicationStatus !== 'NOT_PUBLIC') fail(`${id}: evidence-gated claim must remain NOT_PUBLIC.`);
  }

  const standard = fs.existsSync(standardPath) ? fs.readFileSync(standardPath, 'utf8') : '';
  for (const marker of [
    'Consistency is not independent evidence.',
    'A plan is not an operating capability.',
    'A policy is not operating evidence.',
    'A testimonial is not a case study.',
    'Readiness is not assurance.',
    'Build evidence has a deployment boundary.'
  ]) {
    if (!standard.includes(marker)) fail(`claim evidence standard is missing required boundary: ${marker}`);
  }

  const companySource = fs.readFileSync(path.join(root, 'src/pages/company.mjs'), 'utf8');
  if (companySource.includes('Street-level address and phone details are not duplicated across the corporate site')) {
    fail('company page still contains the over-broad address/phone non-duplication claim.');
  }

  if (errors.length) {
    console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
    process.exit(1);
  }

  const critical = register.claims.filter(claim => claim.risk === 'critical').length;
  const high = register.claims.filter(claim => claim.risk === 'high').length;
  const open = register.claims.filter(claim => claim.publicationStatus === 'NOT_PUBLIC').length;
  console.log(`Phase 5 public-claim evidence gate passed: ${register.claims.length} material claims; ${critical} critical; ${high} high; ${open} evidence-gated NOT_PUBLIC; source/evidence/gate references valid; external review dates current; team, hiring and client-evidence counts aligned.`);
}
