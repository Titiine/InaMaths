// Logique de suivi de maîtrise des tables de multiplication.
//
// On travaille les faits a × b avec a et b de 2 à 10 (les tables « qui comptent »).
// Pour chaque fait on garde l'historique des dernières réponses (0 = raté, 1 = juste),
// le plus récent à la fin. On en déduit :
//   - un STATUT   : su / fluctue / à travailler / nouveau
//   - une TENDANCE : en hausse / stable / en baisse
// et une SÉLECTION ADAPTATIVE qui privilégie les faits les moins sûrs.

export const MIN_FACTOR = 2
export const MAX_FACTOR = 10
export const FACTORS: number[] = Array.from(
  { length: MAX_FACTOR - MIN_FACTOR + 1 },
  (_, i) => MIN_FACTOR + i,
)

const HISTORY_CAP = 8

export type MasteryStatus = 'known' | 'fluctuating' | 'weak' | 'new'
export type Trend = 'up' | 'down' | 'flat'

export interface Fact {
  a: number
  b: number
}

export function factKey(a: number, b: number): string {
  return `${a}x${b}`
}

export function allFacts(): Fact[] {
  const facts: Fact[] = []
  for (const a of FACTORS) for (const b of FACTORS) facts.push({ a, b })
  return facts
}

// Ajoute une réponse à l'historique d'un fait (renvoie le nouvel historique borné).
export function pushResult(history: number[] | undefined, correct: boolean): number[] {
  const next = [...(history ?? []), correct ? 1 : 0]
  return next.slice(-HISTORY_CAP)
}

function avg(arr: number[]): number {
  if (arr.length === 0) return 0
  return arr.reduce((s, v) => s + v, 0) / arr.length
}

// Statut d'un fait à partir de son historique.
export function getStatus(history: number[] | undefined): MasteryStatus {
  if (!history || history.length === 0) return 'new'
  const recent = history.slice(-4)
  const ratio = avg(recent)
  const last = history[history.length - 1]

  // Su : bonnes réponses récentes et dernière juste.
  if (history.length >= 2 && ratio >= 0.75 && last === 1) return 'known'
  // À travailler : beaucoup d'erreurs récentes.
  if (ratio <= 0.25 || (ratio < 0.5 && last === 0)) return 'weak'
  // Sinon : connaissance instable.
  return 'fluctuating'
}

// Tendance : compare la 1re moitié de l'historique à la 2de.
export function getTrend(history: number[] | undefined): Trend {
  if (!history || history.length < 4) return 'flat'
  const mid = Math.floor(history.length / 2)
  const older = avg(history.slice(0, mid))
  const newer = avg(history.slice(mid))
  if (newer - older >= 0.25) return 'up'
  if (older - newer >= 0.25) return 'down'
  return 'flat'
}

// Poids de sélection selon le statut : on cible les faits les moins sûrs.
const STATUS_WEIGHT: Record<MasteryStatus, number> = {
  weak: 6,
  new: 5,
  fluctuating: 4,
  known: 1,
}

// Choisit `count` faits distincts, en privilégiant les moins maîtrisés,
// tout en évitant de répéter ceux déjà tirés dans la session (`exclude`).
export function pickAdaptiveFacts(
  stats: Record<string, number[]>,
  count: number,
  exclude: Set<string> = new Set(),
): Fact[] {
  const pool = allFacts().map((f) => {
    const key = factKey(f.a, f.b)
    const status = getStatus(stats[key])
    let weight = STATUS_WEIGHT[status]
    if (exclude.has(key)) weight *= 0.15
    return { fact: f, key, weight }
  })

  const chosen: Fact[] = []
  const used = new Set<string>()
  const n = Math.min(count, pool.length)

  for (let i = 0; i < n; i++) {
    const candidates = pool.filter((p) => !used.has(p.key))
    const total = candidates.reduce((s, p) => s + p.weight, 0)
    let r = Math.random() * total
    let picked = candidates[candidates.length - 1]
    for (const c of candidates) {
      r -= c.weight
      if (r <= 0) {
        picked = c
        break
      }
    }
    used.add(picked.key)
    chosen.push(picked.fact)
  }
  return chosen
}

export interface MasterySummary {
  known: number
  fluctuating: number
  weak: number
  new: number
  total: number
}

export function summarize(stats: Record<string, number[]>): MasterySummary {
  const summary: MasterySummary = { known: 0, fluctuating: 0, weak: 0, new: 0, total: 0 }
  for (const f of allFacts()) {
    const status = getStatus(stats[factKey(f.a, f.b)])
    summary[status]++
    summary.total++
  }
  return summary
}

// Faits prioritaires à revoir (à travailler puis fluctuants), triés du plus faible au moins faible.
export function priorityFacts(stats: Record<string, number[]>, max = 6): Fact[] {
  const scored = allFacts()
    .map((f) => {
      const history = stats[factKey(f.a, f.b)]
      const status = getStatus(history)
      const rank = status === 'weak' ? 0 : status === 'fluctuating' ? 1 : status === 'new' ? 2 : 3
      return { f, rank, ratio: avg((history ?? []).slice(-4)) }
    })
    .filter((s) => s.rank <= 1) // à travailler ou fluctuant
    .sort((a, b) => a.rank - b.rank || a.ratio - b.ratio)
  return scored.slice(0, max).map((s) => s.f)
}

// Couleurs du panorama (cohérentes avec le thème).
export const STATUS_COLOR: Record<MasteryStatus, string> = {
  known: '#2fbf71', // vert franc « c'est acquis »
  fluctuating: '#ff8c42', // orange
  weak: '#ef476f', // rouge
  new: '#d8d2f5', // gris-mauve clair
}
