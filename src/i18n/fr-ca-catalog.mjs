import { frCaShared } from './fr-ca-shared.mjs';
import { frCaServices1 } from './fr-ca-services-1.mjs';
import { frCaServices2 } from './fr-ca-services-2.mjs';
import { frCaServices3 } from './fr-ca-services-3.mjs';
import { frCaServices4 } from './fr-ca-services-4.mjs';
import { frCaServices5 } from './fr-ca-services-5.mjs';

const sources = [frCaShared, frCaServices1, frCaServices2, frCaServices3, frCaServices4, frCaServices5];

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
