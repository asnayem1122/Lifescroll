import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageWrapperProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}

const ease = [0.4, 0, 0.2, 1] as readonly [number, number, number, number];

const variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease,
      staggerChildren: 0.04,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease },
  },
};

export default function PageWrapper({ title, subtitle, children, action }: PageWrapperProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className="p-4 lg:p-6 space-y-6"
    >
      {(title || action) && (
        <motion.div variants={childVariants} className="flex items-start justify-between flex-wrap gap-4">
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
          {action && <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>{action}</motion.div>}
        </motion.div>
      )}
      {children}
    </motion.div>
  );
}
