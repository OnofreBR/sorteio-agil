/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['loteriasresultados.com.br'],
    unoptimized: false,
  },
  swcMinify: true,
};

export default nextConfig;
