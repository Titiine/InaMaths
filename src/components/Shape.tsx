import type { ShapeId } from '../data/exercises'
import { Star } from './avatarParts'

const STROKE = '#2d2a4a'

export function Shape({ id, color = '#4d96ff', size = 140 }: { id: ShapeId; color?: string; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={id}>
      {id === 'circle' && <circle cx={50} cy={50} r={38} fill={color} stroke={STROKE} strokeWidth={4} />}
      {id === 'square' && <rect x={16} y={16} width={68} height={68} rx={4} fill={color} stroke={STROKE} strokeWidth={4} />}
      {id === 'triangle' && (
        <polygon points="50,12 88,86 12,86" fill={color} stroke={STROKE} strokeWidth={4} strokeLinejoin="round" />
      )}
      {id === 'rectangle' && <rect x={10} y={28} width={80} height={44} rx={4} fill={color} stroke={STROKE} strokeWidth={4} />}
      {id === 'star' && <Star cx={50} cy={52} r={40} fill={color} stroke={STROKE} />}
      {id === 'heart' && (
        <path
          d="M 50 84 C 12 56 18 22 42 30 C 48 32 50 38 50 40 C 50 38 52 32 58 30 C 82 22 88 56 50 84 Z"
          fill={color}
          stroke={STROKE}
          strokeWidth={4}
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}
