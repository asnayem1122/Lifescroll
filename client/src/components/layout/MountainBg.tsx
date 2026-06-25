import { useTheme } from '../../context/ThemeContext';

export default function MountainBg() {
  const { theme } = useTheme();
  const opacity = theme === 'dark' ? '0.06' : '0.08';
  const color = theme === 'dark' ? '#121212' : '#111111';

  return (
    <div className="fixed bottom-0 left-0 w-full pointer-events-none z-[1]" style={{ opacity: parseFloat(opacity) }}>
      <svg viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax meet" className="w-full h-[300px]">
        <path d="M0 300L180 180L360 250L540 120L720 200L900 80L1080 180L1260 100L1440 200L1440 400L0 400Z"
          fill={color} opacity="0.5" />
        <path d="M0 350L200 220L400 300L600 160L800 280L1000 140L1200 240L1400 180L1440 250L1440 400L0 400Z"
          fill={color} opacity="0.3" />
        <path d="M0 380L300 280L500 340L700 220L900 320L1100 200L1300 300L1440 260L1440 400L0 400Z"
          fill={color} opacity="0.2" />
      </svg>
    </div>
  );
}
