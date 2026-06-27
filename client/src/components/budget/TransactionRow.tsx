import { Pencil, Trash2, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Transaction } from '../../types/transaction';
import { formatBDT } from '../../utils/currency';
import { formatDate } from '../../utils/date';

const categoryColors: Record<string, string> = {
  Food: '#e67e22', Transport: '#3498db', Salary: '#2ecc71',
  Freelance: '#9b59b6', Entertainment: '#e74c3c', Health: '#1abc9c',
  Shopping: '#f39c12', Bills: '#c0392b', 'CP Contest': '#16a085',
  University: '#2980b9', Other: '#7f8c8d',
};

interface TransactionRowProps {
  transaction: Transaction;
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionRow({ transaction, onEdit, onDelete }: TransactionRowProps) {
  const borderColor = categoryColors[transaction.category] || '#444';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="group flex items-center gap-3 p-3 rounded transition-all duration-200"
      style={{
        background: 'var(--surface)',
        borderLeft: `3px solid ${borderColor}`,
      }}
      whileHover={{ borderLeftWidth: '6px' }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{transaction.title}</span>
          {transaction.recurring && (
            <Repeat size={12} className="shrink-0" style={{ color: 'var(--accent-gold)' }} title={`Recurring (${transaction.recurringInterval})`} />
          )}
          <span
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ background: `${borderColor}20`, color: borderColor }}
          >
            {transaction.category}
          </span>
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          {formatDate(transaction.date)}
          {transaction.note && ` · ${transaction.note}`}
        </div>
      </div>

      <div
        className="font-serif font-bold text-sm whitespace-nowrap"
        style={{ color: transaction.type === 'income' ? 'var(--accent-gold)' : 'var(--accent-crimson)' }}
      >
        {transaction.type === 'income' ? '+' : '-'}{formatBDT(transaction.amount)}
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(transaction)}
          className="p-1.5 rounded"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(transaction._id)}
          className="p-1.5 rounded"
          style={{ color: 'var(--accent-crimson)' }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}
