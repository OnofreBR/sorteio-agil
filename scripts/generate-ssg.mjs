import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of lotteries
const LOTTERIES = [
  'megasena',
  'quina',
  'lotofacil',
  'lotomania',
  'duplasena',
  'timemania',
  'diadesorte',
  'supersete',
  'maismilionaria',
  'federal',
  'loteca'
];

// Number of recent contests to pre-generate per lottery
const CONTESTS_PER_LOTTERY = 50;

// Mock contest numbers (in real scenario, fetch from API)
const LATEST_CONTESTS = {
  megasena: 2921,
  quina: 6841,
  lotofacil: 3500,
  lotomania: 2800,
  duplasena: 2900,
  timemania: 2200,
  diadesorte: 1100,
  supersete: 800,
  maismilionaria: 300,
  federal: 5900,
  loteca: 1200
};

async function generateSSG() {
  console.log('🚀 Starting SSG generation...');

  // Import the server renderer
  const { render } = await import('../dist/server/entry-server.js');

  // Load the base template
  const templatePath = path.resolve(__dirname, '../index.html');
  const template = fs.readFileSync(templatePath, 'utf-8');

  const distPath = path.resolve(__dirname, '../dist/client');

  // Ensure dist directory exists
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }
  
  console.log('📡 Server renderer loaded, ready for async data fetching...');

  const routes = [];

  // 1. Static pages
  routes.push('/');
  routes.push('/sobre');
  routes.push('/termos');
  routes.push('/privacidade');

  // 2. Lottery index pages
  LOTTERIES.forEach(lottery => {
    routes.push(`/${lottery}`);
  });

  // 3. Contest detail pages (last N contests per lottery)
  LOTTERIES.forEach(lottery => {
    const latestContest = LATEST_CONTESTS[lottery] || 100;
    for (let i = 0; i < CONTESTS_PER_LOTTERY; i++) {
      const contestNumber = latestContest - i;
      if (contestNumber > 0) {
        routes.push(`/${lottery}/concurso-${contestNumber}`);
      }
    }
  });

  console.log(`📄 Generating ${routes.length} static pages...`);

  let successCount = 0;
  let errorCount = 0;

  for (const route of routes) {
    try {
      // Await render (now async with data prefetching)
      const { html, head, state } = await render(route);

      // Serialize state for client hydration
      const stateJson = JSON.stringify(state || {});

      // Inject HTML, head, and state into template
      const finalHtml = template
        .replace('<!--app-head-->', head || '')
        .replace('<!--app-html-->', html || '')
        .replace('<!--app-state-->', stateJson);

      // Determine file path
      let filePath;
      if (route === '/') {
        filePath = path.join(distPath, 'index.html');
      } else {
        const routePath = route.endsWith('/') ? route.slice(0, -1) : route;
        const dirPath = path.join(distPath, routePath);
        fs.mkdirSync(dirPath, { recursive: true });
        filePath = path.join(dirPath, 'index.html');
      }

      // Write HTML file
      fs.writeFileSync(filePath, finalHtml, 'utf-8');
      successCount++;

      if (successCount % 50 === 0) {
        console.log(`  ✅ ${successCount}/${routes.length} pages generated...`);
      }
    } catch (error) {
      console.error(`  ❌ Error generating ${route}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n✨ SSG Generation Complete!');
  console.log(`  ✅ Success: ${successCount} pages`);
  console.log(`  ❌ Errors: ${errorCount} pages`);
  console.log(`  📦 Output: ${distPath}`);
}

generateSSG().catch(err => {
  console.error('💥 SSG generation failed:', err);
  process.exit(1);
});
