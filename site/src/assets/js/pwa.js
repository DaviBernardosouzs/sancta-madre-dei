/* Aplicativo instalável (PWA): registra o service worker, guarda o convite de instalação do Android
   e cuida da página /instalar/ (escolha do aparelho, detecção e botão «Instalar agora»).
   Tudo é melhoria progressiva: sem JavaScript, a página mostra as duas orientações completas. */
(function () {
  'use strict';
  var script = document.currentScript;
  var base = (script && script.getAttribute('data-base')) || '/';
  var d = document;
  var instalado = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  if (instalado) d.documentElement.classList.add('pwa-instalado');

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    addEventListener('load', function () { navigator.serviceWorker.register(base + 'sw.js', { scope: base }).catch(function () { /* sem uso offline; o site continua normal */ }); });
  }

  // Android (Chrome, Edge, Samsung Internet): o navegador oferece o convite; guardamos para o botão
  var convite = null;
  addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    convite = e;
    d.querySelectorAll('[data-instalar-pronto]').forEach(function (el) { el.hidden = false; });
  });
  addEventListener('appinstalled', function () {
    convite = null;
    d.querySelectorAll('[data-instalar-pronto]').forEach(function (el) { el.hidden = true; });
    d.querySelectorAll('[data-instalado-agora]').forEach(function (el) { el.hidden = false; });
  });

  var pagina = d.querySelector('[data-instalar]');
  if (!pagina) return;
  pagina.classList.add('instalar--js');

  d.querySelectorAll('[data-instalar-agora]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!convite) return;
      convite.prompt();
      convite.userChoice.finally(function () { convite = null; d.querySelectorAll('[data-instalar-pronto]').forEach(function (el) { el.hidden = true; }); });
    });
  });

  if (instalado) d.querySelectorAll('[data-instalado]').forEach(function (el) { el.hidden = false; });

  var opcoes = pagina.querySelectorAll('input[name="aparelho"]');
  function mostrar(valor) {
    pagina.setAttribute('data-aparelho', valor);
    pagina.querySelectorAll('[data-painel]').forEach(function (p) { p.hidden = p.getAttribute('data-painel') !== valor; });
  }
  opcoes.forEach(function (o) {
    o.addEventListener('change', function () {
      if (!o.checked) return;
      mostrar(o.value);
      try { history.replaceState(null, '', '#' + o.value); } catch (e) { /* ignorado */ }
    });
  });

  // escolha inicial: endereço (#ios / #android), depois o aparelho detectado, depois Android
  var ua = navigator.userAgent || '';
  var ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var android = /Android/.test(ua);
  var pedido = (location.hash || '').slice(1);
  var inicial = pedido === 'ios' || pedido === 'android' ? pedido : ios ? 'ios' : 'android';
  var alvo = pagina.querySelector('input[value="' + inicial + '"]');
  if (alvo) alvo.checked = true;
  mostrar(inicial);
  var aviso = pagina.querySelector('[data-detectado="' + (ios ? 'ios' : android ? 'android' : 'outro') + '"]');
  if (aviso && !pedido) aviso.hidden = false;
  if (ios && (!/Safari/.test(ua) || /CriOS|FxiOS|EdgiOS/.test(ua))) pagina.querySelectorAll('[data-ios-outro]').forEach(function (el) { el.hidden = false; });
})();
