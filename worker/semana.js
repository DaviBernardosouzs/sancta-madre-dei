// A semana do mural de pedidos: começa e termina no domingo às 19:30, horário de Brasília.
// O fuso vem do Intl (America/Sao_Paulo), então continua certo se o Brasil voltar a ter horário de verão.

export const FUSO = 'America/Sao_Paulo';
export const DIA = 0; // domingo
export const HORA = 19;
export const MINUTO = 30;
const SEMANA = 7 * 24 * 60 * 60 * 1000;

/** Diferença do fuso para o UTC, em minutos, naquele instante (Brasília: -180). */
export function deslocamento(instante) {
  const nome = new Intl.DateTimeFormat('en-US', { timeZone: FUSO, timeZoneName: 'longOffset' })
    .formatToParts(instante).find((p) => p.type === 'timeZoneName')?.value ?? 'GMT';
  const m = nome.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
  return m ? (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3] ?? 0)) : 0;
}

/** Último domingo às 19:30 de Brasília até agora (inclusive): o início da semana atual do mural. */
export function inicioDaSemana(agora = new Date()) {
  const off = deslocamento(agora);
  // "local" é o relógio de Brasília escrito como se fosse UTC
  const local = new Date(agora.getTime() + off * 60000);
  const marco = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() - ((local.getUTCDay() - DIA + 7) % 7), HORA, MINUTO));
  if (marco.getTime() > local.getTime()) marco.setUTCDate(marco.getUTCDate() - 7);
  return new Date(marco.getTime() - deslocamento(new Date(marco.getTime() - off * 60000)) * 60000);
}

/** Próximo domingo às 19:30 de Brasília: quando o mural será apagado. */
export function fimDaSemana(agora = new Date()) {
  const ini = inicioDaSemana(agora);
  // procura a partir de pouco mais de seis dias depois, para acertar mesmo se o fuso mudar no meio da semana
  return inicioDaSemana(new Date(ini.getTime() + SEMANA + 60 * 60 * 1000));
}
