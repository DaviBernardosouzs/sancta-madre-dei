import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContent, buildPublicCatalog, loadContent } from '../scripts/lib/content.mjs';
import { fresh } from './helpers.mjs';

const has = (errors, text) => errors.some((e) => e.includes(text));

test('o acervo real é válido', () => {
  assert.deepEqual(validateContent(loadContent()), []);
});

test('aparição publicada sem decisão documentada é rejeitada', () => {
  const d = fresh();
  d.apparitions[0].decisions = [];
  assert.ok(has(validateContent(d), 'precisa de decisão documentada'));
});

test('decisão sem autoridade, data ou documento é rejeitada', () => {
  for (const campo of ['authority', 'date', 'documentSourceId', 'document', 'authorityLevel', 'plain']) {
    const d = fresh();
    delete d.apparitions[0].decisions[0][campo];
    assert.ok(has(validateContent(d), campo), `faltou erro para ${campo}`);
  }
});

test('decisão com fonte inexistente é rejeitada', () => {
  const d = fresh();
  d.apparitions[0].decisions[0].documentSourceId = 'nao-existe';
  assert.ok(has(validateContent(d), 'fonte inexistente'));
});

test('data incompatível com a precisão declarada é rejeitada', () => {
  const d = fresh();
  d.apparitions[0].decisions[0].datePrecision = 'ano';
  assert.ok(has(validateContent(d), 'data incompatível'));
});

test('bloco de doutrina, história ou relato publicado sem fonte é rejeitado; nota e questão em aberto podem ficar sem fonte', () => {
  const d = fresh();
  const art = d.articles.find((a) => a.blocks.some((b) => !['nota', 'aberta'].includes(b.kind)));
  art.blocks.find((b) => !['nota', 'aberta'].includes(b.kind)).sources = [];
  assert.ok(has(validateContent(d), 'exige fonte'));
  const ok = fresh();
  for (const a of ok.articles) for (const b of a.blocks) if (['nota', 'aberta'].includes(b.kind)) b.sources = [];
  assert.deepEqual(validateContent(ok), []);
});

test('expressões que atribuem ao Vaticano uma decisão diocesana são proibidas', () => {
  const d = fresh();
  d.apparitions[0].summary = 'Reconhecida pelo Vaticano em 1862.';
  assert.ok(has(validateContent(d), 'expressão proibida'));
});

test('milagre publicado exige autoridade, data, documento e fonte da decisão', () => {
  const d = fresh();
  const m = d.miracles[0];
  m.status = 'published';
  const erros = validateContent(d);
  assert.ok(has(erros, 'ecclesialDecision.authority'));
  assert.ok(has(erros, 'ecclesialDecision.date'));
  assert.ok(has(erros, 'ecclesialDecision.document'));
});

test('milagre completo e separado em três camadas pode ser publicado', () => {
  const d = fresh();
  const m = d.miracles[0];
  Object.assign(m, {
    status: 'published',
    event: { date: '2000-01-01', datePrecision: 'dia', description: 'Exemplo de teste.', sources: ['lourdes-curas'] },
    medicalInvestigation: { summary: 'Parecer de teste.', sources: ['lourdes-curas'] },
    ecclesialDecision: { authority: 'Bispo de teste', date: '2001-01-01', datePrecision: 'dia', document: 'Decreto de teste', sources: ['lourdes-curas'] }
  });
  assert.deepEqual(validateContent(d), []);
  delete m.event.sources;
  assert.ok(has(validateContent(d), 'fonte do acontecimento relatado'));
});

test('texto que oriente a interromper tratamento médico é rejeitado', () => {
  const d = fresh();
  const m = d.miracles[0];
  Object.assign(m, {
    status: 'published',
    summary: 'Interrompa o tratamento e reze.',
    event: { date: '2000', datePrecision: 'ano', description: 'x' },
    medicalInvestigation: { notDocumented: 'não documentada' },
    ecclesialDecision: { authority: 'a', date: '2001', document: 'd', sources: ['lourdes-curas'] }
  });
  assert.ok(has(validateContent(d), 'interromper tratamento'));
});

test('promessa devocional exige origem, atribuição, natureza, limites e fonte; rejeita linguagem de garantia', () => {
  const d = fresh();
  d.devotions[0].promises = [{ text: 'Quem rezar será curado com certeza.' }];
  const erros = validateContent(d);
  for (const campo of ['attributedTo', 'origin', 'natureOfAttribution', 'limits']) assert.ok(has(erros, campo), campo);
  assert.ok(has(erros, 'promessa exige fonte'));
  d.devotions[0].promises = [{ text: 'Garantia de cura.', attributedTo: 'x', origin: 'y', natureOfAttribution: 'z', limits: 'w', sources: ['lourdes-mensagem'] }];
  assert.ok(has(validateContent(d), 'garantia automática'));
});

test('oração publicada exige procedência, direitos e fonte', () => {
  const d = fresh();
  delete d.prayers[0].provenance;
  delete d.prayers[0].rights;
  d.prayers[0].sources = [];
  const erros = validateContent(d);
  assert.ok(has(erros, 'procedência ausente'));
  assert.ok(has(erros, 'direitos ausente'));
  assert.ok(has(erros, 'fonte ausente'));
});

test('coordenadas só entram verificadas, com fonte e precisão', () => {
  const d = fresh();
  d.apparitions[0].place.coordinates = { lat: 43.1, lon: 0.05 };
  assert.ok(has(validateContent(d), 'coordenadas exigem'));
  d.apparitions[0].place.coordinates = { lat: 43.1, lon: 0.05, verified: true, sourceId: 'lourdes-aparicoes', precision: 'local aproximado' };
  assert.ok(has(validateContent(d), 'refersTo'), 'coordenada sem dizer a que se refere');
  d.apparitions[0].place.coordinates.refersTo = 'acontecimento';
  assert.deepEqual(validateContent(d), []);
});

test('imagem com crédito incompleto ou inexistente é rejeitada', () => {
  const d = fresh();
  delete d.images[0].author;
  assert.ok(has(validateContent(d), 'crédito incompleto: author'));
  const e = fresh();
  e.apparitions[0].imageIds = ['img-inexistente'];
  assert.ok(has(validateContent(e), 'imagem inexistente'));
});

test('slug e id duplicados são rejeitados', () => {
  const d = fresh();
  d.titles[1].slug = d.titles[0].slug;
  assert.ok(has(validateContent(d), 'slug duplicado'));
  const e = fresh();
  e.titles[1].id = e.titles[0].id;
  assert.ok(has(validateContent(e), 'id duplicado'));
});

test('rascunhos ficam fora do catálogo público', () => {
  const pub = buildPublicCatalog(loadContent());
  for (const col of ['apparitions', 'miracles', 'devotions', 'titles', 'prayers', 'articles']) {
    assert.ok(pub[col].every((r) => r.status === 'published'), col);
  }
  for (const m of loadContent().miracles.filter((r) => r.status !== 'published')) assert.ok(!pub.miracles.some((x) => x.id === m.id), m.id);
  assert.ok(!pub.devotions.some((d) => d.id === 'dev-quinze-promessas-rosario'));
});

test('registro publicado não pode apontar para rascunho; relação para id inexistente é rejeitada', () => {
  const d = fresh();
  d.apparitions[0].relations.miracles = ['mil-lourdes-latapie'];
  assert.ok(has(validateContent(d), 'referencia rascunho'));
  const e = fresh();
  e.apparitions[0].relations.titles = ['tit-nao-existe'];
  assert.ok(has(validateContent(e), 'id inexistente'));
});

test('obra do Met exige número de acesso, linha de crédito e objectId', () => {
  for (const campo of ['accession', 'creditLine']) {
    const d = fresh();
    const im = d.images.find((i) => i.source.type === 'met');
    delete im[campo];
    assert.ok(has(validateContent(d), `crédito incompleto: ${campo}`), campo);
  }
  const e = fresh();
  delete e.images.find((i) => i.source.type === 'met').source.objectId;
  assert.ok(has(validateContent(e), 'source.objectId ausente'));
});

test('imagem exige licença, URL de origem, data de consulta e ponto focal', () => {
  for (const campo of ['license', 'licenseUrl', 'originUrl', 'retrievedDate', 'rightsNote', 'alt', 'caption']) {
    const d = fresh();
    delete d.images[0][campo];
    assert.ok(has(validateContent(d), `crédito incompleto: ${campo}`), campo);
  }
  const e = fresh();
  delete e.images[0].focus;
  assert.ok(has(validateContent(e), 'crédito incompleto: focus'));
});

test('banner apontando para imagem sem crédito é rejeitado', () => {
  const d = fresh();
  d.articles[0].banner = 'obra-fantasma';
  assert.ok(has(validateContent(d), 'banner inexistente'));
});

test('recorte derivado exige obra de origem existente e variantes geradas', () => {
  const d = fresh();
  d.derivedImages[0].from = 'obra-fantasma';
  assert.ok(has(validateContent(d), 'obra de origem inexistente'));
});

test('toda obra registrada tem variantes responsivas geradas e referência a registros existentes', () => {
  const d = loadContent();
  for (const im of d.images) {
    for (const rid of im.related ?? []) {
      assert.ok(['articles', 'apparitions', 'devotions', 'titles', 'prayers', 'shrines'].some((c) => d[c].some((r) => r.id === rid)), `${im.id} -> ${rid}`);
    }
  }
});

const apar = (d, id) => d.apparitions.find((a) => a.id === id);

test('classificação eclesial: categoria precisa ser sustentada pelas decisões registradas', () => {
  let d = fresh();
  apar(d, 'apar-medjugorje-1981').ecclesialCategory = 'aparicao-reconhecida';
  assert.ok(has(validateContent(d), 'exige decisão diocesana de reconhecimento'), 'nihil obstat apresentado como aparição reconhecida');
  d = fresh();
  apar(d, 'apar-knock-1879').ecclesialCategory = 'aparicao-reconhecida';
  assert.ok(has(validateContent(d), 'exige decisão diocesana de reconhecimento'), 'inquérito apresentado como reconhecimento');
  d = fresh();
  apar(d, 'apar-montichiari-1947').ecclesialCategory = 'nihil-obstat-2024';
  assert.ok(has(validateContent(d), 'nihil-obstat-2024'), 'juízo doutrinal apresentado como nihil obstat');
  d = fresh();
  delete apar(d, 'apar-lourdes-1858').ecclesialCategory;
  assert.ok(has(validateContent(d), 'ecclesialCategory ausente'));
});

test('terminologia de 2024 não é aplicada a decisões antigas, nem a antiga a decisões novas', () => {
  let d = fresh();
  apar(d, 'apar-lourdes-1858').decisions[0].kinds.push('nihil-obstat');
  assert.ok(has(validateContent(d), 'não reclassifique decisões antigas'));
  d = fresh();
  apar(d, 'apar-medjugorje-1981').decisions[0].kinds = ['reconhecimento-da-aparicao'];
  assert.ok(has(validateContent(d), 'posterior às normas de 2024'));
});

test('cronologia da aparição exige data compatível e fonte', () => {
  const d = fresh();
  apar(d, 'apar-kibeho-1981').timeline.push({ date: '1982', precision: 'dia', kind: 'relato', text: 'x', sources: [] });
  const e = validateContent(d);
  assert.ok(has(e, 'data ausente ou incompatível'));
  assert.ok(has(e, 'exige fonte'));
});

test('pesquisa documentada não pode ligar capítulo a rascunho nem a registro inexistente', () => {
  let d = fresh();
  d.pesquisaRelacoes.capitulos['45'].registros.push('mil-lourdes-raco');
  assert.ok(has(validateContent(d), 'aponta para rascunho'));
  d = fresh();
  d.pesquisaRelacoes.capitulos['38'].registros.push('apar-nao-existe');
  assert.ok(has(validateContent(d), 'registro inexistente'));
});

test('título que aponta para página principal exige registro publicado', () => {
  const d = fresh();
  d.titles.find((t) => t.id === 'tit-kibeho').mainRecord = 'apar-beauraing-1932';
  assert.ok(has(validateContent(d), 'mainRecord deve apontar para registro publicado'));
});
