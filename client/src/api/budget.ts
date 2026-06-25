import api from './axios';
import type { BudgetData } from '../types/budget';

export async function getBudget(): Promise<BudgetData> {
  const { data } = await api.get('/budget');
  return data;
}

export async function updateBudget(limits: { category: string; limit: number }[]): Promise<void> {
  await api.put('/budget', { limits });
}

export async function getHeatmap() {
  const { data } = await api.get('/budget/heatmap');
  return data;
}
