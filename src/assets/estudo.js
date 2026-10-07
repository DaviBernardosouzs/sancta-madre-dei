/* Área de estudo: leitura em paralelo, filtros por grupo e passos (Éfeso). Sem JavaScript, tudo aparece aberto. */
(function () {
  'use strict';
  var q = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* texto em paralelo: lado a lado, só latim ou só português */
  q('[data-paralelo]').forEach(function (box) {
    var barra = box.querySelector('.paralelo__barra');
    if (!barra) return;
    barra.hidden = false;
    var botoes = q('button', barra);
    botoes.forEach(function (b) {
      b.addEventListener('click', function () {
        var m = b.getAttribute('data-modo');
        if (m === 'paralelo') box.removeAttribute('data-modo'); else box.setAttribute('data-modo', m);
        botoes.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      });
    });
  });

  /* filtros por grupo: botões [data-f] mostram só os itens [data-grupo] correspondentes */
  q('[data-filtro]').forEach(function (raiz) {
    var barra = raiz.querySelector('.filtros-chip');
    if (!barra) return;
    barra.hidden = false;
    var itens = q('[data-grupo]', raiz);
    var contagem = raiz.querySelector('[data-contagem]');
    q('button', barra).forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-f');
        var n = 0;
        itens.forEach(function (it) {
          var ok = !f || it.getAttribute('data-grupo').split(' ').indexOf(f) >= 0;
          it.hidden = !ok;
          if (ok) n++;
        });
        q('button', barra).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        if (contagem) contagem.textContent = n + ' / ' + itens.length;
      });
    });
  });

  /* passos: um de cada vez, com anterior, próximo e percurso automático */
  q('[data-passos]').forEach(function (raiz) {
    var passos = q('.passo', raiz);
    var alvos = (raiz.getAttribute('data-alvo') || '').split(/\s+/).map(function (id) { return id && document.getElementById(id); }).filter(Boolean);
    var controles = raiz.querySelector('.passos__controles');
    var reduz = matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('sem-movimento');
    var atual = -1, timer = null;
    if (controles) controles.hidden = false;
    function ir(i) {
      atual = (i + passos.length) % passos.length;
      raiz.classList.add('passos--ativo');
      passos.forEach(function (p, k) {
        p.classList.toggle('passo--ativo', k === atual);
        if (k === atual) p.setAttribute('aria-current', 'step'); else p.removeAttribute('aria-current');
      });
      var est = passos[atual].getAttribute('data-estado') || String(atual);
      var dest = (passos[atual].getAttribute('data-destaca') || '').split(/\s+/).filter(Boolean);
      alvos.forEach(function (a) {
        a.setAttribute('data-estado', est);
        a.toggleAttribute('data-destaca-ativo', dest.length > 0);
        q('[data-ator]', a).forEach(function (el) { el.classList.toggle('on', dest.indexOf(el.getAttribute('data-ator')) >= 0); });
      });
    }
    function parar() { clearTimeout(timer); timer = null; var b = raiz.querySelector('[data-auto]'); if (b) b.setAttribute('aria-pressed', 'false'); }
    function andar() { if (atual + 1 >= passos.length) { parar(); return; } ir(atual + 1); timer = setTimeout(andar, reduz ? 4200 : 3600); }
    var ant = raiz.querySelector('[data-ant]'), prox = raiz.querySelector('[data-prox]'), auto = raiz.querySelector('[data-auto]'), todos = raiz.querySelector('[data-todos]');
    if (ant) ant.addEventListener('click', function () { parar(); ir(atual < 0 ? passos.length - 1 : atual - 1); });
    if (prox) prox.addEventListener('click', function () { parar(); ir(atual + 1); });
    if (auto) auto.addEventListener('click', function () { if (timer) { parar(); return; } auto.setAttribute('aria-pressed', 'true'); atual = -1; ir(0); timer = setTimeout(andar, reduz ? 4200 : 3600); });
    if (todos) todos.addEventListener('click', function () { parar(); atual = -1; raiz.classList.remove('passos--ativo'); passos.forEach(function (p) { p.classList.remove('passo--ativo'); p.removeAttribute('aria-current'); }); alvos.forEach(function (a) { a.setAttribute('data-estado', 'todos'); a.removeAttribute('data-destaca-ativo'); q('[data-ator]', a).forEach(function (el) { el.classList.remove('on'); }); }); });
    passos.forEach(function (p, k) { p.addEventListener('click', function () { parar(); ir(k); }); });
  });
})();
