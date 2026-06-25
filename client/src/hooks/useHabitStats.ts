import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import type { HabitStats } from '../types/habit';
import { getHabitStats } from '../api/habits';

export function useHabitStatsData() {
  const [stats, setStats] = useState<HabitStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getHabitStats();
      setStats(data);
    } catch {
      toast.error('Failed to load habit stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { stats, loading, refresh: fetch };
}
