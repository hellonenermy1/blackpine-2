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

if (capabilityFamilies.length !== 6) errors.push(`expected 6 customer-facing families, found ${capabilityFamilies.length}`);
if (capabilityRegistry.length !== 31) errors.push(`expected 31 user-declared capabilities, found ${capabilityRegistry.length}`);
if (engagementModels.length !== 3) errors.push(`expected 3 engagement models, found ${engagementModels.length}`);
for (const capability of capabilityRegistry) {
  if (!familyById.has(capability.primaryFamily)) errors.push(`${capability.id} references unknown family ${capability.primaryFamily}`);
  for (const engagement of capability.engagements || []) if (!engagementById.has(engagement)) errors.push(`${capability.id} references unknown engagement ${engagement}`);
  if (capability.verification !== 'USER_DECLARED_OFFERING') errors.push(`${capability.id} lost user-declared offering provenance`);
}

const hotline = capabilityRegistry.find(item => item.id === 'cybersecurity-emergency-hotline');
if (!hotline) errors.push('Cybersecurity Emergency Hotline registry entry is missing');
else {
  if (hotline.operationalStatus !== 'CONTRACT_DEPENDENT') errors.push('Emergency Hotline must remain CONTRACT_DEPENDENT until its operating model is evidenced');
  if (hotline.publicationStatus !== 'NOT_PUBLIC') errors.push('Emergency Hotline must remain NOT_PUBLIC until its monitored channel and coverage model are evidenced');
}

const familyHtml = new Map();
for (const family of capabilityFamilies) {
  const html = await readDist(`.${family.path}index.html`);
  const text = visibleText(html);
  familyHtml.set(family.id, { html, text });
  if (!html.includes(`/contact/?intent=${family.id}`)) errors.push(`${family.path} does not route its customer intent into contact intake`);
  const expected = capabilityRegistry.filter(item => item.primaryFamily === family.id && item.operationalStatus === 'LIVE' && item.publicationStatus !== 'NOT_PUBLIC');
  for (const capability of expected) if (!text.includes(capability.name)) errors.push(`${family.path} does not publicly list approved LIVE capability ${capability.name}`);
}

const emergency = familyHtml.get('emergency-response');
for (const required of [
  'A CEO or administrator account shows an unfamiliar login.',
  'A ransom note appears or files begin changing unexpectedly.',
  'Use a safe email address or callback number',
  'Preserve relevant evidence',
  'Public website intake is for initial triage only.',
  'Availability and any response commitment are confirmed separately.',
  'Ransomware Response',
  'Business Email Compromise Response',
  'Malware Investigation & Remediation'
]) if (!emergency.text.includes(required)) errors.push(`Emergency Response journey is missing: ${required}`);
if (emergency.text.includes('Cybersecurity Emergency Hotline')) errors.push('Emergency Response publicly advertises the unproven Emergency Hotline');
if (!emergency.html.includes('/services/incident-response/')) errors.push('Emergency Response does not connect to specialist Incident Response');

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

const contact = await readDist('./contact/index.html');
const contactText = visibleText(contact);
for (const required of [
  'Tell Blackpine what is happening.',
  'Safe email to use',
  'Safe callback number',
  'The public website does not confirm immediate response.',
  'Do not include passwords, private keys, regulated records, full log exports, confidential client files, malware samples, or sensitive incident evidence.',
  'Compose inquiry email',
  'Blackpine receives nothing from these fields until you send that email.'
]) if (!contactText.includes(required)) errors.push(`Contact journey is missing: ${required}`);
for (const family of capabilityFamilies) if (!contact.includes(`<option value="${family.id}">`)) errors.push(`contact form is missing intent option ${family.id}`);
if (/\bresponse (?:time|within)\s*:?\s*\d+/i.test(contactText) || /\b\d+\s*(?:minute|hour|business day)s?\s+(?:response|reply)/i.test(contactText)) errors.push('V4 contact page publishes an unapproved response-time promise');
if (!contact.includes('data-contact-compose')) errors.push('contact page is missing the local composer marker');
if (/data-netlify|netlify-honeypot|name="form-name"/i.test(contact)) errors.push('contact page reintroduced a Netlify-only form backend on Cloudflare Pages');

const expectedMaxlength = new Map([
  ['name', '120'],
  ['email', '254'],
  ['organization', '160'],
  ['safe-email', '254'],
  ['safe-phone', '64'],
  ['message', '2000']
]);
if (/\bautofocus\b/i.test(contact)) errors.push('contact form should not force autofocus');
for (const match of contact.matchAll(/<(input|select|textarea)\b([^>]*)>/gi)) {
  const tag = match[1].toLowerCase();
  const attrs = match[2];
  if (/type="hidden"/i.test(attrs)) continue;
  const name = attrs.match(/\bname="([^"]+)"/i)?.[1] || `${tag} control`;
  const id = attrs.match(/\bid="([^"]+)"/i)?.[1];
  if (!id) errors.push(`contact ${name} is missing an id for label association`);
  else if (!new RegExp(`<label[^>]+for="${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'i').test(contact)) errors.push(`contact ${name} is missing an explicit label`);
  const tabindex = attrs.match(/\btabindex="(-?\d+)"/i)?.[1];
  if (tabindex && Number(tabindex) > 0) errors.push(`contact ${name} uses positive tabindex ${tabindex}`);
  if (expectedMaxlength.has(name)) {
    const maxlength = attrs.match(/\bmaxlength="(\d+)"/i)?.[1];
    if (maxlength !== expectedMaxlength.get(name)) errors.push(`contact ${name} must use maxlength=${expectedMaxlength.get(name)}, found ${maxlength || 'none'}`);
  }
}

const privacyText = visibleText(await readDist('./legal/privacy/index.html'));
for (const required of [
  'statically generated and deployed through Cloudflare Pages',
  'information entered into that inquiry composer is not transmitted to Blackpine merely by typing it into the page',
  'receives inquiry information from the inquiry composer only if the user chooses to send the prepared message'
]) if (!privacyText.includes(required)) errors.push(`Privacy notice is missing the lawyer-approved production contact boundary: ${required}`);

const engagements = await readDist('./engagements/index.html');
const engagementsText = visibleText(engagements);
for (const model of engagementModels) if (!engagementsText.includes(model.name)) errors.push(`/engagements/ is missing ${model.name}`);
for (const required of [
  'Service commitments are agreed in writing.',
  'Each engagement defines response windows, coverage hours, supported products, monitoring responsibilities, escalation, access, data handling, and retainer terms where applicable.'
]) if (!engagementsText.includes(required)) errors.push(`engagement-model boundary is missing: ${required}`);

const about = visibleText(await readDist('./company/about/index.html'));
if (/The name comes from the image of northern pine/i.test(about)) errors.push('About page reintroduced an unsupported company-name origin claim');
if (!about.includes('The black pine reflects how Blackpine approaches security work')) errors.push('About page must keep the brand meaning framed as a current Blackpine design principle');
const audiences = visibleText(await readDist('./company/who-we-work-with/index.html'));
if (!audiences.includes('show the kinds of environments where our work is most relevant')) errors.push('Who-we-work-with page must describe supportable environments without presenting a client-sector history claim');

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

const generatedText = (await Promise.all(htmlFiles.map(async file => visibleText(await readDist(`./${file}`))))).join('\n');
for (const candidate of researchCandidates) if (generatedText.includes(candidate.name)) errors.push(`non-public R&D candidate leaked into generated release content: ${candidate.name}`);
if (generatedText.includes('Cybersecurity Emergency Hotline')) errors.push('non-public Emergency Hotline leaked into generated release content');
for (const stale of [/\bBlackpine V3\b/i, /\bV3 public tools\b/i, /\bV3 evaluates\b/i, /\bBlackpine V3 looks\b/i]) {
  if (stale.test(generatedText)) errors.push(`release content contains stale versioned public copy matching ${stale}`);
}
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

const pkg = JSON.parse(await read('./package.json'));
if (pkg.version !== '4.0.0') errors.push(`production package version must be 4.0.0, found ${pkg.version}`);

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`V4 Phase 4 source-release checks passed: ${capabilityRegistry.length} capabilities across ${capabilityFamilies.length} customer families, non-public unproven hotline control, Emergency/Ransomware/Security Desk journeys, managed-security/retainer boundaries, Cloudflare-compatible local contact composition, company-claim boundaries, ${htmlFiles.length} generated HTML files, and content/claim hygiene.`);
