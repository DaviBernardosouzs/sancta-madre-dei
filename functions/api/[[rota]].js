// Cloudflare Pages Function: o site em *.pages.dev é estático, então /api/* (contador de visitas e mural de
// pedidos de oração) é repassado ao Worker "sancta-madre-dei" (worker/), onde ficam os Durable Objects.
// Requer um Service binding chamado API no projeto do Pages (ver docs/ARQUITETURA.md, "Pedidos de oração").
// O pedido segue intacto, com o cabeçalho Origin do site, que o Worker confere antes de aceitar escrita.
export async function onRequest({ request, env }) {
  if (!env.API) {
    return new Response(JSON.stringify({ erro: 'api-nao-configurada' }), {
      status: 503,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
    });
  }
  return env.API.fetch(request);
}
