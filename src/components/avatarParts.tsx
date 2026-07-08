import type { ReactNode } from 'react'
import type { AvatarType } from '../types'
import { findOption } from '../data/catalog'

const STROKE = '#2d2a4a'
const WHITE = '#ffffff'

// ---------------------------------------------------------------------------
// YEUX  (placés sur la tête, centrés autour de (100, 82))
// ---------------------------------------------------------------------------
const EYE_L = 80
const EYE_R = 120
const EYE_Y = 82

export function renderEyes(id: string): ReactNode {
  const eyes = (content: (cx: number) => ReactNode) => (
    <g>
      {content(EYE_L)}
      {content(EYE_R)}
    </g>
  )

  switch (id) {
    case 'eyes_happy':
      return eyes((cx) => (
        <path
          key={cx}
          d={`M ${cx - 11} ${EYE_Y + 3} Q ${cx} ${EYE_Y - 12} ${cx + 11} ${EYE_Y + 3}`}
          fill="none"
          stroke={STROKE}
          strokeWidth={5}
          strokeLinecap="round"
        />
      ))
    case 'eyes_sleepy':
      return eyes((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={EYE_Y} r={12} fill={WHITE} stroke={STROKE} strokeWidth={3} />
          <path d={`M ${cx - 12} ${EYE_Y} A 12 12 0 0 1 ${cx + 12} ${EYE_Y} Z`} fill="#b7b3d6" />
          <circle cx={cx} cy={EYE_Y + 2} r={4} fill={STROKE} />
        </g>
      ))
    case 'eyes_star':
      return eyes((cx) => <Star key={cx} cx={cx} cy={EYE_Y} r={13} fill="#ffd23f" stroke={STROKE} />)
    case 'eyes_angry':
      return eyes((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={EYE_Y + 2} r={11} fill={WHITE} stroke={STROKE} strokeWidth={3} />
          <circle cx={cx} cy={EYE_Y + 3} r={5} fill={STROKE} />
          <path
            d={`M ${cx - 13} ${EYE_Y - 12} L ${cx + 11} ${EYE_Y - 4}`}
            stroke={STROKE}
            strokeWidth={5}
            strokeLinecap="round"
          />
        </g>
      ))
    case 'eyes_cute':
      return eyes((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy={EYE_Y} rx={12} ry={15} fill={WHITE} stroke={STROKE} strokeWidth={3} />
          <circle cx={cx} cy={EYE_Y + 3} r={8} fill={STROKE} />
          <circle cx={cx + 3} cy={EYE_Y - 2} r={3} fill={WHITE} />
        </g>
      ))
    case 'eyes_round':
    default:
      return eyes((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={EYE_Y} r={13} fill={WHITE} stroke={STROKE} strokeWidth={3} />
          <circle cx={cx} cy={EYE_Y} r={6} fill={STROKE} />
        </g>
      ))
  }
}

// ---------------------------------------------------------------------------
// BOUCHE (centrée autour de (100, 112))
// ---------------------------------------------------------------------------
const MOUTH_Y = 112

export function renderMouth(id: string): ReactNode {
  switch (id) {
    case 'mouth_open':
      return (
        <g>
          <ellipse cx={100} cy={MOUTH_Y} rx={16} ry={12} fill="#8a2d4a" stroke={STROKE} strokeWidth={3} />
          <ellipse cx={100} cy={MOUTH_Y + 6} rx={9} ry={6} fill="#ef476f" />
        </g>
      )
    case 'mouth_teeth':
      return (
        <g>
          <path
            d={`M 82 ${MOUTH_Y - 6} Q 100 ${MOUTH_Y + 14} 118 ${MOUTH_Y - 6} Z`}
            fill="#8a2d4a"
            stroke={STROKE}
            strokeWidth={3}
          />
          <path d={`M 88 ${MOUTH_Y - 4} L 92 ${MOUTH_Y + 3} L 96 ${MOUTH_Y - 4} Z`} fill={WHITE} />
          <path d={`M 100 ${MOUTH_Y - 4} L 104 ${MOUTH_Y + 3} L 108 ${MOUTH_Y - 4} Z`} fill={WHITE} />
        </g>
      )
    case 'mouth_tongue':
      return (
        <g>
          <path
            d={`M 84 ${MOUTH_Y - 4} Q 100 ${MOUTH_Y + 10} 116 ${MOUTH_Y - 4}`}
            fill="none"
            stroke={STROKE}
            strokeWidth={5}
            strokeLinecap="round"
          />
          <ellipse cx={100} cy={MOUTH_Y + 6} rx={7} ry={6} fill="#ef476f" stroke={STROKE} strokeWidth={2} />
        </g>
      )
    case 'mouth_neutral':
      return (
        <line
          x1={86}
          y1={MOUTH_Y + 2}
          x2={114}
          y2={MOUTH_Y + 2}
          stroke={STROKE}
          strokeWidth={5}
          strokeLinecap="round"
        />
      )
    case 'mouth_smile':
    default:
      return (
        <path
          d={`M 82 ${MOUTH_Y - 4} Q 100 ${MOUTH_Y + 16} 118 ${MOUTH_Y - 4}`}
          fill="none"
          stroke={STROKE}
          strokeWidth={5}
          strokeLinecap="round"
        />
      )
  }
}

// ---------------------------------------------------------------------------
// ACCESSOIRE — dépend du type d'avatar
//   monstre = cornes / humain = cheveux / animal = oreilles / robot = antenne
// ---------------------------------------------------------------------------
export function renderAccessory(id: string | null, type: AvatarType, bodyColor: string): ReactNode {
  if (!id) return null
  const variant = id === 'accessory_b' ? 1 : id === 'accessory_c' ? 2 : 0

  if (type === 'monster') {
    const size = [0, 4, 8][variant]
    const horn = (x: number, dir: number) => (
      <path
        d={`M ${x} 42 L ${x + dir * (10 + size)} ${8 - size} L ${x + dir * (20 + size)} 44 Z`}
        fill="#ffd23f"
        stroke={STROKE}
        strokeWidth={3}
        strokeLinejoin="round"
      />
    )
    return (
      <g>
        {horn(74, -1)}
        {horn(126, 1)}
      </g>
    )
  }

  if (type === 'animal') {
    const ry = [22, 30, 16][variant]
    const rx = variant === 2 ? 20 : 14
    return (
      <g>
        <ellipse cx={70} cy={40} rx={rx} ry={ry} fill={bodyColor} stroke={STROKE} strokeWidth={3} />
        <ellipse cx={130} cy={40} rx={rx} ry={ry} fill={bodyColor} stroke={STROKE} strokeWidth={3} />
        <ellipse cx={70} cy={44} rx={rx * 0.5} ry={ry * 0.5} fill="#ffb3c6" />
        <ellipse cx={130} cy={44} rx={rx * 0.5} ry={ry * 0.5} fill="#ffb3c6" />
      </g>
    )
  }

  if (type === 'robot') {
    const y = [10, 2, 16][variant]
    return (
      <g>
        <line x1={100} y1={44} x2={100} y2={y + 8} stroke={STROKE} strokeWidth={4} />
        <circle cx={100} cy={y} r={9} fill="#ff6392" stroke={STROKE} strokeWidth={3} />
        <circle cx={100} cy={y} r={3} fill={WHITE} />
      </g>
    )
  }

  // human -> cheveux
  const colors = ['#5a3921', '#2d2a4a', '#c94b4b']
  const hair = colors[variant]
  return (
    <path
      d="M 52 66 Q 48 22 100 22 Q 152 22 148 66 Q 140 44 100 44 Q 60 44 52 66 Z"
      fill={hair}
      stroke={STROKE}
      strokeWidth={3}
      strokeLinejoin="round"
    />
  )
}

// ---------------------------------------------------------------------------
// VÊTEMENTS — TÊTE (chapeaux), posés vers y = 40
// ---------------------------------------------------------------------------
export function renderHead(id: string | null): ReactNode {
  if (!id) return null
  switch (id) {
    case 'head_cap':
      return (
        <g>
          <path d="M 60 50 Q 100 18 140 50 Z" fill="#ef476f" stroke={STROKE} strokeWidth={3} strokeLinejoin="round" />
          <path d="M 100 50 Q 150 48 156 58 Q 120 62 100 50 Z" fill="#c9184a" stroke={STROKE} strokeWidth={3} />
          <circle cx={100} cy={26} r={5} fill="#c9184a" />
        </g>
      )
    case 'head_crown':
      return (
        <path
          d="M 62 52 L 62 30 L 78 44 L 100 22 L 122 44 L 138 30 L 138 52 Z"
          fill="#ffd23f"
          stroke={STROKE}
          strokeWidth={3}
          strokeLinejoin="round"
        />
      )
    case 'head_wizard':
      return (
        <g>
          <path d="M 100 4 L 128 54 L 72 54 Z" fill="#6c5ce7" stroke={STROKE} strokeWidth={3} strokeLinejoin="round" />
          <path d="M 66 54 Q 100 44 134 54 Q 100 64 66 54 Z" fill="#5a4bd4" stroke={STROKE} strokeWidth={3} />
          <Star cx={100} cy={30} r={7} fill="#ffd23f" stroke={STROKE} />
        </g>
      )
    case 'head_bow':
      return (
        <g>
          <path d="M 100 44 L 74 32 L 74 56 Z" fill="#ff6392" stroke={STROKE} strokeWidth={3} strokeLinejoin="round" />
          <path d="M 100 44 L 126 32 L 126 56 Z" fill="#ff6392" stroke={STROKE} strokeWidth={3} strokeLinejoin="round" />
          <circle cx={100} cy={44} r={7} fill="#c9184a" stroke={STROKE} strokeWidth={2} />
        </g>
      )
    default:
      return null
  }
}

// ---------------------------------------------------------------------------
// VÊTEMENTS — VENTRE (hauts), sur le torse (y 138..205)
// ---------------------------------------------------------------------------
export function renderBelly(id: string | null): ReactNode {
  if (!id) return null
  switch (id) {
    case 'belly_tshirt':
      return (
        <path
          d="M 60 150 L 60 200 Q 100 210 140 200 L 140 150 Q 100 162 60 150 Z"
          fill="#4d96ff"
          stroke={STROKE}
          strokeWidth={3}
          strokeLinejoin="round"
        />
      )
    case 'belly_hoodie':
      return (
        <g>
          <path
            d="M 58 150 L 58 202 Q 100 212 142 202 L 142 150 Q 100 162 58 150 Z"
            fill="#ef476f"
            stroke={STROKE}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <line x1={100} y1={158} x2={100} y2={200} stroke={STROKE} strokeWidth={2} />
          <path d="M 84 152 Q 100 168 116 152" fill="none" stroke={STROKE} strokeWidth={3} />
        </g>
      )
    case 'belly_dress':
      return (
        <path
          d="M 66 150 Q 100 162 134 150 L 150 210 Q 100 224 50 210 Z"
          fill="#ff6392"
          stroke={STROKE}
          strokeWidth={3}
          strokeLinejoin="round"
        />
      )
    case 'belly_armor':
      return (
        <g>
          <path
            d="M 58 150 L 58 202 Q 100 212 142 202 L 142 150 Q 100 162 58 150 Z"
            fill="#adb5bd"
            stroke={STROKE}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <circle cx={100} cy={178} r={10} fill="#ffd23f" stroke={STROKE} strokeWidth={2} />
          <line x1={70} y1={168} x2={130} y2={168} stroke={STROKE} strokeWidth={2} />
        </g>
      )
    default:
      return null
  }
}

// ---------------------------------------------------------------------------
// VÊTEMENTS — JAMBES & PIEDS (bas + chaussures), sur les jambes (y 205..245)
// ---------------------------------------------------------------------------
export function renderLegsClothes(id: string | null): ReactNode {
  if (!id) return null
  const leg = (x: number, fill: string) => (
    <rect x={x - 11} y={205} width={22} height={30} rx={6} fill={fill} stroke={STROKE} strokeWidth={3} />
  )
  const shoe = (x: number, fill: string) => (
    <ellipse cx={x} cy={240} rx={15} ry={8} fill={fill} stroke={STROKE} strokeWidth={3} />
  )
  switch (id) {
    case 'legs_jeans':
      return (
        <g>
          {leg(84, '#3a5a8c')}
          {leg(116, '#3a5a8c')}
          {shoe(84, WHITE)}
          {shoe(116, WHITE)}
        </g>
      )
    case 'legs_shorts':
      return (
        <g>
          <rect x={73} y={205} width={22} height={18} rx={6} fill="#2ec4b6" stroke={STROKE} strokeWidth={3} />
          <rect x={105} y={205} width={22} height={18} rx={6} fill="#2ec4b6" stroke={STROKE} strokeWidth={3} />
          {shoe(84, '#ef476f')}
          {shoe(116, '#ef476f')}
        </g>
      )
    case 'legs_skirt':
      return (
        <g>
          <path d="M 72 205 L 128 205 L 138 226 L 62 226 Z" fill="#9b5de5" stroke={STROKE} strokeWidth={3} strokeLinejoin="round" />
          {shoe(84, '#ffd23f')}
          {shoe(116, '#ffd23f')}
        </g>
      )
    case 'legs_boots':
      return (
        <g>
          {leg(84, '#5a3921')}
          {leg(116, '#5a3921')}
          <ellipse cx={84} cy={240} rx={16} ry={9} fill="#3a2416" stroke={STROKE} strokeWidth={3} />
          <ellipse cx={116} cy={240} rx={16} ry={9} fill="#3a2416" stroke={STROKE} strokeWidth={3} />
        </g>
      )
    default:
      return null
  }
}

// ---------------------------------------------------------------------------
// Étoile utilitaire
// ---------------------------------------------------------------------------
export function Star({
  cx,
  cy,
  r,
  fill,
  stroke,
}: {
  cx: number
  cy: number
  r: number
  fill: string
  stroke?: string
}) {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const ang = (Math.PI / 5) * i - Math.PI / 2
    const rad = i % 2 === 0 ? r : r * 0.45
    pts.push(`${cx + rad * Math.cos(ang)},${cy + rad * Math.sin(ang)}`)
  }
  return <polygon points={pts.join(' ')} fill={fill} stroke={stroke} strokeWidth={stroke ? 2 : 0} strokeLinejoin="round" />
}

// Résout la couleur du corps à partir de l'id d'option.
export function resolveBodyColor(id: string): string {
  return findOption(id)?.color ?? '#57cc99'
}
