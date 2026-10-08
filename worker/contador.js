// Contador de visitas anônimo (Durable Object com SQLite).
//
// Privacidade: guarda apenas dois números agregados. Para saber se um navegador já foi contado hoje,
// usa um resumo SHA-256 de (sal do dia + IP + navegador). O sal é aleatório, troca a cada dia e o do dia
// anterior é apagado junto com os resumos; nenhum IP, cookie ou identificador é guardado, e não dá para
// ligar visitas de dias diferentes.
import { DurableObject } from 'cloudflare:workers';
import { resumo } from './util.js';

const hoje = () => new Date().toISOString().slice(0, 10);

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
    const h = await resumo(sal, ip, navegador);
    const novo = this.sql.exec('INSERT OR IGNORE INTO vistos (h, dia) VALUES (?, ?)', h, dia).rowsWritten > 0;
    this.sql.exec('UPDATE totais SET acessos = acessos + 1, visitantes = visitantes + ? WHERE id = 1', novo ? 1 : 0);
    return this.ler();
  }
}
