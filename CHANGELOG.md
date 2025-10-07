# Changelog

## [Unreleased]

### Added
- Arquivo `.env.example` documentando variáveis obrigatórias (`SITE_URL`, `RESULTS_API_*`, `INDEXNOW_KEY`).
- `src/lib/config/site.ts` com helpers `getSiteUrl` e `buildUrl` para canônicos e integrações.
- Rotas dinâmicas `pages/sitemap.xml.ts` e `pages/robots.txt.ts` com cache-control.
- JSON-LD específico para páginas de loteria (`CollectionPage`) e concurso (`NewsArticle`).
- Cache em memória, timeout configurável, retry exponencial e logs na camada `src/lib/api/results.ts`.
- GitHub Action `ci.yml` executando lint → typecheck → build.

### Changed
- `package.json`: scripts `lint`, `lint:next`, `typecheck`, `check` e `engines` para Node ≥ 18.17.
- Remoção do workflow legado de deploy (`nextjs.yml`).
- Todas as páginas passam a usar `buildUrl` para canônicos/OG, evitando uso direto de `process.env` em componentes.
- `components/ContestDetails` agora utiliza dados normalizados (`location`, `prizeTiers`, `winnerLocales`).
- `services/futureContests` compatível com o novo tipo `LotteryResult`.
- Documentação atualizada (`README.md`) com stack real, scripts, rotas, SEO e deploy na Vercel.

### Removed
- `public/robots.txt` e `public/sitemap.xml` (substituídos por rotas dinâmicas).
- Workflow GitHub Pages (`.github/workflows/nextjs.yml`).
