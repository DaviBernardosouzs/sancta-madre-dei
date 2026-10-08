import { loadContent } from '../scripts/lib/content.mjs';
export const fresh = () => structuredClone(loadContent());
