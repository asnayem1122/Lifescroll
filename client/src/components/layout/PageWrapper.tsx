import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageWrapperProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}

export default function PageWrapper({ title, subtitle, children, action }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 lg:p-6 space-y-6"
    >
      {(title || action) && (
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            {title && (
              <h1
                className="font-serif text-2xl lg:text-3xl font-bold"
                style={{ background: 'linear-gradient(135deg, #e8e8e8, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </motion.div>
  );
}
