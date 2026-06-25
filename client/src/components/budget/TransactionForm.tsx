import { useState, useEffect } from 'react';
import type { TransactionFormData } from '../../types/transaction';
import { today } from '../../utils/date';

const categories = [
  'Food', 'Transport', 'Salary', 'Freelance', 'Entertainment',
  'Health', 'Shopping', 'Bills', 'CP Contest', 'University', 'Other',
];

interface Props {
  onSubmit: (data: TransactionFormData) => void;
  initial?: TransactionFormData;
  loading?: boolean;
}

export default function TransactionForm({ onSubmit, initial, loading }: Props) {
  const [form, setForm] = useState<TransactionFormData>({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Other',
    date: today(),
    note: '',
  });

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Title</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="What was this for?"
          required
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Amount (৳)</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="0"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Type</label>
          <div
            className="flex rounded overflow-hidden"
            style={{ border: '1px solid #222' }}
          >
            <button
              type="button"
              onClick={() => setForm({ ...form, type: 'expense' })}
              className="px-3 py-2.5 text-xs transition-all"
              style={{
                background: form.type === 'expense' ? 'var(--accent-crimson)' : 'transparent',
                color: form.type === 'expense' ? '#fff' : 'var(--text-secondary)',
              }}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, type: 'income' })}
              className="px-3 py-2.5 text-xs transition-all"
              style={{
                background: form.type === 'income' ? 'var(--accent-gold)' : 'transparent',
                color: form.type === 'income' ? '#080808' : 'var(--text-secondary)',
              }}
            >
              Income
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Category</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Date</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Note (optional)</label>
        <textarea
          value={form.note || ''}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          placeholder="Any additional details..."
          rows={2}
        />
      </div>

      <button type="submit" className="btn btn-gold w-full justify-center" disabled={loading}>
        {loading ? 'Saving...' : initial ? 'Update Transaction' : 'Add Transaction'}
      </button>
    </form>
  );
}
