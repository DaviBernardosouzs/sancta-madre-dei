#!/usr/bin/env node
// Gera as variantes WebP responsivas em site/src/assets/img/obras/ e o manifesto (manifest.json).
// Requer ImageMagick (comando "magick") e os originais em art-originals/ (veja fetch-art.mjs).
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { CAMINHOS } from '../lib/caminhos.mjs';

const WIDTHS = [480, 800, 1280, 1800];
const out = CAMINHOS.obras;
const onlyDerived = process.argv.includes('--only-derived');
if (!onlyDerived) rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const { images, derived } = JSON.parse(readFileSync(join(CAMINHOS.conteudo, 'images.json'), 'utf8'));
const magick = (...args) => execFileSync('magick', args, { stdio: ['ignore', 'pipe', 'inherit'] }).toString().trim();
const manifest = onlyDerived ? JSON.parse(readFileSync(join(out, 'manifest.json'), 'utf8')) : {};
const tmp = join(CAMINHOS.originais, '.tmp');
mkdirSync(tmp, { recursive: true });

function base(im) {
  const name = im.source.type === 'met' ? `${im.source.objectId}.jpg` : im.source.file;
  const src = join(CAMINHOS.originais, name);
  if (!existsSync(src)) throw new Error(`original ausente: ${name} (rode npm run fetch-art)`);
  const prepared = join(tmp, `${im.id}.png`);
  const args = [src];
  if (im.process?.trim) {
    args.push('-fuzz', '7%', '-trim', '+repage');
    // sobra de fundo/sombra nas bordas dos painéis: aparo adicional de 0,6% em cada lado
    const [tw, th] = magick(...args, '-format', '%w %h', 'info:').split(' ').map(Number);
    args.push('-shave', `${Math.round(tw * (im.process.shave ?? 0.006))}x${Math.round(th * (im.process.shave ?? 0.006))}`, '+repage');
  }
  if (im.process?.inset) {
    const { l, t, r, b } = im.process.inset;
    const [w, h] = magick(...args, '-format', '%w %h', 'info:').split(' ').map(Number);
    args.push('-crop', `${Math.round(w * (1 - l - r))}x${Math.round(h * (1 - t - b))}+${Math.round(w * l)}+${Math.round(h * t)}`, '+repage');
  }
  magick(...args, prepared);
  return prepared;
}

function variants(id, src, widths) {
  const [sw, sh] = magick(src, '-format', '%w %h', 'info:').split(' ').map(Number);
  const list = widths.filter((w) => w <= sw);
  if (!list.length || list[list.length - 1] < Math.min(sw, widths[widths.length - 1])) list.push(Math.min(sw, widths[widths.length - 1]));
  for (const w of [...new Set(list)]) {
    magick(src, '-resize', `${w}x`, '-strip', '-quality', '80', '-define', 'webp:method=5', join(out, `${id.replace(':', '-')}-${w}.webp`));
  }
  const ws = [...new Set(list)];
  const top = ws[ws.length - 1];
  return { widths: ws, width: top, height: Math.round((sh * top) / sw), ratio: +(sw / sh).toFixed(4) };
}

const prepared = {};
for (const im of images) {
  if (onlyDerived && !derived.some(d => d.from === im.id)) continue;
  prepared[im.id] = base(im);
  if (onlyDerived) continue;
  manifest[im.id] = variants(im.id, prepared[im.id], WIDTHS);
  console.log('ok', im.id, manifest[im.id].width + 'x' + manifest[im.id].height);
}
// bruma: versão minúscula e suavizada de cada obra, usada como atmosfera de cor (sem filtros CSS)
for (const im of onlyDerived ? [] : images) {
  const [sw, sh] = magick(prepared[im.id], '-format', '%w %h', 'info:').split(' ').map(Number);
  const id = `${im.id}:bruma`;
  const w = 80;
  magick(prepared[im.id], '-resize', `${w}x`, '-blur', '0x2.6', '-modulate', '100,112,100', '-strip', '-quality', '72', join(out, `${id.replace(':', '-')}-${w}.webp`));
  manifest[id] = { widths: [w], width: w, height: Math.round((sh * w) / sw), ratio: +(sw / sh).toFixed(4) };
}
for (const d of derived ?? []) {
  const [sw, sh] = magick(prepared[d.from], '-format', '%w %h', 'info:').split(' ').map(Number);
  const c = d.crop;
  const crop = join(tmp, `${d.id.replace(':', '-')}.png`);
  magick(prepared[d.from], '-crop', `${Math.round(sw * c.w)}x${Math.round(sh * c.h)}+${Math.round(sw * c.x)}+${Math.round(sh * c.y)}`, '+repage', crop);
  manifest[d.id] = variants(d.id, crop, d.widths);
  console.log('ok', d.id, manifest[d.id].width + 'x' + manifest[d.id].height);
}
rmSync(tmp, { recursive: true, force: true });
writeFileSync(join(out, 'manifest.json'), JSON.stringify(manifest, null, 1));
