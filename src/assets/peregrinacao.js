/* Peregrinação da Sagrada Família: liga o mapa às etapas. Sem JavaScript, o mapa mostra todas as rotas e a lista de etapas faz o mesmo papel. */
(function () {
  'use strict';
  var bloco = document.querySelector('[data-peregrinacao]');
  if (!bloco) return;
  var q = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var etapas = q('.etapa');
  var ids = etapas.map(function (e) { return e.getAttribute('data-etapa'); });
  var ficha = bloco.querySelector('[data-ficha]');
  var controles = bloco.querySelector('.pcontroles');
  var reduz = matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('sem-movimento');
  var atual = null, timer = null, tocando = false;

  q('.pcontroles, .etapa__ver').forEach(function (el) { el.hidden = false; });
  bloco.classList.add('pronto');

  function ativar(id, opts) {
    opts = opts || {};
    atual = id;
    bloco.setAttribute('data-ativa', id || '');
    q('[data-seg]', bloco).forEach(function (el) { el.classList.toggle('on', el.getAttribute('data-seg') === id); });
    etapas.forEach(function (e) { e.classList.toggle('etapa--ativa', e.getAttribute('data-etapa') === id); });
    if (!id) { ficha.hidden = true; return; }
    var e = etapas[ids.indexOf(id)];
    ficha.hidden = false;
    ficha.querySelector('[data-ficha-n]').textContent = (ids.indexOf(id) + 1) + ' / ' + ids.length;
    ficha.querySelector('[data-ficha-t]').textContent = e.getAttribute('data-titulo');
    ficha.querySelector('[data-ficha-ev]').textContent = e.getAttribute('data-evento') + ' · ' + e.getAttribute('data-ref');
    ficha.querySelector('[data-ficha-ir]').setAttribute('href', '#' + e.id);
    if (!reduz && !opts.semTraco) tracar(id);
  }

  /* o traço da rota se desenha de uma ponta à outra (pathLength normalizado em 1) */
  function tracar(id) {
    q('.rota[data-seg="' + id + '"] .rota__linha', bloco).forEach(function (p) {
      p.style.transition = 'none';
      p.style.strokeDasharray = '1';
      p.style.strokeDashoffset = '1';
      void p.getBoundingClientRect();
      p.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(.45,.05,.3,1)';
      p.style.strokeDashoffset = '0';
    });
  }
  function limparTraco() {
    q('.rota__linha', bloco).forEach(function (p) { p.style.transition = ''; p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; });
  }

  function parar() { tocando = false; clearTimeout(timer); var b = bloco.querySelector('[data-percorrer]'); if (b) { b.textContent = rotuloPercorrer; b.setAttribute('aria-pressed', 'false'); } }
  var botPerc = bloco.querySelector('[data-percorrer]');
  var rotuloPercorrer = botPerc.textContent;
  function passo(i) {
    if (!tocando) return;
    if (i >= ids.length) { parar(); return; }
    ativar(ids[i]);
    timer = setTimeout(function () { passo(i + 1); }, reduz ? 2600 : 2400);
  }
  function mover(d) {
    parar();
    var i = atual ? ids.indexOf(atual) + d : (d > 0 ? 0 : ids.length - 1);
    ativar(ids[(i + ids.length) % ids.length]);
  }

  botPerc.addEventListener('click', function () {
    if (tocando) { parar(); return; }
    tocando = true;
    botPerc.setAttribute('aria-pressed', 'true');
    botPerc.textContent = botPerc.getAttribute('data-parar') || '■';
    q('.rota__linha', bloco).forEach(function (p) { p.style.strokeDasharray = '1'; p.style.strokeDashoffset = '1'; });
    passo(0);
  });
  bloco.querySelector('[data-ant]').addEventListener('click', function () { mover(-1); });
  bloco.querySelector('[data-prox]').addEventListener('click', function () { mover(1); });
  bloco.querySelector('[data-todas]').addEventListener('click', function () { parar(); limparTraco(); ativar(null); });

  /* selos do mapa e botões "Ver no mapa" */
  function ir(el) {
    var id = el.getAttribute('data-ir');
    if (!id) return;
    parar();
    ativar(id);
  }
  q('[data-ir]').forEach(function (el) {
    el.addEventListener('click', function () { ir(el); if (el.classList.contains('etapa__ver')) bloco.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth', block: 'start' }); });
    el.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); ir(el); } });
  });
  /* passar o mouse sobre um trecho, selo ou etapa destaca a rota, sem tirar a etapa escolhida */
  function realce(id) {
    q('[data-seg]', bloco).forEach(function (el) { el.classList.toggle('realce', !!id && el.getAttribute('data-seg') === id); });
    bloco.classList.toggle('tem-realce', !!id);
  }
  q('.rota, .selo', bloco).forEach(function (el) {
    el.addEventListener('mouseenter', function () { if (!tocando && !atual) realce(el.getAttribute('data-seg')); });
    el.addEventListener('mouseleave', function () { realce(null); });
  });
  etapas.forEach(function (e) {
    e.addEventListener('mouseenter', function () { if (!tocando && !atual) realce(e.getAttribute('data-etapa')); });
    e.addEventListener('mouseleave', function () { realce(null); });
  });
})();
