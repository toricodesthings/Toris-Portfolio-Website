import supabase from '../../utils/supabaseClient';

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
