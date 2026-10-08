// Mural de pedidos de oração (Durable Object com SQLite).
//
// Guarda o nome e o pedido que a pessoa escreveu, visíveis para todos até o domingo às 19:30 de Brasília,
// quando tudo é apagado: um alarme do próprio objeto faz a limpeza mesmo sem visitas, e cada leitura
// confere a semana de novo. Para limitar abusos sem guardar IP, usa um resumo de (sal da semana + IP +
// navegador); o sal é aleatório e é apagado junto com os pedidos, então não dá para ligar semanas diferentes.
import { DurableObject } from 'cloudflare:workers';
import { resumo } from './util.js';
import { inicioDaSemana, fimDaSemana } from './semana.js';
import { LIMITES, validar } from './regras-pedidos.js';

export class Pedidos extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(`CREATE TABLE IF NOT EXISTS pedidos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, texto TEXT NOT NULL, criado INTEGER NOT NULL, autor TEXT NOT NULL, denuncias INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS denuncias (pedido INTEGER NOT NULL, quem TEXT NOT NULL, PRIMARY KEY (pedido, quem));
      CREATE TABLE IF NOT EXISTS semana (id INTEGER PRIMARY KEY CHECK (id = 1), inicio INTEGER NOT NULL, sal TEXT NOT NULL);`);
  }

  /** Começa uma semana nova se a atual já terminou: apaga pedidos, denúncias e o sal, e agenda a próxima limpeza. */
  async conferirSemana() {
    const inicio = inicioDaSemana().getTime();
    const atual = this.sql.exec('SELECT inicio, sal FROM semana WHERE id = 1').toArray()[0];
    if (!atual || atual.inicio !== inicio) {
      this.sql.exec('DELETE FROM pedidos');
      this.sql.exec('DELETE FROM denuncias');
      const sal = crypto.randomUUID() + crypto.randomUUID();
      this.sql.exec('INSERT OR REPLACE INTO semana (id, inicio, sal) VALUES (1, ?, ?)', inicio, sal);
      await this.ctx.storage.setAlarm(fimDaSemana().getTime());
      return sal;
    }
    if (!(await this.ctx.storage.getAlarm())) await this.ctx.storage.setAlarm(fimDaSemana().getTime());
    return atual.sal;
  }

  /** Domingo às 19:30: o alarme apaga o mural. */
  async alarm() {
    await this.conferirSemana();
  }

  async listar() {
    await this.conferirSemana();
    const pedidos = this.sql.exec('SELECT id, nome, texto, criado FROM pedidos WHERE denuncias < ? ORDER BY criado DESC LIMIT ?', LIMITES.denuncias, LIMITES.total).toArray();
    return { pedidos, apagaEm: fimDaSemana().toISOString() };
  }

  async adicionar(dados, ip, navegador) {
    const sal = await this.conferirSemana();
    const ok = validar(dados);
    if (ok.erro) return { erro: ok.erro };
    const autor = await resumo(sal, ip, navegador);
    const meus = this.sql.exec('SELECT COUNT(*) AS n FROM pedidos WHERE autor = ?', autor).one().n;
    if (meus >= LIMITES.porPessoa) return { erro: 'limite' };
    const total = this.sql.exec('SELECT COUNT(*) AS n FROM pedidos').one().n;
    if (total >= LIMITES.total) return { erro: 'cheio' };
    const criado = Date.now();
    const id = this.sql.exec('INSERT INTO pedidos (nome, texto, criado, autor) VALUES (?, ?, ?, ?) RETURNING id', ok.nome, ok.texto, criado, autor).one().id;
    return { pedido: { id, nome: ok.nome, texto: ok.texto, criado }, apagaEm: fimDaSemana().toISOString() };
  }

  /** Uma denúncia por pessoa e por pedido; com LIMITES.denuncias denúncias o pedido sai do mural. */
  async denunciar(id, ip, navegador) {
    const sal = await this.conferirSemana();
    const quem = await resumo(sal, ip, navegador);
    const existe = this.sql.exec('SELECT id FROM pedidos WHERE id = ?', id).toArray().length > 0;
    if (!existe) return { erro: 'nao-encontrado' };
    const nova = this.sql.exec('INSERT OR IGNORE INTO denuncias (pedido, quem) VALUES (?, ?)', id, quem).rowsWritten > 0;
    if (nova) this.sql.exec('UPDATE pedidos SET denuncias = denuncias + 1 WHERE id = ?', id);
    return { ok: true };
  }

  /** Remoção pela administração do site (exige PEDIDOS_TOKEN). */
  async remover(id) {
    await this.conferirSemana();
    this.sql.exec('DELETE FROM denuncias WHERE pedido = ?', id);
    return { ok: this.sql.exec('DELETE FROM pedidos WHERE id = ?', id).rowsWritten > 0 };
  }
}
