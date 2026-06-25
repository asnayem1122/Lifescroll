import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import type { Transaction, TransactionFormData, TransactionFilters } from '../types/transaction';
import * as api from '../api/transactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TransactionFilters>({});

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getTransactions({ ...filters, page });
      setTransactions(data.transactions);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (form: TransactionFormData) => {
    try {
      await api.createTransaction(form);
      toast.success('Transaction added');
      fetch();
    } catch {
      toast.error('Failed to add transaction');
    }
  };

  const update = async (id: string, form: Partial<TransactionFormData>) => {
    try {
      await api.updateTransaction(id, form);
      toast.success('Transaction updated');
      fetch();
    } catch {
      toast.error('Failed to update transaction');
    }
  };

  const remove = async (id: string) => {
    try {
      await api.deleteTransaction(id);
      toast.success('Transaction deleted');
      fetch();
    } catch {
      toast.error('Failed to delete transaction');
    }
  };

  return {
    transactions, total, totalPages, page, loading, filters,
    setPage, setFilters, create, update, remove, refresh: fetch,
  };
}
