import { esShared } from './es-shared.mjs';
import { esServices01 } from './es-services-01.mjs';
import { esServices02 } from './es-services-02.mjs';
import { esServices03 } from './es-services-03.mjs';
import { esServices04 } from './es-services-04.mjs';
import { esServices05 } from './es-services-05.mjs';
import { esServices06 } from './es-services-06.mjs';
import { esServices07 } from './es-services-07.mjs';
import { esServices08 } from './es-services-08.mjs';

const sources = [
  esShared,
  esServices01,
  esServices02,
  esServices03,
  esServices04,
  esServices05,
  esServices06,
  esServices07,
  esServices08
];

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
