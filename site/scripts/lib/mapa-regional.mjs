// Mapa regional estilizado (projeção equirretangular corrigida pelo cosseno da latitude central), com terras do Natural Earth.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CAMINHOS } from './caminhos.mjs';

const terra = JSON.parse(readFileSync(join(CAMINHOS.naturalEarth, 'ne_110m_land.geojson'), 'utf8'));
const f1 = (n) => n.toFixed(1);

export function projetar({ lat, lng, w }) {
  const k = Math.cos(((lat[0] + lat[1]) / 2) * Math.PI / 180);
  const s = w / ((lng[1] - lng[0]) * k);
  return { w, h: Math.round((lat[1] - lat[0]) * s), p: (la, lo) => [(lo - lng[0]) * k * s, (lat[1] - la) * s] };
}

/** Caminho SVG das terras que tocam a vista. */
export function caminhoTerra({ w, h, p }) {
  let d = '';
  for (const feat of terra.features) {
    const polis = feat.geometry.type === 'Polygon' ? [feat.geometry.coordinates] : feat.geometry.coordinates;
    for (const poli of polis) {
      const anel = poli[0].map(([lo, la]) => p(la, lo));
      if (!anel.some(([x, y]) => x > -w * 0.5 && x < w * 1.5 && y > -h * 0.5 && y < h * 1.5)) continue;
      const enxuto = anel.filter((q, i) => i === 0 || Math.hypot(q[0] - anel[i - 1][0], q[1] - anel[i - 1][1]) > 1.2);
      d += 'M' + enxuto.map(([x, y]) => `${f1(x)} ${f1(y)}`).join('L') + 'Z';
    }
  }
  return d;
}

/** Curva quadrática entre dois pontos, com o arco para o lado `lado` (+1 ou -1). */
export function arco([x1, y1], [x2, y2], lado = 1, curva = 0.18) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1;
  const cx = mx - dy * curva * lado, cy = my + dx * curva * lado;
  return { d: `M${f1(x1)} ${f1(y1)}Q${f1(cx)} ${f1(cy)} ${f1(x2)} ${f1(y2)}`, meio: [0.25 * x1 + 0.5 * cx + 0.25 * x2, 0.25 * y1 + 0.5 * cy + 0.25 * y2] };
}
