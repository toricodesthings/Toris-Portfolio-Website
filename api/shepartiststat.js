import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

//Secure env
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function getSpotifyAccessToken() {
  const credentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  const data = await response.json();
  return data.access_token;
}

// Function to get artist data from Spotify
async function getArtistData(accessToken) {
  const response = await fetch('https://api.spotify.com/v1/artists/48ds3BHWCPZVfAzFB2At2L', {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  return await response.json();
}

async function getMonthlyListeners() {
  const response = await fetch('https://utility.toridoesthings.xyz/get/monthly-listeners/48ds3BHWCPZVfAzFB2At2L');
  const data = await response.json();
  return Number(data.monthlyListeners);
}

export default async function handler(req, res) {
  const secret = req.headers['x-cron-secret'];

  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ message: 'Nuh uh! Unauthorized' });
  }

  try {
    const accessToken = await getSpotifyAccessToken();
    const artistData = await getArtistData(accessToken);
    const monthlyListeners = await getMonthlyListeners();
    const { followers, popularity } = artistData;
    
    const { data, error } = await supabase
      .from('shep_stats')
      .insert([
        {
          fetched_at: new Date().toISOString(),
          followers: followers.total,
          popularity: popularity, 
          monthly_listeners: monthlyListeners
        }
      ]);

    if (error) {
      console.error('Supabase insert error:', JSON.stringify(error, null, 2));
      return res.status(500).json({ message: 'Error inserting data', error });
    }
    
    return res.status(200).json({ message: 'Yay, spotify Web API data has been inserted without errors.' });
  } catch (err) {
    console.error('Unhandled error occurred:', err);
    return res.status(500).json({ message: 'Unhandled error', error: err });
  }
};
