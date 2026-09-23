/** @type {import('next').NextConfig} */
const nextConfig = {
  // Site 100% estático (pasta out/): roda no Vercel ou em qualquer hospedagem.
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};
export default nextConfig;
