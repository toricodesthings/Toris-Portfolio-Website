import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { formatDistanceToNow } from 'date-fns';

// Supabase client setup
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// React hook using Supabase real-time subscription
export function useToriStat() {
  const [stat, setStat] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchInitial = async () => {
      const { data, error } = await supabase
        .from('tori_status')
        .select('last_seen, active, status')
        .eq('id', 1)
        .single();

      if (!error && isMounted) {
        setStat({
          last_seen: formatDistanceToNow(new Date(data.last_seen), { addSuffix: true }),
          active: data.active,
          status: data.status,
        });
      }
    };

    fetchInitial();

    const channel = supabase
      .channel('tori_status_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tori_status',
          filter: 'id=eq.1',
        },
        (payload) => {
          const data = payload.new;
          if (isMounted) {
            setStat({
              last_seen: formatDistanceToNow(new Date(data.last_seen), { addSuffix: true }),
              active: data.active,
              status: data.status,
            });
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return stat;
}
