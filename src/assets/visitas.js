/* Contador de visitas: em produção, registra este acesso e mostra os totais no rodapé.
   Anônimo: sem cookies e sem armazenamento no aparelho; o servidor não guarda IP (ver worker/index.js).
   Fora de produção (localhost, arquivo local, testes automatizados) só lê, nunca conta. */
(function () {
  'use strict';
  var box = document.querySelector('[data-visitas]');
  if (!box || !window.fetch) return;
  var SMD = window.SMD || { lang: 'pt-BR', n: {} };
  var local = location.protocol !== 'https:' || /^(localhost|127\.|\[::1\]|0\.0\.0\.0)/.test(location.hostname);
  var naoConta = local || navigator.webdriver || navigator.globalPrivacyControl === true || navigator.doNotTrack === '1';
  if (local) return;
  var regras; try { regras = new Intl.PluralRules(SMD.lang); } catch (e) { regras = null; }
  var fmt; try { fmt = new Intl.NumberFormat(SMD.lang); } catch (e) { fmt = { format: String }; }
  function plural(chave, n) {
    var f = (SMD.n && SMD.n[chave]) || { other: '{n}' };
    return (f[regras ? regras.select(n) : 'other'] || f.other).replace('{n}', fmt.format(n));
  }
  fetch('/api/visitas', naoConta ? { credentials: 'omit' } : { method: 'POST', credentials: 'omit', keepalive: true })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d || typeof d.visitantes !== 'number') return;
      var n = box.querySelector('[data-visitas-n]'), a = box.querySelector('[data-visitas-a]');
      a.textContent = plural('acessos', d.acessos);
      box.hidden = false;
      var root = document.documentElement, g = window.gsap;
      var mover = g && root.classList.contains('anim') && !root.classList.contains('sem-movimento') && !matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!mover) { n.textContent = plural('visitantes', d.visitantes); return; }
      // o número sobe até o total quando o rodapé aparece
      var o = { v: 0 };
      n.textContent = plural('visitantes', 0);
      var io = new IntersectionObserver(function (e) {
        if (!e[0].isIntersecting) return;
        io.disconnect();
        g.to(o, { v: d.visitantes, duration: 2.2, ease: 'power3.out', onUpdate: function () { n.textContent = plural('visitantes', Math.round(o.v)); }, onComplete: function () { n.textContent = plural('visitantes', d.visitantes); } });
      });
      io.observe(box);
    })
    .catch(function () { /* sem contador: o rodapé segue igual */ });
})();
