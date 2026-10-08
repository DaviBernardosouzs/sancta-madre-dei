// Onde fica cada coisa no projeto. Todo script e todo módulo do gerador pega os caminhos daqui:
// para mover uma pasta, basta mudar esta tabela.
//
// ROOT é a raiz do repositório (content/, docs/, dist/, worker/ e o vault ficam lá);
// SITE é a pasta site/, com o código, os estilos, as traduções e os dados de build do site.
import { join, dirname, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SITE = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const ROOT = join(SITE, '..');

/** Caminho absoluto a partir da raiz do repositório (aceita caminhos já absolutos). */
export const daRaiz = (...partes) => (partes.length === 1 && isAbsolute(partes[0]) ? partes[0] : join(ROOT, ...partes));
const doSite = (...partes) => join(SITE, ...partes);

export const CAMINHOS = {
  /** Acervo editorial em JSON e a pesquisa documentada. Fica na raiz porque o vault também lê daqui. */
  conteudo: daRaiz('content'),
  /** Dados usados só no build, nunca publicados. */
  dados: doSite('data'),
  naturalEarth: doSite('data', 'natural-earth'),
  /** Mapa-múndi do atlas, gerado por site/scripts/ferramentas/make-map.mjs. */
  mapa: doSite('data', 'mapa'),
  /** Arquivos copiados para dist/assets/: estilos, scripts, fontes, imagens e bibliotecas. */
  ativos: doSite('src', 'assets'),
  obras: doSite('src', 'assets', 'img', 'obras'),
  /** Dicionários de interface (ui/) e traduções do conteúdo (content/). */
  i18n: doSite('i18n'),
  /** Originais das obras, baixados por fetch-art (fora do git). */
  originais: doSite('art-originals'),
  docs: daRaiz('docs'),
  capturas: daRaiz('docs', 'capturas'),
  /** Saída do site (dist/) ou do aplicativo Android (dist-app/), na raiz. OUT_DIR é relativo à raiz, ou absoluto. */
  saida: (app = false) => daRaiz(process.env.OUT_DIR ?? (app ? 'dist-app' : 'dist'))
};
