import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import StatCard from '../components/budget/StatCard';
import CompletionRing from '../components/habits/CompletionRing';
import DonutChart from '../components/budget/DonutChart';
import { useBudget } from '../hooks/useBudget';
import { useHabits } from '../hooks/useHabits';
import Skeleton from '../components/ui/Skeleton';
import PageWrapper from '../components/layout/PageWrapper';
import PineTree from '../components/layout/PineTree';
import BrushDivider from '../components/layout/BrushDivider';

export default function Dashboard() {
  const { summary, loading: budgetLoading } = useBudget();
  const { activeHabits, completedCount, completionRate, getLog, toggleLog, toggling, loading: habitsLoading } = useHabits();

  const donutData = summary?.categoryBreakdown.map((c) => ({
    name: c._id,
    value: c.total,
  })) || [];

  return (
    <PageWrapper>
      <div className="flex items-start justify-between">
        <div>
          <h1
            className="font-serif text-2xl lg:text-3xl font-bold"
            style={{ background: 'linear-gradient(135deg, #e8e8e8, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Your life, in balance</p>
        </div>
        <div className="hidden lg:block">
          <PineTree />
        </div>
      </div>

      <BrushDivider />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {budgetLoading ? (
          <>
            <Skeleton className="h-[100px]" /><Skeleton className="h-[100px]" /><Skeleton className="h-[100px]" />
          </>
        ) : (
          <>
            <StatCard
              label="Balance"
              value={summary?.monthly.balance || 0}
              color="var(--text-primary)"
              icon={<Wallet size={14} />}
            />
            <StatCard
              label="Income"
              value={summary?.monthly.income || 0}
              color="var(--accent-gold)"
              icon={<ArrowUpRight size={14} />}
            />
            <StatCard
              label="Expenses"
              value={summary?.monthly.expense || 0}
              color="var(--accent-crimson)"
              icon={<ArrowDownRight size={14} />}
            />
          </>
        )}
      </div>

      <BrushDivider />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card card-corners p-5">
          <h2 className="font-serif text-sm mb-4" style={{ color: 'var(--accent-gold)' }}>Today's Progress</h2>
          {habitsLoading ? (
            <Skeleton className="h-[220px]" />
          ) : (
            <div className="flex flex-col items-center">
              <CompletionRing percentage={completionRate} />
              <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>
                {completedCount} of {activeHabits.length} habits completed
              </p>
              <div className="w-full space-y-2 mt-4">
                {activeHabits.slice(0, 5).map((habit) => {
                  const log = getLog(habit._id);
                  return (
                    <div key={habit._id} className="flex items-center justify-between text-xs py-1" style={{ borderBottom: '1px solid var(--border)' }}>
                      <span>{habit.name}</span>
                      <button
                        onClick={() => toggleLog(habit._id)}
                        disabled={toggling === habit._id}
                        className="px-2 py-0.5 rounded text-[10px] transition-all duration-200"
                        style={{
                          background: log?.completed ? 'rgba(212,175,55,0.15)' : 'transparent',
                          border: `1px solid ${log?.completed ? 'var(--accent-gold)' : '#333'}`,
                          color: log?.completed ? 'var(--accent-gold)' : '#444',
                        }}
                        onMouseEnter={(e) => {
                          if (!log?.completed) {
                            e.currentTarget.style.background = 'rgba(212,175,55,0.08)';
                            e.currentTarget.style.borderColor = 'var(--accent-gold)';
                            e.currentTarget.style.color = 'var(--accent-gold)';
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!log?.completed) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = '#333';
                            e.currentTarget.style.color = '#444';
                            e.currentTarget.style.transform = 'scale(1)';
                          }
                        }}
                      >
                        {log?.completed ? '✓ Stamped' : toggling === habit._id ? '...' : 'Stamp'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="card card-corners p-5">
          <h2 className="font-serif text-sm mb-4" style={{ color: 'var(--accent-gold)' }}>Spending Breakdown</h2>
          {budgetLoading ? (
            <Skeleton className="h-[220px]" />
          ) : donutData.length > 0 ? (
            <DonutChart
              data={donutData}
              centerLabel="Total"
              centerValue={`৳${(summary?.monthly.expense || 0).toLocaleString('en-IN')}`}
            />
          ) : (
            <div className="flex items-center justify-center h-[220px]">
              <p className="font-serif italic text-sm text-center" style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>
                No entries yet<br />The ledger awaits your ink<br />Spend, then reflect here
              </p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
