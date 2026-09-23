"use client";
import { useEffect, useRef, useState } from "react";

/* "Meu processo criativo" desenhado como a linha do tempo de um editor: cada etapa é um clipe
   numa trilha, em escada, e a agulha (playhead) anda conforme a página rola. A etapa embaixo
   da agulha acende. Sem movimento pedido: tudo aceso e a agulha some. */

type Passo = { titulo: string; texto: string; faixa: string; col: string };

const PASSOS: Passo[] = [
  {
    titulo: "Briefing e decupagem",
    texto: "A gente alinha o que o vídeo precisa fazer e olha as referências. Eu assisto todo o bruto e separo os melhores momentos.",
    faixa: "V1",
    col: "md:col-start-1 md:col-end-6",
  },
  {
    titulo: "Corte e ritmo",
    texto: "Monto a história tirando as pausas e ajusto o ritmo para prender a atenção do primeiro ao último segundo.",
    faixa: "V2",
    col: "md:col-start-4 md:col-end-9",
  },
  {
    titulo: "Motion e som",
    texto: "Entram efeito visual, transição, texto animado e a sonoplastia, no tempo exato de cada corte.",
    faixa: "A1",
    col: "md:col-start-6 md:col-end-11",
  },
  {
    titulo: "Cor e entrega",
    texto: "Trato a cor, exporto no formato de cada rede e faço as revisões até você aprovar.",
    faixa: "V3",
    col: "md:col-start-8 md:col-end-13",
  },
];

// Desenho de cada clipe, na linguagem do programa de edição (só geometria).
function Miolo({ i }: { i: number }) {
  if (i === 0)
    // bruto: vários pedaços soltos de tamanhos diferentes
    return (
      <div className="flex h-7 gap-1" aria-hidden>
        {[18, 9, 26, 12, 20, 7, 15].map((w, k) => (
          <span key={k} className="h-full rounded-[3px] bg-roxo/55" style={{ flexGrow: w }} />
        ))}
      </div>
    );
  if (i === 1)
    // corte: uma faixa contínua com as marcas da navalha
    return (
      <div className="flex h-7 overflow-hidden rounded-[4px]" aria-hidden>
        {[30, 12, 22, 8, 28].map((w, k) => (
          <span key={k} className="h-full border-r-2 border-fundo bg-roxo last:border-r-0" style={{ flexGrow: w }} />
        ))}
      </div>
    );
  if (i === 2)
    // som: forma de onda
    return (
      <svg viewBox="0 0 120 28" preserveAspectRatio="none" className="h-7 w-full text-laranja" aria-hidden>
        {[6, 12, 20, 9, 24, 16, 27, 11, 18, 5, 22, 14, 26, 8, 19, 12, 23, 7, 15, 25, 10, 17, 6, 21, 13, 9, 18, 4].map((h, k) => (
          <rect key={k} x={k * 4.3 + 0.6} y={14 - h / 2} width="2.2" height={h} rx="1" fill="currentColor" opacity={0.85} />
        ))}
      </svg>
    );
  // cor: do cinza do arquivo cru para a cor tratada
  return (
    <div
      className="h-7 rounded-[4px]"
      style={{ background: "linear-gradient(90deg, #6f6a73 0%, #8a7f86 30%, #b0573a 62%, #eb5e28 78%, #6a3a91 100%)" }}
      aria-hidden
    />
  );
}

export default function Processo() {
  const area = useRef<HTMLDivElement>(null);
  const agulha = useRef<HTMLDivElement>(null);
  const tc = useRef<HTMLSpanElement>(null);
  const [ativo, setAtivo] = useState(-1);

  useEffect(() => {
    const el = area.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAtivo(-2); // todos acesos
      return;
    }
    let pedido = 0;
    const medir = () => {
      pedido = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 quando o topo da linha do tempo chega a 75% da tela; 1 quando o fim passa de 45%
      const p = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / (r.height + vh * 0.3)));
      agulha.current?.style.setProperty("--p", String(p));
      if (tc.current) {
        const s = p * 60;
        const f = Math.floor((s % 1) * 24);
        tc.current.textContent = `00:00:${String(Math.floor(s)).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
      }
      // acende o último clipe que já começou embaixo da agulha (inícios: colunas 1, 4, 6 e 8 de 12)
      const inicios = [0, 3 / 12, 5 / 12, 7 / 12];
      setAtivo(p <= 0 ? -1 : inicios.filter((x) => x <= p).length - 1);
    };
    const rolar = () => { if (!pedido) pedido = requestAnimationFrame(medir); };
    medir();
    window.addEventListener("scroll", rolar, { passive: true });
    window.addEventListener("resize", rolar);
    return () => {
      window.removeEventListener("scroll", rolar);
      window.removeEventListener("resize", rolar);
      cancelAnimationFrame(pedido);
    };
  }, []);

  const aceso = (i: number) => ativo === -2 || ativo === i;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-4xl font-semibold sm:text-5xl">Meu processo criativo</h2>
        <p className="text-sm text-apoio">
          <span ref={tc} className="font-semibold tabular-nums text-texto">00:00:00:00</span>
          <span className="ml-2">role para rodar a sequência</span>
        </p>
      </div>

      <div ref={area} className="relative mt-10 overflow-hidden border-y border-linha md:mt-12">
        {/* régua de tempo, só no computador */}
        <div className="hidden h-9 items-end border-b border-linha md:flex" aria-hidden>
          <div
            className="relative h-full flex-1"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, var(--color-linha) 0 1px, transparent 1px calc(100% / 48))",
              backgroundSize: "100% 30%",
              backgroundPosition: "bottom",
              backgroundRepeat: "no-repeat",
            }}
          >
            {["00:00", "00:15", "00:30", "00:45"].map((t, k) => (
              <span key={t} className="absolute top-1.5 text-[11px] tabular-nums text-apoio" style={{ left: `${k * 25}%` }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="relative py-5 md:py-7">
          {/* agulha: anda com a rolagem (transform, sem recalcular layout) */}
          <div
            ref={agulha}
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 hidden [container-type:inline-size] md:block"
            style={{ ["--p" as string]: 0 }}
          >
            <div
              className="absolute inset-y-0 left-0 w-0.5 bg-laranja shadow-[0_0_0_1px_rgba(18,11,25,0.6)] will-change-transform"
              style={{ transform: "translateX(calc(var(--p) * 100cqw))" }}
            >
              <span className="absolute -left-[5px] -top-1 h-3 w-3 rotate-45 rounded-[2px] bg-laranja" />
            </div>
          </div>

          <ol className="relative grid gap-3 md:grid-cols-12 md:gap-x-3 md:gap-y-3">
            {PASSOS.map((p, i) => (
              <li
                key={p.titulo}
                className={`relative ${p.col} ml-[calc(var(--degrau)*0.75rem)] md:ml-0`}
                style={{ ["--degrau" as string]: i }}
              >
                <div
                  className={`rounded-xl border p-4 transition-[background-color,border-color,opacity] duration-300 ${
                    aceso(i) ? "border-laranja/70 bg-palco opacity-100" : "border-linha bg-palco/60 opacity-75"
                  }`}
                >
                  <div className="flex items-baseline gap-3">
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-semibold tabular-nums transition-colors duration-300 ${
                        aceso(i) ? "bg-laranja-botao text-white" : "bg-linha text-apoio"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <h3 className="text-xl font-semibold sm:text-2xl">{p.titulo}</h3>
                    <span className="ml-auto text-xs font-semibold tabular-nums text-apoio" aria-hidden>{p.faixa}</span>
                  </div>
                  <p className="mt-2 leading-relaxed text-apoio">{p.texto}</p>
                  <div className="mt-4">
                    <Miolo i={i} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
