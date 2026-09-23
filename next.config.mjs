/** @type {import('next').NextConfig} */
const nextConfig = {
  // Site 100% estático (pasta out/): roda no Vercel ou em qualquer hospedagem.
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  // CSS (6 KB) vai dentro do HTML: um pedido a menos antes de desenhar a primeira tela.
  experimental: { inlineCss: true },
};
export default nextConfig;
