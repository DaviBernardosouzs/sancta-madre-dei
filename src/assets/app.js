/*
  Melhorias progressivas: todo conteúdo permanece visível no HTML e no CSS.
  GSAP é opcional; matchMedia reverte coreografias e ScrollTriggers.
  Preferência do sistema e escolha de leitura controlam todo movimento.
  Somente enquadramento, luz e tecido decorativo se movem, nunca as figuras.
*/
(function () {
  'use strict';
  var root = document.documentElement;
  var script = document.currentScript;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignorado */ } }
  };
  /* textos de interface no idioma da página (injetados pelo build em window.SMD) */
  var SMD = window.SMD || { lang: 'pt-BR', t: {}, n: {} };
  function T(key, fallback, vars) {
    var s = SMD.t && SMD.t[key] != null ? SMD.t[key] : fallback;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return k in vars ? vars[k] : m; });
    return s;
  }
  var pluralRules; try { pluralRules = new Intl.PluralRules(SMD.lang); } catch (e) { pluralRules = null; }
  function N(key, n, fallbackOne, fallbackMany) {
    var f = SMD.n && SMD.n[key];
    var s = f ? (f[pluralRules ? pluralRules.select(n) : 'other'] || f.other) : (n === 1 ? fallbackOne : fallbackMany);
    return s.replace('{n}', n);
  }

  /* idioma escolhido manualmente: lembrado só neste aparelho */
  Array.prototype.forEach.call(document.querySelectorAll('[data-idioma]'), function (a) {
    a.addEventListener('click', function () { store.set('smd-lang', a.getAttribute('data-idioma')); });
  });
  var langMenu = document.querySelector('[data-idioma-menu]');
  if (langMenu) {
    document.addEventListener('click', function (e) { if (langMenu.open && !langMenu.contains(e.target)) langMenu.open = false; });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && langMenu.open) { langMenu.open = false; var sm = langMenu.querySelector('summary'); if (sm) sm.focus(); } });
  }

  var motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  var userMotionOff = store.get('smd-movimento') === 'off';
  var reduced = motionQuery.matches || userMotionOff;

  /* ---------- tamanho do texto ---------- */
  var pct = parseInt(store.get('smd-fonte') || '100', 10);
  document.querySelectorAll('[data-fonte]').forEach(function (b) {
    b.addEventListener('click', function () {
      var d = parseInt(b.getAttribute('data-fonte'), 10);
      pct = d === 0 ? 100 : Math.min(160, Math.max(80, pct + d));
      root.style.fontSize = pct + '%';
      store.set('smd-fonte', String(pct));
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  });

  /* ---------- menu: aberto no desktop, recolhido no celular ---------- */
  var det = document.querySelector('.menu__det');
  if (det && window.matchMedia) {
    var mq = matchMedia('(min-width: 62rem)');
    var sync = function () { det.open = false; };
    sync();
    if (mq.addEventListener) mq.addEventListener('change', sync);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && det.open) { det.open = false; det.querySelector('summary').focus(); } });
    document.addEventListener('click', function (e) { if (!det.contains(e.target)) det.open = false; });
  }

  /* sumário do capítulo: aberto no desktop, recolhido no celular */
  var toc = document.querySelector('details.toc');
  if (toc && window.matchMedia) {
    var mqt = matchMedia('(min-width: 62rem)');
    var syncToc = function () { toc.open = mqt.matches; };
    syncToc();
    if (mqt.addEventListener) mqt.addEventListener('change', syncToc);
  }

  /* ---------- modo de leitura sem distrações ---------- */
  var tg = document.querySelector('[data-leitura-toggle]');
  if (tg) {
    tg.addEventListener('click', function () {
      var on = document.body.classList.toggle('modo-leitura');
      tg.setAttribute('aria-pressed', on ? 'true' : 'false');
      tg.textContent = on ? T('leituraSair', 'Sair do modo de leitura') : T('leituraEntrar', 'Modo de leitura sem distrações');
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('modo-leitura')) tg.click();
    });
  }

  /* ---------- busca e filtros (lógica em filtro.js) ---------- */
  var F = window.SMDFiltro;
  if (F) document.querySelectorAll('[data-filter-form]').forEach(function (form) {
    var main = form.closest('.pagina') || document;
    var items = Array.prototype.slice.call(main.querySelectorAll('[data-filter-list] > [data-item]'));
    var count = main.querySelector('[data-contagem]');
    var empty = main.querySelector('[data-vazio]');
    var byRef = {};
    items.forEach(function (it) { var r = it.getAttribute('data-ref'); if (r) byRef[r] = it; });
    var q = form.querySelector('input[name="q"]');
    var fields = Array.prototype.slice.call(form.querySelectorAll('select[data-field]'));

    function apply() {
      var filters = {};
      fields.forEach(function (f) { filters[f.getAttribute('data-field')] = f.value; });
      var shown = 0;
      items.forEach(function (it) {
        var attrs = {};
        fields.forEach(function (f) { var k = f.getAttribute('data-field'); attrs[k] = it.getAttribute('data-' + k); });
        var ok = F.match({ text: it.getAttribute('data-text'), attrs: attrs }, q ? q.value : '', filters);
        it.hidden = !ok;
        if (ok) shown++;
      });
      main.querySelectorAll('[data-ponto]').forEach(function (pt) { var it = byRef[pt.getAttribute('data-ponto')]; pt.style.display = it && it.hidden ? 'none' : ''; });
      if (count) count.textContent = N('resultados', shown, '{n} resultado', '{n} resultados');
      if (empty) empty.hidden = shown !== 0;
      var rostos = main.querySelectorAll('[data-retrato]');
      if (rostos.length) {
        var vis = 0;
        rostos.forEach(function (r) {
          var ok = (!filters.pais || r.getAttribute('data-pais') === filters.pais) && (!filters.regiao || r.getAttribute('data-regiao') === filters.regiao);
          r.hidden = !ok; if (ok) vis++;
        });
        var rv = main.querySelector('[data-rostos-vazio]'); if (rv) rv.hidden = vis !== 0;
        var rl = main.querySelector('[data-rostos-rotulo]');
        if (rl) {
          var sp = form.querySelector('select[data-field="pais"]'), sr = form.querySelector('select[data-field="regiao"]');
          rl.textContent = sp && sp.value ? T('emLugar', 'em {lugar}', { lugar: sp.options[sp.selectedIndex].text }) : sr && sr.value ? T('emLugar', 'em {lugar}', { lugar: sr.options[sr.selectedIndex].text }) : T('pelomundo', 'pelo mundo');
        }
      }
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    }

    // o estado da busca e dos filtros fica na URL (compartilhável)
    function gravarUrl() {
      try {
        var sp = new URLSearchParams();
        if (q && q.value) sp.set('q', q.value);
        fields.forEach(function (f) { if (f.value) sp.set(f.getAttribute('data-field'), f.value); });
        var qs = sp.toString();
        history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
      } catch (e) { /* ignorado */ }
    }
    form.addEventListener('input', function () { apply(); gravarUrl(); });
    form.addEventListener('change', function () { apply(); gravarUrl(); });
    form.addEventListener('submit', function (e) { e.preventDefault(); apply(); });
    form.addEventListener('reset', function () { setTimeout(function () { apply(); gravarUrl(); }, 0); });

    var params = new URLSearchParams(location.search);
    if (q && params.get('q')) q.value = params.get('q');
    fields.forEach(function (f) { var v = params.get(f.getAttribute('data-field')); if (v && f.querySelector('option[value="' + v + '"]')) f.value = v; });
    apply();

    /* clique no país do mapa seleciona o país no filtro (o seletor continua sendo o equivalente por teclado) */
    var sel = form.querySelector('select[data-field="pais"]');
    var selReg = form.querySelector('select[data-field="regiao"]');
    var rot = main.querySelector('[data-pais-rotulo]');
    var mapa = main.querySelector('[data-mapa]');
    function rotulo() { if (rot) rot.textContent = sel && sel.value ? '(' + sel.options[sel.selectedIndex].text + ')' : ''; }
    if (sel) {
      sel.addEventListener('change', rotulo); form.addEventListener('reset', function () { setTimeout(rotulo, 0); }); rotulo();
      main.querySelectorAll('path[data-pais]').forEach(function (p) {
        p.addEventListener('click', function () {
          var v = p.getAttribute('data-pais');
          sel.value = sel.value === v ? '' : v;
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });
      var marca = function () { main.querySelectorAll('path[data-pais]').forEach(function (p) { p.classList.toggle('pais--sel', p.getAttribute('data-pais') === sel.value); }); };
      sel.addEventListener('change', marca); form.addEventListener('reset', function () { setTimeout(marca, 0); }); marca();
    }

    /* ---------- mapa: aproximação suave, ficha ao passar sobre os pontos ---------- */
    if (mapa) {
      var svg = mapa.querySelector('svg');
      var inicial = svg.getAttribute('data-vb-inicial').split(' ').map(Number);
      var W = inicial[2], H = inicial[3];
      var atual = inicial.slice();
      var voltar = mapa.querySelector('[data-mapa-voltar]');
      var ficha = mapa.querySelector('[data-mapa-ficha]');
      var aplicarVB = function (vb) {
        atual = vb;
        svg.setAttribute('viewBox', vb.map(function (n) { return n.toFixed(1); }).join(' '));
        svg.style.setProperty('--inv', (vb[2] / W).toFixed(4));
      };
      // enquadra uma caixa mantendo a proporção do mapa, com margem e zoom máximo
      var enquadrar = function (x, y, w, h) {
        var m = Math.max(w, h) * 0.22 + 10;
        var nw = Math.max(w + m * 2, (h + m * 2) * W / H, 110), nh = nw * H / W;
        nw = Math.min(nw, W); nh = Math.min(nh, H);
        var nx = Math.min(Math.max(x + w / 2 - nw / 2, 0), W - nw), ny = Math.min(Math.max(y + h / 2 - nh / 2, 0), H - nh);
        return [nx, ny, nw, nh];
      };
      var irPara = function (vb) {
        var g = window.gsap;
        var anima = g && !root.classList.contains('sem-movimento') && !motionQuery.matches;
        if (voltar) voltar.hidden = vb[2] >= W - 1;
        mapa.classList.toggle('mapa--perto', !!(sel && sel.value));
        if (!anima) { aplicarVB(vb); return; }
        var o = { x: atual[0], y: atual[1], w: atual[2], h: atual[3] };
        g.to(o, { x: vb[0], y: vb[1], w: vb[2], h: vb[3], duration: 1.4, ease: 'power3.inOut', overwrite: true, onUpdate: function () { aplicarVB([o.x, o.y, o.w, o.h]); } });
      };
      var focar = function () {
        if (sel && sel.value) {
          var p = svg.querySelector('path[data-pais="' + sel.value + '"]');
          if (p) { var c = p.getAttribute('data-caixa').split(' ').map(Number); return irPara(enquadrar(c[0], c[1], c[2], c[3])); }
        }
        if (selReg && selReg.value) {
          var pts = Array.prototype.filter.call(svg.querySelectorAll('[data-regiao-ponto]'), function (a) { return a.getAttribute('data-regiao-ponto') === selReg.value; });
          if (pts.length) {
            var xs = [], ys = [];
            pts.forEach(function (a) { var m = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(a.getAttribute('transform')); xs.push(+m[1]); ys.push(+m[2]); });
            var x0 = Math.min.apply(null, xs), y0 = Math.min.apply(null, ys);
            return irPara(enquadrar(x0, y0, Math.max.apply(null, xs) - x0, Math.max.apply(null, ys) - y0));
          }
        }
        irPara(inicial.slice());
      };
      [sel, selReg].forEach(function (s) { if (s) s.addEventListener('change', focar); });
      form.addEventListener('reset', function () { setTimeout(focar, 0); });
      if (voltar) voltar.addEventListener('click', function () {
        if (sel) sel.value = ''; if (selReg) selReg.value = '';
        sel.dispatchEvent(new Event('change', { bubbles: true }));
        focar();
      });
      // atalhos de região: equivalem ao seletor «Região»
      var atalhos = mapa.querySelectorAll('[data-ir-regiao]');
      var marcarAtalho = function () { atalhos.forEach(function (b) { b.setAttribute('aria-pressed', String(!sel.value && (selReg ? selReg.value : '') === b.getAttribute('data-ir-regiao'))); }); };
      atalhos.forEach(function (b) {
        b.addEventListener('click', function () {
          if (sel) sel.value = '';
          if (selReg) { selReg.value = b.getAttribute('data-ir-regiao'); selReg.dispatchEvent(new Event('change', { bubbles: true })); }
          if (sel) sel.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });
      [sel, selReg].forEach(function (s) { if (s) s.addEventListener('change', marcarAtalho); });
      form.addEventListener('reset', function () { setTimeout(marcarAtalho, 0); });
      marcarAtalho();
      aplicarVB(inicial.slice());
      if ((sel && sel.value) || (selReg && selReg.value)) focar();

      // ficha flutuante: nome, tipo, lugar e imagem do ponto
      var mostrar = function (a) {
        if (!ficha) return;
        var img = ficha.querySelector('.mapa__ficha-img');
        var src = a.getAttribute('data-img');
        img.innerHTML = src ? '<img src="' + src + '" alt="" width="64" height="80">' : '';
        img.hidden = !src;
        ficha.querySelector('strong').textContent = a.getAttribute('data-nome');
        ficha.querySelector('.mapa__ficha-txt span').textContent = a.getAttribute('data-sub');
        ficha.hidden = false;
        var palco = mapa.querySelector('.mapa__palco').getBoundingClientRect();
        var r = a.getBoundingClientRect();
        var fx = r.left + r.width / 2 - palco.left, fy = r.top - palco.top;
        var lado = fx > palco.width - 260 ? 'esq' : 'dir';
        ficha.style.left = (lado === 'dir' ? fx + 14 : fx - 14 - ficha.offsetWidth) + 'px';
        ficha.style.top = Math.max(6, fy - ficha.offsetHeight - 6) + 'px';
      };
      var esconder = function () { if (ficha) ficha.hidden = true; };
      svg.querySelectorAll('[data-ponto]').forEach(function (a) {
        a.addEventListener('mouseenter', function () { mostrar(a); });
        a.addEventListener('focus', function () { mostrar(a); });
        a.addEventListener('mouseleave', esconder);
        a.addEventListener('blur', esconder);
      });
    }
  });

  /* ---------- visualização ampliada das obras ---------- */
  var dlg = document.getElementById('lb');
  var obras = null, idx = 0, opener = null;
  var $ = function (sel) { return dlg.querySelector(sel); };
  var canTween = function () { return !!window.gsap && !reduced; };

  function carregar() {
    if (obras) return Promise.resolve(obras);
    return fetch(script.getAttribute('data-obras')).then(function (r) { if (!r.ok) throw new Error('obras'); return r.json(); }).then(function (d) { obras = d; return d; });
  }
  function mostrar(i, animar) {
    var o = obras[i];
    idx = i;
    var im = $('[data-lb-img]');
    var troca = function () {
      im.removeAttribute('srcset');
      im.src = o.src;
      im.srcset = o.srcset;
      im.sizes = '(min-width: 62rem) 62vw, 100vw';
      im.width = o.w; im.height = o.h; im.alt = o.alt;
      $('[data-lb-titulo]').textContent = o.titulo;
      $('[data-lb-meta]').textContent = o.autor + ', ' + o.data + '. ' + o.tecnica + '. ' + o.instituicao + '.';
      $('[data-lb-alt]').textContent = o.alt;
      $('[data-lb-cred]').textContent = T('lbLicenca', 'Licença: {licenca}', { licenca: o.licenca }) + (o.acesso ? '. ' + T('lbAcesso', 'Número de acesso: {acesso}', { acesso: o.acesso }) : '') + '. ' + T('lbOrigem', 'Origem: {origem}', { origem: o.origem }) + '.';
      $('[data-lb-link]').href = o.url;
      $('[data-lb-contagem]').textContent = T('lbContagem', 'Obra {n} de {total}', { n: i + 1, total: obras.length });
      var prox = obras[(i + 1) % obras.length], ant = obras[(i - 1 + obras.length) % obras.length];
      [prox, ant].forEach(function (x) { var p = new Image(); p.src = x.src; });
    };
    if (animar && canTween()) {
      var g = window.gsap;
      g.to([$('.lb__img'), $('.lb__legenda')], { opacity: 0, duration: 0.18, ease: 'power1.in', onComplete: function () {
        troca();
        g.fromTo($('.lb__img'), { opacity: 0, scale: 0.985 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out', clearProps: 'transform' });
        g.fromTo($('.lb__legenda'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', delay: 0.08, clearProps: 'transform' });
      } });
    } else troca();
  }
  function abrir(id, gatilho) {
    if (!dlg || typeof dlg.showModal !== 'function') { location.href = gatilho.href; return; }
    carregar().then(function (lista) {
      var i = lista.findIndex(function (o) { return o.id === id; });
      if (i < 0) { location.href = gatilho.href; return; }
      opener = gatilho;
      mostrar(i, false);
      dlg.showModal();
      document.body.classList.add('com-lb');
      if (canTween()) {
        var g = window.gsap;
        g.fromTo(dlg, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power1.out', clearProps: 'opacity' });
        g.fromTo($('.lb__img'), { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out', clearProps: 'transform' });
        g.fromTo($('.lb__legenda'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.12, clearProps: 'transform' });
      }
      $('[data-lb-fechar]').focus();
    }).catch(function () { location.href = gatilho.href; });
  }
  function fechar() { if (dlg.open) dlg.close(); }
  if (dlg) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('[data-lightbox]');
      if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      abrir(a.getAttribute('data-lightbox'), a);
    });
    $('[data-lb-fechar]').addEventListener('click', fechar);
    $('[data-lb-prox]').addEventListener('click', function () { mostrar((idx + 1) % obras.length, true); });
    $('[data-lb-ant]').addEventListener('click', function () { mostrar((idx - 1 + obras.length) % obras.length, true); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.classList.contains('lb__in') || e.target.classList.contains('lb__palco')) fechar(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); $('[data-lb-prox]').click(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); $('[data-lb-ant]').click(); }
    });
    dlg.addEventListener('close', function () {
      document.body.classList.remove('com-lb');
      if (opener && document.contains(opener)) opener.focus();
    });
  }

  /* ---------- movimento opcional, com ciclo de vida único ---------- */
  var motionMedia = null;
  var motionButtons = document.querySelectorAll('[data-motion-toggle]');
  var clothButton = document.querySelector('[data-manto-pause]');
  var clothPaused = false;

  function updateControls() {
    reduced = motionQuery.matches || userMotionOff;
    root.classList.toggle('sem-movimento', reduced);
    motionButtons.forEach(function (button) {
      button.hidden = false;
      button.setAttribute('aria-pressed', String(reduced));
      button.textContent = reduced ? (motionQuery.matches ? T('movSistema', 'Movimento reduzido pelo sistema') : T('movAtivar', 'Ativar animações')) : T('movLer', 'Ler sem animações');
      button.disabled = motionQuery.matches;
    });
    if (clothButton) {
      clothButton.hidden = reduced || !window.gsap || !window.ScrollTrigger;
      clothButton.setAttribute('aria-pressed', String(clothPaused));
      clothButton.textContent = clothPaused ? T('retomar', 'Retomar o céu estrelado') : T('pausar', 'Pausar o céu estrelado');
    }
  }

  function stopMotion() {
    if (motionMedia) { motionMedia.revert(); motionMedia = null; }
    root.classList.remove('anim');
    // Complete any dialog transition before switching to static reading.
    if (window.gsap && dlg) {
      window.gsap.killTweensOf([dlg, $('.lb__img'), $('.lb__legenda')], true);
      window.gsap.set([dlg, $('.lb__img'), $('.lb__legenda')], { clearProps: 'opacity,transform,visibility' });
    }
  }

  function startMotion() {
    if (motionMedia) { motionMedia.revert(); motionMedia = null; }
    updateControls();
    var g = window.gsap, ST = window.ScrollTrigger;
    if (reduced || !g || !ST) {
      stopMotion();
      // sem GSAP, o filme não acontece: nenhum estado inicial pode ficar escondido
      if (!reduced) root.classList.add('anim-off');
      return;
    }
    try {
      g.registerPlugin(ST);
      g.globalTimeline.paused(document.hidden);
      motionMedia = g.matchMedia();
      motionMedia.add({ desktop: '(min-width: 900px)', mobile: '(max-width: 899px)', reduce: '(prefers-reduced-motion: reduce)' }, function (ctx) {
        if (ctx.conditions.reduce || reduced) return;
        var desktop = ctx.conditions.desktop;
        root.classList.add('anim');
        // a direção de movimento (prólogo, atos, revelações, aberturas) vive em filme.js
        var fim = window.SMDFilme ? window.SMDFilme(g, ST, { desktop: desktop }) : null;
        if (desktop) document.querySelectorAll('[data-parallax]').forEach(function (box) {
          var im = box.querySelector('img');
          if (im) g.fromTo(im, { y: -10, scale: 1.05 }, { y: 10, ease: 'none', scrollTrigger: { trigger: box.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
        var cron = document.querySelector('[data-cron]');
        if (cron) g.fromTo(cron.querySelector('.cronologia__fio'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: cron, start: 'top 65%', end: 'bottom 65%', scrub: true } });
        return function () { if (fim) fim(); };
      });
      if (document.fonts) document.fonts.ready.then(function () { if (motionMedia) ST.refresh(); });
    } catch (error) {
      stopMotion();
      root.classList.add('sem-movimento', 'anim-off');
    }
  }

  motionButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      userMotionOff = !userMotionOff;
      store.set('smd-movimento', userMotionOff ? 'off' : 'on');
      startMotion();
    });
  });
  if (clothButton) clothButton.addEventListener('click', function () {
    clothPaused = !clothPaused;
    updateControls();
  });
  motionQuery.addEventListener('change', startMotion);
  document.addEventListener('visibilitychange', function () {
    if (window.gsap) window.gsap.globalTimeline.paused(document.hidden);
  });
  window.addEventListener('load', function () { if (motionMedia) window.ScrollTrigger.refresh(); });
  window.addEventListener('pagehide', stopMotion);
  window.addEventListener('pageshow', function (event) { if (event.persisted) startMotion(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startMotion, { once: true });
  else startMotion();
})();
