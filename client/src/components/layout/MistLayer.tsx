export default function MistLayer() {
  return (
    <div className="fixed bottom-0 left-0 w-full h-[200px] pointer-events-none z-0 overflow-hidden">
      <div
        className="absolute bottom-0 left-0 w-[120%] h-[120px] opacity-30"
        style={{
          background: 'linear-gradient(0deg, var(--mist) 0%, transparent 100%)',
          animation: 'mistDrift1 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-0 left-[-10%] w-[130%] h-[100px] opacity-20"
        style={{
          background: 'linear-gradient(0deg, var(--fog-1) 0%, transparent 100%)',
          animation: 'mistDrift2 12s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-0 left-[-20%] w-[140%] h-[80px] opacity-15"
        style={{
          background: 'linear-gradient(0deg, var(--fog-2) 0%, transparent 100%)',
          animation: 'mistDrift3 15s ease-in-out infinite',
        }}
      />
    </div>
  );
}
