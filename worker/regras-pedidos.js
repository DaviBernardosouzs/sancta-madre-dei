// Regras de um pedido de oração: limites, limpeza do texto e validação. Sem dependências do Cloudflare,
// para poder ser testado com node:test (site/tests/pedidos.test.mjs).

export const LIMITES = {
  nome: [1, 60],
  texto: [3, 600],
  porPessoa: 5,        // pedidos por pessoa na semana
  total: 400,          // pedidos no mural por semana
  denuncias: 3         // denúncias de pessoas diferentes que tiram um pedido do mural
};

/** Texto limpo: sem caracteres de controle, espaços repetidos nem quebras em excesso. */
export function limpar(texto, { linhas = false } = {}) {
  let s = String(texto ?? '').normalize('NFC').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩]/g, '');
  s = linhas ? s.replace(/\r\n?/g, '\n').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n') : s.replace(/\s+/g, ' ');
  return s.trim();
}

const LINK = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|br|info|xyz|ru|io|me|ly)\b)/i;

/** Confere nome e pedido; devolve { nome, texto } ou { erro }. */
export function validar(dados) {
  const nome = limpar(dados?.nome);
  const texto = limpar(dados?.texto, { linhas: true });
  if (dados?.site) return { erro: 'spam' }; // campo escondido: só robôs o preenchem
  if (nome.length < LIMITES.nome[0] || nome.length > LIMITES.nome[1]) return { erro: 'nome' };
  if (texto.length < LIMITES.texto[0] || texto.length > LIMITES.texto[1]) return { erro: 'texto' };
  if (LINK.test(nome) || LINK.test(texto)) return { erro: 'link' };
  return { nome, texto };
}
