"use client";
import { useEffect, useRef, useState } from "react";
import type { Trabalho } from "./dados";
import { IconeFechar, IconePausa, IconePlay, IconeSom } from "./icones";

const EVENTO = "abrir-video";
const abrir = (id: string) => window.dispatchEvent(new CustomEvent(EVENTO, { detail: id }));
const TRECHO = "/videos/destaque-trecho.mp4";

export function duracaoTexto(s: number | null) {
  if (!s) return "";
  const t = Math.round(s);
  return t < 60 ? `${t} s` : `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}

// Sem vídeo rodando sozinho quando a pessoa pediu menos movimento ou está economizando dados.
function economizar() {
  if (typeof window === "undefined") return false;
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !!c?.saveData ||
    ["slow-2g", "2g"].includes(c?.effectiveType ?? "")
  );
}

// Espera a página terminar de carregar (fontes, capa do topo) antes de puxar vídeo.
function depoisDoLoad(fn: () => void) {
  if (document.readyState === "complete") fn();
  else window.addEventListener("load", fn, { once: true });
}

/* Capa em <img> com srcset (o atributo poster do <video> não escolhe tamanho).
   Fica embaixo do vídeo; quando o vídeo começa a tocar, cobre a capa. */
function Capa({ id, horizontal, sizes, prioridade = false }: { id: string; horizontal: boolean; sizes: string; prioridade?: boolean }) {
  const [p, g] = horizontal ? [640, 1280] : [360, 720];
  return (
    <img
      src={`/videos/${id}.webp`}
      srcSet={`/videos/${id}-p.webp ${p}w, /videos/${id}.webp ${g}w`}
      sizes={sizes}
      alt=""
      width={horizontal ? 1280 : 720}
      height={horizontal ? 720 : 1280}
      loading={prioridade ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={prioridade ? "high" : "auto"}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

/* Topo: trecho mudo em loop, barra de tempo de verdade e botão para ver o vídeo inteiro com som. */
export function Destaque({ t }: { t: Trabalho }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [tocando, setTocando] = useState(false);
  const [pos, setPos] = useState({ atual: 0, total: 0 });

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const tempo = () => setPos({ atual: v.currentTime, total: v.duration || 0 });
    const on = () => setTocando(true);
    const off = () => setTocando(false);
    v.addEventListener("timeupdate", tempo);
    v.addEventListener("play", on);
    v.addEventListener("pause", off);
    if (!economizar())
      depoisDoLoad(() => {
        if (!v.getAttribute("src")) v.src = TRECHO;
        v.play().catch(() => {});
      });
    return () => {
      v.removeEventListener("timeupdate", tempo);
      v.removeEventListener("play", on);
      v.removeEventListener("pause", off);
    };
  }, []);

  const alternar = () => {
    const v = ref.current;
    if (!v) return;
    if (!v.getAttribute("src")) v.src = TRECHO;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };
  const tc = (s: number) => `00:${String(Math.floor(s)).padStart(2, "0")}`;
  const pct = pos.total ? pos.atual / pos.total : 0;

  return (
    <figure className="mx-auto w-full max-w-[25rem]">
      <div className="relative aspect-[9/16] overflow-hidden rounded-[20px] bg-palco shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] ring-1 ring-linha">
        <Capa id="destaque-trecho" horizontal={false} sizes="(min-width: 768px) 400px, calc(100vw - 32px)" prioridade />
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="none"
          aria-label="Trecho do vídeo em destaque"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-4 pt-16">
          {t.completo && (
            <button type="button" onClick={() => abrir(t.id)} className="botao botao-principal min-h-11 px-4 text-sm">
              <IconeSom className="h-5 w-5" /> Assistir com som
            </button>
          )}
          <button
            type="button"
            onClick={alternar}
            aria-label={tocando ? "Pausar o vídeo" : "Tocar o vídeo"}
            className="ml-auto grid h-11 w-11 place-items-center rounded-full bg-black/45 text-white transition hover:bg-black/70"
          >
            {tocando ? <IconePausa className="h-5 w-5" /> : <IconePlay className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3 text-sm text-apoio" aria-hidden>
        <span className="tabular-nums">{tc(pos.atual)}</span>
        <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-linha">
          {/* scaleX em vez de width: a barra anda sem recalcular o layout a cada quadro */}
          <div className="absolute inset-0 origin-left bg-laranja" style={{ transform: `scaleX(${pct})` }} />
        </div>
        <span className="tabular-nums">{tc(pos.total)}</span>
      </div>
      <figcaption className="mt-2 text-sm text-apoio">
        <span className="font-semibold text-texto">{t.cliente}</span>
        {t.duracao ? ` · ${duracaoTexto(t.duracao)} com som` : ""}
      </figcaption>
    </figure>
  );
}

/* Grade: capa parada; a prévia de 6 s só carrega e toca quando o card aparece na tela. */
export function Grade({ itens }: { itens: Trabalho[] }) {
  const lista = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (economizar()) return;
    const vids = [...(lista.current?.querySelectorAll<HTMLVideoElement>("video[data-previa]") ?? [])];
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) {
            if (!v.getAttribute("src")) v.src = v.dataset.previa!;
            v.play().catch(() => {});
          } else if (!v.paused) v.pause();
        }
      },
      { threshold: 0.45 },
    );
    depoisDoLoad(() => vids.forEach((v) => obs.observe(v)));
    return () => obs.disconnect();
  }, []);

  return (
    <ul ref={lista} className="grid grid-flow-row-dense grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
      {itens.map((t) => (
        <li key={t.id} className={t.horizontal ? "col-span-full" : ""}>
          <button
            type="button"
            disabled={!t.completo}
            onClick={() => abrir(t.id)}
            aria-label={t.completo ? `Assistir: ${t.cliente}, ${t.tipo}` : `${t.cliente}, ${t.tipo} (trecho)`}
            className="group relative block w-full cursor-pointer overflow-hidden rounded-[14px] bg-palco text-left ring-1 ring-linha transition duration-300 ease-[var(--ease-saida)] enabled:hover:-translate-y-1 enabled:hover:ring-laranja/60 disabled:cursor-default"
          >
            <div className={`relative ${t.horizontal ? "aspect-video" : "aspect-[9/16]"}`}>
              <Capa
                id={t.id}
                horizontal={t.horizontal}
                sizes={t.horizontal ? "(min-width: 1152px) 1104px, calc(100vw - 32px)" : "(min-width: 1024px) 350px, calc(50vw - 22px)"}
              />
              <video
                data-previa={`/videos/${t.id}-previa.mp4`}
                muted
                loop
                playsInline
                preload="none"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            {t.completo && (
              <span className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-black/55 text-white transition duration-300 group-hover:bg-laranja-botao">
                <IconePlay className="h-5 w-5" />
              </span>
            )}
          </button>
          <p className="mt-3 font-semibold leading-snug">{t.cliente}</p>
          <p className="text-sm text-apoio">
            {t.tipo}
            {t.completo ? ` · ${duracaoTexto(t.duracao)}` : " · trecho"}
          </p>
        </li>
      ))}
    </ul>
  );
}

/* Tela cheia com o vídeo inteiro e som. <dialog> nativo: Esc fecha e o foco fica preso nele. */
export function Tela({ itens }: { itens: Trabalho[] }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [atual, setAtual] = useState<Trabalho | null>(null);

  useEffect(() => {
    const abre = (e: Event) => {
      const t = itens.find((i) => i.id === (e as CustomEvent<string>).detail);
      if (!t || !t.completo) return;
      document.querySelectorAll<HTMLVideoElement>("video").forEach((v) => v !== vid.current && v.pause());
      setAtual(t);
      dlg.current?.showModal();
    };
    window.addEventListener(EVENTO, abre);
    return () => window.removeEventListener(EVENTO, abre);
  }, [itens]);

  useEffect(() => {
    if (atual && vid.current) {
      vid.current.load();
      vid.current.play().catch(() => {});
    }
  }, [atual]);

  const fechou = () => {
    vid.current?.pause();
    setAtual(null);
  };

  return (
    <dialog
      ref={dlg}
      onClose={fechou}
      onClick={(e) => e.target === dlg.current && dlg.current?.close()}
      aria-label={atual ? `${atual.cliente}, ${atual.tipo}` : "Vídeo"}
      className="m-auto max-h-none max-w-none bg-transparent p-0 text-texto backdrop:bg-[#0a0610]/92"
    >
      {atual && (
        <div className={`flex flex-col items-center gap-3 p-3 ${atual.horizontal ? "w-[min(96vw,1280px)]" : ""}`}>
          <div className="flex w-full items-center justify-between gap-4">
            <p className="text-sm">
              <span className="font-semibold">{atual.cliente}</span>
              <span className="text-apoio"> · {atual.tipo}</span>
            </p>
            <button
              type="button"
              onClick={() => dlg.current?.close()}
              aria-label="Fechar vídeo"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <IconeFechar className="h-5 w-5" />
            </button>
          </div>
          <video
            ref={vid}
            src={`/videos/${atual.id}.mp4`}
            poster={`/videos/${atual.id}.webp`}
            controls
            playsInline
            preload="auto"
            className={
              atual.horizontal
                ? "aspect-video w-full rounded-xl bg-black"
                : "aspect-[9/16] h-[min(80svh,860px)] max-w-[92vw] rounded-xl bg-black object-contain"
            }
          />
          <p className="max-w-[32rem] text-center text-sm text-apoio">{atual.descricao}</p>
        </div>
      )}
    </dialog>
  );
}

/* Link "ver exemplo" das seções de texto: abre o vídeo em tela cheia. */
export function VerExemplo({ id, rotulo }: { id: string; rotulo: string }) {
  return (
    <button type="button" onClick={() => abrir(id)} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-laranja-claro underline-offset-4 hover:underline">
      <IconePlay className="h-4 w-4" /> {rotulo}
    </button>
  );
}
