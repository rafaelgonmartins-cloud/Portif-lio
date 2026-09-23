# Martins Vídeo · portfólio

Site de uma página, estático (Next.js 15 + Tailwind 4, `output: 'export'`). Publicado no Vercel.

## Rodar no computador

```
npm install
npm run dev          # http://localhost:3010
```

## Adicionar ou trocar um vídeo

1. Coloque o arquivo original numa pasta **fora deste repositório** (os originais passam de
   100 MB e o GitHub recusa).
2. Em `trabalhos.json`, adicione ou edite o item: `id` (vira o nome do arquivo no site),
   `original` (nome do arquivo na pasta), `cliente`, `tipo`, `descricao`.
   A ordem da lista é a ordem na página.
3. Gere as versões do site (precisa do [ffmpeg](https://ffmpeg.org) instalado):

   ```
   npm run videos -- <pasta-dos-originais>
   ```

   Para cada vídeo sai em `public/videos/`: o inteiro (1080p, até 4,5 Mbps; vídeo longo cai para
   720p para ficar em ~45 MB), uma prévia de 6 s sem som para a grade e a capa em dois tamanhos.
   O trecho mudo do topo sai do item `destaque` (`id`, `inicio` e `duracao` em segundos).
   `--rapido` codifica mais rápido com arquivo um pouco maior.
4. `npm run build` para conferir e faça o commit de `public/videos/` junto.

Item sem o original aparece na grade só com a prévia antiga e não abre em tela cheia.

## Onde mudar

- WhatsApp, Instagram e endereço do site: `app/dados.ts`
- Textos das seções: `app/page.tsx`
- Foto do "Quem edita": `public/rafael-400.webp` e `rafael-800.webp` (quadradas)
- Cores e fontes: `app/globals.css`
- Imagem que aparece ao mandar o link no WhatsApp: `public/og.jpg` (1200x630)

## Publicação

O Vercel faz o build sozinho a cada push (`vercel.json` fixa o framework como Next.js).
Branch diferente de `main` gera um endereço de teste antes de ir para o ar.
