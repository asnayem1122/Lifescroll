import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SealStamp from '../components/layout/SealStamp';
import { motion } from 'framer-motion';

export default function Login() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
    } catch (err) {
      const apiError = err as { response?: { data?: { error?: string } } };
      setError(apiError.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#080808' }}
    >
      <svg
        viewBox="0 0 1440 400"
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{ opacity: 0.06 }}
      >
        <path d="M0 300L180 180L360 250L540 120L720 200L900 80L1080 180L1260 100L1440 200L1440 400L0 400Z" fill="#0a0a2e" opacity="0.5" />
        <path d="M0 350L200 220L400 300L600 160L800 280L1000 140L1200 240L1400 180L1440 250L1440 400L0 400Z" fill="#0a0a2e" opacity="0.3" />
        <path d="M0 380L300 280L500 340L700 220L900 320L1100 200L1300 300L1440 260L1440 400L0 400Z" fill="#0a0a2e" opacity="0.2" />
      </svg>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <SealStamp size={64} />
          </div>
          <h1 className="font-serif text-2xl tracking-widest" style={{ color: 'var(--accent-gold)' }}>LIFESCROLL</h1>
          <p className="text-xs mt-2" style={{ color: '#444' }}>Your Personal Life OS</p>
        </div>

        <div className="card p-6" style={{ background: '#0f0f0f', border: '1px solid rgba(212,175,55,0.1)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  required={isRegister}
                  style={{ background: '#080808', border: '1px solid #222' }}
                />
              </div>
            )}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                style={{ background: '#080808', border: '1px solid #222' }}
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                style={{ background: '#080808', border: '1px solid #222' }}
              />
            </div>

            {error && (
              <p className="text-xs" style={{ color: 'var(--accent-crimson)' }}>{error}</p>
            )}

            <button
              type="submit"
              className="btn btn-gold w-full justify-center"
              disabled={loading}
            >
              {loading ? '...' : isRegister ? 'Begin Your Scroll' : 'Enter'}
            </button>
          </form>

          <p className="text-xs text-center mt-4" style={{ color: '#444' }}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="underline"
              style={{ color: 'var(--accent-gold)' }}
            >
              {isRegister ? 'Login' : 'Register'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
