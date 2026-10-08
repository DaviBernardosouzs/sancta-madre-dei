// Worker de produção (Cloudflare): serve o site estático de dist/ e mantém o contador de visitas.
// Só /api/* passa por aqui antes dos arquivos (run_worker_first em wrangler.jsonc).
//
// Privacidade: o contador guarda apenas dois números agregados. Para saber se um navegador já foi
// contado hoje, usa um resumo SHA-256 de (sal do dia + IP + navegador). O sal é aleatório, troca a cada
// dia e o do dia anterior é apagado junto com os resumos; nenhum IP, cookie ou identificador é guardado,
// e não dá para ligar visitas de dias diferentes.
import { DurableObject } from 'cloudflare:workers';

const ROBO = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|monitor|curl|wget|python|httpclient/i;
const hoje = () => new Date().toISOString().slice(0, 10);
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

export class Contador extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(`CREATE TABLE IF NOT EXISTS totais (id INTEGER PRIMARY KEY CHECK (id = 1), visitantes INTEGER NOT NULL DEFAULT 0, acessos INTEGER NOT NULL DEFAULT 0, desde TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS vistos (h TEXT PRIMARY KEY, dia TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS sal (dia TEXT PRIMARY KEY, valor TEXT NOT NULL);`);
    this.sql.exec('INSERT OR IGNORE INTO totais (id, visitantes, acessos, desde) VALUES (1, 0, 0, ?)', hoje());
  }

  ler() {
    return this.sql.exec('SELECT visitantes, acessos, desde FROM totais WHERE id = 1').one();
  }

  /** Conta um acesso; o visitante só é somado na primeira vez do dia. */
  async registrar(ip, navegador) {
    const dia = hoje();
    let sal = this.sql.exec('SELECT valor FROM sal WHERE dia = ?', dia).toArray()[0]?.valor;
    if (!sal) {
      sal = crypto.randomUUID() + crypto.randomUUID();
      this.sql.exec('DELETE FROM sal');
      this.sql.exec('DELETE FROM vistos WHERE dia <> ?', dia);
      this.sql.exec('INSERT INTO sal (dia, valor) VALUES (?, ?)', dia, sal);
    }
    const h = hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${sal}|${ip}|${navegador}`)));
    const novo = this.sql.exec('INSERT OR IGNORE INTO vistos (h, dia) VALUES (?, ?)', h, dia).rowsWritten > 0;
    this.sql.exec('UPDATE totais SET acessos = acessos + 1, visitantes = visitantes + ? WHERE id = 1', novo ? 1 : 0);
    return this.ler();
  }
}

const json = (dados, status = 200, cache = 'no-store') => new Response(JSON.stringify(dados), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': cache, 'x-content-type-options': 'nosniff' }
});

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname !== '/api/visitas') {
      if (url.pathname.startsWith('/api/')) return json({ erro: 'não encontrado' }, 404);
      return env.ASSETS.fetch(req);
    }
    const contador = env.CONTADOR.get(env.CONTADOR.idFromName('global'));
    if (req.method === 'GET' || req.method === 'HEAD') return json(await contador.ler(), 200, 'public, max-age=60');
    if (req.method !== 'POST') return json({ erro: 'método não permitido' }, 405);
    // só conta acessos vindos das próprias páginas do site, de navegadores (não de robôs)
    const navegador = req.headers.get('user-agent') ?? '';
    const origem = req.headers.get('origin');
    if (origem !== url.origin || ROBO.test(navegador)) return json(await contador.ler());
    return json(await contador.registrar(req.headers.get('cf-connecting-ip') ?? '', navegador));
  }
};
