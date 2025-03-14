/*
import dotenv from 'dotenv';
dotenv.config();
*/
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('shep-stats')
      .select('*')
      .single();

    console.log("Data returned from Supabase:", data);

    if (error) {
      console.error('Supabase read error:', JSON.stringify(error, null, 2));
      return res.status(500).json({ message: 'Error reading data', error });
    }

    return res.status(200).json({ message: 'Data read successfully' });
  } catch (err) {
  console.error('Unhandled error occured:', err);
  return res.status(500).json({ message: 'Unhandled error', error: err });
  }
}
