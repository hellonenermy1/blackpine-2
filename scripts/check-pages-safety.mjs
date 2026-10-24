import fs from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const errors = [];

const index = await fs.readFile(new URL('./index.html', root), 'utf8');
const config = await fs.readFile(new URL('./_config.yml', root), 'utf8');

if (!/<meta name="robots" content="noindex,nofollow,noarchive">/.test(index)) errors.push('GitHub Pages handoff must be noindex');
if (!/<link rel="canonical" href="https:\/\/blackpinecybersecurity\.com\/">/.test(index)) errors.push('GitHub Pages handoff canonical is incorrect');
if (!/<meta http-equiv="refresh" content="0; url=https:\/\/blackpinecybersecurity\.com\/">/.test(index)) errors.push('GitHub Pages handoff redirect is missing');

const excludedPaths = [
  'src',
  'scripts',
  'docs',
  'governance',
  'media-library',
  'progress',
  'build.mjs',
  'netlify.toml',
  'package.json',
  'README.md',
  'AUDIT.md',
  'BRAND_SYSTEM.md',
  'CLAIMS.md',
  'DEPLOYMENT.md',
  'MEDIA.md',
  'SECURITY.md',
  'V3_PLAN.md',
  'PHASE1_AUDIT.md',
  'PHASE2_AUDIT.md',
  'PHASE3_AUDIT.md',
  'PHASE4_AUDIT.md',
  'PHASE5_AUDIT.md',
  'public'
];

for (const excluded of excludedPaths) {
  const pattern = new RegExp(`(?:^|\\n)\\s*-\\s+${excluded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*(?:$|\\n)`);
  if (!pattern.test(config)) errors.push(`GitHub Pages config does not exclude ${excluded}`);
}

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`GitHub Pages safety check passed: noncanonical Pages surface is noindex, canonicalized, redirected, and ${excludedPaths.length} source/development/internal paths are excluded from the Pages artifact.`);
