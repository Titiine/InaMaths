// Petite courbe de progression : nombre de tables « sues » jour après jour.
export function HistoryChart({
  data,
  max,
}: {
  data: { date: string; known: number }[]
  max: number
}) {
  const W = 300
  const H = 90
  const padX = 6
  const padY = 10

  const points = data.slice(-14) // 2 dernières semaines
  if (points.length === 0) return null

  const n = points.length
  const stepX = n > 1 ? (W - padX * 2) / (n - 1) : 0
  const scaleY = (v: number) => H - padY - (v / max) * (H - padY * 2)

  const coords = points.map((p, i) => ({
    x: padX + i * stepX,
    y: scaleY(p.known),
    known: p.known,
  }))

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${H - padY} L ${coords[0].x.toFixed(1)} ${H - padY} Z`
  const last = coords[coords.length - 1]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label="progression">
      <defs>
        <linearGradient id="histFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2fbf71" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#2fbf71" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#histFill)" />
      <path d={linePath} fill="none" stroke="#2fbf71" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
      {coords.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={i === coords.length - 1 ? 5 : 3} fill="#2fbf71" />
      ))}
      <text x={last.x} y={Math.max(12, last.y - 8)} textAnchor="end" fontSize="14" fontWeight="700" fill="#2fbf71">
        {last.known}
      </text>
    </svg>
  )
}
