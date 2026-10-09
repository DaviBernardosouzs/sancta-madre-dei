import importlib.util,json,pathlib,unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('vault_visual',ROOT/'scripts/vault_visual.py');visual=importlib.util.module_from_spec(spec);spec.loader.exec_module(visual)
class VisualIdentity(unittest.TestCase):
    def test_all_content_types_have_colors(self):
        m=json.loads((ROOT/'sancta-mater-dei-vault/00 - Portal/manifest.json').read_text())
        self.assertTrue({n['tipo'] for n in m['notas']}<=visual.COLORS.keys())
    def test_graph_palette_matches_canvas_palette(self):
        g=visual.graph_settings()
        self.assertEqual(len(g['colorGroups']),12)
        for (label,color,kinds),group in zip(visual.PALETTE,g['colorGroups']):
            self.assertEqual(group['color']['rgb'],int(color[1:],16))
            for kind in kinds:self.assertIn('[tipo:'+kind+']',group['query'])
    def test_canvas_relations_preserved_and_restyle_idempotent(self):
        v=ROOT/'sancta-mater-dei-vault';m=json.loads((v/'00 - Portal/manifest.json').read_text());types={n['caminho']:n['tipo'] for n in m['notas']}
        for p in (v/'13 - Mapas de Conhecimento').glob('*.canvas'):
            original=json.loads(p.read_text());styled=visual.style_canvas(original,p.stem,types)
            self.assertEqual([(e['id'],e['fromNode'],e['toNode'],e.get('label')) for e in original['edges']],[(e['id'],e['fromNode'],e['toNode'],e.get('label')) for e in styled['edges']])
            self.assertEqual({n['file'] for n in original['nodes'] if n['type']=='file'},{n['file'] for n in styled['nodes'] if n['type']=='file'})
            self.assertEqual(styled,visual.style_canvas(styled,p.stem,types))
            for n in styled['nodes']:
                if n['type']=='file':self.assertEqual(n['color'],visual.COLORS[types[n['file']]])
if __name__=='__main__':unittest.main()
