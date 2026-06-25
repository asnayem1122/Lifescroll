import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import SealStamp from './SealStamp';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, toggle } = useTheme();

  return (
    <header
      className="fixed top-0 left-0 lg:left-[240px] right-0 h-14 z-30 flex items-center justify-between px-4 lg:px-6"
      style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2" style={{ color: 'var(--text-primary)', minWidth: '44px', minHeight: '44px' }}>
          <Menu size={20} />
        </button>
        <div className="lg:hidden">
          <SealStamp size={28} />
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
          style={{
            background: 'var(--accent-crimson)',
            color: '#e8e8e8',
            border: '2px solid rgba(192,57,43,0.6)',
            minWidth: '44px',
            minHeight: '44px',
          }}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </header>
  );
}
