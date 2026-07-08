import type { AvatarConfig, PartCategory } from '../types'
import { Avatar } from './Avatar'
import { findOption } from '../data/catalog'

// Construit une config d'avatar de prévisualisation en appliquant l'option
// donnée sur l'avatar courant.
export function previewConfig(base: AvatarConfig, category: PartCategory, optionId: string): AvatarConfig {
  switch (category) {
    case 'bodyColor':
      return { ...base, bodyColor: optionId }
    case 'eyes':
      return { ...base, eyes: optionId }
    case 'mouth':
      return { ...base, mouth: optionId }
    case 'accessory':
      return { ...base, accessory: optionId }
    case 'head':
      return { ...base, clothes: { ...base.clothes, head: optionId } }
    case 'belly':
      return { ...base, clothes: { ...base.clothes, belly: optionId } }
    case 'legs':
      return { ...base, clothes: { ...base.clothes, legs: optionId } }
  }
}

export function OptionPreview({
  base,
  category,
  optionId,
  size = 66,
}: {
  base: AvatarConfig
  category: PartCategory
  optionId: string
  size?: number
}) {
  if (category === 'bodyColor') {
    const color = findOption(optionId)?.color ?? '#57cc99'
    return <span className="swatch" style={{ background: color }} />
  }
  // Aperçu de l'avatar entier pour que les vêtements du ventre et des jambes
  // (situés sous la tête) soient bien visibles.
  return (
    <div style={{ height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Avatar config={previewConfig(base, category, optionId)} size={size * 0.78} />
    </div>
  )
}
