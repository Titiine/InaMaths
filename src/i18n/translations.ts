// Système de traduction.
// Pour ajouter une langue : ajouter son code dans `LANGUAGES` puis compléter
// l'objet `translations` avec les mêmes clés que le français (`fr`).

export type LanguageCode = 'fr' | 'en'

export interface LanguageMeta {
  code: LanguageCode
  label: string
  flag: string
}

export const LANGUAGES: LanguageMeta[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
]

// Le français est la langue de référence : toutes les clés doivent y exister.
const fr = {
  appName: 'InaMaths',
  tagline: 'Apprends en jouant !',

  // Navigation / commun
  back: 'Retour',
  next: 'Suivant',
  validate: 'Valider',
  quit: 'Quitter',
  continue: 'Continuer',
  close: 'Fermer',
  coins: 'pièces',
  yourCoins: 'Tes pièces',

  // Accueil
  home_play: 'Jouer',
  home_shop: 'Boutique',
  home_avatar: 'Mon avatar',
  home_game: 'Mini-jeu',
  home_hello: 'Bonjour !',
  chooseLanguage: 'Choisir la langue',

  // Choix des exercices
  chooseLevel: 'Choisis ton niveau',
  chooseExercise: 'Choisis ton exercice',
  level: 'Niveau',
  level_1: 'Niveau 1',
  level_2: 'Niveau 2',
  level_3: 'Niveau 3',
  level_1_desc: 'Facile',
  level_2_desc: 'Moyen',
  level_3_desc: 'Difficile',
  exercise_math: 'Maths',
  exercise_math_desc: 'Additions, soustractions, multiplications et divisions (CE2)',
  exercise_shapes: 'Formes géométriques',
  exercise_shapes_desc: 'Reconnais les formes (CP)',

  // Exercice
  question: 'Question',
  correct: 'Bravo, c\'est juste !',
  wrong: 'Oups, ce n\'est pas ça...',
  yourAnswer: 'Ta réponse',
  whichShape: 'Quelle est cette forme ?',

  // Opérations mathématiques
  op_addition: 'Addition',
  op_subtraction: 'Soustraction',
  op_multiplication: 'Multiplication',
  op_division: 'Division',

  // Formes
  shape_circle: 'Cercle',
  shape_square: 'Carré',
  shape_triangle: 'Triangle',
  shape_rectangle: 'Rectangle',
  shape_star: 'Étoile',
  shape_heart: 'Cœur',

  // Résultats
  results_title: 'Résultat',
  results_score: 'Ton score',
  results_earned: 'Tu as gagné',
  results_perfect: 'Parfait ! Un sans-faute !',
  results_good: 'Bien joué !',
  results_tryAgain: 'Continue à t\'entraîner !',
  replay: 'Rejouer',

  // Boutique
  shop_title: 'Boutique',
  shop_buy: 'Acheter',
  shop_owned: 'Possédé',
  shop_notEnough: 'Pas assez de pièces !',
  shop_cat_bodyColor: 'Couleurs',
  shop_cat_eyes: 'Yeux',
  shop_cat_mouth: 'Bouches',
  shop_cat_accessory: 'Cornes / oreilles / cheveux',
  shop_cat_head: 'Chapeaux',
  shop_cat_belly: 'Hauts',
  shop_cat_legs: 'Bas & chaussures',

  // Avatar
  avatar_title: 'Personnalise ton avatar',
  avatar_type: 'Type d\'avatar',
  avatar_type_monster: 'Monstre',
  avatar_type_human: 'Humain',
  avatar_type_animal: 'Animal',
  avatar_type_robot: 'Robot',
  avatar_part_bodyColor: 'Couleur du corps',
  avatar_part_eyes: 'Yeux',
  avatar_part_mouth: 'Bouche',
  avatar_part_accessory_monster: 'Cornes',
  avatar_part_accessory_animal: 'Oreilles',
  avatar_part_accessory_robot: 'Antenne',
  avatar_part_accessory_human: 'Cheveux',
  avatar_zone_head: 'Tête',
  avatar_zone_belly: 'Ventre',
  avatar_zone_legs: 'Jambes & pieds',
  avatar_locked: 'À acheter dans la boutique',
  avatar_none: 'Aucun',

  // Mini-jeu
  game_title: 'Attrape-pièces',
  game_intro: 'Clique sur les pièces avant qu\'elles ne disparaissent ! Attention, si tu en rates trop, le jeu s\'arrête.',
  game_cost: 'Coût pour jouer',
  game_start: 'Commencer',
  game_lives: 'Vies',
  game_score: 'Pièces attrapées',
  game_over: 'Perdu ! Le jeu a disparu.',
  game_won: 'Gagné !',
  game_notEnough: 'Il te faut plus de pièces pour jouer.',
  game_timeLeft: 'Temps',
}

// Traduction anglaise (démarrée ; le français reste la version de travail).
const en: typeof fr = {
  appName: 'InaMaths',
  tagline: 'Learn while playing!',

  back: 'Back',
  next: 'Next',
  validate: 'Check',
  quit: 'Quit',
  continue: 'Continue',
  close: 'Close',
  coins: 'coins',
  yourCoins: 'Your coins',

  home_play: 'Play',
  home_shop: 'Shop',
  home_avatar: 'My avatar',
  home_game: 'Mini-game',
  home_hello: 'Hello!',
  chooseLanguage: 'Choose language',

  chooseLevel: 'Choose your level',
  chooseExercise: 'Choose your exercise',
  level: 'Level',
  level_1: 'Level 1',
  level_2: 'Level 2',
  level_3: 'Level 3',
  level_1_desc: 'Easy',
  level_2_desc: 'Medium',
  level_3_desc: 'Hard',
  exercise_math: 'Maths',
  exercise_math_desc: 'Addition, subtraction, multiplication and division',
  exercise_shapes: 'Shapes',
  exercise_shapes_desc: 'Recognise the shapes',

  question: 'Question',
  correct: 'Well done, correct!',
  wrong: 'Oops, that\'s not it...',
  yourAnswer: 'Your answer',
  whichShape: 'What is this shape?',

  op_addition: 'Addition',
  op_subtraction: 'Subtraction',
  op_multiplication: 'Multiplication',
  op_division: 'Division',

  shape_circle: 'Circle',
  shape_square: 'Square',
  shape_triangle: 'Triangle',
  shape_rectangle: 'Rectangle',
  shape_star: 'Star',
  shape_heart: 'Heart',

  results_title: 'Result',
  results_score: 'Your score',
  results_earned: 'You earned',
  results_perfect: 'Perfect! No mistakes!',
  results_good: 'Well played!',
  results_tryAgain: 'Keep practising!',
  replay: 'Play again',

  shop_title: 'Shop',
  shop_buy: 'Buy',
  shop_owned: 'Owned',
  shop_notEnough: 'Not enough coins!',
  shop_cat_bodyColor: 'Colors',
  shop_cat_eyes: 'Eyes',
  shop_cat_mouth: 'Mouths',
  shop_cat_accessory: 'Horns / ears / hair',
  shop_cat_head: 'Hats',
  shop_cat_belly: 'Tops',
  shop_cat_legs: 'Bottoms & shoes',

  avatar_title: 'Customise your avatar',
  avatar_type: 'Avatar type',
  avatar_type_monster: 'Monster',
  avatar_type_human: 'Human',
  avatar_type_animal: 'Animal',
  avatar_type_robot: 'Robot',
  avatar_part_bodyColor: 'Body color',
  avatar_part_eyes: 'Eyes',
  avatar_part_mouth: 'Mouth',
  avatar_part_accessory_monster: 'Horns',
  avatar_part_accessory_animal: 'Ears',
  avatar_part_accessory_robot: 'Antenna',
  avatar_part_accessory_human: 'Hair',
  avatar_zone_head: 'Head',
  avatar_zone_belly: 'Belly',
  avatar_zone_legs: 'Legs & feet',
  avatar_locked: 'Buy it in the shop',
  avatar_none: 'None',

  game_title: 'Coin Catcher',
  game_intro: 'Click the coins before they vanish! Careful: miss too many and the game stops.',
  game_cost: 'Cost to play',
  game_start: 'Start',
  game_lives: 'Lives',
  game_score: 'Coins caught',
  game_over: 'Lost! The game disappeared.',
  game_won: 'You won!',
  game_notEnough: 'You need more coins to play.',
  game_timeLeft: 'Time',
}

export type TranslationKey = keyof typeof fr

export const translations: Record<LanguageCode, Record<TranslationKey, string>> = {
  fr,
  en,
}
