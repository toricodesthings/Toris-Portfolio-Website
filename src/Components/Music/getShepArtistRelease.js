import { createClient } from '@supabase/supabase-js';
/*
const SUPABASE_URL = import.meta.env[`VITE_SUPABASE_URL`];
const SUPABASE_ANON_KEY = import.meta.env[`VITE_SUPABASE_ANON_KEY`];
*/

const SUPABASE_URL = "https://qkmdshadstixoyupfoey.supabase.co/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrbWRzaGFkc3RpeG95dXBmb2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MjE2NzYsImV4cCI6MjA1NzQ5NzY3Nn0.66O_wXmc9hVNrFTrnTobjIMfXn4A2DW06z66gJTdiS4";

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function fetchArtistReleases() {
  // Query all Spotify releases ordered by release date (newest first)
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
      // Ensure featured_artist is always an array: if null, default to an empty array.
      featured_artists: release.featured_artist ?? [],
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

  return releases;
}


