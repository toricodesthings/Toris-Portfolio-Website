/* eslint-disable no-undef */
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { DateTime } from 'luxon';
import { Buffer } from 'buffer'; 

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
  const response = await axios.post('https://accounts.spotify.com/api/token', 
    'grant_type=client_credentials',
    {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data.access_token;
}

async function getArtistData(accessToken) {
  const response = await axios.get('https://api.spotify.com/v1/artists/48ds3BHWCPZVfAzFB2At2L', {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  return response.data;
}

async function getMonthlyListeners() {
  try {
    // First attempt
    const response = await axios.get('https://utility.toridoesthings.xyz/statistify/get/monthly-listeners/48ds3BHWCPZVfAzFB2At2L');
    const listeners = Number(response.data.monthlyListeners);
    
    // Check if listeners is a valid number (not NaN, null, undefined, or 0)
    if (!listeners) {
      console.log('Invalid monthly listeners data, retrying attempted...');
      // Wait a short time before retry
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Second attempt
      const retryResponse = await axios.get('https://utility.toridoesthings.xyz/statistify/get/monthly-listeners/48ds3BHWCPZVfAzFB2At2L');
      const retryListeners = Number(retryResponse.data.monthlyListeners);
      
      // Return retry results (even if still invalid)
      return retryListeners || null; // Return 0 as fallback if still invalid
    }
    
    return listeners;
  } catch (error) {
    console.error('Error fetching monthly listeners:', error);
    return null; // Fallback value if all attempts fail
  }
}
export default async function handler(req, res) {
  try {
    const now = DateTime.now().setZone('America/Toronto');
    const startOfDay = now.startOf('day').toUTC().toISO();
    const endOfDay = now.endOf('day').toUTC().toISO();

    const { data: existingLogs, error: fetchError } = await supabase
      .from('shep_stats')
      .select('fetched_at')
      .gte('fetched_at', startOfDay)
      .lte('fetched_at', endOfDay)
      .order('fetched_at', { ascending: true });

    if (fetchError) {
      return res.status(500).json({ message: 'Error checking existing data', error: fetchError });
    }

    if (existingLogs.length >= 2) {
      const fetchedTime = DateTime.fromISO(existingLogs[0].fetched_at, { zone: 'utc' }).setZone('America/Toronto');
      const threePM = now.set({ hour: 14, minute: 0, second: 0, millisecond: 0 });

      if (fetchedTime >= threePM) {
        return res.status(200).json({ message: 'Rate Limited: 2 Updates per Day reached' });
      }
    }

    const accessToken = await getSpotifyAccessToken();
    const artistData = await getArtistData(accessToken);
    const monthlyListeners = await getMonthlyListeners();
    const { followers, popularity } = artistData;

    const { error } = await supabase
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
      return res.status(500).json({ message: 'Error inserting data', error });
    }

    return res.status(200).json({ message: 'Spotify data inserted successfully.' });
  } catch (err) {
    console.error('Unhandled API error occurred:', err);
    return res.status(500).json({ message: 'Unhandled error', error: err });
  }
  
}