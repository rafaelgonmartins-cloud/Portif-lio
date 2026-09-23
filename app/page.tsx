import Contato from "./Contato";
import { DESTAQUE, INSTAGRAM, MARCA, TRABALHOS, WHATS_TEXTO, ZAP_ORCAMENTO } from "./dados";
import { Estrela, IconeInsta, IconeSeta, IconeWhats } from "./icones";
import { Destaque, Grade, Tela, VerExemplo } from "./Videos";

// Cada linha aponta para um trabalho que mostra aquilo (id de trabalhos.json).
const SERVICOS = [
  {
    titulo: "Reels, TikTok e Shorts",
    texto: "Vídeo vertical com gancho logo no começo, corte rápido e legenda animada para segurar quem está rolando o feed.",
    exemplo: "vilgner-setembro",
  },
  {
    titulo: "Infoproduto e anúncio",
    texto: "Roteiro falado com cenas de apoio, ícones e legenda. Serve para orgânico e para tráfego pago.",
    exemplo: "droplatam-89",
  },
  {
    titulo: "Clipe musical",
    texto: "Montagem no tempo da música, com tratamento de cor e efeito onde a batida pede.",
    exemplo: "jackson-teixeira",
  },
  {
    titulo: "Motion e efeito visual",
    texto: "Texto animado, máscara, rastreamento e VFX feitos no After Effects.",
    exemplo: "corpo-4",
  },
];

const PASSOS = [
  { titulo: "Material e referências", texto: "Você manda o bruto e os vídeos que gosta. Eu assisto tudo e separo os melhores momentos." },
  { titulo: "Corte e ritmo", texto: "Monto a história tirando as pausas e ajusto o ritmo para prender a atenção até o último segundo." },
  { titulo: "Motion e som", texto: "Entram transições, texto animado, efeito visual e sonoplastia." },
  { titulo: "Cor e entrega", texto: "Trato a cor, exporto no formato de cada rede e ajusto até você aprovar." },
];

export default function Home() {
  const completos = new Set(TRABALHOS.filter((t) => t.completo).map((t) => t.id));

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-linha/70 bg-fundo/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#topo" aria-label={`${MARCA}, início`} className="shrink-0">
            <img src="/marca/logo-escuro.webp" alt={MARCA} width={640} height={292} className="h-9 w-auto" />
          </a>
          <nav aria-label="Seções" className="hidden items-center gap-7 text-sm text-apoio md:flex">
            <a href="#trabalhos" className="py-3 hover:text-texto">Trabalhos</a>
            <a href="#servicos" className="py-3 hover:text-texto">O que eu edito</a>
            <a href="#como-funciona" className="py-3 hover:text-texto">Como funciona</a>
          </nav>
          <a href={ZAP_ORCAMENTO} target="_blank" rel="noopener" className="botao botao-principal min-h-10 px-4 text-sm">
            <IconeWhats className="h-5 w-5" />
            <span>Orçamento</span>
          </a>
        </div>
      </header>

      <main id="topo">
        {/* Topo: o vídeo aparece já na primeira tela */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 top-10 h-[36rem] w-[36rem] rounded-full bg-roxo/25 blur-[120px]"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 md:grid-cols-[1.1fr_1fr] md:gap-14 md:pb-24 md:pt-16">
            <div>
              <h1 className="text-[2.6rem] font-semibold leading-[0.98] sm:text-6xl lg:text-7xl">
                Edição de vídeo e motion design
              </h1>
              <p className="mt-5 max-w-[34rem] text-lg leading-relaxed text-apoio">
                Reels, anúncios, vídeos de infoproduto e clipes. Corte no ritmo, legenda animada, efeito visual e
                sonoplastia, do bruto até o arquivo pronto para postar.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={ZAP_ORCAMENTO} target="_blank" rel="noopener" className="botao botao-principal">
                  <IconeWhats className="h-5 w-5" /> Pedir orçamento
                </a>
                <a href="#trabalhos" className="botao botao-secundario">
                  Ver trabalhos <IconeSeta className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-8 flex items-center gap-2 text-sm text-apoio">
                <Estrela className="h-3.5 w-3.5 text-laranja" />
                Edito no Premiere Pro e no After Effects
              </p>
            </div>
            {DESTAQUE && <Destaque t={DESTAQUE} />}
          </div>
        </section>

        <section id="trabalhos" className="border-t border-linha/70 bg-palco/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-4xl font-semibold sm:text-5xl">Trabalhos</h2>
              <p className="text-apoio">Toque num vídeo para assistir com som.</p>
            </div>
            <Grade itens={TRABALHOS} />
          </div>
        </section>

        <section id="servicos" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <h2 className="text-4xl font-semibold sm:text-5xl">O que eu edito</h2>
          <ul className="mt-10 border-t border-linha">
            {SERVICOS.map((s) => (
              <li key={s.titulo} className="grid gap-2 border-b border-linha py-7 md:grid-cols-[18rem_1fr_auto] md:items-center md:gap-10">
                <h3 className="text-2xl font-semibold sm:text-3xl">{s.titulo}</h3>
                <p className="max-w-[40rem] leading-relaxed text-apoio">{s.texto}</p>
                {completos.has(s.exemplo) ? <VerExemplo id={s.exemplo} rotulo="Ver exemplo" /> : <span className="hidden md:block" />}
              </li>
            ))}
          </ul>
        </section>

        <section id="como-funciona" className="border-t border-linha/70 bg-palco/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
            <h2 className="text-4xl font-semibold sm:text-5xl">Como funciona</h2>
            <ol className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
              {PASSOS.map((p, i) => (
                <li key={p.titulo}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-laranja-botao text-base font-semibold tabular-nums text-white">
                      {i + 1}
                    </span>
                    <span aria-hidden className="h-px flex-1 bg-linha" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold">{p.titulo}</h3>
                  <p className="mt-2 leading-relaxed text-apoio">{p.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="contato" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <h2 className="text-4xl font-semibold sm:text-5xl">Manda o seu projeto</h2>
              <p className="mt-5 max-w-[30rem] text-lg leading-relaxed text-apoio">
                Conta que vídeo você precisa e quantos por mês. A resposta vem pelo WhatsApp, com prazo e valor.
              </p>
              <a href={ZAP_ORCAMENTO} target="_blank" rel="noopener" className="mt-8 flex min-h-11 items-center gap-3 text-lg font-semibold hover:text-laranja-claro">
                <IconeWhats className="h-6 w-6 text-laranja" /> {WHATS_TEXTO}
              </a>
              <a href={INSTAGRAM} target="_blank" rel="noopener" className="mt-1 flex min-h-11 items-center gap-3 text-lg font-semibold hover:text-laranja-claro">
                <IconeInsta className="h-6 w-6 text-laranja" /> @martins.video
              </a>
            </div>
            <div className="rounded-2xl bg-palco p-6 ring-1 ring-linha sm:p-8">
              <Contato />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-linha/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-apoio sm:px-6">
          <img src="/marca/logo-escuro.webp" alt={MARCA} width={640} height={292} className="h-8 w-auto" />
          <p>{MARCA}, {new Date().getFullYear()}</p>
        </div>
      </footer>

      <Tela itens={TRABALHOS} />
    </>
  );
}
