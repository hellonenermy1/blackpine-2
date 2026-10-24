import fs from 'node:fs/promises';
import { loadRuntimeAssets } from './lib/runtime-assets.mjs';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const errors = [];
const read = relative => fs.readFile(new URL(relative, root), 'utf8');
const readDist = relative => fs.readFile(new URL(relative, dist), 'utf8');

const requiredV3Routes = [
  '/work/',
  '/company/team/',
  '/methodology/',
  '/services/penetration-testing/',
  '/services/application-security/',
  '/services/digital-forensics/',
  '/services/security-monitoring/',
  '/services/compliance-readiness/',
  '/advisories/',
  '/reports/',
  '/resources/',
  '/resources/guides/',
  '/security-baseline/',
  '/glossary/',
  '/tools/',
  '/tools/security-headers/',
  '/tools/email-security/',
  '/tools/domain-dns/',
  '/assessment/',
  '/incident/'
];

const routeFile = route => route === '/' ? './index.html' : `.${route}index.html`;
for (const route of requiredV3Routes) {
  try {
    const html = await readDist(routeFile(route));
    if (!html.includes('<h1')) errors.push(`${route} is missing an H1`);
    if (/<meta name="robots" content="[^"]*noindex/i.test(html)) errors.push(`${route} must be indexable`);
  } catch {
    errors.push(`missing V3 route ${route}`);
  }
}

const searchPage = await readDist('./search/index.html');
if (!/<meta name="robots" content="[^"]*noindex/i.test(searchPage)) errors.push('/search/ should be noindex');

const searchIndex = JSON.parse(await readDist('./search-index.json'));
const searchPaths = new Set(searchIndex.map(entry => entry.path));
for (const route of requiredV3Routes) if (!searchPaths.has(route)) errors.push(`search index is missing ${route}`);
for (const forbidden of ['/search/', '/contact/thanks/', '/404/']) if (searchPaths.has(forbidden)) errors.push(`search index must not contain ${forbidden}`);
if (searchIndex.some(entry => typeof entry.title !== 'string' || typeof entry.description !== 'string' || typeof entry.text !== 'string')) errors.push('search index entries are missing required public text fields');
if (searchIndex.some(entry => /@blackpinecybersecurity\.com/i.test(entry.text) && entry.path === '/company/team/')) errors.push('team search text exposes employee email addresses');

const team = await readDist('./company/team/index.html');
const teamMain = team.match(/<main id="main">([\s\S]*?)<\/main>/i)?.[1] || team;
for (const expected of ['Michael Calloway', 'Anthony Adinolfi', 'Harmoni Shaw', 'Elliot Wilkerson', 'Janiyah Conner', 'Phillip Lara', 'Heidi Hoffman']) {
  if (!teamMain.includes(expected)) errors.push(`team page is missing ${expected}`);
}
for (const replaced of ['Owen Wright', "Maeve O'Connor", 'James Sterling', 'Nisha Patel', 'Lucas Silva']) {
  if (teamMain.includes(replaced)) errors.push(`team page still contains replaced employee ${replaced}`);
}
if (!teamMain.includes('26-person')) errors.push('team page does not state the confirmed 26-person practice size');
if (/@blackpinecybersecurity\.com/i.test(teamMain)) errors.push('team content should not publish individual employee email addresses');

const about = await readDist('./company/about/index.html');
if (!about.includes('Michael Calloway') || !about.includes('CEO and owner')) errors.push('about page is missing confirmed Michael Calloway ownership/CEO information');
if (!about.includes('Anthony Adinolfi') || !about.includes('Founder')) errors.push('about page dropped the existing Anthony Adinolfi founder title instead of preserving both confirmed facts');

const careers = await readDist('./company/careers/index.html');
for (const role of [
  'Head of Sales / Business Development',
  'Client Success / Account Manager',
  'Senior Penetration Tester / Red Team Lead',
  'Application Security Engineer',
  'Cloud Security Architect',
  'DFIR / Malware Analysis Specialist',
  'Security Automation / Platform Engineer'
]) if (!careers.includes(role)) errors.push(`careers page is missing planned role ${role}`);
if (!careers.includes('Planned role')) errors.push('careers page must distinguish planned roles from open jobs');
if (careers.includes('"@type":"JobPosting"') || careers.includes('"@type": "JobPosting"')) errors.push('planned roles must not emit JobPosting schema');

const work = await readDist('./work/index.html');
if (!work.includes('illustrative engagement patterns') && !work.includes('illustrative engagement')) errors.push('work page must label unverified examples as illustrative');
for (const glyph of ['⭐⭐⭐⭐⭐', '⭐⭐⭐⭐☆']) if (work.includes(glyph)) errors.push('work page must not present ecommerce-style star ratings');

const home = await readDist('./index.html');
if (!home.includes('Open Cipher ↗')) errors.push('homepage is missing the primary Cipher action');
if (!/class="button cipher-primary"[^>]*>Open Cipher ↗<\/a>/.test(home)) errors.push('Open Cipher must use the primary V3 CTA treatment');
if (!home.includes('/company/team/')) errors.push('homepage is missing the team path');
if (!home.includes('/security-baseline/')) errors.push('homepage is missing the security baseline path');
if (!home.includes('/incident/')) errors.push('homepage is missing the incident entry point');

let runtime;
try {
  runtime = await loadRuntimeAssets(dist, home);
} catch (error) {
  errors.push(error.message);
  runtime = { refs: {}, content: {} };
}
const styles = runtime.content.styles || '';
const themeInit = runtime.content.themeInit || '';
const siteJs = runtime.content.site || '';

const labs = await readDist('./labs/index.html');
if (!/class="button cipher-primary"[^>]*>Open Cipher ↗<\/a>/.test(labs)) errors.push('Labs must use Open Cipher as the primary high-contrast action');

const privacy = await readDist('./legal/privacy/index.html');
if (/production V[0-9]+ baseline/i.test(privacy)) errors.push('privacy page contains stale release-number wording');
if (!/published corporate-site baseline/i.test(privacy)) errors.push('privacy page is missing the version-neutral published corporate-site baseline wording');
if (!privacy.includes('third-party website-search provider')) errors.push('privacy page does not disclose the local-search posture');

if (styles.includes('"Avenir Next"')) errors.push('V2 Avenir typography remains in generated CSS');
if (!styles.includes('--font-display: Inter')) errors.push('V3 display typography token is missing');
if (!styles.includes('--font-body: Inter')) errors.push('V3 body typography token is missing');
if (/@import\s+url\(|fonts\.googleapis\.com|use\.typekit\.net/i.test(styles)) errors.push('V3 must not load remote font services');
if ((styles.match(/gradient\(/g) || []).length) errors.push('V3 design system reintroduced gradients');
if ((styles.match(/\.card\b/g) || []).length) errors.push('V3 design system reintroduced generic .card selectors');
if (!styles.includes('html:not(.js) .primary-nav')) errors.push('mobile navigation is missing the no-JavaScript fallback');

if (!themeInit.includes("classList?.add('js')")) errors.push('theme-init.js does not mark the enhanced JavaScript navigation state');

const layout = await read('./src/layout.mjs');
if (!layout.includes('data-search-open') || !layout.includes('data-search-overlay')) errors.push('global search shell is missing');
if (!layout.includes('navGroups')) errors.push('grouped navigation is not wired into the shared layout');
if (!layout.includes('Capabilities') && !(await read('./src/nav-v4.mjs')).includes("label: 'Capabilities'")) errors.push('primary navigation is missing Capabilities');

if (!siteJs.includes("'/search-index.json'") || !siteJs.includes("'/fr/search-index.json'")) errors.push('site-wide search must use both self-hosted locale search indexes');
if (/algolia|google custom search|typesense|meilisearch/i.test(siteJs)) errors.push('site-wide search contains an unexpected external search provider');
if (/\.innerHTML\s*=/.test(siteJs)) errors.push('site.js uses innerHTML assignment; search/tool output must use text-safe DOM construction');
if (!siteJs.includes("event.key.toLowerCase() === 'k'")) errors.push('Cmd/Ctrl+K search shortcut is missing');
if (!siteJs.includes('levenshteinWithinOne')) errors.push('search typo tolerance is missing');
if (!siteJs.includes('data-headers-input') && !siteJs.includes("querySelector('[data-headers-input]')")) errors.push('local security-header tool logic is missing');

const netlify = await read('./netlify.toml');
if (!/for = "\/search-index\.json"[\s\S]*?Cache-Control = "public, max-age=3600, must-revalidate"/.test(netlify)) errors.push('search-index.json must use a short revalidation cache policy');
for (const legacy of ['/packages*', '/checklist*', '/industries*', '/careers*', '/responsible-disclosure*']) {
  if (!netlify.includes(`from = "${legacy}"`)) errors.push(`legacy migration redirect ${legacy} is missing`);
}
if (netlify.includes('from = "/resources*"')) errors.push('legacy /resources* wildcard must not shadow the real /resources/ route');

const toolPages = [
  ['./tools/security-headers/index.html', 'data-headers-input'],
  ['./tools/email-security/index.html', 'data-email-records-input'],
  ['./tools/domain-dns/index.html', 'data-dns-records-input'],
  ['./assessment/index.html', 'data-assessment']
];
for (const [file, marker] of toolPages) {
  const html = await readDist(file);
  if (!html.includes(marker)) errors.push(`${file} is missing its local interaction surface`);
}

const corporateRoutesToScan = ['/', '/services/', '/work/', '/methodology/', '/company/about/', '/company/team/', '/company/careers/', '/resources/', '/security-baseline/', '/tools/', '/incident/'];
const bannedCopy = [
  /\bbest-in-class\b/i,
  /\bcutting-edge\b/i,
  /\bindustry-leading\b/i,
  /\bworld-class\b/i,
  /\bseamless(?:ly)?\b/i,
  /\bever-evolving\b/i,
  /\bin today['’]s (?:rapidly )?(?:evolving )?(?:digital|cybersecurity)/i,
  /\bour team of experts\b/i,
  /\bpeace of mind\b/i,
  /\bfuture-proof\b/i,
  /\bunlock (?:your|the)\b/i,
  /\brevolutioni[sz]e\b/i
];
for (const route of corporateRoutesToScan) {
  const html = await readDist(routeFile(route));
  const text = html.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  for (const pattern of bannedCopy) if (pattern.test(text)) errors.push(`${route} contains banned corporate/AI-style phrase matching ${pattern}`);
}

const newServicePages = requiredV3Routes.filter(route => route.startsWith('/services/'));
for (const route of newServicePages) {
  const html = await readDist(routeFile(route));
  for (const required of ['Use cases', 'Review surface', 'Method', 'Deliverables', 'Practice context', 'Scope']) if (!html.includes(required)) errors.push(`${route} is missing service information section ${required}`);
}

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Legacy V3 regression checks passed: ${requiredV3Routes.length} established public routes, private search-index boundaries, team/careers safeguards, local tools, locale-split search safety, progressive navigation, typography, Cipher hierarchy, migration redirects, version-neutral privacy wording, and editorial phrase audit.`);
