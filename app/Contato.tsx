"use client";
import { useState } from "react";
import { zap } from "./dados";
import { IconeWhats } from "./icones";

const TIPOS = [
  "Reels, TikTok ou Shorts",
  "Vídeo de infoproduto ou anúncio",
  "Vídeo longo para YouTube",
  "Clipe musical",
  "Motion ou efeito visual",
  "Pacote mensal de vídeos",
];

// Não guarda nada: monta a mensagem e abre o WhatsApp com ela.
export default function Contato() {
  const [erro, setErro] = useState("");

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const nome = String(f.get("nome") || "").trim();
    const detalhes = String(f.get("detalhes") || "").trim();
    if (!nome || !detalhes) {
      setErro("Preencha seu nome e conte um pouco do vídeo.");
      return;
    }
    setErro("");
    const msg = `Olá! Meu nome é ${nome}.\n\nTipo de vídeo: ${f.get("tipo")}\nDetalhes: ${detalhes}\n\nVi seu portfólio e quero um orçamento.`;
    window.open(zap(msg), "_blank", "noopener");
  }

  return (
    <form onSubmit={enviar} noValidate className="grid gap-5">
      <div className="grid gap-2">
        <label htmlFor="nome" className="text-sm font-medium">Seu nome ou nome do canal</label>
        <input id="nome" name="nome" autoComplete="name" className="campo" placeholder="Ex.: Ana, @canaldaana" />
      </div>
      <div className="grid gap-2">
        <label htmlFor="tipo" className="text-sm font-medium">Tipo de vídeo</label>
        <select id="tipo" name="tipo" className="campo">
          {TIPOS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="grid gap-2">
        <label htmlFor="detalhes" className="text-sm font-medium">O que você precisa</label>
        <textarea
          id="detalhes"
          name="detalhes"
          rows={4}
          className="campo resize-y"
          placeholder="Ex.: 8 Reels por mês, gravo tudo no celular e quero legenda animada."
          aria-describedby={erro ? "erro-form" : undefined}
        />
      </div>
      {erro && <p id="erro-form" role="alert" className="text-sm text-laranja-claro">{erro}</p>}
      <button type="submit" className="botao botao-principal w-full">
        <IconeWhats className="h-5 w-5" /> Enviar pelo WhatsApp
      </button>
    </form>
  );
}
