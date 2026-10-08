#!/usr/bin/env node
// Baixa os originais das obras para art-originals/ (ignorado pelo git).
// Obras do Met: consulta a API do museu e só baixa se isPublicDomain === true.
// Uso: npm run fetch-art -- [--force]
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CAMINHOS } from '../lib/caminhos.mjs';

const force = process.argv.includes('--force');
const dir = CAMINHOS.originais;
mkdirSync(dir, { recursive: true });
const { images } = JSON.parse(readFileSync(join(CAMINHOS.conteudo, 'images.json'), 'utf8'));
const UA = { 'user-agent': 'SanctaMaterDei/0.1 (projeto pessoal sem fins lucrativos)' };

async function download(url, file) {
  let res;
  for (let tentativa = 0; tentativa < 6; tentativa++) {
    res = await fetch(url, { headers: UA });
    if (res.status !== 429) break;
    // limite de requisições do Wikimedia: espera e tenta de novo
    await new Promise((r) => setTimeout(r, 15000 * (tentativa + 1)));
  }
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

for (const im of images) {
  const name = im.source.type === 'met' ? `${im.source.objectId}.jpg` : im.source.file;
  const file = join(dir, name);
  if (existsSync(file) && !force) { console.log('já existe:', name); continue; }
  if (im.source.type === 'met') {
    const api = await (await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${im.source.objectId}`, { headers: UA })).json();
    if (api.isPublicDomain !== true || !api.primaryImage) throw new Error(`${im.id}: o Met não marca a obra como domínio público ou sem imagem`);
    await download(api.primaryImage, file);
  } else {
    await download(im.source.url, file);
  }
  console.log('baixado:', name);
  await new Promise((r) => setTimeout(r, 2500));
}
