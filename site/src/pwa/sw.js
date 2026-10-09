/* Sancta Mater Dei: service worker do aplicativo instalável (PWA).
   Gerado pelo build a partir de site/src/pwa/sw.js, que substitui os marcadores de versão, base e pré-cache.
   Estratégia:
   - páginas: rede primeiro; sem conexão, a cópia guardada; sem cópia, a página offline do idioma;
   - arquivos do site (estilos, scripts, fontes, imagens): a cópia guardada na hora e uma nova cópia em segundo plano;
   - /api/ (mural de pedidos e contador) nunca é guardado: depende sempre da rede. */
'use strict';
var VERSAO = '__VERSAO__';
var BASE = '__BASE__';
var PAGINAS = 'smd-paginas-' + VERSAO;
var ARQUIVOS = 'smd-arquivos-' + VERSAO;
var PRECACHE = __PRECACHE__;
var LIMITE_PAGINAS = 60;
var LIMITE_ARQUIVOS = 220;

self.addEventListener('install', function (e) {
  // cada arquivo é guardado separadamente: a falta de um não impede a instalação
  e.waitUntil(caches.open(ARQUIVOS).then(function (c) {
    return Promise.all(PRECACHE.map(function (u) { return c.add(new Request(u, { cache: 'reload' })).catch(function () { return null; }); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (nomes) {
    return Promise.all(nomes.filter(function (n) { return n.indexOf('smd-') === 0 && n !== PAGINAS && n !== ARQUIVOS; }).map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});

function aparar(nome, limite) {
  return caches.open(nome).then(function (c) {
    return c.keys().then(function (k) { return k.length > limite ? c.delete(k[0]).then(function () { return aparar(nome, limite); }) : null; });
  });
}

function offlineDe(url) {
  var resto = url.pathname.slice(BASE.length);
  var idioma = /^(en|es|fr|it|de|ja|zh)\//.exec(resto);
  return BASE + (idioma ? idioma[1] + '/' : '') + 'offline/';
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.indexOf(BASE + 'api/') === 0) return;

  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(function (r) {
      if (r.ok) { var copia = r.clone(); caches.open(PAGINAS).then(function (c) { c.put(req, copia); aparar(PAGINAS, LIMITE_PAGINAS); }); }
      return r;
    }).catch(function () {
      return caches.match(req)
        .then(function (r) { return r || caches.match(offlineDe(url)); })
        .then(function (r) { return r || caches.match(BASE + 'offline/'); });
    }));
    return;
  }

  if (url.pathname.indexOf(BASE + 'assets/') === 0 || url.pathname.indexOf(BASE + 'manifest') === 0) {
    e.respondWith(caches.match(req).then(function (guardada) {
      var rede = fetch(req).then(function (r) {
        if (r.ok) { var copia = r.clone(); caches.open(ARQUIVOS).then(function (c) { c.put(req, copia); aparar(ARQUIVOS, LIMITE_ARQUIVOS); }); }
        return r;
      }).catch(function () { return guardada; });
      return guardada || rede;
    }));
  }
});
