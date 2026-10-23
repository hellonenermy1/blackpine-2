import fs from 'node:fs/promises';

const patterns = {
  styles: /<link rel="stylesheet" href="(\/build\/styles\.[a-f0-9]{12}\.css)">/,
  themeInit: /<script src="(\/build\/theme-init\.[a-f0-9]{12}\.js)"><\/script>/,
  site: /<script src="(\/build\/site\.[a-f0-9]{12}\.js)" defer><\/script>/,
  a11y: /<script src="(\/build\/a11y\.[a-f0-9]{12}\.js)" defer><\/script>/,
  phase2: /<script src="(\/build\/phase2\.[a-f0-9]{12}\.js)" defer><\/script>/,
  phase3: /<script src="(\/build\/phase3\.[a-f0-9]{12}\.js)" defer><\/script>/
};

export function runtimeAssetRefs(html) {
  const refs = {};
  for (const [key, pattern] of Object.entries(patterns)) refs[key] = String(html || '').match(pattern)?.[1] || null;
  return refs;
}

export async function loadRuntimeAssets(dist, html) {
  const refs = runtimeAssetRefs(html);
  const missing = Object.entries(refs).filter(([, ref]) => !ref).map(([key]) => key);
  if (missing.length) throw new Error(`Missing fingerprinted runtime asset reference(s): ${missing.join(', ')}`);
  const content = {};
  for (const [key, ref] of Object.entries(refs)) content[key] = await fs.readFile(new URL(`.${ref}`, dist), 'utf8');
  return { refs, content };
}
