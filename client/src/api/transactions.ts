import api from './axios';
import type { Transaction, TransactionFormData, TransactionsResponse, TransactionFilters } from '../types/transaction';

export async function getTransactions(filters: TransactionFilters = {}): Promise<TransactionsResponse> {
  const params = new URLSearchParams();
  if (filters.type) params.append('type', filters.type);
  if (filters.category) params.append('category', filters.category);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.page) params.append('page', filters.page.toString());
  const { data } = await api.get(`/transactions?${params}`);
  return data;
}

export async function createTransaction(form: TransactionFormData): Promise<Transaction> {
  const { data } = await api.post('/transactions', {
    ...form,
    amount: parseFloat(form.amount),
  });
  return data;
}

export async function updateTransaction(id: string, form: Partial<TransactionFormData>): Promise<Transaction> {
  const { amount, ...rest } = form;
  const payload: Partial<Omit<TransactionFormData, 'amount'>> & { amount?: number } = {
    ...rest,
    amount: amount ? parseFloat(amount) : undefined,
  };
  const { data } = await api.put(`/transactions/${id}`, payload);
  return data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await api.delete(`/transactions/${id}`);
}

export async function getSummary() {
  const { data } = await api.get('/transactions/summary');
  return data;
}

export async function generateRecurring() {
  const { data } = await api.post('/transactions/generate-recurring');
  return data as { created: number; titles: string[] };
}
