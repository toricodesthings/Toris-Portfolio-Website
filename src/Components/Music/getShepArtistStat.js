import { createClient } from '@supabase/supabase-js';

const getEnvVar = (key) => {
  // On the server use process.env; in the browser, use import.meta.env
  if (typeof window === 'undefined') {
    return process.env[key];
  }
  return import.meta.env[key];
};

const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Fetch the latest shep-stats record from Supabase.
 * Returns an object containing followers, monthly_listeners, popularity, and fetched_at.
 */
export async function fetchShepArtistStat() {
  const { data, error } = await supabase
    .from('shep_stats')
    .select('*')
    .order('fetched_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Supabase fetch error:', JSON.stringify(error, null, 2));
    throw new Error('Failed to fetch stats');
  }

  return {
    followers: data.followers,
    monthly_listeners: data.monthly_listeners,
    popularity: data.popularity,
    fetched_at: data.fetched_at,
  };
}
