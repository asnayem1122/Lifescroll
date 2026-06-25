interface CompletionRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export default function CompletionRing({ percentage, size = 120, strokeWidth = 6 }: CompletionRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1a1a1a"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#d4af37"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1s ease-in-out',
            filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.3)) url(#ink-brush-edge)',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-2xl font-serif font-bold glow-gold" style={{ color: 'var(--accent-gold)' }}>
          {percentage}%
        </span>
        <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>today</span>
      </div>
    </div>
  );
}
