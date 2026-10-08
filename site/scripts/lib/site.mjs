// Arquivos do site inteiro (todos os idiomas): sitemap com alternativas por idioma, robots e índice de páginas.
// Cada build de idioma grava pages-<idioma>.json; aqui juntamos os que já existem.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export function finalizeSite({ OUT, BASE, SITE_URL, LOCALES, current, emitted }) {
  writeFileSync(join(OUT, `pages-${current}.json`), JSON.stringify(emitted));
  const present = LOCALES.filter((l) => existsSync(join(OUT, `pages-${l.code}.json`)));
  const pages = Object.fromEntries(present.map((l) => [l.code, JSON.parse(readFileSync(join(OUT, `pages-${l.code}.json`), 'utf8'))]));
  const loc = (l, p) => `${SITE_URL}${BASE}${l.prefix}${p}`;
  const xml = [];
  for (const l of present) {
    for (const p of pages[l.code]) {
      const alts = present.filter((x) => pages[x.code].includes(p)).map((x) => `    <xhtml:link rel="alternate" hreflang="${x.lang}" href="${loc(x, p)}"/>`);
      if (pages.pt?.includes(p)) alts.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${loc(LOCALES[0], p)}"/>`);
      xml.push(`  <url>\n    <loc>${loc(l, p)}</loc>\n${alts.join('\n')}\n  </url>`);
    }
  }
  writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${xml.join('\n')}\n</urlset>\n`);
  writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}${BASE}sitemap.xml\n`);
  writeFileSync(join(OUT, 'pages.json'), JSON.stringify({ pages: pages.pt ?? emitted, locales: pages }, null, 1));
}
