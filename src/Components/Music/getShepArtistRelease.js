import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env[`VITE_SUPABASE_URL`];
const SUPABASE_ANON_KEY = import.meta.env[`VITE_SUPABASE_ANON_KEY`];

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function fetchArtistReleases() {
  const { data, error } = await supabase
    .from('shep_releases')
    .select('*')
    .order('release_date', { ascending: false });

  if (error) {
    console.error('Supabase fetch error:', JSON.stringify(error, null, 2));
    throw new Error('Failed to fetch releases');
  }

  const releases = data.map((release) => {
    const totalSeconds = release.length;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return {
      title: release.title,
      featured_artists: release.featured_artists,
      release_date: release.release_date,
      key: release.key,
      length: {
        minutes,
        seconds,
        formatted: `${minutes}:${seconds.toString().padStart(2, '0')}`,
      },
      mp3_link: release.mp3_prev,
      artwork_link: release.art_prev,
      latest_release: release.is_latest,
      cover_song: release.is_cover,
    };
  });
  console.log(releases)
  return releases;
}


