import type { PartCategory, PartOption } from '../types'

// Catalogue de toutes les pièces d'avatar disponibles.
// price = 0  -> gratuit, possédé dès le départ.
// price > 0  -> à acheter dans la boutique avec des pièces.

export const BODY_COLORS: PartOption[] = [
  { id: 'color_green', category: 'bodyColor', price: 0, color: '#57cc99' },
  { id: 'color_blue', category: 'bodyColor', price: 0, color: '#4d96ff' },
  { id: 'color_purple', category: 'bodyColor', price: 10, color: '#9b5de5' },
  { id: 'color_orange', category: 'bodyColor', price: 10, color: '#ff8c42' },
  { id: 'color_pink', category: 'bodyColor', price: 15, color: '#ff6392' },
  { id: 'color_red', category: 'bodyColor', price: 15, color: '#ef476f' },
  { id: 'color_yellow', category: 'bodyColor', price: 20, color: '#ffd23f' },
  { id: 'color_teal', category: 'bodyColor', price: 20, color: '#2ec4b6' },
]

export const EYES: PartOption[] = [
  { id: 'eyes_round', category: 'eyes', price: 0 },
  { id: 'eyes_happy', category: 'eyes', price: 0 },
  { id: 'eyes_sleepy', category: 'eyes', price: 10 },
  { id: 'eyes_star', category: 'eyes', price: 20 },
  { id: 'eyes_angry', category: 'eyes', price: 15 },
  { id: 'eyes_cute', category: 'eyes', price: 20 },
]

export const MOUTHS: PartOption[] = [
  { id: 'mouth_smile', category: 'mouth', price: 0 },
  { id: 'mouth_open', category: 'mouth', price: 0 },
  { id: 'mouth_teeth', category: 'mouth', price: 15 },
  { id: 'mouth_tongue', category: 'mouth', price: 15 },
  { id: 'mouth_neutral', category: 'mouth', price: 10 },
]

// Accessoire du sommet du crâne (rendu variable selon le type d'avatar).
export const ACCESSORIES: PartOption[] = [
  { id: 'accessory_a', category: 'accessory', price: 0 },
  { id: 'accessory_b', category: 'accessory', price: 15 },
  { id: 'accessory_c', category: 'accessory', price: 25 },
]

// Vêtements — zone TÊTE (chapeaux).
export const HEAD_CLOTHES: PartOption[] = [
  { id: 'head_cap', category: 'head', price: 15 },
  { id: 'head_crown', category: 'head', price: 40 },
  { id: 'head_wizard', category: 'head', price: 30 },
  { id: 'head_bow', category: 'head', price: 20 },
]

// Vêtements — zone VENTRE (hauts).
export const BELLY_CLOTHES: PartOption[] = [
  { id: 'belly_tshirt', category: 'belly', price: 15 },
  { id: 'belly_hoodie', category: 'belly', price: 25 },
  { id: 'belly_dress', category: 'belly', price: 30 },
  { id: 'belly_armor', category: 'belly', price: 45 },
]

// Vêtements — zone JAMBES & PIEDS (bas + chaussures).
export const LEGS_CLOTHES: PartOption[] = [
  { id: 'legs_jeans', category: 'legs', price: 15 },
  { id: 'legs_shorts', category: 'legs', price: 20 },
  { id: 'legs_skirt', category: 'legs', price: 25 },
  { id: 'legs_boots', category: 'legs', price: 30 },
]

export const CATALOG: Record<PartCategory, PartOption[]> = {
  bodyColor: BODY_COLORS,
  eyes: EYES,
  mouth: MOUTHS,
  accessory: ACCESSORIES,
  head: HEAD_CLOTHES,
  belly: BELLY_CLOTHES,
  legs: LEGS_CLOTHES,
}

export const ALL_OPTIONS: PartOption[] = Object.values(CATALOG).flat()

export function findOption(id: string | null): PartOption | undefined {
  if (!id) return undefined
  return ALL_OPTIONS.find((o) => o.id === id)
}

// Nom lisible d'une pièce (les labels affichés viennent surtout de l'aperçu SVG,
// mais on garde un libellé court pour l'accessibilité).
export function optionShortLabel(id: string): string {
  return id.split('_').slice(1).join(' ')
}

// Catégories qui apparaissent dans la boutique, dans l'ordre.
export const SHOP_CATEGORIES: PartCategory[] = [
  'bodyColor',
  'eyes',
  'mouth',
  'accessory',
  'head',
  'belly',
  'legs',
]
