#!/usr/bin/env node
// Gera os vídeos do site a partir dos originais do Rafael.
//
//   node scripts/preparar-videos.mjs <pasta-dos-originais> [--previas-antigas <pasta>] [--forcar]
//
// Para cada item de trabalhos.json, se <pasta>/<original> existir, gera em public/videos/:
//   <id>.mp4         vídeo inteiro, H.264, até 1080 px no lado menor, ~4,5 Mbps no máximo, com som
//   <id>-previa.mp4  6 s sem som, 480 px, para rodar em loop na grade
//   <id>.webp        capa (primeiro quadro da prévia)
// e o trecho do topo (destaque.mp4 + destaque.webp).
// Sem original, usa a prévia antiga (se houver) e o item aparece na grade sem abrir.
// Os originais NUNCA entram no repositório (passam de 100 MB). Precisa de ffmpeg no PATH.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const pastaOriginais = args.find((a) => !a.startsWith('--'));
const opc = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const forcar = args.includes('--forcar');
const previasAntigas = opc('--previas-antigas');
if (!pastaOriginais) {
  console.error('uso: node scripts/preparar-videos.mjs <pasta-dos-originais> [--previas-antigas <pasta>] [--forcar]');
  process.exit(2);
}

const dados = JSON.parse(readFileSync(join(raiz, 'trabalhos.json'), 'utf8'));
const saida = join(raiz, 'public', 'videos');
mkdirSync(saida, { recursive: true });
const manifestoPath = join(saida, 'manifesto.json');
const manifesto = existsSync(manifestoPath) ? JSON.parse(readFileSync(manifestoPath, 'utf8')) : {};

const ff = (a) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...a], { stdio: 'inherit' });
function sonda(arq) {
  const j = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:stream_side_data=rotation:format=duration', '-of', 'json', arq]).toString());
  let { width: w, height: h } = j.streams[0];
  const rot = Math.abs(j.streams[0].side_data_list?.[0]?.rotation || 0);
  if (rot === 90 || rot === 270) [w, h] = [h, w];
  return { w, h, duracao: +(+j.format.duration).toFixed(1) };
}
const novo = (alvo, fonte) => !forcar && existsSync(alvo) && statSync(alvo).mtimeMs > statSync(fonte).mtimeMs;
const mb = (a) => +(statSync(a).size / 1e6).toFixed(1);
// Lado menor limitado: 1080 no inteiro, 480 na prévia, 720 no destaque. Nunca aumenta.
const escala = (lado) => `scale='if(gt(iw,ih),-2,min(${lado},iw))':'if(gt(iw,ih),min(${lado},ih),-2)'`;

function capa(video, alvo) {
  ff(['-ss', '0.4', '-i', video, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '80', alvo]);
}

for (const t of dados.trabalhos) {
  const orig = join(pastaOriginais, t.original);
  const inteiro = join(saida, `${t.id}.mp4`);
  const previa = join(saida, `${t.id}-previa.mp4`);
  const poster = join(saida, `${t.id}.webp`);
  if (existsSync(orig)) {
    const s = sonda(orig);
    if (!novo(inteiro, orig)) {
      console.log(`${t.id}: vídeo inteiro (${s.duracao} s)...`);
      ff(['-i', orig, '-vf', `${escala(1080)},format=yuv420p`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '23',
        '-maxrate', '4500k', '-bufsize', '9000k', '-profile:v', 'high', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', inteiro]);
    }
    if (!novo(previa, orig)) {
      ff(['-ss', String(t.previaInicio || 0), '-t', '6', '-i', orig, '-an', '-vf', `${escala(480)},format=yuv420p`, '-c:v', 'libx264',
        '-preset', 'slow', '-crf', '27', '-movflags', '+faststart', previa]);
      capa(previa, poster);
    }
    manifesto[t.id] = { completo: true, largura: s.w, altura: s.h, duracao: s.duracao, mb: mb(inteiro), previaMb: mb(previa) };
    console.log(`${t.id}: ok, ${mb(inteiro)} MB (original ${mb(orig)} MB)`);
  } else {
    const antiga = previasAntigas && join(previasAntigas, t.original);
    if (antiga && existsSync(antiga)) {
      if (!novo(previa, antiga)) {
        ff(['-i', antiga, '-an', '-c:v', 'copy', '-movflags', '+faststart', previa]);
        capa(previa, poster);
      }
      const s = sonda(antiga);
      manifesto[t.id] = { completo: false, largura: s.w, altura: s.h, duracao: null, mb: null, previaMb: mb(previa) };
      console.log(`${t.id}: SEM ORIGINAL, usando a prévia antiga (não abre em tela cheia)`);
    } else if (!manifesto[t.id]) {
      console.log(`${t.id}: SEM ORIGINAL e sem prévia, fica fora da página`);
    }
  }
}

// Trecho do topo
const d = dados.destaque;
const td = dados.trabalhos.find((t) => t.id === d.id);
const origD = td && join(pastaOriginais, td.original);
if (origD && existsSync(origD)) {
  const alvo = join(saida, 'destaque.mp4');
  if (!novo(alvo, origD)) {
    ff(['-ss', String(d.inicio), '-t', String(d.duracao), '-i', origD, '-an', '-vf', `${escala(720)},format=yuv420p`, '-c:v', 'libx264',
      '-preset', 'slow', '-crf', '27', '-maxrate', '1800k', '-bufsize', '3600k', '-movflags', '+faststart', alvo]);
    capa(alvo, join(saida, 'destaque.webp'));
  }
  const s = sonda(alvo);
  manifesto._destaque = { id: d.id, largura: s.w, altura: s.h, mb: mb(alvo) };
  console.log(`destaque: ok, ${mb(alvo)} MB`);
}

writeFileSync(manifestoPath, JSON.stringify(manifesto, null, 2) + '\n');
console.log('manifesto gravado em public/videos/manifesto.json');
