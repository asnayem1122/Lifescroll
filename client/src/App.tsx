import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Budget from './pages/Budget';
import Habits from './pages/Habits';
import HabitStats from './pages/HabitStats';
import Settings from './pages/Settings';

import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import MistLayer from './components/layout/MistLayer';
import MountainBg from './components/layout/MountainBg';
import InkSplashTransition from './components/layout/InkSplashTransition';
import InkParticles from './components/layout/InkParticles';

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <MistLayer />
      <MountainBg />
      <main className="pt-14 lg:pl-[240px] relative z-10">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080808' }}>
        <div className="text-center">
          <div
            className="w-10 h-10 rounded-full border-2 mx-auto mb-3"
            style={{
              borderColor: '#222',
              borderTopColor: 'var(--accent-gold)',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p className="text-xs" style={{ color: '#444' }}>Unfolding the scroll...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <ProtectedLayout>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/habit-stats" element={<HabitStats />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ProtectedLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <InkParticles />
          <InkSplashTransition />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#0f0f0f',
                color: '#e8e8e8',
                border: '1px solid #d4af37',
                borderRadius: '4px',
                fontSize: '13px',
              },
            }}
          />
          {/* Global SVG Filters for Sumi-e Ink effects */}
          <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
            <defs>
              <filter id="ink-bleed">
                <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" xChannelSelector="R" yChannelSelector="G" />
              </filter>
              <filter id="ink-brush-edge">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
          </svg>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
