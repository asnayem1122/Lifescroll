export default function PineTree() {
  return (
    <div className="w-20 h-32 opacity-10" style={{ animation: 'pineSway 8s ease-in-out infinite' }}>
      <svg viewBox="0 0 100 160" preserveAspectRatio="xMidYMid meet">
        <path
          d="M50 5 L60 35 L55 35 L65 60 L58 60 L68 85 L55 85 L75 120 L70 120 L80 140 L20 140 L30 120 L25 120 L45 85 L32 85 L42 60 L35 60 L45 35 L40 35 Z"
          fill="var(--text-primary)"
          stroke="none"
        />
      </svg>
    </div>
  );
}
