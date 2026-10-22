import { site, nav, services, research as coreResearch, trustPages } from './content.mjs';
import { extraResearch } from './research-extra.mjs';

export { site, nav, services, trustPages };
export const research = [...coreResearch, ...extraResearch];
