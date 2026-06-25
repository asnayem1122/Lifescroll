import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, PieChart, Target, CheckSquare, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SealStamp from './SealStamp';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/reports', icon: PieChart, label: 'Reports' },
  { to: '/budget', icon: Target, label: 'Budget' },
  { to: '/habits', icon: CheckSquare, label: 'Habits' },
  { to: '/habit-stats', icon: PieChart, label: 'Habit Stats' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, logout } = useAuth();

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-[240px] z-50 transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3 p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <SealStamp size={36} />
          <span className="font-serif text-lg tracking-wider" style={{ color: 'var(--accent-gold)' }}>LIFESCROLL</span>
        </div>

        <nav className="p-3 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 rounded text-sm transition-all duration-200"
              style={({ isActive }) => ({
                color: isActive ? 'var(--accent-gold)' : '#444',
                background: isActive ? '#d4af3708' : 'transparent',
                borderLeft: isActive ? '3px solid #d4af37' : '3px solid transparent',
                minHeight: '44px',
              })}
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="text-xs mb-3" style={{ color: '#444' }}>
            {user?.name || 'User'}
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs"
            style={{ color: 'var(--accent-crimson)' }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
