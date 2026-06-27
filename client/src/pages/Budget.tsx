import { useState } from 'react';
import { Save } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useBudget } from '../hooks/useBudget';
import Skeleton from '../components/ui/Skeleton';
import BrushDivider from '../components/layout/BrushDivider';

const defaultCategories = [
  'Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Bills', 'CP Contest', 'University', 'Other',
];

export default function Budget() {
  const { budget, loading, updateLimits } = useBudget();
  const [editing, setEditing] = useState(false);
  const [limits, setLimits] = useState<{ category: string; limit: number }[]>([]);

  const startEditing = () => {
    setLimits(
      (budget?.budgets || []).map((b) => ({ category: b.category, limit: b.limit }))
    );
    setEditing(true);
  };

  const handleSave = async () => {
    await updateLimits(limits.filter((l) => l.limit > 0));
    setEditing(false);
  };

  const setLimit = (category: string, value: number) => {
    setLimits((prev) => {
      const exists = prev.find((l) => l.category === category);
      if (exists) {
        return prev.map((l) => l.category === category ? { ...l, limit: value } : l);
      }
      return [...prev, { category, limit: value }];
    });
  };

  const getLimit = (category: string) => {
    if (editing) return limits.find((l) => l.category === category)?.limit || 0;
    return budget?.budgets.find((b) => b.category === category)?.limit || 0;
  };

  const getSpent = (category: string) => budget?.budgets.find((b) => b.category === category)?.spent || 0;
  const getPercentage = (category: string) => budget?.budgets.find((b) => b.category === category)?.percentage || 0;

  if (loading) {
    return (
      <PageWrapper title="Budget Goals" subtitle="Define your financial borders">
        <Skeleton className="h-[100px]" count={6} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Budget Goals"
      subtitle="Define your financial borders"
      action={
        editing ? (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="btn btn-ghost text-xs">Cancel</button>
            <button onClick={handleSave} className="btn btn-gold text-xs"><Save size={14} /> Save</button>
          </div>
        ) : (
          <button onClick={startEditing} className="btn btn-gold text-xs">Set Limits</button>
        )
      }
    >
      <BrushDivider />

      <div className="space-y-4">
        {defaultCategories.map((category) => {
          const limit = getLimit(category);
          const spent = getSpent(category);
          const percentage = editing ? 0 : getPercentage(category);
          const isOver = percentage >= 80;
          const isComplete = percentage >= 100;
          const hasBudget = limit > 0;

          return (
            <div key={category} className="card card-corners p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-medium">{category}</span>
                  {hasBudget && !editing && (
                    <span className="text-xs ml-2" style={{ color: 'var(--text-secondary)' }}>
                      ৳{spent.toLocaleString('en-IN')} / ৳{limit.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                {editing ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Limit:</span>
                    <input
                      type="number"
                      value={getLimit(category) || ''}
                      onChange={(e) => setLimit(category, parseFloat(e.target.value) || 0)}
                      className="w-24 text-right"
                      min="0"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    />
                  </div>
                ) : hasBudget ? (
                  <span className="text-xs font-serif font-bold" style={{ color: isOver ? 'var(--accent-crimson)' : 'var(--text-primary)' }}>
                    {percentage.toFixed(0)}%
                  </span>
                ) : null}
              </div>

              {hasBudget && !editing && (
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: '#1a1a1a', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      background: isOver
                        ? 'linear-gradient(90deg, #8b0000, #c0392b)'
                        : 'linear-gradient(90deg, #d4af37, #e0c050)',
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      animation: isOver ? 'pulseCrimson 2s ease-in-out infinite' : 'none',
                      boxShadow: isOver
                        ? '0 0 8px rgba(139,0,0,0.4)'
                        : '0 0 6px rgba(212,175,55,0.2)',
                    }}
                  />
                </div>
              )}

              {isComplete && !editing && (
                <div className="mt-1 text-right">
                  <span className="text-xs" style={{ color: 'var(--accent-gold)' }}>✓ Seal Stamped</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PageWrapper>
  );
}
