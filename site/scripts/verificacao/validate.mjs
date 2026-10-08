#!/usr/bin/env node
import { loadContent, validateContent, draftCounts } from '../lib/content.mjs';
const data = loadContent();
const errors = validateContent(data);
if (errors.length) {
  console.error(`Acervo inválido (${errors.length} erro(s)):\n` + errors.map((e) => ` - ${e}`).join('\n'));
  process.exit(1);
}
console.log('Acervo válido. Rascunhos (fora das superfícies públicas):', JSON.stringify(draftCounts(data)));
