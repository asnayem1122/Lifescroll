import { motion } from 'framer-motion';

interface SealCheckboxProps {
  checked: boolean;
  onChange: () => void;
  loading?: boolean;
}

export default function SealCheckbox({ checked, onChange, loading }: SealCheckboxProps) {
  return (
    <motion.button
      onClick={onChange}
      disabled={loading}
      whileTap={{ scale: 0.85 }}
      animate={checked ? {
        scale: [1, 1.25, 1],
        borderColor: ['#8b0000', '#d4af37', '#d4af37'],
      } : {
        scale: 1,
        borderColor: '#333',
      }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0"
      style={{
        background: checked ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
        border: `2px solid ${checked ? '#d4af37' : '#333'}`,
        minWidth: '48px',
        minHeight: '48px',
      }}
    >
      {checked && (
        <motion.svg
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          width="24"
          height="24"
          viewBox="0 0 100 100"
        >
          <rect
            x="5" y="5" width="90" height="90" rx="8" ry="8"
            fill="none"
            stroke="#d4af37"
            strokeWidth="4"
          />
          <text
            x="50" y="65"
            textAnchor="middle"
            fill="#d4af37"
            fontFamily="'Noto Serif', serif"
            fontSize="40"
            fontWeight="bold"
          >
            ✓
          </text>
        </motion.svg>
      )}
    </motion.button>
  );
}
