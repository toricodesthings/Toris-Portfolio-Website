import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function handler(req, res) {
  const { data, error } = await supabase
    .from('shep-stats')
    .select('*')
    .single();

  console.log("Data returned from Supabase:", data);

  if (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
}
