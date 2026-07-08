// Génération des questions d'exercices (choix multiples, adaptés aux enfants).

export type ShapeId = 'circle' | 'square' | 'triangle' | 'rectangle' | 'star' | 'heart'
export type MathOp = 'addition' | 'subtraction' | 'multiplication' | 'division'

export interface Question {
  kind: 'math' | 'shape'
  // Maths
  promptText?: string
  // Formes
  shape?: ShapeId
  // Réponse correcte (valeur en chaîne) + 4 choix
  answer: string
  choices: string[]
  op?: MathOp
}

const QUESTIONS_PER_SET = 5

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// --- Maths --------------------------------------------------------------

function opsForLevel(level: number): MathOp[] {
  if (level <= 1) return ['addition', 'subtraction']
  if (level === 2) return ['addition', 'subtraction', 'multiplication']
  return ['addition', 'subtraction', 'multiplication', 'division']
}

function makeMathQuestion(level: number): Question {
  const op = pick(opsForLevel(level))
  let a: number
  let b: number
  let answer: number
  let symbol: string

  switch (op) {
    case 'addition': {
      const max = level === 1 ? 20 : level === 2 ? 50 : 100
      a = randInt(1, max)
      b = randInt(1, max)
      answer = a + b
      symbol = '+'
      break
    }
    case 'subtraction': {
      const max = level === 1 ? 20 : level === 2 ? 50 : 100
      a = randInt(1, max)
      b = randInt(1, a) // pas de résultat négatif
      answer = a - b
      symbol = '−'
      break
    }
    case 'multiplication': {
      const max = level === 2 ? 5 : 10
      a = randInt(2, max)
      b = randInt(2, 10)
      answer = a * b
      symbol = '×'
      break
    }
    case 'division':
    default: {
      b = randInt(2, 10)
      answer = randInt(2, 10)
      a = b * answer // division toujours juste
      symbol = '÷'
      break
    }
  }

  // Distracteurs proches de la réponse.
  const distractors = new Set<number>()
  let guard = 0
  while (distractors.size < 3 && guard < 50) {
    guard++
    const delta = randInt(1, Math.max(3, Math.round(answer * 0.25) + 2))
    const cand = Math.random() < 0.5 ? answer + delta : answer - delta
    if (cand >= 0 && cand !== answer) distractors.add(cand)
  }
  const choices = shuffle([answer, ...distractors].map(String))

  return {
    kind: 'math',
    op,
    promptText: `${a} ${symbol} ${b}`,
    answer: String(answer),
    choices,
  }
}

// --- Formes -------------------------------------------------------------

function shapesForLevel(level: number): ShapeId[] {
  if (level <= 1) return ['circle', 'square', 'triangle']
  if (level === 2) return ['circle', 'square', 'triangle', 'rectangle']
  return ['circle', 'square', 'triangle', 'rectangle', 'star', 'heart']
}

function makeShapeQuestion(level: number): Question {
  const pool = shapesForLevel(level)
  const answer = pick(pool)
  const others = shuffle(pool.filter((s) => s !== answer)).slice(0, 3)
  const choices = shuffle([answer, ...others])
  return {
    kind: 'shape',
    shape: answer,
    answer,
    choices,
  }
}

export function generateQuestions(kind: 'math' | 'shape', level: number): Question[] {
  const out: Question[] = []
  for (let i = 0; i < QUESTIONS_PER_SET; i++) {
    out.push(kind === 'math' ? makeMathQuestion(level) : makeShapeQuestion(level))
  }
  return out
}

export const SET_SIZE = QUESTIONS_PER_SET
