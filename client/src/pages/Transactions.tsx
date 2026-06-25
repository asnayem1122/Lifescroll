import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import TransactionRow from '../components/budget/TransactionRow';
import TransactionForm from '../components/budget/TransactionForm';
import Modal from '../components/ui/Modal';
import Skeleton from '../components/ui/Skeleton';
import { useTransactions } from '../hooks/useTransactions';
import type { Transaction, TransactionFormData } from '../types/transaction';
import { today } from '../utils/date';

import BrushDivider from '../components/layout/BrushDivider';

const categories = ['All', 'Food', 'Transport', 'Salary', 'Freelance', 'Entertainment', 'Health', 'Shopping', 'Bills', 'CP Contest', 'University', 'Other'];

export default function Transactions() {
  const { transactions, total, totalPages, page, loading, filters, setPage, setFilters, create, update, remove } = useTransactions();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = async (data: TransactionFormData) => {
    if (editing) {
      await update(editing._id, data);
    } else {
      await create(data);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleEdit = (t: Transaction) => {
    setEditing(t);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this transaction?')) {
      await remove(id);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  return (
    <PageWrapper
      title="Transactions"
      subtitle="Every entry tells a story"
      action={
        <button onClick={openAdd} className="btn btn-gold text-sm">
          <Plus size={16} /> Add
        </button>
      }
    >
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-ghost text-xs"
        >
          <Filter size={14} /> Filters
        </button>
        {['income', 'expense'].map((t) => (
          <button
            key={t}
            onClick={() => setFilters({ ...filters, type: filters.type === t ? undefined : t })}
            className="btn btn-ghost text-xs"
            style={{
              borderColor: filters.type === t ? 'var(--accent-gold)' : '#222',
              color: filters.type === t ? 'var(--accent-gold)' : 'var(--text-secondary)',
            }}
          >
            {t}
          </button>
        ))}
        <div className="text-xs ml-auto" style={{ color: 'var(--text-secondary)' }}>
          {total} entries
        </div>
      </div>

      {showFilters && (
        <div className="card p-4 mb-4 flex flex-wrap gap-3">
          <select
            value={filters.category || ''}
            onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
            className="flex-1 min-w-[120px]"
          >
            <option value="">All Categories</option>
            {categories.slice(1).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value || undefined })}
            className="flex-1 min-w-[120px]"
          />
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value || undefined })}
            className="flex-1 min-w-[120px]"
          />
        </div>
      )}

      <BrushDivider />

      <div className="space-y-2">
        {loading ? (
          <Skeleton count={5} className="h-[60px] mb-2" />
        ) : transactions.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="font-serif italic text-center" style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>
              The page lies in wait,<br />No brush has yet traced your path,<br />A clean scroll remains.
            </p>
          </div>
        ) : (
          transactions.map((tx) => (
            <TransactionRow key={tx._id} transaction={tx} onEdit={handleEdit} onDelete={handleDelete} />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className="w-8 h-8 rounded text-xs"
              style={{
                background: p === page ? 'var(--accent-gold)' : 'var(--surface)',
                color: p === page ? '#080808' : 'var(--text-secondary)',
                border: '1px solid #222',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? 'Edit Transaction' : 'New Transaction'}
      >
        <TransactionForm
          onSubmit={handleSubmit}
          initial={editing ? {
            title: editing.title,
            amount: editing.amount.toString(),
            type: editing.type,
            category: editing.category,
            date: editing.date.split('T')[0] || today(),
            note: editing.note,
          } : undefined}
        />
      </Modal>
    </PageWrapper>
  );
}
