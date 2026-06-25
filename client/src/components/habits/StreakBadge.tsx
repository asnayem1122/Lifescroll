import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  current: number;
  longest: number;
}

export default function StreakBadge({ current, longest }: StreakBadgeProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span style={{ color: 'var(--accent-gold)' }} className="flex items-center gap-1">
        <Flame size={12} />
        {current} days
      </span>
      {longest > current && (
        <span style={{ color: 'var(--text-secondary)' }}>
          Best: {longest}
        </span>
      )}
    </div>
  );
}
