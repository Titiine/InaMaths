import type { AvatarConfig, AvatarType } from '../types'
import {
  renderEyes,
  renderMouth,
  renderAccessory,
  renderHead,
  renderBelly,
  renderLegsClothes,
  resolveBodyColor,
} from './avatarParts'

const STROKE = '#2d2a4a'

// Forme de la tête selon le type d'avatar (centrée autour de (100, 82)).
function HeadShape({ type, color }: { type: AvatarType; color: string }) {
  switch (type) {
    case 'robot':
      return <rect x={52} y={40} width={96} height={90} rx={16} fill={color} stroke={STROKE} strokeWidth={4} />
    case 'monster':
      return (
        <path
          d="M 50 88 Q 44 40 100 38 Q 156 40 150 88 Q 152 130 100 132 Q 48 130 50 88 Z"
          fill={color}
          stroke={STROKE}
          strokeWidth={4}
          strokeLinejoin="round"
        />
      )
    case 'animal':
    case 'human':
    default:
      return <circle cx={100} cy={84} r={48} fill={color} stroke={STROKE} strokeWidth={4} />
  }
}

// Petit museau pour les animaux.
function Snout({ type }: { type: AvatarType }) {
  if (type !== 'animal') return null
  return (
    <g>
      <ellipse cx={100} cy={104} rx={20} ry={15} fill="#ffe0e9" stroke={STROKE} strokeWidth={2} />
      <ellipse cx={100} cy={98} rx={5} ry={4} fill={STROKE} />
    </g>
  )
}

export function Avatar({ config, size = 220 }: { config: AvatarConfig; size?: number }) {
  const body = resolveBodyColor(config.bodyColor)
  const hasBellyClothes = !!config.clothes.belly
  const hasLegsClothes = !!config.clothes.legs

  return (
    <svg
      viewBox="0 0 200 250"
      width={size}
      height={size * 1.25}
      role="img"
      aria-label="avatar"
      style={{ display: 'block', maxWidth: '100%' }}
    >
      {/* Jambes (dessinées avant le torse) */}
      {!hasLegsClothes && (
        <g>
          <rect x={73} y={200} width={22} height={34} rx={9} fill={body} stroke={STROKE} strokeWidth={4} />
          <rect x={105} y={200} width={22} height={34} rx={9} fill={body} stroke={STROKE} strokeWidth={4} />
          <ellipse cx={84} cy={238} rx={15} ry={8} fill={body} stroke={STROKE} strokeWidth={4} />
          <ellipse cx={116} cy={238} rx={15} ry={8} fill={body} stroke={STROKE} strokeWidth={4} />
        </g>
      )}

      {/* Bras */}
      <ellipse cx={52} cy={172} rx={11} ry={26} fill={body} stroke={STROKE} strokeWidth={4} transform="rotate(12 52 172)" />
      <ellipse cx={148} cy={172} rx={11} ry={26} fill={body} stroke={STROKE} strokeWidth={4} transform="rotate(-12 148 172)" />

      {/* Torse / ventre */}
      {!hasBellyClothes && (
        <rect x={58} y={140} width={84} height={68} rx={26} fill={body} stroke={STROKE} strokeWidth={4} />
      )}

      {/* Accessoire (derrière la tête : cornes, oreilles, antenne, cheveux) */}
      {renderAccessory(config.accessory, config.type, body)}

      {/* Tête */}
      <HeadShape type={config.type} color={body} />
      <Snout type={config.type} />

      {/* Visage */}
      {renderEyes(config.eyes)}
      {renderMouth(config.mouth)}

      {/* Vêtements */}
      {renderLegsClothes(config.clothes.legs)}
      {renderBelly(config.clothes.belly)}
      {renderHead(config.clothes.head)}
    </svg>
  )
}
