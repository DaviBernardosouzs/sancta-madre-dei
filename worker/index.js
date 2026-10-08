// Worker de produção (Cloudflare): serve o site estático de dist/ e responde à API.
// Só /api/* passa por aqui antes dos arquivos (run_worker_first em wrangler.jsonc).
//
//   GET  /api/visitas                  totais do contador          (contador.js)
//   POST /api/visitas                  conta este acesso
//   GET  /api/pedidos                  pedidos de oração da semana (pedidos.js)
//   POST /api/pedidos                  deixa um pedido { nome, texto }
//   POST /api/pedidos/:id/denunciar    denuncia um pedido impróprio
//   DELETE /api/pedidos/:id            remove um pedido (Authorization: Bearer PEDIDOS_TOKEN)
import { json, vemDoSite } from './util.js';

export { Contador } from './contador.js';
export { Pedidos } from './pedidos.js';

const ip = (req) => req.headers.get('cf-connecting-ip') ?? '';
const navegador = (req) => req.headers.get('user-agent') ?? '';

async function visitas(req, env, url) {
  const contador = env.CONTADOR.get(env.CONTADOR.idFromName('global'));
  if (req.method === 'GET' || req.method === 'HEAD') return json(await contador.ler(), 200, 'public, max-age=60');
  if (req.method !== 'POST') return json({ erro: 'método não permitido' }, 405);
  if (!vemDoSite(req, url)) return json(await contador.ler());
  return json(await contador.registrar(ip(req), navegador(req)));
}

const ERRO_HTTP = { nome: 422, texto: 422, link: 422, spam: 422, limite: 429, cheio: 503, 'nao-encontrado': 404 };

async function pedidos(req, env, url, partes) {
  const mural = env.PEDIDOS.get(env.PEDIDOS.idFromName('mural'));
  const [, id, acao] = partes; // /api/pedidos/:id/:acao
  if (!id) {
    if (req.method === 'GET' || req.method === 'HEAD') return json(await mural.listar(), 200, 'no-store');
    if (req.method !== 'POST') return json({ erro: 'método não permitido' }, 405);
    if (!vemDoSite(req, url)) return json({ erro: 'origem' }, 403);
    if (Number(req.headers.get('content-length') ?? 0) > 4096) return json({ erro: 'texto' }, 413);
    const dados = await req.json().catch(() => null);
    if (!dados) return json({ erro: 'texto' }, 400);
    const r = await mural.adicionar(dados, ip(req), navegador(req));
    return json(r, r.erro ? ERRO_HTTP[r.erro] ?? 400 : 201);
  }
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1) return json({ erro: 'nao-encontrado' }, 404);
  if (acao === 'denunciar' && req.method === 'POST') {
    if (!vemDoSite(req, url)) return json({ erro: 'origem' }, 403);
    const r = await mural.denunciar(n, ip(req), navegador(req));
    return json(r, r.erro ? ERRO_HTTP[r.erro] : 200);
  }
  if (!acao && req.method === 'DELETE') {
    const token = env.PEDIDOS_TOKEN;
    if (!token || req.headers.get('authorization') !== `Bearer ${token}`) return json({ erro: 'não autorizado' }, 401);
    return json(await mural.remover(n));
  }
  return json({ erro: 'método não permitido' }, 405);
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const partes = url.pathname.replace(/^\/api\/|\/$/g, '').split('/');
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(req);
    if (partes[0] === 'visitas' && partes.length === 1) return visitas(req, env, url);
    if (partes[0] === 'pedidos' && partes.length <= 3) return pedidos(req, env, url, partes);
    return json({ erro: 'não encontrado' }, 404);
  }
};
