import { CNPJ, INSTAGRAM, MARCA, WHATS_TEXTO, ZAP_ORCAMENTO } from "./dados";
import { Estrela, IconeInsta, IconeSeta, IconeWhats } from "./icones";

const SECOES = [
  { href: "#trabalhos", nome: "Trabalhos" },
  { href: "#servicos", nome: "O que eu edito" },
  { href: "#arsenal", nome: "Arsenal de edição" },
  { href: "#processo", nome: "Processo" },
  { href: "#quem-edita", nome: "Quem edita" },
  { href: "#contato", nome: "Contato" },
];

// Crédito do site. O utm deixa a PoliaTech ver no analytics quantas visitas vêm daqui.
const POLIATECH = "https://poliatech.com.br/?utm_source=martins-video&utm_medium=credito-rodape&utm_campaign=portfolio";

// Marca da PoliaTech (Documentos/Definições/Identidade Visual/02-Logo/PoliaTech_texto_branco.svg),
// com a cor herdada do texto para ficar discreta no fundo do Rafael.
function MarcaPoliaTech({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 3602 810" className={className} aria-hidden fill="currentColor">
      <path d="M0 800V0h193q112 0 161.5 45.5T408 195q2 42 2 78t-2 78q-4 104-53.5 149.5T193 546h-43v254Zm150-386h43q62 0 65-55 2-37 2-86t-2-86q-3-55-65-55h-43ZM667 810q-73 0-117-20t-64.5-64T461 609q-1-17-1.5-46t-.5-62 .5-62.5T461 390q4-72 24.5-116t64-64T667 190q75 0 118 20.5t63 64.5 24 115q1 17 1.5 46t.5 62-.5 62.5T872 609q-4 71-24 115.5t-63 65T667 810m0-112q29 0 41.5-13t13.5-38q2-69 2-147.5T722 352q-1-24-13.5-37T667 302q-54 0-56 50-2 69-2 148t2 147q2 51 56 51M934 800V0h150v800ZM1164 113V0h150v113Zm0 687V200h150v600ZM1511 808q-67 0-98-32.5T1375 664q-2-22 0-44 5-62 39.5-97t115.5-64q27-10 52-16.5t53-13.5v-77q-1-24-10.5-37t-38.5-13q-25 0-34 10.5t-11 34.5q0 7-.5 23.5t0 34 .5 26.5h-146q-1-5-1.5-28t.5-39q3-61 22-99t61-56.5 113-18.5q75 0 116 20.5t58.5 64T1784 388l-1 412h-150v-65h-19q-18 38-40.5 55.5T1511 808m63-107q20 0 35-11t25-29V525q-38 8-65 20-26 12-35 31.5t-11 43.5q-1 18 0 32 5 49 51 49M1974 800V132h-129V0h407v132h-128v668ZM2503 567h146q1 5 1.5 26.5t-.5 38.5q-4 95-49.5 136.5T2456 810q-103 0-150-41.5T2254 632q-1-17-1.5-52.5t-.5-77 .5-77.5 1.5-55q7-97 53.5-138.5T2454 190q101 0 146.5 40.5T2650 364q1 11 1 38.5v61q0 33.5-2 61.5h-247q0 32 .5 63t1.5 60q1 27 13 38.5t39 11.5q24 0 35-11.5t12-38.5q2-25 0-81m-49-265q-26 0-37.5 10.5T2404 347q-1 18-1 36.5t-1 38.5h102q0-27-.5-49t-.5-26q-1-24-12.5-34.5T2454 302M2713 632q-1-17-1.5-52.5t-.5-77 .5-77.5 1.5-55q7-97 53.5-138.5T2913 190q101 0 146.5 40.5T3109 364q1 16 .5 39t-1.5 28h-146q1-9 1-26.5v-34q0-16.5-1-23.5-1-24-12.5-34.5T2913 302q-26 0-37.5 10.5T2863 347q-2 71-2 151t2 150q1 27 13 38.5t39 11.5q24 0 35-11.5t12-38.5q2-25 0-81h146q1 5 1.5 26.5t-.5 38.5q-4 95-49.5 136.5T2915 810q-103 0-150-41.5T2713 632M3179 800V0h150v265h26q21-36 44-55.5t70-19.5q62 0 97.5 39t35.5 130v441h-150V346q0-47-48-47-20 0-43 11.5t-32 31.5v458Z" />
    </svg>
  );
}

/* Rodapé em duas partes: a ficha do site (marca, seções, contato) e, embaixo, os créditos
   finais, como no fim de um vídeo. É ali que entra a PoliaTech. */
export default function Rodape() {
  const ano = new Date().getFullYear();
  return (
    <footer className="border-t border-linha/70 bg-palco/40">
      <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr] md:gap-10">
          <div>
            <img
              src="/marca/logo-escuro-200.webp"
              srcSet="/marca/logo-escuro-200.webp 1x, /marca/logo-escuro-300.webp 2x"
              alt={MARCA}
              width={110}
              height={50}
              loading="lazy"
              className="h-[50px] w-auto"
            />
            <p className="mt-5 max-w-[22rem] leading-relaxed text-apoio">
              Edição de vídeo e motion design para Reels, anúncios, vídeos de infoproduto e clipes.
            </p>
            <a href={ZAP_ORCAMENTO} target="_blank" rel="noopener" className="botao botao-principal mt-6 text-sm">
              <IconeWhats className="h-5 w-5" /> Pedir orçamento
            </a>
          </div>

          <nav aria-label="Seções do site">
            <p className="font-semibold">Seções</p>
            <ul className="mt-3 grid gap-1 text-apoio">
              {SECOES.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className="inline-flex min-h-10 items-center hover:text-texto">
                    {s.nome}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-semibold">Contato</p>
            <ul className="mt-3 grid gap-1 text-apoio">
              <li>
                <a href={ZAP_ORCAMENTO} target="_blank" rel="noopener" className="inline-flex min-h-10 items-center gap-2.5 hover:text-texto">
                  <IconeWhats className="h-5 w-5 text-laranja" /> {WHATS_TEXTO}
                </a>
              </li>
              <li>
                <a href={INSTAGRAM} target="_blank" rel="noopener" className="inline-flex min-h-10 items-center gap-2.5 hover:text-texto">
                  <IconeInsta className="h-5 w-5 text-laranja" /> @martins.video
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Créditos finais */}
        <div className="mt-16 border-t border-linha pt-10 md:mt-20">
          <Estrela className="mx-auto h-4 w-4 text-laranja" />
          <dl className="mx-auto mt-6 grid max-w-md grid-cols-[1fr_1fr] gap-x-6 gap-y-3 text-sm">
            <dt className="text-right text-apoio">Roteiro, edição e motion</dt>
            <dd className="font-semibold">Rafael Martins</dd>
            <dt className="text-right text-apoio">Site</dt>
            <dd>
              <a
                href={POLIATECH}
                target="_blank"
                rel="noopener"
                aria-label="PoliaTech, empresa que fez este site"
                className="group -my-2 inline-flex min-h-10 items-center text-texto/80 transition-colors hover:text-texto"
              >
                <MarcaPoliaTech className="h-[15px] w-auto" />
                <IconeSeta className="ml-2 h-3.5 w-3.5 -rotate-45 text-apoio transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </dd>
          </dl>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-linha/60 py-6 text-sm text-apoio">
          <p>
            {MARCA}, {ano}. CNPJ {CNPJ}. Todos os direitos reservados.
          </p>
          <a href="#topo" className="inline-flex min-h-10 items-center hover:text-texto">
            Voltar ao topo
          </a>
        </div>
      </div>
    </footer>
  );
}
