import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
// filtro.js é um UMD usado no navegador; aqui é carregado como CommonJS.
const mod = { exports: {} };
new Function('module', readFileSync(new URL('../src/assets/filtro.js', import.meta.url), 'utf8'))(mod);
const { match, norm } = mod.exports;

const itens = [
  { id: 'lourdes', text: norm('Lourdes (França), 1858 Bernadette Soubirous gruta de Massabielle'), attrs: { pais: 'franca', decisao: 'reconhecimento-da-aparicao autorizacao-de-culto', nivel: 'diocesano' } },
  { id: 'fatima', text: norm('Fátima (Portugal), 1917 Cova da Iria Lúcia Francisco Jacinta'), attrs: { pais: 'portugal', decisao: 'reconhecimento-da-aparicao autorizacao-de-culto', nivel: 'diocesano' } }
];
const ids = (q, f = {}) => itens.filter((i) => match(i, q, f)).map((i) => i.id);

test('normaliza acentos e maiúsculas', () => {
  assert.equal(norm('Fátima ÇÃO'), 'fatima cao');
  assert.deepEqual(ids('FATIMA'), ['fatima']);
  assert.deepEqual(ids('franca'), ['lourdes']);
});
test('todos os termos precisam aparecer', () => {
  assert.deepEqual(ids('bernadette gruta'), ['lourdes']);
  assert.deepEqual(ids('bernadette jacinta'), []);
});
test('filtro por campo com vários tokens', () => {
  assert.deepEqual(ids('', { decisao: 'autorizacao-de-culto' }), ['lourdes', 'fatima']);
  assert.deepEqual(ids('', { decisao: 'nihil-obstat' }), []);
});
test('filtros combinados com texto', () => {
  assert.deepEqual(ids('cova', { pais: 'portugal' }), ['fatima']);
  assert.deepEqual(ids('cova', { pais: 'franca' }), []);
  assert.deepEqual(ids('', { pais: 'portugal', nivel: 'diocesano' }), ['fatima']);
});
test('filtro vazio ou consulta vazia devolve tudo; resultado vazio é possível', () => {
  assert.equal(ids('', { pais: '' }).length, 2);
  assert.deepEqual(ids('inexistente'), []);
});
