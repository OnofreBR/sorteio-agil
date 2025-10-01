import { supabase } from '@/integrations/supabase/client';

const SITE_URL = typeof window !== 'undefined' ? window.location.origin : '';

/**
 * Submits URLs to the Cloud indexing function (secure server-side indexing)
 */
export async function submitToIndexing(urls: string[]): Promise<boolean> {
  try {
    console.log(`🔄 Submitting ${urls.length} URLs to Cloud indexing function...`);
    
    const { data, error } = await supabase.functions.invoke('indexing', {
      body: { urls, type: 'URL_UPDATED' },
    });

    if (error) {
      console.error('❌ Cloud indexing error:', error);
      return false;
    }

    console.log('✅ Cloud indexing response:', data);
    return data?.success || false;
  } catch (error) {
    console.error('❌ Error calling Cloud indexing:', error);
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
