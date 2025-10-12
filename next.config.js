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
      // Pagina da loteria antiga -> nova rota /loterias/:slug
      {
        source: '/:lotterySlug((?!loterias|sobre|termos|privacidade|api|_next|favicon\.ico).*)',
        destination: '/loterias/:lotterySlug',
      },
      // Rotas antigas de concurso -> nova rota /:slug/concurso-:numero
      { source: '/:lotterySlug/concurso/:contest', destination: '/:lotterySlug/concurso-:contest' },
      { source: '/:lotterySlug/resultado/:contest', destination: '/:lotterySlug/concurso-:contest' },
      { source: '/:lotterySlug/:contest(\\d+)', destination: '/:lotterySlug/concurso-:contest' },
    ];
  },
};

module.exports = nextConfig;
