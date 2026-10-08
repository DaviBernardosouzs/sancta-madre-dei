/* Peregrinação da Sagrada Família: o palco fixo acompanha a leitura das etapas.
   Sem JavaScript, os dois mapas e as etapas aparecem em sequência. Aqui só há estado (qual etapa está
   no centro da tela, que vista do mapa mostrar, que rotas já foram andadas); o movimento fica em
   window.SMDPeregrinacaoFilme, chamado por filme.js dentro do gsap.matchMedia(). */
(function () {
  'use strict';
  var viagem = document.querySelector('[data-viagem]');
  if (!viagem || !window.IntersectionObserver) return;
  var q = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var etapas = q('.etapa', viagem);
  var ids = etapas.map(function (e) { return e.getAttribute('data-etapa'); });
  var rotas = ids.filter(function (id) { return id !== 'todas'; });
  var cartela = viagem.querySelector('.viagem__cartela');
  var nav = viagem.querySelector('.viagem__nav');
  var pontos = q('[data-ponto]', viagem);
  var reduz = function () { return matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('sem-movimento'); };
  var atual = -1;

  viagem.classList.add('viagem--viva');
  // no palco (quase quadrado) o mapa geral usa um enquadramento próprio, do Cairo à Terra Santa
  q('svg[data-vb-palco]', viagem).forEach(function (svg) { svg.setAttribute('viewBox', svg.getAttribute('data-vb-palco')); });
  cartela.hidden = false;
  nav.hidden = false;

  function ativar(i) {
    if (i === atual || i < 0) return;
    var antes = atual;
    atual = i;
    var e = etapas[i], id = ids[i];
    var vista = e.getAttribute('data-vista') || 'geral';
    var vistaAntes = viagem.getAttribute('data-vista');
    viagem.setAttribute('data-vista', vista);
    viagem.setAttribute('data-ativa', id);
    etapas.forEach(function (x, k) { x.classList.toggle('etapa--ativa', k === i); });
    // rotas: andadas, a da vez e as que ainda vêm (no fim, todas acesas)
    var k = rotas.indexOf(id);
    q('[data-seg]', viagem).forEach(function (el) {
      var j = rotas.indexOf(el.getAttribute('data-seg'));
      var on = id === 'todas' || j === k;
      el.classList.toggle('on', on);
      el.classList.toggle('feito', !on && j < k);
      el.classList.toggle('futuro', id !== 'todas' && j > k);
    });
    cartela.querySelector('[data-c-n]').textContent = e.getAttribute('data-romano');
    cartela.querySelector('[data-c-t]').textContent = e.getAttribute('data-titulo');
    cartela.querySelector('[data-c-r]').textContent = e.getAttribute('data-ref');
    pontos.forEach(function (p) { if (p.getAttribute('data-ponto') === e.id) p.setAttribute('aria-current', 'step'); else p.removeAttribute('aria-current'); });
    viagem.dispatchEvent(new CustomEvent('viagem:etapa', { detail: { indice: i, antes: antes, id: id, vista: vista, vistaAntes: vistaAntes } }));
  }

  /* a etapa da vez é a que cruza o meio da tela (abaixo do palco, no celular) */
  var io;
  function observar() {
    if (io) io.disconnect();
    var celular = !matchMedia('(min-width: 62rem)').matches;
    io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) { if (en.isIntersecting) ativar(etapas.indexOf(en.target)); });
    }, { rootMargin: celular ? '-62% 0px -30% 0px' : '-48% 0px -48% 0px' });
    etapas.forEach(function (e) { io.observe(e); });
  }
  observar();
  matchMedia('(min-width: 62rem)').addEventListener('change', observar);
  ativar(0);

  /* ir até uma etapa: pela navegação, pelas setas ou pelos selos do mapa */
  function irPara(i) {
    var e = etapas[Math.max(0, Math.min(etapas.length - 1, i))];
    e.scrollIntoView({ behavior: reduz() ? 'auto' : 'smooth', block: matchMedia('(min-width: 62rem)').matches ? 'center' : 'start' });
  }
  pontos.forEach(function (p) {
    p.addEventListener('click', function (ev) { ev.preventDefault(); irPara(etapas.indexOf(document.getElementById(p.getAttribute('data-ponto')))); });
  });
  viagem.querySelector('[data-ant]').addEventListener('click', function () { irPara(atual - 1); });
  viagem.querySelector('[data-prox]').addEventListener('click', function () { irPara(atual + 1); });
  q('.selo[data-ir]', viagem).forEach(function (s) {
    var i = ids.indexOf(s.getAttribute('data-ir'));
    s.addEventListener('click', function () { irPara(i); });
    s.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); irPara(i); } });
  });

  /* ---------- movimento (só com GSAP e sem redução de movimento) ---------- */
  window.SMDPeregrinacaoFilme = function (g, ST, opt) {
    var limpar = [];
    var EX = 'expo.out';
    var palco = viagem.querySelector('[data-palco]');
    var moldura = viagem.querySelector('.viagem__moldura');
    var mapas = { geral: viagem.querySelector('[data-mapa="geral"]'), detalhe: viagem.querySelector('[data-mapa="detalhe"]') };
    var luz = viagem.querySelector('.viagem__luz');
    viagem.classList.add('viagem--filme');
    limpar.push(function () { viagem.classList.remove('viagem--filme'); });

    /* o mapa só aparece quando o palco entra: a terra se acende, os lugares se marcam, os nomes assentam */
    var abre = g.timeline({ defaults: { ease: EX }, scrollTrigger: { trigger: viagem, start: 'top 75%', once: true } });
    abre.fromTo(q('.viagem__sobre, .viagem__cab h2, .viagem__nota', viagem), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1.4, stagger: .12, clearProps: 'transform' }, 0)
      .fromTo(moldura, { autoAlpha: 0, filter: 'brightness(.2)' }, { autoAlpha: 1, filter: 'brightness(1)', duration: 2.2, ease: 'power2.out', clearProps: 'filter' }, .2)
      .fromTo(q('.pmapa__terra, .pmapa__costa', viagem), { opacity: 0 }, { opacity: 1, duration: 2.4, ease: 'power1.out', clearProps: 'opacity' }, .4)
      // os marcadores têm transform próprio no SVG: anima-se o conteúdo, não o grupo
      .fromTo(q('.lugar__nucleo, .lugar__nome', viagem), { autoAlpha: 0, scale: .2, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .9, stagger: .06, ease: 'back.out(2.4)' }, 1)
      .fromTo(q('.geo', viagem), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.6, stagger: .05, ease: 'power1.out' }, 1.2)
      .fromTo(q('.viagem__canto', viagem), { autoAlpha: 0, scale: .4 }, { autoAlpha: 1, scale: 1, duration: 1.2, stagger: .08, clearProps: 'transform' }, 1.3);

    /* cada etapa traça a sua rota enquanto a folha atravessa a tela, e a estrela anda com ela */
    function viajantes() { return q('.pmapa__viajante', viagem); }
    rotas.forEach(function (id) {
      var e = etapas[ids.indexOf(id)];
      var linhas = q('.rota[data-seg="' + id + '"] .rota__linha', viagem);
      var setas = q('.seta[data-seg="' + id + '"]', viagem);
      var medidas = linhas.map(function (p) { return { p: p, svg: p.ownerSVGElement, len: p.getTotalLength() }; });
      g.set(linhas, { strokeDashoffset: 1 });
      g.set(setas, { autoAlpha: 0 });
      ST.create({
        trigger: e, start: opt.desktop ? 'top 52%' : 'top 64%', end: opt.desktop ? 'bottom 55%' : 'bottom 75%', scrub: .8,
        onUpdate: function (self) {
          var p = self.progress;
          g.set(linhas, { strokeDashoffset: 1 - p });
          g.set(setas, { autoAlpha: p > .62 ? 1 : 0 });
          // a estrela fica na ponta do traço; some quando a rota termina de se desenhar
          medidas.forEach(function (m) {
            var v = m.svg.querySelector('.pmapa__viajante');
            var pt = m.p.getPointAtLength(m.len * p);
            g.set(v, { attr: { transform: 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')' }, autoAlpha: p > .01 && p < .995 ? 1 : 0 });
          });
        }
      });
    });
    limpar.push(function () { g.set(q('.rota__linha', viagem), { clearProps: 'strokeDashoffset' }); g.set(q('.seta, .pmapa__viajante', viagem), { clearProps: 'opacity,visibility' }); });

    /* troca de etapa: corte de câmera entre as vistas, a luz passa pelo mapa, a cartela troca */
    var cn = q('.viagem__cartela > span', viagem);
    function aoMudar(ev) {
      var d = ev.detail;
      g.fromTo(cn, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .9, stagger: .07, ease: EX, overwrite: true });
      g.fromTo(luz, { xPercent: -60 }, { xPercent: 60, duration: 1.8, ease: 'power2.inOut', overwrite: true });
      if (d.id === 'todas') g.to(viajantes(), { autoAlpha: 0, duration: .4 });
      if (!d.vistaAntes || d.vistaAntes === d.vista) return;
      // aproximar (geral → detalhe) ou afastar (detalhe → geral), como uma lente que muda de foco
      var entra = mapas[d.vista], sai = mapas[d.vistaAntes];
      var perto = d.vista === 'detalhe';
      g.killTweensOf([entra, sai]);
      g.fromTo(sai, { autoAlpha: 1, scale: 1 }, { autoAlpha: 0, scale: perto ? 1.35 : .8, duration: 1.1, ease: 'power2.in' });
      g.fromTo(entra, { autoAlpha: 0, scale: perto ? .72 : 1.25, filter: 'brightness(.4)' }, { autoAlpha: 1, scale: 1, filter: 'brightness(1)', duration: 1.6, ease: EX, delay: .35, clearProps: 'filter' });
    }
    viagem.addEventListener('viagem:etapa', aoMudar);
    limpar.push(function () { viagem.removeEventListener('viagem:etapa', aoMudar); g.set([mapas.geral, mapas.detalhe, luz].concat(cn), { clearProps: 'all' }); });

    /* as folhas sobem como páginas viradas; a gravura se acende como num projetor */
    etapas.forEach(function (e) {
      var folha = e.querySelector('.etapa__folha');
      var quadro = e.querySelector('.etapa__fig .quadro');
      var tl = g.timeline({ defaults: { ease: EX }, scrollTrigger: { trigger: e, start: 'top 85%', once: true } });
      tl.fromTo(folha, { y: 70, rotate: opt.desktop ? -1.4 : 0, autoAlpha: 0 }, { y: 0, rotate: 0, autoAlpha: 1, duration: 1.5, clearProps: 'transform,opacity,visibility' }, 0);
      if (quadro) tl.fromTo(quadro, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, clearProps: 'clipPath' }, .25)
        .fromTo(quadro.querySelector('img'), { scale: 1.25, filter: 'brightness(.3)' }, { scale: 1, filter: 'brightness(1)', duration: 2, ease: 'power2.out', clearProps: 'transform,filter' }, .25);
    });

    /* no desktop, o palco respira devagar enquanto a viagem dura */
    if (opt.desktop && palco) g.fromTo(moldura, { y: 18 }, { y: -18, ease: 'none', scrollTrigger: { trigger: viagem, start: 'top bottom', end: 'bottom top', scrub: true } });

    // estado atual (a página pode ter sido aberta no meio da viagem)
    ST.refresh();
    return function () { limpar.forEach(function (f) { try { f(); } catch (err) { /* ignorado */ } }); };
  };
})();
