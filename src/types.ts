export type AvatarType = 'monster' | 'human' | 'animal' | 'robot'

// Catégories de pièces personnalisables.
export type PartCategory =
  | 'bodyColor'
  | 'eyes'
  | 'mouth'
  | 'accessory' // cornes (monstre) / oreilles (animal) / antenne (robot) / cheveux (humain)
  | 'head' // chapeau
  | 'belly' // haut
  | 'legs' // bas + chaussures

export interface AvatarConfig {
  type: AvatarType
  bodyColor: string // id d'une option de couleur
  eyes: string
  mouth: string
  accessory: string | null
  clothes: {
    head: string | null
    belly: string | null
    legs: string | null
  }
}

// Une option de pièce d'avatar.
export interface PartOption {
  id: string
  category: PartCategory
  price: number // 0 = gratuit (possédé d'office)
  // Pour la couleur du corps on stocke la valeur hexadécimale.
  color?: string
}

export interface GameState {
  coins: number
  ownedItems: string[] // ids des articles achetés (les gratuits ne sont pas listés)
  avatar: AvatarConfig
  // Historique de réponses par fait de multiplication, clé "aXb" -> [0|1, ...]
  // (le plus récent à la fin). Sert au suivi de maîtrise des tables.
  tableStats: Record<string, number[]>
}
