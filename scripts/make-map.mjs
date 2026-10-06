#!/usr/bin/env node
// Gera src/assets/mapa/terra.json (caminho SVG das terras emersas, projeção Equal Earth) a partir do Natural Earth (domínio público).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './lib/content.mjs';
import { project, MAP } from './lib/mapa.mjs';

const geo = JSON.parse(readFileSync(join(ROOT, 'data', 'ne_110m_land.geojson'), 'utf8'));
const rings = [];
for (const f of geo.features) {
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const poly of polys) rings.push(poly[0]);
}
let d = '';
for (const ring of rings) {
  if (ring.every(([, lat]) => lat < -58)) continue; // sem Antártida
  const pts = ring.map(([lon, lat]) => project(lon, Math.max(lat, -58)));
  d += 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z';
}
mkdirSync(join(ROOT, 'src', 'assets', 'mapa'), { recursive: true });
// paralelos e meridianos (a cada 30 graus) e o contorno do globo na mesma projeção
const linha = (pts) => 'M' + pts.map(([lon, lat]) => project(lon, lat).map((v) => v.toFixed(1)).join(' ')).join('L');
let grade = '';
for (let lat = -30; lat <= 60; lat += 30) grade += linha(Array.from({ length: 73 }, (_, i) => [-180 + i * 5, lat]));
for (let lon = -180; lon <= 180; lon += 30) grade += linha(Array.from({ length: 29 }, (_, i) => [lon, -58 + i * 5]));
const contorno = linha([...Array.from({ length: 29 }, (_, i) => [-180, -58 + i * 5]), ...Array.from({ length: 73 }, (_, i) => [-180 + i * 5, 84]), ...Array.from({ length: 29 }, (_, i) => [180, 84 - i * 5]), ...Array.from({ length: 73 }, (_, i) => [180 - i * 5, -58])]) + 'Z';
writeFileSync(join(ROOT, 'src', 'assets', 'mapa', 'terra.json'), JSON.stringify({ d, w: MAP.w, h: MAP.h, grade, contorno }));
console.log('mapa gerado:', Math.round(d.length / 1024), 'KB');

// países (para seleção no atlas): Natural Earth admin_0, domínio público
const gc = JSON.parse(readFileSync(join(ROOT, 'data', 'ne_110m_admin_0_countries.geojson'), 'utf8'));
const paises = [];
for (const f of gc.features) {
  const iso = f.properties.ISO_A2_EH;
  if (!iso || iso === '-99' || iso === 'AQ') continue;
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  let pd = '';
  let maior = null;
  for (const poly of polys) {
    const proj = poly[0].map(([lon, lat]) => project(lon, Math.max(lat, -58)));
    const xs = proj.map((p) => p[0]), ys = proj.map((p) => p[1]);
    const caixa = [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)];
    // a maior parte do território define o enquadramento do zoom (evita que ilhas e territórios ultramarinos ampliem a caixa)
    if (!maior || caixa[2] * caixa[3] > maior[2] * maior[3]) maior = caixa;
    for (const ring of poly) pd += 'M' + ring.map(([lon, lat]) => project(lon, lat).map((v) => v.toFixed(1)).join(' ')).join('L') + 'Z';
  }
  paises.push({ iso, nome: f.properties.NAME_PT || f.properties.NAME, d: pd, caixa: maior.map((v) => +v.toFixed(1)) });
}
writeFileSync(join(ROOT, 'src', 'assets', 'mapa', 'paises.json'), JSON.stringify(paises));
console.log('países:', paises.length);
