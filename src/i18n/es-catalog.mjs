import { esShared } from './es-shared.mjs';

const sources = [esShared];

export const esCatalog = new Map();
export const esCatalogConflicts = [];

for (const source of sources) {
  for (const [english, spanish] of source) {
    if (esCatalog.has(english) && esCatalog.get(english) !== spanish) {
      esCatalogConflicts.push({ english, first: esCatalog.get(english), second: spanish });
      continue;
    }
    esCatalog.set(english, spanish);
  }
}
