import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import type { BudgetData, SummaryData, HeatmapData } from '../types/budget';
import * as api from '../api/budget';
import * as txApi from '../api/transactions';

export function useBudget() {
  const [budget, setBudget] = useState<BudgetData | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const [b, s, h] = await Promise.all([
        api.getBudget(),
        txApi.getSummary(),
        api.getHeatmap(),
      ]);
      setBudget(b);
      setSummary(s);
      setHeatmap(h);
    } catch {
      toast.error('Failed to load budget data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const updateLimits = async (limits: { category: string; limit: number }[]) => {
    try {
      await api.updateBudget(limits);
      toast.success('Budget limits updated');
      fetch();
    } catch {
      toast.error('Failed to update budget');
    }
  };

  return { budget, summary, heatmap, loading, updateLimits, refresh: fetch };
}
