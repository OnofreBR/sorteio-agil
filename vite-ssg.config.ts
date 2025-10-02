import { defineConfig } from 'vite-plugin-ssr/config';

export default defineConfig({
  prerender: {
    // Rotas estáticas para prerender
    routes: [
      '/',
      '/sobre',
      '/termos',
      '/privacidade',
      '/megasena',
      '/lotofacil',
      '/quina',
      '/lotomania',
      '/timemania',
      '/duplasena',
      '/federal',
      '/diadesorte',
      '/supersete',
      '/maismilionaria',
    ],
  },
});
