import { trustPages as existingTrustPages } from './data.mjs';
import { phase2TrustPages } from './phase2-trust-data.mjs';

const seen = new Set();

export const trustPages = [...existingTrustPages, ...phase2TrustPages].filter(page => {
  if (seen.has(page.slug)) throw new Error(`Duplicate trust page slug: ${page.slug}`);
  seen.add(page.slug);
  return true;
});
