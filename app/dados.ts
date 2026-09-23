// Contato e textos fixos. Mudar telefone, Instagram ou endereço do site só aqui.
import dados from "../trabalhos.json";
import manifesto from "../public/videos/manifesto.json";

export const MARCA = "Martins Vídeo";
export const WHATS = "5553991671680";
export const WHATS_TEXTO = "(53) 99167-1680";
export const INSTAGRAM = "https://www.instagram.com/martins.video/";
// Endereço público do site. Trocar quando tiver domínio próprio (cartão do WhatsApp usa isto).
export const SITE = "https://portif-lio-chi-two.vercel.app";

export function zap(msg: string) {
  return `https://wa.me/${WHATS}?text=${encodeURIComponent(msg)}`;
}
export const ZAP_ORCAMENTO = zap("Olá! Vi seu portfólio e quero um orçamento de edição.");

export type Trabalho = {
  id: string;
  cliente: string;
  tipo: string;
  descricao: string;
  horizontal: boolean;
  completo: boolean;
  duracao: number | null;
};

type Info = { completo: boolean; largura: number; altura: number; duracao: number | null };
const info = manifesto as unknown as Record<string, Info>;

// Só entra na página o que tem pelo menos a prévia gerada.
export const TRABALHOS: Trabalho[] = dados.trabalhos
  .filter((t) => info[t.id])
  .map((t) => ({
    id: t.id,
    cliente: t.cliente,
    tipo: t.tipo,
    descricao: t.descricao,
    horizontal: info[t.id].largura > info[t.id].altura,
    completo: info[t.id].completo,
    duracao: info[t.id].duracao,
  }));

export const DESTAQUE = TRABALHOS.find((t) => t.id === dados.destaque.id) ?? null;
