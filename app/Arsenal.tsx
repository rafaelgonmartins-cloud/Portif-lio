/* "Arsenal de edição" desenhado como o painel de projeto de um programa de edição:
   cada ferramenta é um arquivo no bin, com a extensão que ela gera de verdade.
   Passar o mouse seleciona a linha, como no Premiere. */

const ITENS = [
  { arquivo: "edicao", ext: ".prproj", sigla: "PR", nome: "Premiere Pro", uso: "Edição, cortes precisos e sincronia de imagem e som." },
  { arquivo: "motion", ext: ".aep", sigla: "AE", nome: "After Effects", uso: "Motion graphics, VFX, tracking e animação." },
  { arquivo: "trilha", ext: ".wav", sigla: "WAV", nome: "Sound design e mixagem", uso: "Efeitos sonoros, EQ, compressão e mixagem." },
  { arquivo: "capa", ext: ".psd", sigla: "PSD", nome: "Photoshop", uso: "Capas e miniaturas, tratamento de imagem e texturas." },
];

// Ícone de arquivo com a ponta dobrada, desenhado em SVG (mesmo traço dos outros ícones).
function Arquivo({ sigla }: { sigla: string }) {
  return (
    <span className="relative grid h-12 w-10 shrink-0 place-items-end" aria-hidden>
      <svg viewBox="0 0 40 48" className="absolute inset-0 h-full w-full text-linha transition-colors duration-200 group-hover:text-laranja/70">
        <path d="M3 3h24l10 10v32H3z" fill="var(--color-fundo)" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M27 3v10h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <span className="relative mb-1.5 w-full rounded-[3px] bg-roxo px-0.5 text-center text-[9px] font-semibold leading-4 text-white">
        {sigla}
      </span>
    </span>
  );
}

export default function Arsenal() {
  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-14">
      <div>
        <h2 className="text-4xl font-semibold sm:text-5xl">Arsenal de edição</h2>
        <p className="mt-4 max-w-[22rem] leading-relaxed text-apoio">
          O que fica aberto na tela enquanto o seu vídeo é montado.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-fundo/70 ring-1 ring-linha">
        <div className="flex items-center justify-between border-b border-linha px-4 py-2.5 text-xs text-apoio">
          <span>
            Projeto: <span className="font-semibold text-texto">martins-video</span>
          </span>
          <span className="tabular-nums">{ITENS.length} itens</span>
        </div>
        <div className="hidden grid-cols-[3.5rem_13rem_1fr] border-b border-linha px-4 py-2 text-xs text-apoio sm:grid" aria-hidden>
          <span />
          <span>Nome</span>
          <span>Uso</span>
        </div>
        <ul>
          {ITENS.map((it) => (
            <li
              key={it.ext}
              className="group grid grid-cols-[3.5rem_1fr] items-center gap-y-1 border-b border-linha/60 px-4 py-4 transition-colors duration-200 last:border-b-0 hover:bg-laranja-botao/15 sm:grid-cols-[3.5rem_13rem_1fr]"
            >
              <Arquivo sigla={it.sigla} />
              <div>
                <p className="font-semibold">{it.nome}</p>
                <p className="text-sm tabular-nums text-apoio">
                  {it.arquivo}
                  {it.ext}
                </p>
              </div>
              <p className="col-start-2 leading-relaxed text-apoio sm:col-start-3">{it.uso}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
