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

  let monthlyListeners = data.monthly_listeners;

  if (monthlyListeners === null) {
    // Fetch the most recent non-null monthly_listeners value
    const { data: mlData, error: mlError } = await supabase
      .from('shep_stats')
      .select('monthly_listeners')
      .order('fetched_at', { ascending: false })
      .not('monthly_listeners', 'is', null)
      .limit(1)
      .single();

    if (!mlError && mlData && mlData.monthly_listeners !== null) {
      monthlyListeners = mlData.monthly_listeners;
    }
  }

  return {
    followers: data.followers,
    monthly_listeners: monthlyListeners,
    popularity: data.popularity,
    fetched_at: data.fetched_at,
  };
}
