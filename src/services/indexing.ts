const INDEXNOW_KEY = '9d9bd943c4614e13ac83acf67dd4e940';
const GOOGLE_INDEXING_KEY = 'fe03a75d34d990c8c7807ec32b4d453f4e9b87c8';
const GOOGLE_INDEXING_ID = '107787472085621987686';
const SITE_URL = 'https://numerosmegasena.netlify.app';

interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

interface GoogleIndexingPayload {
  url: string;
  type: 'URL_UPDATED' | 'URL_DELETED';
}

export async function submitToIndexNow(urls: string[]): Promise<boolean> {
  try {
    const payload: IndexNowPayload = {
      host: new URL(SITE_URL).hostname,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/indexnow-${INDEXNOW_KEY}.txt`,
      urlList: urls,
    };

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch (error) {
    console.error('Erro ao submeter para IndexNow:', error);
    return false;
  }
}

export async function submitToGoogleIndexing(url: string): Promise<boolean> {
  try {
    const payload: GoogleIndexingPayload = {
      url: url,
      type: 'URL_UPDATED',
    };

    // Google Indexing API endpoint
    const endpoint = `https://indexing.googleapis.com/v3/urlNotifications:publish`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GOOGLE_INDEXING_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log('✅ Google Indexing API: URL submitted successfully', url);
      return true;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Google Indexing API error:', errorData);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao submeter para Google Indexing:', error);
    return false;
  }
}

/**
 * Submete múltiplas URLs para Google Indexing API em lote
 */
export async function submitBatchToGoogleIndexing(urls: string[]): Promise<number> {
  let successCount = 0;
  
  // Google Indexing API tem limite de 200 requests por minuto
  // Vamos fazer em batches de 10 com delay
  const batchSize = 10;
  
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(url => submitToGoogleIndexing(url))
    );
    
    successCount += results.filter(r => r).length;
    
    // Delay entre batches para respeitar rate limit
    if (i + batchSize < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return successCount;
}

export async function indexNewResult(lottery: string, contest: number): Promise<void> {
  const url = `${SITE_URL}/${lottery}-concurso-${contest}`;
  
  console.log(`🔄 Indexing new result: ${lottery} concurso ${contest}`);
  
  const [indexNowResult, googleResult] = await Promise.all([
    submitToIndexNow([url]),
    submitToGoogleIndexing(url),
  ]);
  
  console.log(`IndexNow: ${indexNowResult ? '✅' : '❌'} | Google: ${googleResult ? '✅' : '❌'}`);
}

/**
 * Indexa múltiplos concursos de uma vez (útil para concursos futuros)
 */
export async function indexMultipleContests(contests: Array<{ lottery: string; contest: number }>): Promise<void> {
  const urls = contests.map(({ lottery, contest }) => 
    `${SITE_URL}/${lottery}-concurso-${contest}`
  );
  
  console.log(`🔄 Indexing ${urls.length} URLs...`);
  
  const [indexNowResult, googleSuccessCount] = await Promise.all([
    submitToIndexNow(urls),
    submitBatchToGoogleIndexing(urls),
  ]);
  
  console.log(`✅ IndexNow: ${indexNowResult ? 'Success' : 'Failed'}`);
  console.log(`✅ Google: ${googleSuccessCount}/${urls.length} URLs indexed`);
}

/**
 * Força reindexação de uma URL específica
 */
export async function forceReindex(url: string): Promise<boolean> {
  console.log(`🔄 Force reindexing: ${url}`);
  
  const [indexNowResult, googleResult] = await Promise.all([
    submitToIndexNow([url]),
    submitToGoogleIndexing(url),
  ]);
  
  return indexNowResult && googleResult;
}
