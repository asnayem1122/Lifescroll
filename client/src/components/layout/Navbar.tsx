import { Menu, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import SealStamp from './SealStamp';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, toggle } = useTheme();

  return (
    <header
      className="h-14 flex items-center justify-between px-4 lg:px-6 flex-shrink-0"
      style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-3">
        <motion.button
          onClick={onMenuClick}
          className="lg:hidden p-2"
          style={{ color: 'var(--text-primary)', minWidth: '44px', minHeight: '44px' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Menu size={20} />
        </motion.button>
        <div className="lg:hidden">
          <SealStamp size={28} />
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <motion.button
          onClick={toggle}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: 'var(--accent-crimson)',
            color: '#e8e8e8',
            border: '2px solid rgba(192,57,43,0.6)',
            minWidth: '44px',
            minHeight: '44px',
          }}
          whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(139,0,0,0.4)' }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </motion.button>
      </div>
    </header>
  );
}
