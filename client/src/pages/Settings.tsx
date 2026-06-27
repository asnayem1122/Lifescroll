import { Sun, Moon, User, Mail } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import BrushDivider from '../components/layout/BrushDivider';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <PageWrapper title="Settings" subtitle="Your scroll preferences">
      <div className="space-y-6 max-w-lg">
        <div className="card card-corners p-5">
          <h2 className="font-serif text-sm mb-4" style={{ color: 'var(--accent-gold)' }}>Account</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User size={16} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ color: 'var(--text-primary)' }}>{user?.name || 'User'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail size={16} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ color: 'var(--text-primary)' }}>{user?.email || '—'}</span>
            </div>
          </div>
        </div>

        <BrushDivider />

        <div className="card card-corners p-5">
          <h2 className="font-serif text-sm mb-4" style={{ color: 'var(--accent-gold)' }}>Appearance</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Theme</span>
            <button
              onClick={toggle}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{
                background: theme === 'dark' ? 'var(--accent-crimson)' : '#d4af37',
                border: `2px solid ${theme === 'dark' ? 'rgba(192,57,43,0.6)' : 'rgba(212,175,55,0.6)'}`,
                color: theme === 'dark' ? '#e8e8e8' : '#080808',
              }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
            Currently: {theme === 'dark' ? 'Dark (Sumi-e)' : 'Light (Washi)'}
          </p>
        </div>

        <BrushDivider />

        <div className="card card-corners p-5">
          <h2 className="font-serif text-sm mb-4" style={{ color: 'var(--accent-gold)' }}>About</h2>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Lifescroll v1.0.0<br />
            A personal life OS with a Japanese sumi-e aesthetic.<br />
            Track habits, budget, and transactions in one place.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
