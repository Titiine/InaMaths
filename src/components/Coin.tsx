export function Coin({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx={20} cy={20} r={18} fill="#ffd23f" stroke="#e0a500" strokeWidth={3} />
      <circle cx={20} cy={20} r={12} fill="#ffe58a" />
      <text x={20} y={26} textAnchor="middle" fontSize={16} fontWeight="bold" fill="#e0a500" fontFamily="Anton, sans-serif">
        €
      </text>
    </svg>
  )
}
