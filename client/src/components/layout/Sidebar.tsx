import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, PieChart, Target, CheckSquare, Settings, LogOut, ChevronLeft } from 'lucide-react';
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
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar-collapsed') === 'true');
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleCollapse = () => {
    setCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  };

  const sidebarWidth = isMobile ? 220 : collapsed ? 64 : 220;

  return (
    <>
      {open && isMobile && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}
      <aside
        style={{
          position: isMobile ? 'fixed' : 'relative',
          width: `${sidebarWidth}px`,
          height: '100%',
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--border)',
          zIndex: 50,
          overflow: 'hidden',
          flexShrink: 0,
          transition: 'width 0.3s ease, transform 0.3s ease',
          transform: isMobile ? (open ? 'translateX(0)' : 'translateX(-100%)') : 'none',
        }}
      >
        <div className="flex items-center gap-1 p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 overflow-hidden flex-1">
            <SealStamp size={36} />
            <span
              style={{
                color: 'var(--accent-gold)',
                opacity: collapsed && !isMobile ? 0 : 1,
                transition: 'opacity 0.3s ease',
                whiteSpace: 'nowrap',
              }}
              className="font-serif text-lg tracking-wider"
            >
              LIFESCROLL
            </span>
          </div>
          <button
            onClick={toggleCollapse}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: 'var(--accent-crimson)',
              border: '2px solid rgba(192,57,43,0.6)',
              minWidth: '32px',
              minHeight: '32px',
              display: isMobile ? 'none' : 'flex',
            }}
          >
            <ChevronLeft
              size={16}
              style={{
                color: '#e8e8e8',
                transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = link.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(link.to);
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => { if (isMobile) onClose(); }}
                className="sidebar-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed && !isMobile ? 'center' : undefined,
                  gap: collapsed && !isMobile ? '0' : '12px',
                  padding: collapsed && !isMobile ? '10px 8px' : '10px 16px',
                  borderRadius: '4px',
                  color: isActive ? 'var(--accent-gold)' : '#666',
                  background: isActive ? '#d4af3708' : 'transparent',
                  borderLeft: isActive ? '3px solid #d4af37' : '3px solid transparent',
                  minHeight: '44px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: '14px',
                  textDecoration: 'none',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  textShadow: isActive ? '0 0 12px rgba(212,175,55,0.2)' : 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--accent-gold)';
                    e.currentTarget.style.background = '#d4af3708';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#666';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                <span
                  style={{
                    display: collapsed && !isMobile ? 'none' : 'inline',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {link.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              display: collapsed && !isMobile ? 'none' : 'block',
              fontSize: '12px',
              marginBottom: '12px',
              color: '#444',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user?.name || 'User'}
          </div>
          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed && !isMobile ? 'center' : undefined,
              gap: '8px',
              fontSize: '12px',
              color: 'var(--accent-crimson)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              width: collapsed && !isMobile ? '100%' : 'auto',
              padding: collapsed && !isMobile ? '8px 0' : '0',
            }}
          >
            <LogOut size={14} />
            <span style={{ display: collapsed && !isMobile ? 'none' : 'inline' }}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
