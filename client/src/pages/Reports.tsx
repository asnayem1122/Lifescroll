import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import PageWrapper from '../components/layout/PageWrapper';
import DonutChart from '../components/budget/DonutChart';
import HeatmapGrid from '../components/charts/HeatmapGrid';
import { useBudget } from '../hooks/useBudget';
import Skeleton from '../components/ui/Skeleton';
import BrushDivider from '../components/layout/BrushDivider';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Reports() {
  const { summary, heatmap, loading } = useBudget();

  const donutData = summary?.categoryBreakdown.map((c) => ({
    name: c._id,
    value: c.total,
  })) || [];

  const areaData = summary?.yearlyTrend.map((m) => ({
    month: MONTH_NAMES[m._id - 1],
    income: m.income,
    expense: m.expense,
  })) || [];

  const barData = summary?.yearlyTrend.map((m) => ({
    month: MONTH_NAMES[m._id - 1],
    spending: m.expense,
  })) || [];

  // Month-over-month comparison
  const now = new Date();
  const currentMonthNum = now.getMonth() + 1;
  const prevMonthNum = currentMonthNum === 1 ? 12 : currentMonthNum - 1;
  const currentYearData = summary?.yearlyTrend.find((m) => m._id === currentMonthNum);
  const prevYearData = summary?.yearlyTrend.find((m) => m._id === prevMonthNum);

  const currentExpense = currentYearData?.expense ?? 0;
  const currentIncome = currentYearData?.income ?? 0;
  const prevExpense = prevYearData?.expense ?? 0;
  const prevIncome = prevYearData?.income ?? 0;

  const expenseDelta = prevExpense > 0 ? ((currentExpense - prevExpense) / prevExpense) * 100 : null;
  const incomeDelta = prevIncome > 0 ? ((currentIncome - prevIncome) / prevIncome) * 100 : null;

  function DeltaBadge({ delta, inverse }: { delta: number | null; inverse?: boolean }) {
    if (delta === null || delta === 0) {
      return <Minus size={14} className="inline" />;
    }
    const isPositive = inverse ? delta < 0 : delta > 0;
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium" style={{ color: isPositive ? '#22c55e' : '#ef4444' }}>
        {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
        {Math.abs(delta).toFixed(1)}%
      </span>
    );
  }



  if (loading) {
    return (
      <PageWrapper title="Reports" subtitle="Visualize your financial landscape">
        <Skeleton className="h-[300px]" count={5} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Reports" subtitle="Visualize your financial landscape">
      {/* Month-over-month comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="card card-corners p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>This Month Expense</span>
            <DeltaBadge delta={expenseDelta} />
          </div>
          <div className="text-2xl font-serif font-bold" style={{ color: 'var(--accent-crimson)' }}>
            ৳{currentExpense.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] mt-1" style={{ color: 'var(--text-secondary)' }}>
            vs {MONTH_NAMES[prevMonthNum - 1]} ৳{prevExpense.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="card card-corners p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>This Month Income</span>
            <DeltaBadge delta={incomeDelta} inverse />
          </div>
          <div className="text-2xl font-serif font-bold" style={{ color: 'var(--accent-gold)' }}>
            ৳{currentIncome.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] mt-1" style={{ color: 'var(--text-secondary)' }}>
            vs {MONTH_NAMES[prevMonthNum - 1]} ৳{prevIncome.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      <BrushDivider />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card card-corners p-5">
          <h2 className="font-serif text-sm mb-4" style={{ color: 'var(--accent-gold)' }}>Expense by Category</h2>
          {donutData.length > 0 ? (
            <DonutChart data={donutData} centerLabel="Total" centerValue={`৳${(summary?.monthly.expense || 0).toLocaleString('en-IN')}`} />
          ) : (
            <div className="h-[280px] flex items-center justify-center text-center">
              <p className="font-serif italic text-sm text-center" style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>
                The ledger is blank,<br />No gold has slipped from your hand,<br />Perfect stillness reigns.
              </p>
            </div>
          )}
        </div>

        <div className="card card-corners p-5">
          <h2 className="font-serif text-sm mb-4" style={{ color: 'var(--accent-gold)' }}>Income vs Expense (6 months)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="crimsonFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b0000" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8b0000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="month" stroke="#444" fontSize={12} />
              <YAxis stroke="#444" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#0f0f0f', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '4px', color: '#e8e8e8' }}
                formatter={(value) => [`৳${Number(value || 0).toLocaleString('en-IN')}`, '']}
              />
              <Area type="monotone" dataKey="income" stroke="#d4af37" fill="url(#goldFill)" strokeWidth={2} />
              <Area type="monotone" dataKey="expense" stroke="#8b0000" fill="url(#crimsonFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card card-corners p-5">
          <h2 className="font-serif text-sm mb-4" style={{ color: 'var(--accent-gold)' }}>Monthly Spending</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="month" stroke="#444" fontSize={12} />
              <YAxis stroke="#444" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#0f0f0f', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '4px', color: '#e8e8e8' }}
                formatter={(value) => [`৳${Number(value || 0).toLocaleString('en-IN')}`, '']}
              />
              <Bar dataKey="spending" fill="#d4af37" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card card-corners p-5">
          <h2 className="font-serif text-sm mb-4" style={{ color: 'var(--accent-gold)' }}>Daily Spending Heatmap</h2>
          <HeatmapGrid data={heatmap} />
        </div>
      </div>
    </PageWrapper>
  );
}
