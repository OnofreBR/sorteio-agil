/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['loteriasresultados.com.br'],
    unoptimized: false,
  },
  swcMinify: true,
  async rewrites() {
    return [
      // Legacy patterns → new canonical route
      { source: '/:lottery/concurso/:contest', destination: '/:lottery/:contest' },
      { source: '/:lottery/concurso-:contest', destination: '/:lottery/:contest' },
      { source: '/:lottery/resultado/:contest', destination: '/:lottery/:contest' },
    ];
  },
};

export default nextConfig;
