import { esShared } from './es-shared.mjs';
import { esServices01 } from './es-services-01.mjs';
import { esServices02 } from './es-services-02.mjs';
import { esServices03 } from './es-services-03.mjs';
import { esServices04 } from './es-services-04.mjs';
import { esServices05 } from './es-services-05.mjs';
import { esServices06 } from './es-services-06.mjs';
import { esServices07 } from './es-services-07.mjs';
import { esServices08 } from './es-services-08.mjs';
import { esTrust01 } from './es-trust-01.mjs';
import { esTrust02 } from './es-trust-02.mjs';
import { esTrust03 } from './es-trust-03.mjs';
import { esTrust04 } from './es-trust-04.mjs';
import { esTrust05 } from './es-trust-05.mjs';
import { esResearch01a } from './es-research-01a.mjs';
import { esResearch01b } from './es-research-01b.mjs';
import { esResearch02a } from './es-research-02a.mjs';
import { esResearch02b } from './es-research-02b.mjs';

const sources = [
  esShared,
  esServices01,
  esServices02,
  esServices03,
  esServices04,
  esServices05,
  esServices06,
  esServices07,
  esServices08,
  esTrust01,
  esTrust02,
  esTrust03,
  esTrust04,
  esTrust05,
  esResearch01a,
  esResearch01b,
  esResearch02a,
  esResearch02b
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
