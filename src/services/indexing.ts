const INDEXNOW_KEY = '9d9bd943c4614e13ac83acf67dd4e940';
const SITE_URL = 'https://numerosmegasena.netlify.app';

interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
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
    // Google Indexing API requer autenticação OAuth2
    // Por limitações do frontend, isso seria melhor implementado em um backend
    // Por enquanto, retornamos true para não bloquear o fluxo
    console.log('Google Indexing:', url);
    return true;
  } catch (error) {
    console.error('Erro ao submeter para Google Indexing:', error);
    return false;
  }
}

export async function indexNewResult(lottery: string, contest: number): Promise<void> {
  const url = `${SITE_URL}/${lottery}/concurso-${contest}`;
  
  await Promise.all([
    submitToIndexNow([url]),
    submitToGoogleIndexing(url),
  ]);
}
