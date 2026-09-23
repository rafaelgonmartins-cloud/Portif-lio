#!/usr/bin/env node
// Gera os vídeos do site a partir dos originais do Rafael.
//
//   node scripts/preparar-videos.mjs <pasta-dos-originais> [--previas-antigas <pasta>] [--forcar] [--rapido]
//
// Para cada item de trabalhos.json, se <pasta>/<original> existir, gera em public/videos/:
//   <id>.mp4         vídeo inteiro, H.264, até 1080 px no lado menor, ~4,5 Mbps no máximo, com som.
//                    Vídeo longo ganha taxa menor (e 720 px) para caber em ~45 MB: o GitHub recusa
//                    arquivo acima de 100 MB e o celular não precisa de mais que isso.
//   <id>-previa.mp4  6 s sem som, 480 px, para rodar em loop na grade
//   <id>.webp        capa (primeiro quadro da prévia)
// e o trecho mudo do topo (destaque-trecho.mp4 + capa).
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
// --rapido troca o preset slow por medium (arquivo ~5% maior, codifica 2x mais rápido)
const PRESET = args.includes('--rapido') ? 'medium' : 'slow';
const previasAntigas = opc('--previas-antigas');
if (!pastaOriginais) {
  console.error('uso: node scripts/preparar-videos.mjs <pasta-dos-originais> [--previas-antigas <pasta>] [--forcar] [--rapido]');
  process.exit(2);
}

const dados = JSON.parse(readFileSync(join(raiz, 'trabalhos.json'), 'utf8'));
const saida = join(raiz, 'public', 'videos');
mkdirSync(saida, { recursive: true });
const manifestoPath = join(saida, 'manifesto.json');
const manifesto = existsSync(manifestoPath) ? JSON.parse(readFileSync(manifestoPath, 'utf8')) : {};

const ff = (a) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...a], { stdio: 'inherit' });
function sonda(arq) {
  const q = (campos) => JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', campos, '-of', 'json', arq], { stdio: ['ignore', 'pipe', 'ignore'] }).toString());
  let j;
  try { j = q('stream=width,height:stream_side_data=rotation:format=duration'); }
  catch { j = q('stream=width,height:format=duration'); } // ffmpeg antigo (4.x) não conhece stream_side_data
  let { width: w, height: h } = j.streams[0];
  const rot = Math.abs(j.streams[0].side_data_list?.[0]?.rotation || 0);
  if (rot === 90 || rot === 270) [w, h] = [h, w];
  return { w, h, duracao: +(+j.format.duration).toFixed(1) };
}
const novo = (alvo, fonte) => !forcar && existsSync(alvo) && statSync(alvo).mtimeMs > statSync(fonte).mtimeMs;
const mb = (a) => +(statSync(a).size / 1e6).toFixed(1);
// Lado menor limitado: 1080 no inteiro, 480 na prévia, 720 no destaque. Nunca aumenta.
const escala = (lado) => `scale='if(gt(iw,ih),-2,min(${lado},iw))':'if(gt(iw,ih),min(${lado},ih),-2)'`;

// Capa com 720 px no lado menor: nítida no card do computador (até ~360 px de largura em tela 2x).
// Mais uma versão com 360 px (<id>-p.webp) para celular: o site escolhe pelo srcset.
function capa(video, alvo, inicio = 0.4) {
  ff(['-ss', String(inicio), '-i', video, '-frames:v', '1', '-vf', escala(720), '-c:v', 'libwebp', '-quality', '78', alvo]);
  ff(['-i', alvo, '-vf', escala(360), '-c:v', 'libwebp', '-quality', '75', alvo.replace(/\.webp$/, '-p.webp')]);
}
const LIMITE_MB = 45;
function taxa(duracao) {
  // kbit/s de vídeo que cabem no limite, descontando 128k de áudio; teto de 4500k
  const k = Math.floor((LIMITE_MB * 8000) / duracao - 128);
  return Math.min(4500, k);
}

for (const t of dados.trabalhos) {
  const orig = join(pastaOriginais, t.original);
  const inteiro = join(saida, `${t.id}.mp4`);
  const previa = join(saida, `${t.id}-previa.mp4`);
  const poster = join(saida, `${t.id}.webp`);
  if (existsSync(orig)) {
    const s = sonda(orig);
    if (!novo(inteiro, orig)) {
      const k = taxa(s.duracao);
      const lado = k < 2500 ? 720 : 1080;
      console.log(`${t.id}: vídeo inteiro (${s.duracao} s, ${lado}p, até ${k}k)...`);
      ff(['-i', orig, '-vf', `${escala(lado)},format=yuv420p`, '-c:v', 'libx264', '-preset', PRESET, '-crf', '23',
        '-maxrate', `${k}k`, '-bufsize', `${k * 2}k`, '-profile:v', 'high', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', inteiro]);
    }
    const ini = t.previaInicio || 0;
    if (!novo(previa, orig)) {
      ff(['-ss', String(ini), '-t', '6', '-i', orig, '-an', '-vf', `${escala(480)},format=yuv420p`, '-c:v', 'libx264',
        '-preset', PRESET, '-crf', '27', '-movflags', '+faststart', previa]);
      capa(orig, poster, ini + 0.4);
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
  const alvo = join(saida, 'destaque-trecho.mp4');
  if (!novo(alvo, origD)) {
    ff(['-ss', String(d.inicio), '-t', String(d.duracao), '-i', origD, '-an', '-vf', `${escala(720)},format=yuv420p`, '-c:v', 'libx264',
      '-preset', PRESET, '-crf', '27', '-maxrate', '1800k', '-bufsize', '3600k', '-movflags', '+faststart', alvo]);
    capa(origD, join(saida, 'destaque-trecho.webp'), d.inicio + 0.4);
  }
  const s = sonda(alvo);
  manifesto._destaque = { id: d.id, largura: s.w, altura: s.h, mb: mb(alvo) };
  console.log(`destaque: ok, ${mb(alvo)} MB`);
}

writeFileSync(manifestoPath, JSON.stringify(manifesto, null, 2) + '\n');
console.log('manifesto gravado em public/videos/manifesto.json');
