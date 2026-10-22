import fs from 'node:fs/promises';

const errors = [];
const read = path => fs.readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const netlify = await read('netlify.toml');
const config = await read('_config.yml');
const build = await read('build.mjs');
const research = await read('src/pages/research.mjs');
const home = await read('src/pages/home.mjs');

if (!netlify.includes('from = "/services/index.html"') || !netlify.includes('force = true')) errors.push('services index redirect is not forced');
if (/for = "\/assets\/\*"[\s\S]*?immutable/i.test(netlify)) errors.push('unhashed assets use immutable caching');
if (!build.includes('writeOgImages(out)')) errors.push('build does not generate social previews');
if (!research.includes('data-research-card data-type=') || !research.includes('data-research-featured-section')) errors.push('featured research is not wired into filtering');
if (home.includes('Dark server hardware') || !home.includes('width="1600" height="900"')) errors.push('homepage artwork metadata is stale');
for (const file of ['AUDIT.md', 'BRAND_SYSTEM.md', 'CLAIMS.md', 'DEPLOYMENT.md', 'MEDIA.md', 'README.md', 'RELEASE.md', 'SECURITY.md']) {
  if (!config.includes(`- ${file}`)) errors.push(`GitHub Pages exclusion missing ${file}`);
}

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

console.log('Release source integrity checks passed.');
