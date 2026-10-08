/* Pedidos de oração: lê o mural da semana em /api/pedidos e envia o pedido (nome e necessidade).
   O servidor (worker/pedidos.js) apaga tudo no domingo às 19:30 de Brasília. Sem a API (aplicativo,
   Docker, servidor local) o formulário fica escondido e a página explica que o mural só funciona no site. */
(function () {
  'use strict';
  var raiz = document.querySelector('[data-pedidos]');
  if (!raiz || raiz.hasAttribute('data-app') || !window.fetch) return;
  var T = {};
  try { T = JSON.parse(document.getElementById('pedidos-textos').textContent); } catch (e) { /* sem textos: usa as chaves */ }
  var t = function (k, vars) { var s = T[k] || k; return vars ? s.replace(/\{(\w+)\}/g, function (m, v) { return v in vars ? vars[v] : m; }) : s; };
  var lang = document.documentElement.lang || 'pt-BR';
  var form = raiz.querySelector('[data-pedido-form]');
  var status = raiz.querySelector('[data-pedido-status]');
  var lista = raiz.querySelector('[data-lista]');
  var vazio = raiz.querySelector('[data-vazio]');
  var total = raiz.querySelector('[data-total]');
  var renova = raiz.querySelector('[data-renova]');
  var restam = raiz.querySelector('[data-restam]');
  var API = '/api/pedidos';
  var LIM = { nome: 60, texto: [3, 600] };
  var root = document.documentElement;
  var mover = function () { return !!window.gsap && root.classList.contains('anim') && !root.classList.contains('sem-movimento') && !matchMedia('(prefers-reduced-motion: reduce)').matches; };

  var relativo; try { relativo = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' }); } catch (e) { relativo = null; }
  function quando(ms) {
    var s = Math.round((ms - Date.now()) / 1000);
    var passos = [[60, 'second'], [3600, 'minute', 60], [86400, 'hour', 3600], [Infinity, 'day', 86400]];
    for (var i = 0; i < passos.length; i++) {
      if (Math.abs(s) < passos[i][0]) return relativo ? relativo.format(Math.round(s / (passos[i][2] || 1)), passos[i][1]) : new Date(ms).toLocaleString(lang);
    }
  }
  function dataDoReset(iso) {
    try { return new Intl.DateTimeFormat(lang, { timeZone: 'America/Sao_Paulo', weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(iso)); } catch (e) { return new Date(iso).toLocaleDateString(lang); }
  }

  function itemDe(p) {
    var li = document.createElement('li');
    li.className = 'pedido';
    var nome = document.createElement('p'); nome.className = 'pedido__nome'; nome.textContent = p.nome;
    var texto = document.createElement('p'); texto.className = 'pedido__texto'; texto.textContent = p.texto;
    var meta = document.createElement('p'); meta.className = 'pedido__meta';
    var hora = document.createElement('time'); hora.dateTime = new Date(p.criado).toISOString(); hora.textContent = quando(p.criado);
    var den = document.createElement('button'); den.type = 'button'; den.className = 'pedido__denunciar'; den.textContent = t('denunciar');
    den.addEventListener('click', function () { denunciar(p.id, den); });
    meta.appendChild(hora); meta.appendChild(document.createTextNode(' · ')); meta.appendChild(den);
    li.appendChild(nome); li.appendChild(texto); li.appendChild(meta);
    return li;
  }
  var quantos = 0;
  function contar(n) { quantos = n; total.textContent = t('total', { n: new Intl.NumberFormat(lang).format(n) }); vazio.hidden = n > 0; }

  function mostrar(dados, animar) {
    lista.textContent = '';
    dados.pedidos.forEach(function (p) { lista.appendChild(itemDe(p)); });
    contar(dados.pedidos.length);
    if (dados.apagaEm) renova.textContent = t('renova', { data: dataDoReset(dados.apagaEm) });
    if (animar && mover() && lista.children.length) window.gsap.fromTo(lista.children, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .8, stagger: { each: .05, amount: .6 }, ease: 'power3.out', clearProps: 'all' });
  }

  function indisponivel() {
    form.hidden = true;
    var aviso = document.createElement('p');
    aviso.className = 'aviso';
    aviso.textContent = t('indisponivel');
    form.parentNode.insertBefore(aviso, form);
    total.textContent = '';
  }

  function carregar(animar) {
    return fetch(API, { credentials: 'omit', headers: { accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (d) { if (!d || !Array.isArray(d.pedidos)) throw new Error('formato'); form.hidden = false; mostrar(d, animar); return true; });
  }
  carregar(true).catch(indisponivel);
  // ao voltar para a aba, o mural se atualiza (pedidos novos, ou a renovação de domingo)
  document.addEventListener('visibilitychange', function () { if (!document.hidden && !form.hidden) carregar(false).catch(function () {}); });

  /* contagem de caracteres */
  var campoTexto = form.querySelector('#pedido-texto');
  function atualizarConta() { restam.textContent = t('restam', { n: LIM.texto[1] - campoTexto.value.length }); }
  campoTexto.addEventListener('input', atualizarConta);
  atualizarConta();

  function aviso(msg, tipo) { status.textContent = msg; status.setAttribute('data-tipo', tipo || ''); }
  function invalido(campo, msg) {
    campo.setAttribute('aria-invalid', 'true');
    campo.focus();
    aviso(msg, 'erro');
    return false;
  }

  var enviando = false;
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (enviando) return;
    var nome = form.elements.nome, texto = form.elements.texto, aceite = form.elements.aceite;
    [nome, texto, aceite].forEach(function (c) { c.removeAttribute('aria-invalid'); });
    var n = nome.value.trim(), x = texto.value.trim();
    if (!n || n.length > LIM.nome) return invalido(nome, t('nome'));
    if (x.length < LIM.texto[0] || x.length > LIM.texto[1]) return invalido(texto, t('texto'));
    if (!aceite.checked) { aceite.setAttribute('aria-invalid', 'true'); aceite.focus(); return aviso(aceite.labels[0].textContent, 'erro'); }
    enviando = true;
    form.setAttribute('aria-busy', 'true');
    aviso(t('enviando'));
    fetch(API, { method: 'POST', credentials: 'omit', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ nome: n, texto: x, site: form.elements.site.value }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok || !res.d.pedido) { aviso(t(res.d.erro && T[res.d.erro] ? res.d.erro : 'falha'), 'erro'); return; }
        var li = itemDe(res.d.pedido);
        lista.insertBefore(li, lista.firstChild);
        contar(quantos + 1);
        if (mover()) window.gsap.fromTo(li, { autoAlpha: 0, y: -14, scale: .98 }, { autoAlpha: 1, y: 0, scale: 1, duration: .9, ease: 'expo.out', clearProps: 'all' });
        form.reset();
        atualizarConta();
        aviso(t('enviado'), 'ok');
      })
      .catch(function () { aviso(t('falha'), 'erro'); })
      .then(function () { enviando = false; form.removeAttribute('aria-busy'); });
  });

  function denunciar(id, botao) {
    if (!window.confirm(t('confirmar'))) return;
    botao.disabled = true;
    fetch(API + '/' + id + '/denunciar', { method: 'POST', credentials: 'omit' })
      .then(function (r) { botao.textContent = r.ok ? t('denunciado') : t('falha'); if (!r.ok) botao.disabled = false; })
      .catch(function () { botao.disabled = false; });
  }
})();
