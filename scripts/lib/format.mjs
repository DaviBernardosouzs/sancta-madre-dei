const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const paragraphs = (text) =>
  String(text)
    .split(/\n{2,}/)
    .map((p) => `<p>${esc(p)}</p>`)
    .join('\n');

/** Formata uma data respeitando a precisão registrada: nunca mostra mais precisão do que a fonte dá. */
export function fmtDate(value, precision) {
  if (!value) return 'data não documentada';
  if (precision === 'dia') {
    const [y, m, d] = value.split('-').map(Number);
    return `${d === 1 ? '1º' : d} de ${MESES[m - 1]} de ${y}`;
  }
  if (precision === 'mes') {
    const [y, m] = value.split('-').map(Number);
    return `${MESES[m - 1]} de ${y}`;
  }
  if (precision === 'ano') return String(Number(value));
  return `${value} (aproximada)`;
}

export function fmtPeriod(period) {
  if (!period) return 'período não documentado';
  const a = fmtDate(period.start, period.precision);
  if (!period.end || period.end === period.start) return a;
  return `${a} a ${fmtDate(period.end, period.precision)}`;
}

export const normalize = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

export const sortKey = (iso) => {
  const [y, m = '01', d = '01'] = String(iso).split('-');
  return Number(y) * 10000 + Number(m) * 100 + Number(d);
};
