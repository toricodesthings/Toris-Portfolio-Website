import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Function to get Spotify access token using client credentials flow
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
    const response = await fetch(`https://api.spotify.com/v1/artists/48ds3BHWCPZVfAzFB2At2L`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    return await response.json();
}

export default async function handler(req, res) {
    try {
        const accessToken = await getSpotifyAccessToken();
        const artistData = await getArtistData(accessToken);
        const { followers, popularity } = artistData;
        
        const { data, error } = await supabase
            .from('shep_stats')
            .insert([
                {
                    fetched_at: new Date().toISOString(),
                    followers: followers.total,
                    popularity: popularity, 
                    monthly_listeners: 19409
                }
            ]);

            if (error) {
                console.error('Supabase insert error:', JSON.stringify(error, null, 2));
                return res.status(500).json({ message: 'Error inserting data', error });
            }
        
            return res.status(200).json({ message: 'Spotify Web API data has been inserted successfully' });
    } catch (err) {
        console.error('Unhandled error occured:', err);
        return res.status(500).json({ message: 'Unhandled error', error: err });
    }
};
