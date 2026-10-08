/* Área de estudo: leitura em paralelo, filtros por grupo e passos (Éfeso). Sem JavaScript, tudo aparece aberto. */
(function () {
  'use strict';
  var q = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  /* movimento só quando a camada cinematográfica está ligada (app.js tira .anim ao desligar) */
  var podeMover = function () { return !!window.gsap && root.classList.contains('anim') && !root.classList.contains('anim-off') && !root.classList.contains('sem-movimento') && !matchMedia('(prefers-reduced-motion: reduce)').matches; };
  /* troca de estado: o conteúdo novo assenta suavemente, sem deslocar o layout */
  var assentar = function (els) {
    if (!els.length || !podeMover()) return;
    window.gsap.fromTo(els, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .6, stagger: { each: .025, amount: .3 }, ease: 'power3.out', clearProps: 'opacity,visibility,transform' });
  };

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
        assentar(q('.paralelo__par > p', box));
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
        assentar(itens.filter(function (it) { return !it.hidden; }).slice(0, 12));
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

  /*
    Coreografia da área de estudo. Chamada por filme.js dentro de gsap.matchMedia(), então tudo é revertido
    junto com o resto do site ("Ler sem animações", movimento reduzido, troca de tamanho de tela).
    Princípio: o texto nunca depende do movimento. Cada animação diz uma coisa: a ordem de leitura (cascatas),
    o percurso no tempo (fio que se desenha), o caminho escolhido (realce ao passar).
  */
  window.SMDEstudoFilme = function (g, ST, opt) {
    if (!document.querySelector('main .estudo')) return null;
    var limpar = [];
    var EX = 'expo.out', P3 = 'power3.out';
    var uma = function (trigger, start) { return { trigger: trigger, start: start || 'top 85%', once: true }; };

    /* índice: cada movimento abre como um ato; o numeral surge da bruma, os caminhos sobem em cascata
       e as obras se acendem como num projetor */
    q('[data-mov]').forEach(function (mov) {
      var n = mov.querySelector('.mov__fio'), lede = mov.querySelector('.mov__cab p');
      var tl = g.timeline({ defaults: { ease: EX }, scrollTrigger: uma(mov, 'top 82%') });
      if (n) tl.fromTo(n, { scaleX: 0 }, { scaleX: 1, duration: 1.6, clearProps: 'transform' }, 0);
      if (lede) tl.fromTo(lede, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1.2, clearProps: 'transform' }, .45);
      ST.batch(q('.sm', mov), {
        start: 'top 92%', once: true, interval: .1,
        onEnter: function (b) {
          g.fromTo(b, { autoAlpha: 0, y: 42 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: .09, ease: EX, clearProps: 'transform' });
          var obras = b.map(function (li) { return li.querySelector('.sm__obra'); }).filter(Boolean);
          g.fromTo(obras, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, stagger: .09, delay: .15, ease: EX, clearProps: 'clipPath' });
          g.fromTo(obras.map(function (o) { return o.querySelector('img'); }), { scale: 1.3, filter: 'brightness(.35)' }, { scale: 1.04, filter: 'brightness(1)', duration: 2, stagger: .09, delay: .15, ease: 'power2.out', clearProps: 'transform,filter' });
        }
      });
    });

    /* linhas do tempo: o fio de ouro acompanha a leitura e cada marco acende quando é alcançado */
    q('[data-lt]').forEach(function (lt) {
      var fio = lt.querySelector('.lt__fio');
      var itens = q('.linha-tempo > li', lt);
      lt.classList.add('lt--vivo');
      limpar.push(function () { lt.classList.remove('lt--vivo'); itens.forEach(function (li) { li.classList.remove('lt-on'); }); });
      if (fio) g.fromTo(fio, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: lt, start: 'top 72%', end: 'bottom 72%', scrub: .6 } });
      itens.forEach(function (li) {
        ST.create({ trigger: li, start: 'top 72%', onEnter: function () { li.classList.add('lt-on'); }, onLeaveBack: function () { li.classList.remove('lt-on'); } });
        g.fromTo(li.children, { autoAlpha: 0, x: function (i) { return i === 0 ? 14 : -14; } }, { autoAlpha: 1, x: 0, duration: 1.1, stagger: .08, ease: EX, clearProps: 'transform', scrollTrigger: uma(li, 'top 88%') });
      });
    });

    /* tríptico de níveis: o lugar se apresenta, depois as três perguntas se abrem da esquerda para a direita */
    q('main .cartao').forEach(function (c) {
      var cab = q('.cartao__nome, .cartao__sub', c);
      var niveis = q('.nivel', c);
      var resto = q(':scope > *', c).filter(function (el) { return cab.indexOf(el) < 0 && !el.querySelector('.nivel') && !el.classList.contains('niveis'); });
      var tl = g.timeline({ defaults: { ease: EX }, scrollTrigger: uma(c, 'top 82%') });
      if (cab.length) tl.fromTo(cab, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: .08, clearProps: 'transform' }, 0);
      if (niveis.length) tl.fromTo(niveis, { autoAlpha: 0, y: 36, clipPath: 'inset(0% 0% 100% 0%)' }, { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, stagger: .14, clearProps: 'transform,clipPath' }, .25);
      if (resto.length) tl.fromTo(resto, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, stagger: .05 }, .7);
    });

    /* os quatro dogmas: placas que se erguem; o ano sobe de dentro da placa */
    var dg = q('.dogmas-lista > li');
    if (dg.length) ST.batch(dg, {
      start: 'top 90%', once: true,
      onEnter: function (b) {
        g.fromTo(b, { autoAlpha: 0, y: 56, scale: .97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.4, stagger: .12, ease: EX, clearProps: 'transform' });
        g.fromTo(b.map(function (li) { return li.querySelector('.dg__ano'); }), { yPercent: 70, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.4, stagger: .12, delay: .2, ease: EX, clearProps: 'transform' });
      }
    });

    /* etiquetas de origem: aparecem uma a uma, como fichas postas sobre a mesa */
    q('main .estudo .bases').forEach(function (ul) {
      g.fromTo(ul.children, { autoAlpha: 0, y: 10, scale: .96 }, { autoAlpha: 1, y: 0, scale: 1, duration: .8, stagger: .06, ease: P3, clearProps: 'transform', scrollTrigger: uma(ul, 'top 92%') });
    });

    /* texto em paralelo: o latim surge primeiro, a tradução vem logo atrás, verso a verso */
    q('main [data-paralelo]').forEach(function (box) {
      var la = q('.paralelo__la', box), pt = q('.paralelo__pt', box);
      var tl = g.timeline({ defaults: { ease: 'power2.out' }, scrollTrigger: uma(box, 'top 85%') });
      tl.fromTo(box, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, clearProps: 'transform' }, 0)
        .fromTo(la, { autoAlpha: 0, y: 10, filter: 'blur(4px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.1, stagger: .1, clearProps: 'filter,transform' }, .2)
        .fromTo(pt, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 1, stagger: .1, clearProps: 'transform' }, .45);
    });

    /* blocos de leitura: entram em cascata, na ordem em que se lê */
    var blocos = q('main .estudo .conc, main .estudo .padre, main .estudo .tema, main .estudo .ordem, main .estudo .doc, main .estudo .oracao-la, main .estudo .passagem, main .estudo .glossario > div, main .estudo .grade-cartoes > li, main .estudo .citacao, main .estudo .dm__lado, main .estudo .cuidado, main .estudo .passos__lista > li, main .estudo .lista-ctrv > li, main .estudo .dogma-nav li');
    if (blocos.length) ST.batch(blocos, {
      start: 'top 92%', once: true, interval: .1, batchMax: 8,
      onEnter: function (b) { g.fromTo(b, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: .07, ease: EX, clearProps: 'transform' }); }
    });

    /* Éfeso: as delegações traçam o caminho até a cidade, que se acende por último */
    var vis = document.querySelector('.efeso__visual');
    if (vis) {
      var fundos = q('.ef-rota__fundo', vis), linhas = q('.ef-rota__linha', vis);
      var pontos = q('.ef-cidade__ponto, .ef-cidade__halo', vis), nomes = q('.ef-cidade text', vis);
      var tl = g.timeline({ scrollTrigger: uma(vis, 'top 78%') });
      fundos.forEach(function (f, i) {
        var len = f.getTotalLength ? f.getTotalLength() : 0;
        if (len) tl.fromTo(f, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', clearProps: 'strokeDasharray,strokeDashoffset' }, .2 + i * .18);
      });
      tl.fromTo(pontos, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: .8, stagger: .05, ease: 'back.out(2.4)', clearProps: 'transform' }, 0)
        .fromTo(nomes, { autoAlpha: 0 }, { autoAlpha: 1, duration: .9, stagger: .05 }, .2)
        .fromTo(linhas, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, stagger: .1, clearProps: 'opacity,visibility' }, 1.4);
    }

    return function () { limpar.forEach(function (f) { try { f(); } catch (e) { /* ignorado */ } }); };
  };
})();
