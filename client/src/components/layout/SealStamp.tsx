interface SealStampProps {
  size?: number;
}

export default function SealStamp({ size = 40 }: SealStampProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ flexShrink: 0 }}
    >
      <rect
        x="5" y="5" width="90" height="90" rx="8" ry="8"
        fill="none"
        stroke="var(--accent-crimson)"
        strokeWidth="3"
        opacity="0.8"
      />
      <rect
        x="12" y="12" width="76" height="76" rx="4" ry="4"
        fill="none"
        stroke="var(--accent-crimson)"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <text
        x="50" y="62"
        textAnchor="middle"
        fill="var(--accent-crimson)"
        fontFamily="'Noto Serif', serif"
        fontSize="36"
        fontWeight="bold"
        opacity="0.9"
      >
        LS
      </text>
    </svg>
  );
}
