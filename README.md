# Números Mega Sena

Aplicação Next.js (pages router) para acompanhar resultados oficiais das loterias brasileiras com SSR/SSG/ISR, SEO dinâmico e integrações de indexação. Preparada para deploy estável na Vercel.

## Stack

- **Next.js 14.2 (pages router)** – SSR/SSG/ISR
- **TypeScript**
- **Tailwind CSS + shadcn/ui**
- **ESLint + TypeScript ESLint**
- **GitHub Actions (lint / typecheck / build)**

## Pré-requisitos

- Node.js **≥ 18.17.0** (recomendado o LTS mais recente)
- npm 9+

## Configuração local

```bash
git clone <REPO_URL>
cd sorteio-agil

# Copie as variáveis de ambiente
cp .env.example .env.local

# Instale as dependências
npm install

# Rodando em modo desenvolvimento (SSR)
npm run dev

# Verificações completas (lint + typecheck + build)
npm run check
```

### Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `SITE_URL` | ✅ | URL canônica usada em SEO (ex.: `https://sorteioagil.com.br`). |
| `RESULTS_API_URL` | ✅ | Endpoint primário da API de resultados das loterias. |
| `RESULTS_API_BACKUP_URL` | ⛔️ opcional | Endpoint de backup para failover automático. |
| `RESULTS_API_TOKEN` | ✅ | Token seguro da API (servidor). |
| `RESULTS_API_TIMEOUT` | ⛔️ | Tempo limite em ms (padrão 5000). |
| `RESULTS_API_CACHE_TTL` | ⛔️ | TTL do cache em ms (padrão 60000). |
| `INDEXNOW_KEY` | ⛔️ | Chave IndexNow para notificar buscadores (opcional). |

> Todas as variáveis devem ser cadastradas na Vercel em **Project Settings → Environment Variables**. Nunca exponha `RESULTS_API_TOKEN` em código cliente.

## Scripts npm

| Script | Descrição |
| --- | --- |
| `npm run dev` | Desenvolvimento com SSR hot reload. |
| `npm run lint` | ESLint em todo o projeto (`eslint . --max-warnings=0`). |
| `npm run lint:next` | Validação adicional via `next lint`. |
| `npm run typecheck` | `tsc --noEmit` para garantir tipos corretos. |
| `npm run build` | `next build` (gera SSR/SSG/ISR). |
| `npm run start` | `next start` – servidor de produção. |
| `npm run check` | Executa `lint`, `typecheck` e `build` em sequência. |

## Fluxo de Deploy (Vercel)

1. Garanta que `npm run check` passa localmente.
2. Commit + push em `main` (CI roda lint/typecheck/build no Node 18).
3. A Vercel lê `package.json` (`build`: `next build`, `start`: `next start`).
4. Configure as mesmas envs no painel da Vercel.
5. Deploy automático a cada push em `main`.

## SSR/SSG/ISR

- `/` – SSG com **ISR (revalidate: 600s)**. Dados agregados via camada `getLatestForAll` (cache em memória + fallback API).
- `/loterias/[loteriaSlug]` – SSR (`getServerSideProps`).
- `/[loteriaSlug]/concurso-[contestNumber]` – SSR com fallback seguro.
- `/sobre`, `/privacidade`, `/termos` – SSR leves com metadados estáticos.
- `/sitemap.xml`, `/robots.txt` – respostas dinâmicas server-side com cache-control.

## SEO e rotas

| Rota | Método | Metadados | JSON-LD |
| --- | --- | --- | --- |
| `/` | ISR (600s) | Title + Description + OG/Twitter | `WebSite` |
| `/loterias/[slug]` | SSR | Title + canonical dinâmico + OG/Twitter | `CollectionPage` com concursos recentes |
| `/[slug]/concurso-[id]` | SSR | Title/desc/canonical por concurso | `NewsArticle` |
| `/sitemap.xml` | SSR | Geração dinâmica (home, institucionais, loterias, concursos) | — |
| `/robots.txt` | SSR | Inclui sitemap + IndexNow (se disponível) | — |

Canonical e OG usam `SITE_URL`. Hreflang não é utilizado (site monolíngue PT-BR).

## Dados das Loterias

Camada em `src/lib/api/results.ts`:

- Failover entre `RESULTS_API_URL` e `RESULTS_API_BACKUP_URL`.
- Timeout configurável (`RESULTS_API_TIMEOUT`).
- Retry exponencial + cache in-memory (`RESULTS_API_CACHE_TTL`).
- Normalização completa (dezenas, duplas, trevos, mês da sorte, premiações, próximos concursos).
- Logs controlados para falhas por loteria.

## Sitemap & Robots

- `pages/sitemap.xml.ts` gera XML dinâmico com cache `s-maxage=3600`.
- `pages/robots.txt.ts` usa `SITE_URL` e incorpora IndexNow (quando disponível).
- `services/futureContests.ts` mantém dados para conteúdo futuro (evita soft-404).

## Qualidade e CI

- **ESLint + TypeScript** integrados ao build (`npm run lint`, `npm run typecheck`).
- GitHub Actions (`.github/workflows/ci.yml`) executa lint → typecheck → build a cada push/PR.
- Arquivo `.env.example` documenta variáveis obrigatórias.

## Deploy Manual (Vercel)

1. `npm run check`
2. Push para `main`
3. Na Vercel: importar repositório, definir envs (Production & Preview).
4. Confirmar logs `npm run build` e publicar.

## Logs de validação

O comando `npm run check` executa lint + typecheck + build localmente. No CI, o workflow “CI” evidencia o log completo do processo em cada commit, garantindo a mesma validação usada na Vercel.

---

## Autor

- **GitHub**: [OnofreBR](https://github.com/OnofreBR)
- **LinkedIn**: [Seu Nome](https://www.linkedin.com/in/SEU-PERFIL)