import fs from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const errors = [];
const read = relative => fs.readFile(new URL(relative, root), 'utf8');
const readDist = relative => fs.readFile(new URL(relative, dist), 'utf8');

for (const phase of [1, 2, 3, 4, 5]) {
  try {
    const audit = await read(`./PHASE${phase}_AUDIT.md`);
    if (!/PASS|implementation-complete|complete/i.test(audit)) errors.push(`PHASE${phase}_AUDIT.md lacks completion/pass evidence`);
  } catch {
    errors.push(`missing PHASE${phase}_AUDIT.md`);
  }
}

const packageJson = JSON.parse(await read('./package.json'));
for (const checker of [
  'check-phase1-trust.mjs',
  'check-phase2-trust.mjs',
  'check-phase3-proof.mjs',
  'check-phase4-client-proof.mjs',
  'check-phase5-enterprise.mjs'
]) if (!packageJson.scripts.check.includes(checker)) errors.push(`normal check pipeline missing ${checker}`);

const requiredPublicRoutes = [
  '/legal/company-information/',
  '/trust/',
  '/trust/security-practices/',
  '/trust/responsible-disclosure/',
  '/methodology/',
  '/reports/sample-security-assessment/',
  '/work/testimonials/',
  '/work/client-evidence/',
  '/company/external-verification/',
  '/trust/enterprise-assurance/',
  '/trust/governance-system/',
  '/trust/client-portal-security/',
  '/trust/service-standards/',
  '/trust/insurance/'
];
for (const route of requiredPublicRoutes) {
  try {
    const html = await readDist(`.${route}index.html`);
    if (!html.includes('<h1')) errors.push(`${route} missing H1`);
  } catch {
    errors.push(`final roadmap route missing ${route}`);
  }
}

const allHtml = [];
async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const url = new URL(`./${entry.name}${entry.isDirectory() ? '/' : ''}`, dir);
    if (entry.isDirectory()) await walk(url);
    else if (entry.name.endsWith('.html')) allHtml.push(await fs.readFile(url, 'utf8'));
  }
}
await walk(dist);
const corpus = allHtml.join('\n');

const forbiddenClaims = [
  /Blackpine (?:is|is now|has been) certified to ISO\/IEC/i,
  /Blackpine (?:holds|has) (?:a )?SOC 2 Type II report/i,
  /Blackpine is a (?:Microsoft|AWS|Cloudflare|CrowdStrike|Cisco|Okta) partner/i,
  /guaranteed 24\/7 response/i,
  /unbreakable encryption/i,
  /CIA-level encryption/i
];
for (const claim of forbiddenClaims) if (claim.test(corpus)) errors.push(`generated site contains unsupported claim matching ${claim}`);

const phase4Data = await read('./src/phase4-client-evidence.mjs');
if ((phase4Data.match(/id: 'T\d\d'/g) || []).length !== 20) errors.push('final audit expected exactly 20 testimonial records');

const phase5Data = await read('./src/phase5-enterprise-data.mjs');
if ((phase5Data.match(/evidenceState: 'OPEN'/g) || []).length !== 5) errors.push('final audit requires five assurance targets to remain evidence-gated OPEN');

const securityTxt = await fs.readFile(new URL('./.well-known/security.txt', dist), 'utf8');
for (const marker of ['Contact:', 'Expires:', 'Canonical:', 'Policy:']) if (!securityTxt.includes(marker)) errors.push(`security.txt missing ${marker}`);

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}
console.log(`Final cross-phase roadmap checks passed across ${allHtml.length} generated HTML files: Phase 1–5 audits present, phase gates wired, core credibility routes present, testimonial count preserved, five assurance claims evidence-gated, security.txt complete, and prohibited unsupported claims absent.`);
