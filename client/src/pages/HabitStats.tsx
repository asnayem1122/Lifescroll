import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import PageWrapper from '../components/layout/PageWrapper';
import { useHabitStatsData } from '../hooks/useHabitStats';
import Skeleton from '../components/ui/Skeleton';

export default function HabitStats() {
  const { stats, loading } = useHabitStatsData();

  if (loading) {
    return (
      <PageWrapper title="Habit Analytics" subtitle="Your consistency, measured">
        <Skeleton className="h-[200px]" count={4} />
      </PageWrapper>
    );
  }

  if (!stats) return null;

  const barChartData = stats.perHabitStats.map((h) => ({
    name: h.name.length > 12 ? h.name.slice(0, 12) + '...' : h.name,
    rate: h.rate,
  }));

  const weeklyData = stats.weeklyData.map((d) => ({
    day: d.day,
    rate: d.rate,
  }));

  const monthlyData = stats.monthlyTrend.map((d) => ({
    date: d.date.slice(5),
    rate: d.rate,
  }));

  const bestDay = [...stats.weeklyData].sort((a, b) => b.rate - a.rate)[0];

  return (
    <PageWrapper title="Habit Analytics" subtitle="Your consistency, measured">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card card-corners p-4 text-center">
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Completion Rate</div>
          <div className="text-3xl font-serif font-bold mt-1 glow-gold" style={{ color: 'var(--accent-gold)' }}>
            {stats.overall.rate}%
          </div>
        </div>
        <div className="card card-corners p-4 text-center">
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Today</div>
          <div className="text-3xl font-serif font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
            {stats.today.completed}/{stats.today.total}
          </div>
        </div>
        <div className="card card-corners p-4 text-center">
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Best Day</div>
          <div className="text-lg font-serif font-bold mt-1" style={{ color: 'var(--accent-gold)' }}>
            {bestDay?.day} — {bestDay?.rate}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card card-corners p-5">
          <h2 className="font-serif text-sm mb-4" style={{ color: 'var(--accent-gold)' }}>Per-Habit Consistency</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis type="number" stroke="#444" fontSize={12} domain={[0, 100]} />
              <YAxis type="category" dataKey="name" stroke="#444" fontSize={11} width={120} />
              <Tooltip
                contentStyle={{ background: '#0f0f0f', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '4px', color: '#e8e8e8' }}
                formatter={(value) => [`${Number(value || 0)}%`, 'Rate']}
              />
              <Bar dataKey="rate" fill="#d4af37" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card card-corners p-5">
          <h2 className="font-serif text-sm mb-4" style={{ color: 'var(--accent-gold)' }}>Weekly Heatmap</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="day" stroke="#444" fontSize={12} />
              <YAxis stroke="#444" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: '#0f0f0f', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '4px', color: '#e8e8e8' }}
                formatter={(value) => [`${Number(value || 0)}%`, 'Rate']}
              />
              <Bar dataKey="rate" fill="#d4af37" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card card-corners p-5 lg:col-span-2">
          <h2 className="font-serif text-sm mb-4" style={{ color: 'var(--accent-gold)' }}>Monthly Trend (30 days)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="date" stroke="#444" fontSize={10} interval={4} />
              <YAxis stroke="#444" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: '#0f0f0f', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '4px', color: '#e8e8e8' }}
                formatter={(value) => [`${Number(value || 0)}%`, 'Rate']}
              />
              <Line type="monotone" dataKey="rate" stroke="#d4af37" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card card-corners p-5 lg:col-span-2">
          <h2 className="font-serif text-sm mb-4" style={{ color: 'var(--accent-gold)' }}>Streaks</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>
                  <th className="text-left py-2 font-normal">Habit</th>
                  <th className="text-right py-2 font-normal">Current Streak</th>
                  <th className="text-right py-2 font-normal">Personal Best</th>
                  <th className="text-right py-2 font-normal">Rate</th>
                </tr>
              </thead>
              <tbody>
                {stats.perHabitStats.map((h) => {
                  const s = stats.streaks[h.habitId];
                  return (
                    <tr key={h.habitId} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-2">{h.name}</td>
                      <td className="text-right py-2" style={{ color: 'var(--accent-gold)' }}>🔥 {s?.current || 0}d</td>
                      <td className="text-right py-2" style={{ color: 'var(--text-secondary)' }}>{s?.longest || 0}d</td>
                      <td className="text-right py-2">{h.rate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
