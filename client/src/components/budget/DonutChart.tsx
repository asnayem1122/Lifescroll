import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DonutChartProps {
  data: { name: string; value: number }[];
  centerLabel?: string;
  centerValue?: string;
}

const COLORS = [
  '#d4af37', // Gold
  '#8b0000', // Crimson
  '#aa8c2c', // Medium Gold
  '#6b0000', // Medium Crimson
  '#e5c158', // Light Gold
  '#a81a1a', // Light Crimson
  '#80661c', // Deep Gold
  '#520000', // Deep Crimson
];

export default function DonutChart({ data, centerLabel, centerValue }: DonutChartProps) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            paddingAngle={2}
            dataKey="value"
            animationBegin={0}
            animationDuration={1500}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#0f0f0f',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#e8e8e8',
            }}
            formatter={(value) => [`৳${Number(value || 0).toLocaleString('en-IN')}`, '']}
          />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
          {centerValue && <span className="text-xl font-serif font-bold glow-gold" style={{ color: 'var(--accent-gold)' }}>{centerValue}</span>}
          {centerLabel && <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}
