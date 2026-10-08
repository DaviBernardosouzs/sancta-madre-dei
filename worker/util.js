// Utilidades comuns do Worker.

/** Navegadores automáticos que não contam visita nem podem deixar pedido. */
export const ROBO = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|monitor|curl|wget|python|httpclient/i;

const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

/** Resumo SHA-256 de partes de texto (usado com um sal aleatório: nunca guarda o IP). */
export async function resumo(...partes) {
  return hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(partes.join('|'))));
}

export const json = (dados, status = 200, cache = 'no-store') => new Response(JSON.stringify(dados), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': cache, 'x-content-type-options': 'nosniff' }
});

/** Só aceita escrita vinda das próprias páginas do site, por navegadores (não por robôs). */
export const vemDoSite = (req, url) => req.headers.get('origin') === url.origin && !ROBO.test(req.headers.get('user-agent') ?? '');
