/**
 * Script para gerar páginas estáticas de concursos futuros
 * Executa durante o build para criar HTML pré-renderizado
 * 
 * Uso: node scripts/generate-future-pages.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOTTERY_MAP = {
  megasena: { name: 'Mega-Sena', drawDays: ['quarta-feira', 'sábado'], numbersDrawn: 6, maxNumber: 60 },
  lotofacil: { name: 'Lotofácil', drawDays: ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'], numbersDrawn: 15, maxNumber: 25 },
  quina: { name: 'Quina', drawDays: ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'], numbersDrawn: 5, maxNumber: 80 },
  lotomania: { name: 'Lotomania', drawDays: ['terça-feira', 'sexta-feira'], numbersDrawn: 20, maxNumber: 100 },
  timemania: { name: 'Timemania', drawDays: ['terça-feira', 'quinta-feira', 'sábado'], numbersDrawn: 10, maxNumber: 80 },
  duplasena: { name: 'Dupla Sena', drawDays: ['terça-feira', 'quinta-feira', 'sábado'], numbersDrawn: 6, maxNumber: 50 },
  federal: { name: 'Federal', drawDays: ['quarta-feira', 'sábado'], numbersDrawn: 5, maxNumber: 99999 },
  diadesorte: { name: 'Dia de Sorte', drawDays: ['terça-feira', 'quinta-feira', 'sábado'], numbersDrawn: 7, maxNumber: 31 },
  supersete: { name: 'Super Sete', drawDays: ['segunda-feira', 'quarta-feira', 'sexta-feira'], numbersDrawn: 7, maxNumber: 10 },
  maismilionaria: { name: '+Milionária', drawDays: ['quarta-feira', 'sábado'], numbersDrawn: 6, maxNumber: 50 },
};

const SITE_URL = 'https://numerosmegasena.netlify.app';
const FUTURE_CONTESTS_COUNT = 20;
const OUTPUT_DIR = path.join(__dirname, '../dist');

function generateFuturePageHTML(lottery, lotteryInfo, contest, estimatedDate) {
  const title = `${lotteryInfo.name} Concurso ${contest} - Resultado Previsto para ${estimatedDate}`;
  const description = `Acompanhe o resultado do concurso ${contest} da ${lotteryInfo.name}. Sorteio previsto com estimativa de prêmio. Confira números sorteados, ganhadores e próximos concursos.`;
  
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${lotteryInfo.name}, concurso ${contest}, resultado, números sorteados, loteria">
  <link rel="canonical" href="${SITE_URL}/${lottery}-concurso-${contest}">
  
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="theme-color" content="#1a1f35">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${SITE_URL}/${lottery}-concurso-${contest}">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="Números Mega Sena">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  
  <!-- JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${title}",
    "description": "${description}",
    "url": "${SITE_URL}/${lottery}-concurso-${contest}",
    "datePublished": "${new Date().toISOString()}",
    "author": {
      "@type": "Organization",
      "name": "Números Mega Sena"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Números Mega Sena",
      "logo": {
        "@type": "ImageObject",
        "url": "${SITE_URL}/logo.png"
      }
    },
    "mainEntity": {
      "@type": "Event",
      "name": "${lotteryInfo.name} Concurso ${contest}",
      "description": "Sorteio ${lotteryInfo.name}",
      "startDate": "${estimatedDate}",
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": "São Paulo",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "São Paulo",
          "addressRegion": "SP",
          "addressCountry": "BR"
        }
      }
    }
  }
  </script>
</head>
<body>
  <div id="root"></div>
  <noscript>
    <header>
      <h1>${lotteryInfo.name} Concurso ${contest}</h1>
    </header>
    <main>
      <article>
        <h2>Sobre o Concurso ${contest}</h2>
        <p>O sorteio do concurso ${contest} da ${lotteryInfo.name} está previsto para ${estimatedDate}. A ${lotteryInfo.name} é uma das loterias mais populares do Brasil, administrada pela Caixa Econômica Federal.</p>
        
        <p>Os sorteios da ${lotteryInfo.name} acontecem ${lotteryInfo.drawDays.join(', ')}, sempre às 20h00 (horário de Brasília), em São Paulo, SP. O resultado é divulgado imediatamente após o sorteio e atualizado automaticamente nesta página.</p>
        
        <h2>Como Funciona</h2>
        <p>Para jogar na ${lotteryInfo.name}, você deve escolher ${lotteryInfo.numbersDrawn} números em um volante que vai de 01 a ${lotteryInfo.maxNumber}. Você pode escolher mais números e fazer apostas múltiplas, aumentando suas chances de ganhar.</p>
        
        <p>As apostas podem ser feitas em qualquer lotérica autorizada ou pelo site/app oficial da Caixa Econômica Federal até 19h00 do dia do sorteio.</p>
        
        <h2>Onde Jogar</h2>
        <ul>
          <li>Lotéricas autorizadas em todo o Brasil</li>
          <li>Site oficial: www.caixa.gov.br/loterias</li>
          <li>App Loterias CAIXA (iOS e Android)</li>
        </ul>
        
        <p><strong>Atenção:</strong> Esta página será automaticamente atualizada com os números sorteados após o sorteio oficial.</p>
      </article>
    </main>
  </noscript>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
}

function estimateNextDrawDate(baseDate, drawDays) {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + 3); // Estimativa simples de 3 dias
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

function generateAllFuturePages() {
  console.log('🚀 Generating future contest pages for SEO...\n');
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  let totalPages = 0;
  const baseDate = new Date();
  
  Object.entries(LOTTERY_MAP).forEach(([lottery, lotteryInfo]) => {
    console.log(`📄 Generating ${FUTURE_CONTESTS_COUNT} pages for ${lotteryInfo.name}...`);
    
    const baseContest = 3000; // Número base (em produção, viria da API)
    
    for (let i = 1; i <= FUTURE_CONTESTS_COUNT; i++) {
      const contest = baseContest + i;
      const estimatedDate = estimateNextDrawDate(baseDate, lotteryInfo.drawDays);
      const html = generateFuturePageHTML(lottery, lotteryInfo, contest, estimatedDate);
      
      const fileName = `${lottery}-concurso-${contest}.html`;
      const filePath = path.join(OUTPUT_DIR, fileName);
      
      fs.writeFileSync(filePath, html, 'utf-8');
      totalPages++;
    }
  });
  
  console.log(`\n✅ Generated ${totalPages} future contest pages successfully!`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
}

// Execute
try {
  generateAllFuturePages();
} catch (error) {
  console.error('❌ Error generating future pages:', error);
  process.exit(1);
}
