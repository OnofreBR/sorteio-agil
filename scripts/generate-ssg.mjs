import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOTTERIES = [
  'megasena',
  'lotofacil',
  'quina',
  'lotomania',
  'timemania',
  'duplasena',
  'diadesorte',
  'supersete',
  'maismilionaria'
];

const API_BASE = 'https://servicebus2.caixa.gov.br/portaldeloterias/api';
const API_TOKEN = 'ZmFiOGNlYzQtY2E2My00YzQ4LWI5MTktODAxOTAxNDljOGVj';

// Mapeia nomes da API para slugs
const getLotterySlug = (nome) => {
  const map = {
    'megasena': 'mega-sena',
    'lotofacil': 'lotofacil',
    'quina': 'quina',
    'lotomania': 'lotomania',
    'timemania': 'timemania',
    'duplasena': 'dupla-sena',
    'diadesorte': 'dia-de-sorte',
    'supersete': 'super-sete',
    'maismilionaria': 'mais-milionaria'
  };
  return map[nome] || nome;
};

// Fetch da API de loterias
async function fetchLotteryData(lottery, contest = null) {
  const slug = getLotterySlug(lottery);
  const url = contest 
    ? `${API_BASE}/${slug}/${contest}?token=${API_TOKEN}`
    : `${API_BASE}/${slug}?token=${API_TOKEN}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erro ao buscar ${lottery}`);
  return response.json();
}

// Carrega o template HTML
function loadTemplate() {
  const templatePath = path.join(__dirname, '../dist/client/index.html');
  return fs.readFileSync(templatePath, 'utf-8');
}

// Injeta HTML renderizado no template
function injectHtml(template, html, helmet = {}) {
  let result = template.replace('<!--app-html-->', html);
  
  // Injeta meta tags do Helmet se houver
  if (helmet.helmet) {
    const { title, meta, link } = helmet.helmet;
    if (title) result = result.replace(/<title>.*?<\/title>/, title.toString());
    if (meta) result = result.replace('</head>', `${meta.toString()}</head>`);
    if (link) result = result.replace('</head>', `${link.toString()}</head>`);
  }
  
  return result;
}

// Salva HTML em arquivo
function saveHtml(htmlPath, content) {
  const dir = path.dirname(htmlPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(htmlPath, content);
  console.log(`✓ Gerado: ${htmlPath}`);
}

// Gera páginas estáticas
async function generateStaticPages() {
  console.log('🚀 Iniciando geração de páginas estáticas...\n');
  
  const { render } = await import('../dist/server/entry-server.js');
  const template = loadTemplate();
  const distPath = path.join(__dirname, '../dist/client');

  // Páginas estáticas básicas
  const staticRoutes = ['/', '/sobre', '/termos', '/privacidade'];
  
  console.log('📄 Gerando páginas estáticas básicas...');
  for (const route of staticRoutes) {
    const { html, helmet } = render(route);
    const htmlPath = path.join(distPath, route === '/' ? 'index.html' : route, 'index.html');
    saveHtml(htmlPath, injectHtml(template, html, helmet));
  }

  // Páginas de loterias
  console.log('\n🎰 Gerando páginas de loterias...');
  for (const lottery of LOTTERIES) {
    try {
      // Página índice da loteria
      const { html, helmet } = render(`/${lottery}`);
      const lotteryPath = path.join(distPath, lottery, 'index.html');
      saveHtml(lotteryPath, injectHtml(template, html, helmet));

      // Busca último concurso
      const latestData = await fetchLotteryData(lottery);
      const latestContest = latestData.numero;
      
      // Gera últimos 20 concursos
      const startContest = Math.max(1, latestContest - 19);
      console.log(`  Gerando concursos ${startContest} a ${latestContest} para ${lottery}...`);
      
      for (let contest = startContest; contest <= latestContest; contest++) {
        const url = `/${lottery}/concurso/${contest}`;
        const { html, helmet } = render(url);
        const contestPath = path.join(distPath, lottery, 'concurso', contest.toString(), 'index.html');
        saveHtml(contestPath, injectHtml(template, html, helmet));
      }
      
      console.log(`  ✓ ${lottery}: ${latestContest - startContest + 1} concursos gerados\n`);
    } catch (error) {
      console.error(`  ✗ Erro ao gerar ${lottery}:`, error.message);
    }
  }

  console.log('\n✅ Geração de páginas concluída!');
}

generateStaticPages().catch(console.error);
