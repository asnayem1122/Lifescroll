import type { HeatmapData } from '../../types/budget';

interface HeatmapGridProps {
  data: HeatmapData[];
}

export default function HeatmapGrid({ data }: HeatmapGridProps) {
  const maxValue = Math.max(...data.map((d) => d.total), 1);
  const dayMap: Record<string, number> = {};
  data.forEach((d) => { dayMap[d._id] = d.total; });

  const weeks: { date: string; day: number }[][] = [];
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfWeek = startOfYear.getDay();

  let currentWeek: { date: string; day: number }[] = [];
  for (let i = 0; i < dayOfWeek; i++) {
    currentWeek.push({ date: '', day: i });
  }

  for (let d = new Date(startOfYear); d <= now; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    currentWeek.push({ date: dateStr, day: d.getDay() });
    if (d.getDay() === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const getIntensity = (value: number) => {
    if (value === 0) return 'transparent';
    const ratio = value / maxValue;
    if (ratio < 0.25) return 'rgba(212,175,55,0.15)';
    if (ratio < 0.5) return 'rgba(212,175,55,0.3)';
    if (ratio < 0.75) return 'rgba(212,175,55,0.5)';
    return 'rgba(212,175,55,0.75)';
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1" style={{ minWidth: '600px' }}>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((cell, ci) => (
              <div
                key={ci}
                className="w-3 h-3 rounded-sm"
                style={{
                  background: cell.date ? getIntensity(dayMap[cell.date] || 0) : 'transparent',
                  border: cell.date ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
                title={cell.date ? `${cell.date}: ৳${(dayMap[cell.date] || 0).toLocaleString('en-IN')}` : ''}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(255,255,255,0.05)' }} />
        <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(212,175,55,0.3)', border: '1px solid rgba(255,255,255,0.05)' }} />
        <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(212,175,55,0.5)', border: '1px solid rgba(255,255,255,0.05)' }} />
        <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(212,175,55,0.75)', border: '1px solid rgba(255,255,255,0.05)' }} />
        <span>More</span>
      </div>
    </div>
  );
}
