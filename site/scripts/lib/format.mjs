import { L, _ } from './i18n.mjs';

const MONTHS = {
  pt: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  fr: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  it: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
};
const num = (m) => `${m}月`;
/** Nome do mês (1 a 12) no idioma da página. */
export const monthName = (m) => (L.code === 'ja' || L.code === 'zh' ? num(m) : MONTHS[L.code][m - 1]);
/** Título de seção de mês: primeira letra maiúscula nos idiomas que escrevem o mês em minúscula. */
export const monthHeading = (m) => { const n = monthName(m); return n[0].toUpperCase() + n.slice(1); };

const first = (d) => (d === 1 ? (L.code === 'fr' ? '1er' : L.code === 'pt' || L.code === 'it' ? '1º' : 1) : d);

/** Dia e mês, sem ano ("13 de maio", "May 13", "5月13日"). */
export function fmtDayMonth(d, m) {
  switch (L.code) {
    case 'pt': case 'es': return `${first(d)} de ${monthName(m)}`;
    case 'en': return `${monthName(m)} ${d}`;
    case 'de': return `${d}. ${monthName(m)}`;
    case 'ja': case 'zh': return `${m}月${d}日`;
    default: return `${first(d)} ${monthName(m)}`; // fr, it
  }
}

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const paragraphs = (text) =>
  String(text)
    .split(/\n{2,}/)
    .map((p) => `<p>${esc(p)}</p>`)
    .join('\n');

/** Formata uma data respeitando a precisão registrada: nunca mostra mais precisão do que a fonte dá. */
export function fmtDate(value, precision) {
  if (!value) return _('data não documentada');
  if (precision === 'dia') {
    const [y, m, d] = value.split('-').map(Number);
    switch (L.code) {
      case 'pt': case 'es': return `${first(d)} de ${monthName(m)} de ${y}`;
      case 'en': return `${monthName(m)} ${d}, ${y}`;
      case 'de': return `${d}. ${monthName(m)} ${y}`;
      case 'ja': case 'zh': return `${y}年${m}月${d}日`;
      default: return `${first(d)} ${monthName(m)} ${y}`;
    }
  }
  if (precision === 'mes') {
    const [y, m] = value.split('-').map(Number);
    switch (L.code) {
      case 'pt': case 'es': return `${monthName(m)} de ${y}`;
      case 'ja': case 'zh': return `${y}年${m}月`;
      default: return `${monthName(m)} ${y}`;
    }
  }
  if (precision === 'ano') return String(Number(value));
  return _('{value} (aproximada)', { value });
}

export function fmtPeriod(period) {
  if (!period) return _('período não documentado');
  const a = fmtDate(period.start, period.precision);
  if (!period.end || period.end === period.start) return a;
  return _('{a} a {b}', { a, b: fmtDate(period.end, period.precision) });
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
