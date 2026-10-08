// Projeção Equal Earth (Šavrič, Patterson e Jenny, 2018) para o atlas, normalizada a uma caixa de 1000 de largura.
const A1 = 1.340264, A2 = -0.081106, A3 = 0.000893, A4 = 0.003796;
const RAD = Math.PI / 180;
const raw = (lon, lat) => {
  const l = lon * RAD;
  const th = Math.asin((Math.sqrt(3) / 2) * Math.sin(lat * RAD));
  const t2 = th * th, t6 = t2 * t2 * t2;
  const x = (2 * Math.sqrt(3) * l * Math.cos(th)) / (3 * (9 * A4 * t6 * t2 + 7 * A3 * t6 + 3 * A2 * t2 + A1));
  const y = th * (A1 + A2 * t2 + A3 * t6 + A4 * t6 * t2);
  return [x, y];
};
const [xmax] = raw(180, 0);
const [, ytop] = raw(0, 84);
const [, ybot] = raw(0, -58);
const S = 1000 / (2 * xmax);
export const MAP = { w: 1000, h: Math.round((ytop - ybot) * S) };
export const project = (lon, lat) => {
  const [x, y] = raw(lon, lat);
  return [(x + xmax) * S, (ytop - y) * S];
};
