import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function InkSplashTransition() {
  const location = useLocation();
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    setDisplay(true);
    const timer = setTimeout(() => setDisplay(false), 900); // slightly longer than the anim times to be safe
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!display) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{
          scale: [0, 1.6, 1.6],
          opacity: [1, 1, 0],
        }}
        transition={{
          duration: 0.8,
          times: [0, 0.45, 1],
          ease: 'easeInOut',
        }}
        className="w-[150vmax] h-[150vmax] rounded-full bg-[#080808]"
        style={{
          filter: 'url(#ink-bleed)',
        }}
      />
    </div>
  );
}
