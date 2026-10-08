#!/usr/bin/env node
// Servidor estático mínimo para visualizar dist/ localmente (sem dependências).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { CAMINHOS } from '../lib/caminhos.mjs';

const DIST = CAMINHOS.saida();
const PORT = Number(process.env.PORT ?? 4173);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };

createServer(async (req, res) => {
  try {
    let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
    let file = join(DIST, p);
    if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, 'index.html');
    const data = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    const nf = await readFile(join(DIST, '404.html')).catch(() => 'Não encontrado');
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    res.end(nf);
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
