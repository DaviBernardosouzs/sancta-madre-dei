"""Falhas controladas em fixtures temporárias; nenhum arquivo real é alterado."""
import copy, importlib.util, json, pathlib, shutil, subprocess, sys, tempfile, unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('vault_validator',ROOT/'scripts/vault-validate.py')
validator=importlib.util.module_from_spec(spec); spec.loader.exec_module(validator)

class VaultIntegrity(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory(prefix='smd-validation-'); self.v=pathlib.Path(self.tmp.name)
        self.put('00 - Portal/A.md','---\nid: a\ntipo: estudo\ntitulo: A\nfontes_verificadas: false\nfontes:\n  - "[[B]]"\n---\n\n# A\n\nTexto único.\n')
        self.put('12 - Fontes e Bibliografia/B.md','---\nid: b\ntipo: fonte\ntitulo: B\nfontes_verificadas: false\nurl: https://example.org/primaria\n---\n\n# B\n\nFonte de teste.\n')
        self.manifest={'registros_importados':[],'relacoes':[{'origem':'a','destino':'b','tipo':'fontes','evidencia':'fixture'}],'referencias_nao_resolvidas':[]}
        self.put('00 - Portal/manifest.json',json.dumps(self.manifest)); self.put('00 - Portal/inventario-fontes.json','[]')
    def tearDown(self): self.tmp.cleanup()
    def put(self,name,text):
        p=self.v/name; p.parent.mkdir(parents=True,exist_ok=True); p.write_text(text)
    def result(self): return validator.validate(self.v)
    def rejected(self,fragment): self.assertTrue(any(fragment in e for e in self.result()['erros']),self.result()['erros'])
    def append(self,text):
        p=self.v/'00 - Portal/A.md'; p.write_text(p.read_text()+text)
    def test_valid_fixture(self): self.assertEqual(self.result()['erros'],[])
    def test_real_vault(self): self.assertEqual(validator.validate(validator.DEFAULT)['erros'],[])
    def test_broken_link(self): self.append('\n[[Entidade inexistente]]\n'); self.rejected('link interno quebrado')
    def test_invalid_yaml(self): self.put('00 - Portal/A.md','---\ntipo: [\n---\n'); self.rejected('YAML inválido')
    def test_duplicate_yaml_key(self): self.put('00 - Portal/A.md','---\ntipo: estudo\ntipo: dogma\n---\n'); self.rejected('Chave YAML repetida')
    def test_invalid_boolean(self):
        p=self.v/'00 - Portal/A.md'; p.write_text(p.read_text().replace('fontes_verificadas: false','fontes_verificadas: "false"')); self.rejected('deve ser booleano')
    def test_missing_bibliography(self):
        p=self.v/'00 - Portal/A.md'; p.write_text(p.read_text().replace('fontes:\n  - "[[B]]"','fontes: []')); self.rejected('referência bibliográfica ausente')
    def test_missing_entity(self): self.manifest['relacoes'][0]['destino']='nao-existe'; self.put('00 - Portal/manifest.json',json.dumps(self.manifest)); self.rejected('entidade inexistente')
    def test_date_order(self):
        p=self.v/'00 - Portal/A.md'; p.write_text(p.read_text().replace('tipo: estudo','tipo: estudo\ndata_inicio: 2024-05-17\ndata_fim: 2023-05-17')); self.rejected('fim anterior')
    def test_invalid_date(self):
        p=self.v/'00 - Portal/A.md'; p.write_text(p.read_text().replace('tipo: estudo','tipo: estudo\ndata_inicio: "2024-02-31"')); self.rejected('data inválida')
    def test_duplicate_name(self): self.put('Outro/A.md',(self.v/'00 - Portal/A.md').read_text().replace('id: a','id: c')); self.rejected('nomenclatura ambígua')
    def test_isolated_node(self): self.put('Órfão.md','---\nid: orfao\ntipo: guia\ntitulo: Órfão\nfontes_verificadas: false\n---\n\nSem relação.'); self.rejected('nó isolado')
    def test_invalid_base(self): self.put('16 - Bases/Teste.base','views: [\n'); self.rejected('Base inválida')
    def test_unknown_formula(self): self.put('16 - Bases/Teste.base','filters: \'tipo == "estudo"\'\nviews:\n  - type: table\n    name: Teste\n    order: [formula.inexistente]\n'); self.rejected('fórmula não definida')
    def test_invalid_canvas(self): self.put('13 - Mapas de Conhecimento/Teste.canvas',json.dumps({'nodes':[],'edges':[{'id':'0123456789abcdef','fromNode':'missing','toNode':'missing'}]})); self.rejected('aresta pendente')
    def test_original_hash(self): self.put('00 - Portal/inventario-fontes.json',json.dumps([{'caminho':'content/teste.txt','sha256':'incorreto'}])); self.rejected('cópia original ausente')
    def test_original_text_preserved(self):
        self.put('12 - Fontes e Bibliografia/Originais/content/articles.json',json.dumps([{'id':'teste','blocks':[{'text':'Texto integral que foi perdido.'}]}])); self.manifest['registros_importados']=[{'origem':'content/articles.json','id':'teste','nota':'00 - Portal/A.md'}]; self.put('00 - Portal/manifest.json',json.dumps(self.manifest)); self.rejected('bloco original truncado')
    def test_yaml_quoted_wikilink(self):
        self.put("12 - Fontes e Bibliografia/Fonte d'água.md",'---\nid: c\ntipo: fonte\ntitulo: Fonte\nfontes_verificadas: false\nurl: https://example.org/fonte\n---\n\nFonte.'); self.append("\n[[Fonte d'água]]\n"); self.assertEqual(self.result()['erros'],[])
    def test_importer_idempotence_and_preservation(self):
        with tempfile.TemporaryDirectory(prefix='smd-import-') as tmp:
            root=pathlib.Path(tmp)
            for folder in ['content','.agents/skills','sancta-mater-dei-vault']: shutil.copytree(ROOT/folder,root/folder)
            (root/'scripts').mkdir()
            for name in ['vault-build.py','vault_visual.py']: shutil.copy2(ROOT/'scripts'/name,root/'scripts'/name)
            command=[sys.executable,str(root/'scripts/vault-build.py')]
            def run(): return subprocess.run(command,cwd=root,capture_output=True,text=True)
            first=run(); self.assertEqual(first.returncode,0,first.stderr+first.stdout)
            mp=root/'sancta-mater-dei-vault/00 - Portal/manifest.json'; first_manifest=mp.read_bytes()
            second=run(); self.assertEqual(second.returncode,0,second.stderr+second.stdout); self.assertEqual(first_manifest,mp.read_bytes())
            m=json.loads(first_manifest); rel=next(p for p in m['generated_hashes'] if p.endswith('.md')); note=root/'sancta-mater-dei-vault'/rel; original=note.read_bytes(); note.write_bytes(original+b'\nContribuicao manual preservada.\n')
            edited=note.read_bytes(); rejected=run(); self.assertNotEqual(rejected.returncode,0); self.assertIn('notas geradas editadas',rejected.stderr+rejected.stdout); self.assertEqual(note.read_bytes(),edited); self.assertEqual(mp.read_bytes(),first_manifest)
            note.write_bytes(original)
            source=root/'content/articles.json'; d=json.loads(source.read_text());d[0]['summary']='Nova edicao ainda nao preservada.';source.write_text(json.dumps(d,ensure_ascii=False))
            rejected=run();self.assertNotEqual(rejected.returncode,0);self.assertIn('Fonte alterada sem cópia preservada',rejected.stderr+rejected.stdout);self.assertEqual(mp.read_bytes(),first_manifest);self.assertEqual(note.read_bytes(),original)

if __name__=='__main__': unittest.main()
