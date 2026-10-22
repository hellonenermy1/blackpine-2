import fs from 'node:fs/promises';

const dist = new URL('../dist/', import.meta.url);
const errors = [];
const readDist = relative => fs.readFile(new URL(relative, dist), 'utf8');

async function htmlFiles(dir, prefix = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = `${prefix}${entry.name}`;
    if (entry.isDirectory()) files.push(...await htmlFiles(new URL(`./${entry.name}/`, dir), `${relative}/`));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(relative);
  }
  return files;
}

const allHtml = await htmlFiles(dist);
for (const file of allHtml) {
  const html = await readDist(`./${file}`);
  if (/\bV2\b/i.test(html)) errors.push(`${file} still exposes stale V2 release wording`);
  if (/images\.unsplash\.com/i.test(html)) errors.push(`${file} still references runtime Unsplash imagery`);
}

const searchIndex = await readDist('./search-index.json');
if (/\bV2\b/i.test(searchIndex)) errors.push('search-index.json still exposes stale V2 release wording');
if (/images\.unsplash\.com/i.test(searchIndex)) errors.push('search-index.json still references runtime Unsplash imagery');

const nestedService = await readDist('./services/penetration-testing/index.html');
if (/class="nav-parent is-context-active" href="\/services\/" aria-current="page"/.test(nestedService)) {
  errors.push('nested service route incorrectly marks the Capabilities index link aria-current=page');
}
if (!/href="\/services\/penetration-testing\/" aria-current="page"/.test(nestedService)) {
  errors.push('nested service route does not mark its exact mega-menu destination aria-current=page');
}

const team = await readDist('./company/team/index.html');
if (/class="nav-parent is-context-active" href="\/company\/about\/" aria-current="page"/.test(team)) {
  errors.push('team route incorrectly marks the About link aria-current=page');
}

const a11y = await readDist('./a11y-v3.js');
if (!a11y.includes("event.key !== 'Tab'")) errors.push('search dialog focus trap is missing');
if (!a11y.includes("[data-nav-group].is-expanded")) errors.push('mega-menu Escape focus restoration is missing');
if (!a11y.includes('requestAnimationFrame(() => groupToggle.focus())')) errors.push('mega-menu Escape does not return focus to its toggle');

const home = await readDist('./index.html');
if (!home.includes('<script src="/a11y-v3.js" defer></script>')) errors.push('V3 accessibility safeguards are not loaded by the shared layout');

const trust = await readDist('./trust/website-security/index.html');
if (!trust.includes('The production build pipeline intentionally has no runtime JavaScript framework')) {
  errors.push('website-security trust page is missing the version-neutral production dependency statement');
}

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Final V3 checks passed: ${allHtml.length} HTML files are free of stale V2/Unsplash output; exact aria-current semantics, modal focus trapping, menu focus restoration, and Trust version consistency are enforced.`);
