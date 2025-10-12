// @ts-nocheck
/// <reference lib="deno.ns" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESULTS_API_URL = Deno.env.get('RESULTS_API_URL') || '';
const RESULTS_API_TOKEN = Deno.env.get('RESULTS_API_TOKEN') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');

const LOTTERY_MAP: Record<string, string> = {
  'megasena': 'mega-sena',
  'lotofacil': 'lotofacil',
  'quina': 'quina',
  'lotomania': 'lotomania',
  'timemania': 'timemania',
  'duplasena': 'duplasena',
  'federal': 'federal',
  'diadesorte': 'diadesorte',
  'supersete': 'supersete',
  'maismilionaria': '+milionaria',
};

interface CheckResult {
  lottery: string;
  contest: number;
  isNew: boolean;
}

const lastCheckedContests: Record<string, number> = {};

async function fetchLatestContest(lottery: string): Promise<number | null> {
  try {
    const lotteryId = LOTTERY_MAP[lottery];
    const url = `${RESULTS_API_URL}/${lotteryId}/latest?token=${RESULTS_API_TOKEN}`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      return data.concurso;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching ${lottery}:`, error);
    return null;
  }
}

async function triggerIndexing(urls: string[]) {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/indexing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      },
      body: JSON.stringify({ urls }),
    });

    if (response.ok) {
      console.log(`✅ Triggered indexing for ${urls.length} URLs`);
      return true;
    } else {
      console.error('❌ Failed to trigger indexing:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('❌ Error triggering indexing:', error);
    return false;
  }
}

async function checkForNewResults(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  
  for (const lottery of Object.keys(LOTTERY_MAP)) {
    const latestContest = await fetchLatestContest(lottery);
    
    if (latestContest !== null) {
      const lastChecked = lastCheckedContests[lottery] || 0;
      const isNew = latestContest > lastChecked;
      
      results.push({
        lottery,
        contest: latestContest,
        isNew,
      });
      
      if (isNew) {
        console.log(`🆕 New result detected: ${lottery} #${latestContest}`);
        lastCheckedContests[lottery] = latestContest;
      }
    }
  }
  
  return results;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 Checking for new lottery results...');
    
    const url = new URL(req.url);
    const siteUrl = `${url.protocol}//${url.host}`;
    
    const checkResults = await checkForNewResults();
    const newResults = checkResults.filter(r => r.isNew);
    
    if (newResults.length > 0) {
      console.log(`✅ Found ${newResults.length} new results`);
      
      // Generate URLs to index
      const urlsToIndex = newResults.map(
        r => `${siteUrl}/${r.lottery}/${r.contest}`
      );
      
      // Trigger indexing
      await triggerIndexing(urlsToIndex);
      
      return new Response(
        JSON.stringify({
          success: true,
          newResults: newResults.length,
          results: newResults,
          indexed: urlsToIndex,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.log('ℹ️ No new results found');
      
      return new Response(
        JSON.stringify({
          success: true,
          newResults: 0,
          message: 'No new results',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('❌ Error in lottery webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
