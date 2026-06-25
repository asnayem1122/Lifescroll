import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  color?: string;
  icon?: ReactNode;
  isCurrency?: boolean;
}

function AnimatedCounter({ end, duration = 1.5, formattingFn }: { end: number; duration?: number; formattingFn: (v: number) => string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = 0;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(Math.floor(progress * (end - startValue) + startValue));
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration]);

  return <>{formattingFn(count)}</>;
}

export default function StatCard({ label, value, prefix = '', color, icon, isCurrency = true }: StatCardProps) {
  const formatValue = (val: number) => {
    if (!isCurrency) return val.toString();
    return Math.abs(val).toLocaleString('en-IN');
  };

  return (
    <div className="card card-corners p-4 lg:p-5 flex-1 min-w-[160px]">
      <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--text-secondary)' }}>
        {icon}
        <span className="text-xs tracking-wider uppercase">{label}</span>
      </div>
      <div style={{ color: color || 'var(--text-primary)' }} className="glow-gold">
        <span className="text-lg font-serif">{prefix || (isCurrency ? '৳' : '')}</span>
        <span className="text-2xl lg:text-3xl font-serif font-bold">
          <AnimatedCounter key={value} end={value} duration={1.5} formattingFn={formatValue} />
        </span>
      </div>
    </div>
  );
}
