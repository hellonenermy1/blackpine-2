import { site, nav, services, research as coreResearch, trustPages } from './content.mjs';
import { extraResearch } from './research-extra.mjs';

const movedReferenceUrls = new Map([
  [
    'https://www.cyber.gc.ca/en/guidance/baseline-cyber-security-controls-small-medium-organizations',
    'https://www.cyber.gc.ca/en/guidance/baseline-cyber-security-controls-small-and-medium-organizations'
  ],
  [
    'https://www.cisa.gov/resources-tools/resources/implementing-phishing-resistant-mfa',
    'https://www.cisa.gov/sites/default/files/publications/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf'
  ]
]);

const normalizeResearch = item => ({
  ...item,
  sources: item.sources.map(([label, url]) => [label, movedReferenceUrls.get(url) || url])
});

export { site, nav, services, trustPages };
export const research = [...coreResearch, ...extraResearch].map(normalizeResearch);
