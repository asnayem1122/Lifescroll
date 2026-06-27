import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useHabitStatsData } from '../hooks/useHabitStats';
import Skeleton from '../components/ui/Skeleton';
import BrushDivider from '../components/layout/BrushDivider';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function MonthlyCalendar({ data }: { data: { date: string; rate: number }[] }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const rateMap: Record<string, number> = {};
  data.forEach((d) => { rateMap[d.date] = d.rate; });

  const getColor = (rate: number) => {
    if (rate === 0) return 'transparent';
    if (rate < 25) return 'rgba(212,175,55,0.12)';
    if (rate < 50) return 'rgba(212,175,55,0.3)';
    if (rate < 75) return 'rgba(212,175,55,0.55)';
    return 'rgba(212,175,55,0.8)';
  };

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const canGoNext = year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth());

  const weeks: React.ReactNode[] = [];
  let cells: React.ReactNode[] = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className="w-[14px] h-[14px]" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const rate = rateMap[dateStr] ?? -1;
    const title = rate >= 0 ? `${dateStr}: ${rate}%` : '';
    cells.push(
      <div
        key={day}
        className="w-[14px] h-[14px] rounded-[3px]"
        title={title}
        style={{
          background: rate >= 0 ? getColor(rate) : 'transparent',
          border: rate >= 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      />
    );
    if ((firstDay + day) % 7 === 0 || day === daysInMonth) {
      weeks.push(<div key={day} className="flex gap-[3px] items-center">{cells}</div>);
      cells = [];
    }
  }

  return (
    <div className="card card-corners p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-sm" style={{ color: 'var(--accent-gold)' }}>Monthly Calendar</h2>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1 rounded hover:bg-white/5 transition-colors" style={{ color: 'var(--text-secondary)' }}>
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{MONTHS[month]} {year}</span>
          <button
            onClick={nextMonth}
            className="p-1 rounded hover:bg-white/5 transition-colors disabled:opacity-30"
            style={{ color: 'var(--text-secondary)' }}
            disabled={!canGoNext}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="flex gap-[3px] mb-1">
        {DAYS.map((d) => (
          <div key={d} className="w-[14px] text-[8px] text-center" style={{ color: 'var(--text-secondary)' }}>{d[0]}</div>
        ))}
      </div>

      <div className="flex flex-col gap-[3px]">
        {/* First row: pad with empty cells for days before month start */}
        <div className="flex gap-[3px] items-center">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-top-${i}`} className="w-[14px] h-[14px]" />
          ))}
          {(() => {
            const firstWeekCells: React.ReactNode[] = [];
            for (let day = 1; day <= Math.min(7 - firstDay, daysInMonth); day++) {
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const rate = rateMap[dateStr] ?? -1;
              firstWeekCells.push(
                <div
                  key={day}
                  className="w-[14px] h-[14px] rounded-[3px]"
                  title={rate >= 0 ? `${dateStr}: ${rate}%` : dateStr}
                  style={{
                    background: rate >= 0 ? getColor(rate) : 'transparent',
                    border: rate >= 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  }}
                />
              );
            }
            return firstWeekCells;
          })()}
        </div>

        {/* Remaining weeks */}
        {(() => {
          const rows: React.ReactNode[] = [];
          const startDay = 8 - firstDay;
          for (let d = startDay; d <= daysInMonth; d += 7) {
            const weekCells: React.ReactNode[] = [];
            for (let offset = 0; offset < 7; offset++) {
              const day = d + offset;
              if (day > daysInMonth) {
                weekCells.push(<div key={`empty-end-${offset}`} className="w-[14px] h-[14px]" />);
              } else {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const rate = rateMap[dateStr] ?? -1;
                weekCells.push(
                  <div
                    key={day}
                    className="w-[14px] h-[14px] rounded-[3px]"
                    title={rate >= 0 ? `${dateStr}: ${rate}%` : dateStr}
                    style={{
                      background: rate >= 0 ? getColor(rate) : 'transparent',
                      border: rate >= 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    }}
                  />
                );
              }
            }
            rows.push(<div key={d} className="flex gap-[3px] items-center">{weekCells}</div>);
          }
          return rows;
        })()}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
        <span>Less</span>
        <div className="w-3 h-3 rounded-[3px]" style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(255,255,255,0.06)' }} />
        <div className="w-3 h-3 rounded-[3px]" style={{ background: 'rgba(212,175,55,0.3)', border: '1px solid rgba(255,255,255,0.06)' }} />
        <div className="w-3 h-3 rounded-[3px]" style={{ background: 'rgba(212,175,55,0.55)', border: '1px solid rgba(255,255,255,0.06)' }} />
        <div className="w-3 h-3 rounded-[3px]" style={{ background: 'rgba(212,175,55,0.8)', border: '1px solid rgba(255,255,255,0.06)' }} />
        <span>More</span>
      </div>
    </div>
  );
}

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

      <MonthlyCalendar data={stats.monthlyTrend} />

      <BrushDivider />

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
