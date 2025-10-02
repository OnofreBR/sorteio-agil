import { supabase } from '@/integrations/supabase/client';

const SITE_URL = typeof window !== 'undefined' ? window.location.origin : '';

/**
 * Log indexing attempt to database for monitoring
 */
async function logIndexingAttempt(
  url: string, 
  service: 'google' | 'indexnow' | 'batch',
  status: 'success' | 'error' | 'pending',
  responseData?: any,
  errorMessage?: string
): Promise<void> {
  try {
    await supabase.from('indexing_logs').insert({
      url,
      service,
      status,
      response_data: responseData,
      error_message: errorMessage,
    });
  } catch (error) {
    console.error('Failed to log indexing attempt:', error);
  }
}

/**
 * Submits URLs to the Cloud indexing function (secure server-side indexing)
 */
export async function submitToIndexing(urls: string[]): Promise<boolean> {
  try {
    console.log(`🔄 Submitting ${urls.length} URLs to Cloud indexing function...`);
    
    // Log pending status
    await Promise.all(urls.map(url => logIndexingAttempt(url, 'batch', 'pending')));
    
    const { data, error } = await supabase.functions.invoke('indexing', {
      body: { urls, type: 'URL_UPDATED' },
    });

    if (error) {
      console.error('❌ Cloud indexing error:', error);
      await Promise.all(urls.map(url => 
        logIndexingAttempt(url, 'batch', 'error', null, error.message)
      ));
      return false;
    }

    console.log('✅ Cloud indexing response:', data);
    await Promise.all(urls.map(url => 
      logIndexingAttempt(url, 'batch', 'success', data)
    ));
    return data?.success || false;
  } catch (error) {
    console.error('❌ Error calling Cloud indexing:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await Promise.all(urls.map(url => 
      logIndexingAttempt(url, 'batch', 'error', null, errorMessage)
    ));
    return false;
  }
}

/**
 * Index a new lottery result
 */
export async function indexNewResult(lottery: string, contest: number): Promise<void> {
  const url = `${SITE_URL}/${lottery}/concurso-${contest}`;
  
  console.log(`🔄 Indexing new result: ${lottery} concurso ${contest}`);
  
  const success = await submitToIndexing([url]);
  
  console.log(`Cloud indexing: ${success ? '✅' : '❌'}`);
}

/**
 * Index multiple contests at once (useful for future contests)
 */
export async function indexMultipleContests(contests: Array<{ lottery: string; contest: number }>): Promise<void> {
  const urls = contests.map(({ lottery, contest }) => 
    `${SITE_URL}/${lottery}/concurso-${contest}`
  );
  
  console.log(`🔄 Indexing ${urls.length} URLs...`);
  
  const success = await submitToIndexing(urls);
  
  console.log(`✅ Cloud indexing: ${success ? 'Success' : 'Failed'} for ${urls.length} URLs`);
}

/**
 * Force reindex a specific URL
 */
export async function forceReindex(url: string): Promise<boolean> {
  console.log(`🔄 Force reindexing: ${url}`);
  
  return await submitToIndexing([url]);
}
