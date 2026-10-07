// Mapa estilizado da peregrinação da Sagrada Família: duas vistas (Egito e Terra Santa, e a Terra Santa ampliada)
// geradas no build a partir do Natural Earth (domínio público) e dos arquivos de rota e pontos do projeto.
// Projeção equirretangular corrigida pelo cosseno da latitude central: basta para uma região pequena.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './content.mjs';

const PM = join(ROOT, 'src', 'assets', 'pilgrimage-map');
export const rotas = JSON.parse(readFileSync(join(PM, 'holy-family-router.json'), 'utf8'));
export const pontos = JSON.parse(readFileSync(join(PM, 'holy-family-waypoints.json'), 'utf8'));
const terra = JSON.parse(readFileSync(join(ROOT, 'data', 'ne_110m_land.geojson'), 'utf8'));

const VISTAS = {
  geral: { lat: [26.7, 34.3], lng: [24.8, 37.9], w: 700 },
  detalhe: { lat: [31.35, 32.95], lng: [34.25, 36.05], w: 520 }
};

function projecao({ lat, lng, w }) {
  const k = Math.cos(((lat[0] + lat[1]) / 2) * Math.PI / 180);
  const s = w / ((lng[1] - lng[0]) * k);
  const h = Math.round((lat[1] - lat[0]) * s);
  const p = (la, lo) => [(lo - lng[0]) * k * s, (lat[1] - la) * s];
  return { w, h, s, p };
}
const f1 = (n) => n.toFixed(1);
const linha = (pts, fechar = false) => 'M' + pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join('L') + (fechar ? 'Z' : '');

/** Curva suave (Catmull-Rom) por pontos; devolve o caminho SVG e a polilinha amostrada. */
function suave(pts, tensao = 0.5) {
  if (pts.length < 3) return { d: linha(pts), amostra: pts };
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  const amostra = [pts[0]];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + ((p2[0] - p0[0]) * tensao) / 3, p1[1] + ((p2[1] - p0[1]) * tensao) / 3];
    const c2 = [p2[0] - ((p3[0] - p1[0]) * tensao) / 3, p2[1] - ((p3[1] - p1[1]) * tensao) / 3];
    d += `C${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}`;
    for (let t = 1; t <= 16; t++) {
      const u = t / 16, v = 1 - u;
      amostra.push([0, 1].map((j) => v * v * v * p1[j] + 3 * v * v * u * c1[j] + 3 * v * u * u * c2[j] + u * u * u * p2[j]));
    }
  }
  return { d, amostra };
}

/** Ponto a uma fração do comprimento da polilinha e a direção ali (graus). */
function aoLongo(amostra, fracao) {
  const seg = amostra.slice(1).map((q, i) => Math.hypot(q[0] - amostra[i][0], q[1] - amostra[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let alvo = total * fracao;
  for (let i = 0; i < seg.length; i++) {
    if (alvo <= seg[i] || i === seg.length - 1) {
      const u = seg[i] ? Math.min(1, alvo / seg[i]) : 0;
      const [a, b] = [amostra[i], amostra[i + 1]];
      return { x: a[0] + (b[0] - a[0]) * u, y: a[1] + (b[1] - a[1]) * u, ang: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI, total };
    }
    alvo -= seg[i];
  }
}

// águas e rios desenhados à mão, em [lat, lng]: esquemáticos, só para situar o leitor
const NILO = [[26.7, 32.2], [27.2, 31.2], [28.1, 30.8], [29.1, 31.1], [29.9, 31.25]];
const DELTA = [
  [[29.9, 31.25], [30.5, 31.15], [31.0, 30.9], [31.4, 30.42]],
  [[29.9, 31.25], [30.6, 31.35], [31.1, 31.5], [31.42, 31.82]]
];
const JORDAO = [[33.05, 35.62], [32.89, 35.62], [32.70, 35.57], [32.50, 35.55], [32.20, 35.54], [31.84, 35.55], [31.77, 35.52]];
const GALILEIA = [[32.89, 35.62], [32.86, 35.66], [32.78, 35.64], [32.70, 35.58], [32.71, 35.53], [32.80, 35.53], [32.87, 35.57]];
const MORTO = [[31.77, 35.45], [31.75, 35.52], [31.55, 35.54], [31.30, 35.45], [31.15, 35.38], [31.22, 35.36], [31.45, 35.40], [31.62, 35.40]];

const ESTILOS = ['ida', 'fuga', 'retorno', 'anual'];

/**
 * Monta as duas vistas do mapa. `t` traduz rótulos; `esc` escapa texto.
 * Devolve { geral, detalhe } (SVG em texto) e os dados das etapas.
 */
export function montarMapas({ t, esc }) {
  const lugares = Object.fromEntries(pontos.points.map((p) => [p.id, p]));
  // Nazaré aparece duas vezes (ida e retorno): um só marcador por coordenada
  const unicos = [];
  for (const p of pontos.points) if (!unicos.some((u) => u.lat === p.lat && u.lng === p.lng)) unicos.push(p);

  const vista = (nome) => {
    const cfg = VISTAS[nome];
    const { w, h, p, s } = projecao(cfg);
    const proj = (par) => p(par[0], par[1]);
    const caixa = { x0: -w * 0.5, x1: w * 1.5, y0: -h * 0.5, y1: h * 1.5 };
    const dentro = (x, y) => x > caixa.x0 && x < caixa.x1 && y > caixa.y0 && y < caixa.y1;

    // terra: anéis do Natural Earth que tocam a vista, sem pontos quase coincidentes
    let terraD = '';
    for (const feat of terra.features) {
      const polis = feat.geometry.type === 'Polygon' ? [feat.geometry.coordinates] : feat.geometry.coordinates;
      for (const poli of polis) {
        const anel = poli[0].map(([lo, la]) => p(la, lo));
        if (!anel.some(([x, y]) => dentro(x, y))) continue;
        const enxuto = anel.filter((q, i) => i === 0 || Math.hypot(q[0] - anel[i - 1][0], q[1] - anel[i - 1][1]) > 1.2);
        terraD += linha(enxuto, true);
      }
    }

    const grade = [];
    for (let la = Math.ceil(cfg.lat[0]); la <= cfg.lat[1]; la += nome === 'geral' ? 2 : 0.5) grade.push(linha([p(la, cfg.lng[0]), p(la, cfg.lng[1])]));
    for (let lo = Math.ceil(cfg.lng[0]); lo <= cfg.lng[1]; lo += nome === 'geral' ? 2 : 0.5) grade.push(linha([p(cfg.lat[0], lo), p(cfg.lat[1], lo)]));

    const nilo = suave(NILO.map(proj)).d;
    const delta = DELTA.map((r) => suave(r.map(proj)).d).join('');
    const jordao = suave(JORDAO.map(proj)).d;
    const galileia = suave(GALILEIA.map(proj), 0.6).d + 'Z';
    const morto = suave(MORTO.map(proj), 0.6).d + 'Z';

    // rotas
    const sufixo = nome;
    const rotasSvg = [];
    const setas = [];
    const selos = [];
    for (const seg of rotas.segments) {
      const de = lugares[seg.from], para = lugares[seg.to];
      const trilho = [proj([de.lat, de.lng]), ...(seg.via ?? []).map(proj), proj([para.lat, para.lng])];
      const { d, amostra } = suave(trilho);
      const meio = aoLongo(amostra, { 3: 0.64, 4: 0.2 }[seg.order] ?? 0.5);
      const seta = aoLongo(amostra, 0.64);
      rotasSvg.push(`<g class="rota rota--${seg.style}" data-seg="${seg.id}"><path class="rota__sombra" d="${d}"/><path class="rota__linha" d="${d}" pathLength="1"/></g>`);
      setas.push(`<path class="seta seta--${seg.style}" data-seg="${seg.id}" d="M-6.5 -5.2L4 0L-6.5 5.2" transform="translate(${f1(seta.x)} ${f1(seta.y)}) rotate(${f1(seta.ang)})"/>`);
      const curto = meio.total < 70;
      if (!curto) {
        selos.push(`<g class="selo selo--${seg.style}" data-seg="${seg.id}" data-ir="${seg.id}" role="button" tabindex="0" aria-label="${esc(t('Etapa {n}: {rotulo}', { n: seg.order, rotulo: t(seg.label) }))}" transform="translate(${f1(meio.x)} ${f1(meio.y)})"><circle class="selo__halo" r="19"/><circle class="selo__fundo" r="12.5"/><text class="selo__n" y="4.8">${seg.order}</text></g>`);
      } else if (nome === 'detalhe') {
        // etapa curta demais para o selo caber sobre a linha: vai ao lado, com um fio até ela
        selos.push(`<g class="selo selo--${seg.style}" data-seg="${seg.id}" data-ir="${seg.id}" role="button" tabindex="0" aria-label="${esc(t('Etapa {n}: {rotulo}', { n: seg.order, rotulo: t(seg.label) }))}" transform="translate(${f1(meio.x - 50)} ${f1(meio.y)})"><path class="selo__fio" d="M12 0H${50 - 3}"/><circle class="selo__halo" r="19"/><circle class="selo__fundo" r="12.5"/><text class="selo__n" y="4.8">${seg.order}</text></g>`);
      }
    }

    // marcadores de lugar com rótulo
    const AJUSTE = {
      geral: { nazareth: [12, -14, 'start'], bethlehem: [-15, 14, 'end'], jerusalem: [14, 3, 'start'], egypt: [-14, 22, 'end'] },
      detalhe: { nazareth: [16, -9, 'start'], bethlehem: [16, 24, 'start'], jerusalem: [16, -12, 'start'], egypt: [0, 0, 'start'] }
    }[nome];
    const marcadores = unicos.map((u) => {
      const [x, y] = p(u.lat, u.lng);
      if (!dentro(x, y) || x < 0 || x > w || y < 0 || y > h) return '';
      const aj = AJUSTE[u.id] ?? [12, -12, 'start'];
      const nomeLugar = u.id === 'egypt' ? t('Egito (região do Cairo)') : t(u.name);
      return `<g class="lugar lugar--${u.type}" transform="translate(${f1(x)} ${f1(y)})"><circle class="lugar__halo" r="11"/><circle class="lugar__nucleo" r="4.8"/><text class="lugar__nome" x="${aj[0]}" y="${aj[1]}" text-anchor="${aj[2]}">${esc(nomeLugar)}</text></g>`;
    }).join('');

    // rótulos de geografia (maiúsculas espaçadas para regiões, itálico para águas)
    const rot = (la, lo, txt, cls, extra = '') => {
      const [x, y] = p(la, lo);
      return `<text class="geo ${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="middle"${extra}>${esc(txt)}</text>`;
    };
    const geoSvg = nome === 'geral'
      ? [
        rot(33.55, 29.0, t('Mar Mediterrâneo'), 'geo--agua'),
        rot(27.35, 34.85, t('Mar Vermelho'), 'geo--agua', ` transform="rotate(-38 ${f1(p(27.35, 34.85)[0])} ${f1(p(27.35, 34.85)[1])})"`),
        rot(28.5, 28.3, t('EGITO'), 'geo--regiao'),
        rot(29.6, 33.85, t('SINAI'), 'geo--regiao geo--menor'),
        rot(28.55, 31.55, t('Nilo'), 'geo--agua geo--rio', ` transform="rotate(75 ${f1(p(28.55, 31.55)[0])} ${f1(p(28.55, 31.55)[1])})"`),
        rot(32.0, 37.1, t('TERRA SANTA'), 'geo--regiao geo--menor', ` transform="rotate(-90 ${f1(p(32.0, 37.1)[0])} ${f1(p(32.0, 37.1)[1])})"`)
      ].join('')
      : [
        rot(32.25, 34.52, t('Mar Mediterrâneo'), 'geo--agua', ` transform="rotate(-62 ${f1(p(32.25, 34.52)[0])} ${f1(p(32.25, 34.52)[1])})"`),
        rot(32.97, 35.05, t('GALILEIA'), 'geo--regiao'),
        rot(32.02, 35.1, t('SAMARIA'), 'geo--regiao geo--estreita'),
        rot(31.48, 35.0, t('JUDEIA'), 'geo--regiao'),
        rot(32.8, 35.92, t('Mar da Galileia'), 'geo--agua geo--menor'),
        rot(31.5, 35.78, t('Mar Morto'), 'geo--agua geo--menor'),
        rot(32.35, 35.74, t('Rio Jordão'), 'geo--agua geo--rio geo--menor')
      ].join('');

    // quadro tracejado da vista ampliada, no mapa geral
    let quadro = '';
    if (nome === 'geral') {
      const a = p(VISTAS.detalhe.lat[1], VISTAS.detalhe.lng[0]);
      const b = p(VISTAS.detalhe.lat[0], VISTAS.detalhe.lng[1]);
      quadro = `<rect class="quadro-detalhe" x="${f1(a[0])}" y="${f1(a[1])}" width="${f1(b[0] - a[0])}" height="${f1(b[1] - a[1])}" rx="3"/>`;
    }

    const id = (n) => `${n}-${sufixo}`;
    const titulo = nome === 'geral'
      ? t('Mapa do Egito e da Terra Santa com as cinco etapas da peregrinação da Sagrada Família')
      : t('Mapa ampliado da Terra Santa: Nazaré, Belém e Jerusalém');
    return `<svg class="pmapa pmapa--${nome}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" role="group" aria-label="${esc(titulo)}" focusable="false">
  <defs>
    <radialGradient id="${id('mar')}" cx="55%" cy="45%" r="80%"><stop offset="0" stop-color="#1b2b66"/><stop offset=".65" stop-color="#101a45"/><stop offset="1" stop-color="#0a1030"/></radialGradient>
    <linearGradient id="${id('terra')}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#46417a"/><stop offset="1" stop-color="#2d3568"/></linearGradient>
    <pattern id="${id('areia')}" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".7" fill="#e3c27a" opacity=".22"/><circle cx="6.5" cy="6" r=".55" fill="#e3c27a" opacity=".16"/></pattern>
    <clipPath id="${id('moldura')}"><rect width="${w}" height="${h}"/></clipPath>
  </defs>
  <g clip-path="url(#${id('moldura')})">
    <rect class="pmapa__mar" width="${w}" height="${h}" fill="url(#${id('mar')})"/>
    <path class="pmapa__grade" d="${grade.join('')}"/>
    <path class="pmapa__costa" d="${terraD}"/>
    <path class="pmapa__terra" d="${terraD}" fill="url(#${id('terra')})"/>
    <path class="pmapa__terra pmapa__areia" d="${terraD}" fill="url(#${id('areia')})"/>
    <g class="pmapa__aguas"><path class="rio rio--nilo" d="${nilo}"/><path class="rio rio--delta" d="${delta}"/><path class="rio rio--jordao" d="${jordao}"/><path class="lago" d="${galileia}"/><path class="lago" d="${morto}"/></g>
    ${quadro}
    <g class="pmapa__geo">${geoSvg}</g>
    <g class="pmapa__rotas">${rotasSvg.join('')}</g>
    <g class="pmapa__setas" aria-hidden="true">${setas.join('')}</g>
    <g class="pmapa__lugares">${marcadores}</g>
    <g class="pmapa__selos">${selos.join('')}</g>
  </g>
  ${nome === 'geral' ? `<g class="pmapa__rosa" transform="translate(${w - 46} 46)" aria-hidden="true"><circle r="22" class="rosa__aro"/><path class="rosa__seta" d="M0 -17L5 3L0 0L-5 3Z"/><path class="rosa__seta rosa__seta--sul" d="M0 17L5 -3L0 0L-5 -3Z"/><text class="rosa__n" y="-26" text-anchor="middle">N</text></g>` : ''}
</svg>`;
  };

  return { geral: vista('geral'), detalhe: vista('detalhe'), estilos: ESTILOS };
}
