
import dotenv from 'dotenv';
dotenv.config();


import { createClient } from '@supabase/supabase-js';

const getEnvVar = (key) => {
  // Check if we're on the server (Node.js) or the client (browser)
  if (typeof window === 'undefined') {
    return process.env[key];
  }
  return import.meta.env[key];
};

const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('shep-stats')
      .select('*')
      .order('fetched_at', { ascending: false })
      .limit(1)
      .single();

    console.log("Data returned from Supabase:", data);

    if (error) {
      console.error('Supabase read error:', JSON.stringify(error, null, 2));
      return res.status(500).json({ message: 'Error reading data', error });
    }

    return res.status(200).json({ message: 'Data read successfully', data });
  } catch (err) {
  console.error('Unhandled error occured:', err);
  return res.status(500).json({ message: 'Unhandled error', error: err });
  }
}
