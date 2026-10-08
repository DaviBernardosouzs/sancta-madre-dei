// Mural de pedidos de oração: a semana (domingo às 19:30 de Brasília) e as regras de cada pedido (worker/).
import test from 'node:test';
import assert from 'node:assert/strict';
import { inicioDaSemana, fimDaSemana } from '../../worker/semana.js';
import { validar, limpar, LIMITES } from '../../worker/regras-pedidos.js';

const brasilia = (d) => d.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', weekday: 'long', hour: '2-digit', minute: '2-digit' });

test('a semana do mural vai de domingo às 19:30 até o domingo seguinte às 19:30, horário de Brasília', () => {
  const quinta = new Date('2026-10-08T15:00:00Z');
  assert.equal(inicioDaSemana(quinta).toISOString(), '2026-10-04T22:30:00.000Z');
  assert.equal(fimDaSemana(quinta).toISOString(), '2026-10-11T22:30:00.000Z');
  assert.match(brasilia(fimDaSemana(quinta)), /domingo.*19:30/);
});

test('às 19:29 de domingo o mural ainda é o da semana anterior; às 19:30 começa outro', () => {
  assert.equal(inicioDaSemana(new Date('2026-10-11T22:29:59Z')).toISOString(), '2026-10-04T22:30:00.000Z');
  assert.equal(inicioDaSemana(new Date('2026-10-11T22:30:00Z')).toISOString(), '2026-10-11T22:30:00.000Z');
  assert.equal(fimDaSemana(new Date('2026-10-11T22:30:00Z')).toISOString(), '2026-10-18T22:30:00.000Z');
});

test('a semana atravessa a virada do ano', () => {
  assert.equal(fimDaSemana(new Date('2026-12-31T23:00:00Z')).toISOString(), '2027-01-03T22:30:00.000Z');
});

test('pedido válido é limpo e aceito', () => {
  assert.deepEqual(validar({ nome: '  Maria   José ', texto: 'Pela saúde\r\n\r\n\r\nda minha mãe.' }), { nome: 'Maria José', texto: 'Pela saúde\n\nda minha mãe.' });
});

test('pedidos inválidos são recusados com o motivo', () => {
  assert.equal(validar({ nome: '', texto: 'pedido' }).erro, 'nome');
  assert.equal(validar({ nome: 'x'.repeat(LIMITES.nome[1] + 1), texto: 'pedido' }).erro, 'nome');
  assert.equal(validar({ nome: 'Ana', texto: 'oi' }).erro, 'texto');
  assert.equal(validar({ nome: 'Ana', texto: 'x'.repeat(LIMITES.texto[1] + 1) }).erro, 'texto');
  assert.equal(validar({ nome: 'Ana', texto: 'veja https://exemplo.com' }).erro, 'link');
  assert.equal(validar({ nome: 'Ana', texto: 'acesse www.exemplo.org' }).erro, 'link');
  assert.equal(validar({ nome: 'Ana', texto: 'pedido normal', site: 'robô' }).erro, 'spam');
});

test('caracteres de controle e de direção de texto são removidos', () => {
  assert.equal(limpar('Ma‮ria\u0007'), 'Maria');
});
