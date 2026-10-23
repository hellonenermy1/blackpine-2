import fs from 'node:fs/promises';
import {
  capabilityFamilies,
  capabilityRegistry,
  engagementModels,
  researchCandidates
} from '../src/data.mjs';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const errors = [];
const read = relative => fs.readFile(new URL(relative, root), 'utf8');
const readDist = relative => fs.readFile(new URL(relative, dist), 'utf8');

const decode = value => String(value || '')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&nbsp;/g, ' ');

const visibleText = html => decode(String(html || '')
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim());

const familyById = new Map(capabilityFamilies.map(family => [family.id, family]));
const engagementById = new Map(engagementModels.map(model => [model.id, model]));

// Release model integrity.
if (capabilityFamilies.length !== 6) errors.push(`expected 6 customer-facing families, found ${capabilityFamilies.length}`);
if (capabilityRegistry.length !== 31) errors.push(`expected 31 user-declared capabilities, found ${capabilityRegistry.length}`);
if (engagementModels.length !== 3) errors.push(`expected 3 engagement models, found ${engagementModels.length}`);
for (const capability of capabilityRegistry) {
  if (!familyById.has(capability.primaryFamily)) errors.push(`${capability.id} references unknown family ${capability.primaryFamily}`);
  for (const engagement of capability.engagements || []) if (!engagementById.has(engagement)) errors.push(`${capability.id} references unknown engagement ${engagement}`);
  if (capability.verification !== 'USER_DECLARED_OFFERING') errors.push(`${capability.id} lost user-declared offering provenance`);
}

// Public family pages must actually expose all LIVE offerings assigned to them.
const familyHtml = new Map();
for (const family of capabilityFamilies) {
  const html = await readDist(`.${family.path}index.html`);
  const text = visibleText(html);
  familyHtml.set(family.id, { html, text });
  if (!html.includes(`/contact/?intent=${family.id}`)) errors.push(`${family.path} does not route its customer intent into contact intake`);
  const expected = capabilityRegistry.filter(item => item.primaryFamily === family.id && item.operationalStatus === 'LIVE');
  for (const capability of expected) if (!text.includes(capability.name)) errors.push(`${family.path} does not publicly list LIVE capability ${capability.name}`);
}

// Emergency Response journey.
const emergency = familyHtml.get('emergency-response');
for (const required of [
  'A CEO or administrator account shows an unfamiliar login.',
  'A ransom note appears or files begin changing unexpectedly.',
  'Use a safe email address or callback number',
  'Preserve relevant evidence',
  'Public website intake is for initial triage only.',
  'Availability and any response commitment are confirmed separately.',
  'Cybersecurity Emergency Hotline',
  'Ransomware Response',
  'Business Email Compromise Response',
  'Malware Investigation & Remediation'
]) if (!emergency.text.includes(required)) errors.push(`Emergency Response journey is missing: ${required}`);
if (!emergency.html.includes('/services/incident-response/')) errors.push('Emergency Response does not connect to specialist Incident Response');

// Ransomware route must remain attached to Emergency Response + Incident Response, without a guarantee claim.
const ransomware = capabilityRegistry.find(item => item.id === 'ransomware-response');
if (!ransomware) errors.push('Ransomware Response capability is missing');
else {
  if (ransomware.primaryFamily !== 'emergency-response') errors.push('Ransomware Response is no longer routed through Emergency Response');
  if (ransomware.currentRoute !== '/services/incident-response/') errors.push('Ransomware Response is no longer mapped to specialist Incident Response');
}
const incident = await readDist('./services/incident-response/index.html');
const incidentText = visibleText(incident);
for (const required of ['Availability, scope, response time, and specialist requirements are confirmed during intake.', 'Do not submit passwords, keys, regulated records, or sensitive evidence through the public form.']) {
  if (!incidentText.includes(required)) errors.push(`Incident Response boundary is missing: ${required}`);
}
if (/guarantee(?:d|s)?\s+(?:full\s+)?recovery/i.test(incidentText)) errors.push('Incident Response contains a recovery guarantee');

// Security Desk journey.
const desk = familyHtml.get('security-desk');
for (const required of [
  'Is this email real?',
  'Why did I get this MFA prompt?',
  'Is this security alert dangerous?',
  'Escalation is internal.',
  'route it internally',
  'malware samples',
  'Security Help Desk',
  'Phishing Investigation'
]) if (!desk.text.includes(required)) errors.push(`Security Desk journey is missing: ${required}`);

// Managed Security / Monitor reality boundary.
const monitor = familyHtml.get('monitor');
for (const required of [
  'specific telemetry, products, coverage, escalation path, response authority, review cadence, and reporting expectations',
  'does not promise around-the-clock coverage',
  'Blackpine Managed Security',
  'Managed Detection & Response',
  'Vulnerability Management',
  'External Attack-Surface Monitoring'
]) if (!monitor.text.includes(required)) errors.push(`Monitor operational boundary is missing: ${required}`);
if (/\b24\s*\/\s*7\s+(?:SOC|monitoring|coverage|response)/i.test(monitor.text)) errors.push('Monitor page publishes an unsupported 24/7 operational claim');

// Contact journey and safe intake.
const contact = await readDist('./contact/index.html');
const contactText = visibleText(contact);
for (const required of [
  'Tell Blackpine what is happening.',
  'Safe email to use',
  'Safe callback number',
  'The public form does not confirm immediate response.',
  'Do not include passwords, private keys, regulated records, full log exports, confidential client files, malware samples, or sensitive incident evidence.'
]) if (!contactText.includes(required)) errors.push(`Contact journey is missing: ${required}`);
for (const family of capabilityFamilies) if (!contact.includes(`<option value="${family.id}">`)) errors.push(`contact form is missing intent option ${family.id}`);
if (/\bresponse (?:time|within)\s*:?\s*\d+/i.test(contactText) || /\b\d+\s*(?:minute|hour|business day)s?\s+(?:response|reply)/i.test(contactText)) errors.push('V4 contact page publishes an unapproved response-time promise');

// Form accessibility: visible controls need explicit labels. The hidden honeypot is intentionally wrapped by a label and excluded from user interaction.
if (/\bautofocus\b/i.test(contact)) errors.push('contact form should not force autofocus');
for (const match of contact.matchAll(/<(input|select|textarea)\b([^>]*)>/gi)) {
  const tag = match[1].toLowerCase();
  const attrs = match[2];
  if (/type="hidden"/i.test(attrs)) continue;
  const name = attrs.match(/\bname="([^"]+)"/i)?.[1] || `${tag} control`;
  if (name === 'company-website') continue;
  const id = attrs.match(/\bid="([^"]+)"/i)?.[1];
  if (!id) errors.push(`contact ${name} is missing an id for label association`);
  else if (!new RegExp(`<label[^>]+for="${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'i').test(contact)) errors.push(`contact ${name} is missing an explicit label`);
  const tabindex = attrs.match(/\btabindex="(-?\d+)"/i)?.[1];
  if (tabindex && Number(tabindex) > 0) errors.push(`contact ${name} uses positive tabindex ${tabindex}`);
}

// Engagement-model truthfulness.
const engagements = await readDist('./engagements/index.html');
const engagementsText = visibleText(engagements);
for (const model of engagementModels) if (!engagementsText.includes(model.name)) errors.push(`/engagements/ is missing ${model.name}`);
for (const required of [
  'Service commitments belong in the written agreement.',
  'Response windows, coverage hours, supported products, monitoring responsibilities, escalation, access, data handling, and unused retainer capacity are not implied by the website.'
]) if (!engagementsText.includes(required)) errors.push(`engagement-model boundary is missing: ${required}`);

// Accessibility / structural sanity across every generated HTML document.
const htmlFiles = [];
async function walk(dir, prefix = '') {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const relative = `${prefix}${entry.name}`;
    if (entry.isDirectory()) await walk(new URL(`./${entry.name}/`, dir), `${relative}/`);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(relative);
  }
}
await walk(dist);
for (const file of htmlFiles) {
  const html = await readDist(`./${file}`);
  if (!/<html\s+lang="en"/i.test(html)) errors.push(`${file} is missing html lang=en`);
  if (!html.includes('class="skip-link"') || !html.includes('href="#main"')) errors.push(`${file} is missing the skip link`);
  if (!/<main\s+id="main"/i.test(html)) errors.push(`${file} is missing the main landmark`);
  if (/tabindex="[1-9]\d*"/i.test(html)) errors.push(`${file} contains a positive tabindex`);
  for (const img of html.matchAll(/<img\b([^>]*)>/gi)) if (!/\balt="[^"]*"/i.test(img[1])) errors.push(`${file} contains an image without alt text`);
}

// Content/claim hygiene for the release candidate.
const generatedText = (await Promise.all(htmlFiles.map(async file => visibleText(await readDist(`./${file}`))))).join('\n');
for (const candidate of researchCandidates) if (generatedText.includes(candidate.name)) errors.push(`non-public R&D candidate leaked into generated release content: ${candidate.name}`);
const aiPatterns = [
  /\bour team of experts\b/i,
  /\bcutting[- ]edge\b/i,
  /\bworld[- ]class\b/i,
  /\bindustry[- ]leading\b/i,
  /\bseamless(?:ly)?\b/i,
  /\bfuture[- ]proof\b/i,
  /\bpeace of mind\b/i,
  /\brevolutioni[sz]e\b/i,
  /\bunlock (?:your|the)\b/i
];
for (const pattern of aiPatterns) if (pattern.test(generatedText)) errors.push(`release content contains banned generic/AI-style phrase matching ${pattern}`);

// Phase 4 evidence must remain honest while production is still pre-V4.
const checklist = await read('./progress/v4-phase4/CHECKLIST.md');
const operations = await read('./progress/v4-phase4/OPERATIONS.md');
const baseline = await read('./progress/v4-phase4/PRODUCTION-BASELINE.md');
if (!checklist.includes('| PRODUCTION | BLOCKED |')) errors.push('Phase 4 checklist must not claim production PASS before V4 deployment evidence exists');
if (!operations.includes('Emergency Hotline reality check') && !operations.includes('Emergency Response / Hotline')) errors.push('Phase 4 operations record is missing the emergency-hotline reality gate');
if (!operations.includes('BLOCKED — operational evidence not present')) errors.push('Phase 4 operations record must explicitly retain the unproven hotline blocker');
if (!baseline.includes('pre-V4 corporate site')) errors.push('Phase 4 production baseline must identify the currently deployed pre-V4 site');
if (!baseline.includes('HTTP/3 negotiation')) errors.push('Phase 4 baseline must retain the live-protocol verification limitation');

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`V4 Phase 4 source-release checks passed: ${capabilityRegistry.length} capabilities across ${capabilityFamilies.length} customer families, Emergency/Ransomware/Security Desk journeys, managed-security/retainer boundaries, contact accessibility, ${htmlFiles.length} generated HTML files, content/claim hygiene, and honest production-blocker records.`);
console.log('Phase 4 source gates are not production proof: live deployment, form delivery, browser/device matrix, live headers/protocol/compression/cache behavior, and V3-vs-V4 production performance remain external release gates.');
