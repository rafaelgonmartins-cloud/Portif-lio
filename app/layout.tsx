import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "./dados";

const descricao =
  "Edição de Reels, anúncios, vídeos de infoproduto e clipes, com motion design, legenda animada e sonoplastia. Orçamento pelo WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Martins Vídeo | Edição de vídeo e motion design",
  description: descricao,
  openGraph: {
    title: "Martins Vídeo | Edição de vídeo e motion design",
    description: descricao,
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Martins Vídeo, edição de vídeo e motion design" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#120b19" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* As fontes da primeira tela chegam antes do texto aparecer (evita o texto pular). */}
        <link rel="preload" href="/fonts/genos-latin-600-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/outfit-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/outfit-latin-600-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
