import Arsenal from "./Arsenal";
import Contato from "./Contato";
import Processo from "./Processo";
import Rodape from "./Rodape";
import { DESTAQUE, INSTAGRAM, MARCA, TODOS, TRABALHOS, WHATS_TEXTO, ZAP_ORCAMENTO } from "./dados";
import { Estrela, IconeInsta, IconeSeta, IconeWhats } from "./icones";
import { Destaque, Grade, Tela, VerExemplo } from "./Videos";

// Cada linha aponta para um trabalho que mostra aquilo (id de trabalhos.json).
const SERVICOS = [
  {
    titulo: "Reels, TikTok e Shorts",
    texto: "Vídeo vertical com gancho logo no começo, corte rápido e legenda animada para segurar quem está rolando o feed.",
    exemplo: "vilgner-processo",
  },
  {
    titulo: "Infoproduto e anúncio",
    texto: "Roteiro falado com cenas de apoio, ícones e legenda. Serve para orgânico e para tráfego pago.",
    exemplo: "droplatam-2",
  },
  {
    titulo: "Vídeo longo",
    texto: "Aula, bastidor ou vídeo para YouTube, com tela gravada, cortes e legenda do começo ao fim.",
    exemplo: "droplatam-1",
  },
  {
    titulo: "Clipe musical",
    texto: "Montagem no tempo da música, com tratamento de cor e elementos animados onde a batida pede.",
    exemplo: "jackson-teixeira",
  },
  {
    titulo: "Motion e efeito visual",
    texto: "Texto animado, gráficos, máscara, rastreamento e VFX feitos no After Effects.",
    exemplo: "droplatam-5",
  },
];


export default function Home() {
  const completos = new Set(TODOS.filter((t) => t.completo).map((t) => t.id));

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-linha/70 bg-fundo/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#topo" aria-label={`${MARCA}, início`} className="shrink-0">
            <img src="/marca/logo-escuro-200.webp" srcSet="/marca/logo-escuro-100.webp 1x, /marca/logo-escuro-200.webp 2x, /marca/logo-escuro-300.webp 3x" alt={MARCA} width={79} height={36} className="h-9 w-auto" />
          </a>
          <nav aria-label="Seções" className="hidden items-center gap-7 text-sm text-apoio md:flex">
            <a href="#trabalhos" className="py-3 hover:text-texto">Trabalhos</a>
            <a href="#servicos" className="py-3 hover:text-texto">O que eu edito</a>
            <a href="#processo" className="py-3 hover:text-texto">Processo</a>
            <a href="#quem-edita" className="py-3 hover:text-texto">Quem edita</a>
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
                Reels, anúncios, vídeos de infoproduto e clipes. Da captação ao arquivo pronto para postar: corte no
                ritmo, legenda animada, cor, motion e efeito visual.
              </p>
              <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
                <a href={ZAP_ORCAMENTO} target="_blank" rel="noopener" className="botao botao-principal">
                  <IconeWhats className="h-5 w-5" /> Pedir orçamento
                </a>
                <a href="#trabalhos" className="botao botao-secundario">
                  Ver trabalhos <IconeSeta className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-8 flex items-center gap-2 text-sm text-apoio">
                <Estrela className="h-3.5 w-3.5 text-laranja" />
                Rafael Martins, editando vídeo desde 2013
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

        {/* Arsenal e processo formam uma faixa só, como a tela de um programa de edição */}
        <section id="arsenal" className="border-t border-linha/70 bg-palco/40">
          <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 md:pt-24">
            <Arsenal />
          </div>
          <div id="processo" className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 md:pb-24 md:pt-28">
            <Processo />
          </div>
        </section>

        <section id="quem-edita" className="border-t border-linha/70">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-16 md:py-24">
            <img
              src="/rafael-800.webp"
              srcSet="/rafael-400.webp 400w, /rafael-800.webp 800w"
              sizes="320px"
              alt="Rafael Martins, fundador da Martins Vídeo"
              width={800}
              height={800}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full max-w-[20rem] rounded-2xl object-cover shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]"
            />
            <div>
              <h2 className="text-4xl font-semibold sm:text-5xl">Quem edita</h2>
              <p className="mt-5 text-xl font-semibold">
                Rafael Martins<span className="font-normal text-apoio">, fundador da Martins Vídeo</span>
              </p>
              {/* Texto do próprio Rafael (enviado em 23/09/2026). */}
              <p className="mt-4 max-w-[38rem] text-lg leading-relaxed text-apoio">
                Desde 2013, Rafael aprendeu de forma autodidata tudo o que aplica em seu trabalho. Sua experiência,
                criatividade e curiosidade foram o motor que ele utilizou para entender como trazer resultados na
                produção de vídeos de grande alcance para empresas de pequeno, médio e grande porte.
              </p>
              <p className="mt-4 max-w-[38rem] text-lg leading-relaxed text-apoio">
                Concluiu cursos pela Brainstorm Academy e pela Escola do VFX. Hoje é roteirista e especialista em captação, edição
                de vídeo, colorização, motion design e efeitos especiais, e segue ampliando os estudos em
                inteligência artificial.
              </p>
            </div>
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

      <Rodape />

      <Tela itens={TODOS} />
    </>
  );
}
