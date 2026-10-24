import { frCaShared } from './fr-ca-shared.mjs';
import { frCaServices1 } from './fr-ca-services-1.mjs';
import { frCaServices2 } from './fr-ca-services-2.mjs';
import { frCaServices3 } from './fr-ca-services-3.mjs';
import { frCaServices4 } from './fr-ca-services-4.mjs';
import { frCaServices5 } from './fr-ca-services-5.mjs';
import { frCaCore1 } from './fr-ca-core-1.mjs';
import { frCaCore2 } from './fr-ca-core-2.mjs';
import { frCaTrust1 } from './fr-ca-trust-1.mjs';
import { frCaTrust2 } from './fr-ca-trust-2.mjs';
import { frCaTrust3 } from './fr-ca-trust-3.mjs';
import { frCaWork } from './fr-ca-work.mjs';
import { frCaCompany } from './fr-ca-company.mjs';
import { frCaResearch1 } from './fr-ca-research-1.mjs';
import { frCaResearch2 } from './fr-ca-research-2.mjs';
import { frCaReportsAdvisories } from './fr-ca-reports-advisories.mjs';
import { frCaResources } from './fr-ca-resources.mjs';
import { frCaLabsTools } from './fr-ca-labs-tools.mjs';
import { frCaMetadata } from './fr-ca-metadata.mjs';

const sources = [
  frCaShared,
  frCaServices1,
  frCaServices2,
  frCaServices3,
  frCaServices4,
  frCaServices5,
  frCaCore1,
  frCaCore2,
  frCaTrust1,
  frCaTrust2,
  frCaTrust3,
  frCaWork,
  frCaCompany,
  frCaResearch1,
  frCaResearch2,
  frCaReportsAdvisories,
  frCaResources,
  frCaLabsTools,
  frCaMetadata
];

export const frCaCatalog = new Map();
export const frCaCatalogConflicts = [];

for (const source of sources) {
  for (const [english, french] of source) {
    if (frCaCatalog.has(english) && frCaCatalog.get(english) !== french) {
      frCaCatalogConflicts.push({ english, first: frCaCatalog.get(english), second: french });
      continue;
    }
    frCaCatalog.set(english, french);
  }
}
