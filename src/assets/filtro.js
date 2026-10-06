/* Lógica pura de busca e filtros, compartilhada entre o navegador e os testes. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SMDFiltro = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  function norm(s) {
    return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }
  /** item: { text, attrs: { campo: 'a b c' } }. Todos os termos devem aparecer; cada filtro exige o valor entre os tokens do campo. */
  function match(item, query, filters) {
    var terms = norm(query).split(/\s+/).filter(Boolean);
    var text = item.text || '';
    for (var i = 0; i < terms.length; i++) if (text.indexOf(terms[i]) === -1) return false;
    var keys = Object.keys(filters || {});
    for (var k = 0; k < keys.length; k++) {
      var want = filters[keys[k]];
      if (!want) continue;
      var tokens = String((item.attrs || {})[keys[k]] || '').split(/\s+/);
      if (tokens.indexOf(want) === -1) return false;
    }
    return true;
  }
  return { norm: norm, match: match };
});
