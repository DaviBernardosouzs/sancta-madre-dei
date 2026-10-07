/*
  Sancta Mater Dei · direção de movimento cinematográfica.
  Chamado por app.js dentro de gsap.matchMedia(): tudo o que é criado aqui é revertido junto
  (troca de tamanho de tela, "Ler sem animações", prefers-reduced-motion).
  Só enquadramento, luz, poeira, estrelas e tecido se movem; as figuras das obras nunca são animadas
  isoladamente, e nenhuma pintura é recortada.
*/
(function () {
  'use strict';
  /* japonês e chinês não separam palavras com espaço: usa o segmentador de palavras do navegador */
  var docLang = document.documentElement.lang || 'pt';
  var cjk = /^(ja|zh)/i.test(docLang);
  var segmenter = null;
  try { if (cjk && Intl.Segmenter) segmenter = new Intl.Segmenter(docLang, { granularity: 'word' }); } catch (e) { segmenter = null; }
  function splitWords(text) {
    if (!cjk) return text.split(/\s+/);
    if (!segmenter) return text.split('');
    var out = [];
    for (var it = segmenter.segment(text)[Symbol.iterator](), r = it.next(); !r.done; r = it.next()) { if (r.value.segment.trim()) out.push(r.value.segment); }
    return out;
  }
  var root = document.documentElement;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var primeiraEntrada = false;

  /* ---------- partículas em canvas: poeira dourada e estrelas ---------- */
  function campo(canvas, opts) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;
    var w = 0, h = 0, pts = [], raf = 0, ativo = false, visivel = false, pausado = false, t0 = 0;
    function medir() {
      var r = canvas.getBoundingClientRect();
      w = Math.max(1, r.width); h = Math.max(1, r.height);
      canvas.width = Math.round(w * DPR); canvas.height = Math.round(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      var n = Math.round(Math.min(opts.max, (w * h) / opts.densidade));
      pts = [];
      for (var i = 0; i < n; i++) pts.push(opts.nasce(w, h, i));
    }
    function quadro(t) {
      raf = 0;
      if (!ativo) return;
      if (!t0) t0 = t;
      var s = (t - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < pts.length; i++) opts.desenha(ctx, pts[i], s, w, h);
      raf = requestAnimationFrame(quadro);
    }
    function atualizar() {
      var deve = visivel && !pausado && !document.hidden;
      if (deve && !ativo) { ativo = true; raf = requestAnimationFrame(quadro); }
      if (!deve && ativo) { ativo = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
    }
    var io = new IntersectionObserver(function (e) { visivel = e[0].isIntersecting; atualizar(); }, { rootMargin: '80px' });
    var ro = window.ResizeObserver ? new ResizeObserver(function () { medir(); if (!ativo) opts.estatico && opts.estatico(ctx, pts, w, h); }) : null;
    medir();
    io.observe(canvas);
    if (ro) ro.observe(canvas);
    document.addEventListener('visibilitychange', atualizar);
    return {
      pausar: function (p) { pausado = p; atualizar(); },
      destruir: function () { ativo = false; if (raf) cancelAnimationFrame(raf); io.disconnect(); if (ro) ro.disconnect(); document.removeEventListener('visibilitychange', atualizar); ctx.clearRect(0, 0, w, h); }
    };
  }

  var poeiraCfg = {
    max: 90, densidade: 14000,
    nasce: function (w, h) { return { x: Math.random() * w, y: Math.random() * h, r: .4 + Math.random() * 1.6, v: 4 + Math.random() * 10, f: Math.random() * 6.28, a: .15 + Math.random() * .5 }; },
    desenha: function (ctx, p, s, w, h) {
      var y = (p.y - s * p.v) % h; if (y < 0) y += h;
      var x = p.x + Math.sin(s * .3 + p.f) * 14;
      var a = p.a * (.6 + .4 * Math.sin(s * .8 + p.f));
      ctx.beginPath(); ctx.fillStyle = 'rgba(240,214,149,' + a.toFixed(3) + ')';
      ctx.arc(x, y, p.r, 0, 6.283); ctx.fill();
    }
  };
  var estrelaCfg = {
    max: 140, densidade: 9000,
    nasce: function (w, h) { return { x: Math.random() * w, y: Math.random() * h, r: .5 + Math.random() * 1.3, f: Math.random() * 6.28, p: 4 + Math.random() * 7, cruz: Math.random() < .12 }; },
    desenha: function (ctx, e, s) {
      // cintilar lento (período de 4 a 11 s), nunca piscar
      var a = .35 + .5 * (.5 + .5 * Math.sin((s / e.p) * 6.283 + e.f));
      ctx.fillStyle = 'rgba(227,194,122,' + a.toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 6.283); ctx.fill();
      if (e.cruz) {
        ctx.strokeStyle = 'rgba(240,214,149,' + (a * .55).toFixed(3) + ')'; ctx.lineWidth = .6;
        ctx.beginPath(); ctx.moveTo(e.x - e.r * 4, e.y); ctx.lineTo(e.x + e.r * 4, e.y); ctx.moveTo(e.x, e.y - e.r * 4); ctx.lineTo(e.x, e.y + e.r * 4); ctx.stroke();
      }
    }
  };

  function q(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  window.SMDFilme = function (g, ST, opt) {
    var desktop = !!opt.desktop;
    var limpar = [];
    root.classList.add('f-ok');

    /* fio de progresso no topo */
    var barra = q('[data-progresso]');
    if (barra) g.to(barra, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .4 } });

    /* ---------- PRÓLOGO: o título surge da escuridão, a pintura se acende ---------- */
    var pro = q('[data-prologo]');
    if (pro) {
      var quadro = q('[data-prologo-quadro]', pro);
      var moldura = q('.f-quadro__moldura', quadro);
      var luz = q('.f-quadro__luz', quadro);
      var letras = qa('.f-letra', pro);
      var sobre = q('.f-sobre', pro);
      var resto = qa('.f-sub, .f-intro, .f-acoes, .f-legenda, .f-rolar', pro);
      var aura = q('.f-prologo__aura', pro);
      var visto = root.classList.contains('f-visto');
      if (!visto) {
        var tl = g.timeline({ defaults: { ease: 'expo.out' }, onComplete: function () { root.classList.add('f-visto'); g.set(quadro, { clearProps: 'filter' }); } });
        tl.fromTo(aura, { scale: .55, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 3.2, ease: 'sine.out' }, 0)
          .fromTo(quadro, { scale: .94, filter: 'brightness(.06) blur(8px)' }, { scale: 1, filter: 'brightness(1) blur(0px)', duration: 2.6, ease: 'power2.out' }, .1)
          .fromTo(sobre, { autoAlpha: 0, letterSpacing: '.6em' }, { autoAlpha: 1, letterSpacing: '.22em', duration: 2 }, .4)
          .fromTo(letras, { autoAlpha: 0, yPercent: 70, rotateX: -50, filter: 'blur(14px)' }, { autoAlpha: 1, yPercent: 0, rotateX: 0, filter: 'blur(0px)', duration: 1.6, stagger: .055, clearProps: 'filter,transform' }, .7)
          .fromTo(resto, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 1.3, stagger: .12, clearProps: 'transform' }, 1.7)
          .fromTo(luz, { xPercent: -120 }, { xPercent: 260, duration: 2.4, ease: 'power2.inOut' }, 2.1);
      } else {
        g.set([sobre].concat(letras, resto), { autoAlpha: 1 });
      }
      // ao rolar, a câmera se afasta: o texto sobe e esmaece, a pintura recua devagar
      g.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: pro, start: 'top top', end: 'bottom top', scrub: .6 } })
        .to(q('.f-prologo__texto', pro), { yPercent: -18, opacity: .15 }, 0)
        .to(moldura, { yPercent: 10, scale: .94 }, 0)
        .to(aura, { scale: 1.4, opacity: .2 }, 0);
      var cp = q('[data-poeira]', pro);
      var p = cp && campo(cp, poeiraCfg);
      if (p) limpar.push(p.destruir);
    }

    /* ---------- ATO I: Anunciação, cena fixa com luz que entra ---------- */
    var cena = q('[data-cena]');
    if (cena) {
      var palco = q('[data-cena-palco]', cena);
      var cq = q('[data-cena-quadro]', cena);
      var linhas = qa('[data-linha]', cena);
      var raios = q('[data-raios]', cena);
      var cluz = q('.f-quadro__luz', cena);
      if (desktop) {
        g.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: palco, start: 'top top', end: '+=130%', pin: true, scrub: 1, anticipatePin: 1 } })
          .fromTo(raios, { opacity: 0, rotate: -10, scale: 1.15 }, { opacity: .85, rotate: 0, scale: 1, duration: 1 }, 0)
          .fromTo(cq, { scale: .86, autoAlpha: .5, filter: 'brightness(.4)' }, { scale: 1, autoAlpha: 1, filter: 'brightness(1)', duration: 1 }, 0)
          .fromTo(linhas, { autoAlpha: 0, y: 46 }, { autoAlpha: 1, y: 0, duration: .5, stagger: .18 }, .35)
          .fromTo(cluz, { xPercent: -120 }, { xPercent: 260, duration: .9 }, .9)
          .to(cq, { scale: 1.03, duration: .5 }, 1.3);
      } else {
        g.fromTo(cq, { autoAlpha: .2, scale: .92, filter: 'brightness(.3)' }, { autoAlpha: 1, scale: 1, filter: 'brightness(1)', ease: 'none', scrollTrigger: { trigger: cq, start: 'top 90%', end: 'center 55%', scrub: .6 } });
        g.fromTo(linhas, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: linhas[0], start: 'top 88%', once: true } });
      }
    }

    /* ---------- ATO II: a película desliza com a rolagem ---------- */
    var pel = q('[data-pelicula]');
    if (pel) {
      var janela = q('[data-pelicula-janela]', pel);
      var trilho = q('[data-pelicula-trilho]', pel);
      var fot = qa('.f-fotograma', pel);
      var distancia = function () { return Math.max(0, trilho.scrollWidth - janela.clientWidth); };
      if (desktop && distancia() > 40) {
        pel.classList.add('f-horizontal');
        limpar.push(function () { pel.classList.remove('f-horizontal'); });
        janela.scrollLeft = 0;
        var mov = g.to(trilho, {
          x: function () { return -distancia(); }, ease: 'none',
          scrollTrigger: { trigger: pel, start: 'top top', end: function () { return '+=' + distancia(); }, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 }
        });
        // cada fotograma se acende ao passar pelo centro da tela
        fot.forEach(function (f) {
          g.fromTo(f, { autoAlpha: .45, scale: .93 }, {
            autoAlpha: 1, scale: 1, ease: 'none',
            scrollTrigger: { trigger: f, containerAnimation: mov, start: 'left 95%', end: 'center 55%', scrub: true }
          });
        });
        // foco por teclado leva a rolagem até o fotograma
        var aoFocar = function (e) {
          var li = e.target.closest && e.target.closest('.f-fotograma');
          var st = mov.scrollTrigger;
          if (!li || !st) return;
          var alvo = Math.min(1, Math.max(0, (li.offsetLeft - janela.clientWidth / 2 + li.offsetWidth / 2) / distancia()));
          window.scrollTo({ top: st.start + (st.end - st.start) * alvo, behavior: 'auto' });
        };
        trilho.addEventListener('focusin', aoFocar);
        limpar.push(function () { trilho.removeEventListener('focusin', aoFocar); });
      } else {
        ST.batch(fot, { start: 'left 100%', once: true, onEnter: function (b) { g.fromTo(b, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: .08, duration: .9, ease: 'power3.out', clearProps: 'transform' }); } });
      }
    }

    /* ---------- ATO III: manto estrelado e Ave-Maria palavra por palavra ---------- */
    var manto = q('[data-manto]');
    if (manto) {
      var ce = q('[data-estrelas]', manto);
      var ceu = ce && campo(ce, estrelaCfg);
      var botao = q('[data-manto-pause]');
      var sincronizar = function () { if (ceu && botao) ceu.pausar(botao.getAttribute('aria-pressed') === 'true'); };
      if (ceu) {
        limpar.push(ceu.destruir);
        if (botao) { botao.addEventListener('click', sincronizar); limpar.push(function () { botao.removeEventListener('click', sincronizar); }); sincronizar(); }
      }
      g.fromTo(q('.f-manto__tecido', manto), { yPercent: -5, scale: 1.08 }, { yPercent: 5, scale: 1, ease: 'none', scrollTrigger: { trigger: manto, start: 'top bottom', end: 'bottom top', scrub: true } });
      var pal = qa('[data-ave] .f-pal', manto);
      if (pal.length) g.fromTo(pal, { opacity: .18, filter: 'blur(3px)' }, { opacity: 1, filter: 'blur(0px)', ease: 'none', stagger: .06, scrollTrigger: { trigger: q('[data-ave]', manto), start: 'top 82%', end: 'bottom 48%', scrub: .5 } });
    }

    /* ---------- ATO IV: o mapa se acende ---------- */
    var mundo = q('[data-mundo]');
    if (mundo) {
      var pontos = qa('.f-ponto', mundo);
      g.fromTo(q('.f-mundo__terra', mundo), { opacity: 0 }, { opacity: 1, duration: 1.6, ease: 'power1.out', scrollTrigger: { trigger: mundo, start: 'top 75%', once: true } });
      g.fromTo(pontos, { scale: 0, autoAlpha: 0 }, {
        scale: 1, autoAlpha: 1, duration: .7, ease: 'back.out(3)', stagger: { each: .035, from: 'start' },
        scrollTrigger: { trigger: q('.f-mundo__mapa', mundo), start: 'top 72%', once: true },
        onComplete: function () {
          // alguns lugares respiram devagar
          pontos.filter(function (_, i) { return i % 5 === 0; }).forEach(function (pt, i) {
            g.to(pt, { scale: 1.6, repeat: -1, yoyo: true, duration: 2.4, ease: 'sine.inOut', delay: i * .3 });
          });
        }
      });
      qa('[data-contar]', mundo).forEach(function (dd) {
        var fim = parseInt(dd.getAttribute('data-contar'), 10) || 0;
        var o = { v: 0 };
        g.to(o, { v: fim, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: dd, start: 'top 90%', once: true }, onUpdate: function () { dd.textContent = String(Math.round(o.v)); }, onComplete: function () { dd.textContent = String(fim); } });
      });
      limpar.push(function () { qa('[data-contar]', mundo).forEach(function (dd) { dd.textContent = dd.getAttribute('data-contar'); }); });
    }

    /* ---------- CRÉDITOS: sobem com a rolagem ---------- */
    var cred = q('[data-creditos]');
    if (cred && desktop) {
      var rolo = q('[data-creditos-rolo]', cred);
      var jan = rolo.parentNode;
      cred.classList.add('f-rolando');
      limpar.push(function () { cred.classList.remove('f-rolando'); });
      g.fromTo(rolo, { y: function () { return jan.clientHeight * .6; } }, {
        y: function () { return -(rolo.scrollHeight - jan.clientHeight * .4); }, ease: 'none',
        scrollTrigger: { trigger: cred, start: 'top top', end: function () { return '+=' + Math.round(rolo.scrollHeight * 1.1); }, pin: true, scrub: 1, invalidateOnRefresh: true }
      });
    }

    /* ---------- revelações gerais (início e páginas internas) ---------- */
    var revela = qa('[data-revela], [data-reveal]');
    if (revela.length) ST.batch(revela, {
      start: 'top 88%', once: true,
      onEnter: function (b) { g.fromTo(b, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: .1, ease: 'power3.out', clearProps: 'transform' }); }
    });
    var mont = qa('.f-montagem__item .quadro');
    if (mont.length) ST.batch(mont, {
      start: 'top 90%', once: true,
      onEnter: function (b) { g.fromTo(b, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, stagger: .12, ease: 'expo.out', clearProps: 'clipPath' }); }
    });

    /* ---------- páginas internas: cada página abre como uma cena ---------- */
    if (!pro) {
      // fade a partir do preto, só na primeira entrada da página
      if (!primeiraEntrada) {
        primeiraEntrada = true;
        var cortina = document.createElement('div');
        cortina.className = 'f-cortina';
        cortina.setAttribute('aria-hidden', 'true');
        document.body.appendChild(cortina);
        g.to(cortina, { opacity: 0, duration: .9, ease: 'power2.inOut', delay: .05, onComplete: function () { cortina.remove(); } });
      }
      var capa = q('.abertura') || q('[data-cartela]');
      if (capa) {
        var h1 = q('h1', capa);
        if (h1 && !q('.pal', h1)) {
          // divide o título em palavras com máscara (o texto continua o mesmo para leitores de tela)
          h1.innerHTML = splitWords(h1.textContent.trim()).map(function (w) { return '<span class="pal"><span class="pal__i">' + w.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }) + '</span></span>'; }).join(cjk ? '' : ' ');
        }
        var pals = qa('h1 .pal__i', capa);
        var mol = q('.abertura__moldura', capa);
        var bruma = q('.abertura__bruma', capa);
        var depois = qa('.trilha, .sobretitulo, .lede, .refs, [data-h], .abertura__texto > p, .cartela__in > p', capa).filter(function (el, i, arr) { return arr.indexOf(el) === i && !el.closest('h1'); });
        var tc = g.timeline({ defaults: { ease: 'expo.out' }, delay: .15 });
        if (bruma) tc.fromTo(bruma, { scale: 1.18, autoAlpha: 0 }, { scale: 1.04, autoAlpha: 1, duration: 3.2, ease: 'power2.out' }, 0);
        if (mol) tc.fromTo(mol, { scale: .93, filter: 'brightness(.25) blur(6px)' }, { scale: 1, filter: 'brightness(1) blur(0px)', duration: 2, clearProps: 'filter,transform' }, .05);
        if (pals.length) tc.fromTo(pals, { yPercent: 118, rotate: 2 }, { yPercent: 0, rotate: 0, duration: 1.3, stagger: .07, clearProps: 'transform' }, .2);
        if (depois.length) tc.fromTo(depois, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: .08, clearProps: 'transform' }, .55);
        var luzC = q('.cartela__luz', capa);
        if (luzC) tc.fromTo(luzC, { xPercent: -60 }, { xPercent: 60, duration: 3, ease: 'power2.inOut' }, .3);
        var est = q('[data-estrelas]', capa);
        var ce2 = est && campo(est, estrelaCfg);
        if (ce2) limpar.push(ce2.destruir);
        // ao rolar, a cena recua
        var txt = q('.abertura__texto, .cartela__in', capa);
        g.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: capa, start: 'top top', end: 'bottom top', scrub: .5 } })
          .to(txt, { yPercent: -12, opacity: .35 }, 0)
          .to(q('.abertura__obra', capa) || txt, { yPercent: 8 }, 0);
      }

      // títulos de seção: um "wipe" da esquerda e um fio de ouro que se desenha
      qa('main h2').filter(function (h) { return !h.closest('[data-cartela], .abertura, .sr-only, .lb, .f-cena, .f-pelicula, .f-manto, .f-mundo, .f-creditos') && !h.classList.contains('sr-only'); }).forEach(function (h) {
        g.fromTo(h, { clipPath: 'inset(0% 100% 0% 0%)', x: -14 }, { clipPath: 'inset(0% 0% 0% 0%)', x: 0, duration: 1.3, ease: 'expo.out', clearProps: 'clipPath,transform', scrollTrigger: { trigger: h, start: 'top 90%', once: true } });
      });

      // imagens dentro do texto: acendem como num projetor
      var quadros = qa('main .fig .quadro, main .obras .quadro, main .obra__arte, main .passagem__arte, main .apar .quadro').filter(function (el) { return !el.closest('.abertura, [data-cartela]'); });
      if (quadros.length) ST.batch(quadros, { start: 'top 92%', once: true, onEnter: function (b) { g.fromTo(b, { filter: 'brightness(.3)', scale: .965 }, { filter: 'brightness(1)', scale: 1, duration: 1.6, stagger: .1, ease: 'power2.out', clearProps: 'filter,transform' }); } });

      // listas, blocos, fichas e decisões entram em cascata
      var ja = revela;
      var itens = qa('main .bloco, main .catalogo > li, main .capitulos > li, main .decisao, main .ficha > div, main .lista-celeb > li, main .relacionados__grade > div, main .fonte, main .lacunas li, main .resumo-claro, main .aviso, main .simbolos > div, main .passos > li, main .obras > *, main .passagens > li, main .metodo > div, main .verificacao')
        .filter(function (el) { return ja.indexOf(el) < 0 && !el.closest('[data-cartela], .abertura, .lb, .f-creditos'); });
      if (itens.length) ST.batch(itens, { start: 'top 92%', once: true, interval: .12, batchMax: 8, onEnter: function (b) { g.fromTo(b, { autoAlpha: 0, y: 38 }, { autoAlpha: 1, y: 0, duration: 1, stagger: .07, ease: 'power3.out', clearProps: 'transform' }); } });

      // oração em página própria: as linhas surgem como legendas
      var linhasOr = qa('.oracao__texto p, .oracao__texto li');
      if (linhasOr.length) g.fromTo(linhasOr, { autoAlpha: 0, y: 14, filter: 'blur(4px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.2, stagger: .14, ease: 'power2.out', clearProps: 'filter,transform', scrollTrigger: { trigger: linhasOr[0], start: 'top 92%', once: true } });

      // atlas: países e pontos se acendem
      var mapa = q('.mapa svg');
      if (mapa) {
        g.fromTo(qa('.pais--com', mapa), { opacity: 0 }, { opacity: 1, duration: 1.2, stagger: .03, ease: 'power1.out', clearProps: 'opacity', scrollTrigger: { trigger: mapa, start: 'top 85%', once: true } });
        g.fromTo(qa('.ponto circle', mapa), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: .7, stagger: .025, ease: 'back.out(3)', delay: .4, clearProps: 'transform', scrollTrigger: { trigger: mapa, start: 'top 85%', once: true } });
      }
    }

    // rodapé: os créditos do livro
    var rod = qa('.rodape__in > *');
    if (rod.length) g.fromTo(rod, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: .1, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: q('.rodape'), start: 'top 92%', once: true } });

    return function () { limpar.forEach(function (f) { try { f(); } catch (e) { /* ignorado */ } }); };
  };
})();
