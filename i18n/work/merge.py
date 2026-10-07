#!/usr/bin/env python3
"""Junta os arquivos de trabalho (i18n/work/ui-*.txt) nos dicionários i18n/ui/<idioma>.json.
Formato: blocos "#<índice>" (índice na lista de chaves congelada) ou "#=<frase em português>" seguidos de linhas "es: ...", "en: ..." etc."""
import json, re, sys, glob, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
langs = ['es','en','fr','it','de','ja','zh']
keys = json.load(open(sys.argv[1] if len(sys.argv) > 1 else os.path.join(root,'work','keys.json')))
out = {l: {} for l in langs}
for l in langs:
    p = os.path.join(root,'ui',f'{l}.json')
    if os.path.exists(p): out[l] = json.load(open(p))
ph = re.compile(r'\{\w+\}')
tags = re.compile(r'</?(strong|em|a|code|time)\b[^>]*>')
bad = 0
for f in sorted(glob.glob(os.path.join(root,'work','ui-*.txt'))):
    cur = None; got = {}
    def flush():
        global bad
        if cur is None: return
        if set(got) != set(langs):
            print('INCOMPLETO', cur, sorted(set(langs)-set(got))); bad += 1; return
        for l in langs:
            v = got[l]
            if sorted(ph.findall(cur)) != sorted(ph.findall(v)):
                print('PLACEHOLDER', l, cur[:60], '=>', v[:60]); bad += 1
            if sorted(re.findall(r'<(\w+)', cur)) != sorted(re.findall(r'<(\w+)', v)):
                print('TAGS', l, cur[:60], '=>', v[:60]); bad += 1
            out[l][cur] = v
    for line in open(f, encoding='utf-8').read().split('\n'):
        if line.startswith('#'):
            flush(); got = {}
            h = line[1:]
            cur = h[1:] if h.startswith('=') else keys[int(h)]
        elif re.match(r'^(es|en|fr|it|de|ja|zh): ', line):
            got[line[:2]] = line[4:]
        elif line.strip() == '' or line.startswith('//'): pass
        else: print('LINHA?', f, line[:60]); bad += 1
    flush()
os.makedirs(os.path.join(root,'ui'), exist_ok=True)
for l in langs:
    json.dump(dict(sorted(out[l].items())), open(os.path.join(root,'ui',f'{l}.json'),'w',encoding='utf-8'), ensure_ascii=False, indent=1)
    open(os.path.join(root,'ui',f'{l}.json'),'a').write('\n')
print('ok' if not bad else f'{bad} problemas', {l: len(out[l]) for l in langs})
